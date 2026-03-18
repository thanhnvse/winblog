export interface Story {
  type: 'white paper' | 'blog'
  title: string
  description: string
  image: string
  author?: string
  date: string
  link: string
}

export const stories: Story[] = [
  {
    type: 'white paper',
    title: 'Designing for Generative AI',
    description:
      'AI is transforming the design landscape, reshaping user experiences in profound ways.',
    image: 'designing-for-generative-ai-whitepaper.webp',
    date: '18 September, 2025',
    link: '/whitepapers/designing-generative-ai',
  },
  {
    type: 'blog',
    title:
      'AI Design Thinking: A Guide to Understanding Human-Centered AI',
    description: '',
    image: 'AIデザイン思考とは何でしょうか？人間中心のAIを理解するためのガイド.webp',
    author: 'Minh Anh Tran',
    date: '18 March, 2026',
    link: '/blogs/ai-design-thinking',
  },
]

export const cultureImages: string[] = [
  'WhatsApp-Image-2025-05-08-at-3.57.57-PM.webp',
  'WhatsApp-Image-2025.webp',
  'Vietnam-Team-Meeting-2.webp',
  'Team-Discussion-1.webp',
  'WhatsApp-Image-2025-05-09-at-5.35.59-PM.webp',
  'Working-culture-1.1.webp',
  'WhatsApp-Image-2025-05-08-at-3.58.14-PM.webp',
  'Girl-Illustrting-2_11zon-1.webp',
  'Design-Thinking-StickyNotes.webp',
]
