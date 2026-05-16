/** INR formatting via Intl — avoids broken ₹ characters from file encoding / fonts. */
export function formatInr(
  amount: number,
  options?: { maximumFractionDigits?: number; minimumFractionDigits?: number }
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
    minimumFractionDigits: options?.minimumFractionDigits,
  }).format(amount);
}
