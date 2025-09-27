# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for "Zenshin Suru" (Always getting better) - an interactive HTML5 canvas-based website featuring:

- **Interactive star field**: Canvas animation with mouse-responsive star particles that grow when hovered
- **Controllable spaceship**: Triangle-shaped player object controlled with arrow keys (thrust/rotate) and spacebar (shoot rainbow stars)
- **Oneko companion**: Animated pixel cat that follows the mouse cursor (exportable standalone version)
- **Static content**: Personal blog posts, PDFs, images, and audio files

## Architecture

### Core Files
- `index.html` - Main page with canvas setup and content overlay
- `script.js` - Main game logic with Player class, Particle class, and animation loop
- `oneko-standalone.js` - Exportable mouse-following cat animation (replaces oneko.js)
- `style.css` - Responsive styling with mobile breakpoints

### Content Structure
- `texts/` - Markdown blog posts and documentation
- `pix/` - Images, icons, and visual assets
- `pdf/` - Document collection
- `mp3/` - Audio files and archives
- `saints/` - Religious imagery with simple HTML index

### Key Classes and Components
- **Player class** (`script.js:9-60`): Handles spaceship movement, rotation, and shooting
- **Particle class** (`script.js:137-214`): Star rendering with mouse interaction and life cycles
- **Animation loop** (`script.js:229-247`): Main render cycle for canvas updates

## Development

### Local Development
This is a static site that can be opened directly in a browser, but serving via HTTP is recommended for proper asset loading.

#### Recommended: Python HTTP Server (Built-in)
```bash
# Start server on port 8000
python3 -m http.server 8000

# Access at: http://localhost:8000
# Stop with: Ctrl+C
```

#### Alternative Options
```bash
# Node.js (if available)
npx serve . -p 8000

# PHP (if available)
php -S localhost:8000

# Direct file access (may have CORS issues)
# Simply open index.html in browser
```

#### Testing the Server
```bash
# Verify server is running
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000
# Should return: 200
```

### File Serving
No build process required. All files are served statically. The site references:
- Google Fonts (Roboto) via CDN
- Local assets (oneko.gif, favicon)

### Controls and Interactions
- **Arrow Up**: Thrust spaceship forward
- **Arrow Left/Right**: Rotate spaceship
- **Spacebar**: Shoot rainbow stars
- **Mouse hover**: Grow nearby stars
- **Mouse click**: Spawn new stars at cursor

## Deployment
Static files ready for any web server. No special configuration needed beyond standard HTML/CSS/JS hosting.

## Oneko Cat - Exportable Component

This site includes a standalone, exportable version of the oneko cat that can be easily added to any website.

### Files for Export
- `oneko-standalone.js` - The main cat module
- `oneko.gif` - Sprite image (32x32 pixel frames)
- `oneko-README.md` - Complete documentation
- `oneko-example.html` - Interactive demo page

### Quick Integration on Other Sites

#### Method 1: Basic Integration
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>My Content</h1>

    <!-- Add these two lines for the cat -->
    <script src="oneko-standalone.js"></script>
    <!-- Cat appears automatically! -->
</body>
</html>
```

#### Method 2: Manual Control
```html
<script src="oneko-standalone.js"></script>
<script>
// Prevent auto-start
window.ONEKO_AUTO_INIT = false;

// Start manually when ready
Oneko.init();

// Later: stop/configure as needed
// Oneko.destroy();
// Oneko.configure({ speed: 0.02 });
</script>
```

#### Method 3: Custom Configuration
```html
<script src="oneko-standalone.js"></script>
<script>
window.ONEKO_AUTO_INIT = false;

Oneko.init({
    speed: 0.015,           // Movement speed
    stoppingDistance: 30,   // Distance from cursor to stop
    idleTimeout: 3000,      // Time before sleep animations
    spriteUrl: '/my-cat.gif', // Custom sprite image
    size: 32,               // Cat size in pixels
    zIndex: 10000           // CSS layer priority
});
</script>
```

### Framework Integration

#### React Component
```jsx
import { useEffect } from 'react';

function MyApp() {
    useEffect(() => {
        // Load oneko script dynamically
        const script = document.createElement('script');
        script.src = '/oneko-standalone.js';
        script.onload = () => {
            window.Oneko?.init();
        };
        document.head.appendChild(script);

        return () => {
            window.Oneko?.destroy();
            document.head.removeChild(script);
        };
    }, []);

    return <div>Your app content</div>;
}
```

#### WordPress/PHP Integration
```php
// Add to your theme's functions.php or footer
function add_oneko_cat() {
    ?>
    <script src="<?php echo get_template_directory_uri(); ?>/oneko-standalone.js"></script>
    <?php
}
add_action('wp_footer', 'add_oneko_cat');
```

### API Methods
- `Oneko.init(options)` - Initialize cat with optional config
- `Oneko.destroy()` - Remove cat and cleanup
- `Oneko.configure(options)` - Update settings after init

### Testing
- Demo page: `oneko-example.html`
- Full documentation: `oneko-README.md`
- Test with: http://localhost:8000/oneko-example.html

### Browser Support
Works in all modern browsers including mobile devices with touch support.