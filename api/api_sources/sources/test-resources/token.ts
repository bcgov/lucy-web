import * as fs from 'fs';
import * as path from 'path';
export const adminToken = (): string => {
    return fs.readFileSync(path.join(__dirname, 'test.token'), 'utf8');
};

// -----------------------------
