import { OnDestroy, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { Uppy } from '@uppy/core';
import type { DragDropOptions } from '@uppy/drag-drop';
import { UppyAngularWrapper } from '../../utils/wrapper';
import * as i0 from "@angular/core";
export declare class DragDropComponent extends UppyAngularWrapper implements OnDestroy, OnChanges {
    el: ElementRef;
    uppy: Uppy;
    props: DragDropOptions;
    constructor(el: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DragDropComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DragDropComponent, "uppy-drag-drop", never, { "uppy": "uppy"; "props": "props"; }, {}, never, never, false>;
}
