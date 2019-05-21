import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ConverterService {

  constructor() { }

  K0 = 0.9996;

  E = 0.00669438;
  E2 = Math.pow(this.E, 2);
  E3 = Math.pow(this.E, 3);
  E_P2 = this.E / (1 - this.E);

  SQRT_E = Math.sqrt(1 - this.E);
  _E = (1 - this.SQRT_E) / (1 + this.SQRT_E);
  _E2 = Math.pow(this._E, 2);
  _E3 = Math.pow(this._E, 3);
  _E4 = Math.pow(this._E, 4);
  _E5 = Math.pow(this._E, 5);

  M1 = 1 - this.E / 4 - 3 * this.E2 / 64 - 5 * this.E3 / 256;
  M2 = 3 * this.E / 8 + 3 * this.E2 / 32 + 45 * this.E3 / 1024;
  M3 = 15 * this.E2 / 256 + 45 * this.E3 / 1024;
  M4 = 35 * this.E3 / 3072;

  P2 = 3 / 2 * this._E - 27 / 32 * this._E3 + 269 / 512 * this._E5;
  P3 = 21 / 16 * this._E2 - 55 / 32 * this._E4;
  P4 = 151 / 96 * this._E3 - 417 / 128 * this._E5;
  P5 = 1097 / 512 * this._E4;

  R = 6378137;

  ZONE_LETTERS = 'CDEFGHJKLMNPQRSTUVWXX';

  toLatLon(easting, northing, zoneNum, zoneLetter, northern, strict) {
    strict = strict !== undefined ? strict : true;

    if (!zoneLetter && northern === undefined) {
      throw new Error('either zoneLetter or northern needs to be set');
    } else if (zoneLetter && northern !== undefined) {
      throw new Error('set either zoneLetter or northern, but not both');
    }

    if (strict) {
      if (easting < 100000 || 1000000 <= easting) {
        throw new RangeError('easting out of range (must be between 100 000 m and 999 999 m)');
      }
      if (northing < 0 || northing > 10000000) {
        throw new RangeError('northing out of range (must be between 0 m and 10 000 000 m)');
      }
    }
    if (zoneNum < 1 || zoneNum > 60) {
      throw new RangeError('zone number out of range (must be between 1 and 60)');
    }
    if (zoneLetter) {
      zoneLetter = zoneLetter.toUpperCase();
      if (zoneLetter.length !== 1 || this.ZONE_LETTERS.indexOf(zoneLetter) === -1) {
        throw new RangeError('zone letter out of range (must be between C and X)');
      }
      northern = zoneLetter >= 'N';
    }

    var x = easting - 500000;
    var y = northing;

    if (!northern) y -= 1e7;

    var m = y / this.K0;
    var mu = m / (this.R * this.M1);

    var pRad = mu +
      this.P2 * Math.sin(2 * mu) +
      this.P3 * Math.sin(4 * mu) +
      this.P4 * Math.sin(6 * mu) +
      this.P5 * Math.sin(8 * mu);

    var pSin = Math.sin(pRad);
    var pSin2 = Math.pow(pSin, 2);

    var pCos = Math.cos(pRad);

    var pTan = Math.tan(pRad);
    var pTan2 = Math.pow(pTan, 2);
    var pTan4 = Math.pow(pTan, 4);

    var epSin = 1 - this.E * pSin2;
    var epSinSqrt = Math.sqrt(epSin);

    var n = this.R / epSinSqrt;
    var r = (1 - this.E) / epSin;

    var c = this._E * pCos * pCos;
    var c2 = c * c;

    var d = x / (n * this.K0);
    var d2 = Math.pow(d, 2);
    var d3 = Math.pow(d, 3);
    var d4 = Math.pow(d, 4);
    var d5 = Math.pow(d, 5);
    var d6 = Math.pow(d, 6);

    var latitude = pRad - (pTan / r) *
      (d2 / 2 -
        d4 / 24 * (5 + 3 * pTan2 + 10 * c - 4 * c2 - 9 * this.E_P2)) +
      d6 / 720 * (61 + 90 * pTan2 + 298 * c + 45 * pTan4 - 252 * this.E_P2 - 3 * c2);
    var longitude = (d -
      d3 / 6 * (1 + 2 * pTan2 + c) +
      d5 / 120 * (5 - 2 * c + 28 * pTan2 - 3 * c2 + 8 * this.E_P2 + 24 * pTan4)) / pCos;

    return {
      latitude: this.toDegrees(latitude),
      longitude: this.toDegrees(longitude) + this.zoneNumberToCentralLongitude(zoneNum)
    };
  }

  fromLatLon(latitude, longitude, forceZoneNum) {
    if (latitude > 84 || latitude < -80) {
      throw new RangeError('latitude out of range (must be between 80 deg S and 84 deg N)');
    }
    if (longitude > 180 || longitude < -180) {
      throw new RangeError('longitude out of range (must be between 180 deg W and 180 deg E)');
    }

    var latRad = this.toRadians(latitude);
    var latSin = Math.sin(latRad);
    var latCos = Math.cos(latRad);

    var latTan = Math.tan(latRad);
    var latTan2 = Math.pow(latTan, 2);
    var latTan4 = Math.pow(latTan, 4);

    var zoneNum;

    if (forceZoneNum === undefined) {
      zoneNum = this.latLonToZoneNumber(latitude, longitude);
    } else {
      zoneNum = forceZoneNum;
    }

    var zoneLetter = this.latitudeToZoneLetter(latitude);

    var lonRad = this.toRadians(longitude);
    var centralLon = this.zoneNumberToCentralLongitude(zoneNum);
    var centralLonRad = this.toRadians(centralLon);

    var n = this.R / Math.sqrt(1 - this.E * latSin * latSin);
    var c = this.E_P2 * latCos * latCos;

    var a = latCos * (lonRad - centralLonRad);
    var a2 = Math.pow(a, 2);
    var a3 = Math.pow(a, 3);
    var a4 = Math.pow(a, 4);
    var a5 = Math.pow(a, 5);
    var a6 = Math.pow(a, 6);

    var m = this.R * (this.M1 * latRad -
      this.M2 * Math.sin(2 * latRad) +
      this.M3 * Math.sin(4 * latRad) -
      this.M4 * Math.sin(6 * latRad));
    var easting = this.K0 * n * (a +
      a3 / 6 * (1 - latTan2 + c) +
      a5 / 120 * (5 - 18 * latTan2 + latTan4 + 72 * c - 58 * this.E_P2)) + 500000;
    var northing = this.K0 * (m + n * latTan * (a2 / 2 +
      a4 / 24 * (5 - latTan2 + 9 * c + 4 * c * c) +
      a6 / 720 * (61 - 58 * latTan2 + latTan4 + 600 * c - 330 * this.E_P2)));
    if (latitude < 0) northing += 1e7;

    return {
      easting: easting,
      northing: northing,
      zoneNum: zoneNum,
      zoneLetter: zoneLetter
    };
  }

  latitudeToZoneLetter(latitude) {
    if (-80 <= latitude && latitude <= 84) {
      return this.ZONE_LETTERS[Math.floor((latitude + 80) / 8)];
    } else {
      return null;
    }
  }

  latLonToZoneNumber(latitude, longitude) {
    if (56 <= latitude && latitude < 64 && 3 <= longitude && longitude < 12) return 32;

    if (72 <= latitude && latitude <= 84 && longitude >= 0) {
      if (longitude < 9) return 31;
      if (longitude < 21) return 33;
      if (longitude < 33) return 35;
      if (longitude < 42) return 37;
    }

    return Math.floor((longitude + 180) / 6) + 1;
  }

  zoneNumberToCentralLongitude(zoneNum) {
    return (zoneNum - 1) * 6 - 180 + 3;
  }

  toDegrees(rad) {
    return rad / Math.PI * 180;
  }

  toRadians(deg) {
    return deg * Math.PI / 180;
  }
}
