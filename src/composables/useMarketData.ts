import { ref, onMounted } from 'vue'
import {
  fetchCryptoPrices,
  fetchCryptoHistory,
  fetchForexRates,
  fetchForexHistory,
  fetchAllStocks,
  fetchStockCandles,
  fetchGoldPrices,
  fetchGoldHistory,
  fetchAllCommodities,
  cryptoCoinIds,
  type CryptoPrice,
  type ForexRate,
  type StockQuote,
  type GoldPrice,
  type CommodityPrice,
} from '@/services/marketApi'

// ===== FALLBACK DATA =====
const fallbackStocks: StockQuote[] = [
  { symbol: 'AAPL', name: 'Apple', price: 178.72, change: 2.34, changePercent: 1.33, volume: '58.2M' },
  { symbol: 'MSFT', name: 'Microsoft', price: 415.56, change: -1.23, changePercent: -0.30, volume: '22.1M' },
  { symbol: 'GOOGL', name: 'Alphabet', price: 153.81, change: 3.47, changePercent: 2.31, volume: '31.5M' },
  { symbol: 'AMZN', name: 'Amazon', price: 185.63, change: 1.92, changePercent: 1.05, volume: '45.8M' },
  { symbol: 'NVDA', name: 'NVIDIA', price: 875.28, change: 12.45, changePercent: 1.44, volume: '41.3M' },
  { symbol: 'META', name: 'Meta', price: 505.14, change: -3.78, changePercent: -0.74, volume: '18.7M' },
  { symbol: 'TSLA', name: 'Tesla', price: 248.42, change: 5.67, changePercent: 2.33, volume: '92.4M' },
  { symbol: 'JPM', name: 'JPMorgan', price: 198.44, change: -0.56, changePercent: -0.28, volume: '8.9M' },
]

const fallbackCryptos: CryptoPrice[] = [
  { symbol: 'BTC', name: 'Bitcoin', priceUSD: 67842.50, priceVND: 1696062500, change24h: 2.14, marketCap: '$1.33T', image: '' },
  { symbol: 'ETH', name: 'Ethereum', priceUSD: 3456.78, priceVND: 86419500, change24h: -0.87, marketCap: '$415B', image: '' },
  { symbol: 'BNB', name: 'BNB', priceUSD: 584.32, priceVND: 14608000, change24h: 1.23, marketCap: '$87B', image: '' },
  { symbol: 'SOL', name: 'Solana', priceUSD: 148.65, priceVND: 3716250, change24h: 4.56, marketCap: '$66B', image: '' },
  { symbol: 'XRP', name: 'XRP', priceUSD: 0.5234, priceVND: 13085, change24h: -1.32, marketCap: '$28B', image: '' },
  { symbol: 'ADA', name: 'Cardano', priceUSD: 0.4521, priceVND: 11302, change24h: 0.78, marketCap: '$16B', image: '' },
  { symbol: 'DOGE', name: 'Dogecoin', priceUSD: 0.1245, priceVND: 3112, change24h: 3.21, marketCap: '$18B', image: '' },
  { symbol: 'AVAX', name: 'Avalanche', priceUSD: 35.67, priceVND: 891750, change24h: -2.45, marketCap: '$13B', image: '' },
  { symbol: 'DOT', name: 'Polkadot', priceUSD: 7.23, priceVND: 180750, change24h: 1.05, marketCap: '$10B', image: '' },
  { symbol: 'LINK', name: 'Chainlink', priceUSD: 14.56, priceVND: 364000, change24h: 2.89, marketCap: '$8.5B', image: '' },
]

const fallbackGolds: GoldPrice[] = [
  { type: 'XAU/USD', priceUSD: 4686.60, priceVND: 117165000, change: -0.29, unit: '/oz' },
  { type: 'SJC 9999', priceUSD: 7052.00, priceVND: 176300000, change: -0.85, unit: '/lượng' },
  { type: 'SJC Nhẫn', priceUSD: 6892.00, priceVND: 172300000, change: -0.87, unit: '/lượng' },
  { type: 'DOJI HN', priceUSD: 6932.00, priceVND: 173300000, change: -0.87, unit: '/lượng' },
  { type: 'DOJI HCM', priceUSD: 6932.00, priceVND: 173300000, change: -0.87, unit: '/lượng' },
  { type: 'PNJ HN', priceUSD: 6892.00, priceVND: 172300000, change: -0.87, unit: '/lượng' },
  { type: 'Bảo Tín SJC', priceUSD: 7052.00, priceVND: 176300000, change: -1.64, unit: '/lượng' },
]

