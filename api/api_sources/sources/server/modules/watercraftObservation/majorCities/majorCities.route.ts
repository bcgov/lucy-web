/**
 * Imports
 */
import {
  // SecureRouteController,
  ResourceRoute,
  CreateMiddleware,
  ResourceRouteController,
  writerOnlyRoute,
  UpdateMiddleware,
} from '../../../core';
import {
  MajorCityController,
  MajorCitySpec,
} from '../../../../database/models';
@ResourceRoute({
  dataController: MajorCityController.shared,
  secure: true,
})
@CreateMiddleware(() => [writerOnlyRoute()])
@UpdateMiddleware(() => [writerOnlyRoute()])
export class MajorCitiesRouteController extends ResourceRouteController<
  MajorCityController,
  MajorCitySpec,
  any
> {
  static get shared(): MajorCitiesRouteController {
    return this.sharedInstance() as MajorCitiesRouteController;
  }
}
