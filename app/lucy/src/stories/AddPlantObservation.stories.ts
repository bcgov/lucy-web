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
import { addDecorator, storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { AddPlantObservationComponent } from '../app/components/Routes/add-plant-observation/add-plant-observation.component';
import { SideNavComponent } from 'src/app/components/Routes/add-plant-observation/side-nav/side-nav.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AddPlantObservationBasicInformationComponent } from '../app/components/Routes/add-plant-observation/add-plant-observation-basic-information/add-plant-observation-basic-information.component';
// import { AddPlantObservationInvasivePlantSpeciesComponent } from '../app/components/Routes/add-plant-observation/add-plant-observation-invasive-plant-species/add-plant-observation-invasive-plant-species.component';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import { withCssResources } from '@storybook/addon-cssresources';
import { AddPlantObservationInvasivePlantSpeciesCellComponent } from 'src/app/components/Routes/add-plant-observation/add-plant-observation-invasive-plant-species-cell/add-plant-observation-invasive-plant-species-cell.component';



const stories = storiesOf('Storybook Knobs', module);
stories.addDecorator(withKnobs);


storiesOf('AddPlantObservationComponent', module)
 .addDecorator(
    moduleMetadata({
      declarations: [SideNavComponent,AddPlantObservationBasicInformationComponent,AddPlantObservationInvasivePlantSpeciesCellComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }),
  ).add('components', () => ({
  component: AddPlantObservationComponent,
  props: {},
}));
