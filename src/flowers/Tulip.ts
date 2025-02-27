import Flower from "../Flower";
import type {Coords} from "../Coords";

class Tulip extends Flower {

    private readonly petalWidth: number = 30;
    private readonly petalHeight: number = this.petalWidth * 1.33;

    private readonly angle = this.randomInt(15, 20)

    constructor(position: Coords, mousePos: Coords) {
        super(position, mousePos);

    }

    rotatePoint(point: Coords, angle: number): Coords {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: point.x * cos - point.y * sin,
            y: point.x * sin + point.y * cos,
        };
    }

// Draw a petal using local coordinates where the bottom (pivot) is at (0,0)
// and then translate it so that the pivot lands at the provided center.
    drawPetal(ctx: CanvasRenderingContext2D, width: number, height: number, center: Coords, angle: number, windOffset: number): void {
        const bottom: Coords = {x: 0, y: 0};
        const cpRight: Coords = {x: width * 0.83, y: 0};
        const cpLeft: Coords = {x: -width * 0.83, y: 0};
        const top: Coords = {x: windOffset, y: -height * 0.75};

        const rBottom: Coords = this.rotatePoint(bottom, angle);
        const rCpRight: Coords = this.rotatePoint(cpRight, angle);
        const rCpLeft: Coords = this.rotatePoint(cpLeft, angle);
        const rTop: Coords = this.rotatePoint(top, angle);

        const tBottom: Coords = {x: rBottom.x + center.x, y: rBottom.y + center.y};
        const tCpRight: Coords = {x: rCpRight.x + center.x, y: rCpRight.y + center.y};
        const tCpLeft: Coords = {x: rCpLeft.x + center.x, y: rCpLeft.y + center.y};
        const tTop: Coords = {x: rTop.x + center.x, y: rTop.y + center.y};

        ctx.beginPath();
        ctx.moveTo(tBottom.x, tBottom.y);
        ctx.bezierCurveTo(tBottom.x, tBottom.y, tCpRight.x, tCpRight.y, tTop.x, tTop.y);
        ctx.moveTo(tBottom.x, tBottom.y);
        ctx.bezierCurveTo(tBottom.x, tBottom.y, tCpLeft.x, tCpLeft.y, tTop.x, tTop.y);
        ctx.fill();
        ctx.closePath();
    }


    override renderFlowerHead(ctx: CanvasRenderingContext2D, wind: number) {
        const stemData = this.getStemData();
        const center = stemData.end;
        ctx.fillStyle = this.petalColor;
        this.drawPetal(ctx, this.petalWidth * this.currentScale, this.petalHeight * this.currentScale, center, this.rad(this.angle), wind);
        ctx.fillStyle = this.darkenColor(3);

        this.drawPetal(ctx, this.petalWidth * this.currentScale, this.petalHeight * this.currentScale, {
            x: center.x,
            y: center.y - 5
        }, 0, wind);
        ctx.fillStyle = this.darkenColor(5);
        this.drawPetal(ctx, this.petalWidth * this.currentScale, this.petalHeight * this.currentScale, center, this.rad(-this.angle), wind);
    }
}

export default Tulip;
