import { Application} from 'express';
import { accountRoute} from '../modules'; 
import { defaultRoute} from '../modules'

export const routes = (app: Application) => {
    // Add account
    app.use('/api/v1/account', accountRoute());

    // Default Route
    app.use('*', defaultRoute());
    
}