import { AppRoutes} from '../constants/app-routes.enum';
import { RemoteAPIStatus } from '../models';
import { HttpHeaders } from '@angular/common/http';


export class Utility {
   // Share Instance
   private static instance: Utility;


   // Get Share Instance
   public static getInstance() {
       return this.instance || (this.instance = new this());
   }

   public appRoute(route: AppRoutes): string {
       return `/${route}`;
   }

   public createAPIStatus(status: boolean, message: string): RemoteAPIStatus {
       const apiStatus: RemoteAPIStatus = {
           success: status,
           message: message
       };
       return apiStatus;
   }

}

export const UtilityService = Utility.getInstance();
