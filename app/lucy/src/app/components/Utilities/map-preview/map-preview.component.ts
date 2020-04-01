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
import { Component, OnInit, AfterViewInit, AfterContentChecked, Input, Output , EventEmitter, AfterViewChecked} from '@angular/core';
import 'node_modules/leaflet/';
import 'node_modules/leaflet.markercluster';
import 'node_modules/leaflet-draw';
import { Observation } from 'src/app/models';
import * as bcgeojson from './bcgeojson.json';
import { keyframes } from '@angular/animations';
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
  // Leaflet Feature objects drawn on map
  private leafletFeatures?: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };

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

  /////////////// Polygon ////////////////
  private _polygon: number[][] = [[]];
  get polygon(): number[][] {
    return this._polygon;
  }
  @Input() set polygon(coordinates: number[][]) {
    this._polygon = coordinates;
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
      // this.leafletFeatures = json;
    } else if (object['type'] === `FeatureCollection`) { // if object is a GeoJSON
      json = object;
    }
    this._inputGeometryJSON = json;
    if (this.ready && this._inputGeometryJSON !== '{}') {
      L.geoJSON(this._inputGeometryJSON).addTo(this.map);
    }
  }

  @Output() inputGeometryChanged = new EventEmitter<any>();

  //////////////////////////////////////////////

  @Output() centerPointChanged = new EventEmitter<MapPreviewPoint>();

  ////////////// Class Functions //////////////
  constructor() { }

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
    this.initMapWithGoogleSatellite();
    // this.initWithOpenStreet();
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
    L.geoJSON(this.inputGeometryJSON).addTo(this.map);
  }

  private initMapWithGoogleSatellite() {
    // Use Google tiles
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      // attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'.
      preferCanvas: true,
      key: this.makeid(10)
    }).addTo(this.map);
    this.addBCBorder();

    L.geoJSON(this.inputGeometryJSON, {
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
          case 'Point': return {
            radius: 0.5,
            color: 'black',
            fillColor: 'black',
            fill: true
          };
        }
      }
    }).addTo(this.map);
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
   * assigned to this.polygon
   */
  drawPolygon() {
    const polygon = L.polygon([this.polygon], {
      color: '#F5A623',
      fillColor: '#F5A623',
      fillOpacity: 0.7,
      weight: 2,
    });
    polygon.addTo(this.map);
    const area = L.GeometryUtil.geodesicArea(polygon._latlngs[0]);
    const polygonGeoJson = polygon.toGeoJSON();
    polygonGeoJson['properties'] = {'area': area};
    this.leafletFeatures.features.push(polygonGeoJson);
    this.map.fitBounds(polygon._bounds);
    this.drawLine();

    this.inputGeometryJSON = this.leafletFeatures;
    this.inputGeometryChanged.emit(this.inputGeometryJSON);
  }

  /**
   * Draws a connected line on the map with circleMarkers for each of the lat/long coordinates
   * assigned to this.markers
   * Used as part of waypoint functionality.
   * Outputs a dictionary of the Leaflet polyline and circleMarkers drawn on the map, to be saved
   * to GeoJSON file if desired.
   */
  drawLine() {
    const linePoints = [];

    for (const c of this.markers) {
      linePoints.push([c.latitude, c.longitude]);
    }
    const line = L.polyline([linePoints], {
      color: 'black',
      weight: 1,
      fillOpacity: 0.4,
    });
    line.addTo(this.map);
    this.leafletFeatures.features.push(line.toGeoJSON());

    for (const l of linePoints) {
      const circle = L.circleMarker([l[0], l[1]], {radius: 0.5, color: 'black', fillColor: 'black', fill: true});
      circle.addTo(this.map);
      this.leafletFeatures.features.push(circle.toGeoJSON());
    }
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

  /**
   * Creates and returns a list of one or more Leaflet map vector objects ready to be converted to a GeoJSON file
   * GeoJSON file is used for storing a geometry object in the Postgres DB
   * @param vector a single Leaflet object or an array of objects to be converted to GeoJSON
   */
  // toGeoJSON(vector: {}): any[] {
  //   const geoJsonFile = [];
  //   for (const [key, value] of Object.entries(vector)) {
  //     const geometryDict = {type: key, coordinates: value['_latlngs'], options: value['options']};
  //     const geoJsonEntry = {type: 'Feature', geometry: geometryDict, properties: {} };
  //     geoJsonFile.push(geoJsonEntry);
  //   }
  //   return geoJsonFile;
  // }
}
