import { Injectable } from '@angular/core';

export interface UTMCoordinate {
  x: number;
  y: number;
  zone: number;
}

export interface LatLongCoordinate {
  latitude: number;
  longitude: number;
}

export interface AlbersCoordinate {
  x: number;
  y: number;
}
@Injectable({
  providedIn: 'root'
})

export class ConverterService {
  // Diameter of earth at the equator
  b = 6378137;
  k0 = 0.9996;
  k1 = 0.9992;
  pi = Math.PI;
  e = 0.081819218048345;

  e2 = Math.pow(this.e, 2);
  e3 = Math.pow(this.e, 3);
  e4 = Math.pow(this.e, 4);
  e5 = Math.pow(this.e, 5);
  e6 = Math.pow(this.e, 6);
  e7 = Math.pow(this.e, 7);
  constructor() { }

  convertLatLongCoordinateToUTM(
    lat: number,
    long: number
  ): UTMCoordinate | undefined {
    const utmZone = this.getUTMZone(long);
    const angleP = this.getAngleP(long);

    if (!angleP || !utmZone) {
      return undefined;
    }

    const eP2 = this.e2 / (1 - this.e2);
    const angle1 = this.toRadian(long);
    const theta = this.toRadian(lat);

    const n2 =
      this.b / Math.pow(1 - this.e2 * Math.pow(Math.sin(theta), 2), 0.5);
    const t = Math.pow(Math.tan(theta), 2);
    const c = eP2 * Math.pow(Math.cos(theta), 2);
    const a = (angle1 - angleP) * Math.cos(theta);
    const m =
      this.b *
      ((1 - this.e2 / 4 - (3 * this.e4) / 64 - (5 * this.e6) / 256) * theta -
        ((3 * this.e2) / 8 + (3 * this.e4) / 32 + (45 * this.e6) / 1024) *
        Math.sin(2 * theta) +
        ((15 * this.e4) / 256 + (45 * this.e6) / 1024) * Math.sin(theta * 4) -
        ((35 * this.e6) / 3072) * Math.sin(6 * theta));

    const utmX =
      this.k0 *
      n2 *
      (a +
        ((1 - t + c) * Math.pow(a, 3)) / 6 +
        ((5 - 18 * t + Math.pow(t, 2) + 72 * c - 58 * eP2) * Math.pow(a, 5)) /
        120) +
      500000;

    const q1 = Math.pow(a, 2) / 2;
    const q2 = ((5 - t + 9 * c + 4 * Math.pow(c, 2)) * Math.pow(a, 4)) / 24;
    const q3 =
      ((61 - 58 * t + Math.pow(t, 2) + 600 * c - 330 * eP2) * Math.pow(a, 6)) /
      720;

    const utmY = this.k0 * (m + n2 * Math.tan(theta) * (q1 + q2 + q3));

    return {
      y: utmY,
      x: utmX,
      zone: utmZone
    };
  }

  toRadian(deg: number): number {
    return (deg * this.pi) / 180;
  }

  toDegrees(rad: number): number {
    return (rad / this.pi) * 180;
  }

  /*
  Return UTM Zone given a longitude. if invalid (for BC) return undefined.
  */
  getUTMZone(longitude: number): number | undefined {
    let utmZone: number;

    if (longitude >= -114) {
      utmZone = 12;
    } else if (longitude >= -120) {
      utmZone = 11;
    } else if (longitude >= -126) {
      utmZone = 10;
    } else if (longitude >= -132) {
      utmZone = 9;
    } else if (longitude >= -138) {
      utmZone = 8;
    } else if (longitude >= -144) {
      utmZone = 7;
    }

    return utmZone;
  }

  getAngleP(longitude: number): number | undefined {
    let angleP: number;

    if (longitude >= -114) {
      angleP = -111;
    } else if (longitude >= -120) {
      angleP = -117;
    } else if (longitude >= -126) {
      angleP = -123;
    } else if (longitude >= -132) {
      angleP = -129;
    } else if (longitude >= -138) {
      angleP = -135;
    } else if (longitude >= -144) {
      angleP = -141;
    }

    if (angleP) {
      angleP = this.toRadian(angleP);
    }

    return angleP;
  }

