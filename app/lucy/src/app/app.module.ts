// Core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Others
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Third-party
// ng-bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// Date picker
import {DpDatePickerModule} from 'ng2-date-picker';

// Cookies
import { CookieService } from 'ngx-cookie-service';

// Application
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SpeciesDetailsComponent } from './components/species-details/species-details.component';
import { SpeciesTableComponent } from './components/species-table/species-table.component';
import { AddPlantObservationComponent } from './components/add-plant-observation/add-plant-observation.component';
import { LoginComponent } from './components/login/login.component';
import { Injector } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SsoService } from './services/sso.service';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    SpeciesDetailsComponent,
    SpeciesTableComponent,
    AddPlantObservationComponent,
    LoginComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    DpDatePickerModule,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CookieService, SsoService],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private injector: Injector) {
  }
}
