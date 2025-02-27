import Flower from "../Flower";
import type {Coords} from "../Coords";

class Daisy extends Flower {
    private readonly discSize: number;
    private readonly petalCount: number;
    private readonly petalAngle: number;


    constructor(position: Coords, mousePos: Coords) {
        super(position, mousePos);
        this.discSize = 8;
        this.petalCount = this.randomInt(8, 12);
        this.petalAngle = (Math.PI * 2) / this.petalCount;
    }

    renderPetals(ctx: CanvasRenderingContext2D, center: Coords) {
        const radius = this.discSize * 2.5;
        const size = radius * this.currentScale;
        const roundness = radius * 0.4 * this.currentScale;
        for (let i = 0; i < this.petalCount; i++) {
            const angle = i * this.petalAngle + this.randomAngleOffset;

            const end = {x: center.x + Math.cos(angle) * size, y: center.y + Math.sin(angle) * size};
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.strokeStyle = this.petalColor;
            ctx.lineWidth = roundness;

            ctx.lineTo(end.x, end.y);
            ctx.closePath();
            ctx.stroke();
            this.drawPoint(ctx, end.x, end.y, roundness * 0.5, this.petalColor);
        }
    }

    override renderFlowerHead(ctx: CanvasRenderingContext2D, wind: number) {
        const stemData = this.getStemData();
        this.renderPetals(ctx, stemData.end);
        this.drawPoint(ctx, stemData.end.x, stemData.end.y, this.discSize * this.currentScale, "#ede625");
        this.drawPoint(ctx, stemData.end.x, stemData.end.y, this.discSize * this.currentScale * 0.7, "#e4de25");
    }
}

export default Daisy;
