import fs from 'fs'

const base = fs.readFileSync('scripts/_base_index.vue', 'utf8')
let v = base

v = v.replace('alt="旅拍攝影作品"', 'alt="婚紗攝影作品"')

const portfolioBlock = `
    <!-- 作品牆 -->
    <section class="portfolio-section">
      <div class="wl-container-wide">
        <div class="section-intro">
          <div>
            <span class="wl-badge wl-badge-primary mb-2">精選作品</span>
            <h2 class="section-title-sm">探索各類型攝影風格</h2>
          </div>
          <NuxtLink to="/photographer-list" class="see-all">瀏覽全部作品 →</NuxtLink>
        </div>
        <div class="portfolio-mosaic">
          <button
            v-for="(tile, idx) in portfolioTiles"
            :key="idx"
            class="mosaic-tile"
            :class="'mosaic-' + tile.span"
            @click="goCategory(tile.categoryId)"
          >
            <img :src="tile.url" :alt="tile.label" loading="lazy" @error="onPhotoError" />
            <div class="mosaic-overlay" />
            <span v-if="tile.label" class="mosaic-label">{{ tile.label }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 全部拍攝類型 -->
    <section class="category-section">
      <div class="wl-container-wide">
        <div class="section-intro">
          <div>
            <span class="wl-badge wl-badge-primary mb-2">拍攝服務</span>
            <h2 class="section-title-sm">全部拍攝類型 <span class="type-count">{{ categories.length }}</span></h2>
          </div>
          <NuxtLink to="/booking" class="see-all">立即預約 →</NuxtLink>
        </div>
        <div v-if="categories.length" class="category-grid">
          <button
            v-for="(cat, idx) in categories"
            :key="cat.id"
            class="category-card wl-animate-in"
            :class="'wl-stagger-' + Math.min((idx % 6) + 1, 6)"
            @click="selectCategory(cat)"
          >
            <div class="cat-image">
              <img :src="cat.photo" :alt="cat.name" loading="lazy" @error="onPhotoError" />
              <div class="cat-image-overlay" />
              <span class="cat-price">\${{ getCategoryBasePrice(cat.id).toLocaleString() }}<span class="cat-price-unit">/hr 起</span></span>
              <span class="cat-label">{{ cat.name }}</span>
            </div>
          </button>
        </div>
        <div v-else class="category-skeleton">
          <div v-for="n in 13" :key="n" class="wl-skeleton cat-skeleton" />
        </div>
      </div>
    </section>`

v = v.replace(/    <!-- 熱門類型 -->[\s\S]*?    <!-- 精選攝影師 -->/, portfolioBlock + '\n\n    <!-- 精選攝影師 -->')

v = v.replace(/v-if="photographers.length"/g, 'v-if="displayPhotographers.length"')
v = v.replace(/v-for="\(p, idx\) in photographers"/g, 'v-for="(p, idx) in displayPhotographers"')
v = v.replace(
  '<img :src="getCardPhoto(idx)" :alt="p.nickName" class="card-img" loading="lazy" />',
  '<img :src="p._photo || getCardPhoto(idx)" :alt="p.nickName" class="card-img" loading="lazy" @error="onPhotoError" />',
)
v = v.replace(/\s*<div class="card-price">\$\{\{ p\.totalFee \|\| p\.unitPrice \|\| 800 \}\}<span class="price-unit">\/hr<\/span><\/div>\n/, '\n')

v = v.replace(/class="card-img" loading="lazy" \/>/g, 'class="card-img" loading="lazy" @error="onPhotoError" />')

const spotsBlock = `    <!-- 熱門景點 -->
    <section class="spots-section">
      <div class="wl-container-wide">
        <div class="section-header">
          <div><span class="wl-badge wl-badge-primary mb-2">靈感</span><h2 class="section-title">熱門拍攝景點</h2></div>
          <NuxtLink to="/photographer-list" class="see-all">查看全部 →</NuxtLink>
        </div>
        <div class="spots-grid">
          <div v-for="(spot, idx) in displaySpots" :key="spot.id" class="spot-card wl-animate-in" :class="'wl-stagger-' + Math.min(idx + 1, 6)">
            <div class="spot-image">
              <img :src="getLocationPhoto(spot.name)" :alt="spot.name" loading="lazy" @error="onPhotoError" />
              <div class="spot-overlay" />
            </div>
            <div class="spot-info">
              <h4>{{ spot.name }}</h4>
              <p>{{ spot.area }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 招募 -->`

