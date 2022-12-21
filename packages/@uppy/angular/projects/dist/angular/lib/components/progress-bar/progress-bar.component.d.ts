import { ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Uppy } from '@uppy/core';
import type { ProgressBarOptions } from '@uppy/progress-bar';
import { UppyAngularWrapper } from '../../utils/wrapper';
import * as i0 from "@angular/core";
export declare class ProgressBarComponent extends UppyAngularWrapper implements OnDestroy, OnChanges {
    el: ElementRef;
    uppy: Uppy;
    props: ProgressBarOptions;
    constructor(el: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProgressBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProgressBarComponent, "uppy-progress-bar", never, { "uppy": "uppy"; "props": "props"; }, {}, never, never, false>;
}
