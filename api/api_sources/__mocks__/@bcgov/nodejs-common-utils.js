//
// Code Sign
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
//

'use strict';

const ncu = jest.requireActual('@bcgov/nodejs-common-utils');

// public certificate
const pem = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAs1adod1+laVtsql0olCs4zo/Ng4kJDdwHdzJQW6TlE61MlpskJPu
lK+OTytOdi/hSSnKPwNsMrzqm60RuR4hnhMJBdrOjbBnr6yUKSIAv6SPXK0QrmN5
Y0XuhV4kMkDJ0aN15UxRzSGdeaXAetmQEqSl/+lt33mTNsTfU6kzgKkwyZQSbITm
jze8MVVtjfdly0DsMt/1tc6l+tUvaDzGgqUEF5dAUFq2MgdH7FM6quHml3ze3F8z
Pmk6ia8tHZ4wJULOFiLvKuRNU8ZsPMuwyFPYtF+/b4HgVCco82EP51psNOXpq4YH
3qjAgJjYw3Oe1ULU+xdzXWXhzSq6WWxBAQIDAQAB
-----END RSA PUBLIC KEY-----`;

/* eslint-disable-next-line no-unused-vars */
/*ncu.getJwtCertificate = ssoCertificateUrl =>
  Promise.resolve({
    certificate: pem,
    algorithm: 'RS256',
  });*/


module.exports = ncu;
