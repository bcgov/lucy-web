/**
 * activity post body.
 *
 * @export
 * @class ActivityPostBody
 */
export class ActivityPostBody {
  type: string;
  subType: string;
  date: string;
  locationAndGeometry: object;
  data: object;

  constructor(obj?: any) {
    this.type = (obj && obj.type) || null;
    this.subType = (obj && obj.subType) || null;
    this.date = (obj && obj.date) || null;
    this.locationAndGeometry = (obj && obj.locationAndGeometry) || null;
    this.data = (obj && obj.data) || null;
  }
}
