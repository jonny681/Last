const formatterCache = new Map<string, Intl.NumberFormat>();

export function formatCurrency(
  val: number,
  locale: string = 'en-US',
  currencyCode: string = 'USD',
  decimals: number = 0
): string {
  const key = `${locale}_${currencyCode}_${decimals}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      });
      formatterCache.set(key, formatter);
    } catch {
      formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: decimals,
      });
      formatterCache.set(key, formatter);
    }
  }
  return formatter.format(val);
}
