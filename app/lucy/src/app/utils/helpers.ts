// Generate a Random String
export const getRandomString = () => {
    const randomItems = new Uint32Array(28);
    crypto.getRandomValues(randomItems);
    const binaryStringItems: string[] = [];
    randomItems.forEach((dec) => binaryStringItems.push(`0${dec.toString(16).substr(-2)}`));
    return binaryStringItems.reduce((acc: string, item: string) => `${acc}${item}`, '');
};

// Encrypt a String with SHA256
export const encryptStringWithSHA256 = async (str: string) => {
    const PROTOCOL = 'SHA-256';
    const textEncoder = new TextEncoder();
    const encodedData = textEncoder.encode(str);
    return crypto.subtle.digest(PROTOCOL, encodedData);
};

// Convert Hash to Base64-URL
export const hashToBase64url = (arrayBuffer: Iterable<number>) => {
    const items = new Uint8Array(arrayBuffer);
    const stringifiedArrayHash = items.reduce((acc, i) => `${acc}${String.fromCharCode(i)}`, '');
    const decodedHash = btoa(stringifiedArrayHash);

    return decodedHash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
