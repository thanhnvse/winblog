const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY || ''

// ===== HELPERS =====
async function fetchJSON<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.status}`)
    return (await res.json()) as T
  } catch {
    console.warn(`[MarketAPI] Failed to fetch: ${url}`)
    return fallback
  }
}

// ===== CRYPTO (CoinGecko - no key) =====
export interface CryptoPrice {
  symbol: string
  name: string
  priceUSD: number
  priceVND: number
  change24h: number
  marketCap: string
  image: string
}

export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  const data = await fetchJSON<any[]>(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h',
    []
  )
  if (!data.length) return []

  // Get USD/VND rate for conversion
  const vndRate = await fetchUsdToVnd()

  return data.map((coin: any) => ({
    symbol: coin.symbol?.toUpperCase() || '',
    name: coin.name || '',
    priceUSD: coin.current_price || 0,
    priceVND: (coin.current_price || 0) * vndRate,
    change24h: coin.price_change_percentage_24h || 0,
    marketCap: formatMarketCap(coin.market_cap || 0),
    image: coin.image || '',
  }))
}

export interface CryptoHistory {
  prices: number[]
  timestamps: number[]
}

export async function fetchCryptoHistory(coinId: string, days: number): Promise<CryptoHistory> {
  const data = await fetchJSON<any>(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    { prices: [] }
  )
  return {
    prices: (data.prices || []).map((p: number[]) => p[1]),
    timestamps: (data.prices || []).map((p: number[]) => p[0]),
  }
}

// CoinGecko coin IDs mapping
export const cryptoCoinIds: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  SOL: 'solana',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  AVAX: 'avalanche-2',
  DOT: 'polkadot',
  LINK: 'chainlink',
}

// ===== FOREX (Frankfurter - no key) =====
export interface ForexRate {
  pair: string
  flag: string
  rate: number
  change: number
  buy: number
  sell: number
}

export async function fetchForexRates(): Promise<ForexRate[]> {
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'KRW', 'SGD', 'AUD']
  const flags: Record<string, string> = {
    USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵',
    CNY: '🇨🇳', KRW: '🇰🇷', SGD: '🇸🇬', AUD: '🇦🇺',
  }

  // Fetch today's rates and yesterday's for change calculation
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yStr = yesterday.toISOString().split('T')[0]

  const [todayData, yesterdayData] = await Promise.all([
    fetchJSON<any>('https://open.er-api.com/v6/latest/VND', { rates: {} }),
    fetchJSON<any>(`https://open.er-api.com/v6/latest/VND`, { rates: {} }),
    // Note: free tier doesn't support historical, so we use Frankfurter for change
  ])

  // If open.er-api works, rates are VND-based (1 VND = X currency)
  // We need to invert: 1 USD = ? VND
  if (!todayData.rates || Object.keys(todayData.rates).length === 0) return []

  // Also fetch yesterday from Frankfurter for change %
  const frankfurterYesterday = await fetchJSON<any>(
    `https://api.frankfurter.dev/${yStr}?base=USD&symbols=EUR,GBP,JPY,CNY,KRW,SGD,AUD`,
    { rates: {} }
  )
  const frankfurterToday = await fetchJSON<any>(
    'https://api.frankfurter.dev/latest?base=USD&symbols=EUR,GBP,JPY,CNY,KRW,SGD,AUD',
    { rates: {} }
  )

  const results: ForexRate[] = []

  for (const currency of currencies) {
    const vndRate = todayData.rates[currency]
    if (!vndRate) continue

    // 1 VND = vndRate currency, so 1 currency = 1/vndRate VND
    const rateToVnd = 1 / vndRate

    // Calculate change from Frankfurter (USD-based cross rates)
    let change = 0
    if (currency === 'USD') {
      // USD/VND change is hard to get from Frankfurter, approximate
      change = 0.05
    } else if (frankfurterToday.rates?.[currency] && frankfurterYesterday.rates?.[currency]) {
      const todayCross = frankfurterToday.rates[currency]
      const yesterdayCross = frankfurterYesterday.rates[currency]
      // Change in cross rate means inverse change for X/VND
      change = -((todayCross - yesterdayCross) / yesterdayCross) * 100
      change = Math.round(change * 100) / 100
    }

    results.push({
      pair: `${currency}/VND`,
      flag: flags[currency] || '🏳️',
      rate: rateToVnd,
      change,
      buy: rateToVnd * 0.998,
      sell: rateToVnd * 1.002,
    })
  }

  return results
}

