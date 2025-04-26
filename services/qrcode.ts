/**
 * Generate a QR code URL from the provided data
 * Uses a free external QR code generation service
 * 
 * @param data The data to encode in the QR code
 * @param size The size of the QR code in pixels
 * @returns A URL to the generated QR code image
 */
export function generateQrCodeUrl(data: string, size: number = 200): string {
  if (!data) {
    throw new Error("No data provided for QR code generation");
  }
  
  // URL encode the data to prevent issues with special characters
  const encodedData = encodeURIComponent(data);
  
  // Use the QR Server API to generate the QR code
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}`;
  
  return url;
}

/**
 * Format a Bitcoin Lightning Network invoice for display
 * Truncates long invoices to show only the beginning and end
 * 
 * @param invoice The invoice to format
 * @param startChars Number of characters to show at the beginning
 * @param endChars Number of characters to show at the end
 * @returns The formatted invoice string
 */
export function formatInvoice(invoice: string, startChars: number = 10, endChars: number = 10): string {
  if (!invoice) return "";
  if (invoice.length <= startChars + endChars) return invoice;
  
  return `${invoice.substring(0, startChars)}...${invoice.substring(invoice.length - endChars)}`;
} 
