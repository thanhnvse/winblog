import { ref, onMounted } from 'vue'
import {
  fetchStandings,
  fetchTeamMatches,
  predictWin,
  TEAMS,
  type StandingEntry,
  type MatchResult,
} from '@/services/footballApi'

// ===== FALLBACK DATA =====
const fallbackPLStandings: StandingEntry[] = [
  { position: 1, team: 'Liverpool', crest: '', played: 30, won: 23, draw: 5, lost: 2, goalsFor: 65, goalsAgainst: 22, goalDifference: 43, points: 74, form: 'W,W,W,D,W' },
  { position: 2, team: 'Arsenal', crest: '', played: 30, won: 21, draw: 5, lost: 4, goalsFor: 60, goalsAgainst: 25, goalDifference: 35, points: 68, form: 'W,W,L,W,W' },
  { position: 3, team: 'Nott\'m Forest', crest: '', played: 30, won: 18, draw: 5, lost: 7, goalsFor: 50, goalsAgainst: 30, goalDifference: 20, points: 59, form: 'W,D,W,L,W' },
  { position: 4, team: 'Chelsea', crest: '', played: 30, won: 16, draw: 7, lost: 7, goalsFor: 55, goalsAgainst: 35, goalDifference: 20, points: 55, form: 'W,W,D,W,L' },
  { position: 5, team: 'Aston Villa', crest: '', played: 30, won: 15, draw: 6, lost: 9, goalsFor: 48, goalsAgainst: 38, goalDifference: 10, points: 51, form: 'L,W,W,D,W' },
  { position: 6, team: 'Brighton', crest: '', played: 30, won: 14, draw: 7, lost: 9, goalsFor: 52, goalsAgainst: 40, goalDifference: 12, points: 49, form: 'D,W,L,W,W' },
  { position: 7, team: 'Man City', crest: '', played: 30, won: 14, draw: 4, lost: 12, goalsFor: 52, goalsAgainst: 42, goalDifference: 10, points: 46, form: 'W,L,W,W,D' },
  { position: 8, team: 'Newcastle', crest: '', played: 30, won: 13, draw: 6, lost: 11, goalsFor: 45, goalsAgainst: 38, goalDifference: 7, points: 45, form: 'D,W,W,L,W' },
]

const fallbackPDStandings: StandingEntry[] = [
  { position: 1, team: 'Barcelona', crest: '', played: 30, won: 23, draw: 4, lost: 3, goalsFor: 70, goalsAgainst: 25, goalDifference: 45, points: 73, form: 'W,W,W,W,D' },
  { position: 2, team: 'Real Madrid', crest: '', played: 30, won: 20, draw: 6, lost: 4, goalsFor: 62, goalsAgainst: 22, goalDifference: 40, points: 66, form: 'W,D,W,W,W' },
  { position: 3, team: 'Atl. Madrid', crest: '', played: 30, won: 18, draw: 7, lost: 5, goalsFor: 52, goalsAgainst: 28, goalDifference: 24, points: 61, form: 'W,W,D,W,L' },
  { position: 4, team: 'Athletic', crest: '', played: 30, won: 16, draw: 8, lost: 6, goalsFor: 45, goalsAgainst: 28, goalDifference: 17, points: 56, form: 'D,W,W,W,D' },
  { position: 5, team: 'Mallorca', crest: '', played: 30, won: 14, draw: 8, lost: 8, goalsFor: 35, goalsAgainst: 30, goalDifference: 5, points: 50, form: 'W,D,L,W,W' },
  { position: 6, team: 'Villarreal', crest: '', played: 30, won: 14, draw: 5, lost: 11, goalsFor: 48, goalsAgainst: 42, goalDifference: 6, points: 47, form: 'L,W,W,D,W' },
  { position: 7, team: 'Betis', crest: '', played: 30, won: 12, draw: 9, lost: 9, goalsFor: 38, goalsAgainst: 32, goalDifference: 6, points: 45, form: 'W,D,W,L,D' },
  { position: 8, team: 'Real Sociedad', crest: '', played: 30, won: 11, draw: 10, lost: 9, goalsFor: 35, goalsAgainst: 30, goalDifference: 5, points: 43, form: 'D,L,W,W,D' },
]

