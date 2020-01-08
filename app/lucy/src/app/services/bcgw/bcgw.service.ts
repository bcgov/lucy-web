import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from '../api.service';
import { AppConstants } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class BcgwService {

  constructor(private api: ApiService) { }

  /**
   * Get the nearest well to the lat/long specified.
   * @param latitude latitude of location
   * @param longitude longitude of location
   */
  public async findClosestWell(latitude: number, longitude: number): Promise<any | null> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_BCGW_wellProximity(latitude, longitude), null);
    if (response.success) {
      return response.response;
    } else {
      return null;
    }
  }

  /**
   * Get the distance to the closes well rounded to 2 decimal places
   * @param latitude latitude of location
   * @param longitude longitude of location
   */
  public async findDistanceToClosestWell(latitude: number, longitude: number): Promise<number | null> {
    const well = await this.findClosestWell(latitude, longitude);
    if (well !== null && well.properties !== undefined && well.properties.distance !== undefined) {
      return well.properties.distance.toFixed(2);
    } else {
      return null;
    }
  }
}
