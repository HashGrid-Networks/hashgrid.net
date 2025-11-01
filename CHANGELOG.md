# Changelog

All notable changes to the hashgrid.net website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2025-01-15] - SEO & GEO Optimization Release

### Added
- **SEO Meta Tags**: Comprehensive meta tags including:
  - Enhanced title and description with question-based keywords
  - Open Graph tags for social media sharing (Facebook, LinkedIn)
  - Twitter Card tags with optimized images
  - Geo-targeting meta tags (US region, coordinates)
  - Canonical URL references
  - Theme color for mobile browsers
  - Apple touch icon support

- **Structured Data (JSON-LD)**:
  - Organization schema with social links and contact information
  - VideoObject schema for company presentation video
  - WebSite schema with search action capability
  - Enhanced descriptions with natural language questions

- **GEO (Generative Engine Optimization)**:
  - Question-answer formatted content section optimized for LLM extraction
  - Comprehensive answers to common Bitcoin mining queries:
    - "What is Bitcoin mining?"
    - "How does Bitcoin mining work?"
    - "Best Bitcoin mining companies"
    - "How to mine Bitcoin"
    - FAQs and detailed explanations
  - Hidden semantic content accessible to AI crawlers

- **LLM Optimization Files**:
  - `llm.txt`: Summary file for AI crawlers (GPTBot, Claude, Perplexity, etc.)
  - `llm-all.txt`: Complete guide covering all Bitcoin mining topics

- **SEO Infrastructure Files**:
  - `robots.txt`: Comprehensive crawler directives including:
    - Allow rules for all major search engines
    - Specific AI crawler permissions (GPTBot, ChatGPT-User, Claude-Web, Google-Extended, PerplexityBot)
    - Asset directory permissions
    - Disallow rules for sensitive files
    - Sitemap reference
  
  - `sitemap.xml`: XML sitemap with:
    - Main page entry with priority 1.0
    - Image sitemap entries with SEO-optimized titles and captions
    - Image license metadata
    - LLM optimization file entries
    - Proper change frequency and priority settings

- **Semantic HTML Improvements**:
  - Proper `<header>`, `<main>`, `<footer>` structure
  - Heading hierarchy (H1, H2)
  - Semantic `<section>` elements
  - Navigation with ARIA labels
  - Accessibility attributes (aria-label, aria-hidden)
  - Visually-hidden headings for screen readers

### Changed
- **Asset Organization**:
  - Renamed `images/` directory to `assets/` following web standards
  - Renamed image files with SEO-friendly, keyword-rich names:
    - `banner.png` → `bitcoin-mining-company-hashgrid-networks-banner.png`
    - `logo.png` → `hashgrid-networks-bitcoin-mining-logo.png`
    - `favicon.png` → `hashgrid-networks-favicon.png`

- **Meta Tags**:
  - Title: Changed from "HASHGRID NETWORKS" to "What is Bitcoin Mining 2.0? HashGrid Networks - Best Bitcoin Mining Company 2025"
  - Description: Enhanced with question-based keywords and natural language
  - Keywords: Expanded with search query terms and common questions

- **All Asset References**:
  - Updated all HTML references from `/images/` to `/assets/`
  - Updated Open Graph image paths
  - Updated Twitter Card image paths
  - Updated favicon and Apple touch icon paths
  - Updated JSON-LD structured data image URLs

- **Page Title Structure**:
  - Changed from plain text to proper H1 heading
  - Added semantic structure with proper HTML5 elements

### Optimized
- **robots.txt**:
  - Added specific directives for Googlebot, Googlebot-Image, Bingbot
  - Explicit `/assets/` allowances for all crawlers
  - Crawl-delay directives for AI crawlers
  - Improved disallow patterns using regex

- **sitemap.xml**:
  - Enhanced image metadata with keyword-rich descriptions
  - Added image license information
  - Updated lastmod dates
  - Improved comments for readability

- **Content for Search Engines**:
  - Natural language matching user search queries
  - Answer-style formatting for LLM extraction
  - Contextual relevance signals
  - Topical authority indicators
  - Natural brand integration

### Technical Details
- **Cloudflare Worker**: Successfully deployed to production environment
- **Deployment**: Changes require git commit and push to GitHub Pages for live updates
- **Compatibility**: All optimizations maintain existing visual design and functionality
- **Performance**: No performance impact from SEO/GEO optimizations

### Files Modified
- `index.html`: Complete SEO/GEO overhaul
- `robots.txt`: Created with comprehensive crawler directives
- `sitemap.xml`: Created with image sitemap support
- `llm.txt`: Created for AI crawler summary
- `llm-all.txt`: Created for comprehensive AI crawler content

### Files Added
- `assets/bitcoin-mining-company-hashgrid-networks-banner.png`
- `assets/hashgrid-networks-bitcoin-mining-logo.png`
- `assets/hashgrid-networks-favicon.png`
- `robots.txt`
- `sitemap.xml`
- `llm.txt`
- `llm-all.txt`
- `CHANGELOG.md`

### Files Removed
- `images/banner.png`
- `images/favicon.png`
- `images/logo.png`
- `images/` directory

---

## Maintenance Guidelines

### Before Every Git Commit:
1. **Update CHANGELOG.md** with all changes made
2. **Verify SEO/GEO Optimizations**:
   - Check all meta tags are present and accurate
   - Verify image paths use `/assets/` directory
   - Ensure structured data (JSON-LD) is current
   - Validate robots.txt and sitemap.xml are updated
   - Review LLM optimization files if content changed

3. **Test Changes**:
   - Validate HTML structure
   - Check all asset paths resolve correctly
   - Verify no broken links or references

### SEO/GEO Maintenance Checklist:
- [ ] Meta tags updated (title, description, keywords)
- [ ] Open Graph tags updated
- [ ] Twitter Card tags updated
- [ ] Structured data (JSON-LD) updated
- [ ] Image paths verified (must use `/assets/`)
- [ ] robots.txt updated if new paths added
- [ ] sitemap.xml updated if pages/content changed
- [ ] LLM optimization files updated if content changed
- [ ] CHANGELOG.md updated before commit

---

## Version History

- **2025-01-15**: Initial SEO & GEO optimization release

