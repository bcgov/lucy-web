/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Component, OnInit, AfterViewInit, Input, Output , EventEmitter, AfterViewChecked } from '@angular/core';
import 'node_modules/leaflet/';
import 'node_modules/leaflet.markercluster';
import 'node_modules/leaflet-draw';
import { Observation } from 'src/app/models';
import * as bcgeojson from './bcgeojson.json';
import { Point, LatLng } from 'leaflet';
import { LabelOptions } from '@angular/material';
import { LatLongCoordinate } from 'src/app/services/coordinateConversion/location.service';
import { BcDataCatalogueService } from 'src/app/services/bcDataCatalogue/bcDataCatalogue.service';
const haversine = require('haversine-distance');
declare let L;

export interface MapPreviewPoint {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface MapMarker {
  latitude: number;
  longitude: number;
  observation?: Observation;
}

@Component({
  selector: 'app-map-preview',
  templateUrl: './map-preview.component.html',
  styleUrls: ['./map-preview.component.css']
})

export class MapPreviewComponent implements OnInit, AfterViewInit, AfterViewChecked {

  // Map reference
  private map?;
  // Single marker color
  private markerColor = '#F3B229';
  // Used when cluser === true
  private clusterMarkers = L.markerClusterGroup();
  // used when cluser !== true
  private markerGroup?;
  // flag set after viewChecked.
  private ready = false;
  // list of points in LatLng format, so they're Leaflet-compatible
  private pointsLatLng: number[][] = [];
  // list of points in polygon, in LatLng format, so they're Leaflet-compatible
  private polygonLatLng: number[][] = [];
  // Leaflet Feature objects drawn on map
  private leafletFeatures?: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };
  private leafletDrawLayerGroup?;
  // list of Leaflet layer group for displaying GeoJSON data pulled from BC Data Catalogue
  private bcDataCatalogueLayerGroups = [];

  // Group close markers or always show individually
  @Input() cluster = true;

  /**
   * Used to generate a unique map id
   * for the HTML element.
   * this allows us to have multiple maps
   * on the same page
   *
   */
  get mapId(): string {
    if (!this._mapId) {
      this._mapId = this.makeid(5);
    }
    return this._mapId;
  }
  private _mapId: string;

  ////////////// CENTER POINT //////////////
  private _center: MapPreviewPoint;
  // get
  get center(): MapPreviewPoint {
    if (!this._center) {
      this._center = {
        latitude: 52.068508,
        longitude: -123.288152,
        zoom: 4
      };
    }
    return this._center;
  }
  // set
  @Input() set center(model: MapPreviewPoint) {
    if (!model) {
      console.log(`Invalid point`);
      return;
    }
    this._center = model;
    if (this.ready ) {
      this.showMapAtCenter();
    }
  }
  //////////////////////////////////////////////

  ////////////// Markers //////////////
  private _markers: MapMarker[] = [];
  // get
  get markers(): MapMarker[] {
    return this._markers;
  }
  // set
  @Input() set markers(locations: MapMarker[]) {
    this._markers = locations;
    if (this.ready) {
      this.addMarkers();
    }
  }

  ///////////// Line Points /////////////
  _points: LatLongCoordinate[] = [];
  get points(): LatLongCoordinate[] {
    return this._points;
  }
  @Input() set points(input: LatLongCoordinate[]) {
    this._points = input;

    // convert each point in this._points from LatLongCoordinate to LatLng,
    // push the converted point to pointsLatLng so it can be used by Leaflet
    this.pointsLatLng = [];
    for (const p of this._points) {
      this.pointsLatLng.push([p.latitude, p.longitude]);
    }
    if (this.ready) {
      this.drawLine();
      this.drawPoints();
    }
  }

