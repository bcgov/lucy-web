import * as fs from 'fs';
import * as path from 'path';

const templateDir = 'source-templates';

/**
 * @description Get SQL dir path
 */
export const getTemplateDirPath = () => path.resolve(__dirname, `../../../${templateDir}`);

/**
 * Template Reader
 */
export const template = (fileName: string) => {
    return fs.readFileSync(`${getTemplateDirPath()}/${fileName}`, 'utf8');
};
// ----------------
