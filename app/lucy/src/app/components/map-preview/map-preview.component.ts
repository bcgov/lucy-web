import { Component, OnInit, AfterViewInit, AfterContentChecked, Input, Output , EventEmitter, AfterViewChecked} from '@angular/core';
import 'node_modules/leaflet/';
import 'node_modules/leaflet.markercluster';
declare let L;

export interface MapPreviewPoint {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface LatLong {
  latitude: number;
  longitude: number;
}

// export interface

@Component({
  selector: 'app-map-preview',
  templateUrl: './map-preview.component.html',
  styleUrls: ['./map-preview.component.css']
})

export class MapPreviewComponent implements OnInit, AfterViewInit, AfterViewChecked {
  private markerColor = '#3700B3';
  private clusterMarkers = L.markerClusterGroup();
  private map?;
  private markerGroup?;
  private ready = false;

  private _mapId: string;
  get mapId(): string {
    if (!this._mapId) {
      this._mapId = this.makeid(5);
    }
    return this._mapId;
  }

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
  private _markers: LatLong[] = [];
  // get
  get markers(): LatLong[] {
    return this._markers;
  }
  // set
  @Input() set markers(locations: LatLong[]) {
    this._markers = locations;
    if (this.ready) {
      this.addMarkers();
    }
  }
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
    // this.initMapWithGoogleSatellite();
    this.initWithOpenStreet();
  }

  private initWithOpenStreet() {
    // Use Open street tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      preferCanvas: true,
      key: this.makeid(10)
    }).addTo(this.map);
    this.mask();
  }

  private initMapWithGoogleSatellite() {
    // Use Google tiles
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      // attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'.
      preferCanvas: true,
      key: this.makeid(10)
    }).addTo(this.map);
    this.mask();
  }

  private makeid(length: number) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

  private defaultPoint(): MapPreviewPoint {
    return {
      latitude: 52.068508,
      longitude: -123.288152,
      zoom: 4
    };
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
    this.map.setView(new L.LatLng(center.latitude, center.longitude), center.zoom);
  }
  //////////////////////////////////////////////

  ////////////// Markers //////////////
  /**
   * Remove all existing markers
   * and add all markers in this.markers.
   */
  private addMarkers() {
    this.addClusteringMarkers();
    // this.clearMarkers();
    // this.markers.forEach((element) => {
    //   this.addMapMarkerAt(element.latitude, element.longitude);
    // });
  }

  private addClusteringMarkers() {
    this.markers.forEach((element) => {
      const marker = L.circleMarker([element.latitude, element.longitude], {
        color: this.markerColor,
      });
      this.clusterMarkers.addLayer(marker);
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
      color: '#3388ff'
    }).addTo(this.markerGroup);
  }
  //////////////////////////////////////////////

  private addMapClusteringMarkers(lat: number, long: number) {
    let markers = L.markerClusterGroup();
    markers.addLayer(L.marker([lat, long]));
    this.map.addLayer(markers);
  }

  // showMapAtCurrentLatLong() {
  //   this.showMapAt(this.lat, this.long, 15)
  //   this.addMapMarkerAt(this.lat, this.long)
  // }

  /**
   * GeoJSON outline of bc
   * generated with http://geojson.io/
   */
  get bc(): any {
    const bc = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [
                -139.39453125,
                60.02095215374802
              ],
              [
                -119.92675781249999,
                60.04290359809164
              ],
              [
                -119.970703125,
                53.80065082633023
              ],
              [
                -114.9609375,
                48.980216985374994
              ],
              [
                -123.26660156249999,
                49.03786794532644
              ],
              [
                -123.04687499999999,
                48.777912755501845
              ],
              [
                -123.26660156249999,
                48.66194284607006
              ],
              [
                -123.04687499999999,
                48.37084770238366
              ],
              [
                -123.3544921875,
                48.19538740833338
              ],
              [
                -124.76074218749999,
                48.48748647988415
              ],
              [
                -129.77050781249997,
                50.90303283111257
              ],
              [
                -132.71484375,
                52.93539665862318
              ],
              [
                -133.1982421875,
                54.059387886623576
              ],
              [
                -133.7255859375,
                55.32914440840507
              ],
              [
                -134.9560546875,
                56.19448087726972
              ],
              [
                -135.4833984375,
                56.897003921272606
              ],
              [
                -135.966796875,
                56.9449741808516
              ],
              [
                -136.58203125,
                57.98480801923985
              ],
              [
                -139.70214843749997,
                59.489726035537075
              ],
              [
                -139.39453125,
                60.02095215374802
              ]
            ]
          }
        }
      ]
    };
    return bc;
  }

  addBCBorder() {
    L.geoJSON(this.bc).addTo(this.map);
  }

  mask() {
    this.addBCBorder();
    return;
    // L.Mask = L.Polygon.extend({
    //   options: {
    //     stroke: false,
    //     color: '#333',
    //     fillOpacity: 0.5,
    //     clickable: true,

    //     outerBounds: new L.LatLngBounds([-90, -360], [90, 360])
    //   },

    //   initialize: function (latLngs, options) {

    //     const outerBoundsLatLngs = [
    //       this.options.outerBounds.getSouthWest(),
    //       this.options.outerBounds.getNorthWest(),
    //       this.options.outerBounds.getNorthEast(),
    //       this.options.outerBounds.getSouthEast()
    //     ];
    //     L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latLngs], options);
    //   },

    // });
    // L.mask = function (points, options) {
    //   return new L.Mask(points, options);
    // };

    const coordinates = this.bc.features[0].geometry.coordinates[0];
    const bcCoordinates = [];
    for (let i = 0; i < coordinates.length; i++) {
      bcCoordinates.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
    }

    console.log('masking');

    L.mask(bcCoordinates).addTo(this.map);
  }
}
