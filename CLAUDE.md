# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for HashGrid Networks (hashgrid.net) - a Bitcoin mining focused company. The site is a single-page application built with vanilla HTML, CSS, and JavaScript featuring:
- Matrix-style animated background (canvas-based)
- Interactive mouse/touch cursor effects
- Embedded video presentation
- Social media links (GitHub, Nostr, BlueSky, X, YouTube)
- Google Analytics tracking

## Architecture

**Static Site Structure:**
- `index.html` - Single-page application containing all HTML, CSS, and JavaScript inline
- `assets/` - Static assets with SEO-optimized filenames (renamed from `images/`)
- `.well-known/nostr.json` - Nostr NIP-05 identifier configuration for user verification
- `worker.js` - Cloudflare Worker for serving NIP-05 with proper CORS headers
- `wrangler.toml` - Cloudflare Worker configuration
- `robots.txt` - Search engine crawler directives
- `sitemap.xml` - XML sitemap for search engines
- `llm.txt` - Summary file for AI crawlers
- `llm-all.txt` - Comprehensive guide for AI crawlers
- `CHANGELOG.md` - Change tracking and maintenance log

**Key Technical Components:**

1. **Matrix Animation (index.html:368-615)**
   - Canvas-based animation with 60 FPS target
   - Performance optimized for Safari with `imageSmoothingEnabled: false`
   - Adaptive frame rate limiting using `requestAnimationFrame`
   - Character set includes binary, katakana, and alphanumeric characters
   - Mouse/touch tracking with particle trail effects
   - Visibility API integration to pause animation when page is hidden

2. **Responsive Design**
   - Mobile-first breakpoint at 768px (index.html:260-308)
   - Touch event handling with `preventDefault` for iOS optimization
   - Overscroll behavior disabled to prevent iOS bounce scrolling
   - Cursor hidden on desktop (Matrix aesthetic), shown on mobile

3. **Social Media Integration**
   - GitHub: https://github.com/HashGrid-Networks
   - Nostr: Yakihonne profile with NIP-05 verification via `.well-known/nostr.json`
   - BlueSky: hashgridnet.bsky.social
   - X (Twitter): @hashgridnet
   - YouTube: https://www.youtube.com/channel/UCQxX-_FZ8NUIFK1MdSse2AQ

4. **Analytics**
   - Google Analytics 4 tracking (G-8D2LWJRBF6) loaded via gtag.js

5. **Cloudflare Worker (worker.js)**
   - Intercepts `/.well-known/nostr.json` requests to add proper CORS headers
   - Required for NIP-05 compliance: `Access-Control-Allow-Origin: *`
   - Supports optional `?name=` query parameter per NIP-05 spec
   - Proxies all other requests to origin (GitHub Pages)
   - NO redirects on NIP-05 endpoint (critical requirement)

## Development

Since this is a static HTML site with no build process:

**Local Development:**
```bash
# Serve locally using Python
python3 -m http.server 8000

# Or using Node.js
npx http-server
```

**Deployment:**

Static Site:
- Hosted via GitHub Pages or similar
- Simply commit changes to deploy

Cloudflare Worker:
```bash
# Deploy worker for NIP-05 CORS support
wrangler deploy

# Test locally
wrangler dev
```

See `CLOUDFLARE_WORKER_SETUP.md` for detailed deployment instructions.

**Testing:**
- Test on multiple browsers, especially Safari (optimizations are Safari-specific)
- Test on mobile devices (iOS and Android) for touch interactions
- Verify canvas performance on lower-end devices
- Test NIP-05 verification:
  ```bash
  # Check CORS headers are present
  curl -I https://hashgrid.net/.well-known/nostr.json

  # Test with name parameter
  curl "https://hashgrid.net/.well-known/nostr.json?name=elvis"

  # Verify in Nostr clients (Damus, Amethyst, Primal, etc.)
  ```

## Code Style

**HTML/CSS:**
- All styles are inline in `<style>` tag (no external CSS)
- Uses CSS custom animations (glow, pulse, bitcoinGlow)
- Matrix green theme: `#00ff41` (primary), `#66ff66` (secondary)
- Bitcoin orange accent: `#ff6600`
- Orbitron font family from Google Fonts

**JavaScript:**
- Vanilla JavaScript (no frameworks/libraries)
- Performance-optimized canvas rendering with pre-calculated values
- Object-oriented approach for CursorDrop class
- Event listeners handle both mouse and touch events

## Important Considerations

**Performance:**
- Canvas rendering is optimized with character caching, reduced alpha compositing, and frame rate limiting
- Safari-specific optimizations are critical (webkit prefixes, transform optimizations)
- Visibility API used to pause animation when tab is inactive

**Mobile:**
- Touch events use `{ passive: false }` to allow `preventDefault()`
- Trail clearing behavior differs between mouse and touch for better UX
- Font sizes and spacing reduce significantly on mobile breakpoint

**External Dependencies:**
- Google Fonts (Orbitron)
- Google Analytics (gtag.js)
- Video hosted on Yakihonne S3 (external source)

## Nostr Configuration (NIP-05)

The `.well-known/nostr.json` file provides NIP-05 verification for Nostr protocol:
- `ryno@hashgrid.net` → hex pubkey d045ca13f6d04805378620fdc8c2af081416eee711a1c5defff276e49e9d0a2b
- `elvis@hashgrid.net` → hex pubkey 82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2

