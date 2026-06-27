import fs from 'fs'

function tokenizeMarketingStyles(content) {
  return content
    .replace(/background:\s*#fff\b/g, 'background: var(--wl-bg-card)')
    .replace(/background:\s*#fafafa\b/g, 'background: var(--wl-bg)')
    .replace(/background:\s*white\b/g, 'background: var(--wl-bg-card)')
    .replace(/background:\s*#f5f5f5\b/g, 'background: var(--wl-bg)')
    .replace(/background:\s*#eee\b/g, 'background: var(--wl-border)')
    .replace(/background:\s*#f0f0f0\b/g, 'background: var(--wl-border)')
    .replace(/color:\s*#1a1a2e\b/g, 'color: var(--wl-text-primary)')
    .replace(/color:\s*#888\b/g, 'color: var(--wl-text-secondary)')
    .replace(/color:\s*#666\b/g, 'color: var(--wl-text-regular)')
}

// index.vue scoped styles
{
  const p = 'src/pages/index.vue'
  let t = fs.readFileSync(p, 'utf8')
  const styleStart = t.indexOf('<style scoped>')
  const styleEnd = t.indexOf('</style>', styleStart)
  const before = t.slice(0, styleStart)
  const style = tokenizeMarketingStyles(t.slice(styleStart, styleEnd))
  const after = t.slice(styleEnd)
  fs.writeFileSync(p, before + style + after, 'utf8')
  console.log('index.vue dark tokens ok')
}

// inbound-travel.vue
{
  const p = 'src/pages/inbound-travel.vue'
  let t = fs.readFileSync(p, 'utf8')
  t = t.replace('class="spots-section py-16 bg-white"', 'class="spots-section py-16"')
  const styleStart = t.indexOf('<style scoped>')
  const styleEnd = t.indexOf('</style>', styleStart)
  const before = t.slice(0, styleStart)
  let style = t.slice(styleStart, styleEnd)
  if (!style.includes('.spots-section {')) {
    style = style.replace(
      '.section-header { margin-bottom: 32px; }',
      '.spots-section { background: var(--wl-bg-card); }\n.section-header { margin-bottom: 32px; }'
    )
  } else {
    style = style.replace(/\.spots-section\s*\{[^}]*\}/, '.spots-section { background: var(--wl-bg-card); }')
  }
  style = tokenizeMarketingStyles(style)
  const after = t.slice(styleEnd)
  fs.writeFileSync(p, before + style + after, 'utf8')
  console.log('inbound-travel.vue dark tokens ok')
}

// main.css inbound-travel dark fallbacks (scoped attr can beat globals)
{
  const p = 'src/assets/css/main.css'
  let t = fs.readFileSync(p, 'utf8')
  const block = `
/* ── 入境旅拍頁深色模式 ── */
html.dark .inbound-page .section-title,
html.dark .inbound-page .cta-content h2,
html.dark .inbound-page .feature-card h3,
html.dark .inbound-page .spot-info h4 {
  color: var(--wl-text-primary);
}
html.dark .inbound-page .feature-card p,
html.dark .inbound-page .spot-info p,
html.dark .inbound-page .cta-content > p,
html.dark .inbound-page .cta-lang-text {
  color: var(--wl-text-secondary);
}
html.dark .inbound-page .spots-section {
  background: var(--wl-bg-card);
}
html.dark .inbound-page .spot-card,
html.dark .inbound-page .cta-card {
  background: var(--wl-bg-card);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}
html.dark .inbound-page .cta-lang-item {
  background: #1F2932;
}
`
  if (!t.includes('入境旅拍頁深色模式')) {
    t = t.replace(
      'html.dark .skeleton-card {',
      block + 'html.dark .skeleton-card {'
    )
    fs.writeFileSync(p, t, 'utf8')
    console.log('main.css inbound dark ok')
  }
}

console.log('done')
