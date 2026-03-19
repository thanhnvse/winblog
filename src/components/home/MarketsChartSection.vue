<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { useChartData, timeRangeToDays } from '@/composables/useMarketData'

useScrollAnimation()

const { getChartData } = useChartData()

// ===== TIME RANGES =====
const timeRanges = ['1W', '1M', '3M', '6M', '1Y'] as const
type TimeRange = (typeof timeRanges)[number]

// ===== CHART DATA GENERATOR =====
function generatePoints(base: number, volatility: number, count: number, trend: number): number[] {
  const points: number[] = []
  let value = base
  for (let i = 0; i < count; i++) {
    value += (Math.random() - 0.48) * volatility + trend
    points.push(Math.round(value * 100) / 100)
  }
  return points
}

// ===== STOCKS =====
const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'AMZN'] as const
const selectedStock = ref<string>('AAPL')
const selectedStockTime = ref<TimeRange>('3M')

const stockData: Record<string, Record<TimeRange, number[]>> = {
  AAPL: { '1W': generatePoints(176, 2, 7, 0.3), '1M': generatePoints(170, 3, 30, 0.2), '3M': generatePoints(160, 4, 90, 0.2), '6M': generatePoints(150, 5, 180, 0.15), '1Y': generatePoints(140, 6, 365, 0.1) },
  MSFT: { '1W': generatePoints(413, 3, 7, 0.4), '1M': generatePoints(400, 5, 30, 0.4), '3M': generatePoints(380, 7, 90, 0.35), '6M': generatePoints(360, 8, 180, 0.3), '1Y': generatePoints(330, 10, 365, 0.2) },
  GOOGL: { '1W': generatePoints(151, 2, 7, 0.3), '1M': generatePoints(145, 3, 30, 0.25), '3M': generatePoints(138, 4, 90, 0.18), '6M': generatePoints(130, 5, 180, 0.13), '1Y': generatePoints(120, 6, 365, 0.09) },
  NVDA: { '1W': generatePoints(870, 10, 7, 1.5), '1M': generatePoints(820, 15, 30, 1.5), '3M': generatePoints(750, 20, 90, 1.2), '6M': generatePoints(600, 25, 180, 1.5), '1Y': generatePoints(450, 30, 365, 1.1) },
  AMZN: { '1W': generatePoints(184, 2, 7, 0.2), '1M': generatePoints(178, 3, 30, 0.2), '3M': generatePoints(168, 4, 90, 0.18), '6M': generatePoints(155, 5, 180, 0.15), '1Y': generatePoints(140, 6, 365, 0.12) },
}

// ===== CRYPTO =====
const cryptoSymbols = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'] as const
const selectedCrypto = ref<string>('BTC')
const selectedCryptoTime = ref<TimeRange>('3M')

const cryptoData: Record<string, Record<TimeRange, number[]>> = {
  BTC: { '1W': generatePoints(66500, 800, 7, 150), '1M': generatePoints(62000, 1500, 30, 150), '3M': generatePoints(55000, 2500, 90, 130), '6M': generatePoints(42000, 3000, 180, 140), '1Y': generatePoints(30000, 4000, 365, 100) },
  ETH: { '1W': generatePoints(3400, 50, 7, 8), '1M': generatePoints(3200, 80, 30, 7), '3M': generatePoints(2800, 120, 90, 6), '6M': generatePoints(2200, 150, 180, 6), '1Y': generatePoints(1800, 180, 365, 4) },
  SOL: { '1W': generatePoints(146, 4, 7, 0.5), '1M': generatePoints(130, 8, 30, 0.5), '3M': generatePoints(100, 12, 90, 0.5), '6M': generatePoints(70, 15, 180, 0.4), '1Y': generatePoints(40, 18, 365, 0.3) },
  BNB: { '1W': generatePoints(580, 8, 7, 0.5), '1M': generatePoints(560, 12, 30, 0.6), '3M': generatePoints(520, 18, 90, 0.6), '6M': generatePoints(450, 22, 180, 0.7), '1Y': generatePoints(350, 28, 365, 0.6) },
  XRP: { '1W': generatePoints(0.52, 0.01, 7, 0.001), '1M': generatePoints(0.50, 0.02, 30, 0.0008), '3M': generatePoints(0.46, 0.03, 90, 0.0006), '6M': generatePoints(0.40, 0.04, 180, 0.0006), '1Y': generatePoints(0.35, 0.05, 365, 0.0004) },
}

