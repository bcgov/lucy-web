/**
 * Imports
 */
import { unWrap, valueAtKeyPath, arrayToString } from '../utilities';

 /**
  * Exports: Regular Expression
  */
export const Marker = /#\{[a-zA-Z0-9.]*\}/gi;
export const DataMarker = /#\{[a-zA-Z0-9]+[.a-zA-Z0-9]*\}/gi;
export const MarkerDecoder = /[a-zA-Z0-9]+[.a-zA-Z0-9]*/gi;
export const IfMarker = /#if\([a-zA-Z0-9.]+\)\s*\[(.*)\]/gi;
export const RepeatLine = /#repeatLine\([a-zA-Z0-9.]+\)\s*\[\s*(.*)\]/gi;
export const RepeatMarker = /#repeat\([a-zA-Z0-9.]+[, a-zA-Z0-9.]*\)\s*\[(.*|[\t\n])*\]/gi;
export const FunctionalDecoder = /\s*\([a-zA-Z0-9.]+\s*[,\s*a-zA-Z0-9.]*\)/gi;
// export const FunctionArgDecoder = //
export const ArrayMarker = /[a-zA-Z0-9]+\[[0-9]+\][.a-zA-Z0-9]*/gi;
export const ArrayIndexMarker = /[a-zA-Z0-9]+\[[a-zA-Z0-9]+\][.a-zA-Z0-9]*/gi;
export const Encloser = /\[(.*|[\t\n])*\]/gi;

export interface TemplateTokenResolver {
    getValueFor(keyPath: string): any;
}

export interface TemplateLogger {
    log(...args: any[]): any;
    dir(...args: any[]): any;
    error(...args: any[]): any;
}

const DefaultLogger = {
    log: () => {},
    dir: () => {},
    error: (...args: any[]) => {
        return console.error.apply(console, args);
    }
};

export class TemplateResolver {
    static resolveDataMarker(line: string, source: TemplateTokenResolver, logger: TemplateLogger = DefaultLogger): string {
        return line.replace(DataMarker, (m, ...args: any[]) => {
            if (args.length > 0) {
                // Get Prop
                const propStr = m.match(MarkerDecoder) || [];
                if (propStr.length > 0) {
                    // Prop
                    const prop = propStr[0];
                    // Get data
                    const d = source.getValueFor(prop);
                    return `${d}`;
                }
            }
            return m;
        });
    }

    static resolveIfMarker(line: string, source: TemplateTokenResolver, logger: TemplateLogger = DefaultLogger): string {
        return line.replace(IfMarker, (m: string, ...args: any[]) => {
            logger.log(`${m} => ${args}`);
            if (args.length > 0) {
                // Get Condition
                const match = m.match(/#if\([a-zA-Z0-9.]*\)/gi) || [];
                if (match.length > 0) {
                    const temp = match[0];
                    // Get key
                    const props = temp.match(MarkerDecoder) || [];
                    if (props.length > 1) {
                        if (source.getValueFor(props[1])) {
                            return args[0];
                        } else {
                            return '';
                        }
                    }
                }
            }
            return m;
        });
    }

    static resolveRepeatMarker(sentence: string, source: TemplateTokenResolver, logger: TemplateLogger = DefaultLogger): string {
        return sentence.replace(RepeatMarker, (sub, ...args: any[]) => {
            const propMarker = /[a-zA-Z0-9]+/gi;
            let returnLines = sub;
            // Get Functional part
            const functionalPart: string = sub.split('[')[0];
            let match = functionalPart.match(FunctionalDecoder) || [];
            if (match.length === 0) {
                logger.error(`No Match(1): ${functionalPart}`);
                return returnLines;
            }
            match = match[0].match(/\s*[a-zA-Z0-9]+[.a-zA-Z0-9]*\s*(,)\s*[a-zA-Z0-9]+\s*/) || [];
            if (match.length === 0) {
                logger.error(`No Match(2): ${match[0]}`);
                return returnLines;
            }
            const variables = match[0].split(',');
            if (variables.length < 2) {
                logger.error(`No Match(3): ${match[0]}`);
                return returnLines;
            }
            const key = unWrap(variables[0].match(MarkerDecoder), [''])[0];
            if (!key) {
                logger.error(`No Key: ${variables[0]}`);
                return returnLines;
            }
            const dataMarker = unWrap(variables[1].match(propMarker), ['']);
            if (!dataMarker) {
                logger.error(`No Data Marker: ${variables[1]}`);
                return returnLines;
            }

            // Get content
            const enclosedContents = sub.match(Encloser) || [];
            if (enclosedContents.length === 0) {
                return returnLines;
            }
            let content = enclosedContents[0].substr(1);
            content = content.slice(0, -1);



            // Get dataArray from resolver
            const dataArray: any[] = source.getValueFor(key) as any[];
            if (!dataArray || typeof dataArray !== typeof [] || dataArray.constructor !== Array) {
                logger.error(`No or wrong Data For Key ${key} => ${dataArray}`);
                return '';
            }
            returnLines = ``;
            const itemMarker: RegExp = new RegExp(`#\{${dataMarker}[.a-zA-Z0-9]*\}`, 'gi');
            // Now check
            for (const dat of dataArray) {
                // Resolve data specific #if(*) marker
                const insideIfResolver: TemplateTokenResolver = {
                    getValueFor: (insideKeyPath: string) => {
                        const split = insideKeyPath.split('.');
                        if (split.length === 1) {
                            return true;
                        }
                        split.shift();
                        const newKey = arrayToString(split, '.');
                        return valueAtKeyPath(dat, newKey);
                    }
                };
                const contentWithoutIf = this.resolveIfMarker(content, insideIfResolver, logger);
                // Resolve other data markers
                const updatedContent = contentWithoutIf.replace(itemMarker, (dataSub: string, ...values: any[]) => {
                    const newMatch = dataSub.match(/[.a-zA-Z0-9]+/gi) || [];
                    if (newMatch.length === 0) {
                        return `${dat}`;
                    }
                    logger.log(`${newMatch[0]}`);
                    logger.dir(dat);
                    const propKey = unWrap((newMatch[0] || '').split('.'), ['', ''])[1];
                    const val = `${dat[propKey]}`;
                    return val;
                });
                returnLines = returnLines + updatedContent;
            }
            return returnLines;
        });
    }

    static resolveTemplate(template: string, tokenResolver: TemplateTokenResolver, logger: TemplateLogger = DefaultLogger): string {
        let result = '';
        // Resolve all repeat
        result = TemplateResolver.resolveRepeatMarker(template, tokenResolver, logger);

        // Resolve all if
        result = TemplateResolver.resolveIfMarker(result, tokenResolver, logger);

        // Resolve all data marker
        result = TemplateResolver.resolveDataMarker(result, tokenResolver, logger);

        // Return actual result
        return result;
    }
}

/**
 * @description Core template generator class
 */
export class TemplateGenerator {
}
// ------------------------------
