//import * as express from 'express';
//import { miscellaneousController } from './miscellaneous.controller';
import * as express from 'express';
import * as assert from 'assert';
import { errorBody} from '../../core';

export const miscellaneous = () => {
}

export const defaultRoute = () => {
    let route = express.Router();
    route.all('*', (_req, _res) => {
        assert(_req);
        _res.status(404).json(errorBody('Route Not Found', []))
    })
    return route;
}
