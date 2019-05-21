import * as express from 'express';

class MiscellaneousController {

    public test = (req: express.Request, resp: express.Response) => {
        resp.send('It is working');
    }

}

export const miscellaneousController = new MiscellaneousController();
