'use strict';

import { decode, verify } from 'jsonwebtoken';
import JwksRsa, { JwksClient } from 'jwks-rsa';
import { promisify } from 'util';
import { getUserWithRoles } from '../controllers/user-controller';
import { getLogger } from './logger';

const defaultLog = getLogger('auth-utils');

const APP_CERTIFICATE_ISSUER =
  process.env.APP_CERTIFICATE_ISSUER || 'https://sso-test.pathfinder.gov.bc.ca/auth/realms/dfmlcg7z';
const APP_CERTIFICATE_URL =
  process.env.APP_CERTIFICATE_URL ||
  'https://sso-test.pathfinder.gov.bc.ca/auth/realms/dfmlcg7z/protocol/openid-connect/certs';

const TOKEN_IGNORE_EXPIRATION: boolean =
  process.env.TOKEN_IGNORE_EXPIRATION === 'true' ||
  process.env.NODE_ENV === 'dev' ||
  process.env.DB_HOST === 'localhost' ||
  false;

/**
 * Authenticate the current user against the current route.
 *
 * @param {*} req
 * @param {*} authOrSecDef
 * @param {*} token
 * @param {*} callback
 * @returns {*}
 */
export const authenticate = async function (req: any, authOrSecDef: any, token: any, callback: any): Promise<any> {
  try {
    defaultLog.debug({ label: 'authenticate', message: 'authenticating user', token });

    if (!token) {
      defaultLog.warn({ label: 'authenticate', message: 'token was null' });
      return callback(setError(req));
    }

    if (token.indexOf('Bearer ') !== 0) {
      defaultLog.warn({ label: 'authenticate', message: 'token did not have a bearer' });
      return callback(setError(req));
    }

    // Validate the 'Authorization' header.
    // Authorization header should be a string with format: Bearer xxxxxx.yyyyyyy.zzzzzz
    const tokenString = token.split(' ')[1];

    if (!tokenString) {
      defaultLog.warn({ label: 'authenticate', message: 'token string was null' });
      return callback(setError(req));
    }

    // Decode token without verifying signature
    const decodedToken = decode(tokenString, { complete: true, json: true });

    if (!decodedToken) {
      defaultLog.warn({ label: 'authenticate', message: 'decoded token was null' });
      return callback(setError(req));
    }

    // Get token header kid
    const kid = decodedToken.header && decodedToken.header.kid;

    if (!decodedToken) {
      defaultLog.warn({ label: 'authenticate', message: 'decoded token header kid was null' });
      return callback(setError(req));
    }

    const jwksClient: JwksClient = JwksRsa({ jwksUri: APP_CERTIFICATE_URL });

    const getSigningKeyAsync = promisify(jwksClient.getSigningKey);

    // Get signing key from certificate issuer
    const key = await getSigningKeyAsync(kid);

    if (!key) {
      defaultLog.warn({ label: 'authenticate', message: 'get signing key' });
      return callback(setError(req));
    }

    const signingKey = key['publicKey'] || key['rsaPublicKey'];

    // Verify token using signing key
    const verifiedToken = verifyToken(tokenString, signingKey);

    if (!verifiedToken) {
      return callback(setError(req));
    }

    // Add the verified token to the request for future use, if needed
    req.swagger.params.auth_payload = verifiedToken;

    // Verify user
    const verifiedUser = await verifyUser(req);

    if (!verifiedUser) {
      return callback(setError(req));
    }

    // Add the user to the request for future use, if needed
    req.swagger.params.auth_user = verifiedUser;
  } catch (error) {
    defaultLog.error({ label: 'authenticate', message: 'unexpected error', error });
    return callback(setError(req));
  }

  return callback(null);
};

/**
 * Verify jwt token.
 *
 * @param {*} tokenString
 * @param {*} secretOrPublicKey
 * @returns {*} verifiedToken
 */
const verifyToken = function (tokenString: any, secretOrPublicKey: any): any {
  return verify(tokenString, secretOrPublicKey, { ignoreExpiration: TOKEN_IGNORE_EXPIRATION }, function (
    verificationError: any,
    verifiedToken: any
  ): any {
    if (verificationError) {
      defaultLog.warn({ label: 'verifyToken', message: 'jwt verification error', verificationError });
      return null;
    }

    defaultLog.debug({ label: 'verifyToken', message: 'verifiedToken', verifiedToken });

    if (verifiedToken.iss !== APP_CERTIFICATE_ISSUER) {
      defaultLog.warn({
        label: 'verifyToken',
        message: 'jwt verification error: issuer mismatch',
        actual: verifiedToken.iss,
        expected: APP_CERTIFICATE_ISSUER
      });
      return null;
    }

    defaultLog.debug({ label: 'verifyToken', message: 'jwt verification success' });

    return verifiedToken;
  });
};

/**
 * Verify the user.
 *
 * - Fetches the matching user and their assigned roles based on the users email
 * - Checks that the user has at least one of the required roles for the current route
 *
 * @param {*} req
 * @returns
 */
export const verifyUser = async function (req: any) {
  // get user and their role
  const response = await getUserWithRoles(req.swagger.params.auth_payload.email);

  if (!response) {
    defaultLog.warn({
      label: 'verifyUser',
      message: 'failed to find user with matching email',
      email: req.swagger.params.auth_payload.email,
      response
    });
    return null;
  }

  // allowed scopes/roles for the current endpoint
  const currentSecurityScopes = req.swagger.operation['x-security-scopes'];

  const userHasRole = verifyUserRoles(currentSecurityScopes, response['role_code']);

  if (!userHasRole) {
    defaultLog.warn({ label: 'verifyUser', message: 'user verification error: insufficient roles' });
    defaultLog.debug({
      label: 'verifyUser',
      message: 'user verification error: insufficient roles',
      userRoles: response['role_code'],
      requiredRoles: currentSecurityScopes
    });
    return null;
  }

  defaultLog.debug({ label: 'verifyUser', message: 'user verification success' });

  // return verified user
  return response;
};

/**
 * Checks if at least one of the the userRoles matches one of the allowedRoles.
 *
 * @param {(string[] | string)} allowedRoles allowed user roles
 * @param {(string[] | string)} userRoles roles possessed by the user.
 * @returns {boolean} true if userRoles contains at least one of the allowdRoles, false otherwise.
 */
export const verifyUserRoles = function (allowedRoles: string[] | string, userRoles: string[] | string): boolean {
  if (!Array.isArray(allowedRoles)) {
    allowedRoles = [allowedRoles];
  }

  if (!Array.isArray(userRoles)) {
    userRoles = [userRoles];
  }

  for (const allowedRole of allowedRoles) {
    // if the user contains at least one of the allowedRoles, then return true
    if (userRoles.includes(allowedRole)) {
      return true;
    }
  }

  // user contains none of the allowedRoles, return false
  return false;
};

/**
 * Set default error status on response when authentication fails.
 *
 * @param {*} req
 * @returns response with default error status set
 */
function setError(req: any) {
  return req.res.status(401).json({ message: 'Error: Access Denied' });
}