v = v.replace(/    <!-- 熱門景點 -->[\s\S]*?    <!-- 招募 -->/, spotsBlock)

v = v.replace('<img :src="heroImage" class="hero-img"', '<img :src="heroImage" class="hero-img" @error="onPhotoError"')
v = v.replace('class="recruit-bg" loading="lazy"', 'class="recruit-bg" loading="lazy" @error="onPhotoError"')
v = v.replace(/loading="lazy" \/>/g, 'loading="lazy" @error="onPhotoError" />')

v = v.replace(
  `import {
  getCategoryPhoto, getHeroPhoto, getLocationPhoto,
  getStudioPhoto, getStylistPhoto, getStepPhoto, getRecruitPhoto,
  hotCategoryIds,
} from '~/utils/photos'`,
  `import {
  getCategoryPhoto, getHeroPhoto, getLocationPhoto,
  getStudioPhoto, getStylistPhoto, getStepPhoto, getRecruitPhoto,
  getPortfolioWall, fallbackSpots, fallbackCategories, getCategoryBasePrice, onPhotoError,
  mapCategoriesWithPhotos, getDemoProviders,
} from '~/utils/photos'`,
)

v = v.replace('const HOT_COUNT = 4\nconst FEATURED_COUNT = 4', 'const FEATURED_COUNT = 8')
v = v.replace(
  'const categories = ref<any[]>([])\nconst showAllCategories = ref(false)',
  'const categories = ref(mapCategoriesWithPhotos(fallbackCategories))',
)
v = v.replace(
  'const heroImage = getHeroPhoto(0, 1600)',
  'const portfolioTiles = getPortfolioWall(800)\nconst demoProviders = getDemoProviders()\n\nconst heroImage = getHeroPhoto(0, 1600)',
)

v = v.replace(/const sortHotCategories[\s\S]*?const visibleCategories = computed[\s\S]*?\)\n\n/, '')

v = v.replace(
  'const poolLabel = computed',
  `const displayPhotographers = computed(() => {
  const valid = photographers.value.filter((p) => isValidLabel(p.nickName))
  if (valid.length >= 4) return valid.slice(0, FEATURED_COUNT)
  return demoProviders.slice(0, FEATURED_COUNT)
})

const displaySpots = computed(() => {
  const valid = attractions.value.filter((a) => isValidLabel(a.name))
  return valid.length >= 4 ? valid.slice(0, 12) : fallbackSpots
})

const poolLabel = computed`,
)

v = v.replace(
  `const selectCategory = (cat: any) => {
  searchStore.setCondition({ serviceTypeId: cat.id })
  navigateTo('/search')
}`,
  `const goCategory = (categoryId?: number) => {
  if (!categoryId) return
  searchStore.setCondition({ serviceTypeId: categoryId })
  navigateTo('/search')
}

const selectCategory = (cat: any) => goCategory(cat.id)`,
)

v = v.replace(
  `    categories.value = (typesRes.data || []).map((t: any) => ({
      ...t,
      photo: getCategoryPhoto(t.id, 0, 400),
    }))
    photographers.value = (providersRes.data || [])
      .filter((p: any) => isValidLabel(p.nickName))
      .slice(0, FEATURED_COUNT)
    attractions.value = (attrRes.data || [])
      .filter((a: any) => isValidLabel(a.name))
      .slice(0, 6)
  } catch { /* silent */ }`,
  `    const types = typesRes.data?.length ? typesRes.data : fallbackCategories
    categories.value = mapCategoriesWithPhotos(types)
    photographers.value = (providersRes.data || [])
      .filter((p: any) => isValidLabel(p.nickName))
      .slice(0, FEATURED_COUNT)
    if (photographers.value.length < 4) photographers.value = []
    attractions.value = (attrRes.data || []).filter((a: any) => isValidLabel(a.name))
  } catch {
    categories.value = mapCategoriesWithPhotos(fallbackCategories)
    photographers.value = []
  }`,
)

