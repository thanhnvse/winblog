export interface Project {
  title: string
  description: string
  image: string
  link: string
}

export const projects: Project[] = [
  {
    title: 'Fresh digital outlook for a traditionally offline business',
    description:
      'Fresh to home approached us at a crucial point in their journey when they were preparing to raise a new round of capital to scale their then niche business into a differentiated online brand.',
    image: 'Freshtohome-Banner.webp',
    link: '/projects/fresh-to-home',
  },
  {
    title:
      'Enhancing Stanza Living with a Mobile app – Elevate co-living tenant experience across India',
    description:
      'Stanza Living is a leading provider of fully managed, tech enabled co-living accommodations designed for students and young professionals in India.',
    image: 'stanza-banner.webp',
    link: '/projects/stanza-living',
  },
  {
    title: 'Greenscale',
    description:
      'A gamified MVP web platform that empowers high school students across the world to understand and reduce their carbon footprint—making sustainability education engaging, personal, and actionable.',
    image: 'Frame-1948757885.webp',
    link: '/projects/greenscale',
  },
]
