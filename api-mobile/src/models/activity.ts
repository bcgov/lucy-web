/**
 * Activity post body.
 *
 * @export
 * @class ActivityPostBody
 */
export class ActivityPostBody {
  activityType: string;
  activitySubType: string;
  date: string;
  locationAndGeometry: object;
  activityPostBody: object;
  activityResponseBody: object;
  activityTypeData: object;
  activitySubTypeData: object;

  constructor(obj?: any) {
    this.activityType = (obj && obj.type) || null;
    this.activitySubType = (obj && obj.subType) || null;
    this.date = (obj && obj.date) || null;
    this.locationAndGeometry = (obj && obj.locationAndGeometry) || null;
    this.activityPostBody = null;
    this.activityTypeData = (obj && obj.data) || null;
    this.activitySubTypeData = (obj && obj.data) || null;
  }
}