v = v.replace(
  'onUnmounted(() => observer.disconnect())',
  `onUnmounted(() => {
      observer.disconnect()
      heroPassed.value = false
    })`,
)

v = v.replace(
  'onUnmounted(() => observer.disconnect())',
  `onUnmounted(() => {
      observer.disconnect()
      heroPassed.value = false
    })`,
)

// keep brand colors (#F37A69)

const styleStart = v.indexOf('.category-section { padding: 48px')
const styleEnd = v.lastIndexOf('</style>')
const newStyles = `.portfolio-section { padding: 40px 0 24px; background: #fff; }
.portfolio-mosaic {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 140px;
  gap: 10px;
}
.mosaic-tile {
  position: relative; border: none; padding: 0; border-radius: 14px;
  overflow: hidden; cursor: pointer; background: #eee;
  transition: transform 0.25s, box-shadow 0.25s;
}
.mosaic-tile:hover { transform: scale(1.02); box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 1; }
.mosaic-tile img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.mosaic-tile:hover img { transform: scale(1.06); }
.mosaic-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%); }
.mosaic-label { position: absolute; bottom: 10px; left: 12px; color: white; font-size: 13px; font-weight: 700; text-shadow: 0 1px 4px rgba(0,0,0,0.4); }
.mosaic-normal { grid-column: span 1; grid-row: span 1; }
.mosaic-wide { grid-column: span 2; grid-row: span 1; }
.mosaic-tall { grid-column: span 1; grid-row: span 2; }
.mosaic-large { grid-column: span 2; grid-row: span 2; }

.category-section { padding: 32px 0 48px; background: #fafafa; }
.section-intro { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.section-title-sm { font-size: clamp(1.25rem, 2.5vw, 1.5rem); font-weight: 800; color: #1a1a2e; }
.type-count { font-size: 0.85em; color: var(--wl-primary); font-weight: 700; margin-left: 4px; }
.see-all { font-size: 14px; font-weight: 600; color: var(--wl-primary); text-decoration: none; }
.see-all:hover { text-decoration: underline; }

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}
.category-card {
  border: none; background: transparent; cursor: pointer; padding: 0;
  transition: transform 0.25s;
}
.category-card:hover { transform: translateY(-3px); }
.cat-image {
  position: relative; aspect-ratio: 4/5; border-radius: 14px; overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}
.cat-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.category-card:hover .cat-image img { transform: scale(1.06); }
.cat-image-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.6) 100%);
}
.cat-price {
  position: absolute; top: 10px; right: 10px;
  background: rgba(243, 122, 105, 0.92); color: white;
  padding: 4px 8px; border-radius: 8px;
  font-size: 12px; font-weight: 700; line-height: 1.2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.cat-price-unit { font-size: 10px; font-weight: 500; opacity: 0.9; }
.cat-label {
  position: absolute; bottom: 12px; left: 12px; right: 12px;
  color: white; font-size: 14px; font-weight: 700; text-align: left;
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
}
.category-skeleton { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.cat-skeleton { aspect-ratio: 4/5; border-radius: 14px; }

.provider-section { padding: 48px 0 64px; }
.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
.section-header.text-center { justify-content: center; }
.section-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: #1a1a2e; }

.pool-tabs { display: flex; gap: 4px; background: #f5f5f5; border-radius: 12px; padding: 4px; }
.pool-tab {
  display: flex; align-items: center; gap: 6px; padding: 8px 16px;
  border-radius: 10px; border: none; background: transparent; cursor: pointer;
  font-size: 14px; font-weight: 600; color: #666; transition: all 0.2s;
}
.pool-tab.active { background: white; color: #F37A69; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.pool-icon { flex-shrink: 0; }

.provider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  max-width: 1100px;
}
.provider-card { border-radius: 16px; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; background: white; }
.provider-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
.card-link { text-decoration: none; color: inherit; display: block; }
.card-image { position: relative; aspect-ratio: 4/3; overflow: hidden; background: #f0f0f0; }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.provider-card:hover .card-img { transform: scale(1.05); }
.card-fav { position: absolute; top: 12px; right: 12px; z-index: 2; background: none; border: none; cursor: pointer; padding: 4px; }
.card-info { padding: 12px 4px; }
.card-rating { display: flex; align-items: center; gap: 4px; font-size: 13px; margin-bottom: 4px; }
.card-name { font-weight: 700; font-size: 15px; color: #1a1a2e; }
.card-city { font-size: 13px; color: #888; margin-top: 2px; }

.how-section { padding: 72px 0; background: #fafafa; }
.steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 36px; max-width: 960px; margin-left: auto; margin-right: auto; }
.step-card {
  background: white; border-radius: 20px; padding: 0 0 24px; text-align: center;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04); position: relative; overflow: hidden;
}
.step-num {
  position: absolute; top: 12px; left: 12px; width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #F37A69, #D85A49); color: white;
  display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; z-index: 2;
}
.step-img-wrap { width: 100%; height: 160px; overflow: hidden; }
.step-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.step-card h3 { font-weight: 700; font-size: 16px; margin: 16px 0 8px; color: #1a1a2e; }
.step-card p { font-size: 13px; color: #888; line-height: 1.5; padding: 0 16px; }

.spots-section { padding: 64px 0; background: #fff; }
.spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}
.spot-card {
  border-radius: 14px; overflow: hidden; background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06); transition: transform 0.3s;
  position: relative;
}
.spot-card:hover { transform: translateY(-4px); }
.spot-image { aspect-ratio: 4/3; overflow: hidden; position: relative; }
.spot-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.spot-card:hover .spot-image img { transform: scale(1.05); }
.spot-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.3) 100%); pointer-events: none; }
.spot-info { padding: 12px; }
.spot-info h4 { font-weight: 700; font-size: 14px; color: #1a1a2e; }
.spot-info p { font-size: 12px; color: #888; margin-top: 2px; }

.recruit-section { padding: 48px 0 72px; }
.recruit-card {
  position: relative; border-radius: 24px; overflow: hidden; padding: 48px;
  color: white; min-height: 240px;
}
.recruit-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.recruit-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(243,122,105,0.92), rgba(216,90,73,0.88)); }
.recruit-content { position: relative; z-index: 2; max-width: 520px; }
.recruit-content h2 { font-size: clamp(1.5rem, 3vw, 1.75rem); font-weight: 800; margin-bottom: 12px; }
.recruit-content p { font-size: 15px; opacity: 0.95; margin-bottom: 24px; line-height: 1.6; }
.recruit-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.recruit-btn-primary { background: white; color: var(--wl-primary); padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; text-decoration: none; transition: transform 0.2s; display: inline-block; }
.recruit-btn-primary:hover { transform: scale(1.04); }
.recruit-btn-ghost { color: white; font-weight: 600; text-decoration: none; opacity: 0.9; }
.recruit-btn-ghost:hover { opacity: 1; }

@media (max-width: 768px) {
  .hero-section { height: auto; min-height: 100svh; max-height: none; }
  .hero-content { padding: 80px 16px 48px; justify-content: flex-end; min-height: 100svh; }
  .hero-stats { gap: 16px; margin-top: 28px; }
  .stat-num { font-size: 18px; }
  .portfolio-mosaic { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 120px; }
  .mosaic-wide, .mosaic-large { grid-column: span 2; }
  .mosaic-tall, .mosaic-large { grid-row: span 2; }
  .category-grid { grid-template-columns: repeat(2, 1fr); }
  .steps-grid { grid-template-columns: 1fr; }
  .spots-grid { grid-template-columns: repeat(2, 1fr); }
  .recruit-card { padding: 32px 24px; }
}
`

v = v.slice(0, styleStart) + newStyles + '\n' + v.slice(styleEnd)

fs.writeFileSync('src/pages/index.vue', v)
console.log('index.vue restored', v.length)
