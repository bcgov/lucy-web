// Core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';

// Others
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Third-party
// ng-bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// Cookies
import { CookieService } from 'ngx-cookie-service';

// Application
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SpeciesTableComponent } from './components/species-table/species-table.component';
import { AddPlantObservationComponent } from './components/add-plant-observation/add-plant-observation.component';
import { LoginComponent } from './components/login/login.component';
import { Injector } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SsoService } from './services/sso.service';
import { ProfileComponent } from './components/profile/profile.component';
import { UserInformationComponent } from './components/user-information/user-information.component';
import { AdminToolsComponent } from './components/admin-tools/admin-tools.component';
import { RouterService } from './services/router.service';
import { AccessRequestResponseModalComponent} from './components/admin-tools/access-request-response-modal/access-request-response-modal.component';
import { UserCellComponent } from './components/admin-tools/user-cell/user-cell.component';
import { RequestCellComponent } from './components/admin-tools/request-cell/request-cell.component';
import { AddPlantObservationBasicInformationComponent } from './components/add-plant-observation/add-plant-observation-basic-information/add-plant-observation-basic-information.component';
import { AddPlantObservationInvasivePlantSpeciesComponent } from './components/add-plant-observation/add-plant-observation-invasive-plant-species/add-plant-observation-invasive-plant-species.component';
import { AppBootService } from './services/bootstrap.service';
import { UserAccessUpdatedModalComponent } from './components/user-access-updated-modal/user-access-updated-modal.component';
import { AlertComponent } from './components/alert/alert.component';
import { MapPreviewComponent } from './components/map-preview/map-preview.component';
import { AddPlantObservationInvasivePlantSpeciesCellComponent } from './components/add-plant-observation/add-plant-observation-invasive-plant-species-cell/add-plant-observation-invasive-plant-species-cell.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { FieldComponent } from './components/field/field.component';
import { SideNavComponent } from './components/add-plant-observation/side-nav/side-nav.component';

/**
 * @description Bootstrapping initial service call of the application
 */
export const bootstrapFactory = (bootStrapper: AppBootService) => {
  return () => bootStrapper.loadConfig();
};
@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HomeComponent,
    NavBarComponent,
    SpeciesTableComponent,
    AddPlantObservationComponent,
    LoginComponent,
    ProfileComponent,
    UserInformationComponent,
    AdminToolsComponent,
    AccessRequestResponseModalComponent,
    UserCellComponent,
    RequestCellComponent,
    AddPlantObservationBasicInformationComponent,
    AddPlantObservationInvasivePlantSpeciesComponent,
    UserAccessUpdatedModalComponent,
    AlertComponent,
    MapPreviewComponent,
    AddPlantObservationInvasivePlantSpeciesCellComponent,
    DropdownComponent,
    FieldComponent,
    SideNavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    CookieService,
    SsoService,
    RouterService,
    AppBootService,
    {
      provide: APP_INITIALIZER,
      useFactory: bootstrapFactory,
      deps: [AppBootService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
  }
}
