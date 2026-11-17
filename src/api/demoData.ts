import { CATEGORY_LABELS, formatFee } from '@/lib/format'
import { readJson, writeJson } from '@/lib/storage'
import type {
  AuthResult,
  ChatMessage,
  Landmark,
  LandmarkCategory,
  LandmarkSummary,
  Me,
  Profile,
  ProfileUpdate,
  ProgressUpdate,
  QuestProgress,
  Rank,
  ScanResult,
  Visit,
} from './types'

export const DEMO_LANDMARKS: Landmark[] = [
  {
    id: 'magellans-cross',
    name: "Magellan's Cross",
    category: 'monument',
    district: 'Downtown Cebu City',
    latitude: 10.2935,
    longitude: 123.902,
    imageUrl: '/landmarks/magellan.jpg',
    admissionFee: 0,
    rating: 4.8,
    visitCount: 1420,
    estimatedVisitMinutes: 25,
    visitingHours: '8:00 AM - 6:00 PM',
    story: {
      about:
        "Magellan's Cross stands inside an octagonal stone pavilion on Plaza Sugbo, right beside the Basílica Minore del Santo Niño. It marks the historic arrival of Ferdinand Magellan and Rajah Humabon's 1521 baptism in Cebu.",
      significance:
        'Revered as the symbolic birthplace of Christianity in the Philippines, the pavilion remains one of the most visited heritage landmarks in the Visayas and a living devotional space for Cebuanos.',
      architecture:
        'An octagonal coral-stone and adobe kiosk built in 1834 crowns the tindalo-wood encasement that protects the original cross inside. Overhead, a ceiling mural painted by Jess Roa and Serry M. depicts the 1521 planting of the cross.',
      trivia:
        'Devotees believe chips from the original cross held miraculous healing power—the hollow tindalo wooden shell was built in the 19th century to protect what remained of the relic.',
    },
  },
  {
    id: 'basilica-santo-nino',
    name: 'Basílica Minore del Santo Niño',
    category: 'church',
    district: 'Downtown Cebu City',
    latitude: 10.2943,
    longitude: 123.9022,
    imageUrl: '/landmarks/basilica.jpg',
    admissionFee: 0,
    rating: 4.9,
    visitCount: 2150,
    estimatedVisitMinutes: 45,
    visitingHours: '5:00 AM - 7:30 PM',
    story: {
      about:
        'Founded in 1565 by Fray Andrés de Urdaneta on the exact spot where the image of the Santo Niño de Cebú was rediscovered, this is the oldest Roman Catholic church in the Philippines.',
      significance:
        'Designated a Minor Basilica by Pope Paul VI in 1965, it is the heart of the annual Sinulog festival every January and a centerpiece of Philippine religious heritage.',
      architecture:
        'Built from cut coral stone after earlier wood-and-nipa structures burned, the current 1735 church blends Baroque, Moorish, and Romanesque accents around an open-air Pilgrim Center courtyard.',
      trivia:
        'Inside the adjacent convent museum sits the original Flemish-crafted wooden statue of the Child Jesus gifted by Magellan to Queen Juana in 1521—the only relic to survive the 1565 fire.',
    },
  },
  {
    id: 'fort-san-pedro',
    name: 'Fort San Pedro',
    category: 'fort',
    district: 'Pier Area, Cebu City',
    latitude: 10.2924,
    longitude: 123.9056,
    imageUrl: '/landmarks/fort.jpg',
    admissionFee: 30,
    rating: 4.7,
    visitCount: 980,
    estimatedVisitMinutes: 50,
    visitingHours: '8:00 AM - 7:00 PM',
    story: {
      about:
        'Set at the edge of Plaza Independencia facing the harbor, Fort San Pedro is the oldest and smallest triangular bastion fort in the Philippines, originally started in 1565 under Miguel López de Legazpi.',
      significance:
        'Across four centuries it served as a Spanish coastal defense garrison, a rebel stronghold during the 1898 Cebuano revolution, an American barracks, and a wartime shelter.',
      architecture:
        'Its three coral-stone bastions—La Concepción, Ignacio de Loyola, and San Miguel—rise 6 meters above a central courtyard garden, linked by wide ramparts studded with 14th-to-18th century cannons.',
      trivia:
        'Before becoming a heritage park and museum, Fort San Pedro briefly functioned as classrooms in the 1930s and even housed the Cebu City Zoo in the 1960s.',
    },
  },
  {
    id: 'heritage-monument',
    name: 'Heritage of Cebu Monument',
    category: 'monument',
    district: 'Parian, Cebu City',
    latitude: 10.2981,
    longitude: 123.9041,
    imageUrl: '/landmarks/heritage.jpg',
    admissionFee: 0,
    rating: 4.6,
    visitCount: 840,
    estimatedVisitMinutes: 30,
    visitingHours: 'Open 24 hours',
    story: {
      about:
        'Standing in the historic Plaza Parian square, this monumental bronze-and-concrete tableau sculpted by National Artist Eduardo Castrillo dramatizes defining chapters of Cebuano history.',
      significance:
        'Dedicated in 2000, it brings together Cebuano heroes, Spanish expeditions, and everyday religious traditions in one open-air civic landmark in the city’s oldest residential quarter.',
      architecture:
        'Cast in dark bronze, brass, and steel over reinforced concrete, the multi-layered composition weaves a Spanish galleon, the Battle of Mactan, the 1521 baptism, and Saint Pedro Calungsod into a unified sculpture.',
      trivia:
        'The plaza it stands on was once home to Cebu’s original Parian Church—built in 1614 for the Chinese-mestizo merchant guild and demolished in 1878.',
    },
  },
  {
    id: 'casa-gorordo',
    name: 'Casa Gorordo Museum',
    category: 'museum',
    district: 'Parian, Cebu City',
    latitude: 10.2994,
    longitude: 123.9046,
    imageUrl: '/landmarks/casa.jpg',
    admissionFee: 120,
    rating: 4.8,
    visitCount: 620,
    estimatedVisitMinutes: 50,
    visitingHours: '9:00 AM - 5:00 PM (Tue–Sun)',
    story: {
      about:
        'A lovingly restored 1850s bahay na bato along Lopez Jaena Street that served as the residence of Juan Gorordo, the first Filipino Bishop of Cebu, and four generations of his family.',
      significance:
        'Recognized as a National Historical Landmark, Casa Gorordo preserves the lifestyle, craftsmanship, and civic history of 19th-century Cebuano society.',
      architecture:
        'Its ground floor is crafted from thick Mactan coral blocks mortared with lime, while the upper living quarters use molave and tugas hardwood planks, capiz-shell sliding windows, and a clay-tile roof.',
      trivia:
        'The house was built without iron nails on its upper timber joints—artisans used wooden pegs and interlocking mortise-and-tenon joinery designed to flex during earthquakes.',
    },
  },
  {
    id: 'yap-sandiego',
    name: 'Yap-Sandiego Ancestral House',
    category: 'heritage_house',
    district: 'Parian, Cebu City',
    latitude: 10.2987,
    longitude: 123.9042,
    imageUrl: '/landmarks/yap.jpg',
    admissionFee: 100,
    rating: 4.7,
    visitCount: 710,
    estimatedVisitMinutes: 40,
    visitingHours: '9:00 AM - 6:00 PM',
    story: {
      about:
        'Constructed between 1675 and 1700 by Chinese merchant Don Juan Yap and Doña Maria Florido, this two-story residence is widely celebrated as one of the oldest surviving residential houses in the Philippines.',
      significance:
        'It showcases the fusion of Filipino, Chinese, and Spanish domestic traditions in Cebu’s historic Parian district, preserved by the Sandiego family for over ten generations.',
      architecture:
        'Hand-cut coral stone walls joined with egg-white mortar support dark balayong and tugas beams, topped by hand-molded terracotta tiles and antique hand-carved furniture inside.',
      trivia:
        'Legend says the original coral stones were cemented using millions of egg whites mixed with lime and sugarcane juice—the same sweet meringue-like mortar used in Spanish-era churches.',
    },
  },
  {
    id: 'museo-sugbo',
    name: 'Museo Sugbo',
    category: 'museum',
    district: 'Tejero, Cebu City',
    latitude: 10.2999,
    longitude: 123.9062,
    imageUrl: '/landmarks/museo.jpg',
    admissionFee: 75,
    rating: 4.6,
    visitCount: 530,
    estimatedVisitMinutes: 60,
    visitingHours: '9:00 AM - 5:30 PM (Tue–Sun)',
    story: {
      about:
        'Housed inside the former Cebu Provincial Detention and Rehabilitation Center—better known for over a century as Cárcel de Cebú—Museo Sugbo is the province’s flagship museum of Cebuano history.',
      significance:
        'Its galleries chronicle pre-colonial goldware, Spanish colonial governance, Katipunan resistance in Cebu, World War II, and modern Cebuano arts.',
      architecture:
        'Designed in 1871 by Domingo de Escondrillas, the sole architect in Cebu at the time, the four-building coral-stone compound wraps a breezy central courtyard originally built with four watchtowers.',
      trivia:
        'Long before becoming a peaceful museum in 2008, the building housed everything from colonial prisoners and wartime resistance fighters to Cebu’s famed dancing inmates.',
    },
  },
]

