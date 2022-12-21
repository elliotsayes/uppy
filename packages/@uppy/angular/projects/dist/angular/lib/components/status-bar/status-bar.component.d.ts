import { ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Uppy } from '@uppy/core';
import type { StatusBarOptions } from '@uppy/status-bar';
import { UppyAngularWrapper } from '../../utils/wrapper';
import * as i0 from "@angular/core";
export declare class StatusBarComponent extends UppyAngularWrapper implements OnDestroy, OnChanges {
    el: ElementRef;
    uppy: Uppy;
    props: StatusBarOptions;
    constructor(el: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StatusBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<StatusBarComponent, "uppy-status-bar", never, { "uppy": "uppy"; "props": "props"; }, {}, never, never, false>;
}
