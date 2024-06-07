const bytesToBase64 = (byte: any) => {
    const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    let bytes = new Uint8Array(byte)
    let newBase64 = ''
    let currentChar = 0
    for (let i = 0; i < bytes.length; i++) {   // Go over three 8-bit bytes to encode four base64 6-bit chars
        if (i % 3 === 0) { // First Byte
            currentChar = (bytes[i] >> 2)      // First 6-bits for first base64 char
            newBase64 += key[currentChar]      // Add the first base64 char to the string
            currentChar = (bytes[i] << 4) & 63 // Erase first 6-bits, add first 2 bits for second base64 char
        }
        if (i % 3 === 1) { // Second Byte
            currentChar += (bytes[i] >> 4)     // Concat first 4-bits from second byte for second base64 char
            newBase64 += key[currentChar]      // Add the second base64 char to the string
            currentChar = (bytes[i] << 2) & 63 // Add two zeros, add 4-bits from second half of second byte
        }
        if (i % 3 === 2) { // Third Byte
            currentChar += (bytes[i] >> 6)     // Concat first 2-bits of third byte for the third base64 char
            newBase64 += key[currentChar]      // Add the third base64 char to the string
            currentChar = bytes[i] & 63        // Add last 6-bits from third byte for the fourth base64 char
            newBase64 += key[currentChar]      // Add the fourth base64 char to the string
        }
    }
    if (bytes.length % 3 === 1) { // Pad for two missing bytes
        newBase64 += `${key[currentChar]}==`
    }
    if (bytes.length % 3 === 2) { // Pad one missing byte
        newBase64 += `${key[currentChar]}=`
    }
    return newBase64
}


const base64ToBytes = (base64: any) => {
    const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const bytes = [];
    let currentChar = 0;
    let padding = 0;

    for (let i = 0; i < base64.length; i++) {
        const char = base64.charAt(i);
        if (char === '=') {
            padding++;
        } else {
            const charValue = key.indexOf(char);
            if (charValue === -1) {
                throw new Error('Invalid Base64 character');
            }
            switch (i % 4) {
                case 0:
                    currentChar = charValue << 2;
                    break;
                case 1:
                    bytes.push((currentChar | (charValue >> 4)) & 255);
                    currentChar = (charValue & 15) << 4;
                    break;
                case 2:
                    bytes.push((currentChar | (charValue >> 2)) & 255);
                    currentChar = (charValue & 3) << 6;
                    break;
                case 3:
                    bytes.push((currentChar | charValue) & 255);
                    break;
            }
        }
    }

    // Remove padding bytes
    bytes.splice(-padding, padding);

    return new Uint8Array(bytes);
};

export {bytesToBase64, base64ToBytes}