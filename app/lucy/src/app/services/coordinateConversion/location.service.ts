import { Injectable } from '@angular/core';
import * as hexRules from './hexRules.json';

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

  // MARK: HEX Calculation

  public getHexId(latitude: number, longitude: number): any {
    const e271 = 2.718282;
    const k0 = 0.9996;
    const k1 = 0.9992;
    const r3 = Math.pow(3, 0.5);
    const radiusO = Math.pow(((10000 * 2) / (3 * (r3))), 0.5);
    const radiusI = radiusO / 2 * r3;
    const yheight = radiusO / 2;
    const yheight2 = radiusO + yheight;
    const xWidth2 = radiusO * r3;
    const hexPTS: any[] = this.getHexRules();
    // Local variables
    let gridID = 0;
    const hexagons: any[] = [];
    let target: any;
    const target19: any[] = [];
    // Center of the province
    const startX = -126;
    const startY = 54;
    // Convert center to albers
    const albersResult = this.latLongCoordinateToAlbers(startY, startX);
    let albersX0 = albersResult.x;
    let albersY0 = albersResult.y;
    // Convert target lat long to albers
    const albersTargetResult = this.latLongCoordinateToAlbers(latitude, longitude);
    const albersX0new = albersTargetResult.x;
    const albersY0new = albersTargetResult.y;
    // Find Target relative to center
    const deltaX = albersX0new - albersX0;
    const deltaY = albersY0new - albersY0;
    const ticX = Math.round(deltaX / xWidth2);
    let ticY = Math.round(deltaY / yheight2);

    if ((ticY % 2) !== 0) {
      ticY = ticY - 1;
    }

    let ticXlow = ticX - 4;
    let ticXhigh = ticX + 8;
    let ticYlow = 0;
    let ticYhigh = 0;
    if (ticY > 0) {
      ticYlow = -2;
      ticYhigh = 6;
    } else {
      ticYlow = -4;
      ticYhigh = 4;
    }

    /* Part 1 Create set of hexagons cells centered around the target (patch) */
    albersX0 = albersX0 + ticX * radiusI;
    albersY0 = albersY0 + ticY * yheight2;

    for (let iy = ticYlow; iy <= ticYhigh; iy += 2) {
      for (let ix = ticXlow; ix <= ticXhigh; ix += 2) {
        const tempx = albersX0 + (ix * radiusI);
        const tempy = albersY0 + (iy * yheight2);
        gridID = gridID + 1;
        const newLatLong = this.albersToLatLongCoordinate(tempx, tempy);
        hexagons.push({
          hexID: gridID,
          xAlb0: tempx,
          yAlb0: tempy,
          xLon0: newLatLong.longitude,
          yLat0: newLatLong.latitude,
        });
      }
    }

    for (let iy = ticYlow + 1; iy <= ticYhigh; iy += 2) {
      for (let ix = ticXlow - 1; ix <= ticXhigh; ix += 2) {
        const tempx = albersX0 + (ix * radiusI);
        const tempy = albersY0 + (iy * yheight2);
        gridID = gridID + 1;
        const newLatLong = this.albersToLatLongCoordinate(tempx, tempy);
        hexagons.push({

          hexID: gridID,
          xAlb0: tempx,
          yAlb0: tempy,
          xLon0: newLatLong.longitude,
          yLat0: newLatLong.latitude,
        })
      }
    }

    const totalHEX = gridID;

    /* Part 2 Cycle through the patch and find the cell center closest to the raw target */
    let dxyOLD = 999999;
    let targetID = 0;
    for (let i = 1; i <= totalHEX; i++) {
      const hexagon = hexagons.find(item => item.hexID === i);
      const dxy = Math.pow((Math.pow((hexagon.xAlb0 - albersX0new), 2) + Math.pow((hexagon.yAlb0 - albersY0new), 2)), 0.5);
      if (dxy < dxyOLD) {
        dxyOLD = dxy;
        targetID = i;
      }
    }
    /*
		Populate the target(1) array with the key attibutes
		Target(1) is the key element determined from this entire application.
		*/
    const hexagonTarget = hexagons.find(item => item.hexID === targetID);
    target = {
      hexID: 1,
      xAlb0: hexagonTarget.xAlb0,
      yAlb0: hexagonTarget.yAlb0,
      xLon0: hexagonTarget.xLon0,
      yLat0: hexagonTarget.yLat0
    };
    /* determine HexID as a composite of the lat/long */

    // Same result as above, but with string concat
    let targetLat = target.yLat0;
    let targetLong = target.xLon0;
    targetLong = Math.abs(targetLong);
    targetLong = +String(targetLong).substring(1);
    targetLong = +String(targetLong).replace('.', '');
    targetLat = +String(targetLat).replace('.', '');
    targetLat = +String(targetLat).substring(0, 6);
    targetLong = +String(targetLong).substring(0, 6);
    const targetId = +`${targetLat}${targetLong}`;
    target.BCHexID = targetId;
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* Part 3 find the 18 surrounding cells to the target (optional)
		The closest 19 hexagon cells fall with 230m of the ceter of the target cell
		Assign “keep=1” to those patch cells proximal to the target */
    for (let i = 1; i <= totalHEX; i++) {
      const hexagon = hexagons.find(item => item.hexID === i);
      const dxy = Math.pow((Math.pow((hexagon.xAlb0 - target.xAlb0), 2) + Math.pow((hexagon.yAlb0 - target.yAlb0), 2)), 0.5);
      if (dxy < 230) {
        hexagon.keep = 1;
      }
    }
    let kk = 0;
    for (let i = 1; i <= totalHEX; i++) {
      const hexagon = hexagons.find(item => item.hexID === i);
      let newTarget: any;
      newTarget = {
        index: i
      };
      if (hexagon.keep === 1) {
        kk = kk + 1
        newTarget.targetID = kk;
        newTarget.xAlb0 = hexagon.xAlb0;
        newTarget.yAlb0 = hexagon.yAlb0;
        newTarget.xLon0 = hexagon.xLon0;
        newTarget.yLat0 = hexagon.yLat0;

        for (let j = 1; j <= 6; j++) {
          const nx = 30 + (j - 1) * 60;
          let xC1 = Math.cos(nx / 180 * this.pi) * radiusO;
          let yC1 = Math.sin(nx / 180 * this.pi) * radiusO;
          const xC0 = xC1;
          const yC0 = yC1;
          xC1 = xC0 * Math.cos((-60) / 180 * this.pi) - yC0 * Math.sin((-60) / 180 * this.pi);
          yC1 = xC0 * Math.sin((-60) / 180 * this.pi) + yC0 * Math.cos((-60) / 180 * this.pi);

          switch (j) {
            case 1: {
              newTarget.xAlb1 = hexagon.xAlb0 + xC1;
              newTarget.yAlb1 = hexagon.yAlb0 + yC1;
              const temp1 = this.albersToLatLongCoordinate(newTarget.xAlb1, newTarget.yAlb1);
              newTarget.xLon1 = temp1.longitude;
              newTarget.yLat1 = temp1.latitude;
              hexagon.xLon1 = temp1.longitude;
              hexagon.yLat1 = temp1.latitude;
              break;
            }
            case 2: {
              newTarget.xAlb2 = hexagon.xAlb0 + xC1;
              newTarget.yAlb2 = hexagon.yAlb0 + yC1;
              const temp1 = this.albersToLatLongCoordinate(newTarget.xAlb2, newTarget.yAlb2);
              newTarget.xLon2 = temp1.longitude;
              newTarget.yLat2 = temp1.latitude;
              hexagon.xLon2 = temp1.longitude;
              hexagon.yLat2 = temp1.latitude;
              break;
            }
            case 3: {
              newTarget.xAlb3 = hexagon.xAlb0 + xC1;
              newTarget.yAlb3 = hexagon.yAlb0 + yC1;
              const temp1 = this.albersToLatLongCoordinate(newTarget.xAlb3, newTarget.yAlb3)
              newTarget.xLon3 = temp1.longitude;
              newTarget.yLat3 = temp1.latitude;
              hexagon.xLon3 = temp1.longitude;
              hexagon.yLat3 = temp1.latitude;
              break;
            }
            case 4: {
              newTarget.xAlb4 = hexagon.xAlb0 + xC1;
              newTarget.yAlb4 = hexagon.yAlb0 + yC1;
              const temp1 = this.albersToLatLongCoordinate(newTarget.xAlb4, newTarget.yAlb4)
              newTarget.xLon4 = temp1.longitude;
              newTarget.yLat4 = temp1.latitude;
              hexagon.xLon4 = temp1.longitude;
              hexagon.yLat4 = temp1.latitude;
              break;
            }
            case 5: {
              newTarget.xAlb5 = hexagon.xAlb0 + xC1;
              newTarget.yAlb5 = hexagon.yAlb0 + yC1;
              const temp1 = this.albersToLatLongCoordinate(newTarget.xAlb5, newTarget.yAlb5)
              newTarget.xLon5 = temp1.longitude;
              newTarget.yLat5 = temp1.latitude;
              hexagon.xLon5 = temp1.longitude;
              hexagon.yLat5 = temp1.latitude;
              break;
            }
            case 6: {
              newTarget.xAlb6 = hexagon.xAlb0 + xC1;
              newTarget.yAlb6 = hexagon.yAlb0 + yC1;
              const temp1 = this.albersToLatLongCoordinate(newTarget.xAlb6, newTarget.yAlb6);
              newTarget.xLon6 = temp1.longitude;
              newTarget.yLat6 = temp1.latitude;
              hexagon.xLon6 = temp1.longitude;
              hexagon.yLat6 = temp1.latitude;
              break;
            }
            default: {
              break;
            }
          }
        }
      }
      target19.push(newTarget);
    }
    /* Part 3 Determine the StrataID of the raw within the hexagon */
    for (let j = 1; j <= 19; j++) {
      for (let i = 1; i <= 157; i++) {
        const currentTarget19 = target19.find(item => item.index === j);
        const hexaPT = hexPTS.find(item => item.index === i);
        hexaPT.absX = currentTarget19.xAlb0 + hexaPT.offX;
        hexaPT.absY = currentTarget19.yAlb0 + hexaPT.offY;
      }
    }

    for (let i = 1; i <= 157; i++) {
      const hexaPT = hexPTS.find(item => item.index === i);
      hexaPT.absX = target.xAlb0 + hexaPT.offX;
      hexaPT.absY = target.yAlb0 + hexaPT.offY;
    }

    /* find closest strata point */
    dxyOLD = 1000;
    let dxyID = 0;
    for (let i = 62; i <= 157; i++) {
      const hexaPT = hexPTS.find(item => item.index == i);

      hexaPT.absX = target.xAlb0 + hexaPT.offX;
      hexaPT.absY = target.yAlb0 + hexaPT.offY;

      const dxy = Math.pow((Math.pow((hexaPT.absX - albersX0new), 2) + Math.pow((hexaPT.absY - albersY0new), 2)), 0.5);
      if (dxy < dxyOLD) {
        dxyOLD = dxy;
        dxyID = i;
      }
    }

    const hexPT = hexPTS.find(item => item.index == dxyID);
    const strataID = hexPT.ptID;

    return {
      target: target,
      strataID: strataID
    };
  }

  getHexRules(): any[] {
    return JSON.parse(JSON.stringify(hexRules)).default;
  }

}
