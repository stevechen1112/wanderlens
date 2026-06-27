import fs from 'fs'
import https from 'https'

const text = fs.readFileSync('src/utils/photos.ts', 'utf8')
const urls = [...new Set(text.match(/https:\/\/(?:images\.pexels\.com|cdn\.pixabay\.com)[^'"]+/g))]

function head(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode })
    })
    req.on('error', () => resolve({ url, status: 'ERR' }))
    req.setTimeout(15000, () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }) })
    req.end()
  })
}

const results = []
for (const url of urls) {
  results.push(await head(url))
}

const bad = results.filter((r) => r.status !== 200)
console.log('Total:', urls.length, 'Bad:', bad.length)
for (const r of bad) console.log(r.status, r.url)
