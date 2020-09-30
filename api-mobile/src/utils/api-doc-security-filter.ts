import jsonpatch from 'fast-json-patch';
import traverse from 'json-schema-traverse';
import { CacheKeys } from '../constants/misc';
import { getDBConnection } from '../database/db';
import { getAllCodeSets, IAllCodeSets } from './code-utils';
import { cached } from './utils';

/**
 * Apply updates/filters to req.apiDoc.
 *
 * @export
 * @param {*} req
 * @return {*} req
 */
export async function applyApiDocSecurityFilters(req: any) {
  const connection = await getDBConnection();

  const allCodeSets: IAllCodeSets = await cached(CacheKeys.AllCodeSets, 3600000, () => getAllCodeSets(connection))();

  const apiDoc = req['apiDoc'];

  let initialPass = true;

  traverse(apiDoc, {
    allKeys: true,
    cb: (schema, jsonPtr) => {
      if (initialPass) {
        // first pass is always the entire (root) schema, which we can skip (for a minor efficiency improvement)
        initialPass = false;
        return;
      }

      // apply code enum filters
      if (Object.keys(schema).includes('x-code-enum')) {
        const updatedSchema = applyCodeEnumFilter(schema, allCodeSets);

        // replace the old schema with the filtered schema
        jsonpatch.applyPatch(apiDoc, [{ op: 'replace', path: jsonPtr, value: updatedSchema }]);
      }
    }
  });

  // re-assign updated apiDoc on req
  req['apiDoc'] = apiDoc;

  return req;
}

/**
 * Updates an object to include code enum json spec.
 *
 * @export
 * @param {object} obj
 * @param {IAllCodeSets} allCodeSets
 * @return {*}  {object}
 */
export function applyCodeEnumFilter(obj: object, allCodeSets: IAllCodeSets): object {
  const codeSetName = obj['x-code-enum'];

  if (!codeSetName) {
    return obj;
  }

  const codes: any[] = allCodeSets[codeSetName];

  if (!codes || !codes.length) {
    return obj;
  }

  obj = {
    ...obj,
    anyOf: codes.map(code => {
      return {
        type: 'string',
        enum: [code[codeSetName]], // assuming the code id column has the same name as the table
        title: code.description // assuming human readable name is in the description column
      };
    })
  };

  return obj;
}
