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
    WaterBodySpec,
    WaterBody
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

    async all(req: any, data?: any): Promise<[number, any]> {
        // Get all entries
        const d: [number, any] = await super.all(req, data);
        if (d[0] === 200) {
            const r: any = d[1];
            let newR;
            if (r instanceof Array) {
                newR = r.map((v: WaterBody) => {
                    return {
                        name: v.name,
                        water_body_id: v.water_body_id,
                        latitude: v.latitude,
                        longitude: v.longitude,
                        abbrev: v.abbrev,
                        closest: v.closest
                    };
                });
            } else {
                newR = r;
            }
            return [d[0], newR];
        } else {
            return d;
        }
    }
}