  convertUTMToLatLongCoordinate(
    x: number,
    y: number,
    zone: number
  ): LatLongCoordinate | undefined {
    let g1 = 0;
    switch (+zone) {
      case 12: {
        g1 = -111;
        break;
      }
      case 11: {
        g1 = -117;
        break;
      }
      case 10: {
        g1 = -123;
        break;
      }
      case 9: {
        g1 = -129;
        break;
      }
      case 8: {
        g1 = -135;
        break;
      }
      case 7: {
        g1 = -141;
        break;
      }
      default: {
        return undefined;
        break;
      }
    }
    const a = this.b;
    const ee2 = 2 * (1 / 298.257222101) - Math.pow(1 / 298.257222101, 2);
    const k = this.k0;
    const eP2 = ee2 / (1 - ee2);
    const m = y / k;
    const ee1 = (1 - Math.pow(1 - ee2, 0.5)) / (1 + Math.pow(1 - ee2, 0.5));
    const u =
      m /
      (a *
        (1 -
          ee2 / 4 -
          (3 * Math.pow(ee2, 2)) / 64 -
          (5 * Math.pow(ee2, 4)) / 256));

    const op =
      u +
      ((3 * ee1) / 2 - (27 * Math.pow(ee1, 3)) / 32) * Math.sin(2 * u) +
      ((21 * Math.pow(ee1, 2)) / 16 - (55 * Math.pow(ee1, 4)) / 32) *
      Math.sin(4 * u) +
      ((151 * Math.pow(ee1, 3)) / 96) * Math.sin(6 * u);

    const c1 = eP2 * Math.pow(Math.cos(op), 2);
    const n1 = a / Math.pow(1 - ee2 * Math.pow(Math.sin(op), 2), 0.5);

    const t1 = Math.pow(Math.tan(op), 2);

    const r1 =
      (a * (1 - ee2)) /
      Math.pow(1 - this.e2 * Math.pow(Math.sin(op), 2), 3 / 2);
    const d = (x - 500000) / (n1 * k);
    const w1 = (op * 180) / this.pi;
    const w2 = (n1 * Math.tan(op)) / r1;
    const w3 = Math.pow(d, 2) / 2;
    const w4 =
      ((5 + 3 * t1 + 10 * c1 - 4 * Math.pow(c1, 2) - 9 * eP2) *
        Math.pow(d, 4)) /
      24;
    const w5 =
      ((61 +
        90 * t1 +
        298 * c1 +
        45 * Math.pow(t1, 2) -
        252 * eP2 -
        3 * Math.pow(c1, 2)) *
        Math.pow(d, 6)) /
      720;
    const lat = w1 - w2 * (((w3 - w4 + w5) * 180) / this.pi);
    const g2 = ((1 + 2 * t1 + c1) * Math.pow(d, 3)) / 6;
    const g3 =
      ((5 -
        2 * c1 +
        28 * t1 -
        3 * Math.pow(c1, 2) +
        8 * eP2 +
        24 * Math.pow(t1, 2)) *
        Math.pow(d, 5)) /
      120;
    const longitude = g1 + (((d - g2 + g3) / Math.cos(op)) * 180) / this.pi;
    const latitude = lat;

    return {
      latitude: latitude,
      longitude: longitude
    };
  }

  latLongCoordinateToAlbers(
    latitude: number,
    longitude: number
  ): AlbersCoordinate {
    const a = this.b;
    const e2 = 2 * (1 / 298.257) - Math.pow(1 / 298.257, 2);
    const k = this.k0;
    const ep2 = e2 / (1 - e2);
    const offsetX = 1000000;
    const offsetY = 0;

    const angle1 = this.toRadian(50);
    const angle2 = this.toRadian(58.5);
    const angle3 = this.toRadian(45);
    const angle4 = -126;

    const angle1Squared = Math.pow(Math.sin(angle1), 2);
    const angle2Squared = Math.pow(Math.sin(angle2), 2);

    const latY = this.toRadian(latitude);
    const m1 = Math.cos(angle1) / Math.pow(1 - e2 * angle1Squared, 0.5);
    const m2 = Math.cos(angle2) / Math.pow(1 - e2 * angle2Squared, 0.5);
    const q1 =
      (1 - e2) *
      (Math.sin(angle1) / (1 - e2 * Math.pow(Math.sin(angle1), 2)) -
        (1 / (2 * this.e)) *
        Math.log(
          (1 - this.e * Math.sin(angle1)) / (1 + this.e * Math.sin(angle1))
        ));
    const q2 =
      (1 - e2) *
      (Math.sin(angle2) / (1 - e2 * Math.pow(Math.sin(angle2), 2)) -
        (1 / (2 * this.e)) *
        Math.log(
          (1 - this.e * Math.sin(angle2)) / (1 + this.e * Math.sin(angle2))
        ));
    const q0 =
      (1 - e2) *
      (Math.sin(angle3) / (1 - e2 * Math.pow(Math.sin(angle3), 2)) -
        (1 / (2 * this.e)) *
        Math.log(
          (1 - this.e * Math.sin(angle3)) / (1 + this.e * Math.sin(angle3))
        ));
    const n = (Math.pow(m1, 2) - Math.pow(m2, 2)) / (q2 - q1);
    const c = Math.pow(m1, 2) + n * q1;
    const p0 = (a * Math.pow(c - n * q0, 0.5)) / n;
    const q =
      (1 - e2) *
      (Math.sin(latY) / (1 - e2 * Math.pow(Math.sin(latY), 2)) -
        (1 / (2 * this.e)) *
        Math.log(
          (1 - this.e * Math.sin(latY)) / (1 + this.e * Math.sin(latY))
        ));
    const p = (a * Math.pow(c - n * q, 0.5)) / n;
    const theta = this.toRadian(n * (longitude - angle4));
    const albersX = p * Math.sin(theta) + offsetX;
    const albersY = p0 - p * Math.cos(theta) + offsetY;

    return {
      x: albersX,
      y: albersY
    };
  }

