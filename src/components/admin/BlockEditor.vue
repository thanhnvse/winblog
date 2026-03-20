<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PostBlock } from '@/composables/usePostStore'
import { usePostStore } from '@/composables/usePostStore'

const props = defineProps<{ modelValue: PostBlock[] }>()
const emit = defineEmits<{ 'update:modelValue': [PostBlock[]] }>()

const { createEmptyBlock } = usePostStore()

const blocks = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const blockTypes: { type: PostBlock['type']; label: string; icon: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'paragraph', label: 'Paragraph', icon: '¶' },
  { type: 'blockquote', label: 'Quote', icon: '"' },
  { type: 'image', label: 'Image', icon: '🖼' },
  { type: 'code', label: 'Code', icon: '</>' },
  { type: 'list', label: 'List', icon: '≡' },
  { type: 'table', label: 'Table', icon: '⊞' },
  { type: 'callout', label: 'Callout', icon: '!' },
  { type: 'divider', label: 'Divider', icon: '—' },
]

function addBlock(type: PostBlock['type'], index?: number) {
  const block = createEmptyBlock(type)
  const newBlocks = [...blocks.value]
  if (index !== undefined) {
    newBlocks.splice(index + 1, 0, block)
  } else {
    newBlocks.push(block)
  }
  blocks.value = newBlocks
}

function removeBlock(index: number) {
  blocks.value = blocks.value.filter((_, i) => i !== index)
}

function moveBlock(from: number, to: number) {
  if (from === to) return
  const newBlocks = [...blocks.value]
  const [moved] = newBlocks.splice(from, 1)
  newBlocks.splice(to, 0, moved)
  blocks.value = newBlocks
}

function updateBlock(index: number, data: Partial<PostBlock>) {
  const newBlocks = [...blocks.value]
  newBlocks[index] = { ...newBlocks[index], ...data }
  blocks.value = newBlocks
}

// List helpers
function addListItem(blockIndex: number) {
  const block = blocks.value[blockIndex]
  if (!block.items) return
  updateBlock(blockIndex, { items: [...block.items, ''] })
}

function removeListItem(blockIndex: number, itemIndex: number) {
  const block = blocks.value[blockIndex]
  if (!block.items || block.items.length <= 1) return
  updateBlock(blockIndex, { items: block.items.filter((_, i) => i !== itemIndex) })
}

function updateListItem(blockIndex: number, itemIndex: number, value: string) {
  const block = blocks.value[blockIndex]
  if (!block.items) return
  const items = [...block.items]
  items[itemIndex] = value
  updateBlock(blockIndex, { items })
}

// Table helpers
function addTableRow(blockIndex: number) {
  const block = blocks.value[blockIndex]
  if (!block.rows) return
  const cols = block.rows[0]?.length || 2
  updateBlock(blockIndex, { rows: [...block.rows, Array(cols).fill('')] })
}

function addTableCol(blockIndex: number) {
  const block = blocks.value[blockIndex]
  if (!block.rows) return
  updateBlock(blockIndex, { rows: block.rows.map((row) => [...row, '']) })
}

function removeTableRow(blockIndex: number, rowIndex: number) {
  const block = blocks.value[blockIndex]
  if (!block.rows || block.rows.length <= 1) return
  updateBlock(blockIndex, { rows: block.rows.filter((_, i) => i !== rowIndex) })
}

function removeTableCol(blockIndex: number, colIndex: number) {
  const block = blocks.value[blockIndex]
  if (!block.rows || (block.rows[0]?.length || 0) <= 1) return
  updateBlock(blockIndex, { rows: block.rows.map((row) => row.filter((_, i) => i !== colIndex)) })
}

function updateTableCell(blockIndex: number, rowIndex: number, colIndex: number, value: string) {
  const block = blocks.value[blockIndex]
  if (!block.rows) return
  const rows = block.rows.map((row) => [...row])
  rows[rowIndex][colIndex] = value
  updateBlock(blockIndex, { rows })
}

// Drag and drop
function onDragStart(index: number) {
  dragIndex.value = index
}

function onDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  dragOverIndex.value = index
}

function onDragEnd() {
  if (dragIndex.value !== null && dragOverIndex.value !== null) {
    moveBlock(dragIndex.value, dragOverIndex.value)
  }
  dragIndex.value = null
  dragOverIndex.value = null
}

const showAddMenu = ref(false)
const addMenuIndex = ref<number | undefined>(undefined)

function openAddMenu(index?: number) {
  addMenuIndex.value = index
  showAddMenu.value = true
}

function selectBlockType(type: PostBlock['type']) {
  addBlock(type, addMenuIndex.value)
  showAddMenu.value = false
}

const codeLanguages = ['javascript', 'typescript', 'python', 'java', 'go', 'rust', 'html', 'css', 'sql', 'bash', 'json', 'yaml', 'xml', 'c', 'cpp', 'csharp', 'php', 'ruby', 'swift', 'kotlin']
</script>

