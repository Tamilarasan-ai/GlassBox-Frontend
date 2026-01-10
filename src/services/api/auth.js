/**
 * Authentication Service - Client UUID Generation and Management
 * 
 * Manages guest user authentication via client-side UUID generation
 * and persistence in localStorage.
 */

const STORAGE_KEY = 'glassbox_client_id';

/**
 * Generate a new UUID v4
 * @returns {string} UUID string
 */
function generateUUID() {
    // Use crypto.randomUUID() if available (modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Get or create client UUID
 * Checks localStorage first, generates and stores if not found
 * @returns {string} Client UUID
 */
export function getClientId() {
    let clientId = localStorage.getItem(STORAGE_KEY);

    if (!clientId) {
        clientId = generateUUID();
        localStorage.setItem(STORAGE_KEY, clientId);
        console.log('✓ New client ID generated:', clientId);
    }

    return clientId;
}

/**
 * Clear client ID from storage
 * Useful for testing or user logout
 */
export function clearClientId() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✓ Client ID cleared');
}

/**
 * Check if client ID exists
 * @returns {boolean}
 */
export function hasClientId() {
    return !!localStorage.getItem(STORAGE_KEY);
}

/**
 * Generate device fingerprint for enhanced security
 * Creates a hash based on browser characteristics
 * @returns {Promise<string>} SHA-256 hash of device fingerprint
 */
export async function generateDeviceFingerprint() {
    const components = [
        navigator.userAgent,
        navigator.language,
        new Date().getTimezoneOffset(),
        screen.colorDepth,
        `${screen.width}x${screen.height}`,
        navigator.hardwareConcurrency || 'unknown'
    ];

    const fingerprint = components.join('|');

    // Hash the fingerprint using Web Crypto API
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(fingerprint);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashHex;
    } catch (error) {
        console.warn('Failed to generate device fingerprint:', error);
        return null;
    }
}

export default {
    getClientId,
    clearClientId,
    hasClientId,
    generateDeviceFingerprint
};
