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