import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from '@app/classes/vec2';
import { DrawingType } from '@app/enums/drawing-type.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    private pathStart: Vec2;
    private width: number;
    private height: number;
    private shiftDown: boolean = false;
    private mousePosition: Vec2;
    private boxGuideThickness: number = 1;
    private boxGuideDashedSegments: number = 6;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Ellipse';
        this.tooltip = 'Ellipse(2)';
        this.iconName = 'panorama_fish_eye';
        this.toolProperties = new BasicShapeProperties();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathStart = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mousePosition = this.getPositionFromMouse(event);
            this.computeDimensions();

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDown = false;
            this.drawEllipse(this.drawingService.baseCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mousePosition = this.getPositionFromMouse(event);
            this.drawPreview();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        this.shiftDown = event.key === 'Shift';
        if (this.mouseDown) this.drawPreview();
    }

    onKeyUp(event: KeyboardEvent): void {
        this.shiftDown = event.key === 'Shift' ? false : this.shiftDown;
        if (this.mouseDown) this.drawPreview();
    }

    computeDimensions(): void {
        this.width = this.mousePosition.x - this.pathStart.x;
        this.height = this.mousePosition.y - this.pathStart.y;

        if (this.shiftDown) {
            const min = Math.min(Math.abs(this.width), Math.abs(this.height));
            this.width = this.width < 0 ? -min : min;
            this.height = this.height < 0 ? -min : min;
        }
    }

    setThickness(value: number | null): void {
        value = value === null ? 1 : value;
        this.toolProperties.thickness = value;
    }

    setTypeDrawing(value: string): void {
        const ellipseProperties = this.toolProperties as BasicShapeProperties;
        ellipseProperties.currentType = value;
    }

    private drawPreview(): void {
        this.computeDimensions();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawEllipse(this.drawingService.previewCtx);
    }

    private drawBoxGuide(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDown) {
            ctx.lineWidth = this.boxGuideThickness;

            ctx.setLineDash([this.boxGuideDashedSegments]);
            ctx.beginPath();
            ctx.strokeRect(this.pathStart.x, this.pathStart.y, this.width, this.height);
            ctx.setLineDash([0]);
        }
    }

    /**
     * @description Draws the ellipse with the correct thickness and prioritizes
     * the dimensions of the guide perimeter (boxGuide) which follow the mouse
     * movements. When the thickness is too big for the ellipse to be drawn
     * inside the perimeter, the ctx.lineWidth is assigned to the half of the
     * smallest of its sides.
     */
    private drawEllipse(ctx: CanvasRenderingContext2D): void {
        const radius: Vec2 = { x: this.width / 2, y: this.height / 2 };
        const ellipseProperties = this.toolProperties as BasicShapeProperties;
        const thickness =
            ellipseProperties.currentType === DrawingType.Fill
                ? this.boxGuideThickness
                : this.toolProperties.thickness < Math.min(Math.abs(radius.x), Math.abs(radius.y))
                ? this.toolProperties.thickness
                : Math.min(Math.abs(radius.x), Math.abs(radius.y));
        const dx = this.width < 0 ? -thickness / 2 : thickness / 2;
        const dy = this.height < 0 ? -thickness / 2 : thickness / 2;

        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.ellipse(this.pathStart.x + radius.x, this.pathStart.y + radius.y, Math.abs(radius.x - dx), Math.abs(radius.y - dy), 0, 0, 2 * Math.PI);

        switch (ellipseProperties.currentType) {
            case DrawingType.Stroke:
                ctx.stroke();
                break;
            case DrawingType.Fill:
                ctx.fill();
                break;
            default:
                ctx.fill();
                ctx.stroke();
        }

        this.drawBoxGuide(ctx);
    }
}
