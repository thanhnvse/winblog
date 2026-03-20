import { ref, watch } from 'vue'
import { technologies, type Technology, type ContentSection } from '@/data/technologies'

export interface PostBlock {
  id: string
  type: 'heading' | 'paragraph' | 'blockquote' | 'image' | 'code' | 'list' | 'table' | 'callout' | 'divider'
  content: string
  // Heading
  level?: 2 | 3 | 4
  // Image
  imageUrl?: string
  caption?: string
  // Code
  language?: string
  // List
  listType?: 'ordered' | 'unordered'
  items?: string[]
  // Table
  rows?: string[][]
  // Callout
  calloutType?: 'info' | 'warning' | 'tip'
}

export interface Post {
  id: string
  title: string
  description: string
  image: string
  author: string
  authorRole: string
  postedDate: string
  lastUpdated: string
  blocks: PostBlock[]
  status: 'draft' | 'published'
  category: 'technology' | 'economics' | 'experience'
}

const STORAGE_KEY = 'winblog_posts'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function generateBlockId(): string {
  return 'blk_' + generateId()
}

// Convert old ContentSection to PostBlock
function contentToBlocks(content: ContentSection[]): PostBlock[] {
  return content.map((section) => {
    const base: PostBlock = {
      id: generateBlockId(),
      type: section.type,
      content: section.content,
    }
    if (section.type === 'list' && section.items) {
      base.items = [...section.items]
      base.listType = 'unordered'
    }
    if (section.type === 'table' && section.rows) {
      base.rows = section.rows.map((row) => [...row])
    }
    if (section.type === 'heading') {
      base.level = 2
    }
    return base
  })
}

// Convert PostBlock[] to ContentSection[] for rendering on PostDetailPage
function blocksToContent(blocks: PostBlock[]): ContentSection[] {
  return blocks
    .filter((b) => b.type !== 'divider' && b.type !== 'image' && b.type !== 'code' && b.type !== 'callout')
    .map((b) => {
      const section: ContentSection = { type: b.type as ContentSection['type'], content: b.content }
      if (b.items) section.items = b.items
      if (b.rows) section.rows = b.rows
      return section
    })
}

// Convert Technology to Post
function techToPost(tech: Technology): Post {
  return {
    id: tech.id,
    title: tech.title,
    description: tech.description,
    image: tech.image,
    author: tech.author,
    authorRole: tech.authorRole,
    postedDate: tech.postedDate,
    lastUpdated: tech.lastUpdated,
    blocks: contentToBlocks(tech.content),
    status: 'published',
    category: 'technology',
  }
}

// Load from localStorage or seed from technologies data
function loadPosts(): Post[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Post[]
      if (parsed.length > 0) return parsed.map((p) => ({ ...p, category: p.category || 'technology' }))
    }
  } catch { /* ignore */ }

  // Seed from existing technologies data
  return technologies.map(techToPost)
}

function savePosts(posts: Post[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

// Global singleton
const posts = ref<Post[]>(loadPosts())

watch(posts, (val) => savePosts(val), { deep: true })

export function usePostStore() {
  function getAll(): Post[] {
    return posts.value
  }

  function getById(id: string): Post | undefined {
    return posts.value.find((p) => p.id === id)
  }

  function create(post: Omit<Post, 'id'>): Post {
    const newPost: Post = { ...post, id: generateId() }
    posts.value = [...posts.value, newPost]
    return newPost
  }

  function update(id: string, data: Partial<Post>) {
    const idx = posts.value.findIndex((p) => p.id === id)
    if (idx === -1) return
    posts.value[idx] = { ...posts.value[idx], ...data, lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) }
    posts.value = [...posts.value]
  }

  function remove(id: string) {
    posts.value = posts.value.filter((p) => p.id !== id)
  }

  function createEmptyBlock(type: PostBlock['type']): PostBlock {
    const block: PostBlock = { id: generateBlockId(), type, content: '' }
    switch (type) {
      case 'heading': block.level = 2; break
      case 'list': block.listType = 'unordered'; block.items = ['']; break
      case 'table': block.rows = [['Header 1', 'Header 2'], ['', '']]; break
      case 'code': block.language = 'javascript'; break
      case 'image': block.imageUrl = ''; block.caption = ''; break
      case 'callout': block.calloutType = 'info'; break
    }
    return block
  }

  // Convert posts back to Technology format for the public pages
  function getAsTechnologies(): Technology[] {
    return posts.value
      .filter((p) => p.status === 'published')
      .map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image: p.image,
        author: p.author,
        authorRole: p.authorRole,
        postedDate: p.postedDate,
        lastUpdated: p.lastUpdated,
        content: blocksToContent(p.blocks),
      }))
  }

  return {
    posts,
    getAll,
    getById,
    create,
    update,
    remove,
    createEmptyBlock,
    getAsTechnologies,
    generateBlockId,
  }
}
