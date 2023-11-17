import { reactive as gn, computed as g, watchEffect as xt, toRefs as fl, Fragment as ue, capitalize as Ut, warn as yn, watch as ae, onScopeDispose as pe, effectScope as aa, inject as se, ref as A, unref as X, provide as xe, shallowRef as te, defineComponent as Ho, camelize as vl, h as At, getCurrentInstance as Go, onBeforeUnmount as ct, readonly as la, toRaw as Je, TransitionGroup as Ko, Transition as st, createVNode as r, mergeProps as U, onBeforeMount as ml, nextTick as Se, withDirectives as be, resolveDirective as Me, vShow as dt, isRef as wt, onMounted as kt, toRef as j, Text as Yo, resolveDynamicComponent as Wo, Teleport as Zo, cloneVNode as Jo, createTextVNode as H, resolveComponent as Nt, openBlock as M, createBlock as G, withCtx as x, getCurrentScope as Xo, createElementBlock as Ce, renderList as oa, toDisplayString as ne, createCommentVNode as fe, createElementVNode as F, onUnmounted as ia, normalizeProps as Ln, guardReactiveProps as Ra, withModifiers as ft, onUpdated as gl } from "vue";
function B(e, n) {
  return (t) => Object.keys(e).reduce((a, l) => {
    const i = typeof e[l] == "object" && e[l] != null && !Array.isArray(e[l]) ? e[l] : {
      type: e[l]
    };
    return t && l in t ? a[l] = {
      ...i,
      default: t[l]
    } : a[l] = i, n && !a[l].source && (a[l].source = n), a;
  }, {});
}
const Z = B({
  class: [String, Array],
  style: {
    type: [String, Array, Object],
    default: null
  }
}, "component");
function yl(e, n, t) {
  const a = n.length - 1;
  if (a < 0)
    return e === void 0 ? t : e;
  for (let l = 0; l < a; l++) {
    if (e == null)
      return t;
    e = e[n[l]];
  }
  return e == null || e[n[a]] === void 0 ? t : e[n[a]];
}
function Vt(e, n) {
  if (e === n)
    return !0;
  if (e instanceof Date && n instanceof Date && e.getTime() !== n.getTime() || e !== Object(e) || n !== Object(n))
    return !1;
  const t = Object.keys(e);
  return t.length !== Object.keys(n).length ? !1 : t.every((a) => Vt(e[a], n[a]));
}
function ei(e, n, t) {
  return e == null || !n || typeof n != "string" ? t : e[n] !== void 0 ? e[n] : (n = n.replace(/\[(\w+)\]/g, ".$1"), n = n.replace(/^\./, ""), yl(e, n.split("."), t));
}
function Le(e, n, t) {
  if (n == null)
    return e === void 0 ? t : e;
  if (e !== Object(e)) {
    if (typeof n != "function")
      return t;
    const l = n(e, t);
    return typeof l > "u" ? t : l;
  }
  if (typeof n == "string")
    return ei(e, n, t);
  if (Array.isArray(n))
    return yl(e, n, t);
  if (typeof n != "function")
    return t;
  const a = n(e, t);
  return typeof a > "u" ? t : a;
}
function ee(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "px";
  if (!(e == null || e === ""))
    return isNaN(+e) ? String(e) : isFinite(+e) ? `${Number(e)}${n}` : void 0;
}
function zn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function jn(e) {
  return e && "$el" in e ? e.$el : e;
}
const Oa = Object.freeze({
  enter: 13,
  tab: 9,
  delete: 46,
  esc: 27,
  space: 32,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  end: 35,
  home: 36,
  del: 46,
  backspace: 8,
  insert: 45,
  pageup: 33,
  pagedown: 34,
  shift: 16
});
function hl(e) {
  return Object.keys(e);
}
function $t(e, n, t) {
  const a = /* @__PURE__ */ Object.create(null), l = /* @__PURE__ */ Object.create(null);
  for (const o in e)
    n.some((i) => i instanceof RegExp ? i.test(o) : i === o) && !(t != null && t.some((i) => i === o)) ? a[o] = e[o] : l[o] = e[o];
  return [a, l];
}
function hn(e, n) {
  const t = {
    ...e
  };
  return n.forEach((a) => delete t[a]), t;
}
function bn(e) {
  return $t(e, ["class", "style", "id", /^data-/]);
}
function je(e) {
  return e == null ? [] : Array.isArray(e) ? e : [e];
}
function Un(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  return Math.max(n, Math.min(t, e));
}
function Da(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1e3;
  if (e < n)
    return `${e} B`;
  const t = n === 1024 ? ["Ki", "Mi", "Gi"] : ["k", "M", "G"];
  let a = -1;
  for (; Math.abs(e) >= n && a < t.length - 1; )
    e /= n, ++a;
  return `${e.toFixed(1)} ${t[a]}B`;
}
function bt() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, t = arguments.length > 2 ? arguments[2] : void 0;
  const a = {};
  for (const l in e)
    a[l] = e[l];
  for (const l in n) {
    const o = e[l], i = n[l];
    if (zn(o) && zn(i)) {
      a[l] = bt(o, i, t);
      continue;
    }
    if (Array.isArray(o) && Array.isArray(i) && t) {
      a[l] = t(o, i);
      continue;
    }
    a[l] = i;
  }
  return a;
}
function bl(e) {
  return e.map((n) => n.type === ue ? bl(n.children) : n).flat();
}
function it() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  if (it.cache.has(e))
    return it.cache.get(e);
  const n = e.replace(/[^a-z]/gi, "-").replace(/\B([A-Z])/g, "-$1").toLowerCase();
  return it.cache.set(e, n), n;
}
it.cache = /* @__PURE__ */ new Map();
function an(e, n) {
  if (!n || typeof n != "object")
    return [];
  if (Array.isArray(n))
    return n.map((t) => an(e, t)).flat(1);
  if (Array.isArray(n.children))
    return n.children.map((t) => an(e, t)).flat(1);
  if (n.component) {
    if (Object.getOwnPropertySymbols(n.component.provides).includes(e))
      return [n.component];
    if (n.component.subTree)
      return an(e, n.component.subTree).flat(1);
  }
  return [];
}
function sa(e) {
  const n = gn({}), t = g(e);
  return xt(() => {
    for (const a in t.value)
      n[a] = t.value[a];
  }, {
    flush: "sync"
  }), fl(n);
}
function rn(e, n) {
  return e.includes(n);
}
const ti = /^on[^a-z]/, ra = (e) => ti.test(e);
function Cl(e) {
  return e[2].toLowerCase() + e.slice(3);
}
const Fe = () => [Function, Array];
function Fa(e, n) {
  return n = "on" + Ut(n), !!(e[n] || e[`${n}Once`] || e[`${n}Capture`] || e[`${n}OnceCapture`] || e[`${n}CaptureOnce`]);
}
function pl(e) {
  for (var n = arguments.length, t = new Array(n > 1 ? n - 1 : 0), a = 1; a < n; a++)
    t[a - 1] = arguments[a];
  if (Array.isArray(e))
    for (const l of e)
      l(...t);
  else
    typeof e == "function" && e(...t);
}
function ua(e) {
  const n = ["button", "[href]", 'input:not([type="hidden"])', "select", "textarea", "[tabindex]"].map((t) => `${t}:not([tabindex="-1"]):not([disabled])`).join(", ");
  return [...e.querySelectorAll(n)];
}
function un(e, n) {
  var l, o, i;
  const t = ua(e), a = t.indexOf(document.activeElement);
  if (!n)
    (e === document.activeElement || !e.contains(document.activeElement)) && ((l = t[0]) == null || l.focus());
  else if (n === "first")
    (o = t[0]) == null || o.focus();
  else if (n === "last")
    (i = t.at(-1)) == null || i.focus();
  else {
    let s, u = a;
    const c = n === "next" ? 1 : -1;
    do
      u += c, s = t[u];
    while ((!s || s.offsetParent == null) && u < t.length && u >= 0);
    s ? s.focus() : un(e, n === "next" ? "first" : "last");
  }
}
const Sl = ["top", "bottom"], ni = ["start", "end", "left", "right"];
function Nn(e, n) {
  let [t, a] = e.split(" ");
  return a || (a = rn(Sl, t) ? "start" : rn(ni, t) ? "top" : "center"), {
    side: Ma(t, n),
    align: Ma(a, n)
  };
}
function Ma(e, n) {
  return e === "start" ? n ? "right" : "left" : e === "end" ? n ? "left" : "right" : e;
}
function In(e) {
  return {
    side: {
      center: "center",
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }[e.side],
    align: e.align
  };
}
function Bn(e) {
  return {
    side: e.side,
    align: {
      center: "center",
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }[e.align]
  };
}
function La(e) {
  return {
    side: e.align,
    align: e.side
  };
}
function za(e) {
  return rn(Sl, e.side) ? "y" : "x";
}
class Ct {
  constructor(n) {
    let {
      x: t,
      y: a,
      width: l,
      height: o
    } = n;
    this.x = t, this.y = a, this.width = l, this.height = o;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
}
function ja(e, n) {
  return {
    x: {
      before: Math.max(0, n.left - e.left),
      after: Math.max(0, e.right - n.right)
    },
    y: {
      before: Math.max(0, n.top - e.top),
      after: Math.max(0, e.bottom - n.bottom)
    }
  };
}
function ca(e) {
  const n = e.getBoundingClientRect(), t = getComputedStyle(e), a = t.transform;
  if (a) {
    let l, o, i, s, u;
    if (a.startsWith("matrix3d("))
      l = a.slice(9, -1).split(/, /), o = +l[0], i = +l[5], s = +l[12], u = +l[13];
    else if (a.startsWith("matrix("))
      l = a.slice(7, -1).split(/, /), o = +l[0], i = +l[3], s = +l[4], u = +l[5];
    else
      return new Ct(n);
    const c = t.transformOrigin, f = n.x - s - (1 - o) * parseFloat(c), d = n.y - u - (1 - i) * parseFloat(c.slice(c.indexOf(" ") + 1)), v = o ? n.width / o : e.offsetWidth + 1, m = i ? n.height / i : e.offsetHeight + 1;
    return new Ct({
      x: f,
      y: d,
      width: v,
      height: m
    });
  } else
    return new Ct(n);
}
function ot(e, n, t) {
  if (typeof e.animate > "u")
    return {
      finished: Promise.resolve()
    };
  let a;
  try {
    a = e.animate(n, t);
  } catch {
    return {
      finished: Promise.resolve()
    };
  }
  return typeof a.finished > "u" && (a.finished = new Promise((l) => {
    a.onfinish = () => {
      l(a);
    };
  })), a;
}
const ln = /* @__PURE__ */ new WeakMap();
function ai(e, n) {
  Object.keys(n).forEach((t) => {
    if (ra(t)) {
      const a = Cl(t), l = ln.get(e);
      if (n[t] == null)
        l == null || l.forEach((o) => {
          const [i, s] = o;
          i === a && (e.removeEventListener(a, s), l.delete(o));
        });
      else if (!l || ![...l].some((o) => o[0] === a && o[1] === n[t])) {
        e.addEventListener(a, n[t]);
        const o = l || /* @__PURE__ */ new Set();
        o.add([a, n[t]]), ln.has(e) || ln.set(e, o);
      }
    } else
      n[t] == null ? e.removeAttribute(t) : e.setAttribute(t, n[t]);
  });
}
function li(e, n) {
  Object.keys(n).forEach((t) => {
    if (ra(t)) {
      const a = Cl(t), l = ln.get(e);
      l == null || l.forEach((o) => {
        const [i, s] = o;
        i === a && (e.removeEventListener(a, s), l.delete(o));
      });
    } else
      e.removeAttribute(t);
  });
}
function da(e) {
  yn(`Vuetify: ${e}`);
}
function oi(e) {
  yn(`Vuetify error: ${e}`);
}
function ii(e, n) {
  n = Array.isArray(n) ? n.slice(0, -1).map((t) => `'${t}'`).join(", ") + ` or '${n.at(-1)}'` : `'${n}'`, yn(`[Vuetify UPGRADE] '${e}' is deprecated, use ${n} instead.`);
}
function Ua(e) {
  return !!e && /^(#|var\(--|(rgb|hsl)a?\()/.test(e);
}
function rt(e, n) {
  let t;
  function a() {
    t = aa(), t.run(() => n.length ? n(() => {
      t == null || t.stop(), a();
    }) : n());
  }
  ae(e, (l) => {
    l && !t ? a() : l || (t == null || t.stop(), t = void 0);
  }, {
    immediate: !0
  }), pe(() => {
    t == null || t.stop();
  });
}
const fa = Symbol.for("vuetify:defaults");
function va() {
  const e = se(fa);
  if (!e)
    throw new Error("[Vuetify] Could not find defaults instance");
  return e;
}
function Oe(e, n) {
  const t = va(), a = A(e), l = g(() => {
    if (X(n == null ? void 0 : n.disabled))
      return t.value;
    const i = X(n == null ? void 0 : n.scoped), s = X(n == null ? void 0 : n.reset), u = X(n == null ? void 0 : n.root);
    let c = bt(a.value, {
      prev: t.value
    });
    if (i)
      return c;
    if (s || u) {
      const f = Number(s || 1 / 0);
      for (let d = 0; d <= f && !(!c || !("prev" in c)); d++)
        c = c.prev;
      return c && typeof u == "string" && u in c && (c = bt(bt(c, {
        prev: c
      }), c[u])), c;
    }
    return c.prev ? bt(c.prev, c) : c;
  });
  return xe(fa, l), l;
}
function si(e, n) {
  var t, a;
  return typeof ((t = e.props) == null ? void 0 : t[n]) < "u" || typeof ((a = e.props) == null ? void 0 : a[it(n)]) < "u";
}
function ri() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : va();
  const a = Ae("useDefaults");
  if (n = n ?? a.type.name ?? a.type.__name, !n)
    throw new Error("[Vuetify] Could not determine component name");
  const l = g(() => {
    var u;
    return (u = t.value) == null ? void 0 : u[e._as ?? n];
  }), o = new Proxy(e, {
    get(u, c) {
      var d, v, m, y;
      const f = Reflect.get(u, c);
      return c === "class" || c === "style" ? [(d = l.value) == null ? void 0 : d[c], f].filter((h) => h != null) : typeof c == "string" && !si(a.vnode, c) ? ((v = l.value) == null ? void 0 : v[c]) ?? ((y = (m = t.value) == null ? void 0 : m.global) == null ? void 0 : y[c]) ?? f : f;
    }
  }), i = te();
  xt(() => {
    if (l.value) {
      const u = Object.entries(l.value).filter((c) => {
        let [f] = c;
        return f.startsWith(f[0].toUpperCase());
      });
      u.length && (i.value = Object.fromEntries(u));
    }
  });
  function s() {
    rt(i, () => {
      var u;
      Oe(bt(((u = fi(fa)) == null ? void 0 : u.value) ?? {}, i.value));
    });
  }
  return {
    props: o,
    provideSubDefaults: s
  };
}
function Qt(e) {
  if (e._setup = e._setup ?? e.setup, !e.name)
    return da("The component is missing an explicit name, unable to generate default prop value"), e;
  if (e._setup) {
    e.props = B(e.props ?? {}, e.name)();
    const n = Object.keys(e.props);
    e.filterProps = function(a) {
      return $t(a, n, ["class", "style"]);
    }, e.props._as = String, e.setup = function(a, l) {
      const o = va();
      if (!o.value)
        return e._setup(a, l);
      const {
        props: i,
        provideSubDefaults: s
      } = ri(a, a._as ?? e.name, o), u = e._setup(i, l);
      return s(), u;
    };
  }
  return e;
}
function z() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
  return (n) => (e ? Qt : Ho)(n);
}
function vt(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "div", t = arguments.length > 2 ? arguments[2] : void 0;
  return z()({
    name: t ?? Ut(vl(e.replace(/__/g, "-"))),
    props: {
      tag: {
        type: String,
        default: n
      },
      ...Z()
    },
    setup(a, l) {
      let {
        slots: o
      } = l;
      return () => {
        var i;
        return At(a.tag, {
          class: [e, a.class],
          style: a.style
        }, (i = o.default) == null ? void 0 : i.call(o));
      };
    }
  });
}
function xl(e) {
  if (typeof e.getRootNode != "function") {
    for (; e.parentNode; )
      e = e.parentNode;
    return e !== document ? null : document;
  }
  const n = e.getRootNode();
  return n !== document && n.getRootNode({
    composed: !0
  }) !== document ? null : n;
}
const Mt = "cubic-bezier(0.4, 0, 0.2, 1)", ui = "cubic-bezier(0.0, 0, 0.2, 1)", ci = "cubic-bezier(0.4, 0, 1, 1)";
function Ae(e, n) {
  const t = Go();
  if (!t)
    throw new Error(`[Vuetify] ${e} ${n || "must be called from inside a setup function"}`);
  return t;
}
function Ne() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "composables";
  const n = Ae(e).type;
  return it((n == null ? void 0 : n.aliasName) || (n == null ? void 0 : n.name));
}
let Al = 0, on = /* @__PURE__ */ new WeakMap();
function De() {
  const e = Ae("getUid");
  if (on.has(e))
    return on.get(e);
  {
    const n = Al++;
    return on.set(e, n), n;
  }
}
De.reset = () => {
  Al = 0, on = /* @__PURE__ */ new WeakMap();
};
function di(e) {
  for (; e; ) {
    if (ma(e))
      return e;
    e = e.parentElement;
  }
  return document.scrollingElement;
}
function cn(e, n) {
  const t = [];
  if (n && e && !n.contains(e))
    return t;
  for (; e && (ma(e) && t.push(e), e !== n); )
    e = e.parentElement;
  return t;
}
function ma(e) {
  if (!e || e.nodeType !== Node.ELEMENT_NODE)
    return !1;
  const n = window.getComputedStyle(e);
  return n.overflowY === "scroll" || n.overflowY === "auto" && e.scrollHeight > e.clientHeight;
}
const _e = typeof window < "u", ga = _e && "IntersectionObserver" in window, $n = _e && typeof CSS < "u" && typeof CSS.supports < "u" && CSS.supports("selector(:focus-visible)");
function fi(e) {
  const {
    provides: n
  } = Ae("injectSelf");
  if (n && e in n)
    return n[e];
}
function vi(e) {
  for (; e; ) {
    if (window.getComputedStyle(e).position === "fixed")
      return !0;
    e = e.offsetParent;
  }
  return !1;
}
function K(e) {
  const n = Ae("useRender");
  n.render = e;
}
function Qn(e) {
  const n = A(), t = A();
  if (_e) {
    const a = new ResizeObserver((l) => {
      e == null || e(l, a), l.length && (t.value = l[0].contentRect);
    });
    ct(() => {
      a.disconnect();
    }), ae(n, (l, o) => {
      o && (a.unobserve(jn(o)), t.value = void 0), l && a.observe(jn(l));
    }, {
      flush: "post"
    });
  }
  return {
    resizeRef: n,
    contentRect: la(t)
  };
}
function ce(e, n, t) {
  let a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : (d) => d, l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : (d) => d;
  const o = Ae("useProxiedModel"), i = A(e[n] !== void 0 ? e[n] : t), s = it(n), c = s !== n ? g(() => {
    var d, v, m, y;
    return e[n], !!(((d = o.vnode.props) != null && d.hasOwnProperty(n) || (v = o.vnode.props) != null && v.hasOwnProperty(s)) && ((m = o.vnode.props) != null && m.hasOwnProperty(`onUpdate:${n}`) || (y = o.vnode.props) != null && y.hasOwnProperty(`onUpdate:${s}`)));
  }) : g(() => {
    var d, v;
    return e[n], !!((d = o.vnode.props) != null && d.hasOwnProperty(n) && ((v = o.vnode.props) != null && v.hasOwnProperty(`onUpdate:${n}`)));
  });
  rt(() => !c.value, () => {
    ae(() => e[n], (d) => {
      i.value = d;
    });
  });
  const f = g({
    get() {
      const d = e[n];
      return a(c.value ? d : i.value);
    },
    set(d) {
      const v = l(d), m = Je(c.value ? e[n] : i.value);
      m === v || a(m) === d || (i.value = v, o == null || o.emit(`update:${n}`, v));
    }
  });
  return Object.defineProperty(f, "externalValue", {
    get: () => c.value ? e[n] : i.value
  }), f;
}
const wl = Symbol.for("vuetify:locale");
function _t() {
  const e = se(wl);
  if (!e)
    throw new Error("[Vuetify] Could not find injected locale instance");
  return e;
}
function Xe() {
  const e = se(wl);
  if (!e)
    throw new Error("[Vuetify] Could not find injected rtl instance");
  return {
    isRtl: e.isRtl,
    rtlClasses: e.rtlClasses
  };
}
const Na = Symbol.for("vuetify:theme"), ge = B({
  theme: String
}, "theme");
function ye(e) {
  Ae("provideTheme");
  const n = se(Na, null);
  if (!n)
    throw new Error("Could not find Vuetify theme injection");
  const t = g(() => e.theme ?? (n == null ? void 0 : n.name.value)), a = g(() => n.isDisabled ? void 0 : `v-theme--${t.value}`), l = {
    ...n,
    name: t,
    themeClasses: a
  };
  return xe(Na, l), l;
}
const de = B({
  tag: {
    type: String,
    default: "div"
  }
}, "tag"), mi = B({
  disabled: Boolean,
  group: Boolean,
  hideOnLeave: Boolean,
  leaveAbsolute: Boolean,
  mode: String,
  origin: String
}, "transition");
function Ie(e, n, t) {
  return z()({
    name: e,
    props: mi({
      mode: t,
      origin: n
    }),
    setup(a, l) {
      let {
        slots: o
      } = l;
      const i = {
        onBeforeEnter(s) {
          a.origin && (s.style.transformOrigin = a.origin);
        },
        onLeave(s) {
          if (a.leaveAbsolute) {
            const {
              offsetTop: u,
              offsetLeft: c,
              offsetWidth: f,
              offsetHeight: d
            } = s;
            s._transitionInitialStyles = {
              position: s.style.position,
              top: s.style.top,
              left: s.style.left,
              width: s.style.width,
              height: s.style.height
            }, s.style.position = "absolute", s.style.top = `${u}px`, s.style.left = `${c}px`, s.style.width = `${f}px`, s.style.height = `${d}px`;
          }
          a.hideOnLeave && s.style.setProperty("display", "none", "important");
        },
        onAfterLeave(s) {
          if (a.leaveAbsolute && (s != null && s._transitionInitialStyles)) {
            const {
              position: u,
              top: c,
              left: f,
              width: d,
              height: v
            } = s._transitionInitialStyles;
            delete s._transitionInitialStyles, s.style.position = u || "", s.style.top = c || "", s.style.left = f || "", s.style.width = d || "", s.style.height = v || "";
          }
        }
      };
      return () => {
        const s = a.group ? Ko : st;
        return At(s, {
          name: a.disabled ? "" : e,
          css: !a.disabled,
          ...a.group ? void 0 : {
            mode: a.mode
          },
          ...a.disabled ? {} : i
        }, o.default);
      };
    }
  });
}
function kl(e, n) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "in-out";
  return z()({
    name: e,
    props: {
      mode: {
        type: String,
        default: t
      },
      disabled: Boolean
    },
    setup(a, l) {
      let {
        slots: o
      } = l;
      return () => At(st, {
        name: a.disabled ? "" : e,
        css: !a.disabled,
        // mode: props.mode, // TODO: vuejs/vue-next#3104
        ...a.disabled ? {} : n
      }, o.default);
    }
  });
}
function Vl() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  const t = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1) ? "width" : "height", a = vl(`offset-${t}`);
  return {
    onBeforeEnter(i) {
      i._parent = i.parentNode, i._initialStyle = {
        transition: i.style.transition,
        overflow: i.style.overflow,
        [t]: i.style[t]
      };
    },
    onEnter(i) {
      const s = i._initialStyle;
      i.style.setProperty("transition", "none", "important"), i.style.overflow = "hidden";
      const u = `${i[a]}px`;
      i.style[t] = "0", i.offsetHeight, i.style.transition = s.transition, e && i._parent && i._parent.classList.add(e), requestAnimationFrame(() => {
        i.style[t] = u;
      });
    },
    onAfterEnter: o,
    onEnterCancelled: o,
    onLeave(i) {
      i._initialStyle = {
        transition: "",
        overflow: i.style.overflow,
        [t]: i.style[t]
      }, i.style.overflow = "hidden", i.style[t] = `${i[a]}px`, i.offsetHeight, requestAnimationFrame(() => i.style[t] = "0");
    },
    onAfterLeave: l,
    onLeaveCancelled: l
  };
  function l(i) {
    e && i._parent && i._parent.classList.remove(e), o(i);
  }
  function o(i) {
    const s = i._initialStyle[t];
    i.style.overflow = i._initialStyle.overflow, s != null && (i.style[t] = s), delete i._initialStyle;
  }
}
const gi = B({
  target: Object
}, "v-dialog-transition"), ya = z()({
  name: "VDialogTransition",
  props: gi(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = {
      onBeforeEnter(l) {
        l.style.pointerEvents = "none", l.style.visibility = "hidden";
      },
      async onEnter(l, o) {
        var v;
        await new Promise((m) => requestAnimationFrame(m)), await new Promise((m) => requestAnimationFrame(m)), l.style.visibility = "";
        const {
          x: i,
          y: s,
          sx: u,
          sy: c,
          speed: f
        } = Qa(e.target, l), d = ot(l, [{
          transform: `translate(${i}px, ${s}px) scale(${u}, ${c})`,
          opacity: 0
        }, {}], {
          duration: 225 * f,
          easing: ui
        });
        (v = $a(l)) == null || v.forEach((m) => {
          ot(m, [{
            opacity: 0
          }, {
            opacity: 0,
            offset: 0.33
          }, {}], {
            duration: 225 * 2 * f,
            easing: Mt
          });
        }), d.finished.then(() => o());
      },
      onAfterEnter(l) {
        l.style.removeProperty("pointer-events");
      },
      onBeforeLeave(l) {
        l.style.pointerEvents = "none";
      },
      async onLeave(l, o) {
        var v;
        await new Promise((m) => requestAnimationFrame(m));
        const {
          x: i,
          y: s,
          sx: u,
          sy: c,
          speed: f
        } = Qa(e.target, l);
        ot(l, [{}, {
          transform: `translate(${i}px, ${s}px) scale(${u}, ${c})`,
          opacity: 0
        }], {
          duration: 125 * f,
          easing: ci
        }).finished.then(() => o()), (v = $a(l)) == null || v.forEach((m) => {
          ot(m, [{}, {
            opacity: 0,
            offset: 0.2
          }, {
            opacity: 0
          }], {
            duration: 125 * 2 * f,
            easing: Mt
          });
        });
      },
      onAfterLeave(l) {
        l.style.removeProperty("pointer-events");
      }
    };
    return () => e.target ? r(st, U({
      name: "dialog-transition"
    }, a, {
      css: !1
    }), t) : r(st, {
      name: "dialog-transition"
    }, t);
  }
});
function $a(e) {
  var t;
  const n = (t = e.querySelector(":scope > .v-card, :scope > .v-sheet, :scope > .v-list")) == null ? void 0 : t.children;
  return n && [...n];
}
function Qa(e, n) {
  const t = e.getBoundingClientRect(), a = ca(n), [l, o] = getComputedStyle(n).transformOrigin.split(" ").map((b) => parseFloat(b)), [i, s] = getComputedStyle(n).getPropertyValue("--v-overlay-anchor-origin").split(" ");
  let u = t.left + t.width / 2;
  i === "left" || s === "left" ? u -= t.width / 2 : (i === "right" || s === "right") && (u += t.width / 2);
  let c = t.top + t.height / 2;
  i === "top" || s === "top" ? c -= t.height / 2 : (i === "bottom" || s === "bottom") && (c += t.height / 2);
  const f = t.width / a.width, d = t.height / a.height, v = Math.max(1, f, d), m = f / v || 0, y = d / v || 0, h = a.width * a.height / (window.innerWidth * window.innerHeight), C = h > 0.12 ? Math.min(1.5, (h - 0.12) * 10 + 1) : 1;
  return {
    x: u - (l + a.left),
    y: c - (o + a.top),
    sx: m,
    sy: y,
    speed: C
  };
}
Ie("fab-transition", "center center", "out-in");
Ie("dialog-bottom-transition");
Ie("dialog-top-transition");
const qa = Ie("fade-transition");
Ie("scale-transition");
Ie("scroll-x-transition");
Ie("scroll-x-reverse-transition");
Ie("scroll-y-transition");
Ie("scroll-y-reverse-transition");
Ie("slide-x-transition");
Ie("slide-x-reverse-transition");
const _l = Ie("slide-y-transition");
Ie("slide-y-reverse-transition");
const yi = kl("expand-transition", Vl()), Il = kl("expand-x-transition", Vl("", !0)), hi = B({
  defaults: Object,
  disabled: Boolean,
  reset: [Number, String],
  root: [Boolean, String],
  scoped: Boolean
}, "VDefaultsProvider"), me = z(!1)({
  name: "VDefaultsProvider",
  props: hi(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      defaults: a,
      disabled: l,
      reset: o,
      root: i,
      scoped: s
    } = fl(e);
    return Oe(a, {
      reset: o,
      root: i,
      scoped: s,
      disabled: l
    }), () => {
      var u;
      return (u = t.default) == null ? void 0 : u.call(t);
    };
  }
});
const $e = B({
  height: [Number, String],
  maxHeight: [Number, String],
  maxWidth: [Number, String],
  minHeight: [Number, String],
  minWidth: [Number, String],
  width: [Number, String]
}, "dimension");
function Qe(e) {
  return {
    dimensionStyles: g(() => ({
      height: ee(e.height),
      maxHeight: ee(e.maxHeight),
      maxWidth: ee(e.maxWidth),
      minHeight: ee(e.minHeight),
      minWidth: ee(e.minWidth),
      width: ee(e.width)
    }))
  };
}
function bi(e) {
  return {
    aspectStyles: g(() => {
      const n = Number(e.aspectRatio);
      return n ? {
        paddingBottom: String(1 / n * 100) + "%"
      } : void 0;
    })
  };
}
const Bl = B({
  aspectRatio: [String, Number],
  contentClass: String,
  inline: Boolean,
  ...Z(),
  ...$e()
}, "VResponsive"), Ha = z()({
  name: "VResponsive",
  props: Bl(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      aspectStyles: a
    } = bi(e), {
      dimensionStyles: l
    } = Qe(e);
    return K(() => {
      var o;
      return r("div", {
        class: ["v-responsive", {
          "v-responsive--inline": e.inline
        }, e.class],
        style: [l.value, e.style]
      }, [r("div", {
        class: "v-responsive__sizer",
        style: a.value
      }, null), (o = t.additional) == null ? void 0 : o.call(t), t.default && r("div", {
        class: ["v-responsive__content", e.contentClass]
      }, [t.default()])]);
    }), {};
  }
}), qt = B({
  transition: {
    type: [Boolean, String, Object],
    default: "fade-transition",
    validator: (e) => e !== !0
  }
}, "transition"), ze = (e, n) => {
  let {
    slots: t
  } = n;
  const {
    transition: a,
    disabled: l,
    ...o
  } = e, {
    component: i = st,
    ...s
  } = typeof a == "object" ? a : {};
  return At(i, U(typeof a == "string" ? {
    name: l ? "" : a
  } : s, o, {
    disabled: l
  }), t);
};
function Ci(e, n) {
  if (!ga)
    return;
  const t = n.modifiers || {}, a = n.value, {
    handler: l,
    options: o
  } = typeof a == "object" ? a : {
    handler: a,
    options: {}
  }, i = new IntersectionObserver(function() {
    var d;
    let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], u = arguments.length > 1 ? arguments[1] : void 0;
    const c = (d = e._observe) == null ? void 0 : d[n.instance.$.uid];
    if (!c)
      return;
    const f = s.some((v) => v.isIntersecting);
    l && (!t.quiet || c.init) && (!t.once || f || c.init) && l(f, s, u), f && t.once ? El(e, n) : c.init = !0;
  }, o);
  e._observe = Object(e._observe), e._observe[n.instance.$.uid] = {
    init: !1,
    observer: i
  }, i.observe(e);
}
function El(e, n) {
  var a;
  const t = (a = e._observe) == null ? void 0 : a[n.instance.$.uid];
  t && (t.observer.unobserve(e), delete e._observe[n.instance.$.uid]);
}
const pi = {
  mounted: Ci,
  unmounted: El
}, Pl = pi, Si = B({
  alt: String,
  cover: Boolean,
  eager: Boolean,
  gradient: String,
  lazySrc: String,
  options: {
    type: Object,
    // For more information on types, navigate to:
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    default: () => ({
      root: void 0,
      rootMargin: void 0,
      threshold: void 0
    })
  },
  sizes: String,
  src: {
    type: [String, Object],
    default: ""
  },
  srcset: String,
  ...Bl(),
  ...Z(),
  ...qt()
}, "VImg"), Tl = z()({
  name: "VImg",
  directives: {
    intersect: Pl
  },
  props: Si(),
  emits: {
    loadstart: (e) => !0,
    load: (e) => !0,
    error: (e) => !0
  },
  setup(e, n) {
    let {
      emit: t,
      slots: a
    } = n;
    const l = te(""), o = A(), i = te(e.eager ? "loading" : "idle"), s = te(), u = te(), c = g(() => e.src && typeof e.src == "object" ? {
      src: e.src.src,
      srcset: e.srcset || e.src.srcset,
      lazySrc: e.lazySrc || e.src.lazySrc,
      aspect: Number(e.aspectRatio || e.src.aspect || 0)
    } : {
      src: e.src,
      srcset: e.srcset,
      lazySrc: e.lazySrc,
      aspect: Number(e.aspectRatio || 0)
    }), f = g(() => c.value.aspect || s.value / u.value || 0);
    ae(() => e.src, () => {
      d(i.value !== "idle");
    }), ae(f, (_, V) => {
      !_ && V && o.value && C(o.value);
    }), ml(() => d());
    function d(_) {
      if (!(e.eager && _) && !(ga && !_ && !e.eager)) {
        if (i.value = "loading", c.value.lazySrc) {
          const V = new Image();
          V.src = c.value.lazySrc, C(V, null);
        }
        c.value.src && Se(() => {
          var V, D;
          if (t("loadstart", ((V = o.value) == null ? void 0 : V.currentSrc) || c.value.src), (D = o.value) != null && D.complete) {
            if (o.value.naturalWidth || m(), i.value === "error")
              return;
            f.value || C(o.value, null), v();
          } else
            f.value || C(o.value), y();
        });
      }
    }
    function v() {
      var _;
      y(), i.value = "loaded", t("load", ((_ = o.value) == null ? void 0 : _.currentSrc) || c.value.src);
    }
    function m() {
      var _;
      i.value = "error", t("error", ((_ = o.value) == null ? void 0 : _.currentSrc) || c.value.src);
    }
    function y() {
      const _ = o.value;
      _ && (l.value = _.currentSrc || _.src);
    }
    let h = -1;
    function C(_) {
      let V = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100;
      const D = () => {
        clearTimeout(h);
        const {
          naturalHeight: q,
          naturalWidth: N
        } = _;
        q || N ? (s.value = N, u.value = q) : !_.complete && i.value === "loading" && V != null ? h = window.setTimeout(D, V) : (_.currentSrc.endsWith(".svg") || _.currentSrc.startsWith("data:image/svg+xml")) && (s.value = 1, u.value = 1);
      };
      D();
    }
    const b = g(() => ({
      "v-img__img--cover": e.cover,
      "v-img__img--contain": !e.cover
    })), S = () => {
      var D;
      if (!c.value.src || i.value === "idle")
        return null;
      const _ = r("img", {
        class: ["v-img__img", b.value],
        src: c.value.src,
        srcset: c.value.srcset,
        alt: e.alt,
        sizes: e.sizes,
        ref: o,
        onLoad: v,
        onError: m
      }, null), V = (D = a.sources) == null ? void 0 : D.call(a);
      return r(ze, {
        transition: e.transition,
        appear: !0
      }, {
        default: () => [be(V ? r("picture", {
          class: "v-img__picture"
        }, [V, _]) : _, [[dt, i.value === "loaded"]])]
      });
    }, p = () => r(ze, {
      transition: e.transition
    }, {
      default: () => [c.value.lazySrc && i.value !== "loaded" && r("img", {
        class: ["v-img__img", "v-img__img--preload", b.value],
        src: c.value.lazySrc,
        alt: e.alt
      }, null)]
    }), w = () => a.placeholder ? r(ze, {
      transition: e.transition,
      appear: !0
    }, {
      default: () => [(i.value === "loading" || i.value === "error" && !a.error) && r("div", {
        class: "v-img__placeholder"
      }, [a.placeholder()])]
    }) : null, I = () => a.error ? r(ze, {
      transition: e.transition,
      appear: !0
    }, {
      default: () => [i.value === "error" && r("div", {
        class: "v-img__error"
      }, [a.error()])]
    }) : null, E = () => e.gradient ? r("div", {
      class: "v-img__gradient",
      style: {
        backgroundImage: `linear-gradient(${e.gradient})`
      }
    }, null) : null, O = te(!1);
    {
      const _ = ae(f, (V) => {
        V && (requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            O.value = !0;
          });
        }), _());
      });
    }
    return K(() => {
      const [_] = Ha.filterProps(e);
      return be(r(Ha, U({
        class: ["v-img", {
          "v-img--booting": !O.value
        }, e.class],
        style: e.style
      }, _, {
        aspectRatio: f.value,
        "aria-label": e.alt,
        role: e.alt ? "img" : void 0
      }), {
        additional: () => r(ue, null, [r(S, null, null), r(p, null, null), r(E, null, null), r(w, null, null), r(I, null, null)]),
        default: a.default
      }), [[Me("intersect"), {
        handler: d,
        options: e.options
      }, null, {
        once: !0
      }]]);
    }), {
      currentSrc: l,
      image: o,
      state: i,
      naturalWidth: s,
      naturalHeight: u
    };
  }
}), et = B({
  border: [Boolean, Number, String]
}, "border");
function tt(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ne();
  return {
    borderClasses: g(() => {
      const a = wt(e) ? e.value : e.border, l = [];
      if (a === !0 || a === "")
        l.push(`${n}--border`);
      else if (typeof a == "string" || a === 0)
        for (const o of String(a).split(" "))
          l.push(`border-${o}`);
      return l;
    })
  };
}
function ha(e) {
  return sa(() => {
    const n = [], t = {};
    return e.value.background && (Ua(e.value.background) ? t.backgroundColor = e.value.background : n.push(`bg-${e.value.background}`)), e.value.text && (Ua(e.value.text) ? (t.color = e.value.text, t.caretColor = e.value.text) : n.push(`text-${e.value.text}`)), {
      colorClasses: n,
      colorStyles: t
    };
  });
}
function Re(e, n) {
  const t = g(() => ({
    text: wt(e) ? e.value : n ? e[n] : null
  })), {
    colorClasses: a,
    colorStyles: l
  } = ha(t);
  return {
    textColorClasses: a,
    textColorStyles: l
  };
}
function We(e, n) {
  const t = g(() => ({
    background: wt(e) ? e.value : n ? e[n] : null
  })), {
    colorClasses: a,
    colorStyles: l
  } = ha(t);
  return {
    backgroundColorClasses: a,
    backgroundColorStyles: l
  };
}
const qe = B({
  elevation: {
    type: [Number, String],
    validator(e) {
      const n = parseInt(e);
      return !isNaN(n) && n >= 0 && // Material Design has a maximum elevation of 24
      // https://material.io/design/environment/elevation.html#default-elevations
      n <= 24;
    }
  }
}, "elevation");
function He(e) {
  return {
    elevationClasses: g(() => {
      const t = wt(e) ? e.value : e.elevation, a = [];
      return t == null || a.push(`elevation-${t}`), a;
    })
  };
}
const Be = B({
  rounded: {
    type: [Boolean, Number, String],
    default: void 0
  }
}, "rounded");
function Ee(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ne();
  return {
    roundedClasses: g(() => {
      const a = wt(e) ? e.value : e.rounded, l = [];
      if (a === !0 || a === "")
        l.push(`${n}--rounded`);
      else if (typeof a == "string" || a === 0)
        for (const o of String(a).split(" "))
          l.push(`rounded-${o}`);
      return l;
    })
  };
}
function Rl() {
  const e = te(!1);
  return kt(() => {
    window.requestAnimationFrame(() => {
      e.value = !0;
    });
  }), {
    ssrBootStyles: g(() => e.value ? void 0 : {
      transition: "none !important"
    }),
    isBooted: la(e)
  };
}
const xi = [null, "default", "comfortable", "compact"], we = B({
  density: {
    type: String,
    default: "default",
    validator: (e) => xi.includes(e)
  }
}, "density");
function Pe(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ne();
  return {
    densityClasses: g(() => `${n}--density-${e.density}`)
  };
}
const Ai = ["elevated", "flat", "tonal", "outlined", "text", "plain"];
function It(e, n) {
  return r(ue, null, [e && r("span", {
    key: "overlay",
    class: `${n}__overlay`
  }, null), r("span", {
    key: "underlay",
    class: `${n}__underlay`
  }, null)]);
}
const Ge = B({
  color: String,
  variant: {
    type: String,
    default: "elevated",
    validator: (e) => Ai.includes(e)
  }
}, "variant");
function Bt(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ne();
  const t = g(() => {
    const {
      variant: o
    } = X(e);
    return `${n}--variant-${o}`;
  }), {
    colorClasses: a,
    colorStyles: l
  } = ha(g(() => {
    const {
      variant: o,
      color: i
    } = X(e);
    return {
      [["elevated", "flat"].includes(o) ? "background" : "text"]: i
    };
  }));
  return {
    colorClasses: a,
    colorStyles: l,
    variantClasses: t
  };
}
const Ol = B({
  divided: Boolean,
  ...et(),
  ...Z(),
  ...we(),
  ...qe(),
  ...Be(),
  ...de(),
  ...ge(),
  ...Ge()
}, "VBtnGroup"), pt = z()({
  name: "VBtnGroup",
  props: Ol(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      themeClasses: a
    } = ye(e), {
      densityClasses: l
    } = Pe(e), {
      borderClasses: o
    } = tt(e), {
      elevationClasses: i
    } = He(e), {
      roundedClasses: s
    } = Ee(e);
    Oe({
      VBtn: {
        height: "auto",
        color: j(e, "color"),
        density: j(e, "density"),
        flat: !0,
        variant: j(e, "variant")
      }
    }), K(() => r(e.tag, {
      class: ["v-btn-group", {
        "v-btn-group--divided": e.divided
      }, a.value, o.value, l.value, i.value, s.value, e.class],
      style: e.style
    }, t));
  }
}), ba = B({
  modelValue: {
    type: null,
    default: void 0
  },
  multiple: Boolean,
  mandatory: [Boolean, String],
  max: Number,
  selectedClass: String,
  disabled: Boolean
}, "group"), Ca = B({
  value: null,
  disabled: Boolean,
  selectedClass: String
}, "group-item");
function pa(e, n) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  const a = Ae("useGroupItem");
  if (!a)
    throw new Error("[Vuetify] useGroupItem composable must be used inside a component setup function");
  const l = De();
  xe(Symbol.for(`${n.description}:id`), l);
  const o = se(n, null);
  if (!o) {
    if (!t)
      return o;
    throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${n.description}`);
  }
  const i = j(e, "value"), s = g(() => o.disabled.value || e.disabled);
  o.register({
    id: l,
    value: i,
    disabled: s
  }, a), ct(() => {
    o.unregister(l);
  });
  const u = g(() => o.isSelected(l)), c = g(() => u.value && [o.selectedClass.value, e.selectedClass]);
  return ae(u, (f) => {
    a.emit("group:selected", {
      value: f
    });
  }), {
    id: l,
    isSelected: u,
    toggle: () => o.select(l, !u.value),
    select: (f) => o.select(l, f),
    selectedClass: c,
    value: i,
    disabled: s,
    group: o
  };
}
function Cn(e, n) {
  let t = !1;
  const a = gn([]), l = ce(e, "modelValue", [], (v) => v == null ? [] : Dl(a, je(v)), (v) => {
    const m = ki(a, v);
    return e.multiple ? m : m[0];
  }), o = Ae("useGroup");
  function i(v, m) {
    const y = v, h = Symbol.for(`${n.description}:id`), b = an(h, o == null ? void 0 : o.vnode).indexOf(m);
    b > -1 ? a.splice(b, 0, y) : a.push(y);
  }
  function s(v) {
    if (t)
      return;
    u();
    const m = a.findIndex((y) => y.id === v);
    a.splice(m, 1);
  }
  function u() {
    const v = a.find((m) => !m.disabled);
    v && e.mandatory === "force" && !l.value.length && (l.value = [v.id]);
  }
  kt(() => {
    u();
  }), ct(() => {
    t = !0;
  });
  function c(v, m) {
    const y = a.find((h) => h.id === v);
    if (!(m && (y != null && y.disabled)))
      if (e.multiple) {
        const h = l.value.slice(), C = h.findIndex((S) => S === v), b = ~C;
        if (m = m ?? !b, b && e.mandatory && h.length <= 1 || !b && e.max != null && h.length + 1 > e.max)
          return;
        C < 0 && m ? h.push(v) : C >= 0 && !m && h.splice(C, 1), l.value = h;
      } else {
        const h = l.value.includes(v);
        if (e.mandatory && h)
          return;
        l.value = m ?? !h ? [v] : [];
      }
  }
  function f(v) {
    if (e.multiple && da('This method is not supported when using "multiple" prop'), l.value.length) {
      const m = l.value[0], y = a.findIndex((b) => b.id === m);
      let h = (y + v) % a.length, C = a[h];
      for (; C.disabled && h !== y; )
        h = (h + v) % a.length, C = a[h];
      if (C.disabled)
        return;
      l.value = [a[h].id];
    } else {
      const m = a.find((y) => !y.disabled);
      m && (l.value = [m.id]);
    }
  }
  const d = {
    register: i,
    unregister: s,
    selected: l,
    select: c,
    disabled: j(e, "disabled"),
    prev: () => f(a.length - 1),
    next: () => f(1),
    isSelected: (v) => l.value.includes(v),
    selectedClass: g(() => e.selectedClass),
    items: g(() => a),
    getItemIndex: (v) => wi(a, v)
  };
  return xe(n, d), d;
}
function wi(e, n) {
  const t = Dl(e, [n]);
  return t.length ? e.findIndex((a) => a.id === t[0]) : -1;
}
function Dl(e, n) {
  const t = [];
  return n.forEach((a) => {
    const l = e.find((i) => Vt(a, i.value)), o = e[a];
    (l == null ? void 0 : l.value) != null ? t.push(l.id) : o != null && t.push(o.id);
  }), t;
}
function ki(e, n) {
  const t = [];
  return n.forEach((a) => {
    const l = e.findIndex((o) => o.id === a);
    if (~l) {
      const o = e[l];
      t.push(o.value != null ? o.value : l);
    }
  }), t;
}
const Fl = Symbol.for("vuetify:v-btn-toggle"), Vi = B({
  ...Ol(),
  ...ba()
}, "VBtnToggle");
z()({
  name: "VBtnToggle",
  props: Vi(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      isSelected: a,
      next: l,
      prev: o,
      select: i,
      selected: s
    } = Cn(e, Fl);
    return K(() => {
      const [u] = pt.filterProps(e);
      return r(pt, U({
        class: ["v-btn-toggle", e.class]
      }, u, {
        style: e.style
      }), {
        default: () => {
          var c;
          return [(c = t.default) == null ? void 0 : c.call(t, {
            isSelected: a,
            next: l,
            prev: o,
            select: i,
            selected: s
          })];
        }
      });
    }), {
      next: l,
      prev: o,
      select: i
    };
  }
});
const le = [String, Function, Object, Array], _i = Symbol.for("vuetify:icons"), pn = B({
  icon: {
    type: le
  },
  // Could not remove this and use makeTagProps, types complained because it is not required
  tag: {
    type: String,
    required: !0
  }
}, "icon"), Ga = z()({
  name: "VComponentIcon",
  props: pn(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    return () => {
      const a = e.icon;
      return r(e.tag, null, {
        default: () => {
          var l;
          return [e.icon ? r(a, null, null) : (l = t.default) == null ? void 0 : l.call(t)];
        }
      });
    };
  }
}), Ii = Qt({
  name: "VSvgIcon",
  inheritAttrs: !1,
  props: pn(),
  setup(e, n) {
    let {
      attrs: t
    } = n;
    return () => r(e.tag, U(t, {
      style: null
    }), {
      default: () => [r("svg", {
        class: "v-icon__svg",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        role: "img",
        "aria-hidden": "true"
      }, [Array.isArray(e.icon) ? e.icon.map((a) => Array.isArray(a) ? r("path", {
        d: a[0],
        "fill-opacity": a[1]
      }, null) : r("path", {
        d: a
      }, null)) : r("path", {
        d: e.icon
      }, null)])]
    });
  }
});
Qt({
  name: "VLigatureIcon",
  props: pn(),
  setup(e) {
    return () => r(e.tag, null, {
      default: () => [e.icon]
    });
  }
});
Qt({
  name: "VClassIcon",
  props: pn(),
  setup(e) {
    return () => r(e.tag, {
      class: e.icon
    }, null);
  }
});
const Bi = (e) => {
  const n = se(_i);
  if (!n)
    throw new Error("Missing Vuetify Icons provide!");
  return {
    iconData: g(() => {
      var u;
      const a = X(e);
      if (!a)
        return {
          component: Ga
        };
      let l = a;
      if (typeof l == "string" && (l = l.trim(), l.startsWith("$") && (l = (u = n.aliases) == null ? void 0 : u[l.slice(1)])), !l)
        throw new Error(`Could not find aliased icon "${a}"`);
      if (Array.isArray(l))
        return {
          component: Ii,
          icon: l
        };
      if (typeof l != "string")
        return {
          component: Ga,
          icon: l
        };
      const o = Object.keys(n.sets).find((c) => typeof l == "string" && l.startsWith(`${c}:`)), i = o ? l.slice(o.length + 1) : l;
      return {
        component: n.sets[o ?? n.defaultSet].component,
        icon: i
      };
    })
  };
}, Ei = ["x-small", "small", "default", "large", "x-large"], Ht = B({
  size: {
    type: [String, Number],
    default: "default"
  }
}, "size");
function Gt(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ne();
  return sa(() => {
    let t, a;
    return rn(Ei, e.size) ? t = `${n}--size-${e.size}` : e.size && (a = {
      width: ee(e.size),
      height: ee(e.size)
    }), {
      sizeClasses: t,
      sizeStyles: a
    };
  });
}
const Pi = B({
  color: String,
  start: Boolean,
  end: Boolean,
  icon: le,
  ...Z(),
  ...Ht(),
  ...de({
    tag: "i"
  }),
  ...ge()
}, "VIcon"), oe = z()({
  name: "VIcon",
  props: Pi(),
  setup(e, n) {
    let {
      attrs: t,
      slots: a
    } = n;
    const l = A(), {
      themeClasses: o
    } = ye(e), {
      iconData: i
    } = Bi(g(() => l.value || e.icon)), {
      sizeClasses: s
    } = Gt(e), {
      textColorClasses: u,
      textColorStyles: c
    } = Re(j(e, "color"));
    return K(() => {
      var d, v;
      const f = (d = a.default) == null ? void 0 : d.call(a);
      return f && (l.value = (v = bl(f).filter((m) => m.type === Yo && m.children && typeof m.children == "string")[0]) == null ? void 0 : v.children), r(i.value.component, {
        tag: e.tag,
        icon: i.value.icon,
        class: ["v-icon", "notranslate", o.value, s.value, u.value, {
          "v-icon--clickable": !!t.onClick,
          "v-icon--start": e.start,
          "v-icon--end": e.end
        }, e.class],
        style: [s.value ? void 0 : {
          fontSize: ee(e.size),
          height: ee(e.size),
          width: ee(e.size)
        }, c.value, e.style],
        role: t.onClick ? "button" : void 0,
        "aria-hidden": !t.onClick
      }, {
        default: () => [f]
      });
    }), {};
  }
});
function Ml(e, n) {
  const t = A(), a = te(!1);
  if (ga) {
    const l = new IntersectionObserver((o) => {
      e == null || e(o, l), a.value = !!o.find((i) => i.isIntersecting);
    }, n);
    ct(() => {
      l.disconnect();
    }), ae(t, (o, i) => {
      i && (l.unobserve(i), a.value = !1), o && l.observe(o);
    }, {
      flush: "post"
    });
  }
  return {
    intersectionRef: t,
    isIntersecting: a
  };
}
const Ti = B({
  bgColor: String,
  color: String,
  indeterminate: [Boolean, String],
  modelValue: {
    type: [Number, String],
    default: 0
  },
  rotate: {
    type: [Number, String],
    default: 0
  },
  width: {
    type: [Number, String],
    default: 4
  },
  ...Z(),
  ...Ht(),
  ...de({
    tag: "div"
  }),
  ...ge()
}, "VProgressCircular"), Sn = z()({
  name: "VProgressCircular",
  props: Ti(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = 20, l = 2 * Math.PI * a, o = A(), {
      themeClasses: i
    } = ye(e), {
      sizeClasses: s,
      sizeStyles: u
    } = Gt(e), {
      textColorClasses: c,
      textColorStyles: f
    } = Re(j(e, "color")), {
      textColorClasses: d,
      textColorStyles: v
    } = Re(j(e, "bgColor")), {
      intersectionRef: m,
      isIntersecting: y
    } = Ml(), {
      resizeRef: h,
      contentRect: C
    } = Qn(), b = g(() => Math.max(0, Math.min(100, parseFloat(e.modelValue)))), S = g(() => Number(e.width)), p = g(() => u.value ? Number(e.size) : C.value ? C.value.width : Math.max(S.value, 32)), w = g(() => a / (1 - S.value / p.value) * 2), I = g(() => S.value / p.value * w.value), E = g(() => ee((100 - b.value) / 100 * l));
    return xt(() => {
      m.value = o.value, h.value = o.value;
    }), K(() => r(e.tag, {
      ref: o,
      class: ["v-progress-circular", {
        "v-progress-circular--indeterminate": !!e.indeterminate,
        "v-progress-circular--visible": y.value,
        "v-progress-circular--disable-shrink": e.indeterminate === "disable-shrink"
      }, i.value, s.value, c.value, e.class],
      style: [u.value, f.value, e.style],
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": e.indeterminate ? void 0 : b.value
    }, {
      default: () => [r("svg", {
        style: {
          transform: `rotate(calc(-90deg + ${Number(e.rotate)}deg))`
        },
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: `0 0 ${w.value} ${w.value}`
      }, [r("circle", {
        class: ["v-progress-circular__underlay", d.value],
        style: v.value,
        fill: "transparent",
        cx: "50%",
        cy: "50%",
        r: a,
        "stroke-width": I.value,
        "stroke-dasharray": l,
        "stroke-dashoffset": 0
      }, null), r("circle", {
        class: "v-progress-circular__overlay",
        fill: "transparent",
        cx: "50%",
        cy: "50%",
        r: a,
        "stroke-width": I.value,
        "stroke-dasharray": l,
        "stroke-dashoffset": E.value
      }, null)]), t.default && r("div", {
        class: "v-progress-circular__content"
      }, [t.default({
        value: b.value
      })])]
    })), {};
  }
});
const Ka = {
  center: "center",
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}, Et = B({
  location: String
}, "location");
function Pt(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, t = arguments.length > 2 ? arguments[2] : void 0;
  const {
    isRtl: a
  } = Xe();
  return {
    locationStyles: g(() => {
      if (!e.location)
        return {};
      const {
        side: o,
        align: i
      } = Nn(e.location.split(" ").length > 1 ? e.location : `${e.location} center`, a.value);
      function s(c) {
        return t ? t(c) : 0;
      }
      const u = {};
      return o !== "center" && (n ? u[Ka[o]] = `calc(100% - ${s(o)}px)` : u[o] = 0), i !== "center" ? n ? u[Ka[i]] = `calc(100% - ${s(i)}px)` : u[i] = 0 : (o === "center" ? u.top = u.left = "50%" : u[{
        top: "left",
        bottom: "left",
        left: "top",
        right: "top"
      }[o]] = "50%", u.transform = {
        top: "translateX(-50%)",
        bottom: "translateX(-50%)",
        left: "translateY(-50%)",
        right: "translateY(-50%)",
        center: "translate(-50%, -50%)"
      }[o]), u;
    })
  };
}
const Ri = B({
  absolute: Boolean,
  active: {
    type: Boolean,
    default: !0
  },
  bgColor: String,
  bgOpacity: [Number, String],
  bufferValue: {
    type: [Number, String],
    default: 0
  },
  clickable: Boolean,
  color: String,
  height: {
    type: [Number, String],
    default: 4
  },
  indeterminate: Boolean,
  max: {
    type: [Number, String],
    default: 100
  },
  modelValue: {
    type: [Number, String],
    default: 0
  },
  reverse: Boolean,
  stream: Boolean,
  striped: Boolean,
  roundedBar: Boolean,
  ...Z(),
  ...Et({
    location: "top"
  }),
  ...Be(),
  ...de(),
  ...ge()
}, "VProgressLinear"), Ll = z()({
  name: "VProgressLinear",
  props: Ri(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = ce(e, "modelValue"), {
      isRtl: l,
      rtlClasses: o
    } = Xe(), {
      themeClasses: i
    } = ye(e), {
      locationStyles: s
    } = Pt(e), {
      textColorClasses: u,
      textColorStyles: c
    } = Re(e, "color"), {
      backgroundColorClasses: f,
      backgroundColorStyles: d
    } = We(g(() => e.bgColor || e.color)), {
      backgroundColorClasses: v,
      backgroundColorStyles: m
    } = We(e, "color"), {
      roundedClasses: y
    } = Ee(e), {
      intersectionRef: h,
      isIntersecting: C
    } = Ml(), b = g(() => parseInt(e.max, 10)), S = g(() => parseInt(e.height, 10)), p = g(() => parseFloat(e.bufferValue) / b.value * 100), w = g(() => parseFloat(a.value) / b.value * 100), I = g(() => l.value !== e.reverse), E = g(() => e.indeterminate ? "fade-transition" : "slide-x-transition"), O = g(() => e.bgOpacity == null ? e.bgOpacity : parseFloat(e.bgOpacity));
    function _(V) {
      if (!h.value)
        return;
      const {
        left: D,
        right: q,
        width: N
      } = h.value.getBoundingClientRect(), k = I.value ? N - V.clientX + (q - N) : V.clientX - D;
      a.value = Math.round(k / N * b.value);
    }
    return K(() => r(e.tag, {
      ref: h,
      class: ["v-progress-linear", {
        "v-progress-linear--absolute": e.absolute,
        "v-progress-linear--active": e.active && C.value,
        "v-progress-linear--reverse": I.value,
        "v-progress-linear--rounded": e.rounded,
        "v-progress-linear--rounded-bar": e.roundedBar,
        "v-progress-linear--striped": e.striped
      }, y.value, i.value, o.value, e.class],
      style: [{
        bottom: e.location === "bottom" ? 0 : void 0,
        top: e.location === "top" ? 0 : void 0,
        height: e.active ? ee(S.value) : 0,
        "--v-progress-linear-height": ee(S.value),
        ...s.value
      }, e.style],
      role: "progressbar",
      "aria-hidden": e.active ? "false" : "true",
      "aria-valuemin": "0",
      "aria-valuemax": e.max,
      "aria-valuenow": e.indeterminate ? void 0 : w.value,
      onClick: e.clickable && _
    }, {
      default: () => [e.stream && r("div", {
        key: "stream",
        class: ["v-progress-linear__stream", u.value],
        style: {
          ...c.value,
          [I.value ? "left" : "right"]: ee(-S.value),
          borderTop: `${ee(S.value / 2)} dotted`,
          opacity: O.value,
          top: `calc(50% - ${ee(S.value / 4)})`,
          width: ee(100 - p.value, "%"),
          "--v-progress-linear-stream-to": ee(S.value * (I.value ? 1 : -1))
        }
      }, null), r("div", {
        class: ["v-progress-linear__background", f.value],
        style: [d.value, {
          opacity: O.value,
          width: ee(e.stream ? p.value : 100, "%")
        }]
      }, null), r(st, {
        name: E.value
      }, {
        default: () => [e.indeterminate ? r("div", {
          class: "v-progress-linear__indeterminate"
        }, [["long", "short"].map((V) => r("div", {
          key: V,
          class: ["v-progress-linear__indeterminate", V, v.value],
          style: m.value
        }, null))]) : r("div", {
          class: ["v-progress-linear__determinate", v.value],
          style: [m.value, {
            width: ee(w.value, "%")
          }]
        }, null)]
      }), t.default && r("div", {
        class: "v-progress-linear__content"
      }, [t.default({
        value: w.value,
        buffer: p.value
      })])]
    })), {};
  }
}), Sa = B({
  loading: [Boolean, String]
}, "loader");
function xn(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ne();
  return {
    loaderClasses: g(() => ({
      [`${n}--loading`]: e.loading
    }))
  };
}
function xa(e, n) {
  var a;
  let {
    slots: t
  } = n;
  return r("div", {
    class: `${e.name}__loader`
  }, [((a = t.default) == null ? void 0 : a.call(t, {
    color: e.color,
    isActive: e.active
  })) || r(Ll, {
    active: e.active,
    color: e.color,
    height: "2",
    indeterminate: !0
  }, null)]);
}
const Oi = ["static", "relative", "fixed", "absolute", "sticky"], Kt = B({
  position: {
    type: String,
    validator: (
      /* istanbul ignore next */
      (e) => Oi.includes(e)
    )
  }
}, "position");
function Yt(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ne();
  return {
    positionClasses: g(() => e.position ? `${n}--${e.position}` : void 0)
  };
}
function Di() {
  var e, n;
  return (n = (e = Ae("useRouter")) == null ? void 0 : e.proxy) == null ? void 0 : n.$router;
}
function Wt(e, n) {
  const t = Wo("RouterLink"), a = g(() => !!(e.href || e.to)), l = g(() => (a == null ? void 0 : a.value) || Fa(n, "click") || Fa(e, "click"));
  if (typeof t == "string")
    return {
      isLink: a,
      isClickable: l,
      href: j(e, "href")
    };
  const o = e.to ? t.useLink(e) : void 0;
  return {
    isLink: a,
    isClickable: l,
    route: o == null ? void 0 : o.route,
    navigate: o == null ? void 0 : o.navigate,
    isActive: o && g(() => {
      var i, s;
      return e.exact ? (i = o.isExactActive) == null ? void 0 : i.value : (s = o.isActive) == null ? void 0 : s.value;
    }),
    href: g(() => e.to ? o == null ? void 0 : o.route.value.href : e.href)
  };
}
const Zt = B({
  href: String,
  replace: Boolean,
  to: [String, Object],
  exact: Boolean
}, "router");
let En = !1;
function Fi(e, n) {
  let t = !1, a, l;
  _e && (Se(() => {
    window.addEventListener("popstate", o), a = e == null ? void 0 : e.beforeEach((i, s, u) => {
      En ? t ? n(u) : u() : setTimeout(() => t ? n(u) : u()), En = !0;
    }), l = e == null ? void 0 : e.afterEach(() => {
      En = !1;
    });
  }), pe(() => {
    window.removeEventListener("popstate", o), a == null || a(), l == null || l();
  }));
  function o(i) {
    var s;
    (s = i.state) != null && s.replaced || (t = !0, setTimeout(() => t = !1));
  }
}
function Mi(e, n) {
  ae(() => {
    var t;
    return (t = e.isActive) == null ? void 0 : t.value;
  }, (t) => {
    e.isLink.value && t && n && Se(() => {
      n(!0);
    });
  }, {
    immediate: !0
  });
}
const qn = Symbol("rippleStop"), Li = 80;
function Ya(e, n) {
  e.style.transform = n, e.style.webkitTransform = n;
}
function Hn(e) {
  return e.constructor.name === "TouchEvent";
}
function zl(e) {
  return e.constructor.name === "KeyboardEvent";
}
const zi = function(e, n) {
  var d;
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a = 0, l = 0;
  if (!zl(e)) {
    const v = n.getBoundingClientRect(), m = Hn(e) ? e.touches[e.touches.length - 1] : e;
    a = m.clientX - v.left, l = m.clientY - v.top;
  }
  let o = 0, i = 0.3;
  (d = n._ripple) != null && d.circle ? (i = 0.15, o = n.clientWidth / 2, o = t.center ? o : o + Math.sqrt((a - o) ** 2 + (l - o) ** 2) / 4) : o = Math.sqrt(n.clientWidth ** 2 + n.clientHeight ** 2) / 2;
  const s = `${(n.clientWidth - o * 2) / 2}px`, u = `${(n.clientHeight - o * 2) / 2}px`, c = t.center ? s : `${a - o}px`, f = t.center ? u : `${l - o}px`;
  return {
    radius: o,
    scale: i,
    x: c,
    y: f,
    centerX: s,
    centerY: u
  };
}, dn = {
  /* eslint-disable max-statements */
  show(e, n) {
    var m;
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (!((m = n == null ? void 0 : n._ripple) != null && m.enabled))
      return;
    const a = document.createElement("span"), l = document.createElement("span");
    a.appendChild(l), a.className = "v-ripple__container", t.class && (a.className += ` ${t.class}`);
    const {
      radius: o,
      scale: i,
      x: s,
      y: u,
      centerX: c,
      centerY: f
    } = zi(e, n, t), d = `${o * 2}px`;
    l.className = "v-ripple__animation", l.style.width = d, l.style.height = d, n.appendChild(a);
    const v = window.getComputedStyle(n);
    v && v.position === "static" && (n.style.position = "relative", n.dataset.previousPosition = "static"), l.classList.add("v-ripple__animation--enter"), l.classList.add("v-ripple__animation--visible"), Ya(l, `translate(${s}, ${u}) scale3d(${i},${i},${i})`), l.dataset.activated = String(performance.now()), setTimeout(() => {
      l.classList.remove("v-ripple__animation--enter"), l.classList.add("v-ripple__animation--in"), Ya(l, `translate(${c}, ${f}) scale3d(1,1,1)`);
    }, 0);
  },
  hide(e) {
    var o;
    if (!((o = e == null ? void 0 : e._ripple) != null && o.enabled))
      return;
    const n = e.getElementsByClassName("v-ripple__animation");
    if (n.length === 0)
      return;
    const t = n[n.length - 1];
    if (t.dataset.isHiding)
      return;
    t.dataset.isHiding = "true";
    const a = performance.now() - Number(t.dataset.activated), l = Math.max(250 - a, 0);
    setTimeout(() => {
      t.classList.remove("v-ripple__animation--in"), t.classList.add("v-ripple__animation--out"), setTimeout(() => {
        var s;
        e.getElementsByClassName("v-ripple__animation").length === 1 && e.dataset.previousPosition && (e.style.position = e.dataset.previousPosition, delete e.dataset.previousPosition), ((s = t.parentNode) == null ? void 0 : s.parentNode) === e && e.removeChild(t.parentNode);
      }, 300);
    }, l);
  }
};
function jl(e) {
  return typeof e > "u" || !!e;
}
function Lt(e) {
  const n = {}, t = e.currentTarget;
  if (!(!(t != null && t._ripple) || t._ripple.touched || e[qn])) {
    if (e[qn] = !0, Hn(e))
      t._ripple.touched = !0, t._ripple.isTouch = !0;
    else if (t._ripple.isTouch)
      return;
    if (n.center = t._ripple.centered || zl(e), t._ripple.class && (n.class = t._ripple.class), Hn(e)) {
      if (t._ripple.showTimerCommit)
        return;
      t._ripple.showTimerCommit = () => {
        dn.show(e, t, n);
      }, t._ripple.showTimer = window.setTimeout(() => {
        var a;
        (a = t == null ? void 0 : t._ripple) != null && a.showTimerCommit && (t._ripple.showTimerCommit(), t._ripple.showTimerCommit = null);
      }, Li);
    } else
      dn.show(e, t, n);
  }
}
function Wa(e) {
  e[qn] = !0;
}
function Ve(e) {
  const n = e.currentTarget;
  if (n != null && n._ripple) {
    if (window.clearTimeout(n._ripple.showTimer), e.type === "touchend" && n._ripple.showTimerCommit) {
      n._ripple.showTimerCommit(), n._ripple.showTimerCommit = null, n._ripple.showTimer = window.setTimeout(() => {
        Ve(e);
      });
      return;
    }
    window.setTimeout(() => {
      n._ripple && (n._ripple.touched = !1);
    }), dn.hide(n);
  }
}
function Ul(e) {
  const n = e.currentTarget;
  n != null && n._ripple && (n._ripple.showTimerCommit && (n._ripple.showTimerCommit = null), window.clearTimeout(n._ripple.showTimer));
}
let zt = !1;
function Nl(e) {
  !zt && (e.keyCode === Oa.enter || e.keyCode === Oa.space) && (zt = !0, Lt(e));
}
function $l(e) {
  zt = !1, Ve(e);
}
function Ql(e) {
  zt && (zt = !1, Ve(e));
}
function ql(e, n, t) {
  const {
    value: a,
    modifiers: l
  } = n, o = jl(a);
  if (o || dn.hide(e), e._ripple = e._ripple ?? {}, e._ripple.enabled = o, e._ripple.centered = l.center, e._ripple.circle = l.circle, zn(a) && a.class && (e._ripple.class = a.class), o && !t) {
    if (l.stop) {
      e.addEventListener("touchstart", Wa, {
        passive: !0
      }), e.addEventListener("mousedown", Wa);
      return;
    }
    e.addEventListener("touchstart", Lt, {
      passive: !0
    }), e.addEventListener("touchend", Ve, {
      passive: !0
    }), e.addEventListener("touchmove", Ul, {
      passive: !0
    }), e.addEventListener("touchcancel", Ve), e.addEventListener("mousedown", Lt), e.addEventListener("mouseup", Ve), e.addEventListener("mouseleave", Ve), e.addEventListener("keydown", Nl), e.addEventListener("keyup", $l), e.addEventListener("blur", Ql), e.addEventListener("dragstart", Ve, {
      passive: !0
    });
  } else
    !o && t && Hl(e);
}
function Hl(e) {
  e.removeEventListener("mousedown", Lt), e.removeEventListener("touchstart", Lt), e.removeEventListener("touchend", Ve), e.removeEventListener("touchmove", Ul), e.removeEventListener("touchcancel", Ve), e.removeEventListener("mouseup", Ve), e.removeEventListener("mouseleave", Ve), e.removeEventListener("keydown", Nl), e.removeEventListener("keyup", $l), e.removeEventListener("dragstart", Ve), e.removeEventListener("blur", Ql);
}
function ji(e, n) {
  ql(e, n, !1);
}
function Ui(e) {
  delete e._ripple, Hl(e);
}
function Ni(e, n) {
  if (n.value === n.oldValue)
    return;
  const t = jl(n.oldValue);
  ql(e, n, t);
}
const Jt = {
  mounted: ji,
  unmounted: Ui,
  updated: Ni
}, Gl = B({
  active: {
    type: Boolean,
    default: void 0
  },
  symbol: {
    type: null,
    default: Fl
  },
  flat: Boolean,
  icon: [Boolean, String, Function, Object],
  prependIcon: le,
  appendIcon: le,
  block: Boolean,
  stacked: Boolean,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  text: String,
  ...et(),
  ...Z(),
  ...we(),
  ...$e(),
  ...qe(),
  ...Ca(),
  ...Sa(),
  ...Et(),
  ...Kt(),
  ...Be(),
  ...Zt(),
  ...Ht(),
  ...de({
    tag: "button"
  }),
  ...ge(),
  ...Ge({
    variant: "elevated"
  })
}, "VBtn"), Y = z()({
  name: "VBtn",
  directives: {
    Ripple: Jt
  },
  props: Gl(),
  emits: {
    "group:selected": (e) => !0
  },
  setup(e, n) {
    let {
      attrs: t,
      slots: a
    } = n;
    const {
      themeClasses: l
    } = ye(e), {
      borderClasses: o
    } = tt(e), {
      colorClasses: i,
      colorStyles: s,
      variantClasses: u
    } = Bt(e), {
      densityClasses: c
    } = Pe(e), {
      dimensionStyles: f
    } = Qe(e), {
      elevationClasses: d
    } = He(e), {
      loaderClasses: v
    } = xn(e), {
      locationStyles: m
    } = Pt(e), {
      positionClasses: y
    } = Yt(e), {
      roundedClasses: h
    } = Ee(e), {
      sizeClasses: C,
      sizeStyles: b
    } = Gt(e), S = pa(e, e.symbol, !1), p = Wt(e, t), w = g(() => {
      var V;
      return e.active !== void 0 ? e.active : p.isLink.value ? (V = p.isActive) == null ? void 0 : V.value : S == null ? void 0 : S.isSelected.value;
    }), I = g(() => (S == null ? void 0 : S.disabled.value) || e.disabled), E = g(() => e.variant === "elevated" && !(e.disabled || e.flat || e.border)), O = g(() => {
      if (e.value !== void 0)
        return Object(e.value) === e.value ? JSON.stringify(e.value, null, 0) : e.value;
    });
    function _(V) {
      var D;
      I.value || ((D = p.navigate) == null || D.call(p, V), S == null || S.toggle());
    }
    return Mi(p, S == null ? void 0 : S.select), K(() => {
      var P, $;
      const V = p.isLink.value ? "a" : e.tag, D = !!(e.prependIcon || a.prepend), q = !!(e.appendIcon || a.append), N = !!(e.icon && e.icon !== !0), k = (S == null ? void 0 : S.isSelected.value) && (!p.isLink.value || ((P = p.isActive) == null ? void 0 : P.value)) || !S || (($ = p.isActive) == null ? void 0 : $.value);
      return be(r(V, {
        type: V === "a" ? void 0 : "button",
        class: ["v-btn", S == null ? void 0 : S.selectedClass.value, {
          "v-btn--active": w.value,
          "v-btn--block": e.block,
          "v-btn--disabled": I.value,
          "v-btn--elevated": E.value,
          "v-btn--flat": e.flat,
          "v-btn--icon": !!e.icon,
          "v-btn--loading": e.loading,
          "v-btn--stacked": e.stacked
        }, l.value, o.value, k ? i.value : void 0, c.value, d.value, v.value, y.value, h.value, C.value, u.value, e.class],
        style: [k ? s.value : void 0, f.value, m.value, b.value, e.style],
        disabled: I.value || void 0,
        href: p.href.value,
        onClick: _,
        value: O.value
      }, {
        default: () => {
          var W;
          return [It(!0, "v-btn"), !e.icon && D && r("span", {
            key: "prepend",
            class: "v-btn__prepend"
          }, [a.prepend ? r(me, {
            key: "prepend-defaults",
            disabled: !e.prependIcon,
            defaults: {
              VIcon: {
                icon: e.prependIcon
              }
            }
          }, a.prepend) : r(oe, {
            key: "prepend-icon",
            icon: e.prependIcon
          }, null)]), r("span", {
            class: "v-btn__content",
            "data-no-activator": ""
          }, [!a.default && N ? r(oe, {
            key: "content-icon",
            icon: e.icon
          }, null) : r(me, {
            key: "content-defaults",
            disabled: !N,
            defaults: {
              VIcon: {
                icon: e.icon
              }
            }
          }, {
            default: () => {
              var J;
              return [((J = a.default) == null ? void 0 : J.call(a)) ?? e.text];
            }
          })]), !e.icon && q && r("span", {
            key: "append",
            class: "v-btn__append"
          }, [a.append ? r(me, {
            key: "append-defaults",
            disabled: !e.appendIcon,
            defaults: {
              VIcon: {
                icon: e.appendIcon
              }
            }
          }, a.append) : r(oe, {
            key: "append-icon",
            icon: e.appendIcon
          }, null)]), !!e.loading && r("span", {
            key: "loader",
            class: "v-btn__loader"
          }, [((W = a.loader) == null ? void 0 : W.call(a)) ?? r(Sn, {
            color: typeof e.loading == "boolean" ? void 0 : e.loading,
            indeterminate: !0,
            size: "23",
            width: "2"
          }, null)])];
        }
      }), [[Me("ripple"), !I.value && e.ripple, null]]);
    }), {};
  }
});
const $i = vt("v-alert-title"), Qi = ["success", "info", "warning", "error"], qi = B({
  border: {
    type: [Boolean, String],
    validator: (e) => typeof e == "boolean" || ["top", "end", "bottom", "start"].includes(e)
  },
  borderColor: String,
  closable: Boolean,
  closeIcon: {
    type: le,
    default: "$close"
  },
  closeLabel: {
    type: String,
    default: "$vuetify.close"
  },
  icon: {
    type: [Boolean, String, Function, Object],
    default: null
  },
  modelValue: {
    type: Boolean,
    default: !0
  },
  prominent: Boolean,
  title: String,
  text: String,
  type: {
    type: String,
    validator: (e) => Qi.includes(e)
  },
  ...Z(),
  ...we(),
  ...$e(),
  ...qe(),
  ...Et(),
  ...Kt(),
  ...Be(),
  ...de(),
  ...ge(),
  ...Ge({
    variant: "flat"
  })
}, "VAlert"), Gn = z()({
  name: "VAlert",
  props: qi(),
  emits: {
    "click:close": (e) => !0,
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      emit: t,
      slots: a
    } = n;
    const l = ce(e, "modelValue"), o = g(() => {
      if (e.icon !== !1)
        return e.type ? e.icon ?? `$${e.type}` : e.icon;
    }), i = g(() => ({
      color: e.color ?? e.type,
      variant: e.variant
    })), {
      themeClasses: s
    } = ye(e), {
      colorClasses: u,
      colorStyles: c,
      variantClasses: f
    } = Bt(i), {
      densityClasses: d
    } = Pe(e), {
      dimensionStyles: v
    } = Qe(e), {
      elevationClasses: m
    } = He(e), {
      locationStyles: y
    } = Pt(e), {
      positionClasses: h
    } = Yt(e), {
      roundedClasses: C
    } = Ee(e), {
      textColorClasses: b,
      textColorStyles: S
    } = Re(j(e, "borderColor")), {
      t: p
    } = _t(), w = g(() => ({
      "aria-label": p(e.closeLabel),
      onClick(I) {
        l.value = !1, t("click:close", I);
      }
    }));
    return () => {
      const I = !!(a.prepend || o.value), E = !!(a.title || e.title), O = !!(a.close || e.closable);
      return l.value && r(e.tag, {
        class: ["v-alert", e.border && {
          "v-alert--border": !!e.border,
          [`v-alert--border-${e.border === !0 ? "start" : e.border}`]: !0
        }, {
          "v-alert--prominent": e.prominent
        }, s.value, u.value, d.value, m.value, h.value, C.value, f.value, e.class],
        style: [c.value, v.value, y.value, e.style],
        role: "alert"
      }, {
        default: () => {
          var _, V;
          return [It(!1, "v-alert"), e.border && r("div", {
            key: "border",
            class: ["v-alert__border", b.value],
            style: S.value
          }, null), I && r("div", {
            key: "prepend",
            class: "v-alert__prepend"
          }, [a.prepend ? r(me, {
            key: "prepend-defaults",
            disabled: !o.value,
            defaults: {
              VIcon: {
                density: e.density,
                icon: o.value,
                size: e.prominent ? 44 : 28
              }
            }
          }, a.prepend) : r(oe, {
            key: "prepend-icon",
            density: e.density,
            icon: o.value,
            size: e.prominent ? 44 : 28
          }, null)]), r("div", {
            class: "v-alert__content"
          }, [E && r($i, {
            key: "title"
          }, {
            default: () => {
              var D;
              return [((D = a.title) == null ? void 0 : D.call(a)) ?? e.title];
            }
          }), ((_ = a.text) == null ? void 0 : _.call(a)) ?? e.text, (V = a.default) == null ? void 0 : V.call(a)]), a.append && r("div", {
            key: "append",
            class: "v-alert__append"
          }, [a.append()]), O && r("div", {
            key: "close",
            class: "v-alert__close"
          }, [a.close ? r(me, {
            key: "close-defaults",
            defaults: {
              VBtn: {
                icon: e.closeIcon,
                size: "x-small",
                variant: "text"
              }
            }
          }, {
            default: () => {
              var D;
              return [(D = a.close) == null ? void 0 : D.call(a, {
                props: w.value
              })];
            }
          }) : r(Y, U({
            key: "close-btn",
            icon: e.closeIcon,
            size: "x-small",
            variant: "text"
          }, w.value), null)])];
        }
      });
    };
  }
});
const Hi = B({
  text: String,
  clickable: Boolean,
  ...Z(),
  ...ge()
}, "VLabel"), Kl = z()({
  name: "VLabel",
  props: Hi(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    return K(() => {
      var a;
      return r("label", {
        class: ["v-label", {
          "v-label--clickable": e.clickable
        }, e.class],
        style: e.style
      }, [e.text, (a = t.default) == null ? void 0 : a.call(t)]);
    }), {};
  }
});
const Yl = Symbol.for("vuetify:selection-control-group"), Wl = B({
  color: String,
  disabled: Boolean,
  defaultsTarget: String,
  error: Boolean,
  id: String,
  inline: Boolean,
  falseIcon: le,
  trueIcon: le,
  ripple: {
    type: Boolean,
    default: !0
  },
  multiple: {
    type: Boolean,
    default: null
  },
  name: String,
  readonly: Boolean,
  modelValue: null,
  type: String,
  valueComparator: {
    type: Function,
    default: Vt
  },
  ...Z(),
  ...we(),
  ...ge()
}, "SelectionControlGroup"), Gi = B({
  ...Wl({
    defaultsTarget: "VSelectionControl"
  })
}, "VSelectionControlGroup");
z()({
  name: "VSelectionControlGroup",
  props: Gi(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = ce(e, "modelValue"), l = De(), o = g(() => e.id || `v-selection-control-group-${l}`), i = g(() => e.name || o.value), s = /* @__PURE__ */ new Set();
    return xe(Yl, {
      modelValue: a,
      forceUpdate: () => {
        s.forEach((u) => u());
      },
      onForceUpdate: (u) => {
        s.add(u), pe(() => {
          s.delete(u);
        });
      }
    }), Oe({
      [e.defaultsTarget]: {
        color: j(e, "color"),
        disabled: j(e, "disabled"),
        density: j(e, "density"),
        error: j(e, "error"),
        inline: j(e, "inline"),
        modelValue: a,
        multiple: g(() => !!e.multiple || e.multiple == null && Array.isArray(a.value)),
        name: i,
        falseIcon: j(e, "falseIcon"),
        trueIcon: j(e, "trueIcon"),
        readonly: j(e, "readonly"),
        ripple: j(e, "ripple"),
        type: j(e, "type"),
        valueComparator: j(e, "valueComparator")
      }
    }), K(() => {
      var u;
      return r("div", {
        class: ["v-selection-control-group", {
          "v-selection-control-group--inline": e.inline
        }, e.class],
        style: e.style,
        role: e.type === "radio" ? "radiogroup" : void 0
      }, [(u = t.default) == null ? void 0 : u.call(t)]);
    }), {};
  }
});
const Aa = B({
  label: String,
  trueValue: null,
  falseValue: null,
  value: null,
  ...Z(),
  ...Wl()
}, "VSelectionControl");
function Ki(e) {
  const n = se(Yl, void 0), {
    densityClasses: t
  } = Pe(e), a = ce(e, "modelValue"), l = g(() => e.trueValue !== void 0 ? e.trueValue : e.value !== void 0 ? e.value : !0), o = g(() => e.falseValue !== void 0 ? e.falseValue : !1), i = g(() => !!e.multiple || e.multiple == null && Array.isArray(a.value)), s = g({
    get() {
      const d = n ? n.modelValue.value : a.value;
      return i.value ? d.some((v) => e.valueComparator(v, l.value)) : e.valueComparator(d, l.value);
    },
    set(d) {
      if (e.readonly)
        return;
      const v = d ? l.value : o.value;
      let m = v;
      i.value && (m = d ? [...je(a.value), v] : je(a.value).filter((y) => !e.valueComparator(y, l.value))), n ? n.modelValue.value = m : a.value = m;
    }
  }), {
    textColorClasses: u,
    textColorStyles: c
  } = Re(g(() => s.value && !e.error && !e.disabled ? e.color : void 0)), f = g(() => s.value ? e.trueIcon : e.falseIcon);
  return {
    group: n,
    densityClasses: t,
    trueValue: l,
    falseValue: o,
    model: s,
    textColorClasses: u,
    textColorStyles: c,
    icon: f
  };
}
const Kn = z()({
  name: "VSelectionControl",
  directives: {
    Ripple: Jt
  },
  inheritAttrs: !1,
  props: Aa(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      attrs: t,
      slots: a
    } = n;
    const {
      group: l,
      densityClasses: o,
      icon: i,
      model: s,
      textColorClasses: u,
      textColorStyles: c,
      trueValue: f
    } = Ki(e), d = De(), v = g(() => e.id || `input-${d}`), m = te(!1), y = te(!1), h = A();
    l == null || l.onForceUpdate(() => {
      h.value && (h.value.checked = s.value);
    });
    function C(p) {
      m.value = !0, (!$n || $n && p.target.matches(":focus-visible")) && (y.value = !0);
    }
    function b() {
      m.value = !1, y.value = !1;
    }
    function S(p) {
      e.readonly && l && Se(() => l.forceUpdate()), s.value = p.target.checked;
    }
    return K(() => {
      var E, O;
      const p = a.label ? a.label({
        label: e.label,
        props: {
          for: v.value
        }
      }) : e.label, [w, I] = bn(t);
      return r("div", U({
        class: ["v-selection-control", {
          "v-selection-control--dirty": s.value,
          "v-selection-control--disabled": e.disabled,
          "v-selection-control--error": e.error,
          "v-selection-control--focused": m.value,
          "v-selection-control--focus-visible": y.value,
          "v-selection-control--inline": e.inline
        }, o.value, e.class]
      }, w, {
        style: e.style
      }), [r("div", {
        class: ["v-selection-control__wrapper", u.value],
        style: c.value
      }, [(E = a.default) == null ? void 0 : E.call(a), be(r("div", {
        class: ["v-selection-control__input"]
      }, [i.value && r(oe, {
        key: "icon",
        icon: i.value
      }, null), r("input", U({
        ref: h,
        checked: s.value,
        disabled: e.disabled,
        id: v.value,
        onBlur: b,
        onFocus: C,
        onInput: S,
        "aria-disabled": e.readonly,
        type: e.type,
        value: f.value,
        name: e.name,
        "aria-checked": e.type === "checkbox" ? s.value : void 0
      }, I), null), (O = a.input) == null ? void 0 : O.call(a, {
        model: s,
        textColorClasses: u,
        textColorStyles: c,
        props: {
          onFocus: C,
          onBlur: b,
          id: v.value
        }
      })]), [[Me("ripple"), e.ripple && [!e.disabled && !e.readonly, null, ["center", "circle"]]]])]), p && r(Kl, {
        for: v.value,
        clickable: !0
      }, {
        default: () => [p]
      })]);
    }), {
      isFocused: m,
      input: h
    };
  }
}), Yi = B({
  indeterminate: Boolean,
  indeterminateIcon: {
    type: le,
    default: "$checkboxIndeterminate"
  },
  ...Aa({
    falseIcon: "$checkboxOff",
    trueIcon: "$checkboxOn"
  })
}, "VCheckboxBtn"), Wi = z()({
  name: "VCheckboxBtn",
  props: Yi(),
  emits: {
    "update:modelValue": (e) => !0,
    "update:indeterminate": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = ce(e, "indeterminate"), l = ce(e, "modelValue");
    function o(u) {
      a.value && (a.value = !1);
    }
    const i = g(() => a.value ? e.indeterminateIcon : e.falseIcon), s = g(() => a.value ? e.indeterminateIcon : e.trueIcon);
    return K(() => r(Kn, U(e, {
      modelValue: l.value,
      "onUpdate:modelValue": [(u) => l.value = u, o],
      class: ["v-checkbox-btn", e.class],
      style: e.style,
      type: "checkbox",
      falseIcon: i.value,
      trueIcon: s.value,
      "aria-checked": a.value ? "mixed" : void 0
    }), t)), {};
  }
});
function Zl(e) {
  const {
    t: n
  } = _t();
  function t(a) {
    let {
      name: l
    } = a;
    const o = {
      prepend: "prependAction",
      prependInner: "prependAction",
      append: "appendAction",
      appendInner: "appendAction",
      clear: "clear"
    }[l], i = e[`onClick:${l}`], s = i && o ? n(`$vuetify.input.${o}`, e.label ?? "") : void 0;
    return r(oe, {
      icon: e[`${l}Icon`],
      "aria-label": s,
      onClick: i
    }, null);
  }
  return {
    InputIcon: t
  };
}
const Zi = B({
  active: Boolean,
  color: String,
  messages: {
    type: [Array, String],
    default: () => []
  },
  ...Z(),
  ...qt({
    transition: {
      component: _l,
      leaveAbsolute: !0,
      group: !0
    }
  })
}, "VMessages"), Ji = z()({
  name: "VMessages",
  props: Zi(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = g(() => je(e.messages)), {
      textColorClasses: l,
      textColorStyles: o
    } = Re(g(() => e.color));
    return K(() => r(ze, {
      transition: e.transition,
      tag: "div",
      class: ["v-messages", l.value, e.class],
      style: [o.value, e.style],
      role: "alert",
      "aria-live": "polite"
    }, {
      default: () => [e.active && a.value.map((i, s) => r("div", {
        class: "v-messages__message",
        key: `${s}-${a.value}`
      }, [t.message ? t.message({
        message: i
      }) : i]))]
    })), {};
  }
}), Jl = B({
  focused: Boolean,
  "onUpdate:focused": Fe()
}, "focus");
function An(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ne();
  const t = ce(e, "focused"), a = g(() => ({
    [`${n}--focused`]: t.value
  }));
  function l() {
    t.value = !0;
  }
  function o() {
    t.value = !1;
  }
  return {
    focusClasses: a,
    isFocused: t,
    focus: l,
    blur: o
  };
}
const Xl = Symbol.for("vuetify:form"), Xi = B({
  disabled: Boolean,
  fastFail: Boolean,
  readonly: Boolean,
  modelValue: {
    type: Boolean,
    default: null
  },
  validateOn: {
    type: String,
    default: "input"
  }
}, "form");
function es(e) {
  const n = ce(e, "modelValue"), t = g(() => e.disabled), a = g(() => e.readonly), l = te(!1), o = A([]), i = A([]);
  async function s() {
    const f = [];
    let d = !0;
    i.value = [], l.value = !0;
    for (const v of o.value) {
      const m = await v.validate();
      if (m.length > 0 && (d = !1, f.push({
        id: v.id,
        errorMessages: m
      })), !d && e.fastFail)
        break;
    }
    return i.value = f, l.value = !1, {
      valid: d,
      errors: i.value
    };
  }
  function u() {
    o.value.forEach((f) => f.reset());
  }
  function c() {
    o.value.forEach((f) => f.resetValidation());
  }
  return ae(o, () => {
    let f = 0, d = 0;
    const v = [];
    for (const m of o.value)
      m.isValid === !1 ? (d++, v.push({
        id: m.id,
        errorMessages: m.errorMessages
      })) : m.isValid === !0 && f++;
    i.value = v, n.value = d > 0 ? !1 : f === o.value.length ? !0 : null;
  }, {
    deep: !0
  }), xe(Xl, {
    register: (f) => {
      let {
        id: d,
        validate: v,
        reset: m,
        resetValidation: y
      } = f;
      o.value.some((h) => h.id === d) && da(`Duplicate input name "${d}"`), o.value.push({
        id: d,
        validate: v,
        reset: m,
        resetValidation: y,
        isValid: null,
        errorMessages: []
      });
    },
    unregister: (f) => {
      o.value = o.value.filter((d) => d.id !== f);
    },
    update: (f, d, v) => {
      const m = o.value.find((y) => y.id === f);
      m && (m.isValid = d, m.errorMessages = v);
    },
    isDisabled: t,
    isReadonly: a,
    isValidating: l,
    isValid: n,
    items: o,
    validateOn: j(e, "validateOn")
  }), {
    errors: i,
    isDisabled: t,
    isReadonly: a,
    isValidating: l,
    isValid: n,
    items: o,
    validate: s,
    reset: u,
    resetValidation: c
  };
}
function eo() {
  return se(Xl, null);
}
const ts = B({
  disabled: {
    type: Boolean,
    default: null
  },
  error: Boolean,
  errorMessages: {
    type: [Array, String],
    default: () => []
  },
  maxErrors: {
    type: [Number, String],
    default: 1
  },
  name: String,
  label: String,
  readonly: {
    type: Boolean,
    default: null
  },
  rules: {
    type: Array,
    default: () => []
  },
  modelValue: null,
  validateOn: String,
  validationValue: null,
  ...Jl()
}, "validation");
function ns(e) {
  let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ne(), t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : De();
  const a = ce(e, "modelValue"), l = g(() => e.validationValue === void 0 ? a.value : e.validationValue), o = eo(), i = A([]), s = te(!0), u = g(() => !!(je(a.value === "" ? null : a.value).length || je(l.value === "" ? null : l.value).length)), c = g(() => !!(e.disabled ?? (o == null ? void 0 : o.isDisabled.value))), f = g(() => !!(e.readonly ?? (o == null ? void 0 : o.isReadonly.value))), d = g(() => e.errorMessages.length ? je(e.errorMessages).slice(0, Math.max(0, +e.maxErrors)) : i.value), v = g(() => {
    let w = (e.validateOn ?? (o == null ? void 0 : o.validateOn.value)) || "input";
    w === "lazy" && (w = "input lazy");
    const I = new Set((w == null ? void 0 : w.split(" ")) ?? []);
    return {
      blur: I.has("blur") || I.has("input"),
      input: I.has("input"),
      submit: I.has("submit"),
      lazy: I.has("lazy")
    };
  }), m = g(() => e.error || e.errorMessages.length ? !1 : e.rules.length ? s.value ? i.value.length || v.value.lazy ? null : !0 : !i.value.length : !0), y = te(!1), h = g(() => ({
    [`${n}--error`]: m.value === !1,
    [`${n}--dirty`]: u.value,
    [`${n}--disabled`]: c.value,
    [`${n}--readonly`]: f.value
  })), C = g(() => e.name ?? X(t));
  ml(() => {
    o == null || o.register({
      id: C.value,
      validate: p,
      reset: b,
      resetValidation: S
    });
  }), ct(() => {
    o == null || o.unregister(C.value);
  }), kt(async () => {
    v.value.lazy || await p(!0), o == null || o.update(C.value, m.value, d.value);
  }), rt(() => v.value.input, () => {
    ae(l, () => {
      if (l.value != null)
        p();
      else if (e.focused) {
        const w = ae(() => e.focused, (I) => {
          I || p(), w();
        });
      }
    });
  }), rt(() => v.value.blur, () => {
    ae(() => e.focused, (w) => {
      w || p();
    });
  }), ae(m, () => {
    o == null || o.update(C.value, m.value, d.value);
  });
  function b() {
    a.value = null, Se(S);
  }
  function S() {
    s.value = !0, v.value.lazy ? i.value = [] : p(!0);
  }
  async function p() {
    let w = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1;
    const I = [];
    y.value = !0;
    for (const E of e.rules) {
      if (I.length >= +(e.maxErrors ?? 1))
        break;
      const _ = await (typeof E == "function" ? E : () => E)(l.value);
      if (_ !== !0) {
        if (typeof _ != "string") {
          console.warn(`${_} is not a valid value. Rule functions must return boolean true or a string.`);
          continue;
        }
        I.push(_);
      }
    }
    return i.value = I, y.value = !1, s.value = w, i.value;
  }
  return {
    errorMessages: d,
    isDirty: u,
    isDisabled: c,
    isReadonly: f,
    isPristine: s,
    isValid: m,
    isValidating: y,
    reset: b,
    resetValidation: S,
    validate: p,
    validationClasses: h
  };
}
const wn = B({
  id: String,
  appendIcon: le,
  centerAffix: {
    type: Boolean,
    default: !0
  },
  prependIcon: le,
  hideDetails: [Boolean, String],
  hint: String,
  persistentHint: Boolean,
  messages: {
    type: [Array, String],
    default: () => []
  },
  direction: {
    type: String,
    default: "horizontal",
    validator: (e) => ["horizontal", "vertical"].includes(e)
  },
  "onClick:prepend": Fe(),
  "onClick:append": Fe(),
  ...Z(),
  ...we(),
  ...ts()
}, "VInput"), St = z()({
  name: "VInput",
  props: {
    ...wn()
  },
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      attrs: t,
      slots: a,
      emit: l
    } = n;
    const {
      densityClasses: o
    } = Pe(e), {
      rtlClasses: i
    } = Xe(), {
      InputIcon: s
    } = Zl(e), u = De(), c = g(() => e.id || `input-${u}`), f = g(() => `${c.value}-messages`), {
      errorMessages: d,
      isDirty: v,
      isDisabled: m,
      isReadonly: y,
      isPristine: h,
      isValid: C,
      isValidating: b,
      reset: S,
      resetValidation: p,
      validate: w,
      validationClasses: I
    } = ns(e, "v-input", c), E = g(() => ({
      id: c,
      messagesId: f,
      isDirty: v,
      isDisabled: m,
      isReadonly: y,
      isPristine: h,
      isValid: C,
      isValidating: b,
      reset: S,
      resetValidation: p,
      validate: w
    })), O = g(() => {
      var _;
      return (_ = e.errorMessages) != null && _.length || !h.value && d.value.length ? d.value : e.hint && (e.persistentHint || e.focused) ? e.hint : e.messages;
    });
    return K(() => {
      var N, k, P, $;
      const _ = !!(a.prepend || e.prependIcon), V = !!(a.append || e.appendIcon), D = O.value.length > 0, q = !e.hideDetails || e.hideDetails === "auto" && (D || !!a.details);
      return r("div", {
        class: ["v-input", `v-input--${e.direction}`, {
          "v-input--center-affix": e.centerAffix
        }, o.value, i.value, I.value, e.class],
        style: e.style
      }, [_ && r("div", {
        key: "prepend",
        class: "v-input__prepend"
      }, [(N = a.prepend) == null ? void 0 : N.call(a, E.value), e.prependIcon && r(s, {
        key: "prepend-icon",
        name: "prepend"
      }, null)]), a.default && r("div", {
        class: "v-input__control"
      }, [(k = a.default) == null ? void 0 : k.call(a, E.value)]), V && r("div", {
        key: "append",
        class: "v-input__append"
      }, [e.appendIcon && r(s, {
        key: "append-icon",
        name: "append"
      }, null), (P = a.append) == null ? void 0 : P.call(a, E.value)]), q && r("div", {
        class: "v-input__details"
      }, [r(Ji, {
        id: f.value,
        active: D,
        messages: O.value
      }, {
        message: a.message
      }), ($ = a.details) == null ? void 0 : $.call(a, E.value)])]);
    }), {
      reset: S,
      resetValidation: p,
      validate: w
    };
  }
});
const as = B({
  start: Boolean,
  end: Boolean,
  icon: le,
  image: String,
  ...Z(),
  ...we(),
  ...Be(),
  ...Ht(),
  ...de(),
  ...ge(),
  ...Ge({
    variant: "flat"
  })
}, "VAvatar"), Ze = z()({
  name: "VAvatar",
  props: as(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      themeClasses: a
    } = ye(e), {
      colorClasses: l,
      colorStyles: o,
      variantClasses: i
    } = Bt(e), {
      densityClasses: s
    } = Pe(e), {
      roundedClasses: u
    } = Ee(e), {
      sizeClasses: c,
      sizeStyles: f
    } = Gt(e);
    return K(() => r(e.tag, {
      class: ["v-avatar", {
        "v-avatar--start": e.start,
        "v-avatar--end": e.end
      }, a.value, l.value, s.value, u.value, c.value, i.value, e.class],
      style: [o.value, f.value, e.style]
    }, {
      default: () => {
        var d;
        return [e.image ? r(Tl, {
          key: "image",
          src: e.image,
          alt: "",
          cover: !0
        }, null) : e.icon ? r(oe, {
          key: "icon",
          icon: e.icon
        }, null) : (d = t.default) == null ? void 0 : d.call(t), It(!1, "v-avatar")];
      }
    })), {};
  }
});
const to = Symbol.for("vuetify:v-chip-group"), ls = B({
  column: Boolean,
  filter: Boolean,
  valueComparator: {
    type: Function,
    default: Vt
  },
  ...Z(),
  ...ba({
    selectedClass: "v-chip--selected"
  }),
  ...de(),
  ...ge(),
  ...Ge({
    variant: "tonal"
  })
}, "VChipGroup");
z()({
  name: "VChipGroup",
  props: ls(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      themeClasses: a
    } = ye(e), {
      isSelected: l,
      select: o,
      next: i,
      prev: s,
      selected: u
    } = Cn(e, to);
    return Oe({
      VChip: {
        color: j(e, "color"),
        disabled: j(e, "disabled"),
        filter: j(e, "filter"),
        variant: j(e, "variant")
      }
    }), K(() => r(e.tag, {
      class: ["v-chip-group", {
        "v-chip-group--column": e.column
      }, a.value, e.class],
      style: e.style
    }, {
      default: () => {
        var c;
        return [(c = t.default) == null ? void 0 : c.call(t, {
          isSelected: l,
          select: o,
          next: i,
          prev: s,
          selected: u.value
        })];
      }
    })), {};
  }
});
const os = B({
  activeClass: String,
  appendAvatar: String,
  appendIcon: le,
  closable: Boolean,
  closeIcon: {
    type: le,
    default: "$delete"
  },
  closeLabel: {
    type: String,
    default: "$vuetify.close"
  },
  draggable: Boolean,
  filter: Boolean,
  filterIcon: {
    type: String,
    default: "$complete"
  },
  label: Boolean,
  link: {
    type: Boolean,
    default: void 0
  },
  pill: Boolean,
  prependAvatar: String,
  prependIcon: le,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  text: String,
  modelValue: {
    type: Boolean,
    default: !0
  },
  onClick: Fe(),
  onClickOnce: Fe(),
  ...et(),
  ...Z(),
  ...we(),
  ...qe(),
  ...Ca(),
  ...Be(),
  ...Zt(),
  ...Ht(),
  ...de({
    tag: "span"
  }),
  ...ge(),
  ...Ge({
    variant: "tonal"
  })
}, "VChip"), wa = z()({
  name: "VChip",
  directives: {
    Ripple: Jt
  },
  props: os(),
  emits: {
    "click:close": (e) => !0,
    "update:modelValue": (e) => !0,
    "group:selected": (e) => !0,
    click: (e) => !0
  },
  setup(e, n) {
    let {
      attrs: t,
      emit: a,
      slots: l
    } = n;
    const {
      t: o
    } = _t(), {
      borderClasses: i
    } = tt(e), {
      colorClasses: s,
      colorStyles: u,
      variantClasses: c
    } = Bt(e), {
      densityClasses: f
    } = Pe(e), {
      elevationClasses: d
    } = He(e), {
      roundedClasses: v
    } = Ee(e), {
      sizeClasses: m
    } = Gt(e), {
      themeClasses: y
    } = ye(e), h = ce(e, "modelValue"), C = pa(e, to, !1), b = Wt(e, t), S = g(() => e.link !== !1 && b.isLink.value), p = g(() => !e.disabled && e.link !== !1 && (!!C || e.link || b.isClickable.value)), w = g(() => ({
      "aria-label": o(e.closeLabel),
      onClick(O) {
        h.value = !1, a("click:close", O);
      }
    }));
    function I(O) {
      var _;
      a("click", O), p.value && ((_ = b.navigate) == null || _.call(b, O), C == null || C.toggle());
    }
    function E(O) {
      (O.key === "Enter" || O.key === " ") && (O.preventDefault(), I(O));
    }
    return () => {
      const O = b.isLink.value ? "a" : e.tag, _ = !!(e.appendIcon || e.appendAvatar), V = !!(_ || l.append), D = !!(l.close || e.closable), q = !!(l.filter || e.filter) && C, N = !!(e.prependIcon || e.prependAvatar), k = !!(N || l.prepend), P = !C || C.isSelected.value;
      return h.value && be(r(O, {
        class: ["v-chip", {
          "v-chip--disabled": e.disabled,
          "v-chip--label": e.label,
          "v-chip--link": p.value,
          "v-chip--filter": q,
          "v-chip--pill": e.pill
        }, y.value, i.value, P ? s.value : void 0, f.value, d.value, v.value, m.value, c.value, C == null ? void 0 : C.selectedClass.value, e.class],
        style: [P ? u.value : void 0, e.style],
        disabled: e.disabled || void 0,
        draggable: e.draggable,
        href: b.href.value,
        tabindex: p.value ? 0 : void 0,
        onClick: I,
        onKeydown: p.value && !S.value && E
      }, {
        default: () => {
          var $;
          return [It(p.value, "v-chip"), q && r(Il, {
            key: "filter"
          }, {
            default: () => [be(r("div", {
              class: "v-chip__filter"
            }, [l.filter ? be(r(me, {
              key: "filter-defaults",
              disabled: !e.filterIcon,
              defaults: {
                VIcon: {
                  icon: e.filterIcon
                }
              }
            }, null), [[Me("slot"), l.filter, "default"]]) : r(oe, {
              key: "filter-icon",
              icon: e.filterIcon
            }, null)]), [[dt, C.isSelected.value]])]
          }), k && r("div", {
            key: "prepend",
            class: "v-chip__prepend"
          }, [l.prepend ? r(me, {
            key: "prepend-defaults",
            disabled: !N,
            defaults: {
              VAvatar: {
                image: e.prependAvatar,
                start: !0
              },
              VIcon: {
                icon: e.prependIcon,
                start: !0
              }
            }
          }, l.prepend) : r(ue, null, [e.prependIcon && r(oe, {
            key: "prepend-icon",
            icon: e.prependIcon,
            start: !0
          }, null), e.prependAvatar && r(Ze, {
            key: "prepend-avatar",
            image: e.prependAvatar,
            start: !0
          }, null)])]), r("div", {
            class: "v-chip__content"
          }, [(($ = l.default) == null ? void 0 : $.call(l, {
            isSelected: C == null ? void 0 : C.isSelected.value,
            selectedClass: C == null ? void 0 : C.selectedClass.value,
            select: C == null ? void 0 : C.select,
            toggle: C == null ? void 0 : C.toggle,
            value: C == null ? void 0 : C.value.value,
            disabled: e.disabled
          })) ?? e.text]), V && r("div", {
            key: "append",
            class: "v-chip__append"
          }, [l.append ? r(me, {
            key: "append-defaults",
            disabled: !_,
            defaults: {
              VAvatar: {
                end: !0,
                image: e.appendAvatar
              },
              VIcon: {
                end: !0,
                icon: e.appendIcon
              }
            }
          }, l.append) : r(ue, null, [e.appendIcon && r(oe, {
            key: "append-icon",
            end: !0,
            icon: e.appendIcon
          }, null), e.appendAvatar && r(Ze, {
            key: "append-avatar",
            end: !0,
            image: e.appendAvatar
          }, null)])]), D && r("div", U({
            key: "close",
            class: "v-chip__close"
          }, w.value), [l.close ? r(me, {
            key: "close-defaults",
            defaults: {
              VIcon: {
                icon: e.closeIcon,
                size: "x-small"
              }
            }
          }, l.close) : r(oe, {
            key: "close-icon",
            icon: e.closeIcon,
            size: "x-small"
          }, null)])];
        }
      }), [[Me("ripple"), p.value && e.ripple, null]]);
    };
  }
});
const Yn = Symbol.for("vuetify:list");
function no() {
  const e = se(Yn, {
    hasPrepend: te(!1),
    updateHasPrepend: () => null
  }), n = {
    hasPrepend: te(!1),
    updateHasPrepend: (t) => {
      t && (n.hasPrepend.value = t);
    }
  };
  return xe(Yn, n), e;
}
function ao() {
  return se(Yn, null);
}
const is = {
  open: (e) => {
    let {
      id: n,
      value: t,
      opened: a,
      parents: l
    } = e;
    if (t) {
      const o = /* @__PURE__ */ new Set();
      o.add(n);
      let i = l.get(n);
      for (; i != null; )
        o.add(i), i = l.get(i);
      return o;
    } else
      return a.delete(n), a;
  },
  select: () => null
}, lo = {
  open: (e) => {
    let {
      id: n,
      value: t,
      opened: a,
      parents: l
    } = e;
    if (t) {
      let o = l.get(n);
      for (a.add(n); o != null && o !== n; )
        a.add(o), o = l.get(o);
      return a;
    } else
      a.delete(n);
    return a;
  },
  select: () => null
}, ss = {
  open: lo.open,
  select: (e) => {
    let {
      id: n,
      value: t,
      opened: a,
      parents: l
    } = e;
    if (!t)
      return a;
    const o = [];
    let i = l.get(n);
    for (; i != null; )
      o.push(i), i = l.get(i);
    return new Set(o);
  }
}, ka = (e) => {
  const n = {
    select: (t) => {
      let {
        id: a,
        value: l,
        selected: o
      } = t;
      if (a = Je(a), e && !l) {
        const i = Array.from(o.entries()).reduce((s, u) => {
          let [c, f] = u;
          return f === "on" ? [...s, c] : s;
        }, []);
        if (i.length === 1 && i[0] === a)
          return o;
      }
      return o.set(a, l ? "on" : "off"), o;
    },
    in: (t, a, l) => {
      let o = /* @__PURE__ */ new Map();
      for (const i of t || [])
        o = n.select({
          id: i,
          value: !0,
          selected: new Map(o),
          children: a,
          parents: l
        });
      return o;
    },
    out: (t) => {
      const a = [];
      for (const [l, o] of t.entries())
        o === "on" && a.push(l);
      return a;
    }
  };
  return n;
}, oo = (e) => {
  const n = ka(e);
  return {
    select: (a) => {
      let {
        selected: l,
        id: o,
        ...i
      } = a;
      o = Je(o);
      const s = l.has(o) ? /* @__PURE__ */ new Map([[o, l.get(o)]]) : /* @__PURE__ */ new Map();
      return n.select({
        ...i,
        id: o,
        selected: s
      });
    },
    in: (a, l, o) => {
      let i = /* @__PURE__ */ new Map();
      return a != null && a.length && (i = n.in(a.slice(0, 1), l, o)), i;
    },
    out: (a, l, o) => n.out(a, l, o)
  };
}, rs = (e) => {
  const n = ka(e);
  return {
    select: (a) => {
      let {
        id: l,
        selected: o,
        children: i,
        ...s
      } = a;
      return l = Je(l), i.has(l) ? o : n.select({
        id: l,
        selected: o,
        children: i,
        ...s
      });
    },
    in: n.in,
    out: n.out
  };
}, us = (e) => {
  const n = oo(e);
  return {
    select: (a) => {
      let {
        id: l,
        selected: o,
        children: i,
        ...s
      } = a;
      return l = Je(l), i.has(l) ? o : n.select({
        id: l,
        selected: o,
        children: i,
        ...s
      });
    },
    in: n.in,
    out: n.out
  };
}, cs = (e) => {
  const n = {
    select: (t) => {
      let {
        id: a,
        value: l,
        selected: o,
        children: i,
        parents: s
      } = t;
      a = Je(a);
      const u = new Map(o), c = [a];
      for (; c.length; ) {
        const d = c.shift();
        o.set(d, l ? "on" : "off"), i.has(d) && c.push(...i.get(d));
      }
      let f = s.get(a);
      for (; f; ) {
        const d = i.get(f), v = d.every((y) => o.get(y) === "on"), m = d.every((y) => !o.has(y) || o.get(y) === "off");
        o.set(f, v ? "on" : m ? "off" : "indeterminate"), f = s.get(f);
      }
      return e && !l && Array.from(o.entries()).reduce((v, m) => {
        let [y, h] = m;
        return h === "on" ? [...v, y] : v;
      }, []).length === 0 ? u : o;
    },
    in: (t, a, l) => {
      let o = /* @__PURE__ */ new Map();
      for (const i of t || [])
        o = n.select({
          id: i,
          value: !0,
          selected: new Map(o),
          children: a,
          parents: l
        });
      return o;
    },
    out: (t, a) => {
      const l = [];
      for (const [o, i] of t.entries())
        i === "on" && !a.has(o) && l.push(o);
      return l;
    }
  };
  return n;
}, jt = Symbol.for("vuetify:nested"), io = {
  id: te(),
  root: {
    register: () => null,
    unregister: () => null,
    parents: A(/* @__PURE__ */ new Map()),
    children: A(/* @__PURE__ */ new Map()),
    open: () => null,
    openOnSelect: () => null,
    select: () => null,
    opened: A(/* @__PURE__ */ new Set()),
    selected: A(/* @__PURE__ */ new Map()),
    selectedValues: A([])
  }
}, ds = B({
  selectStrategy: [String, Function],
  openStrategy: [String, Object],
  opened: Array,
  selected: Array,
  mandatory: Boolean
}, "nested"), fs = (e) => {
  let n = !1;
  const t = A(/* @__PURE__ */ new Map()), a = A(/* @__PURE__ */ new Map()), l = ce(e, "opened", e.opened, (d) => new Set(d), (d) => [...d.values()]), o = g(() => {
    if (typeof e.selectStrategy == "object")
      return e.selectStrategy;
    switch (e.selectStrategy) {
      case "single-leaf":
        return us(e.mandatory);
      case "leaf":
        return rs(e.mandatory);
      case "independent":
        return ka(e.mandatory);
      case "single-independent":
        return oo(e.mandatory);
      case "classic":
      default:
        return cs(e.mandatory);
    }
  }), i = g(() => {
    if (typeof e.openStrategy == "object")
      return e.openStrategy;
    switch (e.openStrategy) {
      case "list":
        return ss;
      case "single":
        return is;
      case "multiple":
      default:
        return lo;
    }
  }), s = ce(e, "selected", e.selected, (d) => o.value.in(d, t.value, a.value), (d) => o.value.out(d, t.value, a.value));
  ct(() => {
    n = !0;
  });
  function u(d) {
    const v = [];
    let m = d;
    for (; m != null; )
      v.unshift(m), m = a.value.get(m);
    return v;
  }
  const c = Ae("nested"), f = {
    id: te(),
    root: {
      opened: l,
      selected: s,
      selectedValues: g(() => {
        const d = [];
        for (const [v, m] of s.value.entries())
          m === "on" && d.push(v);
        return d;
      }),
      register: (d, v, m) => {
        v && d !== v && a.value.set(d, v), m && t.value.set(d, []), v != null && t.value.set(v, [...t.value.get(v) || [], d]);
      },
      unregister: (d) => {
        if (n)
          return;
        t.value.delete(d);
        const v = a.value.get(d);
        if (v) {
          const m = t.value.get(v) ?? [];
          t.value.set(v, m.filter((y) => y !== d));
        }
        a.value.delete(d), l.value.delete(d);
      },
      open: (d, v, m) => {
        c.emit("click:open", {
          id: d,
          value: v,
          path: u(d),
          event: m
        });
        const y = i.value.open({
          id: d,
          value: v,
          opened: new Set(l.value),
          children: t.value,
          parents: a.value,
          event: m
        });
        y && (l.value = y);
      },
      openOnSelect: (d, v, m) => {
        const y = i.value.select({
          id: d,
          value: v,
          selected: new Map(s.value),
          opened: new Set(l.value),
          children: t.value,
          parents: a.value,
          event: m
        });
        y && (l.value = y);
      },
      select: (d, v, m) => {
        c.emit("click:select", {
          id: d,
          value: v,
          path: u(d),
          event: m
        });
        const y = o.value.select({
          id: d,
          value: v,
          selected: new Map(s.value),
          children: t.value,
          parents: a.value,
          event: m
        });
        y && (s.value = y), f.root.openOnSelect(d, v, m);
      },
      children: t,
      parents: a
    }
  };
  return xe(jt, f), f.root;
}, so = (e, n) => {
  const t = se(jt, io), a = Symbol(De()), l = g(() => e.value !== void 0 ? e.value : a), o = {
    ...t,
    id: l,
    open: (i, s) => t.root.open(l.value, i, s),
    openOnSelect: (i, s) => t.root.openOnSelect(l.value, i, s),
    isOpen: g(() => t.root.opened.value.has(l.value)),
    parent: g(() => t.root.parents.value.get(l.value)),
    select: (i, s) => t.root.select(l.value, i, s),
    isSelected: g(() => t.root.selected.value.get(Je(l.value)) === "on"),
    isIndeterminate: g(() => t.root.selected.value.get(l.value) === "indeterminate"),
    isLeaf: g(() => !t.root.children.value.get(l.value)),
    isGroupActivator: t.isGroupActivator
  };
  return !t.isGroupActivator && t.root.register(l.value, t.id.value, n), ct(() => {
    !t.isGroupActivator && t.root.unregister(l.value);
  }), n && xe(jt, o), o;
}, vs = () => {
  const e = se(jt, io);
  xe(jt, {
    ...e,
    isGroupActivator: !0
  });
}, ms = Qt({
  name: "VListGroupActivator",
  setup(e, n) {
    let {
      slots: t
    } = n;
    return vs(), () => {
      var a;
      return (a = t.default) == null ? void 0 : a.call(t);
    };
  }
}), gs = B({
  /* @deprecated */
  activeColor: String,
  baseColor: String,
  color: String,
  collapseIcon: {
    type: le,
    default: "$collapse"
  },
  expandIcon: {
    type: le,
    default: "$expand"
  },
  prependIcon: le,
  appendIcon: le,
  fluid: Boolean,
  subgroup: Boolean,
  title: String,
  value: null,
  ...Z(),
  ...de()
}, "VListGroup"), Za = z()({
  name: "VListGroup",
  props: gs(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      isOpen: a,
      open: l,
      id: o
    } = so(j(e, "value"), !0), i = g(() => `v-list-group--id-${String(o.value)}`), s = ao(), {
      isBooted: u
    } = Rl();
    function c(m) {
      l(!a.value, m);
    }
    const f = g(() => ({
      onClick: c,
      class: "v-list-group__header",
      id: i.value
    })), d = g(() => a.value ? e.collapseIcon : e.expandIcon), v = g(() => ({
      VListItem: {
        active: a.value,
        activeColor: e.activeColor,
        baseColor: e.baseColor,
        color: e.color,
        prependIcon: e.prependIcon || e.subgroup && d.value,
        appendIcon: e.appendIcon || !e.subgroup && d.value,
        title: e.title,
        value: e.value
      }
    }));
    return K(() => r(e.tag, {
      class: ["v-list-group", {
        "v-list-group--prepend": s == null ? void 0 : s.hasPrepend.value,
        "v-list-group--fluid": e.fluid,
        "v-list-group--subgroup": e.subgroup,
        "v-list-group--open": a.value
      }, e.class],
      style: e.style
    }, {
      default: () => [t.activator && r(me, {
        defaults: v.value
      }, {
        default: () => [r(ms, null, {
          default: () => [t.activator({
            props: f.value,
            isOpen: a.value
          })]
        })]
      }), r(ze, {
        transition: {
          component: yi
        },
        disabled: !u.value
      }, {
        default: () => {
          var m;
          return [be(r("div", {
            class: "v-list-group__items",
            role: "group",
            "aria-labelledby": i.value
          }, [(m = t.default) == null ? void 0 : m.call(t)]), [[dt, a.value]])];
        }
      })]
    })), {};
  }
});
const ys = vt("v-list-item-subtitle"), hs = vt("v-list-item-title"), bs = B({
  active: {
    type: Boolean,
    default: void 0
  },
  activeClass: String,
  /* @deprecated */
  activeColor: String,
  appendAvatar: String,
  appendIcon: le,
  baseColor: String,
  disabled: Boolean,
  lines: String,
  link: {
    type: Boolean,
    default: void 0
  },
  nav: Boolean,
  prependAvatar: String,
  prependIcon: le,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  subtitle: [String, Number, Boolean],
  title: [String, Number, Boolean],
  value: null,
  onClick: Fe(),
  onClickOnce: Fe(),
  ...et(),
  ...Z(),
  ...we(),
  ...$e(),
  ...qe(),
  ...Be(),
  ...Zt(),
  ...de(),
  ...ge(),
  ...Ge({
    variant: "text"
  })
}, "VListItem"), fn = z()({
  name: "VListItem",
  directives: {
    Ripple: Jt
  },
  props: bs(),
  emits: {
    click: (e) => !0
  },
  setup(e, n) {
    let {
      attrs: t,
      slots: a,
      emit: l
    } = n;
    const o = Wt(e, t), i = g(() => e.value === void 0 ? o.href.value : e.value), {
      select: s,
      isSelected: u,
      isIndeterminate: c,
      isGroupActivator: f,
      root: d,
      parent: v,
      openOnSelect: m
    } = so(i, !1), y = ao(), h = g(() => {
      var R;
      return e.active !== !1 && (e.active || ((R = o.isActive) == null ? void 0 : R.value) || u.value);
    }), C = g(() => e.link !== !1 && o.isLink.value), b = g(() => !e.disabled && e.link !== !1 && (e.link || o.isClickable.value || e.value != null && !!y)), S = g(() => e.rounded || e.nav), p = g(() => e.color ?? e.activeColor), w = g(() => ({
      color: h.value ? p.value ?? e.baseColor : e.baseColor,
      variant: e.variant
    }));
    ae(() => {
      var R;
      return (R = o.isActive) == null ? void 0 : R.value;
    }, (R) => {
      R && v.value != null && d.open(v.value, !0), R && m(R);
    }, {
      immediate: !0
    });
    const {
      themeClasses: I
    } = ye(e), {
      borderClasses: E
    } = tt(e), {
      colorClasses: O,
      colorStyles: _,
      variantClasses: V
    } = Bt(w), {
      densityClasses: D
    } = Pe(e), {
      dimensionStyles: q
    } = Qe(e), {
      elevationClasses: N
    } = He(e), {
      roundedClasses: k
    } = Ee(S), P = g(() => e.lines ? `v-list-item--${e.lines}-line` : void 0), $ = g(() => ({
      isActive: h.value,
      select: s,
      isSelected: u.value,
      isIndeterminate: c.value
    }));
    function W(R) {
      var Q;
      l("click", R), !(f || !b.value) && ((Q = o.navigate) == null || Q.call(o, R), e.value != null && s(!u.value, R));
    }
    function J(R) {
      (R.key === "Enter" || R.key === " ") && (R.preventDefault(), W(R));
    }
    return K(() => {
      const R = C.value ? "a" : e.tag, Q = a.title || e.title, T = a.subtitle || e.subtitle, L = !!(e.appendAvatar || e.appendIcon), re = !!(L || a.append), ve = !!(e.prependAvatar || e.prependIcon), ke = !!(ve || a.prepend);
      return y == null || y.updateHasPrepend(ke), e.activeColor && ii("active-color", ["color", "base-color"]), be(r(R, {
        class: ["v-list-item", {
          "v-list-item--active": h.value,
          "v-list-item--disabled": e.disabled,
          "v-list-item--link": b.value,
          "v-list-item--nav": e.nav,
          "v-list-item--prepend": !ke && (y == null ? void 0 : y.hasPrepend.value),
          [`${e.activeClass}`]: e.activeClass && h.value
        }, I.value, E.value, O.value, D.value, N.value, P.value, k.value, V.value, e.class],
        style: [_.value, q.value, e.style],
        href: o.href.value,
        tabindex: b.value ? y ? -2 : 0 : void 0,
        onClick: W,
        onKeydown: b.value && !C.value && J
      }, {
        default: () => {
          var Te;
          return [It(b.value || h.value, "v-list-item"), ke && r("div", {
            key: "prepend",
            class: "v-list-item__prepend"
          }, [a.prepend ? r(me, {
            key: "prepend-defaults",
            disabled: !ve,
            defaults: {
              VAvatar: {
                density: e.density,
                image: e.prependAvatar
              },
              VIcon: {
                density: e.density,
                icon: e.prependIcon
              },
              VListItemAction: {
                start: !0
              }
            }
          }, {
            default: () => {
              var ie;
              return [(ie = a.prepend) == null ? void 0 : ie.call(a, $.value)];
            }
          }) : r(ue, null, [e.prependAvatar && r(Ze, {
            key: "prepend-avatar",
            density: e.density,
            image: e.prependAvatar
          }, null), e.prependIcon && r(oe, {
            key: "prepend-icon",
            density: e.density,
            icon: e.prependIcon
          }, null)])]), r("div", {
            class: "v-list-item__content",
            "data-no-activator": ""
          }, [Q && r(hs, {
            key: "title"
          }, {
            default: () => {
              var ie;
              return [((ie = a.title) == null ? void 0 : ie.call(a, {
                title: e.title
              })) ?? e.title];
            }
          }), T && r(ys, {
            key: "subtitle"
          }, {
            default: () => {
              var ie;
              return [((ie = a.subtitle) == null ? void 0 : ie.call(a, {
                subtitle: e.subtitle
              })) ?? e.subtitle];
            }
          }), (Te = a.default) == null ? void 0 : Te.call(a, $.value)]), re && r("div", {
            key: "append",
            class: "v-list-item__append"
          }, [a.append ? r(me, {
            key: "append-defaults",
            disabled: !L,
            defaults: {
              VAvatar: {
                density: e.density,
                image: e.appendAvatar
              },
              VIcon: {
                density: e.density,
                icon: e.appendIcon
              },
              VListItemAction: {
                end: !0
              }
            }
          }, {
            default: () => {
              var ie;
              return [(ie = a.append) == null ? void 0 : ie.call(a, $.value)];
            }
          }) : r(ue, null, [e.appendIcon && r(oe, {
            key: "append-icon",
            density: e.density,
            icon: e.appendIcon
          }, null), e.appendAvatar && r(Ze, {
            key: "append-avatar",
            density: e.density,
            image: e.appendAvatar
          }, null)])])];
        }
      }), [[Me("ripple"), b.value && e.ripple]]);
    }), {};
  }
}), Cs = B({
  color: String,
  inset: Boolean,
  sticky: Boolean,
  title: String,
  ...Z(),
  ...de()
}, "VListSubheader"), ps = z()({
  name: "VListSubheader",
  props: Cs(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      textColorClasses: a,
      textColorStyles: l
    } = Re(j(e, "color"));
    return K(() => {
      const o = !!(t.default || e.title);
      return r(e.tag, {
        class: ["v-list-subheader", {
          "v-list-subheader--inset": e.inset,
          "v-list-subheader--sticky": e.sticky
        }, a.value, e.class],
        style: [{
          textColorStyles: l
        }, e.style]
      }, {
        default: () => {
          var i;
          return [o && r("div", {
            class: "v-list-subheader__text"
          }, [((i = t.default) == null ? void 0 : i.call(t)) ?? e.title])];
        }
      });
    }), {};
  }
});
const Ss = B({
  color: String,
  inset: Boolean,
  length: [Number, String],
  thickness: [Number, String],
  vertical: Boolean,
  ...Z(),
  ...ge()
}, "VDivider"), xs = z()({
  name: "VDivider",
  props: Ss(),
  setup(e, n) {
    let {
      attrs: t
    } = n;
    const {
      themeClasses: a
    } = ye(e), {
      textColorClasses: l,
      textColorStyles: o
    } = Re(j(e, "color")), i = g(() => {
      const s = {};
      return e.length && (s[e.vertical ? "maxHeight" : "maxWidth"] = ee(e.length)), e.thickness && (s[e.vertical ? "borderRightWidth" : "borderTopWidth"] = ee(e.thickness)), s;
    });
    return K(() => r("hr", {
      class: [{
        "v-divider": !0,
        "v-divider--inset": e.inset,
        "v-divider--vertical": e.vertical
      }, a.value, l.value, e.class],
      style: [i.value, o.value, e.style],
      "aria-orientation": !t.role || t.role === "separator" ? e.vertical ? "vertical" : "horizontal" : void 0,
      role: `${t.role || "separator"}`
    }, null)), {};
  }
}), As = B({
  items: Array
}, "VListChildren"), ro = z()({
  name: "VListChildren",
  props: As(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    return no(), () => {
      var a, l;
      return ((a = t.default) == null ? void 0 : a.call(t)) ?? ((l = e.items) == null ? void 0 : l.map((o) => {
        var m, y;
        let {
          children: i,
          props: s,
          type: u,
          raw: c
        } = o;
        if (u === "divider")
          return ((m = t.divider) == null ? void 0 : m.call(t, {
            props: s
          })) ?? r(xs, s, null);
        if (u === "subheader")
          return ((y = t.subheader) == null ? void 0 : y.call(t, {
            props: s
          })) ?? r(ps, s, null);
        const f = {
          subtitle: t.subtitle ? (h) => {
            var C;
            return (C = t.subtitle) == null ? void 0 : C.call(t, {
              ...h,
              item: c
            });
          } : void 0,
          prepend: t.prepend ? (h) => {
            var C;
            return (C = t.prepend) == null ? void 0 : C.call(t, {
              ...h,
              item: c
            });
          } : void 0,
          append: t.append ? (h) => {
            var C;
            return (C = t.append) == null ? void 0 : C.call(t, {
              ...h,
              item: c
            });
          } : void 0,
          title: t.title ? (h) => {
            var C;
            return (C = t.title) == null ? void 0 : C.call(t, {
              ...h,
              item: c
            });
          } : void 0
        }, [d, v] = Za.filterProps(s);
        return i ? r(Za, U({
          value: s == null ? void 0 : s.value
        }, d), {
          activator: (h) => {
            let {
              props: C
            } = h;
            return t.header ? t.header({
              props: {
                ...s,
                ...C
              }
            }) : r(fn, U(s, C), f);
          },
          default: () => r(ro, {
            items: i
          }, t)
        }) : t.item ? t.item({
          props: s
        }) : r(fn, s, f);
      }));
    };
  }
}), uo = B({
  items: {
    type: Array,
    default: () => []
  },
  itemTitle: {
    type: [String, Array, Function],
    default: "title"
  },
  itemValue: {
    type: [String, Array, Function],
    default: "value"
  },
  itemChildren: {
    type: [Boolean, String, Array, Function],
    default: "children"
  },
  itemProps: {
    type: [Boolean, String, Array, Function],
    default: "props"
  },
  returnObject: Boolean
}, "list-items");
function co(e, n) {
  const t = Le(n, e.itemTitle, n), a = e.returnObject ? n : Le(n, e.itemValue, t), l = Le(n, e.itemChildren), o = e.itemProps === !0 ? typeof n == "object" && n != null && !Array.isArray(n) ? "children" in n ? $t(n, ["children"])[1] : n : void 0 : Le(n, e.itemProps), i = {
    title: t,
    value: a,
    ...o
  };
  return {
    title: String(i.title ?? ""),
    value: i.value,
    props: i,
    children: Array.isArray(l) ? fo(e, l) : void 0,
    raw: n
  };
}
function fo(e, n) {
  const t = [];
  for (const a of n)
    t.push(co(e, a));
  return t;
}
function ws(e) {
  const n = g(() => fo(e, e.items));
  return ks(n, (t) => co(e, t));
}
function ks(e, n) {
  function t(l) {
    return l.filter((o) => o !== null || e.value.some((i) => i.value === null)).map((o) => e.value.find((s) => Vt(o, s.value)) ?? n(o));
  }
  function a(l) {
    return l.map((o) => {
      let {
        value: i
      } = o;
      return i;
    });
  }
  return {
    items: e,
    transformIn: t,
    transformOut: a
  };
}
function Vs(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean";
}
function _s(e, n) {
  const t = Le(n, e.itemType, "item"), a = Vs(n) ? n : Le(n, e.itemTitle), l = Le(n, e.itemValue, void 0), o = Le(n, e.itemChildren), i = e.itemProps === !0 ? $t(n, ["children"])[1] : Le(n, e.itemProps), s = {
    title: a,
    value: l,
    ...i
  };
  return {
    type: t,
    title: s.title,
    value: s.value,
    props: s,
    children: t === "item" && o ? vo(e, o) : void 0,
    raw: n
  };
}
function vo(e, n) {
  const t = [];
  for (const a of n)
    t.push(_s(e, a));
  return t;
}
function Is(e) {
  return {
    items: g(() => vo(e, e.items))
  };
}
const Bs = B({
  baseColor: String,
  /* @deprecated */
  activeColor: String,
  activeClass: String,
  bgColor: String,
  disabled: Boolean,
  lines: {
    type: [Boolean, String],
    default: "one"
  },
  nav: Boolean,
  ...ds({
    selectStrategy: "single-leaf",
    openStrategy: "list"
  }),
  ...et(),
  ...Z(),
  ...we(),
  ...$e(),
  ...qe(),
  itemType: {
    type: String,
    default: "type"
  },
  ...uo(),
  ...Be(),
  ...de(),
  ...ge(),
  ...Ge({
    variant: "text"
  })
}, "VList"), Es = z()({
  name: "VList",
  props: Bs(),
  emits: {
    "update:selected": (e) => !0,
    "update:opened": (e) => !0,
    "click:open": (e) => !0,
    "click:select": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      items: a
    } = Is(e), {
      themeClasses: l
    } = ye(e), {
      backgroundColorClasses: o,
      backgroundColorStyles: i
    } = We(j(e, "bgColor")), {
      borderClasses: s
    } = tt(e), {
      densityClasses: u
    } = Pe(e), {
      dimensionStyles: c
    } = Qe(e), {
      elevationClasses: f
    } = He(e), {
      roundedClasses: d
    } = Ee(e), {
      open: v,
      select: m
    } = fs(e), y = g(() => e.lines ? `v-list--${e.lines}-line` : void 0), h = j(e, "activeColor"), C = j(e, "baseColor"), b = j(e, "color");
    no(), Oe({
      VListGroup: {
        activeColor: h,
        baseColor: C,
        color: b
      },
      VListItem: {
        activeClass: j(e, "activeClass"),
        activeColor: h,
        baseColor: C,
        color: b,
        density: j(e, "density"),
        disabled: j(e, "disabled"),
        lines: j(e, "lines"),
        nav: j(e, "nav"),
        variant: j(e, "variant")
      }
    });
    const S = te(!1), p = A();
    function w(V) {
      S.value = !0;
    }
    function I(V) {
      S.value = !1;
    }
    function E(V) {
      var D;
      !S.value && !(V.relatedTarget && ((D = p.value) != null && D.contains(V.relatedTarget))) && _();
    }
    function O(V) {
      if (p.value) {
        if (V.key === "ArrowDown")
          _("next");
        else if (V.key === "ArrowUp")
          _("prev");
        else if (V.key === "Home")
          _("first");
        else if (V.key === "End")
          _("last");
        else
          return;
        V.preventDefault();
      }
    }
    function _(V) {
      if (p.value)
        return un(p.value, V);
    }
    return K(() => r(e.tag, {
      ref: p,
      class: ["v-list", {
        "v-list--disabled": e.disabled,
        "v-list--nav": e.nav
      }, l.value, o.value, s.value, u.value, f.value, y.value, d.value, e.class],
      style: [i.value, c.value, e.style],
      tabindex: e.disabled || S.value ? -1 : 0,
      role: "listbox",
      "aria-activedescendant": void 0,
      onFocusin: w,
      onFocusout: I,
      onFocus: E,
      onKeydown: O
    }, {
      default: () => [r(ro, {
        items: a.value
      }, t)]
    })), {
      open: v,
      select: m,
      focus: _
    };
  }
});
function Pn(e, n) {
  return {
    x: e.x + n.x,
    y: e.y + n.y
  };
}
function Ps(e, n) {
  return {
    x: e.x - n.x,
    y: e.y - n.y
  };
}
function Ja(e, n) {
  if (e.side === "top" || e.side === "bottom") {
    const {
      side: t,
      align: a
    } = e, l = a === "left" ? 0 : a === "center" ? n.width / 2 : a === "right" ? n.width : a, o = t === "top" ? 0 : t === "bottom" ? n.height : t;
    return Pn({
      x: l,
      y: o
    }, n);
  } else if (e.side === "left" || e.side === "right") {
    const {
      side: t,
      align: a
    } = e, l = t === "left" ? 0 : t === "right" ? n.width : t, o = a === "top" ? 0 : a === "center" ? n.height / 2 : a === "bottom" ? n.height : a;
    return Pn({
      x: l,
      y: o
    }, n);
  }
  return Pn({
    x: n.width / 2,
    y: n.height / 2
  }, n);
}
const mo = {
  static: Os,
  // specific viewport position, usually centered
  connected: Fs
  // connected to a certain element
}, Ts = B({
  locationStrategy: {
    type: [String, Function],
    default: "static",
    validator: (e) => typeof e == "function" || e in mo
  },
  location: {
    type: String,
    default: "bottom"
  },
  origin: {
    type: String,
    default: "auto"
  },
  offset: [Number, String, Array]
}, "VOverlay-location-strategies");
function Rs(e, n) {
  const t = A({}), a = A();
  _e && (rt(() => !!(n.isActive.value && e.locationStrategy), (o) => {
    var i, s;
    ae(() => e.locationStrategy, o), pe(() => {
      a.value = void 0;
    }), typeof e.locationStrategy == "function" ? a.value = (i = e.locationStrategy(n, e, t)) == null ? void 0 : i.updateLocation : a.value = (s = mo[e.locationStrategy](n, e, t)) == null ? void 0 : s.updateLocation;
  }), window.addEventListener("resize", l, {
    passive: !0
  }), pe(() => {
    window.removeEventListener("resize", l), a.value = void 0;
  }));
  function l(o) {
    var i;
    (i = a.value) == null || i.call(a, o);
  }
  return {
    contentStyles: t,
    updateLocation: a
  };
}
function Os() {
}
function Ds(e, n) {
  const t = ca(e);
  return n ? t.x += parseFloat(e.style.right || 0) : t.x -= parseFloat(e.style.left || 0), t.y -= parseFloat(e.style.top || 0), t;
}
function Fs(e, n, t) {
  vi(e.activatorEl.value) && Object.assign(t.value, {
    position: "fixed",
    top: 0,
    [e.isRtl.value ? "right" : "left"]: 0
  });
  const {
    preferredAnchor: l,
    preferredOrigin: o
  } = sa(() => {
    const y = Nn(n.location, e.isRtl.value), h = n.origin === "overlap" ? y : n.origin === "auto" ? In(y) : Nn(n.origin, e.isRtl.value);
    return y.side === h.side && y.align === Bn(h).align ? {
      preferredAnchor: La(y),
      preferredOrigin: La(h)
    } : {
      preferredAnchor: y,
      preferredOrigin: h
    };
  }), [i, s, u, c] = ["minWidth", "minHeight", "maxWidth", "maxHeight"].map((y) => g(() => {
    const h = parseFloat(n[y]);
    return isNaN(h) ? 1 / 0 : h;
  })), f = g(() => {
    if (Array.isArray(n.offset))
      return n.offset;
    if (typeof n.offset == "string") {
      const y = n.offset.split(" ").map(parseFloat);
      return y.length < 2 && y.push(0), y;
    }
    return typeof n.offset == "number" ? [n.offset, 0] : [0, 0];
  });
  let d = !1;
  const v = new ResizeObserver(() => {
    d && m();
  });
  ae([e.activatorEl, e.contentEl], (y, h) => {
    let [C, b] = y, [S, p] = h;
    S && v.unobserve(S), C && v.observe(C), p && v.unobserve(p), b && v.observe(b);
  }, {
    immediate: !0
  }), pe(() => {
    v.disconnect();
  });
  function m() {
    if (d = !1, requestAnimationFrame(() => {
      requestAnimationFrame(() => d = !0);
    }), !e.activatorEl.value || !e.contentEl.value)
      return;
    const y = e.activatorEl.value.getBoundingClientRect(), h = Ds(e.contentEl.value, e.isRtl.value), C = cn(e.contentEl.value), b = 12;
    C.length || (C.push(document.documentElement), e.contentEl.value.style.top && e.contentEl.value.style.left || (h.x -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-x") || 0), h.y -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-y") || 0)));
    const S = C.reduce((q, N) => {
      const k = N.getBoundingClientRect(), P = new Ct({
        x: N === document.documentElement ? 0 : k.x,
        y: N === document.documentElement ? 0 : k.y,
        width: N.clientWidth,
        height: N.clientHeight
      });
      return q ? new Ct({
        x: Math.max(q.left, P.left),
        y: Math.max(q.top, P.top),
        width: Math.min(q.right, P.right) - Math.max(q.left, P.left),
        height: Math.min(q.bottom, P.bottom) - Math.max(q.top, P.top)
      }) : P;
    }, void 0);
    S.x += b, S.y += b, S.width -= b * 2, S.height -= b * 2;
    let p = {
      anchor: l.value,
      origin: o.value
    };
    function w(q) {
      const N = new Ct(h), k = Ja(q.anchor, y), P = Ja(q.origin, N);
      let {
        x: $,
        y: W
      } = Ps(k, P);
      switch (q.anchor.side) {
        case "top":
          W -= f.value[0];
          break;
        case "bottom":
          W += f.value[0];
          break;
        case "left":
          $ -= f.value[0];
          break;
        case "right":
          $ += f.value[0];
          break;
      }
      switch (q.anchor.align) {
        case "top":
          W -= f.value[1];
          break;
        case "bottom":
          W += f.value[1];
          break;
        case "left":
          $ -= f.value[1];
          break;
        case "right":
          $ += f.value[1];
          break;
      }
      return N.x += $, N.y += W, N.width = Math.min(N.width, u.value), N.height = Math.min(N.height, c.value), {
        overflows: ja(N, S),
        x: $,
        y: W
      };
    }
    let I = 0, E = 0;
    const O = {
      x: 0,
      y: 0
    }, _ = {
      x: !1,
      y: !1
    };
    let V = -1;
    for (; ; ) {
      if (V++ > 10) {
        oi("Infinite loop detected in connectedLocationStrategy");
        break;
      }
      const {
        x: q,
        y: N,
        overflows: k
      } = w(p);
      I += q, E += N, h.x += q, h.y += N;
      {
        const P = za(p.anchor), $ = k.x.before || k.x.after, W = k.y.before || k.y.after;
        let J = !1;
        if (["x", "y"].forEach((R) => {
          if (R === "x" && $ && !_.x || R === "y" && W && !_.y) {
            const Q = {
              anchor: {
                ...p.anchor
              },
              origin: {
                ...p.origin
              }
            }, T = R === "x" ? P === "y" ? Bn : In : P === "y" ? In : Bn;
            Q.anchor = T(Q.anchor), Q.origin = T(Q.origin);
            const {
              overflows: L
            } = w(Q);
            (L[R].before <= k[R].before && L[R].after <= k[R].after || L[R].before + L[R].after < (k[R].before + k[R].after) / 2) && (p = Q, J = _[R] = !0);
          }
        }), J)
          continue;
      }
      k.x.before && (I += k.x.before, h.x += k.x.before), k.x.after && (I -= k.x.after, h.x -= k.x.after), k.y.before && (E += k.y.before, h.y += k.y.before), k.y.after && (E -= k.y.after, h.y -= k.y.after);
      {
        const P = ja(h, S);
        O.x = S.width - P.x.before - P.x.after, O.y = S.height - P.y.before - P.y.after, I += P.x.before, h.x += P.x.before, E += P.y.before, h.y += P.y.before;
      }
      break;
    }
    const D = za(p.anchor);
    return Object.assign(t.value, {
      "--v-overlay-anchor-origin": `${p.anchor.side} ${p.anchor.align}`,
      transformOrigin: `${p.origin.side} ${p.origin.align}`,
      // transform: `translate(${pixelRound(x)}px, ${pixelRound(y)}px)`,
      top: ee(Tn(E)),
      left: e.isRtl.value ? void 0 : ee(Tn(I)),
      right: e.isRtl.value ? ee(Tn(-I)) : void 0,
      minWidth: ee(D === "y" ? Math.min(i.value, y.width) : i.value),
      maxWidth: ee(Xa(Un(O.x, i.value === 1 / 0 ? 0 : i.value, u.value))),
      maxHeight: ee(Xa(Un(O.y, s.value === 1 / 0 ? 0 : s.value, c.value)))
    }), {
      available: O,
      contentBox: h
    };
  }
  return ae(() => [l.value, o.value, n.offset, n.minWidth, n.minHeight, n.maxWidth, n.maxHeight], () => m()), Se(() => {
    const y = m();
    if (!y)
      return;
    const {
      available: h,
      contentBox: C
    } = y;
    C.height > h.y && requestAnimationFrame(() => {
      m(), requestAnimationFrame(() => {
        m();
      });
    });
  }), {
    updateLocation: m
  };
}
function Tn(e) {
  return Math.round(e * devicePixelRatio) / devicePixelRatio;
}
function Xa(e) {
  return Math.ceil(e * devicePixelRatio) / devicePixelRatio;
}
let Wn = !0;
const vn = [];
function Ms(e) {
  !Wn || vn.length ? (vn.push(e), Zn()) : (Wn = !1, e(), Zn());
}
let el = -1;
function Zn() {
  cancelAnimationFrame(el), el = requestAnimationFrame(() => {
    const e = vn.shift();
    e && e(), vn.length ? Zn() : Wn = !0;
  });
}
const sn = {
  none: null,
  close: js,
  block: Us,
  reposition: Ns
}, Ls = B({
  scrollStrategy: {
    type: [String, Function],
    default: "block",
    validator: (e) => typeof e == "function" || e in sn
  }
}, "VOverlay-scroll-strategies");
function zs(e, n) {
  if (!_e)
    return;
  let t;
  xt(async () => {
    t == null || t.stop(), n.isActive.value && e.scrollStrategy && (t = aa(), await Se(), t.active && t.run(() => {
      var a;
      typeof e.scrollStrategy == "function" ? e.scrollStrategy(n, e, t) : (a = sn[e.scrollStrategy]) == null || a.call(sn, n, e, t);
    }));
  }), pe(() => {
    t == null || t.stop();
  });
}
function js(e) {
  function n(t) {
    e.isActive.value = !1;
  }
  go(e.activatorEl.value ?? e.contentEl.value, n);
}
function Us(e, n) {
  var i;
  const t = (i = e.root.value) == null ? void 0 : i.offsetParent, a = [.../* @__PURE__ */ new Set([...cn(e.activatorEl.value, n.contained ? t : void 0), ...cn(e.contentEl.value, n.contained ? t : void 0)])].filter((s) => !s.classList.contains("v-overlay-scroll-blocked")), l = window.innerWidth - document.documentElement.offsetWidth, o = ((s) => ma(s) && s)(t || document.documentElement);
  o && e.root.value.classList.add("v-overlay--scroll-blocked"), a.forEach((s, u) => {
    s.style.setProperty("--v-body-scroll-x", ee(-s.scrollLeft)), s.style.setProperty("--v-body-scroll-y", ee(-s.scrollTop)), s.style.setProperty("--v-scrollbar-offset", ee(l)), s.classList.add("v-overlay-scroll-blocked");
  }), pe(() => {
    a.forEach((s, u) => {
      const c = parseFloat(s.style.getPropertyValue("--v-body-scroll-x")), f = parseFloat(s.style.getPropertyValue("--v-body-scroll-y"));
      s.style.removeProperty("--v-body-scroll-x"), s.style.removeProperty("--v-body-scroll-y"), s.style.removeProperty("--v-scrollbar-offset"), s.classList.remove("v-overlay-scroll-blocked"), s.scrollLeft = -c, s.scrollTop = -f;
    }), o && e.root.value.classList.remove("v-overlay--scroll-blocked");
  });
}
function Ns(e, n, t) {
  let a = !1, l = -1, o = -1;
  function i(s) {
    Ms(() => {
      var f, d;
      const u = performance.now();
      (d = (f = e.updateLocation).value) == null || d.call(f, s), a = (performance.now() - u) / (1e3 / 60) > 2;
    });
  }
  o = (typeof requestIdleCallback > "u" ? (s) => s() : requestIdleCallback)(() => {
    t.run(() => {
      go(e.activatorEl.value ?? e.contentEl.value, (s) => {
        a ? (cancelAnimationFrame(l), l = requestAnimationFrame(() => {
          l = requestAnimationFrame(() => {
            i(s);
          });
        })) : i(s);
      });
    });
  }), pe(() => {
    typeof cancelIdleCallback < "u" && cancelIdleCallback(o), cancelAnimationFrame(l);
  });
}
function go(e, n) {
  const t = [document, ...cn(e)];
  t.forEach((a) => {
    a.addEventListener("scroll", n, {
      passive: !0
    });
  }), pe(() => {
    t.forEach((a) => {
      a.removeEventListener("scroll", n);
    });
  });
}
const Jn = Symbol.for("vuetify:v-menu"), $s = B({
  closeDelay: [Number, String],
  openDelay: [Number, String]
}, "delay");
function Qs(e, n) {
  const t = {}, a = (l) => () => {
    if (!_e)
      return Promise.resolve(!0);
    const o = l === "openDelay";
    return t.closeDelay && window.clearTimeout(t.closeDelay), delete t.closeDelay, t.openDelay && window.clearTimeout(t.openDelay), delete t.openDelay, new Promise((i) => {
      const s = parseInt(e[l] ?? 0, 10);
      t[l] = window.setTimeout(() => {
        n == null || n(o), i(o);
      }, s);
    });
  };
  return {
    runCloseDelay: a("closeDelay"),
    runOpenDelay: a("openDelay")
  };
}
const qs = B({
  activator: [String, Object],
  activatorProps: {
    type: Object,
    default: () => ({})
  },
  openOnClick: {
    type: Boolean,
    default: void 0
  },
  openOnHover: Boolean,
  openOnFocus: {
    type: Boolean,
    default: void 0
  },
  closeOnContentClick: Boolean,
  ...$s()
}, "VOverlay-activator");
function Hs(e, n) {
  let {
    isActive: t,
    isTop: a
  } = n;
  const l = A();
  let o = !1, i = !1, s = !0;
  const u = g(() => e.openOnFocus || e.openOnFocus == null && e.openOnHover), c = g(() => e.openOnClick || e.openOnClick == null && !e.openOnHover && !u.value), {
    runOpenDelay: f,
    runCloseDelay: d
  } = Qs(e, (p) => {
    p === (e.openOnHover && o || u.value && i) && !(e.openOnHover && t.value && !a.value) && (t.value !== p && (s = !0), t.value = p);
  }), v = {
    onClick: (p) => {
      p.stopPropagation(), l.value = p.currentTarget || p.target, t.value = !t.value;
    },
    onMouseenter: (p) => {
      var w;
      (w = p.sourceCapabilities) != null && w.firesTouchEvents || (o = !0, l.value = p.currentTarget || p.target, f());
    },
    onMouseleave: (p) => {
      o = !1, d();
    },
    onFocus: (p) => {
      $n && !p.target.matches(":focus-visible") || (i = !0, p.stopPropagation(), l.value = p.currentTarget || p.target, f());
    },
    onBlur: (p) => {
      i = !1, p.stopPropagation(), d();
    }
  }, m = g(() => {
    const p = {};
    return c.value && (p.onClick = v.onClick), e.openOnHover && (p.onMouseenter = v.onMouseenter, p.onMouseleave = v.onMouseleave), u.value && (p.onFocus = v.onFocus, p.onBlur = v.onBlur), p;
  }), y = g(() => {
    const p = {};
    if (e.openOnHover && (p.onMouseenter = () => {
      o = !0, f();
    }, p.onMouseleave = () => {
      o = !1, d();
    }), u.value && (p.onFocusin = () => {
      i = !0, f();
    }, p.onFocusout = () => {
      i = !1, d();
    }), e.closeOnContentClick) {
      const w = se(Jn, null);
      p.onClick = () => {
        t.value = !1, w == null || w.closeParents();
      };
    }
    return p;
  }), h = g(() => {
    const p = {};
    return e.openOnHover && (p.onMouseenter = () => {
      s && (o = !0, s = !1, f());
    }, p.onMouseleave = () => {
      o = !1, d();
    }), p;
  });
  ae(a, (p) => {
    p && (e.openOnHover && !o && (!u.value || !i) || u.value && !i && (!e.openOnHover || !o)) && (t.value = !1);
  });
  const C = A();
  xt(() => {
    C.value && Se(() => {
      l.value = jn(C.value);
    });
  });
  const b = Ae("useActivator");
  let S;
  return ae(() => !!e.activator, (p) => {
    p && _e ? (S = aa(), S.run(() => {
      Gs(e, b, {
        activatorEl: l,
        activatorEvents: m
      });
    })) : S && S.stop();
  }, {
    flush: "post",
    immediate: !0
  }), pe(() => {
    S == null || S.stop();
  }), {
    activatorEl: l,
    activatorRef: C,
    activatorEvents: m,
    contentEvents: y,
    scrimEvents: h
  };
}
function Gs(e, n, t) {
  let {
    activatorEl: a,
    activatorEvents: l
  } = t;
  ae(() => e.activator, (u, c) => {
    if (c && u !== c) {
      const f = s(c);
      f && i(f);
    }
    u && Se(() => o());
  }, {
    immediate: !0
  }), ae(() => e.activatorProps, () => {
    o();
  }), pe(() => {
    i();
  });
  function o() {
    let u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : s(), c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
    u && ai(u, U(l.value, c));
  }
  function i() {
    let u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : s(), c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
    u && li(u, U(l.value, c));
  }
  function s() {
    var f, d;
    let u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : e.activator, c;
    if (u)
      if (u === "parent") {
        let v = (d = (f = n == null ? void 0 : n.proxy) == null ? void 0 : f.$el) == null ? void 0 : d.parentNode;
        for (; v.hasAttribute("data-no-activator"); )
          v = v.parentNode;
        c = v;
      } else
        typeof u == "string" ? c = document.querySelector(u) : "$el" in u ? c = u.$el : c = u;
    return a.value = (c == null ? void 0 : c.nodeType) === Node.ELEMENT_NODE ? c : null, a.value;
  }
}
const kn = ["sm", "md", "lg", "xl", "xxl"], Ks = Symbol.for("vuetify:display");
function Va() {
  const e = se(Ks);
  if (!e)
    throw new Error("Could not find Vuetify display injection");
  return e;
}
function Ys() {
  if (!_e)
    return te(!1);
  const {
    ssr: e
  } = Va();
  if (e) {
    const n = te(!1);
    return kt(() => {
      n.value = !0;
    }), n;
  } else
    return te(!0);
}
const yo = B({
  eager: Boolean
}, "lazy");
function ho(e, n) {
  const t = te(!1), a = g(() => t.value || e.eager || n.value);
  ae(n, () => t.value = !0);
  function l() {
    e.eager || (t.value = !1);
  }
  return {
    isBooted: t,
    hasContent: a,
    onAfterLeave: l
  };
}
function Vn() {
  const n = Ae("useScopeId").vnode.scopeId;
  return {
    scopeId: n ? {
      [n]: ""
    } : void 0
  };
}
const tl = Symbol.for("vuetify:stack"), Tt = gn([]);
function Ws(e, n, t) {
  const a = Ae("useStack"), l = !t, o = se(tl, void 0), i = gn({
    activeChildren: /* @__PURE__ */ new Set()
  });
  xe(tl, i);
  const s = te(+n.value);
  rt(e, () => {
    var d;
    const f = (d = Tt.at(-1)) == null ? void 0 : d[1];
    s.value = f ? f + 10 : +n.value, l && Tt.push([a.uid, s.value]), o == null || o.activeChildren.add(a.uid), pe(() => {
      if (l) {
        const v = Je(Tt).findIndex((m) => m[0] === a.uid);
        Tt.splice(v, 1);
      }
      o == null || o.activeChildren.delete(a.uid);
    });
  });
  const u = te(!0);
  l && xt(() => {
    var d;
    const f = ((d = Tt.at(-1)) == null ? void 0 : d[0]) === a.uid;
    setTimeout(() => u.value = f);
  });
  const c = g(() => !i.activeChildren.size);
  return {
    globalTop: la(u),
    localTop: c,
    stackStyles: g(() => ({
      zIndex: s.value
    }))
  };
}
function Zs(e) {
  return {
    teleportTarget: g(() => {
      const t = e.value;
      if (t === !0 || !_e)
        return;
      const a = t === !1 ? document.body : typeof t == "string" ? document.querySelector(t) : t;
      if (a == null) {
        yn(`Unable to locate target ${t}`);
        return;
      }
      let l = a.querySelector(":scope > .v-overlay-container");
      return l || (l = document.createElement("div"), l.className = "v-overlay-container", a.appendChild(l)), l;
    })
  };
}
function Js() {
  return !0;
}
function bo(e, n, t) {
  if (!e || Co(e, t) === !1)
    return !1;
  const a = xl(n);
  if (typeof ShadowRoot < "u" && a instanceof ShadowRoot && a.host === e.target)
    return !1;
  const l = (typeof t.value == "object" && t.value.include || (() => []))();
  return l.push(n), !l.some((o) => o == null ? void 0 : o.contains(e.target));
}
function Co(e, n) {
  return (typeof n.value == "object" && n.value.closeConditional || Js)(e);
}
function Xs(e, n, t) {
  const a = typeof t.value == "function" ? t.value : t.value.handler;
  n._clickOutside.lastMousedownWasOutside && bo(e, n, t) && setTimeout(() => {
    Co(e, t) && a && a(e);
  }, 0);
}
function nl(e, n) {
  const t = xl(e);
  n(document), typeof ShadowRoot < "u" && t instanceof ShadowRoot && n(t);
}
const er = {
  // [data-app] may not be found
  // if using bind, inserted makes
  // sure that the root element is
  // available, iOS does not support
  // clicks on body
  mounted(e, n) {
    const t = (l) => Xs(l, e, n), a = (l) => {
      e._clickOutside.lastMousedownWasOutside = bo(l, e, n);
    };
    nl(e, (l) => {
      l.addEventListener("click", t, !0), l.addEventListener("mousedown", a, !0);
    }), e._clickOutside || (e._clickOutside = {
      lastMousedownWasOutside: !1
    }), e._clickOutside[n.instance.$.uid] = {
      onClick: t,
      onMousedown: a
    };
  },
  unmounted(e, n) {
    e._clickOutside && (nl(e, (t) => {
      var o;
      if (!t || !((o = e._clickOutside) != null && o[n.instance.$.uid]))
        return;
      const {
        onClick: a,
        onMousedown: l
      } = e._clickOutside[n.instance.$.uid];
      t.removeEventListener("click", a, !0), t.removeEventListener("mousedown", l, !0);
    }), delete e._clickOutside[n.instance.$.uid]);
  }
};
function tr(e) {
  const {
    modelValue: n,
    color: t,
    ...a
  } = e;
  return r(st, {
    name: "fade-transition",
    appear: !0
  }, {
    default: () => [e.modelValue && r("div", U({
      class: ["v-overlay__scrim", e.color.backgroundColorClasses.value],
      style: e.color.backgroundColorStyles.value
    }, a), null)]
  });
}
const _n = B({
  absolute: Boolean,
  attach: [Boolean, String, Object],
  closeOnBack: {
    type: Boolean,
    default: !0
  },
  contained: Boolean,
  contentClass: null,
  contentProps: null,
  disabled: Boolean,
  noClickAnimation: Boolean,
  modelValue: Boolean,
  persistent: Boolean,
  scrim: {
    type: [String, Boolean],
    default: !0
  },
  zIndex: {
    type: [Number, String],
    default: 2e3
  },
  ...qs(),
  ...Z(),
  ...$e(),
  ...yo(),
  ...Ts(),
  ...Ls(),
  ...ge(),
  ...qt()
}, "VOverlay"), ut = z()({
  name: "VOverlay",
  directives: {
    ClickOutside: er
  },
  inheritAttrs: !1,
  props: {
    _disableGlobalStack: Boolean,
    ..._n()
  },
  emits: {
    "click:outside": (e) => !0,
    "update:modelValue": (e) => !0,
    afterLeave: () => !0
  },
  setup(e, n) {
    let {
      slots: t,
      attrs: a,
      emit: l
    } = n;
    const o = ce(e, "modelValue"), i = g({
      get: () => o.value,
      set: (Q) => {
        Q && e.disabled || (o.value = Q);
      }
    }), {
      teleportTarget: s
    } = Zs(g(() => e.attach || e.contained)), {
      themeClasses: u
    } = ye(e), {
      rtlClasses: c,
      isRtl: f
    } = Xe(), {
      hasContent: d,
      onAfterLeave: v
    } = ho(e, i), m = We(g(() => typeof e.scrim == "string" ? e.scrim : null)), {
      globalTop: y,
      localTop: h,
      stackStyles: C
    } = Ws(i, j(e, "zIndex"), e._disableGlobalStack), {
      activatorEl: b,
      activatorRef: S,
      activatorEvents: p,
      contentEvents: w,
      scrimEvents: I
    } = Hs(e, {
      isActive: i,
      isTop: h
    }), {
      dimensionStyles: E
    } = Qe(e), O = Ys(), {
      scopeId: _
    } = Vn();
    ae(() => e.disabled, (Q) => {
      Q && (i.value = !1);
    });
    const V = A(), D = A(), {
      contentStyles: q,
      updateLocation: N
    } = Rs(e, {
      isRtl: f,
      contentEl: D,
      activatorEl: b,
      isActive: i
    });
    zs(e, {
      root: V,
      contentEl: D,
      activatorEl: b,
      isActive: i,
      updateLocation: N
    });
    function k(Q) {
      l("click:outside", Q), e.persistent ? R() : i.value = !1;
    }
    function P() {
      return i.value && y.value;
    }
    _e && ae(i, (Q) => {
      Q ? window.addEventListener("keydown", $) : window.removeEventListener("keydown", $);
    }, {
      immediate: !0
    });
    function $(Q) {
      var T, L;
      Q.key === "Escape" && y.value && (e.persistent ? R() : (i.value = !1, (T = D.value) != null && T.contains(document.activeElement) && ((L = b.value) == null || L.focus())));
    }
    const W = Di();
    rt(() => e.closeOnBack, () => {
      Fi(W, (Q) => {
        y.value && i.value ? (Q(!1), e.persistent ? R() : i.value = !1) : Q();
      });
    });
    const J = A();
    ae(() => i.value && (e.absolute || e.contained) && s.value == null, (Q) => {
      if (Q) {
        const T = di(V.value);
        T && T !== document.scrollingElement && (J.value = T.scrollTop);
      }
    });
    function R() {
      e.noClickAnimation || D.value && ot(D.value, [{
        transformOrigin: "center"
      }, {
        transform: "scale(1.03)"
      }, {
        transformOrigin: "center"
      }], {
        duration: 150,
        easing: Mt
      });
    }
    return K(() => {
      var Q;
      return r(ue, null, [(Q = t.activator) == null ? void 0 : Q.call(t, {
        isActive: i.value,
        props: U({
          ref: S
        }, p.value, e.activatorProps)
      }), O.value && r(Zo, {
        disabled: !s.value,
        to: s.value
      }, {
        default: () => [d.value && r("div", U({
          class: ["v-overlay", {
            "v-overlay--absolute": e.absolute || e.contained,
            "v-overlay--active": i.value,
            "v-overlay--contained": e.contained
          }, u.value, c.value, e.class],
          style: [C.value, {
            top: ee(J.value)
          }, e.style],
          ref: V
        }, _, a), [r(tr, U({
          color: m,
          modelValue: i.value && !!e.scrim
        }, I.value), null), r(ze, {
          appear: !0,
          persisted: !0,
          transition: e.transition,
          target: b.value,
          onAfterLeave: () => {
            v(), l("afterLeave");
          }
        }, {
          default: () => {
            var T;
            return [be(r("div", U({
              ref: D,
              class: ["v-overlay__content", e.contentClass],
              style: [E.value, q.value]
            }, w.value, e.contentProps), [(T = t.default) == null ? void 0 : T.call(t, {
              isActive: i
            })]), [[dt, i.value], [Me("click-outside"), {
              handler: k,
              closeConditional: P,
              include: () => [b.value]
            }]])];
          }
        })])]
      })]);
    }), {
      activatorEl: b,
      animateClick: R,
      contentEl: D,
      globalTop: y,
      localTop: h,
      updateLocation: N
    };
  }
}), Rn = Symbol("Forwarded refs");
function On(e, n) {
  let t = e;
  for (; t; ) {
    const a = Reflect.getOwnPropertyDescriptor(t, n);
    if (a)
      return a;
    t = Object.getPrototypeOf(t);
  }
}
function mt(e) {
  for (var n = arguments.length, t = new Array(n > 1 ? n - 1 : 0), a = 1; a < n; a++)
    t[a - 1] = arguments[a];
  return e[Rn] = t, new Proxy(e, {
    get(l, o) {
      if (Reflect.has(l, o))
        return Reflect.get(l, o);
      if (!(typeof o == "symbol" || o.startsWith("__"))) {
        for (const i of t)
          if (i.value && Reflect.has(i.value, o)) {
            const s = Reflect.get(i.value, o);
            return typeof s == "function" ? s.bind(i.value) : s;
          }
      }
    },
    has(l, o) {
      if (Reflect.has(l, o))
        return !0;
      if (typeof o == "symbol" || o.startsWith("__"))
        return !1;
      for (const i of t)
        if (i.value && Reflect.has(i.value, o))
          return !0;
      return !1;
    },
    getOwnPropertyDescriptor(l, o) {
      var s;
      const i = Reflect.getOwnPropertyDescriptor(l, o);
      if (i)
        return i;
      if (!(typeof o == "symbol" || o.startsWith("__"))) {
        for (const u of t) {
          if (!u.value)
            continue;
          const c = On(u.value, o) ?? ("_" in u.value ? On((s = u.value._) == null ? void 0 : s.setupState, o) : void 0);
          if (c)
            return c;
        }
        for (const u of t) {
          const c = u.value && u.value[Rn];
          if (!c)
            continue;
          const f = c.slice();
          for (; f.length; ) {
            const d = f.shift(), v = On(d.value, o);
            if (v)
              return v;
            const m = d.value && d.value[Rn];
            m && f.push(...m);
          }
        }
      }
    }
  });
}
const nr = B({
  // TODO
  // disableKeys: Boolean,
  id: String,
  ...hn(_n({
    closeDelay: 250,
    closeOnContentClick: !0,
    locationStrategy: "connected",
    openDelay: 300,
    scrim: !1,
    scrollStrategy: "reposition",
    transition: {
      component: ya
    }
  }), ["absolute"])
}, "VMenu"), ar = z()({
  name: "VMenu",
  props: nr(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = ce(e, "modelValue"), {
      scopeId: l
    } = Vn(), o = De(), i = g(() => e.id || `v-menu-${o}`), s = A(), u = se(Jn, null), c = te(0);
    xe(Jn, {
      register() {
        ++c.value;
      },
      unregister() {
        --c.value;
      },
      closeParents() {
        setTimeout(() => {
          c.value || (a.value = !1, u == null || u.closeParents());
        }, 40);
      }
    }), ae(a, (y) => {
      y ? u == null || u.register() : u == null || u.unregister();
    });
    function f() {
      u == null || u.closeParents();
    }
    function d(y) {
      var h, C;
      e.disabled || y.key === "Tab" && (a.value = !1, (C = (h = s.value) == null ? void 0 : h.activatorEl) == null || C.focus());
    }
    function v(y) {
      var C;
      if (e.disabled)
        return;
      const h = (C = s.value) == null ? void 0 : C.contentEl;
      h && a.value ? y.key === "ArrowDown" ? (y.preventDefault(), un(h, "next")) : y.key === "ArrowUp" && (y.preventDefault(), un(h, "prev")) : ["ArrowDown", "ArrowUp"].includes(y.key) && (a.value = !0, y.preventDefault(), setTimeout(() => setTimeout(() => v(y))));
    }
    const m = g(() => U({
      "aria-haspopup": "menu",
      "aria-expanded": String(a.value),
      "aria-owns": i.value,
      onKeydown: v
    }, e.activatorProps));
    return K(() => {
      const [y] = ut.filterProps(e);
      return r(ut, U({
        ref: s,
        class: ["v-menu", e.class],
        style: e.style
      }, y, {
        modelValue: a.value,
        "onUpdate:modelValue": (h) => a.value = h,
        absolute: !0,
        activatorProps: m.value,
        "onClick:outside": f,
        onKeydown: d
      }, l), {
        activator: t.activator,
        default: function() {
          for (var h = arguments.length, C = new Array(h), b = 0; b < h; b++)
            C[b] = arguments[b];
          return r(me, {
            root: "VMenu"
          }, {
            default: () => {
              var S;
              return [(S = t.default) == null ? void 0 : S.call(t, ...C)];
            }
          });
        }
      });
    }), mt({
      id: i,
      ΨopenChildren: c
    }, s);
  }
});
const lr = B({
  active: Boolean,
  max: [Number, String],
  value: {
    type: [Number, String],
    default: 0
  },
  ...Z(),
  ...qt({
    transition: {
      component: _l
    }
  })
}, "VCounter"), po = z()({
  name: "VCounter",
  functional: !0,
  props: lr(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = g(() => e.max ? `${e.value} / ${e.max}` : String(e.value));
    return K(() => r(ze, {
      transition: e.transition
    }, {
      default: () => [be(r("div", {
        class: ["v-counter", e.class],
        style: e.style
      }, [t.default ? t.default({
        counter: a.value,
        max: e.max,
        value: e.value
      }) : a.value]), [[dt, e.active]])]
    })), {};
  }
});
const or = B({
  floating: Boolean,
  ...Z()
}, "VFieldLabel"), en = z()({
  name: "VFieldLabel",
  props: or(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    return K(() => r(Kl, {
      class: ["v-field-label", {
        "v-field-label--floating": e.floating
      }, e.class],
      style: e.style,
      "aria-hidden": e.floating || void 0
    }, t)), {};
  }
}), ir = ["underlined", "outlined", "filled", "solo", "solo-inverted", "solo-filled", "plain"], _a = B({
  appendInnerIcon: le,
  bgColor: String,
  clearable: Boolean,
  clearIcon: {
    type: le,
    default: "$clear"
  },
  active: Boolean,
  centerAffix: {
    type: Boolean,
    default: void 0
  },
  color: String,
  baseColor: String,
  dirty: Boolean,
  disabled: {
    type: Boolean,
    default: null
  },
  error: Boolean,
  flat: Boolean,
  label: String,
  persistentClear: Boolean,
  prependInnerIcon: le,
  reverse: Boolean,
  singleLine: Boolean,
  variant: {
    type: String,
    default: "filled",
    validator: (e) => ir.includes(e)
  },
  "onClick:clear": Fe(),
  "onClick:appendInner": Fe(),
  "onClick:prependInner": Fe(),
  ...Z(),
  ...Sa(),
  ...Be(),
  ...ge()
}, "VField"), Ia = z()({
  name: "VField",
  inheritAttrs: !1,
  props: {
    id: String,
    ...Jl(),
    ..._a()
  },
  emits: {
    "update:focused": (e) => !0,
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      attrs: t,
      emit: a,
      slots: l
    } = n;
    const {
      themeClasses: o
    } = ye(e), {
      loaderClasses: i
    } = xn(e), {
      focusClasses: s,
      isFocused: u,
      focus: c,
      blur: f
    } = An(e), {
      InputIcon: d
    } = Zl(e), {
      roundedClasses: v
    } = Ee(e), {
      rtlClasses: m
    } = Xe(), y = g(() => e.dirty || e.active), h = g(() => !e.singleLine && !!(e.label || l.label)), C = De(), b = g(() => e.id || `input-${C}`), S = g(() => `${b.value}-messages`), p = A(), w = A(), I = A(), E = g(() => ["plain", "underlined"].includes(e.variant)), {
      backgroundColorClasses: O,
      backgroundColorStyles: _
    } = We(j(e, "bgColor")), {
      textColorClasses: V,
      textColorStyles: D
    } = Re(g(() => e.error || e.disabled ? void 0 : y.value && u.value ? e.color : e.baseColor));
    ae(y, (k) => {
      if (h.value) {
        const P = p.value.$el, $ = w.value.$el;
        requestAnimationFrame(() => {
          const W = ca(P), J = $.getBoundingClientRect(), R = J.x - W.x, Q = J.y - W.y - (W.height / 2 - J.height / 2), T = J.width / 0.75, L = Math.abs(T - W.width) > 1 ? {
            maxWidth: ee(T)
          } : void 0, re = getComputedStyle(P), ve = getComputedStyle($), ke = parseFloat(re.transitionDuration) * 1e3 || 150, Te = parseFloat(ve.getPropertyValue("--v-field-label-scale")), ie = ve.getPropertyValue("color");
          P.style.visibility = "visible", $.style.visibility = "hidden", ot(P, {
            transform: `translate(${R}px, ${Q}px) scale(${Te})`,
            color: ie,
            ...L
          }, {
            duration: ke,
            easing: Mt,
            direction: k ? "normal" : "reverse"
          }).finished.then(() => {
            P.style.removeProperty("visibility"), $.style.removeProperty("visibility");
          });
        });
      }
    }, {
      flush: "post"
    });
    const q = g(() => ({
      isActive: y,
      isFocused: u,
      controlRef: I,
      blur: f,
      focus: c
    }));
    function N(k) {
      k.target !== document.activeElement && k.preventDefault();
    }
    return K(() => {
      var R, Q, T;
      const k = e.variant === "outlined", P = l["prepend-inner"] || e.prependInnerIcon, $ = !!(e.clearable || l.clear), W = !!(l["append-inner"] || e.appendInnerIcon || $), J = l.label ? l.label({
        ...q.value,
        label: e.label,
        props: {
          for: b.value
        }
      }) : e.label;
      return r("div", U({
        class: ["v-field", {
          "v-field--active": y.value,
          "v-field--appended": W,
          "v-field--center-affix": e.centerAffix ?? !E.value,
          "v-field--disabled": e.disabled,
          "v-field--dirty": e.dirty,
          "v-field--error": e.error,
          "v-field--flat": e.flat,
          "v-field--has-background": !!e.bgColor,
          "v-field--persistent-clear": e.persistentClear,
          "v-field--prepended": P,
          "v-field--reverse": e.reverse,
          "v-field--single-line": e.singleLine,
          "v-field--no-label": !J,
          [`v-field--variant-${e.variant}`]: !0
        }, o.value, O.value, s.value, i.value, v.value, m.value, e.class],
        style: [_.value, D.value, e.style],
        onClick: N
      }, t), [r("div", {
        class: "v-field__overlay"
      }, null), r(xa, {
        name: "v-field",
        active: !!e.loading,
        color: e.error ? "error" : e.color
      }, {
        default: l.loader
      }), P && r("div", {
        key: "prepend",
        class: "v-field__prepend-inner"
      }, [e.prependInnerIcon && r(d, {
        key: "prepend-icon",
        name: "prependInner"
      }, null), (R = l["prepend-inner"]) == null ? void 0 : R.call(l, q.value)]), r("div", {
        class: "v-field__field",
        "data-no-activator": ""
      }, [["filled", "solo", "solo-inverted", "solo-filled"].includes(e.variant) && h.value && r(en, {
        key: "floating-label",
        ref: w,
        class: [V.value],
        floating: !0,
        for: b.value
      }, {
        default: () => [J]
      }), r(en, {
        ref: p,
        for: b.value
      }, {
        default: () => [J]
      }), (Q = l.default) == null ? void 0 : Q.call(l, {
        ...q.value,
        props: {
          id: b.value,
          class: "v-field__input",
          "aria-describedby": S.value
        },
        focus: c,
        blur: f
      })]), $ && r(Il, {
        key: "clear"
      }, {
        default: () => [be(r("div", {
          class: "v-field__clearable",
          onMousedown: (L) => {
            L.preventDefault(), L.stopPropagation();
          }
        }, [l.clear ? l.clear() : r(d, {
          name: "clear"
        }, null)]), [[dt, e.dirty]])]
      }), W && r("div", {
        key: "append",
        class: "v-field__append-inner"
      }, [(T = l["append-inner"]) == null ? void 0 : T.call(l, q.value), e.appendInnerIcon && r(d, {
        key: "append-icon",
        name: "appendInner"
      }, null)]), r("div", {
        class: ["v-field__outline", V.value]
      }, [k && r(ue, null, [r("div", {
        class: "v-field__outline__start"
      }, null), h.value && r("div", {
        class: "v-field__outline__notch"
      }, [r(en, {
        ref: w,
        floating: !0,
        for: b.value
      }, {
        default: () => [J]
      })]), r("div", {
        class: "v-field__outline__end"
      }, null)]), E.value && h.value && r(en, {
        ref: w,
        floating: !0,
        for: b.value
      }, {
        default: () => [J]
      })])]);
    }), {
      controlRef: I
    };
  }
});
function So(e) {
  const n = Object.keys(Ia.props).filter((t) => !ra(t) && t !== "class" && t !== "style");
  return $t(e, n);
}
const sr = ["color", "file", "time", "date", "datetime-local", "week", "month"], xo = B({
  autofocus: Boolean,
  counter: [Boolean, Number, String],
  counterValue: Function,
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  suffix: String,
  type: {
    type: String,
    default: "text"
  },
  modelModifiers: Object,
  ...wn(),
  ..._a()
}, "VTextField"), mn = z()({
  name: "VTextField",
  directives: {
    Intersect: Pl
  },
  inheritAttrs: !1,
  props: xo(),
  emits: {
    "click:control": (e) => !0,
    "mousedown:control": (e) => !0,
    "update:focused": (e) => !0,
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      attrs: t,
      emit: a,
      slots: l
    } = n;
    const o = ce(e, "modelValue"), {
      isFocused: i,
      focus: s,
      blur: u
    } = An(e), c = g(() => typeof e.counterValue == "function" ? e.counterValue(o.value) : (o.value ?? "").toString().length), f = g(() => {
      if (t.maxlength)
        return t.maxlength;
      if (!(!e.counter || typeof e.counter != "number" && typeof e.counter != "string"))
        return e.counter;
    }), d = g(() => ["plain", "underlined"].includes(e.variant));
    function v(E, O) {
      var _, V;
      !e.autofocus || !E || (V = (_ = O[0].target) == null ? void 0 : _.focus) == null || V.call(_);
    }
    const m = A(), y = A(), h = A(), C = g(() => sr.includes(e.type) || e.persistentPlaceholder || i.value || e.active);
    function b() {
      var E;
      h.value !== document.activeElement && ((E = h.value) == null || E.focus()), i.value || s();
    }
    function S(E) {
      a("mousedown:control", E), E.target !== h.value && (b(), E.preventDefault());
    }
    function p(E) {
      b(), a("click:control", E);
    }
    function w(E) {
      E.stopPropagation(), b(), Se(() => {
        o.value = null, pl(e["onClick:clear"], E);
      });
    }
    function I(E) {
      var _;
      const O = E.target;
      if (o.value = O.value, (_ = e.modelModifiers) != null && _.trim && ["text", "search", "password", "tel", "url"].includes(e.type)) {
        const V = [O.selectionStart, O.selectionEnd];
        Se(() => {
          O.selectionStart = V[0], O.selectionEnd = V[1];
        });
      }
    }
    return K(() => {
      const E = !!(l.counter || e.counter || e.counterValue), O = !!(E || l.details), [_, V] = bn(t), [{
        modelValue: D,
        ...q
      }] = St.filterProps(e), [N] = So(e);
      return r(St, U({
        ref: m,
        modelValue: o.value,
        "onUpdate:modelValue": (k) => o.value = k,
        class: ["v-text-field", {
          "v-text-field--prefixed": e.prefix,
          "v-text-field--suffixed": e.suffix,
          "v-text-field--plain-underlined": ["plain", "underlined"].includes(e.variant)
        }, e.class],
        style: e.style
      }, _, q, {
        centerAffix: !d.value,
        focused: i.value
      }), {
        ...l,
        default: (k) => {
          let {
            id: P,
            isDisabled: $,
            isDirty: W,
            isReadonly: J,
            isValid: R
          } = k;
          return r(Ia, U({
            ref: y,
            onMousedown: S,
            onClick: p,
            "onClick:clear": w,
            "onClick:prependInner": e["onClick:prependInner"],
            "onClick:appendInner": e["onClick:appendInner"],
            role: "textbox"
          }, N, {
            id: P.value,
            active: C.value || W.value,
            dirty: W.value || e.dirty,
            disabled: $.value,
            focused: i.value,
            error: R.value === !1
          }), {
            ...l,
            default: (Q) => {
              let {
                props: {
                  class: T,
                  ...L
                }
              } = Q;
              const re = be(r("input", U({
                ref: h,
                value: o.value,
                onInput: I,
                autofocus: e.autofocus,
                readonly: J.value,
                disabled: $.value,
                name: e.name,
                placeholder: e.placeholder,
                size: 1,
                type: e.type,
                onFocus: b,
                onBlur: u
              }, L, V), null), [[Me("intersect"), {
                handler: v
              }, null, {
                once: !0
              }]]);
              return r(ue, null, [e.prefix && r("span", {
                class: "v-text-field__prefix"
              }, [e.prefix]), l.default ? r("div", {
                class: T,
                "data-no-activator": ""
              }, [l.default(), re]) : Jo(re, {
                class: T
              }), e.suffix && r("span", {
                class: "v-text-field__suffix"
              }, [e.suffix])]);
            }
          });
        },
        details: O ? (k) => {
          var P;
          return r(ue, null, [(P = l.details) == null ? void 0 : P.call(l, k), E && r(ue, null, [r("span", null, null), r(po, {
            active: e.persistentCounter || i.value,
            value: c.value,
            max: f.value
          }, l.counter)])]);
        } : void 0
      });
    }), mt({}, m, y, h);
  }
}), rr = B({
  chips: Boolean,
  closableChips: Boolean,
  eager: Boolean,
  hideNoData: Boolean,
  hideSelected: Boolean,
  menu: Boolean,
  menuIcon: {
    type: le,
    default: "$dropdown"
  },
  menuProps: {
    type: Object
  },
  multiple: Boolean,
  noDataText: {
    type: String,
    default: "$vuetify.noDataText"
  },
  openOnClear: Boolean,
  valueComparator: {
    type: Function,
    default: Vt
  },
  ...uo({
    itemChildren: !1
  })
}, "Select"), ur = B({
  ...rr(),
  ...hn(xo({
    modelValue: null
  }), ["validationValue", "dirty", "appendInnerIcon"]),
  ...qt({
    transition: {
      component: ya
    }
  })
}, "VSelect"), cr = z()({
  name: "VSelect",
  props: ur(),
  emits: {
    "update:focused": (e) => !0,
    "update:modelValue": (e) => !0,
    "update:menu": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      t: a
    } = _t(), l = A(), o = A(), i = ce(e, "menu"), s = g({
      get: () => i.value,
      set: (k) => {
        var P;
        i.value && !k && ((P = o.value) != null && P.ΨopenChildren) || (i.value = k);
      }
    }), {
      items: u,
      transformIn: c,
      transformOut: f
    } = ws(e), d = ce(e, "modelValue", [], (k) => c(k === null ? [null] : je(k)), (k) => {
      const P = f(k);
      return e.multiple ? P : P[0] ?? null;
    }), v = eo(), m = g(() => d.value.map((k) => u.value.find((P) => e.valueComparator(P.value, k.value)) || k)), y = g(() => m.value.map((k) => k.props.value)), h = te(!1);
    let C = "", b;
    const S = g(() => e.hideSelected ? u.value.filter((k) => !m.value.some((P) => P === k)) : u.value), p = g(() => e.hideNoData && !u.value.length || e.readonly || (v == null ? void 0 : v.isReadonly.value)), w = A();
    function I(k) {
      e.openOnClear && (s.value = !0);
    }
    function E() {
      p.value || (s.value = !s.value);
    }
    function O(k) {
      var R, Q;
      if (e.readonly || v != null && v.isReadonly.value)
        return;
      ["Enter", " ", "ArrowDown", "ArrowUp", "Home", "End"].includes(k.key) && k.preventDefault(), ["Enter", "ArrowDown", " "].includes(k.key) && (s.value = !0), ["Escape", "Tab"].includes(k.key) && (s.value = !1), k.key === "Home" ? (R = w.value) == null || R.focus("first") : k.key === "End" && ((Q = w.value) == null || Q.focus("last"));
      const P = 1e3;
      function $(T) {
        const L = T.key.length === 1, re = !T.ctrlKey && !T.metaKey && !T.altKey;
        return L && re;
      }
      if (e.multiple || !$(k))
        return;
      const W = performance.now();
      W - b > P && (C = ""), C += k.key.toLowerCase(), b = W;
      const J = u.value.find((T) => T.title.toLowerCase().startsWith(C));
      J !== void 0 && (d.value = [J]);
    }
    function _(k) {
      var P;
      k.key === "Tab" && ((P = l.value) == null || P.focus());
    }
    function V(k) {
      if (e.multiple) {
        const P = y.value.findIndex(($) => e.valueComparator($, k.value));
        if (P === -1)
          d.value = [...d.value, k];
        else {
          const $ = [...d.value];
          $.splice(P, 1), d.value = $;
        }
      } else
        d.value = [k], s.value = !1;
    }
    function D(k) {
      var P;
      (P = w.value) != null && P.$el.contains(k.relatedTarget) || (s.value = !1);
    }
    function q() {
      var k;
      h.value && ((k = l.value) == null || k.focus());
    }
    function N(k) {
      h.value = !0;
    }
    return K(() => {
      const k = !!(e.chips || t.chip), P = !!(!e.hideNoData || S.value.length || t["prepend-item"] || t["append-item"] || t["no-data"]), $ = d.value.length > 0, [W] = mn.filterProps(e), J = $ || !h.value && e.label && !e.persistentPlaceholder ? void 0 : e.placeholder;
      return r(mn, U({
        ref: l
      }, W, {
        modelValue: d.value.map((R) => R.props.value).join(", "),
        "onUpdate:modelValue": (R) => {
          R == null && (d.value = []);
        },
        focused: h.value,
        "onUpdate:focused": (R) => h.value = R,
        validationValue: d.externalValue,
        dirty: $,
        class: ["v-select", {
          "v-select--active-menu": s.value,
          "v-select--chips": !!e.chips,
          [`v-select--${e.multiple ? "multiple" : "single"}`]: !0,
          "v-select--selected": d.value.length,
          "v-select--selection-slot": !!t.selection
        }, e.class],
        style: e.style,
        readonly: !0,
        placeholder: J,
        "onClick:clear": I,
        "onMousedown:control": E,
        onBlur: D,
        onKeydown: O
      }), {
        ...t,
        default: () => r(ue, null, [r(ar, U({
          ref: o,
          modelValue: s.value,
          "onUpdate:modelValue": (R) => s.value = R,
          activator: "parent",
          contentClass: "v-select__content",
          disabled: p.value,
          eager: e.eager,
          maxHeight: 310,
          openOnClick: !1,
          closeOnContentClick: !1,
          transition: e.transition,
          onAfterLeave: q
        }, e.menuProps), {
          default: () => [P && r(Es, {
            ref: w,
            selected: y.value,
            selectStrategy: e.multiple ? "independent" : "single-independent",
            onMousedown: (R) => R.preventDefault(),
            onKeydown: _,
            onFocusin: N,
            tabindex: "-1"
          }, {
            default: () => {
              var R, Q, T;
              return [(R = t["prepend-item"]) == null ? void 0 : R.call(t), !S.value.length && !e.hideNoData && (((Q = t["no-data"]) == null ? void 0 : Q.call(t)) ?? r(fn, {
                title: a(e.noDataText)
              }, null)), S.value.map((L, re) => {
                var ke;
                const ve = U(L.props, {
                  key: re,
                  onClick: () => V(L)
                });
                return ((ke = t.item) == null ? void 0 : ke.call(t, {
                  item: L,
                  index: re,
                  props: ve
                })) ?? r(fn, ve, {
                  prepend: (Te) => {
                    let {
                      isSelected: ie
                    } = Te;
                    return r(ue, null, [e.multiple && !e.hideSelected ? r(Wi, {
                      key: L.value,
                      modelValue: ie,
                      ripple: !1,
                      tabindex: "-1"
                    }, null) : void 0, L.props.prependIcon && r(oe, {
                      icon: L.props.prependIcon
                    }, null)]);
                  }
                });
              }), (T = t["append-item"]) == null ? void 0 : T.call(t)];
            }
          })]
        }), m.value.map((R, Q) => {
          var re;
          function T(ve) {
            ve.stopPropagation(), ve.preventDefault(), V(R);
          }
          const L = {
            "onClick:close": T,
            onMousedown(ve) {
              ve.preventDefault(), ve.stopPropagation();
            },
            modelValue: !0,
            "onUpdate:modelValue": void 0
          };
          return r("div", {
            key: R.value,
            class: "v-select__selection"
          }, [k ? t.chip ? r(me, {
            key: "chip-defaults",
            defaults: {
              VChip: {
                closable: e.closableChips,
                size: "small",
                text: R.title
              }
            }
          }, {
            default: () => {
              var ve;
              return [(ve = t.chip) == null ? void 0 : ve.call(t, {
                item: R,
                index: Q,
                props: L
              })];
            }
          }) : r(wa, U({
            key: "chip",
            closable: e.closableChips,
            size: "small",
            text: R.title
          }, L), null) : ((re = t.selection) == null ? void 0 : re.call(t, {
            item: R,
            index: Q
          })) ?? r("span", {
            class: "v-select__selection-text"
          }, [R.title, e.multiple && Q < m.value.length - 1 && r("span", {
            class: "v-select__selection-comma"
          }, [H(",")])])]);
        })]),
        "append-inner": function() {
          var L;
          for (var R = arguments.length, Q = new Array(R), T = 0; T < R; T++)
            Q[T] = arguments[T];
          return r(ue, null, [(L = t["append-inner"]) == null ? void 0 : L.call(t, ...Q), e.menuIcon ? r(oe, {
            class: "v-select__menu-icon",
            icon: e.menuIcon
          }, null) : void 0]);
        }
      });
    }), mt({
      isFocused: h,
      menu: s,
      select: V
    }, l);
  }
});
const dr = B({
  color: String,
  density: String,
  ...Z()
}, "VBannerActions"), fr = z()({
  name: "VBannerActions",
  props: dr(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    return Oe({
      VBtn: {
        color: e.color,
        density: e.density,
        variant: "text"
      }
    }), K(() => {
      var a;
      return r("div", {
        class: ["v-banner-actions", e.class],
        style: e.style
      }, [(a = t.default) == null ? void 0 : a.call(t)]);
    }), {};
  }
}), Xn = vt("v-banner-text"), vr = B({
  avatar: String,
  color: String,
  icon: le,
  lines: String,
  stacked: Boolean,
  sticky: Boolean,
  text: String,
  ...et(),
  ...Z(),
  ...we(),
  ...$e(),
  ...qe(),
  ...Et(),
  ...Kt(),
  ...Be(),
  ...de(),
  ...ge()
}, "VBanner"), al = z()({
  name: "VBanner",
  props: vr(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      borderClasses: a
    } = tt(e), {
      densityClasses: l
    } = Pe(e), {
      mobile: o
    } = Va(), {
      dimensionStyles: i
    } = Qe(e), {
      elevationClasses: s
    } = He(e), {
      locationStyles: u
    } = Pt(e), {
      positionClasses: c
    } = Yt(e), {
      roundedClasses: f
    } = Ee(e), {
      themeClasses: d
    } = ye(e), v = j(e, "color"), m = j(e, "density");
    Oe({
      VBannerActions: {
        color: v,
        density: m
      }
    }), K(() => {
      const y = !!(e.text || t.text), h = !!(e.avatar || e.icon), C = !!(h || t.prepend);
      return r(e.tag, {
        class: ["v-banner", {
          "v-banner--stacked": e.stacked || o.value,
          "v-banner--sticky": e.sticky,
          [`v-banner--${e.lines}-line`]: !!e.lines
        }, a.value, l.value, s.value, c.value, f.value, d.value, e.class],
        style: [i.value, u.value, e.style],
        role: "banner"
      }, {
        default: () => {
          var b;
          return [C && r("div", {
            key: "prepend",
            class: "v-banner__prepend"
          }, [t.prepend ? r(me, {
            key: "prepend-defaults",
            disabled: !h,
            defaults: {
              VAvatar: {
                color: v.value,
                density: m.value,
                icon: e.icon,
                image: e.avatar
              }
            }
          }, t.prepend) : r(Ze, {
            key: "prepend-avatar",
            color: v.value,
            density: m.value,
            icon: e.icon,
            image: e.avatar
          }, null)]), r("div", {
            class: "v-banner__content"
          }, [y && r(Xn, {
            key: "text"
          }, {
            default: () => {
              var S;
              return [((S = t.text) == null ? void 0 : S.call(t)) ?? e.text];
            }
          }), (b = t.default) == null ? void 0 : b.call(t)]), t.actions && r(fr, {
            key: "actions"
          }, t.actions)];
        }
      });
    });
  }
});
const mr = B({
  divider: [Number, String],
  ...Z()
}, "VBreadcrumbsDivider"), Ao = z()({
  name: "VBreadcrumbsDivider",
  props: mr(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    return K(() => {
      var a;
      return r("li", {
        class: ["v-breadcrumbs-divider", e.class],
        style: e.style
      }, [((a = t == null ? void 0 : t.default) == null ? void 0 : a.call(t)) ?? e.divider]);
    }), {};
  }
}), gr = B({
  active: Boolean,
  activeClass: String,
  activeColor: String,
  color: String,
  disabled: Boolean,
  title: String,
  ...Z(),
  ...Zt(),
  ...de({
    tag: "li"
  })
}, "VBreadcrumbsItem"), wo = z()({
  name: "VBreadcrumbsItem",
  props: gr(),
  setup(e, n) {
    let {
      slots: t,
      attrs: a
    } = n;
    const l = Wt(e, a), o = g(() => {
      var c;
      return e.active || ((c = l.isActive) == null ? void 0 : c.value);
    }), i = g(() => o.value ? e.activeColor : e.color), {
      textColorClasses: s,
      textColorStyles: u
    } = Re(i);
    return K(() => {
      const c = l.isLink.value ? "a" : e.tag;
      return r(c, {
        class: ["v-breadcrumbs-item", {
          "v-breadcrumbs-item--active": o.value,
          "v-breadcrumbs-item--disabled": e.disabled,
          "v-breadcrumbs-item--link": l.isLink.value,
          [`${e.activeClass}`]: o.value && e.activeClass
        }, s.value, e.class],
        style: [u.value, e.style],
        href: l.href.value,
        "aria-current": o.value ? "page" : void 0,
        onClick: l.navigate
      }, {
        default: () => {
          var f;
          return [((f = t.default) == null ? void 0 : f.call(t)) ?? e.title];
        }
      });
    }), {};
  }
}), yr = B({
  activeClass: String,
  activeColor: String,
  bgColor: String,
  color: String,
  disabled: Boolean,
  divider: {
    type: String,
    default: "/"
  },
  icon: le,
  items: {
    type: Array,
    default: () => []
  },
  ...Z(),
  ...we(),
  ...Be(),
  ...de({
    tag: "ul"
  })
}, "VBreadcrumbs"), hr = z()({
  name: "VBreadcrumbs",
  props: yr(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      backgroundColorClasses: a,
      backgroundColorStyles: l
    } = We(j(e, "bgColor")), {
      densityClasses: o
    } = Pe(e), {
      roundedClasses: i
    } = Ee(e);
    Oe({
      VBreadcrumbsDivider: {
        divider: j(e, "divider")
      },
      VBreadcrumbsItem: {
        activeClass: j(e, "activeClass"),
        activeColor: j(e, "activeColor"),
        color: j(e, "color"),
        disabled: j(e, "disabled")
      }
    });
    const s = g(() => e.items.map((u) => typeof u == "string" ? {
      item: {
        title: u
      },
      raw: u
    } : {
      item: u,
      raw: u
    }));
    return K(() => {
      const u = !!(t.prepend || e.icon);
      return r(e.tag, {
        class: ["v-breadcrumbs", a.value, o.value, i.value, e.class],
        style: [l.value, e.style]
      }, {
        default: () => {
          var c;
          return [u && r("div", {
            key: "prepend",
            class: "v-breadcrumbs__prepend"
          }, [t.prepend ? r(me, {
            key: "prepend-defaults",
            disabled: !e.icon,
            defaults: {
              VIcon: {
                icon: e.icon,
                start: !0
              }
            }
          }, t.prepend) : r(oe, {
            key: "prepend-icon",
            start: !0,
            icon: e.icon
          }, null)]), s.value.map((f, d, v) => {
            let {
              item: m,
              raw: y
            } = f;
            return r(ue, null, [r(wo, U({
              key: m.title,
              disabled: d >= v.length - 1
            }, m), {
              default: t.title ? () => {
                var h;
                return (h = t.title) == null ? void 0 : h.call(t, {
                  item: y,
                  index: d
                });
              } : void 0
            }), d < v.length - 1 && r(Ao, null, {
              default: t.divider ? () => {
                var h;
                return (h = t.divider) == null ? void 0 : h.call(t, {
                  item: y,
                  index: d
                });
              } : void 0
            })]);
          }), (c = t.default) == null ? void 0 : c.call(t)];
        }
      });
    }), {};
  }
});
const gt = z()({
  name: "VCardActions",
  props: Z(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    return Oe({
      VBtn: {
        variant: "text"
      }
    }), K(() => {
      var a;
      return r("div", {
        class: ["v-card-actions", e.class],
        style: e.style
      }, [(a = t.default) == null ? void 0 : a.call(t)]);
    }), {};
  }
}), br = vt("v-card-subtitle"), Ke = vt("v-card-title"), Cr = B({
  appendAvatar: String,
  appendIcon: le,
  prependAvatar: String,
  prependIcon: le,
  subtitle: String,
  title: String,
  ...Z(),
  ...we()
}, "VCardItem"), pr = z()({
  name: "VCardItem",
  props: Cr(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    return K(() => {
      var c;
      const a = !!(e.prependAvatar || e.prependIcon), l = !!(a || t.prepend), o = !!(e.appendAvatar || e.appendIcon), i = !!(o || t.append), s = !!(e.title || t.title), u = !!(e.subtitle || t.subtitle);
      return r("div", {
        class: ["v-card-item", e.class],
        style: e.style
      }, [l && r("div", {
        key: "prepend",
        class: "v-card-item__prepend"
      }, [t.prepend ? r(me, {
        key: "prepend-defaults",
        disabled: !a,
        defaults: {
          VAvatar: {
            density: e.density,
            icon: e.prependIcon,
            image: e.prependAvatar
          }
        }
      }, t.prepend) : a && r(Ze, {
        key: "prepend-avatar",
        density: e.density,
        icon: e.prependIcon,
        image: e.prependAvatar
      }, null)]), r("div", {
        class: "v-card-item__content"
      }, [s && r(Ke, {
        key: "title"
      }, {
        default: () => {
          var f;
          return [((f = t.title) == null ? void 0 : f.call(t)) ?? e.title];
        }
      }), u && r(br, {
        key: "subtitle"
      }, {
        default: () => {
          var f;
          return [((f = t.subtitle) == null ? void 0 : f.call(t)) ?? e.subtitle];
        }
      }), (c = t.default) == null ? void 0 : c.call(t)]), i && r("div", {
        key: "append",
        class: "v-card-item__append"
      }, [t.append ? r(me, {
        key: "append-defaults",
        disabled: !o,
        defaults: {
          VAvatar: {
            density: e.density,
            icon: e.appendIcon,
            image: e.appendAvatar
          }
        }
      }, t.append) : o && r(Ze, {
        key: "append-avatar",
        density: e.density,
        icon: e.appendIcon,
        image: e.appendAvatar
      }, null)])]);
    }), {};
  }
}), nt = vt("v-card-text"), Sr = B({
  appendAvatar: String,
  appendIcon: le,
  disabled: Boolean,
  flat: Boolean,
  hover: Boolean,
  image: String,
  link: {
    type: Boolean,
    default: void 0
  },
  prependAvatar: String,
  prependIcon: le,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  subtitle: String,
  text: String,
  title: String,
  ...et(),
  ...Z(),
  ...we(),
  ...$e(),
  ...qe(),
  ...Sa(),
  ...Et(),
  ...Kt(),
  ...Be(),
  ...Zt(),
  ...de(),
  ...ge(),
  ...Ge({
    variant: "elevated"
  })
}, "VCard"), Ye = z()({
  name: "VCard",
  directives: {
    Ripple: Jt
  },
  props: Sr(),
  setup(e, n) {
    let {
      attrs: t,
      slots: a
    } = n;
    const {
      themeClasses: l
    } = ye(e), {
      borderClasses: o
    } = tt(e), {
      colorClasses: i,
      colorStyles: s,
      variantClasses: u
    } = Bt(e), {
      densityClasses: c
    } = Pe(e), {
      dimensionStyles: f
    } = Qe(e), {
      elevationClasses: d
    } = He(e), {
      loaderClasses: v
    } = xn(e), {
      locationStyles: m
    } = Pt(e), {
      positionClasses: y
    } = Yt(e), {
      roundedClasses: h
    } = Ee(e), C = Wt(e, t), b = g(() => e.link !== !1 && C.isLink.value), S = g(() => !e.disabled && e.link !== !1 && (e.link || C.isClickable.value));
    return K(() => {
      const p = b.value ? "a" : e.tag, w = !!(a.title || e.title), I = !!(a.subtitle || e.subtitle), E = w || I, O = !!(a.append || e.appendAvatar || e.appendIcon), _ = !!(a.prepend || e.prependAvatar || e.prependIcon), V = !!(a.image || e.image), D = E || _ || O, q = !!(a.text || e.text);
      return be(r(p, {
        class: ["v-card", {
          "v-card--disabled": e.disabled,
          "v-card--flat": e.flat,
          "v-card--hover": e.hover && !(e.disabled || e.flat),
          "v-card--link": S.value
        }, l.value, o.value, i.value, c.value, d.value, v.value, y.value, h.value, u.value, e.class],
        style: [s.value, f.value, m.value, e.style],
        href: C.href.value,
        onClick: S.value && C.navigate,
        tabindex: e.disabled ? -1 : void 0
      }, {
        default: () => {
          var N;
          return [V && r("div", {
            key: "image",
            class: "v-card__image"
          }, [a.image ? r(me, {
            key: "image-defaults",
            disabled: !e.image,
            defaults: {
              VImg: {
                cover: !0,
                src: e.image
              }
            }
          }, a.image) : r(Tl, {
            key: "image-img",
            cover: !0,
            src: e.image
          }, null)]), r(xa, {
            name: "v-card",
            active: !!e.loading,
            color: typeof e.loading == "boolean" ? void 0 : e.loading
          }, {
            default: a.loader
          }), D && r(pr, {
            key: "item",
            prependAvatar: e.prependAvatar,
            prependIcon: e.prependIcon,
            title: e.title,
            subtitle: e.subtitle,
            appendAvatar: e.appendAvatar,
            appendIcon: e.appendIcon
          }, {
            default: a.item,
            prepend: a.prepend,
            title: a.title,
            subtitle: a.subtitle,
            append: a.append
          }), q && r(nt, {
            key: "text"
          }, {
            default: () => {
              var k;
              return [((k = a.text) == null ? void 0 : k.call(a)) ?? e.text];
            }
          }), (N = a.default) == null ? void 0 : N.call(a), a.actions && r(gt, null, {
            default: a.actions
          }), It(S.value, "v-card")];
        }
      }), [[Me("ripple"), S.value && e.ripple]]);
    }), {};
  }
});
const xr = (e) => {
  const {
    touchstartX: n,
    touchendX: t,
    touchstartY: a,
    touchendY: l
  } = e, o = 0.5, i = 16;
  e.offsetX = t - n, e.offsetY = l - a, Math.abs(e.offsetY) < o * Math.abs(e.offsetX) && (e.left && t < n - i && e.left(e), e.right && t > n + i && e.right(e)), Math.abs(e.offsetX) < o * Math.abs(e.offsetY) && (e.up && l < a - i && e.up(e), e.down && l > a + i && e.down(e));
};
function Ar(e, n) {
  var a;
  const t = e.changedTouches[0];
  n.touchstartX = t.clientX, n.touchstartY = t.clientY, (a = n.start) == null || a.call(n, {
    originalEvent: e,
    ...n
  });
}
function wr(e, n) {
  var a;
  const t = e.changedTouches[0];
  n.touchendX = t.clientX, n.touchendY = t.clientY, (a = n.end) == null || a.call(n, {
    originalEvent: e,
    ...n
  }), xr(n);
}
function kr(e, n) {
  var a;
  const t = e.changedTouches[0];
  n.touchmoveX = t.clientX, n.touchmoveY = t.clientY, (a = n.move) == null || a.call(n, {
    originalEvent: e,
    ...n
  });
}
function Vr() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const n = {
    touchstartX: 0,
    touchstartY: 0,
    touchendX: 0,
    touchendY: 0,
    touchmoveX: 0,
    touchmoveY: 0,
    offsetX: 0,
    offsetY: 0,
    left: e.left,
    right: e.right,
    up: e.up,
    down: e.down,
    start: e.start,
    move: e.move,
    end: e.end
  };
  return {
    touchstart: (t) => Ar(t, n),
    touchend: (t) => wr(t, n),
    touchmove: (t) => kr(t, n)
  };
}
function _r(e, n) {
  var s;
  const t = n.value, a = t != null && t.parent ? e.parentElement : e, l = (t == null ? void 0 : t.options) ?? {
    passive: !0
  }, o = (s = n.instance) == null ? void 0 : s.$.uid;
  if (!a || !o)
    return;
  const i = Vr(n.value);
  a._touchHandlers = a._touchHandlers ?? /* @__PURE__ */ Object.create(null), a._touchHandlers[o] = i, hl(i).forEach((u) => {
    a.addEventListener(u, i[u], l);
  });
}
function Ir(e, n) {
  var o, i;
  const t = (o = n.value) != null && o.parent ? e.parentElement : e, a = (i = n.instance) == null ? void 0 : i.$.uid;
  if (!(t != null && t._touchHandlers) || !a)
    return;
  const l = t._touchHandlers[a];
  hl(l).forEach((s) => {
    t.removeEventListener(s, l[s]);
  }), delete t._touchHandlers[a];
}
const ko = {
  mounted: _r,
  unmounted: Ir
}, Br = ko, Vo = Symbol.for("vuetify:v-window"), _o = Symbol.for("vuetify:v-window-group"), Er = B({
  continuous: Boolean,
  nextIcon: {
    type: [Boolean, String, Function, Object],
    default: "$next"
  },
  prevIcon: {
    type: [Boolean, String, Function, Object],
    default: "$prev"
  },
  reverse: Boolean,
  showArrows: {
    type: [Boolean, String],
    validator: (e) => typeof e == "boolean" || e === "hover"
  },
  touch: {
    type: [Object, Boolean],
    default: void 0
  },
  direction: {
    type: String,
    default: "horizontal"
  },
  modelValue: null,
  disabled: Boolean,
  selectedClass: {
    type: String,
    default: "v-window-item--active"
  },
  // TODO: mandatory should probably not be exposed but do this for now
  mandatory: {
    default: "force"
  },
  ...Z(),
  ...de(),
  ...ge()
}, "VWindow"), Pr = z()({
  name: "VWindow",
  directives: {
    Touch: ko
  },
  props: Er(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      themeClasses: a
    } = ye(e), {
      isRtl: l
    } = Xe(), {
      t: o
    } = _t(), i = Cn(e, _o), s = A(), u = g(() => l.value ? !e.reverse : e.reverse), c = te(!1), f = g(() => {
      const w = e.direction === "vertical" ? "y" : "x", E = (u.value ? !c.value : c.value) ? "-reverse" : "";
      return `v-window-${w}${E}-transition`;
    }), d = te(0), v = A(void 0), m = g(() => i.items.value.findIndex((w) => i.selected.value.includes(w.id)));
    ae(m, (w, I) => {
      const E = i.items.value.length, O = E - 1;
      E <= 2 ? c.value = w < I : w === O && I === 0 ? c.value = !0 : w === 0 && I === O ? c.value = !1 : c.value = w < I;
    }), xe(Vo, {
      transition: f,
      isReversed: c,
      transitionCount: d,
      transitionHeight: v,
      rootRef: s
    });
    const y = g(() => e.continuous || m.value !== 0), h = g(() => e.continuous || m.value !== i.items.value.length - 1);
    function C() {
      y.value && i.prev();
    }
    function b() {
      h.value && i.next();
    }
    const S = g(() => {
      const w = [], I = {
        icon: l.value ? e.nextIcon : e.prevIcon,
        class: `v-window__${u.value ? "right" : "left"}`,
        onClick: i.prev,
        ariaLabel: o("$vuetify.carousel.prev")
      };
      w.push(y.value ? t.prev ? t.prev({
        props: I
      }) : r(Y, I, null) : r("div", null, null));
      const E = {
        icon: l.value ? e.prevIcon : e.nextIcon,
        class: `v-window__${u.value ? "left" : "right"}`,
        onClick: i.next,
        ariaLabel: o("$vuetify.carousel.next")
      };
      return w.push(h.value ? t.next ? t.next({
        props: E
      }) : r(Y, E, null) : r("div", null, null)), w;
    }), p = g(() => e.touch === !1 ? e.touch : {
      ...{
        left: () => {
          u.value ? C() : b();
        },
        right: () => {
          u.value ? b() : C();
        },
        start: (I) => {
          let {
            originalEvent: E
          } = I;
          E.stopPropagation();
        }
      },
      ...e.touch === !0 ? {} : e.touch
    });
    return K(() => be(r(e.tag, {
      ref: s,
      class: ["v-window", {
        "v-window--show-arrows-on-hover": e.showArrows === "hover"
      }, a.value, e.class],
      style: e.style
    }, {
      default: () => {
        var w, I;
        return [r("div", {
          class: "v-window__container",
          style: {
            height: v.value
          }
        }, [(w = t.default) == null ? void 0 : w.call(t, {
          group: i
        }), e.showArrows !== !1 && r("div", {
          class: "v-window__controls"
        }, [S.value])]), (I = t.additional) == null ? void 0 : I.call(t, {
          group: i
        })];
      }
    }), [[Me("touch"), p.value]])), {
      group: i
    };
  }
}), Tr = B({
  reverseTransition: {
    type: [Boolean, String],
    default: void 0
  },
  transition: {
    type: [Boolean, String],
    default: void 0
  },
  ...Z(),
  ...Ca(),
  ...yo()
}, "VWindowItem"), ll = z()({
  name: "VWindowItem",
  directives: {
    Touch: Br
  },
  props: Tr(),
  emits: {
    "group:selected": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = se(Vo), l = pa(e, _o), {
      isBooted: o
    } = Rl();
    if (!a || !l)
      throw new Error("[Vuetify] VWindowItem must be used inside VWindow");
    const i = te(!1), s = g(() => o.value && (a.isReversed.value ? e.reverseTransition !== !1 : e.transition !== !1));
    function u() {
      !i.value || !a || (i.value = !1, a.transitionCount.value > 0 && (a.transitionCount.value -= 1, a.transitionCount.value === 0 && (a.transitionHeight.value = void 0)));
    }
    function c() {
      var y;
      i.value || !a || (i.value = !0, a.transitionCount.value === 0 && (a.transitionHeight.value = ee((y = a.rootRef.value) == null ? void 0 : y.clientHeight)), a.transitionCount.value += 1);
    }
    function f() {
      u();
    }
    function d(y) {
      i.value && Se(() => {
        !s.value || !i.value || !a || (a.transitionHeight.value = ee(y.clientHeight));
      });
    }
    const v = g(() => {
      const y = a.isReversed.value ? e.reverseTransition : e.transition;
      return s.value ? {
        name: typeof y != "string" ? a.transition.value : y,
        onBeforeEnter: c,
        onAfterEnter: u,
        onEnterCancelled: f,
        onBeforeLeave: c,
        onAfterLeave: u,
        onLeaveCancelled: f,
        onEnter: d
      } : !1;
    }), {
      hasContent: m
    } = ho(e, l.isSelected);
    return K(() => r(ze, {
      transition: v.value,
      disabled: !o.value
    }, {
      default: () => {
        var y;
        return [be(r("div", {
          class: ["v-window-item", l.selectedClass.value, e.class],
          style: e.style
        }, [m.value && ((y = t.default) == null ? void 0 : y.call(t))]), [[dt, l.isSelected.value]])];
      }
    })), {};
  }
});
const Rr = B({
  color: String,
  ...et(),
  ...Z(),
  ...$e(),
  ...qe(),
  ...Et(),
  ...Kt(),
  ...Be(),
  ...de(),
  ...ge()
}, "VSheet"), Or = z()({
  name: "VSheet",
  props: Rr(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      themeClasses: a
    } = ye(e), {
      backgroundColorClasses: l,
      backgroundColorStyles: o
    } = We(j(e, "color")), {
      borderClasses: i
    } = tt(e), {
      dimensionStyles: s
    } = Qe(e), {
      elevationClasses: u
    } = He(e), {
      locationStyles: c
    } = Pt(e), {
      positionClasses: f
    } = Yt(e), {
      roundedClasses: d
    } = Ee(e);
    return K(() => r(e.tag, {
      class: ["v-sheet", a.value, l.value, i.value, u.value, f.value, d.value, e.class],
      style: [o.value, s.value, c.value, e.style]
    }, t)), {};
  }
});
const Dr = B({
  fullscreen: Boolean,
  retainFocus: {
    type: Boolean,
    default: !0
  },
  scrollable: Boolean,
  ..._n({
    origin: "center center",
    scrollStrategy: "block",
    transition: {
      component: ya
    },
    zIndex: 2400
  })
}, "VDialog"), at = z()({
  name: "VDialog",
  props: Dr(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = ce(e, "modelValue"), {
      scopeId: l
    } = Vn(), o = A();
    function i(u) {
      var d, v;
      const c = u.relatedTarget, f = u.target;
      if (c !== f && ((d = o.value) != null && d.contentEl) && // We're the topmost dialog
      ((v = o.value) != null && v.globalTop) && // It isn't the document or the dialog body
      ![document, o.value.contentEl].includes(f) && // It isn't inside the dialog body
      !o.value.contentEl.contains(f)) {
        const m = ua(o.value.contentEl);
        if (!m.length)
          return;
        const y = m[0], h = m[m.length - 1];
        c === y ? h.focus() : y.focus();
      }
    }
    _e && ae(() => a.value && e.retainFocus, (u) => {
      u ? document.addEventListener("focusin", i) : document.removeEventListener("focusin", i);
    }, {
      immediate: !0
    }), ae(a, async (u) => {
      var c, f;
      await Se(), u ? (c = o.value.contentEl) == null || c.focus({
        preventScroll: !0
      }) : (f = o.value.activatorEl) == null || f.focus({
        preventScroll: !0
      });
    });
    const s = g(() => U({
      "aria-haspopup": "dialog",
      "aria-expanded": String(a.value)
    }, e.activatorProps));
    return K(() => {
      const [u] = ut.filterProps(e);
      return r(ut, U({
        ref: o,
        class: ["v-dialog", {
          "v-dialog--fullscreen": e.fullscreen,
          "v-dialog--scrollable": e.scrollable
        }, e.class],
        style: e.style
      }, u, {
        modelValue: a.value,
        "onUpdate:modelValue": (c) => a.value = c,
        "aria-modal": "true",
        activatorProps: s.value,
        role: "dialog"
      }, l), {
        activator: t.activator,
        default: function() {
          for (var c = arguments.length, f = new Array(c), d = 0; d < c; d++)
            f[d] = arguments[d];
          return r(me, {
            root: "VDialog"
          }, {
            default: () => {
              var v;
              return [(v = t.default) == null ? void 0 : v.call(t, ...f)];
            }
          });
        }
      });
    }), mt({}, o);
  }
});
const Fr = B({
  chips: Boolean,
  counter: Boolean,
  counterSizeString: {
    type: String,
    default: "$vuetify.fileInput.counterSize"
  },
  counterString: {
    type: String,
    default: "$vuetify.fileInput.counter"
  },
  multiple: Boolean,
  showSize: {
    type: [Boolean, Number],
    default: !1,
    validator: (e) => typeof e == "boolean" || [1e3, 1024].includes(e)
  },
  ...wn({
    prependIcon: "$file"
  }),
  modelValue: {
    type: Array,
    default: () => [],
    validator: (e) => je(e).every((n) => n != null && typeof n == "object")
  },
  ..._a({
    clearable: !0
  })
}, "VFileInput"), Ba = z()({
  name: "VFileInput",
  inheritAttrs: !1,
  props: Fr(),
  emits: {
    "click:control": (e) => !0,
    "mousedown:control": (e) => !0,
    "update:focused": (e) => !0,
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      attrs: t,
      emit: a,
      slots: l
    } = n;
    const {
      t: o
    } = _t(), i = ce(e, "modelValue"), {
      isFocused: s,
      focus: u,
      blur: c
    } = An(e), f = g(() => typeof e.showSize != "boolean" ? e.showSize : void 0), d = g(() => (i.value ?? []).reduce((V, D) => {
      let {
        size: q = 0
      } = D;
      return V + q;
    }, 0)), v = g(() => Da(d.value, f.value)), m = g(() => (i.value ?? []).map((V) => {
      const {
        name: D = "",
        size: q = 0
      } = V;
      return e.showSize ? `${D} (${Da(q, f.value)})` : D;
    })), y = g(() => {
      var D;
      const V = ((D = i.value) == null ? void 0 : D.length) ?? 0;
      return e.showSize ? o(e.counterSizeString, V, v.value) : o(e.counterString, V);
    }), h = A(), C = A(), b = A(), S = g(() => s.value || e.active), p = g(() => ["plain", "underlined"].includes(e.variant));
    function w() {
      var V;
      b.value !== document.activeElement && ((V = b.value) == null || V.focus()), s.value || u();
    }
    function I(V) {
      O(V);
    }
    function E(V) {
      a("mousedown:control", V);
    }
    function O(V) {
      var D;
      (D = b.value) == null || D.click(), a("click:control", V);
    }
    function _(V) {
      V.stopPropagation(), w(), Se(() => {
        i.value = [], pl(e["onClick:clear"], V);
      });
    }
    return ae(i, (V) => {
      (!Array.isArray(V) || !V.length) && b.value && (b.value.value = "");
    }), K(() => {
      const V = !!(l.counter || e.counter), D = !!(V || l.details), [q, N] = bn(t), [{
        modelValue: k,
        ...P
      }] = St.filterProps(e), [$] = So(e);
      return r(St, U({
        ref: h,
        modelValue: i.value,
        "onUpdate:modelValue": (W) => i.value = W,
        class: ["v-file-input", {
          "v-text-field--plain-underlined": p.value
        }, e.class],
        style: e.style,
        "onClick:prepend": I
      }, q, P, {
        centerAffix: !p.value,
        focused: s.value
      }), {
        ...l,
        default: (W) => {
          let {
            id: J,
            isDisabled: R,
            isDirty: Q,
            isReadonly: T,
            isValid: L
          } = W;
          return r(Ia, U({
            ref: C,
            "prepend-icon": e.prependIcon,
            onMousedown: E,
            onClick: O,
            "onClick:clear": _,
            "onClick:prependInner": e["onClick:prependInner"],
            "onClick:appendInner": e["onClick:appendInner"]
          }, $, {
            id: J.value,
            active: S.value || Q.value,
            dirty: Q.value,
            disabled: R.value,
            focused: s.value,
            error: L.value === !1
          }), {
            ...l,
            default: (re) => {
              var Te;
              let {
                props: {
                  class: ve,
                  ...ke
                }
              } = re;
              return r(ue, null, [r("input", U({
                ref: b,
                type: "file",
                readonly: T.value,
                disabled: R.value,
                multiple: e.multiple,
                name: e.name,
                onClick: (ie) => {
                  ie.stopPropagation(), w();
                },
                onChange: (ie) => {
                  if (!ie.target)
                    return;
                  const qo = ie.target;
                  i.value = [...qo.files ?? []];
                },
                onFocus: w,
                onBlur: c
              }, ke, N), null), r("div", {
                class: ve
              }, [!!((Te = i.value) != null && Te.length) && (l.selection ? l.selection({
                fileNames: m.value,
                totalBytes: d.value,
                totalBytesReadable: v.value
              }) : e.chips ? m.value.map((ie) => r(wa, {
                key: ie,
                size: "small",
                color: e.color
              }, {
                default: () => [ie]
              })) : m.value.join(", "))])]);
            }
          });
        },
        details: D ? (W) => {
          var J, R;
          return r(ue, null, [(J = l.details) == null ? void 0 : J.call(l, W), V && r(ue, null, [r("span", null, null), r(po, {
            active: !!((R = i.value) != null && R.length),
            value: y.value
          }, l.counter)])]);
        } : void 0
      });
    }), mt({}, h, C, b);
  }
}), Mr = B({
  ...Z(),
  ...Xi()
}, "VForm"), yt = z()({
  name: "VForm",
  props: Mr(),
  emits: {
    "update:modelValue": (e) => !0,
    submit: (e) => !0
  },
  setup(e, n) {
    let {
      slots: t,
      emit: a
    } = n;
    const l = es(e), o = A();
    function i(u) {
      u.preventDefault(), l.reset();
    }
    function s(u) {
      const c = u, f = l.validate();
      c.then = f.then.bind(f), c.catch = f.catch.bind(f), c.finally = f.finally.bind(f), a("submit", c), c.defaultPrevented || f.then((d) => {
        var m;
        let {
          valid: v
        } = d;
        v && ((m = o.value) == null || m.submit());
      }), c.preventDefault();
    }
    return K(() => {
      var u;
      return r("form", {
        ref: o,
        class: ["v-form", e.class],
        style: e.style,
        novalidate: !0,
        onReset: i,
        onSubmit: s
      }, [(u = t.default) == null ? void 0 : u.call(t, l)]);
    }), mt(l, o);
  }
});
const Lr = B({
  fluid: {
    type: Boolean,
    default: !1
  },
  ...Z(),
  ...de()
}, "VContainer"), zr = z()({
  name: "VContainer",
  props: Lr(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      rtlClasses: a
    } = Xe();
    return K(() => r(e.tag, {
      class: ["v-container", {
        "v-container--fluid": e.fluid
      }, a.value, e.class],
      style: e.style
    }, t)), {};
  }
}), Io = (() => kn.reduce((e, n) => (e[n] = {
  type: [Boolean, String, Number],
  default: !1
}, e), {}))(), Bo = (() => kn.reduce((e, n) => {
  const t = "offset" + Ut(n);
  return e[t] = {
    type: [String, Number],
    default: null
  }, e;
}, {}))(), Eo = (() => kn.reduce((e, n) => {
  const t = "order" + Ut(n);
  return e[t] = {
    type: [String, Number],
    default: null
  }, e;
}, {}))(), ol = {
  col: Object.keys(Io),
  offset: Object.keys(Bo),
  order: Object.keys(Eo)
};
function jr(e, n, t) {
  let a = e;
  if (!(t == null || t === !1)) {
    if (n) {
      const l = n.replace(e, "");
      a += `-${l}`;
    }
    return e === "col" && (a = "v-" + a), e === "col" && (t === "" || t === !0) || (a += `-${t}`), a.toLowerCase();
  }
}
const Ur = ["auto", "start", "end", "center", "baseline", "stretch"], Nr = B({
  cols: {
    type: [Boolean, String, Number],
    default: !1
  },
  ...Io,
  offset: {
    type: [String, Number],
    default: null
  },
  ...Bo,
  order: {
    type: [String, Number],
    default: null
  },
  ...Eo,
  alignSelf: {
    type: String,
    default: null,
    validator: (e) => Ur.includes(e)
  },
  ...Z(),
  ...de()
}, "VCol"), ea = z()({
  name: "VCol",
  props: Nr(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = g(() => {
      const l = [];
      let o;
      for (o in ol)
        ol[o].forEach((s) => {
          const u = e[s], c = jr(o, s, u);
          c && l.push(c);
        });
      const i = l.some((s) => s.startsWith("v-col-"));
      return l.push({
        // Default to .v-col if no other col-{bp}-* classes generated nor `cols` specified.
        "v-col": !i || !e.cols,
        [`v-col-${e.cols}`]: e.cols,
        [`offset-${e.offset}`]: e.offset,
        [`order-${e.order}`]: e.order,
        [`align-self-${e.alignSelf}`]: e.alignSelf
      }), l;
    });
    return () => {
      var l;
      return At(e.tag, {
        class: [a.value, e.class],
        style: e.style
      }, (l = t.default) == null ? void 0 : l.call(t));
    };
  }
}), Ea = ["start", "end", "center"], Po = ["space-between", "space-around", "space-evenly"];
function Pa(e, n) {
  return kn.reduce((t, a) => {
    const l = e + Ut(a);
    return t[l] = n(), t;
  }, {});
}
const $r = [...Ea, "baseline", "stretch"], To = (e) => $r.includes(e), Ro = Pa("align", () => ({
  type: String,
  default: null,
  validator: To
})), Qr = [...Ea, ...Po], Oo = (e) => Qr.includes(e), Do = Pa("justify", () => ({
  type: String,
  default: null,
  validator: Oo
})), qr = [...Ea, ...Po, "stretch"], Fo = (e) => qr.includes(e), Mo = Pa("alignContent", () => ({
  type: String,
  default: null,
  validator: Fo
})), il = {
  align: Object.keys(Ro),
  justify: Object.keys(Do),
  alignContent: Object.keys(Mo)
}, Hr = {
  align: "align",
  justify: "justify",
  alignContent: "align-content"
};
function Gr(e, n, t) {
  let a = Hr[e];
  if (t != null) {
    if (n) {
      const l = n.replace(e, "");
      a += `-${l}`;
    }
    return a += `-${t}`, a.toLowerCase();
  }
}
const Kr = B({
  dense: Boolean,
  noGutters: Boolean,
  align: {
    type: String,
    default: null,
    validator: To
  },
  ...Ro,
  justify: {
    type: String,
    default: null,
    validator: Oo
  },
  ...Do,
  alignContent: {
    type: String,
    default: null,
    validator: Fo
  },
  ...Mo,
  ...Z(),
  ...de()
}, "VRow"), Yr = z()({
  name: "VRow",
  props: Kr(),
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = g(() => {
      const l = [];
      let o;
      for (o in il)
        il[o].forEach((i) => {
          const s = e[i], u = Gr(o, i, s);
          u && l.push(u);
        });
      return l.push({
        "v-row--no-gutters": e.noGutters,
        "v-row--dense": e.dense,
        [`align-${e.align}`]: e.align,
        [`justify-${e.justify}`]: e.justify,
        [`align-content-${e.alignContent}`]: e.alignContent
      }), l;
    });
    return () => {
      var l;
      return At(e.tag, {
        class: ["v-row", a.value, e.class],
        style: e.style
      }, (l = t.default) == null ? void 0 : l.call(t));
    };
  }
});
function sl(e) {
  const t = Math.abs(e);
  return Math.sign(e) * (t / ((1 / 0.501 - 2) * (1 - t) + 1));
}
function rl(e) {
  let {
    selectedElement: n,
    containerSize: t,
    contentSize: a,
    isRtl: l,
    currentScrollOffset: o,
    isHorizontal: i
  } = e;
  const s = i ? n.clientWidth : n.clientHeight, u = i ? n.offsetLeft : n.offsetTop, c = l && i ? a - u - s : u, f = t + o, d = s + c, v = s * 0.4;
  return c <= o ? o = Math.max(c - v, 0) : f <= d && (o = Math.min(o - (f - d - v), a - t)), o;
}
function Wr(e) {
  let {
    selectedElement: n,
    containerSize: t,
    contentSize: a,
    isRtl: l,
    isHorizontal: o
  } = e;
  const i = o ? n.clientWidth : n.clientHeight, s = o ? n.offsetLeft : n.offsetTop, u = l && o ? a - s - i / 2 - t / 2 : s + i / 2 - t / 2;
  return Math.min(a - t, Math.max(0, u));
}
const Zr = Symbol.for("vuetify:v-slide-group"), Lo = B({
  centerActive: Boolean,
  direction: {
    type: String,
    default: "horizontal"
  },
  symbol: {
    type: null,
    default: Zr
  },
  nextIcon: {
    type: le,
    default: "$next"
  },
  prevIcon: {
    type: le,
    default: "$prev"
  },
  showArrows: {
    type: [Boolean, String],
    validator: (e) => typeof e == "boolean" || ["always", "desktop", "mobile"].includes(e)
  },
  ...Z(),
  ...de(),
  ...ba({
    selectedClass: "v-slide-group-item--active"
  })
}, "VSlideGroup"), ul = z()({
  name: "VSlideGroup",
  props: Lo(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const {
      isRtl: a
    } = Xe(), {
      mobile: l
    } = Va(), o = Cn(e, e.symbol), i = te(!1), s = te(0), u = te(0), c = te(0), f = g(() => e.direction === "horizontal"), {
      resizeRef: d,
      contentRect: v
    } = Qn(), {
      resizeRef: m,
      contentRect: y
    } = Qn(), h = g(() => o.selected.value.length ? o.items.value.findIndex((T) => T.id === o.selected.value[0]) : -1), C = g(() => o.selected.value.length ? o.items.value.findIndex((T) => T.id === o.selected.value[o.selected.value.length - 1]) : -1);
    if (_e) {
      let T = -1;
      ae(() => [o.selected.value, v.value, y.value, f.value], () => {
        cancelAnimationFrame(T), T = requestAnimationFrame(() => {
          if (v.value && y.value) {
            const L = f.value ? "width" : "height";
            u.value = v.value[L], c.value = y.value[L], i.value = u.value + 1 < c.value;
          }
          if (h.value >= 0 && m.value) {
            const L = m.value.children[C.value];
            h.value === 0 || !i.value ? s.value = 0 : e.centerActive ? s.value = Wr({
              selectedElement: L,
              containerSize: u.value,
              contentSize: c.value,
              isRtl: a.value,
              isHorizontal: f.value
            }) : i.value && (s.value = rl({
              selectedElement: L,
              containerSize: u.value,
              contentSize: c.value,
              isRtl: a.value,
              currentScrollOffset: s.value,
              isHorizontal: f.value
            }));
          }
        });
      });
    }
    const b = te(!1);
    let S = 0, p = 0;
    function w(T) {
      const L = f.value ? "clientX" : "clientY";
      p = (a.value && f.value ? -1 : 1) * s.value, S = T.touches[0][L], b.value = !0;
    }
    function I(T) {
      if (!i.value)
        return;
      const L = f.value ? "clientX" : "clientY", re = a.value && f.value ? -1 : 1;
      s.value = re * (p + S - T.touches[0][L]);
    }
    function E(T) {
      const L = c.value - u.value;
      s.value < 0 || !i.value ? s.value = 0 : s.value >= L && (s.value = L), b.value = !1;
    }
    function O() {
      d.value && (d.value[f.value ? "scrollLeft" : "scrollTop"] = 0);
    }
    const _ = te(!1);
    function V(T) {
      if (_.value = !0, !(!i.value || !m.value)) {
        for (const L of T.composedPath())
          for (const re of m.value.children)
            if (re === L) {
              s.value = rl({
                selectedElement: re,
                containerSize: u.value,
                contentSize: c.value,
                isRtl: a.value,
                currentScrollOffset: s.value,
                isHorizontal: f.value
              });
              return;
            }
      }
    }
    function D(T) {
      _.value = !1;
    }
    function q(T) {
      var L;
      !_.value && !(T.relatedTarget && ((L = m.value) != null && L.contains(T.relatedTarget))) && k();
    }
    function N(T) {
      m.value && (f.value ? T.key === "ArrowRight" ? k(a.value ? "prev" : "next") : T.key === "ArrowLeft" && k(a.value ? "next" : "prev") : T.key === "ArrowDown" ? k("next") : T.key === "ArrowUp" && k("prev"), T.key === "Home" ? k("first") : T.key === "End" && k("last"));
    }
    function k(T) {
      var L, re, ve, ke, Te;
      if (m.value)
        if (!T)
          (L = ua(m.value)[0]) == null || L.focus();
        else if (T === "next") {
          const ie = (re = m.value.querySelector(":focus")) == null ? void 0 : re.nextElementSibling;
          ie ? ie.focus() : k("first");
        } else if (T === "prev") {
          const ie = (ve = m.value.querySelector(":focus")) == null ? void 0 : ve.previousElementSibling;
          ie ? ie.focus() : k("last");
        } else
          T === "first" ? (ke = m.value.firstElementChild) == null || ke.focus() : T === "last" && ((Te = m.value.lastElementChild) == null || Te.focus());
    }
    function P(T) {
      const L = s.value + (T === "prev" ? -1 : 1) * u.value;
      s.value = Un(L, 0, c.value - u.value);
    }
    const $ = g(() => {
      let T = s.value > c.value - u.value ? -(c.value - u.value) + sl(c.value - u.value - s.value) : -s.value;
      s.value <= 0 && (T = sl(-s.value));
      const L = a.value && f.value ? -1 : 1;
      return {
        transform: `translate${f.value ? "X" : "Y"}(${L * T}px)`,
        transition: b.value ? "none" : "",
        willChange: b.value ? "transform" : ""
      };
    }), W = g(() => ({
      next: o.next,
      prev: o.prev,
      select: o.select,
      isSelected: o.isSelected
    })), J = g(() => {
      switch (e.showArrows) {
        case "always":
          return !0;
        case "desktop":
          return !l.value;
        case !0:
          return i.value || Math.abs(s.value) > 0;
        case "mobile":
          return l.value || i.value || Math.abs(s.value) > 0;
        default:
          return !l.value && (i.value || Math.abs(s.value) > 0);
      }
    }), R = g(() => Math.abs(s.value) > 0), Q = g(() => c.value > Math.abs(s.value) + u.value);
    return K(() => r(e.tag, {
      class: ["v-slide-group", {
        "v-slide-group--vertical": !f.value,
        "v-slide-group--has-affixes": J.value,
        "v-slide-group--is-overflowing": i.value
      }, e.class],
      style: e.style,
      tabindex: _.value || o.selected.value.length ? -1 : 0,
      onFocus: q
    }, {
      default: () => {
        var T, L, re;
        return [J.value && r("div", {
          key: "prev",
          class: ["v-slide-group__prev", {
            "v-slide-group__prev--disabled": !R.value
          }],
          onClick: () => P("prev")
        }, [((T = t.prev) == null ? void 0 : T.call(t, W.value)) ?? r(qa, null, {
          default: () => [r(oe, {
            icon: a.value ? e.nextIcon : e.prevIcon
          }, null)]
        })]), r("div", {
          key: "container",
          ref: d,
          class: "v-slide-group__container",
          onScroll: O
        }, [r("div", {
          ref: m,
          class: "v-slide-group__content",
          style: $.value,
          onTouchstartPassive: w,
          onTouchmovePassive: I,
          onTouchendPassive: E,
          onFocusin: V,
          onFocusout: D,
          onKeydown: N
        }, [(L = t.default) == null ? void 0 : L.call(t, W.value)])]), J.value && r("div", {
          key: "next",
          class: ["v-slide-group__next", {
            "v-slide-group__next--disabled": !Q.value
          }],
          onClick: () => P("next")
        }, [((re = t.next) == null ? void 0 : re.call(t, W.value)) ?? r(qa, null, {
          default: () => [r(oe, {
            icon: a.value ? e.prevIcon : e.nextIcon
          }, null)]
        })])];
      }
    })), {
      selected: o.selected,
      scrollTo: P,
      scrollOffset: s,
      focus: k
    };
  }
});
const Jr = B({
  indeterminate: Boolean,
  inset: Boolean,
  flat: Boolean,
  loading: {
    type: [Boolean, String],
    default: !1
  },
  ...wn(),
  ...Aa()
}, "VSwitch"), Xr = z()({
  name: "VSwitch",
  inheritAttrs: !1,
  props: Jr(),
  emits: {
    "update:focused": (e) => !0,
    "update:modelValue": () => !0,
    "update:indeterminate": (e) => !0
  },
  setup(e, n) {
    let {
      attrs: t,
      slots: a
    } = n;
    const l = ce(e, "indeterminate"), o = ce(e, "modelValue"), {
      loaderClasses: i
    } = xn(e), {
      isFocused: s,
      focus: u,
      blur: c
    } = An(e), f = g(() => typeof e.loading == "string" && e.loading !== "" ? e.loading : e.color), d = De(), v = g(() => e.id || `switch-${d}`);
    function m() {
      l.value && (l.value = !1);
    }
    return K(() => {
      const [y, h] = bn(t), [C, b] = St.filterProps(e), [S, p] = Kn.filterProps(e), w = A();
      function I(E) {
        var O, _;
        E.stopPropagation(), E.preventDefault(), (_ = (O = w.value) == null ? void 0 : O.input) == null || _.click();
      }
      return r(St, U({
        class: ["v-switch", {
          "v-switch--inset": e.inset
        }, {
          "v-switch--indeterminate": l.value
        }, i.value, e.class],
        style: e.style
      }, y, C, {
        id: v.value,
        focused: s.value
      }), {
        ...a,
        default: (E) => {
          let {
            id: O,
            messagesId: _,
            isDisabled: V,
            isReadonly: D,
            isValid: q
          } = E;
          return r(Kn, U({
            ref: w
          }, S, {
            modelValue: o.value,
            "onUpdate:modelValue": [(N) => o.value = N, m],
            id: O.value,
            "aria-describedby": _.value,
            type: "checkbox",
            "aria-checked": l.value ? "mixed" : void 0,
            disabled: V.value,
            readonly: D.value,
            onFocus: u,
            onBlur: c
          }, h), {
            ...a,
            default: () => r("div", {
              class: "v-switch__track",
              onClick: I
            }, null),
            input: (N) => {
              let {
                textColorClasses: k,
                textColorStyles: P
              } = N;
              return r("div", {
                class: ["v-switch__thumb", k.value],
                style: P.value
              }, [e.loading && r(xa, {
                name: "v-switch",
                active: !0,
                color: q.value === !1 ? void 0 : f.value
              }, {
                default: ($) => a.loader ? a.loader($) : r(Sn, {
                  active: $.isActive,
                  color: $.color,
                  indeterminate: !0,
                  size: "16",
                  width: "2"
                }, null)
              })]);
            }
          });
        }
      });
    }), {};
  }
});
const zo = Symbol.for("vuetify:v-tabs"), eu = B({
  fixed: Boolean,
  sliderColor: String,
  hideSlider: Boolean,
  direction: {
    type: String,
    default: "horizontal"
  },
  ...hn(Gl({
    selectedClass: "v-tab--selected",
    variant: "text"
  }), ["active", "block", "flat", "location", "position", "symbol"])
}, "VTab"), ta = z()({
  name: "VTab",
  props: eu(),
  setup(e, n) {
    let {
      slots: t,
      attrs: a
    } = n;
    const {
      textColorClasses: l,
      textColorStyles: o
    } = Re(e, "sliderColor"), i = g(() => e.direction === "horizontal"), s = te(!1), u = A(), c = A();
    function f(d) {
      var m, y;
      let {
        value: v
      } = d;
      if (s.value = v, v) {
        const h = (y = (m = u.value) == null ? void 0 : m.$el.parentElement) == null ? void 0 : y.querySelector(".v-tab--selected .v-tab__slider"), C = c.value;
        if (!h || !C)
          return;
        const b = getComputedStyle(h).color, S = h.getBoundingClientRect(), p = C.getBoundingClientRect(), w = i.value ? "x" : "y", I = i.value ? "X" : "Y", E = i.value ? "right" : "bottom", O = i.value ? "width" : "height", _ = S[w], V = p[w], D = _ > V ? S[E] - p[E] : S[w] - p[w], q = Math.sign(D) > 0 ? i.value ? "right" : "bottom" : Math.sign(D) < 0 ? i.value ? "left" : "top" : "center", k = (Math.abs(D) + (Math.sign(D) < 0 ? S[O] : p[O])) / Math.max(S[O], p[O]), P = S[O] / p[O], $ = 1.5;
        ot(C, {
          backgroundColor: [b, "currentcolor"],
          transform: [`translate${I}(${D}px) scale${I}(${P})`, `translate${I}(${D / $}px) scale${I}(${(k - 1) / $ + 1})`, "none"],
          transformOrigin: Array(3).fill(q)
        }, {
          duration: 225,
          easing: Mt
        });
      }
    }
    return K(() => {
      const [d] = Y.filterProps(e);
      return r(Y, U({
        symbol: zo,
        ref: u,
        class: ["v-tab", e.class],
        style: e.style,
        tabindex: s.value ? 0 : -1,
        role: "tab",
        "aria-selected": String(s.value),
        active: !1,
        block: e.fixed,
        maxWidth: e.fixed ? 300 : void 0,
        rounded: 0
      }, d, a, {
        "onGroup:selected": f
      }), {
        default: () => {
          var v;
          return [((v = t.default) == null ? void 0 : v.call(t)) ?? e.text, !e.hideSlider && r("div", {
            ref: c,
            class: ["v-tab__slider", l.value],
            style: o.value
          }, null)];
        }
      });
    }), {};
  }
});
function tu(e) {
  return e ? e.map((n) => typeof n == "string" ? {
    title: n,
    value: n
  } : n) : [];
}
const nu = B({
  alignTabs: {
    type: String,
    default: "start"
  },
  color: String,
  fixedTabs: Boolean,
  items: {
    type: Array,
    default: () => []
  },
  stacked: Boolean,
  bgColor: String,
  grow: Boolean,
  height: {
    type: [Number, String],
    default: void 0
  },
  hideSlider: Boolean,
  sliderColor: String,
  ...Lo({
    mandatory: "force"
  }),
  ...we(),
  ...de()
}, "VTabs"), au = z()({
  name: "VTabs",
  props: nu(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = ce(e, "modelValue"), l = g(() => tu(e.items)), {
      densityClasses: o
    } = Pe(e), {
      backgroundColorClasses: i,
      backgroundColorStyles: s
    } = We(j(e, "bgColor"));
    return Oe({
      VTab: {
        color: j(e, "color"),
        direction: j(e, "direction"),
        stacked: j(e, "stacked"),
        fixed: j(e, "fixedTabs"),
        sliderColor: j(e, "sliderColor"),
        hideSlider: j(e, "hideSlider")
      }
    }), K(() => {
      const [u] = ul.filterProps(e);
      return r(ul, U(u, {
        modelValue: a.value,
        "onUpdate:modelValue": (c) => a.value = c,
        class: ["v-tabs", `v-tabs--${e.direction}`, `v-tabs--align-tabs-${e.alignTabs}`, {
          "v-tabs--fixed-tabs": e.fixedTabs,
          "v-tabs--grow": e.grow,
          "v-tabs--stacked": e.stacked
        }, o.value, i.value, e.class],
        style: [{
          "--v-tabs-height": ee(e.height)
        }, s.value, e.style],
        role: "tablist",
        symbol: zo
      }), {
        default: () => [t.default ? t.default() : l.value.map((c) => r(ta, U(c, {
          key: c.title
        }), null))]
      });
    }), {};
  }
});
const lu = B({
  id: String,
  text: String,
  ...hn(_n({
    closeOnBack: !1,
    location: "end",
    locationStrategy: "connected",
    eager: !0,
    minWidth: 0,
    offset: 10,
    openOnClick: !1,
    openOnHover: !0,
    origin: "auto",
    scrim: !1,
    scrollStrategy: "reposition",
    transition: !1
  }), ["absolute", "persistent"])
}, "VTooltip"), ht = z()({
  name: "VTooltip",
  props: lu(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, n) {
    let {
      slots: t
    } = n;
    const a = ce(e, "modelValue"), {
      scopeId: l
    } = Vn(), o = De(), i = g(() => e.id || `v-tooltip-${o}`), s = A(), u = g(() => e.location.split(" ").length > 1 ? e.location : e.location + " center"), c = g(() => e.origin === "auto" || e.origin === "overlap" || e.origin.split(" ").length > 1 || e.location.split(" ").length > 1 ? e.origin : e.origin + " center"), f = g(() => e.transition ? e.transition : a.value ? "scale-transition" : "fade-transition"), d = g(() => U({
      "aria-describedby": i.value
    }, e.activatorProps));
    return K(() => {
      const [v] = ut.filterProps(e);
      return r(ut, U({
        ref: s,
        class: ["v-tooltip", e.class],
        style: e.style,
        id: i.value
      }, v, {
        modelValue: a.value,
        "onUpdate:modelValue": (m) => a.value = m,
        transition: f.value,
        absolute: !0,
        location: u.value,
        origin: c.value,
        persistent: !0,
        role: "tooltip",
        activatorProps: d.value,
        _disableGlobalStack: !0
      }, l), {
        activator: t.activator,
        default: function() {
          var C;
          for (var m = arguments.length, y = new Array(m), h = 0; h < m; h++)
            y[h] = arguments[h];
          return ((C = t.default) == null ? void 0 : C.call(t, ...y)) ?? e.text;
        }
      });
    }), mt({}, s);
  }
}), jo = (e, n) => {
  const t = e.__vccOpts || e;
  for (const [a, l] of n)
    t[a] = l;
  return t;
}, ou = {};
function iu(e, n) {
  const t = Nt("RouterLink");
  return M(), G(t, {
    to: { name: "pageApplet", params: { slug: "s3-browser" } },
    style: { color: "white" },
    class: "d-inline-flex align-center text-decoration-none font-weight-regular text-body-1 px-4 h-100"
  }, {
    default: x(() => [
      H("S3 Browser")
    ]),
    _: 1
  });
}
const su = /* @__PURE__ */ jo(ou, [["render", iu]]), ru = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAASwCAMAAADc/0P9AAAAh1BMVEUAAAAUbrQUbrQTbbQUbrQTbbQWb7QUbrQUbrQUb7QUbrQQbbMTbrQUbrQOdLoUbrQUbrQUbrQUbrQUbrQUbrQUbrQTbrQUbrQUbrQabLQTb7MTbrQUbrQUbrQUbrQUbrQWbLYSbrIUbrQTbrQUbrQTbrMTbrQUbrQUbrQTbrQTbrQUbrQUbrTT+MPGAAAALHRSTlMAu/tDqnchzTtVMxFemAVlh3Dts+f3kYDUCSzdS6PzxBcb2SfiDWrJv1GejNfugqwAACshSURBVHja7MGBAAAAAICg/akXqQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYHbsZKltIIoCqBUNaLCQPCJbBiNsYqjy/39fWgWVZJMlBJtzll3Vr3e37msAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgQ9xWVZaVZRzHu6IomqaZpWnatu26ruskSRbRu9PNb0/9X57+nJ+id4twMVxfhzFh2CwMDaN34YmyzLKqup0A/FP1mJV5XEybMYvGIIqi/U3XH+cP5//iYb7su5t9FI3BNqZaMy3ivMweqwnwjTwPhxBNzc80dKTQj05dP1+dL8hq3nen0NFCPwvdLMTYYXieAFdhM2zzeDed3a3vk8W+W/44X6PVsttHi/v13Wxa7PLtYKmEC1Ft87eAGvPp/E2NCfYWYLs820yAL6M65K9N2tbJS3e8qPXus6yO3UtSt2nzmh/8gsHn2wxl6FFtqFH9dW55H2ceylcdule8HSb8Yu9OlNOGgTCOIx/4QMaHwDJgY8hBEvD7P1+bdtrppJMmpIAt6/97CM3up9UKuJrdupb+qVEBhdSlSq9ANSdf1uvdBMBlQilX+qVHKXVdRSWaLI/CKYk9cLZ9+HLQRxVYm5v3ZxGooz68hHSMwMflVJo1gmpqEIpAJX4UTicA3pxTOhHVtsMAOYvAKzm5YL19KPXx+Y4M3RDLu+ejljSLsMwsjvxEBRxUhnI2rZelLhUXxm01ddPMC+j8RmK5EYkfxVRcGJlZKLX3VHQYpeLJ0zJkih7G+9H8CYYTrFAENIowFCeVtX6eWwzPwwzTOk9auj/rFW2S15RbGKz5tPaTlkQdf3AqL5MxK24wJPN1pD2mFPAeZyPKNGQ3Kvo2j+VJPHTAJzyIk4x5XY1e7N28oarC+dWW0tF6AtzKYyxLQayO/7ANmpybRFzbfZQpOkBcyIPKovsJcHnzNWUVXl2j2ApJtnDRs6olrcIVOVWTh0w/gLMKxuDUwtfN48OxYvUnbsypjgdmH3CWfa0FdRV64wSlZPQBn7AK82bTAb1bKF2zswbvm8qypQnEgLzGWvEEeGPlasG7ZQzSVmiXLB6/PLokVhg4Jygj+kPsojLoACNsmpQNW/aayqTqAKMsPEItC61zxTsbGGqhcoYe7LGLEh4ww3ALj/bQAruINhBjsWlSPkUcr5WbEbBjZDYJt4cjNA81M6EYJ6fV7KcZk13UkLBj1LaK7nAcYr/tAAtUmUuhZbRZlPD5MixSeCmb4g219gWpFewTZOEEZpnXR0orWGuR1DSHxljVZOyw3VJJvpo2wEx6rIkBvluKnEBr0PapIrYCfnNanwc8A3XvM8cO/OXJ57PWwdnnTFsB76g0ddaAzKToAPxDS541DKvaI7cCPuQI7g175zbcCQKftFQR81n9CRPmrYCzFAlz8L3Y5WziA77gzifOujWX4Ar4KkfQGt7Q3mcnO76xdz86aQRBHIBXEagif8XDCgJSsZjs+z9fmyZN2tRY0QNud7/vISZ3M7O/4VOmI5sORzG4tMMANVgN3ZM+tPtKnx1qMqmcCzuk1k0EarS6DBzEdriJQM3mbWd36tcZ+ReEg1j2PY+u1xdbDHBAZ4tATQbXVkThwDZjM8M6bMfS2eEIpjPNLOUKkjFRsj6lN9NphyNajpSsj1orV3Bsy8rT6I9Yj24jcHTL6jGwn3WlXMGJ3PrK2su2LUcU9qOXdSKDockgnNikbS/rXS7nETi5+Uvgf652EWiE3VXgLet+BJrivK/7/oZri1fQKJNx4HVX3yPQMF3/ha/Z9iXIQAOdVy5G/2PhEA401FRa1t96mu3QYBf2SP+wsCkKjfbkI+u3r1UEGq5v8/2XewHIkIA748KfxoaDkITb51C67UUEElF67/2b30FIyKbo2/YvYq8gKcuCIxzGEUjMLJRp8BCB5DwUud/QW0UgQbsC3xauuxFIUre4lKzOJgKJmndCUTqyGSBhT0VVrEd3JiBpJVUs9QpStynmPHRP/wqSd1fIM53BWQSStxuEEtgXhSxchAK0I5CFdsheS/wV5KIVMreW3g7ZmOY+KtxFIBtnIWvPEcjIMGSsI7APsrLMeeP9JgJZuQnZakUgM/lOCl2cgOx0Q6auI/xg795y2giCKIBWJoliGxSIBSTBxjKxCSDV/teHeEn+4PE9d85ZxKinuute4swrk4xRCPSnIq0bCJQ5xRLSAJEiLwq3lggh0pDYSaE1FUL9qjy3DUS6rThHDWQa8tKS7xsIta40Fw2Euqg0grAg1l2lkTQKsc4qjJk7BLupLLsGYu0qy6KBWIvKIrsPgs0qiw8WBEsLbJg1ECvthHXZQKzLynLdQKy4gBmNhBBrU2kEukOsvOacqwZCXVWa/w2EOqk0dnMgVtpmjrgGyLWvPBL8IFRefp+37hArbfX5yaqBQP8qkWJCiJRYS1h1s2wgzjItbvTFaQNxTivT1hEL4izzWlRffG8gTOYE69HffQNRVj8rlr56CJPXUn/gWwNB8nIaDh3ZKIQgZ7ET92frBmJE/xB6jAVRfle8Lw1EuKt8W28bIMIqrivnLTsP3iHAMq2M8B2z8wZGbkirp3/XfGhg1IZ5TcZxA6N2XBPiiwWjllfs9aETf4UwWsOkzleP7k3eYaTOJzS/evV108AIbSZzP3hoYREaRmgf2er1uesfzQN7d5qcNhAFAbjRhhbQwq5ECLOmgt/9z5coNo5T5djWavHU3wX4xdTM6E030Z0Z7zFQ6VyI6K5YKYZrLUR0P4wB5DO8x+RFFtHdmA3yuv21/Q8horvww8HghTwWEt2FleKCnBJMJmQR9d5p8MfBm4BlOkQ9ZymvmyjF4907UY8tBvd48H3BVIiop6xBhCGX8pObLKJeOqkv86oijRk5Q9Q/0zPoLT5nsoh6ZjzQp86fcmGjDlGPzAaWLFpWEDPYj6gnjClnGT5y5FAWUS+MBlI8WJPJnCyiLzce8mT7EWV4ByGiL3SKUMYRuvgOyggjTmURfZmZHaIMR9vh0fFQztnmkkX0JRZJinI8bbkz6QplhRFTHIg6d0pSlLVSl5tsobxwwrssovf0YrkCLGgzT8Eli6jfvkdhtToZaBO7qMbbCBF1YDMJUYmrr5rCTFCVtxMiatnuJ6qy9Y1spVtU50/5YIeoRYblorqtujt34Io6HjjlQNSWRbxHHVPoM9mjltBj+AxRC8ZRilr2GvOTzxnqci1G/BE1a26irkxlwp+P+pxHBmYRNWbx6KA+be9yngRoQphxm0XUiNEk7dFfu29CF83Y29+FiGpZxA6aYSr8RliI0RiT2yyi6oyRF6Ipj9BplaE5QcQJeKJKDvYDmpOtoJO3CdEk95oLEZWSX100Kdx40MmRC5qVZluOwBN92nI+SdGsRLRlYb1Y5A6aFkzmvM4i+oxdEqBpTr6AVnMZoQVBxNfRRB/Y2A9owUj0ZWHd2CIRWuHYzM0i+q/N+ohWXERsaOWKLH20xH/kdBbRGw6xj5Z8W4q40Co1RA4BWvPN5tmQ6B+b2EVrzgcRQ+nYaGEsIhba5CQj3sETPRmvj2iTVfwG9JrKbzHewu+GRE0ydske7YrlN41ZWDcTKVzQtsDbcqaUBmw5nwRoWyQFjVlYN0cpGBnal2ZT1hrSIH2fZinalxlS0FZS/4+ZFJYmOuEkIw7C06AYO9tHJ8ylFGbQbC6drlhAaq640aKBWGy9AB1xc/lDXyPha2t5krv4CL8cEn2eMV776I6byxN9jYSvmfIsz9ClwLuydYfUOl29AF0yc3mmr5HwtbMhzwwPHXMii4HwpE4+sn10bGLIjcr+ib828uKC7vmJxXkHUmM5WpshOpfIiw10+8XenegnCgNhAE8g3PchIKAo2tZj3v/5dt1ura03ogQy/0fw1w6TycfgwDfHJR1wTQVHWqj/JM3vaJm6D5+GHhvd8eAAtUg3xrKvAUK9VTiGRbrxFsEBjwxbDocylXTmTfYr7LRQ70iZY8xIZ9QMDg3zk4QHQjg0XZMujXUlwpkW6o1R5ZcW6VIZwn8CxEZ3KPyUuKRbrhng7SHi33Q/YO9QCj9RMnQp/LKak+6ptoPr/xC3YhaYpHvzFXwRIja6U8JvISdfCVKNbYWvHiLOjKqtwclnadYh/FaSobPg2ISb8Jmb2w5+oBVxImaB3vkp8Ms4gWMWGbwajtVcrYV+05UIX+RBnZpWfjkjHNELOFaT4dvAKQ43TdZ/cyPBAyLqgpRNPN7SAmMfTtmQ4XuHkwoOX6J0cxurFnohKZsEOocfddBr2BMpNrqTwxkbPs/D/6oWhrXQT8LUqr9mG/gmVmx0ZwpnhAHhVm6kEaa10FNMq8Q2uRmuH7FjOGNKRLCCsz54CJuctzC2FKfxqEUx3Rp8L0XPK/gmXGx0x4fzJIerm5FTLN3DIyJq4wio8HUPeIqVSHCeT0RQwiWhwm9vfGBeKhMMbKFG4si3ezH9cb0QDggYG92ZwWV1b34GN7d9TGyh24WVE+i8JXjOWtdwGfcNYjsKuKLiKkd6zVx+d1ZYttBF8cp5l3l4bfZm+goOCRob3ZnAVbQXHfMhy7R9luGCLfRbTBNP7l0vsmBw1YSI4R2ukzacvPB5Hzc3lImGWVP0l1REvm3yGa26Qt1IcN07EYMJN2F8X/de4C5KxaH4AVdhLakTlL184v6jOhLcgu8QUnvcEdwm6vcv4qqyl1DcsyWQUJsoRj+bqr18IsFNRr24z29DBSBGyfqqW4GDdWvYPitVb+7/LpUruFVFRLGF29Fe3RheMM7XQRJlON8alFEWJcE673dP9U2P4BfhY6M7awARS9YnyzSUhGmYle81qaAT35P7O6c6RaZwjzURxRzuo3lDeYL9KlwOLTAI0S+hxgZXqP5xjQ+4T69SZY9Zwp1if6i/jqvqtpJEGiZPuRZrUaLYujrUOfNMWcKdlkQcDO4msWGdDI+4839nRaxcPBl9nvzyAUzTLzGdEdyNEXEE0IRmD/X59sN4IdupE33EeFrsiBR/RE5qy4sBTiJOKCk0wfH2utbp0Eyc8rmV9EmsXLaVZEIznNC/gBRr0cQPjOGe+055C5bQzMBPPEfR0WZGjMPd7w00Kl2sqnHracvCumKJYsu5UI/CL6YzhSMYGz32Ac3VSu/eJG23dumll+76Lpx2NTTa9VKJYpdiNVO/zYIMmvsgIkngERI1RP5DO5zTl3bgb6KqxoHXZVJcV9HGD+zSnOPfzo7MJHjElojEgAfF/gCjMA8Zz3O9tIM0mURajHl6gFFRRZMkDexSz4caimlqrhTwIIOIRIXHUVuMS5xG3lRTNjwlTTaMarUIBWwU1xplmyRVPEM21YEHER7hGpEEDxOsYYihBaEj0k3FQ9yZasprO0i3DqOVVsQ9n96HcaFVlDnbNLDXsqnO8Jx3I90JoQUxEQuDdiwTrFkNjS01N+W14QWKnzgsolpdxCFnvdgojItaoxFzEl8JPGMtm7lqYWvdUJ4WcArGRq9RoDVZ2ttNf1xyrZm6ME1ZNgzPC5TUT5wNY4xSutI0rS6KZRiGEjxICsNwWRS1pmkrSiljbOMkfqoEnmcYsmyaC3VmYdvUJjXQoDUKEYsObcrETjp0w7UsS90z93R5Tzf31D3LwkL0epZXwUkYG73JWIJWSdQWMvmH0HWWTdv+fxPuVK5B26QqwD4LoaNqFY3gJIyN3iGBZ6gUnGchtKcGVIInSIhobHiSLB3AHniE2qhWFTyJTUSjwvMUmHVAosvTDM7B2GgDMTzTMpHxKgoJaiwnSzgHY6PNRPBkIxoI+BxAopvZbApPFhHxKPACBTZaSCS6r8FZGBt9hAyvMY08fFcfCWBmsxBeQ8Qtmm8SvEzmY6OFBs1MNXgZSchdGBm8UsjeMaKFBmnxzkJ4pYyIyIFXi5mHY3g0KDPDWcKr/WHvThDThoEogEq2vGELy7vxwpYSIJn7n69106RN2tKUEJCt/86AxzPjLyGZiSK6hVYGOHQIk7Cz/2vFjtjox9zRrXhlYOQQDtOxsCtu0Y0YulxJ6XaKQ2Ubd+AcpmFhV4eCbidlZuJ0W5ZXYjyEcdnZFS/oDIiNflhFGmh7LOJhHNZB6ZEGKmYmmzSRiwQ3PIDW3EjWpAkTY6ODkDSSZomPpRZoaOE7mVZ/cmTsHkWbV8YPVt3HDQPQxiYoVwXpxczY6OCBNLRcqQ5XLcPN7XRrrJ49MFPFpKtcYECEm5k3ca/b+PFTzEzVkM6KVRlhQITrmjeRfkPgawY/FEvSnVX36LXgGp5qlf6PxJKZi9MooGrBW8b1VS84M5ei8UDVgu8MrlVGx0YHHY2MtRXVEcl4uAj3WImtRSPTMXNpFR19v6XXJzaiD3C2cBaVXMvMAmKjJ21pvHJeRjPMiPCfE2BQZS2N15aZrKeRs+re6e5wYTz80/zu6PT16CbAt3pmsnuaBKvNFLot+HtX5fTemBbrJ9wzk81oSnIusduC17sqJcbfVf3K7HtN5hN57fwqP8h7G18SDefaiTzkNDmF4euPA02U1XKZoG6ZJ/RjJTz9A+tnOjCzjSk6iroFp8e/KVeqHxQz25GMUNRCxbZreDs9TXPXjpWoJ7jc+JMjM9uaTGLlnlAxGq5pCGeBI7kpleoH478pfSEDDYOiE6FwjVM46ya9pjqlZaYTZLBlnZVJ4G8YjMDGD5Iyq40sVM8EM11CQJR6mXQCHy2XhsLGjlXP20mlqc6VMNP5BD9Z7aFX993M6AOmeghn3b3qD6hTr/jMdFOMjl5AkXuZrBI0XVcWNnaUqJ6bPfghNnrCiuCktOa9SgIfoYhPM5QppxQrtFP/sGLwSPBOec370ok7390x+KCd63exU/a8nuABms/yyCAgOGdkrFeiHGbGBvuud1tshomvktmqHunteTcWMHAJPqb44nEhVRJ1frPG3PjKfN34XZQoKbj3BevSj8JG9Rt05Be1fCpfTnz0G9fA7it0G/8YO08lCqvzi8oZGB4d/XRF3tarrC8r53sHtpnaLYOLzdBCxUlV9tnKq3Oszd9CbPTCHIIrKvKtd+DiQaoqiaOj7TfuehQ7/N3abXz7OBQnJR8EP3jbHEPeVTkMEB3VwjJv6z3PRC+lUo4Tx0HQ2f7szt2EC3Y1i3Dj3s18uwuCOHYcpaTsRcb3dZtjuNMAYqODBbp4zVlpmrZtW3vennOeCSGklI9KKedJ/CIKfhPFL5wnSqlHKaUQIuOc7z2vbts2TVP8DjRnTW2fcKY9AYD29gwGJQGA9koGg4gAQHsRA0RHAUYCsVFERwHGArHRZxkBgOYyBoiOAowEYqPPbAIAzdkMEB0FGAdrFAe4rsMjANCax+CZJADQmmSA6CjAV/buI6mBKAiiYEPgvfcII7z6/udjB5LGsO0fZJ7jRVUjZKO/pgmUNg1+WNiG0k4C6Sg0QjY67zKBwi4D6Sg0QjY67zWBwv7hAdOYqwTKugrmfSVQlmx00WECZR0G824SKOsmkI5CGybBopUEiloJpKPQCNnosrsEiroLFu0mUJRstOM5gZKeg2X3CZT0FSx7S6Ckt2DZTgIl7QQdkwQKmhwEHR8JFPQRdB0lUNBR0PWZQEGy0T6PCRT0GPS4TaCc20A6Co24D/ocJ1CObFQ6Cs2QjfY7OE+gmHPZ6ICHBIp5CPrNEihmFvTbTqCYz6DfUwLFPAUDXhIo5SUYspZAKWuBdBQacRwM2UqglK1AOgptWL0OBr0nUMh7MOwigUIuAukoNGI7GLaRQCEbwYizBMo4C8acJlCGbHTcegJlrAfSUWiEbHTc9WoCRchG/7KZQBGbwbj9BIrYD8btJVDEXjBumvDNrl1dBRIEAQBs9LCHHe6unX98hLAz+0Hv8KriKBbiOZhwnMAiHAfqKAzifzDlPIFFOA+mrCWwCGvBlFd1FJbhNZh0kcACXATqKAxCG21xkMACHATTrhJYAG1UHYVRaKNtVhIotxKoozAIbbTNTQLlboIWuwmU2w2aPCVQ7Clo85VAsa+gzVsCc2ijzdRR+EOugkZ3CZS62w8afSTQTRutcZhAqcNAHYVBaKPtHhIo9RA0u06g0HXQ7jaBQreBOgqDeAva7SRQaCdot3+aQJlTbbTLfQJl7oMe3wl00UbrfCZQ5jPo8ZhAmcegy0sCRV6CPusJFFkP+hwlUOQo6LOVQJGtQB2FMWij/d4TKPEe9DpLoMR30Gs7gRLbQa/NBEpsBt1OEihwEqijMAhtdI6NBApsBOooDEIbneNyNYFft3oZzPAvgSbaaD11FAqcBXPsJfDr9gJ1FAahjaqjP+zaV04cQRQAwMcSTFxyNMEGk9/9z+dfS16BNB00LVWdo2AUJ8E0pwl0dhqoozAIbXSq9QQ6Ww+meVZHobPFczDRVQJd/QimOkigq4NAHYVBaKPTPSXQ1VMw2UkC39BG52ItgY7WgukuE+joMlBHYRDaaIm9BDraC9RRGMNVUOIjgW4+ghKHCXRzGJS4SaCbm6DIfQKd3AfqKAxCGy11lMBXtNEZuU2gk9tAHYVBaKPFHhPo4jEodZdAF3dBqZcEungJSu0m0MVuUGqpjkIX58ug2FsCHbwF6igM4igo955AB+9BuV8JdPA7qOBPAs39DGrYSGAlbXR+jhNo7jioYTuBlbTR+VmeJ7CCNjpHDwk09hDU8ZlAY59BHTsJNLYT1LGVwP+00XlSR6Gxs0AdhUFsBLVsJtDUZqCOwiC2g1quFwk0tLgOqnlNoKHXoJ6LBBq6COrZT6Ch/UAdhUFsBRWdJfAvbXTG/rJrXykNBUAAANcoVqyxl9hr9v7nU9EIQj534T2YOcdME2gzDUIdhXHQRmutJtBmNQh1FEZh8hyU2kigyUZQazeBJrvBF3UUxkAbrfaYQJPHoNhRAi2Ogm/qKIyANlrvLIEWZ8EPdRQGTxutt5NAi52g3HkCDc6Deh8JLGijA7efQIP9oN5lAg0ugwV1FIZtFnRYSaDcSvBLHYWh00Z7XCdQ7jr4o47CsGmjTR4SKPYQ9LhJoNhH0OMlgWIvQY/tBIptB01mCZSa7QVN3hIo9RZ0OUig1EHQ5T2BUu9Bl7sESt0Fba4SKHQV/KeOwmDdBH0OE9BGR0IdhdRGx2LvJIEyJ9poq9sEytwGneYJlJkHnbYS0EZH4j6BMvdBq6cEijwFvdYSKLIWLKGOwhAdBr02EyiyGfS6mCRQYnIRNHtNoMRr0O00gRKnwTLqKAzQVtBtPYES60G74wQKHAf9pgloo5/s2odR3VAQAMBj4JOzwTDkjIHrvz43QNJ7zEliduvYmVgk8AMWwbvUUZgebfRD6ihMjDZaYy2BbmtBhZ0Euu0EFbYT6LYdVLhPoNt9UOIwgU6HwcfUUZiUP0GNkwQ6nQQ1lhPotBzUeFRHoddjUOQ0gS6nwRfUUZgKbbTOXgJd9oIqZwl0OQs+p47CVGijlZYS6LAUfEodhenQRitdJNDhIqizlUCHraDQXQLN7oJKrwk0ew0qPSWgjc6EOgra6HxcJdDoajco9S8BbXQm9hNotB98TR2FSdBGq90k0OgmKHaeQJPzoNplAk0ug+9QR2ECnoJqmwk02Qyq7R4n0OBYGx3BdQINroN6bwloozPxkkCDl6DebQINboMRPCQw2EMwhpUEBlsJxnCQwGAHwRjWExhsPfg2dRQaaKPz95zAQM/BOP4mMNBbMI6NBAbaCMaxmsBAq8FIjhIY5CgYQh2FQbTR32KRwH927SsrbiAIAGCzsMakJRkTTDDxEfr+5+MEkmb4mZFe1TmqyjqooY5CLW10Ea5XCVRYXQfN7Cagjc6EOgpV/gbtHCZQ4TCopI5CFW10KdRRqHAWtHSeQLHzoJo6ChW00cXYTqDYdtDSqzoKxVavQVNXCRTaDdo6SqDQUfAT6igU00aX4zmBQs9BY2cJaKMzsZVAka2gtcsEilwGP6GOQiltdFEOEihyEDSnjkKRq6C9zwQKfAbtHSdQ4Dho7yaBAjdBB+4TmHQf9EAdBW10Nk4S0EZn4jaBSbdBD9RR0Ebn4ymBCU9BH+4SmHAX9OEtgQlvQR/2E5iwH/Rho47ChItN0In3BEa9B71QR2HCSdCLjwRGfQS9+J/AqMegGy8JjPgX9GMnAW10Jk4TGHEa9ON3AtroTGwuEtBGZ+IhgUEPQU++Ehj0FfRkL4FBe0FPfiWgjc6FOgqD/gR9UUdh0E7Ql3UCA9ZBX9RRvtm1r5sGoiAAgItBYHIOJpict//6OKGT5XD+3yfN1DGsNQ5qmYwSGDSaBMV8JjDoM6jmKoFBV0E1BwkMOgiqUUdhje2gnIsEtNFGnCcw4DyoRx0FbbQZmwkM2AzqUUdhyOg9KGgngRU7QUWHCaw4DCpSR0EbbcZrAiteg5LOElhyFtSkjoI22ozrBJZcBzWpo6CNNmM/gSX7QVE3CSy4Car6SUAbbcRxAguOg6puE1hwG5SljsKCaVDXRgJzNoK61FHQRptxn8Cc+6AudRS00Xa8JDDzElT2kMDMT1DZRwIzH0FlewnM7AWlTRPoTY+C0r4S6H0FtZ0k0DsJavtOoPcd1PaUQO8pKO4ugX93QXXqKPQegupOE9BGG6GOgjbajKPLBDqX2mgDHhPoPAb1/SbQ+Q3q201AG23EcwKd56ABbwnkW9CCrQRyK2iBOgqd06AF4wRyHLRgMkr+2LUPqwQAAIaCsfeugPSOQPafzzny8m+OQ73LXyHCwUC9g5BhYKDeQMhAHQX8IGS4NVDvVgjxbaDct5Diy0C5LyHFjYFyN0IK6ijq0UZzUEfRjjaa5M5AtTshx4uBai9CjmcD1Z6FHBsD1TZCkE8DxT6FJNRRVKONZhkaKDYUklwZKHYlJNlRR9FsJ0QZGag1ErJQR1GMNprmzUCtNyHL2ECtsRCGOopatNE8FwZKXQhpqKOoRRvNMzVQaiqkeTJQ6kmIszZQaS3kORmodBLy7A1Uoo0moo6iFG000txAofmrEOjPQCHaaKZ3A4XehUTUUVSijWZaGii0FCJNDNSZCJlmBurMhEzUURTaC5keDdR5FDK9/hgo80MbjbUwUGYhpDobKHMWUh0NlDkKqVYGyqyEWFsDVbZCrmsDVa6FXB8GqnwIue4NVLkXclFH0YU2mu2fXbuwDgOIoQDmcMOMDbRJg8/7z9c57luaQ58Ng3wWK7tpGEQbXdt+wyD7xcp2GwbZLZZ21TDGVbE2dZRBtNHV7TSMsVOsTR1lEG10dfebDUNs3heL22sYYq9YnTrKGDfF6o4ahjgqVqeOMoY2GkAdZYiLYn2XDSNcFutTRxlCG02w1TDCVrG+d3WUETbfiwB3DQNooxmOGwY4LhKoo4ygjWZ4axjgrYhw0RBPG02x0RBvo8hw2xDvtsjw2BBPG01x2BDvsAihjhLvrkjx0xDup0hx2hDutEjx0BDuoYjx3BDtucihjhJOG01y1hBNG02ijhLuscihjhJOG43y2hDstUjy1BDsqUjy0RDso0hy0BDsoEhyoo4S7PqkiPLVEOuryKKOEuysyPLdEOu7yPKnIdbfIsy/hlC/izTbDaG2izTnDaHOizS/GkJpo3lOrhsiaaOJXhoivRT/2bUPm4aiAAiChxE552wsWzhe//VRx9+3U8fwHCohHSKei0pIFxHPaSUk2yiSdVRIzxGRdVRItlGmk0pAJxGRdVRI5xHRx6wSzuwjQtpUwtlETK+VcF4jputKONcRk3VUQKcR1HMlGNso11MlmKeIyjoqHNso13ElmOOIyjoqmtlfhHVWCeUs4rqphHITcVlHBWMbJVtVQllFYI+VQB4jMuuoUGyjbG+VQN4iMuuoUGyjbFeVQK4itPdKGO8R274Shm2U7q4Sxl3E9lkJ4zOCs44KYx7RHVWCOIrorKPCsI3yfVeC+I7orKPCsI0OYFkJYRnx/VRC2Ed860oI64jvshLCZTSAeSWA+W00gG0lgG00gvtKAPfRCHaVAHbRCBaVABbREL4qTd5XNAbrqAB+ojE8VJo82+gorKMCsI2O4val0sS92EaH8Vtp4n6jURwqTdw/u3Zh1QAAwFAwFHen7gZt9p+POfLyb447Cy3uDYSjjfZYGwi3FmrsDETbCT2uDES7EnpQRxHuXehxZyDandBjPDAQbDAWihwNBDsKTX4MBPsRmlBHEe1eaHJjINiNUOXLQKwvocungVifQpdrA7GuhS6XBmLRRttQR5FrsBfK3BoIdSu0eTYQ6llo82Qg1JPQZmsg1Fao82Eg0ofQhzqKULTRRkMDkYZCH+ooQl0KffbUUWSijVYaGQg0EhpRRxGJNtrp1UCgV6HRxECgiVCJOopAtNFWFwbiXAidqKMIRBttNTMQZyZ0ejQQ51EotTEQZiO0OhkIcxJaHQyEoY32oo4iDm202MJAlMWLUOvXQBTaaLM3A1HehF7UUYShjTZbGYiyEopNDQSZCs3mBoLMhWbUUUQ5CM0eDAR5EJq9fBuI8U0bLbc0EGMpdDsbiHEWuv0Z+GfXPnDaCIAAAC6m9xqaAIWO0f7/fYlFgo/zB3Z1M++YNubBtD0mtPEYTNxLQhMvwdRtJDSxEUzdaUITp8HU7SQ0sRNMnTpKF9ooEe8JLbwHXCa0oI0SsZvQwm7AVkILWwFxkdDARYA6ShPaKAubCQ1sBqijNKGNsnAzSyhvdhPw13ZCedsB6ihNXAYsHCSUdxCgjtKENoo6ShdnAV/OE4o7D1BHaUIb5b/1hOLWA768qqMUN3sN+Oc6oTRtlKXDhNIOA9RRmtBGWXpOKO054NtZQmHaKENrCYWtBSxdJRR2FbB0l1CYNsrQfkJh+wHqKD1cBwx9JpT1GTB0nFDWccDQbUJZtwE/PCQU9RCgjtKENsrYSUJR2ijqKG3cBaijNKGNsuIpoaSngLH7hJLuA8beEkp6CxjbSyhpL2DsSB2lpF9HASs+Egr6CFBHaeIkYNU8oaB5wKrfyR/27jYpcSCKAmiDCEYQRAaqkJKZSRj5Ye9/fbOBoBDy0V11ziK64OW9e0nQ3wA1ThGScwhQZxIhOZMAddYRkrMOUOcpQnKsjVJvuY2QGGuj6PoiGxq+uOQcITHnAPU2ERKzCVBvFyExXwG0qZIJHapcUkVIzDSA4xzy4DCHy74iJEW2DGKSycZ7AKmj5EFJPfqfycZDgG+MIiRDnDumWORiLKkB2+7kwpY7P9mXEZJQ7gP84F0qFknY+kOIi0Jy4YoQYyxyYYCFXCxyoSyHay29WAxsZODO1fZOdLiF94pBLZWqMqCJ94rbvEYYyC6AHmjy8BjgZoUNUgawLQI0UClWpXelyD4a2lshpWcfxu00tzhG6M1xEeAO1SxCT85VgPus/MiiF1tfB2nBVGwyPdioTKUdxa8InXoTJkNr5i/jCJ0Zv8wDtKdyXEhnRnavaNvT7wgdmCkfpAvFIULLToZXdGT/eYrQotPnMkBXlgstYLTmsPZc0bHCk0UrDivPFT0onOtwt5kUGfry/GEvi3tsfBmkT9PXtwiNHHeucOjbv5V8Pxoo1yKvGMTDRIoyN9lO/BdkOPOVATxXKx//BBjU83/27nS5TRgKw7AFiM0obDbCIGJjx+Ax939/dTNNp80kkzaTheV9ftt/zxx9HB0pFmaB5gqTcY55KBpvuMTnFTASbcrVaLyq1HwWxMi4khF4vKBO2NSOUQoLLkfjLw9DuAJGq9JMZ+GXuvBXwMi55Fn4mVuxRhQT4aYXLhsumHVJSdkxKTujCLQWaeNEvCiBKaqkoNFaFi8htsKEraOGRw0XYtPQWmEG3NhhF83MbYVkfgHzEUrBZoeZsrzEZtkx5mZnhp5Ia2asfjCst8Jc7Xw6rdnY7hNDaIW5uwtTMq2puxeaYyCWo+oa7kpP1PHaMcSO5Tn7MmfmYVLuOQVi2dqg2JNqTYBVqojGCrilWlVE1Roxq2xSn2+BwPOqxXr4kXmsVaTrwMuqaBDkWqOwEUPErlDgTWs/ptn6RlbZSMODXMD/OAXaOTIa/6Wso6MD2irgne5cIxXd1uezSieJQpJ14AO4JlV7xuM/RbZXqWFBKPDR1mEgFZn8R8k8J4ltsirgU639SDc9/da7ZX2jI5+JdeAL7Vw7ThyPfOufbWuhZBBSqYDvc3g8KJYUrlfdl4+FisMfMB47146kymm5nmzrvZOkQdiuAIzWITSdvubeQtP5jZdfdWdoqIBpuWtDE2uV9w+zv1m9fehzpWMTtlz8AyZv11Z2lCZNvq/nMzyflftc6TTwK059wFytT76JUl00oj9ObDgiO/aiKXQaGf/Exz5geW7lyw5iqYurI7w6G1X/ZWW1J/JroWUc2JQoAM/tDqfQNkHcyWRQTi76ss6+oA/LsrrsRe6oIZFdHBg7PB242QfgXc7r1q1C3zZBFHdSyiRJCqWU4zi5EOLi/Vb/ofSeXIQQ+e3HSqni9lcpZRdHgbH9sHLb9XkFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+sAcHAgAAAABA/q+NoKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqoq7cEhAQAAAICg/69dYQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmAX108QvFVFX3AAAAAElFTkSuQmCC";
function Ue(e) {
  const n = Object.keys(e), t = [];
  return n.forEach((l) => {
    t.push(`${l}=${e[l]}`);
  }), t.join("&");
}
function Ta(e, n, t) {
  const a = new FormData();
  return Object.keys(e).forEach((o) => {
    a.append(o, e[o]);
  }), t === "file" ? n.forEach((o) => {
    a.append("file_name", o.name), a.append("object_file", o);
  }) : t === "folder" && (a.append("folder_name", n[0].name), n.forEach((o, i) => {
    a.append(`file[${i}].path`, o.webkitRelativePath), a.append(`file[${i}]`, o);
  })), a;
}
const cl = A(), Ft = A(), Dn = A(), Rt = A(), Fn = A(), Ot = A(!1), lt = A(), uu = g(() => {
  var n;
  const e = (n = Ft.value) == null ? void 0 : n.path_dirs[Ft.value.path_dirs.length - 1];
  return e ? {
    path: e.path,
    name: e.name,
    flat: lt.value ? "True" : "False"
  } : {
    path: "",
    name: "",
    flat: lt.value ? "True" : "False"
  };
});
function he(e = {}) {
  const n = A(), t = async () => {
    try {
      const u = await e.base.instance.get("ajax/s3-list-buckets/");
      cl.value = u.data.bucket_info, n.value = "";
    } catch (u) {
      u.response.status === 404 ? n.value = 'Endpoint not found. Please confirm you have installed and enabled the UI Extension "S3 File Manager" ' : n.value = `(${u.code}) ${u.name}: ${u.message}`;
    }
  }, a = async (u) => {
    try {
      Ot.value = !0;
      const c = await e.base.instance.get(
        `ajax/s3-browser-info/${u.id}/`
      );
      Dn.value = c.data.location, Rt.value = c.data.resource, Ft.value = c.data.state, Fn.value = c.data.state.full_path, lt.value = c.data.state.flat, Ot.value = !1, n.value = "";
    } catch (c) {
      n.value = `(${c.code}) ${c.name}: ${c.message}`;
    }
  }, l = async (u) => {
    Dn.value = u.location, Rt.value = u.resource, Ft.value = u.state, Fn.value = u.state.full_path;
  }, o = async (u) => {
    try {
      const c = Ue(u), f = await e.base.instance.post(
        `ajax/s3-browser-info/${Rt.value.id}/`,
        c
      );
      l(f.data);
    } catch (c) {
      n.value = `(${c.code}) ${c.name}: ${c.message}`;
    }
  };
  return {
    getBuckets: t,
    getResourceSelection: a,
    getFlattenedView: async () => {
      const u = {
        path: "",
        flat: lt.value ? "False" : "True"
      };
      try {
        Ot.value = !0;
        const c = Ue(u), f = await e.base.instance.post(
          `ajax/s3-browser-info/${Rt.value.id}/`,
          c
        );
        lt.value = !lt.value, l(f.data), Ot.value = !1;
      } catch (c) {
        n.value = `(${c.code}) ${c.name}: ${c.message}`;
      }
    },
    updateResourceSelection: l,
    fetchSelection: o,
    refreshResource: async () => o(uu.value),
    currentError: n,
    buckets: cl,
    bucketState: Ft,
    bucketLocation: Dn,
    bucketLoading: Ot,
    bucketResource: Rt,
    bucketPath: Fn,
    isFlat: lt
  };
}
function cu(e) {
  return Xo() ? (pe(e), !0) : !1;
}
function Uo(e) {
  return typeof e == "function" ? e() : X(e);
}
const No = typeof window < "u", du = () => {
};
function fu(e) {
  var n;
  const t = Uo(e);
  return (n = t == null ? void 0 : t.$el) != null ? n : t;
}
const vu = No ? window : void 0;
function tn(...e) {
  let n, t, a, l;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([t, a, l] = e, n = vu) : [n, t, a, l] = e, !n)
    return du;
  Array.isArray(t) || (t = [t]), Array.isArray(a) || (a = [a]);
  const o = [], i = () => {
    o.forEach((f) => f()), o.length = 0;
  }, s = (f, d, v, m) => (f.addEventListener(d, v, m), () => f.removeEventListener(d, v, m)), u = ae(
    () => [fu(n), Uo(l)],
    ([f, d]) => {
      i(), f && o.push(
        ...t.flatMap((v) => a.map((m) => s(f, v, m, d)))
      );
    },
    { immediate: !0, flush: "post" }
  ), c = () => {
    u(), i();
  };
  return cu(c), c;
}
function mu(e, n = {}) {
  const t = A(!1), a = te(null);
  let l = 0;
  if (No) {
    const o = typeof n == "function" ? { onDrop: n } : n, i = (s) => {
      var u, c;
      const f = Array.from((c = (u = s.dataTransfer) == null ? void 0 : u.files) != null ? c : []);
      return a.value = f.length === 0 ? null : f;
    };
    tn(e, "dragenter", (s) => {
      var u;
      s.preventDefault(), l += 1, t.value = !0, (u = o.onEnter) == null || u.call(o, i(s), s);
    }), tn(e, "dragover", (s) => {
      var u;
      s.preventDefault(), (u = o.onOver) == null || u.call(o, i(s), s);
    }), tn(e, "dragleave", (s) => {
      var u;
      s.preventDefault(), l -= 1, l === 0 && (t.value = !1), (u = o.onLeave) == null || u.call(o, i(s), s);
    }), tn(e, "drop", (s) => {
      var u;
      s.preventDefault(), l = 0, t.value = !1, (u = o.onDrop) == null || u.call(o, i(s), s);
    });
  }
  return {
    files: a,
    isOverDropZone: t
  };
}
const gu = A(null), Mn = A(), nn = A(!1), dl = A([]);
function $o() {
  const { bucketResource: e, bucketPath: n } = he(), t = g(() => ({
    bucket_name: e.value.name,
    path: n.value
  })), a = (i) => {
    i && (dl.value = i.filter((s) => s.type !== ""), nn.value = !0), i.findIndex((s) => s.type === "") || (Mn.value = !0, l());
  }, l = () => setTimeout(() => Mn.value = !1, 5e3);
  return {
    onDrop: a,
    clearModal: () => nn.value = !nn.value,
    clearError: l,
    dropZoneRef: gu,
    dropFilesForm: t,
    dropError: Mn,
    dropModal: nn,
    dropFiles: dl
  };
}
const yu = {
  key: 0,
  class: "text-grey-darken-3 text-none text-h6"
}, hu = {
  __name: "BucketBreadcrumbs",
  setup(e) {
    const n = se("api"), { bucketResource: t, bucketState: a, fetchSelection: l } = he(n), o = g(() => {
      let i = [
        {
          title: t.value.name,
          disabled: !1,
          path: {
            name: t.value.name,
            path: ""
          }
        }
      ];
      if (a.value.path_dirs.length > 0)
        for (let u of a.value.path_dirs)
          u.name && i.push({
            title: u.name,
            disabled: !1,
            path: {
              name: u.name,
              path: u.path
            }
          });
      const s = i[i.length - 1];
      return s.disabled = !0, i;
    });
    return (i, s) => (M(), G(hr, { class: "pl-0 my-1" }, {
      default: x(() => [
        (M(!0), Ce(ue, null, oa(o.value, (u, c) => (M(), G(wo, {
          key: u.title
        }, {
          default: x(() => [
            u.disabled ? (M(), Ce("div", yu, ne(u.title), 1)) : (M(), G(Y, {
              key: 1,
              class: "text-blue-darken-3 text-none text-h6 px-0",
              variant: "plain",
              onClick: (f) => X(l)(u.path)
            }, {
              default: x(() => [
                H(ne(u.title), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])),
            o.value.length - 1 > c && o.value.length > 1 ? (M(), G(Ao, {
              key: 2,
              class: "pr-0"
            }, {
              default: x(() => [
                r(oe, { icon: "mdi-slash-forward" })
              ]),
              _: 1
            })) : fe("", !0)
          ]),
          _: 2
        }, 1024))), 128))
      ]),
      _: 1
    }));
  }
}, Xt = {
  __name: "ErrorIcon",
  props: {
    error: {
      type: Object,
      default: () => {
      }
    },
    size: {
      type: String,
      default: "x-small"
    }
  },
  setup(e) {
    const n = e, t = g(
      () => n.error ? `(${n.error.code}) ${n.error.name}: ${n.error.message}` : void 0
    );
    return (a, l) => (M(), G(ht, {
      location: "start",
      text: t.value
    }, {
      activator: x(({ props: o }) => [
        t.value ? (M(), G(oe, U({ key: 0 }, o, {
          color: "error",
          size: e.size,
          icon: "mdi-alert-circle",
          class: "mt-1"
        }), null, 16, ["size"])) : fe("", !0)
      ]),
      _: 1
    }, 8, ["text"]));
  }
}, bu = {
  __name: "DownloadButton",
  props: {
    selectedItems: {
      type: Array,
      default: () => []
    }
  },
  setup(e) {
    const n = e, t = se("api"), { bucketResource: a, bucketLocation: l } = he(), o = A(), i = g(
      () => n.selectedItems.length === 0 || !n.selectedItems.every((c) => c.is_file)
    ), s = g(
      () => n.selectedItems.map((c) => ({
        path: c.url,
        location: l.value
      }))
    );
    async function u() {
      s.value.forEach(async (c) => {
        try {
          const f = Ue(c), d = await t.base.instance.post(
            `ajax/s3-download-file/${a.value.id}/`,
            f
          );
          d.status === 200 && window.open(d.data.url, "_blank");
        } catch (f) {
          o.value = f;
        }
      });
    }
    return (c, f) => (M(), Ce(ue, null, [
      r(Xt, { error: o.value }, null, 8, ["error"]),
      r(Y, {
        icon: "mdi-file-download",
        disabled: i.value,
        size: "x-large",
        title: "Download",
        onClick: u
      }, null, 8, ["disabled"])
    ], 64));
  }
};
const Cu = {
  __name: "CopyText",
  props: {
    textToCopy: {
      type: String,
      default: ""
    }
  },
  setup(e) {
    const n = e, t = A(!1), a = () => {
      navigator.clipboard.writeText(n.textToCopy), t.value = !0, setTimeout(() => {
        t.value = !1;
      }, 600);
    }, l = g(() => t.value ? "Copied!" : "Copy to clipboard");
    return (o, i) => (M(), G(ht, { location: "top" }, {
      activator: x(({ props: s }) => [
        r(oe, U({
          class: ["mr-1", t.value ? "green--text" : ""],
          size: "small"
        }, { ...s, ...o.$attrs }, { onClick: a }), {
          default: x(() => [
            H(ne(t.value ? "mdi-check" : "mdi-content-copy"), 1)
          ]),
          _: 2
        }, 1040, ["class"])
      ]),
      default: x(() => [
        F("span", null, ne(l.value), 1)
      ]),
      _: 1
    }));
  }
}, Dt = /* @__PURE__ */ jo(Cu, [["__scopeId", "data-v-12474ab0"]]), pu = { class: "mb-3" }, Su = /* @__PURE__ */ F("div", { class: "text-medium-emphasis" }, "Owner", -1), xu = { class: "mb-3" }, Au = /* @__PURE__ */ F("div", { class: "text-medium-emphasis" }, "AWS Region", -1), wu = { class: "mb-3" }, ku = /* @__PURE__ */ F("div", { class: "text-medium-emphasis" }, "Last Modified", -1), Vu = { class: "mb-3" }, _u = /* @__PURE__ */ F("div", { class: "text-medium-emphasis" }, "Size", -1), Iu = { class: "mb-3" }, Bu = /* @__PURE__ */ F("div", { class: "text-medium-emphasis" }, "Type", -1), Eu = { class: "mb-3" }, Pu = /* @__PURE__ */ F("div", { class: "text-medium-emphasis" }, "Key", -1), Tu = { class: "mb-3" }, Ru = /* @__PURE__ */ F("div", { class: "text-medium-emphasis" }, "S3 URI", -1), Ou = { class: "mb-3" }, Du = /* @__PURE__ */ F("div", { class: "text-medium-emphasis" }, "Amazon Resource Name (ARN)", -1), Fu = { class: "mb-3" }, Mu = /* @__PURE__ */ F("div", { class: "text-medium-emphasis" }, "Entity Tag (ETag)", -1), Lu = { class: "mb-3" }, zu = /* @__PURE__ */ F("div", { class: "text-medium-emphasis" }, "Object URL", -1), ju = ["href"], Uu = {
  __name: "OverviewTab",
  props: {
    ownerName: {
      type: String,
      default: ""
    },
    lastModified: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: ""
    },
    itemType: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    itemKey: {
      type: String,
      default: ""
    },
    uri: {
      type: String,
      default: ""
    },
    arn: {
      type: String,
      default: ""
    },
    eTag: {
      type: String,
      default: ""
    },
    objectUrl: {
      type: String,
      default: ""
    }
  },
  setup(e) {
    const n = e, { bucketLocation: t } = he(), a = g(
      () => n.eTag ? n.eTag.replace(/&quot;/g, "") : ""
    );
    return (l, o) => (M(), G(zr, null, {
      default: x(() => [
        r(Yr, null, {
          default: x(() => [
            r(ea, { cols: "6" }, {
              default: x(() => [
                F("div", pu, [
                  Su,
                  F("p", null, ne(e.ownerName), 1)
                ]),
                F("div", xu, [
                  Au,
                  F("p", null, ne(X(t)), 1)
                ]),
                F("div", wu, [
                  ku,
                  F("p", null, ne(e.lastModified), 1)
                ]),
                F("div", Vu, [
                  _u,
                  F("p", null, ne(e.size), 1)
                ]),
                F("div", Iu, [
                  Bu,
                  F("p", null, ne(e.itemType), 1)
                ]),
                F("div", Eu, [
                  Pu,
                  F("p", null, [
                    r(Dt, { "text-to-copy": e.itemKey }, null, 8, ["text-to-copy"]),
                    H(ne(e.itemKey), 1)
                  ])
                ])
              ]),
              _: 1
            }),
            r(ea, { cols: "6" }, {
              default: x(() => [
                F("div", Tu, [
                  Ru,
                  F("p", null, [
                    r(Dt, { "text-to-copy": e.uri }, null, 8, ["text-to-copy"]),
                    H(ne(e.uri), 1)
                  ])
                ]),
                F("div", Ou, [
                  Du,
                  F("p", null, [
                    r(Dt, { "text-to-copy": e.arn }, null, 8, ["text-to-copy"]),
                    H(ne(e.arn), 1)
                  ])
                ]),
                F("div", Fu, [
                  Mu,
                  F("p", null, [
                    r(Dt, { "text-to-copy": a.value }, null, 8, ["text-to-copy"]),
                    H(ne(a.value), 1)
                  ])
                ]),
                F("div", Lu, [
                  zu,
                  F("p", null, [
                    r(Dt, { "text-to-copy": e.objectUrl }, null, 8, ["text-to-copy"]),
                    F("a", {
                      target: "_blank",
                      href: e.objectUrl,
                      class: "text-decoration-none text-primary"
                    }, ne(e.objectUrl), 9, ju)
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }));
  }
}, na = {
  __name: "RestoreButton",
  props: {
    itemKey: {
      type: String,
      default: ""
    },
    path: {
      type: String,
      default: ""
    },
    versionId: {
      type: String,
      default: ""
    }
  },
  setup(e) {
    const n = e, t = se("api"), { bucketResource: a, refreshResource: l } = he(t), o = A(), i = g(() => ({
      key: n.itemKey,
      path: n.path,
      version_id: n.versionId,
      restore: "True"
    })), s = async () => {
      try {
        const u = Ue(i.value);
        await t.base.instance.post(
          `ajax/s3-promote-version/${a.value.id}/`,
          u
        ), l();
      } catch (u) {
        o.value = u;
      }
    };
    return (u, c) => (M(), Ce(ue, null, [
      r(Xt, { error: o.value }, null, 8, ["error"]),
      r(Y, {
        icon: "mdi-file-undo",
        title: "Restore File",
        onClick: s
      })
    ], 64));
  }
}, Nu = { key: 1 }, $u = { class: "mr-6" }, Qu = { class: "text-h5 mb-2" }, qu = { class: "font-weight-medium" }, Hu = { class: "text-body-1" }, Gu = {
  __name: "VersionTab",
  props: {
    name: {
      type: String,
      default: ""
    },
    versions: {
      type: Array,
      default: () => []
    },
    itemType: {
      type: String,
      default: ""
    },
    itemKey: {
      type: String,
      default: ""
    },
    eTag: {
      type: String,
      default: ""
    }
  },
  setup(e) {
    const n = e, t = A(!1), a = A(), l = A(), o = A(""), i = se("api"), { bucketLocation: s, bucketResource: u } = he(), c = g(
      () => n.eTag ? n.eTag.replace(/&quot;/g, "") : ""
    ), f = g(() => ({
      e_tag: encodeURIComponent(c.value),
      key: encodeURIComponent(n.itemKey),
      location: encodeURIComponent(s.value)
    })), d = g(() => ({
      bucket_name: encodeURIComponent(u.value.name)
    })), v = (b) => {
      const S = (/* @__PURE__ */ new Date(`${b.last_modified} UTC`)).toDateString(), p = (/* @__PURE__ */ new Date(
        `${b.last_modified} UTC`
      )).toLocaleTimeString("en-US");
      return `${S}  ${p}`;
    }, m = [
      { title: "Name", align: "start", key: "name" },
      { title: "Version ID", align: "start", key: "version_id" },
      { title: "Type", align: "start", key: "item_type" },
      { title: "Last Modified", align: "start", key: "last_modified" },
      { title: "Size", align: "start", key: "size" },
      { title: "Storage Class", align: "start", key: "storage_class" },
      { title: "Actions", align: "start", key: "actions", sortable: !1 }
    ], y = async () => {
      try {
        const b = Ue(f.value), S = await i.base.instance.post(
          `ajax/s3-get-versions/${u.value.id}/`,
          b
        );
        t.value = !1, l.value = S.data;
      } catch (b) {
        a.value = b;
      }
    }, h = async () => {
      try {
        const b = Ue(d.value), S = await i.base.instance.post(
          `ajax/s3-enable-versioning/${u.value.id}/`,
          b
        );
        o.value = S.data.message;
      } catch (b) {
        a.value = b;
      }
    }, C = (b) => {
      const S = b.replace(/&amp;/g, "&");
      window.open(S, "_blank");
    };
    return kt(y), ia(a.value = ""), (b, S) => {
      const p = Nt("VDataTable");
      return t.value ? (M(), G(Sn, {
        key: 0,
        indeterminate: ""
      })) : (M(), Ce("div", Nu, [
        l.value && !l.value.status ? (M(), G(al, { key: 0 }, {
          prepend: x(() => [
            r(oe, {
              color: "error",
              icon: "mdi-alert",
              class: "text-h3"
            })
          ]),
          default: x(() => [
            r(Xn, { class: "d-inline-flex justify-space-between pa-0" }, {
              default: x(() => [
                F("div", $u, [
                  F("p", Qu, [
                    H(" Bucket "),
                    F("span", qu, ne(b.resource.name), 1),
                    H(" doesn't have Bucket Versioning enabled ")
                  ]),
                  F("p", Hu, [
                    H(" We recommend that you enable Bucket Versioning to help protect against unintentionally overwriting or deleting objects. "),
                    r(Y, {
                      "append-icon": "mdi-information",
                      href: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html",
                      target: "_blank",
                      variant: "text",
                      class: "text-capitalize font-weight-regular text-body-1"
                    }, {
                      default: x(() => [
                        H("Learn more")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                r(Y, {
                  title: "Enable Bucket Versioning",
                  color: "primary",
                  variant: "flat",
                  size: "large",
                  onClick: h
                }, {
                  default: x(() => [
                    H("Enable Bucket Versioning")
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })) : fe("", !0),
        o.value ? (M(), G(al, { key: 1 }, {
          prepend: x(() => [
            r(oe, {
              color: "success",
              icon: "mdi-check-circle",
              class: "text-h3"
            })
          ]),
          default: x(() => [
            r(Xn, { class: "text-h5 mt-1" }, {
              default: x(() => [
                H(ne(o.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        })) : fe("", !0),
        r(p, {
          headers: m,
          items: e.versions,
          "show-expand": !1
        }, {
          ["item.name"]: x(() => [
            H(ne(e.name), 1)
          ]),
          ["item.item_type"]: x(() => [
            H(ne(e.itemType), 1)
          ]),
          ["item.last_modified"]: x(({ item: w }) => [
            H(ne(v(w.raw)), 1)
          ]),
          ["item.actions"]: x(({ item: w }) => [
            r(Xt, {
              size: "large",
              error: a.value
            }, null, 8, ["error"]),
            r(pt, null, {
              default: x(() => [
                r(Y, {
                  icon: "mdi-file-download",
                  title: "Download",
                  onClick: () => C(w.raw.download_url)
                }, null, 8, ["onClick"]),
                r(na, {
                  "item-key": w.raw.key,
                  path: w.raw.path,
                  "version-id": w.raw.version_id
                }, null, 8, ["item-key", "path", "version-id"])
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1032, ["items"])
      ]));
    };
  }
}, Ku = {
  __name: "OverviewModal",
  props: {
    sourceItem: {
      type: Object,
      default: () => {
      }
    }
  },
  setup(e) {
    const n = e, t = A(null), a = A(!1), l = g(() => ({
      ownerName: n.sourceItem.owner_name,
      itemKey: n.sourceItem.key,
      lastModified: n.sourceItem.last_modified,
      itemType: n.sourceItem.item_type,
      uri: n.sourceItem.s3_uri,
      eTag: n.sourceItem.e_tag,
      objectUrl: n.sourceItem.object_url,
      ...n.sourceItem
    })), o = A(!1);
    return (i, s) => (M(), G(at, {
      modelValue: a.value,
      "onUpdate:modelValue": s[4] || (s[4] = (u) => a.value = u),
      width: "1024"
    }, {
      activator: x(({ props: u }) => [
        r(Y, U(u, {
          icon: "mdi-information",
          title: "Details"
        }), null, 16)
      ]),
      default: x(() => [
        r(Ye, { class: "pa-3" }, {
          default: x(() => [
            r(Ke, { class: "d-inline-flex justify-space-between pb-0" }, {
              default: x(() => [
                r(au, {
                  modelValue: t.value,
                  "onUpdate:modelValue": s[0] || (s[0] = (u) => t.value = u),
                  "slider-color": "green",
                  height: "50px",
                  "selected-class": "bg-primary text-white"
                }, {
                  default: x(() => [
                    r(ta, {
                      class: "active tab-btn",
                      value: "overview",
                      size: "x-large"
                    }, {
                      default: x(() => [
                        H("Overview")
                      ]),
                      _: 1
                    }),
                    o.value ? (M(), G(ta, {
                      key: 0,
                      class: "tab-btn",
                      value: "versions",
                      size: "x-large"
                    }, {
                      default: x(() => [
                        H("Versions")
                      ]),
                      _: 1
                    })) : fe("", !0)
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                r(Y, {
                  icon: "mdi-close",
                  title: "Close this dialog",
                  variant: "text",
                  onClick: s[1] || (s[1] = (u) => a.value = !1)
                })
              ]),
              _: 1
            }),
            r(nt, { class: "pt-0" }, {
              default: x(() => [
                r(Pr, {
                  modelValue: t.value,
                  "onUpdate:modelValue": s[2] || (s[2] = (u) => t.value = u)
                }, {
                  default: x(() => [
                    r(ll, { value: "overview" }, {
                      default: x(() => [
                        r(Uu, Ln(Ra(l.value)), null, 16)
                      ]),
                      _: 1
                    }),
                    r(ll, { value: "versions" }, {
                      default: x(() => [
                        r(Gu, Ln(Ra(l.value)), null, 16)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ]),
              _: 1
            }),
            r(gt, { class: "d-flex justify-end px-3 mb-1" }, {
              default: x(() => [
                r(Y, {
                  color: "primary",
                  variant: "flat",
                  size: "large",
                  class: "px-4",
                  onClick: s[3] || (s[3] = (u) => a.value = !1)
                }, {
                  default: x(() => [
                    H("OK")
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]));
  }
}, Yu = {
  __name: "RenameModal",
  props: {
    name: {
      type: String,
      required: !0
    }
  },
  setup(e) {
    const n = e, t = se("api"), { bucketPath: a, bucketResource: l, refreshResource: o, isFlat: i } = he(t), s = A(!1), u = A(!1), c = A(!1), f = A(), d = A(""), v = A(""), m = g(() => ({
      old_object_name: d.value,
      new_object_name: v.value,
      path: a.value,
      bucket_name: l.value.name
    })), y = [
      (b) => !!b || "This field is required",
      (b) => b !== d.value || "New name needs to be different"
    ], h = () => {
      u.value = !1, v.value = d.value, f.value = "";
    };
    ae(
      () => u.value === !0,
      () => {
        if (i.value) {
          const b = n.name.split("/").slice(-1);
          d.value = b, v.value = b;
        } else
          d.value = n.name, v.value = n.name;
      }
    );
    async function C() {
      try {
        s.value = !0;
        const b = Ue(m.value);
        await t.base.instance.post(
          `ajax/s3-rename-object/${l.value.id}/`,
          b
        ), s.value = !1, u.value = !1, o();
      } catch (b) {
        f.value = `(${b.code}) ${b.name}: ${b.message}`, c.value = !1, s.value = !1;
      }
    }
    return (b, S) => (M(), G(at, {
      modelValue: u.value,
      "onUpdate:modelValue": [
        S[2] || (S[2] = (p) => u.value = p),
        S[3] || (S[3] = (p) => !p && h())
      ],
      width: "1024"
    }, {
      activator: x(({ props: p }) => [
        r(Y, U(p, {
          icon: "mdi-pencil-circle",
          title: "Rename"
        }), null, 16)
      ]),
      default: x(() => [
        r(Ye, { class: "pa-3" }, {
          default: x(() => [
            r(yt, {
              onSubmit: ft(C, ["prevent"]),
              "onUpdate:modelValue": S[1] || (S[1] = (p) => c.value = p)
            }, {
              default: x(() => [
                r(Ke, { class: "w-100 d-inline-flex justify-space-between text-h5" }, {
                  default: x(() => [
                    H(" Rename File "),
                    r(Y, {
                      icon: "mdi-close",
                      title: "Close this dialog",
                      variant: "text",
                      onClick: h
                    })
                  ]),
                  _: 1
                }),
                r(nt, null, {
                  default: x(() => [
                    r(mn, {
                      modelValue: v.value,
                      "onUpdate:modelValue": S[0] || (S[0] = (p) => v.value = p),
                      label: "New File Name",
                      placeholder: "Enter name here",
                      type: "text",
                      rules: y,
                      required: ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                r(gt, { class: "d-flex justify-end px-3 mb-1" }, {
                  default: x(() => [
                    r(ht, {
                      location: "start",
                      text: f.value
                    }, {
                      activator: x(({ props: p }) => [
                        f.value ? (M(), G(oe, U({ key: 0 }, p, {
                          color: "error",
                          size: "large",
                          icon: "mdi-alert-circle",
                          class: "mt-1"
                        }), null, 16)) : fe("", !0)
                      ]),
                      _: 1
                    }, 8, ["text"]),
                    r(Y, {
                      "prepend-icon": "mdi-close",
                      variant: "flat",
                      size: "large",
                      class: "px-4 mx-2",
                      onClick: h
                    }, {
                      default: x(() => [
                        H("Cancel")
                      ]),
                      _: 1
                    }),
                    r(Y, {
                      loading: s.value,
                      disabled: !c.value,
                      type: "submit",
                      variant: "flat",
                      color: "primary",
                      size: "large",
                      width: s.value ? "150" : "100",
                      class: "px-4"
                    }, {
                      loader: x(() => [
                        H("Submitting…")
                      ]),
                      default: x(() => [
                        H("Rename ")
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled", "width"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onSubmit"])
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]));
  }
}, Wu = {
  __name: "FolderButton",
  props: {
    url: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    }
  },
  setup(e) {
    const n = e, t = A(""), a = A(""), l = se("api"), { fetchSelection: o } = he(l), i = g(() => ({
      path: t.value,
      // Encoding path early leads to double encoding '/'
      name: encodeURIComponent(a.value)
    }));
    return gl(() => {
      t.value = encodeURIComponent(n.url), a.value = encodeURIComponent(n.name);
    }), (s, u) => (M(), G(yt, {
      onSubmit: u[0] || (u[0] = ft((c) => X(o)(i.value), ["prevent"]))
    }, {
      default: x(() => [
        r(Y, {
          variant: "text",
          title: e.name,
          type: "submit",
          class: "text-none font-weight-regular text-body-1",
          color: "blue-darken-3"
        }, {
          default: x(() => [
            H(ne(e.name), 1)
          ]),
          _: 1
        }, 8, ["title"])
      ]),
      _: 1
    }));
  }
}, Zu = { class: "d-inline-flex" }, Ju = {
  key: 3,
  class: "ml-4"
}, Xu = {
  key: 0,
  class: "d-inline-flex"
}, ec = /* @__PURE__ */ F("td", null, null, -1), tc = { class: "mx-2" }, nc = /* @__PURE__ */ F("span", { class: "ml-2 text-disabled" }, "Version Id", -1), ac = /* @__PURE__ */ F("td", null, null, -1), lc = {
  __name: "NestedTable",
  props: {
    isVersionMode: {
      type: Boolean,
      default: !1
    },
    selectedItems: {
      type: Array,
      default: () => []
    },
    updatedSelectedItems: {
      type: Function,
      default: () => {
      }
    }
  },
  emits: ["update:items"],
  setup(e, { emit: n }) {
    const { bucketLoading: t } = he(), a = A([]), l = [
      { title: "Name", align: "start", key: "name" },
      { title: "Type", align: "end", key: "item_type" },
      { title: "Last Modified", align: "start", key: "last_modified" },
      { title: "Size", align: "end", key: "actual_size" },
      { title: "Storage Class", align: "end", key: "storage_class" },
      { title: "Actions", align: "center", key: "actions", sortable: !1 }
    ], o = [
      { title: "Name", align: "start", key: "name" },
      { title: "Type", align: "start", key: "item_type" },
      { title: "Last Modified", align: "start", key: "last_modified" },
      { title: "Size", align: "start", key: "actual_size" },
      { title: "Storage Class", align: "start", key: "storage_class" },
      { title: "Actions", align: "start", key: "actions", sortable: !1 },
      { title: "", align: "center", key: "data-table-expand", sortable: !1 }
    ], i = (u) => {
      const c = (/* @__PURE__ */ new Date(`${u.last_modified} UTC`)).toDateString(), f = (/* @__PURE__ */ new Date(
        `${u.last_modified} UTC`
      )).toLocaleTimeString("en-US");
      return `${c}  ${f}`;
    }, s = (u) => {
      const c = u.replace(/&amp;/g, "&");
      window.open(c, "_blank");
    };
    return (u, c) => {
      const f = Nt("VDataTable");
      return M(), G(f, {
        expanded: a.value,
        "onUpdate:expanded": c[0] || (c[0] = (d) => a.value = d),
        headers: e.isVersionMode ? o : l,
        "item-value": (d) => d,
        loading: X(t),
        "show-select": "",
        "show-expand": !!e.isVersionMode,
        "onUpdate:modelValue": c[1] || (c[1] = (d) => n("update:items", d))
      }, {
        ["item.name"]: x(({ item: d }) => [
          F("td", Zu, [
            d.raw.nested_version ? (M(), G(oe, {
              key: 0,
              icon: "mdi-arrow-up-left",
              class: "ml-4"
            })) : (M(), G(oe, {
              key: 1,
              icon: d.raw.is_file ? "mdi-file" : "mdi-folder",
              color: "blue-darken-3",
              class: "align-self-center"
            }, null, 8, ["icon"])),
            d.raw.is_file ? (M(), Ce("div", Ju, ne(d.raw.name), 1)) : (M(), G(Wu, Ln(U({ key: 2 }, d.raw)), null, 16))
          ])
        ]),
        ["item.last_modified"]: x(({ item: d }) => [
          H(ne(d.raw.is_file ? i(d.raw) : ""), 1)
        ]),
        ["item.actual_size"]: x(({ item: d }) => [
          H(ne(d.raw.size), 1)
        ]),
        ["item.actions"]: x(({ item: d }) => [
          d.raw.is_file ? (M(), Ce("td", Xu, [
            r(pt, { variant: "text" }, {
              default: x(() => [
                e.isVersionMode ? (M(), G(Y, {
                  key: 0,
                  icon: "mdi-file-download",
                  title: "Download",
                  disabled: d.raw.is_delete_marker,
                  onClick: (v) => s(d.raw.download_url)
                }, null, 8, ["disabled", "onClick"])) : fe("", !0),
                e.isVersionMode ? (M(), G(na, {
                  key: 1,
                  "item-key": d.raw.key,
                  path: d.raw.path,
                  "version-id": d.raw.version_id
                }, null, 8, ["item-key", "path", "version-id"])) : fe("", !0),
                r(Yu, {
                  name: d.raw.name
                }, null, 8, ["name"]),
                r(Ku, {
                  "source-item": d.raw
                }, null, 8, ["source-item"])
              ]),
              _: 2
            }, 1024)
          ])) : fe("", !0)
        ]),
        ["item.data-table-expand"]: x(({ item: d, isExpanded: v, toggleExpand: m }) => [
          d.raw.is_file ? (M(), G(oe, {
            key: 0,
            icon: v ? "mdi-menu-down" : "mdi-menu-up",
            onClick: (y) => m(d)
          }, null, 8, ["icon", "onClick"])) : fe("", !0)
        ]),
        "expanded-row": x(({ item: d }) => {
          var v;
          return [
            (M(!0), Ce(ue, null, oa((v = d.raw) == null ? void 0 : v.versions, (m, y) => (M(), Ce("tr", { key: y }, [
              ec,
              F("td", null, [
                r(oe, {
                  icon: "mdi-arrow-up-left",
                  class: "ml-4 mt-n1"
                }),
                F("span", tc, ne(m.version_id), 1),
                nc
              ]),
              F("td", null, ne(d.raw.item_type), 1),
              F("td", null, ne(i(m)), 1),
              F("td", null, ne(m.size), 1),
              F("td", null, ne(m.storage_class), 1),
              F("td", null, [
                r(pt, { variant: "text" }, {
                  default: x(() => [
                    r(Y, {
                      icon: "mdi-file-download",
                      title: "Download",
                      disabled: m.is_delete_marker,
                      onClick: (h) => s(m.download_url)
                    }, null, 8, ["disabled", "onClick"]),
                    r(na, {
                      "item-key": m.key,
                      path: m.path,
                      "version-id": m.version_id
                    }, null, 8, ["item-key", "path", "version-id"])
                  ]),
                  _: 2
                }, 1024)
              ]),
              ac
            ]))), 128))
          ];
        }),
        _: 2
      }, 1032, ["expanded", "headers", "item-value", "loading", "show-expand"]);
    };
  }
}, oc = { class: "font-italic" }, ic = { class: "pl-8" }, sc = {
  __name: "CreateModal",
  setup(e) {
    const n = se("api"), { bucketPath: t, bucketResource: a, refreshResource: l } = he(n), o = A(""), i = g(() => ({
      folder_name: o.value,
      path: t.value,
      bucket_name: a.value.name
    })), s = A(!1), u = A(), c = A(!1), f = A(!1), d = [
      (y) => !!y || "This field is required",
      (y) => !y.includes("/") || "Folder names can't contain '/''"
    ], v = () => {
      f.value = !1, o.value = "", u.value = "";
    };
    async function m() {
      try {
        c.value = !0;
        const y = Ue(i.value);
        await n.base.instance.post(
          `ajax/s3-create-folder/${a.value.id}/`,
          y
        ), c.value = !1, f.value = !1, o.value = "", l();
      } catch (y) {
        u.value = `(${y.code}) ${y.name}: ${y.message}`, s.value = !1, c.value = !1;
      }
    }
    return (y, h) => {
      const C = Nt("VCardAction");
      return M(), G(at, {
        modelValue: f.value,
        "onUpdate:modelValue": [
          h[2] || (h[2] = (b) => f.value = b),
          h[3] || (h[3] = (b) => !b && v())
        ],
        width: "1024"
      }, {
        activator: x(({ props: b }) => [
          r(Y, U(b, {
            icon: "mdi-folder-plus",
            title: "Add New Folder",
            size: "x-large"
          }), null, 16)
        ]),
        default: x(() => [
          r(Ye, { class: "pa-3" }, {
            default: x(() => [
              r(yt, {
                onSubmit: ft(m, ["prevent"]),
                "onUpdate:modelValue": h[1] || (h[1] = (b) => s.value = b)
              }, {
                default: x(() => [
                  r(Ke, { class: "w-100 d-inline-flex justify-space-between text-h5" }, {
                    default: x(() => [
                      F("div", null, [
                        H(" Create folder at "),
                        F("span", oc, ne(X(t) ? X(t) : "Root folder"), 1)
                      ]),
                      r(Y, {
                        icon: "mdi-close",
                        title: "Close this dialog",
                        variant: "text",
                        onClick: v
                      })
                    ]),
                    _: 1
                  }),
                  r(nt, null, {
                    default: x(() => [
                      r(ea, { cols: "12" }, {
                        default: x(() => [
                          r(mn, {
                            modelValue: o.value,
                            "onUpdate:modelValue": h[0] || (h[0] = (b) => o.value = b),
                            label: "Folder Name",
                            placeholder: "Enter folder name",
                            "prepend-icon": "mdi-folder-plus",
                            type: "text",
                            rules: d,
                            required: ""
                          }, null, 8, ["modelValue"]),
                          F("span", ic, [
                            r(Y, {
                              "prepend-icon": "mdi-information",
                              href: "https://docs.aws.amazon.com/console/s3/object-keys",
                              target: "_blank",
                              variant: "text",
                              class: "text-capitalize font-weight-regular text-body-1"
                            }, {
                              default: x(() => [
                                H("See rules for naming")
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  r(C, { class: "d-flex justify-end px-3 mb-1" }, {
                    default: x(() => [
                      r(ht, {
                        location: "start",
                        text: u.value
                      }, {
                        activator: x(({ props: b }) => [
                          u.value ? (M(), G(oe, U({ key: 0 }, b, {
                            color: "error",
                            size: "large",
                            icon: "mdi-alert-circle",
                            class: "mt-1"
                          }), null, 16)) : fe("", !0)
                        ]),
                        _: 1
                      }, 8, ["text"]),
                      r(Y, {
                        "prepend-icon": "mdi-close",
                        variant: "flat",
                        size: "large",
                        class: "px-4 mx-2",
                        onClick: v
                      }, {
                        default: x(() => [
                          H("Cancel")
                        ]),
                        _: 1
                      }),
                      r(Y, {
                        loading: c.value,
                        disabled: !s.value,
                        width: c.value ? "150" : "100",
                        "prepend-icon": "mdi-folder-plus",
                        type: "submit",
                        variant: "flat",
                        color: "primary",
                        size: "large",
                        class: "pr-4 pl-6"
                      }, {
                        loader: x(() => [
                          H("Submitting…")
                        ]),
                        default: x(() => [
                          H("Create ")
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "width"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["onSubmit"])
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]);
    };
  }
}, rc = /* @__PURE__ */ F("span", null, "Delete Confirmation", -1), uc = { class: "text-h6" }, cc = /* @__PURE__ */ F("p", { class: "text-body-1" }, " Note: If you have selected a folder, all objects in that folder will also be deleted. ", -1), dc = {
  __name: "DeleteModal",
  props: {
    selectedItems: {
      type: Array,
      default: () => []
    }
  },
  setup(e) {
    const n = e, t = se("api"), { bucketResource: a, refreshResource: l } = he(t), o = A(), i = A(!1), s = A(!1), u = g(() => !!(n.selectedItems.length === 0 || n.selectedItems.find((m) => m.is_delete_marker))), c = g(() => {
      const m = [];
      return n.selectedItems.forEach((y) => {
        m.push({
          file_path: y.url,
          object_type: y.item_type
        });
      }), m;
    }), f = g(() => ({
      all_files_path: JSON.stringify(c.value)
    })), d = () => {
      i.value = !1, o.value = "";
    };
    async function v() {
      try {
        s.value = !0;
        const m = Ue(f.value);
        await t.base.instance.post(
          `ajax/s3-delete-file/${a.value.id}/`,
          m
        ), s.value = !1, i.value = !1, l();
      } catch (m) {
        o.value = `(${m.code}) ${m.name}: ${m.message}`, s.value = !1;
      }
    }
    return (m, y) => {
      const h = Nt("VCardAction");
      return M(), G(at, {
        modelValue: i.value,
        "onUpdate:modelValue": [
          y[0] || (y[0] = (C) => i.value = C),
          y[1] || (y[1] = (C) => !C && d())
        ],
        width: "1024"
      }, {
        activator: x(({ props: C }) => [
          r(Y, U(C, {
            disabled: u.value,
            icon: "mdi-delete",
            title: "Delete",
            size: "x-large"
          }), null, 16, ["disabled"])
        ]),
        default: x(() => [
          r(yt, {
            onSubmit: ft(v, ["prevent"])
          }, {
            default: x(() => [
              r(Ye, {
                class: "pa-3",
                density: "compact"
              }, {
                default: x(() => [
                  r(Ke, { class: "w-100 d-inline-flex justify-space-between text-h5" }, {
                    default: x(() => [
                      rc,
                      r(Y, {
                        icon: "mdi-close",
                        title: "Close this dialog",
                        "data-dismiss": "modal",
                        variant: "text",
                        onClick: d
                      })
                    ]),
                    _: 1
                  }),
                  r(nt, { class: "py-0 ml-3" }, {
                    default: x(() => [
                      F("p", uc, [
                        r(oe, {
                          color: "error",
                          icon: "mdi-alert",
                          class: "text-h5"
                        }),
                        H(" Are you sure you want to delete? ")
                      ]),
                      cc
                    ]),
                    _: 1
                  }),
                  r(h, { class: "d-flex justify-end px-3 mb-1" }, {
                    default: x(() => [
                      r(ht, {
                        location: "start",
                        text: o.value
                      }, {
                        activator: x(({ props: C }) => [
                          o.value ? (M(), G(oe, U({ key: 0 }, C, {
                            color: "error",
                            size: "large",
                            icon: "mdi-alert-circle",
                            class: "mt-1"
                          }), null, 16)) : fe("", !0)
                        ]),
                        _: 1
                      }, 8, ["text"]),
                      r(Y, {
                        "prepend-icon": "mdi-close",
                        variant: "flat",
                        size: "large",
                        class: "px-4 mx-2",
                        onClick: d
                      }, {
                        default: x(() => [
                          H("Cancel")
                        ]),
                        _: 1
                      }),
                      r(Y, {
                        loading: s.value,
                        width: s.value ? "150" : "100",
                        "prepend-icon": "mdi-delete",
                        variant: "flat",
                        color: "primary",
                        size: "large",
                        class: "px-4",
                        type: "submit"
                      }, {
                        loader: x(() => [
                          H("Deleting...")
                        ]),
                        default: x(() => [
                          H("Delete ")
                        ]),
                        _: 1
                      }, 8, ["loading", "width"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["onSubmit"])
        ]),
        _: 1
      }, 8, ["modelValue"]);
    };
  }
}, Qo = {
  __name: "MultiFileChips",
  props: {
    fileNames: {
      type: Array,
      default: () => [String]
    }
  },
  setup(e) {
    return (n, t) => (M(!0), Ce(ue, null, oa(e.fileNames, (a, l) => (M(), Ce(ue, null, [
      l < 5 ? (M(), G(wa, {
        key: a,
        variant: "outlined",
        class: "me-2"
      }, {
        default: x(() => [
          H(ne(a), 1)
        ]),
        _: 2
      }, 1024)) : l === 5 ? (M(), Ce("span", {
        key: `fileCount_${a}`,
        class: "text-overline text-grey-darken-3 mx-2"
      }, " + " + ne(e.fileNames.length - 5) + " File(s) ", 1)) : fe("", !0)
    ], 64))), 256));
  }
}, fc = { class: "font-italic" }, vc = {
  __name: "MultiFileModal",
  setup(e) {
    const n = se("api"), { bucketResource: t, refreshResource: a } = he(n), { dropModal: l, dropFiles: o, dropFilesForm: i, clearModal: s } = $o(), u = A(!1), c = A([]), f = A(!1), d = A(), v = A(!1), m = g(
      () => o.value && o.value.length > 0
    ), y = () => {
      s(), v.value = !1, d.value = "", c.value = [];
    };
    gl(() => {
      m.value && i.value && l.value && (v.value = !0, c.value = o.value);
    });
    async function h() {
      try {
        u.value = !0;
        for (const C of o.value) {
          const b = Ta(
            i.value,
            [C],
            "file"
          );
          await n.base.instance.post(
            `ajax/s3-upload-new-object/${t.value.id}/`,
            b
          );
        }
        u.value = !1, v.value = !1, c.value = [], a(), s();
      } catch (C) {
        d.value = `(${C.code}) ${C.name}: ${C.message}`, f.value = !1, u.value = !1;
      }
    }
    return (C, b) => (M(), G(at, {
      modelValue: v.value,
      "onUpdate:modelValue": [
        b[2] || (b[2] = (S) => v.value = S),
        b[3] || (b[3] = (S) => !S && y())
      ],
      width: "1024"
    }, {
      default: x(() => [
        r(Ye, { class: "pa-3" }, {
          default: x(() => [
            r(yt, {
              onSubmit: ft(h, ["prevent"]),
              "onUpdate:modelValue": b[1] || (b[1] = (S) => f.value = S)
            }, {
              default: x(() => [
                r(Ke, { class: "w-100 d-inline-flex justify-space-between text-h5" }, {
                  default: x(() => [
                    F("div", null, [
                      H(" Upload " + ne(c.value.length > 1 ? c.value.length : "") + " file(s) to ", 1),
                      F("span", fc, ne(X(i).path ? X(i).path : "Root folder"), 1)
                    ]),
                    r(Y, {
                      icon: "mdi-close",
                      title: "Close",
                      "data-dismiss": "modal",
                      variant: "text",
                      onClick: y
                    })
                  ]),
                  _: 1
                }),
                r(nt, null, {
                  default: x(() => [
                    r(Ba, {
                      modelValue: c.value,
                      "onUpdate:modelValue": b[0] || (b[0] = (S) => c.value = S),
                      multiple: "",
                      disabled: "",
                      label: "Selected Files",
                      class: "showInput"
                    }, {
                      selection: x(({ fileNames: S }) => [
                        r(Qo, { "file-names": S }, null, 8, ["file-names"])
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                r(gt, { class: "d-flex justify-end px-3 mb-1" }, {
                  default: x(() => [
                    r(ht, {
                      location: "start",
                      text: d.value
                    }, {
                      activator: x(({ props: S }) => [
                        d.value ? (M(), G(oe, U({ key: 0 }, S, {
                          color: "error",
                          size: "large",
                          icon: "mdi-alert-circle",
                          class: "mt-1"
                        }), null, 16)) : fe("", !0)
                      ]),
                      _: 1
                    }, 8, ["text"]),
                    r(Y, {
                      "prepend-icon": "mdi-close",
                      variant: "flat",
                      size: "large",
                      class: "px-4 mx-2",
                      onClick: y
                    }, {
                      default: x(() => [
                        H("Cancel")
                      ]),
                      _: 1
                    }),
                    r(Y, {
                      loading: u.value,
                      "prepend-icon": "mdi-file-upload",
                      disabled: !f.value,
                      variant: "flat",
                      color: "primary",
                      size: "large",
                      class: "px-4",
                      type: "submit"
                    }, {
                      loader: x(() => [
                        H("Uploading...")
                      ]),
                      default: x(() => [
                        H("Upload to S3 ")
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onSubmit"])
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]));
  }
}, mc = { class: "font-italic" }, gc = {
  __name: "FileUpload",
  emits: ["closeDialog"],
  setup(e, { emit: n }) {
    const t = se("api"), { bucketPath: a, bucketResource: l, refreshResource: o } = he(t), i = A(!1), s = A([]), u = A({
      bucket_name: l.value.name,
      path: a.value
    }), c = A(!1), f = A(), d = A(!1), v = [(h) => h.length > 0 || "This field is required"], m = () => {
      n("closeDialog"), d.value = !1, f.value = "", s.value = [];
    };
    async function y() {
      try {
        i.value = !0;
        const h = Ta(
          u.value,
          s.value,
          "file"
        );
        await t.base.instance.post(
          `ajax/s3-upload-new-object/${l.value.id}/`,
          h
        ), n("closeDialog"), i.value = !1, d.value = !1, s.value = [], o();
      } catch (h) {
        f.value = h, c.value = !1, i.value = !1;
      }
    }
    return (h, C) => (M(), G(at, {
      modelValue: d.value,
      "onUpdate:modelValue": [
        C[2] || (C[2] = (b) => d.value = b),
        C[3] || (C[3] = (b) => !b && m())
      ],
      width: "1024"
    }, {
      activator: x(({ props: b }) => [
        r(Y, U({ "prepend-icon": "mdi-file-upload" }, b, {
          variant: "flat",
          color: "primary",
          size: "x-large",
          title: "Upload New File",
          class: "px-4 flex-grow-1"
        }), {
          default: x(() => [
            H("Upload a File")
          ]),
          _: 2
        }, 1040)
      ]),
      default: x(() => [
        r(Ye, { class: "pa-3" }, {
          default: x(() => [
            r(yt, {
              onSubmit: ft(y, ["prevent"]),
              "onUpdate:modelValue": C[1] || (C[1] = (b) => c.value = b)
            }, {
              default: x(() => [
                r(Ke, { class: "w-100 d-inline-flex justify-space-between text-h5" }, {
                  default: x(() => [
                    F("div", null, [
                      H(" Upload file to "),
                      F("span", mc, ne(X(a) ? X(a) : "Root folder"), 1)
                    ]),
                    r(Y, {
                      icon: "mdi-close",
                      title: "Close",
                      "data-dismiss": "modal",
                      variant: "text",
                      onClick: m
                    })
                  ]),
                  _: 1
                }),
                r(nt, null, {
                  default: x(() => [
                    r(Ba, {
                      modelValue: s.value,
                      "onUpdate:modelValue": C[0] || (C[0] = (b) => s.value = b),
                      rules: v,
                      clearable: "",
                      label: "Upload File"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                r(gt, { class: "d-flex justify-end px-3 mb-1" }, {
                  default: x(() => [
                    r(Xt, {
                      size: "large",
                      error: f.value
                    }, null, 8, ["error"]),
                    r(Y, {
                      "prepend-icon": "mdi-close",
                      variant: "flat",
                      size: "large",
                      class: "px-4 mx-2",
                      onClick: m
                    }, {
                      default: x(() => [
                        H("Cancel")
                      ]),
                      _: 1
                    }),
                    r(Y, {
                      loading: i.value,
                      "prepend-icon": "mdi-file-upload",
                      disabled: !c.value,
                      variant: "flat",
                      color: "primary",
                      size: "large",
                      class: "px-4",
                      type: "submit"
                    }, {
                      loader: x(() => [
                        H("Uploading...")
                      ]),
                      default: x(() => [
                        H("Upload to S3 ")
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onSubmit"])
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]));
  }
}, yc = { class: "font-italic" }, hc = {
  __name: "FolderUpload",
  emits: ["closeDialog"],
  setup(e, { emit: n }) {
    const t = se("api"), { bucketPath: a, bucketResource: l, refreshResource: o } = he(t), i = A(!1), s = A(), u = A({
      bucket_name: l.value.name,
      folder_path: a.value
    }), c = A(!1), f = A(), d = A(!1), v = [(h) => h.length > 0 || "This field is required"], m = () => {
      n("closeDialog"), d.value = !1, f.value = "", s.value = [];
    };
    async function y() {
      try {
        i.value = !0;
        const h = Ta(
          u.value,
          s.value,
          "folder"
        );
        await t.base.instance.post(
          `ajax/s3-upload-new-folder/${l.value.id}/`,
          h
        ), n("closeDialog"), i.value = !1, d.value = !1, s.value = [], o();
      } catch (h) {
        f.value = h, c.value = !1, i.value = !1;
      }
    }
    return (h, C) => (M(), G(at, {
      modelValue: d.value,
      "onUpdate:modelValue": [
        C[2] || (C[2] = (b) => d.value = b),
        C[3] || (C[3] = (b) => !b && m())
      ],
      width: "1024"
    }, {
      activator: x(({ props: b }) => [
        r(Y, U({ "prepend-icon": "mdi-folder-upload" }, b, {
          variant: "flat",
          color: "primary",
          size: "x-large",
          title: "Upload New Folder",
          class: "px-4 flex-grow-1"
        }), {
          default: x(() => [
            H("Upload a Folder")
          ]),
          _: 2
        }, 1040)
      ]),
      default: x(() => [
        r(Ye, { class: "pa-3" }, {
          default: x(() => [
            r(yt, {
              onSubmit: ft(y, ["prevent"]),
              "onUpdate:modelValue": C[1] || (C[1] = (b) => c.value = b)
            }, {
              default: x(() => [
                r(Ke, { class: "w-100 d-inline-flex justify-space-between text-h5" }, {
                  default: x(() => [
                    F("div", null, [
                      H(" Upload folder to "),
                      F("span", yc, ne(X(a) ? X(a) : "Root folder"), 1)
                    ]),
                    r(Y, {
                      icon: "mdi-close",
                      title: "Close",
                      variant: "text",
                      "data-dismiss": "modal",
                      onClick: m
                    })
                  ]),
                  _: 1
                }),
                r(nt, null, {
                  default: x(() => [
                    r(Ba, {
                      modelValue: s.value,
                      "onUpdate:modelValue": C[0] || (C[0] = (b) => s.value = b),
                      rules: v,
                      "single-line": "",
                      clearable: "",
                      multiple: "",
                      webkitdirectory: "",
                      label: "Select Upload Folder"
                    }, {
                      selection: x(({ fileNames: b }) => [
                        r(Qo, { "file-names": b }, null, 8, ["file-names"])
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                r(gt, { class: "d-flex justify-end px-3 mb-1" }, {
                  default: x(() => [
                    r(Xt, {
                      size: "large",
                      error: f.value
                    }, null, 8, ["error"]),
                    r(Y, {
                      "prepend-icon": "mdi-close",
                      variant: "flat",
                      size: "large",
                      class: "px-4 mx-2",
                      onClick: m
                    }, {
                      default: x(() => [
                        H("Cancel")
                      ]),
                      _: 1
                    }),
                    r(Y, {
                      loading: i.value,
                      "prepend-icon": "mdi-folder-upload",
                      disabled: !c.value,
                      type: "submit",
                      variant: "flat",
                      color: "primary",
                      size: "large",
                      class: "px-4"
                    }, {
                      loader: x(() => [
                        H("Uploading...")
                      ]),
                      default: x(() => [
                        H("Upload to S3 ")
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onSubmit"])
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]));
  }
}, bc = { class: "font-italic" }, Cc = {
  __name: "UploadModal",
  setup(e) {
    const { bucketPath: n } = he(), t = A(!1);
    return (a, l) => (M(), G(at, {
      modelValue: t.value,
      "onUpdate:modelValue": l[3] || (l[3] = (o) => t.value = o),
      width: "1024"
    }, {
      activator: x(({ props: o }) => [
        r(Y, U(o, {
          icon: "mdi-file-upload",
          title: "Upload New File or Folder",
          size: "x-large"
        }), null, 16)
      ]),
      default: x(() => [
        r(Ye, { class: "pa-3" }, {
          default: x(() => [
            r(Ke, { class: "w-100 d-inline-flex justify-space-between text-h5" }, {
              default: x(() => [
                F("div", null, [
                  H(" Upload file or folder to "),
                  F("span", bc, ne(X(n) ? X(n) : "Root folder"), 1)
                ]),
                r(Y, {
                  icon: "mdi-close",
                  title: "Close this dialog",
                  "data-dismiss": "modal",
                  variant: "text",
                  onClick: l[0] || (l[0] = (o) => t.value = !1)
                })
              ]),
              _: 1
            }),
            r(gt, { class: "d-flex justify-center ma-2" }, {
              default: x(() => [
                r(gc, {
                  onCloseDialog: l[1] || (l[1] = (o) => t.value = !1)
                }),
                r(hc, {
                  onCloseDialog: l[2] || (l[2] = (o) => t.value = !1)
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]));
  }
}, pc = { class: "d-flex flex-column" }, Sc = { class: "d-flex justify-space-between" }, xc = {
  __name: "BucketDisplay",
  setup(e) {
    const n = se("api"), { getFlattenedView: t, isFlat: a, bucketResource: l, bucketState: o } = he(n), { dropZoneRef: i, onDrop: s, dropModal: u, dropError: c, clearModal: f, clearError: d } = $o(), { isOverDropZone: v } = mu(i, s);
    ia(clearTimeout(d));
    const m = A(!1), y = A(!1), h = A(), C = A(), b = g(() => {
      var p;
      let S = (p = o.value) == null ? void 0 : p.dir_list;
      return y.value ? S : S.filter(
        (w) => w.is_file && w.is_delete_marker ? !1 : w
      );
    });
    return (S, p) => (M(), Ce("div", pc, [
      X(l) ? (M(), G(hu, {
        key: 0,
        class: "justify-start"
      })) : fe("", !0),
      F("div", Sc, [
        r(pt, null, {
          default: x(() => [
            r(bu, { "selected-items": C.value }, null, 8, ["selected-items"]),
            r(dc, { "selected-items": C.value }, null, 8, ["selected-items"]),
            X(u) ? (M(), G(vc, {
              key: 0,
              "onUpdate:clear": X(f)
            }, null, 8, ["onUpdate:clear"])) : fe("", !0),
            r(Cc),
            r(sc),
            X(a) ? (M(), G(Y, {
              key: 1,
              icon: "mdi-folder-eye",
              title: "Toggle Folder View",
              size: "x-large",
              onClick: X(t)
            }, null, 8, ["onClick"])) : (M(), G(Y, {
              key: 2,
              icon: "mdi-view-headline",
              title: "Toggle Flat List View",
              size: "x-large",
              onClick: X(t)
            }, null, 8, ["onClick"]))
          ]),
          _: 1
        }),
        r(ht, {
          location: "top",
          text: "Toggle Version Mode"
        }, {
          activator: x(({ props: w }) => [
            m.value ? (M(), G(Xr, U({
              key: 0,
              modelValue: y.value,
              "onUpdate:modelValue": p[0] || (p[0] = (I) => y.value = I)
            }, w, {
              inset: "",
              color: "primary",
              label: "Version",
              density: "compact",
              "hide-details": "",
              class: "flex-grow-0 mr-2"
            }), null, 16, ["modelValue"])) : fe("", !0)
          ]),
          _: 1
        })
      ]),
      X(c) ? (M(), G(Gn, {
        key: 1,
        closable: "",
        type: "warning",
        icon: "mdi-alert-circle",
        text: "Cannot upload Folders. Drop files only."
      })) : fe("", !0),
      h.value ? (M(), G(Gn, {
        key: 2,
        closable: "",
        type: "error",
        icon: "mdi-alert-circle",
        text: h.value
      }, null, 8, ["text"])) : fe("", !0),
      r(Ye, {
        ref_key: "dropZoneRef",
        ref: i,
        flat: ""
      }, {
        default: x(() => [
          r(lc, {
            "is-version-mode": y.value,
            items: b.value,
            "selected-items": C.value,
            "onUpdate:items": p[1] || (p[1] = (w) => C.value = w)
          }, null, 8, ["is-version-mode", "items", "selected-items"]),
          r(ut, {
            modelValue: X(v),
            "onUpdate:modelValue": p[2] || (p[2] = (w) => wt(v) ? v.value = w : null),
            contained: "",
            class: "align-center justify-center text-h6 text-white"
          }, {
            default: x(() => [
              H("Drop Files to Upload")
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]),
        _: 1
      }, 512)
    ]));
  }
}, Ac = { class: "d-inline-flex w-100" }, wc = { class: "w-25 d-inline-flex mt-1" }, kc = /* @__PURE__ */ F("span", { class: "ml-3 text-h5" }, "S3 Bucket Manager", -1), Vc = {
  __name: "S3BucketBrowser",
  props: {
    api: {
      type: Object,
      required: !0
    },
    context: {
      type: Object,
      required: !0
    }
  },
  setup(e) {
    const n = e;
    xe("api", n.api);
    const t = A(), {
      getBuckets: a,
      getResourceSelection: l,
      currentError: o,
      buckets: i,
      bucketResource: s,
      isLoading: u
    } = he(n.api), c = g(
      () => i.value && n.context.resource && i.value.find((v) => v.name === n.context.resource.name)
    ), f = g(() => t.value || o.value);
    let d = sessionStorage.getItem("csrfToken");
    return d ? n.api.base.instance.defaults.headers.common["X-CSRFTOKEN"] = d : t.value = "Error, no token found. Please navigate to the dashboard to automatically set the token before returning to the CUI", kt(a), ae(
      () => c.value,
      (v) => {
        l(v);
      }
    ), (v, m) => (M(), G(Or, {
      class: "px-3 py-4",
      rounded: ""
    }, {
      default: x(() => [
        F("div", Ac, [
          F("div", wc, [
            r(Ze, { image: X(ru) }, null, 8, ["image"]),
            kc
          ]),
          c.value ? fe("", !0) : (M(), G(cr, {
            key: 0,
            label: "Buckets:",
            items: X(i),
            "item-title": "name",
            "item-value": "id",
            "return-object": "",
            class: "w-75",
            placeholder: "Select S3 Bucket",
            "hide-details": !0,
            "onUpdate:modelValue": X(l)
          }, null, 8, ["items", "onUpdate:modelValue"]))
        ]),
        !X(s) && X(u) ? (M(), G(Ll, {
          key: 0,
          indeterminate: "",
          class: "mt-3",
          color: "blue-darken-4",
          rounded: ""
        })) : fe("", !0),
        f.value ? (M(), G(Gn, {
          key: 1,
          closable: "",
          type: "error",
          icon: "mdi-alert-circle",
          text: f.value
        }, null, 8, ["text"])) : fe("", !0),
        X(s) ? (M(), G(xc, { key: 2 })) : fe("", !0)
      ]),
      _: 1
    }));
  }
}, _c = { key: 1 }, Ic = {
  key: 3,
  class: "ma-3"
}, Ec = {
  __name: "TheApplet",
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    api: {
      type: Object,
      required: !0
    },
    page: {
      type: String,
      required: !0
    },
    area: {
      type: String,
      default: ""
    },
    theme: {
      type: Object,
      default: () => ({})
    },
    context: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [
    "configure"
  ],
  setup(e, { emit: n }) {
    const t = A(!1), a = A(!1), l = A(null);
    return n("configure"), ia(() => clearTimeout(l.value)), (o, i) => e.area.includes("Nav") ? (M(), G(su, { key: 0 })) : t.value ? (M(), Ce("div", _c)) : a.value ? (M(), G(X(Sn), {
      key: 2,
      indeterminate: "",
      class: "ma-3"
    })) : (M(), Ce("div", Ic, [
      r(Vc, {
        api: e.api,
        context: e.context
      }, null, 8, ["api", "context"])
    ]));
  }
};
export {
  Ec as default
};
