import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Uppy } from '@uppy/core';
import DragDrop from '@uppy/drag-drop';
import { UppyAngularWrapper } from '../../utils/wrapper';
import * as i0 from "@angular/core";
export class DragDropComponent extends UppyAngularWrapper {
    constructor(el) {
        super();
        this.el = el;
        this.uppy = new Uppy;
        this.props = {};
    }
    ngOnInit() {
        this.onMount({ id: 'angular:DragDrop', target: this.el.nativeElement }, DragDrop);
    }
    ngOnChanges(changes) {
        this.handleChanges(changes, DragDrop);
    }
    ngOnDestroy() {
        this.uninstall();
    }
}
DragDropComponent.ɵfac = function DragDropComponent_Factory(t) { return new (t || DragDropComponent)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
DragDropComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DragDropComponent, selectors: [["uppy-drag-drop"]], inputs: { uppy: "uppy", props: "props" }, features: [i0.ɵɵInheritDefinitionFeature, i0.ɵɵNgOnChangesFeature], decls: 0, vars: 0, template: function DragDropComponent_Template(rf, ctx) { }, encapsulation: 2, changeDetection: 0 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DragDropComponent, [{
        type: Component,
        args: [{
                selector: 'uppy-drag-drop',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, { uppy: [{
            type: Input
        }], props: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1kcm9wLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3VwcHkvYW5ndWxhci9zcmMvbGliL2NvbXBvbmVudHMvZHJhZy1kcm9wL2RyYWctZHJvcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQW1ELE1BQU0sZUFBZSxDQUFDO0FBQzNILE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxRQUFRLE1BQU0saUJBQWlCLENBQUM7QUFFdkMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBT3pELE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxrQkFBa0I7SUFJdkQsWUFBbUIsRUFBYztRQUMvQixLQUFLLEVBQUUsQ0FBQztRQURTLE9BQUUsR0FBRixFQUFFLENBQVk7UUFIeEIsU0FBSSxHQUFTLElBQUksSUFBSSxDQUFDO1FBQ3RCLFVBQUssR0FBb0IsRUFBRSxDQUFDO0lBSXJDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNuRixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7O2tGQWxCVSxpQkFBaUI7b0VBQWpCLGlCQUFpQjt1RkFBakIsaUJBQWlCO2NBTDdCLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixRQUFRLEVBQUUsRUFBRTtnQkFDWixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs2REFFVSxJQUFJO2tCQUFaLEtBQUs7WUFDRyxLQUFLO2tCQUFiLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBJbnB1dCwgT25EZXN0cm95LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFVwcHkgfSBmcm9tICdAdXBweS9jb3JlJztcbmltcG9ydCBEcmFnRHJvcCBmcm9tICdAdXBweS9kcmFnLWRyb3AnO1xuaW1wb3J0IHR5cGUgeyBEcmFnRHJvcE9wdGlvbnMgfSBmcm9tICdAdXBweS9kcmFnLWRyb3AnO1xuaW1wb3J0IHsgVXBweUFuZ3VsYXJXcmFwcGVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvd3JhcHBlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3VwcHktZHJhZy1kcm9wJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBEcmFnRHJvcENvbXBvbmVudCBleHRlbmRzIFVwcHlBbmd1bGFyV3JhcHBlciBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgdXBweTogVXBweSA9IG5ldyBVcHB5O1xuICBASW5wdXQoKSBwcm9wczogRHJhZ0Ryb3BPcHRpb25zID0ge307XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub25Nb3VudCh7IGlkOiAnYW5ndWxhcjpEcmFnRHJvcCcsIHRhcmdldDogdGhpcy5lbC5uYXRpdmVFbGVtZW50IH0sIERyYWdEcm9wKVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlcyhjaGFuZ2VzLCBEcmFnRHJvcCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnVuaW5zdGFsbCgpO1xuICB9XG5cbn1cbiJdfQ==