<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePostStore, type Post, type PostBlock } from '@/composables/usePostStore'
import BlockEditor from '@/components/admin/BlockEditor.vue'

const { posts, getById, create, update, remove, createEmptyBlock } = usePostStore()

// View state
const view = ref<'list' | 'create' | 'edit'>('list')
const editingId = ref<string | null>(null)
const searchQuery = ref('')
const statusFilter = ref<'all' | 'published' | 'draft'>('all')
const deleteConfirmId = ref<string | null>(null)
const showStatusDrop = ref(false)
const showCategoryDrop = ref(false)

const statusOptions = [
  { value: 'all' as const, label: 'All', dot: 'bg-gray-400' },
  { value: 'published' as const, label: 'Published', dot: 'bg-emerald-500' },
  { value: 'draft' as const, label: 'Draft', dot: 'bg-amber-500' },
]

const categoryOptions = [
  { value: 'all' as const, label: 'All', dot: 'bg-gray-400' },
  { value: 'technology' as const, label: 'Technology', dot: 'bg-blue-500' },
  { value: 'economics' as const, label: 'Economics', dot: 'bg-purple-500' },
  { value: 'experience' as const, label: 'Experience', dot: 'bg-teal-500' },
]

// Form state
const categoryFilter = ref<'all' | 'technology' | 'economics' | 'experience'>('all')

const form = ref({
  title: '',
  description: '',
  image: '',
  author: 'Win Nguyen',
  authorRole: 'Technology Lead',
  status: 'draft' as 'draft' | 'published',
  category: 'technology' as 'technology' | 'economics' | 'experience',
  blocks: [] as PostBlock[],
})

// Filtered posts
const filteredPosts = computed(() => {
  return posts.value.filter((p) => {
    const matchSearch =
      !searchQuery.value ||
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value === 'all' || p.status === statusFilter.value
    const matchCategory = categoryFilter.value === 'all' || p.category === categoryFilter.value
    return matchSearch && matchStatus && matchCategory
  })
})

const categoryLabels: Record<string, string> = {
  technology: 'Technology',
  economics: 'Economics',
  experience: 'Experience',
}

const categoryColors: Record<string, string> = {
  technology: 'bg-blue-100 text-blue-700',
  economics: 'bg-purple-100 text-purple-700',
  experience: 'bg-teal-100 text-teal-700',
}

const stats = computed(() => ({
  total: posts.value.length,
  published: posts.value.filter((p) => p.status === 'published').length,
  draft: posts.value.filter((p) => p.status === 'draft').length,
}))

function openCreate() {
  form.value = {
    title: '',
    description: '',
    image: '',
    author: 'Win Nguyen',
    authorRole: 'Technology Lead',
    status: 'draft',
    category: 'technology',
    blocks: [createEmptyBlock('paragraph')],
  }
  view.value = 'create'
}

function openEdit(id: string) {
  const post = getById(id)
  if (!post) return
  editingId.value = id
  form.value = {
    title: post.title,
    description: post.description,
    image: post.image,
    author: post.author,
    authorRole: post.authorRole,
    status: post.status,
    category: post.category,
    blocks: JSON.parse(JSON.stringify(post.blocks)),
  }
  view.value = 'edit'
}

function handleSave() {
  if (!form.value.title.trim()) return

  const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  if (view.value === 'create') {
    create({
      title: form.value.title,
      description: form.value.description,
      image: form.value.image,
      author: form.value.author,
      authorRole: form.value.authorRole,
      postedDate: now,
      lastUpdated: now,
      blocks: form.value.blocks,
      status: form.value.status,
      category: form.value.category,
    })
  } else if (editingId.value) {
    update(editingId.value, {
      title: form.value.title,
      description: form.value.description,
      image: form.value.image,
      author: form.value.author,
      authorRole: form.value.authorRole,
      blocks: form.value.blocks,
      status: form.value.status,
      category: form.value.category,
    })
  }

  view.value = 'list'
  editingId.value = null
}

function handleDelete(id: string) {
  remove(id)
  deleteConfirmId.value = null
}

function toggleStatus(post: Post) {
  update(post.id, { status: post.status === 'published' ? 'draft' : 'published' })
}

function goBack() {
  view.value = 'list'
  editingId.value = null
}

function truncate(text: string, len: number): string {
  return text.length > len ? text.slice(0, len) + '...' : text
}

