import { parse, icon } from '@fortawesome/fontawesome-svg-core';

function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
        if (!keys.has(k) && k[0] !== '$')
            rest[k] = props[k];
    return rest;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
Promise.resolve();

// source: https://html.spec.whatwg.org/multipage/indices.html
const boolean_attributes = new Set([
    'allowfullscreen',
    'allowpaymentrequest',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
]);

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter
function spread(args, attrs_to_add) {
    const attributes = Object.assign({}, ...args);
    if (attrs_to_add) {
        const classes_to_add = attrs_to_add.classes;
        const styles_to_add = attrs_to_add.styles;
        if (classes_to_add) {
            if (attributes.class == null) {
                attributes.class = classes_to_add;
            }
            else {
                attributes.class += ' ' + classes_to_add;
            }
        }
        if (styles_to_add) {
            if (attributes.style == null) {
                attributes.style = style_object_to_string(styles_to_add);
            }
            else {
                attributes.style = style_object_to_string(merge_ssr_styles(attributes.style, styles_to_add));
            }
        }
    }
    let str = '';
    Object.keys(attributes).forEach(name => {
        if (invalid_attribute_name_character.test(name))
            return;
        const value = attributes[name];
        if (value === true)
            str += ' ' + name;
        else if (boolean_attributes.has(name.toLowerCase())) {
            if (value)
                str += ' ' + name;
        }
        else if (value != null) {
            str += ` ${name}="${value}"`;
        }
    });
    return str;
}
function merge_ssr_styles(style_attribute, style_directive) {
    const style_object = {};
    for (const individual_style of style_attribute.split(';')) {
        const colon_index = individual_style.indexOf(':');
        const name = individual_style.slice(0, colon_index).trim();
        const value = individual_style.slice(colon_index + 1).trim();
        if (!name)
            continue;
        style_object[name] = value;
    }
    for (const name in style_directive) {
        const value = style_directive[name];
        if (value) {
            style_object[name] = value;
        }
        else {
            delete style_object[name];
        }
    }
    return style_object;
}
const ATTR_REGEX = /[&"]/g;
const CONTENT_REGEX = /[&<]/g;
/**
 * Note: this method is performance sensitive and has been optimized
 * https://github.com/sveltejs/svelte/pull/5701
 */
function escape(value, is_attr = false) {
    const str = String(value);
    const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
    pattern.lastIndex = 0;
    let escaped = '';
    let last = 0;
    while (pattern.test(str)) {
        const i = pattern.lastIndex - 1;
        const ch = str[i];
        escaped += str.substring(last, i) + (ch === '&' ? '&amp;' : (ch === '"' ? '&quot;' : '&lt;'));
        last = i + 1;
    }
    return escaped + str.substring(last);
}
function escape_attribute_value(value) {
    // keep booleans, null, and undefined for the sake of `spread`
    const should_escape = typeof value === 'string' || (value && typeof value === 'object');
    return should_escape ? escape(value, true) : value;
}
function escape_object(obj) {
    const result = {};
    for (const key in obj) {
        result[key] = escape_attribute_value(obj[key]);
    }
    return result;
}
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots, context) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(context || (parent_component ? parent_component.$$.context : [])),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, $$slots, context);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    const assignment = (boolean && value === true) ? '' : `="${escape(value, true)}"`;
    return ` ${name}${assignment}`;
}
function style_object_to_string(style_object) {
    return Object.keys(style_object)
        .filter(key => style_object[key])
        .map(key => `${key}: ${style_object[key]};`)
        .join(' ');
}

