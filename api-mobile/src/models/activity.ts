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
  geom: object;

  constructor(obj?: any) {
    this.activityType = (obj && obj.activityType) || null;
    this.activitySubType = (obj && obj.activitySubType) || null;
    this.date = (obj && obj.date) || null;
    this.locationAndGeometry = (obj && obj.locationAndGeometry) || null;
    this.activityPostBody = null;
    this.activityTypeData = (obj && obj.activityTypeData) || null;
    this.activitySubTypeData = (obj && obj.activitySubTypeData) || null;
    this.geom = (obj && obj.geom) || null;
  }
}
