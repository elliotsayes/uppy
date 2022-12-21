import { ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import Dashboard from '@uppy/dashboard';
import type { DashboardOptions } from '@uppy/dashboard';
import { Uppy } from '@uppy/core';
import { UppyAngularWrapper } from '../../utils/wrapper';
import * as i0 from "@angular/core";
export declare class DashboardModalComponent extends UppyAngularWrapper<Dashboard> implements OnDestroy, OnChanges {
    el: ElementRef;
    uppy: Uppy;
    props: DashboardOptions;
    open: boolean;
    constructor(el: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardModalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DashboardModalComponent, "uppy-dashboard-modal", never, { "uppy": "uppy"; "props": "props"; "open": "open"; }, {}, never, never, false>;
}
