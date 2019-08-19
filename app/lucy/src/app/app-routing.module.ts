import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// App routes enum
import { AppRoutes} from './constants/app-routes.enum';

// Local
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { UserInformationComponent } from './components/user-information/user-information.component';
import { AdminToolsComponent } from './components/admin-tools/admin-tools.component';
import { AddPlantObservationComponent } from './components/add-plant-observation/add-plant-observation.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ErrorComponent } from './components/error/error.component';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { AddMechanicalTreatmentComponent } from './components/add-mechanical-treatment/add-mechanical-treatment.component';

const routes: Routes = [
  { path: AppRoutes.Login, component: LoginComponent},
  { path: AppRoutes.Profile, component: ProfileComponent},
  { path: AppRoutes.UserInfo, component: UserInformationComponent},
  { path: AppRoutes.AdminTools , component: AdminToolsComponent },
  { path: AppRoutes.AddEntry , component: AddEntryComponent},
  { path: AppRoutes.AddMechanicalTreatment , component: AddMechanicalTreatmentComponent},
  { path: AppRoutes.AddObservation , component: AddPlantObservationComponent},
  { path: AppRoutes.ViewObservation , component: AddPlantObservationComponent},
  { path: AppRoutes.EditObservation , component: AddPlantObservationComponent},
  { path: AppRoutes.Inventory , component: InventoryComponent},
  { path: AppRoutes.Error , component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, ProfileComponent, UserInformationComponent]