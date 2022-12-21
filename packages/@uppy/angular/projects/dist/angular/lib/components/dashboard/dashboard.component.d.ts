import { ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import type { DashboardOptions } from '@uppy/dashboard';
import { Uppy } from '@uppy/core';
import { UppyAngularWrapper } from '../../utils/wrapper';
import * as i0 from "@angular/core";
export declare class DashboardComponent extends UppyAngularWrapper implements OnDestroy, OnChanges {
    el: ElementRef;
    uppy: Uppy;
    props: DashboardOptions;
    constructor(el: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DashboardComponent, "uppy-dashboard", never, { "uppy": "uppy"; "props": "props"; }, {}, never, never, false>;
}