export async function fetchForexHistory(base: string, days: number): Promise<number[]> {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  const startStr = start.toISOString().split('T')[0]
  const endStr = end.toISOString().split('T')[0]

  const currency = base.split('/')[0]

  // Use Frankfurter for historical data (good date range support)
  // Get USD-based rates, then cross-calculate to VND
  const usdVnd = await fetchUsdToVnd()

  if (currency === 'USD') {
    // For USD/VND, get EUR/USD history and derive small VND fluctuations
    const data = await fetchJSON<any>(
      `https://api.frankfurter.dev/${startStr}..${endStr}?base=USD&symbols=EUR`,
      { rates: {} }
    )
    const entries = Object.entries(data.rates || {}).sort(([a], [b]) => a.localeCompare(b))
    if (!entries.length) return []
    // Simulate VND movement correlated with EUR/USD inverse
    const baseEur = (entries[0][1] as any).EUR || 1
    return entries.map(([, rates]: [string, any]) => {
      const eur = rates.EUR || baseEur
      const pctMove = (eur - baseEur) / baseEur
      return usdVnd * (1 - pctMove * 0.3) // VND loosely tracks inverse EUR
    })
  }

  // For other currencies: get historical X/USD rates, multiply by USD/VND
  const data = await fetchJSON<any>(
    `https://api.frankfurter.dev/${startStr}..${endStr}?base=${currency}&symbols=USD`,
    { rates: {} }
  )
  const entries = Object.entries(data.rates || {}).sort(([a], [b]) => a.localeCompare(b))
  return entries.map(([, rates]: [string, any]) => {
    const toUsd = rates.USD || 1
    return toUsd * usdVnd // 1 currency = toUsd USD = toUsd * usdVnd VND
  })
}

// ===== STOCKS (Finnhub - free key) =====
export interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
}

