# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built as a static site using pure HTML, CSS, and JavaScript. No build tools or frameworks are required.

## Development Setup

No dependencies or build steps required. Simply open `index.html` in a browser to view the site.

For local development with live reload, you can use:
```bash
# Python 3
python -m http.server 8000

# Node.js (if http-server is installed)
npx http-server -p 8000
```

Then visit `http://localhost:8000`

## Architecture

### Tech Stack
- Pure HTML5 for structure
- CSS3 for styling
- Vanilla JavaScript for interactivity
- No frameworks, no build process

### File Structure
```
homepage/
├── index.html          # Main entry point
├── css/               # Stylesheets
├── js/                # JavaScript files
├── assets/            # Images, fonts, etc.
└── CLAUDE.md          # This file
```

## Development Guidelines

- Keep code simple and maintainable
- Use semantic HTML5 elements
- Ensure responsive design (mobile-first approach)
- Optimize assets for web (compress images, minify if needed for production)
- Test across different browsers
- Follow accessibility best practices (WCAG guidelines)

## Deployment

As a static site, this can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Simply upload all files to the hosting service.
