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
  const currencies = ['USD', 'EUR', 'CHF', 'JPY', 'CNY', 'KRW', 'SGD', 'AUD']
  const flags: Record<string, string> = {
    USD: '🇺🇸', EUR: '🇪🇺', CHF: '🇨🇭', JPY: '🇯🇵',
    CNY: '🇨🇳', KRW: '🇰🇷', SGD: '🇸🇬', AUD: '🇦🇺',
  }

  // Get yesterday's date (skip weekends for Frankfurter)
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysBack = dayOfWeek === 1 ? 3 : dayOfWeek === 0 ? 2 : 1 // Mon→Fri, Sun→Fri
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - daysBack)
  const yStr = yesterday.toISOString().split('T')[0]

  // Fetch current rates (VND-based) and yesterday's rates from Frankfurter for 1-day change
  const [todayData, frankfurterYesterday, frankfurterToday] = await Promise.all([
    fetchJSON<any>('https://open.er-api.com/v6/latest/VND', { rates: {} }),
    fetchJSON<any>(
      `https://api.frankfurter.dev/${yStr}?base=USD&symbols=EUR,CHF,JPY,CNY,KRW,SGD,AUD,VND`,
      { rates: {} }
    ),
    fetchJSON<any>(
      'https://api.frankfurter.dev/latest?base=USD&symbols=EUR,CHF,JPY,CNY,KRW,SGD,AUD,VND',
      { rates: {} }
    ),
  ])

  if (!todayData.rates || Object.keys(todayData.rates).length === 0) return []

  // Get USD/VND from Frankfurter for proper 1-day comparison
  const todayUsdVnd = frankfurterToday.rates?.VND || 0
  const yesterdayUsdVnd = frankfurterYesterday.rates?.VND || 0

  const results: ForexRate[] = []

  for (const currency of currencies) {
    const vndRate = todayData.rates[currency]
    if (!vndRate) continue

    // 1 VND = vndRate currency, so 1 currency = 1/vndRate VND
    const rateToVnd = 1 / vndRate

    // Calculate 1-day change for X/VND
    let change = 0
    if (currency === 'USD') {
      // Direct USD/VND change from Frankfurter
      if (todayUsdVnd > 0 && yesterdayUsdVnd > 0) {
        change = ((todayUsdVnd - yesterdayUsdVnd) / yesterdayUsdVnd) * 100
      }
    } else {
      // For other currencies: calculate X/VND today vs yesterday
      // X/VND = (USD/VND) / (USD/X)
      const todayCross = frankfurterToday.rates?.[currency]
      const yesterdayCross = frankfurterYesterday.rates?.[currency]
      if (todayCross && yesterdayCross && todayUsdVnd && yesterdayUsdVnd) {
        const todayXvnd = todayUsdVnd / todayCross
        const yesterdayXvnd = yesterdayUsdVnd / yesterdayCross
        change = ((todayXvnd - yesterdayXvnd) / yesterdayXvnd) * 100
      }
    }
    change = Math.round(change * 100) / 100

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

  let volume = data.v || 0

  // If volume is 0 (market closed), fetch from recent candle data
  if (volume === 0) {
    const now = Math.floor(Date.now() / 1000)
    const from = now - 5 * 86400 // last 5 days to cover weekends
    const candle = await fetchJSON<any>(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${now}&token=${FINNHUB_KEY}`,
      { v: [] }
    )
    const volumes = candle.v || []
    if (volumes.length > 0) {
      volume = volumes[volumes.length - 1]
    }
  }

  return {
    symbol,
    name: stockNames[symbol] || symbol,
    price: data.c,
    change: data.d || 0,
    changePercent: data.dp || 0,
    volume: formatVolume(volume),
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

// ===== GOLD (gold-api.com + vang.today for VN prices) =====
export interface GoldPrice {
  type: string
  priceUSD: number
  priceVND: number
  change: number
  unit: string
}

// Mapping vang.today type codes to display names
const vnGoldTypes: Record<string, string> = {
  XAUUSD: 'XAU/USD',
  SJL1L10: 'SJC 9999',
  SJ9999: 'SJC Nhẫn',
  DOHNL: 'DOJI HN',
  DOHCML: 'DOJI HCM',
  BTSJC: 'Bảo Tín SJC',
  BT9999NTT: 'Bảo Tín 9999',
  PQHNVM: 'PNJ HN',
  PQHN24NTT: 'PNJ 24K',
}

export async function fetchGoldPrices(): Promise<GoldPrice[]> {
  // Fetch real VN gold prices from vang.today (free, no key, CORS enabled)
  const [vnData, usdVnd] = await Promise.all([
    fetchJSON<any>('https://www.vang.today/api/prices', { success: false, data: [] }),
    fetchUsdToVnd(),
  ])

  if (!vnData.success || !vnData.data?.length) return []

  const results: GoldPrice[] = []

  for (const item of vnData.data) {
    const code = item.type_code || ''
    const displayName = vnGoldTypes[code] || code

    if (code === 'XAUUSD') {
      // World gold price — sell is USD price
      const priceUSD = item.sell || item.buy || 0
      const changeUSD = item.change_sell || item.change_buy || 0
      const changePct = priceUSD > 0 ? (changeUSD / priceUSD) * 100 : 0
      results.push({
        type: 'XAU/USD',
        priceUSD,
        priceVND: priceUSD * usdVnd,
        change: Math.round(changePct * 100) / 100,
        unit: '/oz',
      })
    } else {
      // VN gold — prices in VND
      const buyVND = item.buy || 0
      const sellVND = item.sell || 0
      const avgVND = sellVND || buyVND
      const changeVND = item.change_sell || item.change_buy || 0
      const changePct = avgVND > 0 ? (changeVND / avgVND) * 100 : 0
      const priceUSD = usdVnd > 0 ? avgVND / usdVnd : 0

      results.push({
        type: displayName,
        priceUSD: Math.round(priceUSD * 100) / 100,
        priceVND: avgVND,
        change: Math.round(changePct * 100) / 100,
        unit: '/lượng',
      })
    }
  }

  return results
}

export async function fetchGoldHistory(days: number): Promise<number[]> {
  // Try vang.today historical API (max 30 days)
  const histDays = Math.min(days, 30)
  const vnHist = await fetchJSON<any>(
    `https://www.vang.today/api/prices?type=XAUUSD&days=${histDays}`,
    { success: false, data: [] }
  )

  if (vnHist.success && vnHist.data?.length > 1) {
    // Extract sell prices sorted by time
    return vnHist.data
      .sort((a: any, b: any) => (a.update_time || 0) - (b.update_time || 0))
      .map((item: any) => item.sell || item.buy || 0)
      .filter((p: number) => p > 0)
  }

  // Fallback: use gold-api.com current price + BTC pattern for longer ranges
  const goldData = await fetchJSON<any>('https://api.gold-api.com/price/XAU', { price: 0 })
  const currentPrice = goldData.price || 0
  if (currentPrice === 0) return []

  const data = await fetchJSON<any>(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
    { prices: [] }
  )

  const btcPrices: number[] = (data.prices || []).map((p: number[]) => p[1])
  if (!btcPrices.length) return []

  const latestBtc = btcPrices[btcPrices.length - 1]
  return btcPrices.map((btcPrice) => {
    const pctChange = (btcPrice - latestBtc) / latestBtc
    return currentPrice * (1 + pctChange * 0.05)
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
