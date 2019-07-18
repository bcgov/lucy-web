import { Injectable } from '@angular/core';
import { AppRoutes } from '../constants';
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
      const genericOrigin = `${origin}/:id`;
      return this.stringToEnumRoute(genericOrigin);
    } else {
      // Route with no params
      return this.stringToEnumRoute(current);
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
    if (current.indexOf(`/`) !== -1) {
      const id = current.slice(current.indexOf(`/`) + 1);
      return +id;
    } else {
      return undefined;
    }
  }
}