const QUEST_TEMPLATES: Omit<QuestProgress, 'completedLandmarkIds' | 'completed'>[] = [
  {
    id: 'old-cebu-trail',
    title: 'Old Cebu Walking Trail',
    description: 'Walk from Magellan’s Cross to Fort San Pedro in the historic port quarter.',
    badgeName: 'Downtown Walker',
    landmarkIds: ['magellans-cross', 'basilica-santo-nino', 'fort-san-pedro'],
  },
  {
    id: 'parian-ancestral',
    title: 'Parian Ancestral Circuit',
    description: 'Explore Parian’s living plaza, ancestral timber homes, and museum halls.',
    badgeName: 'Parian Chronicler',
    landmarkIds: ['heritage-monument', 'casa-gorordo', 'yap-sandiego'],
  },
  {
    id: 'museum-keeper',
    title: 'Curator of Sugbo',
    description: 'Visit Cebu’s premier heritage museums and colonial archives.',
    badgeName: 'Sugbo Scholar',
    landmarkIds: ['casa-gorordo', 'museo-sugbo'],
  },
]

const DEMO_STATE_KEY = 'demo-state'

type DemoState = {
  profile: Profile
  xp: number
  visitedIds: string[]
  recentVisits: Visit[]
}

const DEFAULT_PROFILE: Profile = {
  id: 'local-dev-user',
  displayName: 'Cebu Traveler',
  avatarUrl: null,
  nationality: 'Filipino',
  bio: 'Exploring Cebu’s heritage sites with Laag ta bAI.',
  language: 'en',
  xp: 150,
  streakCount: 3,
  lastActiveDate: null,
}

