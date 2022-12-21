import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import Dashboard from '@uppy/dashboard';
import { Uppy } from '@uppy/core';
import { UppyAngularWrapper } from '../../utils/wrapper';
import * as i0 from "@angular/core";
export class DashboardComponent extends UppyAngularWrapper {
    constructor(el) {
        super();
        this.el = el;
        this.uppy = new Uppy;
        this.props = {};
    }
    ngOnInit() {
        this.onMount({ id: 'angular:Dashboard', inline: true, target: this.el.nativeElement }, Dashboard);
    }
    ngOnChanges(changes) {
        this.handleChanges(changes, Dashboard);
    }
    ngOnDestroy() {
        this.uninstall();
    }
}
DashboardComponent.ɵfac = function DashboardComponent_Factory(t) { return new (t || DashboardComponent)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
DashboardComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DashboardComponent, selectors: [["uppy-dashboard"]], inputs: { uppy: "uppy", props: "props" }, features: [i0.ɵɵInheritDefinitionFeature, i0.ɵɵNgOnChangesFeature], decls: 0, vars: 0, template: function DashboardComponent_Template(rf, ctx) { }, encapsulation: 2, changeDetection: 0 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DashboardComponent, [{
        type: Component,
        args: [{
                selector: 'uppy-dashboard',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, { uppy: [{
            type: Input
        }], props: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3VwcHkvYW5ndWxhci9zcmMvbGliL2NvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBYyxLQUFLLEVBQXVDLE1BQU0sZUFBZSxDQUFDO0FBQzNILE9BQU8sU0FBUyxNQUFNLGlCQUFpQixDQUFDO0FBRXhDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBT3pELE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxrQkFBa0I7SUFJeEQsWUFBbUIsRUFBYztRQUMvQixLQUFLLEVBQUUsQ0FBQztRQURTLE9BQUUsR0FBRixFQUFFLENBQVk7UUFIeEIsU0FBSSxHQUFTLElBQUksSUFBSSxDQUFDO1FBQ3RCLFVBQUssR0FBcUIsRUFBRSxDQUFDO0lBSXRDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0lBQ25HLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQzs7b0ZBbEJVLGtCQUFrQjtxRUFBbEIsa0JBQWtCO3VGQUFsQixrQkFBa0I7Y0FMOUIsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFFBQVEsRUFBRSxFQUFFO2dCQUNaLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzZEQUVVLElBQUk7a0JBQVosS0FBSztZQUNHLEtBQUs7a0JBQWIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IERhc2hib2FyZCBmcm9tICdAdXBweS9kYXNoYm9hcmQnO1xuaW1wb3J0IHR5cGUgeyBEYXNoYm9hcmRPcHRpb25zIH0gZnJvbSAnQHVwcHkvZGFzaGJvYXJkJztcbmltcG9ydCB7IFVwcHkgfSBmcm9tICdAdXBweS9jb3JlJztcbmltcG9ydCB7IFVwcHlBbmd1bGFyV3JhcHBlciB9IGZyb20gJy4uLy4uL3V0aWxzL3dyYXBwZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd1cHB5LWRhc2hib2FyZCcsXG4gIHRlbXBsYXRlOiAnJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkQ29tcG9uZW50IGV4dGVuZHMgVXBweUFuZ3VsYXJXcmFwcGVyIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBASW5wdXQoKSB1cHB5OiBVcHB5ID0gbmV3IFVwcHk7XG4gIEBJbnB1dCgpIHByb3BzOiBEYXNoYm9hcmRPcHRpb25zID0ge307XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub25Nb3VudCh7IGlkOiAnYW5ndWxhcjpEYXNoYm9hcmQnLCBpbmxpbmU6IHRydWUsIHRhcmdldDogdGhpcy5lbC5uYXRpdmVFbGVtZW50IH0sIERhc2hib2FyZClcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZXMoY2hhbmdlcywgRGFzaGJvYXJkKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMudW5pbnN0YWxsKCk7XG4gIH1cblxufVxuIl19