const fallbackForex: ForexRate[] = [
  { pair: 'USD/VND', flag: '🇺🇸', rate: 25000, change: 0.12, buy: 24950, sell: 25050 },
  { pair: 'EUR/VND', flag: '🇪🇺', rate: 27125, change: -0.08, buy: 27050, sell: 27200 },
  { pair: 'CHF/VND', flag: '🇨🇭', rate: 28450, change: 0.18, buy: 28390, sell: 28510 },
  { pair: 'JPY/VND', flag: '🇯🇵', rate: 165.8, change: -0.35, buy: 165.2, sell: 166.4 },
  { pair: 'CNY/VND', flag: '🇨🇳', rate: 3452, change: 0.15, buy: 3440, sell: 3464 },
  { pair: 'KRW/VND', flag: '🇰🇷', rate: 18.32, change: 0.42, buy: 18.25, sell: 18.39 },
  { pair: 'SGD/VND', flag: '🇸🇬', rate: 18620, change: -0.11, buy: 18560, sell: 18680 },
  { pair: 'AUD/VND', flag: '🇦🇺', rate: 16380, change: 0.33, buy: 16320, sell: 16440 },
]

const fallbackCommodities: CommodityPrice[] = [
  { symbol: 'WTICO', name: 'WTI Crude Oil', price: 78.42, change: 1.23, changePercent: 1.59, unit: '/bbl' },
  { symbol: 'BCO', name: 'Brent Crude', price: 82.86, change: 0.94, changePercent: 1.15, unit: '/bbl' },
  { symbol: 'XAG', name: 'Silver', price: 27.84, change: 0.42, changePercent: 1.53, unit: '/oz' },
  { symbol: 'NATGAS', name: 'Natural Gas', price: 2.18, change: -0.06, changePercent: -2.68, unit: '/MMBtu' },
  { symbol: 'XCU', name: 'Copper', price: 4.52, change: 0.08, changePercent: 1.80, unit: '/lb' },
  { symbol: 'XPT', name: 'Platinum', price: 1012.40, change: -8.60, changePercent: -0.84, unit: '/oz' },
]

const fallbackIndices = [
  { symbol: 'VN-Index', name: 'Vietnam', value: 1285.42, change: 8.34, changePercent: 0.65, region: '🇻🇳' },
  { symbol: 'S&P 500', name: 'US', value: 5234.18, change: 15.29, changePercent: 0.29, region: '🇺🇸' },
  { symbol: 'NASDAQ', name: 'US', value: 16428.82, change: -42.35, changePercent: -0.26, region: '🇺🇸' },
  { symbol: 'DOW 30', name: 'US', value: 39150.33, change: 68.74, changePercent: 0.18, region: '🇺🇸' },
  { symbol: 'Nikkei 225', name: 'Japan', value: 40168.07, change: -156.24, changePercent: -0.39, region: '🇯🇵' },
  { symbol: 'FTSE 100', name: 'UK', value: 8164.12, change: 22.56, changePercent: 0.28, region: '🇬🇧' },
  { symbol: 'DAX', name: 'Germany', value: 18492.49, change: 45.18, changePercent: 0.24, region: '🇩🇪' },
  { symbol: 'HSI', name: 'Hong Kong', value: 17635.88, change: -128.45, changePercent: -0.72, region: '🇭🇰' },
]

// ===== TIME RANGE TO DAYS =====
export function timeRangeToDays(range: string): number {
  switch (range) {
    case '1W': return 7
    case '1M': return 30
    case '3M': return 90
    case '6M': return 180
    case '1Y': return 365
    default: return 90
  }
}

// ===== GLOBAL CACHE =====
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  fetchedAt: number
}

const marketCache: Record<string, CacheEntry<any>> = {}
const chartCacheMap = new Map<string, CacheEntry<number[]>>()

function getCached<T>(key: string): T | null {
  const entry = marketCache[key]
  if (entry && Date.now() - entry.fetchedAt < CACHE_TTL) return entry.data
  return null
}

