import { parseBase64DataURLString } from './../utils/file-utils';

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
 * Activity post request body.
 *
 * @export
 * @class ActivityPostRequestBody
 */
export class ActivityPostRequestBody {
  activityPostBody: object;
  activityResponseBody: object;

  activity_type: string;
  activity_subtype: string;

  activity_data: object;
  activity_type_data: object;
  activity_subtype_data: object;

  received_timestamp: string;

  geometry: object[];

  mediaKeys: string[];

  /**
   * Creates an instance of ActivityPostRequestBody.
   *
   * @param {*} [obj]
   * @memberof ActivityPostRequestBody
   */
  constructor(obj?: any) {
    // Add whole original object for auditing
    this.activityPostBody = {
      ...obj,
      // Strip out any media base64 strings which would convolute the record
      media: (obj.media && obj.media.map((item: MediaBase64) => item.fileName)) || []
    };

    this.activity_type = (obj && obj.activity_type) || null;
    this.activity_subtype = (obj && obj.activity_subtype) || null;

    this.activity_data = (obj && obj.form_data && obj.form_data.activity_data) || null;
    this.activity_type_data = (obj && obj.form_data && obj.form_data.activity_type_data) || null;
    this.activity_subtype_data = (obj && obj.form_data && obj.form_data.activity_subtype_data) || null;

    this.received_timestamp = new Date().toISOString();

    this.geometry = (obj && obj.geometry && obj.geometry.length) || [];

    this.mediaKeys = (obj && obj.mediaKeys) || null;
  }
}

/**
 * Activity get search criteria object.
 *
 * @export
 * @class ActivitySearchCriteria
 */
export class ActivitySearchCriteria {
  activity_type: string;
  activity_subtype: string;

  page: number;
  limit: number;

  date_range_start: Date;
  date_range_end: Date;

  includeMedia: boolean;

  /**
   * Creates an instance of ActivitySearchCriteria.
   *
   * @param {*} [obj]
   * @memberof ActivitySearchCriteria
   */
  constructor(obj?: any) {
    this.activity_type = (obj && obj.activity_type) || null;
    this.activity_subtype = (obj && obj.activity_subtype) || null;

    this.page = (obj && obj.page) || 0;
    this.limit = (obj && obj.limit) || 50;

    this.date_range_start = (obj && obj.date_range_start) || null;
    this.date_range_end = (obj && obj.date_range_end) || null;

    this.includeMedia = (obj && obj.includeMedia) || false;
  }
}
