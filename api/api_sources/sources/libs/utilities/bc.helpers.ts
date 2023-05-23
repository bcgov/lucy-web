//
// BC Helpers wrapper
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-06-10.
/**
 * Imports
 */
import * as assert from 'assert';
import AppConfig from '../../AppConfig';
import axios from 'axios';
const getPem = require('rsa-pem-from-mod-exp');
import { Logger } from '../../server/logger';

/**
 * @description Require common utility module as any
 */
const commonUtility = require('@bcgov/nodejs-common-utils');

/**
 * @description Helper class to expose bcgov utilities
 * @export class BCHelperLib
 */
export class BCHelperLib {
  static logger: Logger;

    /**
     * @description Constructing
     */
      constructor() {
      BCHelperLib.logger = new Logger(this.constructor.name);
    }

    /**
     * @description Get certificate for JWT token validation
     * @returns Promise<{algorithm: any, certificate: any}>
     */
    static async getCertificate(): Promise<any> {

        interface CertificateResult {
            algorithm: string;
            certificate: string;
          }

        const ssoCertificateUrl = AppConfig.certificateURL;

        // Assign algorith and certificate with the values from the parsed data from certificate
        const { algorithm, certificate } = await new Promise<CertificateResult>(async (resolve, reject) => {
            if (!ssoCertificateUrl) {
              reject(new Error('No certificate URL provided'));
              return;
            }
            try {
              const response = await axios.get(ssoCertificateUrl);
              if (response.data.keys && response.data.keys.length === 0) {
                reject(new Error('No keys in certificate body'));
                return;
              }
              // If enc is the use type of response.data.keys[0] you are in production and need to use the next key.
              let certsJson = response.data.keys[0];
              if (certsJson.use === 'enc') {
                certsJson = response.data.keys[1];
              }
              const modulus = certsJson.n;
              const exponent = certsJson.e;
              const alg = certsJson.alg;
              // Verify required fields were found in Certificate
              if (!modulus) {
                reject(new Error('No modulus'));
                return;
              }
              if (!exponent) {
                reject(new Error('No exponent'));
                return;
              }
              if (!alg) {
                reject(new Error('No algorithm'));
                return;
              }
              // build a certificate
              const pem = getPem(modulus, exponent);
              resolve({
                certificate: pem,
                algorithm: alg,
              });
            } catch (error) {
              const message = 'Unable to parse certificate(s)';
              this.logger.error('algorithm exception ', algorithm);
              this.logger.error('certificate exception ', certificate);
              reject(new Error(message));
            }
          });
        assert(certificate, 'No getJwtCertificate');
        assert(algorithm, 'No algorithm');
    }

     /**
     * @description Get utility module object
     * @returns any
     */
    static getCommonUtility(): any {
        return commonUtility;
    }
}

// --------------------------------------------------------------------
