import { Application} from 'express';
import { miscellaneous} from '../modules'

export const routes = (app: Application) => {
    // Add miscellaneous
    miscellaneous(app);
}