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




// Application
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { GoogleSigninComponent } from './components/google-signin/google-signin.component';
import { SpeciesDetailsComponent } from './components/species-details/species-details.component';
import { SpeciesTableComponent } from './components/species-table/species-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    GoogleSigninComponent,
    SpeciesDetailsComponent,
    SpeciesTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    DpDatePickerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
