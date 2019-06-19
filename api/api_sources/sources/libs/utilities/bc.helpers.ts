/**
 * BC Helpers wrapper
 */
import * as assert from 'assert';
import AppConfig from '../../AppConfig';
const commonUtility = require('@bcgov/nodejs-common-utils');

export class BCHelperLib {

    static async getCertificate(): Promise<any> {
        const { getJwtCertificate} = commonUtility;
        assert(getJwtCertificate, 'No getJwtCertificate lib');
        const { algorithm, certificate } = await getJwtCertificate(AppConfig.certificateURL);
        return {algorithm, certificate};
    }

    static getCommonUtility(): any {
        return commonUtility;
    }
}

// ------------------------------