const fallbackChelseaResults: MatchResult[] = [
  { date: '2026-03-15T15:00:00Z', competition: 'Premier League', homeTeam: 'Chelsea', homeCrest: '', awayTeam: 'Leicester', awayCrest: '', homeScore: 3, awayScore: 1, status: 'FINISHED' },
  { date: '2026-03-08T15:00:00Z', competition: 'Premier League', homeTeam: 'Wolves', homeCrest: '', awayTeam: 'Chelsea', awayCrest: '', homeScore: 0, awayScore: 2, status: 'FINISHED' },
  { date: '2026-03-01T15:00:00Z', competition: 'Premier League', homeTeam: 'Chelsea', homeCrest: '', awayTeam: 'Man City', awayCrest: '', homeScore: 1, awayScore: 1, status: 'FINISHED' },
  { date: '2026-02-22T15:00:00Z', competition: 'Premier League', homeTeam: 'Everton', homeCrest: '', awayTeam: 'Chelsea', awayCrest: '', homeScore: 0, awayScore: 1, status: 'FINISHED' },
  { date: '2026-02-15T15:00:00Z', competition: 'Premier League', homeTeam: 'Chelsea', homeCrest: '', awayTeam: 'Tottenham', awayCrest: '', homeScore: 2, awayScore: 0, status: 'FINISHED' },
]

const fallbackChelseaUpcoming: MatchResult[] = [
  { date: '2026-03-22T15:00:00Z', competition: 'Premier League', homeTeam: 'Arsenal', homeCrest: '', awayTeam: 'Chelsea', awayCrest: '', homeScore: null, awayScore: null, status: 'SCHEDULED' },
  { date: '2026-03-29T15:00:00Z', competition: 'Premier League', homeTeam: 'Chelsea', homeCrest: '', awayTeam: 'Newcastle', awayCrest: '', homeScore: null, awayScore: null, status: 'SCHEDULED' },
  { date: '2026-04-05T15:00:00Z', competition: 'Premier League', homeTeam: 'Brighton', homeCrest: '', awayTeam: 'Chelsea', awayCrest: '', homeScore: null, awayScore: null, status: 'SCHEDULED' },
]

const fallbackRMResults: MatchResult[] = [
  { date: '2026-03-16T20:00:00Z', competition: 'La Liga', homeTeam: 'Real Madrid', homeCrest: '', awayTeam: 'Celta Vigo', awayCrest: '', homeScore: 4, awayScore: 0, status: 'FINISHED' },
  { date: '2026-03-09T18:00:00Z', competition: 'La Liga', homeTeam: 'Sevilla', homeCrest: '', awayTeam: 'Real Madrid', awayCrest: '', homeScore: 1, awayScore: 3, status: 'FINISHED' },
  { date: '2026-03-02T20:00:00Z', competition: 'La Liga', homeTeam: 'Real Madrid', homeCrest: '', awayTeam: 'Atl. Madrid', awayCrest: '', homeScore: 2, awayScore: 1, status: 'FINISHED' },
  { date: '2026-02-23T18:00:00Z', competition: 'La Liga', homeTeam: 'Getafe', homeCrest: '', awayTeam: 'Real Madrid', awayCrest: '', homeScore: 0, awayScore: 2, status: 'FINISHED' },
  { date: '2026-02-16T20:00:00Z', competition: 'La Liga', homeTeam: 'Real Madrid', homeCrest: '', awayTeam: 'Valencia', awayCrest: '', homeScore: 3, awayScore: 1, status: 'FINISHED' },
]

const fallbackRMUpcoming: MatchResult[] = [
  { date: '2026-03-23T20:00:00Z', competition: 'La Liga', homeTeam: 'Real Madrid', homeCrest: '', awayTeam: 'Barcelona', awayCrest: '', homeScore: null, awayScore: null, status: 'SCHEDULED' },
  { date: '2026-03-30T18:00:00Z', competition: 'La Liga', homeTeam: 'Osasuna', homeCrest: '', awayTeam: 'Real Madrid', awayCrest: '', homeScore: null, awayScore: null, status: 'SCHEDULED' },
  { date: '2026-04-06T20:00:00Z', competition: 'La Liga', homeTeam: 'Real Madrid', homeCrest: '', awayTeam: 'Betis', awayCrest: '', homeScore: null, awayScore: null, status: 'SCHEDULED' },
]

