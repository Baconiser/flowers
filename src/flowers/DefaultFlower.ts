import Flower from "../Flower";
import type {Coords} from "../Coords";

class Blume extends Flower {
    private readonly discSize: number;
    private readonly petalCount: number;
    private readonly petalAngle: number;


    constructor(position: Coords, mousePos: Coords) {
        super(position, mousePos);
        this.discSize = 8;
        this.petalCount = this.randomInt(4, 6);
        this.petalAngle = (Math.PI * 2) / this.petalCount;
    }

    renderPetals(ctx: CanvasRenderingContext2D, stemEnd: Coords) {
        const radius = this.discSize * 1.8;
        ctx.beginPath();
        for (let i = 0; i < this.petalCount; i++) {
            const angle = i * this.petalAngle + this.randomAngleOffset;
            const petalPos = {
                x: stemEnd.x + Math.cos(angle) * radius * 0.5,
                y: stemEnd.y + Math.sin(angle) * radius * 0.5
            };
            const {x, y} = petalPos;
            const size = radius * this.currentScale;
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = this.petalColor;
        }
        ctx.fill();
        ctx.closePath();
    }

    override renderFlowerHead(ctx: CanvasRenderingContext2D, wind: number) {
        const stemData = this.getStemData();
        this.renderPetals(ctx, stemData.end);
        this.drawPoint(ctx, stemData.end.x, stemData.end.y, this.discSize * this.currentScale, "#ffe8e8");
        ctx.strokeStyle = "#e4dcdc"
        ctx.lineWidth = 0.5
        ctx.stroke()
    }
}

export default Blume;
