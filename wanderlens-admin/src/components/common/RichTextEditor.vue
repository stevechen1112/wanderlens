<template>
  <div class="rich-text-editor">
    <!-- 工具列 -->
    <div class="toolbar">
      <button type="button" @click="exec('bold')" title="粗體"><b>B</b></button>
      <button type="button" @click="exec('italic')" title="斜體"><i>I</i></button>
      <button type="button" @click="exec('underline')" title="底線"><u>U</u></button>
      <span class="divider" />
      <button type="button" @click="exec('insertUnorderedList')" title="無序列表">• 列表</button>
      <button type="button" @click="exec('insertOrderedList')" title="有序列表">1. 列表</button>
      <span class="divider" />
      <button type="button" @click="insertLink" title="插入連結">🔗 連結</button>
      <button type="button" @click="exec('formatBlock', '<h3>')" title="標題">標題</button>
      <button type="button" @click="exec('formatBlock', '<p>')" title="段落">段落</button>
      <span class="divider" />
      <button type="button" @click="exec('undo')" title="復原">↶</button>
      <button type="button" @click="exec('redo')" title="重做">↷</button>
    </div>
    <!-- 編輯區 -->
    <div
      ref="editorRef"
      class="editor-area"
      contenteditable="true"
      @input="handleInput"
      @blur="handleBlur"
      v-html="sanitizedInitialContent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const editorRef = ref<HTMLDivElement>()
const initialContent = ref(props.modelValue || '')
const sanitizedInitialContent = computed(() => sanitizeHTML(initialContent.value))

// 當外部 modelValue 變化時更新（例如 dialog 開啟時）
watch(() => props.modelValue, (val) => {
  if (editorRef.value && val !== editorRef.value.innerHTML) {
    editorRef.value.innerHTML = sanitizeHTML(val || '')
  }
})

const exec = (command: string, value?: string) => {
  document.execCommand(command, false, value)
  handleInput()
}

/**
 * 簡易 HTML 淨化：移除 <script> 標籤與 on* 事件屬性，防止 XSS
 */
const sanitizeHTML = (html: string): string => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  // 移除 <script> 元素
  tmp.querySelectorAll('script').forEach(el => el.remove())
  // 移除所有 on* 事件屬性
  tmp.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (/^on/i.test(attr.name)) el.removeAttribute(attr.name)
    })
  })
  // 移除 javascript: href
  tmp.querySelectorAll('a[href]').forEach(el => {
    const href = el.getAttribute('href') || ''
    if (/^javascript:/i.test(href)) el.removeAttribute('href')
  })
  return tmp.innerHTML
}

const insertLink = () => {
  const url = window.prompt('請輸入連結 URL')
  if (url) {
    // 只允許 http:// 與 https:// 協定，阻擋 javascript: 等危險協定
    if (!/^https?:\/\//i.test(url)) {
      alert('僅允許 http:// 或 https:// 開頭的連結')
      return
    }
    exec('createLink', url)
  }
}

const handleInput = () => {
  if (editorRef.value) {
    emit('update:modelValue', editorRef.value.innerHTML)
  }
}

const handleBlur = () => {
  emit('blur')
}

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = sanitizeHTML(props.modelValue || '')
  }
})
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  flex-wrap: wrap;
}

.toolbar button {
  padding: 4px 10px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.15s;
}

.toolbar button:hover {
  border-color: #dcdfe6;
  background: #ecf5ff;
}

.toolbar .divider {
  width: 1px;
  height: 20px;
  background: #dcdfe6;
  margin: 0 4px;
}

.editor-area {
  min-height: 120px;
  max-height: 400px;
  overflow-y: auto;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

.editor-area:focus {
  border-color: #f37a69;
}

.editor-area :deep(h3) {
  font-size: 16px;
  font-weight: bold;
  margin: 8px 0;
}

.editor-area :deep(ul),
.editor-area :deep(ol) {
  padding-left: 24px;
  margin: 4px 0;
}

.editor-area :deep(a) {
  color: #f37a69;
  text-decoration: underline;
}
</style>