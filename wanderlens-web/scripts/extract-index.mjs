import fs from 'fs'

const lines = fs.readFileSync(
  'C:/Users/User/.cursor/projects/c-Users-User-Desktop-wanderlens/agent-transcripts/9a9cee3c-9218-47dd-a76c-b9922389dd60/9a9cee3c-9218-47dd-a76c-b9922389dd60.jsonl',
  'utf8',
).split('\n')

let best = ''
for (const line of lines) {
  if (!line.includes('index.vue') || !line.includes('Write')) continue
  try {
    const j = JSON.parse(line)
    for (const c of j.message?.content || []) {
      if (c.name === 'Write' && c.input?.path?.includes('index.vue')) {
        const t = c.input.contents || ''
        if (t.length > best.length) best = t
      }
    }
  } catch { /* skip */ }
}

fs.writeFileSync('src/pages/_base_index.vue', best, 'utf8')
console.log('base len', best.length)
