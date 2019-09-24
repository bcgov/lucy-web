// Core
import { BrowserModule } from '@angular/platform-browser';
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

// Third-party
// ng-bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

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
import { SpeciesTableComponent } from './components/species-table/species-table.component';
import { AddPlantObservationComponent } from './components/Routes/add-plant-observation/add-plant-observation.component';
import { LoginComponent } from './components/Routes/login/login.component';
import { Injector } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SsoService } from './services/sso.service';
import { ProfileComponent } from './components/Routes/profile/profile.component';
import { UserInformationComponent } from './components/Routes/user-information/user-information.component';
import { AdminToolsComponent } from './components/Routes/admin-tools/admin-tools.component';
import { RouterService } from './services/router.service';
import { AccessRequestResponseModalComponent} from './components/Routes/admin-tools/access-request-response-modal/access-request-response-modal.component';
import { UserCellComponent } from './components/Routes/admin-tools/user-cell/user-cell.component';
import { RequestCellComponent } from './components/Routes/admin-tools/request-cell/request-cell.component';
import { AddPlantObservationBasicInformationComponent } from './components/Routes/add-plant-observation/add-plant-observation-basic-information/add-plant-observation-basic-information.component';
import { AppBootService } from './services/bootstrap.service';
import { UserAccessUpdatedModalComponent } from './components/Utilities/user-access-updated-modal/user-access-updated-modal.component';
import { AlertComponent } from './components/Utilities/alert/alert.component';
import { MapPreviewComponent } from './components/Utilities/map-preview/map-preview.component';
import { AddPlantObservationInvasivePlantSpeciesCellComponent } from './components/Routes/add-plant-observation/add-plant-observation-invasive-plant-species-cell/add-plant-observation-invasive-plant-species-cell.component';
import { DropdownComponent } from './components/Input/dropdown/dropdown.component';
import { FieldComponent } from './components/Input/field/field.component';
import { SideNavComponent } from './components/Routes/add-plant-observation/side-nav/side-nav.component';
import { MatSelectSearchComponent } from './components/Input/mat-select-search/mat-select-search.component';
import { MatSelectSearchModule } from './components/Input/mat-select-search/mat-select-search.module';
import { AddPlantObservationAdvancedDataComponent } from './components/Routes/add-plant-observation/add-plant-observation-advanced-data/add-plant-observation-advanced-data.component';
import { CheckboxComponent } from './components/Input/checkbox/checkbox.component';
import { AddEntryComponent } from './components/Routes/add-entry/add-entry.component';
import { AddMechanicalTreatmentComponent } from './components/Routes/add-mechanical-treatment/add-mechanical-treatment.component';
import { AddMechanicalTreatmentBasicInfoComponent } from './components/Routes/add-mechanical-treatment/add-mechanical-treatment-basic-info/add-mechanical-treatment-basic-info.component';
import { AddMechanicalTreatmentTreatmentDetailsComponent } from './components/Routes/add-mechanical-treatment/add-mechanical-treatment-treatment-details/add-mechanical-treatment-treatment-details.component';
import { DatePickerComponent } from './components/Input/date-picker/date-picker.component';
import { InventoryComponent } from './components/Routes/inventory/inventory.component';
import { ErrorComponent } from './components/Routes/error/error.component';
import { AddPlantObservationTreatmentsComponent } from './components/Routes/add-plant-observation/add-plant-observation-treatments/add-plant-observation-treatments.component';
import { BaseFormComponent } from './components/base-form/base-form.component';
import { DiffViewerComponent } from './components/Utilities/diff-viewer/diff-viewer.component';
import { AddMechanicalTreatmentAdvancedComponent } from './components/Routes/add-mechanical-treatment/add-mechanical-treatment-advanced/add-mechanical-treatment-advanced.component';
import { LocationInputComponent } from './components/base-form/location-input/location-input/location-input.component';

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
    UserAccessUpdatedModalComponent,
    AlertComponent,
    MapPreviewComponent,
    AddPlantObservationInvasivePlantSpeciesCellComponent,
    DropdownComponent,
    FieldComponent,
    SideNavComponent,
    InventoryComponent,
    DatePickerComponent,
    MomentPipe,
    MatSelectSearchComponent,
    AddPlantObservationAdvancedDataComponent,
    CheckboxComponent,
    ErrorComponent,
    AddEntryComponent,
    AddMechanicalTreatmentComponent,
    AddMechanicalTreatmentBasicInfoComponent,
    AddMechanicalTreatmentTreatmentDetailsComponent,
    AddPlantObservationTreatmentsComponent,
    BaseFormComponent,
    DiffViewerComponent,
    AddMechanicalTreatmentAdvancedComponent,
    LocationInputComponent,
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
    InViewportModule,
    LottieAnimationViewModule.forRoot(),
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule
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