// Get CSS class list from a props object
function classList(props) {
  const {
    beat,
    fade,
    beatFade,
    bounce,
    shake,
    flash,
    spin,
    spinPulse,
    spinReverse,
    pulse,
    fixedWidth,
    inverse,
    border,
    listItem,
    flip,
    size,
    rotation,
    pull
  } = props;

  // map of CSS class names to properties
  const classes = {
    'fa-beat': beat,
    'fa-fade': fade,
    'fa-beat-fade': beatFade,
    'fa-bounce': bounce,
    'fa-shake': shake,
    'fa-flash': flash,
    'fa-spin': spin,
    'fa-spin-reverse': spinReverse,
    'fa-spin-pulse': spinPulse,
    'fa-pulse': pulse,
    'fa-fw': fixedWidth,
    'fa-inverse': inverse,
    'fa-border': border,
    'fa-li': listItem,
    'fa-flip': flip === true,
    'fa-flip-horizontal': flip === 'horizontal' || flip === 'both',
    'fa-flip-vertical': flip === 'vertical' || flip === 'both',
    [`fa-${size}`]: typeof size !== 'undefined' && size !== null,
    [`fa-rotate-${rotation}`]:
      typeof rotation !== 'undefined' && rotation !== null && rotation !== 0,
    [`fa-pull-${pull}`]: typeof pull !== 'undefined' && pull !== null,
    'fa-swap-opacity': props.swapOpacity
  };

  // map over all the keys in the classes object
  // return an array of the keys where the value for the key is not null
  return Object.keys(classes)
    .map(key => (classes[key] ? key : null))
    .filter(key => key)
}

// Camelize taken from humps
// humps is copyright © 2012+ Dom Christie
// Released under the MIT license.

// Performant way to determine if object coerces to a number
function _isNumerical(obj) {
  obj = obj - 0;

  // eslint-disable-next-line no-self-compare
  return obj === obj
}

function camelize(string) {
  if (_isNumerical(string)) {
    return string
  }

  // eslint-disable-next-line no-useless-escape
  string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
    return chr ? chr.toUpperCase() : ''
  });

  // Ensure 1st char is always lowercase
  return string.substr(0, 1).toLowerCase() + string.substr(1)
}

function styleToString(style) {
  if (typeof style === 'string') {
    return style
  }

  return Object.keys(style).reduce((acc, key) => (
    acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';'
  ), '')
}

function convert(createElement, element, extraProps = {}) {
  if (typeof element === 'string') {
    return element
  }

  const children = (element.children || []).map((child) => {
    return convert(createElement, child)
  });

  /* eslint-disable dot-notation */
  const mixins = Object.keys(element.attributes || {}).reduce(
    (acc, key) => {
      const val = element.attributes[key];

      if (key === 'style') {
        acc.attrs['style'] = styleToString(val);
      } else {
        if (key.indexOf('aria-') === 0 || key.indexOf('data-') === 0) {
          acc.attrs[key.toLowerCase()] = val;
        } else {
          acc.attrs[camelize(key)] = val;
        }
      }

      return acc
    },
    { attrs: {} }
  );

  /* eslint-enable */

  return createElement(element.tag, { ...mixins.attrs }, children)
}

let PRODUCTION = false;

try {
  PRODUCTION = process.env.NODE_ENV === 'production';
} catch (e) {}

function log(...args) {
  if (!PRODUCTION && console && typeof console.error === 'function') {
    console.error(...args);
  }
}

// Normalize icon arguments
function normalizeIconArgs(icon) {
  // this has everything that it needs to be rendered which means it was probably imported
  // directly from an icon svg package
  if (icon && typeof icon === 'object' && icon.prefix && icon.iconName && icon.icon) {
    return icon
  }

  if (parse.icon) {
    return parse.icon(icon)
  }

  // if the icon is null, there's nothing to do
  if (icon === null) {
    return null
  }

  // if the icon is an object and has a prefix and an icon name, return it
  if (icon && typeof icon === 'object' && icon.prefix && icon.iconName) {
    return icon
  }

  // if it's an array with length of two
  if (Array.isArray(icon) && icon.length === 2) {
    // use the first item as prefix, second as icon name
    return { prefix: icon[0], iconName: icon[1] }
  }

  // if it's a string, use it as the icon name
  if (typeof icon === 'string') {
    return { prefix: 'fas', iconName: icon }
  }
}

