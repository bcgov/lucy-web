/**
 * Application Main routes
 */
import { Application} from 'express';
import { accountRoute, requestAccessRoutes} from '../modules';
import { defaultRoute} from '../modules';

export const routes = (app: Application) => {
    // Add account
    app.use('/api/v1/account', accountRoute());

    // Request Access routes
    app.use('/api/v1/request-access', requestAccessRoutes());

    // Default Route
    app.use('*', defaultRoute());
};

// -----------------------------------------------------
