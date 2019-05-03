import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// App routes enum
import { AppRoutes} from './constants/app-routes.enum'

// Local
import { HomeComponent } from './components/home/home.component';
import { SpeciesDetailsComponent} from './components/species-details/species-details.component'

const routes: Routes = [
  {
    path: AppRoutes.Root,
    component: HomeComponent
  },
  {
    path: AppRoutes.Detail,
    component: SpeciesDetailsComponent
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
