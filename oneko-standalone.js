/**
 * Oneko.js - A cute cat that follows your mouse cursor
 * Standalone version for easy integration into any website
 *
 * Usage:
 * 1. Include this script in your HTML
 * 2. Call Oneko.init() to start the cat
 * 3. Optionally configure with Oneko.init({options})
 *
 * Example:
 * <script src="oneko-standalone.js"></script>
 * <script>Oneko.init();</script>
 */

(function(global) {
    'use strict';

    const Oneko = {
        // Default configuration
        config: {
            speed: 0.01,
            stoppingDistance: 50,
            idleTimeout: 5000,
            spriteUrl: '/oneko.gif', // Path to sprite image
            size: 32,
            zIndex: 9999
        },

        // Internal state
        state: {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            animationFrame: 0,
            lastFrameTime: 0,
            lastMouseMoveTime: 0,
            isIdle: false,
            lickCount: 0,
            isYawning: false,
            element: null,
            animationId: null
        },

        // Sprite frame definitions
        frames: {
            up: [{ x: -32, y: -64 }, { x: -32, y: -96 }],
            left: [{ x: -192, y: -32 }, { x: -128, y: -64 }, { x: -128, y: -96 }],
            right: [{ x: -96, y: 0 }, { x: -96, y: -32 }, { x: -160, y: -64 }],
            down: [{ x: -224, y: -64 }, { x: -192, y: -96 }],
            upLeft: [{ x: -32, y: 0 }, { x: -32, y: -32 }],
            upRight: [{ x: 0, y: -64 }, { x: 0, y: -96 }],
            downLeft: [{ x: -160, y: -96 }, { x: -192, y: -32 }],
            downRight: [{ x: -160, y: -32 }, { x: -96, y: -32 }],
            lick: [{ x: -224, y: 0 }, { x: -96, y: -96 }],
            yawn: [{ x: -96, y: -64 }],
            sleep: [{ x: -64, y: 0 }, { x: -64, y: -32 }],
            sit: [{ x: -96, y: -96 }]
        },

        /**
         * Initialize the oneko cat
         * @param {Object} options - Configuration options
         */
        init: function(options = {}) {
            // Merge options with defaults
            this.config = { ...this.config, ...options };

            // Initialize position
            this.state.x = global.innerWidth / 2;
            this.state.y = global.innerHeight / 2;
            this.state.targetX = this.state.x;
            this.state.targetY = this.state.y;
            this.state.lastMouseMoveTime = Date.now();

            // Create the cat element
            this.createElement();

            // Start mouse tracking
            this.bindEvents();

            // Start animation loop
            this.startAnimation();

            return this;
        },

        /**
         * Create and style the cat DOM element
         */
        createElement: function() {
            // Remove existing element if any
            if (this.state.element) {
                this.state.element.remove();
            }

            this.state.element = global.document.createElement('div');
            this.state.element.id = 'oneko-cat';
            this.state.element.setAttribute('aria-hidden', 'true');

            // Set styles
            Object.assign(this.state.element.style, {
                width: this.config.size + 'px',
                height: this.config.size + 'px',
                position: 'fixed',
                pointerEvents: 'none',
                backgroundImage: `url('${this.config.spriteUrl}')`,
                imageRendering: 'pixelated',
                backgroundPosition: '-96px -96px', // Default sitting position
                backgroundRepeat: 'no-repeat',
                zIndex: this.config.zIndex,
                transform: `translate(${this.state.x - 16}px, ${this.state.y - 16}px)`
            });

            global.document.body.appendChild(this.state.element);
        },

        /**
         * Bind mouse events
         */
        bindEvents: function() {
            this.mouseMoveHandler = (event) => {
                this.state.targetX = event.pageX;
                this.state.targetY = event.pageY;
                this.state.lastMouseMoveTime = Date.now();
                this.state.isIdle = false;
            };

            global.document.addEventListener('mousemove', this.mouseMoveHandler);
        },

        /**
         * Determine movement direction based on deltas
         */
        getDirection: function(deltaX, deltaY) {
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (absX > absY) {
                return deltaX > 0 ? "right" : "left";
            } else if (absY > absX) {
                return deltaY > 0 ? "down" : "up";
            } else {
                // Diagonal directions
                if (deltaX < 0 && deltaY < 0) return "upLeft";
                if (deltaX > 0 && deltaY < 0) return "upRight";
                if (deltaX < 0 && deltaY > 0) return "downLeft";
                if (deltaX > 0 && deltaY > 0) return "downRight";
            }
            return "down";
        },

        /**
         * Update cat position and animation
         */
        updatePosition: function(timestamp) {
            const deltaX = this.state.targetX - this.state.x;
            const deltaY = this.state.targetY - this.state.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Check if cat should be idle
            const currentTime = Date.now();
            if (currentTime - this.state.lastMouseMoveTime > this.config.idleTimeout) {
                this.state.isIdle = true;
            } else {
                this.state.isIdle = false;
                this.state.lickCount = 0;
                this.state.isYawning = false;
            }

            if (!this.state.isIdle && distance > this.config.stoppingDistance) {
                // Cat is moving
                const moveX = (deltaX / distance) * this.config.speed * distance;
                const moveY = (deltaY / distance) * this.config.speed * distance;

                this.state.x += moveX;
                this.state.y += moveY;

                this.state.element.style.transform = `translate(${this.state.x - 16}px, ${this.state.y - 16}px)`;

                const direction = this.getDirection(deltaX, deltaY);
                this.animateMovement(timestamp, direction);

            } else if (this.state.isIdle) {
                this.animateIdle(timestamp);
            } else {
                // Cat stops near cursor
                this.state.element.style.transform = `translate(${this.state.x - 16}px, ${this.state.y - 16}px)`;
                this.setFrame(this.frames.sit[0]);
            }

            this.state.animationId = requestAnimationFrame((ts) => this.updatePosition(ts));
        },

        /**
         * Animate movement in given direction
         */
        animateMovement: function(timestamp, direction) {
            if (timestamp - this.state.lastFrameTime > 150) {
                const frameSet = this.frames[direction];
                this.state.animationFrame = (this.state.animationFrame + 1) % frameSet.length;
                this.setFrame(frameSet[this.state.animationFrame]);
                this.state.lastFrameTime = timestamp;
            }
        },

        /**
         * Animate idle behavior (lick, yawn, sleep)
         */
        animateIdle: function(timestamp) {
            if (this.state.lickCount < 3) {
                // Licking phase
                if (timestamp - this.state.lastFrameTime > 500) {
                    const frames = this.frames.lick;
                    this.state.animationFrame = (this.state.animationFrame + 1) % frames.length;
                    this.setFrame(frames[this.state.animationFrame]);
                    this.state.lastFrameTime = timestamp;
                    if (this.state.animationFrame === 0) this.state.lickCount++;
                }
            } else if (!this.state.isYawning) {
                // Yawning phase
                if (timestamp - this.state.lastFrameTime > 1000) {
                    this.setFrame(this.frames.yawn[0]);
                    this.state.lastFrameTime = timestamp;
                    this.state.isYawning = true;
                }
            } else {
                // Sleeping phase
                if (timestamp - this.state.lastFrameTime > 700) {
                    const frames = this.frames.sleep;
                    this.state.animationFrame = (this.state.animationFrame + 1) % frames.length;
                    this.setFrame(frames[this.state.animationFrame]);
                    this.state.lastFrameTime = timestamp;
                }
            }
        },

        /**
         * Set sprite frame position
         */
        setFrame: function(frame) {
            if (this.state.element) {
                this.state.element.style.backgroundPosition = `${frame.x}px ${frame.y}px`;
            }
        },

        /**
         * Start the animation loop
         */
        startAnimation: function() {
            if (this.state.animationId) {
                cancelAnimationFrame(this.state.animationId);
            }
            this.state.animationId = requestAnimationFrame((ts) => this.updatePosition(ts));
        },

        /**
         * Stop the cat and remove it
         */
        destroy: function() {
            // Cancel animation
            if (this.state.animationId) {
                cancelAnimationFrame(this.state.animationId);
                this.state.animationId = null;
            }

            // Remove event listeners
            if (this.mouseMoveHandler) {
                global.document.removeEventListener('mousemove', this.mouseMoveHandler);
            }

            // Remove DOM element
            if (this.state.element) {
                this.state.element.remove();
                this.state.element = null;
            }

            return this;
        },

        /**
         * Update configuration
         */
        configure: function(options) {
            this.config = { ...this.config, ...options };
            if (this.state.element && options.spriteUrl) {
                this.state.element.style.backgroundImage = `url('${this.config.spriteUrl}')`;
            }
            return this;
        }
    };

    // Auto-initialize if DOM is ready
    if (global.document.readyState === 'loading') {
        global.document.addEventListener('DOMContentLoaded', () => {
            if (global.ONEKO_AUTO_INIT !== false) {
                Oneko.init();
            }
        });
    } else if (global.ONEKO_AUTO_INIT !== false) {
        Oneko.init();
    }

    // Export to global scope
    global.Oneko = Oneko;

    // CommonJS/Node.js support
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Oneko;
    }

    // AMD/RequireJS support
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return Oneko;
        });
    }

})(typeof window !== 'undefined' ? window : this);