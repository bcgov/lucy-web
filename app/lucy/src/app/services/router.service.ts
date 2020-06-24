/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Injectable } from '@angular/core';
import { AppRoutes, AppConstants } from '../constants';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router: Router, private alert: AlertService) {
    this.preventReload();
   }

  public get current(): AppRoutes {
    const current = this.router.url.substring(1);
    // is it a route with params
    if (current.indexOf(`/`) !== -1) {
      // const origin = current.slice(0, current.indexOf(`/`));
      return this.resolveRoute(current);
      // const genericOrigin = `${origin}/:id`;
      // const result = this.stringToEnumRoute(genericOrigin);
      // return result;
    } else {
      // Route with no params
      return this.stringToEnumRoute(current);
    }
  }

  public get isCreateRoute(): boolean {
    if (this.getFirstRouteParam()) {
      return (this.getFirstRouteParam().toLowerCase() === 'create');
    } else {
      return false;
    }
  }

  public get isEditRoute(): boolean {
    if (this.getFirstRouteParam()) {
      return (this.getFirstRouteParam().toLowerCase() === 'edit');
    } else {
      return false;
    }
  }

  public get isViewRoute(): boolean {
    if (this.getFirstRouteParam()) {
      return (this.getFirstRouteParam().toLowerCase() === 'view');
    } else {
      return false;
    }
  }

  private getFirstRouteParam(): string {
    const temp1 = this.router.url.substring(1);
    // is it a route with params
    if (temp1.indexOf(`/`) !== -1) {
      const temp2 = temp1.slice(0, temp1.indexOf(`/`));
      return temp2;
    } else {
      return undefined;
    }
  }

  private resolveRoute(route: string): AppRoutes {
    const routeType = route.slice(0, route.indexOf(`/`));
    switch (routeType.toLowerCase()) {
      case `create`:
        return this.resolveCreateRoute(route);
      case `edit`:
        return this.resolveEditRoute(route);
      case `view`:
        return this.resolveViewRoute(route);
    }
  }

  private resolveCreateRoute(route: string): AppRoutes {
    const createType = route.slice(route.indexOf(`/`) + 1, route.length);
    if (!createType) {
      // TODO: Handle
      return AppRoutes.Error;
    }
    switch (createType.toLowerCase()) {
      case `observation`:
        return AppRoutes.AddObservation;
      case `mechanical`:
        return AppRoutes.AddMechanicalTreatment;
      case 'chemical':
        return AppRoutes.AddChemicalTreatment;
      case `monitor/mechanical`:
        return AppRoutes.AddMechanicalMonitor;
      case 'animal/observation':
        return AppRoutes.AddAnimalObservation;
      default:
        return AppRoutes.Error;
    }
  }

  private resolveEditRoute(route: string): AppRoutes {
    const editTypeAndId = route.slice(route.indexOf(`/`) + 1, route.length);
    // const editId = editTypeAndId.slice(editTypeAndId.indexOf(`/`) + 1, editTypeAndId.length);
    const editType = editTypeAndId.slice(0, editTypeAndId.lastIndexOf(`/`));
    switch (editType.toLowerCase()) {
      case `observation`:
        return AppRoutes.EditObservation;
      case `mechanical`:
        return AppRoutes.EditMechanicalTreatment;
      case 'chemical':
        return AppRoutes.EditChemicalTreatment;
      case 'monitor/mechanical':
        return AppRoutes.EditMechanicalMonitor;
      case 'animal/observation':
        return AppRoutes.EditAnimalObservation;
      default:
        return AppRoutes.Error;
    }
  }

  private resolveViewRoute(route: string): AppRoutes {
    const viewTypeAndId = route.slice(route.indexOf(`/`) + 1, route.length);
    // const viewId = viewTypeAndId.slice(viewTypeAndId.indexOf(`/`) + 1, viewTypeAndId.length);
    const viewType = viewTypeAndId.slice(0, viewTypeAndId.lastIndexOf(`/`));
    switch (viewType.toLowerCase()) {
      case `observation`:
        return AppRoutes.ViewObservation;
      case `mechanical`:
        return AppRoutes.ViewMechanicalTreatment;
      case 'chemical':
        return AppRoutes.ViewChemicalTreatment;
      case 'monitor/mechanical':
        return AppRoutes.ViewMechanicalMonitor;
      case 'animal/observation':
        return AppRoutes.ViewAnimalObservation;
      default:
        return AppRoutes.Error;
    }
  }

  private stringToEnumRoute(string: string): AppRoutes | undefined {
    for (const value of Object.keys(AppRoutes)) {
      if (AppRoutes[value] === string) {
        return AppRoutes[value];
      }
    }
    return undefined;
  }

  public getRouteNamed(string: string): AppRoutes {
    return this.stringToEnumRoute(string) ? this.stringToEnumRoute(string) : undefined;
  }

  public get events(): Observable<any> {
    return this.router.events;
  }

  public async navigateTo(route: AppRoutes, id?: number, allowWarning?: boolean) {
    if (allowWarning && allowWarning === true) {
      const shouldNavigate = await this.shouldLeaveDialog();
      if (!shouldNavigate) {
        return;
      }
    }
    if (id) {
      const routeWithId = route.replace(':id', `${id}`);
      this.router.navigate([routeWithId]);
    } else {
      this.router.navigate([route]);
    }
  }

  public get routeId(): number | undefined {
    const current = this.router.url.substring(1);
    // console.log(`getting id... ${current}`);
    if (current.indexOf(`/`) !== -1) {
      const id = current.slice(current.lastIndexOf(`/`) + 1);
      // console.log(id);
      return +id;
    } else {
      return;
    }
  }

  public getAppRouteForAPI(api: string): AppRoutes {
    const apiWithBaseURL = `${AppConstants.API_baseURL}${api}`;
    switch (apiWithBaseURL) {
      case AppConstants.API_mechanicalTreatment:
        return AppRoutes.ViewMechanicalTreatment;
      case AppConstants.API_observation:
        return AppRoutes.ViewObservation;
      case AppConstants.API_chemicalTreatment:
        return AppRoutes.ViewChemicalTreatment;
      case AppConstants.API_mechanicalMonitor:
        return AppRoutes.ViewMechanicalMonitor;
      case AppConstants.API_Form_Animal_Observation:
        return AppRoutes.ViewAnimalObservation;
      default:
        console.log(`${api} does not have a route`);
    }
    return;
  }

  private preventReload() {
    window.addEventListener(`beforeunload`, (event) => {
      if (this.isCreateRoute || this.isEditRoute) {
        // Cancel the event as stated by the standard.
        event.preventDefault();
        // Chrome requires returnValue to be set.
        event.returnValue = 'Your changes will be lost';
        return 'Your changes will be lost';
      }
    });
  }

  private async shouldLeaveDialog(): Promise<boolean> {
    return (this.isCreateRoute || this.isEditRoute) ?
      this.alert.showConfirmation(`Are you sure?`, 'If you leave this page, your changes will be lost', `Leave Page`, `Stay`)
      : true;
  }

  /**
   * Store current route in session.
   */
  public storeCurrentRouteInSession() {
    if (this.current.length > 0) {
      localStorage.setItem('lastRoute', this.current);
      localStorage.setItem('lastRouteID', String(this.routeId));
    }
  }

  /**
   * Get the lastRoute specified in session storage (if exists).
   * @returns AppRoute or Undefined
   */
  public getLastRouteInSession(): AppRoutes | undefined {
    const lastRoute = localStorage.getItem('lastRoute');
    if (lastRoute && this.getRouteNamed(lastRoute)) {
      return this.getRouteNamed(lastRoute);
    } else {
      return undefined;
    }
  }

  /**
   * Get the lastRouteId specified in session storage (if exists).
   * @returns string or undefined
   */
  public getLastRouteIDInSession(): string | undefined {
    const lastRouteID = localStorage.getItem('lastRouteID');
    return lastRouteID;
  }

  /**
   * Removes the lastRoute key stored in session storage.
   */
  public clearLastRouteInSession() {
    sessionStorage.removeItem('lastRoute');
  }
}