// ===== GOLD =====
const goldTypes = ['XAU/USD', 'SJC', 'DOJI 9999', 'PNJ 9999'] as const
const selectedGold = ref<string>('XAU/USD')
const selectedGoldTime = ref<TimeRange>('3M')

const goldData: Record<string, Record<TimeRange, number[]>> = {
  'XAU/USD': { '1W': generatePoints(2330, 10, 7, 1.2), '1M': generatePoints(2280, 20, 30, 1.5), '3M': generatePoints(2200, 30, 90, 1.4), '6M': generatePoints(2050, 40, 180, 1.5), '1Y': generatePoints(1900, 50, 365, 1.2) },
  SJC: { '1W': generatePoints(72000000, 200000, 7, 30000), '1M': generatePoints(70000000, 400000, 30, 50000), '3M': generatePoints(67000000, 600000, 90, 50000), '6M': generatePoints(62000000, 800000, 180, 50000), '1Y': generatePoints(55000000, 1000000, 365, 45000) },
  'DOJI 9999': { '1W': generatePoints(71800000, 180000, 7, 25000), '1M': generatePoints(69500000, 350000, 30, 45000), '3M': generatePoints(66500000, 550000, 90, 48000), '6M': generatePoints(61500000, 750000, 180, 48000), '1Y': generatePoints(54500000, 950000, 365, 43000) },
  'PNJ 9999': { '1W': generatePoints(71400000, 170000, 7, 22000), '1M': generatePoints(69000000, 330000, 30, 42000), '3M': generatePoints(66000000, 520000, 90, 45000), '6M': generatePoints(61000000, 700000, 180, 45000), '1Y': generatePoints(54000000, 900000, 365, 40000) },
}

// ===== FOREX =====
const forexPairs = ['USD/VND', 'EUR/VND', 'GBP/VND', 'JPY/VND', 'CNY/VND'] as const
const selectedForex = ref<string>('USD/VND')
const selectedForexTime = ref<TimeRange>('3M')

const forexData: Record<string, Record<TimeRange, number[]>> = {
  'USD/VND': { '1W': generatePoints(24980, 15, 7, 2), '1M': generatePoints(24900, 30, 30, 2.5), '3M': generatePoints(24750, 50, 90, 2.5), '6M': generatePoints(24500, 80, 180, 2.5), '1Y': generatePoints(24200, 100, 365, 2) },
  'EUR/VND': { '1W': generatePoints(27080, 30, 7, 5), '1M': generatePoints(26900, 60, 30, 5), '3M': generatePoints(26500, 100, 90, 6), '6M': generatePoints(26000, 150, 180, 5.5), '1Y': generatePoints(25500, 180, 365, 4) },
  'GBP/VND': { '1W': generatePoints(31600, 40, 7, 6), '1M': generatePoints(31300, 80, 30, 8), '3M': generatePoints(30800, 120, 90, 8), '6M': generatePoints(30000, 160, 180, 8), '1Y': generatePoints(29200, 200, 365, 6) },
  'JPY/VND': { '1W': generatePoints(165.5, 0.3, 7, 0.03), '1M': generatePoints(164, 0.6, 30, 0.04), '3M': generatePoints(162, 1, 90, 0.04), '6M': generatePoints(158, 1.5, 180, 0.04), '1Y': generatePoints(155, 2, 365, 0.03) },
  'CNY/VND': { '1W': generatePoints(3448, 5, 7, 0.5), '1M': generatePoints(3420, 10, 30, 0.8), '3M': generatePoints(3380, 15, 90, 0.7), '6M': generatePoints(3300, 25, 180, 0.8), '1Y': generatePoints(3200, 30, 365, 0.7) },
}

