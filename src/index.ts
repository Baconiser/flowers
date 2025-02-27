import type { Coords } from "./Coords";
import Daisy from "./flowers/Daisy";
import Blume from "./flowers/DefaultFlower";
import Flower from "./Flower";
import Tulip from "./flowers/Tulip";

// Define the global window interface
declare global {
    interface Window {
        FlowerCanvasRenderer: typeof FlowerCanvasRenderer;
    }
}

interface FlowerCanvasOptions {
    containerId?: string;
    containerElement?: HTMLElement;
    canvasId?: string;
    styles?: Partial<CSSStyleDeclaration>;
}

class FlowerCanvasRenderer {
    private canvasRef: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null = null;
    private mousedown: boolean = false;
    private mouse: Coords = { x: 0, y: 0 };
    private flowers: Flower[] = [];
    private debounce: number | null = null;
    private animationFrameId: number | null = null;
    private flowerClasses = [Daisy, Blume, Tulip];
    private width: number;
    private height: number;
    private containerElement: HTMLElement;

    /**
     * Creates a new FlowerCanvasRenderer
     * @param options Configuration options
     */
    constructor(options: FlowerCanvasOptions = {}) {
        // Find or create container element
        if (options.containerElement) {
            this.containerElement = options.containerElement;
        } else if (options.containerId) {
            const container = document.getElementById(options.containerId);
            if (!container) {
                throw new Error(`Container element with id "${options.containerId}" not found`);
            }
            this.containerElement = container;
        } else {
            // Use body as container if none specified
            this.containerElement = document.body;
        }

        // Create canvas element if it doesn't exist
        if (options.canvasId) {
            const existingCanvas = document.getElementById(options.canvasId) as HTMLCanvasElement;
            if (existingCanvas && existingCanvas.tagName === 'CANVAS') {
                this.canvasRef = existingCanvas;
            } else {
                this.canvasRef = this.createCanvas(options.canvasId, options.styles);
            }
        } else {
            this.canvasRef = this.createCanvas('flowerCanvas', options.styles);
        }

        // Set initial dimensions
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.updateCanvasDimensions();

        // Initialize canvas context
        this.ctx = this.canvasRef.getContext("2d");
        
        // Set up event listeners and start animation
        this.setupEventListeners();
        this.resizeCanvas();
        this.draw();
    }

    /**
     * Creates a canvas element and adds it to the container
     */
    private createCanvas(id: string, styles?: Partial<CSSStyleDeclaration>): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.id = id;
        
        // Apply default styles
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '1';
        canvas.style.pointerEvents = 'none';
        
        // Apply custom styles if provided
        if (styles) {
            Object.assign(canvas.style, styles);
        }
        
        this.containerElement.appendChild(canvas);
        return canvas;
    }

    /**
     * Updates canvas dimensions to match window size
     */
    private updateCanvasDimensions(): void {
        this.canvasRef.width = this.width;
        this.canvasRef.height = this.height;
    }

    /**
     * Sets up event listeners for mouse/touch and window resize
     */
    private setupEventListeners(): void {
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mouseup", this.onMouseUp);
        window.addEventListener("touchmove", this.onMouseMove);
        window.addEventListener("touchstart", this.onMouseDown);
        window.addEventListener("touchend", this.onMouseUp);
        window.addEventListener("resize", this.resize);
    }

    /**
     * Removes all event listeners
     */
    private destroyEventListeners(): void {
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mousedown", this.onMouseDown);
        window.removeEventListener("mouseup", this.onMouseUp);
        window.removeEventListener("touchmove", this.onMouseMove);
        window.removeEventListener("touchstart", this.onMouseDown);
        window.removeEventListener("touchend", this.onMouseUp);
        window.removeEventListener("resize", this.resize);
    }

    /**
     * Handles mouse/touch move events
     */
    private onMouseMove = (e: MouseEvent | TouchEvent): void => {
        if (e instanceof MouseEvent) {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        } else if (e instanceof TouchEvent) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }
    };

    /**
     * Handles mouse/touch down events
     */
    private onMouseDown = (): void => {
        this.mousedown = true;
    };

    /**
     * Handles mouse/touch up events
     */
    private onMouseUp = (): void => {
        this.mousedown = false;
    };

    /**
     * Handles window resize events with debounce
     */
    private resize = (): void => {
        // Update dimensions
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.updateCanvasDimensions();
        
        // Debounce the resize canvas operation
        clearTimeout(this.debounce as number);
        this.debounce = (setTimeout(this.resizeCanvas, 200) as any as number);
    };

    /**
     * Gets the current canvas width
     */
    private getInnerWidth(): number {
        return this.width;
    }

    /**
     * Gets the current canvas height
     */
    private getInnerHeight(): number {
        return this.height;
    }

    /**
     * Resizes the canvas and adjusts the number of flowers
     */
    private resizeCanvas = (): void => {
        const maxFlowersInWidth = this.getInnerWidth() / 30;
        const newFlowerCount = maxFlowersInWidth - this.flowers.length;
        const safeZoneWidth = this.getInnerWidth() * 0.05;

        if (newFlowerCount > 0) {
            const sizePerFlower = (this.getInnerWidth() - safeZoneWidth * 2) / newFlowerCount;
            for (let i = 0; i < newFlowerCount; i++) {
                const x = sizePerFlower * i + Math.random() * sizePerFlower + safeZoneWidth;
                const pos = { x: x, y: this.getInnerHeight() };
                const randomFlower = this.flowerClasses[Math.floor(Math.random() * this.flowerClasses.length)];
                this.flowers.push(new randomFlower(pos, this.mouse));
            }
        } else if (newFlowerCount < 0) {
            for (let i = newFlowerCount; i < 0; i++) {
                if (this.flowers.length > 0) {
                    this.flowers.pop();
                }
            }
        }

        // Update all flowers' positions to match the new canvas height
        for (let i = 0; i < this.flowers.length; i++) {
            const flower = this.flowers[i];
            flower.setPosition(null, this.getInnerHeight());
        }
    };

    /**
     * Animation loop
     */
    private draw = (): void => {
        if (!this.ctx) return;
        this.animationFrameId = requestAnimationFrame(this.draw);

        let windOffset = Math.sin(time) * 5;
        time += 0.01;

        this.ctx.clearRect(0, 0, this.getInnerWidth(), this.getInnerHeight());

        for (let i = 0; i < this.flowers.length; i++) {
            this.flowers[i].render(this.ctx, windOffset);
        }
    };

    /**
     * Stops the animation and cleans up resources
     */
    public stop(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.destroyEventListeners();
    }

    /**
     * Static method to initialize the flower animation
     * @param options Configuration options
     * @returns FlowerCanvasRenderer instance
     */
    public static init(options: FlowerCanvasOptions = {}): FlowerCanvasRenderer {
        return new FlowerCanvasRenderer(options);
    }
}

let time = 0; // Time needs to be outside the class if you want it persistent across instances

// Expose the FlowerCanvasRenderer to the window object
window.FlowerCanvasRenderer = FlowerCanvasRenderer;

export default FlowerCanvasRenderer;
