<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMarketData } from '@/composables/useMarketData'

gsap.registerPlugin(ScrollTrigger)

const { stocks, cryptos, golds, forexRates, commodities, indices, isLoading, isLive } = useMarketData()

function formatVND(val: number): string {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
  if (val >= 1000) return val.toLocaleString('vi-VN')
  return val.toFixed(2)
}

const sectionRef = ref<HTMLElement>()
const tickerRef = ref<HTMLElement>()
let tweens: gsap.core.Tween[] = []

function setupTicker(el: HTMLElement, speed: number) {
  const inner = el.querySelector('.ticker-inner') as HTMLElement
  if (!inner) return null
  const width = inner.scrollWidth / 2
  return gsap.fromTo(inner, { x: 0 }, { x: -width, duration: speed, ease: 'none', repeat: -1 })
}

onMounted(() => {
  if (sectionRef.value) {
    gsap.from(sectionRef.value.querySelectorAll('.trade-animate'), {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' },
      y: 30, opacity: 0, stagger: 0.1, duration: 0.6,
    })
  }
  if (tickerRef.value) {
    const t = setupTicker(tickerRef.value, 35)
    if (t) tweens.push(t)
  }
})

onUnmounted(() => {
  tweens.forEach((t) => t.kill())
})
</script>

<template>
  <section ref="sectionRef" class="section-padding bg-primary text-white overflow-hidden">
    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 mb-8">
      <span class="trade-animate inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase text-secondary mb-4">
        <span v-if="isLive" class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span v-else-if="isLoading" class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
        <span v-else class="w-2 h-2 rounded-full bg-white/30"></span>
        {{ isLive ? 'Live Market' : isLoading ? 'Loading...' : 'Market Data' }}
      </span>
      <h2 class="trade-animate text-[32px] md:text-[45px] lg:text-[50px] font-extrabold leading-tight mb-2">
        Markets
      </h2>
      <p class="trade-animate text-sm md:text-base text-white/50 max-w-xl">
        Real-time overview of stocks, crypto, gold, and forex markets.
      </p>
    </div>

    <!-- 2x2 Grid -->
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- ========== 1x1: STOCKS ========== -->
        <div class="trade-animate bg-white/5 border border-white/10 rounded-2xl p-5 overflow-hidden">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-extrabold">Stocks</h3>
            <span class="text-xs text-white/40">NYSE / NASDAQ</span>
          </div>

          <!-- Scrolling ticker -->
          <div ref="tickerRef" class="overflow-hidden mb-4 -mx-5">
            <div class="ticker-inner flex w-max">
              <div
                v-for="(s, i) in [...stocks, ...stocks]"
                :key="'t-' + i"
                class="flex-shrink-0 px-4 py-1.5 flex items-center gap-2 border-r border-white/10"
              >
                <span class="text-sm font-bold">{{ s.symbol }}</span>
                <span class="text-sm tabular-nums">${{ s.price.toFixed(2) }}</span>
                <span
                  class="text-xs font-semibold tabular-nums"
                  :class="s.change >= 0 ? 'text-emerald-400' : 'text-red-400'"
                >
                  {{ s.change >= 0 ? '+' : '' }}{{ s.changePercent.toFixed(2) }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Stock table -->
          <div class="relative">
          <div class="overflow-y-auto max-h-64 trading-scroll pr-1">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-white/40 text-xs">
                  <th class="text-left pb-2 font-medium">Symbol</th>
                  <th class="text-right pb-2 font-medium">Price</th>
                  <th class="text-right pb-2 font-medium">Change</th>
                  <th class="text-right pb-2 font-medium hidden sm:table-cell">Vol</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="s in stocks"
                  :key="s.symbol"
                  class="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td class="py-2.5">
                    <span class="font-bold">{{ s.symbol }}</span>
                    <span class="text-white/40 text-xs ml-1.5 hidden md:inline">{{ s.name }}</span>
                  </td>
                  <td class="text-right tabular-nums font-semibold">${{ s.price.toFixed(2) }}</td>
                  <td class="text-right">
                    <span
                      class="inline-flex items-center gap-0.5 text-xs font-bold tabular-nums px-1.5 py-0.5 rounded"
                      :class="s.change >= 0 ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'"
                    >
                      {{ s.change >= 0 ? '▲' : '▼' }}
                      {{ s.changePercent >= 0 ? '+' : '' }}{{ s.changePercent.toFixed(2) }}%
                    </span>
                  </td>
                  <td class="text-right text-white/40 tabular-nums hidden sm:table-cell">{{ s.volume }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent rounded-b-2xl"></div>
          </div>
        </div>

        <!-- ========== 1x2: CRYPTO ========== -->
        <div class="trade-animate bg-white/5 border border-white/10 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-extrabold">Cryptocurrency</h3>
            <div class="flex gap-2 text-xs text-white/40">
              <span class="px-2 py-0.5 rounded bg-white/10 text-white/70">USD</span>
              <span class="px-2 py-0.5 rounded bg-white/5">VND</span>
            </div>
          </div>

          <div class="relative">
          <div class="overflow-y-auto max-h-72 trading-scroll pr-1">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-white/40 text-xs">
                  <th class="text-left pb-2 font-medium">#</th>
                  <th class="text-left pb-2 font-medium">Coin</th>
                  <th class="text-right pb-2 font-medium">USD</th>
                  <th class="text-right pb-2 font-medium hidden sm:table-cell">VND</th>
                  <th class="text-right pb-2 font-medium">24h</th>
                  <th class="text-right pb-2 font-medium hidden md:table-cell">MCap</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(c, idx) in cryptos"
                  :key="c.symbol"
                  class="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td class="py-2.5 text-white/40 text-xs">{{ idx + 1 }}</td>
                  <td class="py-2.5">
                    <span class="font-bold">{{ c.symbol }}</span>
                    <span class="text-white/40 text-xs ml-1 hidden md:inline">{{ c.name }}</span>
                  </td>
                  <td class="text-right tabular-nums font-semibold">
                    ${{ c.priceUSD >= 1 ? c.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : c.priceUSD.toFixed(4) }}
                  </td>
                  <td class="text-right tabular-nums text-white/60 text-xs hidden sm:table-cell">
                    {{ formatVND(c.priceVND) }}₫
                  </td>
                  <td class="text-right">
                    <span
                      class="text-xs font-bold tabular-nums"
                      :class="c.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'"
                    >
                      {{ c.change24h >= 0 ? '+' : '' }}{{ c.change24h.toFixed(2) }}%
                    </span>
                  </td>
                  <td class="text-right text-white/40 text-xs tabular-nums hidden md:table-cell">{{ c.marketCap }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent"></div>
          </div>
        </div>

        <!-- ========== 2x1: GOLD ========== -->
        <div class="trade-animate bg-white/5 border border-white/10 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-extrabold">
              <span class="text-yellow-400 mr-1.5">●</span>Gold Prices
            </h3>
            <span class="text-xs text-white/40">World & Vietnam</span>
          </div>

          <div class="relative">
          <div class="overflow-y-auto max-h-72 trading-scroll pr-1">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-white/40 text-xs">
                  <th class="text-left pb-2 font-medium">Type</th>
                  <th class="text-right pb-2 font-medium">USD</th>
                  <th class="text-right pb-2 font-medium">VND</th>
                  <th class="text-right pb-2 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="g in golds"
                  :key="g.type"
                  class="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td class="py-2.5">
                    <span class="font-bold">{{ g.type }}</span>
                    <span class="text-white/40 text-xs ml-1">{{ g.unit }}</span>
                  </td>
                  <td class="text-right tabular-nums font-semibold text-yellow-400/90">
                    ${{ g.priceUSD.toLocaleString('en-US') }}
                  </td>
                  <td class="text-right tabular-nums text-white/60 text-xs">
                    {{ formatVND(g.priceVND) }}₫
                  </td>
                  <td class="text-right">
                    <span
                      class="text-xs font-bold tabular-nums"
                      :class="g.change >= 0 ? 'text-emerald-400' : 'text-red-400'"
                    >
                      {{ g.change >= 0 ? '+' : '' }}{{ g.change.toFixed(2) }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent"></div>
          </div>
        </div>

        <!-- ========== 2x2: FOREX ========== -->
        <div class="trade-animate bg-white/5 border border-white/10 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-extrabold">
              <span class="text-blue-400 mr-1.5">◆</span>Forex Rates
            </h3>
            <span class="text-xs text-white/40">vs VND</span>
          </div>

          <div class="relative">
          <div class="overflow-y-auto max-h-72 trading-scroll pr-1">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-white/40 text-xs">
                  <th class="text-left pb-2 font-medium">Pair</th>
                  <th class="text-right pb-2 font-medium">Rate</th>
                  <th class="text-right pb-2 font-medium hidden sm:table-cell">Buy</th>
                  <th class="text-right pb-2 font-medium hidden sm:table-cell">Sell</th>
                  <th class="text-right pb-2 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="f in forexRates"
                  :key="f.pair"
                  class="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td class="py-2.5">
                    <span class="mr-1.5">{{ f.flag }}</span>
                    <span class="font-bold">{{ f.pair }}</span>
                  </td>
                  <td class="text-right tabular-nums font-semibold">
                    {{ f.rate >= 100 ? f.rate.toLocaleString('vi-VN') : f.rate.toFixed(2) }}₫
                  </td>
                  <td class="text-right tabular-nums text-white/50 text-xs hidden sm:table-cell">
                    {{ f.buy >= 100 ? f.buy.toLocaleString('vi-VN') : f.buy.toFixed(2) }}
                  </td>
                  <td class="text-right tabular-nums text-white/50 text-xs hidden sm:table-cell">
                    {{ f.sell >= 100 ? f.sell.toLocaleString('vi-VN') : f.sell.toFixed(2) }}
                  </td>
                  <td class="text-right">
                    <span
                      class="text-xs font-bold tabular-nums"
                      :class="f.change >= 0 ? 'text-emerald-400' : 'text-red-400'"
                    >
                      {{ f.change >= 0 ? '+' : '' }}{{ f.change.toFixed(2) }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent"></div>
          </div>
        </div>

        <!-- ========== 3x1: MARKET INDICES ========== -->
        <div class="trade-animate bg-white/5 border border-white/10 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-extrabold">
              <span class="text-purple-400 mr-1.5">▣</span>Market Indices
            </h3>
            <span class="text-xs text-white/40">Global</span>
          </div>

          <div class="relative">
          <div class="overflow-y-auto max-h-72 trading-scroll pr-1">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-white/40 text-xs">
                  <th class="text-left pb-2 font-medium">Index</th>
                  <th class="text-right pb-2 font-medium">Value</th>
                  <th class="text-right pb-2 font-medium">Change</th>
                  <th class="text-right pb-2 font-medium hidden sm:table-cell">%</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="idx in indices"
                  :key="idx.symbol"
                  class="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td class="py-2.5">
                    <span class="mr-1.5">{{ idx.region }}</span>
                    <span class="font-bold">{{ idx.symbol }}</span>
                  </td>
                  <td class="text-right tabular-nums font-semibold">{{ idx.value.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td>
                  <td class="text-right">
                    <span
                      class="text-xs font-bold tabular-nums"
                      :class="idx.change >= 0 ? 'text-emerald-400' : 'text-red-400'"
                    >
                      {{ idx.change >= 0 ? '+' : '' }}{{ idx.change.toFixed(2) }}
                    </span>
                  </td>
                  <td class="text-right hidden sm:table-cell">
                    <span
                      class="inline-flex items-center gap-0.5 text-xs font-bold tabular-nums px-1.5 py-0.5 rounded"
                      :class="idx.changePercent >= 0 ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'"
                    >
                      {{ idx.changePercent >= 0 ? '▲' : '▼' }}
                      {{ idx.changePercent >= 0 ? '+' : '' }}{{ idx.changePercent.toFixed(2) }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent"></div>
          </div>
        </div>

        <!-- ========== 3x2: COMMODITIES ========== -->
        <div class="trade-animate bg-white/5 border border-white/10 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-extrabold">
              <span class="text-orange-400 mr-1.5">⬢</span>Commodities
            </h3>
            <span class="text-xs text-white/40">Futures</span>
          </div>

          <div class="relative">
          <div class="overflow-y-auto max-h-72 trading-scroll pr-1">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-white/40 text-xs">
                  <th class="text-left pb-2 font-medium">Name</th>
                  <th class="text-right pb-2 font-medium">Price</th>
                  <th class="text-right pb-2 font-medium">Change</th>
                  <th class="text-right pb-2 font-medium hidden sm:table-cell">Unit</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="c in commodities"
                  :key="c.symbol"
                  class="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td class="py-2.5">
                    <span class="font-bold">{{ c.name }}</span>
                    <span class="text-white/40 text-xs ml-1.5 hidden md:inline">{{ c.symbol }}</span>
                  </td>
                  <td class="text-right tabular-nums font-semibold text-orange-400/90">${{ c.price.toFixed(2) }}</td>
                  <td class="text-right">
                    <span
                      class="inline-flex items-center gap-0.5 text-xs font-bold tabular-nums px-1.5 py-0.5 rounded"
                      :class="c.changePercent >= 0 ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'"
                    >
                      {{ c.changePercent >= 0 ? '▲' : '▼' }}
                      {{ c.changePercent >= 0 ? '+' : '' }}{{ c.changePercent.toFixed(2) }}%
                    </span>
                  </td>
                  <td class="text-right text-white/40 text-xs tabular-nums hidden sm:table-cell">{{ c.unit }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent"></div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
