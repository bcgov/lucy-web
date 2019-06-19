import * as fs from 'fs';
import * as path from 'path';
export const adminToken = (): string => {
    return fs.readFileSync(path.join(__dirname, 'test.token'), 'utf8');
};

export const viewerToken = (): string => {
    return fs.readFileSync(path.join(__dirname, 'viewer.token'), 'utf8');
};

export const editorToken = (): string => {
    return fs.readFileSync(path.join(__dirname, 'editor.token'), 'utf8');
};

// -----------------------------
