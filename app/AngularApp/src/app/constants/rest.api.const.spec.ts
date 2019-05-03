import { RemoteEndPointService} from './rest.api.const';

describe(`RemoteEndPointService`, () => {
    it(`it should return base url`, () => {
        console.log(`Remote base url: ${RemoteEndPointService.baseURL}`);
        expect(RemoteEndPointService.baseURL).toBeDefined();
    });

    it(`it should return categoris url`, () => {
        console.log(`Remote categoris url: ${RemoteEndPointService.categories}`);
        expect(RemoteEndPointService.categories).toBeDefined();
    });
});
