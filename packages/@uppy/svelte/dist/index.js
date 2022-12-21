(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@uppy/dashboard'), require('@uppy/drag-drop'), require('@uppy/progress-bar'), require('@uppy/status-bar')) :
    typeof define === 'function' && define.amd ? define(['exports', '@uppy/dashboard', '@uppy/drag-drop', '@uppy/progress-bar', '@uppy/status-bar'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Svelte = {}, global.Dashboard, global.DragDrop, global.ProgressBar, global.StatusBar));
})(this, (function (exports, DashboardPlugin, DragDropPlugin, ProgressBarPlugin, StatusBarPlugin) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var DashboardPlugin__default = /*#__PURE__*/_interopDefaultLegacy(DashboardPlugin);
    var DragDropPlugin__default = /*#__PURE__*/_interopDefaultLegacy(DragDropPlugin);
    var ProgressBarPlugin__default = /*#__PURE__*/_interopDefaultLegacy(ProgressBarPlugin);
    var StatusBarPlugin__default = /*#__PURE__*/_interopDefaultLegacy(StatusBarPlugin);

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    /* src/components/Dashboard.svelte generated by Svelte v3.49.0 */

    function create_fragment$4(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "uppy-Container");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			/*div_binding*/ ctx[4](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			/*div_binding*/ ctx[4](null);
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let container;
    	let plugin;
    	let { uppy } = $$props;
    	let { props = {} } = $$props;
    	let { plugins = [] } = $$props;

    	const installPlugin = () => {
    		const options = Object.assign(
    			Object.assign(
    				{
    					id: 'svelte:Dashboard',
    					inline: true,
    					plugins
    				},
    				props
    			),
    			{ target: container }
    		);

    		uppy.use(DashboardPlugin__default["default"], options);
    		plugin = uppy.getPlugin(options.id);
    	};

    	const uninstallPlugin = (uppyInstance = uppy) => {
    		uppyInstance.removePlugin(plugin);
    	};

    	onMount(() => installPlugin());
    	onDestroy(() => uninstallPlugin());

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('uppy' in $$props) $$invalidate(1, uppy = $$props.uppy);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('plugins' in $$props) $$invalidate(3, plugins = $$props.plugins);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*plugins, props, container, uppy*/ 15) {
    			{
    				const options = Object.assign(
    					Object.assign(
    						{
    							id: 'svelte:Dashboard',
    							inline: true,
    							plugins
    						},
    						props
    					),
    					{ target: container }
    				);

    				uppy.setOptions(options);
    			}
    		}
    	};

    	return [container, uppy, props, plugins, div_binding];
    }

    class Dashboard extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { uppy: 1, props: 2, plugins: 3 });
    	}
    }

    /* src/components/DashboardModal.svelte generated by Svelte v3.49.0 */

    function create_fragment$3(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "uppy-Container");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			/*div_binding*/ ctx[7](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			/*div_binding*/ ctx[7](null);
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let container;
    	let plugin;
    	let { uppy } = $$props;
    	let { props = {} } = $$props;
    	let { open } = $$props;
    	let lastOpen = open;
    	let { plugins = [] } = $$props;

    	const installPlugin = () => {
    		const options = Object.assign(Object.assign({ id: 'svelte:DashboardModal', plugins }, props), { target: container });
    		uppy.use(DashboardPlugin__default["default"], options);
    		$$invalidate(5, plugin = uppy.getPlugin(options.id));
    		if (open) plugin.openModal();
    	};

    	const uninstallPlugin = (uppyInstance = uppy) => {
    		uppyInstance.removePlugin(plugin);
    	};

    	onMount(() => installPlugin());
    	onDestroy(() => uninstallPlugin());

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('uppy' in $$props) $$invalidate(1, uppy = $$props.uppy);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('open' in $$props) $$invalidate(3, open = $$props.open);
    		if ('plugins' in $$props) $$invalidate(4, plugins = $$props.plugins);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*plugins, props, container, uppy*/ 23) {
    			{
    				const options = Object.assign(Object.assign({ id: 'svelte:DashboardModal', plugins }, props), { target: container });
    				uppy.setOptions(options);
    			}
    		}

    		if ($$self.$$.dirty & /*open, lastOpen, plugin*/ 104) {
    			{
    				if (open && !lastOpen) {
    					plugin.openModal();
    				}

    				if (!open && lastOpen) {
    					plugin.closeModal();
    				}

    				$$invalidate(6, lastOpen = open);
    			}
    		}
    	};

    	return [container, uppy, props, open, plugins, plugin, lastOpen, div_binding];
    }

    class DashboardModal extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { uppy: 1, props: 2, open: 3, plugins: 4 });
    	}
    }

    /* src/components/DragDrop.svelte generated by Svelte v3.49.0 */

    function create_fragment$2(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "uppy-Container");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			/*div_binding*/ ctx[3](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			/*div_binding*/ ctx[3](null);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let container;
    	let plugin;
    	let { uppy } = $$props;
    	let { props = {} } = $$props;

    	const installPlugin = () => {
    		const options = Object.assign(Object.assign({ id: 'svelte:DragDrop', inline: true }, props), { target: container });
    		uppy.use(DragDropPlugin__default["default"], options);
    		plugin = uppy.getPlugin(options.id);
    	};

    	const uninstallPlugin = (uppyInstance = uppy) => {
    		uppyInstance.removePlugin(plugin);
    	};

    	onMount(() => installPlugin());
    	onDestroy(() => uninstallPlugin());

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('uppy' in $$props) $$invalidate(1, uppy = $$props.uppy);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props, container, uppy*/ 7) {
    			{
    				const options = Object.assign(Object.assign({ id: 'svelte:DragDrop' }, props), { target: container });
    				uppy.setOptions(options);
    			}
    		}
    	};

    	return [container, uppy, props, div_binding];
    }

    class DragDrop extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { uppy: 1, props: 2 });
    	}
    }

    /* src/components/ProgressBar.svelte generated by Svelte v3.49.0 */

    function create_fragment$1(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "uppy-Container");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			/*div_binding*/ ctx[3](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			/*div_binding*/ ctx[3](null);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let container;
    	let plugin;
    	let { uppy } = $$props;
    	let { props = {} } = $$props;

    	const installPlugin = () => {
    		const options = Object.assign(Object.assign({ id: 'svelte:ProgressBar', inline: true }, props), { target: container });
    		uppy.use(ProgressBarPlugin__default["default"], options);
    		plugin = uppy.getPlugin(options.id);
    	};

    	const uninstallPlugin = (uppyInstance = uppy) => {
    		uppyInstance.removePlugin(plugin);
    	};

    	onMount(() => installPlugin());
    	onDestroy(() => uninstallPlugin());

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('uppy' in $$props) $$invalidate(1, uppy = $$props.uppy);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props, container, uppy*/ 7) {
    			{
    				const options = Object.assign(Object.assign({ id: 'svelte:ProgressBar' }, props), { target: container });
    				uppy.setOptions(options);
    			}
    		}
    	};

    	return [container, uppy, props, div_binding];
    }

    class ProgressBar extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { uppy: 1, props: 2 });
    	}
    }

    /* src/components/StatusBar.svelte generated by Svelte v3.49.0 */

    function create_fragment(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "uppy-Container");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			/*div_binding*/ ctx[3](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			/*div_binding*/ ctx[3](null);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let container;
    	let plugin;
    	let { uppy } = $$props;
    	let { props = {} } = $$props;

    	const installPlugin = () => {
    		const options = Object.assign(Object.assign({ id: 'svelte:StatusBar', inline: true }, props), { target: container });
    		uppy.use(StatusBarPlugin__default["default"], options);
    		plugin = uppy.getPlugin(options.id);
    	};

    	const uninstallPlugin = (uppyInstance = uppy) => {
    		uppyInstance.removePlugin(plugin);
    	};

    	onMount(() => installPlugin());
    	onDestroy(() => uninstallPlugin());

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('uppy' in $$props) $$invalidate(1, uppy = $$props.uppy);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props, container, uppy*/ 7) {
    			{
    				const options = Object.assign(Object.assign({ id: 'svelte:StatusBar' }, props), { target: container });
    				uppy.setOptions(options);
    			}
    		}
    	};

    	return [container, uppy, props, div_binding];
    }

    class StatusBar extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, { uppy: 1, props: 2 });
    	}
    }

    exports.Dashboard = Dashboard;
    exports.DashboardModal = DashboardModal;
    exports.DragDrop = DragDrop;
    exports.ProgressBar = ProgressBar;
    exports.StatusBar = StatusBar;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