<template>
  <div class="space-y-3">
    <!-- Blocks -->
    <div
      v-for="(block, index) in blocks"
      :key="block.id"
      class="group relative border border-gray-200 rounded-xl bg-white transition-all"
      :class="dragOverIndex === index ? 'border-secondary border-2' : 'hover:border-gray-300'"
      draggable="true"
      @dragstart="onDragStart(index)"
      @dragover="onDragOver($event, index)"
      @dragend="onDragEnd"
    >
      <!-- Block toolbar -->
      <div class="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
        <div class="flex items-center gap-2">
          <!-- Drag handle -->
          <span class="cursor-grab text-gray-300 hover:text-gray-500 text-sm select-none" title="Drag to reorder">⠿</span>
          <!-- Block type label -->
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ block.type }}</span>
          <!-- Type-specific controls -->
          <select
            v-if="block.type === 'heading'"
            :value="block.level || 2"
            @change="updateBlock(index, { level: Number(($event.target as HTMLSelectElement).value) as 2 | 3 | 4 })"
            class="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white"
          >
            <option :value="2">H2</option>
            <option :value="3">H3</option>
            <option :value="4">H4</option>
          </select>
          <select
            v-if="block.type === 'code'"
            :value="block.language || 'javascript'"
            @change="updateBlock(index, { language: ($event.target as HTMLSelectElement).value })"
            class="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white"
          >
            <option v-for="lang in codeLanguages" :key="lang" :value="lang">{{ lang }}</option>
          </select>
          <select
            v-if="block.type === 'list'"
            :value="block.listType || 'unordered'"
            @change="updateBlock(index, { listType: ($event.target as HTMLSelectElement).value as 'ordered' | 'unordered' })"
            class="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white"
          >
            <option value="unordered">Bullet</option>
            <option value="ordered">Numbered</option>
          </select>
          <select
            v-if="block.type === 'callout'"
            :value="block.calloutType || 'info'"
            @change="updateBlock(index, { calloutType: ($event.target as HTMLSelectElement).value as 'info' | 'warning' | 'tip' })"
            class="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="tip">Tip</option>
          </select>
        </div>
        <div class="flex items-center gap-1">
          <!-- Add block after -->
          <button @click="openAddMenu(index)" class="text-gray-300 hover:text-emerald-500 text-lg px-1" title="Add block below">+</button>
          <!-- Move up -->
          <button v-if="index > 0" @click="moveBlock(index, index - 1)" class="text-gray-300 hover:text-gray-600 text-xs px-1" title="Move up">▲</button>
          <!-- Move down -->
          <button v-if="index < blocks.length - 1" @click="moveBlock(index, index + 1)" class="text-gray-300 hover:text-gray-600 text-xs px-1" title="Move down">▼</button>
          <!-- Delete -->
          <button @click="removeBlock(index)" class="text-gray-300 hover:text-red-500 text-sm px-1" title="Remove block">✕</button>
        </div>
      </div>

      <!-- Block content -->
      <div class="p-3">
        <!-- Heading -->
        <input
          v-if="block.type === 'heading'"
          :value="block.content"
          @input="updateBlock(index, { content: ($event.target as HTMLInputElement).value })"
          :class="block.level === 2 ? 'text-2xl' : block.level === 3 ? 'text-xl' : 'text-lg'"
          class="w-full font-bold outline-none border-none bg-transparent placeholder:text-gray-300"
          placeholder="Heading text..."
        />

        <!-- Paragraph -->
        <textarea
          v-else-if="block.type === 'paragraph'"
          :value="block.content"
          @input="updateBlock(index, { content: ($event.target as HTMLTextAreaElement).value })"
          class="w-full min-h-[80px] outline-none border-none bg-transparent resize-y text-sm leading-relaxed placeholder:text-gray-300"
          placeholder="Write your paragraph..."
        />

        <!-- Blockquote -->
        <div v-else-if="block.type === 'blockquote'" class="border-l-4 border-secondary pl-4">
          <textarea
            :value="block.content"
            @input="updateBlock(index, { content: ($event.target as HTMLTextAreaElement).value })"
            class="w-full min-h-[60px] outline-none border-none bg-transparent resize-y text-sm italic text-gray-600 placeholder:text-gray-300"
            placeholder="Quote text..."
          />
        </div>

        <!-- Image -->
        <div v-else-if="block.type === 'image'" class="space-y-2">
          <input
            :value="block.imageUrl"
            @input="updateBlock(index, { imageUrl: ($event.target as HTMLInputElement).value })"
            class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-secondary"
            placeholder="Image URL..."
          />
          <img v-if="block.imageUrl" :src="block.imageUrl" class="max-h-48 rounded-lg object-cover" alt="Preview" />
          <input
            :value="block.caption"
            @input="updateBlock(index, { caption: ($event.target as HTMLInputElement).value })"
            class="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-secondary text-gray-500"
            placeholder="Caption (optional)..."
          />
        </div>

        <!-- Code -->
        <div v-else-if="block.type === 'code'" class="bg-gray-900 rounded-lg overflow-hidden">
          <textarea
            :value="block.content"
            @input="updateBlock(index, { content: ($event.target as HTMLTextAreaElement).value })"
            class="w-full min-h-[120px] bg-transparent text-green-400 text-sm font-mono p-4 outline-none resize-y placeholder:text-gray-600"
            placeholder="// Write your code here..."
            spellcheck="false"
          />
        </div>

        <!-- List -->
        <div v-else-if="block.type === 'list'" class="space-y-1">
          <div v-for="(item, itemIdx) in block.items" :key="itemIdx" class="flex items-center gap-2">
            <span class="text-gray-400 text-sm w-5 text-center shrink-0">
              {{ block.listType === 'ordered' ? (itemIdx + 1) + '.' : '•' }}
            </span>
            <input
              :value="item"
              @input="updateListItem(index, itemIdx, ($event.target as HTMLInputElement).value)"
              class="flex-1 text-sm outline-none border-b border-transparent focus:border-gray-200 py-1 bg-transparent placeholder:text-gray-300"
              placeholder="List item..."
            />
            <button @click="removeListItem(index, itemIdx)" class="text-gray-300 hover:text-red-400 text-xs">✕</button>
          </div>
          <button @click="addListItem(index)" class="text-xs text-secondary hover:text-red-600 mt-1">+ Add item</button>
        </div>

        <!-- Table -->
        <div v-else-if="block.type === 'table'" class="space-y-2">
          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <tbody>
                <tr v-for="(row, ri) in block.rows" :key="ri">
                  <td v-for="(cell, ci) in row" :key="ci" class="border border-gray-200 p-0">
                    <input
                      :value="cell"
                      @input="updateTableCell(index, ri, ci, ($event.target as HTMLInputElement).value)"
                      class="w-full px-2 py-1.5 text-sm outline-none bg-transparent placeholder:text-gray-300"
                      :class="ri === 0 ? 'font-bold bg-gray-50' : ''"
                      :placeholder="ri === 0 ? 'Header' : 'Cell'"
                    />
                  </td>
                  <td class="w-6 border-none">
                    <button @click="removeTableRow(index, ri)" class="text-gray-300 hover:text-red-400 text-xs px-1">✕</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex gap-2">
            <button @click="addTableRow(index)" class="text-xs text-secondary hover:text-red-600">+ Row</button>
            <button @click="addTableCol(index)" class="text-xs text-secondary hover:text-red-600">+ Column</button>
            <button v-if="(block.rows?.[0]?.length || 0) > 1" @click="removeTableCol(index, (block.rows?.[0]?.length || 1) - 1)" class="text-xs text-gray-400 hover:text-red-400">- Column</button>
          </div>
        </div>

        <!-- Callout -->
        <div
          v-else-if="block.type === 'callout'"
          class="rounded-lg p-3 border"
          :class="{
            'bg-blue-50 border-blue-200': block.calloutType === 'info',
            'bg-amber-50 border-amber-200': block.calloutType === 'warning',
            'bg-emerald-50 border-emerald-200': block.calloutType === 'tip',
          }"
        >
          <div class="flex items-start gap-2">
            <span class="text-sm mt-0.5">
              {{ block.calloutType === 'info' ? 'ℹ️' : block.calloutType === 'warning' ? '⚠️' : '💡' }}
            </span>
            <textarea
              :value="block.content"
              @input="updateBlock(index, { content: ($event.target as HTMLTextAreaElement).value })"
              class="flex-1 min-h-[40px] outline-none border-none bg-transparent resize-y text-sm placeholder:text-gray-400"
              placeholder="Callout content..."
            />
          </div>
        </div>

        <!-- Divider -->
        <div v-else-if="block.type === 'divider'" class="py-2">
          <hr class="border-gray-300" />
        </div>
      </div>
    </div>

    <!-- Add block button -->
    <button
      @click="openAddMenu()"
      class="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-gray-400 hover:text-secondary hover:border-secondary transition-colors text-sm font-semibold"
    >
      + Add Block
    </button>

    <!-- Add block menu (modal) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAddMenu" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30" @click.self="showAddMenu = false">
          <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 class="text-lg font-bold mb-4 text-primary">Add Block</h3>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="bt in blockTypes"
                :key="bt.type"
                @click="selectBlockType(bt.type)"
                class="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-secondary hover:bg-red-50 transition-colors"
              >
                <span class="text-xl">{{ bt.icon }}</span>
                <span class="text-xs font-semibold text-gray-600">{{ bt.label }}</span>
              </button>
            </div>
            <button @click="showAddMenu = false" class="w-full mt-4 text-sm text-gray-400 hover:text-gray-600">Cancel</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
