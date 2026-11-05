export function generateUniqueId() {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}

export function generateUniqueIdWithPrefix(str) {
    return str + crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}

export function generateAndVerifyUniqueId(str) {
    let uniqueId = generateUniqueIdWithPrefix(str);
    let attempts = 10; // Precaution to prevent long loops - more than 10 failed attempts should be extremely rare

    while (document.getElementById(uniqueId) && attempts > 0) {
        uniqueId = generateUniqueIdWithPrefix(str);
        attempts--;
    }

    return uniqueId;
}