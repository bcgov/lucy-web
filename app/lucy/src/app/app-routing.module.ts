import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// App routes enum
import { AppRoutes} from './constants/app-routes.enum'

// Local
import { HomeComponent } from './components/home/home.component';
import { SpeciesDetailsComponent} from './components/species-details/species-details.component'
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { UserInformationComponent } from './components/user-information/user-information.component';
import { AppComponent } from './components/app.component';

const routes: Routes = [
  { path: AppRoutes.Login, component: LoginComponent},
  { path: AppRoutes.Profile, component: ProfileComponent},
  { path: AppRoutes.UserInfo, component: UserInformationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, ProfileComponent, UserInformationComponent]