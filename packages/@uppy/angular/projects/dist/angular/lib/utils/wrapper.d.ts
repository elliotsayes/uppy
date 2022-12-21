import type { Uppy, UIPlugin } from '@uppy/core';
import type { ElementRef, SimpleChanges } from '@angular/core';
import type { DragDropOptions } from '@uppy/drag-drop';
import type { StatusBarOptions } from '@uppy/status-bar';
import type { ProgressBarOptions } from '@uppy/progress-bar';
export declare abstract class UppyAngularWrapper<PluginType extends UIPlugin = UIPlugin> {
    abstract props: DragDropOptions | StatusBarOptions | ProgressBarOptions;
    abstract el: ElementRef;
    abstract uppy: Uppy;
    private options;
    plugin: PluginType | undefined;
    onMount(defaultOptions: Record<string, unknown>, plugin: new (uppy: Uppy, opts?: Record<string, unknown>) => UIPlugin): void;
    handleChanges(changes: SimpleChanges, plugin: any): void;
    uninstall(uppy?: Uppy): void;
}
