import * as express from 'express';
import { miscellaneousController } from './miscellaneous.controller';

export const miscellaneous = (app: express.Application) => {
    app.get('/api/test', miscellaneousController.test)
}