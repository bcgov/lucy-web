import { should, expect } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
import {
    WatercraftRiskAssessmentController
} from '../models';
import { ModelFactory, Destroyer } from '../factory';
import {
    WatercraftRiskAssessmentSchema
} from '../database-schema';
import { QueryInfo, QueryCreator } from '../../libs/core-database';

describe('Test WatercraftRiskAssessment Query building', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });
    it('should create query', () => {
        const schema: WatercraftRiskAssessmentSchema = new WatercraftRiskAssessmentSchema();
        const info: QueryInfo = {
            name: 'test',
            includesAllFields: true
        };
        // console.dir(schema.table.columnsDefinition);
        const query = QueryCreator.createQuery(schema, info);
        should().exist(query);
    });

    it('should create query with data fields', () => {
        const schema: WatercraftRiskAssessmentSchema = new WatercraftRiskAssessmentSchema();
        const info: QueryInfo = {
            name: 'test',
            includeAllDataFields: true,
            fields: [
                'highRiskAssessment.cleanDrainDryAfterInspection',
                'highRiskAssessment.quarantinePeriodIssued',
                'highRiskAssessment.standingWaterPresent'
            ]
        };
        // console.dir(schema.table.columnsDefinition);
        const query = QueryCreator.createQuery(schema, info);
        should().exist(query);
    });

    it('should send flat json of watercraftRiskAssessment', async () => {
        // Create two object
        const a1 = await ModelFactory(WatercraftRiskAssessmentController.shared)();
        const a2 = await ModelFactory(WatercraftRiskAssessmentController.shared)();
        // Now export in flat json
        const data: any = await WatercraftRiskAssessmentController.shared.export();
        should().exist(data);
        expect(data.length).to.be.greaterThan(1);
        await Destroyer(WatercraftRiskAssessmentController.shared)(a1);
        await Destroyer(WatercraftRiskAssessmentController.shared)(a2);
    });
});
// ---------------------------------------
