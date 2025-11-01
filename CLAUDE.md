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
- `images/` - Static assets (logo.png, banner.png, favicon.png)
- `.well-known/nostr.json` - Nostr NIP-05 identifier configuration for user verification
- `worker.js` - Cloudflare Worker for serving NIP-05 with proper CORS headers
- `wrangler.toml` - Cloudflare Worker configuration

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