function getDemoState(): DemoState {
  return readJson<DemoState>(DEMO_STATE_KEY, {
    profile: DEFAULT_PROFILE,
    xp: 150,
    visitedIds: ['magellans-cross'],
    recentVisits: [],
  })
}

function saveDemoState(state: DemoState): void {
  writeJson(DEMO_STATE_KEY, state)
}

function computeRank(xp: number): Rank {
  const levels = [
    { level: 1, title: 'Cebuano Newcomer', min: 0, max: 200 },
    { level: 2, title: 'Heritage Seeker', min: 200, max: 500 },
    { level: 3, title: 'Cultural Navigator', min: 500, max: 1000 },
    { level: 4, title: 'Parian Chronicler', min: 1000, max: 2000 },
    { level: 5, title: 'Sugbo Master', min: 2000, max: null },
  ]
  const current = levels.find((l) => l.max === null || xp < l.max) ?? levels[levels.length - 1]
  return {
    level: current.level,
    title: current.title,
    xp,
    currentLevelXp: current.min,
    nextLevelXp: current.max,
  }
}

function buildQuests(visitedIds: string[]): QuestProgress[] {
  const visited = new Set(visitedIds)
  return QUEST_TEMPLATES.map((q) => {
    const completedLandmarkIds = q.landmarkIds.filter((id) => visited.has(id))
    return {
      ...q,
      completedLandmarkIds,
      completed: completedLandmarkIds.length === q.landmarkIds.length,
    }
  })
}

