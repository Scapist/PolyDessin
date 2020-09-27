import { Injectable } from '@angular/core';
import { BasicShapeProperties } from '@app/classes/tools-properties/basic-shape-properties';
import { TracingTool } from '@app/classes/tracing-tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class EraseService extends TracingTool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Erase';
        this.tooltip = 'Erase';
        this.iconName = 'create';
        this.toolProperties = new BasicShapeProperties();
        this.clearPath();
        this.drawingService.setThickness(20);
    }

    protected drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.drawingService.setColor('#FFFFFF');
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (const point of path) {
            // ctx.fillRect(point.x - 10, point.y - 10, 20, 20);
            ctx.lineTo(point.x, point.y);
            // ctx.rect(point.x, point.y, 20, 20);
        }
        ctx.stroke();
    }

    protected drawCursor(position: Vec2): void {
        const cursorCtx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(cursorCtx);
        this.drawingService.setColor('#FFFFFF');
        cursorCtx.beginPath();
        cursorCtx.rect(
            position.x - this.toolProperties.thickness / 2,
            position.y - this.toolProperties.thickness / 2,
            this.toolProperties.thickness,
            this.toolProperties.thickness,
        );
        cursorCtx.fill();
    }
}
