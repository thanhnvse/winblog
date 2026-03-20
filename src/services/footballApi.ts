const FOOTBALL_KEY = import.meta.env.VITE_FOOTBALL_KEY || ''
// Use Vite proxy in dev to bypass CORS, direct URL in production
const BASE_URL = import.meta.env.DEV
  ? '/api/football'
  : 'https://api.football-data.org/v4'

async function fetchFootball<T>(path: string, fallback: T): Promise<T> {
  if (!FOOTBALL_KEY) return fallback
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'X-Auth-Token': FOOTBALL_KEY },
    })
    if (!res.ok) throw new Error(`${res.status}`)
    return (await res.json()) as T
  } catch {
    console.warn(`[FootballAPI] Failed: ${path}`)
    return fallback
  }
}

// ===== TYPES =====
export interface StandingEntry {
  position: number
  team: string
  crest: string
  played: number
  won: number
  draw: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string // e.g. "W,W,D,L,W"
}

export interface MatchResult {
  date: string
  competition: string
  homeTeam: string
  homeCrest: string
  awayTeam: string
  awayCrest: string
  homeScore: number | null
  awayScore: number | null
  status: 'FINISHED' | 'SCHEDULED' | 'LIVE' | 'TIMED' | 'IN_PLAY'
}

export interface TeamInfo {
  name: string
  crest: string
  venue: string
  coach: string
  competitionCode: string
  competitionName: string
  teamId: number
}

// ===== TEAM CONFIG =====
// Chelsea: teamId 61, Premier League (PL)
// Real Madrid: teamId 86, La Liga (PD)
export const TEAMS: Record<string, TeamInfo> = {
  chelsea: {
    name: 'Chelsea FC',
    crest: 'https://crests.football-data.org/61.png',
    venue: 'Stamford Bridge',
    coach: '',
    competitionCode: 'PL',
    competitionName: 'Premier League',
    teamId: 61,
  },
  realMadrid: {
    name: 'Real Madrid CF',
    crest: 'https://crests.football-data.org/86.png',
    venue: 'Santiago Bernabéu',
    coach: '',
    competitionCode: 'PD',
    competitionName: 'La Liga',
    teamId: 86,
  },
}

// ===== STANDINGS =====
export async function fetchStandings(competitionCode: string): Promise<StandingEntry[]> {
  const data = await fetchFootball<any>(
    `/competitions/${competitionCode}/standings`,
    null
  )
  if (!data?.standings?.[0]?.table) return []

  return data.standings[0].table.map((row: any) => ({
    position: row.position,
    team: row.team?.shortName || row.team?.name || '',
    crest: row.team?.crest || '',
    played: row.playedGames || 0,
    won: row.won || 0,
    draw: row.draw || 0,
    lost: row.lost || 0,
    goalsFor: row.goalsFor || 0,
    goalsAgainst: row.goalsAgainst || 0,
    goalDifference: row.goalDifference || 0,
    points: row.points || 0,
    form: row.form || '',
  }))
}

// ===== MATCHES =====
export async function fetchTeamMatches(
  teamId: number,
  status?: 'FINISHED' | 'SCHEDULED'
): Promise<MatchResult[]> {
  const params = status ? `?status=${status}&limit=5` : '?limit=10'
  const data = await fetchFootball<any>(`/teams/${teamId}/matches${params}`, null)
  if (!data?.matches) return []

  return data.matches.map((m: any) => ({
    date: m.utcDate || '',
    competition: m.competition?.name || '',
    homeTeam: m.homeTeam?.shortName || m.homeTeam?.name || '',
    homeCrest: m.homeTeam?.crest || '',
    awayTeam: m.awayTeam?.shortName || m.awayTeam?.name || '',
    awayCrest: m.awayTeam?.crest || '',
    homeScore: m.score?.fullTime?.home ?? null,
    awayScore: m.score?.fullTime?.away ?? null,
    status: m.status || 'SCHEDULED',
  }))
}

// ===== SIMPLE WIN PREDICTION =====
// Based on recent form, standings position, and home/away advantage
export function predictWin(
  teamStanding: StandingEntry | undefined,
  recentMatches: MatchResult[],
  teamName: string
): { win: number; draw: number; lose: number } {
  if (!teamStanding) return { win: 33, draw: 34, lose: 33 }

  // Base from league position (top teams get higher base)
  const positionScore = Math.max(0, (21 - teamStanding.position) / 20) // 1st = 1.0, 20th = 0.05
  let baseWin = 30 + positionScore * 30 // 30-60%

  // Adjust from recent form
  const finished = recentMatches.filter((m) => m.status === 'FINISHED').slice(0, 5)
  let formBonus = 0
  for (const m of finished) {
    const isHome = m.homeTeam === teamName
    const won =
      (isHome && (m.homeScore ?? 0) > (m.awayScore ?? 0)) ||
      (!isHome && (m.awayScore ?? 0) > (m.homeScore ?? 0))
    const drew = (m.homeScore ?? 0) === (m.awayScore ?? 0)
    if (won) formBonus += 4
    else if (drew) formBonus += 1
    else formBonus -= 3
  }
  baseWin += formBonus

  // Clamp
  baseWin = Math.min(75, Math.max(15, baseWin))
  const draw = Math.min(30, Math.max(10, 30 - Math.abs(baseWin - 45)))
  const lose = 100 - baseWin - draw

  return {
    win: Math.round(baseWin),
    draw: Math.round(draw),
    lose: Math.round(Math.max(5, lose)),
  }
}