  albersToLatLongCoordinate(x: number, y: number): LatLongCoordinate {
    const a = this.b;
    const e2 = 2 * (1 / 298.257222101) - Math.pow(1 / 298.257222101, 2);
    const e1 = Math.pow(e2, 0.5);
    const albX = x - 1000000;
    // parallel 1
    const angle1 = this.toRadian(50);
    // parallel 2
    const angle2 = this.toRadian(58.5);
    // parallel origin
    const angle3 = this.toRadian(45);
    // longitude origin
    const angle4 = -126;
    const m1 =
      Math.cos(angle1) / Math.pow(1 - e2 * Math.pow(Math.sin(angle1), 2), 0.5);

    const m2 =
      Math.cos(angle2) / Math.pow(1 - e2 * Math.pow(Math.sin(angle2), 2), 0.5);
    const q1 =
      (1 - e2) *
      (Math.sin(angle1) / (1 - e2 * Math.pow(Math.sin(angle1), 2)) -
        (1 / (2 * e1)) *
        Math.log((1 - e1 * Math.sin(angle1)) / (1 + e1 * Math.sin(angle1))));

    const q2 =
      (1 - e2) *
      (Math.sin(angle2) / (1 - e2 * Math.pow(Math.sin(angle2), 2)) -
        (1 / (2 * e1)) *
        Math.log((1 - e1 * Math.sin(angle2)) / (1 + e1 * Math.sin(angle2))));

    const q0 =
      (1 - e2) *
      (Math.sin(angle3) / (1 - e2 * Math.pow(Math.sin(angle3), 2)) -
        (1 / (2 * e1)) *
        Math.log((1 - e1 * Math.sin(angle3)) / (1 + e1 * Math.sin(angle3))));

    const n = (Math.pow(m1, 2) - Math.pow(m2, 2)) / (q2 - q1);
    const c = Math.pow(m1, 2) + n * q1;
    const p0 = (a * Math.pow(c - n * q0, 0.5)) / n;
    const p = Math.pow(Math.pow(albX, 2) + Math.pow(p0 - y, 2), 0.5);
    const q = (c - (Math.pow(p, 2) * Math.pow(n, 2)) / Math.pow(a, 2)) / n;
    const theta = (Math.atan(albX / (p0 - y)) * 180) / this.pi;
    const NewLong = angle4 + theta / n;
    const Xm = q / (1 - ((1 - e2) / (2 * e1)) * Math.log((1 - e1) / (1 + e1)));
    const Ba = (Math.atan(Xm / Math.pow(-Xm * Xm + 1, 0.5)) * 180) / this.pi;
    const series1 =
      (((e2 / 3 + (31 * e2 * e2) / 180 + (517 * e2 * e2 * e2) / 5040) *
        Math.sin((2 * Ba * this.pi) / 180) +
        ((23 * e2 * e2) / 360 + (251 * e2 * e2 * e2) / 3780) *
        Math.sin((4 * Ba * this.pi) / 180)) *
        180) /
      this.pi;
    const NewLat = Ba + series1;
    return {
      latitude: NewLat,
      longitude: NewLong
    };
  }
}
