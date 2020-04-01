/**
 * Imports
 */
import {
    // SecureRouteController,
    ResourceRoute,
    CreateMiddleware,
    ResourceRouteController,
    writerOnlyRoute,
    UpdateMiddleware
} from '../../../core';
import {
    WaterBodyController,
    WaterBodySpec
} from '../../../../database/models';
@ResourceRoute({
    dataController: WaterBodyController.shared,
    secure: true
})
@CreateMiddleware(() => [writerOnlyRoute()])
@UpdateMiddleware(() => [writerOnlyRoute()])
export class WaterBodyRouteController extends ResourceRouteController<WaterBodyController, WaterBodySpec, any> {
    static get shared(): WaterBodyRouteController {
        return this.sharedInstance() as WaterBodyRouteController;
    }
}