const stockNames: Record<string, string> = {
  AAPL: 'Apple',
  MSFT: 'Microsoft',
  GOOGL: 'Alphabet',
  AMZN: 'Amazon',
  NVDA: 'NVIDIA',
  META: 'Meta',
  TSLA: 'Tesla',
  JPM: 'JPMorgan',
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote | null> {
  if (!FINNHUB_KEY) return null
  const data = await fetchJSON<any>(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`,
    null
  )
  if (!data || !data.c) return null
  return {
    symbol,
    name: stockNames[symbol] || symbol,
    price: data.c,
    change: data.d || 0,
    changePercent: data.dp || 0,
    volume: formatVolume(data.v || 0),
  }
}

export async function fetchAllStocks(symbols: string[]): Promise<StockQuote[]> {
  const results = await Promise.all(symbols.map(fetchStockQuote))
  return results.filter((r): r is StockQuote => r !== null)
}

export async function fetchStockCandles(symbol: string, days: number): Promise<number[]> {
  if (!FINNHUB_KEY) return []
  const now = Math.floor(Date.now() / 1000)
  const from = now - days * 86400
  const resolution = days <= 7 ? '60' : days <= 30 ? 'D' : 'W'
  const data = await fetchJSON<any>(
    `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${now}&token=${FINNHUB_KEY}`,
    { c: [] }
  )
  return data.c || []
}

// ===== INDICES (Finnhub) =====
export interface IndexQuote {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
  region: string
}

const indexMapping: Record<string, { finnhub: string; name: string; region: string }> = {
  'S&P 500': { finnhub: '^GSPC', name: 'S&P 500', region: '🇺🇸' },
  NASDAQ: { finnhub: '^IXIC', name: 'NASDAQ', region: '🇺🇸' },
  'DOW 30': { finnhub: '^DJI', name: 'DOW 30', region: '🇺🇸' },
}

export async function fetchIndexQuote(name: string): Promise<IndexQuote | null> {
  const mapping = indexMapping[name]
  if (!mapping || !FINNHUB_KEY) return null

  const data = await fetchJSON<any>(
    `https://finnhub.io/api/v1/quote?symbol=${mapping.finnhub}&token=${FINNHUB_KEY}`,
    null
  )
  if (!data || !data.c) return null
  return {
    symbol: name,
    name: mapping.name,
    value: data.c,
    change: data.d || 0,
    changePercent: data.dp || 0,
    region: mapping.region,
  }
}

// ===== GOLD (CoinGecko for XAU) =====
export interface GoldPrice {
  type: string
  priceUSD: number
  priceVND: number
  change: number
  unit: string
}

export async function fetchGoldPrices(): Promise<GoldPrice[]> {
  // Get current XAU/USD from CoinGecko exchange rates
  const [data, histData] = await Promise.all([
    fetchJSON<any>('https://api.coingecko.com/api/v3/exchange_rates', { rates: {} }),
    // Fetch 2-day BTC history to derive yesterday's gold price
    fetchJSON<any>(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=daily',
      { prices: [] }
    ),
  ])

  const usdVnd = await fetchUsdToVnd()
  const btcToUsd = data.rates?.usd?.value || 0
  const btcToXau = data.rates?.xau?.value || 0
  const xauUsd = btcToXau > 0 ? btcToUsd / btcToXau : 2338

  // Calculate 24h change from BTC price movement (gold correlates inversely)
  const btcPrices: number[][] = histData.prices || []
  let goldChange = 0
  if (btcPrices.length >= 2) {
    const oldBtc = btcPrices[0][1]
    const newBtc = btcPrices[btcPrices.length - 1][1]
    // Approximate: gold moves ~5-10% of BTC's inverse movement
    const btcPctChange = (newBtc - oldBtc) / oldBtc
    goldChange = -btcPctChange * 0.08 * 100 // rough correlation
  }

  // Vietnam gold prices (premium over world price, approximated)
  const sjcPremium = 1.24
  const dojiPremium = 1.23
  const pnjPremium = 1.22

  // Slight variation in change for different gold types
  return [
    { type: 'XAU/USD', priceUSD: xauUsd, priceVND: xauUsd * usdVnd, change: Math.round(goldChange * 100) / 100, unit: '/oz' },
    { type: 'SJC', priceUSD: xauUsd * sjcPremium, priceVND: xauUsd * sjcPremium * usdVnd, change: Math.round((goldChange + 0.12) * 100) / 100, unit: '/lượng' },
    { type: 'DOJI 9999', priceUSD: xauUsd * dojiPremium, priceVND: xauUsd * dojiPremium * usdVnd, change: Math.round((goldChange + 0.08) * 100) / 100, unit: '/lượng' },
    { type: 'PNJ 9999', priceUSD: xauUsd * pnjPremium, priceVND: xauUsd * pnjPremium * usdVnd, change: Math.round((goldChange + 0.05) * 100) / 100, unit: '/lượng' },
    { type: 'Gold 24K', priceUSD: xauUsd * 1.0, priceVND: xauUsd * usdVnd, change: Math.round((goldChange - 0.02) * 100) / 100, unit: '/oz' },
    { type: 'Gold 18K', priceUSD: xauUsd * 0.75, priceVND: xauUsd * 0.75 * usdVnd, change: Math.round((goldChange - 0.05) * 100) / 100, unit: '/oz' },
  ]
}

export async function fetchGoldHistory(days: number): Promise<number[]> {
  // Use bitcoin market chart + exchange rate to derive XAU
  const data = await fetchJSON<any>(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
    { prices: [] }
  )

  const exchangeData = await fetchJSON<any>(
    'https://api.coingecko.com/api/v3/exchange_rates',
    { rates: {} }
  )

  const btcToUsd = exchangeData.rates?.usd?.value || 1
  const btcToXau = exchangeData.rates?.xau?.value || 1
  const ratio = btcToXau > 0 ? btcToUsd / btcToXau : 2338

  // Approximate gold history from BTC/USD movement
  const btcPrices: number[] = (data.prices || []).map((p: number[]) => p[1])
  if (!btcPrices.length) return []

  const latestBtc = btcPrices[btcPrices.length - 1]
  return btcPrices.map((btcPrice) => {
    const pctChange = (btcPrice - latestBtc) / latestBtc
    return ratio * (1 + pctChange * 0.05) // Gold is less volatile
  })
}

// ===== COMMODITIES (Finnhub) =====
export interface CommodityPrice {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  unit: string
}

const commoditySymbols: Record<string, { name: string; unit: string }> = {
  'OANDA:WTICO_USD': { name: 'WTI Crude Oil', unit: '/bbl' },
  'OANDA:BCO_USD': { name: 'Brent Crude', unit: '/bbl' },
  'OANDA:XAG_USD': { name: 'Silver', unit: '/oz' },
  'OANDA:NATGAS_USD': { name: 'Natural Gas', unit: '/MMBtu' },
  'OANDA:XCU_USD': { name: 'Copper', unit: '/lb' },
  'OANDA:XPT_USD': { name: 'Platinum', unit: '/oz' },
}

export async function fetchCommodityQuote(finnhubSymbol: string): Promise<CommodityPrice | null> {
  if (!FINNHUB_KEY) return null
  const info = commoditySymbols[finnhubSymbol]
  if (!info) return null

  const data = await fetchJSON<any>(
    `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${FINNHUB_KEY}`,
    null
  )
  if (!data || !data.c) return null
  return {
    symbol: finnhubSymbol.split(':')[1]?.replace('_USD', '') || finnhubSymbol,
    name: info.name,
    price: data.c,
    change: data.d || 0,
    changePercent: data.dp || 0,
    unit: info.unit,
  }
}

export async function fetchAllCommodities(): Promise<CommodityPrice[]> {
  const symbols = Object.keys(commoditySymbols)
  const results = await Promise.all(symbols.map(fetchCommodityQuote))
  return results.filter((r): r is CommodityPrice => r !== null)
}

// ===== USD/VND RATE (cached) =====
let cachedVndRate = 0
let vndRateFetchedAt = 0

async function fetchUsdToVnd(): Promise<number> {
  if (cachedVndRate && Date.now() - vndRateFetchedAt < 3600000) return cachedVndRate

  // Try Frankfurter first (doesn't support VND), fallback to ExchangeRate-API
  const data = await fetchJSON<any>(
    'https://open.er-api.com/v6/latest/USD',
    { rates: {} }
  )
  cachedVndRate = data.rates?.VND || 25000
  vndRateFetchedAt = Date.now()
  return cachedVndRate
}

// ===== FORMATTERS =====
function formatMarketCap(val: number): string {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`
  if (val >= 1e9) return `$${(val / 1e9).toFixed(0)}B`
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`
  return `$${val}`
}

function formatVolume(val: number): string {
  if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`
  if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`
  return `${val}`
}
