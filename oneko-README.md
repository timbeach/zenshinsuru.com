# Oneko.js - Standalone Edition

A cute pixel cat that follows your mouse cursor around the webpage. This is a standalone, easily exportable version that can be dropped into any website.

## Features

- 🐱 Animated pixel cat that follows your mouse
- 🎮 Multiple movement directions with unique animations
- 😴 Idle behavior: licking, yawning, and sleeping
- 📱 Mobile-friendly (follows touch on mobile devices)
- ⚙️ Configurable options
- 🔧 Easy integration - just include and call `Oneko.init()`
- 🗑️ Clean removal with `Oneko.destroy()`

## Quick Start

### 1. Basic Usage
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website with Oneko</title>
</head>
<body>
    <h1>Hello World!</h1>

    <!-- Include the oneko script -->
    <script src="oneko-standalone.js"></script>

    <!-- The cat will automatically appear! -->
</body>
</html>
```

### 2. Manual Initialization
```html
<script src="oneko-standalone.js"></script>
<script>
// Prevent auto-initialization
window.ONEKO_AUTO_INIT = false;

// Initialize manually when you want
Oneko.init();
</script>
```

### 3. Custom Configuration
```javascript
Oneko.init({
    speed: 0.015,           // Movement speed (default: 0.01)
    stoppingDistance: 30,   // How close to cursor to stop (default: 50)
    idleTimeout: 3000,      // Time before idle behavior (default: 5000ms)
    spriteUrl: '/my-cat.gif', // Custom sprite image (default: '/oneko.gif')
    size: 32,               // Cat size in pixels (default: 32)
    zIndex: 10000           // CSS z-index (default: 9999)
});
```

## Sprite Image

You need the `oneko.gif` sprite sheet for the cat animations. You can:

1. **Use the included sprite**: Copy `oneko.gif` from this repository
2. **Custom sprite**: Create your own 32x32 pixel sprite sheet following the same layout
3. **CDN option**: Host the sprite online and reference the URL

### Sprite Layout
The sprite sheet should be a grid of 32x32 pixel frames arranged as:
- Movement directions: up, down, left, right, diagonals
- Idle animations: sitting, licking, yawning, sleeping

## API Reference

### `Oneko.init(options)`
Initialize the cat with optional configuration.

**Parameters:**
- `options` (Object, optional): Configuration object

**Returns:** Oneko instance

### `Oneko.destroy()`
Remove the cat and clean up all event listeners.

**Returns:** Oneko instance

### `Oneko.configure(options)`
Update configuration after initialization.

**Parameters:**
- `options` (Object): New configuration options

**Returns:** Oneko instance

## Advanced Usage

### Conditional Loading
```javascript
// Only show cat on desktop
if (window.innerWidth > 768) {
    Oneko.init();
}
```

### Multiple Cats
```javascript
// Note: Currently supports one cat per page
// For multiple cats, you'd need separate instances
```

### Integration with Frameworks

#### React
```jsx
import { useEffect } from 'react';

function App() {
    useEffect(() => {
        // Assuming oneko-standalone.js is loaded
        window.Oneko?.init();

        return () => {
            window.Oneko?.destroy();
        };
    }, []);

    return <div>Your app content</div>;
}
```

#### Vue.js
```vue
<template>
    <div>Your app content</div>
</template>

<script>
export default {
    mounted() {
        if (window.Oneko) {
            window.Oneko.init();
        }
    },
    beforeDestroy() {
        if (window.Oneko) {
            window.Oneko.destroy();
        }
    }
}
</script>
```

## Customization

### Custom Sprite
Create a 32x32 pixel sprite sheet with the same frame layout as `oneko.gif`. Then:

```javascript
Oneko.init({
    spriteUrl: '/path/to/your-custom-sprite.gif'
});
```

### Performance Considerations
- The cat uses `requestAnimationFrame` for smooth animations
- Automatically pauses/resumes based on mouse activity
- Minimal CPU usage when idle

## Browser Support

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## File Structure for Export

When sharing this with others, include:
```
oneko-package/
├── oneko-standalone.js    # Main script
├── oneko.gif             # Sprite image
├── oneko-README.md       # This documentation
└── example.html          # Usage example
```

## License

This is a fun, educational project. Feel free to use, modify, and share!

## Troubleshooting

**Cat doesn't appear:**
- Check that `oneko.gif` exists and is accessible
- Verify console for any JavaScript errors
- Ensure the script loads after the DOM

**Cat is jumpy or slow:**
- Adjust the `speed` parameter
- Check for CSS that might interfere with `position: fixed`

**Cat disappears on mobile:**
- The cat follows touch events on mobile devices
- Ensure viewport meta tag is set properly