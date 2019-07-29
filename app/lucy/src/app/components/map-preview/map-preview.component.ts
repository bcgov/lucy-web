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
      key: this.makeid(10),
      minZoom: 4,
    }).addTo(this.map);
    this.addBCBorder();
  }

  private initMapWithGoogleSatellite() {
    // Use Google tiles
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      // attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'.
      preferCanvas: true,
      key: this.makeid(10)
    }).addTo(this.map);
    this.addBCBorder();
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
      this.addClusteringMarkers();
    } else {
      this.clearMarkers();
      this.markers.forEach((element) => {
        this.addMapMarkerAt(element.latitude, element.longitude);
      });
    }
  }

  /**
   * Add Markers that cluster together.
   */
  private addClusteringMarkers() {
    // https://github.com/Leaflet/Leaflet.markercluster
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
      color: this.markerColor
    }).addTo(this.markerGroup);
  }

  /**
   * Creates an inverted polygon:
   * gray out everything except for this polygon.
   * @param points LatLong
   */
  addInvertedPolygon(points: LatLong[]) {
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
        fillColor: 'grey',
        // between 0 and 1
        fillOpacity: 0.5,
        weight: 1,
      }
    ).addTo(this.map);
  }

  //////////////////////////////////////////////

  /**
   * Returns coordinate points
   * of the border of BC
   */
  get bcBorderCoordinates(): LatLong[] {
    const coordinates = this.bcGeoJSON.features[0].geometry.coordinates;
    const bcCoordinates: LatLong[] = [];
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
    const bc = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [
                -120.0146484375,
                59.99898612060444
              ],
              [
                -120.05859375,
                53.80065082633023
              ],
              [
                -119.794921875,
                53.67068019347264
              ],
              [
                -119.92675781249999,
                53.48804553605622
              ],
              [
                -119.53125,
                53.30462107510271
              ],
              [
                -118.95996093749999,
                53.25206880589411
              ],
              [
                -118.47656249999999,
                52.96187505907603
              ],
              [
                -118.0810546875,
                52.348763181988105
              ],
              [
                -116.98242187499999,
                52.05249047600099
              ],
              [
                -116.806640625,
                51.699799849741936
              ],
              [
                -116.1474609375,
                51.37178037591737
              ],
              [
                -115.57617187499999,
                50.93073802371819
              ],
              [
                -115.1806640625,
                50.56928286558243
              ],
              [
                -114.6533203125,
                50.317408112618686
              ],
              [
                -114.5654296875,
                49.809631563563094
              ],
              [
                -114.6533203125,
                49.468124067331644
              ],
              [
                -113.8623046875,
                49.009050809382046
              ],
              [
                -123.0908203125,
                48.951366470947725
              ],
              [
                -123.1787109375,
                48.69096039092549
              ],
              [
                -123.0908203125,
                48.3416461723746
              ],
              [
                -123.3984375,
                48.19538740833338
              ],
              [
                -124.23339843749999,
                48.37084770238366
              ],
              [
                -125.46386718749999,
                48.60385760823255
              ],
              [
                -126.69433593749999,
                49.18170338770663
              ],
              [
                -127.88085937499999,
                49.89463439573421
              ],
              [
                -128.5400390625,
                50.3454604086048
              ],
              [
                -128.84765625,
                50.62507306341435
              ],
              [
                -129.462890625,
                50.792047064406866
              ],
              [
                -129.3310546875,
                51.09662294502995
              ],
              [
                -128.759765625,
                51.15178610143037
              ],
              [
                -128.3642578125,
                51.28940590271679
              ],
              [
                -128.49609375,
                51.72702815704774
              ],
              [
                -128.84765625,
                52.07950600379697
              ],
              [
                -129.28710937499997,
                52.29504228453735
              ],
              [
                -129.814453125,
                52.562995039558004
              ],
              [
                -129.8583984375,
                52.8823912222619
              ],
              [
                -130.2099609375,
                53.09402405506325
              ],
              [
                -130.5615234375,
                53.25206880589411
              ],
              [
                -130.869140625,
                53.4357192066942
              ],
              [
                -130.95703125,
                53.74871079689897
              ],
              [
                -131.1767578125,
                54.13669645687002
              ],
              [
                -131.3525390625,
                54.41892996865827
              ],
              [
                -131.396484375,
                54.648412502316695
              ],
              [
                -130.60546875,
                54.80068486732233
              ],
              [
                -130.2978515625,
                55.07836723201515
              ],
              [
                -130.0341796875,
                55.3791104480105
              ],
              [
                -130.1220703125,
                55.62799595426723
              ],
              [
                -130.1220703125,
                55.85064987433714
              ],
              [
                -130.1220703125,
                56.07203547180089
              ],
              [
                -130.60546875,
                56.31653672211301
              ],
              [
                -131.1328125,
                56.511017504952136
              ],
              [
                -131.7919921875,
                56.65622649350222
              ],
              [
                -132.099609375,
                56.84897198026975
              ],
              [
                -132.0556640625,
                57.040729838360875
              ],
              [
                -132.4072265625,
                57.088515327886505
              ],
              [
                -132.36328125,
                57.326521225217064
              ],
              [
                -133.4619140625,
                58.37867853932655
              ],
              [
                -133.9453125,
                58.83649009392136
              ],
              [
                -134.3408203125,
                58.88194208135912
              ],
              [
                -134.47265625,
                59.130863097255904
              ],
              [
                -134.912109375,
                59.28833169203345
              ],
              [
                -135.1318359375,
                59.44507509904714
              ],
              [
                -135.087890625,
                59.60109549032134
              ],
              [
                -135.4833984375,
                59.84481485969105
              ],
              [
                -136.31835937499997,
                59.62332522313024
              ],
              [
                -136.5380859375,
                59.17592824927136
              ],
              [
                -137.373046875,
                58.97266715450153
              ],
              [
                -137.6806640625,
                59.28833169203345
              ],
              [
                -138.6474609375,
                59.80063426102869
              ],
              [
                -139.130859375,
                59.99898612060444
              ],
              [
                -120.0146484375,
                59.99898612060444
              ]
            ]
          }
        }
      ]
    };
    return bc;
  }
}
