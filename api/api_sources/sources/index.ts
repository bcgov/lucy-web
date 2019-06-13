// Application  Bootstrap
import 'reflect-metadata';
import { SharedExpressApp } from './server/initializers';
(async () => {
    // Init Express
    await SharedExpressApp.initExpress();

    // Init App dependencies and start
    await SharedExpressApp.init();
})();

// --------------------------

