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
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// App routes enum
import { AppRoutes} from './constants/app-routes.enum';

// Local
import { ProfileComponent } from './components/Routes/profile/profile.component';
import { LoginComponent } from './components/Routes/login/login.component';
import { UserInformationComponent } from './components/Routes/user-information/user-information.component';
import { AdminToolsComponent } from './components/Routes/admin-tools/admin-tools.component';
import { ErrorComponent } from './components/Routes/error/error.component';
import { AddEntryComponent } from './components/Routes/add-entry/add-entry.component';
import { InventoryComponent } from './components/Routes/inventory/inventory.component';
import { BaseFormComponent } from './components/base-form/base-form.component';
import { AboutComponent } from './components/Routes/about/about.component';

const routes: Routes = [
  { path: AppRoutes.Login, component: LoginComponent},
  { path: AppRoutes.Profile, component: ProfileComponent},
  { path: AppRoutes.UserInfo, component: UserInformationComponent},
  { path: AppRoutes.AdminTools , component: AdminToolsComponent },
  { path: AppRoutes.About, component: AboutComponent },
  { path: AppRoutes.AddEntry , component: AddEntryComponent},
  //
  { path: AppRoutes.AddChemicalTreatment , component: BaseFormComponent},
  { path: AppRoutes.ViewChemicalTreatment , component: BaseFormComponent},
  { path: AppRoutes.EditChemicalTreatment , component: BaseFormComponent},
  //
  { path: AppRoutes.AddMechanicalTreatment , component: BaseFormComponent},
  { path: AppRoutes.ViewMechanicalTreatment , component: BaseFormComponent},
  { path: AppRoutes.EditMechanicalTreatment , component: BaseFormComponent},
  //
  { path: AppRoutes.AddMechanicalMonitor , component: BaseFormComponent },
  { path: AppRoutes.ViewMechanicalMonitor , component: BaseFormComponent },
  { path: AppRoutes.EditMechanicalMonitor , component: BaseFormComponent },
  //
  { path: AppRoutes.AddObservation , component: BaseFormComponent},
  { path: AppRoutes.ViewObservation , component: BaseFormComponent},
  { path: AppRoutes.EditObservation , component: BaseFormComponent},
  //
  { path: AppRoutes.AddAnimalObservation , component: BaseFormComponent},
  { path: AppRoutes.ViewAnimalObservation , component: BaseFormComponent},
  { path: AppRoutes.EditAnimalObservation , component: BaseFormComponent},
  //
  { path: AppRoutes.base , component: BaseFormComponent},
  { path: AppRoutes.Inventory , component: InventoryComponent},
  { path: AppRoutes.Error , component: ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, ProfileComponent, UserInformationComponent];