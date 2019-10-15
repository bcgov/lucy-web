/**
 * Imports
 */
import { Router } from 'express';
import {
    // SecureRouteController,
    ResourceRoute,
    CreateMiddleware,
    ResourceRouteController,
    writerOnlyRoute,
    UpdateMiddleware
} from '../../core';
import {
    ObservationController,
    ObservationCreateModel
} from '../../../database/models';
@ResourceRoute({
    path: 'api/observation#/',
    description: 'API route controller for observation',
    dataController: ObservationController.shared,
    // validators: CreateTreatmentValidator,
    secure: true
})
@CreateMiddleware(() => [writerOnlyRoute()])
@UpdateMiddleware(() => [writerOnlyRoute()])
export class ObservationRouteController extends ResourceRouteController<ObservationController, ObservationCreateModel, any> {
    static get shared(): ObservationRouteController {
        return this.sharedInstance() as ObservationRouteController;
    }
}

export const observationRoute = (): Router => ObservationRouteController.shared.router;
