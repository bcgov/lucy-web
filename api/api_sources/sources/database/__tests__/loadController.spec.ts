/**
 * Imports
 */
import {should } from 'chai';
import { DBControllerLoader } from '../../libs/core-database/db.bootstrap';
import * as models from '../models';
import { DBManager } from '../dataBaseManager';
import { ObservationController, UserDataController, RequestAccessController } from '../models';

/**
 * Imports
 */
describe('Test load all controllers', () => {
    it('should load all controllers', () => {
        const obj = DBControllerLoader(models, DBManager.logger);
        should().exist(obj);
        should().exist(obj.getController(ObservationController.shared.className));
        should().exist(obj.getController(UserDataController.shared.className));
        should().exist(obj.getController(RequestAccessController.shared.className));
    });
});
// -------------------------