// ===== SVG CHART BUILDER =====
function buildPath(points: number[], width: number, height: number, padding: number = 0): { line: string; area: string; min: number; max: number } {
  if (points.length < 2) return { line: '', area: '', min: 0, max: 0 }

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const usableH = height - padding * 2

  const coords = points.map((val, i) => ({
    x: (i / (points.length - 1)) * width,
    y: padding + usableH - ((val - min) / range) * usableH,
  }))

  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`

  return { line, area, min, max }
}

function formatChartValue(val: number): string {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
  if (val >= 10000) return val.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (val >= 1) return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return val.toFixed(4)
}

// ===== LIVE DATA OVERRIDES =====
const liveStockPts = ref<number[]>([])
const liveCryptoPts = ref<number[]>([])
const liveGoldPts = ref<number[]>([])
const liveForexPts = ref<number[]>([])
const liveIndexPts = ref<number[]>([])
const liveCommodityPts = ref<number[]>([])

async function fetchLive(type: string, symbol: string, timeRange: string, target: typeof liveStockPts) {
  const data = await getChartData(type, symbol, timeRange)
  target.value = data.length > 2 ? data : []
}

// ===== COMPUTED CHART PATHS =====
const chartW = 320
const chartH = 140
const chartPad = 12

function makeChart(livePts: number[], fallbackData: Record<string, Record<string, number[]>>, symbol: string, time: string) {
  const pts = livePts.length > 2 ? livePts : (fallbackData[symbol]?.[time] || [])
  return { ...buildPath(pts, chartW, chartH, chartPad), points: pts, current: pts[pts.length - 1], first: pts[0] }
}

const stockChart = computed(() => makeChart(liveStockPts.value, stockData, selectedStock.value, selectedStockTime.value))
const cryptoChart = computed(() => makeChart(liveCryptoPts.value, cryptoData, selectedCrypto.value, selectedCryptoTime.value))
const goldChart = computed(() => makeChart(liveGoldPts.value, goldData, selectedGold.value, selectedGoldTime.value))
const forexChart = computed(() => makeChart(liveForexPts.value, forexData, selectedForex.value, selectedForexTime.value))

// Fetch real data on symbol/time change
watch([selectedStock, selectedStockTime], ([s, t]) => fetchLive('stock', s, t, liveStockPts), { immediate: true })
watch([selectedCrypto, selectedCryptoTime], ([s, t]) => fetchLive('crypto', s, t, liveCryptoPts), { immediate: true })
watch([selectedGold, selectedGoldTime], ([, t]) => fetchLive('gold', 'xau', t, liveGoldPts), { immediate: true })
watch([selectedForex, selectedForexTime], ([s, t]) => fetchLive('forex', s, t, liveForexPts), { immediate: true })

// ===== INDICES =====
const indexSymbols = ['VN-Index', 'S&P 500', 'NASDAQ', 'DOW 30', 'Nikkei'] as const
const selectedIndex = ref<string>('VN-Index')
const selectedIndexTime = ref<TimeRange>('3M')

const indexData: Record<string, Record<TimeRange, number[]>> = {
  'VN-Index': { '1W': generatePoints(1280, 8, 7, 0.7), '1M': generatePoints(1250, 15, 30, 1), '3M': generatePoints(1200, 25, 90, 0.9), '6M': generatePoints(1120, 35, 180, 0.9), '1Y': generatePoints(1050, 45, 365, 0.6) },
  'S&P 500': { '1W': generatePoints(5220, 15, 7, 2), '1M': generatePoints(5150, 30, 30, 2.5), '3M': generatePoints(5000, 50, 90, 2.5), '6M': generatePoints(4700, 70, 180, 2.8), '1Y': generatePoints(4400, 90, 365, 2.2) },
  NASDAQ: { '1W': generatePoints(16400, 50, 7, 5), '1M': generatePoints(16100, 100, 30, 8), '3M': generatePoints(15500, 150, 90, 8), '6M': generatePoints(14500, 200, 180, 9), '1Y': generatePoints(13500, 250, 365, 7) },
  'DOW 30': { '1W': generatePoints(39100, 80, 7, 8), '1M': generatePoints(38800, 150, 30, 10), '3M': generatePoints(38000, 250, 90, 12), '6M': generatePoints(36500, 350, 180, 14), '1Y': generatePoints(34500, 450, 365, 12) },
  Nikkei: { '1W': generatePoints(40100, 150, 7, 10), '1M': generatePoints(39500, 300, 30, 15), '3M': generatePoints(38000, 500, 90, 20), '6M': generatePoints(35000, 700, 180, 25), '1Y': generatePoints(32000, 900, 365, 22) },
}

// ===== COMMODITIES =====
const commoditySymbols = ['WTI Oil', 'Brent', 'Silver', 'Nat Gas', 'Copper'] as const
const selectedCommodity = ref<string>('WTI Oil')
const selectedCommodityTime = ref<TimeRange>('3M')

const commodityData: Record<string, Record<TimeRange, number[]>> = {
  'WTI Oil': { '1W': generatePoints(77.5, 0.8, 7, 0.12), '1M': generatePoints(75, 1.5, 30, 0.1), '3M': generatePoints(72, 2, 90, 0.07), '6M': generatePoints(68, 3, 180, 0.06), '1Y': generatePoints(65, 4, 365, 0.03) },
  Brent: { '1W': generatePoints(82, 0.8, 7, 0.1), '1M': generatePoints(80, 1.5, 30, 0.08), '3M': generatePoints(77, 2, 90, 0.06), '6M': generatePoints(73, 3, 180, 0.05), '1Y': generatePoints(70, 4, 365, 0.03) },
  Silver: { '1W': generatePoints(27.5, 0.3, 7, 0.05), '1M': generatePoints(26.5, 0.5, 30, 0.04), '3M': generatePoints(25, 0.8, 90, 0.03), '6M': generatePoints(23, 1, 180, 0.025), '1Y': generatePoints(21, 1.2, 365, 0.02) },
  'Nat Gas': { '1W': generatePoints(2.15, 0.05, 7, -0.008), '1M': generatePoints(2.3, 0.1, 30, -0.005), '3M': generatePoints(2.5, 0.15, 90, -0.003), '6M': generatePoints(2.8, 0.2, 180, -0.003), '1Y': generatePoints(3.2, 0.25, 365, -0.003) },
  Copper: { '1W': generatePoints(4.48, 0.05, 7, 0.005), '1M': generatePoints(4.35, 0.08, 30, 0.005), '3M': generatePoints(4.1, 0.12, 90, 0.004), '6M': generatePoints(3.8, 0.15, 180, 0.004), '1Y': generatePoints(3.5, 0.2, 365, 0.003) },
}

const indexChart = computed(() => makeChart(liveIndexPts.value, indexData, selectedIndex.value, selectedIndexTime.value))
const commodityChart = computed(() => makeChart(liveCommodityPts.value, commodityData, selectedCommodity.value, selectedCommodityTime.value))

watch([selectedIndex, selectedIndexTime], ([s, t]) => fetchLive('stock', s, t, liveIndexPts), { immediate: true })
watch([selectedCommodity, selectedCommodityTime], ([s, t]) => fetchLive('stock', s, t, liveCommodityPts), { immediate: true })

function changePercent(current: number, first: number): number {
  if (!first) return 0
  return ((current - first) / first) * 100
}
</script>

<template>
  <section class="px-4 pt-4 pb-16 bg-primary text-white -mx-8">
    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 mb-8">
      <span class="fade-up inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase text-secondary mb-4">
        Analytics
      </span>
      <h2 class="fade-up text-[32px] md:text-[45px] lg:text-[50px] font-extrabold leading-tight mb-2">
        Market Charts
      </h2>
      <p class="fade-up text-sm md:text-base text-white/50 max-w-xl">
        Interactive price charts across stocks, crypto, gold, and forex.
      </p>
    </div>

    <!-- 2x2 Grid -->
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- ========== STOCKS CHART ========== -->
        <div class="fade-up bg-white/5 border border-white/10 rounded-2xl p-5">
          <!-- Header -->
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-extrabold">Stocks</h3>
            <div class="flex items-center gap-1.5">
              <span class="text-2xl font-extrabold tabular-nums">${{ formatChartValue(stockChart.current) }}</span>
              <span
                class="text-xs font-bold px-1.5 py-0.5 rounded tabular-nums"
                :class="changePercent(stockChart.current, stockChart.first) >= 0 ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'"
              >
                {{ changePercent(stockChart.current, stockChart.first) >= 0 ? '+' : '' }}{{ changePercent(stockChart.current, stockChart.first).toFixed(2) }}%
              </span>
            </div>
          </div>

          <!-- Symbol selector -->
          <div class="flex items-center gap-1.5 mb-4 flex-wrap">
            <button
              v-for="s in stockSymbols"
              :key="s"
              @click="selectedStock = s"
              class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
              :class="selectedStock === s ? 'bg-secondary text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'"
            >
              {{ s }}
            </button>
          </div>

          <!-- Chart -->
          <div class="relative mb-3">
            <svg :viewBox="`0 0 ${chartW} ${chartH}`" class="w-full h-auto" preserveAspectRatio="none">
              <defs>
                <linearGradient :id="'grad-stock'" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" :stop-color="changePercent(stockChart.current, stockChart.first) >= 0 ? '#34d399' : '#f87171'" stop-opacity="0.3" />
                  <stop offset="100%" :stop-color="changePercent(stockChart.current, stockChart.first) >= 0 ? '#34d399' : '#f87171'" stop-opacity="0" />
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line v-for="i in 4" :key="'sg'+i" x1="0" :y1="chartPad + ((chartH - chartPad * 2) / 4) * i" :x2="chartW" :y2="chartPad + ((chartH - chartPad * 2) / 4) * i" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
              <!-- Area -->
              <path :d="stockChart.area" :fill="`url(#grad-stock)`" />
              <!-- Line -->
              <path :d="stockChart.line" fill="none" :stroke="changePercent(stockChart.current, stockChart.first) >= 0 ? '#34d399' : '#f87171'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <!-- Y-axis labels -->
            <div class="absolute top-2 right-2 flex flex-col justify-between h-[calc(100%-16px)] text-right">
              <span class="text-[10px] text-white/30 tabular-nums">${{ formatChartValue(stockChart.max) }}</span>
              <span class="text-[10px] text-white/30 tabular-nums">${{ formatChartValue(stockChart.min) }}</span>
            </div>
          </div>

          <!-- Time range -->
          <div class="flex items-center gap-1">
            <button
              v-for="t in timeRanges"
              :key="t"
              @click="selectedStockTime = t"
              class="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all"
              :class="selectedStockTime === t ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <!-- ========== CRYPTO CHART ========== -->
        <div class="fade-up bg-white/5 border border-white/10 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-extrabold">Cryptocurrency</h3>
            <div class="flex items-center gap-1.5">
              <span class="text-2xl font-extrabold tabular-nums">${{ formatChartValue(cryptoChart.current) }}</span>
              <span
                class="text-xs font-bold px-1.5 py-0.5 rounded tabular-nums"
                :class="changePercent(cryptoChart.current, cryptoChart.first) >= 0 ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'"
              >
                {{ changePercent(cryptoChart.current, cryptoChart.first) >= 0 ? '+' : '' }}{{ changePercent(cryptoChart.current, cryptoChart.first).toFixed(2) }}%
              </span>
            </div>
          </div>

          <div class="flex items-center gap-1.5 mb-4 flex-wrap">
            <button
              v-for="c in cryptoSymbols"
              :key="c"
              @click="selectedCrypto = c"
              class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
              :class="selectedCrypto === c ? 'bg-secondary text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'"
            >
              {{ c }}
            </button>
          </div>

          <div class="relative mb-3">
            <svg :viewBox="`0 0 ${chartW} ${chartH}`" class="w-full h-auto" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-crypto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" :stop-color="changePercent(cryptoChart.current, cryptoChart.first) >= 0 ? '#34d399' : '#f87171'" stop-opacity="0.3" />
                  <stop offset="100%" :stop-color="changePercent(cryptoChart.current, cryptoChart.first) >= 0 ? '#34d399' : '#f87171'" stop-opacity="0" />
                </linearGradient>
              </defs>
              <line v-for="i in 4" :key="'cg'+i" x1="0" :y1="chartPad + ((chartH - chartPad * 2) / 4) * i" :x2="chartW" :y2="chartPad + ((chartH - chartPad * 2) / 4) * i" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
              <path :d="cryptoChart.area" fill="url(#grad-crypto)" />
              <path :d="cryptoChart.line" fill="none" :stroke="changePercent(cryptoChart.current, cryptoChart.first) >= 0 ? '#34d399' : '#f87171'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="absolute top-2 right-2 flex flex-col justify-between h-[calc(100%-16px)] text-right">
              <span class="text-[10px] text-white/30 tabular-nums">${{ formatChartValue(cryptoChart.max) }}</span>
              <span class="text-[10px] text-white/30 tabular-nums">${{ formatChartValue(cryptoChart.min) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              v-for="t in timeRanges"
              :key="t"
              @click="selectedCryptoTime = t"
              class="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all"
              :class="selectedCryptoTime === t ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <!-- ========== GOLD CHART ========== -->
        <div class="fade-up bg-white/5 border border-white/10 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-extrabold"><span class="text-yellow-400 mr-1.5">●</span>Gold</h3>
            <div class="flex items-center gap-1.5">
              <span class="text-2xl font-extrabold tabular-nums text-yellow-400/90">
                {{ selectedGold === 'XAU/USD' ? '$' : '' }}{{ formatChartValue(goldChart.current) }}{{ selectedGold !== 'XAU/USD' ? '₫' : '' }}
              </span>
              <span
                class="text-xs font-bold px-1.5 py-0.5 rounded tabular-nums"
                :class="changePercent(goldChart.current, goldChart.first) >= 0 ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'"
              >
                {{ changePercent(goldChart.current, goldChart.first) >= 0 ? '+' : '' }}{{ changePercent(goldChart.current, goldChart.first).toFixed(2) }}%
              </span>
            </div>
          </div>

          <div class="flex items-center gap-1.5 mb-4 flex-wrap">
            <button
              v-for="g in goldTypes"
              :key="g"
              @click="selectedGold = g"
              class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
              :class="selectedGold === g ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'"
            >
              {{ g }}
            </button>
          </div>

          <div class="relative mb-3">
            <svg :viewBox="`0 0 ${chartW} ${chartH}`" class="w-full h-auto" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#facc15" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#facc15" stop-opacity="0" />
                </linearGradient>
              </defs>
              <line v-for="i in 4" :key="'gg'+i" x1="0" :y1="chartPad + ((chartH - chartPad * 2) / 4) * i" :x2="chartW" :y2="chartPad + ((chartH - chartPad * 2) / 4) * i" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
              <path :d="goldChart.area" fill="url(#grad-gold)" />
              <path :d="goldChart.line" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="absolute top-2 right-2 flex flex-col justify-between h-[calc(100%-16px)] text-right">
              <span class="text-[10px] text-white/30 tabular-nums">{{ formatChartValue(goldChart.max) }}</span>
              <span class="text-[10px] text-white/30 tabular-nums">{{ formatChartValue(goldChart.min) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              v-for="t in timeRanges"
              :key="t"
              @click="selectedGoldTime = t"
              class="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all"
              :class="selectedGoldTime === t ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <!-- ========== FOREX CHART ========== -->
        <div class="fade-up bg-white/5 border border-white/10 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-extrabold"><span class="text-blue-400 mr-1.5">◆</span>Forex</h3>
            <div class="flex items-center gap-1.5">
              <span class="text-2xl font-extrabold tabular-nums">{{ formatChartValue(forexChart.current) }}₫</span>
              <span
                class="text-xs font-bold px-1.5 py-0.5 rounded tabular-nums"
                :class="changePercent(forexChart.current, forexChart.first) >= 0 ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'"
              >
                {{ changePercent(forexChart.current, forexChart.first) >= 0 ? '+' : '' }}{{ changePercent(forexChart.current, forexChart.first).toFixed(2) }}%
              </span>
            </div>
          </div>

          <div class="flex items-center gap-1.5 mb-4 flex-wrap">
            <button
              v-for="f in forexPairs"
              :key="f"
              @click="selectedForex = f"
              class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
              :class="selectedForex === f ? 'bg-blue-400/20 text-blue-400' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'"
            >
              {{ f }}
            </button>
          </div>

          <div class="relative mb-3">
            <svg :viewBox="`0 0 ${chartW} ${chartH}`" class="w-full h-auto" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-forex" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#60a5fa" stop-opacity="0" />
                </linearGradient>
              </defs>
              <line v-for="i in 4" :key="'fg'+i" x1="0" :y1="chartPad + ((chartH - chartPad * 2) / 4) * i" :x2="chartW" :y2="chartPad + ((chartH - chartPad * 2) / 4) * i" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
              <path :d="forexChart.area" fill="url(#grad-forex)" />
              <path :d="forexChart.line" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="absolute top-2 right-2 flex flex-col justify-between h-[calc(100%-16px)] text-right">
              <span class="text-[10px] text-white/30 tabular-nums">{{ formatChartValue(forexChart.max) }}</span>
              <span class="text-[10px] text-white/30 tabular-nums">{{ formatChartValue(forexChart.min) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              v-for="t in timeRanges"
              :key="t"
              @click="selectedForexTime = t"
              class="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all"
              :class="selectedForexTime === t ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <!-- ========== INDICES CHART ========== -->
        <div class="fade-up bg-white/5 border border-white/10 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-extrabold"><span class="text-purple-400 mr-1.5">▣</span>Indices</h3>
            <div class="flex items-center gap-1.5">
              <span class="text-2xl font-extrabold tabular-nums">{{ formatChartValue(indexChart.current) }}</span>
              <span
                class="text-xs font-bold px-1.5 py-0.5 rounded tabular-nums"
                :class="changePercent(indexChart.current, indexChart.first) >= 0 ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'"
              >
                {{ changePercent(indexChart.current, indexChart.first) >= 0 ? '+' : '' }}{{ changePercent(indexChart.current, indexChart.first).toFixed(2) }}%
              </span>
            </div>
          </div>

          <div class="flex items-center gap-1.5 mb-4 flex-wrap">
            <button
              v-for="s in indexSymbols"
              :key="s"
              @click="selectedIndex = s"
              class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
              :class="selectedIndex === s ? 'bg-purple-400/20 text-purple-400' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'"
            >
              {{ s }}
            </button>
          </div>

          <div class="relative mb-3">
            <svg :viewBox="`0 0 ${chartW} ${chartH}`" class="w-full h-auto" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-index" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" :stop-color="changePercent(indexChart.current, indexChart.first) >= 0 ? '#c084fc' : '#f87171'" stop-opacity="0.25" />
                  <stop offset="100%" :stop-color="changePercent(indexChart.current, indexChart.first) >= 0 ? '#c084fc' : '#f87171'" stop-opacity="0" />
                </linearGradient>
              </defs>
              <line v-for="i in 4" :key="'ig'+i" x1="0" :y1="chartPad + ((chartH - chartPad * 2) / 4) * i" :x2="chartW" :y2="chartPad + ((chartH - chartPad * 2) / 4) * i" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
              <path :d="indexChart.area" fill="url(#grad-index)" />
              <path :d="indexChart.line" fill="none" :stroke="changePercent(indexChart.current, indexChart.first) >= 0 ? '#c084fc' : '#f87171'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="absolute top-2 right-2 flex flex-col justify-between h-[calc(100%-16px)] text-right">
              <span class="text-[10px] text-white/30 tabular-nums">{{ formatChartValue(indexChart.max) }}</span>
              <span class="text-[10px] text-white/30 tabular-nums">{{ formatChartValue(indexChart.min) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              v-for="t in timeRanges"
              :key="t"
              @click="selectedIndexTime = t"
              class="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all"
              :class="selectedIndexTime === t ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <!-- ========== COMMODITIES CHART ========== -->
        <div class="fade-up bg-white/5 border border-white/10 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-extrabold"><span class="text-orange-400 mr-1.5">⬢</span>Commodities</h3>
            <div class="flex items-center gap-1.5">
              <span class="text-2xl font-extrabold tabular-nums text-orange-400/90">${{ formatChartValue(commodityChart.current) }}</span>
              <span
                class="text-xs font-bold px-1.5 py-0.5 rounded tabular-nums"
                :class="changePercent(commodityChart.current, commodityChart.first) >= 0 ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'"
              >
                {{ changePercent(commodityChart.current, commodityChart.first) >= 0 ? '+' : '' }}{{ changePercent(commodityChart.current, commodityChart.first).toFixed(2) }}%
              </span>
            </div>
          </div>

          <div class="flex items-center gap-1.5 mb-4 flex-wrap">
            <button
              v-for="c in commoditySymbols"
              :key="c"
              @click="selectedCommodity = c"
              class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
              :class="selectedCommodity === c ? 'bg-orange-400/20 text-orange-400' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'"
            >
              {{ c }}
            </button>
          </div>

          <div class="relative mb-3">
            <svg :viewBox="`0 0 ${chartW} ${chartH}`" class="w-full h-auto" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-commodity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#fb923c" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#fb923c" stop-opacity="0" />
                </linearGradient>
              </defs>
              <line v-for="i in 4" :key="'cmg'+i" x1="0" :y1="chartPad + ((chartH - chartPad * 2) / 4) * i" :x2="chartW" :y2="chartPad + ((chartH - chartPad * 2) / 4) * i" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
              <path :d="commodityChart.area" fill="url(#grad-commodity)" />
              <path :d="commodityChart.line" fill="none" stroke="#fb923c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="absolute top-2 right-2 flex flex-col justify-between h-[calc(100%-16px)] text-right">
              <span class="text-[10px] text-white/30 tabular-nums">${{ formatChartValue(commodityChart.max) }}</span>
              <span class="text-[10px] text-white/30 tabular-nums">${{ formatChartValue(commodityChart.min) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              v-for="t in timeRanges"
              :key="t"
              @click="selectedCommodityTime = t"
              class="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all"
              :class="selectedCommodityTime === t ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'"
            >
              {{ t }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
