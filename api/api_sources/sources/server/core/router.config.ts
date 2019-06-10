/**
 * 
 */
import * as express from 'express';
export type routeConfig = ((_:express.Router) => void);
export const configRoute  = (config: routeConfig) => {
    const route = express.Router();
    config(route);
    return route;
};