const statusDropRef = ref<HTMLElement>()
const categoryDropRef = ref<HTMLElement>()

function onClickOutside(e: MouseEvent) {
  if (statusDropRef.value && !statusDropRef.value.contains(e.target as Node)) showStatusDrop.value = false
  if (categoryDropRef.value && !categoryDropRef.value.contains(e.target as Node)) showCategoryDrop.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div class="min-h-screen bg-light pt-20">
    <div class="max-w-6xl mx-auto px-4 py-10">

      <!-- ========== LIST VIEW ========== -->
      <template v-if="view === 'list'">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 class="text-[32px] md:text-[40px] font-extrabold text-primary leading-tight">Post Management</h1>
            <p class="text-gray text-sm mt-1">Create, edit and manage your blog posts.</p>
          </div>
          <button
            @click="openCreate"
            class="shrink-0 px-6 py-3 bg-secondary text-white font-bold rounded-full hover:bg-red-600 transition-colors text-sm"
          >
            + New Post
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
            <div class="text-2xl font-extrabold text-primary">{{ stats.total }}</div>
            <div class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total</div>
          </div>
          <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
            <div class="text-2xl font-extrabold text-emerald-600">{{ stats.published }}</div>
            <div class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Published</div>
          </div>
          <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
            <div class="text-2xl font-extrabold text-amber-600">{{ stats.draft }}</div>
            <div class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Drafts</div>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3 mb-6">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search posts..."
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-secondary bg-white"
            />
          </div>
          <!-- Status dropdown -->
          <div class="relative" ref="statusDropRef">
            <button
              @click="showStatusDrop = !showStatusDrop; showCategoryDrop = false"
              class="flex items-center gap-2 pl-4 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-primary bg-white cursor-pointer hover:border-gray-300 transition-colors min-w-[140px]"
            >
              <span class="flex-1 text-left">{{ statusFilter === 'all' ? 'All Status' : statusFilter === 'published' ? 'Published' : 'Draft' }}</span>
              <svg class="w-4 h-4 text-gray-400 transition-transform" :class="showStatusDrop ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div v-if="showStatusDrop" class="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                <button
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  @click="statusFilter = opt.value; showStatusDrop = false"
                  class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
                  :class="statusFilter === opt.value ? 'bg-gray-50 font-bold text-primary' : 'text-gray-600'"
                >
                  <span class="w-2 h-2 rounded-full shrink-0" :class="opt.dot"></span>
                  <span>{{ opt.label }}</span>
                  <svg v-if="statusFilter === opt.value" class="w-4 h-4 text-secondary ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </button>
              </div>
            </Transition>
          </div>

          <!-- Category dropdown -->
          <div class="relative" ref="categoryDropRef">
            <button
              @click="showCategoryDrop = !showCategoryDrop; showStatusDrop = false"
              class="flex items-center gap-2 pl-4 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-primary bg-white cursor-pointer hover:border-gray-300 transition-colors min-w-[160px]"
            >
              <span class="flex-1 text-left">{{ categoryFilter === 'all' ? 'All Categories' : categoryLabels[categoryFilter] }}</span>
              <svg class="w-4 h-4 text-gray-400 transition-transform" :class="showCategoryDrop ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div v-if="showCategoryDrop" class="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                <button
                  v-for="opt in categoryOptions"
                  :key="opt.value"
                  @click="categoryFilter = opt.value; showCategoryDrop = false"
                  class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
                  :class="categoryFilter === opt.value ? 'bg-gray-50 font-bold text-primary' : 'text-gray-600'"
                >
                  <span class="w-2 h-2 rounded-full shrink-0" :class="opt.dot"></span>
                  <span>{{ opt.label }}</span>
                  <svg v-if="categoryFilter === opt.value" class="w-4 h-4 text-secondary ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-100 bg-gray-50/80">
                  <th class="text-left px-5 py-3 font-semibold text-gray-400 uppercase tracking-wider text-xs">Title</th>
                  <th class="text-center px-5 py-3 font-semibold text-gray-400 uppercase tracking-wider text-xs hidden sm:table-cell">Category</th>
                  <th class="text-left px-5 py-3 font-semibold text-gray-400 uppercase tracking-wider text-xs hidden md:table-cell">Author</th>
                  <th class="text-center px-5 py-3 font-semibold text-gray-400 uppercase tracking-wider text-xs hidden sm:table-cell">Status</th>
                  <th class="text-left px-5 py-3 font-semibold text-gray-400 uppercase tracking-wider text-xs hidden lg:table-cell">Updated</th>
                  <th class="text-center px-5 py-3 font-semibold text-gray-400 uppercase tracking-wider text-xs hidden sm:table-cell">Blocks</th>
                  <th class="text-right px-5 py-3 font-semibold text-gray-400 uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="post in filteredPosts"
                  :key="post.id"
                  class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td class="px-5 py-3.5">
                    <div class="font-bold text-primary leading-tight">{{ truncate(post.title, 50) }}</div>
                    <div class="text-xs text-gray-400 mt-0.5 hidden sm:block">{{ truncate(post.description, 60) }}</div>
                  </td>
                  <td class="px-5 py-3.5 text-center hidden sm:table-cell">
                    <span
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      :class="categoryColors[post.category] || 'bg-gray-100 text-gray-600'"
                    >
                      {{ categoryLabels[post.category] || post.category }}
                    </span>
                  </td>
                  <td class="px-5 py-3.5 text-gray-500 hidden md:table-cell">{{ post.author }}</td>
                  <td class="px-5 py-3.5 text-center hidden sm:table-cell">
                    <button
                      @click="toggleStatus(post)"
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      :class="post.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'"
                    >
                      {{ post.status }}
                    </button>
                  </td>
                  <td class="px-5 py-3.5 text-gray-400 text-xs hidden lg:table-cell">{{ post.lastUpdated }}</td>
                  <td class="px-5 py-3.5 text-center text-gray-400 hidden sm:table-cell">{{ post.blocks.length }}</td>
                  <td class="px-5 py-3.5 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="openEdit(post.id)"
                        class="px-3 py-1.5 text-xs font-semibold text-secondary border border-secondary/30 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        v-if="deleteConfirmId !== post.id"
                        @click="deleteConfirmId = post.id"
                        class="px-3 py-1.5 text-xs font-semibold text-gray-400 border border-gray-200 rounded-lg hover:text-red-500 hover:border-red-300 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        v-else
                        @click="handleDelete(post.id)"
                        class="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredPosts.length === 0">
                  <td colspan="6" class="px-5 py-12 text-center text-gray-400">
                    No posts found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- ========== CREATE / EDIT VIEW ========== -->
      <template v-else>
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-4">
            <button @click="goBack" class="text-gray-400 hover:text-primary transition-colors text-2xl">←</button>
            <h1 class="text-[28px] md:text-[36px] font-extrabold text-primary">
              {{ view === 'create' ? 'New Post' : 'Edit Post' }}
            </h1>
          </div>
          <div class="flex items-center gap-3">
            <select
              v-model="form.status"
              class="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-secondary bg-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button
              @click="handleSave"
              :disabled="!form.title.trim()"
              class="px-6 py-2.5 bg-secondary text-white font-bold rounded-full hover:bg-red-600 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {{ view === 'create' ? 'Create' : 'Save' }}
            </button>
          </div>
        </div>

        <!-- Post meta fields -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Title</label>
              <input
                v-model="form.title"
                type="text"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-bold outline-none focus:border-secondary"
                placeholder="Post title..."
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                v-model="form.description"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-secondary resize-y min-h-[60px]"
                placeholder="Short description..."
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
              <select
                v-model="form.category"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-secondary bg-white"
              >
                <option value="technology">Technology</option>
                <option value="economics">Economics</option>
                <option value="experience">Experience</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Cover Image URL</label>
              <input
                v-model="form.image"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-secondary"
                placeholder="https://..."
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Author</label>
              <input
                v-model="form.author"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-secondary"
                placeholder="Author name..."
              />
            </div>
          </div>
          <img v-if="form.image" :src="form.image" class="max-h-40 rounded-xl object-cover mt-2" alt="Cover preview" />
        </div>

        <!-- Content Block Editor -->
        <div class="mb-6">
          <h2 class="text-lg font-extrabold text-primary mb-4">Content Blocks</h2>
          <BlockEditor v-model="form.blocks" />
        </div>
      </template>
    </div>

    <!-- Divider -->
    <div class="max-w-4xl mx-auto py-12 md:py-20 px-3" style="background: rgb(34, 20, 41);">
      <div class="max-w-3xl mx-auto px-4">
        <hr class="border-white" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
