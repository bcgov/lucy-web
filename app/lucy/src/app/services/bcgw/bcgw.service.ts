import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from '../api.service';
import { AppConstants } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class BcgwService {

  constructor(private api: ApiService) { }

  /**
   * Get Distance to the nearest well to the lat/long specified.
   */
  public async getWellProximity(latitude: number, longitude: number): Promise<string | null> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_BCGW_wellProximity(latitude, longitude), null);
    if (response.success) {
      return response.response;
    } else {
      return null;
    }
  }
}
