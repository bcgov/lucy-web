import jsonpatch from 'fast-json-patch';
import traverse from 'json-schema-traverse';
import { CacheKeys, XApiDocKeys, XEnumCode } from '../constants/misc';
import { getDBConnection } from '../database/db';
import { getAllCodeSets, IAllCodeSets } from './code-utils';
import { cached } from './utils';
import { getLogger } from './logger';

const defaultLog = getLogger('api-doc-security-filter');

/**
 * Apply updates/filters to req.apiDoc.
 *
 * @export
 * @param {*} req
 * @return {*} req
 */
export async function applyApiDocSecurityFilters(req: any) {
  const connection = await getDBConnection();

  if (!connection) {
    throw {
      status: 503,
      message: 'Failed to establish database connection'
    };
  }

  try {
    // fetch all code sets
    const allCodeSets: IAllCodeSets = await cached(CacheKeys.AllCodeSets, 3600000, () => getAllCodeSets(connection))();

    // the apiDoc that updates will be applied to
    const apiDoc = req['apiDoc'];

    let initialPass = true;

    // traverses the apiDoc object, calling the `cb` function for each level of the schema, the first being the entire
    // (root) schema.
    traverse(apiDoc, {
      allKeys: true,
      cb: (schema, jsonPtr) => {
        if (initialPass) {
          // first pass is always the entire (root) schema, which we can skip (for a minor efficiency improvement)
          initialPass = false;
          return;
        }

        // apply code enum filters, if a matching `x-...` field exists
        if (Object.keys(schema).includes(XApiDocKeys.XEnumCode)) {
          // apply code enum filtering to this piece of schema
          const updatedSchema = applyCodeEnumFilter(schema, allCodeSets);

          // update apiDoc, replacing the old schema part with the updated schema part
          jsonpatch.applyPatch(apiDoc, [{ op: 'replace', path: jsonPtr, value: updatedSchema }]);
        }
      }
    });

    // re-assign the updated apiDoc to the req
    req['apiDoc'] = apiDoc;
  } catch (error) {
    defaultLog.debug({ label: 'applyApiDocSecurityFilters', message: 'error', error });
    throw error;
  } finally {
    connection.release();
  }

  return req;
}

/**
 * Updates an object to include code enum json spec.
 *
 * @export
 * @param {object} obj the schema object to apply updates to
 * @param {IAllCodeSets} allCodeSets an object containing all of the code sets and their values
 * @return {*}  {object} the updated object
 */
export function applyCodeEnumFilter(obj: object, allCodeSets: IAllCodeSets): object {
  // get the XEnumCode object
  const xEnumCodeObj = obj[XApiDocKeys.XEnumCode];

  // get the name of the code set
  const codeSetName = xEnumCodeObj[XEnumCode.XEnumCodeSetName];

  if (!codeSetName) {
    return obj;
  }

  // get the list of codes for this code set name
  const codes: any[] = allCodeSets[codeSetName];

  if (!codes || !codes.length) {
    return obj;
  }

  // update the object, adding an `anyOf` field whose value is an array of enum objects
  obj = {
    ...obj,
    anyOf: codes
      .map(code => {
        return {
          // the `type` specified by the field that contains the enum (the enum `type` must match the field `type`)
          type: obj['type'],
          // the column that contains the unique value for this code
          enum: [code[xEnumCodeObj[XEnumCode.XEnumCodeValue]]],
          // the column that contains the human readable name of this code
          title: code[xEnumCodeObj[XEnumCode.XEnumCodeName]]
        };
      })
      .sort(getAscObjectSorter('title'))
  };

  return obj;
}

/**
 * Returns a comparator function that sorts objects in ascending order based on a specified `field`.
 *
 * @param {string} field the object field to sort based on
 * @return {number}
 */
function getAscObjectSorter(field: string) {
  return (a: object, b: object) => {
    if (a[field] < b[field]) {
      return -1;
    }

    if (a[field] > b[field]) {
      return 1;
    }

    return 0;
  };
}