**Critical NIP-05 Requirements:**
1. Must be served with `Access-Control-Allow-Origin: *` (handled by Cloudflare Worker)
2. Must use `Content-Type: application/json`
3. NO HTTP redirects allowed
4. Public keys must be in hex format (not npub)

**Adding New Identifiers:**
Update `NOSTR_IDENTIFIERS` object in `worker.js` and redeploy:
```javascript
const NOSTR_IDENTIFIERS = {
  "names": {
    "username": "hex-pubkey-here"
  }
};
```

**Why Cloudflare Worker:**
GitHub Pages and most static hosts don't allow fine-grained control over CORS headers, which are mandatory for NIP-05 verification in browser-based Nostr clients. The worker intercepts only `/.well-known/nostr.json` requests and proxies everything else.

## SEO & GEO/LLM Optimization Requirements

**CRITICAL: Always update SEO and GEO optimizations when making changes to the site.**

### Before Every Git Commit - MANDATORY Steps:

1. **Update CHANGELOG.md First**
   - Document ALL changes in the changelog
   - Use proper format: Added, Changed, Removed, Fixed, etc.
   - Include date and descriptive entries
   - Reference this in your commit message

2. **Verify SEO Optimization** (if content/structure changed):
   - [ ] Update `<title>` tag if page purpose changed
   - [ ] Update `<meta name="description">` if content changed
   - [ ] Update `<meta name="keywords">` if topics changed
   - [ ] Update Open Graph tags (`og:title`, `og:description`, `og:image`)
   - [ ] Update Twitter Card tags (`twitter:title`, `twitter:description`, `twitter:image`)
   - [ ] Update JSON-LD structured data (Organization, VideoObject, WebSite schemas)
   - [ ] Verify all image paths use `/assets/` directory (never `/images/`)
   - [ ] Ensure image filenames are SEO-friendly (lowercase, hyphens, descriptive)

3. **Update GEO/LLM Optimization** (if content changed):
   - [ ] Update hidden `.geo-content` section in `index.html` if topics change
   - [ ] Update `llm.txt` if summary information changes
   - [ ] Update `llm-all.txt` if comprehensive guide content changes
   - [ ] Ensure question-answer format is maintained
   - [ ] Verify natural language matches user search queries

4. **Update Sitemap & Robots** (if paths/content changed):
   - [ ] Update `sitemap.xml` if new pages or images added
   - [ ] Update `sitemap.xml` `lastmod` dates if content updated
   - [ ] Update `robots.txt` if new paths need to be allowed/disallowed
   - [ ] Verify sitemap includes all image assets with proper metadata

5. **Asset Management**:
   - [ ] ALL images must be in `/assets/` directory (not `/images/`)
   - [ ] Image filenames must be SEO-friendly:
     - Lowercase letters only
     - Hyphens for word separation (not underscores)
     - Descriptive, keyword-rich names
     - Example: `bitcoin-mining-company-hashgrid-networks-banner.png`
   - [ ] All HTML references must use `/assets/` path

### SEO Optimization Checklist:

When modifying `index.html`, always check:
- Meta tags are current and accurate
- Structured data (JSON-LD) reflects current content
- Image references use `/assets/` directory
- Open Graph and Twitter Card tags are updated
- Canonical URL is correct
- Heading hierarchy is proper (H1, H2, etc.)
- Semantic HTML structure is maintained

### GEO/LLM Optimization Checklist:

When content changes:
- Hidden `.geo-content` section answers relevant questions
- Natural language matches how users search
- LLM files (`llm.txt`, `llm-all.txt`) are current
- Question-answer format is maintained
- Brand is naturally integrated into answers

### Maintenance Workflow:

```
1. Make code/content changes
2. Update SEO meta tags if needed
3. Update GEO/LLM content if needed
4. Update robots.txt/sitemap.xml if needed
5. **Update CHANGELOG.md** (REQUIRED before commit)
6. Verify all asset paths use `/assets/`
7. Test locally if possible
8. Commit with reference to changelog
```

### File Naming Conventions:

**Images/Assets:**
- Directory: `/assets/` (always, never `/images/`)
- Format: `descriptive-keyword-rich-name.png`
- Use lowercase, hyphens, descriptive terms
- Examples:
  - ✅ `hashgrid-networks-bitcoin-mining-logo.png`
  - ✅ `bitcoin-mining-company-hashgrid-networks-banner.png`
  - ❌ `logo.png`
  - ❌ `banner.PNG`
  - ❌ `hashgrid_networks_logo.png`

### SEO Best Practices Enforced:

1. **Meta Tags**: Always include title, description, Open Graph, Twitter Cards
2. **Structured Data**: JSON-LD schemas for Organization, WebSite, VideoObject
3. **Asset Optimization**: SEO-friendly filenames, proper alt text, image sitemaps
4. **Semantic HTML**: Proper heading hierarchy, semantic elements, ARIA labels
5. **Content Discovery**: robots.txt and sitemap.xml must be current

### GEO Best Practices Enforced:

1. **Question-Based Content**: Content answers "What is...", "How does...", etc.
2. **Natural Language**: Matches how users ask questions
3. **Answer Format**: Structured for easy LLM extraction
4. **LLM Files**: `llm.txt` and `llm-all.txt` must be current
5. **Hidden Content**: `.geo-content` section accessible to crawlers but visually hidden

**REMEMBER**: The changelog MUST be updated before every commit. This is a non-negotiable requirement for maintaining project documentation and SEO/GEO optimization tracking.