  /////////////// Polygon ////////////////
  _polygon: LatLongCoordinate[] = [];
  get polygon(): LatLongCoordinate[] {
    return this._polygon;
  }
  @Input() set polygon(coordinates: LatLongCoordinate[]) {
    this._polygon = coordinates;

    // convert each point in this._polygon from LatLongCoordinate to LatLng,
    // push the converted point to polygonLatLng so it can be used by Leaflet
    this.polygonLatLng = [];
    for (const p of this._polygon) {
      this.polygonLatLng.push([p.latitude, p.longitude]);
    }
    if (this.ready) {
      this.drawPolygon();
    }
  }

  //////////////// Offset ////////////////////
  private _offset: number;
  get offset(): number {
    return this._offset;
  }
  @Input() set offset(value: number) {
    this._offset = value;
    if (this.ready) {
      this.drawPolygon();
    }
  }

  /////////////// GeoJSON file ////////////
  private _inputGeometryJSON: any;
  get inputGeometryJSON(): any {
    return this._inputGeometryJSON;
  }
  @Input() set inputGeometryJSON(object: any) {
    let json = '{}';
    // if object is a spaceGeom object (from location-input.component)
    if (object['spaceGeom'] !== undefined && object['spaceGeom']['value'] !== undefined && object['spaceGeom']['value']['inputGeometry'] !== undefined) {
      json = object['spaceGeom']['value']['inputGeometry']['geoJSON'];
    } else if (object['type'] === `FeatureCollection`) { // if object is a GeoJSON
      json = object;
    }
    this._inputGeometryJSON = json;
    if (this.ready && this._inputGeometryJSON !== '{}') {
      let point: any;
      for (const feature of this.inputGeometryJSON['features']) {
        if (feature['geometry']['type'] === 'Point') {
          point = feature;
          break;
        }
      }
      this.addGeoJSONtoMap();
    }
  }

  @Output() inputGeometryChanged = new EventEmitter<any>();

  //////////////////////////////////////////////

  @Output() centerPointChanged = new EventEmitter<MapPreviewPoint>();

  ////////////// Class Functions //////////////
  constructor(private bcDataCatalogueService: BcDataCatalogueService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (!this.center) {
      this.initMapAt(this.defaultPoint());
    } else {
      this.showMapAtCenter();
    }
  }

  ngAfterViewChecked() {
    if (!this.ready) {
      this.ready = true;
      if (!this.center) {
        this.initMapAt(this.defaultPoint());
      } else {
        this.showMapAtCenter();
      }
      this.addMarkers();
      if (this.polygon.length > 0) {
        this.drawPolygon();
      } else if (this.inputGeometryJSON !== '{}') {
        this.addGeoJSONtoMap();
      }
    }
  }
  //////////////////////////////////////////////

  ////////////// Initialization //////////////
  /**
   * Initialize map and set view to specfied point.
   * Ignores request if map has been initialized already.
   * @param center MapPreviewPoint
   */
  private initMapAt(center: MapPreviewPoint) {
    if (this.map) { return; }
    this.map = L.map(this.mapId).setView([center.latitude, center.latitude], center.zoom);
    this.markerGroup = L.layerGroup().addTo(this.map);
    this.leafletDrawLayerGroup = L.layerGroup().addTo(this.map);
    this.initMapWithGoogleSatellite();
    // this.initWithOpenStreet();
    this.map.on('zoom', () => {
      if (this.map.getZoom() >= 16) {
        this.addWellsLayerToMap(this.map.getBounds());
      } else if (this.bcDataCatalogueLayerGroups.length === 3) {
        // if user has zoomed out and wells layer has been added, it should now be removed
        // TODO fix this - current solution is very janky. Is based on the assumption that the
        // wells layer is at the end of the list of layer groups, but that may not be true
        // with future features added.
        // Probably need dictionary of layer groups with labels for
        // each layer and booleans to toggle layer visibility
        this.removeLastLayerFromMap();
      }
      this.addBcDataCatalogueLayersToMap();
    });
  }

