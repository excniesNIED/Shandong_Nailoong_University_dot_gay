/**
 * Build-time prerender.
 *
 * Renders every route to static HTML so crawlers (Baidu in particular) get
 * real content instead of an empty SPA shell. Run after `vite build`:
 *
 *   node scripts/prerender.mjs
 *
 * Output (in dist/):
 *   index.html      /          the homepage
 *   about.html      /about
 *   nailoog.html    /nailoog
 *   78.html         /78        terminal easter egg
 *   404.html        unknown paths, served with a 404 status
 *   sitemap.xml     rebuilt with a fresh lastmod
 *
 * Pages are emitted as `<name>.html`: Cloudflare Pages serves those at the
 * extension-less URL (/about) and redirects /about.html → /about, so the
 * canonical URLs stay clean.
 */
import { createServer } from "vite"
import { createElement } from "react"
import { renderToString } from "react-dom/server"
import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const DIST = path.join(ROOT, "dist")
const ORIGIN = "https://xn--xhq02y0gz4ebvbj98t.gay"

/**
 * The homepage is prerendered into dist/index.html, so the pristine build
 * output is cached: a rerun without a fresh `vite build` still has a template.
 */
const TEMPLATE_CACHE = path.join(ROOT, ".tanstack", "prerender-template.html")

async function readTemplate() {
  const built = path.join(DIST, "index.html")
  const [builtStat, cacheStat] = await Promise.all([
    stat(built).catch(() => null),
    stat(TEMPLATE_CACHE).catch(() => null),
  ])
  if (cacheStat && builtStat && builtStat.mtimeMs <= cacheStat.mtimeMs) {
    return readFile(TEMPLATE_CACHE, "utf8")
  }
  const template = await readFile(built, "utf8")
  await mkdir(path.dirname(TEMPLATE_CACHE), { recursive: true })
  await writeFile(TEMPLATE_CACHE, template, "utf8")
  return template
}

/** Route → output file + sitemap priority. */
const PAGES = [
  { path: "/", out: "index.html", priority: "1.0" },
  { path: "/about", out: "about.html", priority: "0.8" },
  { path: "/nailoog", out: "nailoog.html", priority: "0.8" },
  { path: "/78", out: "78.html", priority: "0.5" },
]

/** Path used to render the root not-found view for 404.html. */
const NOT_FOUND_PATH = "/404-preview"

const today = new Date().toISOString().slice(0, 10)

/** Replace a `<meta name=... content=...>` / `<meta property=... content=...>` tag. */
function setMeta(html, key, content, attr = "name") {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`)
  if (!pattern.test(html)) throw new Error(`meta ${attr}="${key}" not found in template`)
  const value = content.replace(/"/g, "&quot;")
  return html.replace(pattern, `<meta ${attr}="${key}" content="${value}" />`)
}

/** Insert a tag right before </head>. */
function insertBeforeHead(html, tag) {
  if (!html.includes("</head>")) throw new Error("template has no </head>")
  return html.replace("</head>", `  ${tag}\n</head>`)
}

/** Swap the prerendered body into the SPA shell. */
function setBody(html, body) {
  const marker = '<div id="root"></div>'
  if (!html.includes(marker)) throw new Error("template has no empty #root container")
  return html.replace(marker, `<div id="root">${body}</div>`)
}

/**
 * React emits the image preload it generates inline in the server markup,
 * while the browser-side React puts the same link in <head>. Left inline the
 * two trees differ and hydration fails, so the links move to the head.
 */
function splitPreloads(body) {
  const links = [...body.matchAll(/<link rel="preload"[^>]*\/>/g)].map((match) => match[0])
  return { body: body.replace(/<link rel="preload"[^>]*\/>/g, ""), links }
}

function setTitle(html, title) {
  if (!/<title>[\s\S]*?<\/title>/.test(html)) throw new Error("template has no <title>")
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
}

const escapeXml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

async function main() {
  const template = await readTemplate()

  // Load the app the same way the browser does: Vite resolves the "@/" alias
  // and compiles the TSX, so the prerendered markup matches the client build.
  const server = await createServer({
    configFile: path.join(ROOT, "vite.config.ts"),
    appType: "custom",
    logLevel: "warn",
    server: { middlewareMode: true, hmr: false, watch: null },
  })

  try {
    const { createRouter, RouterProvider, createMemoryHistory } = await import(
      "@tanstack/react-router"
    )
    const { routeTree } = await server.ssrLoadModule("/src/routeTree.gen.ts")

    /** Render one path and collect the meta its route declares. */
    async function render(pathname) {
      const router = createRouter({
        routeTree,
        history: createMemoryHistory({ initialEntries: [pathname] }),
        defaultPreload: false,
        defaultViewTransition: false,
      })
      await router.load()
      const body = renderToString(createElement(RouterProvider, { router }))
      const meta = router.state.matches.flatMap((match) => match.meta ?? [])
      return { body, meta }
    }

    const pick = (meta, key) => meta.find((entry) => entry.name === key)?.content

    for (const page of PAGES) {
      const { body: rawBody, meta } = await render(page.path)
      const { body, links } = splitPreloads(rawBody)
      const title = meta.find((entry) => "title" in entry)?.title
      const description = pick(meta, "description")

      let html = template
      if (title) html = setTitle(html, title)
      if (description) {
        html = setMeta(html, "description", description)
        html = setMeta(html, "og:description", description, "property")
        html = setMeta(html, "twitter:description", description)
      }
      if (title) {
        html = setMeta(html, "og:title", title, "property")
        html = setMeta(html, "twitter:title", title)
      }
      html = insertBeforeHead(html, `<link rel="canonical" href="${ORIGIN}${page.path}" />`)
      html = setMeta(html, "og:url", `${ORIGIN}${page.path}`, "property")
      if (links.length) html = insertBeforeHead(html, links.join(" "))
      html = setBody(html, body)

      await writeFile(path.join(DIST, page.out), html, "utf8")
      console.log(`prerendered ${page.path} → dist/${page.out} (${body.length} bytes of markup)`)
    }

    // 404 page: the root not-found view, marked noindex.
    {
      const { body: rawBody } = await render(NOT_FOUND_PATH)
      const { body, links } = splitPreloads(rawBody)
      let html = template
      html = setTitle(html, "404 页面不存在 · 山东奶龙大学")
      html = setMeta(html, "description", "这个页面不存在，可能去长清湖校区上课了。")
      html = setMeta(html, "robots", "noindex, follow")
      if (links.length) html = insertBeforeHead(html, links.join(" "))
      html = setBody(html, body)
      await writeFile(path.join(DIST, "404.html"), html, "utf8")
      console.log(`prerendered 404 → dist/404.html (${body.length} bytes of markup)`)
    }

    // Sitemap: rebuilt on every build so lastmod stays truthful.
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
  (page) => `  <url>
    <loc>${escapeXml(`${ORIGIN}${page.path}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
).join("\n")}
</urlset>
`
    await writeFile(path.join(DIST, "sitemap.xml"), sitemap, "utf8")
    console.log(`wrote dist/sitemap.xml (${PAGES.length} urls, lastmod ${today})`)
  } finally {
    await server.close()
  }
}

await main()
