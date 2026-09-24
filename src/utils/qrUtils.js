// Utility for generating random numeric digits
export function generateRandomDigits(count) {
  const digits = Math.max(1, Math.min(count, 32));
  let result = '';
  // Generate digit by digit to avoid floating point scientific notation
  for (let i = 0; i < digits; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

// Helper to format prefix: uppercase and convert underscores to hyphens
export function formatPrefix(str) {
  if (!str) return '';
  return str.toUpperCase().replace(/_/g, '-');
}

// Default initial prefixes using hyphen instead of underscore
export const INITIAL_PREFIXES = [
  'BB-NOW',
  'PBS',
  'PBM',
  'PBHM',
  'PBL',
  'INSULATED',
  'PCM-PAD',
  'CRATE',
  'SB-IFC'
];

// ONLY prefix list is stored in localStorage
export const STORAGE_PREFIXES_KEY = 'qr_saved_prefixes';
