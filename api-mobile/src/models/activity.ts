import { parseBase64DataURLString } from '../utils/file-utils';

/**
 * A single media item.
 *
 * @export
 * @interface IMediaItem
 */
export interface IMediaItem {
  fileName: string;
  encodedFile: string;
}

/**
 * Media object for Data URL base64 encoded files.
 *
 * @export
 * @class MediaBase64
 */
export class MediaBase64 {
  fileName: string;
  contentType: string;
  contentString: string;
  fileBuffer: Buffer;

  /**
   * Creates an instance of MediaBase64.
   *
   * @param {IMediaItem} obj
   * @memberof MediaBase64
   */
  constructor(obj: IMediaItem) {
    const base64StringParts = parseBase64DataURLString(obj.encodedFile);

    if (!base64StringParts) {
      throw new Error('encodedFile could not be parsed');
    }

    this.contentType = base64StringParts.contentType;
    this.contentString = base64StringParts.contentType;
    this.fileName = obj.fileName;
    this.fileBuffer = Buffer.from(base64StringParts.contentString, 'base64');
  }
}

/**
 * Activity post body.
 *
 * @export
 * @class ActivityPostBody
 */
export class ActivityPostBody {
  activityPostBody: object;
  activityResponseBody: object;

  activityType: string;
  activityTypeData: object;

  activitySubType: string;
  activitySubTypeData: object;

  date: string;

  locationAndGeometry: object;

  mediaKeys: string[];

  /**
   * Creates an instance of ActivityPostBody.
   *
   * @param {*} [obj]
   * @memberof ActivityPostBody
   */
  constructor(obj?: any) {
    // Add whole original object for auditing
    this.activityPostBody = {
      ...obj,
      // Strip out any media base64 strings which would convolute the record
      media: (obj.media && obj.media.map((item: MediaBase64) => item.fileName)) || []
    };

    this.activityType = (obj && obj.activityType) || null;
    this.activityTypeData = (obj && obj.activityTypeData) || null;

    this.activitySubType = (obj && obj.activitySubType) || null;
    this.activitySubTypeData = (obj && obj.activitySubTypeData) || null;

    this.date = (obj && obj.date) || null;

    this.locationAndGeometry = (obj && obj.locationAndGeometry) || null;

    this.mediaKeys = (obj && obj.mediaKeys) || null;
  }
}
