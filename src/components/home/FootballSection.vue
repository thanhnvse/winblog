<script setup lang="ts">
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { useFootballData } from '@/composables/useFootballData'
import { TEAMS } from '@/services/footballApi'
import type { MatchResult, StandingEntry } from '@/services/footballApi'

useScrollAnimation()

const {
  plStandings,
  pdStandings,
  chelseaResults,
  chelseaUpcoming,
  rmResults,
  rmUpcoming,
  chelseaPrediction,
  rmPrediction,
  isLoading,
  isLive,
} = useFootballData()

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function matchResult(m: MatchResult, teamName: string): 'W' | 'D' | 'L' {
  if (m.homeScore === null || m.awayScore === null) return 'D'
  const isHome = m.homeTeam.toLowerCase().includes(teamName.toLowerCase())
  if (m.homeScore === m.awayScore) return 'D'
  if (isHome) return m.homeScore > m.awayScore ? 'W' : 'L'
  return m.awayScore > m.homeScore ? 'W' : 'L'
}

function resultColor(r: 'W' | 'D' | 'L'): string {
  if (r === 'W') return 'bg-emerald-500'
  if (r === 'D') return 'bg-yellow-500'
  return 'bg-red-500'
}

function isTeamRow(entry: StandingEntry, teamName: string): boolean {
  return entry.team.toLowerCase().includes(teamName.toLowerCase())
}
</script>

