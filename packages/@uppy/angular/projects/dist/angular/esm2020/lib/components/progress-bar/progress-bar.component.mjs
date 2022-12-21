import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Uppy } from '@uppy/core';
import ProgressBar from '@uppy/progress-bar';
import { UppyAngularWrapper } from '../../utils/wrapper';
import * as i0 from "@angular/core";
export class ProgressBarComponent extends UppyAngularWrapper {
    constructor(el) {
        super();
        this.el = el;
        this.uppy = new Uppy;
        this.props = {};
    }
    ngOnInit() {
        this.onMount({ id: 'angular:ProgressBar', target: this.el.nativeElement }, ProgressBar);
    }
    ngOnChanges(changes) {
        this.handleChanges(changes, ProgressBar);
    }
    ngOnDestroy() {
        this.uninstall();
    }
}
ProgressBarComponent.ɵfac = function ProgressBarComponent_Factory(t) { return new (t || ProgressBarComponent)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
ProgressBarComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ProgressBarComponent, selectors: [["uppy-progress-bar"]], inputs: { uppy: "uppy", props: "props" }, features: [i0.ɵɵInheritDefinitionFeature, i0.ɵɵNgOnChangesFeature], decls: 0, vars: 0, template: function ProgressBarComponent_Template(rf, ctx) { }, encapsulation: 2, changeDetection: 0 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ProgressBarComponent, [{
        type: Component,
        args: [{
                selector: 'uppy-progress-bar',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, { uppy: [{
            type: Input
        }], props: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3VwcHkvYW5ndWxhci9zcmMvbGliL2NvbXBvbmVudHMvcHJvZ3Jlc3MtYmFyL3Byb2dyZXNzLWJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBYyxLQUFLLEVBQXVDLE1BQU0sZUFBZSxDQUFDO0FBQzNILE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxXQUFXLE1BQU0sb0JBQW9CLENBQUM7QUFFN0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBT3pELE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxrQkFBa0I7SUFJMUQsWUFBbUIsRUFBYztRQUMvQixLQUFLLEVBQUUsQ0FBQztRQURTLE9BQUUsR0FBRixFQUFFLENBQVk7UUFIeEIsU0FBSSxHQUFTLElBQUksSUFBSSxDQUFDO1FBQ3RCLFVBQUssR0FBdUIsRUFBRSxDQUFDO0lBSXZDLENBQUM7SUFFRixRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUN6RixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7O3dGQWxCVSxvQkFBb0I7dUVBQXBCLG9CQUFvQjt1RkFBcEIsb0JBQW9CO2NBTGhDLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUUsRUFBRTtnQkFDWixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs2REFFVSxJQUFJO2tCQUFaLEtBQUs7WUFDRyxLQUFLO2tCQUFiLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBFbGVtZW50UmVmLCBJbnB1dCwgT25EZXN0cm95LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFVwcHkgfSBmcm9tICdAdXBweS9jb3JlJztcbmltcG9ydCBQcm9ncmVzc0JhciBmcm9tICdAdXBweS9wcm9ncmVzcy1iYXInO1xuaW1wb3J0IHR5cGUgeyBQcm9ncmVzc0Jhck9wdGlvbnMgfSBmcm9tICdAdXBweS9wcm9ncmVzcy1iYXInO1xuaW1wb3J0IHsgVXBweUFuZ3VsYXJXcmFwcGVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvd3JhcHBlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3VwcHktcHJvZ3Jlc3MtYmFyJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQcm9ncmVzc0JhckNvbXBvbmVudCBleHRlbmRzIFVwcHlBbmd1bGFyV3JhcHBlciBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgdXBweTogVXBweSA9IG5ldyBVcHB5O1xuICBASW5wdXQoKSBwcm9wczogUHJvZ3Jlc3NCYXJPcHRpb25zID0ge307XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7XG4gICAgc3VwZXIoKTtcbiAgIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9uTW91bnQoeyBpZDogJ2FuZ3VsYXI6UHJvZ3Jlc3NCYXInLCB0YXJnZXQ6IHRoaXMuZWwubmF0aXZlRWxlbWVudCB9LCBQcm9ncmVzc0JhcilcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZXMoY2hhbmdlcywgUHJvZ3Jlc3NCYXIpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy51bmluc3RhbGwoKTtcbiAgfVxufVxuIl19