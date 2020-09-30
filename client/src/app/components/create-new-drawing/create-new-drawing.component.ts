import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingDialogComponent } from './new-drawing-dialog/new-drawing-dialog.component';

// CreateNewDrawingComponent is the button in the sidebar
@Component({
    selector: 'app-create-new-drawing',
    templateUrl: './create-new-drawing.component.html',
    styleUrls: ['./create-new-drawing.component.scss'],
})
export class CreateNewDrawingComponent {
    constructor(public currentDrawingService: DrawingService, public dialog: MatDialog) {}

    // Empty: Automatically clears canvas, Not Empty: Pop Up Warning
    CreateNewDrawing(): void {
        if (this.currentDrawingService.CanvasEmpty(this.currentDrawingService.baseCtx, this.currentDrawingService.canvas)) {
            this.currentDrawingService.clearCanvas(this.currentDrawingService.baseCtx);
            console.log('Cleared Canvas');
        } else {
            this.WarningClearCanvas();
            console.log('Cleared Canvas With Warning');
        }
        this.currentDrawingService.emitChildEvent('Button <new drawing> resized the canvas');
    }

    WarningClearCanvas(): void {
        this.dialog.open(NewDrawingDialogComponent);
    }

    // TODO : Implement keypress for CTRL+0
}
