import { clsx } from "clsx";
import * as devalue from "devalue";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
//#region node_modules/svelte/src/escaping.js
var ATTR_REGEX = /[&"<]/g;
var CONTENT_REGEX = /[&<]/g;
/**
* @template V
* @param {V} value
* @param {boolean} [is_attr]
*/
function escape_html(value, is_attr) {
	const str = String(value ?? "");
	const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
	pattern.lastIndex = 0;
	let escaped = "";
	let last = 0;
	while (pattern.test(str)) {
		const i = pattern.lastIndex - 1;
		const ch = str[i];
		escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === "\"" ? "&quot;" : "&lt;");
		last = i + 1;
	}
	return escaped + str.substring(last);
}
Array.isArray;
Array.prototype.indexOf;
Array.prototype.includes;
Array.from;
Array.prototype;
var has_own_property = Object.prototype.hasOwnProperty;
var noop = () => {};
/**
* TODO replace with Promise.withResolvers once supported widely enough
* @template [T=void]
*/
function deferred() {
	/** @type {(value: T) => void} */
	var resolve;
	/** @type {(reason: any) => void} */
	var reject;
	return {
		promise: new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		resolve,
		reject
	};
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
/**
* `<div translate={false}>` should be rendered as `<div translate="no">` and _not_
* `<div translate="false">`, which is equivalent to `<div translate="yes">`. There
* may be other odd cases that need to be added to this list in future
* @type {Record<string, Map<any, string>>}
*/
var replacements = { translate: new Map([[true, "yes"], [false, "no"]]) };
/**
* @template V
* @param {string} name
* @param {V} value
* @param {boolean} [is_boolean]
* @returns {string}
*/
function attr(name, value, is_boolean = false) {
	if (name === "hidden" && value !== "until-found") is_boolean = true;
	if (value == null || !value && is_boolean) return "";
	const normalized = has_own_property.call(replacements, name) && replacements[name].get(value) || value;
	return ` ${name}${is_boolean ? `=""` : `="${escape_html(normalized, true)}"`}`;
}
/**
* Small wrapper around clsx to preserve Svelte's (weird) handling of falsy values.
* TODO Svelte 6 revisit this, and likely turn all falsy values into the empty string (what clsx also does)
* @param  {any} value
*/
function clsx$1(value) {
	if (typeof value === "object") return clsx(value);
	else return value ?? "";
}
var whitespace = [..." 	\n\r\f\xA0\v﻿"];
/**
* @param {any} value
* @param {string | null} [hash]
* @param {Record<string, boolean>} [directives]
* @returns {string | null}
*/
function to_class(value, hash, directives) {
	var classname = value == null ? "" : "" + value;
	if (hash) classname = classname ? classname + " " + hash : hash;
	if (directives) {
		for (var key of Object.keys(directives)) if (directives[key]) classname = classname ? classname + " " + key : key;
		else if (classname.length) {
			var len = key.length;
			var a = 0;
			while ((a = classname.indexOf(key, a)) >= 0) {
				var b = a + len;
				if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
				else a = b;
			}
		}
	}
	return classname === "" ? null : classname;
}
/**
*
* @param {Record<string,any>} styles
* @param {boolean} important
*/
function append_styles(styles, important = false) {
	var separator = important ? " !important;" : ";";
	var css = "";
	for (var key of Object.keys(styles)) {
		var value = styles[key];
		if (value != null && value !== "") css += " " + key + ": " + value + separator;
	}
	return css;
}
/**
* @param {string} name
* @returns {string}
*/
function to_css_name(name) {
	if (name[0] !== "-" || name[1] !== "-") return name.toLowerCase();
	return name;
}
/**
* @param {any} value
* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [styles]
* @returns {string | null}
*/
function to_style(value, styles) {
	if (styles) {
		var new_style = "";
		/** @type {Record<string,any> | undefined} */
		var normal_styles;
		/** @type {Record<string,any> | undefined} */
		var important_styles;
		if (Array.isArray(styles)) {
			normal_styles = styles[0];
			important_styles = styles[1];
		} else normal_styles = styles;
		if (value) {
			value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			/** @type {boolean | '"' | "'"} */
			var in_str = false;
			var in_apo = 0;
			var in_comment = false;
			var reserved_names = [];
			if (normal_styles) reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
			if (important_styles) reserved_names.push(...Object.keys(important_styles).map(to_css_name));
			var start_index = 0;
			var name_index = -1;
			const len = value.length;
			for (var i = 0; i < len; i++) {
				var c = value[i];
				if (in_comment) {
					if (c === "/" && value[i - 1] === "*") in_comment = false;
				} else if (in_str) {
					if (in_str === c) in_str = false;
				} else if (c === "/" && value[i + 1] === "*") in_comment = true;
				else if (c === "\"" || c === "'") in_str = c;
				else if (c === "(") in_apo++;
				else if (c === ")") in_apo--;
				if (!in_comment && in_str === false && in_apo === 0) {
					if (c === ":" && name_index === -1) name_index = i;
					else if (c === ";" || i === len - 1) {
						if (name_index !== -1) {
							var name = to_css_name(value.substring(start_index, name_index).trim());
							if (!reserved_names.includes(name)) {
								if (c !== ";") i++;
								var property = value.substring(start_index, i).trim();
								new_style += " " + property + ";";
							}
						}
						start_index = i + 1;
						name_index = -1;
					}
				}
			}
		}
		if (normal_styles) new_style += append_styles(normal_styles);
		if (important_styles) new_style += append_styles(important_styles, true);
		new_style = new_style.trim();
		return new_style === "" ? null : new_style;
	}
	return value == null ? null : String(value);
}
//#endregion
//#region node_modules/svelte/src/internal/client/constants.js
var CLEAN = 1024;
var DIRTY = 2048;
var MAYBE_DIRTY = 4096;
/**
* 'Transparent' effects do not create a transition boundary.
* This is on a block effect 99% of the time but may also be on a branch effect if its parent block effect was pruned
*/
var EFFECT_TRANSPARENT = 65536;
var EFFECT_PRESERVED = 1 << 19;
/** allow users to ignore aborted signal errors if `reason.name === 'StaleReactionError` */
var STALE_REACTION = new class StaleReactionError extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
/** True if experimental.async=true */
var async_mode_flag = false;
~(DIRTY | MAYBE_DIRTY | CLEAN);
EFFECT_TRANSPARENT | EFFECT_PRESERVED;
//#endregion
//#region node_modules/svelte/src/internal/server/hydration.js
var BLOCK_OPEN = `<!--[-->`;
var BLOCK_CLOSE = `<!--]-->`;
var EMPTY_COMMENT = `<!---->`;
//#endregion
//#region node_modules/svelte/src/utils.js
var VOID_ELEMENT_NAMES = [
	"area",
	"base",
	"br",
	"col",
	"command",
	"embed",
	"hr",
	"img",
	"input",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
];
/**
* Returns `true` if `name` is of a void element
* @param {string} name
*/
function is_void(name) {
	return VOID_ELEMENT_NAMES.includes(name) || name.toLowerCase() === "!doctype";
}
/**
* Attributes that are boolean, i.e. they are present or not present.
*/
var DOM_BOOLEAN_ATTRIBUTES = [
	"allowfullscreen",
	"async",
	"autofocus",
	"autoplay",
	"checked",
	"controls",
	"default",
	"disabled",
	"formnovalidate",
	"indeterminate",
	"inert",
	"ismap",
	"loop",
	"multiple",
	"muted",
	"nomodule",
	"novalidate",
	"open",
	"playsinline",
	"readonly",
	"required",
	"reversed",
	"seamless",
	"selected",
	"webkitdirectory",
	"defer",
	"disablepictureinpicture",
	"disableremoteplayback"
];
/**
* Returns `true` if `name` is a boolean attribute
* @param {string} name
*/
function is_boolean_attribute(name) {
	return DOM_BOOLEAN_ATTRIBUTES.includes(name);
}
[...DOM_BOOLEAN_ATTRIBUTES];
/** List of elements that require raw contents and should not have SSR comments put in them */
var RAW_TEXT_ELEMENTS = [
	"textarea",
	"script",
	"style",
	"title"
];
/** @param {string} name */
function is_raw_text_element(name) {
	return RAW_TEXT_ELEMENTS.includes(name);
}
var REGEX_VALID_TAG_NAME = /^[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z0-9.\-_\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}]+)*$/u;
//#endregion
//#region node_modules/svelte/src/internal/server/abort-signal.js
/** @type {AbortController | null} */
var controller = null;
function abort() {
	controller?.abort(STALE_REACTION);
	controller = null;
}
//#endregion
//#region node_modules/svelte/src/internal/server/errors.js
/**
* The node API `AsyncLocalStorage` is not available, but is required to use async server rendering.
* @returns {never}
*/
function async_local_storage_unavailable() {
	const error = /* @__PURE__ */ new Error(`async_local_storage_unavailable\nThe node API \`AsyncLocalStorage\` is not available, but is required to use async server rendering.\nhttps://svelte.dev/e/async_local_storage_unavailable`);
	error.name = "Svelte error";
	throw error;
}
/**
* Encountered asynchronous work while rendering synchronously.
* @returns {never}
*/
function await_invalid() {
	const error = /* @__PURE__ */ new Error(`await_invalid\nEncountered asynchronous work while rendering synchronously.\nhttps://svelte.dev/e/await_invalid`);
	error.name = "Svelte error";
	throw error;
}
/**
* `<svelte:element this="%tag%">` is not a valid element name — the element will not be rendered
* @param {string} tag
* @returns {never}
*/
function dynamic_element_invalid_tag(tag) {
	const error = /* @__PURE__ */ new Error(`dynamic_element_invalid_tag\n\`<svelte:element this="${tag}">\` is not a valid element name — the element will not be rendered\nhttps://svelte.dev/e/dynamic_element_invalid_tag`);
	error.name = "Svelte error";
	throw error;
}
/**
* The `html` property of server render results has been deprecated. Use `body` instead.
* @returns {never}
*/
function html_deprecated() {
	const error = /* @__PURE__ */ new Error(`html_deprecated\nThe \`html\` property of server render results has been deprecated. Use \`body\` instead.\nhttps://svelte.dev/e/html_deprecated`);
	error.name = "Svelte error";
	throw error;
}
/**
* `csp.nonce` was set while `csp.hash` was `true`. These options cannot be used simultaneously.
* @returns {never}
*/
function invalid_csp() {
	const error = /* @__PURE__ */ new Error(`invalid_csp\n\`csp.nonce\` was set while \`csp.hash\` was \`true\`. These options cannot be used simultaneously.\nhttps://svelte.dev/e/invalid_csp`);
	error.name = "Svelte error";
	throw error;
}
/**
* The `idPrefix` option cannot include `--`.
* @returns {never}
*/
function invalid_id_prefix() {
	const error = /* @__PURE__ */ new Error(`invalid_id_prefix\nThe \`idPrefix\` option cannot include \`--\`.\nhttps://svelte.dev/e/invalid_id_prefix`);
	error.name = "Svelte error";
	throw error;
}
/**
* Could not resolve `render` context.
* @returns {never}
*/
function server_context_required() {
	const error = /* @__PURE__ */ new Error(`server_context_required\nCould not resolve \`render\` context.\nhttps://svelte.dev/e/server_context_required`);
	error.name = "Svelte error";
	throw error;
}
//#endregion
//#region node_modules/svelte/src/internal/server/context.js
/** @import { SSRContext } from '#server' */
/** @type {SSRContext | null} */
var ssr_context = null;
/** @param {SSRContext | null} v */
function set_ssr_context(v) {
	ssr_context = v;
}
/**
* @param {Function} [fn]
*/
function push(fn) {
	ssr_context = {
		p: ssr_context,
		c: null,
		r: null
	};
}
function pop() {
	ssr_context = ssr_context.p;
}
/**
* A `hydratable` value with key `%key%` was created, but at least part of it was not used during the render.
* 
* The `hydratable` was initialized in:
* %stack%
* @param {string} key
* @param {string} stack
*/
function unresolved_hydratable(key, stack) {
	console.warn(`https://svelte.dev/e/unresolved_hydratable`);
}
//#endregion
//#region node_modules/svelte/src/internal/server/render-context.js
/** @import { AsyncLocalStorage } from 'node:async_hooks' */
/** @import { RenderContext } from '#server' */
/** @type {Promise<void> | null} */
var current_render = null;
/** @type {RenderContext | null} */
var context = null;
/** @returns {RenderContext} */
function get_render_context() {
	const store = context ?? als?.getStore();
	if (!store) server_context_required();
	return store;
}
/**
* @template T
* @param {() => Promise<T>} fn
* @returns {Promise<T>}
*/
async function with_render_context(fn) {
	context = { hydratable: {
		lookup: /* @__PURE__ */ new Map(),
		comparisons: [],
		unresolved_promises: /* @__PURE__ */ new Map()
	} };
	if (in_webcontainer()) {
		const { promise, resolve } = deferred();
		const previous_render = current_render;
		current_render = promise;
		await previous_render;
		return fn().finally(resolve);
	}
	try {
		if (als === null) async_local_storage_unavailable();
		return als.run(context, fn);
	} finally {
		context = null;
	}
}
/** @type {AsyncLocalStorage<RenderContext | null> | null} */
var als = null;
/** @type {Promise<void> | null} */
var als_import = null;
/**
*
* @returns {Promise<void>}
*/
function init_render_context() {
	als_import ??= import("node:async_hooks").then((hooks) => {
		als = new hooks.AsyncLocalStorage();
	}).then(noop, noop);
	return als_import;
}
function in_webcontainer() {
	return !!globalThis.process?.versions?.webcontainer;
}
//#endregion
//#region node_modules/svelte/src/internal/server/crypto.js
var text_encoder;
var crypto;
/** @param {string} module_name */
var obfuscated_import = (module_name) => import(
	/* @vite-ignore */
	module_name
);
/** @param {string} data */
async function sha256(data) {
	text_encoder ??= new TextEncoder();
	crypto ??= globalThis.crypto?.subtle?.digest ? globalThis.crypto : (await obfuscated_import("node:crypto")).webcrypto;
	return base64_encode(await crypto.subtle.digest("SHA-256", text_encoder.encode(data)));
}
/**
* @param {Uint8Array} bytes
* @returns {string}
*/
function base64_encode(bytes) {
	if (globalThis.Buffer) return globalThis.Buffer.from(bytes).toString("base64");
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary);
}
//#endregion
//#region node_modules/svelte/src/internal/server/renderer.js
/** @import { Component } from 'svelte' */
/** @import { Csp, HydratableContext, RenderOutput, SSRContext, SyncRenderOutput, Sha256Source } from './types.js' */
/** @import { MaybePromise } from '#shared' */
/** @typedef {'head' | 'body'} RendererType */
/** @typedef {{ [key in RendererType]: string }} AccumulatedContent */
/**
* @typedef {string | Renderer} RendererItem
*/
/**
* Renderers are basically a tree of `string | Renderer`s, where each `Renderer` in the tree represents
* work that may or may not have completed. A renderer can be {@link collect}ed to aggregate the
* content from itself and all of its children, but this will throw if any of the children are
* performing asynchronous work. To asynchronously collect a renderer, just `await` it.
*
* The `string` values within a renderer are always associated with the {@link type} of that renderer. To switch types,
* call {@link child} with a different `type` argument.
*/
var Renderer = class Renderer {
	/**
	* The contents of the renderer.
	* @type {RendererItem[]}
	*/
	#out = [];
	/**
	* Any `onDestroy` callbacks registered during execution of this renderer.
	* @type {(() => void)[] | undefined}
	*/
	#on_destroy = void 0;
	/**
	* Whether this renderer is a component body.
	* @type {boolean}
	*/
	#is_component_body = false;
	/**
	* If set, this renderer is an error boundary. When async collection
	* of the children fails, the failed snippet is rendered instead.
	* @type {{
	* 	failed: (renderer: Renderer, error: unknown, reset: () => void) => void;
	* 	transformError: (error: unknown) => unknown;
	* 	context: SSRContext | null;
	* } | null}
	*/
	#boundary = null;
	/**
	* The type of string content that this renderer is accumulating.
	* @type {RendererType}
	*/
	type;
	/** @type {Renderer | undefined} */
	#parent;
	/**
	* Asynchronous work associated with this renderer
	* @type {Promise<void> | undefined}
	*/
	promise = void 0;
	/**
	* State which is associated with the content tree as a whole.
	* It will be re-exposed, uncopied, on all children.
	* @type {SSRState}
	* @readonly
	*/
	global;
	/**
	* State that is local to the branch it is declared in.
	* It will be shallow-copied to all children.
	*
	* @type {{ select_value: string | undefined }}
	*/
	local;
	/**
	* @param {SSRState} global
	* @param {Renderer | undefined} [parent]
	*/
	constructor(global, parent) {
		this.#parent = parent;
		this.global = global;
		this.local = parent ? { ...parent.local } : { select_value: void 0 };
		this.type = parent ? parent.type : "body";
	}
	/**
	* @param {(renderer: Renderer) => void} fn
	*/
	head(fn) {
		const head = new Renderer(this.global, this);
		head.type = "head";
		this.#out.push(head);
		head.child(fn);
	}
	/**
	* @param {Array<Promise<void>>} blockers
	* @param {(renderer: Renderer) => void} fn
	*/
	async_block(blockers, fn) {
		this.#out.push(BLOCK_OPEN);
		this.async(blockers, fn);
		this.#out.push(BLOCK_CLOSE);
	}
	/**
	* @param {Array<Promise<void>>} blockers
	* @param {(renderer: Renderer) => void} fn
	*/
	async(blockers, fn) {
		let callback = fn;
		if (blockers.length > 0) {
			const context = ssr_context;
			callback = (renderer) => {
				return Promise.all(blockers).then(() => {
					const previous_context = ssr_context;
					try {
						set_ssr_context(context);
						return fn(renderer);
					} finally {
						set_ssr_context(previous_context);
					}
				});
			};
		}
		this.child(callback);
	}
	/**
	* @param {Array<() => void>} thunks
	*/
	run(thunks) {
		const context = ssr_context;
		let promise = Promise.resolve(thunks[0]());
		const promises = [promise];
		for (const fn of thunks.slice(1)) {
			promise = promise.then(() => {
				const previous_context = ssr_context;
				set_ssr_context(context);
				try {
					return fn();
				} finally {
					set_ssr_context(previous_context);
				}
			});
			promises.push(promise);
		}
		promise.catch(noop);
		this.promise = promise;
		return promises;
	}
	/**
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	*/
	child_block(fn) {
		this.#out.push(BLOCK_OPEN);
		this.child(fn);
		this.#out.push(BLOCK_CLOSE);
	}
	/**
	* Create a child renderer. The child renderer inherits the state from the parent,
	* but has its own content.
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	*/
	child(fn) {
		const child = new Renderer(this.global, this);
		this.#out.push(child);
		const parent = ssr_context;
		set_ssr_context({
			...ssr_context,
			p: parent,
			c: null,
			r: child
		});
		const result = fn(child);
		set_ssr_context(parent);
		if (result instanceof Promise) {
			result.catch(noop);
			result.finally(() => set_ssr_context(null)).catch(noop);
			if (child.global.mode === "sync") await_invalid();
			child.promise = result;
		}
		return child;
	}
	/**
	* Render children inside an error boundary. If the children throw and the API-level
	* `transformError` transform handles the error (doesn't re-throw), the `failed` snippet is
	* rendered instead. Otherwise the error propagates.
	*
	* @param {{ failed?: (renderer: Renderer, error: unknown, reset: () => void) => void }} props
	* @param {(renderer: Renderer) => MaybePromise<void>} children_fn
	*/
	boundary(props, children_fn) {
		const child = new Renderer(this.global, this);
		this.#out.push(child);
		const parent_context = ssr_context;
		if (props.failed) child.#boundary = {
			failed: props.failed,
			transformError: this.global.transformError,
			context: parent_context
		};
		set_ssr_context({
			...ssr_context,
			p: parent_context,
			c: null,
			r: child
		});
		try {
			const result = children_fn(child);
			set_ssr_context(parent_context);
			if (result instanceof Promise) {
				if (child.global.mode === "sync") await_invalid();
				result.catch(noop);
				child.promise = result;
			}
		} catch (error) {
			set_ssr_context(parent_context);
			const failed_snippet = props.failed;
			if (!failed_snippet) throw error;
			const result = this.global.transformError(error);
			child.#out.length = 0;
			child.#boundary = null;
			if (result instanceof Promise) {
				if (this.global.mode === "sync") await_invalid();
				child.promise = result.then((transformed) => {
					set_ssr_context(parent_context);
					child.#out.push(Renderer.#serialize_failed_boundary(transformed));
					failed_snippet(child, transformed, noop);
					child.#out.push(BLOCK_CLOSE);
				});
				child.promise.catch(noop);
			} else {
				child.#out.push(Renderer.#serialize_failed_boundary(result));
				failed_snippet(child, result, noop);
				child.#out.push(BLOCK_CLOSE);
			}
		}
	}
	/**
	* Create a component renderer. The component renderer inherits the state from the parent,
	* but has its own content. It is treated as an ordering boundary for ondestroy callbacks.
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	* @param {Function} [component_fn]
	* @returns {void}
	*/
	component(fn, component_fn) {
		push(component_fn);
		const child = this.child(fn);
		child.#is_component_body = true;
		pop();
	}
	/**
	* @param {Record<string, any>} attrs
	* @param {(renderer: Renderer) => void} fn
	* @param {string | undefined} [css_hash]
	* @param {Record<string, boolean> | undefined} [classes]
	* @param {Record<string, string> | undefined} [styles]
	* @param {number | undefined} [flags]
	* @param {boolean | undefined} [is_rich]
	* @returns {void}
	*/
	select(attrs, fn, css_hash, classes, styles, flags, is_rich) {
		const { value, ...select_attrs } = attrs;
		this.push(`<select${attributes(select_attrs, css_hash, classes, styles, flags)}>`);
		this.child((renderer) => {
			renderer.local.select_value = value;
			fn(renderer);
		});
		this.push(`${is_rich ? "<!>" : ""}</select>`);
	}
	/**
	* @param {Record<string, any>} attrs
	* @param {string | number | boolean | ((renderer: Renderer) => void)} body
	* @param {string | undefined} [css_hash]
	* @param {Record<string, boolean> | undefined} [classes]
	* @param {Record<string, string> | undefined} [styles]
	* @param {number | undefined} [flags]
	* @param {boolean | undefined} [is_rich]
	*/
	option(attrs, body, css_hash, classes, styles, flags, is_rich) {
		this.#out.push(`<option${attributes(attrs, css_hash, classes, styles, flags)}`);
		/**
		* @param {Renderer} renderer
		* @param {any} value
		* @param {{ head?: string, body: any }} content
		*/
		const close = (renderer, value, { head, body }) => {
			if (has_own_property.call(attrs, "value")) value = attrs.value;
			if (value === this.local.select_value) renderer.#out.push(" selected=\"\"");
			renderer.#out.push(`>${body}${is_rich ? "<!>" : ""}</option>`);
			if (head) renderer.head((child) => child.push(head));
		};
		if (typeof body === "function") this.child((renderer) => {
			const r = new Renderer(this.global, this);
			body(r);
			if (this.global.mode === "async") return r.#collect_content_async().then((content) => {
				close(renderer, content.body.replaceAll("<!---->", ""), content);
			});
			else {
				const content = r.#collect_content();
				close(renderer, content.body.replaceAll("<!---->", ""), content);
			}
		});
		else close(this, body, { body: escape_html(body) });
	}
	/**
	* @param {(renderer: Renderer) => void} fn
	*/
	title(fn) {
		const path = this.get_path();
		/** @param {string} head */
		const close = (head) => {
			this.global.set_title(head, path);
		};
		this.child((renderer) => {
			const r = new Renderer(renderer.global, renderer);
			fn(r);
			if (renderer.global.mode === "async") return r.#collect_content_async().then((content) => {
				close(content.head);
			});
			else close(r.#collect_content().head);
		});
	}
	/**
	* @param {string | (() => Promise<string>)} content
	*/
	push(content) {
		if (typeof content === "function") this.child(async (renderer) => renderer.push(await content()));
		else this.#out.push(content);
	}
	/**
	* @param {() => void} fn
	*/
	on_destroy(fn) {
		(this.#on_destroy ??= []).push(fn);
	}
	/**
	* @returns {number[]}
	*/
	get_path() {
		return this.#parent ? [...this.#parent.get_path(), this.#parent.#out.indexOf(this)] : [];
	}
	/**
	* @deprecated this is needed for legacy component bindings
	*/
	copy() {
		const copy = new Renderer(this.global, this.#parent);
		copy.#out = this.#out.map((item) => item instanceof Renderer ? item.copy() : item);
		copy.promise = this.promise;
		return copy;
	}
	/**
	* @param {Renderer} other
	* @deprecated this is needed for legacy component bindings
	*/
	subsume(other) {
		if (this.global.mode !== other.global.mode) throw new Error("invariant: A renderer cannot switch modes. If you're seeing this, there's a compiler bug. File an issue!");
		this.local = other.local;
		this.#out = other.#out.map((item, i) => {
			const current = this.#out[i];
			if (current instanceof Renderer && item instanceof Renderer) {
				current.subsume(item);
				return current;
			}
			return item;
		});
		this.promise = other.promise;
		this.type = other.type;
	}
	get length() {
		return this.#out.length;
	}
	/**
	* Creates the hydration comment that marks the start of a failed boundary.
	* The error is JSON-serialized and embedded inside an HTML comment for the client
	* to parse during hydration. The JSON is escaped to prevent `-->` or `<!--` sequences
	* from breaking out of the comment (XSS). Uses unicode escapes which `JSON.parse()`
	* handles transparently.
	* @param {unknown} error
	* @returns {string}
	*/
	static #serialize_failed_boundary(error) {
		return `<!--[?${JSON.stringify(error).replace(/>/g, "\\u003e").replace(/</g, "\\u003c")}-->`;
	}
	/**
	* Only available on the server and when compiling with the `server` option.
	* Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} [options]
	* @returns {RenderOutput}
	*/
	static render(component, options = {}) {
		/** @type {AccumulatedContent | undefined} */
		let sync;
		/** @type {Promise<AccumulatedContent & { hashes: { script: Sha256Source[] } }> | undefined} */
		let async;
		const result = {};
		Object.defineProperties(result, {
			html: { get: () => {
				return (sync ??= Renderer.#render(component, options)).body;
			} },
			head: { get: () => {
				return (sync ??= Renderer.#render(component, options)).head;
			} },
			body: { get: () => {
				return (sync ??= Renderer.#render(component, options)).body;
			} },
			hashes: { value: { script: "" } },
			then: { value: (onfulfilled, onrejected) => {
				if (!async_mode_flag) {
					const result = sync ??= Renderer.#render(component, options);
					const user_result = onfulfilled({
						head: result.head,
						body: result.body,
						html: result.body,
						hashes: { script: [] }
					});
					return Promise.resolve(user_result);
				}
				async ??= init_render_context().then(() => with_render_context(() => Renderer.#render_async(component, options)));
				return async.then((result) => {
					Object.defineProperty(result, "html", { get: () => {
						html_deprecated();
					} });
					return onfulfilled(result);
				}, onrejected);
			} }
		});
		return result;
	}
	/**
	* Collect all of the `onDestroy` callbacks registered during rendering. In an async context, this is only safe to call
	* after awaiting `collect_async`.
	*
	* Child renderers are "porous" and don't affect execution order, but component body renderers
	* create ordering boundaries. Within a renderer, callbacks run in order until hitting a component boundary.
	* @returns {Iterable<() => void>}
	*/
	*#collect_on_destroy() {
		for (const component of this.#traverse_components()) yield* component.#collect_ondestroy();
	}
	/**
	* Performs a depth-first search of renderers, yielding the deepest components first, then additional components as we backtrack up the tree.
	* @returns {Iterable<Renderer>}
	*/
	*#traverse_components() {
		for (const child of this.#out) if (typeof child !== "string") yield* child.#traverse_components();
		if (this.#is_component_body) yield this;
	}
	/**
	* @returns {Iterable<() => void>}
	*/
	*#collect_ondestroy() {
		if (this.#on_destroy) for (const fn of this.#on_destroy) yield fn;
		for (const child of this.#out) if (child instanceof Renderer && !child.#is_component_body) yield* child.#collect_ondestroy();
	}
	/**
	* Render a component. Throws if any of the children are performing asynchronous work.
	*
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string }} options
	* @returns {AccumulatedContent}
	*/
	static #render(component, options) {
		var previous_context = ssr_context;
		try {
			const renderer = Renderer.#open_render("sync", component, options);
			const content = renderer.#collect_content();
			return Renderer.#close_render(content, renderer);
		} finally {
			abort();
			set_ssr_context(previous_context);
		}
	}
	/**
	* Render a component.
	*
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} options
	* @returns {Promise<AccumulatedContent & { hashes: { script: Sha256Source[] } }>}
	*/
	static async #render_async(component, options) {
		const previous_context = ssr_context;
		try {
			const renderer = Renderer.#open_render("async", component, options);
			const content = await renderer.#collect_content_async();
			const hydratables = await renderer.#collect_hydratables();
			if (hydratables !== null) content.head = hydratables + content.head;
			return Renderer.#close_render(content, renderer);
		} finally {
			set_ssr_context(previous_context);
			abort();
		}
	}
	/**
	* Collect all of the code from the `out` array and return it as a string, or a promise resolving to a string.
	* @param {AccumulatedContent} content
	* @returns {AccumulatedContent}
	*/
	#collect_content(content = {
		head: "",
		body: ""
	}) {
		for (const item of this.#out) if (typeof item === "string") content[this.type] += item;
		else if (item instanceof Renderer) item.#collect_content(content);
		return content;
	}
	/**
	* Collect all of the code from the `out` array and return it as a string.
	* @param {AccumulatedContent} content
	* @returns {Promise<AccumulatedContent>}
	*/
	async #collect_content_async(content = {
		head: "",
		body: ""
	}) {
		await this.promise;
		for (const item of this.#out) if (typeof item === "string") content[this.type] += item;
		else if (item instanceof Renderer) if (item.#boundary) {
			/** @type {AccumulatedContent} */
			const boundary_content = {
				head: "",
				body: ""
			};
			try {
				await item.#collect_content_async(boundary_content);
				content.head += boundary_content.head;
				content.body += boundary_content.body;
			} catch (error) {
				const { context, failed, transformError } = item.#boundary;
				set_ssr_context(context);
				let transformed = await transformError(error);
				const failed_renderer = new Renderer(item.global, item);
				failed_renderer.type = item.type;
				failed_renderer.#out.push(Renderer.#serialize_failed_boundary(transformed));
				failed(failed_renderer, transformed, noop);
				failed_renderer.#out.push(BLOCK_CLOSE);
				await failed_renderer.#collect_content_async(content);
			}
		} else await item.#collect_content_async(content);
		return content;
	}
	async #collect_hydratables() {
		const ctx = get_render_context().hydratable;
		for (const [_, key] of ctx.unresolved_promises) unresolved_hydratable(key, ctx.lookup.get(key)?.stack ?? "<missing stack trace>");
		for (const comparison of ctx.comparisons) await comparison;
		return await this.#hydratable_block(ctx);
	}
	/**
	* @template {Record<string, any>} Props
	* @param {'sync' | 'async'} mode
	* @param {import('svelte').Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp; transformError?: (error: unknown) => unknown }} options
	* @returns {Renderer}
	*/
	static #open_render(mode, component, options) {
		if (options.idPrefix?.includes("--")) invalid_id_prefix();
		var previous_context = ssr_context;
		try {
			const renderer = new Renderer(new SSRState(mode, options.idPrefix ? options.idPrefix + "-" : "", options.csp, options.transformError));
			set_ssr_context({
				p: null,
				c: options.context ?? null,
				r: renderer
			});
			renderer.push(BLOCK_OPEN);
			component(renderer, options.props ?? {});
			renderer.push(BLOCK_CLOSE);
			return renderer;
		} finally {
			set_ssr_context(previous_context);
		}
	}
	/**
	* @param {AccumulatedContent} content
	* @param {Renderer} renderer
	* @returns {AccumulatedContent & { hashes: { script: Sha256Source[] } }}
	*/
	static #close_render(content, renderer) {
		for (const cleanup of renderer.#collect_on_destroy()) cleanup();
		let head = content.head + renderer.global.get_title();
		let body = content.body;
		for (const { hash, code } of renderer.global.css) head += `<style id="${hash}">${code}</style>`;
		return {
			head,
			body,
			hashes: { script: renderer.global.csp.script_hashes }
		};
	}
	/**
	* @param {HydratableContext} ctx
	*/
	async #hydratable_block(ctx) {
		if (ctx.lookup.size === 0) return null;
		let entries = [];
		let has_promises = false;
		for (const [k, v] of ctx.lookup) {
			if (v.promises) {
				has_promises = true;
				for (const p of v.promises) await p;
			}
			entries.push(`[${devalue.uneval(k)},${v.serialized}]`);
		}
		let prelude = `const h = (window.__svelte ??= {}).h ??= new Map();`;
		if (has_promises) prelude = `const r = (v) => Promise.resolve(v);
				${prelude}`;
		const body = `
			{
				${prelude}

				for (const [k, v] of [
					${entries.join(",\n					")}
				]) {
					h.set(k, v);
				}
			}
		`;
		let csp_attr = "";
		if (this.global.csp.nonce) csp_attr = ` nonce="${this.global.csp.nonce}"`;
		else if (this.global.csp.hash) {
			const hash = await sha256(body);
			this.global.csp.script_hashes.push(`sha256-${hash}`);
		}
		return `\n\t\t<script${csp_attr}>${body}<\/script>`;
	}
};
var SSRState = class {
	/** @readonly @type {Csp & { script_hashes: Sha256Source[] }} */
	csp;
	/** @readonly @type {'sync' | 'async'} */
	mode;
	/** @readonly @type {() => string} */
	uid;
	/** @readonly @type {Set<{ hash: string; code: string }>} */
	css = /* @__PURE__ */ new Set();
	/**
	* `transformError` passed to `render`. Called when an error boundary catches an error.
	* Throws by default if unset in `render`.
	* @type {(error: unknown) => unknown}
	*/
	transformError;
	/** @type {{ path: number[], value: string }} */
	#title = {
		path: [],
		value: ""
	};
	/**
	* @param {'sync' | 'async'} mode
	* @param {string} id_prefix
	* @param {Csp} csp
	* @param {((error: unknown) => unknown) | undefined} [transformError]
	*/
	constructor(mode, id_prefix = "", csp = { hash: false }, transformError) {
		this.mode = mode;
		this.csp = {
			...csp,
			script_hashes: []
		};
		this.transformError = transformError ?? ((error) => {
			throw error;
		});
		let uid = 1;
		this.uid = () => `${id_prefix}s${uid++}`;
	}
	get_title() {
		return this.#title.value;
	}
	/**
	* Performs a depth-first (lexicographic) comparison using the path. Rejects sets
	* from earlier than or equal to the current value.
	* @param {string} value
	* @param {number[]} path
	*/
	set_title(value, path) {
		const current = this.#title.path;
		let i = 0;
		let l = Math.min(path.length, current.length);
		while (i < l && path[i] === current[i]) i += 1;
		if (path[i] === void 0) return;
		if (current[i] === void 0 || path[i] > current[i]) {
			this.#title.path = path;
			this.#title.value = value;
		}
	}
};
//#endregion
//#region node_modules/svelte/src/internal/server/index.js
var INVALID_ATTR_NAME_CHAR_REGEX = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
/**
* @param {Renderer} renderer
* @param {string} tag
* @param {() => void} attributes_fn
* @param {() => void} children_fn
* @returns {void}
*/
function element(renderer, tag, attributes_fn = noop, children_fn = noop) {
	renderer.push("<!---->");
	if (tag) {
		if (!REGEX_VALID_TAG_NAME.test(tag)) dynamic_element_invalid_tag(tag);
		renderer.push(`<${tag}`);
		attributes_fn();
		renderer.push(`>`);
		if (!is_void(tag)) {
			children_fn();
			if (!is_raw_text_element(tag)) renderer.push(EMPTY_COMMENT);
			renderer.push(`</${tag}>`);
		}
	}
	renderer.push("<!---->");
}
/**
* Only available on the server and when compiling with the `server` option.
* Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
* @template {Record<string, any>} Props
* @param {Component<Props> | ComponentType<SvelteComponent<Props>>} component
* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp; transformError?: (error: unknown) => unknown }} [options]
* @returns {RenderOutput}
*/
function render(component, options = {}) {
	if (options.csp?.hash && options.csp.nonce) invalid_csp();
	return Renderer.render(component, options);
}
/**
* @param {string} hash
* @param {Renderer} renderer
* @param {(renderer: Renderer) => Promise<void> | void} fn
* @returns {void}
*/
function head(hash, renderer, fn) {
	renderer.head((renderer) => {
		renderer.push(`<!--${hash}-->`);
		renderer.child(fn);
		renderer.push(EMPTY_COMMENT);
	});
}
/**
* @param {Record<string, unknown>} attrs
* @param {string} [css_hash]
* @param {Record<string, boolean>} [classes]
* @param {Record<string, string>} [styles]
* @param {number} [flags]
* @returns {string}
*/
function attributes(attrs, css_hash, classes, styles, flags = 0) {
	if (styles) attrs.style = to_style(attrs.style, styles);
	if (attrs.class) attrs.class = clsx$1(attrs.class);
	if (css_hash || classes) attrs.class = to_class(attrs.class, css_hash, classes);
	let attr_str = "";
	let name;
	const is_html = (flags & 1) === 0;
	const lowercase = (flags & 2) === 0;
	const is_input = (flags & 4) !== 0;
	for (name of Object.keys(attrs)) {
		if (typeof attrs[name] === "function") continue;
		if (name[0] === "$" && name[1] === "$") continue;
		if (INVALID_ATTR_NAME_CHAR_REGEX.test(name)) continue;
		var value = attrs[name];
		var lower = name.toLowerCase();
		if (lowercase) name = lower;
		if (lower.length > 2 && lower.startsWith("on")) continue;
		if (is_input) {
			if (name === "defaultvalue" || name === "defaultchecked") {
				name = name === "defaultvalue" ? "value" : "checked";
				if (attrs[name]) continue;
			}
		}
		attr_str += attr(name, value, is_html && is_boolean_attribute(name));
	}
	return attr_str;
}
/**
* @param {unknown} value
* @returns {string}
*/
function stringify(value) {
	return typeof value === "string" ? value : value == null ? "" : value + "";
}
/**
* @param {any} value
* @param {Record<string,any>|[Record<string,any>,Record<string,any>]} [directives]
*/
function attr_style(value, directives) {
	var result = to_style(value, directives);
	return result ? ` style="${escape_html(result, true)}"` : "";
}
/**
* Legacy mode: If the prop has a fallback and is bound in the
* parent component, propagate the fallback value upwards.
* @param {Record<string, unknown>} props_parent
* @param {Record<string, unknown>} props_now
*/
function bind_props(props_parent, props_now) {
	for (const key of Object.keys(props_now)) {
		const initial_value = props_parent[key];
		const value = props_now[key];
		if (initial_value === void 0 && value !== void 0 && Object.getOwnPropertyDescriptor(props_parent, key)?.set) props_parent[key] = value;
	}
}
/** @param {any} array_like_or_iterator */
function ensure_array_like(array_like_or_iterator) {
	if (array_like_or_iterator) return array_like_or_iterator.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
	return [];
}
var data_default = {
	colorCategories: {
		"agentic": {
			"color": "Amethyst",
			"hex": "#a855f7",
			"name": "Agentic"
		},
		"brandCore": {
			"color": "Apricot",
			"hex": "#fb923c",
			"name": "Brand Core"
		},
		"compliance": {
			"color": "Amber",
			"hex": "#f59e0b",
			"name": "Compliance"
		},
		"execution": {
			"color": "Cyan",
			"hex": "#06b6d4",
			"name": "Execution"
		},
		"financial": {
			"color": "Rose",
			"hex": "#e11d48",
			"name": "Financial"
		},
		"frontend": {
			"color": "Teal",
			"hex": "#14b8a6",
			"name": "Frontend/UI"
		},
		"infrastructure": {
			"color": "Green",
			"hex": "#059669",
			"name": "Infrastructure"
		},
		"intelligence": {
			"color": "Emerald",
			"hex": "#10b981",
			"name": "Intelligence"
		},
		"platform": {
			"color": "Indigo",
			"hex": "#4f46e5",
			"name": "Platform"
		},
		"tooling": {
			"color": "Slate",
			"hex": "#64748b",
			"name": "Dev Tooling"
		}
	},
	meta: {
		"description": "Tooling for the agentic age",
		"name": "vincents.ai",
		"url": "https://vincents.ai"
	},
	palette: {
		"agentic": {
			"hex": "#a855f7",
			"name": "Amethyst"
		},
		"brandCore": {
			"hex": "#fb923c",
			"name": "Apricot"
		},
		"compliance": {
			"hex": "#f59e0b",
			"name": "Amber"
		},
		"dark": {
			"agentic": "#7e22ce",
			"brandCore": "#c2410c",
			"compliance": "#b45309",
			"execution": "#0891b2",
			"financial": "#9f1239",
			"frontend": "#0f766e",
			"infrastructure": "#064e3b",
			"intelligence": "#047857",
			"platform": "#3730a3",
			"tooling": "#334155"
		},
		"execution": {
			"hex": "#06b6d4",
			"name": "Cyan"
		},
		"financial": {
			"hex": "#e11d48",
			"name": "Rose"
		},
		"frontend": {
			"hex": "#14b8a6",
			"name": "Teal"
		},
		"infrastructure": {
			"hex": "#059669",
			"name": "Green"
		},
		"intelligence": {
			"hex": "#10b981",
			"name": "Emerald"
		},
		"light": {
			"agentic": "#d8b4fe",
			"brandCore": "#fdba74",
			"compliance": "#fcd34d",
			"execution": "#67e8f9",
			"financial": "#fda4af",
			"frontend": "#5eead4",
			"infrastructure": "#34d399",
			"intelligence": "#34d399",
			"platform": "#818cf8",
			"tooling": "#94a3b8"
		},
		"platform": {
			"hex": "#4f46e5",
			"name": "Indigo"
		},
		"tooling": {
			"hex": "#64748b",
			"name": "Slate"
		}
	},
	projects: [
		{
			"category": "platform",
			"color": {
				"hex": "#4f46e5",
				"name": "Indigo"
			},
			"colorKey": "platform",
			"description": "Commercial Agentic Development Platform - vertically integrated Git hosting and AI agent orchestration. Built on agentic-repos (open-core). Enterprise modules: backup & recovery (AES-256-GCM), compliance (DORA/NIS2/GDPR/HIPAA), replication, CI/CD, security scanning, webhooks, scaling.",
			"githubUrl": null,
			"id": "adp",
			"localPath": "/home/shift/code/agentic-git/adp",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/adp.jpg",
				"bannerPng": "/assets/banners/vincents/png/adp.png",
				"bannerSvg": "/assets/banners/vincents/svg/adp.svg",
				"jpg": "/assets/icons/vincents/jpg/adp.jpg",
				"png": "/assets/icons/vincents/png/adp.png",
				"svg": "/assets/icons/vincents/svg/adp.svg"
			},
			"tagline": "AGENTIC DEVELOPMENT PLATFORM",
			"title": "ADP"
		},
		{
			"category": "agentic",
			"color": {
				"hex": "#a855f7",
				"name": "Amethyst"
			},
			"colorKey": "agentic",
			"description": "Trait-first AI agent loop system with 14+ crates: WASM plugins, per-project sharded storage, custom Gherkin workflow engine, and engram-evo self-improvement. Features: health monitoring, cost optimization, meta-cognitive reflection.",
			"githubUrl": "https://github.com/vincents-ai/agentic-loop",
			"id": "agentic-loop",
			"localPath": "/home/shift/code/vincents-ai/agentic-loop",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/agentic-loop.jpg",
				"bannerPng": "/assets/banners/vincents/png/agentic-loop.png",
				"bannerSvg": "/assets/banners/vincents/svg/agentic-loop.svg",
				"jpg": "/assets/icons/vincents/jpg/agentic-loop.jpg",
				"png": "/assets/icons/vincents/png/agentic-loop.png",
				"svg": "/assets/icons/vincents/svg/agentic-loop.svg"
			},
			"tagline": "TRAIT-FIRST AI AGENT LOOP",
			"title": "Agentic Loop"
		},
		{
			"category": "infrastructure",
			"color": {
				"hex": "#059669",
				"name": "Green"
			},
			"colorKey": "infrastructure",
			"description": "Open-core AGPL Git server - core of ADP. Provides Git hosting (SSH :2222, HTTP :8090), Git LFS with S3 backend, SSH auth via git refs, REST API, RBAC, and Skylet v2 plugin interface.",
			"githubUrl": "https://github.com/vincents-ai/agentic-repos",
			"id": "agentic-repos",
			"localPath": "/home/shift/code/agentic-git/agentic-repos",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/agentic-repos.jpg",
				"bannerPng": "/assets/banners/vincents/png/agentic-repos.png",
				"bannerSvg": "/assets/banners/vincents/svg/agentic-repos.svg",
				"jpg": "/assets/icons/vincents/jpg/agentic-repos.jpg",
				"png": "/assets/icons/vincents/png/agentic-repos.png",
				"svg": "/assets/icons/vincents/svg/agentic-repos.svg"
			},
			"tagline": "OPEN-CORE GIT SERVER",
			"title": "Agentic Repos"
		},
		{
			"category": "financial",
			"color": {
				"hex": "#e11d48",
				"name": "Rose"
			},
			"colorKey": "financial",
			"description": "Secure authentication service for financial operations and billing. Part of the financial compliance stack for Vincents.ai platform services.",
			"githubUrl": null,
			"id": "billing-auth-service",
			"localPath": "/home/shift/code/eu-compliance-stack/billing-auth-service",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/billing-auth-service.jpg",
				"bannerPng": "/assets/banners/vincents/png/billing-auth-service.png",
				"bannerSvg": "/assets/banners/vincents/svg/billing-auth-service.svg",
				"jpg": "/assets/icons/vincents/jpg/billing-auth-service.jpg",
				"png": "/assets/icons/vincents/png/billing-auth-service.png",
				"svg": "/assets/icons/vincents/svg/billing-auth-service.svg"
			},
			"tagline": "SECURE FINANCIAL GATEKEEPER",
			"title": "Billing Auth Service"
		},
		{
			"category": "financial",
			"color": {
				"hex": "#e11d48",
				"name": "Rose"
			},
			"colorKey": "financial",
			"description": "Multi-provider billing routing middleware with cost optimization, tax calculation, compliance enforcement. Routes transactions to lowest-cost provider (Stripe, Cleverbridge) with real API integrations.",
			"githubUrl": null,
			"id": "billing-middleware",
			"localPath": "/home/shift/code/eu-compliance-stack/billing-middleware",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/billing-middleware.jpg",
				"bannerPng": "/assets/banners/vincents/png/billing-middleware.png",
				"bannerSvg": "/assets/banners/vincents/svg/billing-middleware.svg",
				"jpg": "/assets/icons/vincents/jpg/billing-middleware.jpg",
				"png": "/assets/icons/vincents/png/billing-middleware.png",
				"svg": "/assets/icons/vincents/svg/billing-middleware.svg"
			},
			"tagline": "ROUTING & COST OPTIMIZATION",
			"title": "Billing Middleware"
		},
		{
			"category": "intelligence",
			"color": {
				"hex": "#10b981",
				"name": "Emerald"
			},
			"colorKey": "intelligence",
			"description": "Distributed memory system for AI agents and human operators. Acts as a second brain - capturing context, plans, reasoning chains, and knowledge alongside code. Git-native storage in refs/engram/.",
			"githubUrl": "https://github.com/vincents-ai/engram",
			"id": "engram",
			"localPath": "/home/shift/code/agentic-git/engram",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/engram.jpg",
				"bannerPng": "/assets/banners/vincents/png/engram.png",
				"bannerSvg": "/assets/banners/vincents/svg/engram.svg",
				"jpg": "/assets/icons/vincents/jpg/engram.jpg",
				"png": "/assets/icons/vincents/png/engram.png",
				"svg": "/assets/icons/vincents/svg/engram.svg"
			},
			"tagline": "DISTRIBUTED AI MEMORY LAYER",
			"title": "Engram"
		},
		{
			"category": "tooling",
			"color": {
				"hex": "#64748b",
				"name": "Slate"
			},
			"colorKey": "tooling",
			"description": "Claude Code plugin for autonomous session management and task-driven development. Task management, commit validation, session tracking via Hooks.",
			"githubUrl": "https://github.com/vincents-ai/engram-claude",
			"id": "engram-claude",
			"localPath": "/home/shift/code/vincents-ai/engram-claude",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/engram-claude.jpg",
				"bannerPng": "/assets/banners/vincents/png/engram-claude.png",
				"bannerSvg": "/assets/banners/vincents/svg/engram-claude.svg",
				"jpg": "/assets/icons/vincents/jpg/engram-claude.jpg",
				"png": "/assets/icons/vincents/png/engram-claude.png",
				"svg": "/assets/icons/vincents/svg/engram-claude.svg"
			},
			"tagline": "CLAUDE CODE INTEGRATION",
			"title": "Engram Claude Plugin"
		},
		{
			"category": "tooling",
			"color": {
				"hex": "#64748b",
				"name": "Slate"
			},
			"colorKey": "tooling",
			"description": "OpenCode plugin with autonomous session management, 15-second inactivity monitoring, session tracking, and smart workflow suggestions.",
			"githubUrl": "https://github.com/vincents-ai/engram-opencode",
			"id": "engram-opencode",
			"localPath": "/home/shift/code/vincents-ai/engram-opencode",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/engram-opencode.jpg",
				"bannerPng": "/assets/banners/vincents/png/engram-opencode.png",
				"bannerSvg": "/assets/banners/vincents/svg/engram-opencode.svg",
				"jpg": "/assets/icons/vincents/jpg/engram-opencode.jpg",
				"png": "/assets/icons/vincents/png/engram-opencode.png",
				"svg": "/assets/icons/vincents/svg/engram-opencode.svg"
			},
			"tagline": "OPENCODE INTEGRATION",
			"title": "Engram OpenCode Plugin"
		},
		{
			"category": "compliance",
			"color": {
				"hex": "#f59e0b",
				"name": "Amber"
			},
			"colorKey": "compliance",
			"description": "GRC enrichment engine for vulnerability-to-compliance control mapping. Part of Transparenz ecosystem. Maps CVEs to 74 GRC providers via CWE matching - produces auditable traceability between vulnerabilities and regulatory requirements.",
			"githubUrl": "https://github.com/vincents-ai/enrichment-engine",
			"id": "enrichment-engine",
			"localPath": "/home/shift/code/eu-compliance-stack/enrichment-engine",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/enrichment-engine.jpg",
				"bannerPng": "/assets/banners/vincents/png/enrichment-engine.png",
				"bannerSvg": "/assets/banners/vincents/svg/enrichment-engine.svg",
				"jpg": "/assets/icons/vincents/jpg/enrichment-engine.jpg",
				"png": "/assets/icons/vincents/png/enrichment-engine.png",
				"svg": "/assets/icons/vincents/svg/enrichment-engine.svg"
			},
			"tagline": "GRC VULNERABILITY MAPPING",
			"title": "Enrichment Engine"
		},
		{
			"category": "tooling",
			"color": {
				"hex": "#64748b",
				"name": "Slate"
			},
			"colorKey": "tooling",
			"description": "Standardised Nix modules for vincents-ai projects. Reproducible builds, dev shells, deployment across the ecosystem.",
			"githubUrl": "https://github.com/vincents-ai/nix-modules",
			"id": "nix-modules",
			"localPath": "/home/shift/code/vincents-ai/nix-modules",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/nix-modules.jpg",
				"bannerPng": "/assets/banners/vincents/png/nix-modules.png",
				"bannerSvg": "/assets/banners/vincents/svg/nix-modules.svg",
				"jpg": "/assets/icons/vincents/jpg/nix-modules.jpg",
				"png": "/assets/icons/vincents/png/nix-modules.png",
				"svg": "/assets/icons/vincents/svg/nix-modules.svg"
			},
			"tagline": "CENTRALISED NIX MODULES",
			"title": "Nix Modules"
		},
		{
			"category": "execution",
			"color": {
				"hex": "#06b6d4",
				"name": "Cyan"
			},
			"colorKey": "execution",
			"description": "LLM-powered shell built on shrs with three execution modes (kids/agent/admin). ACL engine, command snapshots, undo/redo, Linux namespace sandboxing.",
			"githubUrl": "https://github.com/vincents-ai/omnishell",
			"id": "omnishell",
			"localPath": "/home/shift/code/agentic-git/omnishell",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/omnishell.jpg",
				"bannerPng": "/assets/banners/vincents/png/omnishell.png",
				"bannerSvg": "/assets/banners/vincents/svg/omnishell.svg",
				"jpg": "/assets/icons/vincents/jpg/omnishell.jpg",
				"png": "/assets/icons/vincents/png/omnishell.png",
				"svg": "/assets/icons/vincents/svg/omnishell.svg"
			},
			"tagline": "INTELLIGENT SHELL WITH ACL",
			"title": "OmniShell"
		},
		{
			"category": "tooling",
			"color": {
				"hex": "#64748b",
				"name": "Slate"
			},
			"colorKey": "tooling",
			"description": "Extensions and skills for the pi coding agent — persistent memory, orchestration, workflow state machines, model failover, and commit enforcement.",
			"githubUrl": "https://github.com/vincents-ai/pi-engram-extensions",
			"id": "pi-engram-extensions",
			"localPath": "/home/shift/code/agentic-git/pi-engram-extensions",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/pi-engram-extensions.jpg",
				"bannerPng": "/assets/banners/vincents/png/pi-engram-extensions.png",
				"bannerSvg": "/assets/banners/vincents/svg/pi-engram-extensions.svg",
				"jpg": "/assets/icons/vincents/jpg/pi-engram-extensions.jpg",
				"png": "/assets/icons/vincents/png/pi-engram-extensions.png",
				"svg": "/assets/icons/vincents/svg/pi-engram-extensions.svg"
			},
			"tagline": "PI CODING AGENT EXTENSIONS",
			"title": "Pi Engram Extensions"
		},
		{
			"category": "execution",
			"color": {
				"hex": "#06b6d4",
				"name": "Cyan"
			},
			"colorKey": "execution",
			"description": "Unified sandbox isolation crate for Vincents.ai - supports Firecracker VMs and containers. Plugin runtime for autonomous agents and microservices.",
			"githubUrl": "https://github.com/vincents-ai/skylet",
			"id": "skylet",
			"localPath": null,
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/skylet.jpg",
				"bannerPng": "/assets/banners/vincents/png/skylet.png",
				"bannerSvg": "/assets/banners/vincents/svg/skylet.svg",
				"jpg": "/assets/icons/vincents/jpg/skylet.jpg",
				"png": "/assets/icons/vincents/png/skylet.png",
				"svg": "/assets/icons/vincents/svg/skylet.svg"
			},
			"tagline": "PLUGGABLE AGENT RUNTIME",
			"title": "Skylet"
		},
		{
			"category": "compliance",
			"color": {
				"hex": "#f59e0b",
				"name": "Amber"
			},
			"colorKey": "compliance",
			"description": "CLI tool for generating, enriching, validating, and submitting BSI TR-03183-2 compliant SBOMs. Features: CycloneDX/SPDX output, SHA-512 hashes, supplier detection, PostgreSQL persistence, Grype vulnerability scanning.",
			"githubUrl": "https://github.com/vincents-ai/transparenz",
			"id": "transparenz",
			"localPath": "/home/shift/code/eu-compliance-stack/transparenz",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/transparenz.jpg",
				"bannerPng": "/assets/banners/vincents/png/transparenz.png",
				"bannerSvg": "/assets/banners/vincents/svg/transparenz.svg",
				"jpg": "/assets/icons/vincents/jpg/transparenz.jpg",
				"png": "/assets/icons/vincents/png/transparenz.png",
				"svg": "/assets/icons/vincents/svg/transparenz.svg"
			},
			"tagline": "EU CRA COMPLIANCE BACKEND",
			"title": "Transparenz"
		},
		{
			"category": "tooling",
			"color": {
				"hex": "#64748b",
				"name": "Slate"
			},
			"colorKey": "tooling",
			"description": "Command-line tool for EU compliance SBOM generation and verification. Standalone vulnerability scanning via native Grype library with compliance scoring (bsi-check).",
			"githubUrl": "https://github.com/vincents-ai/transparenz-cli",
			"id": "transparenz-cli",
			"localPath": "/home/shift/code/eu-compliance-stack/transparenz-server",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/transparenz-cli.jpg",
				"bannerPng": "/assets/banners/vincents/png/transparenz-cli.png",
				"bannerSvg": "/assets/banners/vincents/svg/transparenz-cli.svg",
				"jpg": "/assets/icons/vincents/jpg/transparenz-cli.jpg",
				"png": "/assets/icons/vincents/png/transparenz-cli.png",
				"svg": "/assets/icons/vincents/svg/transparenz-cli.svg"
			},
			"tagline": "BSI TR-03183-2 SBOM TOOLING",
			"title": "Transparenz CLI"
		},
		{
			"category": "compliance",
			"color": {
				"hex": "#f59e0b",
				"name": "Amber"
			},
			"colorKey": "compliance",
			"description": "Collects, transforms, and stores vulnerability data from 28 providers for EU Cyber Resilience Act compliance. Goroutine-based concurrency.",
			"githubUrl": "https://github.com/vincents-ai/vulnz",
			"id": "vulnz",
			"localPath": "/home/shift/code/eu-compliance-stack/vulnz",
			"logoPaths": {
				"bannerJpg": "/assets/banners/vincents/jpg/vulnz.jpg",
				"bannerPng": "/assets/banners/vincents/png/vulnz.png",
				"bannerSvg": "/assets/banners/vincents/svg/vulnz.svg",
				"jpg": "/assets/icons/vincents/jpg/vulnz.jpg",
				"png": "/assets/icons/vincents/png/vulnz.png",
				"svg": "/assets/icons/vincents/svg/vulnz.svg"
			},
			"tagline": "VULNERABILITY DATA COLLECTION",
			"title": "Vulnz"
		}
	]
};
//#endregion
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/lib/components/ui/card/card.svelte
function Card($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, size = "default", $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card",
			"data-size": size,
			class: clsx$1(cn("ring-foreground/10 bg-card text-card-foreground gap-4 overflow-hidden rounded-xl py-4 text-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl group/card flex flex-col", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/badge/badge.svelte
var badgeVariants = tv({
	base: "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:ring-[3px] [&>svg]:pointer-events-none",
	variants: { variant: {
		default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
		secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
		destructive: "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20",
		outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
		ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
		link: "text-primary underline-offset-4 hover:underline"
	} },
	defaultVariants: { variant: "default" }
});
function Badge($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, href, class: className, variant = "default", children, $$slots, $$events, ...restProps } = $$props;
		element($$renderer, href ? "a" : "span", () => {
			$$renderer.push(`${attributes({
				"data-slot": "badge",
				href,
				class: clsx$1(cn(badgeVariants({ variant }), className)),
				...restProps
			})}`);
		}, () => {
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		});
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/App.svelte
function App($$renderer) {
	const { projects, meta } = data_default;
	function isOpenSource(project) {
		return project.githubUrl != null;
	}
	function logoUrl(project) {
		return `/assets/icons/vincents/svg/${project.id}.svg`;
	}
	head("1n46o8q", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>${escape_html(meta.name)} - ${escape_html(meta.description)}</title>`);
		});
		$$renderer.push(`<meta name="description"${attr("content", meta.description)}/> <link rel="robots" href="/robots.txt"/> <link rel="sitemap" href="/sitemap.xml"/> <meta property="og:title"${attr("content", meta.name)}/> <meta property="og:description"${attr("content", meta.description)}/> <meta property="og:type" content="website"/> <meta property="og:url"${attr("content", meta.url)}/> <!--[-->`);
		const each_array = ensure_array_like(projects);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let project = each_array[$$index];
			$$renderer.push(`<link rel="section"${attr("href", `/projects/${stringify(project.id)}/`)}${attr("title", project.title)}/>`);
		}
		$$renderer.push(`<!--]-->`);
	});
	$$renderer.push(`<header class="py-0 px-0"><div class="w-full"><img src="/assets/banners/vincents/svg/vincents-ai.svg" alt="vincents.ai" class="w-full h-auto"/></div></header> <div class="relative h-24 -mt-1 bg-gradient-to-b from-slate-950 via-slate-950 to-transparent"><svg class="absolute inset-x-0 top-0 w-full h-full" viewBox="0 0 1280 100" preserveAspectRatio="none"><path d="M0,0 C400,50 800,0 1280,0 L1280,100 L0,100 Z" fill="url(#wave)"></path><defs><linearGradient id="wave" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#020617" stop-opacity="1"></stop><stop offset="50%" stop-color="#020617" stop-opacity="0.5"></stop><stop offset="100%" stop-color="#020617" stop-opacity="0"></stop></linearGradient></defs></svg> <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"></div></div> <section class="py-20 px-4 bg-slate-950"><div class="container mx-auto text-center"><h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">EU Sovereign AI Infrastructure</h1> <p class="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">Berlin-based development house building AI tools where GDPR, DORA, NIS2, and EU Cyber Resilience Act compliance are built in from day one.</p> <div class="flex gap-4 justify-center"><a href="#projects" class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">View Projects</a> <a href="#contact" class="border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">Get in Touch</a></div></div></section> <section id="about" class="py-16 px-4 bg-slate-900/50"><div class="container mx-auto max-w-4xl"><h2 class="text-3xl font-bold text-center mb-12 text-white">What We Do</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div class="text-center"><div class="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11A9.951 9.951 0 1 0 20.945 11c.03-.677.177-1.34.394-1.984M12 2v4m0 12v4m8.828-8.828l-2.828-2.828M6.343 17.657l-2.828-2.828"></path></svg></div> <h3 class="text-xl font-semibold mb-2 text-white">Trait-First Architecture</h3> <p class="text-slate-400">Every component depends on traits, not concrete types. Swap any piece without rewriting your codebase.</p></div> <div class="text-center"><div class="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div> <h3 class="text-xl font-semibold mb-2 text-white">EU Compliant by Design</h3> <p class="text-slate-400">GDPR, DORA, NIS2, EU CRA — compliance isn't an afterthought, it's in the code from day one.</p></div> <div class="text-center"><div class="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div> <h3 class="text-xl font-semibold mb-2 text-white">Git-Native Storage</h3> <p class="text-slate-400">All state stored in git refs — no external databases, fully distributed, works offline.</p></div></div></div></section> <section id="projects" class="py-16 px-4"><div class="container mx-auto"><h2 class="text-4xl font-bold text-center mb-4 text-white">Projects</h2> <p class="text-center text-slate-400 mb-12 max-w-2xl mx-auto">Open-source tools and commercial offerings for agentic development, distributed AI memory, and compliant infrastructure.</p> <div class="mb-12"><h3 class="text-2xl font-bold mb-6 text-white">Core AI &amp; Agentic Tools</h3> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
	const each_array_1 = ensure_array_like(projects.filter((p) => p.category !== "compliance" && p.category !== "financial" && p.category !== "tooling" && p.id !== "omnishell" && p.id !== "nix-modules" && p.id !== "vulnz"));
	for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
		let project = each_array_1[$$index_1];
		const open = isOpenSource(project);
		$$renderer.push(`<a${attr("href", open ? project.githubUrl : `/projects/${project.id}/`)}${attr("target", open ? "_blank" : void 0)}${attr("rel", open ? "noopener noreferrer" : void 0)} class="block no-underline">`);
		Card($$renderer, {
			class: "border-t-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
			style: `border-top-color: ${stringify(project.color.hex)};`,
			children: ($$renderer) => {
				$$renderer.push(`<div class="p-6"><div class="w-20 h-20 mb-4"><img${attr("src", logoUrl(project))}${attr("alt", `${stringify(project.title)} logo`)} class="w-full h-full"/></div> <h3 class="text-2xl font-bold mb-2"${attr_style(`color: ${stringify(project.color.hex)};`)}>${escape_html(project.title)}</h3> <p class="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-2">${escape_html(project.tagline)}</p> <p class="text-slate-300 text-sm mb-4">${escape_html(project.description)}</p> `);
				Badge($$renderer, {
					variant: "outline",
					style: `color: ${stringify(project.color.hex)}; border-color: ${stringify(project.color.hex)};`,
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(open ? "open-source" : project.category)}`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></a>`);
	}
	$$renderer.push(`<!--]--></div></div> <div class="mb-12"><h3 class="text-2xl font-bold mb-6 text-white">Integrations &amp; Tools</h3> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
	const each_array_2 = ensure_array_like(projects.filter((p) => p.id === "omnishell" || p.id === "vulnz" || p.category === "tooling" && p.id !== "engram-claude" && p.id !== "engram-opencode" && p.id !== "pi-engram-extensions"));
	for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
		let project = each_array_2[$$index_2];
		$$renderer.push(`<a${attr("href", `/projects/${project.id}/`)}>`);
		Card($$renderer, {
			class: "border-t-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
			style: `border-top-color: ${stringify(project.color.hex)};`,
			children: ($$renderer) => {
				$$renderer.push(`<div class="p-6"><div class="w-20 h-20 mb-4"><img${attr("src", logoUrl(project))}${attr("alt", `${stringify(project.title)} logo`)} class="w-full h-full"/></div> <h3 class="text-2xl font-bold mb-2"${attr_style(`color: ${stringify(project.color.hex)};`)}>${escape_html(project.title)}</h3> <p class="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-2">${escape_html(project.tagline)}</p> <p class="text-slate-300 text-sm mb-4">${escape_html(project.description)}</p> `);
				Badge($$renderer, {
					variant: "outline",
					style: `color: ${stringify(project.color.hex)}; border-color: ${stringify(project.color.hex)};`,
					children: ($$renderer) => {
						$$renderer.push(`<!---->open-source`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></a>`);
	}
	$$renderer.push(`<!--]--></div></div></div></section> <section id="compliance" class="py-16 px-4 bg-slate-900/50"><div class="container mx-auto"><h2 class="text-3xl font-bold text-center mb-4 text-white">Compliance &amp; EU Sovereign Tech</h2> <p class="text-center text-slate-400 mb-12 max-w-2xl mx-auto">We build tools that make EU regulatory compliance (GDPR, DORA, NIS2, EU Cyber Resilience Act) part of your development workflow — not an afterthought.</p> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
	const each_array_3 = ensure_array_like(projects.filter((p) => p.category === "compliance" || p.id === "vulnz" || p.id === "billing-middleware" || p.id === "billing-auth-service"));
	for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
		let project = each_array_3[$$index_3];
		$$renderer.push(`<a${attr("href", `/projects/${project.id}/`)}><div class="border-t-4 p-6 bg-slate-800 rounded-lg hover:-translate-y-1 transition-all duration-200 hover:shadow-xl"${attr_style(`border-top-color: ${stringify(project.color.hex)};`)}><h3 class="text-lg font-bold mb-2"${attr_style(`color: ${stringify(project.color.hex)}`)}>${escape_html(project.title)}</h3> <p class="text-sm text-slate-400">${escape_html(project.tagline)}</p></div></a>`);
	}
	$$renderer.push(`<!--]--></div></div></section> <section id="contact" class="py-16 px-4"><div class="container mx-auto max-w-2xl text-center"><h2 class="text-3xl font-bold mb-4 text-white">Get in Touch</h2> <p class="text-slate-400 mb-8">Questions about our tools, compliance stack, or commercial licensing? We'd love to hear from you.</p> <div class="space-y-4"><p class="text-lg"><a${attr("href", `mailto:${stringify(meta.email)}`)} class="text-orange-400 hover:text-orange-300 transition-colors">${escape_html(meta.email)}</a></p> <p class="text-slate-400">Berlin, Germany</p></div></div></section> <footer class="border-t border-slate-800 py-8 px-4"><div class="container mx-auto text-center text-slate-500"><p>© 2026 ${escape_html(meta.name)} — All rights reserved</p></div></footer>`);
}
//#endregion
//#region src/ssr-entry.js
function renderApp() {
	return render(App, {});
}
//#endregion
export { renderApp };