function buildMe(state: DemoState): Me {
  const rank = computeRank(state.xp)
  const quests = buildQuests(state.visitedIds)
  const badges = quests.filter((q) => q.completed).map((q) => ({ questId: q.id, name: q.badgeName }))
  return {
    profile: { ...state.profile, xp: state.xp },
    email: 'traveler@laagtabai.ph',
    rank,
    stats: {
      visitedCount: state.visitedIds.length,
      districtCoveragePercent: Math.min(100, Math.round((state.visitedIds.length / DEMO_LANDMARKS.length) * 100)),
      streakCount: state.profile.streakCount,
    },
    badges,
    recentVisits: state.recentVisits,
  }
}

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function toSummary(landmark: Landmark, lat?: number, lng?: number): LandmarkSummary {
  const refLat = lat !== undefined && Math.abs(lat - 10.3) < 1 ? lat : 10.2932
  const refLng = lng !== undefined && Math.abs(lng - 123.9) < 1 ? lng : 123.9045
  const distanceMeters = lat !== undefined && lng !== undefined ? haversineMeters(refLat, refLng, landmark.latitude, landmark.longitude) : undefined
  const { story: _story, ...summary } = landmark
  void _story
  return { ...summary, distanceMeters }
}

/** Matches a file name or image hint to one of Cebu's heritage landmarks. */
export function matchLandmarkFromFile(file: Pick<File, 'name' | 'size'>): Landmark {
  const lower = file.name.toLowerCase()
  const keywords: [string, string][] = [
    ['magellan', 'magellans-cross'],
    ['cross', 'magellans-cross'],
    ['basilica', 'basilica-santo-nino'],
    ['santo', 'basilica-santo-nino'],
    ['nino', 'basilica-santo-nino'],
    ['church', 'basilica-santo-nino'],
    ['fort', 'fort-san-pedro'],
    ['pedro', 'fort-san-pedro'],
    ['heritage', 'heritage-monument'],
    ['monument', 'heritage-monument'],
    ['parian', 'heritage-monument'],
    ['casa', 'casa-gorordo'],
    ['gorordo', 'casa-gorordo'],
    ['yap', 'yap-sandiego'],
    ['sandiego', 'yap-sandiego'],
    ['museo', 'museo-sugbo'],
    ['sugbo', 'museo-sugbo'],
  ]
  for (const [kw, id] of keywords) {
    if (lower.includes(kw)) {
      const hit = DEMO_LANDMARKS.find((l) => l.id === id)
      if (hit) return hit
    }
  }
  const hash = (file.size + lower.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % DEMO_LANDMARKS.length
  return DEMO_LANDMARKS[hash]
}

/** Generates a grounded, Cebu-specific AI guide response for any question about a landmark or photo. */
export function answerAboutLandmark(landmark: Landmark, question: string): string {
  const q = question.toLowerCase().trim()
  const fee = formatFee(landmark.admissionFee)
  const category = CATEGORY_LABELS[landmark.category] ?? landmark.category

  if (!q || /where|location|address|map|find|place|what is this|identify|spot/.test(q)) {
    return (
      `This looks like **${landmark.name}** (${category}), located in **${landmark.district}, Cebu City**.\n\n` +
      `${landmark.story.about}\n\n` +
      `- **Visiting hours:** ${landmark.visitingHours}\n` +
      `- **Admission:** ${fee} · about ${landmark.estimatedVisitMinutes} mins\n` +
      `- **Why visit:** ${landmark.story.significance}`
    )
  }

  if (/hour|open|close|time|fee|price|ticket|cost|free|admission|how much/.test(q)) {
    return (
      `Here are the practical details for visiting **${landmark.name}** in **${landmark.district}**:\n\n` +
      `- **Admission:** ${fee}\n` +
      `- **Visiting hours:** ${landmark.visitingHours}\n` +
      `- **Typical visit:** Around ${landmark.estimatedVisitMinutes} minutes\n\n` +
      `Tip: Morning light between 8:00 AM and 10:00 AM offers cooler weather and great photo angles.`
    )
  }

  if (/history|story|built|old|year|origin|significance|architect|design|made/.test(q)) {
    return (
      `**History & Architecture of ${landmark.name}**\n\n` +
      `${landmark.story.significance}\n\n` +
      `**Design & Craft:** ${landmark.story.architecture}`
    )
  }

  if (/trivia|fact|secret|fun|interesting|legend/.test(q)) {
    return `**Did you know about ${landmark.name}?**\n\n${landmark.story.trivia}`
  }

  if (/near|around|eat|food|nearby|next|walk|commute|how to get/.test(q)) {
    const others = DEMO_LANDMARKS.filter((l) => l.id !== landmark.id).slice(0, 3)
    return (
      `From **${landmark.name}** (${landmark.district}), you can easily walk or take a short jeepney/ride-hailing hop to nearby heritage stops:\n\n` +
      others.map((o) => `- **${o.name}** (${o.district}) — ${formatFee(o.admissionFee)}, open ${o.visitingHours}`).join('\n')
    )
  }

  return (
    `About **${landmark.name}** in **${landmark.district}**:\n\n` +
    `${landmark.story.about} ${landmark.story.trivia}\n\n` +
    `You can visit during **${landmark.visitingHours}** (admission: **${fee}**). Ask me about its architecture, history, or nearby spots!`
  )
}

function recordVisit(landmarkId: string, source: Visit['source'], xpAwarded: number): ProgressUpdate {
  const state = getDemoState()
  const prevRank = computeRank(state.xp)
  const prevQuests = buildQuests(state.visitedIds)
  const firstVisit = !state.visitedIds.includes(landmarkId)
  const nextVisited = firstVisit ? [...state.visitedIds, landmarkId] : state.visitedIds
  const nextXp = state.xp + (firstVisit ? xpAwarded : 10)
  const nextRank = computeRank(nextXp)
  const nextQuests = buildQuests(nextVisited)
  const newBadges = nextQuests
    .filter((q, idx) => q.completed && !prevQuests[idx]?.completed)
    .map((q) => q.badgeName)

  const visit: Visit = {
    id: `visit-${Date.now()}`,
    userId: state.profile.id,
    landmarkId,
    source,
    xpAwarded: firstVisit ? xpAwarded : 10,
    createdAt: new Date().toISOString(),
  }

  saveDemoState({
    ...state,
    xp: nextXp,
    visitedIds: nextVisited,
    recentVisits: [visit, ...state.recentVisits].slice(0, 30),
  })

  return {
    xpAwarded: visit.xpAwarded,
    rank: nextRank,
    leveledUp: nextRank.level > prevRank.level,
    newBadges,
  }
}

export class DemoNotFoundError extends Error {
  constructor(message = 'Landmark not found') {
    super(message)
    this.name = 'DemoNotFoundError'
  }
}

export async function demoApiFallback<T>(
  path: string,
  options: { method?: string; token?: string | null; json?: unknown; form?: FormData } = {},
): Promise<T> {
  const url = new URL(path, 'http://localhost')
  const pathname = url.pathname
  const method = options.method ?? 'GET'

  if (pathname === '/v1/auth/login' && method === 'POST') {
    const body = (options.json ?? {}) as { email?: string }
    const email = body.email ?? 'traveler@laagtabai.ph'
    const name = email.split('@')[0] || 'Cebu Traveler'
    const result: AuthResult = {
      user: { id: 'local-dev-user', email, displayName: name },
      session: { accessToken: 'dev:local-dev-user', tokenType: 'bearer', expiresIn: 3600 },
    }
    return result as T
  }

  if (pathname === '/v1/landmarks' && method === 'GET') {
    const q = url.searchParams.get('q')?.trim().toLowerCase()
    const category = url.searchParams.get('category') as LandmarkCategory | null
    const free = url.searchParams.get('free') === 'true'
    const latParam = url.searchParams.get('lat')
    const lngParam = url.searchParams.get('lng')
    const lat = latParam ? Number(latParam) : undefined
    const lng = lngParam ? Number(lngParam) : undefined
    const limit = Number(url.searchParams.get('limit') ?? 50)

    let items = DEMO_LANDMARKS.map((l) => toSummary(l, lat, lng))
    if (q) {
      items = items.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q) ||
          CATEGORY_LABELS[l.category]?.toLowerCase().includes(q),
      )
    }
    if (category) items = items.filter((l) => l.category === category)
    if (free) items = items.filter((l) => l.admissionFee === 0)
    if (lat !== undefined && lng !== undefined) {
      items.sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0))
    }
    return items.slice(0, limit) as T
  }

  if (pathname.startsWith('/v1/landmarks/') && method === 'GET') {
    const id = decodeURIComponent(pathname.replace('/v1/landmarks/', ''))
    const found = DEMO_LANDMARKS.find((l) => l.id === id)
    if (!found) throw new DemoNotFoundError('Landmark not found')
    return found as T
  }

  if (pathname === '/v1/quests' && method === 'GET') {
    return buildQuests(getDemoState().visitedIds) as T
  }

  if (pathname === '/v1/me' && method === 'GET') {
    return buildMe(getDemoState()) as T
  }

  if (pathname === '/v1/me' && method === 'PATCH') {
    const patch = (options.json ?? {}) as ProfileUpdate
    const state = getDemoState()
    const nextProfile: Profile = {
      ...state.profile,
      displayName: patch.displayName ?? state.profile.displayName,
      nationality: patch.nationality !== undefined ? patch.nationality : state.profile.nationality,
      bio: patch.bio !== undefined ? patch.bio : state.profile.bio,
      language: patch.language ?? state.profile.language,
    }
    saveDemoState({ ...state, profile: nextProfile })
    return nextProfile as T
  }

  if (pathname === '/v1/me/visits' && method === 'POST') {
    const body = (options.json ?? {}) as { landmarkId: string }
    const progress = recordVisit(body.landmarkId, 'manual', 35)
    const state = getDemoState()
    return { ...progress, visit: state.recentVisits[0] } as T
  }

  if (pathname === '/v1/scan' && method === 'POST') {
    const file = options.form?.get('image')
    const matched = file instanceof File ? matchLandmarkFromFile(file) : DEMO_LANDMARKS[0]
    const progress = options.token ? recordVisit(matched.id, 'scan', 50) : null
    const candidates = DEMO_LANDMARKS.filter((l) => l.id !== matched.id)
      .slice(0, 3)
      .map((l) => toSummary(l))
    const result: ScanResult = {
      status: 'identified',
      confidence: 0.96,
      landmark: matched,
      candidates,
      progress,
    }
    return result as T
  }

  if (pathname === '/v1/chat' && method === 'POST') {
    const body = (options.json ?? {}) as { landmarkId: string; messages: ChatMessage[] }
    const landmark = DEMO_LANDMARKS.find((l) => l.id === body.landmarkId) ?? DEMO_LANDMARKS[0]
    const lastUser = [...(body.messages ?? [])].reverse().find((m) => m.role === 'user')
    const answer = answerAboutLandmark(landmark, lastUser?.content ?? '')
    const progress = options.token ? recordVisit(landmark.id, 'chat', 25) : null
    return {
      message: { role: 'model', content: answer },
      progress,
    } as T
  }

  throw new Error(`No demo fallback for ${method} ${pathname}`)
}
