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
    return AppRoutes[<keyof typeof AppRoutes> this.router.url.substring(1)];
  }

  public get events(): Observable<any> {
    return this.router.events;
  }

  public navigateTo(route: AppRoutes) {
    this.router.navigate([route]);
  }
}
