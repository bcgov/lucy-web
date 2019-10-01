import { Injectable } from '@angular/core';
import { AppRoutes, AppConstants } from '../constants';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router: Router) { }

  public get current(): AppRoutes {
    const current = this.router.url.substring(1);
    // is it a route with params
    if (current.indexOf(`/`) !== -1) {
      const origin = current.slice(0, current.indexOf(`/`));
      return this.resolveRoute(current);

      const genericOrigin = `${origin}/:id`;
      const result = this.stringToEnumRoute(genericOrigin);
      return result;
    } else {
      // Route with no params
      return this.stringToEnumRoute(current);
    }
  }

  public get isCreateRoute(): boolean {
    return (this.getFirstRouteParam().toLowerCase() === 'create');
  }

  public get isEditRoute(): boolean {
    return (this.getFirstRouteParam().toLowerCase() === 'edit');

  }

  public get isViewRoute(): boolean {
    return (this.getFirstRouteParam().toLowerCase() === 'view');
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
      case `mechnical`:
        return AppRoutes.AddMechanicalTreatment;
      default:
        console.log(`here`);
      // return AppRoutes.Error;
    }
  }

  private resolveEditRoute(route: string): AppRoutes {
    const editTypeAndId = route.slice(route.indexOf(`/`) + 1, route.length);
    const editId = editTypeAndId.slice(editTypeAndId.indexOf(`/`) + 1, editTypeAndId.length);
    const editType = editTypeAndId.slice(0, editTypeAndId.indexOf(`/`));
    switch (editType.toLowerCase()) {
      case `observation`:
        return AppRoutes.EditObservation;
      case `mechnical`:
        return AppRoutes.EditMechanicalTreatment;
      default:
        console.log(`here`);
        return AppRoutes.Error;
    }
  }

  private resolveViewRoute(route: string): AppRoutes {
    const viewTypeAndId = route.slice(route.indexOf(`/`) + 1, route.length);
    const viewId = viewTypeAndId.slice(viewTypeAndId.indexOf(`/`) + 1, viewTypeAndId.length);
    const viewType = viewTypeAndId.slice(0, viewTypeAndId.indexOf(`/`));
    switch (viewType.toLowerCase()) {
      case `observation`:
        return AppRoutes.ViewObservation;
      case `mechnical`:
        return AppRoutes.ViewMechanicalTreatment;
      default:
        console.log(`here`);
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

  public get events(): Observable<any> {
    return this.router.events;
  }

  public navigateTo(route: AppRoutes, id?: number) {
    if (id) {
      const routeWithId = route.replace(':id', `${id}`);
      this.router.navigate([routeWithId]);
    } else {
      this.router.navigate([route]);
    }
  }

  public get routeId(): number | undefined {
    const current = this.router.url.substring(1);
    console.log(`getting id... ${current}`);
    if (current.indexOf(`/`) !== -1) {
      const id = current.slice(current.lastIndexOf(`/`) + 1);
      console.log(id);
      return +id;
    } else {
      return undefined;
    }
  }

  public getAppRouteForAPI(api: string): AppRoutes {
    const apiWithBaseURL = `${AppConstants.API_baseURL}${api}`;
    switch (apiWithBaseURL) {
      case AppConstants.API_mechanicalTreatment:
        return AppRoutes.ViewMechanicalTreatment;
      case AppConstants.API_observation:
        return AppRoutes.ViewObservation;
      default:
        console.log(`${api} does not have a route`);
    }
    return undefined;
  }
}
