import type {Coords} from "./Coords";

abstract class Renderable {
    abstract render(ctx: CanvasRenderingContext2D, wind?: number): void;

    protected lerp(a: number, b: number, t: number): number {
        const result = a + (b - a) * t;
        return Math.abs(result - b) < 1e-4 ? b : result;
    }

    protected randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    protected distance(a: Coords, b: Coords): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    protected lerpElastic(a: number, b: number, t: number): number {
        const s = 1.70158;
        const t1 = t - 1;
        const easedT = t1 * t1 * ((s + 1) * t1 + s) + 1;
        const result = a + (b - a) * easedT;
        return Math.abs(result - b) < 1e-4 ? b : result;
    }
}

export default Renderable
