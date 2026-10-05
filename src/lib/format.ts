import { CURRENCY, LOCALE } from "./constants";

const formatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

/** Formats whole Naira, e.g. 250000 -> "₦250,000". */
export function formatNaira(amount: number): string {
  return formatter.format(amount).replace("NGN", "₦");
}