// ===== CACHE =====
let cachedData: any = null
let cachedAt = 0
const CACHE_TTL = 10 * 60 * 1000 // 10 min (football data doesn't change often)

export function useFootballData() {
  const plStandings = ref<StandingEntry[]>([])
  const pdStandings = ref<StandingEntry[]>([])
  const chelseaResults = ref<MatchResult[]>([])
  const chelseaUpcoming = ref<MatchResult[]>([])
  const rmResults = ref<MatchResult[]>([])
  const rmUpcoming = ref<MatchResult[]>([])
  const chelseaPrediction = ref({ win: 55, draw: 25, lose: 20 })
  const rmPrediction = ref({ win: 60, draw: 22, lose: 18 })
  const isLoading = ref(true)
  const isLive = ref(false)

  async function load() {
    // Check cache
    if (cachedData && Date.now() - cachedAt < CACHE_TTL) {
      plStandings.value = cachedData.plStandings
      pdStandings.value = cachedData.pdStandings
      chelseaResults.value = cachedData.chelseaResults
      chelseaUpcoming.value = cachedData.chelseaUpcoming
      rmResults.value = cachedData.rmResults
      rmUpcoming.value = cachedData.rmUpcoming
      chelseaPrediction.value = cachedData.chelseaPrediction
      rmPrediction.value = cachedData.rmPrediction
      isLive.value = cachedData.isLive
      isLoading.value = false
      return
    }

    isLoading.value = true

    try {
      const [plData, pdData, chelResults, chelScheduled, rmRes, rmSched] = await Promise.all([
        fetchStandings('PL'),
        fetchStandings('PD'),
        fetchTeamMatches(TEAMS.chelsea.teamId, 'FINISHED'),
        fetchTeamMatches(TEAMS.chelsea.teamId, 'SCHEDULED'),
        fetchTeamMatches(TEAMS.realMadrid.teamId, 'FINISHED'),
        fetchTeamMatches(TEAMS.realMadrid.teamId, 'SCHEDULED'),
      ])

      plStandings.value = plData.length ? plData.slice(0, 8) : fallbackPLStandings
      pdStandings.value = pdData.length ? pdData.slice(0, 8) : fallbackPDStandings
      chelseaResults.value = chelResults.length ? chelResults.slice(0, 5) : fallbackChelseaResults
      chelseaUpcoming.value = chelScheduled.length ? chelScheduled.slice(0, 3) : fallbackChelseaUpcoming
      rmResults.value = rmRes.length ? rmRes.slice(0, 5) : fallbackRMResults
      rmUpcoming.value = rmSched.length ? rmSched.slice(0, 3) : fallbackRMUpcoming
      isLive.value = plData.length > 0 || pdData.length > 0

      // Predictions
      const chelseaStanding = plStandings.value.find(
        (s) => s.team.toLowerCase().includes('chelsea')
      )
      const rmStanding = pdStandings.value.find(
        (s) => s.team.toLowerCase().includes('real madrid') || s.team.toLowerCase().includes('r. madrid')
      )
      chelseaPrediction.value = predictWin(chelseaStanding, chelseaResults.value, 'Chelsea')
      rmPrediction.value = predictWin(rmStanding, rmResults.value, 'Real Madrid')
    } catch {
      // Use fallbacks
      plStandings.value = fallbackPLStandings
      pdStandings.value = fallbackPDStandings
      chelseaResults.value = fallbackChelseaResults
      chelseaUpcoming.value = fallbackChelseaUpcoming
      rmResults.value = fallbackRMResults
      rmUpcoming.value = fallbackRMUpcoming
    }

    // Cache
    cachedData = {
      plStandings: plStandings.value,
      pdStandings: pdStandings.value,
      chelseaResults: chelseaResults.value,
      chelseaUpcoming: chelseaUpcoming.value,
      rmResults: rmResults.value,
      rmUpcoming: rmUpcoming.value,
      chelseaPrediction: chelseaPrediction.value,
      rmPrediction: rmPrediction.value,
      isLive: isLive.value,
    }
    cachedAt = Date.now()
    isLoading.value = false
  }

  onMounted(load)

  return {
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
  }
}
