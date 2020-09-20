import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { keyCode } from '@app/enums/keyCodes.enum';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { LineService } from '@app/services/tools/Line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

export enum toolsIndex {
    pencil,
    brush,
    rectangle,
    ellipse,
    lines,
}

@Injectable({
    providedIn: 'root',
})
export class ToolbarService {
    private tools: Tool[];
    currentTool: Tool;

    constructor(
        protected pencilService: PencilService,
        protected brushService: BrushService,
        protected rectangleService: RectangleService,
        protected ellipseService: EllipseService,
        protected lineService: LineService,
    ) {
        this.tools = [pencilService, brushService, rectangleService, ellipseService, lineService];
        this.currentTool = this.tools[0];
    }

    getTools(): Tool[] {
        return this.tools;
    }

    // TODO: Change also change icon when switches
    onKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case keyCode.C:
                this.currentTool = this.tools[toolsIndex.pencil];
                break;

            // Pinceau
            case keyCode.W:
                this.currentTool = this.tools[toolsIndex.brush];
                break;

            // Rectangle
            case keyCode.One:
                this.currentTool = this.tools[toolsIndex.rectangle];
                break;

            // Ellipse
            case keyCode.Two:
                this.currentTool = this.tools[toolsIndex.ellipse];
                break;

            // Lines
            case keyCode.L:
                this.currentTool = this.tools[toolsIndex.lines];
                break;
        }
    }
}
