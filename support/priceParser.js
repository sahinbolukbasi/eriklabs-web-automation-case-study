/**
 * Parses Turkish currency strings to Number.
 * Handles: "1.234,56 TL", "₺1.234,56", "1.234,56", etc.
 *
 * @param {string} priceStr - The price string to parse
 * @returns {number} - Parsed numeric value
 */
function parsePrice(priceStr) {
  if (!priceStr || typeof priceStr !== 'string') {
    throw new Error(`Invalid price string: "${priceStr}"`);
  }

  const cleaned = priceStr
    .replace(/[₺TL\s]/g, '') // Remove currency symbols and whitespace
    .replace(/\./g, '')       // Remove thousand separators (dots)
    .replace(',', '.');       // Convert decimal comma to dot

  const value = parseFloat(cleaned);

  if (isNaN(value)) {
    throw new Error(`Could not parse price from: "${priceStr}"`);
  }

  return value;
}

/**
 * Formats a number as Turkish Lira string.
 * @param {number} value
 * @returns {string}
 */
function formatPrice(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(value);
}

module.exports = { parsePrice, formatPrice };