<template>
  <section class="section-padding bg-light overflow-hidden">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-10" data-scroll>
        <span
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-semibold tracking-wider uppercase text-emerald-600 mb-4"
        >
          <span v-if="isLive" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span v-else-if="isLoading" class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          <span v-else class="w-2 h-2 rounded-full bg-gray-400"></span>
          {{ isLive ? 'Live Data' : isLoading ? 'Loading...' : 'Football' }}
        </span>
        <h2 class="text-[32px] md:text-[45px] lg:text-[50px] font-extrabold leading-tight mb-2 text-primary">
          My Teams
        </h2>
        <p class="text-sm md:text-base text-gray max-w-xl">
          Following league standings, results, and upcoming fixtures.
        </p>
      </div>

      <!-- Two-column layout: Chelsea | Real Madrid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- ========== CHELSEA ========== -->
        <div class="fade-up space-y-5">
          <!-- Team Header -->
          <div class="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-500/30 rounded-2xl p-5 shadow-lg">
            <img :src="TEAMS.chelsea.crest" alt="Chelsea" class="w-14 h-14 object-contain" />
            <div>
              <h3 class="text-2xl font-extrabold text-white">Chelsea FC</h3>
              <p class="text-sm text-blue-200/80">{{ TEAMS.chelsea.competitionName }} · {{ TEAMS.chelsea.venue }}</p>
            </div>
          </div>

          <!-- PL Standings -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 class="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Premier League Standings</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="text-gray-400">
                    <th class="text-left pb-2 font-medium w-6">#</th>
                    <th class="text-left pb-2 font-medium">Team</th>
                    <th class="text-center pb-2 font-medium">P</th>
                    <th class="text-center pb-2 font-medium">W</th>
                    <th class="text-center pb-2 font-medium">D</th>
                    <th class="text-center pb-2 font-medium">L</th>
                    <th class="text-center pb-2 font-medium">GD</th>
                    <th class="text-right pb-2 font-medium">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in plStandings"
                    :key="row.position"
                    class="border-t border-gray-100"
                    :class="isTeamRow(row, 'chelsea') ? 'bg-blue-50 font-bold' : ''"
                  >
                    <td class="py-1.5 text-gray-400">{{ row.position }}</td>
                    <td class="py-1.5">
                      <div class="flex items-center gap-1.5">
                        <img v-if="row.crest" :src="row.crest" class="w-4 h-4 object-contain" />
                        <span :class="isTeamRow(row, 'chelsea') ? 'text-blue-700' : 'text-primary'">{{ row.team }}</span>
                      </div>
                    </td>
                    <td class="text-center text-gray-500">{{ row.played }}</td>
                    <td class="text-center text-gray-500">{{ row.won }}</td>
                    <td class="text-center text-gray-500">{{ row.draw }}</td>
                    <td class="text-center text-gray-500">{{ row.lost }}</td>
                    <td class="text-center text-gray-500">{{ row.goalDifference > 0 ? '+' : '' }}{{ row.goalDifference }}</td>
                    <td class="text-right font-bold tabular-nums text-primary">{{ row.points }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent Results -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 class="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Recent Results</h4>
            <div class="space-y-2">
              <div
                v-for="(m, i) in chelseaResults"
                :key="i"
                class="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
              >
                <span class="text-xs text-gray-400 w-14">{{ formatDate(m.date) }}</span>
                <div class="flex items-center gap-2 flex-1 justify-center">
                  <span class="text-xs text-right flex-1 truncate" :class="m.homeTeam.toLowerCase().includes('chelsea') ? 'font-bold text-blue-700' : 'text-gray-600'">{{ m.homeTeam }}</span>
                  <span class="text-sm font-extrabold tabular-nums px-2 py-0.5 bg-primary text-white rounded">
                    {{ m.homeScore }} - {{ m.awayScore }}
                  </span>
                  <span class="text-xs text-left flex-1 truncate" :class="m.awayTeam.toLowerCase().includes('chelsea') ? 'font-bold text-blue-700' : 'text-gray-600'">{{ m.awayTeam }}</span>
                </div>
                <span
                  class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  :class="resultColor(matchResult(m, 'chelsea'))"
                >
                  {{ matchResult(m, 'chelsea') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Upcoming Matches -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 class="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Upcoming Fixtures</h4>
            <div class="space-y-2">
              <div
                v-for="(m, i) in chelseaUpcoming"
                :key="i"
                class="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
              >
                <span class="text-xs text-gray-400 w-14">{{ formatDate(m.date) }}</span>
                <div class="flex items-center gap-2 flex-1 justify-center">
                  <span class="text-xs text-right flex-1 truncate" :class="m.homeTeam.toLowerCase().includes('chelsea') ? 'font-bold text-blue-700' : 'text-gray-600'">{{ m.homeTeam }}</span>
                  <span class="text-[10px] text-gray-500 px-2 py-0.5 bg-gray-200 rounded">{{ formatTime(m.date) }}</span>
                  <span class="text-xs text-left flex-1 truncate" :class="m.awayTeam.toLowerCase().includes('chelsea') ? 'font-bold text-blue-700' : 'text-gray-600'">{{ m.awayTeam }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Win Prediction -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 class="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Win Prediction</h4>
            <div class="flex items-center gap-3 mb-2">
              <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                <div class="h-full bg-emerald-500 transition-all duration-700" :style="{ width: chelseaPrediction.win + '%' }"></div>
                <div class="h-full bg-yellow-400 transition-all duration-700" :style="{ width: chelseaPrediction.draw + '%' }"></div>
                <div class="h-full bg-red-500 transition-all duration-700" :style="{ width: chelseaPrediction.lose + '%' }"></div>
              </div>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-emerald-600 font-bold">Win {{ chelseaPrediction.win }}%</span>
              <span class="text-yellow-600 font-bold">Draw {{ chelseaPrediction.draw }}%</span>
              <span class="text-red-600 font-bold">Lose {{ chelseaPrediction.lose }}%</span>
            </div>
          </div>
        </div>

        <!-- ========== REAL MADRID ========== -->
        <div class="fade-up space-y-5">
          <!-- Team Header -->
          <div class="flex items-center gap-4 bg-gradient-to-r from-amber-500 to-yellow-500 border border-yellow-400/30 rounded-2xl p-5 shadow-lg">
            <img :src="TEAMS.realMadrid.crest" alt="Real Madrid" class="w-14 h-14 object-contain" />
            <div>
              <h3 class="text-2xl font-extrabold text-white">Real Madrid CF</h3>
              <p class="text-sm text-yellow-100/80">{{ TEAMS.realMadrid.competitionName }} · {{ TEAMS.realMadrid.venue }}</p>
            </div>
          </div>

          <!-- La Liga Standings -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 class="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3">La Liga Standings</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="text-gray-400">
                    <th class="text-left pb-2 font-medium w-6">#</th>
                    <th class="text-left pb-2 font-medium">Team</th>
                    <th class="text-center pb-2 font-medium">P</th>
                    <th class="text-center pb-2 font-medium">W</th>
                    <th class="text-center pb-2 font-medium">D</th>
                    <th class="text-center pb-2 font-medium">L</th>
                    <th class="text-center pb-2 font-medium">GD</th>
                    <th class="text-right pb-2 font-medium">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in pdStandings"
                    :key="row.position"
                    class="border-t border-gray-100"
                    :class="isTeamRow(row, 'real madrid') || isTeamRow(row, 'r. madrid') ? 'bg-amber-50 font-bold' : ''"
                  >
                    <td class="py-1.5 text-gray-400">{{ row.position }}</td>
                    <td class="py-1.5">
                      <div class="flex items-center gap-1.5">
                        <img v-if="row.crest" :src="row.crest" class="w-4 h-4 object-contain" />
                        <span :class="isTeamRow(row, 'real madrid') || isTeamRow(row, 'r. madrid') ? 'text-amber-700' : 'text-primary'">{{ row.team }}</span>
                      </div>
                    </td>
                    <td class="text-center text-gray-500">{{ row.played }}</td>
                    <td class="text-center text-gray-500">{{ row.won }}</td>
                    <td class="text-center text-gray-500">{{ row.draw }}</td>
                    <td class="text-center text-gray-500">{{ row.lost }}</td>
                    <td class="text-center text-gray-500">{{ row.goalDifference > 0 ? '+' : '' }}{{ row.goalDifference }}</td>
                    <td class="text-right font-bold tabular-nums text-primary">{{ row.points }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent Results -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 class="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3">Recent Results</h4>
            <div class="space-y-2">
              <div
                v-for="(m, i) in rmResults"
                :key="i"
                class="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
              >
                <span class="text-xs text-gray-400 w-14">{{ formatDate(m.date) }}</span>
                <div class="flex items-center gap-2 flex-1 justify-center">
                  <span class="text-xs text-right flex-1 truncate" :class="m.homeTeam.toLowerCase().includes('real madrid') ? 'font-bold text-amber-700' : 'text-gray-600'">{{ m.homeTeam }}</span>
                  <span class="text-sm font-extrabold tabular-nums px-2 py-0.5 bg-primary text-white rounded">
                    {{ m.homeScore }} - {{ m.awayScore }}
                  </span>
                  <span class="text-xs text-left flex-1 truncate" :class="m.awayTeam.toLowerCase().includes('real madrid') ? 'font-bold text-amber-700' : 'text-gray-600'">{{ m.awayTeam }}</span>
                </div>
                <span
                  class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  :class="resultColor(matchResult(m, 'real madrid'))"
                >
                  {{ matchResult(m, 'real madrid') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Upcoming Matches -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 class="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3">Upcoming Fixtures</h4>
            <div class="space-y-2">
              <div
                v-for="(m, i) in rmUpcoming"
                :key="i"
                class="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
              >
                <span class="text-xs text-gray-400 w-14">{{ formatDate(m.date) }}</span>
                <div class="flex items-center gap-2 flex-1 justify-center">
                  <span class="text-xs text-right flex-1 truncate" :class="m.homeTeam.toLowerCase().includes('real madrid') ? 'font-bold text-amber-700' : 'text-gray-600'">{{ m.homeTeam }}</span>
                  <span class="text-[10px] text-gray-500 px-2 py-0.5 bg-gray-200 rounded">{{ formatTime(m.date) }}</span>
                  <span class="text-xs text-left flex-1 truncate" :class="m.awayTeam.toLowerCase().includes('real madrid') ? 'font-bold text-amber-700' : 'text-gray-600'">{{ m.awayTeam }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Win Prediction -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h4 class="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3">Win Prediction</h4>
            <div class="flex items-center gap-3 mb-2">
              <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                <div class="h-full bg-emerald-500 transition-all duration-700" :style="{ width: rmPrediction.win + '%' }"></div>
                <div class="h-full bg-yellow-400 transition-all duration-700" :style="{ width: rmPrediction.draw + '%' }"></div>
                <div class="h-full bg-red-500 transition-all duration-700" :style="{ width: rmPrediction.lose + '%' }"></div>
              </div>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-emerald-600 font-bold">Win {{ rmPrediction.win }}%</span>
              <span class="text-yellow-600 font-bold">Draw {{ rmPrediction.draw }}%</span>
              <span class="text-red-600 font-bold">Lose {{ rmPrediction.lose }}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
