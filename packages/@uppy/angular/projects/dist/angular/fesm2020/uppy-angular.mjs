import * as i0 from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import Dashboard from '@uppy/dashboard';
import { Uppy } from '@uppy/core';
import ProgressBar from '@uppy/progress-bar';
import StatusBar from '@uppy/status-bar';
import DragDrop from '@uppy/drag-drop';

class UppyAngularWrapper {
    onMount(defaultOptions, plugin) {
        this.options = {
            ...defaultOptions,
            ...this.props,
        };
        this.uppy.use(plugin, this.options);
        this.plugin = this.uppy.getPlugin(this.options.id);
    }
    handleChanges(changes, plugin) {
        // Without the last part of this conditional, it tries to uninstall before the plugin is mounted
        if (changes['uppy'] && this.uppy !== changes['uppy'].previousValue && changes['uppy'].previousValue !== undefined) {
            this.uninstall(changes['uppy'].previousValue);
            this.uppy.use(plugin, this.options);
        }
        this.options = { ...this.options, ...this.props };
        this.plugin = this.uppy.getPlugin(this.options.id);
        if (changes['props'] && this.props !== changes['props'].previousValue && changes['props'].previousValue !== undefined) {
            this.plugin.setOptions({ ...this.options });
        }
    }
    uninstall(uppy = this.uppy) {
        uppy.removePlugin(this.plugin);
    }
}

class DashboardComponent extends UppyAngularWrapper {
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

const COMPONENTS$4 = [DashboardComponent];
class UppyAngularDashboardModule {
}
UppyAngularDashboardModule.ɵfac = function UppyAngularDashboardModule_Factory(t) { return new (t || UppyAngularDashboardModule)(); };
UppyAngularDashboardModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: UppyAngularDashboardModule });
UppyAngularDashboardModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({});
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UppyAngularDashboardModule, [{
        type: NgModule,
        args: [{
                declarations: COMPONENTS$4,
                exports: COMPONENTS$4
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(UppyAngularDashboardModule, { declarations: [DashboardComponent], exports: [DashboardComponent] }); })();

class DashboardModalComponent extends UppyAngularWrapper {
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

const COMPONENTS$3 = [DashboardModalComponent];
class UppyAngularDashboardModalModule {
}
UppyAngularDashboardModalModule.ɵfac = function UppyAngularDashboardModalModule_Factory(t) { return new (t || UppyAngularDashboardModalModule)(); };
UppyAngularDashboardModalModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: UppyAngularDashboardModalModule });
UppyAngularDashboardModalModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({});
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UppyAngularDashboardModalModule, [{
        type: NgModule,
        args: [{
                declarations: COMPONENTS$3,
                exports: COMPONENTS$3
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(UppyAngularDashboardModalModule, { declarations: [DashboardModalComponent], exports: [DashboardModalComponent] }); })();

class ProgressBarComponent extends UppyAngularWrapper {
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

const COMPONENTS$2 = [ProgressBarComponent];
class UppyAngularProgressBarModule {
}
UppyAngularProgressBarModule.ɵfac = function UppyAngularProgressBarModule_Factory(t) { return new (t || UppyAngularProgressBarModule)(); };
UppyAngularProgressBarModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: UppyAngularProgressBarModule });
UppyAngularProgressBarModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({});
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UppyAngularProgressBarModule, [{
        type: NgModule,
        args: [{
                declarations: COMPONENTS$2,
                exports: COMPONENTS$2
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(UppyAngularProgressBarModule, { declarations: [ProgressBarComponent], exports: [ProgressBarComponent] }); })();

class StatusBarComponent extends UppyAngularWrapper {
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

const COMPONENTS$1 = [StatusBarComponent];
class UppyAngularStatusBarModule {
}
UppyAngularStatusBarModule.ɵfac = function UppyAngularStatusBarModule_Factory(t) { return new (t || UppyAngularStatusBarModule)(); };
UppyAngularStatusBarModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: UppyAngularStatusBarModule });
UppyAngularStatusBarModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({});
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UppyAngularStatusBarModule, [{
        type: NgModule,
        args: [{
                declarations: COMPONENTS$1,
                exports: COMPONENTS$1
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(UppyAngularStatusBarModule, { declarations: [StatusBarComponent], exports: [StatusBarComponent] }); })();

class DragDropComponent extends UppyAngularWrapper {
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

const COMPONENTS = [DragDropComponent];
class UppyAngularDragDropModule {
}
UppyAngularDragDropModule.ɵfac = function UppyAngularDragDropModule_Factory(t) { return new (t || UppyAngularDragDropModule)(); };
UppyAngularDragDropModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: UppyAngularDragDropModule });
UppyAngularDragDropModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({});
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UppyAngularDragDropModule, [{
        type: NgModule,
        args: [{
                declarations: COMPONENTS,
                exports: COMPONENTS
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(UppyAngularDragDropModule, { declarations: [DragDropComponent], exports: [DragDropComponent] }); })();

/*
 * Public API Surface of @uppy/angular
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DashboardComponent, DashboardModalComponent, DragDropComponent, ProgressBarComponent, StatusBarComponent, UppyAngularDashboardModalModule, UppyAngularDashboardModule, UppyAngularDragDropModule, UppyAngularProgressBarModule, UppyAngularStatusBarModule };
//# sourceMappingURL=uppy-angular.mjs.map