// creates an object with a key of key
// and a value of value
// if certain conditions are met
function objectWithKey(key, value) {
  // if the value is a non-empty array
  // or it's not an array but it is truthy
  // then create the object with the key and the value
  // if not, return an empty array
  return (Array.isArray(value) && value.length > 0) ||
    (!Array.isArray(value) && value)
    ? { [key]: value }
    : {}
}

/* src/components/SvgElement.svelte generated by Svelte v3.49.0 */

const SvgElement = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { tag } = $$props;
	let { props } = $$props;
	let { children } = $$props;
	let { style = null } = $$props;
	let { ref = null } = $$props;

	if (tag !== 'svg') {
		throw new Error('SvgElement requires a tag of "svg"');
	}

	function processChildren(children) {
		return children?.reduce(
			(acc, child) => {
				return acc + (child.tag ? generateMarkup(child) : child);
			},
			''
		) || '';
	}

	function generateMarkup({ tag, props, children }) {
		// Generate a string setting key = value for each prop
		const attributes = Object.keys(props).map(key => `${key}="${props[key]}"`).join(' ');

		return `<${tag} ${attributes}>${processChildren(children)}</${tag}>`;
	}

	const markup = processChildren(children);
	const elementStyle = (props?.style) ? `${props.style}${style || ''}` : style;
	const elementProps = { ...props, style: elementStyle };
	if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0) $$bindings.tag(tag);
	if ($$props.props === void 0 && $$bindings.props && props !== void 0) $$bindings.props(props);
	if ($$props.children === void 0 && $$bindings.children && children !== void 0) $$bindings.children(children);
	if ($$props.style === void 0 && $$bindings.style && style !== void 0) $$bindings.style(style);
	if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0) $$bindings.ref(ref);
	return `<svg${spread([escape_object(elementProps)], {})}${add_attribute("this", ref, 0)}><!-- HTML_TAG_START -->${markup}<!-- HTML_TAG_END --></svg>`;
});

/* src/components/FontAwesomeIcon.svelte generated by Svelte v3.49.0 */

const FontAwesomeIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $$restProps = compute_rest_props($$props, [
		"border","mask","maskId","fixedWidth","inverse","flip","icon","listItem","pull","pulse","rotation","size","spin","spinPulse","spinReverse","beat","fade","beatFade","bounce","shake","symbol","title","titleId","transform","swapOpacity","ref","style"
	]);

	let { border = false } = $$props;
	let { mask = null } = $$props;
	let { maskId = null } = $$props;
	let { fixedWidth = false } = $$props;
	let { inverse = false } = $$props;
	let { flip = false } = $$props;
	let { icon: icon$1 = null } = $$props;
	let { listItem = false } = $$props;
	let { pull = null } = $$props;
	let { pulse = false } = $$props;
	let { rotation = null } = $$props;
	let { size = null } = $$props;
	let { spin = false } = $$props;
	let { spinPulse = false } = $$props;
	let { spinReverse = false } = $$props;
	let { beat = false } = $$props;
	let { fade = false } = $$props;
	let { beatFade = false } = $$props;
	let { bounce = false } = $$props;
	let { shake = false } = $$props;
	let { symbol = false } = $$props;
	let { title = '' } = $$props;
	let { titleId = null } = $$props;
	let { transform = null } = $$props;
	let { swapOpacity = false } = $$props;
	let { ref = null } = $$props;
	let { style = null } = $$props;
	const iconLookup = normalizeIconArgs(icon$1);
	const classes = objectWithKey('classes', [...classList($$props), ...($$props.class || '').split(' ')]);

	const transformObj = objectWithKey('transform', typeof transform === 'string'
	? parse.transform(transform)
	: transform);

	const maskObj = objectWithKey('mask', normalizeIconArgs(mask));

	const renderedIcon = icon(iconLookup, {
		...classes,
		...transformObj,
		...maskObj,
		symbol,
		title,
		titleId,
		maskId
	});

	let result = null;

	if (!renderedIcon) {
		log('Could not find icon', iconLookup);
	} else {
		const { abstract } = renderedIcon;

		result = convert(
			(tag, props, children) => {
				return { tag, props, children };
			},
			abstract[0],
			$$restProps
		);
	}

	if ($$props.border === void 0 && $$bindings.border && border !== void 0) $$bindings.border(border);
	if ($$props.mask === void 0 && $$bindings.mask && mask !== void 0) $$bindings.mask(mask);
	if ($$props.maskId === void 0 && $$bindings.maskId && maskId !== void 0) $$bindings.maskId(maskId);
	if ($$props.fixedWidth === void 0 && $$bindings.fixedWidth && fixedWidth !== void 0) $$bindings.fixedWidth(fixedWidth);
	if ($$props.inverse === void 0 && $$bindings.inverse && inverse !== void 0) $$bindings.inverse(inverse);
	if ($$props.flip === void 0 && $$bindings.flip && flip !== void 0) $$bindings.flip(flip);
	if ($$props.icon === void 0 && $$bindings.icon && icon$1 !== void 0) $$bindings.icon(icon$1);
	if ($$props.listItem === void 0 && $$bindings.listItem && listItem !== void 0) $$bindings.listItem(listItem);
	if ($$props.pull === void 0 && $$bindings.pull && pull !== void 0) $$bindings.pull(pull);
	if ($$props.pulse === void 0 && $$bindings.pulse && pulse !== void 0) $$bindings.pulse(pulse);
	if ($$props.rotation === void 0 && $$bindings.rotation && rotation !== void 0) $$bindings.rotation(rotation);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.spin === void 0 && $$bindings.spin && spin !== void 0) $$bindings.spin(spin);
	if ($$props.spinPulse === void 0 && $$bindings.spinPulse && spinPulse !== void 0) $$bindings.spinPulse(spinPulse);
	if ($$props.spinReverse === void 0 && $$bindings.spinReverse && spinReverse !== void 0) $$bindings.spinReverse(spinReverse);
	if ($$props.beat === void 0 && $$bindings.beat && beat !== void 0) $$bindings.beat(beat);
	if ($$props.fade === void 0 && $$bindings.fade && fade !== void 0) $$bindings.fade(fade);
	if ($$props.beatFade === void 0 && $$bindings.beatFade && beatFade !== void 0) $$bindings.beatFade(beatFade);
	if ($$props.bounce === void 0 && $$bindings.bounce && bounce !== void 0) $$bindings.bounce(bounce);
	if ($$props.shake === void 0 && $$bindings.shake && shake !== void 0) $$bindings.shake(shake);
	if ($$props.symbol === void 0 && $$bindings.symbol && symbol !== void 0) $$bindings.symbol(symbol);
	if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
	if ($$props.titleId === void 0 && $$bindings.titleId && titleId !== void 0) $$bindings.titleId(titleId);
	if ($$props.transform === void 0 && $$bindings.transform && transform !== void 0) $$bindings.transform(transform);
	if ($$props.swapOpacity === void 0 && $$bindings.swapOpacity && swapOpacity !== void 0) $$bindings.swapOpacity(swapOpacity);
	if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0) $$bindings.ref(ref);
	if ($$props.style === void 0 && $$bindings.style && style !== void 0) $$bindings.style(style);
	let $$settled;
	let $$rendered;

	do {
		$$settled = true;

		$$rendered = `${result
		? `${validate_component(SvgElement, "SvgElement").$$render(
				$$result,
				Object.assign(result, { style }, { ref }),
				{
					ref: $$value => {
						ref = $$value;
						$$settled = false;
					}
				},
				{}
			)}`
		: ``}`;
	} while (!$$settled);

	return $$rendered;
});

export { FontAwesomeIcon };
