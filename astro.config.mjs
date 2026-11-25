// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';

const SITE = 'https://paversofpalmbeach.com';

// Sitemap lastmod for blog posts only: the date of the last commit to the post source.
// Google uses lastmod only when it is accurate, so no build-time dates and nothing for
// template-driven pages. Without git history (a git archive build) there is no lastmod,
// so previews must be built from a clone and CI must check out full history.
function blogLastmod() {
  const dir = 'src/content/blog';
  const map = new Map();
  for (const file of readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const slug = readFileSync(`${dir}/${file}`, 'utf8').match(/^slug:\s*"?([^"\n]+?)"?\s*$/m)?.[1];
    if (!slug) continue;
    let log;
    try {
      log = execFileSync('git', ['log', '-1', '--format=%cI', '--', `${dir}/${file}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {
      return new Map();
    }
    if (log) map.set(`${SITE}/blog/${slug}/`, log);
  }
  return map;
}
const lastmod = blogLastmod();

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  // Keep the post-form thank-you page out of the sitemap (it has no inbound links → orphan)
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you'),
      serialize: (item) => (lastmod.has(item.url) ? { ...item, lastmod: lastmod.get(item.url) } : item),
    }),
  ],
  // Inline page CSS so there's no render-blocking stylesheet request (big win for mobile FCP/LCP)
  build: { inlineStylesheets: 'always' },
});
