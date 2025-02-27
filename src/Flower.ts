import Renderable from "./Renderable";
import type {Coords} from "./Coords";

abstract class Flower extends Renderable {
    private mousePos: Coords;
    private position: Coords
    height: number = 40;
    private minMouseDistanceSq: number = 30 * 30;
    private stemWidth: number = 2;
    private maxScale: number = Math.max(0.4, Math.random() * 1.2);
    protected currentScale: number = 0;
    private offset: Coords;
    private wind: number;
    protected petalColor: string = this.randomPastelColor();
    protected readonly randomAngleOffset: number = Math.PI * Math.random();
    private hslColors: number[] = [];

    constructor(position: Coords, mousePos: Coords) {
        super();
        this.mousePos = mousePos;
        this.position = position;
        this.offset = {x: this.position.x, y: this.position.y - this.height};
        this.height = 40;
        this.wind = 0;

        const match = this.petalColor.match(/hsl\(([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)/);
        if(match){
            try {
                const [,h, s, l] = Array.from(match);
                this.hslColors = [Number(h), Number(s), Number(l)];
            }catch(e){
                alert(e);
            }

        }
    }


    protected randomPastelColor(): string {
        const hue = Math.random() * Math.random() * 3600 % 360;
        const saturation = Math.floor(Math.random() * 30) + 50;
        const lightness = Math.floor(Math.random() * 20) + 70;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    setPosition(x?: number|null, y?: number|null) {
        this.position.x = x ?? this.position.x;
        this.position.y = y ?? this.position.y;
    }

    private isInMouseRange(origin: Coords): boolean {
        return this.distance(origin, this.mousePos) < Math.sqrt(this.minMouseDistanceSq);
    }

    isInClickRange(clickPos: Coords): boolean {
        const origin = this.getOrigin();
        return this.distance(clickPos, origin) < Math.sqrt(this.minMouseDistanceSq);
    }

    protected drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, size = 3, color = "orange"): void {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    getStemData() {
        const {x, y} = this.position;
        const end = {x: this.offset.x, y: this.offset.y};
        return {
            end,
            control1: {x: x, y: y - this.height * 0.2},
            control2: end,
        };
    }

    getHeight(): number {
        return this.height * this.currentScale;
    }

    abstract renderFlowerHead(ctx: CanvasRenderingContext2D, wind: number): void;

    getOrigin() {
        return {
            x: this.position.x + this.wind * this.currentScale,
            y: this.position.y - this.getHeight()
        };
    }

    rad(deg: number): number {
        return deg * Math.PI / 180;
    }

    darkenColor(amount: number): string {
        const [h, s, l] = this.hslColors;
        return `hsl(${h}, ${s}%, ${(l + amount) % 100}%)`;
    }

    // Accept an optional wind offset for gentle sway
    render(ctx: CanvasRenderingContext2D, wind = 0): void {
        this.wind = wind;
        // Shift the target x position with wind
        const origin = this.getOrigin();
        // Smoothly interpolate offset and scale
        this.offset.x = this.lerp(this.offset.x, origin.x, 0.1);
        this.offset.y = this.lerp(this.offset.y, origin.y, 0.1);

        if (this.isInMouseRange(origin)) {
            //this.drawPoint(ctx, this.mousePos.x, this.mousePos.y);
            this.offset.x = this.lerp(this.offset.x, this.mousePos.x + this.wind, 0.1);
            this.offset.y = this.lerp(this.offset.y, this.mousePos.y, 0.1);
        }
        if (this.currentScale <= this.maxScale) {
            this.currentScale = this.lerp(this.currentScale, this.maxScale, 0.04);
        }
        const stemData = this.getStemData();

        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.bezierCurveTo(
            stemData.control1.x, stemData.control1.y,
            stemData.control2.x, stemData.control2.y,
            stemData.end.x, stemData.end.y
        );
        ctx.strokeStyle = "green";
        ctx.lineWidth = this.stemWidth;
        ctx.stroke();

        this.renderFlowerHead(ctx, wind);
    }
}

export default Flower
