import { addDecorator, storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { AddPlantObservationComponent } from '../app/components/add-plant-observation/add-plant-observation.component';
import { SideNavComponent } from 'src/app/components/add-plant-observation/side-nav/side-nav.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AddPlantObservationBasicInformationComponent } from '../app/components/add-plant-observation/add-plant-observation-basic-information/add-plant-observation-basic-information.component';
import { AddPlantObservationInvasivePlantSpeciesComponent } from '../app/components/add-plant-observation/add-plant-observation-invasive-plant-species/add-plant-observation-invasive-plant-species.component';
//import {MatButtonModule, MatIconModule} from '@angular/material';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import { withCssResources } from '@storybook/addon-cssresources';

addDecorator(withCssResources)

const stories = storiesOf('Storybook Knobs', module);

stories.addDecorator(withKnobs);

storiesOf('AddPlantObservationComponent', module)
 .addDecorator(
    moduleMetadata({
      declarations: [SideNavComponent,AddPlantObservationBasicInformationComponent,AddPlantObservationInvasivePlantSpeciesComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }),
  ).add('components', () => ({
  component: AddPlantObservationComponent,
  props: {},
}));
