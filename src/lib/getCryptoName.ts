type CryptoNameMap = {
  [key: string]: string
}

const cryptoNames: CryptoNameMap = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  USDT: "Tether",
  BNB: "Binance Coin",
  XRP: "Ripple",
  ADA: "Cardano",
  DOGE: "Dogecoin",
  SOL: "Solana",
  DOT: "Polkadot",
  MATIC: "Polygon",
  LINK: "Chainlink",
  UNI: "Uniswap",
  AVAX: "Avalanche",
  LTC: "Litecoin",
  SHIB: "Shiba Inu"
}

type FormatOption = "lowercase-hyphen" | "standard"

/**
 * Converts a cryptocurrency symbol to its common name with optional formatting
 * @param symbol The cryptocurrency symbol (e.g., BTC, ETH)
 * @param format Optional format type: "lowercase-hyphen" or "standard" (default)
 * @returns The formatted common name of the cryptocurrency
 */
export function getCryptoName(symbol: string, format: FormatOption = "standard"): string {
  const upperSymbol = symbol.toUpperCase()
  const name = cryptoNames[upperSymbol] || upperSymbol

  if (format === "lowercase-hyphen") {
    return name.toLowerCase().replace(/ /g, "-")
  }

  return name
}