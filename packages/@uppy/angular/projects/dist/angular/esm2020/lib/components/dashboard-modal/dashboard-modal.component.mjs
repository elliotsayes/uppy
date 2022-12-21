import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import Dashboard from '@uppy/dashboard';
import { Uppy } from '@uppy/core';
import { UppyAngularWrapper } from '../../utils/wrapper';
import * as i0 from "@angular/core";
export class DashboardModalComponent extends UppyAngularWrapper {
    constructor(el) {
        super();
        this.el = el;
        this.uppy = new Uppy;
        this.props = {};
        this.open = false;
    }
    ngOnInit() {
        this.onMount({
            id: 'angular:DashboardModal',
            inline: false,
            target: this.el.nativeElement
        }, Dashboard);
    }
    ngOnChanges(changes) {
        this.handleChanges(changes, Dashboard);
        // Handle dashboard-modal specific changes
        if (changes['open'] && this.open !== changes['open'].previousValue) {
            if (this.open && !changes['open'].previousValue) {
                this.plugin.openModal();
            }
            if (!this.open && changes['open'].previousValue) {
                this.plugin.closeModal();
            }
        }
    }
    ngOnDestroy() {
        this.uninstall();
    }
}
DashboardModalComponent.ɵfac = function DashboardModalComponent_Factory(t) { return new (t || DashboardModalComponent)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
DashboardModalComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DashboardModalComponent, selectors: [["uppy-dashboard-modal"]], inputs: { uppy: "uppy", props: "props", open: "open" }, features: [i0.ɵɵInheritDefinitionFeature, i0.ɵɵNgOnChangesFeature], decls: 0, vars: 0, template: function DashboardModalComponent_Template(rf, ctx) { }, encapsulation: 2, changeDetection: 0 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DashboardModalComponent, [{
        type: Component,
        args: [{
                selector: 'uppy-dashboard-modal',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, { uppy: [{
            type: Input
        }], props: [{
            type: Input
        }], open: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkLW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3VwcHkvYW5ndWxhci9zcmMvbGliL2NvbXBvbmVudHMvZGFzaGJvYXJkLW1vZGFsL2Rhc2hib2FyZC1tb2RhbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBYyxLQUFLLEVBQXVDLE1BQU0sZUFBZSxDQUFDO0FBQzNILE9BQU8sU0FBUyxNQUFNLGlCQUFpQixDQUFDO0FBRXhDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBT3pELE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxrQkFBNkI7SUFLeEUsWUFBbUIsRUFBYztRQUMvQixLQUFLLEVBQUUsQ0FBQztRQURTLE9BQUUsR0FBRixFQUFFLENBQVk7UUFKeEIsU0FBSSxHQUFTLElBQUksSUFBSSxDQUFDO1FBQ3RCLFVBQUssR0FBcUIsRUFBRSxDQUFDO1FBQzdCLFNBQUksR0FBWSxLQUFLLENBQUM7SUFJL0IsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1gsRUFBRSxFQUFFLHdCQUF3QjtZQUM1QixNQUFNLEVBQUUsS0FBSztZQUNiLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWE7U0FDOUIsRUFBRSxTQUFTLENBQUMsQ0FBQTtJQUNmLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkMsMENBQTBDO1FBQzFDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsRUFBRTtZQUNsRSxJQUFHLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxFQUFFO2dCQUM5QyxJQUFJLENBQUMsTUFBTyxDQUFDLFNBQVMsRUFBRSxDQUFBO2FBQ3pCO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsRUFBRTtnQkFDL0MsSUFBSSxDQUFDLE1BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQTthQUMxQjtTQUNGO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQzs7OEZBaENVLHVCQUF1QjswRUFBdkIsdUJBQXVCO3VGQUF2Qix1QkFBdUI7Y0FMbkMsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFFBQVEsRUFBRSxFQUFFO2dCQUNaLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzZEQUVVLElBQUk7a0JBQVosS0FBSztZQUNHLEtBQUs7a0JBQWIsS0FBSztZQUNHLElBQUk7a0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IERhc2hib2FyZCBmcm9tICdAdXBweS9kYXNoYm9hcmQnO1xuaW1wb3J0IHR5cGUgeyBEYXNoYm9hcmRPcHRpb25zIH0gZnJvbSAnQHVwcHkvZGFzaGJvYXJkJztcbmltcG9ydCB7IFVwcHkgfSBmcm9tICdAdXBweS9jb3JlJztcbmltcG9ydCB7IFVwcHlBbmd1bGFyV3JhcHBlciB9IGZyb20gJy4uLy4uL3V0aWxzL3dyYXBwZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd1cHB5LWRhc2hib2FyZC1tb2RhbCcsXG4gIHRlbXBsYXRlOiAnJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkTW9kYWxDb21wb25lbnQgZXh0ZW5kcyBVcHB5QW5ndWxhcldyYXBwZXI8RGFzaGJvYXJkPiBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgdXBweTogVXBweSA9IG5ldyBVcHB5O1xuICBASW5wdXQoKSBwcm9wczogRGFzaGJvYXJkT3B0aW9ucyA9IHt9O1xuICBASW5wdXQoKSBvcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub25Nb3VudCh7XG4gICAgICBpZDogJ2FuZ3VsYXI6RGFzaGJvYXJkTW9kYWwnLFxuICAgICAgaW5saW5lOiBmYWxzZSxcbiAgICAgIHRhcmdldDogdGhpcy5lbC5uYXRpdmVFbGVtZW50XG4gICAgfSwgRGFzaGJvYXJkKVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlcyhjaGFuZ2VzLCBEYXNoYm9hcmQpO1xuICAgIC8vIEhhbmRsZSBkYXNoYm9hcmQtbW9kYWwgc3BlY2lmaWMgY2hhbmdlc1xuICAgIGlmIChjaGFuZ2VzWydvcGVuJ10gJiYgdGhpcy5vcGVuICE9PSBjaGFuZ2VzWydvcGVuJ10ucHJldmlvdXNWYWx1ZSkge1xuICAgICAgaWYodGhpcy5vcGVuICYmICFjaGFuZ2VzWydvcGVuJ10ucHJldmlvdXNWYWx1ZSkge1xuICAgICAgICB0aGlzLnBsdWdpbiEub3Blbk1vZGFsKClcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5vcGVuICYmIGNoYW5nZXNbJ29wZW4nXS5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgIHRoaXMucGx1Z2luIS5jbG9zZU1vZGFsKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnVuaW5zdGFsbCgpO1xuICB9XG5cbn1cbiJdfQ==