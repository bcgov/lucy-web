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
// Core
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';

// Others
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Material
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatToolbarModule } from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';

// Third-party
// ng-bootstrap
import {NgbModule, NgbModal} from '@ng-bootstrap/ng-bootstrap';

// ngx-material-timepicker
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

// InViewportModule
import { InViewportModule } from 'ng-in-viewport';

// Cookies
import { CookieService } from 'ngx-cookie-service';

import { MomentPipe } from './pipes/MomentPipe';

// Lottie
import { LottieAnimationViewModule } from 'ng-lottie';

// Application
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { HomeComponent } from './components/Routes/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoginComponent } from './components/Routes/login/login.component';
import { Injector } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SsoService } from './services/sso.service';
import { ProfileComponent } from './components/Routes/profile/profile.component';
import { UserInformationComponent } from './components/Routes/user-information/user-information.component';
import { AboutComponent } from './components/Routes/about/about.component';
import { AdminToolsComponent } from './components/Routes/admin-tools/admin-tools.component';
import { RouterService } from './services/router.service';
import { AddQuickObservationModalComponent } from './components/Utilities/add-quick-observation-modal/add-quick-observation-modal.component';
import { AppBootService } from './services/bootstrap.service';
import { UserAccessUpdatedModalComponent } from './components/Utilities/user-access-updated-modal/user-access-updated-modal.component';
import { AlertComponent } from './components/Utilities/alert/alert.component';
import { MapPreviewComponent } from './components/Utilities/map-preview/map-preview.component';
import { DropdownComponent } from './components/Input/dropdown/dropdown.component';
import { FieldComponent } from './components/Input/field/field.component';
import { MatSelectSearchModule } from './components/Input/mat-select-search/mat-select-search.module';
import { CheckboxComponent } from './components/Input/checkbox/checkbox.component';
import { AddEntryComponent } from './components/Routes/add-entry/add-entry.component';
import { DatePickerComponent } from './components/Input/date-picker/date-picker.component';
import { DateTimePickerComponent } from './components/Input/date-time-picker/date-time-picker.component';
import { SpeciesTreatedComponent } from './components/Routes/species-treated/species-treated.component';
import { HerbicideApplicationComponent } from './components/Routes/herbicide-application/herbicide-application.component';
import { TreatmentDetailsComponent } from './components/Routes/treatment-details/treatment-details.component';
import { InventoryComponent } from './components/Routes/inventory/inventory.component';
import { ErrorComponent } from './components/Routes/error/error.component';
import { BaseFormComponent } from './components/base-form/base-form.component';
import { DiffViewerComponent } from './components/Utilities/diff-viewer/diff-viewer.component';
import { LocationInputComponent } from './components/base-form/location-input/location-input/location-input.component';
import { ComputedFieldComponent } from './components/base-form/computed-field/computed-field.component';
import { TableComponent } from './components/base-form/table/table.component';
import { ToastComponent } from './components/Utilities/toast/toast.component';
import { UserTableComponent } from './components/Routes/admin-tools/user-table/user-table.component';
import { RequestTableComponent } from './components/Routes/admin-tools/request-table/request-table.component';
import { ModalComponent } from './components/Utilities/modal/modal.component';
import { RequestModalComponent } from './components/Routes/admin-tools/request-modal/request-modal.component';
import { ClickAwayDirective } from './directives/click-away/click-away.directive';
import { ElementFocusDirective } from './directives/element-focus/element-focus.directive';
import { WaypointModalComponent } from './components/base-form/waypoint/waypoint-modal/waypoint-modal.component';
import { WaypointInfoComponent } from './components/base-form/waypoint/waypoint-info/waypoint-info.component';
import { WaypointTextEntryComponent } from './components/base-form/waypoint/waypoint-text-entry/waypoint-text-entry.component';

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
    LoginComponent,
    ProfileComponent,
    AboutComponent,
    UserInformationComponent,
    AdminToolsComponent,
    AddQuickObservationModalComponent,
    UserAccessUpdatedModalComponent,
    AlertComponent,
    MapPreviewComponent,
    DropdownComponent,
    FieldComponent,
    InventoryComponent,
    SpeciesTreatedComponent,
    HerbicideApplicationComponent,
    TreatmentDetailsComponent,
    DatePickerComponent,
    DateTimePickerComponent,
    MomentPipe,
    CheckboxComponent,
    ErrorComponent,
    AddEntryComponent,
    BaseFormComponent,
    DiffViewerComponent,
    LocationInputComponent,
    ComputedFieldComponent,
    TableComponent,
    ToastComponent,
    UserTableComponent,
    RequestTableComponent,
    ModalComponent,
    RequestModalComponent,
    ClickAwayDirective,
    ElementFocusDirective,
    WaypointModalComponent,
    WaypointInfoComponent,
    WaypointTextEntryComponent
  ],
  entryComponents: [
    AddQuickObservationModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxMaterialTimepickerModule,
    RouterModule,
    InViewportModule,
    LottieAnimationViewModule.forRoot(),
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatSelectSearchModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatRadioModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    CookieService,
    SsoService,
    RouterService,
    Title,
    AppBootService,
    NgbModal,
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