function setCache<T>(key: string, data: T) {
  marketCache[key] = { data, fetchedAt: Date.now() }
}

// ===== GLOBAL SINGLETON STATE =====
const globalStocks = ref<StockQuote[]>(fallbackStocks)
const globalCryptos = ref<CryptoPrice[]>(fallbackCryptos)
const globalGolds = ref<GoldPrice[]>(fallbackGolds)
const globalForexRates = ref<ForexRate[]>(fallbackForex)
const globalCommodities = ref<CommodityPrice[]>(fallbackCommodities)
const globalIndices = ref(fallbackIndices)
const globalIsLoading = ref(false)
const globalIsLive = ref(false)
let hasFetched = false

async function loadAllMarkets() {
  if (hasFetched && Date.now() - (marketCache['_lastFetch']?.fetchedAt || 0) < CACHE_TTL) return

  globalIsLoading.value = true

  // Check individual caches first
  const cachedStocks = getCached<StockQuote[]>('stocks')
  const cachedCryptos = getCached<CryptoPrice[]>('cryptos')
  const cachedGolds = getCached<GoldPrice[]>('golds')
  const cachedForex = getCached<ForexRate[]>('forex')
  const cachedCommodities = getCached<CommodityPrice[]>('commodities')

  const promises: Promise<any>[] = [
    cachedStocks ? Promise.resolve(cachedStocks) : fetchAllStocks(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'JPM']),
    cachedCryptos ? Promise.resolve(cachedCryptos) : fetchCryptoPrices(),
    cachedGolds ? Promise.resolve(cachedGolds) : fetchGoldPrices(),
    cachedForex ? Promise.resolve(cachedForex) : fetchForexRates(),
    cachedCommodities ? Promise.resolve(cachedCommodities) : fetchAllCommodities(),
  ]

  const results = await Promise.allSettled(promises)

  if (results[0].status === 'fulfilled' && results[0].value.length) {
    globalStocks.value = results[0].value
    setCache('stocks', results[0].value)
    globalIsLive.value = true
  }
  if (results[1].status === 'fulfilled' && results[1].value.length) {
    globalCryptos.value = results[1].value
    setCache('cryptos', results[1].value)
    globalIsLive.value = true
  }
  if (results[2].status === 'fulfilled' && results[2].value.length) {
    globalGolds.value = results[2].value
    setCache('golds', results[2].value)
  }
  if (results[3].status === 'fulfilled' && results[3].value.length) {
    globalForexRates.value = results[3].value
    setCache('forex', results[3].value)
  }
  if (results[4].status === 'fulfilled' && results[4].value.length) {
    globalCommodities.value = results[4].value
    setCache('commodities', results[4].value)
  }

  setCache('_lastFetch', true)
  hasFetched = true
  globalIsLoading.value = false
}

// ===== COMPOSABLE =====
export function useMarketData() {
  onMounted(loadAllMarkets)

  return {
    stocks: globalStocks,
    cryptos: globalCryptos,
    golds: globalGolds,
    forexRates: globalForexRates,
    commodities: globalCommodities,
    indices: globalIndices,
    isLoading: globalIsLoading,
    isLive: globalIsLive,
  }
}

// ===== CHART DATA COMPOSABLE =====
export function useChartData() {
  async function getChartData(type: string, symbol: string, timeRange: string): Promise<number[]> {
    const key = `${type}-${symbol}-${timeRange}`

    // Check cache
    const cached = chartCacheMap.get(key)
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      return cached.data
    }

    const days = timeRangeToDays(timeRange)
    let data: number[] = []

    try {
      switch (type) {
        case 'stock':
          data = await fetchStockCandles(symbol, days)
          break
        case 'crypto': {
          const coinId = cryptoCoinIds[symbol] || symbol.toLowerCase()
          const history = await fetchCryptoHistory(coinId, days)
          data = history.prices
          break
        }
        case 'gold':
          data = await fetchGoldHistory(days)
          break
        case 'forex':
          data = await fetchForexHistory(symbol, days)
          break
      }
    } catch {
      // Will return empty, component generates fallback
    }

    if (data.length > 0) {
      chartCacheMap.set(key, { data, fetchedAt: Date.now() })
    }
    return data
  }

  return { getChartData }
}
