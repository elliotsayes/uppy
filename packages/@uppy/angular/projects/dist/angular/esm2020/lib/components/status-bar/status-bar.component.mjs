import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Uppy } from '@uppy/core';
import StatusBar from '@uppy/status-bar';
import { UppyAngularWrapper } from '../../utils/wrapper';
import * as i0 from "@angular/core";
export class StatusBarComponent extends UppyAngularWrapper {
    constructor(el) {
        super();
        this.el = el;
        this.uppy = new Uppy;
        this.props = {};
    }
    ngOnInit() {
        this.onMount({ id: 'angular:StatusBar', target: this.el.nativeElement }, StatusBar);
    }
    ngOnChanges(changes) {
        this.handleChanges(changes, StatusBar);
    }
    ngOnDestroy() {
        this.uninstall();
    }
}
StatusBarComponent.ɵfac = function StatusBarComponent_Factory(t) { return new (t || StatusBarComponent)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
StatusBarComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StatusBarComponent, selectors: [["uppy-status-bar"]], inputs: { uppy: "uppy", props: "props" }, features: [i0.ɵɵInheritDefinitionFeature, i0.ɵɵNgOnChangesFeature], decls: 0, vars: 0, template: function StatusBarComponent_Template(rf, ctx) { }, encapsulation: 2, changeDetection: 0 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StatusBarComponent, [{
        type: Component,
        args: [{
                selector: 'uppy-status-bar',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, { uppy: [{
            type: Input
        }], props: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi91cHB5L2FuZ3VsYXIvc3JjL2xpYi9jb21wb25lbnRzL3N0YXR1cy1iYXIvc3RhdHVzLWJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQWlFLE1BQU0sZUFBZSxDQUFDO0FBQ3pJLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxTQUFTLE1BQU0sa0JBQWtCLENBQUM7QUFFekMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBT3pELE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxrQkFBa0I7SUFJeEQsWUFBbUIsRUFBYztRQUMvQixLQUFLLEVBQUUsQ0FBQztRQURTLE9BQUUsR0FBRixFQUFFLENBQVk7UUFIeEIsU0FBSSxHQUFTLElBQUksSUFBSSxDQUFDO1FBQ3RCLFVBQUssR0FBcUIsRUFBRSxDQUFDO0lBSXRDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQTtJQUNyRixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7O29GQWxCVSxrQkFBa0I7cUVBQWxCLGtCQUFrQjt1RkFBbEIsa0JBQWtCO2NBTDlCLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixRQUFRLEVBQUUsRUFBRTtnQkFDWixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs2REFFVSxJQUFJO2tCQUFaLEtBQUs7WUFDRyxLQUFLO2tCQUFiLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBJbnB1dCwgRWxlbWVudFJlZiwgU2ltcGxlQ2hhbmdlLCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVXBweSB9IGZyb20gJ0B1cHB5L2NvcmUnO1xuaW1wb3J0IFN0YXR1c0JhciBmcm9tICdAdXBweS9zdGF0dXMtYmFyJztcbmltcG9ydCB0eXBlIHsgU3RhdHVzQmFyT3B0aW9ucyB9IGZyb20gJ0B1cHB5L3N0YXR1cy1iYXInO1xuaW1wb3J0IHsgVXBweUFuZ3VsYXJXcmFwcGVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvd3JhcHBlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3VwcHktc3RhdHVzLWJhcicsXG4gIHRlbXBsYXRlOiAnJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgU3RhdHVzQmFyQ29tcG9uZW50IGV4dGVuZHMgVXBweUFuZ3VsYXJXcmFwcGVyIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkNoYW5nZXMgIHtcbiAgQElucHV0KCkgdXBweTogVXBweSA9IG5ldyBVcHB5O1xuICBASW5wdXQoKSBwcm9wczogU3RhdHVzQmFyT3B0aW9ucyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9uTW91bnQoeyBpZDogJ2FuZ3VsYXI6U3RhdHVzQmFyJywgdGFyZ2V0OiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQgfSwgU3RhdHVzQmFyKVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlcyhjaGFuZ2VzLCBTdGF0dXNCYXIpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy51bmluc3RhbGwoKTtcbiAgfVxuXG59XG4iXX0=