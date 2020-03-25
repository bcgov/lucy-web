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
    UpdateMiddleware,
    Get
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

    @Get({
        path: '/search',
    })
    public async search(req: any, data?: any): Promise<[number, any]> {
        const keyword = `%${req.query.keyword}%`;
        const observations = await this.dataController.repo.createQueryBuilder('observation')
            .innerJoinAndSelect('observation.species', 'species')
            .innerJoinAndSelect('observation.jurisdiction', 'jurisdiction')
            .innerJoinAndSelect('observation.speciesAgency', 'agency')
            .where('observation.observerFirstName ILIKE :keyword', { keyword })
            .orWhere('observation.observerLastName ILIKE :keyword', { keyword })
            .orWhere('species.commonName ILIKE :keyword', { keyword })
            .orWhere('jurisdiction.description ILIKE :keyword', { keyword })
            .orWhere('agency.description ILIKE :keyword', { keyword })
            .orderBy("observation.updatedAt", "DESC")
            .getMany();

        return [200, observations];
    }
}

export const observationRoute = (): Router => ObservationRouteController.shared.router;
