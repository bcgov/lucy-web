import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { AddPlantObservationComponent } from '../app/components/add-plant-observation/add-plant-observation.component';
import { SideNavComponent } from 'src/app/components/add-plant-observation/side-nav/side-nav.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';






storiesOf('AddPlantObservationComponent', module)
 .addDecorator(
    moduleMetadata({
      declarations: [],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }),
  ).add('components', () => ({
  component: AddPlantObservationComponent,
  props: {},
}));
