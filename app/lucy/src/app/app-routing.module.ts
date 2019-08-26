import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// App routes enum
import { AppRoutes} from './constants/app-routes.enum';

// Local
import { ProfileComponent } from './components/Routes/profile/profile.component';
import { LoginComponent } from './components/Routes/login/login.component';
import { UserInformationComponent } from './components/Routes/user-information/user-information.component';
import { AdminToolsComponent } from './components/Routes/admin-tools/admin-tools.component';
import { AddPlantObservationComponent } from './components/Routes/add-plant-observation/add-plant-observation.component';
import { ErrorComponent } from './components/Routes/error/error.component';
import { AddEntryComponent } from './components/Routes/add-entry/add-entry.component';
import { AddMechanicalTreatmentComponent } from './components/Routes/add-mechanical-treatment/add-mechanical-treatment.component';
import { InventoryComponent } from './components/Routes/inventory/inventory.component';

const routes: Routes = [
  { path: AppRoutes.Login, component: LoginComponent},
  { path: AppRoutes.Profile, component: ProfileComponent},
  { path: AppRoutes.UserInfo, component: UserInformationComponent},
  { path: AppRoutes.AdminTools , component: AdminToolsComponent },
  { path: AppRoutes.AddEntry , component: AddEntryComponent},
  { path: AppRoutes.AddMechanicalTreatment , component: AddMechanicalTreatmentComponent},
  { path: AppRoutes.ViewMechanicalTreatment , component: AddMechanicalTreatmentComponent},
  { path: AppRoutes.EditMechanicalTreatment , component: AddMechanicalTreatmentComponent},
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