  private initWithOpenStreet() {
    // Use Open street tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      preferCanvas: true,
      key: this.makeid(10),
      minZoom: 4,
    }).addTo(this.map);
    this.addBCBorder();
    this.addGeoJSONtoMap();
  }

  private initMapWithGoogleSatellite() {
    // Use Google tiles
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      // attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'.
      preferCanvas: true,
      key: this.makeid(10)
    }).addTo(this.map);
    this.addBCBorder();
    this.addBcDataCatalogueLayersToMap();
    this.addGeoJSONtoMap();
  }

  private async addBcDataCatalogueLayersToMap() {
    this.addRegionalDistrictsLayerToMap();
    this.addMunicipalitiesLayerToMap();
    this.addLayerGroupsToMap();
  }

  private addLayerGroupsToMap() {
    for (const layer of this.bcDataCatalogueLayerGroups) {
      layer.addTo(this.map);
    }
  }

  private async addMunicipalitiesLayerToMap() {
    const municipalitiesLayerGroup = L.layerGroup();
    const municipalitiesGeoJSON = await this.bcDataCatalogueService.getMunicipalitiesDataLayer();
    L.geoJSON(municipalitiesGeoJSON, {
      style: {
        color: '#fcec03',
        weight: 1,
        fillOpacity: 0,
      }
    })
    .bindTooltip(function (feature) {
      return `${feature.feature.properties.ADMIN_AREA_NAME}`;
    }).addTo(municipalitiesLayerGroup);
    this.bcDataCatalogueLayerGroups.push(municipalitiesLayerGroup);
  }

  private async addRegionalDistrictsLayerToMap() {
    const regionalDistrictsLayerGroup = L.layerGroup();
    const regionalDistrictsGeoJSON = await this.bcDataCatalogueService.getRegionalDistrictsDataLayer();
    L.geoJSON(regionalDistrictsGeoJSON, {
      style: {
        color: '#03fc07',
        weight: 1,
        fillOpacity: 0,
      }
    })
    .bindTooltip(function (feature) {
      return `${feature.feature.properties.DISTRICT_NAME}`;
    }).addTo(regionalDistrictsLayerGroup);
    this.bcDataCatalogueLayerGroups.push(regionalDistrictsLayerGroup);
  }

  private async addWellsLayerToMap(bbox: number[]) {
    const wellsLayerGroup = L.layerGroup();
    const wellsGeoJSON = await this.bcDataCatalogueService.getWellsDataLayer(bbox);
    L.geoJSON(wellsGeoJSON, {
      style: function(feature) {
        switch (feature.geometry.type) {
          case 'Point': return {
            color: '#03e3fc',
          };
        }
      }
    }).addTo(wellsLayerGroup);
    this.bcDataCatalogueLayerGroups.push(wellsLayerGroup);
  }

  private removeLastLayerFromMap() {
    this.bcDataCatalogueLayerGroups.splice(this.bcDataCatalogueLayerGroups.length - 1, 1);
  }

  private addGeoJSONtoMap() {
    if (this.inputGeometryJSON !== undefined && this.inputGeometryJSON !== '{}') {
      let point: any;
      for (const feature of this.inputGeometryJSON['features']) {
        if (feature['geometry']['type'] === 'Point') {
          point = feature;
          break;
        }
      }
      L.geoJSON(this.inputGeometryJSON, {
        // pointToLayer necessary because otherwise Leaflet overrides geoJSON Point styling with pin markers
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {radius: 0.5, color: 'black', fillColor: 'black', fill: true});
        },
        style: function(feature) {
          switch (feature.geometry.type) {
            case 'Polygon': return {
              color: '#F5A623',
              fillColor: '#F5A623',
              fillOpacity: 0.7,
              weight: 2,
            };
            case 'MultiLineString': return {
              color: 'black',
              weight: 1,
              fillOpacity: 0.4,
            };
          }
        }
      }).bindTooltip(function (layer) {
        switch (layer.feature.geometry.type) {
          case 'Polygon': return `<html>Offset: ${layer.feature.properties.offset}m<br>
              Area: ${layer.feature.properties.area.toFixed(1)}m²<br>
              Length: ${layer.feature.properties.length.toFixed(1)}m</html>`;
          case 'Point': return `<html>${layer.feature.geometry.coordinates[1]}, ${layer.feature.geometry.coordinates[0]}</html>`;
        }
      })
      .addTo(this.map);
      this.center = {latitude: point['geometry']['coordinates'][1], longitude: point['geometry']['coordinates'][0], zoom: 18};
      this.showMapAtCenter();
    }
  }

  private makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

  private defaultPoint(): MapPreviewPoint {
    return {
      latitude: 60.229,
      longitude: -127.178,
      zoom: 5
    };
  }

  private addBCBorder() {
    // Show bc border:
    // L.geoJSON(this.bc).addTo(this.map);
    // Show bc border and gray out everything outside:
    this.addInvertedPolygon(this.bcBorderCoordinates);
  }

  pointsChanged(points: LatLongCoordinate[]) {
    this._points = points;
    // convert each point in this._points from LatLongCoordinate to LatLng,
    // push the converted point to pointsLatLng so it can be used by Leaflet
    this.pointsLatLng = [];
    for (const p of this._points) {
      this.pointsLatLng.push([p.latitude, p.longitude]);
    }
    if (this.ready) {
      this.drawLine();
      this.drawPoints();
    }
  }
  /////////////////////////////////////////////


  ////////////// Navigation //////////////
  /**
   * If map has not been initialized,
   * navigate to specified point.
   * Otherwise navigate to current center point.
   */
  private showMapAtCenter() {
    if (!this.center) { return; }
    if (!this.map) {
      this.initMapAt(this.center);
    } else {
      this.showMapAt(this.center);
    }
  }

  /**
   * Navigate map to specified point
   * @param center MapPreviewPoint
   */
  private showMapAt(center: MapPreviewPoint) {
    if (!center || !center.latitude || !center.longitude) {
      console.log('invalid coordinates');
      return;
    }
    this.map.setView(new L.LatLng(center.latitude, center.longitude), center.zoom);
  }
  //////////////////////////////////////////////

  ////////////// Markers //////////////
  /**
   * Remove all existing markers
   * and add all markers in this.markers
   */
  private addMarkers() {
    if (this.cluster) {
      this.clusterMarkers.clearLayers();
      this.addClusteringMarkers();
    } else {
      this.clearMarkers();
      this.markers.forEach((element) => {
        if (element.latitude && element.longitude) {
          this.addMapMarkerAt(element.latitude, element.longitude);
        }
      });
    }
  }

 /**
   * Add Markers that cluster together.
   */
  private addClusteringMarkers() {
    // https://github.com/Leaflet/Leaflet.markercluster
    this.markers.forEach((element) => {
      if (element.observation) {
        // Marker with popup
        const popupInfo = '<span>' + element.observation.species.commonName + '</span>';
        const marker = L.circleMarker([element.latitude, element.longitude], {
          color: this.markerColor,
        }).bindPopup(popupInfo);
        this.clusterMarkers.addLayer(marker);
      } else {
        // Marker with no popup
        const marker = L.circleMarker([element.latitude, element.longitude], {
          color: this.markerColor,
        });
        this.clusterMarkers.addLayer(marker);
      }
    });
    this.map.addLayer(this.clusterMarkers);
  }

  /**
   * Remove All Markers
   */
  private clearMarkers() {
    if (!this.markerGroup) { return; }
    this.markerGroup.clearLayers();
  }

  /**
   * Add a marker at specified point
   * @param lat Latitude number
   * @param long Longitude number
   */
  private addMapMarkerAt(lat: number, long: number) {
    if (!this.markerGroup) { return; }
    L.circleMarker([lat, long], {
      color: this.markerColor
    }).addTo(this.markerGroup);
  }

  /**
   * Creates an inverted polygon:
   * gray out everything except for this polygon.
   * @param points LatLong
   */
  addInvertedPolygon(points: MapMarker[]) {
    const world = [[90, -180], [90, 180], [-90, 180], [-90, -180]];
    const innerPoints = [];
    for (const point of points) {
      // Note: geoJSON is long,lat, but leftet is lat,long
      innerPoints.push([point.latitude, point.longitude]);
    }

    const polygon = L.polygon (
      [[world], [innerPoints]],
      {
        color: this.markerColor,
        fillColor: 'white',
        // between 0 and 1
        fillOpacity: 0.7,
        weight: 1,
      }
    );
    polygon.addTo(this.map);
  }

  /**
   * Draws a polygon on the map based on the list of lat/long coordinates
   * assigned to this.polygonLatLng
   */
  drawPolygon() {
    if (this.polygonLatLng.length === 0) {
      return;
    }
    this.leafletDrawLayerGroup.clearLayers();
    this.leafletFeatures['features'] = [];
    const polygon = L.polygon([this.polygonLatLng], {
      color: '#F5A623',
      fillColor: '#F5A623',
      fillOpacity: 0.7,
      weight: 2,
    });
    const area = L.GeometryUtil.geodesicArea(polygon._latlngs[0]);
    const polygonGeoJson = polygon.toGeoJSON();
    const length = this.calculatePolylinePathLength();
    polygon.bindPopup(`<html>Offset: ${Number(this._offset)}m<br>Area: ${area.toFixed(1)}m²<br>Length: ${length.toFixed(1)}m</html>`);
    polygon.addTo(this.leafletDrawLayerGroup);
    polygonGeoJson['properties'] = {'area': area, 'offset': Number(this._offset), 'length': length};
    this.leafletFeatures.features.push(polygonGeoJson);
    this.map.fitBounds(polygon._bounds);
    this.drawLine();
    this.drawPoints();
    this.inputGeometryChanged.emit(this.leafletFeatures);
  }

  /**
   * Draws a connected line on the map with circleMarkers for each of the LatLng coordinates
   * assigned to this.pointsLatLng
   * Used as part of waypoint functionality.
   * Outputs a dictionary of the Leaflet polyline and circleMarkers drawn on the map, to be saved
   * to GeoJSON file if desired.
   */
  drawLine() {
    if (this.points.length !== this.pointsLatLng.length) {
      this.pointsLatLng = [];
      for (const p of this.points) {
        this.pointsLatLng.push([p.latitude, p.longitude]);
      }
    }
    const line = L.polyline([this.pointsLatLng], {
      color: 'black',
      weight: 1,
      fillOpacity: 0.4,
    });
    line.addTo(this.leafletDrawLayerGroup);
    this.leafletFeatures.features.push(line.toGeoJSON());
  }

  drawPoints() {
    for (const l of this.pointsLatLng) {
      const circle = L.circle([l[0], l[1]], {radius: 0.5, color: 'black', fillColor: 'black', fill: true});
      circle.addTo(this.leafletDrawLayerGroup);
      this.leafletFeatures.features.push(circle.toGeoJSON());
    }
  }

  calculatePolylinePathLength(): number {
    let sumLength = 0.0;
    for (let i = 0; i < this.pointsLatLng.length - 1; i++) {
      sumLength += haversine(this.pointsLatLng[i], this.pointsLatLng[i + 1]);
    }
    return sumLength;
  }

  //////////////////////////////////////////////

  /**
   * Returns coordinate points
   * of the border of BC
   */
  get bcBorderCoordinates(): MapMarker[] {
    const coordinates = this.bcGeoJSON.features[0].geometry.coordinates[0][0];
    const bcCoordinates: MapMarker[] = [];
    for (const point of coordinates) {
      // Note: geoJSON is long,lat
      bcCoordinates.push({
        latitude: point[1],
        longitude: point[0]
      });
    }
    return bcCoordinates;
  }

  /**
   * GeoJSON outline of bc
   * generated with http://geojson.io/
   */
  get bcGeoJSON(): any {
    const obj = JSON.parse(JSON.stringify(bcgeojson)).default;
    return obj;
  }
}
