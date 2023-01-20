!function () {
  'use strict'; let t = class {
    constructor(t) {
      this.propagationStopped, this.defaultPrevented, this.type = t, this.target = null;
    }preventDefault() {
      this.defaultPrevented = !0;
    }stopPropagation() {
      this.propagationStopped = !0;
    }
  }; let e = 'propertychange'; let i = class {
    constructor() {
      this.disposed = !1;
    }dispose() {
      this.disposed || (this.disposed = !0, this.disposeInternal());
    }disposeInternal() {}
  }; function n(t, e) {
    return t > e ? 1 : t < e ? -1 : 0;
  } function r(t, e, i) {
    const n = t.length; if (t[0] <= e) {
      return 0;
    } if (e <= t[n - 1]) {
      return n - 1;
    } let r; if (i > 0) {
      for (r = 1; r < n; ++r) {
        if (t[r] < e) {
          return r - 1;
        }
      }
    } else if (i < 0) {
      for (r = 1; r < n; ++r) {
        if (t[r] <= e) {
          return r;
        }
      }
    } else {
      for (r = 1; r < n; ++r) {
        if (t[r] == e) {
          return r;
        } if (t[r] < e) {
          return typeof i === 'function' ? i(e, t[r - 1], t[r]) > 0 ? r - 1 : r : t[r - 1] - e < e - t[r] ? r - 1 : r;
        }
      }
    } return n - 1;
  } function s(t, e, i) {
    for (;e < i;) {
      const n = t[e]; t[e] = t[i], t[i] = n, ++e, --i;
    }
  } function o(t, e) {
    const i = Array.isArray(e) ? e : [e]; const n = i.length; for (let e = 0; e < n; e++) {
      t[t.length] = i[e];
    }
  } function a(t, e) {
    const i = t.length; if (i !== e.length) {
      return !1;
    } for (let n = 0; n < i; n++) {
      if (t[n] !== e[n]) {
        return !1;
      }
    } return !0;
  } function l() {
    return !0;
  } function h() {
    return !1;
  } function u() {} function c(t) {
    for (const e in t) {
      delete t[e];
    }
  } function d(t) {
    let e; for (e in t) {
      return !1;
    } return !e;
  } let p = class extends i {
    constructor(t) {
      super(), this.eventTarget_ = t, this.pendingRemovals_ = null, this.dispatching_ = null, this.listeners_ = null;
    }addEventListener(t, e) {
      if (!t || !e) {
        return;
      } const i = this.listeners_ || (this.listeners_ = {}); const n = i[t] || (i[t] = []); n.includes(e) || n.push(e);
    }dispatchEvent(e) {
      const i = typeof e === 'string'; const n = i ? e : e.type; const r = this.listeners_ && this.listeners_[n]; if (!r) {
        return;
      } const s = i ? new t(e) : e; s.target || (s.target = this.eventTarget_ || this); const o = this.dispatching_ || (this.dispatching_ = {}); const a = this.pendingRemovals_ || (this.pendingRemovals_ = {}); let l; n in o || (o[n] = 0, a[n] = 0), ++o[n]; for (let t = 0, e = r.length; t < e; ++t) {
        if (l = 'handleEvent' in r[t] ? r[t].handleEvent(s) : r[t].call(this, s), !1 === l || s.propagationStopped) {
          l = !1; break;
        }
      } if (--o[n] == 0) {
        let t = a[n]; for (delete a[n]; t--;) {
          this.removeEventListener(n, u);
        } delete o[n];
      } return l;
    }disposeInternal() {
      this.listeners_ && c(this.listeners_);
    }getListeners(t) {
      return this.listeners_ && this.listeners_[t] || void 0;
    }hasListener(t) {
      return !!this.listeners_ && (t ? t in this.listeners_ : Object.keys(this.listeners_).length > 0);
    }removeEventListener(t, e) {
      const i = this.listeners_ && this.listeners_[t]; if (i) {
        const n = i.indexOf(e); n !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (i[n] = u, ++this.pendingRemovals_[t]) : (i.splice(n, 1), i.length === 0 && delete this.listeners_[t]));
      }
    }
  }; let g = 'change'; let f = 'error'; let m = 'contextmenu'; let y = 'click'; let _ = 'dblclick'; let v = 'keydown'; let x = 'keypress'; let b = 'load'; let w = 'touchmove'; let C = 'wheel'; function S(t, e, i, n, r) {
    if (n && n !== t && (i = i.bind(n)), r) {
      const n = i; i = function () {
        t.removeEventListener(e, i), n.apply(this, arguments);
      };
    } const s = {target: t, type: e, listener: i}; return t.addEventListener(e, i), s;
  } function T(t, e, i, n) {
    return S(t, e, i, n, !0);
  } function E(t) {
    t && t.target && (t.target.removeEventListener(t.type, t.listener), c(t));
  } class R extends p {
    constructor() {
      super(), this.on = this.onInternal, this.once = this.onceInternal, this.un = this.unInternal, this.revision_ = 0;
    }changed() {
      ++this.revision_, this.dispatchEvent(g);
    }getRevision() {
      return this.revision_;
    }onInternal(t, e) {
      if (Array.isArray(t)) {
        const i = t.length; const n = new Array(i); for (let r = 0; r < i; ++r) {
          n[r] = S(this, t[r], e);
        } return n;
      } return S(this, t, e);
    }onceInternal(t, e) {
      let i; if (Array.isArray(t)) {
        const n = t.length; i = new Array(n); for (let r = 0; r < n; ++r) {
          i[r] = T(this, t[r], e);
        }
      } else {
        i = T(this, t, e);
      } return e.ol_key = i, i;
    }unInternal(t, e) {
      const i = e.ol_key; if (i) {
        !function (t) {
          if (Array.isArray(t)) {
            for (let e = 0, i = t.length; e < i; ++e) {
              E(t[e]);
            }
          } else {
            E(t);
          }
        }(i);
      } else if (Array.isArray(t)) {
        for (let i = 0, n = t.length; i < n; ++i) {
          this.removeEventListener(t[i], e);
        }
      } else {
        this.removeEventListener(t, e);
      }
    }
  }R.prototype.on, R.prototype.once, R.prototype.un; let I = R; function M() {
    throw new Error('Unimplemented abstract method.');
  } let k = 0; function F(t) {
    return t.ol_uid || (t.ol_uid = String(++k));
  } class P extends t {
    constructor(t, e, i) {
      super(t), this.key = e, this.oldValue = i;
    }
  } let L = class extends I {
    constructor(t) {
      super(), this.on, this.once, this.un, F(this), this.values_ = null, void 0 !== t && this.setProperties(t);
    }get(t) {
      let e; return this.values_ && this.values_.hasOwnProperty(t) && (e = this.values_[t]), e;
    }getKeys() {
      return this.values_ && Object.keys(this.values_) || [];
    }getProperties() {
      return this.values_ && Object.assign({}, this.values_) || {};
    }hasProperties() {
      return !!this.values_;
    }notify(t, i) {
      let n; n = `change:${t}`, this.hasListener(n) && this.dispatchEvent(new P(n, t, i)), n = e, this.hasListener(n) && this.dispatchEvent(new P(n, t, i));
    }addChangeListener(t, e) {
      this.addEventListener(`change:${t}`, e);
    }removeChangeListener(t, e) {
      this.removeEventListener(`change:${t}`, e);
    }set(t, e, i) {
      const n = this.values_ || (this.values_ = {}); if (i) {
        n[t] = e;
      } else {
        const i = n[t]; n[t] = e, i !== e && this.notify(t, i);
      }
    }setProperties(t, e) {
      for (const i in t) {
        this.set(i, t[i], e);
      }
    }applyProperties(t) {
      t.values_ && Object.assign(this.values_ || (this.values_ = {}), t.values_);
    }unset(t, e) {
      if (this.values_ && t in this.values_) {
        const i = this.values_[t]; delete this.values_[t], d(this.values_) && (this.values_ = null), e || this.notify(t, i);
      }
    }
  }; let A = 'postrender'; let z = 'movestart'; let O = 'moveend'; let D = 'loadstart'; let j = 'loadend'; const G = typeof navigator !== 'undefined' && void 0 !== navigator.userAgent ? navigator.userAgent.toLowerCase() : ''; const N = G.includes('firefox'); G.includes('safari') && !G.includes('chrom') && (G.includes('version/15.4') || /cpu (os|iphone os) 15_4 like mac os x/.test(G)); const W = G.includes('webkit') && !G.includes('edge'); const X = G.includes('macintosh'); const q = typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1; const B = typeof WorkerGlobalScope !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && self instanceof WorkerGlobalScope; const V = typeof Image !== 'undefined' && Image.prototype.decode; const Y = function () {
    let t = !1; try {
      const e = Object.defineProperty({}, 'passive', {get() {
        t = !0;
      }}); window.addEventListener('_', null, e), window.removeEventListener('_', null, e);
    } catch (t) {} return t;
  }(); function K(t, e, i, n) {
    let r; return r = i && i.length ? i.shift() : B ? new OffscreenCanvas(t || 300, e || 300) : document.createElement('canvas'), t && (r.width = t), e && (r.height = e), r.getContext('2d', n);
  } function Z(t) {
    const e = t.canvas; e.width = 1, e.height = 1, t.clearRect(0, 0, 1, 1);
  } function U(t, e) {
    const i = e.parentNode; i && i.replaceChild(t, e);
  } function H(t) {
    return t && t.parentNode ? t.parentNode.removeChild(t) : null;
  } let J = class extends L {
    constructor(t) {
      super(); const e = t.element; !e || t.target || e.style.pointerEvents || (e.style.pointerEvents = 'auto'), this.element = e || null, this.target_ = null, this.map_ = null, this.listenerKeys = [], t.render && (this.render = t.render), t.target && this.setTarget(t.target);
    }disposeInternal() {
      H(this.element), super.disposeInternal();
    }getMap() {
      return this.map_;
    }setMap(t) {
      this.map_ && H(this.element); for (let t = 0, e = this.listenerKeys.length; t < e; ++t) {
        E(this.listenerKeys[t]);
      } if (this.listenerKeys.length = 0, this.map_ = t, t) {
        (this.target_ ? this.target_ : t.getOverlayContainerStopEvent()).appendChild(this.element), this.render !== u && this.listenerKeys.push(S(t, A, this.render, this)), t.render();
      }
    }render(t) {}setTarget(t) {
      this.target_ = typeof t === 'string' ? document.getElementById(t) : t;
    }
  }; let Q = 'layergroup'; let $ = 'size'; let tt = 'target'; let et = 'view'; const it = 'ol-hidden'; const nt = 'ol-unsupported'; const rt = 'ol-control'; const st = 'ol-collapsed'; const ot = new RegExp(['^\\s*(?=(?:(?:[-a-z]+\\s*){0,2}(italic|oblique))?)', '(?=(?:(?:[-a-z]+\\s*){0,2}(small-caps))?)', '(?=(?:(?:[-a-z]+\\s*){0,2}(bold(?:er)?|lighter|[1-9]00 ))?)', '(?:(?:normal|\\1|\\2|\\3)\\s*){0,3}((?:xx?-)?', '(?:small|large)|medium|smaller|larger|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx]))', '(?:\\s*\\/\\s*(normal|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx])?))', '?\\s*([-,\\"\\\'\\sa-z]+?)\\s*$'].join(''), 'i'); const at = ['style', 'variant', 'weight', 'size', 'lineHeight', 'family']; const lt = function (t) {
    const e = t.match(ot); if (!e) {
      return null;
    } const i = {lineHeight: 'normal', size: '1.2em', style: 'normal', weight: 'normal', variant: 'normal'}; for (let t = 0, n = at.length; t < n; ++t) {
      const n = e[t + 1]; void 0 !== n && (i[at[t]] = n);
    } return i.families = i.family.split(/,\s?/), i;
  }; const ht = ['fullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange']; const ut = 'enterfullscreen'; const ct = 'leavefullscreen'; function dt(t) {
    const e = t.body; return !!(e.webkitRequestFullscreen || e.requestFullscreen && t.fullscreenEnabled);
  } function pt(t) {
    return !(!t.webkitIsFullScreen && !t.fullscreenElement);
  } function gt(t) {
    t.requestFullscreen ? t.requestFullscreen() : t.webkitRequestFullscreen && t.webkitRequestFullscreen();
  } let ft = class extends J {
    constructor(t) {
      t = t || {}, super({element: document.createElement('div'), target: t.target}), this.on, this.once, this.un, this.keys_ = void 0 !== t.keys && t.keys, this.source_ = t.source, this.isInFullscreen_ = !1, this.boundHandleMapTargetChange_ = this.handleMapTargetChange_.bind(this), this.cssClassName_ = void 0 !== t.className ? t.className : 'ol-full-screen', this.documentListeners_ = [], this.activeClassName_ = void 0 !== t.activeClassName ? t.activeClassName.split(' ') : [this.cssClassName_ + '-true'], this.inactiveClassName_ = void 0 !== t.inactiveClassName ? t.inactiveClassName.split(' ') : [this.cssClassName_ + '-false']; const e = void 0 !== t.label ? t.label : '⤢'; this.labelNode_ = typeof e === 'string' ? document.createTextNode(e) : e; const i = void 0 !== t.labelActive ? t.labelActive : '×'; this.labelActiveNode_ = typeof i === 'string' ? document.createTextNode(i) : i; const n = t.tipLabel ? t.tipLabel : 'Toggle full-screen'; this.button_ = document.createElement('button'), this.button_.title = n, this.button_.setAttribute('type', 'button'), this.button_.appendChild(this.labelNode_), this.button_.addEventListener(y, this.handleClick_.bind(this), !1), this.setClassName_(this.button_, this.isInFullscreen_), this.element.className = `${this.cssClassName_} ol-unselectable ol-control`, this.element.appendChild(this.button_);
    }handleClick_(t) {
      t.preventDefault(), this.handleFullScreen_();
    }handleFullScreen_() {
      const t = this.getMap(); if (!t) {
        return;
      } const e = t.getOwnerDocument(); if (dt(e)) {
        if (pt(e)) {
          !function (t) {
            t.exitFullscreen ? t.exitFullscreen() : t.webkitExitFullscreen && t.webkitExitFullscreen();
          }(e);
        } else {
          let i; i = this.source_ ? typeof this.source_ === 'string' ? e.getElementById(this.source_) : this.source_ : t.getTargetElement(), this.keys_ ? function (t) {
            t.webkitRequestFullscreen ? t.webkitRequestFullscreen() : gt(t);
          }(i) : gt(i);
        }
      }
    }handleFullScreenChange_() {
      const t = this.getMap(); if (!t) {
        return;
      } const e = this.isInFullscreen_; this.isInFullscreen_ = pt(t.getOwnerDocument()), e !== this.isInFullscreen_ && (this.setClassName_(this.button_, this.isInFullscreen_), this.isInFullscreen_ ? (U(this.labelActiveNode_, this.labelNode_), this.dispatchEvent(ut)) : (U(this.labelNode_, this.labelActiveNode_), this.dispatchEvent(ct)), t.updateSize());
    }setClassName_(t, e) {
      e ? (t.classList.remove(...this.inactiveClassName_), t.classList.add(...this.activeClassName_)) : (t.classList.remove(...this.activeClassName_), t.classList.add(...this.inactiveClassName_));
    }setMap(t) {
      const e = this.getMap(); e && e.removeChangeListener(tt, this.boundHandleMapTargetChange_), super.setMap(t), this.handleMapTargetChange_(), t && t.addChangeListener(tt, this.boundHandleMapTargetChange_);
    }handleMapTargetChange_() {
      const t = this.documentListeners_; for (let e = 0, i = t.length; e < i; ++e) {
        E(t[e]);
      }t.length = 0; const e = this.getMap(); if (e) {
        const i = e.getOwnerDocument(); dt(i) ? this.element.classList.remove(nt) : this.element.classList.add(nt); for (let e = 0, n = ht.length; e < n; ++e) {
          t.push(S(i, ht[e], this.handleFullScreenChange_, this));
        } this.handleFullScreenChange_();
      }
    }
  }; const mt = {1: 'The view center is not defined', 2: 'The view resolution is not defined', 3: 'The view rotation is not defined', 4: '`image` and `src` cannot be provided at the same time', 5: '`imgSize` must be set when `image` is provided', 7: '`format` must be set when `url` is set', 8: 'Unknown `serverType` configured', 9: '`url` must be configured or set using `#setUrl()`', 10: 'The default `geometryFunction` can only handle `Point` geometries', 11: '`options.featureTypes` must be an Array', 12: '`options.geometryName` must also be provided when `options.bbox` is set', 13: 'Invalid corner', 14: 'Invalid color', 15: 'Tried to get a value for a key that does not exist in the cache', 16: 'Tried to set a value for a key that is used already', 17: '`resolutions` must be sorted in descending order', 18: 'Either `origin` or `origins` must be configured, never both', 19: 'Number of `tileSizes` and `resolutions` must be equal', 20: 'Number of `origins` and `resolutions` must be equal', 22: 'Either `tileSize` or `tileSizes` must be configured, never both', 24: 'Invalid extent or geometry provided as `geometry`', 25: 'Cannot fit empty extent provided as `geometry`', 26: 'Features must have an id set', 27: 'Features must have an id set', 28: '`renderMode` must be `"hybrid"` or `"vector"`', 30: 'The passed `feature` was already added to the source', 31: 'Tried to enqueue an `element` that was already added to the queue', 32: 'Transformation matrix cannot be inverted', 33: 'Invalid units', 34: 'Invalid geometry layout', 36: 'Unknown SRS type', 37: 'Unknown geometry type found', 38: '`styleMapValue` has an unknown type', 39: 'Unknown geometry type', 40: 'Expected `feature` to have a geometry', 41: 'Expected an `ol/style/Style` or an array of `ol/style/Style.js`', 42: 'Question unknown, the answer is 42', 43: 'Expected `layers` to be an array or a `Collection`', 47: 'Expected `controls` to be an array or an `ol/Collection`', 48: 'Expected `interactions` to be an array or an `ol/Collection`', 49: 'Expected `overlays` to be an array or an `ol/Collection`', 50: '`options.featureTypes` should be an Array', 51: 'Either `url` or `tileJSON` options must be provided', 52: 'Unknown `serverType` configured', 53: 'Unknown `tierSizeCalculation` configured', 55: 'The {-y} placeholder requires a tile grid with extent', 56: 'mapBrowserEvent must originate from a pointer event', 57: 'At least 2 conditions are required', 59: 'Invalid command found in the PBF', 60: 'Missing or invalid `size`', 61: 'Cannot determine IIIF Image API version from provided image information JSON', 62: 'A `WebGLArrayBuffer` must either be of type `ELEMENT_ARRAY_BUFFER` or `ARRAY_BUFFER`', 64: 'Layer opacity must be a number', 66: '`forEachFeatureAtCoordinate` cannot be used on a WebGL layer if the hit detection logic has not been enabled. This is done by providing adequate shaders using the `hitVertexShader` and `hitFragmentShader` properties of `WebGLPointsLayerRenderer`', 67: 'A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both', 68: 'A VectorTile source can only be rendered if it has a projection compatible with the view projection', 69: '`width` or `height` cannot be provided together with `scale`'}; class yt extends Error {
    constructor(t) {
      const e = mt[t]; super(e), this.code = t, this.name = 'AssertionError', this.message = e;
    }
  } let _t = yt; let vt = 'add'; let xt = 'remove'; const bt = 'length'; class wt extends t {
    constructor(t, e, i) {
      super(t), this.element = e, this.index = i;
    }
  } let Ct = class extends L {
    constructor(t, e) {
      if (super(), this.on, this.once, this.un, e = e || {}, this.unique_ = !!e.unique, this.array_ = t || [], this.unique_) {
        for (let t = 0, e = this.array_.length; t < e; ++t) {
          this.assertUnique_(this.array_[t], t);
        }
      } this.updateLength_();
    }clear() {
      for (;this.getLength() > 0;) {
        this.pop();
      }
    }extend(t) {
      for (let e = 0, i = t.length; e < i; ++e) {
        this.push(t[e]);
      } return this;
    }forEach(t) {
      const e = this.array_; for (let i = 0, n = e.length; i < n; ++i) {
        t(e[i], i, e);
      }
    }getArray() {
      return this.array_;
    }item(t) {
      return this.array_[t];
    }getLength() {
      return this.get(bt);
    }insertAt(t, e) {
      if (t < 0 || t > this.getLength()) {
        throw new Error('Index out of bounds: ' + t);
      } this.unique_ && this.assertUnique_(e), this.array_.splice(t, 0, e), this.updateLength_(), this.dispatchEvent(new wt(vt, e, t));
    }pop() {
      return this.removeAt(this.getLength() - 1);
    }push(t) {
      this.unique_ && this.assertUnique_(t); const e = this.getLength(); return this.insertAt(e, t), this.getLength();
    }remove(t) {
      const e = this.array_; for (let i = 0, n = e.length; i < n; ++i) {
        if (e[i] === t) {
          return this.removeAt(i);
        }
      }
    }removeAt(t) {
      if (t < 0 || t >= this.getLength()) {
        return;
      } const e = this.array_[t]; return this.array_.splice(t, 1), this.updateLength_(), this.dispatchEvent(new wt(xt, e, t)), e;
    }setAt(t, e) {
      if (t >= this.getLength()) {
        return void this.insertAt(t, e);
      } if (t < 0) {
        throw new Error('Index out of bounds: ' + t);
      } this.unique_ && this.assertUnique_(e, t); const i = this.array_[t]; this.array_[t] = e, this.dispatchEvent(new wt(xt, i, t)), this.dispatchEvent(new wt(vt, e, t));
    }updateLength_() {
      this.set(bt, this.array_.length);
    }assertUnique_(t, e) {
      for (let i = 0, n = this.array_.length; i < n; ++i) {
        if (this.array_[i] === t && i !== e) {
          throw new _t(58);
        }
      }
    }
  }; function St(t, e) {
    if (!t) {
      throw new _t(e);
    }
  } const Tt = new Array(6); function Et(t) {
    return It(t, 1, 0, 0, 1, 0, 0);
  } function Rt(t, e) {
    const i = t[0]; const n = t[1]; const r = t[2]; const s = t[3]; const o = t[4]; const a = t[5]; const l = e[0]; const h = e[1]; const u = e[2]; const c = e[3]; const d = e[4]; const p = e[5]; return t[0] = i * l + r * h, t[1] = n * l + s * h, t[2] = i * u + r * c, t[3] = n * u + s * c, t[4] = i * d + r * p + o, t[5] = n * d + s * p + a, t;
  } function It(t, e, i, n, r, s, o) {
    return t[0] = e, t[1] = i, t[2] = n, t[3] = r, t[4] = s, t[5] = o, t;
  } function Mt(t, e) {
    const i = e[0]; const n = e[1]; return e[0] = t[0] * i + t[2] * n + t[4], e[1] = t[1] * i + t[3] * n + t[5], e;
  } function kt(t, e, i) {
    return Rt(t, It(Tt, e, 0, 0, i, 0, 0));
  } function Ft(t, e, i, n, r, s, o, a) {
    const l = Math.sin(s); const h = Math.cos(s); return t[0] = n * h, t[1] = r * l, t[2] = -n * l, t[3] = r * h, t[4] = o * n * h - a * n * l + e, t[5] = o * r * l + a * r * h + i, t;
  } function Pt(t, e) {
    const i = (n = e)[0] * n[3] - n[1] * n[2]; let n; St(i !== 0, 32); const r = e[0]; const s = e[1]; const o = e[2]; const a = e[3]; const l = e[4]; const h = e[5]; return t[0] = a / i, t[1] = -s / i, t[2] = -o / i, t[3] = r / i, t[4] = (o * h - a * l) / i, t[5] = -(r * h - s * l) / i, t;
  } let Lt; function At(t) {
    const e = 'matrix(' + t.join(', ') + ')'; if (B) {
      return e;
    } const i = Lt || (Lt = document.createElement('div')); return i.style.transform = e, i.style.transform;
  } let zt = 0; let Ot = 1; let Dt = 2; let jt = 4; let Gt = 8; let Nt = 16; function Wt(t) {
    const e = Ut(); for (let i = 0, n = t.length; i < n; ++i) {
      ie(e, t[i]);
    } return e;
  } function Xt(t, e, i) {
    return i ? (i[0] = t[0] - e, i[1] = t[1] - e, i[2] = t[2] + e, i[3] = t[3] + e, i) : [t[0] - e, t[1] - e, t[2] + e, t[3] + e];
  } function qt(t, e) {
    return e ? (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e) : t.slice();
  } function Bt(t, e, i) {
    let n; let r; return n = e < t[0] ? t[0] - e : t[2] < e ? e - t[2] : 0, r = i < t[1] ? t[1] - i : t[3] < i ? i - t[3] : 0, n * n + r * r;
  } function Vt(t, e) {
    return Kt(t, e[0], e[1]);
  } function Yt(t, e) {
    return t[0] <= e[0] && e[2] <= t[2] && t[1] <= e[1] && e[3] <= t[3];
  } function Kt(t, e, i) {
    return t[0] <= e && e <= t[2] && t[1] <= i && i <= t[3];
  } function Zt(t, e) {
    const i = t[0]; const n = t[1]; const r = t[2]; const s = t[3]; const o = e[0]; const a = e[1]; let l = zt; return o < i ? l |= Nt : o > r && (l |= jt), a < n ? l |= Gt : a > s && (l |= Dt), l === zt && (l = Ot), l;
  } function Ut() {
    return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
  } function Ht(t, e, i, n, r) {
    return r ? (r[0] = t, r[1] = e, r[2] = i, r[3] = n, r) : [t, e, i, n];
  } function Jt(t) {
    return Ht(1 / 0, 1 / 0, -1 / 0, -1 / 0, t);
  } function Qt(t, e) {
    const i = t[0]; const n = t[1]; return Ht(i, n, i, n, e);
  } function $t(t, e, i, n, r) {
    return ne(Jt(r), t, e, i, n);
  } function te(t, e) {
    return t[0] == e[0] && t[2] == e[2] && t[1] == e[1] && t[3] == e[3];
  } function ee(t, e) {
    return e[0] < t[0] && (t[0] = e[0]), e[2] > t[2] && (t[2] = e[2]), e[1] < t[1] && (t[1] = e[1]), e[3] > t[3] && (t[3] = e[3]), t;
  } function ie(t, e) {
    e[0] < t[0] && (t[0] = e[0]), e[0] > t[2] && (t[2] = e[0]), e[1] < t[1] && (t[1] = e[1]), e[1] > t[3] && (t[3] = e[1]);
  } function ne(t, e, i, n, r) {
    for (;i < n; i += r) {
      re(t, e[i], e[i + 1]);
    } return t;
  } function re(t, e, i) {
    t[0] = Math.min(t[0], e), t[1] = Math.min(t[1], i), t[2] = Math.max(t[2], e), t[3] = Math.max(t[3], i);
  } function se(t, e) {
    let i; return i = e(ae(t)), i || (i = e(le(t)), i || (i = e(me(t)), i || (i = e(fe(t)), i || !1)));
  } function oe(t) {
    let e = 0; return ve(t) || (e = ye(t) * pe(t)), e;
  } function ae(t) {
    return [t[0], t[1]];
  } function le(t) {
    return [t[2], t[1]];
  } function he(t) {
    return [(t[0] + t[2]) / 2, (t[1] + t[3]) / 2];
  } function ue(t, e) {
    let i; return e === 'bottom-left' ? i = ae(t) : e === 'bottom-right' ? i = le(t) : e === 'top-left' ? i = fe(t) : e === 'top-right' ? i = me(t) : St(!1, 13), i;
  } function ce(t, e, i, n, r) {
    const [s, o, a, l, h, u, c, d] = de(t, e, i, n); return Ht(Math.min(s, a, h, c), Math.min(o, l, u, d), Math.max(s, a, h, c), Math.max(o, l, u, d), r);
  } function de(t, e, i, n) {
    const r = e * n[0] / 2; const s = e * n[1] / 2; const o = Math.cos(i); const a = Math.sin(i); const l = r * o; const h = r * a; const u = s * o; const c = s * a; const d = t[0]; const p = t[1]; return [d - l + c, p - h - u, d - l - c, p - h + u, d + l - c, p + h + u, d + l + c, p + h - u, d - l + c, p - h - u];
  } function pe(t) {
    return t[3] - t[1];
  } function ge(t, e, i) {
    const n = i || [1 / 0, 1 / 0, -1 / 0, -1 / 0]; return _e(t, e) ? (t[0] > e[0] ? n[0] = t[0] : n[0] = e[0], t[1] > e[1] ? n[1] = t[1] : n[1] = e[1], t[2] < e[2] ? n[2] = t[2] : n[2] = e[2], t[3] < e[3] ? n[3] = t[3] : n[3] = e[3]) : Jt(n), n;
  } function fe(t) {
    return [t[0], t[3]];
  } function me(t) {
    return [t[2], t[3]];
  } function ye(t) {
    return t[2] - t[0];
  } function _e(t, e) {
    return t[0] <= e[2] && t[2] >= e[0] && t[1] <= e[3] && t[3] >= e[1];
  } function ve(t) {
    return t[2] < t[0] || t[3] < t[1];
  } function xe(t, e, i, n) {
    let r = []; if (n > 1) {
      const e = t[2] - t[0]; const i = t[3] - t[1]; for (let s = 0; s < n; ++s) {
        r.push(t[0] + e * s / n, t[1], t[2], t[1] + i * s / n, t[2] - e * s / n, t[3], t[0], t[3] - i * s / n);
      }
    } else {
      r = [t[0], t[1], t[2], t[1], t[2], t[3], t[0], t[3]];
    }e(r, r, 2); const s = []; const o = []; for (let t = 0, e = r.length; t < e; t += 2) {
      s.push(r[t]), o.push(r[t + 1]);
    } return function (t, e, i) {
      return Ht(Math.min.apply(null, t), Math.min.apply(null, e), Math.max.apply(null, t), Math.max.apply(null, e), i);
    }(s, o, i);
  } function be(t, e) {
    const i = e.getExtent(); const n = he(t); if (e.canWrapX() && (n[0] < i[0] || n[0] >= i[2])) {
      const e = ye(i); const r = Math.floor((n[0] - i[0]) / e) * e; t[0] -= r, t[2] -= r;
    } return t;
  } function we(t, e, i) {
    return Math.min(Math.max(t, e), i);
  } function Ce(t, e, i, n, r, s) {
    const o = r - i; const a = s - n; if (o !== 0 || a !== 0) {
      const l = ((t - i) * o + (e - n) * a) / (o * o + a * a); l > 1 ? (i = r, n = s) : l > 0 && (i += o * l, n += a * l);
    } return Se(t, e, i, n);
  } function Se(t, e, i, n) {
    const r = i - t; const s = n - e; return r * r + s * s;
  } function Te(t) {
    return t * Math.PI / 180;
  } function Ee(t, e) {
    const i = t % e; return i * e < 0 ? i + e : i;
  } function Re(t, e, i) {
    return t + i * (e - t);
  } function Ie(t, e) {
    const i = Math.pow(10, e); return Math.round(t * i) / i;
  } function Me(t, e) {
    return Math.floor(Ie(t, e));
  } function ke(t, e) {
    return Math.ceil(Ie(t, e));
  } const Fe = /^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i; const Pe = /^([a-z]*)$|^hsla?\(.*\)$/i; function Le(t) {
    return typeof t === 'string' ? t : De(t);
  } const Ae = function () {
    const t = {}; let e = 0; return function (i) {
      let n; if (t.hasOwnProperty(i)) {
        n = t[i];
      } else {
        if (e >= 1024) {
          let i = 0; for (const n in t) {
            (3 & i++) == 0 && (delete t[n], --e);
          }
        }n = function (t) {
          let e; let i; let n; let r; let s; Pe.exec(t) && (t = function (t) {
            const e = document.createElement('div'); if (e.style.color = t, e.style.color !== '') {
              document.body.appendChild(e); const t = getComputedStyle(e).color; return document.body.removeChild(e), t;
            } return '';
          }(t)); if (Fe.exec(t)) {
            const o = t.length - 1; let a; a = o <= 4 ? 1 : 2; const l = o === 4 || o === 8; e = parseInt(t.substr(1 + 0 * a, a), 16), i = parseInt(t.substr(1 + 1 * a, a), 16), n = parseInt(t.substr(1 + 2 * a, a), 16), r = l ? parseInt(t.substr(1 + 3 * a, a), 16) : 255, a == 1 && (e = (e << 4) + e, i = (i << 4) + i, n = (n << 4) + n, l && (r = (r << 4) + r)), s = [e, i, n, r / 255];
          } else {
            t.startsWith('rgba(') ? (s = t.slice(5, -1).split(',').map(Number), Oe(s)) : t.startsWith('rgb(') ? (s = t.slice(4, -1).split(',').map(Number), s.push(1), Oe(s)) : St(!1, 14);
          } return s;
        }(i), t[i] = n, ++e;
      } return n;
    };
  }(); function ze(t) {
    return Array.isArray(t) ? t : Ae(t);
  } function Oe(t) {
    return t[0] = we(t[0] + 0.5 | 0, 0, 255), t[1] = we(t[1] + 0.5 | 0, 0, 255), t[2] = we(t[2] + 0.5 | 0, 0, 255), t[3] = we(t[3], 0, 1), t;
  } function De(t) {
    let e = t[0]; e != (0 | e) && (e = e + 0.5 | 0); let i = t[1]; i != (0 | i) && (i = i + 0.5 | 0); let n = t[2]; n != (0 | n) && (n = n + 0.5 | 0); return 'rgba(' + e + ',' + i + ',' + n + ',' + (void 0 === t[3] ? 1 : Math.round(100 * t[3]) / 100) + ')';
  } function je(t, e, i) {
    return e + ':' + t + ':' + (i ? Le(i) : 'null');
  } const Ge = new class {
    constructor() {
      this.cache_ = {}, this.cacheSize_ = 0, this.maxCacheSize_ = 32;
    }clear() {
      this.cache_ = {}, this.cacheSize_ = 0;
    }canExpireCache() {
      return this.cacheSize_ > this.maxCacheSize_;
    }expire() {
      if (this.canExpireCache()) {
        let t = 0; for (const e in this.cache_) {
          const i = this.cache_[e]; (3 & t++) != 0 || i.hasListener() || (delete this.cache_[e], --this.cacheSize_);
        }
      }
    }get(t, e, i) {
      const n = je(t, e, i); return n in this.cache_ ? this.cache_[n] : null;
    }set(t, e, i, n) {
      const r = je(t, e, i); this.cache_[r] = n, ++this.cacheSize_;
    }setSize(t) {
      this.maxCacheSize_ = t, this.expire();
    }
  }(); let Ne = 'opacity'; let We = 'visible'; let Xe = 'extent'; let qe = 'zIndex'; let Be = 'maxResolution'; let Ve = 'minResolution'; let Ye = 'maxZoom'; let Ke = 'minZoom'; let Ze = 'source'; let Ue = 'map'; let He = class extends L {
    constructor(t) {
      super(), this.on, this.once, this.un, this.background_ = t.background; const e = Object.assign({}, t); typeof t.properties === 'object' && (delete e.properties, Object.assign(e, t.properties)), e[Ne] = void 0 !== t.opacity ? t.opacity : 1, St(typeof e[Ne] === 'number', 64), e[We] = void 0 === t.visible || t.visible, e[qe] = t.zIndex, e[Be] = void 0 !== t.maxResolution ? t.maxResolution : 1 / 0, e[Ve] = void 0 !== t.minResolution ? t.minResolution : 0, e[Ke] = void 0 !== t.minZoom ? t.minZoom : -1 / 0, e[Ye] = void 0 !== t.maxZoom ? t.maxZoom : 1 / 0, this.className_ = void 0 !== e.className ? e.className : 'ol-layer', delete e.className, this.setProperties(e), this.state_ = null;
    }getBackground() {
      return this.background_;
    }getClassName() {
      return this.className_;
    }getLayerState(t) {
      const e = this.state_ || {layer: this, managed: void 0 === t || t}; const i = this.getZIndex(); return e.opacity = we(Math.round(100 * this.getOpacity()) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = void 0 !== i || e.managed ? i : 1 / 0, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
    }getLayersArray(t) {
      return M();
    }getLayerStatesArray(t) {
      return M();
    }getExtent() {
      return this.get(Xe);
    }getMaxResolution() {
      return this.get(Be);
    }getMinResolution() {
      return this.get(Ve);
    }getMinZoom() {
      return this.get(Ke);
    }getMaxZoom() {
      return this.get(Ye);
    }getOpacity() {
      return this.get(Ne);
    }getSourceState() {
      return M();
    }getVisible() {
      return this.get(We);
    }getZIndex() {
      return this.get(qe);
    }setBackground(t) {
      this.background_ = t, this.changed();
    }setExtent(t) {
      this.set(Xe, t);
    }setMaxResolution(t) {
      this.set(Be, t);
    }setMinResolution(t) {
      this.set(Ve, t);
    }setMaxZoom(t) {
      this.set(Ye, t);
    }setMinZoom(t) {
      this.set(Ke, t);
    }setOpacity(t) {
      St(typeof t === 'number', 64), this.set(Ne, t);
    }setVisible(t) {
      this.set(We, t);
    }setZIndex(t) {
      this.set(qe, t);
    }disposeInternal() {
      this.state_ && (this.state_.layer = null, this.state_ = null), super.disposeInternal();
    }
  }; let Je = 'prerender'; let Qe = 'postrender'; let $e = 'precompose'; let ti = 'postcompose'; let ei = 'rendercomplete'; function ii(t, e) {
    if (!t.visible) {
      return !1;
    } const i = e.resolution; if (i < t.minResolution || i >= t.maxResolution) {
      return !1;
    } const n = e.zoom; return n > t.minZoom && n <= t.maxZoom;
  } let ni = class extends He {
    constructor(t) {
      const e = Object.assign({}, t); delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(Ze, this.handleSourcePropertyChange_); const i = t.source ? t.source : null; this.setSource(i);
    }getLayersArray(t) {
      return (t = t || []).push(this), t;
    }getLayerStatesArray(t) {
      return (t = t || []).push(this.getLayerState()), t;
    }getSource() {
      return this.get(Ze) || null;
    }getRenderSource() {
      return this.getSource();
    }getSourceState() {
      const t = this.getSource(); return t ? t.getState() : 'undefined';
    }handleSourceChange_() {
      this.changed(), this.sourceReady_ || this.getSource().getState() !== 'ready' || (this.sourceReady_ = !0, this.dispatchEvent('sourceready'));
    }handleSourcePropertyChange_() {
      this.sourceChangeKey_ && (E(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1; const t = this.getSource(); t && (this.sourceChangeKey_ = S(t, g, this.handleSourceChange_, this), t.getState() === 'ready' && (this.sourceReady_ = !0, setTimeout((()=>{
        this.dispatchEvent('sourceready');
      }), 0))), this.changed();
    }getFeatures(t) {
      return this.renderer_ ? this.renderer_.getFeatures(t) : Promise.resolve([]);
    }getData(t) {
      return this.renderer_ && this.rendered ? this.renderer_.getData(t) : null;
    }render(t, e) {
      const i = this.getRenderer(); if (i.prepareFrame(t)) {
        return this.rendered = !0, i.renderFrame(t, e);
      }
    }unrender() {
      this.rendered = !1;
    }setMapInternal(t) {
      t || this.unrender(), this.set(Ue, t);
    }getMapInternal() {
      return this.get(Ue);
    }setMap(t) {
      this.mapPrecomposeKey_ && (E(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (E(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = S(t, $e, (function (t) {
        const e = t.frameState.layerStatesArray; const i = this.getLayerState(!1); St(!e.some((function (t) {
          return t.layer === i.layer;
        })), 67), e.push(i);
      }), this), this.mapRenderKey_ = S(this, g, t.render, t), this.changed());
    }setSource(t) {
      this.set(Ze, t);
    }getRenderer() {
      return this.renderer_ || (this.renderer_ = this.createRenderer()), this.renderer_;
    }hasRenderer() {
      return !!this.renderer_;
    }createRenderer() {
      return null;
    }disposeInternal() {
      this.renderer_ && (this.renderer_.dispose(), delete this.renderer_), this.setSource(null), super.disposeInternal();
    }
  }; function ri(t, e) {
    let i = !0; for (let n = t.length - 1; n >= 0; --n) {
      if (t[n] != e[n]) {
        i = !1; break;
      }
    } return i;
  } function si(t, e) {
    const i = Math.cos(e); const n = Math.sin(e); const r = t[0] * i - t[1] * n; const s = t[1] * i + t[0] * n; return t[0] = r, t[1] = s, t;
  } function oi(t, e) {
    if (e.canWrapX()) {
      const i = ye(e.getExtent()); const n = function (t, e, i) {
        const n = e.getExtent(); let r = 0; e.canWrapX() && (t[0] < n[0] || t[0] > n[2]) && (i = i || ye(n), r = Math.floor((t[0] - n[0]) / i)); return r;
      }(t, e, i); n && (t[0] -= n * i);
    } return t;
  } function ai(t, e) {
    Ge.expire();
  } let li = class extends i {
    constructor(t) {
      super(), this.map_ = t;
    }dispatchRenderEvent(t, e) {
      M();
    }calculateMatrices2D(t) {
      const e = t.viewState; const i = t.coordinateToPixelTransform; const n = t.pixelToCoordinateTransform; Ft(i, t.size[0] / 2, t.size[1] / 2, 1 / e.resolution, -1 / e.resolution, -e.rotation, -e.center[0], -e.center[1]), Pt(n, i);
    }forEachFeatureAtCoordinate(t, e, i, n, r, s, o, a) {
      let l; const h = e.viewState; function u(t, e, i, n) {
        return r.call(s, e, t ? i : null, n);
      } const c = h.projection; const d = oi(t.slice(), c); const p = [[0, 0]]; if (c.canWrapX() && n) {
        const t = ye(c.getExtent()); p.push([-t, 0], [t, 0]);
      } const g = e.layerStatesArray; const f = g.length; const m = []; const y = []; for (let n = 0; n < p.length; n++) {
        for (let r = f - 1; r >= 0; --r) {
          const s = g[r]; const c = s.layer; if (c.hasRenderer() && ii(s, h) && o.call(a, c)) {
            const r = c.getRenderer(); const o = c.getSource(); if (r && o) {
              const a = o.getWrapX() ? d : t; const h = u.bind(null, s.managed); y[0] = a[0] + p[n][0], y[1] = a[1] + p[n][1], l = r.forEachFeatureAtCoordinate(y, e, i, h, m);
            } if (l) {
              return l;
            }
          }
        }
      } if (m.length === 0) {
        return;
      } const _ = 1 / m.length; return m.forEach(((t, e)=>t.distanceSq += e * _)), m.sort(((t, e)=>t.distanceSq - e.distanceSq)), m.some(((t)=>l = t.callback(t.feature, t.layer, t.geometry))), l;
    }hasFeatureAtCoordinate(t, e, i, n, r, s) {
      return void 0 !== this.forEachFeatureAtCoordinate(t, e, i, n, l, this, r, s);
    }getMap() {
      return this.map_;
    }renderFrame(t) {
      M();
    }scheduleExpireIconCache(t) {
      Ge.canExpireCache() && t.postRenderFunctions.push(ai);
    }
  }; let hi = class extends t {
    constructor(t, e, i, n) {
      super(t), this.inversePixelTransform = e, this.frameState = i, this.context = n;
    }
  }; const ui = '10px sans-serif'; const ci = '#000'; const di = 'round'; const pi = []; const gi = 'round'; const fi = '#000'; const mi = 'center'; const yi = 'middle'; const _i = [0, 0, 0, 0]; const vi = new L(); let xi; let bi = null; const wi = {}; const Ci = function () {
    const t = '32px '; const e = ['monospace', 'serif']; const i = e.length; const n = 'wmytzilWMYTZIL@#/&?$%10'; let r; let s; function o(r, o, a) {
      let l = !0; for (let h = 0; h < i; ++h) {
        const i = e[h]; if (s = Ei(r + ' ' + o + ' ' + t + i, n), a != i) {
          const e = Ei(r + ' ' + o + ' ' + t + a + ',' + i, n); l = l && e != s;
        }
      } return !!l;
    } function a() {
      let t = !0; const e = vi.getKeys(); for (let i = 0, n = e.length; i < n; ++i) {
        const n = e[i]; vi.get(n) < 100 && (o.apply(this, n.split('\n')) ? (c(wi), bi = null, xi = void 0, vi.set(n, 100)) : (vi.set(n, vi.get(n) + 1, !0), t = !1));
      }t && (clearInterval(r), r = void 0);
    } return function (t) {
      const e = lt(t); if (!e) {
        return;
      } const i = e.families; for (let t = 0, n = i.length; t < n; ++t) {
        const n = i[t]; const s = e.style + '\n' + e.weight + '\n' + n; void 0 === vi.get(s) && (vi.set(s, 100, !0), o(e.style, e.weight, n) || (vi.set(s, 0, !0), void 0 === r && (r = setInterval(a, 32))));
      }
    };
  }(); const Si = function () {
    let t; return function (e) {
      let i = wi[e]; if (i == null) {
        if (B) {
          const t = lt(e); const n = Ti(e, 'Žg'); i = (isNaN(Number(t.lineHeight)) ? 1.2 : Number(t.lineHeight)) * (n.actualBoundingBoxAscent + n.actualBoundingBoxDescent);
        } else {
          t || (t = document.createElement('div'), t.innerHTML = 'M', t.style.minHeight = '0', t.style.maxHeight = 'none', t.style.height = 'auto', t.style.padding = '0', t.style.border = 'none', t.style.position = 'absolute', t.style.display = 'block', t.style.left = '-99999px'), t.style.font = e, document.body.appendChild(t), i = t.offsetHeight, document.body.removeChild(t);
        }wi[e] = i;
      } return i;
    };
  }(); function Ti(t, e) {
    return bi || (bi = K(1, 1)), t != xi && (bi.font = t, xi = bi.font), bi.measureText(e);
  } function Ei(t, e) {
    return Ti(t, e).width;
  } function Ri(t, e, i) {
    if (e in i) {
      return i[e];
    } const n = e.split('\n').reduce(((e, i)=>Math.max(e, Ei(t, i))), 0); return i[e] = n, n;
  } function Ii(t, e, i, n, r, s, o, a, l, h, u) {
    t.save(), i !== 1 && (t.globalAlpha *= i), e && t.setTransform.apply(t, e), n.contextInstructions ? (t.translate(l, h), t.scale(u[0], u[1]), function (t, e) {
      const i = t.contextInstructions; for (let t = 0, n = i.length; t < n; t += 2) {
        Array.isArray(i[t + 1]) ? e[i[t]].apply(e, i[t + 1]) : e[i[t]] = i[t + 1];
      }
    }(n, t)) : u[0] < 0 || u[1] < 0 ? (t.translate(l, h), t.scale(u[0], u[1]), t.drawImage(n, r, s, o, a, 0, 0, o, a)) : t.drawImage(n, r, s, o, a, l, h, o * u[0], a * u[1]), t.restore();
  } let Mi = class extends li {
    constructor(t) {
      super(t), this.fontChangeListenerKey_ = S(vi, e, t.redrawText.bind(t)), this.element_ = document.createElement('div'); const i = this.element_.style; i.position = 'absolute', i.width = '100%', i.height = '100%', i.zIndex = '0', this.element_.className = 'ol-unselectable ol-layers'; const n = t.getViewport(); n.insertBefore(this.element_, n.firstChild || null), this.children_ = [], this.renderedVisible_ = !0;
    }dispatchRenderEvent(t, e) {
      const i = this.getMap(); if (i.hasListener(t)) {
        const n = new hi(t, void 0, e); i.dispatchEvent(n);
      }
    }disposeInternal() {
      E(this.fontChangeListenerKey_), this.element_.parentNode.removeChild(this.element_), super.disposeInternal();
    }renderFrame(t) {
      if (!t) {
        return void (this.renderedVisible_ && (this.element_.style.display = 'none', this.renderedVisible_ = !1));
      } this.calculateMatrices2D(t), this.dispatchRenderEvent($e, t); const e = t.layerStatesArray.sort((function (t, e) {
        return t.zIndex - e.zIndex;
      })); const i = t.viewState; this.children_.length = 0; const n = []; let r = null; for (let s = 0, o = e.length; s < o; ++s) {
        const o = e[s]; t.layerIndex = s; const a = o.layer; const l = a.getSourceState(); if (!ii(o, i) || l != 'ready' && l != 'undefined') {
          a.unrender(); continue;
        } const h = a.render(t, r); h && (h !== r && (this.children_.push(h), r = h), 'getDeclutter' in a && n.push(a));
      } for (let e = n.length - 1; e >= 0; --e) {
        n[e].renderDeclutter(t);
      }!function (t, e) {
        const i = t.childNodes; for (let n = 0; ;++n) {
          const r = i[n]; const s = e[n]; if (!r && !s) {
            break;
          } r !== s && (r ? s ? t.insertBefore(s, r) : (t.removeChild(r), --n) : t.appendChild(s));
        }
      }(this.element_, this.children_), this.dispatchRenderEvent(ti, t), this.renderedVisible_ || (this.element_.style.display = '', this.renderedVisible_ = !0), this.scheduleExpireIconCache(t);
    }
  }; class ki extends t {
    constructor(t, e) {
      super(t), this.layer = e;
    }
  } const Fi = 'layers'; class Pi extends He {
    constructor(t) {
      t = t || {}; const e = Object.assign({}, t); delete e.layers; let i = t.layers; super(e), this.on, this.once, this.un, this.layersListenerKeys_ = [], this.listenerKeys_ = {}, this.addChangeListener(Fi, this.handleLayersChanged_), i ? Array.isArray(i) ? i = new Ct(i.slice(), {unique: !0}) : St(typeof i.getArray === 'function', 43) : i = new Ct(void 0, {unique: !0}), this.setLayers(i);
    }handleLayerChange_() {
      this.changed();
    }handleLayersChanged_() {
      this.layersListenerKeys_.forEach(E), this.layersListenerKeys_.length = 0; const t = this.getLayers(); this.layersListenerKeys_.push(S(t, vt, this.handleLayersAdd_, this), S(t, xt, this.handleLayersRemove_, this)); for (const t in this.listenerKeys_) {
        this.listenerKeys_[t].forEach(E);
      } c(this.listenerKeys_); const e = t.getArray(); for (let t = 0, i = e.length; t < i; t++) {
        const i = e[t]; this.registerLayerListeners_(i), this.dispatchEvent(new ki('addlayer', i));
      } this.changed();
    }registerLayerListeners_(t) {
      const i = [S(t, e, this.handleLayerChange_, this), S(t, g, this.handleLayerChange_, this)]; t instanceof Pi && i.push(S(t, 'addlayer', this.handleLayerGroupAdd_, this), S(t, 'removelayer', this.handleLayerGroupRemove_, this)), this.listenerKeys_[F(t)] = i;
    }handleLayerGroupAdd_(t) {
      this.dispatchEvent(new ki('addlayer', t.layer));
    }handleLayerGroupRemove_(t) {
      this.dispatchEvent(new ki('removelayer', t.layer));
    }handleLayersAdd_(t) {
      const e = t.element; this.registerLayerListeners_(e), this.dispatchEvent(new ki('addlayer', e)), this.changed();
    }handleLayersRemove_(t) {
      const e = t.element; const i = F(e); this.listenerKeys_[i].forEach(E), delete this.listenerKeys_[i], this.dispatchEvent(new ki('removelayer', e)), this.changed();
    }getLayers() {
      return this.get(Fi);
    }setLayers(t) {
      const e = this.getLayers(); if (e) {
        const t = e.getArray(); for (let e = 0, i = t.length; e < i; ++e) {
          this.dispatchEvent(new ki('removelayer', t[e]));
        }
      } this.set(Fi, t);
    }getLayersArray(t) {
      return t = void 0 !== t ? t : [], this.getLayers().forEach((function (e) {
        e.getLayersArray(t);
      })), t;
    }getLayerStatesArray(t) {
      const e = void 0 !== t ? t : []; const i = e.length; this.getLayers().forEach((function (t) {
        t.getLayerStatesArray(e);
      })); const n = this.getLayerState(); let r = n.zIndex; t || void 0 !== n.zIndex || (r = 0); for (let t = i, s = e.length; t < s; t++) {
        const i = e[t]; i.opacity *= n.opacity, i.visible = i.visible && n.visible, i.maxResolution = Math.min(i.maxResolution, n.maxResolution), i.minResolution = Math.max(i.minResolution, n.minResolution), i.minZoom = Math.max(i.minZoom, n.minZoom), i.maxZoom = Math.min(i.maxZoom, n.maxZoom), void 0 !== n.extent && (void 0 !== i.extent ? i.extent = ge(i.extent, n.extent) : i.extent = n.extent), void 0 === i.zIndex && (i.zIndex = r);
      } return e;
    }getSourceState() {
      return 'ready';
    }
  } let Li = Pi; let Ai = class extends t {
    constructor(t, e, i) {
      super(t), this.map = e, this.frameState = void 0 !== i ? i : null;
    }
  }; let zi = class extends Ai {
    constructor(t, e, i, n, r, s) {
      super(t, e, r), this.originalEvent = i, this.pixel_ = null, this.coordinate_ = null, this.dragging = void 0 !== n && n, this.activePointers = s;
    } get pixel() {
      return this.pixel_ || (this.pixel_ = this.map.getEventPixel(this.originalEvent)), this.pixel_;
    } set pixel(t) {
      this.pixel_ = t;
    } get coordinate() {
      return this.coordinate_ || (this.coordinate_ = this.map.getCoordinateFromPixel(this.pixel)), this.coordinate_;
    } set coordinate(t) {
      this.coordinate_ = t;
    }preventDefault() {
      super.preventDefault(), 'preventDefault' in this.originalEvent && this.originalEvent.preventDefault();
    }stopPropagation() {
      super.stopPropagation(), 'stopPropagation' in this.originalEvent && this.originalEvent.stopPropagation();
    }
  }; let Oi = {SINGLECLICK: 'singleclick', CLICK: y, DBLCLICK: _, POINTERDRAG: 'pointerdrag', POINTERMOVE: 'pointermove', POINTERDOWN: 'pointerdown', POINTERUP: 'pointerup', POINTEROVER: 'pointerover', POINTEROUT: 'pointerout', POINTERENTER: 'pointerenter', POINTERLEAVE: 'pointerleave', POINTERCANCEL: 'pointercancel'}; let Di = 'pointermove'; let ji = 'pointerdown'; let Gi = class extends p {
    constructor(t, e) {
      super(t), this.map_ = t, this.clickTimeoutId_, this.emulateClicks_ = !1, this.dragging_ = !1, this.dragListenerKeys_ = [], this.moveTolerance_ = void 0 === e ? 1 : e, this.down_ = null; const i = this.map_.getViewport(); this.activePointers_ = [], this.trackedTouches_ = {}, this.element_ = i, this.pointerdownListenerKey_ = S(i, ji, this.handlePointerDown_, this), this.originalPointerMoveEvent_, this.relayedListenerKey_ = S(i, Di, this.relayMoveEvent_, this), this.boundHandleTouchMove_ = this.handleTouchMove_.bind(this), this.element_.addEventListener(w, this.boundHandleTouchMove_, !!Y && {passive: !1});
    }emulateClick_(t) {
      let e = new zi(Oi.CLICK, this.map_, t); this.dispatchEvent(e), void 0 !== this.clickTimeoutId_ ? (clearTimeout(this.clickTimeoutId_), this.clickTimeoutId_ = void 0, e = new zi(Oi.DBLCLICK, this.map_, t), this.dispatchEvent(e)) : this.clickTimeoutId_ = setTimeout((()=>{
        this.clickTimeoutId_ = void 0; const e = new zi(Oi.SINGLECLICK, this.map_, t); this.dispatchEvent(e);
      }), 250);
    }updateActivePointers_(t) {
      const e = t; const i = e.pointerId; if (e.type == Oi.POINTERUP || e.type == Oi.POINTERCANCEL) {
        delete this.trackedTouches_[i]; for (const t in this.trackedTouches_) {
          if (this.trackedTouches_[t].target !== e.target) {
            delete this.trackedTouches_[t]; break;
          }
        }
      } else {
        e.type != Oi.POINTERDOWN && e.type != Oi.POINTERMOVE || (this.trackedTouches_[i] = e);
      } this.activePointers_ = Object.values(this.trackedTouches_);
    }handlePointerUp_(t) {
      this.updateActivePointers_(t); const e = new zi(Oi.POINTERUP, this.map_, t, void 0, void 0, this.activePointers_); this.dispatchEvent(e), this.emulateClicks_ && !e.defaultPrevented && !this.dragging_ && this.isMouseActionButton_(t) && this.emulateClick_(this.down_), this.activePointers_.length === 0 && (this.dragListenerKeys_.forEach(E), this.dragListenerKeys_.length = 0, this.dragging_ = !1, this.down_ = null);
    }isMouseActionButton_(t) {
      return t.button === 0;
    }handlePointerDown_(t) {
      this.emulateClicks_ = this.activePointers_.length === 0, this.updateActivePointers_(t); const e = new zi(Oi.POINTERDOWN, this.map_, t, void 0, void 0, this.activePointers_); this.dispatchEvent(e), this.down_ = {}; for (const e in t) {
        const i = t[e]; this.down_[e] = typeof i === 'function' ? u : i;
      } if (this.dragListenerKeys_.length === 0) {
        const t = this.map_.getOwnerDocument(); this.dragListenerKeys_.push(S(t, Oi.POINTERMOVE, this.handlePointerMove_, this), S(t, Oi.POINTERUP, this.handlePointerUp_, this), S(this.element_, Oi.POINTERCANCEL, this.handlePointerUp_, this)), this.element_.getRootNode && this.element_.getRootNode() !== t && this.dragListenerKeys_.push(S(this.element_.getRootNode(), Oi.POINTERUP, this.handlePointerUp_, this));
      }
    }handlePointerMove_(t) {
      if (this.isMoving_(t)) {
        this.updateActivePointers_(t), this.dragging_ = !0; const e = new zi(Oi.POINTERDRAG, this.map_, t, this.dragging_, void 0, this.activePointers_); this.dispatchEvent(e);
      }
    }relayMoveEvent_(t) {
      this.originalPointerMoveEvent_ = t; const e = !(!this.down_ || !this.isMoving_(t)); this.dispatchEvent(new zi(Oi.POINTERMOVE, this.map_, t, e));
    }handleTouchMove_(t) {
      const e = this.originalPointerMoveEvent_; e && !e.defaultPrevented || typeof t.cancelable === 'boolean' && !0 !== t.cancelable || t.preventDefault();
    }isMoving_(t) {
      return this.dragging_ || Math.abs(t.clientX - this.down_.clientX) > this.moveTolerance_ || Math.abs(t.clientY - this.down_.clientY) > this.moveTolerance_;
    }disposeInternal() {
      this.relayedListenerKey_ && (E(this.relayedListenerKey_), this.relayedListenerKey_ = null), this.element_.removeEventListener(w, this.boundHandleTouchMove_), this.pointerdownListenerKey_ && (E(this.pointerdownListenerKey_), this.pointerdownListenerKey_ = null), this.dragListenerKeys_.forEach(E), this.dragListenerKeys_.length = 0, this.element_ = null, super.disposeInternal();
    }
  }; const Ni = 1 / 0; let Wi = class {
    constructor(t, e) {
      this.priorityFunction_ = t, this.keyFunction_ = e, this.elements_ = [], this.priorities_ = [], this.queuedElements_ = {};
    }clear() {
      this.elements_.length = 0, this.priorities_.length = 0, c(this.queuedElements_);
    }dequeue() {
      const t = this.elements_; const e = this.priorities_; const i = t[0]; t.length == 1 ? (t.length = 0, e.length = 0) : (t[0] = t.pop(), e[0] = e.pop(), this.siftUp_(0)); const n = this.keyFunction_(i); return delete this.queuedElements_[n], i;
    }enqueue(t) {
      St(!(this.keyFunction_(t) in this.queuedElements_), 31); const e = this.priorityFunction_(t); return e != Ni && (this.elements_.push(t), this.priorities_.push(e), this.queuedElements_[this.keyFunction_(t)] = !0, this.siftDown_(0, this.elements_.length - 1), !0);
    }getCount() {
      return this.elements_.length;
    }getLeftChildIndex_(t) {
      return 2 * t + 1;
    }getRightChildIndex_(t) {
      return 2 * t + 2;
    }getParentIndex_(t) {
      return t - 1 >> 1;
    }heapify_() {
      let t; for (t = (this.elements_.length >> 1) - 1; t >= 0; t--) {
        this.siftUp_(t);
      }
    }isEmpty() {
      return this.elements_.length === 0;
    }isKeyQueued(t) {
      return t in this.queuedElements_;
    }isQueued(t) {
      return this.isKeyQueued(this.keyFunction_(t));
    }siftUp_(t) {
      const e = this.elements_; const i = this.priorities_; const n = e.length; const r = e[t]; const s = i[t]; const o = t; for (;t < n >> 1;) {
        const r = this.getLeftChildIndex_(t); const s = this.getRightChildIndex_(t); const o = s < n && i[s] < i[r] ? s : r; e[t] = e[o], i[t] = i[o], t = o;
      }e[t] = r, i[t] = s, this.siftDown_(o, t);
    }siftDown_(t, e) {
      const i = this.elements_; const n = this.priorities_; const r = i[e]; const s = n[e]; for (;e > t;) {
        const t = this.getParentIndex_(e); if (!(n[t] > s)) {
          break;
        } i[e] = i[t], n[e] = n[t], e = t;
      }i[e] = r, n[e] = s;
    }reprioritize() {
      const t = this.priorityFunction_; const e = this.elements_; const i = this.priorities_; let n = 0; const r = e.length; let s; let o; let a; for (o = 0; o < r; ++o) {
        s = e[o], a = t(s), a == Ni ? delete this.queuedElements_[this.keyFunction_(s)] : (i[n] = a, e[n++] = s);
      }e.length = n, i.length = n, this.heapify_();
    }
  }; let Xi = 0; let qi = 1; let Bi = 2; let Vi = 3; let Yi = 4; let Ki = class extends Wi {
    constructor(t, e) {
      super((function (e) {
        return t.apply(null, e);
      }), (function (t) {
        return t[0].getKey();
      })), this.boundHandleTileChange_ = this.handleTileChange.bind(this), this.tileChangeCallback_ = e, this.tilesLoading_ = 0, this.tilesLoadingKeys_ = {};
    }enqueue(t) {
      const e = super.enqueue(t); if (e) {
        t[0].addEventListener(g, this.boundHandleTileChange_);
      } return e;
    }getTilesLoading() {
      return this.tilesLoading_;
    }handleTileChange(t) {
      const e = t.target; const i = e.getState(); if (i === Bi || i === Vi || i === Yi) {
        i !== Vi && e.removeEventListener(g, this.boundHandleTileChange_); const t = e.getKey(); t in this.tilesLoadingKeys_ && (delete this.tilesLoadingKeys_[t], --this.tilesLoading_), this.tileChangeCallback_();
      }
    }loadMoreTiles(t, e) {
      let i; let n; let r; let s = 0; for (;this.tilesLoading_ < t && s < e && this.getCount() > 0;) {
        n = this.dequeue()[0], r = n.getKey(), i = n.getState(), i !== Xi || r in this.tilesLoadingKeys_ || (this.tilesLoadingKeys_[r] = !0, ++this.tilesLoading_, ++s, n.load());
      }
    }
  }; let Zi = 0; let Ui = 1; let Hi = {CENTER: 'center', RESOLUTION: 'resolution', ROTATION: 'rotation'}; const Ji = 256; const Qi = {'radians': 6370997 / (2 * Math.PI), 'degrees': 2 * Math.PI * 6370997 / 360, 'ft': 0.3048, 'm': 1, 'us-ft': 1200 / 3937}; let $i = class {
    constructor(t) {
      this.code_ = t.code, this.units_ = t.units, this.extent_ = void 0 !== t.extent ? t.extent : null, this.worldExtent_ = void 0 !== t.worldExtent ? t.worldExtent : null, this.axisOrientation_ = void 0 !== t.axisOrientation ? t.axisOrientation : 'enu', this.global_ = void 0 !== t.global && t.global, this.canWrapX_ = !(!this.global_ || !this.extent_), this.getPointResolutionFunc_ = t.getPointResolution, this.defaultTileGrid_ = null, this.metersPerUnit_ = t.metersPerUnit;
    }canWrapX() {
      return this.canWrapX_;
    }getCode() {
      return this.code_;
    }getExtent() {
      return this.extent_;
    }getUnits() {
      return this.units_;
    }getMetersPerUnit() {
      return this.metersPerUnit_ || Qi[this.units_];
    }getWorldExtent() {
      return this.worldExtent_;
    }getAxisOrientation() {
      return this.axisOrientation_;
    }isGlobal() {
      return this.global_;
    }setGlobal(t) {
      this.global_ = t, this.canWrapX_ = !(!t || !this.extent_);
    }getDefaultTileGrid() {
      return this.defaultTileGrid_;
    }setDefaultTileGrid(t) {
      this.defaultTileGrid_ = t;
    }setExtent(t) {
      this.extent_ = t, this.canWrapX_ = !(!this.global_ || !t);
    }setWorldExtent(t) {
      this.worldExtent_ = t;
    }setGetPointResolution(t) {
      this.getPointResolutionFunc_ = t;
    }getPointResolutionFunc() {
      return this.getPointResolutionFunc_;
    }
  }; const tn = 6378137; const en = Math.PI * tn; const nn = [-en, -en, en, en]; const rn = [-180, -85, 180, 85]; const sn = tn * Math.log(Math.tan(Math.PI / 2)); class on extends $i {
    constructor(t) {
      super({code: t, units: 'm', extent: nn, global: !0, worldExtent: rn, getPointResolution(t, e) {
        return t / Math.cosh(e[1] / tn);
      }});
    }
  } const an = [new on('EPSG:3857'), new on('EPSG:102100'), new on('EPSG:102113'), new on('EPSG:900913'), new on('http://www.opengis.net/def/crs/EPSG/0/3857'), new on('http://www.opengis.net/gml/srs/epsg.xml#3857')]; function ln(t, e, i) {
    const n = t.length; i = i > 1 ? i : 2, void 0 === e && (e = i > 2 ? t.slice() : new Array(n)); for (let r = 0; r < n; r += i) {
      e[r] = en * t[r] / 180; let i = tn * Math.log(Math.tan(Math.PI * (+t[r + 1] + 90) / 360)); i > sn ? i = sn : i < -sn && (i = -sn), e[r + 1] = i;
    } return e;
  } function hn(t, e, i) {
    const n = t.length; i = i > 1 ? i : 2, void 0 === e && (e = i > 2 ? t.slice() : new Array(n)); for (let r = 0; r < n; r += i) {
      e[r] = 180 * t[r] / en, e[r + 1] = 360 * Math.atan(Math.exp(t[r + 1] / tn)) / Math.PI - 90;
    } return e;
  } const un = [-180, -90, 180, 90]; const cn = 6378137 * Math.PI / 180; class dn extends $i {
    constructor(t, e) {
      super({code: t, units: 'degrees', extent: un, axisOrientation: e, global: !0, metersPerUnit: cn, worldExtent: un});
    }
  } const pn = [new dn('CRS:84'), new dn('EPSG:4326', 'neu'), new dn('urn:ogc:def:crs:OGC:1.3:CRS84'), new dn('urn:ogc:def:crs:OGC:2:84'), new dn('http://www.opengis.net/def/crs/OGC/1.3/CRS84'), new dn('http://www.opengis.net/gml/srs/epsg.xml#4326', 'neu'), new dn('http://www.opengis.net/def/crs/EPSG/0/4326', 'neu')]; let gn = {}; let fn = {}; function mn(t, e, i) {
    const n = t.getCode(); const r = e.getCode(); n in fn || (fn[n] = {}), fn[n][r] = i;
  } function yn(t, e, i) {
    i = i || 6371008.8; const n = Te(t[1]); const r = Te(e[1]); const s = (r - n) / 2; const o = Te(e[0] - t[0]) / 2; const a = Math.sin(s) * Math.sin(s) + Math.sin(o) * Math.sin(o) * Math.cos(n) * Math.cos(r); return 2 * i * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  } const _n = 2; let vn = 1; function xn(...t) {
    vn > _n || console.warn(...t);
  } let bn = !0; function wn(t) {
    bn = !(void 0 === t || t);
  } function Cn(t, e) {
    if (void 0 !== e) {
      for (let i = 0, n = t.length; i < n; ++i) {
        e[i] = t[i];
      }
    } else {
      e = t.slice();
    } return e;
  } function Sn(t, e) {
    if (void 0 !== e && t !== e) {
      for (let i = 0, n = t.length; i < n; ++i) {
        e[i] = t[i];
      }t = e;
    } return t;
  } function Tn(t) {
    !function (t, e) {
      gn[t] = e;
    }(t.getCode(), t), mn(t, t, Cn);
  } function En(t) {
    return typeof t === 'string' ? gn[e = t] || gn[e.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, 'EPSG:$3')] || null : t || null; let e;
  } function Rn(t, e, i, n) {
    let r; const s = (t = En(t)).getPointResolutionFunc(); if (s) {
      if (r = s(e, i), n && n !== t.getUnits()) {
        const e = t.getMetersPerUnit(); e && (r = r * e / Qi[n]);
      }
    } else {
      const s = t.getUnits(); if (s == 'degrees' && !n || n == 'degrees') {
        r = e;
      } else {
        const o = Pn(t, En('EPSG:4326')); if (o === Sn && s !== 'degrees') {
          r = e * t.getMetersPerUnit();
        } else {
          let t = [i[0] - e / 2, i[1], i[0] + e / 2, i[1], i[0], i[1] - e / 2, i[0], i[1] + e / 2]; t = o(t, t, 2); r = (yn(t.slice(0, 2), t.slice(2, 4)) + yn(t.slice(4, 6), t.slice(6, 8))) / 2;
        } const a = n ? Qi[n] : t.getMetersPerUnit(); void 0 !== a && (r /= a);
      }
    } return r;
  } function In(t) {
    !function (t) {
      t.forEach(Tn);
    }(t), t.forEach((function (e) {
      t.forEach((function (t) {
        e !== t && mn(e, t, Cn);
      }));
    }));
  } function Mn(t, e) {
    return t ? typeof t === 'string' ? En(t) : t : En(e);
  } function kn(t, e) {
    return wn(), An(t, 'EPSG:4326', void 0 !== e ? e : 'EPSG:3857');
  } function Fn(t, e) {
    if (t === e) {
      return !0;
    } const i = t.getUnits() === e.getUnits(); if (t.getCode() === e.getCode()) {
      return i;
    } return Pn(t, e) === Cn && i;
  } function Pn(t, e) {
    let i = function (t, e) {
      let i; return t in fn && e in fn[t] && (i = fn[t][e]), i;
    }(t.getCode(), e.getCode()); return i || (i = Sn), i;
  } function Ln(t, e) {
    return Pn(En(t), En(e));
  } function An(t, e, i) {
    return Ln(e, i)(t, void 0, t.length);
  } function zn(t, e) {
    return t;
  } function On(t, e) {
    return bn && !ri(t, [0, 0]) && t[0] >= -180 && t[0] <= 180 && t[1] >= -90 && t[1] <= 90 && (bn = !1, xn('Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates.')), t;
  } function Dn(t, e) {
    return t;
  } function jn(t, e) {
    return t;
  } let Gn; let Nn; let Wn; function Xn(t, e, i) {
    return function (n, r, s, o, a) {
      if (!n) {
        return;
      } if (!r && !e) {
        return n;
      } const l = e ? 0 : s[0] * r; const h = e ? 0 : s[1] * r; const u = a ? a[0] : 0; const c = a ? a[1] : 0; let d = t[0] + l / 2 + u; let p = t[2] - l / 2 + u; let g = t[1] + h / 2 + c; let f = t[3] - h / 2 + c; d > p && (d = (p + d) / 2, p = d), g > f && (g = (f + g) / 2, f = g); let m = we(n[0], d, p); let y = we(n[1], g, f); if (o && i && r) {
        const t = 30 * r; m += -t * Math.log(1 + Math.max(0, d - n[0]) / t) + t * Math.log(1 + Math.max(0, n[0] - p) / t), y += -t * Math.log(1 + Math.max(0, g - n[1]) / t) + t * Math.log(1 + Math.max(0, n[1] - f) / t);
      } return [m, y];
    };
  } function qn(t) {
    return t;
  } function Bn(t, e, i, n) {
    const r = ye(e) / i[0]; const s = pe(e) / i[1]; return n ? Math.min(t, Math.max(r, s)) : Math.min(t, Math.min(r, s));
  } function Vn(t, e, i) {
    let n = Math.min(t, e); return n *= Math.log(1 + 50 * Math.max(0, t / e - 1)) / 50 + 1, i && (n = Math.max(n, i), n /= Math.log(1 + 50 * Math.max(0, i / t - 1)) / 50 + 1), we(n, i / 2, 2 * e);
  } function Yn(t, e, i, n, r) {
    return i = void 0 === i || i, function (s, o, a, l) {
      if (void 0 !== s) {
        const o = n ? Bn(t, n, a, r) : t; return i && l ? Vn(s, o, e) : we(s, e, o);
      }
    };
  } function Kn(t) {
    if (void 0 !== t) {
      return 0;
    }
  } function Zn(t) {
    if (void 0 !== t) {
      return t;
    }
  } function Un(t) {
    return Math.pow(t, 3);
  } function Hn(t) {
    return 1 - Un(1 - t);
  } function Jn(t) {
    return 3 * t * t - 2 * t * t * t;
  } function Qn(t) {
    return t;
  } function $n(t, e, i, n, r, s) {
    s = s || []; let o = 0; for (let a = e; a < i; a += n) {
      const e = t[a]; const i = t[a + 1]; s[o++] = r[0] * e + r[2] * i + r[4], s[o++] = r[1] * e + r[3] * i + r[5];
    } return s && s.length != o && (s.length = o), s;
  } function tr(t, e, i, n, r, s, o) {
    o = o || []; const a = Math.cos(r); const l = Math.sin(r); const h = s[0]; const u = s[1]; let c = 0; for (let r = e; r < i; r += n) {
      const e = t[r] - h; const i = t[r + 1] - u; o[c++] = h + e * a - i * l, o[c++] = u + e * l + i * a; for (let e = r + 2; e < r + n; ++e) {
        o[c++] = t[e];
      }
    } return o && o.length != c && (o.length = c), o;
  }In(an), In(pn), Gn = an, Nn = ln, Wn = hn, pn.forEach((function (t) {
    Gn.forEach((function (e) {
      mn(t, e, Nn), mn(e, t, Wn);
    }));
  })); const er = [1, 0, 0, 1, 0, 0]; let ir = class extends L {
    constructor() {
      super(), this.extent_ = [1 / 0, 1 / 0, -1 / 0, -1 / 0], this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = function (t) {
        let e; let i; let n; let r = !1; return function () {
          const s = Array.prototype.slice.call(arguments); return r && this === n && a(s, i) || (r = !0, n = this, i = s, e = t.apply(this, arguments)), e;
        };
      }((function (t, e, i) {
        if (!i) {
          return this.getSimplifiedGeometry(e);
        } const n = this.clone(); return n.applyTransform(i), n.getSimplifiedGeometry(e);
      }));
    }simplifyTransformed(t, e) {
      return this.simplifyTransformedInternal(this.getRevision(), t, e);
    }clone() {
      return M();
    }closestPointXY(t, e, i, n) {
      return M();
    }containsXY(t, e) {
      const i = this.getClosestPoint([t, e]); return i[0] === t && i[1] === e;
    }getClosestPoint(t, e) {
      return e = e || [NaN, NaN], this.closestPointXY(t[0], t[1], e, 1 / 0), e;
    }intersectsCoordinate(t) {
      return this.containsXY(t[0], t[1]);
    }computeExtent(t) {
      return M();
    }getExtent(t) {
      if (this.extentRevision_ != this.getRevision()) {
        const t = this.computeExtent(this.extent_); (isNaN(t[0]) || isNaN(t[1])) && Jt(t), this.extentRevision_ = this.getRevision();
      } return function (t, e) {
        return e ? (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e) : t;
      }(this.extent_, t);
    }rotate(t, e) {
      M();
    }scale(t, e, i) {
      M();
    }simplify(t) {
      return this.getSimplifiedGeometry(t * t);
    }getSimplifiedGeometry(t) {
      return M();
    }getType() {
      return M();
    }applyTransform(t) {
      M();
    }intersectsExtent(t) {
      return M();
    }translate(t, e) {
      M();
    }transform(t, e) {
      const i = En(t); const n = i.getUnits() == 'tile-pixels' ? function (t, n, r) {
        const s = i.getExtent(); const o = i.getWorldExtent(); const a = pe(o) / pe(s); return Ft(er, o[0], o[3], a, -a, 0, 0, 0), $n(t, 0, t.length, r, er, n), Ln(i, e)(t, n, r);
      } : Ln(i, e); return this.applyTransform(n), this;
    }
  }; function nr(t) {
    let e; return t == 'XY' ? e = 2 : t == 'XYZ' || t == 'XYM' ? e = 3 : t == 'XYZM' && (e = 4), e;
  } let rr = class extends ir {
    constructor() {
      super(), this.layout = 'XY', this.stride = 2, this.flatCoordinates = null;
    }computeExtent(t) {
      return $t(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t);
    }getCoordinates() {
      return M();
    }getFirstCoordinate() {
      return this.flatCoordinates.slice(0, this.stride);
    }getFlatCoordinates() {
      return this.flatCoordinates;
    }getLastCoordinate() {
      return this.flatCoordinates.slice(this.flatCoordinates.length - this.stride);
    }getLayout() {
      return this.layout;
    }getSimplifiedGeometry(t) {
      if (this.simplifiedGeometryRevision !== this.getRevision() && (this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = this.getRevision()), t < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && t <= this.simplifiedGeometryMaxMinSquaredTolerance) {
        return this;
      } const e = this.getSimplifiedGeometryInternal(t); return e.getFlatCoordinates().length < this.flatCoordinates.length ? e : (this.simplifiedGeometryMaxMinSquaredTolerance = t, this);
    }getSimplifiedGeometryInternal(t) {
      return this;
    }getStride() {
      return this.stride;
    }setFlatCoordinates(t, e) {
      this.stride = nr(t), this.layout = t, this.flatCoordinates = e;
    }setCoordinates(t, e) {
      M();
    }setLayout(t, e, i) {
      let n; if (t) {
        n = nr(t);
      } else {
        for (let t = 0; t < i; ++t) {
          if (e.length === 0) {
            return this.layout = 'XY', void (this.stride = 2);
          } e = e[0];
        }n = e.length, t = function (t) {
          let e; t == 2 ? e = 'XY' : t == 3 ? e = 'XYZ' : t == 4 && (e = 'XYZM'); return e;
        }(n);
      } this.layout = t, this.stride = n;
    }applyTransform(t) {
      this.flatCoordinates && (t(this.flatCoordinates, this.flatCoordinates, this.stride), this.changed());
    }rotate(t, e) {
      const i = this.getFlatCoordinates(); if (i) {
        const n = this.getStride(); tr(i, 0, i.length, n, t, e, i), this.changed();
      }
    }scale(t, e, i) {
      void 0 === e && (e = t), i || (i = he(this.getExtent())); const n = this.getFlatCoordinates(); if (n) {
        const r = this.getStride(); !function (t, e, i, n, r, s, o, a) {
          a = a || []; const l = o[0]; const h = o[1]; let u = 0; for (let o = e; o < i; o += n) {
            const e = t[o] - l; const i = t[o + 1] - h; a[u++] = l + r * e, a[u++] = h + s * i; for (let e = o + 2; e < o + n; ++e) {
              a[u++] = t[e];
            }
          }a && a.length != u && (a.length = u);
        }(n, 0, n.length, r, t, e, i, n), this.changed();
      }
    }translate(t, e) {
      const i = this.getFlatCoordinates(); if (i) {
        const n = this.getStride(); !function (t, e, i, n, r, s, o) {
          o = o || []; let a = 0; for (let l = e; l < i; l += n) {
            o[a++] = t[l] + r, o[a++] = t[l + 1] + s; for (let e = l + 2; e < l + n; ++e) {
              o[a++] = t[e];
            }
          }o && o.length != a && (o.length = a);
        }(i, 0, i.length, n, t, e, i), this.changed();
      }
    }
  }; function sr(t, e, i, n, r, s, o) {
    const a = t[e]; const l = t[e + 1]; const h = t[i] - a; const u = t[i + 1] - l; let c; if (h === 0 && u === 0) {
      c = e;
    } else {
      const d = ((r - a) * h + (s - l) * u) / (h * h + u * u); if (d > 1) {
        c = i;
      } else {
        if (d > 0) {
          for (let r = 0; r < n; ++r) {
            o[r] = Re(t[e + r], t[i + r], d);
          } return void (o.length = n);
        }c = e;
      }
    } for (let e = 0; e < n; ++e) {
      o[e] = t[c + e];
    }o.length = n;
  } function or(t, e, i, n, r) {
    let s = t[e]; let o = t[e + 1]; for (e += n; e < i; e += n) {
      const i = t[e]; const n = t[e + 1]; const a = Se(s, o, i, n); a > r && (r = a), s = i, o = n;
    } return r;
  } function ar(t, e, i, n, r) {
    for (let s = 0, o = i.length; s < o; ++s) {
      const o = i[s]; r = or(t, e, o, n, r), e = o;
    } return r;
  } function lr(t, e, i, n, r, s, o, a, l, h, u) {
    if (e == i) {
      return h;
    } let c; let d; if (r === 0) {
      if (d = Se(o, a, t[e], t[e + 1]), d < h) {
        for (c = 0; c < n; ++c) {
          l[c] = t[e + c];
        } return l.length = n, d;
      } return h;
    }u = u || [NaN, NaN]; let p = e + n; for (;p < i;) {
      if (sr(t, p - n, p, n, o, a, u), d = Se(o, a, u[0], u[1]), d < h) {
        for (h = d, c = 0; c < n; ++c) {
          l[c] = u[c];
        }l.length = n, p += n;
      } else {
        p += n * Math.max((Math.sqrt(d) - Math.sqrt(h)) / r | 0, 1);
      }
    } if (s && (sr(t, i - n, e, n, o, a, u), d = Se(o, a, u[0], u[1]), d < h)) {
      for (h = d, c = 0; c < n; ++c) {
        l[c] = u[c];
      }l.length = n;
    } return h;
  } function hr(t, e, i, n, r, s, o, a, l, h, u) {
    u = u || [NaN, NaN]; for (let c = 0, d = i.length; c < d; ++c) {
      const d = i[c]; h = lr(t, e, d, n, r, s, o, a, l, h, u), e = d;
    } return h;
  } function ur(t, e, i, n) {
    for (let r = 0, s = i.length; r < s; ++r) {
      const s = i[r]; for (let i = 0; i < n; ++i) {
        t[e++] = s[i];
      }
    } return e;
  } function cr(t, e, i, n, r) {
    r = r || []; let s = 0; for (let o = 0, a = i.length; o < a; ++o) {
      const a = ur(t, e, i[o], n); r[s++] = a, e = a;
    } return r.length = s, r;
  } function dr(t, e, i, n, r, s, o) {
    const a = (i - e) / n; if (a < 3) {
      for (;e < i; e += n) {
        s[o++] = t[e], s[o++] = t[e + 1];
      } return o;
    } const l = new Array(a); l[0] = 1, l[a - 1] = 1; const h = [e, i - n]; let u = 0; for (;h.length > 0;) {
      const i = h.pop(); const s = h.pop(); let o = 0; const a = t[s]; const c = t[s + 1]; const d = t[i]; const p = t[i + 1]; for (let e = s + n; e < i; e += n) {
        const i = Ce(t[e], t[e + 1], a, c, d, p); i > o && (u = e, o = i);
      }o > r && (l[(u - e) / n] = 1, s + n < u && h.push(s, u), u + n < i && h.push(u, i));
    } for (let i = 0; i < a; ++i) {
      l[i] && (s[o++] = t[e + i * n], s[o++] = t[e + i * n + 1]);
    } return o;
  } function pr(t, e) {
    return e * Math.round(t / e);
  } function gr(t, e, i, n, r, s, o) {
    if (e == i) {
      return o;
    } let a; let l; let h = pr(t[e], r); let u = pr(t[e + 1], r); e += n, s[o++] = h, s[o++] = u; do {
      if (a = pr(t[e], r), l = pr(t[e + 1], r), (e += n) == i) {
        return s[o++] = a, s[o++] = l, o;
      }
    } while (a == h && l == u); for (;e < i;) {
      const i = pr(t[e], r); const c = pr(t[e + 1], r); if (e += n, i == a && c == l) {
        continue;
      } const d = a - h; const p = l - u; const g = i - h; const f = c - u; d * f == p * g && (d < 0 && g < d || d == g || d > 0 && g > d) && (p < 0 && f < p || p == f || p > 0 && f > p) ? (a = i, l = c) : (s[o++] = a, s[o++] = l, h = a, u = l, a = i, l = c);
    } return s[o++] = a, s[o++] = l, o;
  } function fr(t, e, i, n, r, s, o, a) {
    for (let l = 0, h = i.length; l < h; ++l) {
      const h = i[l]; o = gr(t, e, h, n, r, s, o), a.push(o), e = h;
    } return o;
  } function mr(t, e, i, n, r) {
    r = void 0 !== r ? r : []; let s = 0; for (let o = e; o < i; o += n) {
      r[s++] = t.slice(o, o + n);
    } return r.length = s, r;
  } function yr(t, e, i, n, r) {
    r = void 0 !== r ? r : []; let s = 0; for (let o = 0, a = i.length; o < a; ++o) {
      const a = i[o]; r[s++] = mr(t, e, a, n, r[s]), e = a;
    } return r.length = s, r;
  } function _r(t, e, i, n, r) {
    r = void 0 !== r ? r : []; let s = 0; for (let o = 0, a = i.length; o < a; ++o) {
      const a = i[o]; r[s++] = a.length === 1 && a[0] === e ? [] : yr(t, e, a, n, r[s]), e = a[a.length - 1];
    } return r.length = s, r;
  } function vr(t, e, i, n) {
    let r = 0; let s = t[i - n]; let o = t[i - n + 1]; for (;e < i; e += n) {
      const i = t[e]; const n = t[e + 1]; r += o * i - s * n, s = i, o = n;
    } return r / 2;
  } function xr(t, e, i, n) {
    let r = 0; for (let s = 0, o = i.length; s < o; ++s) {
      const o = i[s]; r += vr(t, e, o, n), e = o;
    } return r;
  } class br extends rr {
    constructor(t, e) {
      super(), this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, void 0 === e || Array.isArray(t[0]) ? this.setCoordinates(t, e) : this.setFlatCoordinates(e, t);
    }clone() {
      return new br(this.flatCoordinates.slice(), this.layout);
    }closestPointXY(t, e, i, n) {
      return n < Bt(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(or(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0)), this.maxDeltaRevision_ = this.getRevision()), lr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, !0, t, e, i, n));
    }getArea() {
      return vr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
    }getCoordinates() {
      return mr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
    }getSimplifiedGeometryInternal(t) {
      const e = []; return e.length = dr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t, e, 0), new br(e, 'XY');
    }getType() {
      return 'LinearRing';
    }intersectsExtent(t) {
      return !1;
    }setCoordinates(t, e) {
      this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = ur(this.flatCoordinates, 0, t, this.stride), this.changed();
    }
  } let wr = br; class Cr extends rr {
    constructor(t, e) {
      super(), this.setCoordinates(t, e);
    }clone() {
      const t = new Cr(this.flatCoordinates.slice(), this.layout); return t.applyProperties(this), t;
    }closestPointXY(t, e, i, n) {
      const r = this.flatCoordinates; const s = Se(t, e, r[0], r[1]); if (s < n) {
        const t = this.stride; for (let e = 0; e < t; ++e) {
          i[e] = r[e];
        } return i.length = t, s;
      } return n;
    }getCoordinates() {
      return this.flatCoordinates ? this.flatCoordinates.slice() : [];
    }computeExtent(t) {
      return Qt(this.flatCoordinates, t);
    }getType() {
      return 'Point';
    }intersectsExtent(t) {
      return Kt(t, this.flatCoordinates[0], this.flatCoordinates[1]);
    }setCoordinates(t, e) {
      this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = function (t, e, i, n) {
        for (let n = 0, r = i.length; n < r; ++n) {
          t[e++] = i[n];
        } return e;
      }(this.flatCoordinates, 0, t, this.stride), this.changed();
    }
  } let Sr = Cr; function Tr(t, e, i, n, r) {
    return !se(r, (function (r) {
      return !Er(t, e, i, n, r[0], r[1]);
    }));
  } function Er(t, e, i, n, r, s) {
    let o = 0; let a = t[i - n]; let l = t[i - n + 1]; for (;e < i; e += n) {
      const i = t[e]; const n = t[e + 1]; l <= s ? n > s && (i - a) * (s - l) - (r - a) * (n - l) > 0 && o++ : n <= s && (i - a) * (s - l) - (r - a) * (n - l) < 0 && o--, a = i, l = n;
    } return o !== 0;
  } function Rr(t, e, i, n, r, s) {
    if (i.length === 0) {
      return !1;
    } if (!Er(t, e, i[0], n, r, s)) {
      return !1;
    } for (let e = 1, o = i.length; e < o; ++e) {
      if (Er(t, i[e - 1], i[e], n, r, s)) {
        return !1;
      }
    } return !0;
  } function Ir(t, e, i, r, s, o, a) {
    let l; let h; let u; let c; let d; let p; let g; const f = s[o + 1]; const m = []; for (let n = 0, s = i.length; n < s; ++n) {
      const s = i[n]; for (c = t[s - r], p = t[s - r + 1], l = e; l < s; l += r) {
        d = t[l], g = t[l + 1], (f <= p && g <= f || p <= f && f <= g) && (u = (f - p) / (g - p) * (d - c) + c, m.push(u)), c = d, p = g;
      }
    } let y = NaN; let _ = -1 / 0; for (m.sort(n), c = m[0], l = 1, h = m.length; l < h; ++l) {
      d = m[l]; const n = Math.abs(d - c); n > _ && (u = (c + d) / 2, Rr(t, e, i, r, u, f) && (y = u, _ = n)), c = d;
    } return isNaN(y) && (y = s[o]), a ? (a.push(y, f, _), a) : [y, f, _];
  } function Mr(t, e, i, n, r) {
    let s = []; for (let o = 0, a = i.length; o < a; ++o) {
      const a = i[o]; s = Ir(t, e, a, n, r, 2 * o, s), e = a[a.length - 1];
    } return s;
  } function kr(t, e, i, n, r) {
    let s; for (e += n; e < i; e += n) {
      if (s = r(t.slice(e - n, e), t.slice(e, e + n)), s) {
        return s;
      }
    } return !1;
  } function Fr(t, e, i, n, r) {
    const s = ne([1 / 0, 1 / 0, -1 / 0, -1 / 0], t, e, i, n); return !!_e(r, s) && (!!Yt(r, s) || (s[0] >= r[0] && s[2] <= r[2] || (s[1] >= r[1] && s[3] <= r[3] || kr(t, e, i, n, (function (t, e) {
      return function (t, e, i) {
        let n = !1; const r = Zt(t, e); const s = Zt(t, i); if (r === Ot || s === Ot) {
          n = !0;
        } else {
          const o = t[0]; const a = t[1]; const l = t[2]; const h = t[3]; const u = e[0]; const c = e[1]; const d = i[0]; const p = i[1]; const g = (p - c) / (d - u); let f; let m; s & Dt && !(r & Dt) && (f = d - (p - h) / g, n = f >= o && f <= l), n || !(s & jt) || r & jt || (m = p - (d - l) * g, n = m >= a && m <= h), n || !(s & Gt) || r & Gt || (f = d - (p - a) / g, n = f >= o && f <= l), n || !(s & Nt) || r & Nt || (m = p - (d - o) * g, n = m >= a && m <= h);
        } return n;
      }(r, t, e);
    })))));
  } function Pr(t, e, i, n, r) {
    return !!Fr(t, e, i, n, r) || (!!Er(t, e, i, n, r[0], r[1]) || (!!Er(t, e, i, n, r[0], r[3]) || (!!Er(t, e, i, n, r[2], r[1]) || !!Er(t, e, i, n, r[2], r[3]))));
  } function Lr(t, e, i, n, r) {
    if (!Pr(t, e, i[0], n, r)) {
      return !1;
    } if (i.length === 1) {
      return !0;
    } for (let e = 1, s = i.length; e < s; ++e) {
      if (Tr(t, i[e - 1], i[e], n, r) && !Fr(t, i[e - 1], i[e], n, r)) {
        return !1;
      }
    } return !0;
  } function Ar(t, e, i, n) {
    for (;e < i - n;) {
      for (let r = 0; r < n; ++r) {
        const s = t[e + r]; t[e + r] = t[i - n + r], t[i - n + r] = s;
      }e += n, i -= n;
    }
  } function zr(t, e, i, n) {
    let r = 0; let s = t[i - n]; let o = t[i - n + 1]; for (;e < i; e += n) {
      const i = t[e]; const n = t[e + 1]; r += (i - s) * (n + o), s = i, o = n;
    } return r === 0 ? void 0 : r > 0;
  } function Or(t, e, i, n, r) {
    r = void 0 !== r && r; for (let s = 0, o = i.length; s < o; ++s) {
      const o = i[s]; const a = zr(t, e, o, n); if (s === 0) {
        if (r && a || !r && !a) {
          return !1;
        }
      } else if (r && !a || !r && a) {
        return !1;
      } e = o;
    } return !0;
  } function Dr(t, e, i, n, r) {
    r = void 0 !== r && r; for (let s = 0, o = i.length; s < o; ++s) {
      const o = i[s]; const a = zr(t, e, o, n); (s === 0 ? r && a || !r && !a : r && !a || !r && a) && Ar(t, e, o, n), e = o;
    } return e;
  } function jr(t, e, i, n, r) {
    for (let s = 0, o = i.length; s < o; ++s) {
      e = Dr(t, e, i[s], n, r);
    } return e;
  } class Gr extends rr {
    constructor(t, e, i) {
      super(), this.ends_ = [], this.flatInteriorPointRevision_ = -1, this.flatInteriorPoint_ = null, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, this.orientedRevision_ = -1, this.orientedFlatCoordinates_ = null, void 0 !== e && i ? (this.setFlatCoordinates(e, t), this.ends_ = i) : this.setCoordinates(t, e);
    }appendLinearRing(t) {
      this.flatCoordinates ? o(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
    }clone() {
      const t = new Gr(this.flatCoordinates.slice(), this.layout, this.ends_.slice()); return t.applyProperties(this), t;
    }closestPointXY(t, e, i, n) {
      return n < Bt(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(ar(this.flatCoordinates, 0, this.ends_, this.stride, 0)), this.maxDeltaRevision_ = this.getRevision()), hr(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, !0, t, e, i, n));
    }containsXY(t, e) {
      return Rr(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, t, e);
    }getArea() {
      return xr(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride);
    }getCoordinates(t) {
      let e; return void 0 !== t ? (e = this.getOrientedFlatCoordinates().slice(), Dr(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, yr(e, 0, this.ends_, this.stride);
    }getEnds() {
      return this.ends_;
    }getFlatInteriorPoint() {
      if (this.flatInteriorPointRevision_ != this.getRevision()) {
        const t = he(this.getExtent()); this.flatInteriorPoint_ = Ir(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, t, 0), this.flatInteriorPointRevision_ = this.getRevision();
      } return this.flatInteriorPoint_;
    }getInteriorPoint() {
      return new Sr(this.getFlatInteriorPoint(), 'XYM');
    }getLinearRingCount() {
      return this.ends_.length;
    }getLinearRing(t) {
      return t < 0 || this.ends_.length <= t ? null : new wr(this.flatCoordinates.slice(t === 0 ? 0 : this.ends_[t - 1], this.ends_[t]), this.layout);
    }getLinearRings() {
      const t = this.layout; const e = this.flatCoordinates; const i = this.ends_; const n = []; let r = 0; for (let s = 0, o = i.length; s < o; ++s) {
        const o = i[s]; const a = new wr(e.slice(r, o), t); n.push(a), r = o;
      } return n;
    }getOrientedFlatCoordinates() {
      if (this.orientedRevision_ != this.getRevision()) {
        const t = this.flatCoordinates; Or(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = Dr(this.orientedFlatCoordinates_, 0, this.ends_, this.stride)), this.orientedRevision_ = this.getRevision();
      } return this.orientedFlatCoordinates_;
    }getSimplifiedGeometryInternal(t) {
      const e = []; const i = []; return e.length = fr(this.flatCoordinates, 0, this.ends_, this.stride, Math.sqrt(t), e, 0, i), new Gr(e, 'XY', i);
    }getType() {
      return 'Polygon';
    }intersectsExtent(t) {
      return Lr(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, t);
    }setCoordinates(t, e) {
      this.setLayout(e, t, 2), this.flatCoordinates || (this.flatCoordinates = []); const i = cr(this.flatCoordinates, 0, t, this.stride, this.ends_); this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1], this.changed();
    }
  } let Nr = Gr; function Wr(t) {
    const e = t[0]; const i = t[1]; const n = t[2]; const r = t[3]; const s = [e, i, e, r, n, r, n, i, e, i]; return new Gr(s, 'XY', [s.length]);
  } function Xr(t, e) {
    setTimeout((function () {
      t(e);
    }), 0);
  } function qr(t) {
    return !(t.sourceCenter && t.targetCenter && !ri(t.sourceCenter, t.targetCenter)) && (t.sourceResolution === t.targetResolution && t.sourceRotation === t.targetRotation);
  } function Br(t, e, i, n, r) {
    const s = Math.cos(-r); let o = Math.sin(-r); let a = t[0] * s - t[1] * o; let l = t[1] * s + t[0] * o; a += (e[0] / 2 - i[0]) * n, l += (i[1] - e[1] / 2) * n, o = -o; return [a * s - l * o, l * s + a * o];
  } let Vr = class extends L {
    constructor(t) {
      super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = Mn(t.projection, 'EPSG:3857'), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && wn(), t.center && (t.center = On(t.center, this.projection_)), t.extent && (t.extent = jn(t.extent, this.projection_)), this.applyOptions_(t);
    }applyOptions_(t) {
      const e = Object.assign({}, t); for (const t in Hi) {
        delete e[t];
      } this.setProperties(e, !0); const i = function (t) {
        let e; let i; let n; const s = 28; const o = 2; let a = void 0 !== t.minZoom ? t.minZoom : 0; let l = void 0 !== t.maxZoom ? t.maxZoom : s; const h = void 0 !== t.zoomFactor ? t.zoomFactor : o; const u = void 0 !== t.multiWorld && t.multiWorld; const c = void 0 === t.smoothResolutionConstraint || t.smoothResolutionConstraint; const d = void 0 !== t.showFullExtent && t.showFullExtent; const p = Mn(t.projection, 'EPSG:3857'); const g = p.getExtent(); let f = t.constrainOnlyCenter; let m = t.extent; u || m || !p.isGlobal() || (f = !1, m = g); if (void 0 !== t.resolutions) {
          const s = t.resolutions; i = s[a], n = void 0 !== s[l] ? s[l] : s[s.length - 1], e = t.constrainResolution ? function (t, e, i, n) {
            return e = void 0 === e || e, function (s, o, a, l) {
              if (void 0 !== s) {
                const h = t[0]; const u = t[t.length - 1]; const c = i ? Bn(h, i, a, n) : h; if (l) {
                  return e ? Vn(s, c, u) : we(s, u, c);
                } const d = Math.min(c, s); const p = Math.floor(r(t, d, o)); return t[p] > c && p < t.length - 1 ? t[p + 1] : t[p];
              }
            };
          }(s, c, !f && m, d) : Yn(i, n, c, !f && m, d);
        } else {
          const r = (g ? Math.max(ye(g), pe(g)) : 360 * Qi.degrees / p.getMetersPerUnit()) / Ji / Math.pow(o, 0); const u = r / Math.pow(o, s - 0); i = t.maxResolution, void 0 !== i ? a = 0 : i = r / Math.pow(h, a), n = t.minResolution, void 0 === n && (n = void 0 !== t.maxZoom ? void 0 !== t.maxResolution ? i / Math.pow(h, l) : r / Math.pow(h, l) : u), l = a + Math.floor(Math.log(i / n) / Math.log(h)), n = i / Math.pow(h, l - a), e = t.constrainResolution ? function (t, e, i, n, r, s) {
            return n = void 0 === n || n, i = void 0 !== i ? i : 0, function (o, a, l, h) {
              if (void 0 !== o) {
                const u = r ? Bn(e, r, l, s) : e; if (h) {
                  return n ? Vn(o, u, i) : we(o, i, u);
                } const c = 1e-9; const d = Math.ceil(Math.log(e / u) / Math.log(t) - c); const p = -a * (0.5 - c) + 0.5; const g = Math.min(u, o); const f = Math.floor(Math.log(e / g) / Math.log(t) + p); const m = Math.max(d, f); return we(e / Math.pow(t, m), i, u);
              }
            };
          }(h, i, n, c, !f && m, d) : Yn(i, n, c, !f && m, d);
        } return {constraint: e, maxResolution: i, minResolution: n, minZoom: a, zoomFactor: h};
      }(t); this.maxResolution_ = i.maxResolution, this.minResolution_ = i.minResolution, this.zoomFactor_ = i.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = i.minZoom; const n = function (t) {
        if (void 0 !== t.extent) {
          const e = void 0 === t.smoothExtentConstraint || t.smoothExtentConstraint; return Xn(t.extent, t.constrainOnlyCenter, e);
        } const e = Mn(t.projection, 'EPSG:3857'); if (!0 !== t.multiWorld && e.isGlobal()) {
          const t = e.getExtent().slice(); return t[0] = -1 / 0, t[2] = 1 / 0, Xn(t, !1, !1);
        } return qn;
      }(t); const s = i.constraint; const o = function (t) {
        if (void 0 === t.enableRotation || t.enableRotation) {
          const i = t.constrainRotation; return void 0 === i || !0 === i ? (e = e || Te(5), function (t, i) {
            return i ? t : void 0 !== t ? Math.abs(t) <= e ? 0 : t : void 0;
          }) : !1 === i ? Zn : typeof i === 'number' ? function (t) {
            const e = 2 * Math.PI / t; return function (t, i) {
              return i ? t : void 0 !== t ? t = Math.floor(t / e + 0.5) * e : void 0;
            };
          }(i) : Zn;
        } let e; return Kn;
      }(t); this.constraints_ = {center: n, resolution: s, rotation: o}, this.setRotation(void 0 !== t.rotation ? t.rotation : 0), this.setCenterInternal(void 0 !== t.center ? t.center : null), void 0 !== t.resolution ? this.setResolution(t.resolution) : void 0 !== t.zoom && this.setZoom(t.zoom);
    } get padding() {
      return this.padding_;
    } set padding(t) {
      let e = this.padding_; this.padding_ = t; const i = this.getCenter(); if (i) {
        const n = t || [0, 0, 0, 0]; e = e || [0, 0, 0, 0]; const r = this.getResolution(); const s = r / 2 * (n[3] - e[3] + e[1] - n[1]); const o = r / 2 * (n[0] - e[0] + e[2] - n[2]); this.setCenterInternal([i[0] + s, i[1] - o]);
      }
    }getUpdatedOptions_(t) {
      const e = this.getProperties(); return void 0 !== e.resolution ? e.resolution = this.getResolution() : e.zoom = this.getZoom(), e.center = this.getCenterInternal(), e.rotation = this.getRotation(), Object.assign({}, e, t);
    }animate(t) {
      this.isDef() && !this.getAnimating() && this.resolveConstraints(0); const e = new Array(arguments.length); for (let t = 0; t < e.length; ++t) {
        let i = arguments[t]; i.center && (i = Object.assign({}, i), i.center = On(i.center, this.getProjection())), i.anchor && (i = Object.assign({}, i), i.anchor = On(i.anchor, this.getProjection())), e[t] = i;
      } this.animateInternal.apply(this, e);
    }animateInternal(t) {
      let e; let i = arguments.length; i > 1 && typeof arguments[i - 1] === 'function' && (e = arguments[i - 1], --i); let n = 0; for (;n < i && !this.isDef(); ++n) {
        const t = arguments[n]; t.center && this.setCenterInternal(t.center), void 0 !== t.zoom ? this.setZoom(t.zoom) : t.resolution && this.setResolution(t.resolution), void 0 !== t.rotation && this.setRotation(t.rotation);
      } if (n === i) {
        return void (e && Xr(e, !0));
      } let r = Date.now(); let s = this.targetCenter_.slice(); let o = this.targetResolution_; let a = this.targetRotation_; const l = []; for (;n < i; ++n) {
        const t = arguments[n]; const i = {start: r, complete: !1, anchor: t.anchor, duration: void 0 !== t.duration ? t.duration : 1e3, easing: t.easing || Jn, callback: e}; if (t.center && (i.sourceCenter = s, i.targetCenter = t.center.slice(), s = i.targetCenter), void 0 !== t.zoom ? (i.sourceResolution = o, i.targetResolution = this.getResolutionForZoom(t.zoom), o = i.targetResolution) : t.resolution && (i.sourceResolution = o, i.targetResolution = t.resolution, o = i.targetResolution), void 0 !== t.rotation) {
          i.sourceRotation = a; const e = Ee(t.rotation - a + Math.PI, 2 * Math.PI) - Math.PI; i.targetRotation = a + e, a = i.targetRotation;
        }qr(i) ? i.complete = !0 : r += i.duration, l.push(i);
      } this.animations_.push(l), this.setHint(Zi, 1), this.updateAnimations_();
    }getAnimating() {
      return this.hints_[Zi] > 0;
    }getInteracting() {
      return this.hints_[Ui] > 0;
    }cancelAnimations() {
      let t; this.setHint(Zi, -this.hints_[Zi]); for (let e = 0, i = this.animations_.length; e < i; ++e) {
        const i = this.animations_[e]; if (i[0].callback && Xr(i[0].callback, !1), !t) {
          for (let e = 0, n = i.length; e < n; ++e) {
            const n = i[e]; if (!n.complete) {
              t = n.anchor; break;
            }
          }
        }
      } this.animations_.length = 0, this.cancelAnchor_ = t, this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
    }updateAnimations_() {
      if (void 0 !== this.updateAnimationKey_ && (cancelAnimationFrame(this.updateAnimationKey_), this.updateAnimationKey_ = void 0), !this.getAnimating()) {
        return;
      } const t = Date.now(); let e = !1; for (let i = this.animations_.length - 1; i >= 0; --i) {
        const n = this.animations_[i]; let r = !0; for (let i = 0, s = n.length; i < s; ++i) {
          const s = n[i]; if (s.complete) {
            continue;
          } const o = t - s.start; let a = s.duration > 0 ? o / s.duration : 1; a >= 1 ? (s.complete = !0, a = 1) : r = !1; const l = s.easing(a); if (s.sourceCenter) {
            const t = s.sourceCenter[0]; const e = s.sourceCenter[1]; const i = s.targetCenter[0]; const n = s.targetCenter[1]; this.nextCenter_ = s.targetCenter; const r = t + l * (i - t); const o = e + l * (n - e); this.targetCenter_ = [r, o];
          } if (s.sourceResolution && s.targetResolution) {
            const t = l === 1 ? s.targetResolution : s.sourceResolution + l * (s.targetResolution - s.sourceResolution); if (s.anchor) {
              const e = this.getViewportSize_(this.getRotation()); const i = this.constraints_.resolution(t, 0, e, !0); this.targetCenter_ = this.calculateCenterZoom(i, s.anchor);
            } this.nextResolution_ = s.targetResolution, this.targetResolution_ = t, this.applyTargetState_(!0);
          } if (void 0 !== s.sourceRotation && void 0 !== s.targetRotation) {
            const t = l === 1 ? Ee(s.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : s.sourceRotation + l * (s.targetRotation - s.sourceRotation); if (s.anchor) {
              const e = this.constraints_.rotation(t, !0); this.targetCenter_ = this.calculateCenterRotate(e, s.anchor);
            } this.nextRotation_ = s.targetRotation, this.targetRotation_ = t;
          } if (this.applyTargetState_(!0), e = !0, !s.complete) {
            break;
          }
        } if (r) {
          this.animations_[i] = null, this.setHint(Zi, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN; const t = n[0].callback; t && Xr(t, !0);
        }
      } this.animations_ = this.animations_.filter(Boolean), e && void 0 === this.updateAnimationKey_ && (this.updateAnimationKey_ = requestAnimationFrame(this.updateAnimations_.bind(this)));
    }calculateCenterRotate(t, e) {
      let i; const n = this.getCenterInternal(); let r; let s; return void 0 !== n && (i = [n[0] - e[0], n[1] - e[1]], si(i, t - this.getRotation()), s = e, (r = i)[0] += +s[0], r[1] += +s[1]), i;
    }calculateCenterZoom(t, e) {
      let i; const n = this.getCenterInternal(); const r = this.getResolution(); if (void 0 !== n && void 0 !== r) {
        i = [e[0] - t * (e[0] - n[0]) / r, e[1] - t * (e[1] - n[1]) / r];
      } return i;
    }getViewportSize_(t) {
      const e = this.viewportSize_; if (t) {
        const i = e[0]; const n = e[1]; return [Math.abs(i * Math.cos(t)) + Math.abs(n * Math.sin(t)), Math.abs(i * Math.sin(t)) + Math.abs(n * Math.cos(t))];
      } return e;
    }setViewportSize(t) {
      this.viewportSize_ = Array.isArray(t) ? t.slice() : [100, 100], this.getAnimating() || this.resolveConstraints(0);
    }getCenter() {
      const t = this.getCenterInternal(); return t ? zn(t, this.getProjection()) : t;
    }getCenterInternal() {
      return this.get(Hi.CENTER);
    }getConstraints() {
      return this.constraints_;
    }getConstrainResolution() {
      return this.get('constrainResolution');
    }getHints(t) {
      return void 0 !== t ? (t[0] = this.hints_[0], t[1] = this.hints_[1], t) : this.hints_.slice();
    }calculateExtent(t) {
      return Dn(this.calculateExtentInternal(t), this.getProjection());
    }calculateExtentInternal(t) {
      t = t || this.getViewportSizeMinusPadding_(); const e = this.getCenterInternal(); St(e, 1); const i = this.getResolution(); St(void 0 !== i, 2); const n = this.getRotation(); return St(void 0 !== n, 3), ce(e, i, n, t);
    }getMaxResolution() {
      return this.maxResolution_;
    }getMinResolution() {
      return this.minResolution_;
    }getMaxZoom() {
      return this.getZoomForResolution(this.minResolution_);
    }setMaxZoom(t) {
      this.applyOptions_(this.getUpdatedOptions_({maxZoom: t}));
    }getMinZoom() {
      return this.getZoomForResolution(this.maxResolution_);
    }setMinZoom(t) {
      this.applyOptions_(this.getUpdatedOptions_({minZoom: t}));
    }setConstrainResolution(t) {
      this.applyOptions_(this.getUpdatedOptions_({constrainResolution: t}));
    }getProjection() {
      return this.projection_;
    }getResolution() {
      return this.get(Hi.RESOLUTION);
    }getResolutions() {
      return this.resolutions_;
    }getResolutionForExtent(t, e) {
      return this.getResolutionForExtentInternal(jn(t, this.getProjection()), e);
    }getResolutionForExtentInternal(t, e) {
      e = e || this.getViewportSizeMinusPadding_(); const i = ye(t) / e[0]; const n = pe(t) / e[1]; return Math.max(i, n);
    }getResolutionForValueFunction(t) {
      t = t || 2; const e = this.getConstrainedResolution(this.maxResolution_); const i = this.minResolution_; const n = Math.log(e / i) / Math.log(t); return function (i) {
        return e / Math.pow(t, i * n);
      };
    }getRotation() {
      return this.get(Hi.ROTATION);
    }getValueForResolutionFunction(t) {
      const e = Math.log(t || 2); const i = this.getConstrainedResolution(this.maxResolution_); const n = this.minResolution_; const r = Math.log(i / n) / e; return function (t) {
        return Math.log(i / t) / e / r;
      };
    }getViewportSizeMinusPadding_(t) {
      let e = this.getViewportSize_(t); const i = this.padding_; return i && (e = [e[0] - i[1] - i[3], e[1] - i[0] - i[2]]), e;
    }getState() {
      const t = this.getProjection(); const e = this.getResolution(); const i = this.getRotation(); let n = this.getCenterInternal(); const r = this.padding_; if (r) {
        const t = this.getViewportSizeMinusPadding_(); n = Br(n, this.getViewportSize_(), [t[0] / 2 + r[3], t[1] / 2 + r[0]], e, i);
      } return {center: n.slice(0), projection: void 0 !== t ? t : null, resolution: e, nextCenter: this.nextCenter_, nextResolution: this.nextResolution_, nextRotation: this.nextRotation_, rotation: i, zoom: this.getZoom()};
    }getZoom() {
      let t; const e = this.getResolution(); return void 0 !== e && (t = this.getZoomForResolution(e)), t;
    }getZoomForResolution(t) {
      let e; let i; let n = this.minZoom_ || 0; if (this.resolutions_) {
        const s = r(this.resolutions_, t, 1); n = s, e = this.resolutions_[s], i = s == this.resolutions_.length - 1 ? 2 : e / this.resolutions_[s + 1];
      } else {
        e = this.maxResolution_, i = this.zoomFactor_;
      } return n + Math.log(e / t) / Math.log(i);
    }getResolutionForZoom(t) {
      if (this.resolutions_) {
        if (this.resolutions_.length <= 1) {
          return 0;
        } const e = we(Math.floor(t), 0, this.resolutions_.length - 2); const i = this.resolutions_[e] / this.resolutions_[e + 1]; return this.resolutions_[e] / Math.pow(i, we(t - e, 0, 1));
      } return this.maxResolution_ / Math.pow(this.zoomFactor_, t - this.minZoom_);
    }fit(t, e) {
      let i; if (St(Array.isArray(t) || typeof t.getSimplifiedGeometry === 'function', 24), Array.isArray(t)) {
        St(!ve(t), 25); i = Wr(jn(t, this.getProjection()));
      } else if (t.getType() === 'Circle') {
        const e = jn(t.getExtent(), this.getProjection()); i = Wr(e), i.rotate(this.getRotation(), he(e));
      } else {
        i = t;
      } this.fitInternal(i, e);
    }rotatedExtentForGeometry(t) {
      const e = this.getRotation(); const i = Math.cos(e); const n = Math.sin(-e); const r = t.getFlatCoordinates(); const s = t.getStride(); let o = 1 / 0; let a = 1 / 0; let l = -1 / 0; let h = -1 / 0; for (let t = 0, e = r.length; t < e; t += s) {
        const e = r[t] * i - r[t + 1] * n; const s = r[t] * n + r[t + 1] * i; o = Math.min(o, e), a = Math.min(a, s), l = Math.max(l, e), h = Math.max(h, s);
      } return [o, a, l, h];
    }fitInternal(t, e) {
      let i = (e = e || {}).size; i || (i = this.getViewportSizeMinusPadding_()); const n = void 0 !== e.padding ? e.padding : [0, 0, 0, 0]; const r = void 0 !== e.nearest && e.nearest; let s; s = void 0 !== e.minResolution ? e.minResolution : void 0 !== e.maxZoom ? this.getResolutionForZoom(e.maxZoom) : 0; const o = this.rotatedExtentForGeometry(t); let a = this.getResolutionForExtentInternal(o, [i[0] - n[1] - n[3], i[1] - n[0] - n[2]]); a = isNaN(a) ? s : Math.max(a, s), a = this.getConstrainedResolution(a, r ? 0 : 1); const l = this.getRotation(); const h = Math.sin(l); const c = Math.cos(l); const d = he(o); d[0] += (n[1] - n[3]) / 2 * a, d[1] += (n[0] - n[2]) / 2 * a; const p = d[0] * c - d[1] * h; const g = d[1] * c + d[0] * h; const f = this.getConstrainedCenter([p, g], a); const m = e.callback ? e.callback : u; void 0 !== e.duration ? this.animateInternal({resolution: a, center: f, duration: e.duration, easing: e.easing}, m) : (this.targetResolution_ = a, this.targetCenter_ = f, this.applyTargetState_(!1, !0), Xr(m, !0));
    }centerOn(t, e, i) {
      this.centerOnInternal(On(t, this.getProjection()), e, i);
    }centerOnInternal(t, e, i) {
      this.setCenterInternal(Br(t, e, i, this.getResolution(), this.getRotation()));
    }calculateCenterShift(t, e, i, n) {
      let r; const s = this.padding_; if (s && t) {
        const o = this.getViewportSizeMinusPadding_(-i); const a = Br(t, n, [o[0] / 2 + s[3], o[1] / 2 + s[0]], e, i); r = [t[0] - a[0], t[1] - a[1]];
      } return r;
    }isDef() {
      return !!this.getCenterInternal() && void 0 !== this.getResolution();
    }adjustCenter(t) {
      const e = zn(this.targetCenter_, this.getProjection()); this.setCenter([e[0] + t[0], e[1] + t[1]]);
    }adjustCenterInternal(t) {
      const e = this.targetCenter_; this.setCenterInternal([e[0] + t[0], e[1] + t[1]]);
    }adjustResolution(t, e) {
      e = e && On(e, this.getProjection()), this.adjustResolutionInternal(t, e);
    }adjustResolutionInternal(t, e) {
      const i = this.getAnimating() || this.getInteracting(); const n = this.getViewportSize_(this.getRotation()); const r = this.constraints_.resolution(this.targetResolution_ * t, 0, n, i); e && (this.targetCenter_ = this.calculateCenterZoom(r, e)), this.targetResolution_ *= t, this.applyTargetState_();
    }adjustZoom(t, e) {
      this.adjustResolution(Math.pow(this.zoomFactor_, -t), e);
    }adjustRotation(t, e) {
      e && (e = On(e, this.getProjection())), this.adjustRotationInternal(t, e);
    }adjustRotationInternal(t, e) {
      const i = this.getAnimating() || this.getInteracting(); const n = this.constraints_.rotation(this.targetRotation_ + t, i); e && (this.targetCenter_ = this.calculateCenterRotate(n, e)), this.targetRotation_ += t, this.applyTargetState_();
    }setCenter(t) {
      this.setCenterInternal(t ? On(t, this.getProjection()) : t);
    }setCenterInternal(t) {
      this.targetCenter_ = t, this.applyTargetState_();
    }setHint(t, e) {
      return this.hints_[t] += e, this.changed(), this.hints_[t];
    }setResolution(t) {
      this.targetResolution_ = t, this.applyTargetState_();
    }setRotation(t) {
      this.targetRotation_ = t, this.applyTargetState_();
    }setZoom(t) {
      this.setResolution(this.getResolutionForZoom(t));
    }applyTargetState_(t, e) {
      const i = this.getAnimating() || this.getInteracting() || e; const n = this.constraints_.rotation(this.targetRotation_, i); const r = this.getViewportSize_(n); const s = this.constraints_.resolution(this.targetResolution_, 0, r, i); const o = this.constraints_.center(this.targetCenter_, s, r, i, this.calculateCenterShift(this.targetCenter_, s, n, r)); this.get(Hi.ROTATION) !== n && this.set(Hi.ROTATION, n), this.get(Hi.RESOLUTION) !== s && (this.set(Hi.RESOLUTION, s), this.set('zoom', this.getZoom(), !0)), o && this.get(Hi.CENTER) && ri(this.get(Hi.CENTER), o) || this.set(Hi.CENTER, o), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
    }resolveConstraints(t, e, i) {
      t = void 0 !== t ? t : 200; const n = e || 0; const r = this.constraints_.rotation(this.targetRotation_); const s = this.getViewportSize_(r); const o = this.constraints_.resolution(this.targetResolution_, n, s); const a = this.constraints_.center(this.targetCenter_, o, s, !1, this.calculateCenterShift(this.targetCenter_, o, r, s)); if (t === 0 && !this.cancelAnchor_) {
        return this.targetResolution_ = o, this.targetRotation_ = r, this.targetCenter_ = a, void this.applyTargetState_();
      } i = i || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, this.getResolution() === o && this.getRotation() === r && this.getCenterInternal() && ri(this.getCenterInternal(), a) || (this.getAnimating() && this.cancelAnimations(), this.animateInternal({rotation: r, center: a, resolution: o, duration: t, easing: Hn, anchor: i}));
    }beginInteraction() {
      this.resolveConstraints(0), this.setHint(Ui, 1);
    }endInteraction(t, e, i) {
      i = i && On(i, this.getProjection()), this.endInteractionInternal(t, e, i);
    }endInteractionInternal(t, e, i) {
      this.setHint(Ui, -1), this.resolveConstraints(t, e, i);
    }getConstrainedCenter(t, e) {
      const i = this.getViewportSize_(this.getRotation()); return this.constraints_.center(t, e || this.getResolution(), i);
    }getConstrainedZoom(t, e) {
      const i = this.getResolutionForZoom(t); return this.getZoomForResolution(this.getConstrainedResolution(i, e));
    }getConstrainedResolution(t, e) {
      e = e || 0; const i = this.getViewportSize_(this.getRotation()); return this.constraints_.resolution(t, e, i);
    }
  }; let Yr = class extends J {
    constructor(t) {
      t = t || {}, super({element: document.createElement('div'), render: t.render, target: t.target}), this.ulElement_ = document.createElement('ul'), this.collapsed_ = void 0 === t.collapsed || t.collapsed, this.userCollapsed_ = this.collapsed_, this.overrideCollapsible_ = void 0 !== t.collapsible, this.collapsible_ = void 0 === t.collapsible || t.collapsible, this.collapsible_ || (this.collapsed_ = !1); const e = void 0 !== t.className ? t.className : 'ol-attribution'; const i = void 0 !== t.tipLabel ? t.tipLabel : 'Attributions'; const n = void 0 !== t.expandClassName ? t.expandClassName : e + '-expand'; const r = void 0 !== t.collapseLabel ? t.collapseLabel : '›'; const s = void 0 !== t.collapseClassName ? t.collapseClassName : e + '-collapse'; typeof r === 'string' ? (this.collapseLabel_ = document.createElement('span'), this.collapseLabel_.textContent = r, this.collapseLabel_.className = s) : this.collapseLabel_ = r; const o = void 0 !== t.label ? t.label : 'i'; typeof o === 'string' ? (this.label_ = document.createElement('span'), this.label_.textContent = o, this.label_.className = n) : this.label_ = o; const a = this.collapsible_ && !this.collapsed_ ? this.collapseLabel_ : this.label_; this.toggleButton_ = document.createElement('button'), this.toggleButton_.setAttribute('type', 'button'), this.toggleButton_.setAttribute('aria-expanded', String(!this.collapsed_)), this.toggleButton_.title = i, this.toggleButton_.appendChild(a), this.toggleButton_.addEventListener(y, this.handleClick_.bind(this), !1); const l = e + ' ' + 'ol-unselectable ' + rt + (this.collapsed_ && this.collapsible_ ? ' ol-collapsed' : '') + (this.collapsible_ ? '' : ' ol-uncollapsible'); const h = this.element; h.className = l, h.appendChild(this.toggleButton_), h.appendChild(this.ulElement_), this.renderedAttributions_ = [], this.renderedVisible_ = !0;
    }collectSourceAttributions_(t) {
      const e = {}; const i = []; let n = !0; const r = t.layerStatesArray; for (let s = 0, o = r.length; s < o; ++s) {
        const o = r[s]; if (!ii(o, t.viewState)) {
          continue;
        } const a = o.layer.getSource(); if (!a) {
          continue;
        } const l = a.getAttributions(); if (!l) {
          continue;
        } const h = l(t); if (h) {
          if (n = n && !1 !== a.getAttributionsCollapsible(), Array.isArray(h)) {
            for (let t = 0, n = h.length; t < n; ++t) {
              h[t] in e || (i.push(h[t]), e[h[t]] = !0);
            }
          } else {
            h in e || (i.push(h), e[h] = !0);
          }
        }
      } return this.overrideCollapsible_ || this.setCollapsible(n), i;
    }updateElement_(t) {
      if (!t) {
        return void (this.renderedVisible_ && (this.element.style.display = 'none', this.renderedVisible_ = !1));
      } const e = this.collectSourceAttributions_(t); const i = e.length > 0; if (this.renderedVisible_ != i && (this.element.style.display = i ? '' : 'none', this.renderedVisible_ = i), !a(e, this.renderedAttributions_)) {
        !function (t) {
          for (;t.lastChild;) {
            t.removeChild(t.lastChild);
          }
        }(this.ulElement_); for (let t = 0, i = e.length; t < i; ++t) {
          const i = document.createElement('li'); i.innerHTML = e[t], this.ulElement_.appendChild(i);
        } this.renderedAttributions_ = e;
      }
    }handleClick_(t) {
      t.preventDefault(), this.handleToggle_(), this.userCollapsed_ = this.collapsed_;
    }handleToggle_() {
      this.element.classList.toggle(st), this.collapsed_ ? U(this.collapseLabel_, this.label_) : U(this.label_, this.collapseLabel_), this.collapsed_ = !this.collapsed_, this.toggleButton_.setAttribute('aria-expanded', String(!this.collapsed_));
    }getCollapsible() {
      return this.collapsible_;
    }setCollapsible(t) {
      this.collapsible_ !== t && (this.collapsible_ = t, this.element.classList.toggle('ol-uncollapsible'), this.userCollapsed_ && this.handleToggle_());
    }setCollapsed(t) {
      this.userCollapsed_ = t, this.collapsible_ && this.collapsed_ !== t && this.handleToggle_();
    }getCollapsed() {
      return this.collapsed_;
    }render(t) {
      this.updateElement_(t.frameState);
    }
  }; let Kr = class extends J {
    constructor(t) {
      t = t || {}, super({element: document.createElement('div'), render: t.render, target: t.target}); const e = void 0 !== t.className ? t.className : 'ol-rotate'; const i = void 0 !== t.label ? t.label : '⇧'; const n = void 0 !== t.compassClassName ? t.compassClassName : 'ol-compass'; this.label_ = null, typeof i === 'string' ? (this.label_ = document.createElement('span'), this.label_.className = n, this.label_.textContent = i) : (this.label_ = i, this.label_.classList.add(n)); const r = t.tipLabel ? t.tipLabel : 'Reset rotation'; const s = document.createElement('button'); s.className = e + '-reset', s.setAttribute('type', 'button'), s.title = r, s.appendChild(this.label_), s.addEventListener(y, this.handleClick_.bind(this), !1); const o = e + ' ' + 'ol-unselectable ' + rt; const a = this.element; a.className = o, a.appendChild(s), this.callResetNorth_ = t.resetNorth ? t.resetNorth : void 0, this.duration_ = void 0 !== t.duration ? t.duration : 250, this.autoHide_ = void 0 === t.autoHide || t.autoHide, this.rotation_ = void 0, this.autoHide_ && this.element.classList.add(it);
    }handleClick_(t) {
      t.preventDefault(), void 0 !== this.callResetNorth_ ? this.callResetNorth_() : this.resetNorth_();
    }resetNorth_() {
      const t = this.getMap().getView(); if (!t) {
        return;
      } const e = t.getRotation(); void 0 !== e && (this.duration_ > 0 && e % (2 * Math.PI) != 0 ? t.animate({rotation: 0, duration: this.duration_, easing: Hn}) : t.setRotation(0));
    }render(t) {
      const e = t.frameState; if (!e) {
        return;
      } const i = e.viewState.rotation; if (i != this.rotation_) {
        const t = 'rotate(' + i + 'rad)'; if (this.autoHide_) {
          const t = this.element.classList.contains(it); t || i !== 0 ? t && i !== 0 && this.element.classList.remove(it) : this.element.classList.add(it);
        } this.label_.style.transform = t;
      } this.rotation_ = i;
    }
  }; let Zr = class extends J {
    constructor(t) {
      t = t || {}, super({element: document.createElement('div'), target: t.target}); const e = void 0 !== t.className ? t.className : 'ol-zoom'; const i = void 0 !== t.delta ? t.delta : 1; const n = void 0 !== t.zoomInClassName ? t.zoomInClassName : e + '-in'; const r = void 0 !== t.zoomOutClassName ? t.zoomOutClassName : e + '-out'; const s = void 0 !== t.zoomInLabel ? t.zoomInLabel : '+'; const o = void 0 !== t.zoomOutLabel ? t.zoomOutLabel : '–'; const a = void 0 !== t.zoomInTipLabel ? t.zoomInTipLabel : 'Zoom in'; const l = void 0 !== t.zoomOutTipLabel ? t.zoomOutTipLabel : 'Zoom out'; const h = document.createElement('button'); h.className = n, h.setAttribute('type', 'button'), h.title = a, h.appendChild(typeof s === 'string' ? document.createTextNode(s) : s), h.addEventListener(y, this.handleClick_.bind(this, i), !1); const u = document.createElement('button'); u.className = r, u.setAttribute('type', 'button'), u.title = l, u.appendChild(typeof o === 'string' ? document.createTextNode(o) : o), u.addEventListener(y, this.handleClick_.bind(this, -i), !1); const c = e + ' ' + 'ol-unselectable ' + rt; const d = this.element; d.className = c, d.appendChild(h), d.appendChild(u), this.duration_ = void 0 !== t.duration ? t.duration : 250;
    }handleClick_(t, e) {
      e.preventDefault(), this.zoomByDelta_(t);
    }zoomByDelta_(t) {
      const e = this.getMap().getView(); if (!e) {
        return;
      } const i = e.getZoom(); if (void 0 !== i) {
        const n = e.getConstrainedZoom(i + t); this.duration_ > 0 ? (e.getAnimating() && e.cancelAnimations(), e.animate({zoom: n, duration: this.duration_, easing: Hn})) : e.setZoom(n);
      }
    }
  }; let Ur = 'active'; function Hr(t, e, i, n) {
    const r = t.getZoom(); if (void 0 === r) {
      return;
    } const s = t.getConstrainedZoom(r + e); const o = t.getResolutionForZoom(s); t.getAnimating() && t.cancelAnimations(), t.animate({resolution: o, anchor: i, duration: void 0 !== n ? n : 250, easing: Hn});
  } let Jr = class extends L {
    constructor(t) {
      super(), this.on, this.once, this.un, t && t.handleEvent && (this.handleEvent = t.handleEvent), this.map_ = null, this.setActive(!0);
    }getActive() {
      return this.get(Ur);
    }getMap() {
      return this.map_;
    }handleEvent(t) {
      return !0;
    }setActive(t) {
      this.set(Ur, t);
    }setMap(t) {
      this.map_ = t;
    }
  }; let Qr = class extends Jr {
    constructor(t) {
      super(), t = t || {}, this.delta_ = t.delta ? t.delta : 1, this.duration_ = void 0 !== t.duration ? t.duration : 250;
    }handleEvent(t) {
      let e = !1; if (t.type == Oi.DBLCLICK) {
        const i = t.originalEvent; const n = t.map; const r = t.coordinate; const s = i.shiftKey ? -this.delta_ : this.delta_; Hr(n.getView(), s, r, this.duration_), i.preventDefault(), e = !0;
      } return !e;
    }
  }; function $r(t) {
    const e = t.length; let i = 0; let n = 0; for (let r = 0; r < e; r++) {
      i += t[r].clientX, n += t[r].clientY;
    } return {clientX: i / e, clientY: n / e};
  } let ts = class extends Jr {
    constructor(t) {
      super(t = t || {}), t.handleDownEvent && (this.handleDownEvent = t.handleDownEvent), t.handleDragEvent && (this.handleDragEvent = t.handleDragEvent), t.handleMoveEvent && (this.handleMoveEvent = t.handleMoveEvent), t.handleUpEvent && (this.handleUpEvent = t.handleUpEvent), t.stopDown && (this.stopDown = t.stopDown), this.handlingDownUpSequence = !1, this.targetPointers = [];
    }getPointerCount() {
      return this.targetPointers.length;
    }handleDownEvent(t) {
      return !1;
    }handleDragEvent(t) {}handleEvent(t) {
      if (!t.originalEvent) {
        return !0;
      } let e = !1; if (this.updateTrackedPointers_(t), this.handlingDownUpSequence) {
        if (t.type == Oi.POINTERDRAG) {
          this.handleDragEvent(t), t.originalEvent.preventDefault();
        } else if (t.type == Oi.POINTERUP) {
          const e = this.handleUpEvent(t); this.handlingDownUpSequence = e && this.targetPointers.length > 0;
        }
      } else if (t.type == Oi.POINTERDOWN) {
        const i = this.handleDownEvent(t); this.handlingDownUpSequence = i, e = this.stopDown(i);
      } else {
        t.type == Oi.POINTERMOVE && this.handleMoveEvent(t);
      } return !e;
    }handleMoveEvent(t) {}handleUpEvent(t) {
      return !1;
    }stopDown(t) {
      return t;
    }updateTrackedPointers_(t) {
      t.activePointers && (this.targetPointers = t.activePointers);
    }
  }; function es(t) {
    const e = arguments; return function (t) {
      let i = !0; for (let n = 0, r = e.length; n < r && (i = i && e[n](t), i); ++n) { } return i;
    };
  } const is = function (t) {
    const e = t.originalEvent; return e.altKey && !(e.metaKey || e.ctrlKey) && e.shiftKey;
  }; const ns = function (t) {
    return !t.map.getTargetElement().hasAttribute('tabindex') || function (t) {
      const e = t.map.getTargetElement(); const i = t.map.getOwnerDocument().activeElement; return e.contains(i);
    }(t);
  }; const rs = l; const ss = function (t) {
    const e = t.originalEvent; return e.button == 0 && !(W && X && e.ctrlKey);
  }; const os = function (t) {
    const e = t.originalEvent; return !e.altKey && !(e.metaKey || e.ctrlKey) && !e.shiftKey;
  }; const as = function (t) {
    const e = t.originalEvent; return !e.altKey && !(e.metaKey || e.ctrlKey) && e.shiftKey;
  }; const ls = function (t) {
    const e = t.originalEvent; const i = e.target.tagName; return i !== 'INPUT' && i !== 'SELECT' && i !== 'TEXTAREA' && !e.target.isContentEditable;
  }; const hs = function (t) {
    const e = t.originalEvent; return St(void 0 !== e, 56), e.pointerType == 'mouse';
  }; const us = function (t) {
    const e = t.originalEvent; return St(void 0 !== e, 56), e.isPrimary && e.button === 0;
  }; let cs = class extends ts {
    constructor(t) {
      super({stopDown: h}), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1; const e = t.condition ? t.condition : es(os, us); this.condition_ = t.onFocusOnly ? es(ns, e) : e, this.noKinetic_ = !1;
    }handleDragEvent(t) {
      const e = t.map; this.panning_ || (this.panning_ = !0, e.getView().beginInteraction()); const i = this.targetPointers; const n = e.getEventPixel($r(i)); if (i.length == this.lastPointersCount_) {
        if (this.kinetic_ && this.kinetic_.update(n[0], n[1]), this.lastCentroid) {
          const e = [this.lastCentroid[0] - n[0], n[1] - this.lastCentroid[1]]; const i = t.map.getView(); !function (t, e) {
            t[0] *= e, t[1] *= e;
          }(e, i.getResolution()), si(e, i.getRotation()), i.adjustCenterInternal(e);
        }
      } else {
        this.kinetic_ && this.kinetic_.begin();
      } this.lastCentroid = n, this.lastPointersCount_ = i.length, t.originalEvent.preventDefault();
    }handleUpEvent(t) {
      const e = t.map; const i = e.getView(); if (this.targetPointers.length === 0) {
        if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
          const t = this.kinetic_.getDistance(); const n = this.kinetic_.getAngle(); const r = i.getCenterInternal(); const s = e.getPixelFromCoordinateInternal(r); const o = e.getCoordinateFromPixelInternal([s[0] - t * Math.cos(n), s[1] - t * Math.sin(n)]); i.animateInternal({center: i.getConstrainedCenter(o), duration: 500, easing: Hn});
        } return this.panning_ && (this.panning_ = !1, i.endInteraction()), !1;
      } return this.kinetic_ && this.kinetic_.begin(), this.lastCentroid = null, !0;
    }handleDownEvent(t) {
      if (this.targetPointers.length > 0 && this.condition_(t)) {
        const e = t.map.getView(); return this.lastCentroid = null, e.getAnimating() && e.cancelAnimations(), this.kinetic_ && this.kinetic_.begin(), this.noKinetic_ = this.targetPointers.length > 1, !0;
      } return !1;
    }
  }; let ds = class extends ts {
    constructor(t) {
      t = t || {}, super({stopDown: h}), this.condition_ = t.condition ? t.condition : is, this.lastAngle_ = void 0, this.duration_ = void 0 !== t.duration ? t.duration : 250;
    }handleDragEvent(t) {
      if (!hs(t)) {
        return;
      } const e = t.map; const i = e.getView(); if (i.getConstraints().rotation === Kn) {
        return;
      } const n = e.getSize(); const r = t.pixel; const s = Math.atan2(n[1] / 2 - r[1], r[0] - n[0] / 2); if (void 0 !== this.lastAngle_) {
        const t = s - this.lastAngle_; i.adjustRotationInternal(-t);
      } this.lastAngle_ = s;
    }handleUpEvent(t) {
      if (!hs(t)) {
        return !0;
      } return t.map.getView().endInteraction(this.duration_), !1;
    }handleDownEvent(t) {
      if (!hs(t)) {
        return !1;
      } if (ss(t) && this.condition_(t)) {
        return t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0;
      } return !1;
    }
  }; let ps = class extends i {
    constructor(t) {
      super(), this.geometry_ = null, this.element_ = document.createElement('div'), this.element_.style.position = 'absolute', this.element_.style.pointerEvents = 'auto', this.element_.className = 'ol-box ' + t, this.map_ = null, this.startPixel_ = null, this.endPixel_ = null;
    }disposeInternal() {
      this.setMap(null);
    }render_() {
      const t = this.startPixel_; const e = this.endPixel_; const i = 'px'; const n = this.element_.style; n.left = Math.min(t[0], e[0]) + i, n.top = Math.min(t[1], e[1]) + i, n.width = Math.abs(e[0] - t[0]) + i, n.height = Math.abs(e[1] - t[1]) + i;
    }setMap(t) {
      if (this.map_) {
        this.map_.getOverlayContainer().removeChild(this.element_); const t = this.element_.style; t.left = 'inherit', t.top = 'inherit', t.width = 'inherit', t.height = 'inherit';
      } this.map_ = t, this.map_ && this.map_.getOverlayContainer().appendChild(this.element_);
    }setPixels(t, e) {
      this.startPixel_ = t, this.endPixel_ = e, this.createOrUpdateGeometry(), this.render_();
    }createOrUpdateGeometry() {
      const t = this.startPixel_; const e = this.endPixel_; const i = [t, [t[0], e[1]], e, [e[0], t[1]]].map(this.map_.getCoordinateFromPixelInternal, this.map_); i[4] = i[0].slice(), this.geometry_ ? this.geometry_.setCoordinates([i]) : this.geometry_ = new Nr([i]);
    }getGeometry() {
      return this.geometry_;
    }
  }; const gs = 'boxstart'; const fs = 'boxdrag'; const ms = 'boxend'; const ys = 'boxcancel'; class _s extends t {
    constructor(t, e, i) {
      super(t), this.coordinate = e, this.mapBrowserEvent = i;
    }
  } let vs = class extends ts {
    constructor(t) {
      super(), this.on, this.once, this.un, t = t || {}, this.box_ = new ps(t.className || 'ol-dragbox'), this.minArea_ = void 0 !== t.minArea ? t.minArea : 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ? t.condition : ss, this.boxEndCondition_ = t.boxEndCondition ? t.boxEndCondition : this.defaultBoxEndCondition;
    }defaultBoxEndCondition(t, e, i) {
      const n = i[0] - e[0]; const r = i[1] - e[1]; return n * n + r * r >= this.minArea_;
    }getGeometry() {
      return this.box_.getGeometry();
    }handleDragEvent(t) {
      this.box_.setPixels(this.startPixel_, t.pixel), this.dispatchEvent(new _s(fs, t.coordinate, t));
    }handleUpEvent(t) {
      this.box_.setMap(null); const e = this.boxEndCondition_(t, this.startPixel_, t.pixel); return e && this.onBoxEnd(t), this.dispatchEvent(new _s(e ? ms : ys, t.coordinate, t)), !1;
    }handleDownEvent(t) {
      return !!this.condition_(t) && (this.startPixel_ = t.pixel, this.box_.setMap(t.map), this.box_.setPixels(this.startPixel_, this.startPixel_), this.dispatchEvent(new _s(gs, t.coordinate, t)), !0);
    }onBoxEnd(t) {}
  }; let xs = class extends vs {
    constructor(t) {
      super({condition: (t = t || {}).condition ? t.condition : as, className: t.className || 'ol-dragzoom', minArea: t.minArea}), this.duration_ = void 0 !== t.duration ? t.duration : 200, this.out_ = void 0 !== t.out && t.out;
    }onBoxEnd(t) {
      const e = this.getMap().getView(); let i = this.getGeometry(); if (this.out_) {
        const t = e.rotatedExtentForGeometry(i); const n = e.getResolutionForExtentInternal(t); const r = e.getResolution() / n; i = i.clone(), i.scale(r * r);
      }e.fitInternal(i, {duration: this.duration_, easing: Hn});
    }
  }; let bs = 37; let ws = 38; let Cs = 39; let Ss = 40; let Ts = class extends Jr {
    constructor(t) {
      super(), t = t || {}, this.defaultCondition_ = function (t) {
        return os(t) && ls(t);
      }, this.condition_ = void 0 !== t.condition ? t.condition : this.defaultCondition_, this.duration_ = void 0 !== t.duration ? t.duration : 100, this.pixelDelta_ = void 0 !== t.pixelDelta ? t.pixelDelta : 128;
    }handleEvent(t) {
      let e = !1; if (t.type == v) {
        const i = t.originalEvent; const n = i.keyCode; if (this.condition_(t) && (n == Ss || n == bs || n == Cs || n == ws)) {
          const r = t.map.getView(); const s = r.getResolution() * this.pixelDelta_; let o = 0; let a = 0; n == Ss ? a = -s : n == bs ? o = -s : n == Cs ? o = s : a = s; const l = [o, a]; si(l, r.getRotation()), function (t, e, i) {
            const n = t.getCenterInternal(); if (n) {
              const r = [n[0] + e[0], n[1] + e[1]]; t.animateInternal({duration: void 0 !== i ? i : 250, easing: Qn, center: t.getConstrainedCenter(r)});
            }
          }(r, l, this.duration_), i.preventDefault(), e = !0;
        }
      } return !e;
    }
  }; let Es = class extends Jr {
    constructor(t) {
      super(), t = t || {}, this.condition_ = t.condition ? t.condition : ls, this.delta_ = t.delta ? t.delta : 1, this.duration_ = void 0 !== t.duration ? t.duration : 100;
    }handleEvent(t) {
      let e = !1; if (t.type == v || t.type == x) {
        const i = t.originalEvent; const n = i.charCode; if (this.condition_(t) && (n == '+'.charCodeAt(0) || n == '-'.charCodeAt(0))) {
          const r = t.map; const s = n == '+'.charCodeAt(0) ? this.delta_ : -this.delta_; Hr(r.getView(), s, void 0, this.duration_), i.preventDefault(), e = !0;
        }
      } return !e;
    }
  }; let Rs = class {
    constructor(t, e, i) {
      this.decay_ = t, this.minVelocity_ = e, this.delay_ = i, this.points_ = [], this.angle_ = 0, this.initialVelocity_ = 0;
    }begin() {
      this.points_.length = 0, this.angle_ = 0, this.initialVelocity_ = 0;
    }update(t, e) {
      this.points_.push(t, e, Date.now());
    }end() {
      if (this.points_.length < 6) {
        return !1;
      } const t = Date.now() - this.delay_; const e = this.points_.length - 3; if (this.points_[e + 2] < t) {
        return !1;
      } let i = e - 3; for (;i > 0 && this.points_[i + 2] > t;) {
        i -= 3;
      } const n = this.points_[e + 2] - this.points_[i + 2]; if (n < 1e3 / 60) {
        return !1;
      } const r = this.points_[e] - this.points_[i]; const s = this.points_[e + 1] - this.points_[i + 1]; return this.angle_ = Math.atan2(s, r), this.initialVelocity_ = Math.sqrt(r * r + s * s) / n, this.initialVelocity_ > this.minVelocity_;
    }getDistance() {
      return (this.minVelocity_ - this.initialVelocity_) / this.decay_;
    }getAngle() {
      return this.angle_;
    }
  }; let Is = class extends Jr {
    constructor(t) {
      super(t = t || {}), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = void 0 !== t.maxDelta ? t.maxDelta : 1, this.duration_ = void 0 !== t.duration ? t.duration : 250, this.timeout_ = void 0 !== t.timeout ? t.timeout : 80, this.useAnchor_ = void 0 === t.useAnchor || t.useAnchor, this.constrainResolution_ = void 0 !== t.constrainResolution && t.constrainResolution; const e = t.condition ? t.condition : rs; this.condition_ = t.onFocusOnly ? es(ns, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300;
    }endInteraction_() {
      this.trackpadTimeoutId_ = void 0; const t = this.getMap(); if (!t) {
        return;
      } t.getView().endInteraction(void 0, this.lastDelta_ ? this.lastDelta_ > 0 ? 1 : -1 : 0, this.lastAnchor_);
    }handleEvent(t) {
      if (!this.condition_(t)) {
        return !0;
      } if (t.type !== C) {
        return !0;
      } const e = t.map; const i = t.originalEvent; let n; if (i.preventDefault(), this.useAnchor_ && (this.lastAnchor_ = t.coordinate), t.type == C && (n = i.deltaY, N && i.deltaMode === WheelEvent.DOM_DELTA_PIXEL && (n /= q), i.deltaMode === WheelEvent.DOM_DELTA_LINE && (n *= 40)), n === 0) {
        return !1;
      } this.lastDelta_ = n; const r = Date.now(); void 0 === this.startTime_ && (this.startTime_ = r), (!this.mode_ || r - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(n) < 4 ? 'trackpad' : 'wheel'); const s = e.getView(); if (this.mode_ === 'trackpad' && !s.getConstrainResolution() && !this.constrainResolution_) {
        return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (s.getAnimating() && s.cancelAnimations(), s.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(this.endInteraction_.bind(this), this.timeout_), s.adjustZoom(-n / this.deltaPerZoom_, this.lastAnchor_), this.startTime_ = r, !1;
      } this.totalDelta_ += n; const o = Math.max(this.timeout_ - (r - this.startTime_), 0); return clearTimeout(this.timeoutId_), this.timeoutId_ = setTimeout(this.handleWheelZoom_.bind(this, e), o), !1;
    }handleWheelZoom_(t) {
      const e = t.getView(); e.getAnimating() && e.cancelAnimations(); let i = -we(this.totalDelta_, -this.maxDelta_ * this.deltaPerZoom_, this.maxDelta_ * this.deltaPerZoom_) / this.deltaPerZoom_; (e.getConstrainResolution() || this.constrainResolution_) && (i = i ? i > 0 ? 1 : -1 : 0), Hr(e, i, this.lastAnchor_, this.duration_), this.mode_ = void 0, this.totalDelta_ = 0, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_ = void 0;
    }setMouseAnchor(t) {
      this.useAnchor_ = t, t || (this.lastAnchor_ = null);
    }
  }; let Ms = class extends ts {
    constructor(t) {
      const e = t = t || {}; e.stopDown || (e.stopDown = h), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = void 0 !== t.threshold ? t.threshold : 0.3, this.duration_ = void 0 !== t.duration ? t.duration : 250;
    }handleDragEvent(t) {
      let e = 0; const i = this.targetPointers[0]; const n = this.targetPointers[1]; const r = Math.atan2(n.clientY - i.clientY, n.clientX - i.clientX); if (void 0 !== this.lastAngle_) {
        const t = r - this.lastAngle_; this.rotationDelta_ += t, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = t;
      } this.lastAngle_ = r; const s = t.map; const o = s.getView(); o.getConstraints().rotation !== Kn && (this.anchor_ = s.getCoordinateFromPixelInternal(s.getEventPixel($r(this.targetPointers))), this.rotating_ && (s.render(), o.adjustRotationInternal(e, this.anchor_)));
    }handleUpEvent(t) {
      if (this.targetPointers.length < 2) {
        return t.map.getView().endInteraction(this.duration_), !1;
      } return !0;
    }handleDownEvent(t) {
      if (this.targetPointers.length >= 2) {
        const e = t.map; return this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.handlingDownUpSequence || e.getView().beginInteraction(), !0;
      } return !1;
    }
  }; let ks = class extends ts {
    constructor(t) {
      const e = t = t || {}; e.stopDown || (e.stopDown = h), super(e), this.anchor_ = null, this.duration_ = void 0 !== t.duration ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
    }handleDragEvent(t) {
      let e = 1; const i = this.targetPointers[0]; const n = this.targetPointers[1]; const r = i.clientX - n.clientX; const s = i.clientY - n.clientY; const o = Math.sqrt(r * r + s * s); void 0 !== this.lastDistance_ && (e = this.lastDistance_ / o), this.lastDistance_ = o; const a = t.map; const l = a.getView(); e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = a.getCoordinateFromPixelInternal(a.getEventPixel($r(this.targetPointers))), a.render(), l.adjustResolutionInternal(e, this.anchor_);
    }handleUpEvent(t) {
      if (this.targetPointers.length < 2) {
        const e = t.map.getView(); const i = this.lastScaleDelta_ > 1 ? 1 : -1; return e.endInteraction(this.duration_, i), !1;
      } return !0;
    }handleDownEvent(t) {
      if (this.targetPointers.length >= 2) {
        const e = t.map; return this.anchor_ = null, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1, this.handlingDownUpSequence || e.getView().beginInteraction(), !0;
      } return !1;
    }
  }; function Fs(t) {
    return t[0] > 0 && t[1] > 0;
  } function Ps(t, e) {
    return Array.isArray(t) ? t : (void 0 === e ? e = [t, t] : (e[0] = t, e[1] = t), e);
  } function Ls(t) {
    t instanceof ni ? t.setMapInternal(null) : t instanceof Li && t.getLayers().forEach(Ls);
  } function As(t, e) {
    if (t instanceof ni) {
      t.setMapInternal(e);
    } else if (t instanceof Li) {
      const i = t.getLayers().getArray(); for (let t = 0, n = i.length; t < n; ++t) {
        As(i[t], e);
      }
    }
  } let zs = class extends L {
    constructor(t) {
      super(), t = t || {}, this.on, this.once, this.un; const e = function (t) {
        let e = null; void 0 !== t.keyboardEventTarget && (e = typeof t.keyboardEventTarget === 'string' ? document.getElementById(t.keyboardEventTarget) : t.keyboardEventTarget); const i = {}; const n = t.layers && typeof t.layers.getLayers === 'function' ? t.layers : new Li({layers: t.layers}); let r; let s; let o; i[Q] = n, i[tt] = t.target, i[et] = t.view instanceof Vr ? t.view : new Vr(), void 0 !== t.controls && (Array.isArray(t.controls) ? r = new Ct(t.controls.slice()) : (St(typeof t.controls.getArray === 'function', 47), r = t.controls)); void 0 !== t.interactions && (Array.isArray(t.interactions) ? s = new Ct(t.interactions.slice()) : (St(typeof t.interactions.getArray === 'function', 48), s = t.interactions)); void 0 !== t.overlays ? Array.isArray(t.overlays) ? o = new Ct(t.overlays.slice()) : (St(typeof t.overlays.getArray === 'function', 49), o = t.overlays) : o = new Ct(); return {controls: r, interactions: s, keyboardEventTarget: e, overlays: o, values: i};
      }(t); this.renderComplete_, this.loaded_ = !0, this.boundHandleBrowserEvent_ = this.handleBrowserEvent.bind(this), this.maxTilesLoading_ = void 0 !== t.maxTilesLoading ? t.maxTilesLoading : 16, this.pixelRatio_ = void 0 !== t.pixelRatio ? t.pixelRatio : q, this.postRenderTimeoutHandle_, this.animationDelayKey_, this.animationDelay_ = this.animationDelay_.bind(this), this.coordinateToPixelTransform_ = [1, 0, 0, 1, 0, 0], this.pixelToCoordinateTransform_ = [1, 0, 0, 1, 0, 0], this.frameIndex_ = 0, this.frameState_ = null, this.previousExtent_ = null, this.viewPropertyListenerKey_ = null, this.viewChangeListenerKey_ = null, this.layerGroupPropertyListenerKeys_ = null, this.viewport_ = document.createElement('div'), this.viewport_.className = 'ol-viewport' + ('ontouchstart' in window ? ' ol-touch' : ''), this.viewport_.style.position = 'relative', this.viewport_.style.overflow = 'hidden', this.viewport_.style.width = '100%', this.viewport_.style.height = '100%', this.overlayContainer_ = document.createElement('div'), this.overlayContainer_.style.position = 'absolute', this.overlayContainer_.style.zIndex = '0', this.overlayContainer_.style.width = '100%', this.overlayContainer_.style.height = '100%', this.overlayContainer_.style.pointerEvents = 'none', this.overlayContainer_.className = 'ol-overlaycontainer', this.viewport_.appendChild(this.overlayContainer_), this.overlayContainerStopEvent_ = document.createElement('div'), this.overlayContainerStopEvent_.style.position = 'absolute', this.overlayContainerStopEvent_.style.zIndex = '0', this.overlayContainerStopEvent_.style.width = '100%', this.overlayContainerStopEvent_.style.height = '100%', this.overlayContainerStopEvent_.style.pointerEvents = 'none', this.overlayContainerStopEvent_.className = 'ol-overlaycontainer-stopevent', this.viewport_.appendChild(this.overlayContainerStopEvent_), this.mapBrowserEventHandler_ = null, this.moveTolerance_ = t.moveTolerance, this.keyboardEventTarget_ = e.keyboardEventTarget, this.targetChangeHandlerKeys_ = null, this.targetElement_ = null, this.resizeObserver_ = new ResizeObserver((()=>this.updateSize())), this.controls = e.controls || function (t) {
        t = t || {}; const e = new Ct(); return (void 0 === t.zoom || t.zoom) && e.push(new Zr(t.zoomOptions)), (void 0 === t.rotate || t.rotate) && e.push(new Kr(t.rotateOptions)), (void 0 === t.attribution || t.attribution) && e.push(new Yr(t.attributionOptions)), e;
      }(), this.interactions = e.interactions || function (t) {
        t = t || {}; const e = new Ct(); const i = new Rs(-0.005, 0.05, 100); return (void 0 === t.altShiftDragRotate || t.altShiftDragRotate) && e.push(new ds()), (void 0 === t.doubleClickZoom || t.doubleClickZoom) && e.push(new Qr({delta: t.zoomDelta, duration: t.zoomDuration})), (void 0 === t.dragPan || t.dragPan) && e.push(new cs({onFocusOnly: t.onFocusOnly, kinetic: i})), (void 0 === t.pinchRotate || t.pinchRotate) && e.push(new Ms()), (void 0 === t.pinchZoom || t.pinchZoom) && e.push(new ks({duration: t.zoomDuration})), (void 0 === t.keyboard || t.keyboard) && (e.push(new Ts()), e.push(new Es({delta: t.zoomDelta, duration: t.zoomDuration}))), (void 0 === t.mouseWheelZoom || t.mouseWheelZoom) && e.push(new Is({onFocusOnly: t.onFocusOnly, duration: t.zoomDuration})), (void 0 === t.shiftDragZoom || t.shiftDragZoom) && e.push(new xs({duration: t.zoomDuration})), e;
      }({onFocusOnly: !0}), this.overlays_ = e.overlays, this.overlayIdIndex_ = {}, this.renderer_ = null, this.postRenderFunctions_ = [], this.tileQueue_ = new Ki(this.getTilePriority.bind(this), this.handleTileChange_.bind(this)), this.addChangeListener(Q, this.handleLayerGroupChanged_), this.addChangeListener(et, this.handleViewChanged_), this.addChangeListener($, this.handleSizeChanged_), this.addChangeListener(tt, this.handleTargetChanged_), this.setProperties(e.values); const i = this; !t.view || t.view instanceof Vr || t.view.then((function (t) {
        i.setView(new Vr(t));
      })), this.controls.addEventListener(vt, ((t)=>{
        t.element.setMap(this);
      })), this.controls.addEventListener(xt, ((t)=>{
        t.element.setMap(null);
      })), this.interactions.addEventListener(vt, ((t)=>{
        t.element.setMap(this);
      })), this.interactions.addEventListener(xt, ((t)=>{
        t.element.setMap(null);
      })), this.overlays_.addEventListener(vt, ((t)=>{
        this.addOverlayInternal_(t.element);
      })), this.overlays_.addEventListener(xt, ((t)=>{
        const e = t.element.getId(); void 0 !== e && delete this.overlayIdIndex_[e.toString()], t.element.setMap(null);
      })), this.controls.forEach(((t)=>{
        t.setMap(this);
      })), this.interactions.forEach(((t)=>{
        t.setMap(this);
      })), this.overlays_.forEach(this.addOverlayInternal_.bind(this));
    }addControl(t) {
      this.getControls().push(t);
    }addInteraction(t) {
      this.getInteractions().push(t);
    }addLayer(t) {
      this.getLayerGroup().getLayers().push(t);
    }handleLayerAdd_(t) {
      As(t.layer, this);
    }addOverlay(t) {
      this.getOverlays().push(t);
    }addOverlayInternal_(t) {
      const e = t.getId(); void 0 !== e && (this.overlayIdIndex_[e.toString()] = t), t.setMap(this);
    }disposeInternal() {
      this.controls.clear(), this.interactions.clear(), this.overlays_.clear(), this.resizeObserver_.disconnect(), this.setTarget(null), super.disposeInternal();
    }forEachFeatureAtPixel(t, e, i) {
      if (!this.frameState_ || !this.renderer_) {
        return;
      } const n = this.getCoordinateFromPixelInternal(t); const r = void 0 !== (i = void 0 !== i ? i : {}).hitTolerance ? i.hitTolerance : 0; const s = void 0 !== i.layerFilter ? i.layerFilter : l; const o = !1 !== i.checkWrapped; return this.renderer_.forEachFeatureAtCoordinate(n, this.frameState_, r, o, e, null, s, null);
    }getFeaturesAtPixel(t, e) {
      const i = []; return this.forEachFeatureAtPixel(t, (function (t) {
        i.push(t);
      }), e), i;
    }getAllLayers() {
      const t = []; return function e(i) {
        i.forEach((function (i) {
          i instanceof Li ? e(i.getLayers()) : t.push(i);
        }));
      }(this.getLayers()), t;
    }hasFeatureAtPixel(t, e) {
      if (!this.frameState_ || !this.renderer_) {
        return !1;
      } const i = this.getCoordinateFromPixelInternal(t); const n = void 0 !== (e = void 0 !== e ? e : {}).layerFilter ? e.layerFilter : l; const r = void 0 !== e.hitTolerance ? e.hitTolerance : 0; const s = !1 !== e.checkWrapped; return this.renderer_.hasFeatureAtCoordinate(i, this.frameState_, r, s, n, null);
    }getEventCoordinate(t) {
      return this.getCoordinateFromPixel(this.getEventPixel(t));
    }getEventCoordinateInternal(t) {
      return this.getCoordinateFromPixelInternal(this.getEventPixel(t));
    }getEventPixel(t) {
      const e = this.viewport_.getBoundingClientRect(); const i = this.getSize(); const n = e.width / i[0]; const r = e.height / i[1]; const s = 'changedTouches' in t ? t.changedTouches[0] : t; return [(s.clientX - e.left) / n, (s.clientY - e.top) / r];
    }getTarget() {
      return this.get(tt);
    }getTargetElement() {
      return this.targetElement_;
    }getCoordinateFromPixel(t) {
      return zn(this.getCoordinateFromPixelInternal(t), this.getView().getProjection());
    }getCoordinateFromPixelInternal(t) {
      const e = this.frameState_; return e ? Mt(e.pixelToCoordinateTransform, t.slice()) : null;
    }getControls() {
      return this.controls;
    }getOverlays() {
      return this.overlays_;
    }getOverlayById(t) {
      const e = this.overlayIdIndex_[t.toString()]; return void 0 !== e ? e : null;
    }getInteractions() {
      return this.interactions;
    }getLayerGroup() {
      return this.get(Q);
    }setLayers(t) {
      const e = this.getLayerGroup(); if (t instanceof Ct) {
        return void e.setLayers(t);
      } const i = e.getLayers(); i.clear(), i.extend(t);
    }getLayers() {
      return this.getLayerGroup().getLayers();
    }getLoadingOrNotReady() {
      const t = this.getLayerGroup().getLayerStatesArray(); for (let e = 0, i = t.length; e < i; ++e) {
        const i = t[e]; if (!i.visible) {
          continue;
        } const n = i.layer.getRenderer(); if (n && !n.ready) {
          return !0;
        } const r = i.layer.getSource(); if (r && r.loading) {
          return !0;
        }
      } return !1;
    }getPixelFromCoordinate(t) {
      const e = On(t, this.getView().getProjection()); return this.getPixelFromCoordinateInternal(e);
    }getPixelFromCoordinateInternal(t) {
      const e = this.frameState_; return e ? Mt(e.coordinateToPixelTransform, t.slice(0, 2)) : null;
    }getRenderer() {
      return this.renderer_;
    }getSize() {
      return this.get($);
    }getView() {
      return this.get(et);
    }getViewport() {
      return this.viewport_;
    }getOverlayContainer() {
      return this.overlayContainer_;
    }getOverlayContainerStopEvent() {
      return this.overlayContainerStopEvent_;
    }getOwnerDocument() {
      const t = this.getTargetElement(); return t ? t.ownerDocument : document;
    }getTilePriority(t, e, i, n) {
      return function (t, e, i, n, r) {
        if (!t || !(i in t.wantedTiles)) {
          return Ni;
        } if (!t.wantedTiles[i][e.getKey()]) {
          return Ni;
        } const s = t.viewState.center; const o = n[0] - s[0]; const a = n[1] - s[1]; return 65536 * Math.log(r) + Math.sqrt(o * o + a * a) / r;
      }(this.frameState_, t, e, i, n);
    }handleBrowserEvent(t, e) {
      e = e || t.type; const i = new zi(e, this, t); this.handleMapBrowserEvent(i);
    }handleMapBrowserEvent(t) {
      if (!this.frameState_) {
        return;
      } const e = t.originalEvent; const i = e.type; if (i === ji || i === C || i === v) {
        const t = this.getOwnerDocument(); const i = this.viewport_.getRootNode ? this.viewport_.getRootNode() : t; const n = e.target; if (this.overlayContainerStopEvent_.contains(n) || !(i === t ? t.documentElement : i).contains(n)) {
          return;
        }
      } if (t.frameState = this.frameState_, !1 !== this.dispatchEvent(t)) {
        const e = this.getInteractions().getArray().slice(); for (let i = e.length - 1; i >= 0; i--) {
          const n = e[i]; if (n.getMap() !== this || !n.getActive() || !this.getTargetElement()) {
            continue;
          } if (!n.handleEvent(t) || t.propagationStopped) {
            break;
          }
        }
      }
    }handlePostRender() {
      const t = this.frameState_; const e = this.tileQueue_; if (!e.isEmpty()) {
        let i = this.maxTilesLoading_; let n = i; if (t) {
          const e = t.viewHints; if (e[Zi] || e[Ui]) {
            const e = Date.now() - t.time > 8; i = e ? 0 : 8, n = e ? 0 : 2;
          }
        }e.getTilesLoading() < i && (e.reprioritize(), e.loadMoreTiles(i, n));
      }t && this.renderer_ && !t.animate && (!0 === this.renderComplete_ ? (this.hasListener(ei) && this.renderer_.dispatchRenderEvent(ei, t), !1 === this.loaded_ && (this.loaded_ = !0, this.dispatchEvent(new Ai(j, this, t)))) : !0 === this.loaded_ && (this.loaded_ = !1, this.dispatchEvent(new Ai(D, this, t)))); const i = this.postRenderFunctions_; for (let e = 0, n = i.length; e < n; ++e) {
        i[e](this, t);
      }i.length = 0;
    }handleSizeChanged_() {
      this.getView() && !this.getView().getAnimating() && this.getView().resolveConstraints(0), this.render();
    }handleTargetChanged_() {
      if (this.mapBrowserEventHandler_) {
        for (let t = 0, e = this.targetChangeHandlerKeys_.length; t < e; ++t) {
          E(this.targetChangeHandlerKeys_[t]);
        } this.targetChangeHandlerKeys_ = null, this.viewport_.removeEventListener(m, this.boundHandleBrowserEvent_), this.viewport_.removeEventListener(C, this.boundHandleBrowserEvent_), this.mapBrowserEventHandler_.dispose(), this.mapBrowserEventHandler_ = null, H(this.viewport_);
      } if (this.targetElement_) {
        this.resizeObserver_.unobserve(this.targetElement_); const t = this.targetElement_.getRootNode(); t instanceof ShadowRoot && this.resizeObserver_.unobserve(t.host);
      } const t = this.getTarget(); const e = typeof t === 'string' ? document.getElementById(t) : t; if (this.targetElement_ = e, e) {
        e.appendChild(this.viewport_), this.renderer_ || (this.renderer_ = new Mi(this)), this.mapBrowserEventHandler_ = new Gi(this, this.moveTolerance_); for (const t in Oi) {
          this.mapBrowserEventHandler_.addEventListener(Oi[t], this.handleMapBrowserEvent.bind(this));
        } this.viewport_.addEventListener(m, this.boundHandleBrowserEvent_, !1), this.viewport_.addEventListener(C, this.boundHandleBrowserEvent_, !!Y && {passive: !1}); const t = this.keyboardEventTarget_ ? this.keyboardEventTarget_ : e; this.targetChangeHandlerKeys_ = [S(t, v, this.handleBrowserEvent, this), S(t, x, this.handleBrowserEvent, this)]; const i = e.getRootNode(); i instanceof ShadowRoot && this.resizeObserver_.observe(i.host), this.resizeObserver_.observe(e);
      } else {
        this.renderer_ && (clearTimeout(this.postRenderTimeoutHandle_), this.postRenderTimeoutHandle_ = void 0, this.postRenderFunctions_.length = 0, this.renderer_.dispose(), this.renderer_ = null), this.animationDelayKey_ && (cancelAnimationFrame(this.animationDelayKey_), this.animationDelayKey_ = void 0);
      } this.updateSize();
    }handleTileChange_() {
      this.render();
    }handleViewPropertyChanged_() {
      this.render();
    }handleViewChanged_() {
      this.viewPropertyListenerKey_ && (E(this.viewPropertyListenerKey_), this.viewPropertyListenerKey_ = null), this.viewChangeListenerKey_ && (E(this.viewChangeListenerKey_), this.viewChangeListenerKey_ = null); const t = this.getView(); t && (this.updateViewportSize_(), this.viewPropertyListenerKey_ = S(t, e, this.handleViewPropertyChanged_, this), this.viewChangeListenerKey_ = S(t, g, this.handleViewPropertyChanged_, this), t.resolveConstraints(0)), this.render();
    }handleLayerGroupChanged_() {
      this.layerGroupPropertyListenerKeys_ && (this.layerGroupPropertyListenerKeys_.forEach(E), this.layerGroupPropertyListenerKeys_ = null); const t = this.getLayerGroup(); t && (this.handleLayerAdd_(new ki('addlayer', t)), this.layerGroupPropertyListenerKeys_ = [S(t, e, this.render, this), S(t, g, this.render, this), S(t, 'addlayer', this.handleLayerAdd_, this), S(t, 'removelayer', this.handleLayerRemove_, this)]), this.render();
    }isRendered() {
      return !!this.frameState_;
    }animationDelay_() {
      this.animationDelayKey_ = void 0, this.renderFrame_(Date.now());
    }renderSync() {
      this.animationDelayKey_ && cancelAnimationFrame(this.animationDelayKey_), this.animationDelay_();
    }redrawText() {
      const t = this.getLayerGroup().getLayerStatesArray(); for (let e = 0, i = t.length; e < i; ++e) {
        const i = t[e].layer; i.hasRenderer() && i.getRenderer().handleFontsChanged();
      }
    }render() {
      this.renderer_ && void 0 === this.animationDelayKey_ && (this.animationDelayKey_ = requestAnimationFrame(this.animationDelay_));
    }removeControl(t) {
      return this.getControls().remove(t);
    }removeInteraction(t) {
      return this.getInteractions().remove(t);
    }removeLayer(t) {
      return this.getLayerGroup().getLayers().remove(t);
    }handleLayerRemove_(t) {
      Ls(t.layer);
    }removeOverlay(t) {
      return this.getOverlays().remove(t);
    }renderFrame_(t) {
      const e = this.getSize(); const i = this.getView(); const n = this.frameState_; let r = null; if (void 0 !== e && Fs(e) && i && i.isDef()) {
        const n = i.getHints(this.frameState_ ? this.frameState_.viewHints : void 0); const s = i.getState(); if (r = {animate: !1, coordinateToPixelTransform: this.coordinateToPixelTransform_, declutterTree: null, extent: ce(s.center, s.resolution, s.rotation, e), index: this.frameIndex_++, layerIndex: 0, layerStatesArray: this.getLayerGroup().getLayerStatesArray(), pixelRatio: this.pixelRatio_, pixelToCoordinateTransform: this.pixelToCoordinateTransform_, postRenderFunctions: [], size: e, tileQueue: this.tileQueue_, time: t, usedTiles: {}, viewState: s, viewHints: n, wantedTiles: {}, mapId: F(this), renderTargets: {}}, s.nextCenter && s.nextResolution) {
          const t = isNaN(s.nextRotation) ? s.rotation : s.nextRotation; r.nextExtent = ce(s.nextCenter, s.nextResolution, t, e);
        }
      } if (this.frameState_ = r, this.renderer_.renderFrame(r), r) {
        if (r.animate && this.render(), Array.prototype.push.apply(this.postRenderFunctions_, r.postRenderFunctions), n) {
          (!this.previousExtent_ || !ve(this.previousExtent_) && !te(r.extent, this.previousExtent_)) && (this.dispatchEvent(new Ai(z, this, n)), this.previousExtent_ = Jt(this.previousExtent_));
        } this.previousExtent_ && !r.viewHints[Zi] && !r.viewHints[Ui] && !te(r.extent, this.previousExtent_) && (this.dispatchEvent(new Ai(O, this, r)), qt(r.extent, this.previousExtent_));
      } this.dispatchEvent(new Ai(A, this, r)), this.renderComplete_ = this.hasListener(D) || this.hasListener(j) || this.hasListener(ei) ? !this.tileQueue_.getTilesLoading() && !this.tileQueue_.getCount() && !this.getLoadingOrNotReady() : void 0, this.postRenderTimeoutHandle_ || (this.postRenderTimeoutHandle_ = setTimeout((()=>{
        this.postRenderTimeoutHandle_ = void 0, this.handlePostRender();
      }), 0));
    }setLayerGroup(t) {
      const e = this.getLayerGroup(); e && this.handleLayerRemove_(new ki('removelayer', e)), this.set(Q, t);
    }setSize(t) {
      this.set($, t);
    }setTarget(t) {
      this.set(tt, t);
    }setView(t) {
      if (!t || t instanceof Vr) {
        return void this.set(et, t);
      } this.set(et, new Vr()); const e = this; t.then((function (t) {
        e.setView(new Vr(t));
      }));
    }updateSize() {
      const t = this.getTargetElement(); let e; if (t) {
        const i = getComputedStyle(t); const n = t.offsetWidth - parseFloat(i.borderLeftWidth) - parseFloat(i.paddingLeft) - parseFloat(i.paddingRight) - parseFloat(i.borderRightWidth); const r = t.offsetHeight - parseFloat(i.borderTopWidth) - parseFloat(i.paddingTop) - parseFloat(i.paddingBottom) - parseFloat(i.borderBottomWidth); isNaN(n) || isNaN(r) || (e = [n, r], !Fs(e) && (t.offsetWidth || t.offsetHeight || t.getClientRects().length) && xn('No map visible because the map container\'s width or height are 0.'));
      } const i = this.getSize(); !e || i && a(e, i) || (this.setSize(e), this.updateViewportSize_());
    }updateViewportSize_() {
      const t = this.getView(); if (t) {
        let e; const i = getComputedStyle(this.viewport_); i.width && i.height && (e = [parseInt(i.width, 10), parseInt(i.height, 10)]), t.setViewportSize(e);
      }
    }
  }; let Os = 0; let Ds = 1; let js = 2; let Gs = 3; let Ns = 4; class Ws {
    constructor(t) {
      this.opacity_ = t.opacity, this.rotateWithView_ = t.rotateWithView, this.rotation_ = t.rotation, this.scale_ = t.scale, this.scaleArray_ = Ps(t.scale), this.displacement_ = t.displacement, this.declutterMode_ = t.declutterMode;
    }clone() {
      const t = this.getScale(); return new Ws({opacity: this.getOpacity(), scale: Array.isArray(t) ? t.slice() : t, rotation: this.getRotation(), rotateWithView: this.getRotateWithView(), displacement: this.getDisplacement().slice(), declutterMode: this.getDeclutterMode()});
    }getOpacity() {
      return this.opacity_;
    }getRotateWithView() {
      return this.rotateWithView_;
    }getRotation() {
      return this.rotation_;
    }getScale() {
      return this.scale_;
    }getScaleArray() {
      return this.scaleArray_;
    }getDisplacement() {
      return this.displacement_;
    }getDeclutterMode() {
      return this.declutterMode_;
    }getAnchor() {
      return M();
    }getImage(t) {
      return M();
    }getHitDetectionImage() {
      return M();
    }getPixelRatio(t) {
      return 1;
    }getImageState() {
      return M();
    }getImageSize() {
      return M();
    }getOrigin() {
      return M();
    }getSize() {
      return M();
    }setDisplacement(t) {
      this.displacement_ = t;
    }setOpacity(t) {
      this.opacity_ = t;
    }setRotateWithView(t) {
      this.rotateWithView_ = t;
    }setRotation(t) {
      this.rotation_ = t;
    }setScale(t) {
      this.scale_ = t, this.scaleArray_ = Ps(t);
    }listenImageChange(t) {
      M();
    }load() {
      M();
    }unlistenImageChange(t) {
      M();
    }
  } let Xs = Ws; function qs(t) {
    return Array.isArray(t) ? De(t) : t;
  } class Bs extends Xs {
    constructor(t) {
      super({opacity: 1, rotateWithView: void 0 !== t.rotateWithView && t.rotateWithView, rotation: void 0 !== t.rotation ? t.rotation : 0, scale: void 0 !== t.scale ? t.scale : 1, displacement: void 0 !== t.displacement ? t.displacement : [0, 0], declutterMode: t.declutterMode}), this.canvas_ = void 0, this.hitDetectionCanvas_ = null, this.fill_ = void 0 !== t.fill ? t.fill : null, this.origin_ = [0, 0], this.points_ = t.points, this.radius_ = void 0 !== t.radius ? t.radius : t.radius1, this.radius2_ = t.radius2, this.angle_ = void 0 !== t.angle ? t.angle : 0, this.stroke_ = void 0 !== t.stroke ? t.stroke : null, this.size_ = null, this.renderOptions_ = null, this.render();
    }clone() {
      const t = this.getScale(); const e = new Bs({fill: this.getFill() ? this.getFill().clone() : void 0, points: this.getPoints(), radius: this.getRadius(), radius2: this.getRadius2(), angle: this.getAngle(), stroke: this.getStroke() ? this.getStroke().clone() : void 0, rotation: this.getRotation(), rotateWithView: this.getRotateWithView(), scale: Array.isArray(t) ? t.slice() : t, displacement: this.getDisplacement().slice(), declutterMode: this.getDeclutterMode()}); return e.setOpacity(this.getOpacity()), e;
    }getAnchor() {
      const t = this.size_; if (!t) {
        return null;
      } const e = this.getDisplacement(); const i = this.getScaleArray(); return [t[0] / 2 - e[0] / i[0], t[1] / 2 + e[1] / i[1]];
    }getAngle() {
      return this.angle_;
    }getFill() {
      return this.fill_;
    }setFill(t) {
      this.fill_ = t, this.render();
    }getHitDetectionImage() {
      return this.hitDetectionCanvas_ || this.createHitDetectionCanvas_(this.renderOptions_), this.hitDetectionCanvas_;
    }getImage(t) {
      let e = this.canvas_[t]; if (!e) {
        const i = this.renderOptions_; const n = K(i.size * t, i.size * t); this.draw_(i, n, t), e = n.canvas, this.canvas_[t] = e;
      } return e;
    }getPixelRatio(t) {
      return t;
    }getImageSize() {
      return this.size_;
    }getImageState() {
      return js;
    }getOrigin() {
      return this.origin_;
    }getPoints() {
      return this.points_;
    }getRadius() {
      return this.radius_;
    }getRadius2() {
      return this.radius2_;
    }getSize() {
      return this.size_;
    }getStroke() {
      return this.stroke_;
    }setStroke(t) {
      this.stroke_ = t, this.render();
    }listenImageChange(t) {}load() {}unlistenImageChange(t) {}calculateLineJoinSize_(t, e, i) {
      if (e === 0 || this.points_ === 1 / 0 || t !== 'bevel' && t !== 'miter') {
        return e;
      } let n = this.radius_; let r = void 0 === this.radius2_ ? n : this.radius2_; if (n < r) {
        const t = n; n = r, r = t;
      } const s = void 0 === this.radius2_ ? this.points_ : 2 * this.points_; const o = 2 * Math.PI / s; const a = r * Math.sin(o); const l = n - Math.sqrt(r * r - a * a); const h = Math.sqrt(a * a + l * l); const u = h / a; if (t === 'miter' && u <= i) {
        return u * e;
      } const c = e / 2 / u; const d = e / 2 * (l / h); const p = Math.sqrt((n + c) * (n + c) + d * d) - n; if (void 0 === this.radius2_ || t === 'bevel') {
        return 2 * p;
      } const g = n * Math.sin(o); const f = r - Math.sqrt(n * n - g * g); const m = Math.sqrt(g * g + f * f) / g; if (m <= i) {
        const t = m * e / 2 - r - n; return 2 * Math.max(p, t);
      } return 2 * p;
    }createRenderOptions() {
      let t; let e = gi; let i = 0; let n = null; let r = 0; let s = 0; this.stroke_ && (t = this.stroke_.getColor(), t === null && (t = fi), t = qs(t), s = this.stroke_.getWidth(), void 0 === s && (s = 1), n = this.stroke_.getLineDash(), r = this.stroke_.getLineDashOffset(), e = this.stroke_.getLineJoin(), void 0 === e && (e = gi), i = this.stroke_.getMiterLimit(), void 0 === i && (i = 10)); const o = this.calculateLineJoinSize_(e, s, i); const a = Math.max(this.radius_, this.radius2_ || 0); return {strokeStyle: t, strokeWidth: s, size: Math.ceil(2 * a + o), lineDash: n, lineDashOffset: r, lineJoin: e, miterLimit: i};
    }render() {
      this.renderOptions_ = this.createRenderOptions(); const t = this.renderOptions_.size; this.canvas_ = {}, this.size_ = [t, t];
    }draw_(t, e, i) {
      if (e.scale(i, i), e.translate(t.size / 2, t.size / 2), this.createPath_(e), this.fill_) {
        let t = this.fill_.getColor(); t === null && (t = ci), e.fillStyle = qs(t), e.fill();
      } this.stroke_ && (e.strokeStyle = t.strokeStyle, e.lineWidth = t.strokeWidth, t.lineDash && (e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset), e.lineJoin = t.lineJoin, e.miterLimit = t.miterLimit, e.stroke());
    }createHitDetectionCanvas_(t) {
      if (this.fill_) {
        let e = this.fill_.getColor(); let i = 0; if (typeof e === 'string' && (e = ze(e)), e === null ? i = 1 : Array.isArray(e) && (i = e.length === 4 ? e[3] : 1), i === 0) {
          const e = K(t.size, t.size); this.hitDetectionCanvas_ = e.canvas, this.drawHitDetectionCanvas_(t, e);
        }
      } this.hitDetectionCanvas_ || (this.hitDetectionCanvas_ = this.getImage(1));
    }createPath_(t) {
      let e = this.points_; const i = this.radius_; if (e === 1 / 0) {
        t.arc(0, 0, i, 0, 2 * Math.PI);
      } else {
        const n = void 0 === this.radius2_ ? i : this.radius2_; void 0 !== this.radius2_ && (e *= 2); const r = this.angle_ - Math.PI / 2; const s = 2 * Math.PI / e; for (let o = 0; o < e; o++) {
          const e = r + o * s; const a = o % 2 == 0 ? i : n; t.lineTo(a * Math.cos(e), a * Math.sin(e));
        }t.closePath();
      }
    }drawHitDetectionCanvas_(t, e) {
      e.translate(t.size / 2, t.size / 2), this.createPath_(e), e.fillStyle = ci, e.fill(), this.stroke_ && (e.strokeStyle = t.strokeStyle, e.lineWidth = t.strokeWidth, t.lineDash && (e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset), e.lineJoin = t.lineJoin, e.miterLimit = t.miterLimit, e.stroke());
    }
  } let Vs = Bs; class Ys extends Vs {
    constructor(t) {
      super({points: 1 / 0, fill: (t = t || {radius: 5}).fill, radius: t.radius, stroke: t.stroke, scale: void 0 !== t.scale ? t.scale : 1, rotation: void 0 !== t.rotation ? t.rotation : 0, rotateWithView: void 0 !== t.rotateWithView && t.rotateWithView, displacement: void 0 !== t.displacement ? t.displacement : [0, 0], declutterMode: t.declutterMode});
    }clone() {
      const t = this.getScale(); const e = new Ys({fill: this.getFill() ? this.getFill().clone() : void 0, stroke: this.getStroke() ? this.getStroke().clone() : void 0, radius: this.getRadius(), scale: Array.isArray(t) ? t.slice() : t, rotation: this.getRotation(), rotateWithView: this.getRotateWithView(), displacement: this.getDisplacement().slice(), declutterMode: this.getDeclutterMode()}); return e.setOpacity(this.getOpacity()), e;
    }setRadius(t) {
      this.radius_ = t, this.render();
    }
  } let Ks = Ys; class Zs {
    constructor(t) {
      t = t || {}, this.color_ = void 0 !== t.color ? t.color : null;
    }clone() {
      const t = this.getColor(); return new Zs({color: Array.isArray(t) ? t.slice() : t || void 0});
    }getColor() {
      return this.color_;
    }setColor(t) {
      this.color_ = t;
    }
  } let Us = Zs; let Hs = class extends p {
    constructor(t, e, i, n) {
      super(), this.extent = t, this.pixelRatio_ = i, this.resolution = e, this.state = n;
    }changed() {
      this.dispatchEvent(g);
    }getExtent() {
      return this.extent;
    }getImage() {
      return M();
    }getPixelRatio() {
      return this.pixelRatio_;
    }getResolution() {
      return this.resolution;
    }getState() {
      return this.state;
    }load() {
      M();
    }
  }; function Js(t, e, i) {
    const n = t; let r = !0; let s = !1; let o = !1; const a = [T(n, b, (function () {
      o = !0, s || e();
    }))]; return n.src && V ? (s = !0, n.decode().then((function () {
      r && e();
    })).catch((function (t) {
      r && (o ? e() : i());
    }))) : a.push(T(n, f, i)), function () {
      r = !1, a.forEach(E);
    };
  } let Qs = null; class $s extends p {
    constructor(t, e, i, n, r, s) {
      super(), this.hitDetectionImage_ = null, this.image_ = t, this.crossOrigin_ = n, this.canvas_ = {}, this.color_ = s, this.unlisten_ = null, this.imageState_ = r, this.size_ = i, this.src_ = e, this.tainted_;
    }initializeImage_() {
      this.image_ = new Image(), this.crossOrigin_ !== null && (this.image_.crossOrigin = this.crossOrigin_);
    }isTainted_() {
      if (void 0 === this.tainted_ && this.imageState_ === js) {
        Qs || (Qs = K(1, 1, void 0, {willReadFrequently: !0})), Qs.drawImage(this.image_, 0, 0); try {
          Qs.getImageData(0, 0, 1, 1), this.tainted_ = !1;
        } catch (t) {
          Qs = null, this.tainted_ = !0;
        }
      } return !0 === this.tainted_;
    }dispatchChangeEvent_() {
      this.dispatchEvent(g);
    }handleImageError_() {
      this.imageState_ = Gs, this.unlistenImage_(), this.dispatchChangeEvent_();
    }handleImageLoad_() {
      this.imageState_ = js, this.size_ ? (this.image_.width = this.size_[0], this.image_.height = this.size_[1]) : this.size_ = [this.image_.width, this.image_.height], this.unlistenImage_(), this.dispatchChangeEvent_();
    }getImage(t) {
      return this.image_ || this.initializeImage_(), this.replaceColor_(t), this.canvas_[t] ? this.canvas_[t] : this.image_;
    }getPixelRatio(t) {
      return this.replaceColor_(t), this.canvas_[t] ? t : 1;
    }getImageState() {
      return this.imageState_;
    }getHitDetectionImage() {
      if (this.image_ || this.initializeImage_(), !this.hitDetectionImage_) {
        if (this.isTainted_()) {
          const t = this.size_[0]; const e = this.size_[1]; const i = K(t, e); i.fillRect(0, 0, t, e), this.hitDetectionImage_ = i.canvas;
        } else {
          this.hitDetectionImage_ = this.image_;
        }
      } return this.hitDetectionImage_;
    }getSize() {
      return this.size_;
    }getSrc() {
      return this.src_;
    }load() {
      if (this.imageState_ === Os) {
        this.image_ || this.initializeImage_(), this.imageState_ = Ds; try {
          this.image_.src = this.src_;
        } catch (t) {
          this.handleImageError_();
        } this.unlisten_ = Js(this.image_, this.handleImageLoad_.bind(this), this.handleImageError_.bind(this));
      }
    }replaceColor_(t) {
      if (!this.color_ || this.canvas_[t] || this.imageState_ !== js) {
        return;
      } const e = this.image_; const i = document.createElement('canvas'); i.width = Math.ceil(e.width * t), i.height = Math.ceil(e.height * t); const n = i.getContext('2d'); n.scale(t, t), n.drawImage(e, 0, 0), n.globalCompositeOperation = 'multiply', n.fillStyle = Le(this.color_), n.fillRect(0, 0, i.width / t, i.height / t), n.globalCompositeOperation = 'destination-in', n.drawImage(e, 0, 0), this.canvas_[t] = i;
    }unlistenImage_() {
      this.unlisten_ && (this.unlisten_(), this.unlisten_ = null);
    }
  } class to extends Xs {
    constructor(t) {
      const e = void 0 !== (t = t || {}).opacity ? t.opacity : 1; const i = void 0 !== t.rotation ? t.rotation : 0; const n = void 0 !== t.scale ? t.scale : 1; const r = void 0 !== t.rotateWithView && t.rotateWithView; super({opacity: e, rotation: i, scale: n, displacement: void 0 !== t.displacement ? t.displacement : [0, 0], rotateWithView: r, declutterMode: t.declutterMode}), this.anchor_ = void 0 !== t.anchor ? t.anchor : [0.5, 0.5], this.normalizedAnchor_ = null, this.anchorOrigin_ = void 0 !== t.anchorOrigin ? t.anchorOrigin : 'top-left', this.anchorXUnits_ = void 0 !== t.anchorXUnits ? t.anchorXUnits : 'fraction', this.anchorYUnits_ = void 0 !== t.anchorYUnits ? t.anchorYUnits : 'fraction', this.crossOrigin_ = void 0 !== t.crossOrigin ? t.crossOrigin : null; const s = void 0 !== t.img ? t.img : null; this.imgSize_ = t.imgSize; let o = t.src; St(!(void 0 !== o && s), 4), St(!s || s && this.imgSize_, 5), void 0 !== o && o.length !== 0 || !s || (o = s.src || F(s)), St(void 0 !== o && o.length > 0, 6), St(!((void 0 !== t.width || void 0 !== t.height) && void 0 !== t.scale), 69); const a = void 0 !== t.src ? Os : js; if (this.color_ = void 0 !== t.color ? ze(t.color) : null, this.iconImage_ = function (t, e, i, n, r, s) {
        let o = Ge.get(e, n, s); return o || (o = new $s(t, e, i, n, r, s), Ge.set(e, n, s, o)), o;
      }(s, o, void 0 !== this.imgSize_ ? this.imgSize_ : null, this.crossOrigin_, a, this.color_), this.offset_ = void 0 !== t.offset ? t.offset : [0, 0], this.offsetOrigin_ = void 0 !== t.offsetOrigin ? t.offsetOrigin : 'top-left', this.origin_ = null, this.size_ = void 0 !== t.size ? t.size : null, this.width_ = t.width, this.height_ = t.height, void 0 !== this.width_ || void 0 !== this.height_) {
        const t = this.getImage(1); const e = ()=>{
          this.updateScaleFromWidthAndHeight(this.width_, this.height_);
        }; t.width > 0 ? this.updateScaleFromWidthAndHeight(this.width_, this.height_) : t.addEventListener('load', e);
      }
    }clone() {
      const t = this.getScale(); return new to({anchor: this.anchor_.slice(), anchorOrigin: this.anchorOrigin_, anchorXUnits: this.anchorXUnits_, anchorYUnits: this.anchorYUnits_, color: this.color_ && this.color_.slice ? this.color_.slice() : this.color_ || void 0, crossOrigin: this.crossOrigin_, imgSize: this.imgSize_, offset: this.offset_.slice(), offsetOrigin: this.offsetOrigin_, opacity: this.getOpacity(), rotateWithView: this.getRotateWithView(), rotation: this.getRotation(), scale: Array.isArray(t) ? t.slice() : t, size: this.size_ !== null ? this.size_.slice() : void 0, src: this.getSrc(), displacement: this.getDisplacement().slice(), declutterMode: this.getDeclutterMode(), width: this.width_, height: this.height_});
    }updateScaleFromWidthAndHeight(t, e) {
      const i = this.getImage(1); void 0 !== t && void 0 !== e ? super.setScale([t / i.width, e / i.height]) : void 0 !== t ? super.setScale([t / i.width, t / i.width]) : void 0 !== e ? super.setScale([e / i.height, e / i.height]) : super.setScale([1, 1]);
    }getAnchor() {
      let t = this.normalizedAnchor_; if (!t) {
        t = this.anchor_; const e = this.getSize(); if (this.anchorXUnits_ == 'fraction' || this.anchorYUnits_ == 'fraction') {
          if (!e) {
            return null;
          } t = this.anchor_.slice(), this.anchorXUnits_ == 'fraction' && (t[0] *= e[0]), this.anchorYUnits_ == 'fraction' && (t[1] *= e[1]);
        } if (this.anchorOrigin_ != 'top-left') {
          if (!e) {
            return null;
          } t === this.anchor_ && (t = this.anchor_.slice()), this.anchorOrigin_ != 'top-right' && this.anchorOrigin_ != 'bottom-right' || (t[0] = -t[0] + e[0]), this.anchorOrigin_ != 'bottom-left' && this.anchorOrigin_ != 'bottom-right' || (t[1] = -t[1] + e[1]);
        } this.normalizedAnchor_ = t;
      } const e = this.getDisplacement(); const i = this.getScaleArray(); return [t[0] - e[0] / i[0], t[1] + e[1] / i[1]];
    }setAnchor(t) {
      this.anchor_ = t, this.normalizedAnchor_ = null;
    }getColor() {
      return this.color_;
    }getImage(t) {
      return this.iconImage_.getImage(t);
    }getPixelRatio(t) {
      return this.iconImage_.getPixelRatio(t);
    }getImageSize() {
      return this.iconImage_.getSize();
    }getImageState() {
      return this.iconImage_.getImageState();
    }getHitDetectionImage() {
      return this.iconImage_.getHitDetectionImage();
    }getOrigin() {
      if (this.origin_) {
        return this.origin_;
      } let t = this.offset_; if (this.offsetOrigin_ != 'top-left') {
        const e = this.getSize(); const i = this.iconImage_.getSize(); if (!e || !i) {
          return null;
        } t = t.slice(), this.offsetOrigin_ != 'top-right' && this.offsetOrigin_ != 'bottom-right' || (t[0] = i[0] - e[0] - t[0]), this.offsetOrigin_ != 'bottom-left' && this.offsetOrigin_ != 'bottom-right' || (t[1] = i[1] - e[1] - t[1]);
      } return this.origin_ = t, this.origin_;
    }getSrc() {
      return this.iconImage_.getSrc();
    }getSize() {
      return this.size_ ? this.size_ : this.iconImage_.getSize();
    }getWidth() {
      return this.width_;
    }getHeight() {
      return this.height_;
    }setWidth(t) {
      this.width_ = t, this.updateScaleFromWidthAndHeight(t, this.height_);
    }setHeight(t) {
      this.height_ = t, this.updateScaleFromWidthAndHeight(this.width_, t);
    }setScale(t) {
      super.setScale(t); const e = this.getImage(1); if (e) {
        const i = Array.isArray(t) ? t[0] : t; void 0 !== i && (this.width_ = i * e.width); const n = Array.isArray(t) ? t[1] : t; void 0 !== n && (this.height_ = n * e.height);
      }
    }listenImageChange(t) {
      this.iconImage_.addEventListener(g, t);
    }load() {
      this.iconImage_.load();
    }unlistenImageChange(t) {
      this.iconImage_.removeEventListener(g, t);
    }
  } let eo = to; class io extends L {
    constructor(t) {
      if (super(), this.on, this.once, this.un, this.id_ = void 0, this.geometryName_ = 'geometry', this.style_ = null, this.styleFunction_ = void 0, this.geometryChangeKey_ = null, this.addChangeListener(this.geometryName_, this.handleGeometryChanged_), t) {
        if (typeof t.getSimplifiedGeometry === 'function') {
          const e = t; this.setGeometry(e);
        } else {
          const e = t; this.setProperties(e);
        }
      }
    }clone() {
      const t = new io(this.hasProperties() ? this.getProperties() : null); t.setGeometryName(this.getGeometryName()); const e = this.getGeometry(); e && t.setGeometry(e.clone()); const i = this.getStyle(); return i && t.setStyle(i), t;
    }getGeometry() {
      return this.get(this.geometryName_);
    }getId() {
      return this.id_;
    }getGeometryName() {
      return this.geometryName_;
    }getStyle() {
      return this.style_;
    }getStyleFunction() {
      return this.styleFunction_;
    }handleGeometryChange_() {
      this.changed();
    }handleGeometryChanged_() {
      this.geometryChangeKey_ && (E(this.geometryChangeKey_), this.geometryChangeKey_ = null); const t = this.getGeometry(); t && (this.geometryChangeKey_ = S(t, g, this.handleGeometryChange_, this)), this.changed();
    }setGeometry(t) {
      this.set(this.geometryName_, t);
    }setStyle(t) {
      this.style_ = t, this.styleFunction_ = t ? function (t) {
        if (typeof t === 'function') {
          return t;
        } let e; if (Array.isArray(t)) {
          e = t;
        } else {
          St(typeof t.getZIndex === 'function', 41); e = [t];
        } return function () {
          return e;
        };
      }(t) : void 0, this.changed();
    }setId(t) {
      this.id_ = t, this.changed();
    }setGeometryName(t) {
      this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_), this.geometryName_ = t, this.addChangeListener(this.geometryName_, this.handleGeometryChanged_), this.handleGeometryChanged_();
    }
  } let no = io; class ro extends ir {
    constructor(t) {
      super(), this.geometries_ = t || null, this.changeEventsKeys_ = [], this.listenGeometriesChange_();
    }unlistenGeometriesChange_() {
      this.changeEventsKeys_.forEach(E), this.changeEventsKeys_.length = 0;
    }listenGeometriesChange_() {
      if (this.geometries_) {
        for (let t = 0, e = this.geometries_.length; t < e; ++t) {
          this.changeEventsKeys_.push(S(this.geometries_[t], g, this.changed, this));
        }
      }
    }clone() {
      const t = new ro(null); return t.setGeometries(this.geometries_), t.applyProperties(this), t;
    }closestPointXY(t, e, i, n) {
      if (n < Bt(this.getExtent(), t, e)) {
        return n;
      } const r = this.geometries_; for (let s = 0, o = r.length; s < o; ++s) {
        n = r[s].closestPointXY(t, e, i, n);
      } return n;
    }containsXY(t, e) {
      const i = this.geometries_; for (let n = 0, r = i.length; n < r; ++n) {
        if (i[n].containsXY(t, e)) {
          return !0;
        }
      } return !1;
    }computeExtent(t) {
      Jt(t); const e = this.geometries_; for (let i = 0, n = e.length; i < n; ++i) {
        ee(t, e[i].getExtent());
      } return t;
    }getGeometries() {
      return so(this.geometries_);
    }getGeometriesArray() {
      return this.geometries_;
    }getGeometriesArrayRecursive() {
      let t = []; const e = this.geometries_; for (let i = 0, n = e.length; i < n; ++i) {
        e[i].getType() === this.getType() ? t = t.concat(e[i].getGeometriesArrayRecursive()) : t.push(e[i]);
      } return t;
    }getSimplifiedGeometry(t) {
      if (this.simplifiedGeometryRevision !== this.getRevision() && (this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = this.getRevision()), t < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && t < this.simplifiedGeometryMaxMinSquaredTolerance) {
        return this;
      } const e = []; const i = this.geometries_; let n = !1; for (let r = 0, s = i.length; r < s; ++r) {
        const s = i[r]; const o = s.getSimplifiedGeometry(t); e.push(o), o !== s && (n = !0);
      } if (n) {
        const t = new ro(null); return t.setGeometriesArray(e), t;
      } return this.simplifiedGeometryMaxMinSquaredTolerance = t, this;
    }getType() {
      return 'GeometryCollection';
    }intersectsExtent(t) {
      const e = this.geometries_; for (let i = 0, n = e.length; i < n; ++i) {
        if (e[i].intersectsExtent(t)) {
          return !0;
        }
      } return !1;
    }isEmpty() {
      return this.geometries_.length === 0;
    }rotate(t, e) {
      const i = this.geometries_; for (let n = 0, r = i.length; n < r; ++n) {
        i[n].rotate(t, e);
      } this.changed();
    }scale(t, e, i) {
      i || (i = he(this.getExtent())); const n = this.geometries_; for (let r = 0, s = n.length; r < s; ++r) {
        n[r].scale(t, e, i);
      } this.changed();
    }setGeometries(t) {
      this.setGeometriesArray(so(t));
    }setGeometriesArray(t) {
      this.unlistenGeometriesChange_(), this.geometries_ = t, this.listenGeometriesChange_(), this.changed();
    }applyTransform(t) {
      const e = this.geometries_; for (let i = 0, n = e.length; i < n; ++i) {
        e[i].applyTransform(t);
      } this.changed();
    }translate(t, e) {
      const i = this.geometries_; for (let n = 0, r = i.length; n < r; ++n) {
        i[n].translate(t, e);
      } this.changed();
    }disposeInternal() {
      this.unlistenGeometriesChange_(), super.disposeInternal();
    }
  } function so(t) {
    const e = []; for (let i = 0, n = t.length; i < n; ++i) {
      e.push(t[i].clone());
    } return e;
  } let oo = ro; function ao(t, e, i, r, s, o, a) {
    let l; let h; const u = (i - e) / r; if (u === 1) {
      l = e;
    } else if (u === 2) {
      l = e, h = s;
    } else if (u !== 0) {
      let o = t[e]; let a = t[e + 1]; let u = 0; const c = [0]; for (let n = e + r; n < i; n += r) {
        const e = t[n]; const i = t[n + 1]; u += Math.sqrt((e - o) * (e - o) + (i - a) * (i - a)), c.push(u), o = e, a = i;
      } const d = s * u; const p = function (t, e, i) {
        let r; let s; i = i || n; let o = 0; let a = t.length; let l = !1; for (;o < a;) {
          r = o + (a - o >> 1), s = +i(t[r], e), s < 0 ? o = r + 1 : (a = r, l = !s);
        } return l ? o : ~o;
      }(c, d); p < 0 ? (h = (d - c[-p - 2]) / (c[-p - 1] - c[-p - 2]), l = e + (-p - 2) * r) : l = e + p * r;
    }a = a > 1 ? a : 2, o = o || new Array(a); for (let e = 0; e < a; ++e) {
      o[e] = void 0 === l ? NaN : void 0 === h ? t[l + e] : Re(t[l + e], t[l + r + e], h);
    } return o;
  } function lo(t, e, i, n, r, s) {
    if (i == e) {
      return null;
    } let o; if (r < t[e + n - 1]) {
      return s ? (o = t.slice(e, e + n), o[n - 1] = r, o) : null;
    } if (t[i - 1] < r) {
      return s ? (o = t.slice(i - n, i), o[n - 1] = r, o) : null;
    } if (r == t[e + n - 1]) {
      return t.slice(e, e + n);
    } let a = e / n; let l = i / n; for (;a < l;) {
      const e = a + l >> 1; r < t[(e + 1) * n - 1] ? l = e : a = e + 1;
    } const h = t[a * n - 1]; if (r == h) {
      return t.slice((a - 1) * n, (a - 1) * n + n);
    } const u = (r - h) / (t[(a + 1) * n - 1] - h); o = []; for (let e = 0; e < n - 1; ++e) {
      o.push(Re(t[(a - 1) * n + e], t[a * n + e], u));
    } return o.push(r), o;
  } function ho(t, e, i, n) {
    let r = t[e]; let s = t[e + 1]; let o = 0; for (let a = e + n; a < i; a += n) {
      const e = t[a]; const i = t[a + 1]; o += Math.sqrt((e - r) * (e - r) + (i - s) * (i - s)), r = e, s = i;
    } return o;
  } class uo extends rr {
    constructor(t, e) {
      super(), this.flatMidpoint_ = null, this.flatMidpointRevision_ = -1, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, void 0 === e || Array.isArray(t[0]) ? this.setCoordinates(t, e) : this.setFlatCoordinates(e, t);
    }appendCoordinate(t) {
      this.flatCoordinates ? o(this.flatCoordinates, t) : this.flatCoordinates = t.slice(), this.changed();
    }clone() {
      const t = new uo(this.flatCoordinates.slice(), this.layout); return t.applyProperties(this), t;
    }closestPointXY(t, e, i, n) {
      return n < Bt(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(or(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0)), this.maxDeltaRevision_ = this.getRevision()), lr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, !1, t, e, i, n));
    }forEachSegment(t) {
      return kr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t);
    }getCoordinateAtM(t, e) {
      return this.layout != 'XYM' && this.layout != 'XYZM' ? null : (e = void 0 !== e && e, lo(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t, e));
    }getCoordinates() {
      return mr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
    }getCoordinateAt(t, e) {
      return ao(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t, e, this.stride);
    }getLength() {
      return ho(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
    }getFlatMidpoint() {
      return this.flatMidpointRevision_ != this.getRevision() && (this.flatMidpoint_ = this.getCoordinateAt(0.5, this.flatMidpoint_), this.flatMidpointRevision_ = this.getRevision()), this.flatMidpoint_;
    }getSimplifiedGeometryInternal(t) {
      const e = []; return e.length = dr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t, e, 0), new uo(e, 'XY');
    }getType() {
      return 'LineString';
    }intersectsExtent(t) {
      return Fr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t);
    }setCoordinates(t, e) {
      this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = ur(this.flatCoordinates, 0, t, this.stride), this.changed();
    }
  } let co = uo; class po extends rr {
    constructor(t, e, i) {
      if (super(), this.ends_ = [], this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, Array.isArray(t[0])) {
        this.setCoordinates(t, e);
      } else if (void 0 !== e && i) {
        this.setFlatCoordinates(e, t), this.ends_ = i;
      } else {
        let e = this.getLayout(); const i = t; const n = []; const r = []; for (let t = 0, s = i.length; t < s; ++t) {
          const s = i[t]; t === 0 && (e = s.getLayout()), o(n, s.getFlatCoordinates()), r.push(n.length);
        } this.setFlatCoordinates(e, n), this.ends_ = r;
      }
    }appendLineString(t) {
      this.flatCoordinates ? o(this.flatCoordinates, t.getFlatCoordinates().slice()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
    }clone() {
      const t = new po(this.flatCoordinates.slice(), this.layout, this.ends_.slice()); return t.applyProperties(this), t;
    }closestPointXY(t, e, i, n) {
      return n < Bt(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(ar(this.flatCoordinates, 0, this.ends_, this.stride, 0)), this.maxDeltaRevision_ = this.getRevision()), hr(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, !1, t, e, i, n));
    }getCoordinateAtM(t, e, i) {
      return this.layout != 'XYM' && this.layout != 'XYZM' || this.flatCoordinates.length === 0 ? null : (e = void 0 !== e && e, i = void 0 !== i && i, function (t, e, i, n, r, s, o) {
        if (o) {
          return lo(t, e, i[i.length - 1], n, r, s);
        } let a; if (r < t[n - 1]) {
          return s ? (a = t.slice(0, n), a[n - 1] = r, a) : null;
        } if (t[t.length - 1] < r) {
          return s ? (a = t.slice(t.length - n), a[n - 1] = r, a) : null;
        } for (let s = 0, o = i.length; s < o; ++s) {
          const o = i[s]; if (e != o) {
            if (r < t[e + n - 1]) {
              return null;
            } if (r <= t[o - 1]) {
              return lo(t, e, o, n, r, !1);
            } e = o;
          }
        } return null;
      }(this.flatCoordinates, 0, this.ends_, this.stride, t, e, i));
    }getCoordinates() {
      return yr(this.flatCoordinates, 0, this.ends_, this.stride);
    }getEnds() {
      return this.ends_;
    }getLineString(t) {
      return t < 0 || this.ends_.length <= t ? null : new co(this.flatCoordinates.slice(t === 0 ? 0 : this.ends_[t - 1], this.ends_[t]), this.layout);
    }getLineStrings() {
      const t = this.flatCoordinates; const e = this.ends_; const i = this.layout; const n = []; let r = 0; for (let s = 0, o = e.length; s < o; ++s) {
        const o = e[s]; const a = new co(t.slice(r, o), i); n.push(a), r = o;
      } return n;
    }getFlatMidpoints() {
      const t = []; const e = this.flatCoordinates; let i = 0; const n = this.ends_; const r = this.stride; for (let s = 0, a = n.length; s < a; ++s) {
        const a = n[s]; o(t, ao(e, i, a, r, 0.5)), i = a;
      } return t;
    }getSimplifiedGeometryInternal(t) {
      const e = []; const i = []; return e.length = function (t, e, i, n, r, s, o, a) {
        for (let l = 0, h = i.length; l < h; ++l) {
          const h = i[l]; o = dr(t, e, h, n, r, s, o), a.push(o), e = h;
        } return o;
      }(this.flatCoordinates, 0, this.ends_, this.stride, t, e, 0, i), new po(e, 'XY', i);
    }getType() {
      return 'MultiLineString';
    }intersectsExtent(t) {
      return function (t, e, i, n, r) {
        for (let s = 0, o = i.length; s < o; ++s) {
          if (Fr(t, e, i[s], n, r)) {
            return !0;
          } e = i[s];
        } return !1;
      }(this.flatCoordinates, 0, this.ends_, this.stride, t);
    }setCoordinates(t, e) {
      this.setLayout(e, t, 2), this.flatCoordinates || (this.flatCoordinates = []); const i = cr(this.flatCoordinates, 0, t, this.stride, this.ends_); this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1], this.changed();
    }
  } let go = po; class fo extends rr {
    constructor(t, e) {
      super(), e && !Array.isArray(t[0]) ? this.setFlatCoordinates(e, t) : this.setCoordinates(t, e);
    }appendPoint(t) {
      this.flatCoordinates ? o(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.changed();
    }clone() {
      const t = new fo(this.flatCoordinates.slice(), this.layout); return t.applyProperties(this), t;
    }closestPointXY(t, e, i, n) {
      if (n < Bt(this.getExtent(), t, e)) {
        return n;
      } const r = this.flatCoordinates; const s = this.stride; for (let o = 0, a = r.length; o < a; o += s) {
        const a = Se(t, e, r[o], r[o + 1]); if (a < n) {
          n = a; for (let t = 0; t < s; ++t) {
            i[t] = r[o + t];
          }i.length = s;
        }
      } return n;
    }getCoordinates() {
      return mr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
    }getPoint(t) {
      const e = this.flatCoordinates ? this.flatCoordinates.length / this.stride : 0; return t < 0 || e <= t ? null : new Sr(this.flatCoordinates.slice(t * this.stride, (t + 1) * this.stride), this.layout);
    }getPoints() {
      const t = this.flatCoordinates; const e = this.layout; const i = this.stride; const n = []; for (let r = 0, s = t.length; r < s; r += i) {
        const s = new Sr(t.slice(r, r + i), e); n.push(s);
      } return n;
    }getType() {
      return 'MultiPoint';
    }intersectsExtent(t) {
      const e = this.flatCoordinates; const i = this.stride; for (let n = 0, r = e.length; n < r; n += i) {
        if (Kt(t, e[n], e[n + 1])) {
          return !0;
        }
      } return !1;
    }setCoordinates(t, e) {
      this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = ur(this.flatCoordinates, 0, t, this.stride), this.changed();
    }
  } let mo = fo; function yo(t, e, i, n) {
    const r = []; let s = [1 / 0, 1 / 0, -1 / 0, -1 / 0]; for (let o = 0, a = i.length; o < a; ++o) {
      const a = i[o]; s = $t(t, e, a[0], n), r.push((s[0] + s[2]) / 2, (s[1] + s[3]) / 2), e = a[a.length - 1];
    } return r;
  } class _o extends rr {
    constructor(t, e, i) {
      if (super(), this.endss_ = [], this.flatInteriorPointsRevision_ = -1, this.flatInteriorPoints_ = null, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, this.orientedRevision_ = -1, this.orientedFlatCoordinates_ = null, !i && !Array.isArray(t[0])) {
        let n = this.getLayout(); const r = t; const s = []; const a = []; for (let t = 0, e = r.length; t < e; ++t) {
          const e = r[t]; t === 0 && (n = e.getLayout()); const i = s.length; const l = e.getEnds(); for (let t = 0, e = l.length; t < e; ++t) {
            l[t] += i;
          }o(s, e.getFlatCoordinates()), a.push(l);
        }e = n, t = s, i = a;
      } void 0 !== e && i ? (this.setFlatCoordinates(e, t), this.endss_ = i) : this.setCoordinates(t, e);
    }appendPolygon(t) {
      let e; if (this.flatCoordinates) {
        const i = this.flatCoordinates.length; o(this.flatCoordinates, t.getFlatCoordinates()), e = t.getEnds().slice(); for (let t = 0, n = e.length; t < n; ++t) {
          e[t] += i;
        }
      } else {
        this.flatCoordinates = t.getFlatCoordinates().slice(), e = t.getEnds().slice(), this.endss_.push();
      } this.endss_.push(e), this.changed();
    }clone() {
      const t = this.endss_.length; const e = new Array(t); for (let i = 0; i < t; ++i) {
        e[i] = this.endss_[i].slice();
      } const i = new _o(this.flatCoordinates.slice(), this.layout, e); return i.applyProperties(this), i;
    }closestPointXY(t, e, i, n) {
      return n < Bt(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(function (t, e, i, n, r) {
        for (let s = 0, o = i.length; s < o; ++s) {
          const o = i[s]; r = ar(t, e, o, n, r), e = o[o.length - 1];
        } return r;
      }(this.flatCoordinates, 0, this.endss_, this.stride, 0)), this.maxDeltaRevision_ = this.getRevision()), function (t, e, i, n, r, s, o, a, l, h, u) {
        u = u || [NaN, NaN]; for (let c = 0, d = i.length; c < d; ++c) {
          const d = i[c]; h = hr(t, e, d, n, r, s, o, a, l, h, u), e = d[d.length - 1];
        } return h;
      }(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, this.maxDelta_, !0, t, e, i, n));
    }containsXY(t, e) {
      return function (t, e, i, n, r, s) {
        if (i.length === 0) {
          return !1;
        } for (let o = 0, a = i.length; o < a; ++o) {
          const a = i[o]; if (Rr(t, e, a, n, r, s)) {
            return !0;
          } e = a[a.length - 1];
        } return !1;
      }(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, t, e);
    }getArea() {
      return function (t, e, i, n) {
        let r = 0; for (let s = 0, o = i.length; s < o; ++s) {
          const o = i[s]; r += xr(t, e, o, n), e = o[o.length - 1];
        } return r;
      }(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride);
    }getCoordinates(t) {
      let e; return void 0 !== t ? (e = this.getOrientedFlatCoordinates().slice(), jr(e, 0, this.endss_, this.stride, t)) : e = this.flatCoordinates, _r(e, 0, this.endss_, this.stride);
    }getEndss() {
      return this.endss_;
    }getFlatInteriorPoints() {
      if (this.flatInteriorPointsRevision_ != this.getRevision()) {
        const t = yo(this.flatCoordinates, 0, this.endss_, this.stride); this.flatInteriorPoints_ = Mr(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, t), this.flatInteriorPointsRevision_ = this.getRevision();
      } return this.flatInteriorPoints_;
    }getInteriorPoints() {
      return new mo(this.getFlatInteriorPoints().slice(), 'XYM');
    }getOrientedFlatCoordinates() {
      if (this.orientedRevision_ != this.getRevision()) {
        const t = this.flatCoordinates; !function (t, e, i, n, r) {
          for (let s = 0, o = i.length; s < o; ++s) {
            const o = i[s]; if (!Or(t, e, o, n, r)) {
              return !1;
            } o.length && (e = o[o.length - 1]);
          } return !0;
        }(t, 0, this.endss_, this.stride) ? (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = jr(this.orientedFlatCoordinates_, 0, this.endss_, this.stride)) : this.orientedFlatCoordinates_ = t, this.orientedRevision_ = this.getRevision();
      } return this.orientedFlatCoordinates_;
    }getSimplifiedGeometryInternal(t) {
      const e = []; const i = []; return e.length = function (t, e, i, n, r, s, o, a) {
        for (let l = 0, h = i.length; l < h; ++l) {
          const h = i[l]; const u = []; o = fr(t, e, h, n, r, s, o, u), a.push(u), e = h[h.length - 1];
        } return o;
      }(this.flatCoordinates, 0, this.endss_, this.stride, Math.sqrt(t), e, 0, i), new _o(e, 'XY', i);
    }getPolygon(t) {
      if (t < 0 || this.endss_.length <= t) {
        return null;
      } let e; if (t === 0) {
        e = 0;
      } else {
        const i = this.endss_[t - 1]; e = i[i.length - 1];
      } const i = this.endss_[t].slice(); const n = i[i.length - 1]; if (e !== 0) {
        for (let t = 0, n = i.length; t < n; ++t) {
          i[t] -= e;
        }
      } return new Nr(this.flatCoordinates.slice(e, n), this.layout, i);
    }getPolygons() {
      const t = this.layout; const e = this.flatCoordinates; const i = this.endss_; const n = []; let r = 0; for (let s = 0, o = i.length; s < o; ++s) {
        const o = i[s].slice(); const a = o[o.length - 1]; if (r !== 0) {
          for (let t = 0, e = o.length; t < e; ++t) {
            o[t] -= r;
          }
        } const l = new Nr(e.slice(r, a), t, o); n.push(l), r = a;
      } return n;
    }getType() {
      return 'MultiPolygon';
    }intersectsExtent(t) {
      return function (t, e, i, n, r) {
        for (let s = 0, o = i.length; s < o; ++s) {
          const o = i[s]; if (Lr(t, e, o, n, r)) {
            return !0;
          } e = o[o.length - 1];
        } return !1;
      }(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, t);
    }setCoordinates(t, e) {
      this.setLayout(e, t, 3), this.flatCoordinates || (this.flatCoordinates = []); const i = function (t, e, i, n, r) {
        r = r || []; let s = 0; for (let o = 0, a = i.length; o < a; ++o) {
          const a = cr(t, e, i[o], n, r[s]); a.length === 0 && (a[0] = e), r[s++] = a, e = a[a.length - 1];
        } return r.length = s, r;
      }(this.flatCoordinates, 0, t, this.stride, this.endss_); if (i.length === 0) {
        this.flatCoordinates.length = 0;
      } else {
        const t = i[i.length - 1]; this.flatCoordinates.length = t.length === 0 ? 0 : t[t.length - 1];
      } this.changed();
    }
  } let vo = _o; const xo = [1, 0, 0, 1, 0, 0]; class bo {
    constructor(t, e, i, n, r) {
      this.styleFunction, this.extent_, this.id_ = r, this.type_ = t, this.flatCoordinates_ = e, this.flatInteriorPoints_ = null, this.flatMidpoints_ = null, this.ends_ = i, this.properties_ = n;
    }get(t) {
      return this.properties_[t];
    }getExtent() {
      return this.extent_ || (this.extent_ = this.type_ === 'Point' ? Qt(this.flatCoordinates_) : $t(this.flatCoordinates_, 0, this.flatCoordinates_.length, 2)), this.extent_;
    }getFlatInteriorPoint() {
      if (!this.flatInteriorPoints_) {
        const t = he(this.getExtent()); this.flatInteriorPoints_ = Ir(this.flatCoordinates_, 0, this.ends_, 2, t, 0);
      } return this.flatInteriorPoints_;
    }getFlatInteriorPoints() {
      if (!this.flatInteriorPoints_) {
        const t = yo(this.flatCoordinates_, 0, this.ends_, 2); this.flatInteriorPoints_ = Mr(this.flatCoordinates_, 0, this.ends_, 2, t);
      } return this.flatInteriorPoints_;
    }getFlatMidpoint() {
      return this.flatMidpoints_ || (this.flatMidpoints_ = ao(this.flatCoordinates_, 0, this.flatCoordinates_.length, 2, 0.5)), this.flatMidpoints_;
    }getFlatMidpoints() {
      if (!this.flatMidpoints_) {
        this.flatMidpoints_ = []; const t = this.flatCoordinates_; let e = 0; const i = this.ends_; for (let n = 0, r = i.length; n < r; ++n) {
          const r = i[n]; const s = ao(t, e, r, 2, 0.5); o(this.flatMidpoints_, s), e = r;
        }
      } return this.flatMidpoints_;
    }getId() {
      return this.id_;
    }getOrientedFlatCoordinates() {
      return this.flatCoordinates_;
    }getGeometry() {
      return this;
    }getSimplifiedGeometry(t) {
      return this;
    }simplifyTransformed(t, e) {
      return this;
    }getProperties() {
      return this.properties_;
    }getStride() {
      return 2;
    }getStyleFunction() {
      return this.styleFunction;
    }getType() {
      return this.type_;
    }transform(t) {
      const e = (t = En(t)).getExtent(); const i = t.getWorldExtent(); if (e && i) {
        const t = pe(i) / pe(e); Ft(xo, i[0], i[3], t, -t, 0, 0, 0), $n(this.flatCoordinates_, 0, this.flatCoordinates_.length, 2, xo, this.flatCoordinates_);
      }
    }getEnds() {
      return this.ends_;
    }
  }bo.prototype.getEndss = bo.prototype.getEnds, bo.prototype.getFlatCoordinates = bo.prototype.getOrientedFlatCoordinates; let wo = bo; class Co {
    constructor(t) {
      t = t || {}, this.color_ = void 0 !== t.color ? t.color : null, this.lineCap_ = t.lineCap, this.lineDash_ = void 0 !== t.lineDash ? t.lineDash : null, this.lineDashOffset_ = t.lineDashOffset, this.lineJoin_ = t.lineJoin, this.miterLimit_ = t.miterLimit, this.width_ = t.width;
    }clone() {
      const t = this.getColor(); return new Co({color: Array.isArray(t) ? t.slice() : t || void 0, lineCap: this.getLineCap(), lineDash: this.getLineDash() ? this.getLineDash().slice() : void 0, lineDashOffset: this.getLineDashOffset(), lineJoin: this.getLineJoin(), miterLimit: this.getMiterLimit(), width: this.getWidth()});
    }getColor() {
      return this.color_;
    }getLineCap() {
      return this.lineCap_;
    }getLineDash() {
      return this.lineDash_;
    }getLineDashOffset() {
      return this.lineDashOffset_;
    }getLineJoin() {
      return this.lineJoin_;
    }getMiterLimit() {
      return this.miterLimit_;
    }getWidth() {
      return this.width_;
    }setColor(t) {
      this.color_ = t;
    }setLineCap(t) {
      this.lineCap_ = t;
    }setLineDash(t) {
      this.lineDash_ = t;
    }setLineDashOffset(t) {
      this.lineDashOffset_ = t;
    }setLineJoin(t) {
      this.lineJoin_ = t;
    }setMiterLimit(t) {
      this.miterLimit_ = t;
    }setWidth(t) {
      this.width_ = t;
    }
  } let So = Co; class To {
    constructor(t) {
      t = t || {}, this.geometry_ = null, this.geometryFunction_ = Io, void 0 !== t.geometry && this.setGeometry(t.geometry), this.fill_ = void 0 !== t.fill ? t.fill : null, this.image_ = void 0 !== t.image ? t.image : null, this.renderer_ = void 0 !== t.renderer ? t.renderer : null, this.hitDetectionRenderer_ = void 0 !== t.hitDetectionRenderer ? t.hitDetectionRenderer : null, this.stroke_ = void 0 !== t.stroke ? t.stroke : null, this.text_ = void 0 !== t.text ? t.text : null, this.zIndex_ = t.zIndex;
    }clone() {
      let t = this.getGeometry(); return t && typeof t === 'object' && (t = t.clone()), new To({geometry: t, fill: this.getFill() ? this.getFill().clone() : void 0, image: this.getImage() ? this.getImage().clone() : void 0, renderer: this.getRenderer(), stroke: this.getStroke() ? this.getStroke().clone() : void 0, text: this.getText() ? this.getText().clone() : void 0, zIndex: this.getZIndex()});
    }getRenderer() {
      return this.renderer_;
    }setRenderer(t) {
      this.renderer_ = t;
    }setHitDetectionRenderer(t) {
      this.hitDetectionRenderer_ = t;
    }getHitDetectionRenderer() {
      return this.hitDetectionRenderer_;
    }getGeometry() {
      return this.geometry_;
    }getGeometryFunction() {
      return this.geometryFunction_;
    }getFill() {
      return this.fill_;
    }setFill(t) {
      this.fill_ = t;
    }getImage() {
      return this.image_;
    }setImage(t) {
      this.image_ = t;
    }getStroke() {
      return this.stroke_;
    }setStroke(t) {
      this.stroke_ = t;
    }getText() {
      return this.text_;
    }setText(t) {
      this.text_ = t;
    }getZIndex() {
      return this.zIndex_;
    }setGeometry(t) {
      typeof t === 'function' ? this.geometryFunction_ = t : typeof t === 'string' ? this.geometryFunction_ = function (e) {
        return e.get(t);
      } : t ? void 0 !== t && (this.geometryFunction_ = function () {
        return t;
      }) : this.geometryFunction_ = Io, this.geometry_ = t;
    }setZIndex(t) {
      this.zIndex_ = t;
    }
  } let Eo = null; function Ro(t, e) {
    if (!Eo) {
      const t = new Us({color: 'rgba(255,255,255,0.4)'}); const e = new So({color: '#3399CC', width: 1.25}); Eo = [new To({image: new Ks({fill: t, stroke: e, radius: 5}), fill: t, stroke: e})];
    } return Eo;
  } function Io(t) {
    return t.getGeometry();
  } let Mo = To; class ko {
    constructor(t) {
      t = t || {}, this.font_ = t.font, this.rotation_ = t.rotation, this.rotateWithView_ = t.rotateWithView, this.scale_ = t.scale, this.scaleArray_ = Ps(void 0 !== t.scale ? t.scale : 1), this.text_ = t.text, this.textAlign_ = t.textAlign, this.justify_ = t.justify, this.textBaseline_ = t.textBaseline, this.fill_ = void 0 !== t.fill ? t.fill : new Us({color: '#333'}), this.maxAngle_ = void 0 !== t.maxAngle ? t.maxAngle : Math.PI / 4, this.placement_ = void 0 !== t.placement ? t.placement : 'point', this.overflow_ = !!t.overflow, this.stroke_ = void 0 !== t.stroke ? t.stroke : null, this.offsetX_ = void 0 !== t.offsetX ? t.offsetX : 0, this.offsetY_ = void 0 !== t.offsetY ? t.offsetY : 0, this.backgroundFill_ = t.backgroundFill ? t.backgroundFill : null, this.backgroundStroke_ = t.backgroundStroke ? t.backgroundStroke : null, this.padding_ = void 0 === t.padding ? null : t.padding;
    }clone() {
      const t = this.getScale(); return new ko({font: this.getFont(), placement: this.getPlacement(), maxAngle: this.getMaxAngle(), overflow: this.getOverflow(), rotation: this.getRotation(), rotateWithView: this.getRotateWithView(), scale: Array.isArray(t) ? t.slice() : t, text: this.getText(), textAlign: this.getTextAlign(), justify: this.getJustify(), textBaseline: this.getTextBaseline(), fill: this.getFill() ? this.getFill().clone() : void 0, stroke: this.getStroke() ? this.getStroke().clone() : void 0, offsetX: this.getOffsetX(), offsetY: this.getOffsetY(), backgroundFill: this.getBackgroundFill() ? this.getBackgroundFill().clone() : void 0, backgroundStroke: this.getBackgroundStroke() ? this.getBackgroundStroke().clone() : void 0, padding: this.getPadding() || void 0});
    }getOverflow() {
      return this.overflow_;
    }getFont() {
      return this.font_;
    }getMaxAngle() {
      return this.maxAngle_;
    }getPlacement() {
      return this.placement_;
    }getOffsetX() {
      return this.offsetX_;
    }getOffsetY() {
      return this.offsetY_;
    }getFill() {
      return this.fill_;
    }getRotateWithView() {
      return this.rotateWithView_;
    }getRotation() {
      return this.rotation_;
    }getScale() {
      return this.scale_;
    }getScaleArray() {
      return this.scaleArray_;
    }getStroke() {
      return this.stroke_;
    }getText() {
      return this.text_;
    }getTextAlign() {
      return this.textAlign_;
    }getJustify() {
      return this.justify_;
    }getTextBaseline() {
      return this.textBaseline_;
    }getBackgroundFill() {
      return this.backgroundFill_;
    }getBackgroundStroke() {
      return this.backgroundStroke_;
    }getPadding() {
      return this.padding_;
    }setOverflow(t) {
      this.overflow_ = t;
    }setFont(t) {
      this.font_ = t;
    }setMaxAngle(t) {
      this.maxAngle_ = t;
    }setOffsetX(t) {
      this.offsetX_ = t;
    }setOffsetY(t) {
      this.offsetY_ = t;
    }setPlacement(t) {
      this.placement_ = t;
    }setRotateWithView(t) {
      this.rotateWithView_ = t;
    }setFill(t) {
      this.fill_ = t;
    }setRotation(t) {
      this.rotation_ = t;
    }setScale(t) {
      this.scale_ = t, this.scaleArray_ = Ps(void 0 !== t ? t : 1);
    }setStroke(t) {
      this.stroke_ = t;
    }setText(t) {
      this.text_ = t;
    }setTextAlign(t) {
      this.textAlign_ = t;
    }setJustify(t) {
      this.justify_ = t;
    }setTextBaseline(t) {
      this.textBaseline_ = t;
    }setBackgroundFill(t) {
      this.backgroundFill_ = t;
    }setBackgroundStroke(t) {
      this.backgroundStroke_ = t;
    }setPadding(t) {
      this.padding_ = t;
    }
  } let Fo = ko; function Po(t, e, i, n) {
    return void 0 !== n ? (n[0] = t, n[1] = e, n[2] = i, n) : [t, e, i];
  } function Lo(t, e, i) {
    return t + '/' + e + '/' + i;
  } function Ao(t) {
    return Lo(t[0], t[1], t[2]);
  } function zo(t) {
    return t.split('/').map(Number);
  } function Oo(t, e) {
    const i = /\{z\}/g; const n = /\{x\}/g; const r = /\{y\}/g; const s = /\{-y\}/g; return function (o, a, l) {
      if (o) {
        return t.replace(i, o[0].toString()).replace(n, o[1].toString()).replace(r, o[2].toString()).replace(s, (function () {
          const t = o[0]; const i = e.getFullTileRange(t); St(i, 55); return (i.getHeight() - o[2] - 1).toString();
        }));
      }
    };
  } function Do(t, e) {
    const i = t.length; const n = new Array(i); for (let r = 0; r < i; ++r) {
      n[r] = Oo(t[r], e);
    } return function (t) {
      if (t.length === 1) {
        return t[0];
      } return function (e, i, n) {
        if (!e) {
          return;
        } const r = function (t) {
          return (t[1] << t[0]) + t[2];
        }(e); const s = Ee(r, t.length); return t[s](e, i, n);
      };
    }(n);
  } function jo(t) {
    const e = []; let i = /\{([a-z])-([a-z])\}/.exec(t); if (i) {
      const n = i[1].charCodeAt(0); const r = i[2].charCodeAt(0); let s; for (s = n; s <= r; ++s) {
        e.push(t.replace(i[0], String.fromCharCode(s)));
      } return e;
    } if (i = /\{(\d+)-(\d+)\}/.exec(t), i) {
      const n = parseInt(i[2], 10); for (let r = parseInt(i[1], 10); r <= n; r++) {
        e.push(t.replace(i[0], r.toString()));
      } return e;
    } return e.push(t), e;
  } class Go {
    constructor() {
      this.dataProjection = void 0, this.defaultFeatureProjection = void 0, this.supportedMediaTypes = null;
    }getReadOptions(t, e) {
      if (e) {
        let i = e.dataProjection ? En(e.dataProjection) : this.readProjection(t); e.extent && i && i.getUnits() === 'tile-pixels' && (i = En(i), i.setWorldExtent(e.extent)), e = {dataProjection: i, featureProjection: e.featureProjection};
      } return this.adaptOptions(e);
    }adaptOptions(t) {
      return Object.assign({dataProjection: this.dataProjection, featureProjection: this.defaultFeatureProjection}, t);
    }getType() {
      return M();
    }readFeature(t, e) {
      return M();
    }readFeatures(t, e) {
      return M();
    }readGeometry(t, e) {
      return M();
    }readProjection(t) {
      return M();
    }writeFeature(t, e) {
      return M();
    }writeFeatures(t, e) {
      return M();
    }writeGeometry(t, e) {
      return M();
    }
  } function No(t, e, i) {
    const n = i ? En(i.featureProjection) : null; const r = i ? En(i.dataProjection) : null; let s; if (s = n && r && !Fn(n, r) ? (e ? t.clone() : t).transform(e ? n : r, e ? r : n) : t, e && i && void 0 !== i.decimals) {
      const e = Math.pow(10, i.decimals); const n = function (t) {
        for (let i = 0, n = t.length; i < n; ++i) {
          t[i] = Math.round(t[i] * e) / e;
        } return t;
      }; s === t && (s = t.clone()), s.applyTransform(n);
    } return s;
  } function Wo(t) {
    if (typeof t === 'string') {
      const e = JSON.parse(t); return e || null;
    } return t !== null ? t : null;
  } let Xo = class extends Go {
    constructor() {
      super();
    }getType() {
      return 'json';
    }readFeature(t, e) {
      return this.readFeatureFromObject(Wo(t), this.getReadOptions(t, e));
    }readFeatures(t, e) {
      return this.readFeaturesFromObject(Wo(t), this.getReadOptions(t, e));
    }readFeatureFromObject(t, e) {
      return M();
    }readFeaturesFromObject(t, e) {
      return M();
    }readGeometry(t, e) {
      return this.readGeometryFromObject(Wo(t), this.getReadOptions(t, e));
    }readGeometryFromObject(t, e) {
      return M();
    }readProjection(t) {
      return this.readProjectionFromObject(Wo(t));
    }readProjectionFromObject(t) {
      return M();
    }writeFeature(t, e) {
      return JSON.stringify(this.writeFeatureObject(t, e));
    }writeFeatureObject(t, e) {
      return M();
    }writeFeatures(t, e) {
      return JSON.stringify(this.writeFeaturesObject(t, e));
    }writeFeaturesObject(t, e) {
      return M();
    }writeGeometry(t, e) {
      return JSON.stringify(this.writeGeometryObject(t, e));
    }writeGeometryObject(t, e) {
      return M();
    }
  }; function qo(t, e) {
    if (!t) {
      return null;
    } let i; switch (t.type) {
      case 'Point':i = function (t) {
        return new Sr(t.coordinates);
      }(t); break; case 'LineString':i = function (t) {
        return new co(t.coordinates);
      }(t); break; case 'Polygon':i = function (t) {
        return new Nr(t.coordinates);
      }(t); break; case 'MultiPoint':i = function (t) {
        return new mo(t.coordinates);
      }(t); break; case 'MultiLineString':i = function (t) {
        return new go(t.coordinates);
      }(t); break; case 'MultiPolygon':i = function (t) {
        return new vo(t.coordinates);
      }(t); break; case 'GeometryCollection':i = function (t, e) {
        const i = t.geometries.map((function (t) {
          return qo(t, e);
        })); return new oo(i);
      }(t); break; default:throw new Error('Unsupported GeoJSON type: ' + t.type);
    } return No(i, !1, e);
  } function Bo(t, e) {
    const i = (t = No(t, !0, e)).getType(); let n; switch (i) {
      case 'Point':n = function (t, e) {
        return {type: 'Point', coordinates: t.getCoordinates()};
      }(t); break; case 'LineString':n = function (t, e) {
        return {type: 'LineString', coordinates: t.getCoordinates()};
      }(t); break; case 'Polygon':n = function (t, e) {
        let i; e && (i = e.rightHanded); return {type: 'Polygon', coordinates: t.getCoordinates(i)};
      }(t, e); break; case 'MultiPoint':n = function (t, e) {
        return {type: 'MultiPoint', coordinates: t.getCoordinates()};
      }(t); break; case 'MultiLineString':n = function (t, e) {
        return {type: 'MultiLineString', coordinates: t.getCoordinates()};
      }(t); break; case 'MultiPolygon':n = function (t, e) {
        let i; e && (i = e.rightHanded); return {type: 'MultiPolygon', coordinates: t.getCoordinates(i)};
      }(t, e); break; case 'GeometryCollection':n = function (t, e) {
        delete (e = Object.assign({}, e)).featureProjection; return {type: 'GeometryCollection', geometries: t.getGeometriesArray().map((function (t) {
          return Bo(t, e);
        }))};
      }(t, e); break; case 'Circle':n = {type: 'GeometryCollection', geometries: []}; break; default:throw new Error('Unsupported geometry type: ' + i);
    } return n;
  } let Vo = class extends Xo {
    constructor(t) {
      t = t || {}, super(), this.dataProjection = En(t.dataProjection ? t.dataProjection : 'EPSG:4326'), t.featureProjection && (this.defaultFeatureProjection = En(t.featureProjection)), this.geometryName_ = t.geometryName, this.extractGeometryName_ = t.extractGeometryName, this.supportedMediaTypes = ['application/geo+json', 'application/vnd.geo+json'];
    }readFeatureFromObject(t, e) {
      let i = null; i = t.type === 'Feature' ? t : {type: 'Feature', geometry: t, properties: null}; const n = qo(i.geometry, e); const r = new no(); return this.geometryName_ ? r.setGeometryName(this.geometryName_) : this.extractGeometryName_ && 'geometry_name' in i !== void 0 && r.setGeometryName(i.geometry_name), r.setGeometry(n), 'id' in i && r.setId(i.id), i.properties && r.setProperties(i.properties, !0), r;
    }readFeaturesFromObject(t, e) {
      let i = null; if (t.type === 'FeatureCollection') {
        i = []; const n = t.features; for (let t = 0, r = n.length; t < r; ++t) {
          i.push(this.readFeatureFromObject(n[t], e));
        }
      } else {
        i = [this.readFeatureFromObject(t, e)];
      } return i;
    }readGeometryFromObject(t, e) {
      return qo(t, e);
    }readProjectionFromObject(t) {
      const e = t.crs; let i; return e ? e.type == 'name' ? i = En(e.properties.name) : e.type === 'EPSG' ? i = En('EPSG:' + e.properties.code) : St(!1, 36) : i = this.dataProjection, i;
    }writeFeatureObject(t, e) {
      e = this.adaptOptions(e); const i = {type: 'Feature', geometry: null, properties: null}; const n = t.getId(); if (void 0 !== n && (i.id = n), !t.hasProperties()) {
        return i;
      } const r = t.getProperties(); const s = t.getGeometry(); return s && (i.geometry = Bo(s, e), delete r[t.getGeometryName()]), d(r) || (i.properties = r), i;
    }writeFeaturesObject(t, e) {
      e = this.adaptOptions(e); const i = []; for (let n = 0, r = t.length; n < r; ++n) {
        i.push(this.writeFeatureObject(t[n], e));
      } return {type: 'FeatureCollection', features: i};
    }writeGeometryObject(t, e) {
      return Bo(t, this.adaptOptions(e));
    }
  }; let Yo = class extends ni {
    constructor(t) {
      super(t = t || {});
    }
  }; let Ko = class extends I {
    constructor(t) {
      super(), this.ready = !0, this.boundHandleImageChange_ = this.handleImageChange_.bind(this), this.layer_ = t, this.declutterExecutorGroup = null;
    }getFeatures(t) {
      return M();
    }getData(t) {
      return null;
    }prepareFrame(t) {
      return M();
    }renderFrame(t, e) {
      return M();
    }loadedTileCallback(t, e, i) {
      t[e] || (t[e] = {}), t[e][i.tileCoord.toString()] = i;
    }createLoadedTileFinder(t, e, i) {
      return (n, r)=>{
        const s = this.loadedTileCallback.bind(this, i, n); return t.forEachLoadedTile(e, n, r, s);
      };
    }forEachFeatureAtCoordinate(t, e, i, n, r) {}getLayer() {
      return this.layer_;
    }handleFontsChanged() {}handleImageChange_(t) {
      t.target.getState() === js && this.renderIfReadyAndVisible();
    }loadImage(t) {
      let e = t.getState(); return e != js && e != Gs && t.addEventListener(g, this.boundHandleImageChange_), e == Os && (t.load(), e = t.getState()), e == js;
    }renderIfReadyAndVisible() {
      const t = this.getLayer(); t && t.getVisible() && t.getSourceState() === 'ready' && t.changed();
    }disposeInternal() {
      delete this.layer_, super.disposeInternal();
    }
  }; const Zo = []; let Uo = null; let Ho = class extends Ko {
    constructor(t) {
      super(t), this.container = null, this.renderedResolution, this.tempTransform = [1, 0, 0, 1, 0, 0], this.pixelTransform = [1, 0, 0, 1, 0, 0], this.inversePixelTransform = [1, 0, 0, 1, 0, 0], this.context = null, this.containerReused = !1, this.pixelContext_ = null, this.frameState = null;
    }getImageData(t, e, i) {
      let n; Uo || (Uo = K(1, 1, void 0, {willReadFrequently: !0})), Uo.clearRect(0, 0, 1, 1); try {
        Uo.drawImage(t, e, i, 1, 1, 0, 0, 1, 1), n = Uo.getImageData(0, 0, 1, 1).data;
      } catch (t) {
        return Uo = null, null;
      } return n;
    }getBackground(t) {
      let e = this.getLayer().getBackground(); return typeof e === 'function' && (e = e(t.viewState.resolution)), e || void 0;
    }useContainer(t, e, i) {
      const n = this.getLayer().getClassName(); let r; let s; if (t && t.className === n && (!i || t && t.style.backgroundColor && a(ze(t.style.backgroundColor), ze(i)))) {
        const e = t.firstElementChild; e instanceof HTMLCanvasElement && (s = e.getContext('2d'));
      } if (s && s.canvas.style.transform === e ? (this.container = t, this.context = s, this.containerReused = !0) : this.containerReused && (this.container = null, this.context = null, this.containerReused = !1), !this.container) {
        r = document.createElement('div'), r.className = n; let t = r.style; t.position = 'absolute', t.width = '100%', t.height = '100%', s = K(); const e = s.canvas; r.appendChild(e), t = e.style, t.position = 'absolute', t.left = '0', t.transformOrigin = 'top left', this.container = r, this.context = s;
      } this.containerReused || !i || this.container.style.backgroundColor || (this.container.style.backgroundColor = i);
    }clipUnrotated(t, e, i) {
      const n = fe(i); const r = me(i); const s = le(i); const o = ae(i); Mt(e.coordinateToPixelTransform, n), Mt(e.coordinateToPixelTransform, r), Mt(e.coordinateToPixelTransform, s), Mt(e.coordinateToPixelTransform, o); const a = this.inversePixelTransform; Mt(a, n), Mt(a, r), Mt(a, s), Mt(a, o), t.save(), t.beginPath(), t.moveTo(Math.round(n[0]), Math.round(n[1])), t.lineTo(Math.round(r[0]), Math.round(r[1])), t.lineTo(Math.round(s[0]), Math.round(s[1])), t.lineTo(Math.round(o[0]), Math.round(o[1])), t.clip();
    }dispatchRenderEvent_(t, e, i) {
      const n = this.getLayer(); if (n.hasListener(t)) {
        const r = new hi(t, this.inversePixelTransform, i, e); n.dispatchEvent(r);
      }
    }preRender(t, e) {
      this.frameState = e, this.dispatchRenderEvent_(Je, t, e);
    }postRender(t, e) {
      this.dispatchRenderEvent_(Qe, t, e);
    }getRenderTransform(t, e, i, n, r, s, o) {
      const a = r / 2; const l = s / 2; const h = n / e; const u = -h; const c = -t[0] + o; const d = -t[1]; return Ft(this.tempTransform, a, l, h, u, -i, c, d);
    }disposeInternal() {
      delete this.frameState, super.disposeInternal();
    }
  }; let Jo = class extends Ho {
    constructor(t) {
      super(t), this.image_ = null;
    }getImage() {
      return this.image_ ? this.image_.getImage() : null;
    }prepareFrame(t) {
      const e = t.layerStatesArray[t.layerIndex]; const i = t.pixelRatio; const n = t.viewState; const r = n.resolution; const s = this.getLayer().getSource(); const o = t.viewHints; let a = t.extent; if (void 0 !== e.extent && (a = ge(a, jn(e.extent, n.projection))), !o[Zi] && !o[Ui] && !ve(a)) {
        if (s) {
          const t = n.projection; const e = s.getImage(a, r, i, t); e && (this.loadImage(e) ? this.image_ = e : e.getState() === Ns && (this.image_ = null));
        } else {
          this.image_ = null;
        }
      } return !!this.image_;
    }getData(t) {
      const e = this.frameState; if (!e) {
        return null;
      } const i = this.getLayer(); const n = Mt(e.pixelToCoordinateTransform, t.slice()); const r = i.getExtent(); if (r && !Vt(r, n)) {
        return null;
      } const s = this.image_.getExtent(); const o = this.image_.getImage(); const a = ye(s); const l = Math.floor(o.width * ((n[0] - s[0]) / a)); if (l < 0 || l >= o.width) {
        return null;
      } const h = pe(s); const u = Math.floor(o.height * ((s[3] - n[1]) / h)); return u < 0 || u >= o.height ? null : this.getImageData(o, l, u);
    }renderFrame(t, e) {
      const i = this.image_; const n = i.getExtent(); const r = i.getResolution(); const s = i.getPixelRatio(); const o = t.layerStatesArray[t.layerIndex]; const a = t.pixelRatio; const l = t.viewState; const h = l.center; const u = a * r / (l.resolution * s); const c = t.extent; const d = l.resolution; const p = l.rotation; const g = Math.round(ye(c) / d * a); const f = Math.round(pe(c) / d * a); Ft(this.pixelTransform, t.size[0] / 2, t.size[1] / 2, 1 / a, 1 / a, p, -g / 2, -f / 2), Pt(this.inversePixelTransform, this.pixelTransform); const m = At(this.pixelTransform); this.useContainer(e, m, this.getBackground(t)); const y = this.context; const _ = y.canvas; _.width != g || _.height != f ? (_.width = g, _.height = f) : this.containerReused || y.clearRect(0, 0, g, f); let v = !1; let x = !0; if (o.extent) {
        const e = jn(o.extent, l.projection); x = _e(e, t.extent), v = x && !Yt(e, t.extent), v && this.clipUnrotated(y, t, e);
      } const b = i.getImage(); const w = Ft(this.tempTransform, g / 2, f / 2, u, u, 0, s * (n[0] - h[0]) / r, s * (h[1] - n[3]) / r); this.renderedResolution = r * a / s; const C = b.width * w[0]; const S = b.height * w[3]; if (this.getLayer().getSource().getInterpolate() || (y.imageSmoothingEnabled = !1), this.preRender(y, t), x && C >= 0.5 && S >= 0.5) {
        const t = w[4]; const e = w[5]; const i = o.opacity; let n; i !== 1 && (n = y.globalAlpha, y.globalAlpha = i), y.drawImage(b, 0, 0, +b.width, +b.height, t, e, C, S), i !== 1 && (y.globalAlpha = n);
      } return this.postRender(y, t), v && y.restore(), y.imageSmoothingEnabled = !0, m !== _.style.transform && (_.style.transform = m), this.container;
    }
  }; let Qo = class extends Yo {
    constructor(t) {
      super(t);
    }createRenderer() {
      return new Jo(this);
    }getData(t) {
      return super.getData(t);
    }
  }; let $o = {
    /* ! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    read(t, e, i, n, r) {
      let s; let o; let a = 8 * r - n - 1; let l = (1 << a) - 1; let h = l >> 1; let u = -7; let c = i ? r - 1 : 0; let d = i ? -1 : 1; let p = t[e + c]; for (c += d, s = p & (1 << -u) - 1, p >>= -u, u += a; u > 0; s = 256 * s + t[e + c], c += d, u -= 8) { } for (o = s & (1 << -u) - 1, s >>= -u, u += n; u > 0; o = 256 * o + t[e + c], c += d, u -= 8) { } if (s === 0) {
        s = 1 - h;
      } else {
        if (s === l) {
          return o ? NaN : 1 / 0 * (p ? -1 : 1);
        } o += Math.pow(2, n), s -= h;
      } return (p ? -1 : 1) * o * Math.pow(2, s - n);
    }, write(t, e, i, n, r, s) {
      let o; let a; let l; let h = 8 * s - r - 1; let u = (1 << h) - 1; let c = u >> 1; let d = r === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0; let p = n ? 0 : s - 1; let g = n ? 1 : -1; let f = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0; for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0, o = u) : (o = Math.floor(Math.log(e) / Math.LN2), e * (l = Math.pow(2, -o)) < 1 && (o--, l *= 2), (e += o + c >= 1 ? d / l : d * Math.pow(2, 1 - c)) * l >= 2 && (o++, l /= 2), o + c >= u ? (a = 0, o = u) : o + c >= 1 ? (a = (e * l - 1) * Math.pow(2, r), o += c) : (a = e * Math.pow(2, c - 1) * Math.pow(2, r), o = 0)); r >= 8; t[i + p] = 255 & a, p += g, a /= 256, r -= 8) { } for (o = o << r | a, h += r; h > 0; t[i + p] = 255 & o, p += g, o /= 256, h -= 8) { }t[i + p - g] |= 128 * f;
    }}; let ta = ia; let ea = $o; function ia(t) {
    this.buf = ArrayBuffer.isView && ArrayBuffer.isView(t) ? t : new Uint8Array(t || 0), this.pos = 0, this.type = 0, this.length = this.buf.length;
  }ia.Varint = 0, ia.Fixed64 = 1, ia.Bytes = 2, ia.Fixed32 = 5; let na = 4294967296; let ra = 1 / na; let sa = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf8'); function oa(t) {
    return t.type === ia.Bytes ? t.readVarint() + t.pos : t.pos + 1;
  } function aa(t, e, i) {
    return i ? 4294967296 * e + (t >>> 0) : 4294967296 * (e >>> 0) + (t >>> 0);
  } function la(t, e, i) {
    let n = e <= 16383 ? 1 : e <= 2097151 ? 2 : e <= 268435455 ? 3 : Math.floor(Math.log(e) / (7 * Math.LN2)); i.realloc(n); for (let r = i.pos - 1; r >= t; r--) {
      i.buf[r + n] = i.buf[r];
    }
  } function ha(t, e) {
    for (let i = 0; i < t.length; i++) {
      e.writeVarint(t[i]);
    }
  } function ua(t, e) {
    for (let i = 0; i < t.length; i++) {
      e.writeSVarint(t[i]);
    }
  } function ca(t, e) {
    for (let i = 0; i < t.length; i++) {
      e.writeFloat(t[i]);
    }
  } function da(t, e) {
    for (let i = 0; i < t.length; i++) {
      e.writeDouble(t[i]);
    }
  } function pa(t, e) {
    for (let i = 0; i < t.length; i++) {
      e.writeBoolean(t[i]);
    }
  } function ga(t, e) {
    for (let i = 0; i < t.length; i++) {
      e.writeFixed32(t[i]);
    }
  } function fa(t, e) {
    for (let i = 0; i < t.length; i++) {
      e.writeSFixed32(t[i]);
    }
  } function ma(t, e) {
    for (let i = 0; i < t.length; i++) {
      e.writeFixed64(t[i]);
    }
  } function ya(t, e) {
    for (let i = 0; i < t.length; i++) {
      e.writeSFixed64(t[i]);
    }
  } function _a(t, e) {
    return (t[e] | t[e + 1] << 8 | t[e + 2] << 16) + 16777216 * t[e + 3];
  } function va(t, e, i) {
    t[i] = e, t[i + 1] = e >>> 8, t[i + 2] = e >>> 16, t[i + 3] = e >>> 24;
  } function xa(t, e) {
    return (t[e] | t[e + 1] << 8 | t[e + 2] << 16) + (t[e + 3] << 24);
  }ia.prototype = {destroy() {
    this.buf = null;
  }, readFields(t, e, i) {
    for (i = i || this.length; this.pos < i;) {
      let n = this.readVarint(); let r = n >> 3; let s = this.pos; this.type = 7 & n, t(r, e, this), this.pos === s && this.skip(n);
    } return e;
  }, readMessage(t, e) {
    return this.readFields(t, e, this.readVarint() + this.pos);
  }, readFixed32() {
    let t = _a(this.buf, this.pos); return this.pos += 4, t;
  }, readSFixed32() {
    let t = xa(this.buf, this.pos); return this.pos += 4, t;
  }, readFixed64() {
    let t = _a(this.buf, this.pos) + _a(this.buf, this.pos + 4) * na; return this.pos += 8, t;
  }, readSFixed64() {
    let t = _a(this.buf, this.pos) + xa(this.buf, this.pos + 4) * na; return this.pos += 8, t;
  }, readFloat() {
    let t = ea.read(this.buf, this.pos, !0, 23, 4); return this.pos += 4, t;
  }, readDouble() {
    let t = ea.read(this.buf, this.pos, !0, 52, 8); return this.pos += 8, t;
  }, readVarint(t) {
    let e; let i; let n = this.buf; return e = 127 & (i = n[this.pos++]), i < 128 ? e : (e |= (127 & (i = n[this.pos++])) << 7, i < 128 ? e : (e |= (127 & (i = n[this.pos++])) << 14, i < 128 ? e : (e |= (127 & (i = n[this.pos++])) << 21, i < 128 ? e : function (t, e, i) {
      let n; let r; let s = i.buf; if (r = s[i.pos++], n = (112 & r) >> 4, r < 128) {
        return aa(t, n, e);
      } if (r = s[i.pos++], n |= (127 & r) << 3, r < 128) {
        return aa(t, n, e);
      } if (r = s[i.pos++], n |= (127 & r) << 10, r < 128) {
        return aa(t, n, e);
      } if (r = s[i.pos++], n |= (127 & r) << 17, r < 128) {
        return aa(t, n, e);
      } if (r = s[i.pos++], n |= (127 & r) << 24, r < 128) {
        return aa(t, n, e);
      } if (r = s[i.pos++], n |= (1 & r) << 31, r < 128) {
        return aa(t, n, e);
      } throw new Error('Expected varint not more than 10 bytes');
    }(e |= (15 & (i = n[this.pos])) << 28, t, this))));
  }, readVarint64() {
    return this.readVarint(!0);
  }, readSVarint() {
    let t = this.readVarint(); return t % 2 == 1 ? (t + 1) / -2 : t / 2;
  }, readBoolean() {
    return Boolean(this.readVarint());
  }, readString() {
    let t = this.readVarint() + this.pos; let e = this.pos; return this.pos = t, t - e >= 12 && sa ? function (t, e, i) {
      return sa.decode(t.subarray(e, i));
    }(this.buf, e, t) : function (t, e, i) {
      let n = ''; let r = e; for (;r < i;) {
        var s; var o; var a; let l = t[r]; let h = null; let u = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1; if (r + u > i) {
          break;
        } u === 1 ? l < 128 && (h = l) : u === 2 ? (192 & (s = t[r + 1])) == 128 && (h = (31 & l) << 6 | 63 & s) <= 127 && (h = null) : u === 3 ? (s = t[r + 1], o = t[r + 2], (192 & s) == 128 && (192 & o) == 128 && ((h = (15 & l) << 12 | (63 & s) << 6 | 63 & o) <= 2047 || h >= 55296 && h <= 57343) && (h = null)) : u === 4 && (s = t[r + 1], o = t[r + 2], a = t[r + 3], (192 & s) == 128 && (192 & o) == 128 && (192 & a) == 128 && ((h = (15 & l) << 18 | (63 & s) << 12 | (63 & o) << 6 | 63 & a) <= 65535 || h >= 1114112) && (h = null)), h === null ? (h = 65533, u = 1) : h > 65535 && (h -= 65536, n += String.fromCharCode(h >>> 10 & 1023 | 55296), h = 56320 | 1023 & h), n += String.fromCharCode(h), r += u;
      } return n;
    }(this.buf, e, t);
  }, readBytes() {
    let t = this.readVarint() + this.pos; let e = this.buf.subarray(this.pos, t); return this.pos = t, e;
  }, readPackedVarint(t, e) {
    if (this.type !== ia.Bytes) {
      return t.push(this.readVarint(e));
    } let i = oa(this); for (t = t || []; this.pos < i;) {
      t.push(this.readVarint(e));
    } return t;
  }, readPackedSVarint(t) {
    if (this.type !== ia.Bytes) {
      return t.push(this.readSVarint());
    } let e = oa(this); for (t = t || []; this.pos < e;) {
      t.push(this.readSVarint());
    } return t;
  }, readPackedBoolean(t) {
    if (this.type !== ia.Bytes) {
      return t.push(this.readBoolean());
    } let e = oa(this); for (t = t || []; this.pos < e;) {
      t.push(this.readBoolean());
    } return t;
  }, readPackedFloat(t) {
    if (this.type !== ia.Bytes) {
      return t.push(this.readFloat());
    } let e = oa(this); for (t = t || []; this.pos < e;) {
      t.push(this.readFloat());
    } return t;
  }, readPackedDouble(t) {
    if (this.type !== ia.Bytes) {
      return t.push(this.readDouble());
    } let e = oa(this); for (t = t || []; this.pos < e;) {
      t.push(this.readDouble());
    } return t;
  }, readPackedFixed32(t) {
    if (this.type !== ia.Bytes) {
      return t.push(this.readFixed32());
    } let e = oa(this); for (t = t || []; this.pos < e;) {
      t.push(this.readFixed32());
    } return t;
  }, readPackedSFixed32(t) {
    if (this.type !== ia.Bytes) {
      return t.push(this.readSFixed32());
    } let e = oa(this); for (t = t || []; this.pos < e;) {
      t.push(this.readSFixed32());
    } return t;
  }, readPackedFixed64(t) {
    if (this.type !== ia.Bytes) {
      return t.push(this.readFixed64());
    } let e = oa(this); for (t = t || []; this.pos < e;) {
      t.push(this.readFixed64());
    } return t;
  }, readPackedSFixed64(t) {
    if (this.type !== ia.Bytes) {
      return t.push(this.readSFixed64());
    } let e = oa(this); for (t = t || []; this.pos < e;) {
      t.push(this.readSFixed64());
    } return t;
  }, skip(t) {
    let e = 7 & t; if (e === ia.Varint) {
      for (;this.buf[this.pos++] > 127;) { }
    } else if (e === ia.Bytes) {
      this.pos = this.readVarint() + this.pos;
    } else if (e === ia.Fixed32) {
      this.pos += 4;
    } else {
      if (e !== ia.Fixed64) {
        throw new Error('Unimplemented type: ' + e);
      } this.pos += 8;
    }
  }, writeTag(t, e) {
    this.writeVarint(t << 3 | e);
  }, realloc(t) {
    for (var e = this.length || 16; e < this.pos + t;) {
      e *= 2;
    } if (e !== this.length) {
      let i = new Uint8Array(e); i.set(this.buf), this.buf = i, this.length = e;
    }
  }, finish() {
    return this.length = this.pos, this.pos = 0, this.buf.subarray(0, this.length);
  }, writeFixed32(t) {
    this.realloc(4), va(this.buf, t, this.pos), this.pos += 4;
  }, writeSFixed32(t) {
    this.realloc(4), va(this.buf, t, this.pos), this.pos += 4;
  }, writeFixed64(t) {
    this.realloc(8), va(this.buf, -1 & t, this.pos), va(this.buf, Math.floor(t * ra), this.pos + 4), this.pos += 8;
  }, writeSFixed64(t) {
    this.realloc(8), va(this.buf, -1 & t, this.pos), va(this.buf, Math.floor(t * ra), this.pos + 4), this.pos += 8;
  }, writeVarint(t) {
    (t = +t || 0) > 268435455 || t < 0 ? function (t, e) {
      let i; let n; t >= 0 ? (i = t % 4294967296 | 0, n = t / 4294967296 | 0) : (n = ~(-t / 4294967296), 4294967295 ^ (i = ~(-t % 4294967296)) ? i = i + 1 | 0 : (i = 0, n = n + 1 | 0)); if (t >= 0x10000000000000000 || t < -0x10000000000000000) {
        throw new Error('Given varint doesn\'t fit into 10 bytes');
      } e.realloc(10), function (t, e, i) {
        i.buf[i.pos++] = 127 & t | 128, t >>>= 7, i.buf[i.pos++] = 127 & t | 128, t >>>= 7, i.buf[i.pos++] = 127 & t | 128, t >>>= 7, i.buf[i.pos++] = 127 & t | 128, t >>>= 7, i.buf[i.pos] = 127 & t;
      }(i, 0, e), function (t, e) {
        let i = (7 & t) << 4; if (e.buf[e.pos++] |= i | ((t >>>= 3) ? 128 : 0), !t) {
          return;
        } if (e.buf[e.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), !t) {
          return;
        } if (e.buf[e.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), !t) {
          return;
        } if (e.buf[e.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), !t) {
          return;
        } if (e.buf[e.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), !t) {
          return;
        } e.buf[e.pos++] = 127 & t;
      }(n, e);
    }(t, this) : (this.realloc(4), this.buf[this.pos++] = 127 & t | (t > 127 ? 128 : 0), t <= 127 || (this.buf[this.pos++] = 127 & (t >>>= 7) | (t > 127 ? 128 : 0), t <= 127 || (this.buf[this.pos++] = 127 & (t >>>= 7) | (t > 127 ? 128 : 0), t <= 127 || (this.buf[this.pos++] = t >>> 7 & 127))));
  }, writeSVarint(t) {
    this.writeVarint(t < 0 ? 2 * -t - 1 : 2 * t);
  }, writeBoolean(t) {
    this.writeVarint(Boolean(t));
  }, writeString(t) {
    t = String(t), this.realloc(4 * t.length), this.pos++; let e = this.pos; this.pos = function (t, e, i) {
      for (var n, r, s = 0; s < e.length; s++) {
        if ((n = e.charCodeAt(s)) > 55295 && n < 57344) {
          if (!r) {
            n > 56319 || s + 1 === e.length ? (t[i++] = 239, t[i++] = 191, t[i++] = 189) : r = n; continue;
          } if (n < 56320) {
            t[i++] = 239, t[i++] = 191, t[i++] = 189, r = n; continue;
          }n = r - 55296 << 10 | n - 56320 | 65536, r = null;
        } else {
          r && (t[i++] = 239, t[i++] = 191, t[i++] = 189, r = null);
        }n < 128 ? t[i++] = n : (n < 2048 ? t[i++] = n >> 6 | 192 : (n < 65536 ? t[i++] = n >> 12 | 224 : (t[i++] = n >> 18 | 240, t[i++] = n >> 12 & 63 | 128), t[i++] = n >> 6 & 63 | 128), t[i++] = 63 & n | 128);
      } return i;
    }(this.buf, t, this.pos); let i = this.pos - e; i >= 128 && la(e, i, this), this.pos = e - 1, this.writeVarint(i), this.pos += i;
  }, writeFloat(t) {
    this.realloc(4), ea.write(this.buf, t, this.pos, !0, 23, 4), this.pos += 4;
  }, writeDouble(t) {
    this.realloc(8), ea.write(this.buf, t, this.pos, !0, 52, 8), this.pos += 8;
  }, writeBytes(t) {
    let e = t.length; this.writeVarint(e), this.realloc(e); for (let i = 0; i < e; i++) {
      this.buf[this.pos++] = t[i];
    }
  }, writeRawMessage(t, e) {
    this.pos++; let i = this.pos; t(e, this); let n = this.pos - i; n >= 128 && la(i, n, this), this.pos = i - 1, this.writeVarint(n), this.pos += n;
  }, writeMessage(t, e, i) {
    this.writeTag(t, ia.Bytes), this.writeRawMessage(e, i);
  }, writePackedVarint(t, e) {
    e.length && this.writeMessage(t, ha, e);
  }, writePackedSVarint(t, e) {
    e.length && this.writeMessage(t, ua, e);
  }, writePackedBoolean(t, e) {
    e.length && this.writeMessage(t, pa, e);
  }, writePackedFloat(t, e) {
    e.length && this.writeMessage(t, ca, e);
  }, writePackedDouble(t, e) {
    e.length && this.writeMessage(t, da, e);
  }, writePackedFixed32(t, e) {
    e.length && this.writeMessage(t, ga, e);
  }, writePackedSFixed32(t, e) {
    e.length && this.writeMessage(t, fa, e);
  }, writePackedFixed64(t, e) {
    e.length && this.writeMessage(t, ma, e);
  }, writePackedSFixed64(t, e) {
    e.length && this.writeMessage(t, ya, e);
  }, writeBytesField(t, e) {
    this.writeTag(t, ia.Bytes), this.writeBytes(e);
  }, writeFixed32Field(t, e) {
    this.writeTag(t, ia.Fixed32), this.writeFixed32(e);
  }, writeSFixed32Field(t, e) {
    this.writeTag(t, ia.Fixed32), this.writeSFixed32(e);
  }, writeFixed64Field(t, e) {
    this.writeTag(t, ia.Fixed64), this.writeFixed64(e);
  }, writeSFixed64Field(t, e) {
    this.writeTag(t, ia.Fixed64), this.writeSFixed64(e);
  }, writeVarintField(t, e) {
    this.writeTag(t, ia.Varint), this.writeVarint(e);
  }, writeSVarintField(t, e) {
    this.writeTag(t, ia.Varint), this.writeSVarint(e);
  }, writeStringField(t, e) {
    this.writeTag(t, ia.Bytes), this.writeString(e);
  }, writeFloatField(t, e) {
    this.writeTag(t, ia.Fixed32), this.writeFloat(e);
  }, writeDoubleField(t, e) {
    this.writeTag(t, ia.Fixed64), this.writeDouble(e);
  }, writeBooleanField(t, e) {
    this.writeVarintField(t, Boolean(e));
  }}; function ba(t, e, i) {
    if (t === 3) {
      const t = {keys: [], values: [], features: []}; const n = i.readVarint() + i.pos; i.readFields(wa, t, n), t.length = t.features.length, t.length && (e[t.name] = t);
    }
  } function wa(t, e, i) {
    if (t === 15) {
      e.version = i.readVarint();
    } else if (t === 1) {
      e.name = i.readString();
    } else if (t === 5) {
      e.extent = i.readVarint();
    } else if (t === 2) {
      e.features.push(i.pos);
    } else if (t === 3) {
      e.keys.push(i.readString());
    } else if (t === 4) {
      let n = null; const r = i.readVarint() + i.pos; for (;i.pos < r;) {
        n = (t = i.readVarint() >> 3) === 1 ? i.readString() : t === 2 ? i.readFloat() : t === 3 ? i.readDouble() : t === 4 ? i.readVarint64() : t === 5 ? i.readVarint() : t === 6 ? i.readSVarint() : t === 7 ? i.readBoolean() : null;
      }e.values.push(n);
    }
  } function Ca(t, e, i) {
    if (t == 1) {
      e.id = i.readVarint();
    } else if (t == 2) {
      const t = i.readVarint() + i.pos; for (;i.pos < t;) {
        const t = e.layer.keys[i.readVarint()]; const n = e.layer.values[i.readVarint()]; e.properties[t] = n;
      }
    } else {
      t == 3 ? e.type = i.readVarint() : t == 4 && (e.geometry = i.pos);
    }
  } function Sa(t, e, i) {
    t.pos = e.features[i]; const n = t.readVarint() + t.pos; const r = {layer: e, type: 0, properties: {}}; return t.readFields(Ca, r, n), r;
  } let Ta = class extends Go {
    constructor(t) {
      super(), t = t || {}, this.dataProjection = new $i({code: '', units: 'tile-pixels'}), this.featureClass_ = t.featureClass ? t.featureClass : wo, this.geometryName_ = t.geometryName, this.layerName_ = t.layerName ? t.layerName : 'layer', this.layers_ = t.layers ? t.layers : null, this.idProperty_ = t.idProperty, this.supportedMediaTypes = ['application/vnd.mapbox-vector-tile', 'application/x-protobuf'];
    }readRawGeometry_(t, e, i, n) {
      t.pos = e.geometry; const r = t.readVarint() + t.pos; let s = 1; let o = 0; let a = 0; let l = 0; let h = 0; let u = 0; for (;t.pos < r;) {
        if (!o) {
          const e = t.readVarint(); s = 7 & e, o = e >> 3;
        }o--, s === 1 || s === 2 ? (a += t.readSVarint(), l += t.readSVarint(), s === 1 && h > u && (n.push(h), u = h), i.push(a, l), h += 2) : s === 7 ? h > u && (i.push(i[u], i[u + 1]), h += 2) : St(!1, 59);
      }h > u && (n.push(h), u = h);
    }createFeature_(t, e, i) {
      const n = e.type; if (n === 0) {
        return null;
      } let r; const s = e.properties; let o; this.idProperty_ ? (o = s[this.idProperty_], delete s[this.idProperty_]) : o = e.id, s[this.layerName_] = e.layer.name; const a = []; const l = []; this.readRawGeometry_(t, e, a, l); const h = function (t, e) {
        let i; t === 1 ? i = e === 1 ? 'Point' : 'MultiPoint' : t === 2 ? i = e === 1 ? 'LineString' : 'MultiLineString' : t === 3 && (i = 'Polygon'); return i;
      }(n, l.length); if (this.featureClass_ === wo) {
        r = new this.featureClass_(h, a, l, s, o), r.transform(i.dataProjection);
      } else {
        let t; if (h == 'Polygon') {
          const e = function (t, e) {
            const i = []; let n = 0; let r = 0; for (let s = 0, o = e.length; s < o; ++s) {
              const o = e[s]; if (zr(t, n, o, 2)) {
                if (i.length === 0) {
                  continue;
                } i[i.length - 1].push(e[r]);
              } else {
                i.push(e.slice(r, s + 1));
              }r = s + 1, n = o;
            } return i;
          }(a, l); t = e.length > 1 ? new vo(a, 'XY', e) : new Nr(a, 'XY', l);
        } else {
          t = h === 'Point' ? new Sr(a, 'XY') : h === 'LineString' ? new co(a, 'XY') : h === 'MultiPoint' ? new mo(a, 'XY') : h === 'MultiLineString' ? new go(a, 'XY', l) : null;
        }r = new (0, this.featureClass_)(), this.geometryName_ && r.setGeometryName(this.geometryName_); const e = No(t, !1, i); r.setGeometry(e), void 0 !== o && r.setId(o), r.setProperties(s, !0);
      } return r;
    }getType() {
      return 'arraybuffer';
    }readFeatures(t, e) {
      const i = this.layers_; const n = En((e = this.adaptOptions(e)).dataProjection); n.setWorldExtent(e.extent), e.dataProjection = n; const r = new ta(t); const s = r.readFields(ba, {}); const o = []; for (const t in s) {
        if (i && !i.includes(t)) {
          continue;
        } const a = s[t]; const l = a ? [0, 0, a.extent, a.extent] : null; n.setExtent(l); for (let t = 0, i = a.length; t < i; ++t) {
          const i = Sa(r, a, t); const n = this.createFeature_(r, i, e); n !== null && o.push(n);
        }
      } return o;
    }readProjection(t) {
      return this.dataProjection;
    }setLayers(t) {
      this.layers_ = t;
    }
  }; let Ea = class extends Hs {
    constructor(t, e, i, n, r) {
      super(t, e, i, void 0 !== r ? Os : js), this.loader_ = void 0 !== r ? r : null, this.canvas_ = n, this.error_ = null;
    }getError() {
      return this.error_;
    }handleLoad_(t) {
      t ? (this.error_ = t, this.state = Gs) : this.state = js, this.changed();
    }load() {
      this.state == Os && (this.state = Ds, this.changed(), this.loader_(this.handleLoad_.bind(this)));
    }getImage() {
      return this.canvas_;
    }
  }; let Ra = class {
    constructor(t, e, i, n, r, s) {
      this.sourceProj_ = t, this.targetProj_ = e; let o = {}; const a = Ln(this.targetProj_, this.sourceProj_); this.transformInv_ = function (t) {
        const e = t[0] + '/' + t[1]; return o[e] || (o[e] = a(t)), o[e];
      }, this.maxSourceExtent_ = n, this.errorThresholdSquared_ = r * r, this.triangles_ = [], this.wrapsXInSource_ = !1, this.canWrapXInSource_ = this.sourceProj_.canWrapX() && !!n && !!this.sourceProj_.getExtent() && ye(n) == ye(this.sourceProj_.getExtent()), this.sourceWorldWidth_ = this.sourceProj_.getExtent() ? ye(this.sourceProj_.getExtent()) : null, this.targetWorldWidth_ = this.targetProj_.getExtent() ? ye(this.targetProj_.getExtent()) : null; const l = fe(i); const h = me(i); const u = le(i); const c = ae(i); const d = this.transformInv_(l); const p = this.transformInv_(h); const g = this.transformInv_(u); const f = this.transformInv_(c); const m = 10 + (s ? Math.max(0, Math.ceil(Math.log2(oe(i) / (s * s * 256 * 256)))) : 0); if (this.addQuad_(l, h, u, c, d, p, g, f, m), this.wrapsXInSource_) {
        let t = 1 / 0; this.triangles_.forEach((function (e, i, n) {
          t = Math.min(t, e.source[0][0], e.source[1][0], e.source[2][0]);
        })), this.triangles_.forEach(((e)=>{
          if (Math.max(e.source[0][0], e.source[1][0], e.source[2][0]) - t > this.sourceWorldWidth_ / 2) {
            const i = [[e.source[0][0], e.source[0][1]], [e.source[1][0], e.source[1][1]], [e.source[2][0], e.source[2][1]]]; i[0][0] - t > this.sourceWorldWidth_ / 2 && (i[0][0] -= this.sourceWorldWidth_), i[1][0] - t > this.sourceWorldWidth_ / 2 && (i[1][0] -= this.sourceWorldWidth_), i[2][0] - t > this.sourceWorldWidth_ / 2 && (i[2][0] -= this.sourceWorldWidth_); const n = Math.min(i[0][0], i[1][0], i[2][0]); Math.max(i[0][0], i[1][0], i[2][0]) - n < this.sourceWorldWidth_ / 2 && (e.source = i);
          }
        }));
      }o = {};
    }addTriangle_(t, e, i, n, r, s) {
      this.triangles_.push({source: [n, r, s], target: [t, e, i]});
    }addQuad_(t, e, i, n, r, s, o, a, l) {
      const h = Wt([r, s, o, a]); const u = this.sourceWorldWidth_ ? ye(h) / this.sourceWorldWidth_ : null; const c = this.sourceWorldWidth_; const d = this.sourceProj_.canWrapX() && u > 0.5 && u < 1; let p = !1; if (l > 0) {
        if (this.targetProj_.isGlobal() && this.targetWorldWidth_) {
          p = ye(Wt([t, e, i, n])) / this.targetWorldWidth_ > 0.25 || p;
        }!d && this.sourceProj_.isGlobal() && u && (p = u > 0.25 || p);
      } if (!p && this.maxSourceExtent_ && isFinite(h[0]) && isFinite(h[1]) && isFinite(h[2]) && isFinite(h[3]) && !_e(h, this.maxSourceExtent_)) {
        return;
      } let g = 0; if (!(p || isFinite(r[0]) && isFinite(r[1]) && isFinite(s[0]) && isFinite(s[1]) && isFinite(o[0]) && isFinite(o[1]) && isFinite(a[0]) && isFinite(a[1]))) {
        if (l > 0) {
          p = !0;
        } else if (g = (isFinite(r[0]) && isFinite(r[1]) ? 0 : 8) + (isFinite(s[0]) && isFinite(s[1]) ? 0 : 4) + (isFinite(o[0]) && isFinite(o[1]) ? 0 : 2) + (isFinite(a[0]) && isFinite(a[1]) ? 0 : 1), g != 1 && g != 2 && g != 4 && g != 8) {
          return;
        }
      } if (l > 0) {
        if (!p) {
          const e = [(t[0] + i[0]) / 2, (t[1] + i[1]) / 2]; const n = this.transformInv_(e); let s; if (d) {
            s = (Ee(r[0], c) + Ee(o[0], c)) / 2 - Ee(n[0], c);
          } else {
            s = (r[0] + o[0]) / 2 - n[0];
          } const a = (r[1] + o[1]) / 2 - n[1]; p = s * s + a * a > this.errorThresholdSquared_;
        } if (p) {
          if (Math.abs(t[0] - i[0]) <= Math.abs(t[1] - i[1])) {
            const h = [(e[0] + i[0]) / 2, (e[1] + i[1]) / 2]; const u = this.transformInv_(h); const c = [(n[0] + t[0]) / 2, (n[1] + t[1]) / 2]; const d = this.transformInv_(c); this.addQuad_(t, e, h, c, r, s, u, d, l - 1), this.addQuad_(c, h, i, n, d, u, o, a, l - 1);
          } else {
            const h = [(t[0] + e[0]) / 2, (t[1] + e[1]) / 2]; const u = this.transformInv_(h); const c = [(i[0] + n[0]) / 2, (i[1] + n[1]) / 2]; const d = this.transformInv_(c); this.addQuad_(t, h, c, n, r, u, d, a, l - 1), this.addQuad_(h, e, i, c, u, s, o, d, l - 1);
          } return;
        }
      } if (d) {
        if (!this.canWrapXInSource_) {
          return;
        } this.wrapsXInSource_ = !0;
      }(11 & g) == 0 && this.addTriangle_(t, i, n, r, o, a), (14 & g) == 0 && this.addTriangle_(t, i, e, r, o, s), g && ((13 & g) == 0 && this.addTriangle_(e, n, t, s, a, r), (7 & g) == 0 && this.addTriangle_(e, n, i, s, a, o));
    }calculateSourceExtent() {
      const t = [1 / 0, 1 / 0, -1 / 0, -1 / 0]; return this.triangles_.forEach((function (e, i, n) {
        const r = e.source; ie(t, r[0]), ie(t, r[1]), ie(t, r[2]);
      })), t;
    }getTriangles() {
      return this.triangles_;
    }
  }; let Ia; const Ma = []; function ka(t, e, i, n, r) {
    t.beginPath(), t.moveTo(0, 0), t.lineTo(e, i), t.lineTo(n, r), t.closePath(), t.save(), t.clip(), t.fillRect(0, 0, Math.max(e, n) + 1, Math.max(i, r)), t.restore();
  } function Fa(t, e) {
    return Math.abs(t[4 * e] - 210) > 2 || Math.abs(t[4 * e + 3] - 191.25) > 2;
  } function Pa(t, e, i, n) {
    const r = An(i, e, t); let s = Rn(e, n, i); const o = e.getMetersPerUnit(); void 0 !== o && (s *= o); const a = t.getMetersPerUnit(); void 0 !== a && (s /= a); const l = t.getExtent(); if (!l || Vt(l, r)) {
      const e = Rn(t, s, r) / s; isFinite(e) && e > 0 && (s /= e);
    } return s;
  } function La(t, e, i, n, r, s, o, a, l, h, u, c) {
    const d = K(Math.round(i * t), Math.round(i * e), Ma); if (c || (d.imageSmoothingEnabled = !1), l.length === 0) {
      return d.canvas;
    } function p(t) {
      return Math.round(t * i) / i;
    }d.scale(i, i), d.globalCompositeOperation = 'lighter'; const g = [1 / 0, 1 / 0, -1 / 0, -1 / 0]; l.forEach((function (t, e, i) {
      ee(g, t.extent);
    })); const f = ye(g); const m = pe(g); const y = K(Math.round(i * f / n), Math.round(i * m / n), Ma); c || (y.imageSmoothingEnabled = !1); const _ = i / n; l.forEach((function (t, e, i) {
      const n = t.extent[0] - g[0]; const r = -(t.extent[3] - g[3]); const s = ye(t.extent); const o = pe(t.extent); t.image.width > 0 && t.image.height > 0 && y.drawImage(t.image, h, h, t.image.width - 2 * h, t.image.height - 2 * h, n * _, r * _, s * _, o * _);
    })); const v = fe(o); return a.getTriangles().forEach((function (t, e, r) {
      const o = t.source; const a = t.target; let l = o[0][0]; let h = o[0][1]; let u = o[1][0]; let f = o[1][1]; let m = o[2][0]; let _ = o[2][1]; const x = p((a[0][0] - v[0]) / s); const b = p(-(a[0][1] - v[1]) / s); const w = p((a[1][0] - v[0]) / s); const C = p(-(a[1][1] - v[1]) / s); const S = p((a[2][0] - v[0]) / s); const T = p(-(a[2][1] - v[1]) / s); const E = l; const R = h; l = 0, h = 0, u -= E, f -= R, m -= E, _ -= R; const I = function (t) {
        const e = t.length; for (let i = 0; i < e; i++) {
          let n = i; let r = Math.abs(t[i][i]); for (let s = i + 1; s < e; s++) {
            const e = Math.abs(t[s][i]); e > r && (r = e, n = s);
          } if (r === 0) {
            return null;
          } const s = t[n]; t[n] = t[i], t[i] = s; for (let n = i + 1; n < e; n++) {
            const r = -t[n][i] / t[i][i]; for (let s = i; s < e + 1; s++) {
              i == s ? t[n][s] = 0 : t[n][s] += r * t[i][s];
            }
          }
        } const i = new Array(e); for (let n = e - 1; n >= 0; n--) {
          i[n] = t[n][e] / t[n][n]; for (let r = n - 1; r >= 0; r--) {
            t[r][e] -= t[r][n] * i[n];
          }
        } return i;
      }([[u, f, 0, 0, w - x], [m, _, 0, 0, S - x], [0, 0, u, f, C - b], [0, 0, m, _, T - b]]); if (I) {
        if (d.save(), d.beginPath(), function () {
          if (void 0 === Ia) {
            const t = K(6, 6, Ma); t.globalCompositeOperation = 'lighter', t.fillStyle = 'rgba(210, 0, 0, 0.75)', ka(t, 4, 5, 4, 0), ka(t, 4, 5, 0, 5); const e = t.getImageData(0, 0, 3, 3).data; Ia = Fa(e, 0) || Fa(e, 4) || Fa(e, 8), Z(t), Ma.push(t.canvas);
          } return Ia;
        }() || !c) {
          d.moveTo(w, C); const t = 4; const e = x - w; const i = b - C; for (let n = 0; n < t; n++) {
            d.lineTo(w + p((n + 1) * e / t), C + p(n * i / (t - 1))), n != t - 1 && d.lineTo(w + p((n + 1) * e / t), C + p((n + 1) * i / (t - 1)));
          }d.lineTo(S, T);
        } else {
          d.moveTo(w, C), d.lineTo(x, b), d.lineTo(S, T);
        }d.clip(), d.transform(I[0], I[2], I[1], I[3], x, b), d.translate(g[0] - E, g[3] - R), d.scale(n / i, -n / i), d.drawImage(y.canvas, 0, 0), d.restore();
      }
    })), Z(y), Ma.push(y.canvas), u && (d.save(), d.globalCompositeOperation = 'source-over', d.strokeStyle = 'black', d.lineWidth = 1, a.getTriangles().forEach((function (t, e, i) {
      const n = t.target; const r = (n[0][0] - v[0]) / s; const o = -(n[0][1] - v[1]) / s; const a = (n[1][0] - v[0]) / s; const l = -(n[1][1] - v[1]) / s; const h = (n[2][0] - v[0]) / s; const u = -(n[2][1] - v[1]) / s; d.beginPath(), d.moveTo(a, l), d.lineTo(r, o), d.lineTo(h, u), d.closePath(), d.stroke();
    })), d.restore()), d.canvas;
  } let Aa = class extends Hs {
    constructor(t, e, i, n, r, s, o) {
      const a = t.getExtent(); const l = e.getExtent(); const h = l ? ge(i, l) : i; const u = Pa(t, e, he(h), n); const c = new Ra(t, e, h, a, 0.5 * u, n); const d = s(c.calculateSourceExtent(), u, r); const p = d ? Os : Ns; const g = d ? d.getPixelRatio() : 1; super(i, n, g, p), this.targetProj_ = e, this.maxSourceExtent_ = a, this.triangulation_ = c, this.targetResolution_ = n, this.targetExtent_ = i, this.sourceImage_ = d, this.sourcePixelRatio_ = g, this.interpolate_ = o, this.canvas_ = null, this.sourceListenerKey_ = null;
    }disposeInternal() {
      this.state == Ds && this.unlistenSource_(), super.disposeInternal();
    }getImage() {
      return this.canvas_;
    }getProjection() {
      return this.targetProj_;
    }reproject_() {
      const t = this.sourceImage_.getState(); if (t == js) {
        const t = ye(this.targetExtent_) / this.targetResolution_; const e = pe(this.targetExtent_) / this.targetResolution_; this.canvas_ = La(t, e, this.sourcePixelRatio_, this.sourceImage_.getResolution(), this.maxSourceExtent_, this.targetResolution_, this.targetExtent_, this.triangulation_, [{extent: this.sourceImage_.getExtent(), image: this.sourceImage_.getImage()}], 0, void 0, this.interpolate_);
      } this.state = t, this.changed();
    }load() {
      if (this.state == Os) {
        this.state = Ds, this.changed(); const t = this.sourceImage_.getState(); t == js || t == Gs ? this.reproject_() : (this.sourceListenerKey_ = S(this.sourceImage_, g, (function (t) {
          const e = this.sourceImage_.getState(); e != js && e != Gs || (this.unlistenSource_(), this.reproject_());
        }), this), this.sourceImage_.load());
      }
    }unlistenSource_() {
      E(this.sourceListenerKey_), this.sourceListenerKey_ = null;
    }
  }; function za(t) {
    return t ? Array.isArray(t) ? function (e) {
      return t;
    } : typeof t === 'function' ? t : function (e) {
      return [t];
    } : null;
  } let Oa = class extends L {
    constructor(t) {
      super(), this.projection = En(t.projection), this.attributions_ = za(t.attributions), this.attributionsCollapsible_ = void 0 === t.attributionsCollapsible || t.attributionsCollapsible, this.loading = !1, this.state_ = void 0 !== t.state ? t.state : 'ready', this.wrapX_ = void 0 !== t.wrapX && t.wrapX, this.interpolate_ = !!t.interpolate, this.viewResolver = null, this.viewRejector = null; const e = this; this.viewPromise_ = new Promise((function (t, i) {
        e.viewResolver = t, e.viewRejector = i;
      }));
    }getAttributions() {
      return this.attributions_;
    }getAttributionsCollapsible() {
      return this.attributionsCollapsible_;
    }getProjection() {
      return this.projection;
    }getResolutions(t) {
      return null;
    }getView() {
      return this.viewPromise_;
    }getState() {
      return this.state_;
    }getWrapX() {
      return this.wrapX_;
    }getInterpolate() {
      return this.interpolate_;
    }refresh() {
      this.changed();
    }setAttributions(t) {
      this.attributions_ = za(t), this.changed();
    }setState(t) {
      this.state_ = t, this.changed();
    }
  }; const Da = 'imageloadstart'; const ja = 'imageloadend'; const Ga = 'imageloaderror'; class Na extends t {
    constructor(t, e) {
      super(t), this.image = e;
    }
  } let Wa = class extends Oa {
    constructor(t) {
      super({attributions: t.attributions, projection: t.projection, state: t.state, interpolate: void 0 === t.interpolate || t.interpolate}), this.on, this.once, this.un, this.resolutions_ = void 0 !== t.resolutions ? t.resolutions : null, this.reprojectedImage_ = null, this.reprojectedRevision_ = 0;
    }getResolutions() {
      return this.resolutions_;
    }setResolutions(t) {
      this.resolutions_ = t;
    }findNearestResolution(t) {
      const e = this.getResolutions(); if (e) {
        t = e[r(e, t, 0)];
      } return t;
    }getImage(t, e, i, n) {
      const r = this.getProjection(); if (!r || !n || Fn(r, n)) {
        return r && (n = r), this.getImageInternal(t, e, i, n);
      } if (this.reprojectedImage_) {
        if (this.reprojectedRevision_ == this.getRevision() && Fn(this.reprojectedImage_.getProjection(), n) && this.reprojectedImage_.getResolution() == e && te(this.reprojectedImage_.getExtent(), t)) {
          return this.reprojectedImage_;
        } this.reprojectedImage_.dispose(), this.reprojectedImage_ = null;
      } return this.reprojectedImage_ = new Aa(r, n, t, e, i, ((t, e, i)=>this.getImageInternal(t, e, i, r)), this.getInterpolate()), this.reprojectedRevision_ = this.getRevision(), this.reprojectedImage_;
    }getImageInternal(t, e, i, n) {
      return M();
    }handleImageChange(t) {
      const e = t.target; let i; switch (e.getState()) {
        case Ds:this.loading = !0, i = Da; break; case js:this.loading = !1, i = ja; break; case Gs:this.loading = !1, i = Ga; break; default:return;
      } this.hasListener(i) && this.dispatchEvent(new Na(i, e));
    }
  }; let Xa = 'preload'; let qa = 'useInterimTilesOnError'; let Ba = class extends ni {
    constructor(t) {
      t = t || {}; const e = Object.assign({}, t); delete e.preload, delete e.useInterimTilesOnError, super(e), this.on, this.once, this.un, this.setPreload(void 0 !== t.preload ? t.preload : 0), this.setUseInterimTilesOnError(void 0 === t.useInterimTilesOnError || t.useInterimTilesOnError);
    }getPreload() {
      return this.get(Xa);
    }setPreload(t) {
      this.set(Xa, t);
    }getUseInterimTilesOnError() {
      return this.get(qa);
    }setUseInterimTilesOnError(t) {
      this.set(qa, t);
    }getData(t) {
      return super.getData(t);
    }
  }; let Va = class extends p {
    constructor(t, e, i) {
      super(), i = i || {}, this.tileCoord = t, this.state = e, this.interimTile = null, this.key = '', this.transition_ = void 0 === i.transition ? 250 : i.transition, this.transitionStarts_ = {}, this.interpolate = !!i.interpolate;
    }changed() {
      this.dispatchEvent(g);
    }release() {
      this.state === Vi && this.setState(Yi);
    }getKey() {
      return this.key + '/' + this.tileCoord;
    }getInterimTile() {
      if (!this.interimTile) {
        return this;
      } let t = this.interimTile; do {
        if (t.getState() == Bi) {
          return this.transition_ = 0, t;
        } t = t.interimTile;
      } while (t); return this;
    }refreshInterimChain() {
      if (!this.interimTile) {
        return;
      } let t = this.interimTile; let e = this; do {
        if (t.getState() == Bi) {
          t.interimTile = null; break;
        }t.getState() == qi ? e = t : t.getState() == Xi ? e.interimTile = t.interimTile : e = t, t = e.interimTile;
      } while (t);
    }getTileCoord() {
      return this.tileCoord;
    }getState() {
      return this.state;
    }setState(t) {
      if (this.state !== Vi && this.state > t) {
        throw new Error('Tile load sequence violation');
      } this.state = t, this.changed();
    }load() {
      M();
    }getAlpha(t, e) {
      if (!this.transition_) {
        return 1;
      } let i = this.transitionStarts_[t]; if (i) {
        if (i === -1) {
          return 1;
        }
      } else {
        i = e, this.transitionStarts_[t] = i;
      } const n = e - i + 1e3 / 60; return n >= this.transition_ ? 1 : Un(n / this.transition_);
    }inTransition(t) {
      return !!this.transition_ && this.transitionStarts_[t] !== -1;
    }endTransition(t) {
      this.transition_ && (this.transitionStarts_[t] = -1);
    }
  }; let Ya = class extends Va {
    constructor(t, e, i, n, r, s) {
      super(t, e, s), this.crossOrigin_ = n, this.src_ = i, this.key = i, this.image_ = new Image(), n !== null && (this.image_.crossOrigin = n), this.unlisten_ = null, this.tileLoadFunction_ = r;
    }getImage() {
      return this.image_;
    }setImage(t) {
      this.image_ = t, this.state = Bi, this.unlistenImage_(), this.changed();
    }handleImageError_() {
      this.state = Vi, this.unlistenImage_(), this.image_ = function () {
        const t = K(1, 1); return t.fillStyle = 'rgba(0,0,0,0)', t.fillRect(0, 0, 1, 1), t.canvas;
      }(), this.changed();
    }handleImageLoad_() {
      const t = this.image_; t.naturalWidth && t.naturalHeight ? this.state = Bi : this.state = Yi, this.unlistenImage_(), this.changed();
    }load() {
      this.state == Vi && (this.state = Xi, this.image_ = new Image(), this.crossOrigin_ !== null && (this.image_.crossOrigin = this.crossOrigin_)), this.state == Xi && (this.state = qi, this.changed(), this.tileLoadFunction_(this, this.src_), this.unlisten_ = Js(this.image_, this.handleImageLoad_.bind(this), this.handleImageError_.bind(this)));
    }unlistenImage_() {
      this.unlisten_ && (this.unlisten_(), this.unlisten_ = null);
    }
  }; let Ka = class extends Va {
    constructor(t, e, i, n, r, s, o, a, l, h, u, c) {
      super(r, Xi, {interpolate: !!c}), this.renderEdges_ = void 0 !== u && u, this.pixelRatio_ = o, this.gutter_ = a, this.canvas_ = null, this.sourceTileGrid_ = e, this.targetTileGrid_ = n, this.wrappedTileCoord_ = s || r, this.sourceTiles_ = [], this.sourcesListenerKeys_ = null, this.sourceZ_ = 0; const d = n.getTileCoordExtent(this.wrappedTileCoord_); const p = this.targetTileGrid_.getExtent(); let g = this.sourceTileGrid_.getExtent(); const f = p ? ge(d, p) : d; if (oe(f) === 0) {
        return void (this.state = Yi);
      } const m = t.getExtent(); m && (g = g ? ge(g, m) : m); const y = n.getResolution(this.wrappedTileCoord_[0]); const _ = function (t, e, i, n) {
        const r = he(i); let s = Pa(t, e, r, n); return (!isFinite(s) || s <= 0) && se(i, (function (i) {
          return s = Pa(t, e, i, n), isFinite(s) && s > 0;
        })), s;
      }(t, i, f, y); if (!isFinite(_) || _ <= 0) {
        return void (this.state = Yi);
      } const v = void 0 !== h ? h : 0.5; if (this.triangulation_ = new Ra(t, i, f, g, _ * v, y), this.triangulation_.getTriangles().length === 0) {
        return void (this.state = Yi);
      } this.sourceZ_ = e.getZForResolution(_); let x = this.triangulation_.calculateSourceExtent(); if (g && (t.canWrapX() ? (x[1] = we(x[1], g[1], g[3]), x[3] = we(x[3], g[1], g[3])) : x = ge(x, g)), oe(x)) {
        const t = e.getTileRangeForExtentAndZ(x, this.sourceZ_); for (let e = t.minX; e <= t.maxX; e++) {
          for (let i = t.minY; i <= t.maxY; i++) {
            const t = l(this.sourceZ_, e, i, o); t && this.sourceTiles_.push(t);
          }
        } this.sourceTiles_.length === 0 && (this.state = Yi);
      } else {
        this.state = Yi;
      }
    }getImage() {
      return this.canvas_;
    }reproject_() {
      const t = []; if (this.sourceTiles_.forEach(((e)=>{
        e && e.getState() == Bi && t.push({extent: this.sourceTileGrid_.getTileCoordExtent(e.tileCoord), image: e.getImage()});
      })), this.sourceTiles_.length = 0, t.length === 0) {
        this.state = Vi;
      } else {
        const e = this.wrappedTileCoord_[0]; const i = this.targetTileGrid_.getTileSize(e); const n = typeof i === 'number' ? i : i[0]; const r = typeof i === 'number' ? i : i[1]; const s = this.targetTileGrid_.getResolution(e); const o = this.sourceTileGrid_.getResolution(this.sourceZ_); const a = this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_); this.canvas_ = La(n, r, this.pixelRatio_, o, this.sourceTileGrid_.getExtent(), s, a, this.triangulation_, t, this.gutter_, this.renderEdges_, this.interpolate), this.state = Bi;
      } this.changed();
    }load() {
      if (this.state == Xi) {
        this.state = qi, this.changed(); let t = 0; this.sourcesListenerKeys_ = [], this.sourceTiles_.forEach(((e)=>{
          const i = e.getState(); if (i == Xi || i == qi) {
            t++; const i = S(e, g, (function (n) {
              const r = e.getState(); r != Bi && r != Vi && r != Yi || (E(i), t--, t === 0 && (this.unlistenSources_(), this.reproject_()));
            }), this); this.sourcesListenerKeys_.push(i);
          }
        })), t === 0 ? setTimeout(this.reproject_.bind(this), 0) : this.sourceTiles_.forEach((function (t, e, i) {
          t.getState() == Xi && t.load();
        }));
      }
    }unlistenSources_() {
      this.sourcesListenerKeys_.forEach(E), this.sourcesListenerKeys_ = null;
    }release() {
      this.canvas_ && (Z(this.canvas_.getContext('2d')), Ma.push(this.canvas_), this.canvas_ = null), super.release();
    }
  }; class Za {
    constructor(t, e, i, n) {
      this.minX = t, this.maxX = e, this.minY = i, this.maxY = n;
    }contains(t) {
      return this.containsXY(t[1], t[2]);
    }containsTileRange(t) {
      return this.minX <= t.minX && t.maxX <= this.maxX && this.minY <= t.minY && t.maxY <= this.maxY;
    }containsXY(t, e) {
      return this.minX <= t && t <= this.maxX && this.minY <= e && e <= this.maxY;
    }equals(t) {
      return this.minX == t.minX && this.minY == t.minY && this.maxX == t.maxX && this.maxY == t.maxY;
    }extend(t) {
      t.minX < this.minX && (this.minX = t.minX), t.maxX > this.maxX && (this.maxX = t.maxX), t.minY < this.minY && (this.minY = t.minY), t.maxY > this.maxY && (this.maxY = t.maxY);
    }getHeight() {
      return this.maxY - this.minY + 1;
    }getSize() {
      return [this.getWidth(), this.getHeight()];
    }getWidth() {
      return this.maxX - this.minX + 1;
    }intersects(t) {
      return this.minX <= t.maxX && this.maxX >= t.minX && this.minY <= t.maxY && this.maxY >= t.minY;
    }
  } function Ua(t, e, i, n, r) {
    return void 0 !== r ? (r.minX = t, r.maxX = e, r.minY = i, r.maxY = n, r) : new Za(t, e, i, n);
  } let Ha = Za; let Ja = class extends Ho {
    constructor(t) {
      super(t), this.extentChanged = !0, this.renderedExtent_ = null, this.renderedPixelRatio, this.renderedProjection = null, this.renderedRevision, this.renderedTiles = [], this.newTiles_ = !1, this.tmpExtent = [1 / 0, 1 / 0, -1 / 0, -1 / 0], this.tmpTileRange_ = new Ha(0, 0, 0, 0);
    }isDrawableTile(t) {
      const e = this.getLayer(); const i = t.getState(); const n = e.getUseInterimTilesOnError(); return i == Bi || i == Yi || i == Vi && !n;
    }getTile(t, e, i, n) {
      const r = n.pixelRatio; const s = n.viewState.projection; const o = this.getLayer(); let a = o.getSource().getTile(t, e, i, r, s); return a.getState() == Vi && o.getUseInterimTilesOnError() && o.getPreload() > 0 && (this.newTiles_ = !0), this.isDrawableTile(a) || (a = a.getInterimTile()), a;
    }getData(t) {
      const e = this.frameState; if (!e) {
        return null;
      } const i = this.getLayer(); const n = Mt(e.pixelToCoordinateTransform, t.slice()); const r = i.getExtent(); if (r && !Vt(r, n)) {
        return null;
      } const s = e.pixelRatio; const o = e.viewState.projection; const a = e.viewState; const l = i.getRenderSource(); const h = l.getTileGridForProjection(a.projection); const u = l.getTilePixelRatio(e.pixelRatio); for (let t = h.getZForResolution(a.resolution); t >= h.getMinZoom(); --t) {
        const e = h.getTileCoordForCoordAndZ(n, t); const i = l.getTile(t, e[1], e[2], s, o); if (!(i instanceof Ya || i instanceof Ka) || i instanceof Ka && i.getState() === Yi) {
          return null;
        } if (i.getState() !== Bi) {
          continue;
        } const r = h.getOrigin(t); const c = Ps(h.getTileSize(t)); const d = h.getResolution(t); const p = Math.floor(u * ((n[0] - r[0]) / d - e[1] * c[0])); const g = Math.floor(u * ((r[1] - n[1]) / d - e[2] * c[1])); const f = Math.round(u * l.getGutterForProjection(a.projection)); return this.getImageData(i.getImage(), p + f, g + f);
      } return null;
    }loadedTileCallback(t, e, i) {
      return !!this.isDrawableTile(i) && super.loadedTileCallback(t, e, i);
    }prepareFrame(t) {
      return !!this.getLayer().getSource();
    }renderFrame(t, e) {
      const i = t.layerStatesArray[t.layerIndex]; const r = t.viewState; const s = r.projection; const o = r.resolution; const a = r.center; const l = r.rotation; const h = t.pixelRatio; const u = this.getLayer(); const c = u.getSource(); const d = c.getRevision(); const p = c.getTileGridForProjection(s); const g = p.getZForResolution(o, c.zDirection); const f = p.getResolution(g); let m = t.extent; const y = t.viewState.resolution; const _ = c.getTilePixelRatio(h); const v = Math.round(ye(m) / y * h); const x = Math.round(pe(m) / y * h); const b = i.extent && jn(i.extent); b && (m = ge(m, jn(i.extent))); const w = f * v / 2 / _; const C = f * x / 2 / _; const S = [a[0] - w, a[1] - C, a[0] + w, a[1] + C]; const T = p.getTileRangeForExtentAndZ(m, g); const E = {}; E[g] = {}; const R = this.createLoadedTileFinder(c, s, E); const I = this.tmpExtent; const M = this.tmpTileRange_; this.newTiles_ = !1; const k = l ? de(r.center, y, l, t.size) : void 0; for (let e = T.minX; e <= T.maxX; ++e) {
        for (let n = T.minY; n <= T.maxY; ++n) {
          if (l && !p.tileCoordIntersectsViewport([g, e, n], k)) {
            continue;
          } const r = this.getTile(g, e, n, t); if (this.isDrawableTile(r)) {
            const e = F(this); if (r.getState() == Bi) {
              E[g][r.tileCoord.toString()] = r; let t = r.inTransition(e); t && i.opacity !== 1 && (r.endTransition(e), t = !1), this.newTiles_ || !t && this.renderedTiles.includes(r) || (this.newTiles_ = !0);
            } if (r.getAlpha(e, t.time) === 1) {
              continue;
            }
          } const s = p.getTileCoordChildTileRange(r.tileCoord, M, I); let o = !1; s && (o = R(g + 1, s)), o || p.forEachTileCoordParentTileRange(r.tileCoord, R, M, I);
        }
      } const P = f / o * h / _; Ft(this.pixelTransform, t.size[0] / 2, t.size[1] / 2, 1 / h, 1 / h, l, -v / 2, -x / 2); const L = At(this.pixelTransform); this.useContainer(e, L, this.getBackground(t)); const A = this.context; const z = A.canvas; Pt(this.inversePixelTransform, this.pixelTransform), Ft(this.tempTransform, v / 2, x / 2, P, P, 0, -v / 2, -x / 2), z.width != v || z.height != x ? (z.width = v, z.height = x) : this.containerReused || A.clearRect(0, 0, v, x), b && this.clipUnrotated(A, t, b), c.getInterpolate() || (A.imageSmoothingEnabled = !1), this.preRender(A, t), this.renderedTiles.length = 0; let O; let D; let j; let G = Object.keys(E).map(Number); G.sort(n), i.opacity !== 1 || this.containerReused && !c.getOpaque(t.viewState.projection) ? (O = [], D = []) : G = G.reverse(); for (let e = G.length - 1; e >= 0; --e) {
        const i = G[e]; const n = c.getTilePixelSize(i, h, s); const r = p.getResolution(i) / f; const o = n[0] * r * P; const a = n[1] * r * P; const l = p.getTileCoordForCoordAndZ(fe(S), i); const u = p.getTileCoordExtent(l); const d = Mt(this.tempTransform, [_ * (u[0] - S[0]) / f, _ * (S[3] - u[3]) / f]); const m = _ * c.getGutterForProjection(s); const y = E[i]; for (const e in y) {
          const n = y[e]; const r = n.tileCoord; const s = l[1] - r[1]; const h = Math.round(d[0] - (s - 1) * o); const u = l[2] - r[2]; const p = Math.round(d[1] - (u - 1) * a); const f = Math.round(d[0] - s * o); const _ = Math.round(d[1] - u * a); const v = h - f; const x = p - _; const b = g === i; const w = b && n.getAlpha(F(this), t.time) !== 1; let C = !1; if (!w) {
            if (O) {
              j = [f, _, f + v, _, f + v, _ + x, f, _ + x]; for (let t = 0, e = O.length; t < e; ++t) {
                if (g !== i && i < D[t]) {
                  const e = O[t]; _e([f, _, f + v, _ + x], [e[0], e[3], e[4], e[7]]) && (C || (A.save(), C = !0), A.beginPath(), A.moveTo(j[0], j[1]), A.lineTo(j[2], j[3]), A.lineTo(j[4], j[5]), A.lineTo(j[6], j[7]), A.moveTo(e[6], e[7]), A.lineTo(e[4], e[5]), A.lineTo(e[2], e[3]), A.lineTo(e[0], e[1]), A.clip());
                }
              }O.push(j), D.push(i);
            } else {
              A.clearRect(f, _, v, x);
            }
          } this.drawTileImage(n, t, f, _, v, x, m, b), O && !w ? (C && A.restore(), this.renderedTiles.unshift(n)) : this.renderedTiles.push(n), this.updateUsedTiles(t.usedTiles, c, n);
        }
      } return this.renderedRevision = d, this.renderedResolution = f, this.extentChanged = !this.renderedExtent_ || !te(this.renderedExtent_, S), this.renderedExtent_ = S, this.renderedPixelRatio = h, this.renderedProjection = s, this.manageTilePyramid(t, c, p, h, s, m, g, u.getPreload()), this.scheduleExpireCache(t, c), this.postRender(A, t), i.extent && A.restore(), A.imageSmoothingEnabled = !0, L !== z.style.transform && (z.style.transform = L), this.container;
    }drawTileImage(t, e, i, n, r, s, o, a) {
      const l = this.getTileImage(t); if (!l) {
        return;
      } const h = F(this); const u = e.layerStatesArray[e.layerIndex]; const c = u.opacity * (a ? t.getAlpha(h, e.time) : 1); const d = c !== this.context.globalAlpha; d && (this.context.save(), this.context.globalAlpha = c), this.context.drawImage(l, o, o, l.width - 2 * o, l.height - 2 * o, i, n, r, s), d && this.context.restore(), c !== u.opacity ? e.animate = !0 : a && t.endTransition(h);
    }getImage() {
      const t = this.context; return t ? t.canvas : null;
    }getTileImage(t) {
      return t.getImage();
    }scheduleExpireCache(t, e) {
      if (e.canExpireCache()) {
        const i = function (t, e, i) {
          const n = F(t); n in i.usedTiles && t.expireCache(i.viewState.projection, i.usedTiles[n]);
        }.bind(null, e); t.postRenderFunctions.push(i);
      }
    }updateUsedTiles(t, e, i) {
      const n = F(e); n in t || (t[n] = {}), t[n][i.getKey()] = !0;
    }manageTilePyramid(t, e, i, n, r, s, o, a, l) {
      const h = F(e); h in t.wantedTiles || (t.wantedTiles[h] = {}); const u = t.wantedTiles[h]; const c = t.tileQueue; const d = i.getMinZoom(); const p = t.viewState.rotation; const g = p ? de(t.viewState.center, t.viewState.resolution, p, t.size) : void 0; let f; let m; let y; let _; let v; let x; let b = 0; for (x = d; x <= o; ++x) {
        for (m = i.getTileRangeForExtentAndZ(s, x, m), y = i.getResolution(x), _ = m.minX; _ <= m.maxX; ++_) {
          for (v = m.minY; v <= m.maxY; ++v) {
            p && !i.tileCoordIntersectsViewport([x, _, v], g) || (o - x <= a ? (++b, f = e.getTile(x, _, v, n, r), f.getState() == Xi && (u[f.getKey()] = !0, c.isKeyQueued(f.getKey()) || c.enqueue([f, h, i.getTileCoordCenter(f.tileCoord), y])), void 0 !== l && l(f)) : e.useTile(x, _, v, r));
          }
        }
      }e.updateCacheSize(b, r);
    }
  }; let Qa = class extends Ba {
    constructor(t) {
      super(t);
    }createRenderer() {
      return new Ja(this);
    }
  }; let $a = class {
    constructor(t) {
      this.highWaterMark = void 0 !== t ? t : 2048, this.count_ = 0, this.entries_ = {}, this.oldest_ = null, this.newest_ = null;
    }canExpireCache() {
      return this.highWaterMark > 0 && this.getCount() > this.highWaterMark;
    }expireCache(t) {
      for (;this.canExpireCache();) {
        this.pop();
      }
    }clear() {
      this.count_ = 0, this.entries_ = {}, this.oldest_ = null, this.newest_ = null;
    }containsKey(t) {
      return this.entries_.hasOwnProperty(t);
    }forEach(t) {
      let e = this.oldest_; for (;e;) {
        t(e.value_, e.key_, this), e = e.newer;
      }
    }get(t, e) {
      const i = this.entries_[t]; return St(void 0 !== i, 15), i === this.newest_ || (i === this.oldest_ ? (this.oldest_ = this.oldest_.newer, this.oldest_.older = null) : (i.newer.older = i.older, i.older.newer = i.newer), i.newer = null, i.older = this.newest_, this.newest_.newer = i, this.newest_ = i), i.value_;
    }remove(t) {
      const e = this.entries_[t]; return St(void 0 !== e, 15), e === this.newest_ ? (this.newest_ = e.older, this.newest_ && (this.newest_.newer = null)) : e === this.oldest_ ? (this.oldest_ = e.newer, this.oldest_ && (this.oldest_.older = null)) : (e.newer.older = e.older, e.older.newer = e.newer), delete this.entries_[t], --this.count_, e.value_;
    }getCount() {
      return this.count_;
    }getKeys() {
      const t = new Array(this.count_); let e; let i = 0; for (e = this.newest_; e; e = e.older) {
        t[i++] = e.key_;
      } return t;
    }getValues() {
      const t = new Array(this.count_); let e; let i = 0; for (e = this.newest_; e; e = e.older) {
        t[i++] = e.value_;
      } return t;
    }peekLast() {
      return this.oldest_.value_;
    }peekLastKey() {
      return this.oldest_.key_;
    }peekFirstKey() {
      return this.newest_.key_;
    }peek(t) {
      if (this.containsKey(t)) {
        return this.entries_[t].value_;
      }
    }pop() {
      const t = this.oldest_; return delete this.entries_[t.key_], t.newer && (t.newer.older = null), this.oldest_ = t.newer, this.oldest_ || (this.newest_ = null), --this.count_, t.value_;
    }replace(t, e) {
      this.get(t), this.entries_[t].value_ = e;
    }set(t, e) {
      St(!(t in this.entries_), 16); const i = {key_: t, newer: null, older: this.newest_, value_: e}; this.newest_ ? this.newest_.newer = i : this.oldest_ = i, this.newest_ = i, this.entries_[t] = i, ++this.count_;
    }setSize(t) {
      this.highWaterMark = t;
    }
  }; let tl = class extends $a {
    clear() {
      for (;this.getCount() > 0;) {
        this.pop().release();
      } super.clear();
    }expireCache(t) {
      for (;this.canExpireCache();) {
        if (this.peekLast().getKey() in t) {
          break;
        } this.pop().release();
      }
    }pruneExceptNewestZ() {
      if (this.getCount() === 0) {
        return;
      } const t = zo(this.peekFirstKey())[0]; this.forEach(((e)=>{
        e.tileCoord[0] !== t && (this.remove(Ao(e.tileCoord)), e.release());
      }));
    }
  }; const el = [0, 0, 0]; let il = class {
    constructor(t) {
      let e; if (this.minZoom = void 0 !== t.minZoom ? t.minZoom : 0, this.resolutions_ = t.resolutions, St(function (t, e, i) {
        const r = e || n; return t.every((function (e, n) {
          if (n === 0) {
            return !0;
          } const s = r(t[n - 1], e); return !(s > 0 || i && s === 0);
        }));
      }(this.resolutions_, (function (t, e) {
        return e - t;
      }), !0), 17), !t.origins) {
        for (let t = 0, i = this.resolutions_.length - 1; t < i; ++t) {
          if (e) {
            if (this.resolutions_[t] / this.resolutions_[t + 1] !== e) {
              e = void 0; break;
            }
          } else {
            e = this.resolutions_[t] / this.resolutions_[t + 1];
          }
        }
      } this.zoomFactor_ = e, this.maxZoom = this.resolutions_.length - 1, this.origin_ = void 0 !== t.origin ? t.origin : null, this.origins_ = null, void 0 !== t.origins && (this.origins_ = t.origins, St(this.origins_.length == this.resolutions_.length, 20)); const i = t.extent; void 0 === i || this.origin_ || this.origins_ || (this.origin_ = fe(i)), St(!this.origin_ && this.origins_ || this.origin_ && !this.origins_, 18), this.tileSizes_ = null, void 0 !== t.tileSizes && (this.tileSizes_ = t.tileSizes, St(this.tileSizes_.length == this.resolutions_.length, 19)), this.tileSize_ = void 0 !== t.tileSize ? t.tileSize : this.tileSizes_ ? null : Ji, St(!this.tileSize_ && this.tileSizes_ || this.tileSize_ && !this.tileSizes_, 22), this.extent_ = void 0 !== i ? i : null, this.fullTileRanges_ = null, this.tmpSize_ = [0, 0], this.tmpExtent_ = [0, 0, 0, 0], void 0 !== t.sizes ? this.fullTileRanges_ = t.sizes.map((function (t, e) {
        const n = new Ha(Math.min(0, t[0]), Math.max(t[0] - 1, -1), Math.min(0, t[1]), Math.max(t[1] - 1, -1)); if (i) {
          const t = this.getTileRangeForExtentAndZ(i, e); n.minX = Math.max(t.minX, n.minX), n.maxX = Math.min(t.maxX, n.maxX), n.minY = Math.max(t.minY, n.minY), n.maxY = Math.min(t.maxY, n.maxY);
        } return n;
      }), this) : i && this.calculateTileRanges_(i);
    }forEachTileCoord(t, e, i) {
      const n = this.getTileRangeForExtentAndZ(t, e); for (let t = n.minX, r = n.maxX; t <= r; ++t) {
        for (let r = n.minY, s = n.maxY; r <= s; ++r) {
          i([e, t, r]);
        }
      }
    }forEachTileCoordParentTileRange(t, e, i, n) {
      let r; let s; let o; let a = null; let l = t[0] - 1; for (this.zoomFactor_ === 2 ? (s = t[1], o = t[2]) : a = this.getTileCoordExtent(t, n); l >= this.minZoom;) {
        if (this.zoomFactor_ === 2 ? (s = Math.floor(s / 2), o = Math.floor(o / 2), r = Ua(s, s, o, o, i)) : r = this.getTileRangeForExtentAndZ(a, l, i), e(l, r)) {
          return !0;
        } --l;
      } return !1;
    }getExtent() {
      return this.extent_;
    }getMaxZoom() {
      return this.maxZoom;
    }getMinZoom() {
      return this.minZoom;
    }getOrigin(t) {
      return this.origin_ ? this.origin_ : this.origins_[t];
    }getResolution(t) {
      return this.resolutions_[t];
    }getResolutions() {
      return this.resolutions_;
    }getTileCoordChildTileRange(t, e, i) {
      if (t[0] < this.maxZoom) {
        if (this.zoomFactor_ === 2) {
          const i = 2 * t[1]; const n = 2 * t[2]; return Ua(i, i + 1, n, n + 1, e);
        } const n = this.getTileCoordExtent(t, i || this.tmpExtent_); return this.getTileRangeForExtentAndZ(n, t[0] + 1, e);
      } return null;
    }getTileRangeForTileCoordAndZ(t, e, i) {
      if (e > this.maxZoom || e < this.minZoom) {
        return null;
      } const n = t[0]; const r = t[1]; const s = t[2]; if (e === n) {
        return Ua(r, s, r, s, i);
      } if (this.zoomFactor_) {
        const t = Math.pow(this.zoomFactor_, e - n); const o = Math.floor(r * t); const a = Math.floor(s * t); if (e < n) {
          return Ua(o, o, a, a, i);
        } return Ua(o, Math.floor(t * (r + 1)) - 1, a, Math.floor(t * (s + 1)) - 1, i);
      } const o = this.getTileCoordExtent(t, this.tmpExtent_); return this.getTileRangeForExtentAndZ(o, e, i);
    }getTileRangeExtent(t, e, i) {
      const n = this.getOrigin(t); const r = this.getResolution(t); const s = Ps(this.getTileSize(t), this.tmpSize_); const o = n[0] + e.minX * s[0] * r; const a = n[0] + (e.maxX + 1) * s[0] * r; return Ht(o, n[1] + e.minY * s[1] * r, a, n[1] + (e.maxY + 1) * s[1] * r, i);
    }getTileRangeForExtentAndZ(t, e, i) {
      this.getTileCoordForXYAndZ_(t[0], t[3], e, !1, el); const n = el[1]; const r = el[2]; this.getTileCoordForXYAndZ_(t[2], t[1], e, !0, el); return Ua(n, el[1], r, el[2], i);
    }getTileCoordCenter(t) {
      const e = this.getOrigin(t[0]); const i = this.getResolution(t[0]); const n = Ps(this.getTileSize(t[0]), this.tmpSize_); return [e[0] + (t[1] + 0.5) * n[0] * i, e[1] - (t[2] + 0.5) * n[1] * i];
    }getTileCoordExtent(t, e) {
      const i = this.getOrigin(t[0]); const n = this.getResolution(t[0]); const r = Ps(this.getTileSize(t[0]), this.tmpSize_); const s = i[0] + t[1] * r[0] * n; const o = i[1] - (t[2] + 1) * r[1] * n; return Ht(s, o, s + r[0] * n, o + r[1] * n, e);
    }getTileCoordForCoordAndResolution(t, e, i) {
      return this.getTileCoordForXYAndResolution_(t[0], t[1], e, !1, i);
    }getTileCoordForXYAndResolution_(t, e, i, n, r) {
      const s = this.getZForResolution(i); const o = i / this.getResolution(s); const a = this.getOrigin(s); const l = Ps(this.getTileSize(s), this.tmpSize_); let h = o * (t - a[0]) / i / l[0]; let u = o * (a[1] - e) / i / l[1]; return n ? (h = ke(h, 5) - 1, u = ke(u, 5) - 1) : (h = Me(h, 5), u = Me(u, 5)), Po(s, h, u, r);
    }getTileCoordForXYAndZ_(t, e, i, n, r) {
      const s = this.getOrigin(i); const o = this.getResolution(i); const a = Ps(this.getTileSize(i), this.tmpSize_); let l = (t - s[0]) / o / a[0]; let h = (s[1] - e) / o / a[1]; return n ? (l = ke(l, 5) - 1, h = ke(h, 5) - 1) : (l = Me(l, 5), h = Me(h, 5)), Po(i, l, h, r);
    }getTileCoordForCoordAndZ(t, e, i) {
      return this.getTileCoordForXYAndZ_(t[0], t[1], e, !1, i);
    }getTileCoordResolution(t) {
      return this.resolutions_[t[0]];
    }getTileSize(t) {
      return this.tileSize_ ? this.tileSize_ : this.tileSizes_[t];
    }getFullTileRange(t) {
      return this.fullTileRanges_ ? this.fullTileRanges_[t] : this.extent_ ? this.getTileRangeForExtentAndZ(this.extent_, t) : null;
    }getZForResolution(t, e) {
      return we(r(this.resolutions_, t, e || 0), this.minZoom, this.maxZoom);
    }tileCoordIntersectsViewport(t, e) {
      return Pr(e, 0, e.length, 2, this.getTileCoordExtent(t));
    }calculateTileRanges_(t) {
      const e = this.resolutions_.length; const i = new Array(e); for (let n = this.minZoom; n < e; ++n) {
        i[n] = this.getTileRangeForExtentAndZ(t, n);
      } this.fullTileRanges_ = i;
    }
  }; function nl(t) {
    let e = t.getDefaultTileGrid(); return e || (e = function (t, e, i, n) {
      return function (t, e, i, n) {
        n = void 0 !== n ? n : 'top-left'; const r = sl(t, e, i); return new il({extent: t, origin: ue(t, n), resolutions: r, tileSize: i});
      }(ol(t), e, i, n);
    }(t), t.setDefaultTileGrid(e)), e;
  } function rl(t) {
    const e = t || {}; const i = e.extent || En('EPSG:3857').getExtent(); const n = {extent: i, minZoom: e.minZoom, tileSize: e.tileSize, resolutions: sl(i, e.maxZoom, e.tileSize, e.maxResolution)}; return new il(n);
  } function sl(t, e, i, n) {
    e = void 0 !== e ? e : 42, i = Ps(void 0 !== i ? i : Ji); const r = pe(t); const s = ye(t); n = n > 0 ? n : Math.max(s / i[0], r / i[1]); const o = e + 1; const a = new Array(o); for (let t = 0; t < o; ++t) {
      a[t] = n / Math.pow(2, t);
    } return a;
  } function ol(t) {
    let e = (t = En(t)).getExtent(); if (!e) {
      const i = 180 * Qi.degrees / t.getMetersPerUnit(); e = Ht(-i, -i, i, i);
    } return e;
  } class al extends t {
    constructor(t, e) {
      super(t), this.tile = e;
    }
  } let ll = class extends Oa {
    constructor(t) {
      super({attributions: t.attributions, attributionsCollapsible: t.attributionsCollapsible, projection: t.projection, state: t.state, wrapX: t.wrapX, interpolate: t.interpolate}), this.on, this.once, this.un, this.opaque_ = void 0 !== t.opaque && t.opaque, this.tilePixelRatio_ = void 0 !== t.tilePixelRatio ? t.tilePixelRatio : 1, this.tileGrid = void 0 !== t.tileGrid ? t.tileGrid : null; const e = [256, 256]; this.tileGrid && Ps(this.tileGrid.getTileSize(this.tileGrid.getMinZoom()), e), this.tileCache = new tl(t.cacheSize || 0), this.tmpSize = [0, 0], this.key_ = t.key || '', this.tileOptions = {transition: t.transition, interpolate: t.interpolate}, this.zDirection = t.zDirection ? t.zDirection : 0;
    }canExpireCache() {
      return this.tileCache.canExpireCache();
    }expireCache(t, e) {
      const i = this.getTileCacheForProjection(t); i && i.expireCache(e);
    }forEachLoadedTile(t, e, i, n) {
      const r = this.getTileCacheForProjection(t); if (!r) {
        return !1;
      } let s; let o; let a; let l = !0; for (let t = i.minX; t <= i.maxX; ++t) {
        for (let h = i.minY; h <= i.maxY; ++h) {
          o = Lo(e, t, h), a = !1, r.containsKey(o) && (s = r.get(o), a = s.getState() === Bi, a && (a = !1 !== n(s))), a || (l = !1);
        }
      } return l;
    }getGutterForProjection(t) {
      return 0;
    }getKey() {
      return this.key_;
    }setKey(t) {
      this.key_ !== t && (this.key_ = t, this.changed());
    }getOpaque(t) {
      return this.opaque_;
    }getResolutions(t) {
      const e = t ? this.getTileGridForProjection(t) : this.tileGrid; return e ? e.getResolutions() : null;
    }getTile(t, e, i, n, r) {
      return M();
    }getTileGrid() {
      return this.tileGrid;
    }getTileGridForProjection(t) {
      return this.tileGrid ? this.tileGrid : nl(t);
    }getTileCacheForProjection(t) {
      const e = this.getProjection(); return St(e === null || Fn(e, t), 68), this.tileCache;
    }getTilePixelRatio(t) {
      return this.tilePixelRatio_;
    }getTilePixelSize(t, e, i) {
      const n = this.getTileGridForProjection(i); const r = this.getTilePixelRatio(e); const s = Ps(n.getTileSize(t), this.tmpSize); return r == 1 ? s : (o = s, a = r, void 0 === (l = this.tmpSize) && (l = [0, 0]), l[0] = o[0] * a + 0.5 | 0, l[1] = o[1] * a + 0.5 | 0, l); let o; let a; let l;
    }getTileCoordForTileUrlFunction(t, e) {
      e = void 0 !== e ? e : this.getProjection(); const i = this.getTileGridForProjection(e); return this.getWrapX() && e.isGlobal() && (t = function (t, e, i) {
        const n = e[0]; const r = t.getTileCoordCenter(e); const s = ol(i); if (!Vt(s, r)) {
          const e = ye(s); const i = Math.ceil((s[0] - r[0]) / e); return r[0] += e * i, t.getTileCoordForCoordAndZ(r, n);
        } return e;
      }(i, t, e)), function (t, e) {
        const i = t[0]; const n = t[1]; const r = t[2]; if (e.getMinZoom() > i || i > e.getMaxZoom()) {
          return !1;
        } const s = e.getFullTileRange(i); return !s || s.containsXY(n, r);
      }(t, i) ? t : null;
    }clear() {
      this.tileCache.clear();
    }refresh() {
      this.clear(), super.refresh();
    }updateCacheSize(t, e) {
      const i = this.getTileCacheForProjection(e); t > i.highWaterMark && (i.highWaterMark = t);
    }useTile(t, e, i, n) {}
  }; let hl; let ul = !0; try {
    new ImageData(10, 10);
  } catch (t) {
    ul = !1;
  } function cl(t) {
    let e = !0; try {
      new ImageData(10, 10);
    } catch (t) {
      e = !1;
    } function i(t, i, n) {
      return e ? new ImageData(t, i, n) : {data: t, width: i, height: n};
    } return function (e) {
      const n = e.buffers; const r = e.meta; const s = e.imageOps; const o = e.width; const a = e.height; const l = n.length; const h = n[0].byteLength; if (s) {
        const e = new Array(l); for (let t = 0; t < l; ++t) {
          e[t] = i(new Uint8ClampedArray(n[t]), o, a);
        } return t(e, r).data.buffer;
      } const u = new Uint8ClampedArray(h); const c = new Array(l); const d = new Array(l); for (let t = 0; t < l; ++t) {
        c[t] = new Uint8ClampedArray(n[t]), d[t] = [0, 0, 0, 0];
      } for (let e = 0; e < h; e += 4) {
        for (let t = 0; t < l; ++t) {
          const i = c[t]; d[t][0] = i[e], d[t][1] = i[e + 1], d[t][2] = i[e + 2], d[t][3] = i[e + 3];
        } const i = t(d, r); u[e] = i[0], u[e + 1] = i[1], u[e + 2] = i[2], u[e + 3] = i[3];
      } return u.buffer;
    };
  } function dl(t, e) {
    const i = Object.keys(t.lib || {}).map((function (e) {
      return 'const ' + e + ' = ' + t.lib[e].toString() + ';';
    })).concat(['const __minion__ = (' + cl.toString() + ')(', t.operation.toString(), ');', 'self.addEventListener("message", function(event) {', '  const buffer = __minion__(event.data);', '  self.postMessage({buffer: buffer, meta: event.data.meta}, [buffer]);', '});']); const n = new Worker(typeof Blob === 'undefined' ? 'data:text/javascript;base64,' + Buffer.from(i.join('\n'), 'binary').toString('base64') : URL.createObjectURL(new Blob(i, {type: 'text/javascript'}))); return n.addEventListener('message', e), n;
  } class pl extends i {
    constructor(t) {
      let e; super(), this._imageOps = !!t.imageOps, e = t.threads === 0 ? 0 : this._imageOps ? 1 : t.threads || 1; const i = new Array(e); if (e) {
        for (let n = 0; n < e; ++n) {
          i[n] = dl(t, this._onWorkerMessage.bind(this, n));
        }
      } else {
        i[0] = function (t, e) {
          const i = cl(t.operation); let n = !1; return {postMessage(t) {
            setTimeout((function () {
              n || e({data: {buffer: i(t), meta: t.meta}});
            }), 0);
          }, terminate() {
            n = !0;
          }};
        }(t, this._onWorkerMessage.bind(this, 0));
      } this._workers = i, this._queue = [], this._maxQueueLength = t.queue || 1 / 0, this._running = 0, this._dataLookup = {}, this._job = null;
    }process(t, e, i) {
      this._enqueue({inputs: t, meta: e, callback: i}), this._dispatch();
    }_enqueue(t) {
      for (this._queue.push(t); this._queue.length > this._maxQueueLength;) {
        this._queue.shift().callback(null, null);
      }
    }_dispatch() {
      if (this._running || this._queue.length === 0) {
        return;
      } const t = this._queue.shift(); this._job = t; const e = t.inputs[0].width; const i = t.inputs[0].height; const n = t.inputs.map((function (t) {
        return t.data.buffer;
      })); const r = this._workers.length; if (this._running = r, r === 1) {
        return void this._workers[0].postMessage({buffers: n, meta: t.meta, imageOps: this._imageOps, width: e, height: i}, n);
      } const s = t.inputs[0].data.length; const o = 4 * Math.ceil(s / 4 / r); for (let s = 0; s < r; ++s) {
        const r = s * o; const a = []; for (let t = 0, e = n.length; t < e; ++t) {
          a.push(n[t].slice(r, r + o));
        } this._workers[s].postMessage({buffers: a, meta: t.meta, imageOps: this._imageOps, width: e, height: i}, a);
      }
    }_onWorkerMessage(t, e) {
      this.disposed || (this._dataLookup[t] = e.data, --this._running, this._running === 0 && this._resolveJob());
    }_resolveJob() {
      const t = this._job; const e = this._workers.length; let i; let n; if (e === 1) {
        i = new Uint8ClampedArray(this._dataLookup[0].buffer), n = this._dataLookup[0].meta;
      } else {
        const r = t.inputs[0].data.length; i = new Uint8ClampedArray(r), n = new Array(e); const s = 4 * Math.ceil(r / 4 / e); for (let t = 0; t < e; ++t) {
          const e = this._dataLookup[t].buffer; const r = t * s; i.set(new Uint8ClampedArray(e), r), n[t] = this._dataLookup[t].meta;
        }
      } this._job = null, this._dataLookup = {}, t.callback(null, function (t, e, i) {
        if (ul) {
          return new ImageData(t, e, i);
        } hl || (hl = document.createElement('canvas').getContext('2d')); const n = hl.createImageData(e, i); return n.data.set(t), n;
      }(i, t.inputs[0].width, t.inputs[0].height), n), this._dispatch();
    }disposeInternal() {
      for (let t = 0; t < this._workers.length; ++t) {
        this._workers[t].terminate();
      } this._workers.length = 0;
    }
  } const gl = 'beforeoperations'; const fl = 'afteroperations'; class ml extends t {
    constructor(t, e, i) {
      super(t), this.extent = e.extent, this.resolution = e.viewState.resolution / e.pixelRatio, this.data = i;
    }
  } class yl extends Wa {
    constructor(t) {
      super({projection: null}), this.on, this.once, this.un, this.processor_ = null, this.operationType_ = void 0 !== t.operationType ? t.operationType : 'pixel', this.threads_ = void 0 !== t.threads ? t.threads : 1, this.layers_ = function (t) {
        const e = t.length; const i = new Array(e); for (let n = 0; n < e; ++n) {
          i[n] = xl(t[n]);
        } return i;
      }(t.sources); const e = this.changed.bind(this); for (let t = 0, i = this.layers_.length; t < i; ++t) {
        this.layers_[t].addEventListener(g, e);
      } let i; this.useResolutions_ = t.resolutions !== null, this.tileQueue_ = new Ki((function () {
        return 1;
      }), this.changed.bind(this)), this.requestedFrameState_, this.renderedImageCanvas_ = null, this.renderedRevision_, this.frameState_ = {animate: !1, coordinateToPixelTransform: [1, 0, 0, 1, 0, 0], declutterTree: null, extent: null, index: 0, layerIndex: 0, layerStatesArray: (i = this.layers_, i.map((function (t) {
        return t.getLayerState();
      }))), pixelRatio: 1, pixelToCoordinateTransform: [1, 0, 0, 1, 0, 0], postRenderFunctions: [], size: [0, 0], tileQueue: this.tileQueue_, time: Date.now(), usedTiles: {}, viewState: {rotation: 0}, viewHints: [], wantedTiles: {}, mapId: F(this), renderTargets: {}}, this.setAttributions((function (e) {
        const i = []; for (let n = 0, r = t.sources.length; n < r; ++n) {
          const r = t.sources[n]; const s = r instanceof Oa ? r : r.getSource(); if (!s) {
            continue;
          } const o = s.getAttributions(); if (typeof o === 'function') {
            const t = o(e); i.push.apply(i, t);
          }
        } return i.length !== 0 ? i : null;
      })), void 0 !== t.operation && this.setOperation(t.operation, t.lib);
    }setOperation(t, e) {
      this.processor_ && this.processor_.dispose(), this.processor_ = new pl({operation: t, imageOps: this.operationType_ === 'image', queue: 1, lib: e, threads: this.threads_}), this.changed();
    }updateFrameState_(t, e, i) {
      const n = Object.assign({}, this.frameState_); n.viewState = Object.assign({}, n.viewState); const r = he(t); n.size[0] = Math.ceil(ye(t) / e), n.size[1] = Math.ceil(pe(t) / e), n.extent = [r[0] - n.size[0] * e / 2, r[1] - n.size[1] * e / 2, r[0] + n.size[0] * e / 2, r[1] + n.size[1] * e / 2], n.time = Date.now(); const s = n.viewState; return s.center = r, s.projection = i, s.resolution = e, n;
    }allSourcesReady_() {
      let t; let e = !0; for (let i = 0, n = this.layers_.length; i < n; ++i) {
        if (t = this.layers_[i].getSource(), !t || t.getState() !== 'ready') {
          e = !1; break;
        }
      } return e;
    }getImage(t, e, i, n) {
      if (!this.allSourcesReady_()) {
        return null;
      } e = this.findNearestResolution(e); const r = this.updateFrameState_(t, e, n); if (this.requestedFrameState_ = r, this.renderedImageCanvas_) {
        const t = this.renderedImageCanvas_.getResolution(); const i = this.renderedImageCanvas_.getExtent(); e === t && te(r.extent, i) || (this.renderedImageCanvas_ = null);
      } return this.renderedImageCanvas_ && this.getRevision() === this.renderedRevision_ || this.processSources_(), r.tileQueue.loadMoreTiles(16, 16), r.animate && requestAnimationFrame(this.changed.bind(this)), this.renderedImageCanvas_;
    }processSources_() {
      const t = this.requestedFrameState_; const e = this.layers_.length; const i = new Array(e); for (let n = 0; n < e; ++n) {
        t.layerIndex = n; const e = vl(this.layers_[n], t); if (!e) {
          return;
        } i[n] = e;
      } const n = {}; this.dispatchEvent(new ml(gl, t, n)), this.processor_.process(i, n, this.onWorkerComplete_.bind(this, t));
    }onWorkerComplete_(t, e, i, n) {
      if (e || !i) {
        return;
      } const r = t.extent; const s = t.viewState.resolution; if (s !== this.requestedFrameState_.viewState.resolution || !te(r, this.requestedFrameState_.extent)) {
        return;
      } let o; if (this.renderedImageCanvas_) {
        o = this.renderedImageCanvas_.getImage().getContext('2d');
      } else {
        o = K(Math.round(ye(r) / s), Math.round(pe(r) / s)), this.renderedImageCanvas_ = new Ea(r, s, 1, o.canvas);
      }o.putImageData(i, 0, 0), this.changed(), this.renderedRevision_ = this.getRevision(), this.dispatchEvent(new ml(fl, t, n)), t.animate && requestAnimationFrame(this.changed.bind(this));
    }getResolutions(t) {
      if (!this.useResolutions_) {
        return null;
      } let e = super.getResolutions(); if (!e) {
        for (let i = 0, n = this.layers_.length; i < n; ++i) {
          if (e = this.layers_[i].getSource().getResolutions(t), e) {
            break;
          }
        }
      } return e;
    }disposeInternal() {
      this.processor_ && this.processor_.dispose(), super.disposeInternal();
    }
  }yl.prototype.dispose; let _l = null; function vl(t, e) {
    const i = t.getRenderer(); if (!i) {
      throw new Error('Unsupported layer type: ' + t);
    } if (!i.prepareFrame(e)) {
      return null;
    } const n = e.size[0]; const r = e.size[1]; if (n === 0 || r === 0) {
      return null;
    } const s = i.renderFrame(e, null); let o; if (s instanceof HTMLCanvasElement) {
      o = s;
    } else {
      if (s && (o = s.firstElementChild), !(o instanceof HTMLCanvasElement)) {
        throw new Error('Unsupported rendered element: ' + o);
      } if (o.width === n && o.height === r) {
        return o.getContext('2d').getImageData(0, 0, n, r);
      }
    } if (_l) {
      const t = _l.canvas; t.width !== n || t.height !== r ? _l = K(n, r, void 0, {willReadFrequently: !0}) : _l.clearRect(0, 0, n, r);
    } else {
      _l = K(n, r, void 0, {willReadFrequently: !0});
    } return _l.drawImage(o, 0, 0, n, r), _l.getImageData(0, 0, n, r);
  } function xl(t) {
    let e; return t instanceof Oa ? t instanceof ll ? e = new Qa({source: t}) : t instanceof Wa && (e = new Qo({source: t})) : e = t, e;
  } let bl = yl; let wl = 'tileloadstart'; let Cl = 'tileloadend'; let Sl = 'tileloaderror'; class Tl extends ll {
    constructor(t) {
      super({attributions: t.attributions, cacheSize: t.cacheSize, opaque: t.opaque, projection: t.projection, state: t.state, tileGrid: t.tileGrid, tilePixelRatio: t.tilePixelRatio, wrapX: t.wrapX, transition: t.transition, interpolate: t.interpolate, key: t.key, attributionsCollapsible: t.attributionsCollapsible, zDirection: t.zDirection}), this.generateTileUrlFunction_ = this.tileUrlFunction === Tl.prototype.tileUrlFunction, this.tileLoadFunction = t.tileLoadFunction, t.tileUrlFunction && (this.tileUrlFunction = t.tileUrlFunction), this.urls = null, t.urls ? this.setUrls(t.urls) : t.url && this.setUrl(t.url), this.tileLoadingKeys_ = {};
    }getTileLoadFunction() {
      return this.tileLoadFunction;
    }getTileUrlFunction() {
      return Object.getPrototypeOf(this).tileUrlFunction === this.tileUrlFunction ? this.tileUrlFunction.bind(this) : this.tileUrlFunction;
    }getUrls() {
      return this.urls;
    }handleTileChange(t) {
      const e = t.target; const i = F(e); const n = e.getState(); let r; n == qi ? (this.tileLoadingKeys_[i] = !0, r = wl) : i in this.tileLoadingKeys_ && (delete this.tileLoadingKeys_[i], r = n == Vi ? Sl : n == Bi ? Cl : void 0), r != null && this.dispatchEvent(new al(r, e));
    }setTileLoadFunction(t) {
      this.tileCache.clear(), this.tileLoadFunction = t, this.changed();
    }setTileUrlFunction(t, e) {
      this.tileUrlFunction = t, this.tileCache.pruneExceptNewestZ(), void 0 !== e ? this.setKey(e) : this.changed();
    }setUrl(t) {
      const e = jo(t); this.urls = e, this.setUrls(e);
    }setUrls(t) {
      this.urls = t; const e = t.join('\n'); this.generateTileUrlFunction_ ? this.setTileUrlFunction(Do(t, this.tileGrid), e) : this.setKey(e);
    }tileUrlFunction(t, e, i) {}useTile(t, e, i) {
      const n = Lo(t, e, i); this.tileCache.containsKey(n) && this.tileCache.get(n);
    }
  } let El = Tl; function Rl(t, e) {
    t.getImage().src = e;
  } let Il = class extends El {
    constructor(t) {
      super({attributions: t.attributions, cacheSize: t.cacheSize, opaque: t.opaque, projection: t.projection, state: t.state, tileGrid: t.tileGrid, tileLoadFunction: t.tileLoadFunction ? t.tileLoadFunction : Rl, tilePixelRatio: t.tilePixelRatio, tileUrlFunction: t.tileUrlFunction, url: t.url, urls: t.urls, wrapX: t.wrapX, transition: t.transition, interpolate: void 0 === t.interpolate || t.interpolate, key: t.key, attributionsCollapsible: t.attributionsCollapsible, zDirection: t.zDirection}), this.crossOrigin = void 0 !== t.crossOrigin ? t.crossOrigin : null, this.tileClass = void 0 !== t.tileClass ? t.tileClass : Ya, this.tileCacheForProjection = {}, this.tileGridForProjection = {}, this.reprojectionErrorThreshold_ = t.reprojectionErrorThreshold, this.renderReprojectionEdges_ = !1;
    }canExpireCache() {
      if (this.tileCache.canExpireCache()) {
        return !0;
      } for (const t in this.tileCacheForProjection) {
        if (this.tileCacheForProjection[t].canExpireCache()) {
          return !0;
        }
      } return !1;
    }expireCache(t, e) {
      const i = this.getTileCacheForProjection(t); this.tileCache.expireCache(this.tileCache == i ? e : {}); for (const t in this.tileCacheForProjection) {
        const n = this.tileCacheForProjection[t]; n.expireCache(n == i ? e : {});
      }
    }getGutterForProjection(t) {
      return this.getProjection() && t && !Fn(this.getProjection(), t) ? 0 : this.getGutter();
    }getGutter() {
      return 0;
    }getKey() {
      let t = super.getKey(); return this.getInterpolate() || (t += ':disable-interpolation'), t;
    }getOpaque(t) {
      return !(this.getProjection() && t && !Fn(this.getProjection(), t)) && super.getOpaque(t);
    }getTileGridForProjection(t) {
      const e = this.getProjection(); if (this.tileGrid && (!e || Fn(e, t))) {
        return this.tileGrid;
      } const i = F(t); return i in this.tileGridForProjection || (this.tileGridForProjection[i] = nl(t)), this.tileGridForProjection[i];
    }getTileCacheForProjection(t) {
      const e = this.getProjection(); if (!e || Fn(e, t)) {
        return this.tileCache;
      } const i = F(t); return i in this.tileCacheForProjection || (this.tileCacheForProjection[i] = new tl(this.tileCache.highWaterMark)), this.tileCacheForProjection[i];
    }createTile_(t, e, i, n, r, s) {
      const o = [t, e, i]; const a = this.getTileCoordForTileUrlFunction(o, r); const l = a ? this.tileUrlFunction(a, n, r) : void 0; const h = new this.tileClass(o, void 0 !== l ? Xi : Yi, void 0 !== l ? l : '', this.crossOrigin, this.tileLoadFunction, this.tileOptions); return h.key = s, h.addEventListener(g, this.handleTileChange.bind(this)), h;
    }getTile(t, e, i, n, r) {
      const s = this.getProjection(); if (!s || !r || Fn(s, r)) {
        return this.getTileInternal(t, e, i, n, s || r);
      } const o = this.getTileCacheForProjection(r); const a = [t, e, i]; let l; const h = Ao(a); o.containsKey(h) && (l = o.get(h)); const u = this.getKey(); if (l && l.key == u) {
        return l;
      } const c = this.getTileGridForProjection(s); const d = this.getTileGridForProjection(r); const p = this.getTileCoordForTileUrlFunction(a, r); const g = new Ka(s, c, r, d, a, p, this.getTilePixelRatio(n), this.getGutter(), ((t, e, i, n)=>this.getTileInternal(t, e, i, n, s)), this.reprojectionErrorThreshold_, this.renderReprojectionEdges_, this.getInterpolate()); return g.key = u, l ? (g.interimTile = l, g.refreshInterimChain(), o.replace(h, g)) : o.set(h, g), g;
    }getTileInternal(t, e, i, n, r) {
      let s = null; const o = Lo(t, e, i); const a = this.getKey(); if (this.tileCache.containsKey(o)) {
        if (s = this.tileCache.get(o), s.key != a) {
          const l = s; s = this.createTile_(t, e, i, n, r, a), l.getState() == Xi ? s.interimTile = l.interimTile : s.interimTile = l, s.refreshInterimChain(), this.tileCache.replace(o, s);
        }
      } else {
        s = this.createTile_(t, e, i, n, r, a), this.tileCache.set(o, s);
      } return s;
    }setRenderReprojectionEdges(t) {
      if (this.renderReprojectionEdges_ != t) {
        this.renderReprojectionEdges_ = t; for (const t in this.tileCacheForProjection) {
          this.tileCacheForProjection[t].clear();
        } this.changed();
      }
    }setTileGridForProjection(t, e) {
      const i = En(t); if (i) {
        const t = F(i); t in this.tileGridForProjection || (this.tileGridForProjection[t] = e);
      }
    }clear() {
      super.clear(); for (const t in this.tileCacheForProjection) {
        this.tileCacheForProjection[t].clear();
      }
    }
  }; let Ml = class extends Il {
    constructor(t) {
      if (super({attributions: t.attributions, cacheSize: t.cacheSize, crossOrigin: t.crossOrigin, interpolate: t.interpolate, projection: En('EPSG:3857'), reprojectionErrorThreshold: t.reprojectionErrorThreshold, state: 'loading', tileLoadFunction: t.tileLoadFunction, wrapX: void 0 === t.wrapX || t.wrapX, transition: t.transition, zDirection: t.zDirection}), this.tileJSON_ = null, this.tileSize_ = t.tileSize, t.url) {
        if (t.jsonp) {
          !function (t, e, i, n) {
            const r = document.createElement('script'); const s = 'olc_' + F(e); function o() {
              delete window[s], r.parentNode.removeChild(r);
            }r.async = !0, r.src = t + (t.includes('?') ? '&' : '?') + (n || 'callback') + '=' + s; const a = setTimeout((function () {
              o(), i && i();
            }), 1e4); window[s] = function (t) {
              clearTimeout(a), o(), e(t);
            }, document.head.appendChild(r);
          }(t.url, this.handleTileJSONResponse.bind(this), this.handleTileJSONError.bind(this));
        } else {
          const e = new XMLHttpRequest(); e.addEventListener('load', this.onXHRLoad_.bind(this)), e.addEventListener('error', this.onXHRError_.bind(this)), e.open('GET', t.url), e.send();
        }
      } else {
        t.tileJSON ? this.handleTileJSONResponse(t.tileJSON) : St(!1, 51);
      }
    }onXHRLoad_(t) {
      const e = t.target; if (!e.status || e.status >= 200 && e.status < 300) {
        let t; try {
          t = JSON.parse(e.responseText);
        } catch (t) {
          return void this.handleTileJSONError();
        } this.handleTileJSONResponse(t);
      } else {
        this.handleTileJSONError();
      }
    }onXHRError_(t) {
      this.handleTileJSONError();
    }getTileJSON() {
      return this.tileJSON_;
    }handleTileJSONResponse(t) {
      const e = En('EPSG:4326'); const i = this.getProjection(); let n; if (void 0 !== t.bounds) {
        const r = Pn(e, i); n = xe(t.bounds, r);
      } const r = ol(i); const s = t.minzoom || 0; const o = rl({extent: r, maxZoom: t.maxzoom || 22, minZoom: s, tileSize: this.tileSize_}); if (this.tileGrid = o, this.tileUrlFunction = Do(t.tiles, o), t.attribution && !this.getAttributions()) {
        const e = void 0 !== n ? n : r; this.setAttributions((function (i) {
          return _e(e, i.extent) ? [t.attribution] : null;
        }));
      } this.tileJSON_ = t, this.setState('ready');
    }handleTileJSONError() {
      this.setState('error');
    }
  }; function kl(t, e, i, n, r) {
    Fl(t, e, i || 0, n || t.length - 1, r || Ll);
  } function Fl(t, e, i, n, r) {
    for (;n > i;) {
      if (n - i > 600) {
        let s = n - i + 1; let o = e - i + 1; let a = Math.log(s); let l = 0.5 * Math.exp(2 * a / 3); let h = 0.5 * Math.sqrt(a * l * (s - l) / s) * (o - s / 2 < 0 ? -1 : 1); Fl(t, e, Math.max(i, Math.floor(e - o * l / s + h)), Math.min(n, Math.floor(e + (s - o) * l / s + h)), r);
      } let u = t[e]; let c = i; let d = n; for (Pl(t, i, e), r(t[n], u) > 0 && Pl(t, i, n); c < d;) {
        for (Pl(t, c, d), c++, d--; r(t[c], u) < 0;) {
          c++;
        } for (;r(t[d], u) > 0;) {
          d--;
        }
      }r(t[i], u) === 0 ? Pl(t, i, d) : Pl(t, ++d, n), d <= e && (i = d + 1), e <= d && (n = d - 1);
    }
  } function Pl(t, e, i) {
    let n = t[e]; t[e] = t[i], t[i] = n;
  } function Ll(t, e) {
    return t < e ? -1 : t > e ? 1 : 0;
  } class Al {
    constructor(t = 9) {
      this._maxEntries = Math.max(4, t), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
    }all() {
      return this._all(this.data, []);
    }search(t) {
      let e = this.data; const i = []; if (!Vl(t, e)) {
        return i;
      } const n = this.toBBox; const r = []; for (;e;) {
        for (let s = 0; s < e.children.length; s++) {
          const o = e.children[s]; const a = e.leaf ? n(o) : o; Vl(t, a) && (e.leaf ? i.push(o) : Bl(t, a) ? this._all(o, i) : r.push(o));
        }e = r.pop();
      } return i;
    }collides(t) {
      let e = this.data; if (!Vl(t, e)) {
        return !1;
      } const i = []; for (;e;) {
        for (let n = 0; n < e.children.length; n++) {
          const r = e.children[n]; const s = e.leaf ? this.toBBox(r) : r; if (Vl(t, s)) {
            if (e.leaf || Bl(t, s)) {
              return !0;
            } i.push(r);
          }
        }e = i.pop();
      } return !1;
    }load(t) {
      if (!t || !t.length) {
        return this;
      } if (t.length < this._minEntries) {
        for (let e = 0; e < t.length; e++) {
          this.insert(t[e]);
        } return this;
      } let e = this._build(t.slice(), 0, t.length - 1, 0); if (this.data.children.length) {
        if (this.data.height === e.height) {
          this._splitRoot(this.data, e);
        } else {
          if (this.data.height < e.height) {
            const t = this.data; this.data = e, e = t;
          } this._insert(e, this.data.height - e.height - 1, !0);
        }
      } else {
        this.data = e;
      } return this;
    }insert(t) {
      return t && this._insert(t, this.data.height - 1), this;
    }clear() {
      return this.data = Yl([]), this;
    }remove(t, e) {
      if (!t) {
        return this;
      } let i = this.data; const n = this.toBBox(t); const r = []; const s = []; let o; let a; let l; for (;i || r.length;) {
        if (i || (i = r.pop(), a = r[r.length - 1], o = s.pop(), l = !0), i.leaf) {
          const n = zl(t, i.children, e); if (n !== -1) {
            return i.children.splice(n, 1), r.push(i), this._condense(r), this;
          }
        }l || i.leaf || !Bl(i, n) ? a ? (o++, i = a.children[o], l = !1) : i = null : (r.push(i), s.push(o), o = 0, a = i, i = i.children[0]);
      } return this;
    }toBBox(t) {
      return t;
    }compareMinX(t, e) {
      return t.minX - e.minX;
    }compareMinY(t, e) {
      return t.minY - e.minY;
    }toJSON() {
      return this.data;
    }fromJSON(t) {
      return this.data = t, this;
    }_all(t, e) {
      const i = []; for (;t;) {
        t.leaf ? e.push(...t.children) : i.push(...t.children), t = i.pop();
      } return e;
    }_build(t, e, i, n) {
      const r = i - e + 1; let s; let o = this._maxEntries; if (r <= o) {
        return s = Yl(t.slice(e, i + 1)), Ol(s, this.toBBox), s;
      } n || (n = Math.ceil(Math.log(r) / Math.log(o)), o = Math.ceil(r / Math.pow(o, n - 1))), s = Yl([]), s.leaf = !1, s.height = n; const a = Math.ceil(r / o); const l = a * Math.ceil(Math.sqrt(o)); Kl(t, e, i, l, this.compareMinX); for (let r = e; r <= i; r += l) {
        const e = Math.min(r + l - 1, i); Kl(t, r, e, a, this.compareMinY); for (let i = r; i <= e; i += a) {
          const r = Math.min(i + a - 1, e); s.children.push(this._build(t, i, r, n - 1));
        }
      } return Ol(s, this.toBBox), s;
    }_chooseSubtree(t, e, i, n) {
      for (;n.push(e), !e.leaf && n.length - 1 !== i;) {
        let i; let n = 1 / 0; let o = 1 / 0; for (let a = 0; a < e.children.length; a++) {
          const l = e.children[a]; const h = Wl(l); const u = (r = t, s = l, (Math.max(s.maxX, r.maxX) - Math.min(s.minX, r.minX)) * (Math.max(s.maxY, r.maxY) - Math.min(s.minY, r.minY)) - h); u < o ? (o = u, n = h < n ? h : n, i = l) : u === o && h < n && (n = h, i = l);
        }e = i || e.children[0];
      } let r; let s; return e;
    }_insert(t, e, i) {
      const n = i ? t : this.toBBox(t); const r = []; const s = this._chooseSubtree(n, this.data, e, r); for (s.children.push(t), jl(s, n); e >= 0 && r[e].children.length > this._maxEntries;) {
        this._split(r, e), e--;
      } this._adjustParentBBoxes(n, r, e);
    }_split(t, e) {
      const i = t[e]; const n = i.children.length; const r = this._minEntries; this._chooseSplitAxis(i, r, n); const s = this._chooseSplitIndex(i, r, n); const o = Yl(i.children.splice(s, i.children.length - s)); o.height = i.height, o.leaf = i.leaf, Ol(i, this.toBBox), Ol(o, this.toBBox), e ? t[e - 1].children.push(o) : this._splitRoot(i, o);
    }_splitRoot(t, e) {
      this.data = Yl([t, e]), this.data.height = t.height + 1, this.data.leaf = !1, Ol(this.data, this.toBBox);
    }_chooseSplitIndex(t, e, i) {
      let n; let r = 1 / 0; let s = 1 / 0; for (let o = e; o <= i - e; o++) {
        const e = Dl(t, 0, o, this.toBBox); const a = Dl(t, o, i, this.toBBox); const l = ql(e, a); const h = Wl(e) + Wl(a); l < r ? (r = l, n = o, s = h < s ? h : s) : l === r && h < s && (s = h, n = o);
      } return n || i - e;
    }_chooseSplitAxis(t, e, i) {
      const n = t.leaf ? this.compareMinX : Gl; const r = t.leaf ? this.compareMinY : Nl; this._allDistMargin(t, e, i, n) < this._allDistMargin(t, e, i, r) && t.children.sort(n);
    }_allDistMargin(t, e, i, n) {
      t.children.sort(n); const r = this.toBBox; const s = Dl(t, 0, e, r); const o = Dl(t, i - e, i, r); let a = Xl(s) + Xl(o); for (let n = e; n < i - e; n++) {
        const e = t.children[n]; jl(s, t.leaf ? r(e) : e), a += Xl(s);
      } for (let n = i - e - 1; n >= e; n--) {
        const e = t.children[n]; jl(o, t.leaf ? r(e) : e), a += Xl(o);
      } return a;
    }_adjustParentBBoxes(t, e, i) {
      for (let n = i; n >= 0; n--) {
        jl(e[n], t);
      }
    }_condense(t) {
      for (let e, i = t.length - 1; i >= 0; i--) {
        t[i].children.length === 0 ? i > 0 ? (e = t[i - 1].children, e.splice(e.indexOf(t[i]), 1)) : this.clear() : Ol(t[i], this.toBBox);
      }
    }
  } function zl(t, e, i) {
    if (!i) {
      return e.indexOf(t);
    } for (let n = 0; n < e.length; n++) {
      if (i(t, e[n])) {
        return n;
      }
    } return -1;
  } function Ol(t, e) {
    Dl(t, 0, t.children.length, e, t);
  } function Dl(t, e, i, n, r) {
    r || (r = Yl(null)), r.minX = 1 / 0, r.minY = 1 / 0, r.maxX = -1 / 0, r.maxY = -1 / 0; for (let s = e; s < i; s++) {
      const e = t.children[s]; jl(r, t.leaf ? n(e) : e);
    } return r;
  } function jl(t, e) {
    return t.minX = Math.min(t.minX, e.minX), t.minY = Math.min(t.minY, e.minY), t.maxX = Math.max(t.maxX, e.maxX), t.maxY = Math.max(t.maxY, e.maxY), t;
  } function Gl(t, e) {
    return t.minX - e.minX;
  } function Nl(t, e) {
    return t.minY - e.minY;
  } function Wl(t) {
    return (t.maxX - t.minX) * (t.maxY - t.minY);
  } function Xl(t) {
    return t.maxX - t.minX + (t.maxY - t.minY);
  } function ql(t, e) {
    const i = Math.max(t.minX, e.minX); const n = Math.max(t.minY, e.minY); const r = Math.min(t.maxX, e.maxX); const s = Math.min(t.maxY, e.maxY); return Math.max(0, r - i) * Math.max(0, s - n);
  } function Bl(t, e) {
    return t.minX <= e.minX && t.minY <= e.minY && e.maxX <= t.maxX && e.maxY <= t.maxY;
  } function Vl(t, e) {
    return e.minX <= t.maxX && e.minY <= t.maxY && e.maxX >= t.minX && e.maxY >= t.minY;
  } function Yl(t) {
    return {children: t, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0};
  } function Kl(t, e, i, n, r) {
    const s = [e, i]; for (;s.length;) {
      if ((i = s.pop()) - (e = s.pop()) <= n) {
        continue;
      } const o = e + Math.ceil((i - e) / n / 2) * n; kl(t, o, e, i, r), s.push(e, o, o, i);
    }
  } function Zl(t) {
    return new Mo({fill: Ul(t, ''), stroke: Hl(t, ''), text: Jl(t), image: Ql(t)});
  } function Ul(t, e) {
    const i = t[e + 'fill-color']; if (i) {
      return new Us({color: i});
    }
  } function Hl(t, e) {
    const i = t[e + 'stroke-width']; const n = t[e + 'stroke-color']; if (i || n) {
      return new So({width: i, color: n, lineCap: t[e + 'stroke-line-cap'], lineJoin: t[e + 'stroke-line-join'], lineDash: t[e + 'stroke-line-dash'], lineDashOffset: t[e + 'stroke-line-dash-offset'], miterLimit: t[e + 'stroke-miter-limit']});
    }
  } function Jl(t) {
    const e = t['text-value']; if (!e) {
      return;
    } return new Fo({text: e, font: t['text-font'], maxAngle: t['text-max-angle'], offsetX: t['text-offset-x'], offsetY: t['text-offset-y'], overflow: t['text-overflow'], placement: t['text-placement'], scale: t['text-scale'], rotateWithView: t['text-rotate-with-view'], rotation: t['text-rotation'], textAlign: t['text-align'], justify: t['text-justify'], textBaseline: t['text-baseline'], padding: t['text-padding'], fill: Ul(t, 'text-'), backgroundFill: Ul(t, 'text-background-'), stroke: Hl(t, 'text-'), backgroundStroke: Hl(t, 'text-background-')});
  } function Ql(t) {
    const e = t['icon-src']; const i = t['icon-img']; if (e || i) {
      return new eo({src: e, img: i, imgSize: t['icon-img-size'], anchor: t['icon-anchor'], anchorOrigin: t['icon-anchor-origin'], anchorXUnits: t['icon-anchor-x-units'], anchorYUnits: t['icon-anchor-y-units'], color: t['icon-color'], crossOrigin: t['icon-cross-origin'], offset: t['icon-offset'], displacement: t['icon-displacement'], opacity: t['icon-opacity'], scale: t['icon-scale'], rotation: t['icon-rotation'], rotateWithView: t['icon-rotate-with-view'], size: t['icon-size'], declutterMode: t['icon-declutter-mode']});
    } const n = t['shape-points']; if (n) {
      const e = 'shape-'; return new Vs({points: n, fill: Ul(t, e), stroke: Hl(t, e), radius: t['shape-radius'], radius1: t['shape-radius1'], radius2: t['shape-radius2'], angle: t['shape-angle'], displacement: t['shape-displacement'], rotation: t['shape-rotation'], rotateWithView: t['shape-rotate-with-view'], scale: t['shape-scale'], declutterMode: t['shape-declutter-mode']});
    } const r = t['circle-radius']; if (r) {
      const e = 'circle-'; return new Ks({radius: r, fill: Ul(t, e), stroke: Hl(t, e), displacement: t['circle-displacement'], scale: t['circle-scale'], rotation: t['circle-rotation'], rotateWithView: t['circle-rotate-with-view'], declutterMode: t['circle-declutter-mode']});
    }
  } const $l = 'renderOrder'; let th = class extends ni {
    constructor(t) {
      t = t || {}; const e = Object.assign({}, t); delete e.style, delete e.renderBuffer, delete e.updateWhileAnimating, delete e.updateWhileInteracting, super(e), this.declutter_ = void 0 !== t.declutter && t.declutter, this.renderBuffer_ = void 0 !== t.renderBuffer ? t.renderBuffer : 100, this.style_ = null, this.styleFunction_ = void 0, this.setStyle(t.style), this.updateWhileAnimating_ = void 0 !== t.updateWhileAnimating && t.updateWhileAnimating, this.updateWhileInteracting_ = void 0 !== t.updateWhileInteracting && t.updateWhileInteracting;
    }getDeclutter() {
      return this.declutter_;
    }getFeatures(t) {
      return super.getFeatures(t);
    }getRenderBuffer() {
      return this.renderBuffer_;
    }getRenderOrder() {
      return this.get($l);
    }getStyle() {
      return this.style_;
    }getStyleFunction() {
      return this.styleFunction_;
    }getUpdateWhileAnimating() {
      return this.updateWhileAnimating_;
    }getUpdateWhileInteracting() {
      return this.updateWhileInteracting_;
    }renderDeclutter(t) {
      t.declutterTree || (t.declutterTree = new Al(9)), this.getRenderer().renderDeclutter(t);
    }setRenderOrder(t) {
      this.set($l, t);
    }setStyle(t) {
      let e; if (void 0 === t) {
        e = Ro;
      } else if (t === null) {
        e = null;
      } else if (typeof t === 'function') {
        e = t;
      } else if (t instanceof Mo) {
        e = t;
      } else if (Array.isArray(t)) {
        const i = t.length; const n = new Array(i); for (let e = 0; e < i; ++e) {
          const i = t[e]; n[e] = i instanceof Mo ? i : Zl(i);
        }e = n;
      } else {
        e = Zl(t);
      } this.style_ = e, this.styleFunction_ = t === null ? void 0 : function (t) {
        let e; if (typeof t === 'function') {
          e = t;
        } else {
          let i; Array.isArray(t) ? i = t : (St(typeof t.getZIndex === 'function', 41), i = [t]), e = function () {
            return i;
          };
        } return e;
      }(this.style_), this.changed();
    }
  }; const eh = {BEGIN_GEOMETRY: 0, BEGIN_PATH: 1, CIRCLE: 2, CLOSE_PATH: 3, CUSTOM: 4, DRAW_CHARS: 5, DRAW_IMAGE: 6, END_GEOMETRY: 7, FILL: 8, MOVE_TO_LINE_TO: 9, SET_FILL_STYLE: 10, SET_STROKE_STYLE: 11, STROKE: 12}; const ih = [eh.FILL]; const nh = [eh.STROKE]; const rh = [eh.BEGIN_PATH]; const sh = [eh.CLOSE_PATH]; let oh = eh; let ah = class {
    drawCustom(t, e, i, n) {}drawGeometry(t) {}setStyle(t) {}drawCircle(t, e) {}drawFeature(t, e) {}drawGeometryCollection(t, e) {}drawLineString(t, e) {}drawMultiLineString(t, e) {}drawMultiPoint(t, e) {}drawMultiPolygon(t, e) {}drawPoint(t, e) {}drawPolygon(t, e) {}drawText(t, e) {}setFillStrokeStyle(t, e) {}setImageStyle(t, e) {}setTextStyle(t, e) {}
  }; let lh = class extends ah {
    constructor(t, e, i, n) {
      super(), this.tolerance = t, this.maxExtent = e, this.pixelRatio = n, this.maxLineWidth = 0, this.resolution = i, this.beginGeometryInstruction1_ = null, this.beginGeometryInstruction2_ = null, this.bufferedMaxExtent_ = null, this.instructions = [], this.coordinates = [], this.tmpCoordinate_ = [], this.hitDetectionInstructions = [], this.state = {};
    }applyPixelRatio(t) {
      const e = this.pixelRatio; return e == 1 ? t : t.map((function (t) {
        return t * e;
      }));
    }appendFlatPointCoordinates(t, e) {
      const i = this.getBufferedMaxExtent(); const n = this.tmpCoordinate_; const r = this.coordinates; let s = r.length; for (let o = 0, a = t.length; o < a; o += e) {
        n[0] = t[o], n[1] = t[o + 1], Vt(i, n) && (r[s++] = n[0], r[s++] = n[1]);
      } return s;
    }appendFlatLineCoordinates(t, e, i, n, r, s) {
      const o = this.coordinates; let a = o.length; const l = this.getBufferedMaxExtent(); s && (e += n); let h = t[e]; let u = t[e + 1]; const c = this.tmpCoordinate_; let d; let p; let g; let f = !0; for (d = e + n; d < i; d += n) {
        c[0] = t[d], c[1] = t[d + 1], g = Zt(l, c), g !== p ? (f && (o[a++] = h, o[a++] = u, f = !1), o[a++] = c[0], o[a++] = c[1]) : g === Ot ? (o[a++] = c[0], o[a++] = c[1], f = !1) : f = !0, h = c[0], u = c[1], p = g;
      } return (r && f || d === e + n) && (o[a++] = h, o[a++] = u), a;
    }drawCustomCoordinates_(t, e, i, n, r) {
      for (let s = 0, o = i.length; s < o; ++s) {
        const o = i[s]; const a = this.appendFlatLineCoordinates(t, e, o, n, !1, !1); r.push(a), e = o;
      } return e;
    }drawCustom(t, e, i, n) {
      this.beginGeometry(t, e); const r = t.getType(); const s = t.getStride(); const o = this.coordinates.length; let a; let l; let h; let u; let c; switch (r) {
        case 'MultiPolygon':a = t.getOrientedFlatCoordinates(), u = []; const e = t.getEndss(); c = 0; for (let t = 0, i = e.length; t < i; ++t) {
          const i = []; c = this.drawCustomCoordinates_(a, c, e[t], s, i), u.push(i);
        } this.instructions.push([oh.CUSTOM, o, u, t, i, _r]), this.hitDetectionInstructions.push([oh.CUSTOM, o, u, t, n || i, _r]); break; case 'Polygon':case 'MultiLineString':h = [], a = r == 'Polygon' ? t.getOrientedFlatCoordinates() : t.getFlatCoordinates(), c = this.drawCustomCoordinates_(a, 0, t.getEnds(), s, h), this.instructions.push([oh.CUSTOM, o, h, t, i, yr]), this.hitDetectionInstructions.push([oh.CUSTOM, o, h, t, n || i, yr]); break; case 'LineString':case 'Circle':a = t.getFlatCoordinates(), l = this.appendFlatLineCoordinates(a, 0, a.length, s, !1, !1), this.instructions.push([oh.CUSTOM, o, l, t, i, mr]), this.hitDetectionInstructions.push([oh.CUSTOM, o, l, t, n || i, mr]); break; case 'MultiPoint':a = t.getFlatCoordinates(), l = this.appendFlatPointCoordinates(a, s), l > o && (this.instructions.push([oh.CUSTOM, o, l, t, i, mr]), this.hitDetectionInstructions.push([oh.CUSTOM, o, l, t, n || i, mr])); break; case 'Point':a = t.getFlatCoordinates(), this.coordinates.push(a[0], a[1]), l = this.coordinates.length, this.instructions.push([oh.CUSTOM, o, l, t, i]), this.hitDetectionInstructions.push([oh.CUSTOM, o, l, t, n || i]);
      } this.endGeometry(e);
    }beginGeometry(t, e) {
      this.beginGeometryInstruction1_ = [oh.BEGIN_GEOMETRY, e, 0, t], this.instructions.push(this.beginGeometryInstruction1_), this.beginGeometryInstruction2_ = [oh.BEGIN_GEOMETRY, e, 0, t], this.hitDetectionInstructions.push(this.beginGeometryInstruction2_);
    }finish() {
      return {instructions: this.instructions, hitDetectionInstructions: this.hitDetectionInstructions, coordinates: this.coordinates};
    }reverseHitDetectionInstructions() {
      const t = this.hitDetectionInstructions; let e; t.reverse(); const i = t.length; let n; let r; let o = -1; for (e = 0; e < i; ++e) {
        n = t[e], r = n[0], r == oh.END_GEOMETRY ? o = e : r == oh.BEGIN_GEOMETRY && (n[2] = e, s(this.hitDetectionInstructions, o, e), o = -1);
      }
    }setFillStrokeStyle(t, e) {
      const i = this.state; if (t) {
        const e = t.getColor(); i.fillStyle = qs(e || ci);
      } else {
        i.fillStyle = void 0;
      } if (e) {
        const t = e.getColor(); i.strokeStyle = qs(t || fi); const n = e.getLineCap(); i.lineCap = void 0 !== n ? n : di; const r = e.getLineDash(); i.lineDash = r ? r.slice() : pi; const s = e.getLineDashOffset(); i.lineDashOffset = s || 0; const o = e.getLineJoin(); i.lineJoin = void 0 !== o ? o : gi; const a = e.getWidth(); i.lineWidth = void 0 !== a ? a : 1; const l = e.getMiterLimit(); i.miterLimit = void 0 !== l ? l : 10, i.lineWidth > this.maxLineWidth && (this.maxLineWidth = i.lineWidth, this.bufferedMaxExtent_ = null);
      } else {
        i.strokeStyle = void 0, i.lineCap = void 0, i.lineDash = null, i.lineDashOffset = void 0, i.lineJoin = void 0, i.lineWidth = void 0, i.miterLimit = void 0;
      }
    }createFill(t) {
      const e = t.fillStyle; const i = [oh.SET_FILL_STYLE, e]; return typeof e !== 'string' && i.push(!0), i;
    }applyStroke(t) {
      this.instructions.push(this.createStroke(t));
    }createStroke(t) {
      return [oh.SET_STROKE_STYLE, t.strokeStyle, t.lineWidth * this.pixelRatio, t.lineCap, t.lineJoin, t.miterLimit, this.applyPixelRatio(t.lineDash), t.lineDashOffset * this.pixelRatio];
    }updateFillStyle(t, e) {
      const i = t.fillStyle; typeof i === 'string' && t.currentFillStyle == i || (void 0 !== i && this.instructions.push(e.call(this, t)), t.currentFillStyle = i);
    }updateStrokeStyle(t, e) {
      const i = t.strokeStyle; const n = t.lineCap; const r = t.lineDash; const s = t.lineDashOffset; const o = t.lineJoin; const l = t.lineWidth; const h = t.miterLimit; (t.currentStrokeStyle != i || t.currentLineCap != n || r != t.currentLineDash && !a(t.currentLineDash, r) || t.currentLineDashOffset != s || t.currentLineJoin != o || t.currentLineWidth != l || t.currentMiterLimit != h) && (void 0 !== i && e.call(this, t), t.currentStrokeStyle = i, t.currentLineCap = n, t.currentLineDash = r, t.currentLineDashOffset = s, t.currentLineJoin = o, t.currentLineWidth = l, t.currentMiterLimit = h);
    }endGeometry(t) {
      this.beginGeometryInstruction1_[2] = this.instructions.length, this.beginGeometryInstruction1_ = null, this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length, this.beginGeometryInstruction2_ = null; const e = [oh.END_GEOMETRY, t]; this.instructions.push(e), this.hitDetectionInstructions.push(e);
    }getBufferedMaxExtent() {
      if (!this.bufferedMaxExtent_ && (this.bufferedMaxExtent_ = qt(this.maxExtent), this.maxLineWidth > 0)) {
        const t = this.resolution * (this.maxLineWidth + 1) / 2; Xt(this.bufferedMaxExtent_, t, this.bufferedMaxExtent_);
      } return this.bufferedMaxExtent_;
    }
  }; let hh = class extends lh {
    constructor(t, e, i, n) {
      super(t, e, i, n), this.hitDetectionImage_ = null, this.image_ = null, this.imagePixelRatio_ = void 0, this.anchorX_ = void 0, this.anchorY_ = void 0, this.height_ = void 0, this.opacity_ = void 0, this.originX_ = void 0, this.originY_ = void 0, this.rotateWithView_ = void 0, this.rotation_ = void 0, this.scale_ = void 0, this.width_ = void 0, this.declutterMode_ = void 0, this.declutterImageWithText_ = void 0;
    }drawPoint(t, e) {
      if (!this.image_) {
        return;
      } this.beginGeometry(t, e); const i = t.getFlatCoordinates(); const n = t.getStride(); const r = this.coordinates.length; const s = this.appendFlatPointCoordinates(i, n); this.instructions.push([oh.DRAW_IMAGE, r, s, this.image_, this.anchorX_ * this.imagePixelRatio_, this.anchorY_ * this.imagePixelRatio_, Math.ceil(this.height_ * this.imagePixelRatio_), this.opacity_, this.originX_ * this.imagePixelRatio_, this.originY_ * this.imagePixelRatio_, this.rotateWithView_, this.rotation_, [this.scale_[0] * this.pixelRatio / this.imagePixelRatio_, this.scale_[1] * this.pixelRatio / this.imagePixelRatio_], Math.ceil(this.width_ * this.imagePixelRatio_), this.declutterMode_, this.declutterImageWithText_]), this.hitDetectionInstructions.push([oh.DRAW_IMAGE, r, s, this.hitDetectionImage_, this.anchorX_, this.anchorY_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_, this.width_, this.declutterMode_, this.declutterImageWithText_]), this.endGeometry(e);
    }drawMultiPoint(t, e) {
      if (!this.image_) {
        return;
      } this.beginGeometry(t, e); const i = t.getFlatCoordinates(); const n = t.getStride(); const r = this.coordinates.length; const s = this.appendFlatPointCoordinates(i, n); this.instructions.push([oh.DRAW_IMAGE, r, s, this.image_, this.anchorX_ * this.imagePixelRatio_, this.anchorY_ * this.imagePixelRatio_, Math.ceil(this.height_ * this.imagePixelRatio_), this.opacity_, this.originX_ * this.imagePixelRatio_, this.originY_ * this.imagePixelRatio_, this.rotateWithView_, this.rotation_, [this.scale_[0] * this.pixelRatio / this.imagePixelRatio_, this.scale_[1] * this.pixelRatio / this.imagePixelRatio_], Math.ceil(this.width_ * this.imagePixelRatio_), this.declutterMode_, this.declutterImageWithText_]), this.hitDetectionInstructions.push([oh.DRAW_IMAGE, r, s, this.hitDetectionImage_, this.anchorX_, this.anchorY_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_, this.width_, this.declutterMode_, this.declutterImageWithText_]), this.endGeometry(e);
    }finish() {
      return this.reverseHitDetectionInstructions(), this.anchorX_ = void 0, this.anchorY_ = void 0, this.hitDetectionImage_ = null, this.image_ = null, this.imagePixelRatio_ = void 0, this.height_ = void 0, this.scale_ = void 0, this.opacity_ = void 0, this.originX_ = void 0, this.originY_ = void 0, this.rotateWithView_ = void 0, this.rotation_ = void 0, this.width_ = void 0, super.finish();
    }setImageStyle(t, e) {
      const i = t.getAnchor(); const n = t.getSize(); const r = t.getOrigin(); this.imagePixelRatio_ = t.getPixelRatio(this.pixelRatio), this.anchorX_ = i[0], this.anchorY_ = i[1], this.hitDetectionImage_ = t.getHitDetectionImage(), this.image_ = t.getImage(this.pixelRatio), this.height_ = n[1], this.opacity_ = t.getOpacity(), this.originX_ = r[0], this.originY_ = r[1], this.rotateWithView_ = t.getRotateWithView(), this.rotation_ = t.getRotation(), this.scale_ = t.getScaleArray(), this.width_ = n[0], this.declutterMode_ = t.getDeclutterMode(), this.declutterImageWithText_ = e;
    }
  }; let uh = class extends lh {
    constructor(t, e, i, n) {
      super(t, e, i, n);
    }drawFlatCoordinates_(t, e, i, n) {
      const r = this.coordinates.length; const s = this.appendFlatLineCoordinates(t, e, i, n, !1, !1); const o = [oh.MOVE_TO_LINE_TO, r, s]; return this.instructions.push(o), this.hitDetectionInstructions.push(o), i;
    }drawLineString(t, e) {
      const i = this.state; const n = i.strokeStyle; const r = i.lineWidth; if (void 0 === n || void 0 === r) {
        return;
      } this.updateStrokeStyle(i, this.applyStroke), this.beginGeometry(t, e), this.hitDetectionInstructions.push([oh.SET_STROKE_STYLE, i.strokeStyle, i.lineWidth, i.lineCap, i.lineJoin, i.miterLimit, pi, 0], rh); const s = t.getFlatCoordinates(); const o = t.getStride(); this.drawFlatCoordinates_(s, 0, s.length, o), this.hitDetectionInstructions.push(nh), this.endGeometry(e);
    }drawMultiLineString(t, e) {
      const i = this.state; const n = i.strokeStyle; const r = i.lineWidth; if (void 0 === n || void 0 === r) {
        return;
      } this.updateStrokeStyle(i, this.applyStroke), this.beginGeometry(t, e), this.hitDetectionInstructions.push([oh.SET_STROKE_STYLE, i.strokeStyle, i.lineWidth, i.lineCap, i.lineJoin, i.miterLimit, i.lineDash, i.lineDashOffset], rh); const s = t.getEnds(); const o = t.getFlatCoordinates(); const a = t.getStride(); let l = 0; for (let t = 0, e = s.length; t < e; ++t) {
        l = this.drawFlatCoordinates_(o, l, s[t], a);
      } this.hitDetectionInstructions.push(nh), this.endGeometry(e);
    }finish() {
      const t = this.state; return t.lastStroke != null && t.lastStroke != this.coordinates.length && this.instructions.push(nh), this.reverseHitDetectionInstructions(), this.state = null, super.finish();
    }applyStroke(t) {
      t.lastStroke != null && t.lastStroke != this.coordinates.length && (this.instructions.push(nh), t.lastStroke = this.coordinates.length), t.lastStroke = 0, super.applyStroke(t), this.instructions.push(rh);
    }
  }; let ch = class extends lh {
    constructor(t, e, i, n) {
      super(t, e, i, n);
    }drawFlatCoordinatess_(t, e, i, n) {
      const r = this.state; const s = void 0 !== r.fillStyle; const o = void 0 !== r.strokeStyle; const a = i.length; this.instructions.push(rh), this.hitDetectionInstructions.push(rh); for (let r = 0; r < a; ++r) {
        const s = i[r]; const a = this.coordinates.length; const l = this.appendFlatLineCoordinates(t, e, s, n, !0, !o); const h = [oh.MOVE_TO_LINE_TO, a, l]; this.instructions.push(h), this.hitDetectionInstructions.push(h), o && (this.instructions.push(sh), this.hitDetectionInstructions.push(sh)), e = s;
      } return s && (this.instructions.push(ih), this.hitDetectionInstructions.push(ih)), o && (this.instructions.push(nh), this.hitDetectionInstructions.push(nh)), e;
    }drawCircle(t, e) {
      const i = this.state; const n = i.fillStyle; const r = i.strokeStyle; if (void 0 === n && void 0 === r) {
        return;
      } this.setFillStrokeStyles_(), this.beginGeometry(t, e), void 0 !== i.fillStyle && this.hitDetectionInstructions.push([oh.SET_FILL_STYLE, ci]), void 0 !== i.strokeStyle && this.hitDetectionInstructions.push([oh.SET_STROKE_STYLE, i.strokeStyle, i.lineWidth, i.lineCap, i.lineJoin, i.miterLimit, i.lineDash, i.lineDashOffset]); const s = t.getFlatCoordinates(); const o = t.getStride(); const a = this.coordinates.length; this.appendFlatLineCoordinates(s, 0, s.length, o, !1, !1); const l = [oh.CIRCLE, a]; this.instructions.push(rh, l), this.hitDetectionInstructions.push(rh, l), void 0 !== i.fillStyle && (this.instructions.push(ih), this.hitDetectionInstructions.push(ih)), void 0 !== i.strokeStyle && (this.instructions.push(nh), this.hitDetectionInstructions.push(nh)), this.endGeometry(e);
    }drawPolygon(t, e) {
      const i = this.state; const n = i.fillStyle; const r = i.strokeStyle; if (void 0 === n && void 0 === r) {
        return;
      } this.setFillStrokeStyles_(), this.beginGeometry(t, e), void 0 !== i.fillStyle && this.hitDetectionInstructions.push([oh.SET_FILL_STYLE, ci]), void 0 !== i.strokeStyle && this.hitDetectionInstructions.push([oh.SET_STROKE_STYLE, i.strokeStyle, i.lineWidth, i.lineCap, i.lineJoin, i.miterLimit, i.lineDash, i.lineDashOffset]); const s = t.getEnds(); const o = t.getOrientedFlatCoordinates(); const a = t.getStride(); this.drawFlatCoordinatess_(o, 0, s, a), this.endGeometry(e);
    }drawMultiPolygon(t, e) {
      const i = this.state; const n = i.fillStyle; const r = i.strokeStyle; if (void 0 === n && void 0 === r) {
        return;
      } this.setFillStrokeStyles_(), this.beginGeometry(t, e), void 0 !== i.fillStyle && this.hitDetectionInstructions.push([oh.SET_FILL_STYLE, ci]), void 0 !== i.strokeStyle && this.hitDetectionInstructions.push([oh.SET_STROKE_STYLE, i.strokeStyle, i.lineWidth, i.lineCap, i.lineJoin, i.miterLimit, i.lineDash, i.lineDashOffset]); const s = t.getEndss(); const o = t.getOrientedFlatCoordinates(); const a = t.getStride(); let l = 0; for (let t = 0, e = s.length; t < e; ++t) {
        l = this.drawFlatCoordinatess_(o, l, s[t], a);
      } this.endGeometry(e);
    }finish() {
      this.reverseHitDetectionInstructions(), this.state = null; const t = this.tolerance; if (t !== 0) {
        const e = this.coordinates; for (let i = 0, n = e.length; i < n; ++i) {
          e[i] = pr(e[i], t);
        }
      } return super.finish();
    }setFillStrokeStyles_() {
      const t = this.state; void 0 !== t.fillStyle && this.updateFillStyle(t, this.createFill), void 0 !== t.strokeStyle && this.updateStrokeStyle(t, this.applyStroke);
    }
  }; function dh(t, e, i, n, r) {
    let s; let o; let a; let l; let h; let u; let c; let d; let p; let g; let f = i; let m = i; let y = 0; let _ = 0; let v = i; for (o = i; o < n; o += r) {
      const i = e[o]; const n = e[o + 1]; void 0 !== h && (p = i - h, g = n - u, l = Math.sqrt(p * p + g * g), void 0 !== c && (_ += a, s = Math.acos((c * p + d * g) / (a * l)), s > t && (_ > y && (y = _, f = v, m = o), _ = 0, v = o - r)), a = l, c = p, d = g), h = i, u = n;
    } return _ += l, _ > y ? [v, o] : [f, m];
  } const ph = {left: 0, end: 0, center: 0.5, right: 1, start: 1, top: 0, middle: 0.5, hanging: 0.2, alphabetic: 0.8, ideographic: 0.8, bottom: 1}; const gh = {Circle: ch, Default: lh, Image: hh, LineString: uh, Polygon: ch, Text: class extends lh {
    constructor(t, e, i, n) {
      super(t, e, i, n), this.labels_ = null, this.text_ = '', this.textOffsetX_ = 0, this.textOffsetY_ = 0, this.textRotateWithView_ = void 0, this.textRotation_ = 0, this.textFillState_ = null, this.fillStates = {}, this.textStrokeState_ = null, this.strokeStates = {}, this.textState_ = {}, this.textStates = {}, this.textKey_ = '', this.fillKey_ = '', this.strokeKey_ = '', this.declutterImageWithText_ = void 0;
    }finish() {
      const t = super.finish(); return t.textStates = this.textStates, t.fillStates = this.fillStates, t.strokeStates = this.strokeStates, t;
    }drawText(t, e) {
      const i = this.textFillState_; const n = this.textStrokeState_; const r = this.textState_; if (this.text_ === '' || !r || !i && !n) {
        return;
      } const s = this.coordinates; let o = s.length; const a = t.getType(); let l = null; let h = t.getStride(); if (r.placement !== 'line' || a != 'LineString' && a != 'MultiLineString' && a != 'Polygon' && a != 'MultiPolygon') {
        let i = r.overflow ? null : []; switch (a) {
          case 'Point':case 'MultiPoint':l = t.getFlatCoordinates(); break; case 'LineString':l = t.getFlatMidpoint(); break; case 'Circle':l = t.getCenter(); break; case 'MultiLineString':l = t.getFlatMidpoints(), h = 2; break; case 'Polygon':l = t.getFlatInteriorPoint(), r.overflow || i.push(l[2] / this.resolution), h = 3; break; case 'MultiPolygon':const e = t.getFlatInteriorPoints(); l = []; for (let t = 0, n = e.length; t < n; t += 3) {
            r.overflow || i.push(e[t + 2] / this.resolution), l.push(e[t], e[t + 1]);
          } if (l.length === 0) {
              return;
            } h = 2;
        } const n = this.appendFlatPointCoordinates(l, h); if (n === o) {
          return;
        } if (i && (n - o) / 2 != l.length / h) {
          let t = o / 2; i = i.filter(((e, i)=>{
            const n = s[2 * (t + i)] === l[i * h] && s[2 * (t + i) + 1] === l[i * h + 1]; return n || --t, n;
          }));
        } this.saveTextStates_(), (r.backgroundFill || r.backgroundStroke) && (this.setFillStrokeStyle(r.backgroundFill, r.backgroundStroke), r.backgroundFill && (this.updateFillStyle(this.state, this.createFill), this.hitDetectionInstructions.push(this.createFill(this.state))), r.backgroundStroke && (this.updateStrokeStyle(this.state, this.applyStroke), this.hitDetectionInstructions.push(this.createStroke(this.state)))), this.beginGeometry(t, e); let u = r.padding; if (u != _i && (r.scale[0] < 0 || r.scale[1] < 0)) {
          let t = r.padding[0]; let e = r.padding[1]; let i = r.padding[2]; let n = r.padding[3]; r.scale[0] < 0 && (e = -e, n = -n), r.scale[1] < 0 && (t = -t, i = -i), u = [t, e, i, n];
        } const c = this.pixelRatio; this.instructions.push([oh.DRAW_IMAGE, o, n, null, NaN, NaN, NaN, 1, 0, 0, this.textRotateWithView_, this.textRotation_, [1, 1], NaN, void 0, this.declutterImageWithText_, u == _i ? _i : u.map((function (t) {
          return t * c;
        })), !!r.backgroundFill, !!r.backgroundStroke, this.text_, this.textKey_, this.strokeKey_, this.fillKey_, this.textOffsetX_, this.textOffsetY_, i]); const d = 1 / c; this.hitDetectionInstructions.push([oh.DRAW_IMAGE, o, n, null, NaN, NaN, NaN, 1, 0, 0, this.textRotateWithView_, this.textRotation_, [d, d], NaN, void 0, this.declutterImageWithText_, u, !!r.backgroundFill, !!r.backgroundStroke, this.text_, this.textKey_, this.strokeKey_, this.fillKey_, this.textOffsetX_, this.textOffsetY_, i]), this.endGeometry(e);
      } else {
        if (!_e(this.getBufferedMaxExtent(), t.getExtent())) {
          return;
        } let i; if (l = t.getFlatCoordinates(), a == 'LineString') {
          i = [l.length];
        } else if (a == 'MultiLineString') {
          i = t.getEnds();
        } else if (a == 'Polygon') {
          i = t.getEnds().slice(0, 1);
        } else if (a == 'MultiPolygon') {
          const e = t.getEndss(); i = []; for (let t = 0, n = e.length; t < n; ++t) {
            i.push(e[t][0]);
          }
        } this.beginGeometry(t, e); const n = r.textAlign; let u; let c = 0; for (let t = 0, e = i.length; t < e; ++t) {
          if (n == null) {
            const e = dh(r.maxAngle, l, c, i[t], h); c = e[0], u = e[1];
          } else {
            u = i[t];
          } for (let t = c; t < u; t += h) {
            s.push(l[t], l[t + 1]);
          } const e = s.length; c = i[t], this.drawChars_(o, e), o = e;
        } this.endGeometry(e);
      }
    }saveTextStates_() {
      const t = this.textStrokeState_; const e = this.textState_; const i = this.textFillState_; const n = this.strokeKey_; t && (n in this.strokeStates || (this.strokeStates[n] = {strokeStyle: t.strokeStyle, lineCap: t.lineCap, lineDashOffset: t.lineDashOffset, lineWidth: t.lineWidth, lineJoin: t.lineJoin, miterLimit: t.miterLimit, lineDash: t.lineDash})); const r = this.textKey_; r in this.textStates || (this.textStates[r] = {font: e.font, textAlign: e.textAlign || mi, justify: e.justify, textBaseline: e.textBaseline || yi, scale: e.scale}); const s = this.fillKey_; i && (s in this.fillStates || (this.fillStates[s] = {fillStyle: i.fillStyle}));
    }drawChars_(t, e) {
      const i = this.textStrokeState_; const n = this.textState_; const r = this.strokeKey_; const s = this.textKey_; const o = this.fillKey_; this.saveTextStates_(); const a = this.pixelRatio; const l = ph[n.textBaseline]; const h = this.textOffsetY_ * a; const u = this.text_; const c = i ? i.lineWidth * Math.abs(n.scale[0]) / 2 : 0; this.instructions.push([oh.DRAW_CHARS, t, e, l, n.overflow, o, n.maxAngle, a, h, r, c * a, u, s, 1]), this.hitDetectionInstructions.push([oh.DRAW_CHARS, t, e, l, n.overflow, o, n.maxAngle, 1, h, r, c, u, s, 1 / a]);
    }setTextStyle(t, e) {
      let i; let n; let r; if (t) {
        const e = t.getFill(); e ? (n = this.textFillState_, n || (n = {}, this.textFillState_ = n), n.fillStyle = qs(e.getColor() || ci)) : (n = null, this.textFillState_ = n); const s = t.getStroke(); if (s) {
          r = this.textStrokeState_, r || (r = {}, this.textStrokeState_ = r); const t = s.getLineDash(); const e = s.getLineDashOffset(); const i = s.getWidth(); const n = s.getMiterLimit(); r.lineCap = s.getLineCap() || di, r.lineDash = t ? t.slice() : pi, r.lineDashOffset = void 0 === e ? 0 : e, r.lineJoin = s.getLineJoin() || gi, r.lineWidth = void 0 === i ? 1 : i, r.miterLimit = void 0 === n ? 10 : n, r.strokeStyle = qs(s.getColor() || fi);
        } else {
          r = null, this.textStrokeState_ = r;
        }i = this.textState_; const o = t.getFont() || ui; Ci(o); const a = t.getScaleArray(); i.overflow = t.getOverflow(), i.font = o, i.maxAngle = t.getMaxAngle(), i.placement = t.getPlacement(), i.textAlign = t.getTextAlign(), i.justify = t.getJustify(), i.textBaseline = t.getTextBaseline() || yi, i.backgroundFill = t.getBackgroundFill(), i.backgroundStroke = t.getBackgroundStroke(), i.padding = t.getPadding() || _i, i.scale = void 0 === a ? [1, 1] : a; const l = t.getOffsetX(); const h = t.getOffsetY(); const u = t.getRotateWithView(); const c = t.getRotation(); this.text_ = t.getText() || '', this.textOffsetX_ = void 0 === l ? 0 : l, this.textOffsetY_ = void 0 === h ? 0 : h, this.textRotateWithView_ = void 0 !== u && u, this.textRotation_ = void 0 === c ? 0 : c, this.strokeKey_ = r ? (typeof r.strokeStyle === 'string' ? r.strokeStyle : F(r.strokeStyle)) + r.lineCap + r.lineDashOffset + '|' + r.lineWidth + r.lineJoin + r.miterLimit + '[' + r.lineDash.join() + ']' : '', this.textKey_ = i.font + i.scale + (i.textAlign || '?') + (i.justify || '?') + (i.textBaseline || '?'), this.fillKey_ = n ? typeof n.fillStyle === 'string' ? n.fillStyle : '|' + F(n.fillStyle) : '';
      } else {
        this.text_ = '';
      } this.declutterImageWithText_ = e;
    }
  }}; let fh = class {
    constructor(t, e, i, n) {
      this.tolerance_ = t, this.maxExtent_ = e, this.pixelRatio_ = n, this.resolution_ = i, this.buildersByZIndex_ = {};
    }finish() {
      const t = {}; for (const e in this.buildersByZIndex_) {
        t[e] = t[e] || {}; const i = this.buildersByZIndex_[e]; for (const n in i) {
          const r = i[n].finish(); t[e][n] = r;
        }
      } return t;
    }getBuilder(t, e) {
      const i = void 0 !== t ? t.toString() : '0'; let n = this.buildersByZIndex_[i]; void 0 === n && (n = {}, this.buildersByZIndex_[i] = n); let r = n[e]; if (void 0 === r) {
        r = new (0, gh[e])(this.tolerance_, this.maxExtent_, this.resolution_, this.pixelRatio_), n[e] = r;
      } return r;
    }
  }; function mh(t, e, i, n, r, s, o, a, l, h, u, c) {
    let d = t[e]; let p = t[e + 1]; let g = 0; let f = 0; let m = 0; let y = 0; function _() {
      g = d, f = p, d = t[e += n], p = t[e + 1], y += m, m = Math.sqrt((d - g) * (d - g) + (p - f) * (p - f));
    } do {
      _();
    } while (e < i - n && y + m < s); let v = m === 0 ? 0 : (s - y) / m; const x = Re(g, d, v); const b = Re(f, p, v); const w = e - n; const C = y; const S = s + a * l(h, r, u); for (;e < i - n && y + m < S;) {
      _();
    }v = m === 0 ? 0 : (S - y) / m; const T = Re(g, d, v); const E = Re(f, p, v); let R; if (c) {
      const t = [x, b, T, E]; tr(t, 0, 4, 2, c, t, t), R = t[0] > t[2];
    } else {
      R = x > T;
    } const I = Math.PI; const M = []; const k = w + n === e; let F; if (m = 0, y = C, d = t[e = w], p = t[e + 1], k) {
      _(), F = Math.atan2(p - f, d - g), R && (F += F > 0 ? -I : I); const t = (T + x) / 2; const e = (E + b) / 2; return M[0] = [t, e, (S - s) / 2, F, r], M;
    } for (let t = 0, c = (r = r.replace(/\n/g, ' ')).length; t < c;) {
      _(); let x = Math.atan2(p - f, d - g); if (R && (x += x > 0 ? -I : I), void 0 !== F) {
        let t = x - F; if (t += t > I ? -2 * I : t < -I ? 2 * I : 0, Math.abs(t) > o) {
          return null;
        }
      }F = x; const b = t; let w = 0; for (;t < c; ++t) {
        const o = a * l(h, r[R ? c - t - 1 : t], u); if (e + n < i && y + m < s + w + o / 2) {
          break;
        } w += o;
      } if (t === b) {
        continue;
      } const C = R ? r.substring(c - b, c - t) : r.substring(b, t); v = m === 0 ? 0 : (s + w / 2 - y) / m; const S = Re(g, d, v); const T = Re(f, p, v); M.push([S, T, w / 2, x, C]), s += w;
    } return M;
  } const yh = [1 / 0, 1 / 0, -1 / 0, -1 / 0]; const _h = []; const vh = []; const xh = []; const bh = []; function wh(t) {
    return t[3].declutterBox;
  } const Ch = new RegExp('[' + String.fromCharCode(1425) + '-' + String.fromCharCode(2303) + String.fromCharCode(64285) + '-' + String.fromCharCode(65023) + String.fromCharCode(65136) + '-' + String.fromCharCode(65276) + String.fromCharCode(67584) + '-' + String.fromCharCode(69631) + String.fromCharCode(124928) + '-' + String.fromCharCode(126975) + ']'); function Sh(t, e) {
    return e !== 'start' && e !== 'end' || Ch.test(t) || (e = e === 'start' ? 'left' : 'right'), ph[e];
  } function Th(t, e, i) {
    return i > 0 && t.push('\n', ''), t.push(e, ''), t;
  } let Eh = class {
    constructor(t, e, i, n) {
      this.overlaps = i, this.pixelRatio = e, this.resolution = t, this.alignFill_, this.instructions = n.instructions, this.coordinates = n.coordinates, this.coordinateCache_ = {}, this.renderedTransform_ = [1, 0, 0, 1, 0, 0], this.hitDetectionInstructions = n.hitDetectionInstructions, this.pixelCoordinates_ = null, this.viewRotation_ = 0, this.fillStates = n.fillStates || {}, this.strokeStates = n.strokeStates || {}, this.textStates = n.textStates || {}, this.widths_ = {}, this.labels_ = {};
    }createLabel(t, e, i, n) {
      const r = t + e + i + n; if (this.labels_[r]) {
        return this.labels_[r];
      } const s = n ? this.strokeStates[n] : null; const o = i ? this.fillStates[i] : null; const a = this.textStates[e]; const l = this.pixelRatio; const h = [a.scale[0] * l, a.scale[1] * l]; const u = Array.isArray(t); const c = a.justify ? ph[a.justify] : Sh(Array.isArray(t) ? t[0] : t, a.textAlign || mi); const d = n && s.lineWidth ? s.lineWidth : 0; const p = u ? t : t.split('\n').reduce(Th, []); const {width: g, height: f, widths: m, heights: y, lineWidths: _} = function (t, e) {
        const i = []; const n = []; const r = []; let s = 0; let o = 0; let a = 0; let l = 0; for (let h = 0, u = e.length; h <= u; h += 2) {
          const c = e[h]; if (c === '\n' || h === u) {
            s = Math.max(s, o), r.push(o), o = 0, a += l; continue;
          } const d = e[h + 1] || t.font; const p = Ei(d, c); i.push(p), o += p; const g = Si(d); n.push(g), l = Math.max(l, g);
        } return {width: s, height: a, widths: i, heights: n, lineWidths: r};
      }(a, p); const v = g + d; const x = []; const b = (v + 2) * h[0]; const w = (f + d) * h[1]; const C = {width: b < 0 ? Math.floor(b) : Math.ceil(b), height: w < 0 ? Math.floor(w) : Math.ceil(w), contextInstructions: x}; h[0] == 1 && h[1] == 1 || x.push('scale', h), n && (x.push('strokeStyle', s.strokeStyle), x.push('lineWidth', d), x.push('lineCap', s.lineCap), x.push('lineJoin', s.lineJoin), x.push('miterLimit', s.miterLimit), x.push('setLineDash', [s.lineDash]), x.push('lineDashOffset', s.lineDashOffset)), i && x.push('fillStyle', o.fillStyle), x.push('textBaseline', 'middle'), x.push('textAlign', 'center'); const S = 0.5 - c; let T = c * v + S * d; const E = []; const R = []; let I; let M = 0; let k = 0; let F = 0; let P = 0; for (let t = 0, e = p.length; t < e; t += 2) {
        const e = p[t]; if (e === '\n') {
          k += M, M = 0, T = c * v + S * d, ++P; continue;
        } const r = p[t + 1] || a.font; r !== I && (n && E.push('font', r), i && R.push('font', r), I = r), M = Math.max(M, y[F]); const s = [e, T + S * m[F] + c * (m[F] - _[P]), 0.5 * (d + M) + k]; T += m[F], n && E.push('strokeText', s), i && R.push('fillText', s), ++F;
      } return Array.prototype.push.apply(x, E), Array.prototype.push.apply(x, R), this.labels_[r] = C, C;
    }replayTextBackground_(t, e, i, n, r, s, o) {
      t.beginPath(), t.moveTo.apply(t, e), t.lineTo.apply(t, i), t.lineTo.apply(t, n), t.lineTo.apply(t, r), t.lineTo.apply(t, e), s && (this.alignFill_ = s[2], this.fill_(t)), o && (this.setStrokeStyle_(t, o), t.stroke());
    }calculateImageOrLabelDimensions_(t, e, i, n, r, s, o, a, l, h, u, c, d, p, g, f) {
      let m = i - (o *= c[0]); let y = n - (a *= c[1]); const _ = r + l > t ? t - l : r; const v = s + h > e ? e - h : s; const x = p[3] + _ * c[0] + p[1]; const b = p[0] + v * c[1] + p[2]; const w = m - p[3]; const C = y - p[0]; let S; return (g || u !== 0) && (_h[0] = w, bh[0] = w, _h[1] = C, vh[1] = C, vh[0] = w + x, xh[0] = vh[0], xh[1] = C + b, bh[1] = xh[1]), u !== 0 ? (S = Ft([1, 0, 0, 1, 0, 0], i, n, 1, 1, u, -i, -n), Mt(S, _h), Mt(S, vh), Mt(S, xh), Mt(S, bh), Ht(Math.min(_h[0], vh[0], xh[0], bh[0]), Math.min(_h[1], vh[1], xh[1], bh[1]), Math.max(_h[0], vh[0], xh[0], bh[0]), Math.max(_h[1], vh[1], xh[1], bh[1]), yh)) : Ht(Math.min(w, w + x), Math.min(C, C + b), Math.max(w, w + x), Math.max(C, C + b), yh), d && (m = Math.round(m), y = Math.round(y)), {drawImageX: m, drawImageY: y, drawImageW: _, drawImageH: v, originX: l, originY: h, declutterBox: {minX: yh[0], minY: yh[1], maxX: yh[2], maxY: yh[3], value: f}, canvasTransform: S, scale: c};
    }replayImageOrLabel_(t, e, i, n, r, s, o) {
      const a = !(!s && !o); const l = n.declutterBox; const h = t.canvas; const u = o ? o[2] * n.scale[0] / 2 : 0; return l.minX - u <= h.width / e && l.maxX + u >= 0 && l.minY - u <= h.height / e && l.maxY + u >= 0 && (a && this.replayTextBackground_(t, _h, vh, xh, bh, s, o), Ii(t, n.canvasTransform, r, i, n.originX, n.originY, n.drawImageW, n.drawImageH, n.drawImageX, n.drawImageY, n.scale)), !0;
    }fill_(t) {
      if (this.alignFill_) {
        const e = Mt(this.renderedTransform_, [0, 0]); const i = 512 * this.pixelRatio; t.save(), t.translate(e[0] % i, e[1] % i), t.rotate(this.viewRotation_);
      }t.fill(), this.alignFill_ && t.restore();
    }setStrokeStyle_(t, e) {
      t.strokeStyle = e[1], t.lineWidth = e[2], t.lineCap = e[3], t.lineJoin = e[4], t.miterLimit = e[5], t.lineDashOffset = e[7], t.setLineDash(e[6]);
    }drawLabelWithPointPlacement_(t, e, i, n) {
      const r = this.textStates[e]; const s = this.createLabel(t, e, n, i); const o = this.strokeStates[i]; const a = this.pixelRatio; const l = Sh(Array.isArray(t) ? t[0] : t, r.textAlign || mi); const h = ph[r.textBaseline || yi]; const u = o && o.lineWidth ? o.lineWidth : 0; return {label: s, anchorX: l * (s.width / a - 2 * r.scale[0]) + 2 * (0.5 - l) * u, anchorY: h * s.height / a + 2 * (0.5 - h) * u};
    }execute_(t, e, i, n, r, s, o, l) {
      let h; let u; let c; this.pixelCoordinates_ && a(i, this.renderedTransform_) ? h = this.pixelCoordinates_ : (this.pixelCoordinates_ || (this.pixelCoordinates_ = []), h = $n(this.coordinates, 0, this.coordinates.length, 2, i, this.pixelCoordinates_), u = this.renderedTransform_, c = i, u[0] = c[0], u[1] = c[1], u[2] = c[2], u[3] = c[3], u[4] = c[4], u[5] = c[5]); let d = 0; const p = n.length; let g; let f; let m; let y; let _; let v; let x; let b; let w; let C; let S; let T; let E = 0; let R = 0; let I = 0; let M = null; let k = null; const F = this.coordinateCache_; const P = this.viewRotation_; const L = Math.round(1e12 * Math.atan2(-i[1], i[0])) / 1e12; const A = {context: t, pixelRatio: this.pixelRatio, resolution: this.resolution, rotation: P}; const z = this.instructions != n || this.overlaps ? 0 : 200; let O; let D; let j; let G; for (;d < p;) {
        const i = n[d]; switch (i[0]) {
          case oh.BEGIN_GEOMETRY:O = i[1], G = i[3], O.getGeometry() ? void 0 === o || _e(o, G.getExtent()) ? ++d : d = i[2] + 1 : d = i[2]; break; case oh.BEGIN_PATH:R > z && (this.fill_(t), R = 0), I > z && (t.stroke(), I = 0), R || I || (t.beginPath(), y = NaN, _ = NaN), ++d; break; case oh.CIRCLE:E = i[1]; const n = h[E]; const a = h[E + 1]; const u = h[E + 2] - n; const c = h[E + 3] - a; const p = Math.sqrt(u * u + c * c); t.moveTo(n + p, a), t.arc(n, a, p, 0, 2 * Math.PI, !0), ++d; break; case oh.CLOSE_PATH:t.closePath(), ++d; break; case oh.CUSTOM:E = i[1], g = i[2]; const N = i[3]; const W = i[4]; const X = i.length == 6 ? i[5] : void 0; A.geometry = N, A.feature = O, d in F || (F[d] = []); const q = F[d]; X ? X(h, E, g, 2, q) : (q[0] = h[E], q[1] = h[E + 1], q.length = 2), W(q, A), ++d; break; case oh.DRAW_IMAGE:E = i[1], g = i[2], b = i[3], f = i[4], m = i[5]; let B = i[6]; const V = i[7]; const Y = i[8]; const K = i[9]; const Z = i[10]; let U = i[11]; const H = i[12]; let J = i[13]; const Q = i[14]; const $ = i[15]; if (!b && i.length >= 20) {
            w = i[19], C = i[20], S = i[21], T = i[22]; const t = this.drawLabelWithPointPlacement_(w, C, S, T); b = t.label, i[3] = b; const e = i[23]; f = (t.anchorX - e) * this.pixelRatio, i[4] = f; const n = i[24]; m = (t.anchorY - n) * this.pixelRatio, i[5] = m, B = b.height, i[6] = B, J = b.width, i[13] = J;
          } let tt; let et; let it; let nt; i.length > 25 && (tt = i[25]), i.length > 17 ? (et = i[16], it = i[17], nt = i[18]) : (et = _i, it = !1, nt = !1), Z && L ? U += P : Z || L || (U -= P); let rt = 0; for (;E < g; E += 2) {
              if (tt && tt[rt++] < J / this.pixelRatio) {
                continue;
              } const i = this.calculateImageOrLabelDimensions_(b.width, b.height, h[E], h[E + 1], J, B, f, m, Y, K, U, H, r, et, it || nt, O); const n = [t, e, b, i, V, it ? M : null, nt ? k : null]; if (l) {
                if (Q === 'none') {
                  continue;
                } if (Q === 'obstacle') {
                  l.insert(i.declutterBox); continue;
                } { let t; let e; if ($) {
                  const i = g - E; if (!$[i]) {
                    $[i] = n; continue;
                  } if (t = $[i], delete $[i], e = wh(t), l.collides(e)) {
                    continue;
                  }
                } if (l.collides(i.declutterBox)) {
                  continue;
                } t && (l.insert(e), this.replayImageOrLabel_.apply(this, t)), l.insert(i.declutterBox); }
              } this.replayImageOrLabel_.apply(this, n);
            }++d; break; case oh.DRAW_CHARS:const st = i[1]; const ot = i[2]; const at = i[3]; const lt = i[4]; T = i[5]; const ht = i[6]; const ut = i[7]; const ct = i[8]; S = i[9]; const dt = i[10]; w = i[11], C = i[12]; const pt = [i[13], i[13]]; const gt = this.textStates[C]; const ft = gt.font; const mt = [gt.scale[0] * ut, gt.scale[1] * ut]; let yt; ft in this.widths_ ? yt = this.widths_[ft] : (yt = {}, this.widths_[ft] = yt); const _t = ho(h, st, ot, 2); const vt = Math.abs(mt[0]) * Ri(ft, w, yt); if (lt || vt <= _t) {
            const i = this.textStates[C].textAlign; const n = mh(h, st, ot, 2, w, (_t - vt) * ph[i], ht, Math.abs(mt[0]), Ri, ft, yt, L ? 0 : this.viewRotation_); t:if (n) {
              const i = []; let r; let s; let o; let a; let h; if (S) {
                for (r = 0, s = n.length; r < s; ++r) {
                  h = n[r], o = h[4], a = this.createLabel(o, C, '', S), f = h[2] + (mt[0] < 0 ? -dt : dt), m = at * a.height + 2 * (0.5 - at) * dt * mt[1] / mt[0] - ct; const s = this.calculateImageOrLabelDimensions_(a.width, a.height, h[0], h[1], a.width, a.height, f, m, 0, 0, h[3], pt, !1, _i, !1, O); if (l && l.collides(s.declutterBox)) {
                    break t;
                  } i.push([t, e, a, s, 1, null, null]);
                }
              } if (T) {
                for (r = 0, s = n.length; r < s; ++r) {
                  h = n[r], o = h[4], a = this.createLabel(o, C, T, ''), f = h[2], m = at * a.height - ct; const s = this.calculateImageOrLabelDimensions_(a.width, a.height, h[0], h[1], a.width, a.height, f, m, 0, 0, h[3], pt, !1, _i, !1, O); if (l && l.collides(s.declutterBox)) {
                    break t;
                  } i.push([t, e, a, s, 1, null, null]);
                }
              }l && l.load(i.map(wh)); for (let t = 0, e = i.length; t < e; ++t) {
                this.replayImageOrLabel_.apply(this, i[t]);
              }
            }
          }++d; break; case oh.END_GEOMETRY:if (void 0 !== s) {
            O = i[1]; const t = s(O, G); if (t) {
              return t;
            }
          }++d; break; case oh.FILL:z ? R++ : this.fill_(t), ++d; break; case oh.MOVE_TO_LINE_TO:for (E = i[1], g = i[2], D = h[E], j = h[E + 1], v = D + 0.5 | 0, x = j + 0.5 | 0, v === y && x === _ || (t.moveTo(D, j), y = v, _ = x), E += 2; E < g; E += 2) {
            D = h[E], j = h[E + 1], v = D + 0.5 | 0, x = j + 0.5 | 0, E != g - 2 && v === y && x === _ || (t.lineTo(D, j), y = v, _ = x);
          }++d; break; case oh.SET_FILL_STYLE:M = i, this.alignFill_ = i[2], R && (this.fill_(t), R = 0, I && (t.stroke(), I = 0)), t.fillStyle = i[1], ++d; break; case oh.SET_STROKE_STYLE:k = i, I && (t.stroke(), I = 0), this.setStrokeStyle_(t, i), ++d; break; case oh.STROKE:z ? I++ : t.stroke(), ++d; break; default:++d;
        }
      }R && this.fill_(t), I && t.stroke();
    }execute(t, e, i, n, r, s) {
      this.viewRotation_ = n, this.execute_(t, e, i, this.instructions, r, void 0, void 0, s);
    }executeHitDetection(t, e, i, n, r) {
      return this.viewRotation_ = i, this.execute_(t, 1, e, this.hitDetectionInstructions, !0, n, r);
    }
  }; const Rh = ['Polygon', 'Circle', 'LineString', 'Image', 'Text', 'Default']; const Ih = {}; let Mh = class {
    constructor(t, e, i, n, r, s) {
      this.maxExtent_ = t, this.overlaps_ = n, this.pixelRatio_ = i, this.resolution_ = e, this.renderBuffer_ = s, this.executorsByZIndex_ = {}, this.hitDetectionContext_ = null, this.hitDetectionTransform_ = [1, 0, 0, 1, 0, 0], this.createExecutors_(r);
    }clip(t, e) {
      const i = this.getClipCoords(e); t.beginPath(), t.moveTo(i[0], i[1]), t.lineTo(i[2], i[3]), t.lineTo(i[4], i[5]), t.lineTo(i[6], i[7]), t.clip();
    }createExecutors_(t) {
      for (const e in t) {
        let i = this.executorsByZIndex_[e]; void 0 === i && (i = {}, this.executorsByZIndex_[e] = i); const n = t[e]; for (const t in n) {
          const e = n[t]; i[t] = new Eh(this.resolution_, this.pixelRatio_, this.overlaps_, e);
        }
      }
    }hasExecutors(t) {
      for (const e in this.executorsByZIndex_) {
        const i = this.executorsByZIndex_[e]; for (let e = 0, n = t.length; e < n; ++e) {
          if (t[e] in i) {
            return !0;
          }
        }
      } return !1;
    }forEachFeatureAtCoordinate(t, e, i, r, s, o) {
      const a = 2 * (r = Math.round(r)) + 1; const l = Ft(this.hitDetectionTransform_, r + 0.5, r + 0.5, 1 / e, -1 / e, -i, -t[0], -t[1]); const h = !this.hitDetectionContext_; h && (this.hitDetectionContext_ = K(a, a, void 0, {willReadFrequently: !0})); const u = this.hitDetectionContext_; let c; u.canvas.width !== a || u.canvas.height !== a ? (u.canvas.width = a, u.canvas.height = a) : h || u.clearRect(0, 0, a, a), void 0 !== this.renderBuffer_ && (c = [1 / 0, 1 / 0, -1 / 0, -1 / 0], ie(c, t), Xt(c, e * (this.renderBuffer_ + r), c)); const d = function (t) {
        if (void 0 !== Ih[t]) {
          return Ih[t];
        } const e = 2 * t + 1; const i = t * t; const n = new Array(i + 1); for (let r = 0; r <= t; ++r) {
          for (let s = 0; s <= t; ++s) {
            const o = r * r + s * s; if (o > i) {
              break;
            } let a = n[o]; a || (a = [], n[o] = a), a.push(4 * ((t + r) * e + (t + s)) + 3), r > 0 && a.push(4 * ((t - r) * e + (t + s)) + 3), s > 0 && (a.push(4 * ((t + r) * e + (t - s)) + 3), r > 0 && a.push(4 * ((t - r) * e + (t - s)) + 3));
          }
        } const r = []; for (let t = 0, e = n.length; t < e; ++t) {
          n[t] && r.push(...n[t]);
        } return Ih[t] = r, r;
      }(r); let p; function g(t, e) {
        const i = u.getImageData(0, 0, a, a).data; for (let n = 0, l = d.length; n < l; n++) {
          if (i[d[n]] > 0) {
            if (!o || p !== 'Image' && p !== 'Text' || o.includes(t)) {
              const i = (d[n] - 3) / 4; const o = r - i % a; const l = r - (i / a | 0); const h = s(t, e, o * o + l * l); if (h) {
                return h;
              }
            }u.clearRect(0, 0, a, a); break;
          }
        }
      } const f = Object.keys(this.executorsByZIndex_).map(Number); let m; let y; let _; let v; let x; for (f.sort(n), m = f.length - 1; m >= 0; --m) {
        const t = f[m].toString(); for (_ = this.executorsByZIndex_[t], y = Rh.length - 1; y >= 0; --y) {
          if (p = Rh[y], v = _[p], void 0 !== v && (x = v.executeHitDetection(u, l, i, g, c), x)) {
            return x;
          }
        }
      }
    }getClipCoords(t) {
      const e = this.maxExtent_; if (!e) {
        return null;
      } const i = e[0]; const n = e[1]; const r = e[2]; const s = e[3]; const o = [i, n, i, s, r, s, r, n]; return $n(o, 0, 8, 2, t, o), o;
    }isEmpty() {
      return d(this.executorsByZIndex_);
    }execute(t, e, i, r, s, o, a) {
      const l = Object.keys(this.executorsByZIndex_).map(Number); let h; let u; let c; let d; let p; let g; for (l.sort(n), this.maxExtent_ && (t.save(), this.clip(t, i)), o = o || Rh, a && l.reverse(), h = 0, u = l.length; h < u; ++h) {
        const n = l[h].toString(); for (p = this.executorsByZIndex_[n], c = 0, d = o.length; c < d; ++c) {
          g = p[o[c]], void 0 !== g && g.execute(t, e, i, r, s, a);
        }
      } this.maxExtent_ && t.restore();
    }
  }; let kh = class extends ah {
    constructor(t, e, i, n, r, s, o) {
      super(), this.context_ = t, this.pixelRatio_ = e, this.extent_ = i, this.transform_ = n, this.transformRotation_ = n ? Ie(Math.atan2(n[1], n[0]), 10) : 0, this.viewRotation_ = r, this.squaredTolerance_ = s, this.userTransform_ = o, this.contextFillState_ = null, this.contextStrokeState_ = null, this.contextTextState_ = null, this.fillState_ = null, this.strokeState_ = null, this.image_ = null, this.imageAnchorX_ = 0, this.imageAnchorY_ = 0, this.imageHeight_ = 0, this.imageOpacity_ = 0, this.imageOriginX_ = 0, this.imageOriginY_ = 0, this.imageRotateWithView_ = !1, this.imageRotation_ = 0, this.imageScale_ = [0, 0], this.imageWidth_ = 0, this.text_ = '', this.textOffsetX_ = 0, this.textOffsetY_ = 0, this.textRotateWithView_ = !1, this.textRotation_ = 0, this.textScale_ = [0, 0], this.textFillState_ = null, this.textStrokeState_ = null, this.textState_ = null, this.pixelCoordinates_ = [], this.tmpLocalTransform_ = [1, 0, 0, 1, 0, 0];
    }drawImages_(t, e, i, n) {
      if (!this.image_) {
        return;
      } const r = $n(t, e, i, n, this.transform_, this.pixelCoordinates_); const s = this.context_; const o = this.tmpLocalTransform_; const a = s.globalAlpha; this.imageOpacity_ != 1 && (s.globalAlpha = a * this.imageOpacity_); let l = this.imageRotation_; this.transformRotation_ === 0 && (l -= this.viewRotation_), this.imageRotateWithView_ && (l += this.viewRotation_); for (let t = 0, e = r.length; t < e; t += 2) {
        const e = r[t] - this.imageAnchorX_; const i = r[t + 1] - this.imageAnchorY_; if (l !== 0 || this.imageScale_[0] != 1 || this.imageScale_[1] != 1) {
          const t = e + this.imageAnchorX_; const n = i + this.imageAnchorY_; Ft(o, t, n, 1, 1, l, -t, -n), s.setTransform.apply(s, o), s.translate(t, n), s.scale(this.imageScale_[0], this.imageScale_[1]), s.drawImage(this.image_, this.imageOriginX_, this.imageOriginY_, this.imageWidth_, this.imageHeight_, -this.imageAnchorX_, -this.imageAnchorY_, this.imageWidth_, this.imageHeight_), s.setTransform(1, 0, 0, 1, 0, 0);
        } else {
          s.drawImage(this.image_, this.imageOriginX_, this.imageOriginY_, this.imageWidth_, this.imageHeight_, e, i, this.imageWidth_, this.imageHeight_);
        }
      } this.imageOpacity_ != 1 && (s.globalAlpha = a);
    }drawText_(t, e, i, n) {
      if (!this.textState_ || this.text_ === '') {
        return;
      } this.textFillState_ && this.setContextFillState_(this.textFillState_), this.textStrokeState_ && this.setContextStrokeState_(this.textStrokeState_), this.setContextTextState_(this.textState_); const r = $n(t, e, i, n, this.transform_, this.pixelCoordinates_); const s = this.context_; let o = this.textRotation_; for (this.transformRotation_ === 0 && (o -= this.viewRotation_), this.textRotateWithView_ && (o += this.viewRotation_); e < i; e += n) {
        const t = r[e] + this.textOffsetX_; const i = r[e + 1] + this.textOffsetY_; o !== 0 || this.textScale_[0] != 1 || this.textScale_[1] != 1 ? (s.translate(t - this.textOffsetX_, i - this.textOffsetY_), s.rotate(o), s.translate(this.textOffsetX_, this.textOffsetY_), s.scale(this.textScale_[0], this.textScale_[1]), this.textStrokeState_ && s.strokeText(this.text_, 0, 0), this.textFillState_ && s.fillText(this.text_, 0, 0), s.setTransform(1, 0, 0, 1, 0, 0)) : (this.textStrokeState_ && s.strokeText(this.text_, t, i), this.textFillState_ && s.fillText(this.text_, t, i));
      }
    }moveToLineTo_(t, e, i, n, r) {
      const s = this.context_; const o = $n(t, e, i, n, this.transform_, this.pixelCoordinates_); s.moveTo(o[0], o[1]); let a = o.length; r && (a -= 2); for (let t = 2; t < a; t += 2) {
        s.lineTo(o[t], o[t + 1]);
      } return r && s.closePath(), i;
    }drawRings_(t, e, i, n) {
      for (let r = 0, s = i.length; r < s; ++r) {
        e = this.moveToLineTo_(t, e, i[r], n, !0);
      } return e;
    }drawCircle(t) {
      if (_e(this.extent_, t.getExtent())) {
        if (this.fillState_ || this.strokeState_) {
          this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_); const e = function (t, e, i) {
            const n = t.getFlatCoordinates(); if (!n) {
              return null;
            } const r = t.getStride(); return $n(n, 0, n.length, r, e, i);
          }(t, this.transform_, this.pixelCoordinates_); const i = e[2] - e[0]; const n = e[3] - e[1]; const r = Math.sqrt(i * i + n * n); const s = this.context_; s.beginPath(), s.arc(e[0], e[1], r, 0, 2 * Math.PI), this.fillState_ && s.fill(), this.strokeState_ && s.stroke();
        } this.text_ !== '' && this.drawText_(t.getCenter(), 0, 2, 2);
      }
    }setStyle(t) {
      this.setFillStrokeStyle(t.getFill(), t.getStroke()), this.setImageStyle(t.getImage()), this.setTextStyle(t.getText());
    }setTransform(t) {
      this.transform_ = t;
    }drawGeometry(t) {
      switch (t.getType()) {
        case 'Point':this.drawPoint(t); break; case 'LineString':this.drawLineString(t); break; case 'Polygon':this.drawPolygon(t); break; case 'MultiPoint':this.drawMultiPoint(t); break; case 'MultiLineString':this.drawMultiLineString(t); break; case 'MultiPolygon':this.drawMultiPolygon(t); break; case 'GeometryCollection':this.drawGeometryCollection(t); break; case 'Circle':this.drawCircle(t);
      }
    }drawFeature(t, e) {
      const i = e.getGeometryFunction()(t); i && _e(this.extent_, i.getExtent()) && (this.setStyle(e), this.drawGeometry(i));
    }drawGeometryCollection(t) {
      const e = t.getGeometriesArray(); for (let t = 0, i = e.length; t < i; ++t) {
        this.drawGeometry(e[t]);
      }
    }drawPoint(t) {
      this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_)); const e = t.getFlatCoordinates(); const i = t.getStride(); this.image_ && this.drawImages_(e, 0, e.length, i), this.text_ !== '' && this.drawText_(e, 0, e.length, i);
    }drawMultiPoint(t) {
      this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_)); const e = t.getFlatCoordinates(); const i = t.getStride(); this.image_ && this.drawImages_(e, 0, e.length, i), this.text_ !== '' && this.drawText_(e, 0, e.length, i);
    }drawLineString(t) {
      if (this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_)), _e(this.extent_, t.getExtent())) {
        if (this.strokeState_) {
          this.setContextStrokeState_(this.strokeState_); const e = this.context_; const i = t.getFlatCoordinates(); e.beginPath(), this.moveToLineTo_(i, 0, i.length, t.getStride(), !1), e.stroke();
        } if (this.text_ !== '') {
          const e = t.getFlatMidpoint(); this.drawText_(e, 0, 2, 2);
        }
      }
    }drawMultiLineString(t) {
      this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_)); const e = t.getExtent(); if (_e(this.extent_, e)) {
        if (this.strokeState_) {
          this.setContextStrokeState_(this.strokeState_); const e = this.context_; const i = t.getFlatCoordinates(); let n = 0; const r = t.getEnds(); const s = t.getStride(); e.beginPath(); for (let t = 0, e = r.length; t < e; ++t) {
            n = this.moveToLineTo_(i, n, r[t], s, !1);
          }e.stroke();
        } if (this.text_ !== '') {
          const e = t.getFlatMidpoints(); this.drawText_(e, 0, e.length, 2);
        }
      }
    }drawPolygon(t) {
      if (this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_)), _e(this.extent_, t.getExtent())) {
        if (this.strokeState_ || this.fillState_) {
          this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_); const e = this.context_; e.beginPath(), this.drawRings_(t.getOrientedFlatCoordinates(), 0, t.getEnds(), t.getStride()), this.fillState_ && e.fill(), this.strokeState_ && e.stroke();
        } if (this.text_ !== '') {
          const e = t.getFlatInteriorPoint(); this.drawText_(e, 0, 2, 2);
        }
      }
    }drawMultiPolygon(t) {
      if (this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_)), _e(this.extent_, t.getExtent())) {
        if (this.strokeState_ || this.fillState_) {
          this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_); const e = this.context_; const i = t.getOrientedFlatCoordinates(); let n = 0; const r = t.getEndss(); const s = t.getStride(); e.beginPath(); for (let t = 0, e = r.length; t < e; ++t) {
            const e = r[t]; n = this.drawRings_(i, n, e, s);
          } this.fillState_ && e.fill(), this.strokeState_ && e.stroke();
        } if (this.text_ !== '') {
          const e = t.getFlatInteriorPoints(); this.drawText_(e, 0, e.length, 2);
        }
      }
    }setContextFillState_(t) {
      const e = this.context_; const i = this.contextFillState_; i ? i.fillStyle != t.fillStyle && (i.fillStyle = t.fillStyle, e.fillStyle = t.fillStyle) : (e.fillStyle = t.fillStyle, this.contextFillState_ = {fillStyle: t.fillStyle});
    }setContextStrokeState_(t) {
      const e = this.context_; const i = this.contextStrokeState_; i ? (i.lineCap != t.lineCap && (i.lineCap = t.lineCap, e.lineCap = t.lineCap), a(i.lineDash, t.lineDash) || e.setLineDash(i.lineDash = t.lineDash), i.lineDashOffset != t.lineDashOffset && (i.lineDashOffset = t.lineDashOffset, e.lineDashOffset = t.lineDashOffset), i.lineJoin != t.lineJoin && (i.lineJoin = t.lineJoin, e.lineJoin = t.lineJoin), i.lineWidth != t.lineWidth && (i.lineWidth = t.lineWidth, e.lineWidth = t.lineWidth), i.miterLimit != t.miterLimit && (i.miterLimit = t.miterLimit, e.miterLimit = t.miterLimit), i.strokeStyle != t.strokeStyle && (i.strokeStyle = t.strokeStyle, e.strokeStyle = t.strokeStyle)) : (e.lineCap = t.lineCap, e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset, e.lineJoin = t.lineJoin, e.lineWidth = t.lineWidth, e.miterLimit = t.miterLimit, e.strokeStyle = t.strokeStyle, this.contextStrokeState_ = {lineCap: t.lineCap, lineDash: t.lineDash, lineDashOffset: t.lineDashOffset, lineJoin: t.lineJoin, lineWidth: t.lineWidth, miterLimit: t.miterLimit, strokeStyle: t.strokeStyle});
    }setContextTextState_(t) {
      const e = this.context_; const i = this.contextTextState_; const n = t.textAlign ? t.textAlign : mi; i ? (i.font != t.font && (i.font = t.font, e.font = t.font), i.textAlign != n && (i.textAlign = n, e.textAlign = n), i.textBaseline != t.textBaseline && (i.textBaseline = t.textBaseline, e.textBaseline = t.textBaseline)) : (e.font = t.font, e.textAlign = n, e.textBaseline = t.textBaseline, this.contextTextState_ = {font: t.font, textAlign: n, textBaseline: t.textBaseline});
    }setFillStrokeStyle(t, e) {
      if (t) {
        const e = t.getColor(); this.fillState_ = {fillStyle: qs(e || ci)};
      } else {
        this.fillState_ = null;
      } if (e) {
        const t = e.getColor(); const i = e.getLineCap(); const n = e.getLineDash(); const r = e.getLineDashOffset(); const s = e.getLineJoin(); const o = e.getWidth(); const a = e.getMiterLimit(); const l = n || pi; this.strokeState_ = {lineCap: void 0 !== i ? i : di, lineDash: this.pixelRatio_ === 1 ? l : l.map(((t)=>t * this.pixelRatio_)), lineDashOffset: (r || 0) * this.pixelRatio_, lineJoin: void 0 !== s ? s : gi, lineWidth: (void 0 !== o ? o : 1) * this.pixelRatio_, miterLimit: void 0 !== a ? a : 10, strokeStyle: qs(t || fi)};
      } else {
        this.strokeState_ = null;
      }
    }setImageStyle(t) {
      let e; if (!t || !(e = t.getSize())) {
        return void (this.image_ = null);
      } const i = t.getPixelRatio(this.pixelRatio_); const n = t.getAnchor(); const r = t.getOrigin(); this.image_ = t.getImage(this.pixelRatio_), this.imageAnchorX_ = n[0] * i, this.imageAnchorY_ = n[1] * i, this.imageHeight_ = e[1] * i, this.imageOpacity_ = t.getOpacity(), this.imageOriginX_ = r[0], this.imageOriginY_ = r[1], this.imageRotateWithView_ = t.getRotateWithView(), this.imageRotation_ = t.getRotation(); const s = t.getScaleArray(); this.imageScale_ = [s[0] * this.pixelRatio_ / i, s[1] * this.pixelRatio_ / i], this.imageWidth_ = e[0] * i;
    }setTextStyle(t) {
      if (t) {
        const e = t.getFill(); if (e) {
          const t = e.getColor(); this.textFillState_ = {fillStyle: qs(t || ci)};
        } else {
          this.textFillState_ = null;
        } const i = t.getStroke(); if (i) {
          const t = i.getColor(); const e = i.getLineCap(); const n = i.getLineDash(); const r = i.getLineDashOffset(); const s = i.getLineJoin(); const o = i.getWidth(); const a = i.getMiterLimit(); this.textStrokeState_ = {lineCap: void 0 !== e ? e : di, lineDash: n || pi, lineDashOffset: r || 0, lineJoin: void 0 !== s ? s : gi, lineWidth: void 0 !== o ? o : 1, miterLimit: void 0 !== a ? a : 10, strokeStyle: qs(t || fi)};
        } else {
          this.textStrokeState_ = null;
        } const n = t.getFont(); const r = t.getOffsetX(); const s = t.getOffsetY(); const o = t.getRotateWithView(); const a = t.getRotation(); const l = t.getScaleArray(); const h = t.getText(); const u = t.getTextAlign(); const c = t.getTextBaseline(); this.textState_ = {font: void 0 !== n ? n : ui, textAlign: void 0 !== u ? u : mi, textBaseline: void 0 !== c ? c : yi}, this.text_ = void 0 !== h ? Array.isArray(h) ? h.reduce(((t, e, i)=>t + (i % 2 ? ' ' : e)), '') : h : '', this.textOffsetX_ = void 0 !== r ? this.pixelRatio_ * r : 0, this.textOffsetY_ = void 0 !== s ? this.pixelRatio_ * s : 0, this.textRotateWithView_ = void 0 !== o && o, this.textRotation_ = void 0 !== a ? a : 0, this.textScale_ = [this.pixelRatio_ * l[0], this.pixelRatio_ * l[1]];
      } else {
        this.text_ = '';
      }
    }
  }; const Fh = 0.5; function Ph(t, e, i, r, s, o, a) {
    const l = K(t[0] * Fh, t[1] * Fh); l.imageSmoothingEnabled = !1; const h = l.canvas; const u = new kh(l, Fh, s, null, a); const c = i.length; const d = Math.floor(16777215 / c); const p = {}; for (let t = 1; t <= c; ++t) {
      const e = i[t - 1]; const n = e.getStyleFunction() || r; if (!r) {
        continue;
      } let a = n(e, o); if (!a) {
        continue;
      } Array.isArray(a) || (a = [a]); const l = (t * d).toString(16).padStart(7, '#00000'); for (let t = 0, i = a.length; t < i; ++t) {
        const i = a[t]; const n = i.getGeometryFunction()(e); if (!n || !_e(s, n.getExtent())) {
          continue;
        } const r = i.clone(); const o = r.getFill(); o && o.setColor(l); const h = r.getStroke(); h && (h.setColor(l), h.setLineDash(null)), r.setText(void 0); const u = i.getImage(); if (u && u.getOpacity() !== 0) {
          const t = u.getImageSize(); if (!t) {
            continue;
          } const e = K(t[0], t[1], void 0, {alpha: !1}); const i = e.canvas; e.fillStyle = l, e.fillRect(0, 0, i.width, i.height), r.setImage(new eo({img: i, imgSize: t, anchor: u.getAnchor(), anchorXUnits: 'pixels', anchorYUnits: 'pixels', offset: u.getOrigin(), opacity: 1, size: u.getSize(), scale: u.getScale(), rotation: u.getRotation(), rotateWithView: u.getRotateWithView()}));
        } const c = r.getZIndex() || 0; let d = p[c]; d || (d = {}, p[c] = d, d.Polygon = [], d.Circle = [], d.LineString = [], d.Point = []); const g = n.getType(); if (g === 'GeometryCollection') {
          const t = n.getGeometriesArrayRecursive(); for (let e = 0, i = t.length; e < i; ++e) {
            const i = t[e]; d[i.getType().replace('Multi', '')].push(i, r);
          }
        } else {
          d[g.replace('Multi', '')].push(n, r);
        }
      }
    } const g = Object.keys(p).map(Number).sort(n); for (let t = 0, i = g.length; t < i; ++t) {
      const i = p[g[t]]; for (const t in i) {
        const n = i[t]; for (let t = 0, i = n.length; t < i; t += 2) {
          u.setStyle(n[t + 1]); for (let i = 0, r = e.length; i < r; ++i) {
            u.setTransform(e[i]), u.drawGeometry(n[t]);
          }
        }
      }
    } return l.getImageData(0, 0, h.width, h.height);
  } function Lh(t, e, i) {
    const n = []; if (i) {
      const r = Math.floor(Math.round(t[0]) * Fh); const s = Math.floor(Math.round(t[1]) * Fh); const o = 4 * (we(r, 0, i.width - 1) + we(s, 0, i.height - 1) * i.width); const a = i.data[o]; const l = i.data[o + 1]; const h = i.data[o + 2] + 256 * (l + 256 * a); const u = Math.floor(16777215 / e.length); h && h % u == 0 && n.push(e[h / u - 1]);
    } return n;
  } const Ah = {Point(t, e, i, n, r) {
    const s = i.getImage(); const o = i.getText(); let a; if (s) {
      if (s.getImageState() != js) {
        return;
      } let l = t; if (r) {
        const h = s.getDeclutterMode(); if (h !== 'none') {
          if (l = r, h === 'obstacle') {
            const r = t.getBuilder(i.getZIndex(), 'Image'); r.setImageStyle(s, a), r.drawPoint(e, n);
          } else {
            o && o.getText() && (a = {});
          }
        }
      } const h = l.getBuilder(i.getZIndex(), 'Image'); h.setImageStyle(s, a), h.drawPoint(e, n);
    } if (o && o.getText()) {
      let s = t; r && (s = r); const l = s.getBuilder(i.getZIndex(), 'Text'); l.setTextStyle(o, a), l.drawText(e, n);
    }
  }, LineString(t, e, i, n, r) {
    const s = i.getStroke(); if (s) {
      const r = t.getBuilder(i.getZIndex(), 'LineString'); r.setFillStrokeStyle(null, s), r.drawLineString(e, n);
    } const o = i.getText(); if (o && o.getText()) {
      const s = (r || t).getBuilder(i.getZIndex(), 'Text'); s.setTextStyle(o), s.drawText(e, n);
    }
  }, Polygon(t, e, i, n, r) {
    const s = i.getFill(); const o = i.getStroke(); if (s || o) {
      const r = t.getBuilder(i.getZIndex(), 'Polygon'); r.setFillStrokeStyle(s, o), r.drawPolygon(e, n);
    } const a = i.getText(); if (a && a.getText()) {
      const s = (r || t).getBuilder(i.getZIndex(), 'Text'); s.setTextStyle(a), s.drawText(e, n);
    }
  }, MultiPoint(t, e, i, n, r) {
    const s = i.getImage(); const o = i.getText(); let a; if (s) {
      if (s.getImageState() != js) {
        return;
      } let l = t; if (r) {
        const h = s.getDeclutterMode(); if (h !== 'none') {
          if (l = r, h === 'obstacle') {
            const r = t.getBuilder(i.getZIndex(), 'Image'); r.setImageStyle(s, a), r.drawMultiPoint(e, n);
          } else {
            o && o.getText() && (a = {});
          }
        }
      } const h = l.getBuilder(i.getZIndex(), 'Image'); h.setImageStyle(s, a), h.drawMultiPoint(e, n);
    } if (o && o.getText()) {
      let s = t; r && (s = r); const l = s.getBuilder(i.getZIndex(), 'Text'); l.setTextStyle(o, a), l.drawText(e, n);
    }
  }, MultiLineString(t, e, i, n, r) {
    const s = i.getStroke(); if (s) {
      const r = t.getBuilder(i.getZIndex(), 'LineString'); r.setFillStrokeStyle(null, s), r.drawMultiLineString(e, n);
    } const o = i.getText(); if (o && o.getText()) {
      const s = (r || t).getBuilder(i.getZIndex(), 'Text'); s.setTextStyle(o), s.drawText(e, n);
    }
  }, MultiPolygon(t, e, i, n, r) {
    const s = i.getFill(); const o = i.getStroke(); if (o || s) {
      const r = t.getBuilder(i.getZIndex(), 'Polygon'); r.setFillStrokeStyle(s, o), r.drawMultiPolygon(e, n);
    } const a = i.getText(); if (a && a.getText()) {
      const s = (r || t).getBuilder(i.getZIndex(), 'Text'); s.setTextStyle(a), s.drawText(e, n);
    }
  }, GeometryCollection(t, e, i, n, r) {
    const s = e.getGeometriesArray(); let o; let a; for (o = 0, a = s.length; o < a; ++o) {
      (0, Ah[s[o].getType()])(t, s[o], i, n, r);
    }
  }, Circle(t, e, i, n, r) {
    const s = i.getFill(); const o = i.getStroke(); if (s || o) {
      const r = t.getBuilder(i.getZIndex(), 'Circle'); r.setFillStrokeStyle(s, o), r.drawCircle(e, n);
    } const a = i.getText(); if (a && a.getText()) {
      const s = (r || t).getBuilder(i.getZIndex(), 'Text'); s.setTextStyle(a), s.drawText(e, n);
    }
  }}; function zh(t, e) {
    return parseInt(F(t), 10) - parseInt(F(e), 10);
  } function Oh(t, e) {
    const i = Dh(t, e); return i * i;
  } function Dh(t, e) {
    return 0.5 * t / e;
  } function jh(t, e, i, n, r, s, o) {
    let a = !1; const l = i.getImage(); if (l) {
      const t = l.getImageState(); t == js || t == Gs ? l.unlistenImageChange(r) : (t == Os && l.load(), l.listenImageChange(r), a = !0);
    } return function (t, e, i, n, r, s) {
      const o = i.getGeometryFunction()(e); if (!o) {
        return;
      } const a = o.simplifyTransformed(n, r); if (i.getRenderer()) {
        Gh(t, a, i, e);
      } else {
        (0, Ah[a.getType()])(t, a, i, e, s);
      }
    }(t, e, i, n, s, o), a;
  } function Gh(t, e, i, n) {
    if (e.getType() == 'GeometryCollection') {
      const r = e.getGeometries(); for (let e = 0, s = r.length; e < s; ++e) {
        Gh(t, r[e], i, n);
      } return;
    }t.getBuilder(i.getZIndex(), 'Default').drawCustom(e, n, i.getRenderer(), i.getHitDetectionRenderer());
  } let Nh = class extends Ho {
    constructor(t) {
      super(t), this.boundHandleStyleImageChange_ = this.handleStyleImageChange_.bind(this), this.animatingOrInteracting_, this.hitDetectionImageData_ = null, this.renderedFeatures_ = null, this.renderedRevision_ = -1, this.renderedResolution_ = NaN, this.renderedExtent_ = [1 / 0, 1 / 0, -1 / 0, -1 / 0], this.wrappedRenderedExtent_ = [1 / 0, 1 / 0, -1 / 0, -1 / 0], this.renderedRotation_, this.renderedCenter_ = null, this.renderedProjection_ = null, this.renderedRenderOrder_ = null, this.replayGroup_ = null, this.replayGroupChanged = !0, this.declutterExecutorGroup = null, this.clipping = !0, this.compositionContext_ = null, this.opacity_ = 1;
    }renderWorlds(t, e, i) {
      const n = e.extent; const r = e.viewState; const s = r.center; const o = r.resolution; const a = r.projection; const l = r.rotation; const h = a.getExtent(); const u = this.getLayer().getSource(); const c = e.pixelRatio; const d = e.viewHints; const p = !(d[Zi] || d[Ui]); const g = this.compositionContext_; const f = Math.round(e.size[0] * c); const m = Math.round(e.size[1] * c); const y = u.getWrapX() && a.canWrapX(); const _ = y ? ye(h) : null; const v = y ? Math.ceil((n[2] - h[2]) / _) + 1 : 1; let x = y ? Math.floor((n[0] - h[0]) / _) : 0; do {
        const e = this.getRenderTransform(s, o, l, c, f, m, x * _); t.execute(g, 1, e, l, p, void 0, i);
      } while (++x < v);
    }setupCompositionContext_() {
      if (this.opacity_ !== 1) {
        const t = K(this.context.canvas.width, this.context.canvas.height, Zo); this.compositionContext_ = t;
      } else {
        this.compositionContext_ = this.context;
      }
    }releaseCompositionContext_() {
      if (this.opacity_ !== 1) {
        const t = this.context.globalAlpha; this.context.globalAlpha = this.opacity_, this.context.drawImage(this.compositionContext_.canvas, 0, 0), this.context.globalAlpha = t, Z(this.compositionContext_), Zo.push(this.compositionContext_.canvas), this.compositionContext_ = null;
      }
    }renderDeclutter(t) {
      this.declutterExecutorGroup && (this.setupCompositionContext_(), this.renderWorlds(this.declutterExecutorGroup, t, t.declutterTree), this.releaseCompositionContext_());
    }renderFrame(t, e) {
      const i = t.pixelRatio; const n = t.layerStatesArray[t.layerIndex]; !function (t, e, i) {
        It(t, e, 0, 0, i, 0, 0);
      }(this.pixelTransform, 1 / i, 1 / i), Pt(this.inversePixelTransform, this.pixelTransform); const r = At(this.pixelTransform); this.useContainer(e, r, this.getBackground(t)); const s = this.context; const o = s.canvas; const a = this.replayGroup_; const l = this.declutterExecutorGroup; if ((!a || a.isEmpty()) && (!l || l.isEmpty())) {
        return null;
      } const h = Math.round(t.size[0] * i); const u = Math.round(t.size[1] * i); o.width != h || o.height != u ? (o.width = h, o.height = u, o.style.transform !== r && (o.style.transform = r)) : this.containerReused || s.clearRect(0, 0, h, u), this.preRender(s, t); const c = t.viewState; c.projection, this.opacity_ = n.opacity, this.setupCompositionContext_(); let d = !1; let p = !0; if (n.extent && this.clipping) {
        const e = jn(n.extent); p = _e(e, t.extent), d = p && !Yt(e, t.extent), d && this.clipUnrotated(this.compositionContext_, t, e);
      } return p && this.renderWorlds(a, t), d && this.compositionContext_.restore(), this.releaseCompositionContext_(), this.postRender(s, t), this.renderedRotation_ !== c.rotation && (this.renderedRotation_ = c.rotation, this.hitDetectionImageData_ = null), this.container;
    }getFeatures(t) {
      return new Promise(((e)=>{
        if (!this.hitDetectionImageData_ && !this.animatingOrInteracting_) {
          const t = [this.context.canvas.width, this.context.canvas.height]; Mt(this.pixelTransform, t); const e = this.renderedCenter_; const i = this.renderedResolution_; const n = this.renderedRotation_; const r = this.renderedProjection_; const s = this.wrappedRenderedExtent_; const o = this.getLayer(); const a = []; const l = t[0] * Fh; const h = t[1] * Fh; a.push(this.getRenderTransform(e, i, n, Fh, l, h, 0).slice()); const u = o.getSource(); const c = r.getExtent(); if (u.getWrapX() && r.canWrapX() && !Yt(c, s)) {
            let t = s[0]; const r = ye(c); let o; let u = 0; for (;t < c[0];) {
              --u, o = r * u, a.push(this.getRenderTransform(e, i, n, Fh, l, h, o).slice()), t += r;
            } for (u = 0, t = s[2]; t > c[2];) {
              ++u, o = r * u, a.push(this.getRenderTransform(e, i, n, Fh, l, h, o).slice()), t -= r;
            }
          } this.hitDetectionImageData_ = Ph(t, a, this.renderedFeatures_, o.getStyleFunction(), s, i, n);
        }e(Lh(t, this.renderedFeatures_, this.hitDetectionImageData_));
      }));
    }forEachFeatureAtCoordinate(t, e, i, n, r) {
      if (!this.replayGroup_) {
        return;
      } const s = e.viewState.resolution; const o = e.viewState.rotation; const a = this.getLayer(); const l = {}; const h = function (t, e, i) {
        const s = F(t); const o = l[s]; if (o) {
          if (!0 !== o && i < o.distanceSq) {
            if (i === 0) {
              return l[s] = !0, r.splice(r.lastIndexOf(o), 1), n(t, a, e);
            } o.geometry = e, o.distanceSq = i;
          }
        } else {
          if (i === 0) {
            return l[s] = !0, n(t, a, e);
          } r.push(l[s] = {feature: t, layer: a, geometry: e, distanceSq: i, callback: n});
        }
      }; let u; const c = [this.replayGroup_]; return this.declutterExecutorGroup && c.push(this.declutterExecutorGroup), c.some(((n)=>u = n.forEachFeatureAtCoordinate(t, s, o, i, h, n === this.declutterExecutorGroup && e.declutterTree ? e.declutterTree.all().map(((t)=>t.value)) : null))), u;
    }handleFontsChanged() {
      const t = this.getLayer(); t.getVisible() && this.replayGroup_ && t.changed();
    }handleStyleImageChange_(t) {
      this.renderIfReadyAndVisible();
    }prepareFrame(t) {
      const e = this.getLayer(); const i = e.getSource(); if (!i) {
        return !1;
      } const n = t.viewHints[Zi]; const r = t.viewHints[Ui]; const s = e.getUpdateWhileAnimating(); const o = e.getUpdateWhileInteracting(); if (this.ready && !s && n || !o && r) {
        return this.animatingOrInteracting_ = !0, !0;
      } this.animatingOrInteracting_ = !1; const l = t.extent; const h = t.viewState; const u = h.projection; const c = h.resolution; const d = t.pixelRatio; const p = e.getRevision(); const g = e.getRenderBuffer(); let f = e.getRenderOrder(); void 0 === f && (f = zh); const m = h.center.slice(); const y = Xt(l, g * c); const _ = y.slice(); const v = [y.slice()]; const x = u.getExtent(); if (i.getWrapX() && u.canWrapX() && !Yt(x, t.extent)) {
        const t = ye(x); const e = Math.max(ye(y) / 2, t); y[0] = x[0] - e, y[2] = x[2] + e, oi(m, u); const i = be(v[0], u); i[0] < x[0] && i[2] < x[2] ? v.push([i[0] + t, i[1], i[2] + t, i[3]]) : i[0] > x[0] && i[2] > x[2] && v.push([i[0] - t, i[1], i[2] - t, i[3]]);
      } if (this.ready && this.renderedResolution_ == c && this.renderedRevision_ == p && this.renderedRenderOrder_ == f && Yt(this.wrappedRenderedExtent_, y)) {
        return a(this.renderedExtent_, _) || (this.hitDetectionImageData_ = null, this.renderedExtent_ = _), this.renderedCenter_ = m, this.replayGroupChanged = !1, !0;
      } this.replayGroup_ = null; const b = new fh(Dh(c, d), y, c, d); let w; this.getLayer().getDeclutter() && (w = new fh(Dh(c, d), y, c, d)); for (let t = 0, e = v.length; t < e; ++t) {
        i.loadFeatures(v[t], c, u);
      } const C = Oh(c, d); let S = !0; const T = (t)=>{
        let i; const n = t.getStyleFunction() || e.getStyleFunction(); if (n && (i = n(t, c)), i) {
          const e = this.renderFeature(t, C, i, b, undefined, w); S = S && !e;
        }
      }; const E = Dn(y); const R = i.getFeaturesInExtent(E); f && R.sort(f); for (let t = 0, e = R.length; t < e; ++t) {
        T(R[t]);
      } this.renderedFeatures_ = R, this.ready = S; const I = b.finish(); const M = new Mh(y, c, d, i.getOverlaps(), I, e.getRenderBuffer()); return w && (this.declutterExecutorGroup = new Mh(y, c, d, i.getOverlaps(), w.finish(), e.getRenderBuffer())), this.renderedResolution_ = c, this.renderedRevision_ = p, this.renderedRenderOrder_ = f, this.renderedExtent_ = _, this.wrappedRenderedExtent_ = y, this.renderedCenter_ = m, this.renderedProjection_ = u, this.replayGroup_ = M, this.hitDetectionImageData_ = null, this.replayGroupChanged = !0, !0;
    }renderFeature(t, e, i, n, r, s) {
      if (!i) {
        return !1;
      } let o = !1; if (Array.isArray(i)) {
        for (let a = 0, l = i.length; a < l; ++a) {
          o = jh(n, t, i[a], e, this.boundHandleStyleImageChange_, r, s) || o;
        }
      } else {
        o = jh(n, t, i, e, this.boundHandleStyleImageChange_, r, s);
      } return o;
    }
  }; let Wh = class extends th {
    constructor(t) {
      super(t);
    }createRenderer() {
      return new Nh(this);
    }
  }; let Xh = class {
    constructor(t) {
      this.rbush_ = new Al(t), this.items_ = {};
    }insert(t, e) {
      const i = {minX: t[0], minY: t[1], maxX: t[2], maxY: t[3], value: e}; this.rbush_.insert(i), this.items_[F(e)] = i;
    }load(t, e) {
      const i = new Array(e.length); for (let n = 0, r = e.length; n < r; n++) {
        const r = t[n]; const s = e[n]; const o = {minX: r[0], minY: r[1], maxX: r[2], maxY: r[3], value: s}; i[n] = o, this.items_[F(s)] = o;
      } this.rbush_.load(i);
    }remove(t) {
      const e = F(t); const i = this.items_[e]; return delete this.items_[e], this.rbush_.remove(i) !== null;
    }update(t, e) {
      const i = this.items_[F(e)]; te([i.minX, i.minY, i.maxX, i.maxY], t) || (this.remove(e), this.insert(t, e));
    }getAll() {
      return this.rbush_.all().map((function (t) {
        return t.value;
      }));
    }getInExtent(t) {
      const e = {minX: t[0], minY: t[1], maxX: t[2], maxY: t[3]}; return this.rbush_.search(e).map((function (t) {
        return t.value;
      }));
    }forEach(t) {
      return this.forEach_(this.getAll(), t);
    }forEachInExtent(t, e) {
      return this.forEach_(this.getInExtent(t), e);
    }forEach_(t, e) {
      let i; for (let n = 0, r = t.length; n < r; n++) {
        if (i = e(t[n]), i) {
          return i;
        }
      } return i;
    }isEmpty() {
      return d(this.items_);
    }clear() {
      this.rbush_.clear(), this.items_ = {};
    }getExtent(t) {
      const e = this.rbush_.toJSON(); return Ht(e.minX, e.minY, e.maxX, e.maxY, t);
    }concat(t) {
      this.rbush_.load(t.rbush_.all()); for (const e in t.items_) {
        this.items_[e] = t.items_[e];
      }
    }
  }; let qh = 'addfeature'; let Bh = 'changefeature'; let Vh = 'clear'; let Yh = 'removefeature'; let Kh = 'featuresloadstart'; let Zh = 'featuresloadend'; let Uh = 'featuresloaderror'; function Hh(t, e) {
    return [[-1 / 0, -1 / 0, 1 / 0, 1 / 0]];
  } function Jh(t, e) {
    return [t];
  } function Qh(t, e, i, n, r, s, o) {
    const a = new XMLHttpRequest(); a.open('GET', typeof t === 'function' ? t(i, n, r) : t, !0), e.getType() == 'arraybuffer' && (a.responseType = 'arraybuffer'), a.withCredentials = false, a.onload = function (t) {
      if (!a.status || a.status >= 200 && a.status < 300) {
        const t = e.getType(); let n; t == 'json' || t == 'text' ? n = a.responseText : t == 'xml' ? (n = a.responseXML, n || (n = (new DOMParser()).parseFromString(a.responseText, 'application/xml'))) : t == 'arraybuffer' && (n = a.response), n ? s(e.readFeatures(n, {extent: i, featureProjection: r}), e.readProjection(n)) : o();
      } else {
        o();
      }
    }, a.onerror = o, a.send();
  } function $h(t, e) {
    return function (i, n, r, s, o) {
      const a = this; Qh(t, e, i, n, r, (function (t, e) {
        a.addFeatures(t), void 0 !== s && s(t);
      }), o || u);
    };
  } class tu extends t {
    constructor(t, e, i) {
      super(t), this.feature = e, this.features = i;
    }
  } let eu = class extends Oa {
    constructor(t) {
      super({attributions: (t = t || {}).attributions, interpolate: !0, projection: void 0, state: 'ready', wrapX: void 0 === t.wrapX || t.wrapX}), this.on, this.once, this.un, this.loader_ = u, this.format_ = t.format, this.overlaps_ = void 0 === t.overlaps || t.overlaps, this.url_ = t.url, void 0 !== t.loader ? this.loader_ = t.loader : void 0 !== this.url_ && (St(this.format_, 7), this.loader_ = $h(this.url_, this.format_)), this.strategy_ = void 0 !== t.strategy ? t.strategy : Hh; const e = void 0 === t.useSpatialIndex || t.useSpatialIndex; let i; let n; this.featuresRtree_ = e ? new Xh() : null, this.loadedExtentsRtree_ = new Xh(), this.loadingExtentsCount_ = 0, this.nullGeometryFeatures_ = {}, this.idIndex_ = {}, this.uidIndex_ = {}, this.featureChangeKeys_ = {}, this.featuresCollection_ = null, Array.isArray(t.features) ? n = t.features : t.features && (i = t.features, n = i.getArray()), e || void 0 !== i || (i = new Ct(n)), void 0 !== n && this.addFeaturesInternal(n), void 0 !== i && this.bindFeaturesCollection_(i);
    }addFeature(t) {
      this.addFeatureInternal(t), this.changed();
    }addFeatureInternal(t) {
      const e = F(t); if (!this.addToIndex_(e, t)) {
        return void (this.featuresCollection_ && this.featuresCollection_.remove(t));
      } this.setupChangeEvents_(e, t); const i = t.getGeometry(); if (i) {
        const e = i.getExtent(); this.featuresRtree_ && this.featuresRtree_.insert(e, t);
      } else {
        this.nullGeometryFeatures_[e] = t;
      } this.dispatchEvent(new tu(qh, t));
    }setupChangeEvents_(t, i) {
      this.featureChangeKeys_[t] = [S(i, g, this.handleFeatureChange_, this), S(i, e, this.handleFeatureChange_, this)];
    }addToIndex_(t, e) {
      let i = !0; const n = e.getId(); return void 0 !== n && (n.toString() in this.idIndex_ ? i = !1 : this.idIndex_[n.toString()] = e), i && (St(!(t in this.uidIndex_), 30), this.uidIndex_[t] = e), i;
    }addFeatures(t) {
      this.addFeaturesInternal(t), this.changed();
    }addFeaturesInternal(t) {
      const e = []; const i = []; const n = []; for (let e = 0, n = t.length; e < n; e++) {
        const n = t[e]; const r = F(n); this.addToIndex_(r, n) && i.push(n);
      } for (let t = 0, r = i.length; t < r; t++) {
        const r = i[t]; const s = F(r); this.setupChangeEvents_(s, r); const o = r.getGeometry(); if (o) {
          const t = o.getExtent(); e.push(t), n.push(r);
        } else {
          this.nullGeometryFeatures_[s] = r;
        }
      } if (this.featuresRtree_ && this.featuresRtree_.load(e, n), this.hasListener(qh)) {
        for (let t = 0, e = i.length; t < e; t++) {
          this.dispatchEvent(new tu(qh, i[t]));
        }
      }
    }bindFeaturesCollection_(t) {
      let e = !1; this.addEventListener(qh, (function (i) {
        e || (e = !0, t.push(i.feature), e = !1);
      })), this.addEventListener(Yh, (function (i) {
        e || (e = !0, t.remove(i.feature), e = !1);
      })), t.addEventListener(vt, ((t)=>{
        e || (e = !0, this.addFeature(t.element), e = !1);
      })), t.addEventListener(xt, ((t)=>{
        e || (e = !0, this.removeFeature(t.element), e = !1);
      })), this.featuresCollection_ = t;
    }clear(t) {
      if (t) {
        for (const t in this.featureChangeKeys_) {
          this.featureChangeKeys_[t].forEach(E);
        } this.featuresCollection_ || (this.featureChangeKeys_ = {}, this.idIndex_ = {}, this.uidIndex_ = {});
      } else if (this.featuresRtree_) {
        const t = (t)=>{
          this.removeFeatureInternal(t);
        }; this.featuresRtree_.forEach(t); for (const t in this.nullGeometryFeatures_) {
          this.removeFeatureInternal(this.nullGeometryFeatures_[t]);
        }
      } this.featuresCollection_ && this.featuresCollection_.clear(), this.featuresRtree_ && this.featuresRtree_.clear(), this.nullGeometryFeatures_ = {}; const e = new tu(Vh); this.dispatchEvent(e), this.changed();
    }forEachFeature(t) {
      if (this.featuresRtree_) {
        return this.featuresRtree_.forEach(t);
      } this.featuresCollection_ && this.featuresCollection_.forEach(t);
    }forEachFeatureAtCoordinateDirect(t, e) {
      const i = [t[0], t[1], t[0], t[1]]; return this.forEachFeatureInExtent(i, (function (i) {
        if (i.getGeometry().intersectsCoordinate(t)) {
          return e(i);
        }
      }));
    }forEachFeatureInExtent(t, e) {
      if (this.featuresRtree_) {
        return this.featuresRtree_.forEachInExtent(t, e);
      } this.featuresCollection_ && this.featuresCollection_.forEach(e);
    }forEachFeatureIntersectingExtent(t, e) {
      return this.forEachFeatureInExtent(t, (function (i) {
        if (i.getGeometry().intersectsExtent(t)) {
          const t = e(i); if (t) {
            return t;
          }
        }
      }));
    }getFeaturesCollection() {
      return this.featuresCollection_;
    }getFeatures() {
      let t; return this.featuresCollection_ ? t = this.featuresCollection_.getArray().slice(0) : this.featuresRtree_ && (t = this.featuresRtree_.getAll(), d(this.nullGeometryFeatures_) || o(t, Object.values(this.nullGeometryFeatures_))), t;
    }getFeaturesAtCoordinate(t) {
      const e = []; return this.forEachFeatureAtCoordinateDirect(t, (function (t) {
        e.push(t);
      })), e;
    }getFeaturesInExtent(t, e) {
      if (this.featuresRtree_) {
        if (!(e && e.canWrapX() && this.getWrapX())) {
          return this.featuresRtree_.getInExtent(t);
        } const i = function (t, e) {
          if (e.canWrapX()) {
            const i = e.getExtent(); if (!isFinite(t[0]) || !isFinite(t[2])) {
              return [[i[0], t[1], i[2], t[3]]];
            } be(t, e); const n = ye(i); if (ye(t) > n) {
              return [[i[0], t[1], i[2], t[3]]];
            } if (t[0] < i[0]) {
              return [[t[0] + n, t[1], i[2], t[3]], [i[0], t[1], t[2], t[3]]];
            } if (t[2] > i[2]) {
              return [[t[0], t[1], i[2], t[3]], [i[0], t[1], t[2] - n, t[3]]];
            }
          } return [t];
        }(t, e); return [].concat(...i.map(((t)=>this.featuresRtree_.getInExtent(t))));
      } return this.featuresCollection_ ? this.featuresCollection_.getArray().slice(0) : [];
    }getClosestFeatureToCoordinate(t, e) {
      const i = t[0]; const n = t[1]; let r = null; const s = [NaN, NaN]; let o = 1 / 0; const a = [-1 / 0, -1 / 0, 1 / 0, 1 / 0]; return e = e || l, this.featuresRtree_.forEachInExtent(a, (function (t) {
        if (e(t)) {
          const e = t.getGeometry(); const l = o; if (o = e.closestPointXY(i, n, s, o), o < l) {
            r = t; const e = Math.sqrt(o); a[0] = i - e, a[1] = n - e, a[2] = i + e, a[3] = n + e;
          }
        }
      })), r;
    }getExtent(t) {
      return this.featuresRtree_.getExtent(t);
    }getFeatureById(t) {
      const e = this.idIndex_[t.toString()]; return void 0 !== e ? e : null;
    }getFeatureByUid(t) {
      const e = this.uidIndex_[t]; return void 0 !== e ? e : null;
    }getFormat() {
      return this.format_;
    }getOverlaps() {
      return this.overlaps_;
    }getUrl() {
      return this.url_;
    }handleFeatureChange_(t) {
      const e = t.target; const i = F(e); const n = e.getGeometry(); if (n) {
        const t = n.getExtent(); i in this.nullGeometryFeatures_ ? (delete this.nullGeometryFeatures_[i], this.featuresRtree_ && this.featuresRtree_.insert(t, e)) : this.featuresRtree_ && this.featuresRtree_.update(t, e);
      } else {
        i in this.nullGeometryFeatures_ || (this.featuresRtree_ && this.featuresRtree_.remove(e), this.nullGeometryFeatures_[i] = e);
      } const r = e.getId(); if (void 0 !== r) {
        const t = r.toString(); this.idIndex_[t] !== e && (this.removeFromIdIndex_(e), this.idIndex_[t] = e);
      } else {
        this.removeFromIdIndex_(e), this.uidIndex_[i] = e;
      } this.changed(), this.dispatchEvent(new tu(Bh, e));
    }hasFeature(t) {
      const e = t.getId(); return void 0 !== e ? e in this.idIndex_ : F(t) in this.uidIndex_;
    }isEmpty() {
      return this.featuresRtree_ ? this.featuresRtree_.isEmpty() && d(this.nullGeometryFeatures_) : !this.featuresCollection_ || this.featuresCollection_.getLength() === 0;
    }loadFeatures(t, e, i) {
      const n = this.loadedExtentsRtree_; const r = this.strategy_(t, e, i); for (let t = 0, s = r.length; t < s; ++t) {
        const s = r[t]; n.forEachInExtent(s, (function (t) {
          return Yt(t.extent, s);
        })) || (++this.loadingExtentsCount_, this.dispatchEvent(new tu(Kh)), this.loader_.call(this, s, e, i, ((t)=>{
          --this.loadingExtentsCount_, this.dispatchEvent(new tu(Zh, void 0, t));
        }), (()=>{
          --this.loadingExtentsCount_, this.dispatchEvent(new tu(Uh));
        })), n.insert(s, {extent: s.slice()}));
      } this.loading = !(this.loader_.length < 4) && this.loadingExtentsCount_ > 0;
    }refresh() {
      this.clear(!0), this.loadedExtentsRtree_.clear(), super.refresh();
    }removeLoadedExtent(t) {
      const e = this.loadedExtentsRtree_; let i; e.forEachInExtent(t, (function (e) {
        if (te(e.extent, t)) {
          return i = e, !0;
        }
      })), i && e.remove(i);
    }removeFeature(t) {
      if (!t) {
        return;
      } const e = F(t); e in this.nullGeometryFeatures_ ? delete this.nullGeometryFeatures_[e] : this.featuresRtree_ && this.featuresRtree_.remove(t); this.removeFeatureInternal(t) && this.changed();
    }removeFeatureInternal(t) {
      const e = F(t); const i = this.featureChangeKeys_[e]; if (!i) {
        return;
      } i.forEach(E), delete this.featureChangeKeys_[e]; const n = t.getId(); return void 0 !== n && delete this.idIndex_[n.toString()], delete this.uidIndex_[e], this.dispatchEvent(new tu(Yh, t)), t;
    }removeFromIdIndex_(t) {
      let e = !1; for (const i in this.idIndex_) {
        if (this.idIndex_[i] === t) {
          delete this.idIndex_[i], e = !0; break;
        }
      } return e;
    }setLoader(t) {
      this.loader_ = t;
    }setUrl(t) {
      St(this.format_, 7), this.url_ = t, this.setLoader($h(t, this.format_));
    }
  }; const iu = {image: ['Polygon', 'Circle', 'LineString', 'Image', 'Text'], hybrid: ['Polygon', 'LineString'], vector: []}; const nu = {hybrid: ['Image', 'Text', 'Default'], vector: ['Polygon', 'Circle', 'LineString', 'Image', 'Text', 'Default']}; let ru = class extends Ja {
    constructor(t) {
      super(t), this.boundHandleStyleImageChange_ = this.handleStyleImageChange_.bind(this), this.renderedLayerRevision_, this.renderedPixelToCoordinateTransform_ = null, this.renderedRotation_, this.tmpTransform_ = [1, 0, 0, 1, 0, 0];
    }prepareTile(t, e, i) {
      let n; const r = t.getState(); return r !== Bi && r !== Vi || (this.updateExecutorGroup_(t, e, i), this.tileImageNeedsRender_(t) && (n = !0)), n;
    }getTile(t, e, i, n) {
      const r = n.pixelRatio; const s = n.viewState; const o = s.resolution; const a = s.projection; const l = this.getLayer(); const h = l.getSource().getTile(t, e, i, r, a); const u = n.viewHints; const c = !(u[Zi] || u[Ui]); !c && h.wantedResolution || (h.wantedResolution = o); return this.prepareTile(h, r, a) && (c || Date.now() - n.time < 8) && l.getRenderMode() !== 'vector' && this.renderTileImage_(h, n), super.getTile(t, e, i, n);
    }isDrawableTile(t) {
      const e = this.getLayer(); return super.isDrawableTile(t) && (e.getRenderMode() === 'vector' ? F(e) in t.executorGroups : t.hasContext(e));
    }getTileImage(t) {
      return t.getImage(this.getLayer());
    }prepareFrame(t) {
      const e = this.getLayer().getRevision(); return this.renderedLayerRevision_ !== e && (this.renderedLayerRevision_ = e, this.renderedTiles.length = 0), super.prepareFrame(t);
    }updateExecutorGroup_(t, e, i) {
      const n = this.getLayer(); const r = n.getRevision(); const s = n.getRenderOrder() || null; const o = t.wantedResolution; const a = t.getReplayState(n); if (!a.dirty && a.renderedResolution === o && a.renderedRevision == r && a.renderedRenderOrder == s) {
        return;
      } const l = n.getSource(); const h = n.getDeclutter(); const u = l.getTileGrid(); const c = l.getTileGridForProjection(i).getTileCoordExtent(t.wrappedTileCoord); const d = l.getSourceTiles(e, i, t); const p = F(n); delete t.hitDetectionImageData[p], t.executorGroups[p] = [], h && (t.declutterExecutorGroups[p] = []), a.dirty = !1; for (let i = 0, r = d.length; i < r; ++i) {
        const r = d[i]; if (r.getState() != Bi) {
          continue;
        } const g = r.tileCoord; const f = u.getTileCoordExtent(g); const m = ge(c, f); const y = Xt(m, n.getRenderBuffer() * o, this.tmpExtent); const _ = te(f, m) ? null : y; const v = new fh(0, y, o, e); const x = h ? new fh(0, m, o, e) : void 0; const b = Oh(o, e); const w = function (t) {
          let e; const i = t.getStyleFunction() || n.getStyleFunction(); if (i && (e = i(t, o)), e) {
            const i = this.renderFeature(t, b, e, v, x); a.dirty = a.dirty || i;
          }
        }; const C = r.getFeatures(); s && s !== a.renderedRenderOrder && C.sort(s); for (let t = 0, e = C.length; t < e; ++t) {
          const e = C[t]; _ && !_e(_, e.getGeometry().getExtent()) || w.call(this, e);
        } const S = v.finish(); const T = n.getRenderMode() !== 'vector' && h && d.length === 1 ? null : m; const E = new Mh(T, o, e, l.getOverlaps(), S, n.getRenderBuffer()); if (t.executorGroups[p].push(E), x) {
          const i = new Mh(null, o, e, l.getOverlaps(), x.finish(), n.getRenderBuffer()); t.declutterExecutorGroups[p].push(i);
        }
      }a.renderedRevision = r, a.renderedRenderOrder = s, a.renderedResolution = o;
    }forEachFeatureAtCoordinate(t, e, i, n, r) {
      const s = e.viewState.resolution; const o = e.viewState.rotation; i = i == null ? 0 : i; const a = this.getLayer(); const l = a.getSource().getTileGridForProjection(e.viewState.projection); const h = Wt([t]); Xt(h, s * i, h); const u = {}; const c = function (t, e, i) {
        let s = t.getId(); void 0 === s && (s = F(t)); const o = u[s]; if (o) {
          if (!0 !== o && i < o.distanceSq) {
            if (i === 0) {
              return u[s] = !0, r.splice(r.lastIndexOf(o), 1), n(t, a, e);
            } o.geometry = e, o.distanceSq = i;
          }
        } else {
          if (i === 0) {
            return u[s] = !0, n(t, a, e);
          } r.push(u[s] = {feature: t, layer: a, geometry: e, distanceSq: i, callback: n});
        }
      }; const d = this.renderedTiles; let p; for (let n = 0, r = d.length; !p && n < r; ++n) {
        const r = d[n]; if (!_e(l.getTileCoordExtent(r.wrappedTileCoord), h)) {
          continue;
        } const u = F(a); const g = [r.executorGroups[u]]; const f = r.declutterExecutorGroups[u]; f && g.push(f), g.some(((n)=>{
          const r = n === f ? e.declutterTree.all().map(((t)=>t.value)) : null; for (let e = 0, a = n.length; e < a; ++e) {
            const a = n[e]; if (p = a.forEachFeatureAtCoordinate(t, s, o, i, c, r), p) {
              return !0;
            }
          }
        }));
      } return p;
    }getFeatures(t) {
      return new Promise(((e, i)=>{
        const n = this.getLayer(); const r = F(n); const s = n.getSource(); const o = this.renderedProjection; const a = o.getExtent(); const l = this.renderedResolution; const h = s.getTileGridForProjection(o); const u = Mt(this.renderedPixelToCoordinateTransform_, t.slice()); const c = h.getTileCoordForCoordAndResolution(u, l); let d; for (let t = 0, e = this.renderedTiles.length; t < e; ++t) {
          if (c.toString() === this.renderedTiles[t].tileCoord.toString()) {
            if (d = this.renderedTiles[t], d.getState() === Bi) {
              const t = h.getTileCoordExtent(d.tileCoord); s.getWrapX() && o.canWrapX() && !Yt(a, t) && oi(u, o); break;
            }d = void 0;
          }
        } if (!d || d.loadingSourceTiles > 0) {
          return void e([]);
        } const p = fe(h.getTileCoordExtent(d.wrappedTileCoord)); const g = [(u[0] - p[0]) / l, (p[1] - u[1]) / l]; const f = d.getSourceTiles().reduce((function (t, e) {
          return t.concat(e.getFeatures());
        }), []); let m = d.hitDetectionImageData[r]; if (!m) {
          const t = Ps(h.getTileSize(h.getZForResolution(l, s.zDirection))); const e = this.renderedRotation_; m = Ph(t, [this.getRenderTransform(h.getTileCoordCenter(d.wrappedTileCoord), l, 0, Fh, t[0] * Fh, t[1] * Fh, 0)], f, n.getStyleFunction(), h.getTileCoordExtent(d.wrappedTileCoord), d.getReplayState(n).renderedResolution, e), d.hitDetectionImageData[r] = m;
        }e(Lh(g, f, m));
      }));
    }handleFontsChanged() {
      const t = this.getLayer(); t.getVisible() && void 0 !== this.renderedLayerRevision_ && t.changed();
    }handleStyleImageChange_(t) {
      this.renderIfReadyAndVisible();
    }renderDeclutter(t) {
      const e = this.context; const i = e.globalAlpha; e.globalAlpha = this.getLayer().getOpacity(); const n = t.viewHints; const r = !(n[Zi] || n[Ui]); const s = this.renderedTiles; for (let e = 0, i = s.length; e < i; ++e) {
        const i = s[e]; const n = i.declutterExecutorGroups[F(this.getLayer())]; if (n) {
          for (let e = n.length - 1; e >= 0; --e) {
            n[e].execute(this.context, 1, this.getTileRenderTransform(i, t), t.viewState.rotation, r, void 0, t.declutterTree);
          }
        }
      }e.globalAlpha = i;
    }getTileRenderTransform(t, e) {
      const i = e.pixelRatio; const n = e.viewState; const r = n.center; const s = n.resolution; const o = n.rotation; const a = e.size; const l = Math.round(a[0] * i); const h = Math.round(a[1] * i); const u = this.getLayer().getSource().getTileGridForProjection(e.viewState.projection); const c = t.tileCoord; const d = u.getTileCoordExtent(t.wrappedTileCoord); const p = u.getTileCoordExtent(c, this.tmpExtent)[0] - d[0]; return Rt(kt(this.inversePixelTransform.slice(), 1 / i, 1 / i), this.getRenderTransform(r, s, o, i, l, h, p));
    }postRender(t, e) {
      const i = e.viewHints; const n = !(i[Zi] || i[Ui]); this.renderedPixelToCoordinateTransform_ = e.pixelToCoordinateTransform.slice(), this.renderedRotation_ = e.viewState.rotation; const r = this.getLayer(); const s = r.getRenderMode(); const o = t.globalAlpha; t.globalAlpha = r.getOpacity(); const a = nu[s]; const l = e.viewState; const h = l.rotation; const u = r.getSource(); const c = u.getTileGridForProjection(l.projection).getZForResolution(l.resolution, u.zDirection); const d = this.renderedTiles; const p = []; const g = []; let f = !0; for (let i = d.length - 1; i >= 0; --i) {
        const s = d[i]; f = f && !s.getReplayState(r).dirty; const o = s.executorGroups[F(r)].filter(((t)=>t.hasExecutors(a))); if (o.length === 0) {
          continue;
        } const l = this.getTileRenderTransform(s, e); const u = s.tileCoord[0]; let m = !1; const y = o[0].getClipCoords(l); if (y) {
          for (let e = 0, i = p.length; e < i; ++e) {
            if (c !== u && u < g[e]) {
              const i = p[e]; _e([y[0], y[3], y[4], y[7]], [i[0], i[3], i[4], i[7]]) && (m || (t.save(), m = !0), t.beginPath(), t.moveTo(y[0], y[1]), t.lineTo(y[2], y[3]), t.lineTo(y[4], y[5]), t.lineTo(y[6], y[7]), t.moveTo(i[6], i[7]), t.lineTo(i[4], i[5]), t.lineTo(i[2], i[3]), t.lineTo(i[0], i[1]), t.clip());
            }
          }p.push(y), g.push(u);
        } for (let e = 0, i = o.length; e < i; ++e) {
          o[e].execute(t, 1, l, h, n, a);
        }m && t.restore();
      }t.globalAlpha = o, this.ready = f, super.postRender(t, e);
    }renderFeature(t, e, i, n, r) {
      if (!i) {
        return !1;
      } let s = !1; if (Array.isArray(i)) {
        for (let o = 0, a = i.length; o < a; ++o) {
          s = jh(n, t, i[o], e, this.boundHandleStyleImageChange_, void 0, r) || s;
        }
      } else {
        s = jh(n, t, i, e, this.boundHandleStyleImageChange_, void 0, r);
      } return s;
    }tileImageNeedsRender_(t) {
      const e = this.getLayer(); if (e.getRenderMode() === 'vector') {
        return !1;
      } const i = t.getReplayState(e); const n = e.getRevision(); const r = t.wantedResolution; return i.renderedTileResolution !== r || i.renderedTileRevision !== n;
    }renderTileImage_(t, e) {
      const i = this.getLayer(); const n = t.getReplayState(i); const r = i.getRevision(); const s = t.executorGroups[F(i)]; n.renderedTileRevision = r; const o = t.wrappedTileCoord; const a = o[0]; const l = i.getSource(); let h = e.pixelRatio; const u = e.viewState.projection; const c = l.getTileGridForProjection(u); const d = c.getResolution(t.tileCoord[0]); const p = e.pixelRatio / t.wantedResolution * d; const g = c.getResolution(a); const f = t.getContext(i); h = Math.round(Math.max(h, p / h)); const m = l.getTilePixelSize(a, h, u); f.canvas.width = m[0], f.canvas.height = m[1]; const y = h / p; if (y !== 1) {
        const t = Et(this.tmpTransform_); kt(t, y, y), f.setTransform.apply(f, t);
      } const _ = c.getTileCoordExtent(o, this.tmpExtent); const v = p / g; const x = Et(this.tmpTransform_); kt(x, v, -v), function (t, e, i) {
        Rt(t, It(Tt, 1, 0, 0, 1, e, i));
      }(x, -_[0], -_[3]); for (let t = 0, e = s.length; t < e; ++t) {
        s[t].execute(f, y, x, 0, !0, iu[i.getRenderMode()]);
      }n.renderedTileResolution = t.wantedResolution;
    }
  }; let su = class extends th {
    constructor(t) {
      t = t || {}; const e = Object.assign({}, t); delete e.preload, delete e.useInterimTilesOnError, super(e), this.on, this.once, this.un; const i = t.renderMode || 'hybrid'; St(i == 'hybrid' || i == 'vector', 28), this.renderMode_ = i, this.setPreload(t.preload ? t.preload : 0), this.setUseInterimTilesOnError(void 0 === t.useInterimTilesOnError || t.useInterimTilesOnError), this.getBackground, this.setBackground;
    }createRenderer() {
      return new ru(this);
    }getFeatures(t) {
      return super.getFeatures(t);
    }getRenderMode() {
      return this.renderMode_;
    }getPreload() {
      return this.get(Xa);
    }getUseInterimTilesOnError() {
      return this.get(qa);
    }setPreload(t) {
      this.set(Xa, t);
    }setUseInterimTilesOnError(t) {
      this.set(qa, t);
    }
  }; let ou = class extends Va {
    constructor(t, e, i, n, r, s) {
      super(t, e, s), this.extent = null, this.format_ = n, this.features_ = null, this.loader_, this.projection = null, this.resolution, this.tileLoadFunction_ = r, this.url_ = i, this.key = i;
    }getFormat() {
      return this.format_;
    }getFeatures() {
      return this.features_;
    }load() {
      this.state == Xi && (this.setState(qi), this.tileLoadFunction_(this, this.url_), this.loader_ && this.loader_(this.extent, this.resolution, this.projection));
    }onLoad(t, e) {
      this.setFeatures(t);
    }onError() {
      this.setState(Vi);
    }setFeatures(t) {
      this.features_ = t, this.setState(Bi);
    }setLoader(t) {
      this.loader_ = t;
    }
  }; const au = []; let lu = class extends Va {
    constructor(t, e, i, n) {
      super(t, e, {transition: 0}), this.context_ = {}, this.executorGroups = {}, this.declutterExecutorGroups = {}, this.loadingSourceTiles = 0, this.hitDetectionImageData = {}, this.replayState_ = {}, this.sourceTiles = [], this.errorTileKeys = {}, this.wantedResolution, this.getSourceTiles = n.bind(void 0, this), this.wrappedTileCoord = i;
    }getContext(t) {
      const e = F(t); return e in this.context_ || (this.context_[e] = K(1, 1, au)), this.context_[e];
    }hasContext(t) {
      return F(t) in this.context_;
    }getImage(t) {
      return this.hasContext(t) ? this.getContext(t).canvas : null;
    }getReplayState(t) {
      const e = F(t); return e in this.replayState_ || (this.replayState_[e] = {dirty: !1, renderedRenderOrder: null, renderedResolution: NaN, renderedRevision: -1, renderedTileResolution: NaN, renderedTileRevision: -1, renderedTileZ: -1}), this.replayState_[e];
    }load() {
      this.getSourceTiles();
    }release() {
      for (const t in this.context_) {
        const e = this.context_[t]; Z(e), au.push(e.canvas), delete this.context_[t];
      } super.release();
    }
  }; let hu = class extends El {
    constructor(t) {
      const e = t.projection || 'EPSG:3857'; const i = t.extent || ol(e); const n = t.tileGrid || rl({extent: i, maxResolution: t.maxResolution, maxZoom: void 0 !== t.maxZoom ? t.maxZoom : 22, minZoom: t.minZoom, tileSize: t.tileSize || 512}); super({attributions: t.attributions, attributionsCollapsible: t.attributionsCollapsible, cacheSize: t.cacheSize, interpolate: !0, opaque: !1, projection: e, state: t.state, tileGrid: n, tileLoadFunction: t.tileLoadFunction ? t.tileLoadFunction : uu, tileUrlFunction: t.tileUrlFunction, url: t.url, urls: t.urls, wrapX: void 0 === t.wrapX || t.wrapX, transition: t.transition, zDirection: void 0 === t.zDirection ? 1 : t.zDirection}), this.format_ = t.format ? t.format : null, this.sourceTileCache = new tl(this.tileCache.highWaterMark), this.overlaps_ = t.overlaps == null || t.overlaps, this.tileClass = t.tileClass ? t.tileClass : ou, this.tileGrids_ = {};
    }getFeaturesInExtent(t) {
      const e = []; const i = this.tileCache; if (i.getCount() === 0) {
        return e;
      } const n = zo(i.peekFirstKey())[0]; const r = this.tileGrid; return i.forEach((function (i) {
        if (i.tileCoord[0] !== n || i.getState() !== Bi) {
          return;
        } const s = i.getSourceTiles(); for (let i = 0, n = s.length; i < n; ++i) {
          const n = s[i]; const o = n.tileCoord; if (_e(t, r.getTileCoordExtent(o))) {
            const i = n.getFeatures(); if (i) {
              for (let n = 0, r = i.length; n < r; ++n) {
                const r = i[n]; const s = r.getGeometry(); _e(t, s.getExtent()) && e.push(r);
              }
            }
          }
        }
      })), e;
    }getOverlaps() {
      return this.overlaps_;
    }clear() {
      this.tileCache.clear(), this.sourceTileCache.clear();
    }expireCache(t, e) {
      const i = this.getTileCacheForProjection(t); const n = Object.keys(e).reduce(((t, e)=>{
        const n = function (t) {
          const [e, i, n] = t.substring(t.lastIndexOf('/') + 1, t.length).split(',').map(Number); return Lo(e, i, n);
        }(e); const r = i.peek(n); if (r) {
          const e = r.sourceTiles; for (let i = 0, n = e.length; i < n; ++i) {
            t[e[i].getKey()] = !0;
          }
        } return t;
      }), {}); super.expireCache(t, e), this.sourceTileCache.expireCache(n);
    }getSourceTiles(t, e, i) {
      if (i.getState() === Xi) {
        i.setState(qi); const n = i.wrappedTileCoord; const r = this.getTileGridForProjection(e); const s = r.getTileCoordExtent(n); const o = n[0]; const a = r.getResolution(o); Xt(s, -a, s); const l = this.tileGrid; const h = l.getExtent(); h && ge(s, h, s); const u = l.getZForResolution(a, this.zDirection); l.forEachTileCoord(s, u, ((n)=>{
          const r = this.tileUrlFunction(n, t, e); const s = this.sourceTileCache.containsKey(r) ? this.sourceTileCache.get(r) : new this.tileClass(n, r ? Xi : Yi, r, this.format_, this.tileLoadFunction); i.sourceTiles.push(s); const o = s.getState(); if (o < Bi) {
            const t = (e)=>{
              this.handleTileChange(e); const n = s.getState(); if (n === Bi || n === Vi) {
                const e = s.getKey(); e in i.errorTileKeys ? s.getState() === Bi && delete i.errorTileKeys[e] : i.loadingSourceTiles--, n === Vi ? i.errorTileKeys[e] = !0 : s.removeEventListener(g, t), i.loadingSourceTiles === 0 && i.setState(d(i.errorTileKeys) ? Bi : Vi);
              }
            }; s.addEventListener(g, t), i.loadingSourceTiles++;
          }o === Xi && (s.extent = l.getTileCoordExtent(n), s.projection = e, s.resolution = l.getResolution(n[0]), this.sourceTileCache.set(r, s), s.load());
        })), i.loadingSourceTiles || i.setState(i.sourceTiles.some(((t)=>t.getState() === Vi)) ? Vi : Bi);
      } return i.sourceTiles;
    }getTile(t, e, i, n, r) {
      const s = Lo(t, e, i); const o = this.getKey(); let a; if (this.tileCache.containsKey(s) && (a = this.tileCache.get(s), a.key === o)) {
        return a;
      } const l = [t, e, i]; let h = this.getTileCoordForTileUrlFunction(l, r); const u = this.getTileGrid().getExtent(); const c = this.getTileGridForProjection(r); if (h && u) {
        const e = c.getTileCoordExtent(h); Xt(e, -c.getResolution(t), e), _e(u, e) || (h = null);
      } let d = !0; if (h !== null) {
        const e = this.tileGrid; const i = c.getResolution(t); const s = e.getZForResolution(i, 1); const o = c.getTileCoordExtent(h); Xt(o, -i, o), e.forEachTileCoord(o, s, ((t)=>{
          d = d && !this.tileUrlFunction(t, n, r);
        }));
      } const p = new lu(l, d ? Yi : Xi, h, this.getSourceTiles.bind(this, n, r)); return p.key = o, a ? (p.interimTile = a, p.refreshInterimChain(), this.tileCache.replace(s, p)) : this.tileCache.set(s, p), p;
    }getTileGridForProjection(t) {
      const e = t.getCode(); let i = this.tileGrids_[e]; if (!i) {
        const t = this.tileGrid; const n = t.getResolutions().slice(); const r = n.map((function (e, i) {
          return t.getOrigin(i);
        })); const s = n.map((function (e, i) {
          return t.getTileSize(i);
        })); const o = 43; for (let t = n.length; t < o; ++t) {
          n.push(n[t - 1] / 2), r.push(r[t - 1]), s.push(s[t - 1]);
        }i = new il({extent: t.getExtent(), origins: r, resolutions: n, tileSizes: s}), this.tileGrids_[e] = i;
      } return i;
    }getTilePixelRatio(t) {
      return t;
    }getTilePixelSize(t, e, i) {
      const n = Ps(this.getTileGridForProjection(i).getTileSize(t), this.tmpSize); return [Math.round(n[0] * e), Math.round(n[1] * e)];
    }updateCacheSize(t, e) {
      super.updateCacheSize(2 * t, e), this.sourceTileCache.highWaterMark = this.getTileCacheForProjection(e).highWaterMark;
    }
  }; function uu(t, e) {
    t.setLoader((function (i, n, r) {
      Qh(e, t.getFormat(), i, n, r, t.onLoad.bind(t), t.onError.bind(t));
    }));
  } let cu; let du = {transparent: [0, 0, 0, 0], aliceblue: [240, 248, 255, 1], antiquewhite: [250, 235, 215, 1], aqua: [0, 255, 255, 1], aquamarine: [127, 255, 212, 1], azure: [240, 255, 255, 1], beige: [245, 245, 220, 1], bisque: [255, 228, 196, 1], black: [0, 0, 0, 1], blanchedalmond: [255, 235, 205, 1], blue: [0, 0, 255, 1], blueviolet: [138, 43, 226, 1], brown: [165, 42, 42, 1], burlywood: [222, 184, 135, 1], cadetblue: [95, 158, 160, 1], chartreuse: [127, 255, 0, 1], chocolate: [210, 105, 30, 1], coral: [255, 127, 80, 1], cornflowerblue: [100, 149, 237, 1], cornsilk: [255, 248, 220, 1], crimson: [220, 20, 60, 1], cyan: [0, 255, 255, 1], darkblue: [0, 0, 139, 1], darkcyan: [0, 139, 139, 1], darkgoldenrod: [184, 134, 11, 1], darkgray: [169, 169, 169, 1], darkgreen: [0, 100, 0, 1], darkgrey: [169, 169, 169, 1], darkkhaki: [189, 183, 107, 1], darkmagenta: [139, 0, 139, 1], darkolivegreen: [85, 107, 47, 1], darkorange: [255, 140, 0, 1], darkorchid: [153, 50, 204, 1], darkred: [139, 0, 0, 1], darksalmon: [233, 150, 122, 1], darkseagreen: [143, 188, 143, 1], darkslateblue: [72, 61, 139, 1], darkslategray: [47, 79, 79, 1], darkslategrey: [47, 79, 79, 1], darkturquoise: [0, 206, 209, 1], darkviolet: [148, 0, 211, 1], deeppink: [255, 20, 147, 1], deepskyblue: [0, 191, 255, 1], dimgray: [105, 105, 105, 1], dimgrey: [105, 105, 105, 1], dodgerblue: [30, 144, 255, 1], firebrick: [178, 34, 34, 1], floralwhite: [255, 250, 240, 1], forestgreen: [34, 139, 34, 1], fuchsia: [255, 0, 255, 1], gainsboro: [220, 220, 220, 1], ghostwhite: [248, 248, 255, 1], gold: [255, 215, 0, 1], goldenrod: [218, 165, 32, 1], gray: [128, 128, 128, 1], green: [0, 128, 0, 1], greenyellow: [173, 255, 47, 1], grey: [128, 128, 128, 1], honeydew: [240, 255, 240, 1], hotpink: [255, 105, 180, 1], indianred: [205, 92, 92, 1], indigo: [75, 0, 130, 1], ivory: [255, 255, 240, 1], khaki: [240, 230, 140, 1], lavender: [230, 230, 250, 1], lavenderblush: [255, 240, 245, 1], lawngreen: [124, 252, 0, 1], lemonchiffon: [255, 250, 205, 1], lightblue: [173, 216, 230, 1], lightcoral: [240, 128, 128, 1], lightcyan: [224, 255, 255, 1], lightgoldenrodyellow: [250, 250, 210, 1], lightgray: [211, 211, 211, 1], lightgreen: [144, 238, 144, 1], lightgrey: [211, 211, 211, 1], lightpink: [255, 182, 193, 1], lightsalmon: [255, 160, 122, 1], lightseagreen: [32, 178, 170, 1], lightskyblue: [135, 206, 250, 1], lightslategray: [119, 136, 153, 1], lightslategrey: [119, 136, 153, 1], lightsteelblue: [176, 196, 222, 1], lightyellow: [255, 255, 224, 1], lime: [0, 255, 0, 1], limegreen: [50, 205, 50, 1], linen: [250, 240, 230, 1], magenta: [255, 0, 255, 1], maroon: [128, 0, 0, 1], mediumaquamarine: [102, 205, 170, 1], mediumblue: [0, 0, 205, 1], mediumorchid: [186, 85, 211, 1], mediumpurple: [147, 112, 219, 1], mediumseagreen: [60, 179, 113, 1], mediumslateblue: [123, 104, 238, 1], mediumspringgreen: [0, 250, 154, 1], mediumturquoise: [72, 209, 204, 1], mediumvioletred: [199, 21, 133, 1], midnightblue: [25, 25, 112, 1], mintcream: [245, 255, 250, 1], mistyrose: [255, 228, 225, 1], moccasin: [255, 228, 181, 1], navajowhite: [255, 222, 173, 1], navy: [0, 0, 128, 1], oldlace: [253, 245, 230, 1], olive: [128, 128, 0, 1], olivedrab: [107, 142, 35, 1], orange: [255, 165, 0, 1], orangered: [255, 69, 0, 1], orchid: [218, 112, 214, 1], palegoldenrod: [238, 232, 170, 1], palegreen: [152, 251, 152, 1], paleturquoise: [175, 238, 238, 1], palevioletred: [219, 112, 147, 1], papayawhip: [255, 239, 213, 1], peachpuff: [255, 218, 185, 1], peru: [205, 133, 63, 1], pink: [255, 192, 203, 1], plum: [221, 160, 221, 1], powderblue: [176, 224, 230, 1], purple: [128, 0, 128, 1], rebeccapurple: [102, 51, 153, 1], red: [255, 0, 0, 1], rosybrown: [188, 143, 143, 1], royalblue: [65, 105, 225, 1], saddlebrown: [139, 69, 19, 1], salmon: [250, 128, 114, 1], sandybrown: [244, 164, 96, 1], seagreen: [46, 139, 87, 1], seashell: [255, 245, 238, 1], sienna: [160, 82, 45, 1], silver: [192, 192, 192, 1], skyblue: [135, 206, 235, 1], slateblue: [106, 90, 205, 1], slategray: [112, 128, 144, 1], slategrey: [112, 128, 144, 1], snow: [255, 250, 250, 1], springgreen: [0, 255, 127, 1], steelblue: [70, 130, 180, 1], tan: [210, 180, 140, 1], teal: [0, 128, 128, 1], thistle: [216, 191, 216, 1], tomato: [255, 99, 71, 1], turquoise: [64, 224, 208, 1], violet: [238, 130, 238, 1], wheat: [245, 222, 179, 1], white: [255, 255, 255, 1], whitesmoke: [245, 245, 245, 1], yellow: [255, 255, 0, 1], yellowgreen: [154, 205, 50, 1]}; function pu(t) {
    return (t = Math.round(t)) < 0 ? 0 : t > 255 ? 255 : t;
  } function gu(t) {
    return t < 0 ? 0 : t > 1 ? 1 : t;
  } function fu(t) {
    return t[t.length - 1] === '%' ? pu(parseFloat(t) / 100 * 255) : pu(parseInt(t));
  } function mu(t) {
    return t[t.length - 1] === '%' ? gu(parseFloat(t) / 100) : gu(parseFloat(t));
  } function yu(t, e, i) {
    return i < 0 ? i += 1 : i > 1 && (i -= 1), 6 * i < 1 ? t + (e - t) * i * 6 : 2 * i < 1 ? e : 3 * i < 2 ? t + (e - t) * (2 / 3 - i) * 6 : t;
  } try {
    cu = {}.parseCSSColor = function (t) {
      let e; let i = t.replace(/ /g, '').toLowerCase(); if (i in du) {
        return du[i].slice();
      } if (i[0] === '#') {
        return i.length === 4 ? (e = parseInt(i.substr(1), 16)) >= 0 && e <= 4095 ? [(3840 & e) >> 4 | (3840 & e) >> 8, 240 & e | (240 & e) >> 4, 15 & e | (15 & e) << 4, 1] : null : i.length === 7 && (e = parseInt(i.substr(1), 16)) >= 0 && e <= 16777215 ? [(16711680 & e) >> 16, (65280 & e) >> 8, 255 & e, 1] : null;
      } let n = i.indexOf('('); let r = i.indexOf(')'); if (n !== -1 && r + 1 === i.length) {
        let s = i.substr(0, n); let o = i.substr(n + 1, r - (n + 1)).split(','); let a = 1; switch (s) {
          case 'rgba':if (o.length !== 4) {
            return null;
          } a = mu(o.pop()); case 'rgb':return o.length !== 3 ? null : [fu(o[0]), fu(o[1]), fu(o[2]), a]; case 'hsla':if (o.length !== 4) {
            return null;
          } a = mu(o.pop()); case 'hsl':if (o.length !== 3) {
            return null;
          } var l = (parseFloat(o[0]) % 360 + 360) % 360 / 360; var h = mu(o[1]); var u = mu(o[2]); var c = u <= 0.5 ? u * (h + 1) : u + h - u * h; var d = 2 * u - c; return [pu(255 * yu(d, c, l + 1 / 3)), pu(255 * yu(d, c, l)), pu(255 * yu(d, c, l - 1 / 3)), a]; default:return null;
        }
      } return null;
    };
  } catch (t) {} let _u = function (t, e, i, n) {
    void 0 === n && (n = 1), this.r = t, this.g = e, this.b = i, this.a = n;
  }; _u.parse = function (t) {
    if (t) {
      if (t instanceof _u) {
        return t;
      } if (typeof t === 'string') {
        let e = cu(t); if (e) {
          return new _u(e[0] / 255 * e[3], e[1] / 255 * e[3], e[2] / 255 * e[3], e[3]);
        }
      }
    }
  }, _u.prototype.toString = function () {
    let t = this.toArray(); let e = t[0]; let i = t[1]; let n = t[2]; let r = t[3]; return 'rgba(' + Math.round(e) + ',' + Math.round(i) + ',' + Math.round(n) + ',' + r + ')';
  }, _u.prototype.toArray = function () {
    let t = this; let e = t.r; let i = t.g; let n = t.b; let r = t.a; return r === 0 ? [0, 0, 0, 0] : [255 * e / r, 255 * i / r, 255 * n / r, r];
  }, _u.prototype.toArray01 = function () {
    let t = this; let e = t.r; let i = t.g; let n = t.b; let r = t.a; return r === 0 ? [0, 0, 0, 0] : [e / r, i / r, n / r, r];
  }, _u.prototype.toArray01PremultipliedAlpha = function () {
    let t = this; return [t.r, t.g, t.b, t.a];
  }, _u.black = new _u(0, 0, 0, 1), _u.white = new _u(1, 1, 1, 1), _u.transparent = new _u(0, 0, 0, 0), _u.red = new _u(1, 0, 0, 1), _u.blue = new _u(0, 0, 1, 1); let vu = _u; function xu(t) {
    return typeof t === 'object' ? ['literal', t] : t;
  } function bu(t, e) {
    let i = t.stops; if (!i) {
      return function (t, e) {
        let i = ['get', t.property]; if (void 0 === t.default) {
          return e.type === 'string' ? ['string', i] : i;
        } if (e.type === 'enum') {
          return ['match', i, Object.keys(e.values), i, t.default];
        } let n = [e.type === 'color' ? 'to-color' : e.type, i, xu(t.default)]; return e.type === 'array' && n.splice(1, 0, e.value, e.length || null), n;
      }(t, e);
    } let n = i && typeof i[0][0] === 'object'; let r = n || void 0 !== t.property; let s = n || !r; return i = i.map((function (t) {
      return !r && e.tokens && typeof t[1] === 'string' ? [t[0], Iu(t[1])] : [t[0], xu(t[1])];
    })), n ? function (t, e, i) {
      for (var n = {}, r = {}, s = [], o = 0; o < i.length; o++) {
        let a = i[o]; let l = a[0].zoom; void 0 === n[l] && (n[l] = {zoom: l, type: t.type, property: t.property, default: t.default}, r[l] = [], s.push(l)), r[l].push([a[0].value, a[1]]);
      } if (Ru({}, e) === 'exponential') {
        for (var h = [wu(t), ['linear'], ['zoom']], u = 0, c = s; u < c.length; u += 1) {
          let d = c[u]; Eu(h, d, Su(n[d], e, r[d]), !1);
        } return h;
      } for (var p = ['step', ['zoom']], g = 0, f = s; g < f.length; g += 1) {
        let m = f[g]; Eu(p, m, Su(n[m], e, r[m]), !0);
      } return Tu(p), p;
    }(t, e, i) : s ? function (t, e, i, n) {
      void 0 === n && (n = ['zoom']); let r; let s = Ru(t, e); let o = !1; if (s === 'interval') {
        r = ['step', n], o = !0;
      } else {
        if (s !== 'exponential') {
          throw new Error('Unknown zoom function type "' + s + '"');
        } let a = void 0 !== t.base ? t.base : 1; r = [wu(t), a === 1 ? ['linear'] : ['exponential', a], n];
      } for (let l = 0, h = i; l < h.length; l += 1) {
        let u = h[l]; Eu(r, u[0], u[1], o);
      } return Tu(r), r;
    }(t, e, i) : Su(t, e, i);
  } function wu(t) {
    switch (t.colorSpace) {
      case 'hcl':return 'interpolate-hcl'; case 'lab':return 'interpolate-lab'; default:return 'interpolate';
    }
  } function Cu(t, e) {
    let i; let n; let r = xu((i = t.default, n = e.default, void 0 !== i ? i : void 0 !== n ? n : void 0)); return void 0 === r && e.type === 'resolvedImage' ? '' : r;
  } function Su(t, e, i) {
    let n = Ru(t, e); let r = ['get', t.property]; if (n === 'categorical' && typeof i[0][0] === 'boolean') {
      for (var s = ['case'], o = 0, a = i; o < a.length; o += 1) {
        let l = a[o]; s.push(['==', r, l[0]], l[1]);
      } return s.push(Cu(t, e)), s;
    } if (n === 'categorical') {
      for (var h = ['match', r], u = 0, c = i; u < c.length; u += 1) {
        let d = c[u]; Eu(h, d[0], d[1], !1);
      } return h.push(Cu(t, e)), h;
    } if (n === 'interval') {
      for (var p = ['step', ['number', r]], g = 0, f = i; g < f.length; g += 1) {
        let m = f[g]; Eu(p, m[0], m[1], !0);
      } return Tu(p), void 0 === t.default ? p : ['case', ['==', ['typeof', r], 'number'], p, xu(t.default)];
    } if (n === 'exponential') {
      for (var y = void 0 !== t.base ? t.base : 1, _ = [wu(t), y === 1 ? ['linear'] : ['exponential', y], ['number', r]], v = 0, x = i; v < x.length; v += 1) {
        let b = x[v]; Eu(_, b[0], b[1], !1);
      } return void 0 === t.default ? _ : ['case', ['==', ['typeof', r], 'number'], _, xu(t.default)];
    } throw new Error('Unknown property function type ' + n);
  } function Tu(t) {
    t[0] === 'step' && t.length === 3 && (t.push(0), t.push(t[3]));
  } function Eu(t, e, i, n) {
    t.length > 3 && e === t[t.length - 2] || (n && t.length === 2 || t.push(e), t.push(i));
  } function Ru(t, e) {
    return t.type ? t.type : e.expression.interpolated ? 'exponential' : 'interval';
  } function Iu(t) {
    for (var e = ['concat'], i = /{([^{}]+)}/g, n = 0, r = i.exec(t); r !== null; r = i.exec(t)) {
      let s = t.slice(n, i.lastIndex - r[0].length); n = i.lastIndex, s.length > 0 && e.push(s), e.push(['get', r[1]]);
    } if (e.length === 1) {
      return t;
    } if (n < t.length) {
      e.push(t.slice(n));
    } else if (e.length === 2) {
      return ['to-string', e[1]];
    } return e;
  } let Mu = function (t) {
    function e(e, i) {
      t.call(this, i), this.message = i, this.key = e;
    } return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e;
  }(Error); let ku = function (t, e) {
    void 0 === e && (e = []), this.parent = t, this.bindings = {}; for (let i = 0, n = e; i < n.length; i += 1) {
      let r = n[i]; let s = r[0]; let o = r[1]; this.bindings[s] = o;
    }
  }; ku.prototype.concat = function (t) {
    return new ku(this, t);
  }, ku.prototype.get = function (t) {
    if (this.bindings[t]) {
      return this.bindings[t];
    } if (this.parent) {
      return this.parent.get(t);
    } throw new Error(t + ' not found in scope.');
  }, ku.prototype.has = function (t) {
    return !!this.bindings[t] || !!this.parent && this.parent.has(t);
  }; let Fu = ku; let Pu = {kind: 'null'}; let Lu = {kind: 'number'}; let Au = {kind: 'string'}; let zu = {kind: 'boolean'}; let Ou = {kind: 'color'}; let Du = {kind: 'object'}; let ju = {kind: 'value'}; let Gu = {kind: 'collator'}; let Nu = {kind: 'formatted'}; let Wu = {kind: 'resolvedImage'}; function Xu(t, e) {
    return {kind: 'array', itemType: t, N: e};
  } function qu(t) {
    if (t.kind === 'array') {
      let e = qu(t.itemType); return typeof t.N === 'number' ? 'array<' + e + ', ' + t.N + '>' : t.itemType.kind === 'value' ? 'array' : 'array<' + e + '>';
    } return t.kind;
  } let Bu = [Pu, Lu, Au, zu, Ou, Nu, Du, Xu(ju), Wu]; function Vu(t, e) {
    if (e.kind === 'error') {
      return null;
    } if (t.kind === 'array') {
      if (e.kind === 'array' && (e.N === 0 && e.itemType.kind === 'value' || !Vu(t.itemType, e.itemType)) && (typeof t.N !== 'number' || t.N === e.N)) {
        return null;
      }
    } else {
      if (t.kind === e.kind) {
        return null;
      } if (t.kind === 'value') {
        for (let i = 0, n = Bu; i < n.length; i += 1) {
          if (!Vu(n[i], e)) {
            return null;
          }
        }
      }
    } return 'Expected ' + qu(t) + ' but found ' + qu(e) + ' instead.';
  } function Yu(t, e) {
    return e.some((function (e) {
      return e.kind === t.kind;
    }));
  } function Ku(t, e) {
    return e.some((function (e) {
      return e === 'null' ? t === null : e === 'array' ? Array.isArray(t) : e === 'object' ? t && !Array.isArray(t) && typeof t === 'object' : e === typeof t;
    }));
  } let Zu = function (t, e, i) {
    this.sensitivity = t ? e ? 'variant' : 'case' : e ? 'accent' : 'base', this.locale = i, this.collator = new Intl.Collator(this.locale ? this.locale : [], {sensitivity: this.sensitivity, usage: 'search'});
  }; Zu.prototype.compare = function (t, e) {
    return this.collator.compare(t, e);
  }, Zu.prototype.resolvedLocale = function () {
    return new Intl.Collator(this.locale ? this.locale : []).resolvedOptions().locale;
  }; let Uu = Zu; let Hu = function (t, e, i, n, r) {
    this.text = t.normalize ? t.normalize() : t, this.image = e, this.scale = i, this.fontStack = n, this.textColor = r;
  }; let Ju = function (t) {
    this.sections = t;
  }; Ju.fromString = function (t) {
    return new Ju([new Hu(t, null, null, null, null)]);
  }, Ju.prototype.isEmpty = function () {
    return this.sections.length === 0 || !this.sections.some((function (t) {
      return t.text.length !== 0 || t.image && t.image.name.length !== 0;
    }));
  }, Ju.factory = function (t) {
    return t instanceof Ju ? t : Ju.fromString(t);
  }, Ju.prototype.toString = function () {
    return this.sections.length === 0 ? '' : this.sections.map((function (t) {
      return t.text;
    })).join('');
  }, Ju.prototype.serialize = function () {
    for (var t = ['format'], e = 0, i = this.sections; e < i.length; e += 1) {
      let n = i[e]; if (n.image) {
        t.push(['image', n.image.name]);
      } else {
        t.push(n.text); let r = {}; n.fontStack && (r['text-font'] = ['literal', n.fontStack.split(',')]), n.scale && (r['font-scale'] = n.scale), n.textColor && (r['text-color'] = ['rgba'].concat(n.textColor.toArray())), t.push(r);
      }
    } return t;
  }; let Qu = Ju; let $u = function (t) {
    this.name = t.name, this.available = t.available;
  }; $u.prototype.toString = function () {
    return this.name;
  }, $u.fromString = function (t) {
    return t ? new $u({name: t, available: !1}) : null;
  }, $u.prototype.serialize = function () {
    return ['image', this.name];
  }; let tc = $u; function ec(t, e, i, n) {
    return typeof t === 'number' && t >= 0 && t <= 255 && typeof e === 'number' && e >= 0 && e <= 255 && typeof i === 'number' && i >= 0 && i <= 255 ? void 0 === n || typeof n === 'number' && n >= 0 && n <= 1 ? null : 'Invalid rgba value [' + [t, e, i, n].join(', ') + ']: \'a\' must be between 0 and 1.' : 'Invalid rgba value [' + (typeof n === 'number' ? [t, e, i, n] : [t, e, i]).join(', ') + ']: \'r\', \'g\', and \'b\' must be between 0 and 255.';
  } function ic(t) {
    if (t === null) {
      return !0;
    } if (typeof t === 'string') {
      return !0;
    } if (typeof t === 'boolean') {
      return !0;
    } if (typeof t === 'number') {
      return !0;
    } if (t instanceof vu) {
      return !0;
    } if (t instanceof Uu) {
      return !0;
    } if (t instanceof Qu) {
      return !0;
    } if (t instanceof tc) {
      return !0;
    } if (Array.isArray(t)) {
      for (let e = 0, i = t; e < i.length; e += 1) {
        if (!ic(i[e])) {
          return !1;
        }
      } return !0;
    } if (typeof t === 'object') {
      for (let n in t) {
        if (!ic(t[n])) {
          return !1;
        }
      } return !0;
    } return !1;
  } function nc(t) {
    if (t === null) {
      return Pu;
    } if (typeof t === 'string') {
      return Au;
    } if (typeof t === 'boolean') {
      return zu;
    } if (typeof t === 'number') {
      return Lu;
    } if (t instanceof vu) {
      return Ou;
    } if (t instanceof Uu) {
      return Gu;
    } if (t instanceof Qu) {
      return Nu;
    } if (t instanceof tc) {
      return Wu;
    } if (Array.isArray(t)) {
      for (var e, i = t.length, n = 0, r = t; n < r.length; n += 1) {
        let s = nc(r[n]); if (e) {
          if (e === s) {
            continue;
          } e = ju; break;
        }e = s;
      } return Xu(e || ju, i);
    } return Du;
  } function rc(t) {
    let e = typeof t; return t === null ? '' : e === 'string' || e === 'number' || e === 'boolean' ? String(t) : t instanceof vu || t instanceof Qu || t instanceof tc ? t.toString() : JSON.stringify(t);
  } let sc = function (t, e) {
    this.type = t, this.value = e;
  }; sc.parse = function (t, e) {
    if (t.length !== 2) {
      return e.error('\'literal\' expression requires exactly one argument, but found ' + (t.length - 1) + ' instead.');
    } if (!ic(t[1])) {
      return e.error('invalid value');
    } let i = t[1]; let n = nc(i); let r = e.expectedType; return n.kind !== 'array' || n.N !== 0 || !r || r.kind !== 'array' || typeof r.N === 'number' && r.N !== 0 || (n = r), new sc(n, i);
  }, sc.prototype.evaluate = function () {
    return this.value;
  }, sc.prototype.eachChild = function () {}, sc.prototype.outputDefined = function () {
    return !0;
  }, sc.prototype.serialize = function () {
    return this.type.kind === 'array' || this.type.kind === 'object' ? ['literal', this.value] : this.value instanceof vu ? ['rgba'].concat(this.value.toArray()) : this.value instanceof Qu ? this.value.serialize() : this.value;
  }; let oc = sc; let ac = function (t) {
    this.name = 'ExpressionEvaluationError', this.message = t;
  }; ac.prototype.toJSON = function () {
    return this.message;
  }; let lc = ac; let hc = {string: Au, number: Lu, boolean: zu, object: Du}; let uc = function (t, e) {
    this.type = t, this.args = e;
  }; uc.parse = function (t, e) {
    if (t.length < 2) {
      return e.error('Expected at least one argument.');
    } let i; let n = 1; let r = t[0]; if (r === 'array') {
      let s; let o; if (t.length > 2) {
        let a = t[1]; if (typeof a !== 'string' || !(a in hc) || a === 'object') {
          return e.error('The item type argument of "array" must be one of string, number, boolean', 1);
        } s = hc[a], n++;
      } else {
        s = ju;
      } if (t.length > 3) {
        if (t[2] !== null && (typeof t[2] !== 'number' || t[2] < 0 || t[2] !== Math.floor(t[2]))) {
          return e.error('The length argument to "array" must be a positive integer literal', 2);
        } o = t[2], n++;
      }i = Xu(s, o);
    } else {
      i = hc[r];
    } for (var l = []; n < t.length; n++) {
      let h = e.parse(t[n], n, ju); if (!h) {
        return null;
      } l.push(h);
    } return new uc(i, l);
  }, uc.prototype.evaluate = function (t) {
    for (let e = 0; e < this.args.length; e++) {
      let i = this.args[e].evaluate(t); if (!Vu(this.type, nc(i))) {
        return i;
      } if (e === this.args.length - 1) {
        throw new lc('Expected value to be of type ' + qu(this.type) + ', but found ' + qu(nc(i)) + ' instead.');
      }
    } return null;
  }, uc.prototype.eachChild = function (t) {
    this.args.forEach(t);
  }, uc.prototype.outputDefined = function () {
    return this.args.every((function (t) {
      return t.outputDefined();
    }));
  }, uc.prototype.serialize = function () {
    let t = this.type; let e = [t.kind]; if (t.kind === 'array') {
      let i = t.itemType; if (i.kind === 'string' || i.kind === 'number' || i.kind === 'boolean') {
        e.push(i.kind); let n = t.N; (typeof n === 'number' || this.args.length > 1) && e.push(n);
      }
    } return e.concat(this.args.map((function (t) {
      return t.serialize();
    })));
  }; let cc = uc; let dc = function (t) {
    this.type = Nu, this.sections = t;
  }; dc.parse = function (t, e) {
    if (t.length < 2) {
      return e.error('Expected at least one argument.');
    } let i = t[1]; if (!Array.isArray(i) && typeof i === 'object') {
      return e.error('First argument must be an image or text section.');
    } for (var n = [], r = !1, s = 1; s <= t.length - 1; ++s) {
      let o = t[s]; if (r && typeof o === 'object' && !Array.isArray(o)) {
        r = !1; let a = null; if (o['font-scale'] && !(a = e.parse(o['font-scale'], 1, Lu))) {
          return null;
        } let l = null; if (o['text-font'] && !(l = e.parse(o['text-font'], 1, Xu(Au)))) {
          return null;
        } let h = null; if (o['text-color'] && !(h = e.parse(o['text-color'], 1, Ou))) {
          return null;
        } let u = n[n.length - 1]; u.scale = a, u.font = l, u.textColor = h;
      } else {
        let c = e.parse(t[s], 1, ju); if (!c) {
          return null;
        } let d = c.type.kind; if (d !== 'string' && d !== 'value' && d !== 'null' && d !== 'resolvedImage') {
          return e.error('Formatted text type must be \'string\', \'value\', \'image\' or \'null\'.');
        } r = !0, n.push({content: c, scale: null, font: null, textColor: null});
      }
    } return new dc(n);
  }, dc.prototype.evaluate = function (t) {
    return new Qu(this.sections.map((function (e) {
      let i = e.content.evaluate(t); return nc(i) === Wu ? new Hu('', i, null, null, null) : new Hu(rc(i), null, e.scale ? e.scale.evaluate(t) : null, e.font ? e.font.evaluate(t).join(',') : null, e.textColor ? e.textColor.evaluate(t) : null);
    })));
  }, dc.prototype.eachChild = function (t) {
    for (let e = 0, i = this.sections; e < i.length; e += 1) {
      let n = i[e]; t(n.content), n.scale && t(n.scale), n.font && t(n.font), n.textColor && t(n.textColor);
    }
  }, dc.prototype.outputDefined = function () {
    return !1;
  }, dc.prototype.serialize = function () {
    for (var t = ['format'], e = 0, i = this.sections; e < i.length; e += 1) {
      let n = i[e]; t.push(n.content.serialize()); let r = {}; n.scale && (r['font-scale'] = n.scale.serialize()), n.font && (r['text-font'] = n.font.serialize()), n.textColor && (r['text-color'] = n.textColor.serialize()), t.push(r);
    } return t;
  }; let pc = dc; let gc = function (t) {
    this.type = Wu, this.input = t;
  }; gc.parse = function (t, e) {
    if (t.length !== 2) {
      return e.error('Expected two arguments.');
    } let i = e.parse(t[1], 1, Au); return i ? new gc(i) : e.error('No image name provided.');
  }, gc.prototype.evaluate = function (t) {
    let e = this.input.evaluate(t); let i = tc.fromString(e); return i && t.availableImages && (i.available = t.availableImages.indexOf(e) > -1), i;
  }, gc.prototype.eachChild = function (t) {
    t(this.input);
  }, gc.prototype.outputDefined = function () {
    return !1;
  }, gc.prototype.serialize = function () {
    return ['image', this.input.serialize()];
  }; let fc = gc; let mc = {'to-boolean': zu, 'to-color': Ou, 'to-number': Lu, 'to-string': Au}; let yc = function (t, e) {
    this.type = t, this.args = e;
  }; yc.parse = function (t, e) {
    if (t.length < 2) {
      return e.error('Expected at least one argument.');
    } let i = t[0]; if ((i === 'to-boolean' || i === 'to-string') && t.length !== 2) {
      return e.error('Expected one argument.');
    } for (var n = mc[i], r = [], s = 1; s < t.length; s++) {
      let o = e.parse(t[s], s, ju); if (!o) {
        return null;
      } r.push(o);
    } return new yc(n, r);
  }, yc.prototype.evaluate = function (t) {
    if (this.type.kind === 'boolean') {
      return Boolean(this.args[0].evaluate(t));
    } if (this.type.kind === 'color') {
      for (var e, i, n = 0, r = this.args; n < r.length; n += 1) {
        if (i = null, (e = r[n].evaluate(t)) instanceof vu) {
          return e;
        } if (typeof e === 'string') {
          let s = t.parseColor(e); if (s) {
            return s;
          }
        } else if (Array.isArray(e) && !(i = e.length < 3 || e.length > 4 ? 'Invalid rbga value ' + JSON.stringify(e) + ': expected an array containing either three or four numeric values.' : ec(e[0], e[1], e[2], e[3]))) {
          return new vu(e[0] / 255, e[1] / 255, e[2] / 255, e[3]);
        }
      } throw new lc(i || 'Could not parse color from value \'' + (typeof e === 'string' ? e : String(JSON.stringify(e))) + '\'');
    } if (this.type.kind === 'number') {
      for (var o = null, a = 0, l = this.args; a < l.length; a += 1) {
        if ((o = l[a].evaluate(t)) === null) {
          return 0;
        } let h = Number(o); if (!isNaN(h)) {
          return h;
        }
      } throw new lc('Could not convert ' + JSON.stringify(o) + ' to number.');
    } return this.type.kind === 'formatted' ? Qu.fromString(rc(this.args[0].evaluate(t))) : this.type.kind === 'resolvedImage' ? tc.fromString(rc(this.args[0].evaluate(t))) : rc(this.args[0].evaluate(t));
  }, yc.prototype.eachChild = function (t) {
    this.args.forEach(t);
  }, yc.prototype.outputDefined = function () {
    return this.args.every((function (t) {
      return t.outputDefined();
    }));
  }, yc.prototype.serialize = function () {
    if (this.type.kind === 'formatted') {
      return new pc([{content: this.args[0], scale: null, font: null, textColor: null}]).serialize();
    } if (this.type.kind === 'resolvedImage') {
      return new fc(this.args[0]).serialize();
    } let t = ['to-' + this.type.kind]; return this.eachChild((function (e) {
      t.push(e.serialize());
    })), t;
  }; let _c = yc; let vc = ['Unknown', 'Point', 'LineString', 'Polygon']; let xc = function () {
    this.globals = null, this.feature = null, this.featureState = null, this.formattedSection = null, this._parseColorCache = {}, this.availableImages = null, this.canonical = null, this.featureTileCoord = null, this.featureDistanceData = null;
  }; xc.prototype.id = function () {
    return this.feature && void 0 !== this.feature.id ? this.feature.id : null;
  }, xc.prototype.geometryType = function () {
    return this.feature ? typeof this.feature.type === 'number' ? vc[this.feature.type] : this.feature.type : null;
  }, xc.prototype.geometry = function () {
    return this.feature && 'geometry' in this.feature ? this.feature.geometry : null;
  }, xc.prototype.canonicalID = function () {
    return this.canonical;
  }, xc.prototype.properties = function () {
    return this.feature && this.feature.properties || {};
  }, xc.prototype.distanceFromCenter = function () {
    if (this.featureTileCoord && this.featureDistanceData) {
      let t = this.featureDistanceData.center; let e = this.featureDistanceData.scale; let i = this.featureTileCoord; let n = i.x; let r = i.y; let s = n * e - t[0]; let o = r * e - t[1]; return this.featureDistanceData.bearing[0] * s + this.featureDistanceData.bearing[1] * o;
    } return 0;
  }, xc.prototype.parseColor = function (t) {
    let e = this._parseColorCache[t]; return e || (e = this._parseColorCache[t] = vu.parse(t)), e;
  }; let bc = xc; let wc = function (t, e, i, n) {
    this.name = t, this.type = e, this._evaluate = i, this.args = n;
  }; wc.prototype.evaluate = function (t) {
    return this._evaluate(t, this.args);
  }, wc.prototype.eachChild = function (t) {
    this.args.forEach(t);
  }, wc.prototype.outputDefined = function () {
    return !1;
  }, wc.prototype.serialize = function () {
    return [this.name].concat(this.args.map((function (t) {
      return t.serialize();
    })));
  }, wc.parse = function (t, e) {
    let i; let n = t[0]; let r = wc.definitions[n]; if (!r) {
      return e.error('Unknown expression "' + n + '". If you wanted a literal array, use ["literal", [...]].', 0);
    } for (var s = Array.isArray(r) ? r[0] : r.type, o = Array.isArray(r) ? [[r[1], r[2]]] : r.overloads, a = o.filter((function (e) {
        let i = e[0]; return !Array.isArray(i) || i.length === t.length - 1;
      })), l = null, h = 0, u = a; h < u.length; h += 1) {
      let c = u[h]; let d = c[0]; let p = c[1]; l = new Jc(e.registry, e.path, null, e.scope); for (var g = [], f = !1, m = 1; m < t.length; m++) {
        let y = t[m]; let _ = Array.isArray(d) ? d[m - 1] : d.type; let v = l.parse(y, 1 + g.length, _); if (!v) {
          f = !0; break;
        }g.push(v);
      } if (!f) {
        if (Array.isArray(d) && d.length !== g.length) {
          l.error('Expected ' + d.length + ' arguments, but found ' + g.length + ' instead.');
        } else {
          for (let x = 0; x < g.length; x++) {
            let b = Array.isArray(d) ? d[x] : d.type; let w = g[x]; l.concat(x + 1).checkSubtype(b, w.type);
          } if (l.errors.length === 0) {
            return new wc(n, s, p, g);
          }
        }
      }
    } if (a.length === 1) {
      (i = e.errors).push.apply(i, l.errors);
    } else {
      for (var C = (a.length ? a : o).map((function (t) {
          let e; let i = t[0]; return e = i, Array.isArray(e) ? '(' + e.map(qu).join(', ') + ')' : '(' + qu(e.type) + '...)';
        })).join(' | '), S = [], T = 1; T < t.length; T++) {
        let E = e.parse(t[T], 1 + S.length); if (!E) {
          return null;
        } S.push(qu(E.type));
      }e.error('Expected arguments of type ' + C + ', but found (' + S.join(', ') + ') instead.');
    } return null;
  }, wc.register = function (t, e) {
    for (let i in wc.definitions = e, e) {
      t[i] = wc;
    }
  }; let Cc = wc; let Sc = function (t, e, i) {
    this.type = Gu, this.locale = i, this.caseSensitive = t, this.diacriticSensitive = e;
  }; Sc.parse = function (t, e) {
    if (t.length !== 2) {
      return e.error('Expected one argument.');
    } let i = t[1]; if (typeof i !== 'object' || Array.isArray(i)) {
      return e.error('Collator options argument must be an object.');
    } let n = e.parse(void 0 !== i['case-sensitive'] && i['case-sensitive'], 1, zu); if (!n) {
      return null;
    } let r = e.parse(void 0 !== i['diacritic-sensitive'] && i['diacritic-sensitive'], 1, zu); if (!r) {
      return null;
    } let s = null; return i.locale && !(s = e.parse(i.locale, 1, Au)) ? null : new Sc(n, r, s);
  }, Sc.prototype.evaluate = function (t) {
    return new Uu(this.caseSensitive.evaluate(t), this.diacriticSensitive.evaluate(t), this.locale ? this.locale.evaluate(t) : null);
  }, Sc.prototype.eachChild = function (t) {
    t(this.caseSensitive), t(this.diacriticSensitive), this.locale && t(this.locale);
  }, Sc.prototype.outputDefined = function () {
    return !1;
  }, Sc.prototype.serialize = function () {
    let t = {}; return t['case-sensitive'] = this.caseSensitive.serialize(), t['diacritic-sensitive'] = this.diacriticSensitive.serialize(), this.locale && (t.locale = this.locale.serialize()), ['collator', t];
  }; let Tc = Sc; let Ec = 8192; function Rc(t, e) {
    t[0] = Math.min(t[0], e[0]), t[1] = Math.min(t[1], e[1]), t[2] = Math.max(t[2], e[0]), t[3] = Math.max(t[3], e[1]);
  } function Ic(t, e) {
    return !(t[0] <= e[0]) && (!(t[2] >= e[2]) && (!(t[1] <= e[1]) && !(t[3] >= e[3])));
  } function Mc(t, e) {
    let i; let n = (180 + t[0]) / 360; let r = (i = t[1], (180 - 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + i * Math.PI / 360))) / 360); let s = Math.pow(2, e.z); return [Math.round(n * s * Ec), Math.round(r * s * Ec)];
  } function kc(t, e, i) {
    let n = t[0] - e[0]; let r = t[1] - e[1]; let s = t[0] - i[0]; let o = t[1] - i[1]; return n * o - s * r == 0 && n * s <= 0 && r * o <= 0;
  } function Fc(t, e, i) {
    return e[1] > t[1] != i[1] > t[1] && t[0] < (i[0] - e[0]) * (t[1] - e[1]) / (i[1] - e[1]) + e[0];
  } function Pc(t, e) {
    for (var i = !1, n = 0, r = e.length; n < r; n++) {
      for (let s = e[n], o = 0, a = s.length; o < a - 1; o++) {
        if (kc(t, s[o], s[o + 1])) {
          return !1;
        } Fc(t, s[o], s[o + 1]) && (i = !i);
      }
    } return i;
  } function Lc(t, e) {
    for (let i = 0; i < e.length; i++) {
      if (Pc(t, e[i])) {
        return !0;
      }
    } return !1;
  } function Ac(t, e, i, n) {
    let r = t[0] - i[0]; let s = t[1] - i[1]; let o = e[0] - i[0]; let a = e[1] - i[1]; let l = n[0] - i[0]; let h = n[1] - i[1]; let u = r * h - l * s; let c = o * h - l * a; return u > 0 && c < 0 || u < 0 && c > 0;
  } function zc(t, e, i) {
    for (let n = 0, r = i; n < r.length; n += 1) {
      for (let s = r[n], o = 0; o < s.length - 1; ++o) {
        if (a = t, l = e, h = s[o], u = s[o + 1], c = void 0, d = void 0, p = void 0, g = void 0, p = [l[0] - a[0], l[1] - a[1]], g = [u[0] - h[0], u[1] - h[1]], (c = g)[0] * (d = p)[1] - c[1] * d[0] != 0 && Ac(a, l, h, u) && Ac(h, u, a, l)) {
          return !0;
        }
      }
    } let a; let l; let h; let u; let c; let d; let p; let g; return !1;
  } function Oc(t, e) {
    for (let i = 0; i < t.length; ++i) {
      if (!Pc(t[i], e)) {
        return !1;
      }
    } for (let n = 0; n < t.length - 1; ++n) {
      if (zc(t[n], t[n + 1], e)) {
        return !1;
      }
    } return !0;
  } function Dc(t, e) {
    for (let i = 0; i < e.length; i++) {
      if (Oc(t, e[i])) {
        return !0;
      }
    } return !1;
  } function jc(t, e, i) {
    for (var n = [], r = 0; r < t.length; r++) {
      for (var s = [], o = 0; o < t[r].length; o++) {
        let a = Mc(t[r][o], i); Rc(e, a), s.push(a);
      }n.push(s);
    } return n;
  } function Gc(t, e, i) {
    for (var n = [], r = 0; r < t.length; r++) {
      let s = jc(t[r], e, i); n.push(s);
    } return n;
  } function Nc(t, e, i, n) {
    if (t[0] < i[0] || t[0] > i[2]) {
      let r = 0.5 * n; let s = t[0] - i[0] > r ? -n : i[0] - t[0] > r ? n : 0; s === 0 && (s = t[0] - i[2] > r ? -n : i[2] - t[0] > r ? n : 0), t[0] += s;
    }Rc(e, t);
  } function Wc(t, e, i, n) {
    let r = Math.pow(2, n.z) * Ec; let s = [n.x * Ec, n.y * Ec]; let o = []; if (!t) {
      return o;
    } for (let a = 0, l = t; a < l.length; a += 1) {
      for (let h = 0, u = l[a]; h < u.length; h += 1) {
        let c = u[h]; let d = [c.x + s[0], c.y + s[1]]; Nc(d, e, i, r), o.push(d);
      }
    } return o;
  } function Xc(t, e, i, n) {
    let r = Math.pow(2, n.z) * Ec; let s = [n.x * Ec, n.y * Ec]; let o = []; if (!t) {
      return o;
    } for (let a = 0, l = t; a < l.length; a += 1) {
      for (var h = [], u = 0, c = l[a]; u < c.length; u += 1) {
        let d = c[u]; let p = [d.x + s[0], d.y + s[1]]; Rc(e, p), h.push(p);
      }o.push(h);
    } if (e[2] - e[0] <= r / 2) {
      !function (t) {
        t[0] = t[1] = 1 / 0, t[2] = t[3] = -1 / 0;
      }(e); for (let g = 0, f = o; g < f.length; g += 1) {
        for (let m = 0, y = f[g]; m < y.length; m += 1) {
          Nc(y[m], e, i, r);
        }
      }
    } return o;
  } let qc = function (t, e) {
    this.type = zu, this.geojson = t, this.geometries = e;
  }; qc.parse = function (t, e) {
    if (t.length !== 2) {
      return e.error('\'within\' expression requires exactly one argument, but found ' + (t.length - 1) + ' instead.');
    } if (ic(t[1])) {
      let i = t[1]; if (i.type === 'FeatureCollection') {
        for (let n = 0; n < i.features.length; ++n) {
          let r = i.features[n].geometry.type; if (r === 'Polygon' || r === 'MultiPolygon') {
            return new qc(i, i.features[n].geometry);
          }
        }
      } else if (i.type === 'Feature') {
        let s = i.geometry.type; if (s === 'Polygon' || s === 'MultiPolygon') {
          return new qc(i, i.geometry);
        }
      } else if (i.type === 'Polygon' || i.type === 'MultiPolygon') {
        return new qc(i, i);
      }
    } return e.error('\'within\' expression requires valid geojson object that contains polygon geometry type.');
  }, qc.prototype.evaluate = function (t) {
    if (t.geometry() != null && t.canonicalID() != null) {
      if (t.geometryType() === 'Point') {
        return function (t, e) {
          let i = [1 / 0, 1 / 0, -1 / 0, -1 / 0]; let n = [1 / 0, 1 / 0, -1 / 0, -1 / 0]; let r = t.canonicalID(); if (!r) {
            return !1;
          } if (e.type === 'Polygon') {
            let s = jc(e.coordinates, n, r); let o = Wc(t.geometry(), i, n, r); if (!Ic(i, n)) {
              return !1;
            } for (let a = 0, l = o; a < l.length; a += 1) {
              if (!Pc(l[a], s)) {
                return !1;
              }
            }
          } if (e.type === 'MultiPolygon') {
            let h = Gc(e.coordinates, n, r); let u = Wc(t.geometry(), i, n, r); if (!Ic(i, n)) {
              return !1;
            } for (let c = 0, d = u; c < d.length; c += 1) {
              if (!Lc(d[c], h)) {
                return !1;
              }
            }
          } return !0;
        }(t, this.geometries);
      } if (t.geometryType() === 'LineString') {
        return function (t, e) {
          let i = [1 / 0, 1 / 0, -1 / 0, -1 / 0]; let n = [1 / 0, 1 / 0, -1 / 0, -1 / 0]; let r = t.canonicalID(); if (!r) {
            return !1;
          } if (e.type === 'Polygon') {
            let s = jc(e.coordinates, n, r); let o = Xc(t.geometry(), i, n, r); if (!Ic(i, n)) {
              return !1;
            } for (let a = 0, l = o; a < l.length; a += 1) {
              if (!Oc(l[a], s)) {
                return !1;
              }
            }
          } if (e.type === 'MultiPolygon') {
            let h = Gc(e.coordinates, n, r); let u = Xc(t.geometry(), i, n, r); if (!Ic(i, n)) {
              return !1;
            } for (let c = 0, d = u; c < d.length; c += 1) {
              if (!Dc(d[c], h)) {
                return !1;
              }
            }
          } return !0;
        }(t, this.geometries);
      }
    } return !1;
  }, qc.prototype.eachChild = function () {}, qc.prototype.outputDefined = function () {
    return !0;
  }, qc.prototype.serialize = function () {
    return ['within', this.geojson];
  }; let Bc = qc; function Vc(t) {
    if (t instanceof Cc) {
      if (t.name === 'get' && t.args.length === 1) {
        return !1;
      } if (t.name === 'feature-state') {
        return !1;
      } if (t.name === 'has' && t.args.length === 1) {
        return !1;
      } if (t.name === 'properties' || t.name === 'geometry-type' || t.name === 'id') {
        return !1;
      } if (/^filter-/.test(t.name)) {
        return !1;
      }
    } if (t instanceof Bc) {
      return !1;
    } let e = !0; return t.eachChild((function (t) {
      e && !Vc(t) && (e = !1);
    })), e;
  } function Yc(t) {
    if (t instanceof Cc && t.name === 'feature-state') {
      return !1;
    } let e = !0; return t.eachChild((function (t) {
      e && !Yc(t) && (e = !1);
    })), e;
  } function Kc(t, e) {
    if (t instanceof Cc && e.indexOf(t.name) >= 0) {
      return !1;
    } let i = !0; return t.eachChild((function (t) {
      i && !Kc(t, e) && (i = !1);
    })), i;
  } let Zc = function (t, e) {
    this.type = e.type, this.name = t, this.boundExpression = e;
  }; Zc.parse = function (t, e) {
    if (t.length !== 2 || typeof t[1] !== 'string') {
      return e.error('\'var\' expression requires exactly one string literal argument.');
    } let i = t[1]; return e.scope.has(i) ? new Zc(i, e.scope.get(i)) : e.error('Unknown variable "' + i + '". Make sure "' + i + '" has been bound in an enclosing "let" expression before using it.', 1);
  }, Zc.prototype.evaluate = function (t) {
    return this.boundExpression.evaluate(t);
  }, Zc.prototype.eachChild = function () {}, Zc.prototype.outputDefined = function () {
    return !1;
  }, Zc.prototype.serialize = function () {
    return ['var', this.name];
  }; let Uc = Zc; let Hc = function (t, e, i, n, r) {
    void 0 === e && (e = []), void 0 === n && (n = new Fu()), void 0 === r && (r = []), this.registry = t, this.path = e, this.key = e.map((function (t) {
      return '[' + t + ']';
    })).join(''), this.scope = n, this.errors = r, this.expectedType = i;
  }; Hc.prototype.parse = function (t, e, i, n, r) {
    return void 0 === r && (r = {}), e ? this.concat(e, i, n)._parse(t, r) : this._parse(t, r);
  }, Hc.prototype._parse = function (t, e) {
    function i(t, e, i) {
      return i === 'assert' ? new cc(e, [t]) : i === 'coerce' ? new _c(e, [t]) : t;
    } if (t !== null && typeof t !== 'string' && typeof t !== 'boolean' && typeof t !== 'number' || (t = ['literal', t]), Array.isArray(t)) {
      if (t.length === 0) {
        return this.error('Expected an array with at least one element. If you wanted a literal array, use ["literal", []].');
      } let n = t[0]; if (typeof n !== 'string') {
        return this.error('Expression name must be a string, but found ' + typeof n + ' instead. If you wanted a literal array, use ["literal", [...]].', 0), null;
      } let r = this.registry[n]; if (r) {
        let s = r.parse(t, this); if (!s) {
          return null;
        } if (this.expectedType) {
          let o = this.expectedType; let a = s.type; if (o.kind !== 'string' && o.kind !== 'number' && o.kind !== 'boolean' && o.kind !== 'object' && o.kind !== 'array' || a.kind !== 'value') {
            if (o.kind !== 'color' && o.kind !== 'formatted' && o.kind !== 'resolvedImage' || a.kind !== 'value' && a.kind !== 'string') {
              if (this.checkSubtype(o, a)) {
                return null;
              }
            } else {
              s = i(s, o, e.typeAnnotation || 'coerce');
            }
          } else {
            s = i(s, o, e.typeAnnotation || 'assert');
          }
        } if (!(s instanceof oc) && s.type.kind !== 'resolvedImage' && Qc(s)) {
          let l = new bc(); try {
            s = new oc(s.type, s.evaluate(l));
          } catch (t) {
            return this.error(t.message), null;
          }
        } return s;
      } return this.error('Unknown expression "' + n + '". If you wanted a literal array, use ["literal", [...]].', 0);
    } return void 0 === t ? this.error('\'undefined\' value invalid. Use null instead.') : typeof t === 'object' ? this.error('Bare objects invalid. Use ["literal", {...}] instead.') : this.error('Expected an array, but found ' + typeof t + ' instead.');
  }, Hc.prototype.concat = function (t, e, i) {
    let n = typeof t === 'number' ? this.path.concat(t) : this.path; let r = i ? this.scope.concat(i) : this.scope; return new Hc(this.registry, n, e || null, r, this.errors);
  }, Hc.prototype.error = function (t) {
    for (var e = [], i = arguments.length - 1; i-- > 0;) {
      e[i] = arguments[i + 1];
    } let n = '' + this.key + e.map((function (t) {
      return '[' + t + ']';
    })).join(''); this.errors.push(new Mu(n, t));
  }, Hc.prototype.checkSubtype = function (t, e) {
    let i = Vu(t, e); return i && this.error(i), i;
  }; var Jc = Hc; function Qc(t) {
    if (t instanceof Uc) {
      return Qc(t.boundExpression);
    } if (t instanceof Cc && t.name === 'error') {
      return !1;
    } if (t instanceof Tc) {
      return !1;
    } if (t instanceof Bc) {
      return !1;
    } let e = t instanceof _c || t instanceof cc; let i = !0; return t.eachChild((function (t) {
      i = e ? i && Qc(t) : i && t instanceof oc;
    })), !!i && (Vc(t) && Kc(t, ['zoom', 'heatmap-density', 'line-progress', 'sky-radial-progress', 'accumulated', 'is-supported-script', 'pitch', 'distance-from-center']));
  } function $c(t, e) {
    for (var i, n, r = t.length - 1, s = 0, o = r, a = 0; s <= o;) {
      if (i = t[a = Math.floor((s + o) / 2)], n = t[a + 1], i <= e) {
        if (a === r || e < n) {
          return a;
        } s = a + 1;
      } else {
        if (!(i > e)) {
          throw new lc('Input is not a number.');
        } o = a - 1;
      }
    } return 0;
  } let td = function (t, e, i) {
    this.type = t, this.input = e, this.labels = [], this.outputs = []; for (let n = 0, r = i; n < r.length; n += 1) {
      let s = r[n]; let o = s[0]; let a = s[1]; this.labels.push(o), this.outputs.push(a);
    }
  }; td.parse = function (t, e) {
    if (t.length - 1 < 4) {
      return e.error('Expected at least 4 arguments, but found only ' + (t.length - 1) + '.');
    } if ((t.length - 1) % 2 != 0) {
      return e.error('Expected an even number of arguments.');
    } let i = e.parse(t[1], 1, Lu); if (!i) {
      return null;
    } let n = []; let r = null; e.expectedType && e.expectedType.kind !== 'value' && (r = e.expectedType); for (let s = 1; s < t.length; s += 2) {
      let o = s === 1 ? -1 / 0 : t[s]; let a = t[s + 1]; let l = s; let h = s + 1; if (typeof o !== 'number') {
        return e.error('Input/output pairs for "step" expressions must be defined using literal numeric values (not computed expressions) for the input values.', l);
      } if (n.length && n[n.length - 1][0] >= o) {
        return e.error('Input/output pairs for "step" expressions must be arranged with input values in strictly ascending order.', l);
      } let u = e.parse(a, h, r); if (!u) {
        return null;
      } r = r || u.type, n.push([o, u]);
    } return new td(r, i, n);
  }, td.prototype.evaluate = function (t) {
    let e = this.labels; let i = this.outputs; if (e.length === 1) {
      return i[0].evaluate(t);
    } let n = this.input.evaluate(t); if (n <= e[0]) {
      return i[0].evaluate(t);
    } let r = e.length; return n >= e[r - 1] ? i[r - 1].evaluate(t) : i[$c(e, n)].evaluate(t);
  }, td.prototype.eachChild = function (t) {
    t(this.input); for (let e = 0, i = this.outputs; e < i.length; e += 1) {
      t(i[e]);
    }
  }, td.prototype.outputDefined = function () {
    return this.outputs.every((function (t) {
      return t.outputDefined();
    }));
  }, td.prototype.serialize = function () {
    for (var t = ['step', this.input.serialize()], e = 0; e < this.labels.length; e++) {
      e > 0 && t.push(this.labels[e]), t.push(this.outputs[e].serialize());
    } return t;
  }; let ed = td; let id = nd; function nd(t, e, i, n) {
    this.cx = 3 * t, this.bx = 3 * (i - t) - this.cx, this.ax = 1 - this.cx - this.bx, this.cy = 3 * e, this.by = 3 * (n - e) - this.cy, this.ay = 1 - this.cy - this.by, this.p1x = t, this.p1y = n, this.p2x = i, this.p2y = n;
  } function rd(t, e, i) {
    return t * (1 - i) + e * i;
  }nd.prototype.sampleCurveX = function (t) {
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  }, nd.prototype.sampleCurveY = function (t) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  }, nd.prototype.sampleCurveDerivativeX = function (t) {
    return (3 * this.ax * t + 2 * this.bx) * t + this.cx;
  }, nd.prototype.solveCurveX = function (t, e) {
    let i; let n; let r; let s; let o; for (void 0 === e && (e = 1e-6), r = t, o = 0; o < 8; o++) {
      if (s = this.sampleCurveX(r) - t, Math.abs(s) < e) {
        return r;
      } let a = this.sampleCurveDerivativeX(r); if (Math.abs(a) < 1e-6) {
        break;
      } r -= s / a;
    } if ((r = t) < (i = 0)) {
      return i;
    } if (r > (n = 1)) {
      return n;
    } for (;i < n;) {
      if (s = this.sampleCurveX(r), Math.abs(s - t) < e) {
        return r;
      } t > s ? i = r : n = r, r = 0.5 * (n - i) + i;
    } return r;
  }, nd.prototype.solve = function (t, e) {
    return this.sampleCurveY(this.solveCurveX(t, e));
  }; let sd = Object.freeze({__proto__: null, number: rd, color(t, e, i) {
    return new vu(rd(t.r, e.r, i), rd(t.g, e.g, i), rd(t.b, e.b, i), rd(t.a, e.a, i));
  }, array(t, e, i) {
    return t.map((function (t, n) {
      return rd(t, e[n], i);
    }));
  }}); let od = 0.95047; let ad = 1.08883; let ld = 4 / 29; let hd = 6 / 29; let ud = 3 * hd * hd; let cd = Math.PI / 180; let dd = 180 / Math.PI; function pd(t) {
    return t > 0.008856451679035631 ? Math.pow(t, 1 / 3) : t / ud + ld;
  } function gd(t) {
    return t > hd ? t * t * t : ud * (t - ld);
  } function fd(t) {
    return 255 * (t <= 0.0031308 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055);
  } function md(t) {
    return (t /= 255) <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
  } function yd(t) {
    let e = md(t.r); let i = md(t.g); let n = md(t.b); let r = pd((0.4124564 * e + 0.3575761 * i + 0.1804375 * n) / od); let s = pd((0.2126729 * e + 0.7151522 * i + 0.072175 * n) / 1); return {l: 116 * s - 16, a: 500 * (r - s), b: 200 * (s - pd((0.0193339 * e + 0.119192 * i + 0.9503041 * n) / ad)), alpha: t.a};
  } function _d(t) {
    let e = (t.l + 16) / 116; let i = isNaN(t.a) ? e : e + t.a / 500; let n = isNaN(t.b) ? e : e - t.b / 200; return e = 1 * gd(e), i = od * gd(i), n = ad * gd(n), new vu(fd(3.2404542 * i - 1.5371385 * e - 0.4985314 * n), fd(-0.969266 * i + 1.8760108 * e + 0.041556 * n), fd(0.0556434 * i - 0.2040259 * e + 1.0572252 * n), t.alpha);
  } function vd(t, e, i) {
    let n = e - t; return t + i * (n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n);
  } let xd = {forward: yd, reverse: _d, interpolate(t, e, i) {
    return {l: rd(t.l, e.l, i), a: rd(t.a, e.a, i), b: rd(t.b, e.b, i), alpha: rd(t.alpha, e.alpha, i)};
  }}; let bd = {forward(t) {
    let e = yd(t); let i = e.l; let n = e.a; let r = e.b; let s = Math.atan2(r, n) * dd; return {h: s < 0 ? s + 360 : s, c: Math.sqrt(n * n + r * r), l: i, alpha: t.a};
  }, reverse(t) {
    let e = t.h * cd; let i = t.c; return _d({l: t.l, a: Math.cos(e) * i, b: Math.sin(e) * i, alpha: t.alpha});
  }, interpolate(t, e, i) {
    return {h: vd(t.h, e.h, i), c: rd(t.c, e.c, i), l: rd(t.l, e.l, i), alpha: rd(t.alpha, e.alpha, i)};
  }}; let wd = function (t, e, i, n, r) {
    this.type = t, this.operator = e, this.interpolation = i, this.input = n, this.labels = [], this.outputs = []; for (let s = 0, o = r; s < o.length; s += 1) {
      let a = o[s]; let l = a[0]; let h = a[1]; this.labels.push(l), this.outputs.push(h);
    }
  }; function Cd(t, e, i, n) {
    let r = n - i; let s = t - i; return r === 0 ? 0 : e === 1 ? s / r : (Math.pow(e, s) - 1) / (Math.pow(e, r) - 1);
  }wd.interpolationFactor = function (t, e, i, n) {
    let r = 0; if (t.name === 'exponential') {
      r = Cd(e, t.base, i, n);
    } else if (t.name === 'linear') {
      r = Cd(e, 1, i, n);
    } else if (t.name === 'cubic-bezier') {
      let s = t.controlPoints; r = new id(s[0], s[1], s[2], s[3]).solve(Cd(e, 1, i, n));
    } return r;
  }, wd.parse = function (t, e) {
    let i = t[0]; let n = t[1]; let r = t[2]; let s = t.slice(3); if (!Array.isArray(n) || n.length === 0) {
      return e.error('Expected an interpolation type expression.', 1);
    } if (n[0] === 'linear') {
      n = {name: 'linear'};
    } else if (n[0] === 'exponential') {
      let o = n[1]; if (typeof o !== 'number') {
        return e.error('Exponential interpolation requires a numeric base.', 1, 1);
      } n = {name: 'exponential', base: o};
    } else {
      if (n[0] !== 'cubic-bezier') {
        return e.error('Unknown interpolation type ' + String(n[0]), 1, 0);
      } let a = n.slice(1); if (a.length !== 4 || a.some((function (t) {
        return typeof t !== 'number' || t < 0 || t > 1;
      }))) {
        return e.error('Cubic bezier interpolation requires four numeric arguments with values between 0 and 1.', 1);
      } n = {name: 'cubic-bezier', controlPoints: a};
    } if (t.length - 1 < 4) {
      return e.error('Expected at least 4 arguments, but found only ' + (t.length - 1) + '.');
    } if ((t.length - 1) % 2 != 0) {
      return e.error('Expected an even number of arguments.');
    } if (!(r = e.parse(r, 2, Lu))) {
      return null;
    } let l = []; let h = null; i === 'interpolate-hcl' || i === 'interpolate-lab' ? h = Ou : e.expectedType && e.expectedType.kind !== 'value' && (h = e.expectedType); for (let u = 0; u < s.length; u += 2) {
      let c = s[u]; let d = s[u + 1]; let p = u + 3; let g = u + 4; if (typeof c !== 'number') {
        return e.error('Input/output pairs for "interpolate" expressions must be defined using literal numeric values (not computed expressions) for the input values.', p);
      } if (l.length && l[l.length - 1][0] >= c) {
        return e.error('Input/output pairs for "interpolate" expressions must be arranged with input values in strictly ascending order.', p);
      } let f = e.parse(d, g, h); if (!f) {
        return null;
      } h = h || f.type, l.push([c, f]);
    } return h.kind === 'number' || h.kind === 'color' || h.kind === 'array' && h.itemType.kind === 'number' && typeof h.N === 'number' ? new wd(h, i, n, r, l) : e.error('Type ' + qu(h) + ' is not interpolatable.');
  }, wd.prototype.evaluate = function (t) {
    let e = this.labels; let i = this.outputs; if (e.length === 1) {
      return i[0].evaluate(t);
    } let n = this.input.evaluate(t); if (n <= e[0]) {
      return i[0].evaluate(t);
    } let r = e.length; if (n >= e[r - 1]) {
      return i[r - 1].evaluate(t);
    } let s = $c(e, n); let o = e[s]; let a = e[s + 1]; let l = wd.interpolationFactor(this.interpolation, n, o, a); let h = i[s].evaluate(t); let u = i[s + 1].evaluate(t); return this.operator === 'interpolate' ? sd[this.type.kind.toLowerCase()](h, u, l) : this.operator === 'interpolate-hcl' ? bd.reverse(bd.interpolate(bd.forward(h), bd.forward(u), l)) : xd.reverse(xd.interpolate(xd.forward(h), xd.forward(u), l));
  }, wd.prototype.eachChild = function (t) {
    t(this.input); for (let e = 0, i = this.outputs; e < i.length; e += 1) {
      t(i[e]);
    }
  }, wd.prototype.outputDefined = function () {
    return this.outputs.every((function (t) {
      return t.outputDefined();
    }));
  }, wd.prototype.serialize = function () {
    let t; t = this.interpolation.name === 'linear' ? ['linear'] : this.interpolation.name === 'exponential' ? this.interpolation.base === 1 ? ['linear'] : ['exponential', this.interpolation.base] : ['cubic-bezier'].concat(this.interpolation.controlPoints); for (var e = [this.operator, t, this.input.serialize()], i = 0; i < this.labels.length; i++) {
      e.push(this.labels[i], this.outputs[i].serialize());
    } return e;
  }; let Sd = wd; let Td = function (t, e) {
    this.type = t, this.args = e;
  }; Td.parse = function (t, e) {
    if (t.length < 2) {
      return e.error('Expectected at least one argument.');
    } let i = null; let n = e.expectedType; n && n.kind !== 'value' && (i = n); for (var r = [], s = 0, o = t.slice(1); s < o.length; s += 1) {
      let a = o[s]; let l = e.parse(a, 1 + r.length, i, void 0, {typeAnnotation: 'omit'}); if (!l) {
        return null;
      } i = i || l.type, r.push(l);
    } let h = n && r.some((function (t) {
      return Vu(n, t.type);
    })); return new Td(h ? ju : i, r);
  }, Td.prototype.evaluate = function (t) {
    for (var e, i = null, n = 0, r = 0, s = this.args; r < s.length; r += 1) {
      if (n++, (i = s[r].evaluate(t)) && i instanceof tc && !i.available && (e || (e = i), i = null, n === this.args.length)) {
        return e;
      } if (i !== null) {
        break;
      }
    } return i;
  }, Td.prototype.eachChild = function (t) {
    this.args.forEach(t);
  }, Td.prototype.outputDefined = function () {
    return this.args.every((function (t) {
      return t.outputDefined();
    }));
  }, Td.prototype.serialize = function () {
    let t = ['coalesce']; return this.eachChild((function (e) {
      t.push(e.serialize());
    })), t;
  }; let Ed = Td; let Rd = function (t, e) {
    this.type = e.type, this.bindings = [].concat(t), this.result = e;
  }; Rd.prototype.evaluate = function (t) {
    return this.result.evaluate(t);
  }, Rd.prototype.eachChild = function (t) {
    for (let e = 0, i = this.bindings; e < i.length; e += 1) {
      t(i[e][1]);
    }t(this.result);
  }, Rd.parse = function (t, e) {
    if (t.length < 4) {
      return e.error('Expected at least 3 arguments, but found ' + (t.length - 1) + ' instead.');
    } for (var i = [], n = 1; n < t.length - 1; n += 2) {
      let r = t[n]; if (typeof r !== 'string') {
        return e.error('Expected string, but found ' + typeof r + ' instead.', n);
      } if (/[^a-zA-Z0-9_]/.test(r)) {
        return e.error('Variable names must contain only alphanumeric characters or \'_\'.', n);
      } let s = e.parse(t[n + 1], n + 1); if (!s) {
        return null;
      } i.push([r, s]);
    } let o = e.parse(t[t.length - 1], t.length - 1, e.expectedType, i); return o ? new Rd(i, o) : null;
  }, Rd.prototype.outputDefined = function () {
    return this.result.outputDefined();
  }, Rd.prototype.serialize = function () {
    for (var t = ['let'], e = 0, i = this.bindings; e < i.length; e += 1) {
      let n = i[e]; let r = n[0]; let s = n[1]; t.push(r, s.serialize());
    } return t.push(this.result.serialize()), t;
  }; let Id = Rd; let Md = function (t, e, i) {
    this.type = t, this.index = e, this.input = i;
  }; Md.parse = function (t, e) {
    if (t.length !== 3) {
      return e.error('Expected 2 arguments, but found ' + (t.length - 1) + ' instead.');
    } let i = e.parse(t[1], 1, Lu); let n = e.parse(t[2], 2, Xu(e.expectedType || ju)); if (!i || !n) {
      return null;
    } let r = n.type; return new Md(r.itemType, i, n);
  }, Md.prototype.evaluate = function (t) {
    let e = this.index.evaluate(t); let i = this.input.evaluate(t); if (e < 0) {
      throw new lc('Array index out of bounds: ' + e + ' < 0.');
    } if (e >= i.length) {
      throw new lc('Array index out of bounds: ' + e + ' > ' + (i.length - 1) + '.');
    } if (e !== Math.floor(e)) {
      throw new lc('Array index must be an integer, but found ' + e + ' instead.');
    } return i[e];
  }, Md.prototype.eachChild = function (t) {
    t(this.index), t(this.input);
  }, Md.prototype.outputDefined = function () {
    return !1;
  }, Md.prototype.serialize = function () {
    return ['at', this.index.serialize(), this.input.serialize()];
  }; let kd = Md; let Fd = function (t, e) {
    this.type = zu, this.needle = t, this.haystack = e;
  }; Fd.parse = function (t, e) {
    if (t.length !== 3) {
      return e.error('Expected 2 arguments, but found ' + (t.length - 1) + ' instead.');
    } let i = e.parse(t[1], 1, ju); let n = e.parse(t[2], 2, ju); return i && n ? Yu(i.type, [zu, Au, Lu, Pu, ju]) ? new Fd(i, n) : e.error('Expected first argument to be of type boolean, string, number or null, but found ' + qu(i.type) + ' instead') : null;
  }, Fd.prototype.evaluate = function (t) {
    let e = this.needle.evaluate(t); let i = this.haystack.evaluate(t); if (i == null) {
      return !1;
    } if (!Ku(e, ['boolean', 'string', 'number', 'null'])) {
      throw new lc('Expected first argument to be of type boolean, string, number or null, but found ' + qu(nc(e)) + ' instead.');
    } if (!Ku(i, ['string', 'array'])) {
      throw new lc('Expected second argument to be of type array or string, but found ' + qu(nc(i)) + ' instead.');
    } return i.indexOf(e) >= 0;
  }, Fd.prototype.eachChild = function (t) {
    t(this.needle), t(this.haystack);
  }, Fd.prototype.outputDefined = function () {
    return !0;
  }, Fd.prototype.serialize = function () {
    return ['in', this.needle.serialize(), this.haystack.serialize()];
  }; let Pd = Fd; let Ld = function (t, e, i) {
    this.type = Lu, this.needle = t, this.haystack = e, this.fromIndex = i;
  }; Ld.parse = function (t, e) {
    if (t.length <= 2 || t.length >= 5) {
      return e.error('Expected 3 or 4 arguments, but found ' + (t.length - 1) + ' instead.');
    } let i = e.parse(t[1], 1, ju); let n = e.parse(t[2], 2, ju); if (!i || !n) {
      return null;
    } if (!Yu(i.type, [zu, Au, Lu, Pu, ju])) {
      return e.error('Expected first argument to be of type boolean, string, number or null, but found ' + qu(i.type) + ' instead');
    } if (t.length === 4) {
      let r = e.parse(t[3], 3, Lu); return r ? new Ld(i, n, r) : null;
    } return new Ld(i, n);
  }, Ld.prototype.evaluate = function (t) {
    let e = this.needle.evaluate(t); let i = this.haystack.evaluate(t); if (!Ku(e, ['boolean', 'string', 'number', 'null'])) {
      throw new lc('Expected first argument to be of type boolean, string, number or null, but found ' + qu(nc(e)) + ' instead.');
    } if (!Ku(i, ['string', 'array'])) {
      throw new lc('Expected second argument to be of type array or string, but found ' + qu(nc(i)) + ' instead.');
    } if (this.fromIndex) {
      let n = this.fromIndex.evaluate(t); return i.indexOf(e, n);
    } return i.indexOf(e);
  }, Ld.prototype.eachChild = function (t) {
    t(this.needle), t(this.haystack), this.fromIndex && t(this.fromIndex);
  }, Ld.prototype.outputDefined = function () {
    return !1;
  }, Ld.prototype.serialize = function () {
    if (this.fromIndex != null && void 0 !== this.fromIndex) {
      let t = this.fromIndex.serialize(); return ['index-of', this.needle.serialize(), this.haystack.serialize(), t];
    } return ['index-of', this.needle.serialize(), this.haystack.serialize()];
  }; let Ad = Ld; let zd = function (t, e, i, n, r, s) {
    this.inputType = t, this.type = e, this.input = i, this.cases = n, this.outputs = r, this.otherwise = s;
  }; zd.parse = function (t, e) {
    if (t.length < 5) {
      return e.error('Expected at least 4 arguments, but found only ' + (t.length - 1) + '.');
    } if (t.length % 2 != 1) {
      return e.error('Expected an even number of arguments.');
    } let i; let n; e.expectedType && e.expectedType.kind !== 'value' && (n = e.expectedType); for (var r = {}, s = [], o = 2; o < t.length - 1; o += 2) {
      let a = t[o]; let l = t[o + 1]; Array.isArray(a) || (a = [a]); let h = e.concat(o); if (a.length === 0) {
        return h.error('Expected at least one branch label.');
      } for (let u = 0, c = a; u < c.length; u += 1) {
        let d = c[u]; if (typeof d !== 'number' && typeof d !== 'string') {
          return h.error('Branch labels must be numbers or strings.');
        } if (typeof d === 'number' && Math.abs(d) > Number.MAX_SAFE_INTEGER) {
          return h.error('Branch labels must be integers no larger than ' + Number.MAX_SAFE_INTEGER + '.');
        } if (typeof d === 'number' && Math.floor(d) !== d) {
          return h.error('Numeric branch labels must be integer values.');
        } if (i) {
          if (h.checkSubtype(i, nc(d))) {
            return null;
          }
        } else {
          i = nc(d);
        } if (void 0 !== r[String(d)]) {
          return h.error('Branch labels must be unique.');
        } r[String(d)] = s.length;
      } let p = e.parse(l, o, n); if (!p) {
        return null;
      } n = n || p.type, s.push(p);
    } let g = e.parse(t[1], 1, ju); if (!g) {
      return null;
    } let f = e.parse(t[t.length - 1], t.length - 1, n); return f ? g.type.kind !== 'value' && e.concat(1).checkSubtype(i, g.type) ? null : new zd(i, n, g, r, s, f) : null;
  }, zd.prototype.evaluate = function (t) {
    let e = this.input.evaluate(t); return (nc(e) === this.inputType && this.outputs[this.cases[e]] || this.otherwise).evaluate(t);
  }, zd.prototype.eachChild = function (t) {
    t(this.input), this.outputs.forEach(t), t(this.otherwise);
  }, zd.prototype.outputDefined = function () {
    return this.outputs.every((function (t) {
      return t.outputDefined();
    })) && this.otherwise.outputDefined();
  }, zd.prototype.serialize = function () {
    for (var t = this, e = ['match', this.input.serialize()], i = [], n = {}, r = 0, s = Object.keys(this.cases).sort(); r < s.length; r += 1) {
      let o = s[r]; void 0 === (c = n[this.cases[o]]) ? (n[this.cases[o]] = i.length, i.push([this.cases[o], [o]])) : i[c][1].push(o);
    } for (let a = function (e) {
        return t.inputType.kind === 'number' ? Number(e) : e;
      }, l = 0, h = i; l < h.length; l += 1) {
      let u = h[l]; var c = u[0]; let d = u[1]; d.length === 1 ? e.push(a(d[0])) : e.push(d.map(a)), e.push(this.outputs[outputIndex$1].serialize());
    } return e.push(this.otherwise.serialize()), e;
  }; let Od = zd; let Dd = function (t, e, i) {
    this.type = t, this.branches = e, this.otherwise = i;
  }; Dd.parse = function (t, e) {
    if (t.length < 4) {
      return e.error('Expected at least 3 arguments, but found only ' + (t.length - 1) + '.');
    } if (t.length % 2 != 0) {
      return e.error('Expected an odd number of arguments.');
    } let i; e.expectedType && e.expectedType.kind !== 'value' && (i = e.expectedType); for (var n = [], r = 1; r < t.length - 1; r += 2) {
      let s = e.parse(t[r], r, zu); if (!s) {
        return null;
      } let o = e.parse(t[r + 1], r + 1, i); if (!o) {
        return null;
      } n.push([s, o]), i = i || o.type;
    } let a = e.parse(t[t.length - 1], t.length - 1, i); return a ? new Dd(i, n, a) : null;
  }, Dd.prototype.evaluate = function (t) {
    for (let e = 0, i = this.branches; e < i.length; e += 1) {
      let n = i[e]; let r = n[0]; let s = n[1]; if (r.evaluate(t)) {
        return s.evaluate(t);
      }
    } return this.otherwise.evaluate(t);
  }, Dd.prototype.eachChild = function (t) {
    for (let e = 0, i = this.branches; e < i.length; e += 1) {
      let n = i[e]; let r = n[0]; let s = n[1]; t(r), t(s);
    }t(this.otherwise);
  }, Dd.prototype.outputDefined = function () {
    return this.branches.every((function (t) {
      return t[0], t[1].outputDefined();
    })) && this.otherwise.outputDefined();
  }, Dd.prototype.serialize = function () {
    let t = ['case']; return this.eachChild((function (e) {
      t.push(e.serialize());
    })), t;
  }; let jd = Dd; let Gd = function (t, e, i, n) {
    this.type = t, this.input = e, this.beginIndex = i, this.endIndex = n;
  }; Gd.parse = function (t, e) {
    if (t.length <= 2 || t.length >= 5) {
      return e.error('Expected 3 or 4 arguments, but found ' + (t.length - 1) + ' instead.');
    } let i = e.parse(t[1], 1, ju); let n = e.parse(t[2], 2, Lu); if (!i || !n) {
      return null;
    } if (!Yu(i.type, [Xu(ju), Au, ju])) {
      return e.error('Expected first argument to be of type array or string, but found ' + qu(i.type) + ' instead');
    } if (t.length === 4) {
      let r = e.parse(t[3], 3, Lu); return r ? new Gd(i.type, i, n, r) : null;
    } return new Gd(i.type, i, n);
  }, Gd.prototype.evaluate = function (t) {
    let e = this.input.evaluate(t); let i = this.beginIndex.evaluate(t); if (!Ku(e, ['string', 'array'])) {
      throw new lc('Expected first argument to be of type array or string, but found ' + qu(nc(e)) + ' instead.');
    } if (this.endIndex) {
      let n = this.endIndex.evaluate(t); return e.slice(i, n);
    } return e.slice(i);
  }, Gd.prototype.eachChild = function (t) {
    t(this.input), t(this.beginIndex), this.endIndex && t(this.endIndex);
  }, Gd.prototype.outputDefined = function () {
    return !1;
  }, Gd.prototype.serialize = function () {
    if (this.endIndex != null && void 0 !== this.endIndex) {
      let t = this.endIndex.serialize(); return ['slice', this.input.serialize(), this.beginIndex.serialize(), t];
    } return ['slice', this.input.serialize(), this.beginIndex.serialize()];
  }; let Nd = Gd; function Wd(t, e) {
    return t === '==' || t === '!=' ? e.kind === 'boolean' || e.kind === 'string' || e.kind === 'number' || e.kind === 'null' || e.kind === 'value' : e.kind === 'string' || e.kind === 'number' || e.kind === 'value';
  } function Xd(t, e, i, n) {
    return n.compare(e, i) === 0;
  } function qd(t, e, i) {
    let n = t !== '==' && t !== '!='; return function () {
      function r(t, e, i) {
        this.type = zu, this.lhs = t, this.rhs = e, this.collator = i, this.hasUntypedArgument = t.type.kind === 'value' || e.type.kind === 'value';
      } return r.parse = function (t, e) {
        if (t.length !== 3 && t.length !== 4) {
          return e.error('Expected two or three arguments.');
        } let i = t[0]; let s = e.parse(t[1], 1, ju); if (!s) {
          return null;
        } if (!Wd(i, s.type)) {
          return e.concat(1).error('"' + i + '" comparisons are not supported for type \'' + qu(s.type) + '\'.');
        } let o = e.parse(t[2], 2, ju); if (!o) {
          return null;
        } if (!Wd(i, o.type)) {
          return e.concat(2).error('"' + i + '" comparisons are not supported for type \'' + qu(o.type) + '\'.');
        } if (s.type.kind !== o.type.kind && s.type.kind !== 'value' && o.type.kind !== 'value') {
          return e.error('Cannot compare types \'' + qu(s.type) + '\' and \'' + qu(o.type) + '\'.');
        } n && (s.type.kind === 'value' && o.type.kind !== 'value' ? s = new cc(o.type, [s]) : s.type.kind !== 'value' && o.type.kind === 'value' && (o = new cc(s.type, [o]))); let a = null; if (t.length === 4) {
          if (s.type.kind !== 'string' && o.type.kind !== 'string' && s.type.kind !== 'value' && o.type.kind !== 'value') {
            return e.error('Cannot use collator to compare non-string types.');
          } if (!(a = e.parse(t[3], 3, Gu))) {
            return null;
          }
        } return new r(s, o, a);
      }, r.prototype.evaluate = function (r) {
        let s = this.lhs.evaluate(r); let o = this.rhs.evaluate(r); if (n && this.hasUntypedArgument) {
          let a = nc(s); let l = nc(o); if (a.kind !== l.kind || a.kind !== 'string' && a.kind !== 'number') {
            throw new lc('Expected arguments for "' + t + '" to be (string, string) or (number, number), but found (' + a.kind + ', ' + l.kind + ') instead.');
          }
        } if (this.collator && !n && this.hasUntypedArgument) {
          let h = nc(s); let u = nc(o); if (h.kind !== 'string' || u.kind !== 'string') {
            return e(r, s, o);
          }
        } return this.collator ? i(r, s, o, this.collator.evaluate(r)) : e(r, s, o);
      }, r.prototype.eachChild = function (t) {
        t(this.lhs), t(this.rhs), this.collator && t(this.collator);
      }, r.prototype.outputDefined = function () {
        return !0;
      }, r.prototype.serialize = function () {
        let e = [t]; return this.eachChild((function (t) {
          e.push(t.serialize());
        })), e;
      }, r;
    }();
  } let Bd = qd('==', (function (t, e, i) {
    return e === i;
  }), Xd); let Vd = qd('!=', (function (t, e, i) {
    return e !== i;
  }), (function (t, e, i, n) {
    return !Xd(0, e, i, n);
  })); let Yd = qd('<', (function (t, e, i) {
    return e < i;
  }), (function (t, e, i, n) {
    return n.compare(e, i) < 0;
  })); let Kd = qd('>', (function (t, e, i) {
    return e > i;
  }), (function (t, e, i, n) {
    return n.compare(e, i) > 0;
  })); let Zd = qd('<=', (function (t, e, i) {
    return e <= i;
  }), (function (t, e, i, n) {
    return n.compare(e, i) <= 0;
  })); let Ud = qd('>=', (function (t, e, i) {
    return e >= i;
  }), (function (t, e, i, n) {
    return n.compare(e, i) >= 0;
  })); let Hd = function (t, e, i, n, r, s) {
    this.type = Au, this.number = t, this.locale = e, this.currency = i, this.unit = n, this.minFractionDigits = r, this.maxFractionDigits = s;
  }; Hd.parse = function (t, e) {
    if (t.length !== 3) {
      return e.error('Expected two arguments.');
    } let i = e.parse(t[1], 1, Lu); if (!i) {
      return null;
    } let n = t[2]; if (typeof n !== 'object' || Array.isArray(n)) {
      return e.error('NumberFormat options argument must be an object.');
    } let r = null; if (n.locale && !(r = e.parse(n.locale, 1, Au))) {
      return null;
    } let s = null; if (n.currency && !(s = e.parse(n.currency, 1, Au))) {
      return null;
    } let o = null; if (n.unit && !(o = e.parse(n.unit, 1, Au))) {
      return null;
    } let a = null; if (n['min-fraction-digits'] && !(a = e.parse(n['min-fraction-digits'], 1, Lu))) {
      return null;
    } let l = null; return n['max-fraction-digits'] && !(l = e.parse(n['max-fraction-digits'], 1, Lu)) ? null : new Hd(i, r, s, o, a, l);
  }, Hd.prototype.evaluate = function (t) {
    return new Intl.NumberFormat(this.locale ? this.locale.evaluate(t) : [], {style: (this.currency ? 'currency' : this.unit && 'unit') || 'decimal', currency: this.currency ? this.currency.evaluate(t) : void 0, unit: this.unit ? this.unit.evaluate(t) : void 0, minimumFractionDigits: this.minFractionDigits ? this.minFractionDigits.evaluate(t) : void 0, maximumFractionDigits: this.maxFractionDigits ? this.maxFractionDigits.evaluate(t) : void 0}).format(this.number.evaluate(t));
  }, Hd.prototype.eachChild = function (t) {
    t(this.number), this.locale && t(this.locale), this.currency && t(this.currency), this.unit && t(this.unit), this.minFractionDigits && t(this.minFractionDigits), this.maxFractionDigits && t(this.maxFractionDigits);
  }, Hd.prototype.outputDefined = function () {
    return !1;
  }, Hd.prototype.serialize = function () {
    let t = {}; return this.locale && (t.locale = this.locale.serialize()), this.currency && (t.currency = this.currency.serialize()), this.unit && (t.unit = this.unit.serialize()), this.minFractionDigits && (t['min-fraction-digits'] = this.minFractionDigits.serialize()), this.maxFractionDigits && (t['max-fraction-digits'] = this.maxFractionDigits.serialize()), ['number-format', this.number.serialize(), t];
  }; let Jd = Hd; let Qd = function (t) {
    this.type = Lu, this.input = t;
  }; Qd.parse = function (t, e) {
    if (t.length !== 2) {
      return e.error('Expected 1 argument, but found ' + (t.length - 1) + ' instead.');
    } let i = e.parse(t[1], 1); return i ? i.type.kind !== 'array' && i.type.kind !== 'string' && i.type.kind !== 'value' ? e.error('Expected argument of type string or array, but found ' + qu(i.type) + ' instead.') : new Qd(i) : null;
  }, Qd.prototype.evaluate = function (t) {
    let e = this.input.evaluate(t); if (typeof e === 'string') {
      return e.length;
    } if (Array.isArray(e)) {
      return e.length;
    } throw new lc('Expected value to be of type string or array, but found ' + qu(nc(e)) + ' instead.');
  }, Qd.prototype.eachChild = function (t) {
    t(this.input);
  }, Qd.prototype.outputDefined = function () {
    return !1;
  }, Qd.prototype.serialize = function () {
    let t = ['length']; return this.eachChild((function (e) {
      t.push(e.serialize());
    })), t;
  }; let $d = {'==': Bd, '!=': Vd, '>': Kd, '<': Yd, '>=': Ud, '<=': Zd, 'array': cc, 'at': kd, 'boolean': cc, 'case': jd, 'coalesce': Ed, 'collator': Tc, 'format': pc, 'image': fc, 'in': Pd, 'index-of': Ad, 'interpolate': Sd, 'interpolate-hcl': Sd, 'interpolate-lab': Sd, 'length': Qd, 'let': Id, 'literal': oc, 'match': Od, 'number': cc, 'number-format': Jd, 'object': cc, 'slice': Nd, 'step': ed, 'string': cc, 'to-boolean': _c, 'to-color': _c, 'to-number': _c, 'to-string': _c, 'var': Uc, 'within': Bc}; function tp(t, e) {
    let i = e[0]; let n = e[1]; let r = e[2]; let s = e[3]; i = i.evaluate(t), n = n.evaluate(t), r = r.evaluate(t); let o = s ? s.evaluate(t) : 1; let a = ec(i, n, r, o); if (a) {
      throw new lc(a);
    } return new vu(i / 255 * o, n / 255 * o, r / 255 * o, o);
  } function ep(t, e) {
    return t in e;
  } function ip(t, e) {
    let i = e[t]; return void 0 === i ? null : i;
  } function np(t) {
    return {type: t};
  }Cc.register($d, {'error': [{kind: 'error'}, [Au], function (t, e) {
    let i = e[0]; throw new lc(i.evaluate(t));
  }], 'typeof': [Au, [ju], function (t, e) {
    return qu(nc(e[0].evaluate(t)));
  }], 'to-rgba': [Xu(Lu, 4), [Ou], function (t, e) {
    return e[0].evaluate(t).toArray();
  }], 'rgb': [Ou, [Lu, Lu, Lu], tp], 'rgba': [Ou, [Lu, Lu, Lu, Lu], tp], 'has': {type: zu, overloads: [[[Au], function (t, e) {
    return ep(e[0].evaluate(t), t.properties());
  }], [[Au, Du], function (t, e) {
    let i = e[0]; let n = e[1]; return ep(i.evaluate(t), n.evaluate(t));
  }]]}, 'get': {type: ju, overloads: [[[Au], function (t, e) {
    return ip(e[0].evaluate(t), t.properties());
  }], [[Au, Du], function (t, e) {
    let i = e[0]; let n = e[1]; return ip(i.evaluate(t), n.evaluate(t));
  }]]}, 'feature-state': [ju, [Au], function (t, e) {
    return ip(e[0].evaluate(t), t.featureState || {});
  }], 'properties': [Du, [], function (t) {
    return t.properties();
  }], 'geometry-type': [Au, [], function (t) {
    return t.geometryType();
  }], 'id': [ju, [], function (t) {
    return t.id();
  }], 'zoom': [Lu, [], function (t) {
    return t.globals.zoom;
  }], 'pitch': [Lu, [], function (t) {
    return t.globals.pitch || 0;
  }], 'distance-from-center': [Lu, [], function (t) {
    return t.distanceFromCenter();
  }], 'heatmap-density': [Lu, [], function (t) {
    return t.globals.heatmapDensity || 0;
  }], 'line-progress': [Lu, [], function (t) {
    return t.globals.lineProgress || 0;
  }], 'sky-radial-progress': [Lu, [], function (t) {
    return t.globals.skyRadialProgress || 0;
  }], 'accumulated': [ju, [], function (t) {
    return void 0 === t.globals.accumulated ? null : t.globals.accumulated;
  }], '+': [Lu, np(Lu), function (t, e) {
    for (var i = 0, n = 0, r = e; n < r.length; n += 1) {
      i += r[n].evaluate(t);
    } return i;
  }], '*': [Lu, np(Lu), function (t, e) {
    for (var i = 1, n = 0, r = e; n < r.length; n += 1) {
      i *= r[n].evaluate(t);
    } return i;
  }], '-': {type: Lu, overloads: [[[Lu, Lu], function (t, e) {
    let i = e[0]; let n = e[1]; return i.evaluate(t) - n.evaluate(t);
  }], [[Lu], function (t, e) {
    return -e[0].evaluate(t);
  }]]}, '/': [Lu, [Lu, Lu], function (t, e) {
    let i = e[0]; let n = e[1]; return i.evaluate(t) / n.evaluate(t);
  }], '%': [Lu, [Lu, Lu], function (t, e) {
    let i = e[0]; let n = e[1]; return i.evaluate(t) % n.evaluate(t);
  }], 'ln2': [Lu, [], function () {
    return Math.LN2;
  }], 'pi': [Lu, [], function () {
    return Math.PI;
  }], 'e': [Lu, [], function () {
    return Math.E;
  }], '^': [Lu, [Lu, Lu], function (t, e) {
    let i = e[0]; let n = e[1]; return Math.pow(i.evaluate(t), n.evaluate(t));
  }], 'sqrt': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.sqrt(i.evaluate(t));
  }], 'log10': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.log(i.evaluate(t)) / Math.LN10;
  }], 'ln': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.log(i.evaluate(t));
  }], 'log2': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.log(i.evaluate(t)) / Math.LN2;
  }], 'sin': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.sin(i.evaluate(t));
  }], 'cos': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.cos(i.evaluate(t));
  }], 'tan': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.tan(i.evaluate(t));
  }], 'asin': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.asin(i.evaluate(t));
  }], 'acos': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.acos(i.evaluate(t));
  }], 'atan': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.atan(i.evaluate(t));
  }], 'min': [Lu, np(Lu), function (t, e) {
    return Math.min.apply(Math, e.map((function (e) {
      return e.evaluate(t);
    })));
  }], 'max': [Lu, np(Lu), function (t, e) {
    return Math.max.apply(Math, e.map((function (e) {
      return e.evaluate(t);
    })));
  }], 'abs': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.abs(i.evaluate(t));
  }], 'round': [Lu, [Lu], function (t, e) {
    let i = e[0].evaluate(t); return i < 0 ? -Math.round(-i) : Math.round(i);
  }], 'floor': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.floor(i.evaluate(t));
  }], 'ceil': [Lu, [Lu], function (t, e) {
    let i = e[0]; return Math.ceil(i.evaluate(t));
  }], 'filter-==': [zu, [Au, ju], function (t, e) {
    let i = e[0]; let n = e[1]; return t.properties()[i.value] === n.value;
  }], 'filter-id-==': [zu, [ju], function (t, e) {
    let i = e[0]; return t.id() === i.value;
  }], 'filter-type-==': [zu, [Au], function (t, e) {
    let i = e[0]; return t.geometryType() === i.value;
  }], 'filter-<': [zu, [Au, ju], function (t, e) {
    let i = e[0]; let n = e[1]; let r = t.properties()[i.value]; let s = n.value; return typeof r === typeof s && r < s;
  }], 'filter-id-<': [zu, [ju], function (t, e) {
    let i = e[0]; let n = t.id(); let r = i.value; return typeof n === typeof r && n < r;
  }], 'filter->': [zu, [Au, ju], function (t, e) {
    let i = e[0]; let n = e[1]; let r = t.properties()[i.value]; let s = n.value; return typeof r === typeof s && r > s;
  }], 'filter-id->': [zu, [ju], function (t, e) {
    let i = e[0]; let n = t.id(); let r = i.value; return typeof n === typeof r && n > r;
  }], 'filter-<=': [zu, [Au, ju], function (t, e) {
    let i = e[0]; let n = e[1]; let r = t.properties()[i.value]; let s = n.value; return typeof r === typeof s && r <= s;
  }], 'filter-id-<=': [zu, [ju], function (t, e) {
    let i = e[0]; let n = t.id(); let r = i.value; return typeof n === typeof r && n <= r;
  }], 'filter->=': [zu, [Au, ju], function (t, e) {
    let i = e[0]; let n = e[1]; let r = t.properties()[i.value]; let s = n.value; return typeof r === typeof s && r >= s;
  }], 'filter-id->=': [zu, [ju], function (t, e) {
    let i = e[0]; let n = t.id(); let r = i.value; return typeof n === typeof r && n >= r;
  }], 'filter-has': [zu, [ju], function (t, e) {
    return e[0].value in t.properties();
  }], 'filter-has-id': [zu, [], function (t) {
    return t.id() !== null && void 0 !== t.id();
  }], 'filter-type-in': [zu, [Xu(Au)], function (t, e) {
    return e[0].value.indexOf(t.geometryType()) >= 0;
  }], 'filter-id-in': [zu, [Xu(ju)], function (t, e) {
    return e[0].value.indexOf(t.id()) >= 0;
  }], 'filter-in-small': [zu, [Au, Xu(ju)], function (t, e) {
    let i = e[0]; return e[1].value.indexOf(t.properties()[i.value]) >= 0;
  }], 'filter-in-large': [zu, [Au, Xu(ju)], function (t, e) {
    let i = e[0]; let n = e[1]; return function (t, e, i, n) {
      for (;i <= n;) {
        let r = i + n >> 1; if (e[r] === t) {
          return !0;
        } e[r] > t ? n = r - 1 : i = r + 1;
      } return !1;
    }(t.properties()[i.value], n.value, 0, n.value.length - 1);
  }], 'all': {type: zu, overloads: [[[zu, zu], function (t, e) {
    let i = e[0]; let n = e[1]; return i.evaluate(t) && n.evaluate(t);
  }], [np(zu), function (t, e) {
    for (let i = 0, n = e; i < n.length; i += 1) {
      if (!n[i].evaluate(t)) {
        return !1;
      }
    } return !0;
  }]]}, 'any': {type: zu, overloads: [[[zu, zu], function (t, e) {
    let i = e[0]; let n = e[1]; return i.evaluate(t) || n.evaluate(t);
  }], [np(zu), function (t, e) {
    for (let i = 0, n = e; i < n.length; i += 1) {
      if (n[i].evaluate(t)) {
        return !0;
      }
    } return !1;
  }]]}, '!': [zu, [zu], function (t, e) {
    return !e[0].evaluate(t);
  }], 'is-supported-script': [zu, [Au], function (t, e) {
    let i = e[0]; let n = t.globals && t.globals.isSupportedScript; return !n || n(i.evaluate(t));
  }], 'upcase': [Au, [Au], function (t, e) {
    return e[0].evaluate(t).toUpperCase();
  }], 'downcase': [Au, [Au], function (t, e) {
    return e[0].evaluate(t).toLowerCase();
  }], 'concat': [Au, np(ju), function (t, e) {
    return e.map((function (e) {
      return rc(e.evaluate(t));
    })).join('');
  }], 'resolved-locale': [Au, [Gu], function (t, e) {
    return e[0].evaluate(t).resolvedLocale();
  }]}); let rp = $d; function sp(t) {
    return {result: 'success', value: t};
  } function op(t) {
    return {result: 'error', value: t};
  } function ap(t) {
    return typeof t === 'object' && t !== null && !Array.isArray(t);
  } let lp = function (t, e) {
    this.expression = t, this._warningHistory = {}, this._evaluator = new bc(), this._defaultValue = e ? function (t) {
      return t.type === 'color' && (ap(t.default) || Array.isArray(t.default)) ? new vu(0, 0, 0, 0) : t.type === 'color' ? vu.parse(t.default) || null : void 0 === t.default ? null : t.default;
    }(e) : null, this._enumValues = e && e.type === 'enum' ? e.values : null;
  }; function hp(t, e) {
    let i = new Jc(rp, [], e ? function (t) {
      let e = {color: Ou, string: Au, number: Lu, enum: Au, boolean: zu, formatted: Nu, resolvedImage: Wu}; if (t.type === 'array') {
        return Xu(e[t.value] || ju, t.length);
      } return e[t.type];
    }(e) : void 0); let n = i.parse(t, void 0, void 0, void 0, e && e.type === 'string' ? {typeAnnotation: 'coerce'} : void 0); return n ? sp(new lp(n, e)) : op(i.errors);
  }lp.prototype.evaluateWithoutErrorHandling = function (t, e, i, n, r, s, o, a) {
    return this._evaluator.globals = t, this._evaluator.feature = e, this._evaluator.featureState = i, this._evaluator.canonical = n || null, this._evaluator.availableImages = r || null, this._evaluator.formattedSection = s, this._evaluator.featureTileCoord = o || null, this._evaluator.featureDistanceData = a || null, this.expression.evaluate(this._evaluator);
  }, lp.prototype.evaluate = function (t, e, i, n, r, s, o, a) {
    this._evaluator.globals = t, this._evaluator.feature = e || null, this._evaluator.featureState = i || null, this._evaluator.canonical = n || null, this._evaluator.availableImages = r || null, this._evaluator.formattedSection = s || null, this._evaluator.featureTileCoord = o || null, this._evaluator.featureDistanceData = a || null; try {
      let l = this.expression.evaluate(this._evaluator); if (l == null || typeof l === 'number' && l != l) {
        return this._defaultValue;
      } if (this._enumValues && !(l in this._enumValues)) {
        throw new lc('Expected value to be one of ' + Object.keys(this._enumValues).map((function (t) {
          return JSON.stringify(t);
        })).join(', ') + ', but found ' + JSON.stringify(l) + ' instead.');
      } return l;
    } catch (t) {
      return this._warningHistory[t.message] || (this._warningHistory[t.message] = !0, typeof console !== 'undefined' && console.warn(t.message)), this._defaultValue;
    }
  }; let up = function (t, e) {
    this.kind = t, this._styleExpression = e, this.isStateDependent = t !== 'constant' && !Yc(e.expression);
  }; up.prototype.evaluateWithoutErrorHandling = function (t, e, i, n, r, s) {
    return this._styleExpression.evaluateWithoutErrorHandling(t, e, i, n, r, s);
  }, up.prototype.evaluate = function (t, e, i, n, r, s) {
    return this._styleExpression.evaluate(t, e, i, n, r, s);
  }; let cp = function (t, e, i, n) {
    this.kind = t, this.zoomStops = i, this._styleExpression = e, this.isStateDependent = t !== 'camera' && !Yc(e.expression), this.interpolationType = n;
  }; function dp(t, e) {
    if ((t = hp(t, e)).result === 'error') {
      return t;
    } let i = t.value.expression; let n = Vc(i); if (!n && !function (t) {
      return t['property-type'] === 'data-driven' || t['property-type'] === 'cross-faded-data-driven';
    }(e)) {
      return op([new Mu('', 'data expressions not supported')]);
    } let r = Kc(i, ['zoom', 'pitch', 'distance-from-center']); if (!r && !function (t) {
      return !!t.expression && t.expression.parameters.indexOf('zoom') > -1;
    }(e)) {
      return op([new Mu('', 'zoom expressions not supported')]);
    } let s = pp(i); if (!s && !r) {
      return op([new Mu('', '"zoom" expression may only be used as input to a top-level "step" or "interpolate" expression.')]);
    } if (s instanceof Mu) {
      return op([s]);
    } if (s instanceof Sd && !function (t) {
      return !!t.expression && t.expression.interpolated;
    }(e)) {
      return op([new Mu('', '"interpolate" expressions cannot be used with this property')]);
    } if (!s) {
      return sp(new up(n ? 'constant' : 'source', t.value));
    } let o = s instanceof Sd ? s.interpolation : void 0; return sp(new cp(n ? 'camera' : 'composite', t.value, s.labels, o));
  } function pp(t) {
    let e = null; if (t instanceof Id) {
      e = pp(t.result);
    } else if (t instanceof Ed) {
      for (let i = 0, n = t.args; i < n.length; i += 1) {
        let r = n[i]; if (e = pp(r)) {
          break;
        }
      }
    } else {
      (t instanceof ed || t instanceof Sd) && t.input instanceof Cc && t.input.name === 'zoom' && (e = t);
    } return e instanceof Mu || t.eachChild((function (t) {
      let i = pp(t); i instanceof Mu ? e = i : !e && i ? e = new Mu('', '"zoom" expression may only be used as input to a top-level "step" or "interpolate" expression.') : e && i && e !== i && (e = new Mu('', 'Only one zoom-based "step" or "interpolate" subexpression may be used in an expression.'));
    })), e;
  } function gp(t) {
    if (Array.isArray(t)) {
      return t.map(gp);
    } if (t instanceof Object && !(t instanceof Number || t instanceof String || t instanceof Boolean)) {
      let e = {}; for (let i in t) {
        e[i] = gp(t[i]);
      } return e;
    } return function (t) {
      return t instanceof Number || t instanceof String || t instanceof Boolean ? t.valueOf() : t;
    }(t);
  }cp.prototype.evaluateWithoutErrorHandling = function (t, e, i, n, r, s) {
    return this._styleExpression.evaluateWithoutErrorHandling(t, e, i, n, r, s);
  }, cp.prototype.evaluate = function (t, e, i, n, r, s) {
    return this._styleExpression.evaluate(t, e, i, n, r, s);
  }, cp.prototype.interpolationFactor = function (t, e, i) {
    return this.interpolationType ? Sd.interpolationFactor(this.interpolationType, t, e, i) : 0;
  }; let fp = {'$version': 8, '$root': {version: {required: !0, type: 'enum', values: [8]}, name: {type: 'string'}, metadata: {type: '*'}, center: {type: 'array', value: 'number'}, zoom: {type: 'number'}, bearing: {type: 'number', default: 0, period: 360, units: 'degrees'}, pitch: {type: 'number', default: 0, units: 'degrees'}, light: {type: 'light'}, terrain: {type: 'terrain'}, fog: {type: 'fog'}, sources: {required: !0, type: 'sources'}, sprite: {type: 'string'}, glyphs: {type: 'string'}, transition: {type: 'transition'}, projection: {type: 'projection'}, layers: {required: !0, type: 'array', value: 'layer'}}, 'sources': {'*': {type: 'source'}}, 'source': ['source_vector', 'source_raster', 'source_raster_dem', 'source_geojson', 'source_video', 'source_image'], 'source_vector': {'type': {required: !0, type: 'enum', values: {vector: {}}}, 'url': {type: 'string'}, 'tiles': {type: 'array', value: 'string'}, 'bounds': {type: 'array', value: 'number', length: 4, default: [-180, -85.051129, 180, 85.051129]}, 'scheme': {type: 'enum', values: {xyz: {}, tms: {}}, default: 'xyz'}, 'minzoom': {type: 'number', default: 0}, 'maxzoom': {type: 'number', default: 22}, 'attribution': {type: 'string'}, 'promoteId': {type: 'promoteId'}, 'volatile': {type: 'boolean', default: !1}, '*': {type: '*'}}, 'source_raster': {'type': {required: !0, type: 'enum', values: {raster: {}}}, 'url': {type: 'string'}, 'tiles': {type: 'array', value: 'string'}, 'bounds': {type: 'array', value: 'number', length: 4, default: [-180, -85.051129, 180, 85.051129]}, 'minzoom': {type: 'number', default: 0}, 'maxzoom': {type: 'number', default: 22}, 'tileSize': {type: 'number', default: 512, units: 'pixels'}, 'scheme': {type: 'enum', values: {xyz: {}, tms: {}}, default: 'xyz'}, 'attribution': {type: 'string'}, 'volatile': {type: 'boolean', default: !1}, '*': {type: '*'}}, 'source_raster_dem': {'type': {required: !0, type: 'enum', values: {'raster-dem': {}}}, 'url': {type: 'string'}, 'tiles': {type: 'array', value: 'string'}, 'bounds': {type: 'array', value: 'number', length: 4, default: [-180, -85.051129, 180, 85.051129]}, 'minzoom': {type: 'number', default: 0}, 'maxzoom': {type: 'number', default: 22}, 'tileSize': {type: 'number', default: 512, units: 'pixels'}, 'attribution': {type: 'string'}, 'encoding': {type: 'enum', values: {terrarium: {}, mapbox: {}}, default: 'mapbox'}, 'volatile': {type: 'boolean', default: !1}, '*': {type: '*'}}, 'source_geojson': {type: {required: !0, type: 'enum', values: {geojson: {}}}, data: {type: '*'}, maxzoom: {type: 'number', default: 18}, attribution: {type: 'string'}, buffer: {type: 'number', default: 128, maximum: 512, minimum: 0}, filter: {type: '*'}, tolerance: {type: 'number', default: 0.375}, cluster: {type: 'boolean', default: !1}, clusterRadius: {type: 'number', default: 50, minimum: 0}, clusterMaxZoom: {type: 'number'}, clusterMinPoints: {type: 'number'}, clusterProperties: {type: '*'}, lineMetrics: {type: 'boolean', default: !1}, generateId: {type: 'boolean', default: !1}, promoteId: {type: 'promoteId'}}, 'source_video': {type: {required: !0, type: 'enum', values: {video: {}}}, urls: {required: !0, type: 'array', value: 'string'}, coordinates: {required: !0, type: 'array', length: 4, value: {type: 'array', length: 2, value: 'number'}}}, 'source_image': {type: {required: !0, type: 'enum', values: {image: {}}}, url: {required: !0, type: 'string'}, coordinates: {required: !0, type: 'array', length: 4, value: {type: 'array', length: 2, value: 'number'}}}, 'layer': {'id': {type: 'string', required: !0}, 'type': {type: 'enum', values: {'fill': {}, 'line': {}, 'symbol': {}, 'circle': {}, 'heatmap': {}, 'fill-extrusion': {}, 'raster': {}, 'hillshade': {}, 'background': {}, 'sky': {}}, required: !0}, 'metadata': {type: '*'}, 'source': {type: 'string'}, 'source-layer': {type: 'string'}, 'minzoom': {type: 'number', minimum: 0, maximum: 24}, 'maxzoom': {type: 'number', minimum: 0, maximum: 24}, 'filter': {type: 'filter'}, 'layout': {type: 'layout'}, 'paint': {type: 'paint'}}, 'layout': ['layout_fill', 'layout_line', 'layout_circle', 'layout_heatmap', 'layout_fill-extrusion', 'layout_symbol', 'layout_raster', 'layout_hillshade', 'layout_background', 'layout_sky'], 'layout_background': {visibility: {'type': 'enum', 'values': {visible: {}, none: {}}, 'default': 'visible', 'property-type': 'constant'}}, 'layout_sky': {visibility: {'type': 'enum', 'values': {visible: {}, none: {}}, 'default': 'visible', 'property-type': 'constant'}}, 'layout_fill': {'fill-sort-key': {'type': 'number', 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'visibility': {'type': 'enum', 'values': {visible: {}, none: {}}, 'default': 'visible', 'property-type': 'constant'}}, 'layout_circle': {'circle-sort-key': {'type': 'number', 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'visibility': {'type': 'enum', 'values': {visible: {}, none: {}}, 'default': 'visible', 'property-type': 'constant'}}, 'layout_heatmap': {visibility: {'type': 'enum', 'values': {visible: {}, none: {}}, 'default': 'visible', 'property-type': 'constant'}}, 'layout_fill-extrusion': {'visibility': {'type': 'enum', 'values': {visible: {}, none: {}}, 'default': 'visible', 'property-type': 'constant'}, 'fill-extrusion-edge-radius': {'type': 'number', 'private': !0, 'default': 0, 'minimum': 0, 'maximum': 1, 'property-type': 'constant'}}, 'layout_line': {'line-cap': {'type': 'enum', 'values': {butt: {}, round: {}, square: {}}, 'default': 'butt', 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'line-join': {'type': 'enum', 'values': {bevel: {}, round: {}, miter: {}}, 'default': 'miter', 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'line-miter-limit': {'type': 'number', 'default': 2, 'requires': [{'line-join': 'miter'}], 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'line-round-limit': {'type': 'number', 'default': 1.05, 'requires': [{'line-join': 'round'}], 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'line-sort-key': {'type': 'number', 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'visibility': {'type': 'enum', 'values': {visible: {}, none: {}}, 'default': 'visible', 'property-type': 'constant'}}, 'layout_symbol': {'symbol-placement': {'type': 'enum', 'values': {'point': {}, 'line': {}, 'line-center': {}}, 'default': 'point', 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'symbol-spacing': {'type': 'number', 'default': 250, 'minimum': 1, 'units': 'pixels', 'requires': [{'symbol-placement': 'line'}], 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'symbol-avoid-edges': {'type': 'boolean', 'default': !1, 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'symbol-sort-key': {'type': 'number', 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'symbol-z-order': {'type': 'enum', 'values': {'auto': {}, 'viewport-y': {}, 'source': {}}, 'default': 'auto', 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'icon-allow-overlap': {'type': 'boolean', 'default': !1, 'requires': ['icon-image'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'icon-ignore-placement': {'type': 'boolean', 'default': !1, 'requires': ['icon-image'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'icon-optional': {'type': 'boolean', 'default': !1, 'requires': ['icon-image', 'text-field'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'icon-rotation-alignment': {'type': 'enum', 'values': {map: {}, viewport: {}, auto: {}}, 'default': 'auto', 'requires': ['icon-image'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'icon-size': {'type': 'number', 'default': 1, 'minimum': 0, 'units': 'factor of the original icon size', 'requires': ['icon-image'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'icon-text-fit': {'type': 'enum', 'values': {none: {}, width: {}, height: {}, both: {}}, 'default': 'none', 'requires': ['icon-image', 'text-field'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'icon-text-fit-padding': {'type': 'array', 'value': 'number', 'length': 4, 'default': [0, 0, 0, 0], 'units': 'pixels', 'requires': ['icon-image', 'text-field', {'icon-text-fit': ['both', 'width', 'height']}], 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'icon-image': {'type': 'resolvedImage', 'tokens': !0, 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'icon-rotate': {'type': 'number', 'default': 0, 'period': 360, 'units': 'degrees', 'requires': ['icon-image'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'icon-padding': {'type': 'number', 'default': 2, 'minimum': 0, 'units': 'pixels', 'requires': ['icon-image'], 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'icon-keep-upright': {'type': 'boolean', 'default': !1, 'requires': ['icon-image', {'icon-rotation-alignment': 'map'}, {'symbol-placement': ['line', 'line-center']}], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'icon-offset': {'type': 'array', 'value': 'number', 'length': 2, 'default': [0, 0], 'requires': ['icon-image'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'icon-anchor': {'type': 'enum', 'values': {'center': {}, 'left': {}, 'right': {}, 'top': {}, 'bottom': {}, 'top-left': {}, 'top-right': {}, 'bottom-left': {}, 'bottom-right': {}}, 'default': 'center', 'requires': ['icon-image'], 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'icon-pitch-alignment': {'type': 'enum', 'values': {map: {}, viewport: {}, auto: {}}, 'default': 'auto', 'requires': ['icon-image'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-pitch-alignment': {'type': 'enum', 'values': {map: {}, viewport: {}, auto: {}}, 'default': 'auto', 'requires': ['text-field'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-rotation-alignment': {'type': 'enum', 'values': {map: {}, viewport: {}, auto: {}}, 'default': 'auto', 'requires': ['text-field'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-field': {'type': 'formatted', 'default': '', 'tokens': !0, 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'text-font': {'type': 'array', 'value': 'string', 'default': ['Open Sans Regular', 'Arial Unicode MS Regular'], 'requires': ['text-field'], 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'text-size': {'type': 'number', 'default': 16, 'minimum': 0, 'units': 'pixels', 'requires': ['text-field'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'text-max-width': {'type': 'number', 'default': 10, 'minimum': 0, 'units': 'ems', 'requires': ['text-field', {'symbol-placement': ['point']}], 'expression': {interpolated: !0, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'text-line-height': {'type': 'number', 'default': 1.2, 'units': 'ems', 'requires': ['text-field'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'text-letter-spacing': {'type': 'number', 'default': 0, 'units': 'ems', 'requires': ['text-field'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'text-justify': {'type': 'enum', 'values': {auto: {}, left: {}, center: {}, right: {}}, 'default': 'center', 'requires': ['text-field'], 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'text-radial-offset': {'type': 'number', 'units': 'ems', 'default': 0, 'requires': ['text-field'], 'property-type': 'data-driven', 'expression': {interpolated: !0, parameters: ['zoom', 'feature']}}, 'text-variable-anchor': {'type': 'array', 'value': 'enum', 'values': {'center': {}, 'left': {}, 'right': {}, 'top': {}, 'bottom': {}, 'top-left': {}, 'top-right': {}, 'bottom-left': {}, 'bottom-right': {}}, 'requires': ['text-field', {'symbol-placement': ['point']}], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-anchor': {'type': 'enum', 'values': {'center': {}, 'left': {}, 'right': {}, 'top': {}, 'bottom': {}, 'top-left': {}, 'top-right': {}, 'bottom-left': {}, 'bottom-right': {}}, 'default': 'center', 'requires': ['text-field', {'!': 'text-variable-anchor'}], 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'text-max-angle': {'type': 'number', 'default': 45, 'units': 'degrees', 'requires': ['text-field', {'symbol-placement': ['line', 'line-center']}], 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-writing-mode': {'type': 'array', 'value': 'enum', 'values': {horizontal: {}, vertical: {}}, 'requires': ['text-field'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-rotate': {'type': 'number', 'default': 0, 'period': 360, 'units': 'degrees', 'requires': ['text-field'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'text-padding': {'type': 'number', 'default': 2, 'minimum': 0, 'units': 'pixels', 'requires': ['text-field'], 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-keep-upright': {'type': 'boolean', 'default': !0, 'requires': ['text-field', {'text-rotation-alignment': 'map'}, {'symbol-placement': ['line', 'line-center']}], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-transform': {'type': 'enum', 'values': {none: {}, uppercase: {}, lowercase: {}}, 'default': 'none', 'requires': ['text-field'], 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'text-offset': {'type': 'array', 'value': 'number', 'units': 'ems', 'length': 2, 'default': [0, 0], 'requires': ['text-field', {'!': 'text-radial-offset'}], 'expression': {interpolated: !0, parameters: ['zoom', 'feature']}, 'property-type': 'data-driven'}, 'text-allow-overlap': {'type': 'boolean', 'default': !1, 'requires': ['text-field'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-ignore-placement': {'type': 'boolean', 'default': !1, 'requires': ['text-field'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-optional': {'type': 'boolean', 'default': !1, 'requires': ['text-field', 'icon-image'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'visibility': {'type': 'enum', 'values': {visible: {}, none: {}}, 'default': 'visible', 'property-type': 'constant'}}, 'layout_raster': {visibility: {'type': 'enum', 'values': {visible: {}, none: {}}, 'default': 'visible', 'property-type': 'constant'}}, 'layout_hillshade': {visibility: {'type': 'enum', 'values': {visible: {}, none: {}}, 'default': 'visible', 'property-type': 'constant'}}, 'filter': {type: 'array', value: '*'}, 'filter_symbol': {'type': 'boolean', 'default': !1, 'transition': !1, 'property-type': 'data-driven', 'expression': {interpolated: !1, parameters: ['zoom', 'feature', 'pitch', 'distance-from-center']}}, 'filter_fill': {'type': 'boolean', 'default': !1, 'transition': !1, 'property-type': 'data-driven', 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}}, 'filter_line': {'type': 'boolean', 'default': !1, 'transition': !1, 'property-type': 'data-driven', 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}}, 'filter_circle': {'type': 'boolean', 'default': !1, 'transition': !1, 'property-type': 'data-driven', 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}}, 'filter_fill-extrusion': {'type': 'boolean', 'default': !1, 'transition': !1, 'property-type': 'data-driven', 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}}, 'filter_heatmap': {'type': 'boolean', 'default': !1, 'transition': !1, 'property-type': 'data-driven', 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}}, 'filter_operator': {type: 'enum', values: {'==': {}, '!=': {}, '>': {}, '>=': {}, '<': {}, '<=': {}, 'in': {}, '!in': {}, 'all': {}, 'any': {}, 'none': {}, 'has': {}, '!has': {}, 'within': {}}}, 'geometry_type': {type: 'enum', values: {Point: {}, LineString: {}, Polygon: {}}}, 'function': {expression: {type: 'expression'}, stops: {type: 'array', value: 'function_stop'}, base: {type: 'number', default: 1, minimum: 0}, property: {type: 'string', default: '$zoom'}, type: {type: 'enum', values: {identity: {}, exponential: {}, interval: {}, categorical: {}}, default: 'exponential'}, colorSpace: {type: 'enum', values: {rgb: {}, lab: {}, hcl: {}}, default: 'rgb'}, default: {type: '*', required: !1}}, 'function_stop': {type: 'array', minimum: 0, maximum: 24, value: ['number', 'color'], length: 2}, 'expression': {type: 'array', value: '*', minimum: 1}, 'expression_name': {type: 'enum', values: {'let': {group: 'Variable binding'}, 'var': {group: 'Variable binding'}, 'literal': {group: 'Types'}, 'array': {group: 'Types'}, 'at': {group: 'Lookup'}, 'in': {group: 'Lookup'}, 'index-of': {group: 'Lookup'}, 'slice': {group: 'Lookup'}, 'case': {group: 'Decision'}, 'match': {group: 'Decision'}, 'coalesce': {group: 'Decision'}, 'step': {group: 'Ramps, scales, curves'}, 'interpolate': {group: 'Ramps, scales, curves'}, 'interpolate-hcl': {group: 'Ramps, scales, curves'}, 'interpolate-lab': {group: 'Ramps, scales, curves'}, 'ln2': {group: 'Math'}, 'pi': {group: 'Math'}, 'e': {group: 'Math'}, 'typeof': {group: 'Types'}, 'string': {group: 'Types'}, 'number': {group: 'Types'}, 'boolean': {group: 'Types'}, 'object': {group: 'Types'}, 'collator': {group: 'Types'}, 'format': {group: 'Types'}, 'image': {group: 'Types'}, 'number-format': {group: 'Types'}, 'to-string': {group: 'Types'}, 'to-number': {group: 'Types'}, 'to-boolean': {group: 'Types'}, 'to-rgba': {group: 'Color'}, 'to-color': {group: 'Types'}, 'rgb': {group: 'Color'}, 'rgba': {group: 'Color'}, 'get': {group: 'Lookup'}, 'has': {group: 'Lookup'}, 'length': {group: 'Lookup'}, 'properties': {group: 'Feature data'}, 'feature-state': {group: 'Feature data'}, 'geometry-type': {group: 'Feature data'}, 'id': {group: 'Feature data'}, 'zoom': {group: 'Camera'}, 'pitch': {group: 'Camera'}, 'distance-from-center': {group: 'Camera'}, 'heatmap-density': {group: 'Heatmap'}, 'line-progress': {group: 'Feature data'}, 'sky-radial-progress': {group: 'sky'}, 'accumulated': {group: 'Feature data'}, '+': {group: 'Math'}, '*': {group: 'Math'}, '-': {group: 'Math'}, '/': {group: 'Math'}, '%': {group: 'Math'}, '^': {group: 'Math'}, 'sqrt': {group: 'Math'}, 'log10': {group: 'Math'}, 'ln': {group: 'Math'}, 'log2': {group: 'Math'}, 'sin': {group: 'Math'}, 'cos': {group: 'Math'}, 'tan': {group: 'Math'}, 'asin': {group: 'Math'}, 'acos': {group: 'Math'}, 'atan': {group: 'Math'}, 'min': {group: 'Math'}, 'max': {group: 'Math'}, 'round': {group: 'Math'}, 'abs': {group: 'Math'}, 'ceil': {group: 'Math'}, 'floor': {group: 'Math'}, 'distance': {group: 'Math'}, '==': {group: 'Decision'}, '!=': {group: 'Decision'}, '>': {group: 'Decision'}, '<': {group: 'Decision'}, '>=': {group: 'Decision'}, '<=': {group: 'Decision'}, 'all': {group: 'Decision'}, 'any': {group: 'Decision'}, '!': {group: 'Decision'}, 'within': {group: 'Decision'}, 'is-supported-script': {group: 'String'}, 'upcase': {group: 'String'}, 'downcase': {group: 'String'}, 'concat': {group: 'String'}, 'resolved-locale': {group: 'String'}}}, 'fog': {'range': {'type': 'array', 'default': [0.5, 10], 'minimum': -20, 'maximum': 20, 'length': 2, 'value': 'number', 'property-type': 'data-constant', 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}}, 'color': {'type': 'color', 'property-type': 'data-constant', 'default': '#ffffff', 'expression': {interpolated: !0, parameters: ['zoom']}, 'transition': !0}, 'high-color': {'type': 'color', 'property-type': 'data-constant', 'default': '#245cdf', 'expression': {interpolated: !0, parameters: ['zoom']}, 'transition': !0}, 'space-color': {'type': 'color', 'property-type': 'data-constant', 'default': ['interpolate', ['linear'], ['zoom'], 4, '#010b19', 7, '#367ab9'], 'expression': {interpolated: !0, parameters: ['zoom']}, 'transition': !0}, 'horizon-blend': {'type': 'number', 'property-type': 'data-constant', 'default': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 7, 0.1], 'minimum': 0, 'maximum': 1, 'expression': {interpolated: !0, parameters: ['zoom']}, 'transition': !0}, 'star-intensity': {'type': 'number', 'property-type': 'data-constant', 'default': ['interpolate', ['linear'], ['zoom'], 5, 0.35, 6, 0], 'minimum': 0, 'maximum': 1, 'expression': {interpolated: !0, parameters: ['zoom']}, 'transition': !0}}, 'light': {anchor: {'type': 'enum', 'default': 'viewport', 'values': {map: {}, viewport: {}}, 'property-type': 'data-constant', 'transition': !1, 'expression': {interpolated: !1, parameters: ['zoom']}}, position: {'type': 'array', 'default': [1.15, 210, 30], 'length': 3, 'value': 'number', 'property-type': 'data-constant', 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}}, color: {'type': 'color', 'property-type': 'data-constant', 'default': '#ffffff', 'expression': {interpolated: !0, parameters: ['zoom']}, 'transition': !0}, intensity: {'type': 'number', 'property-type': 'data-constant', 'default': 0.5, 'minimum': 0, 'maximum': 1, 'expression': {interpolated: !0, parameters: ['zoom']}, 'transition': !0}}, 'projection': {name: {type: 'enum', values: {albers: {}, equalEarth: {}, equirectangular: {}, lambertConformalConic: {}, mercator: {}, naturalEarth: {}, winkelTripel: {}, globe: {}}, default: 'mercator', required: !0}, center: {'type': 'array', 'length': 2, 'value': 'number', 'property-type': 'data-constant', 'minimum': [-180, -90], 'maximum': [180, 90], 'transition': !1, 'requires': [{name: ['albers', 'lambertConformalConic']}]}, parallels: {'type': 'array', 'length': 2, 'value': 'number', 'property-type': 'data-constant', 'minimum': [-90, -90], 'maximum': [90, 90], 'transition': !1, 'requires': [{name: ['albers', 'lambertConformalConic']}]}}, 'terrain': {source: {type: 'string', required: !0}, exaggeration: {'type': 'number', 'property-type': 'data-constant', 'default': 1, 'minimum': 0, 'maximum': 1e3, 'expression': {interpolated: !0, parameters: ['zoom']}, 'transition': !0, 'requires': ['source']}}, 'paint': ['paint_fill', 'paint_line', 'paint_circle', 'paint_heatmap', 'paint_fill-extrusion', 'paint_symbol', 'paint_raster', 'paint_hillshade', 'paint_background', 'paint_sky'], 'paint_fill': {'fill-antialias': {'type': 'boolean', 'default': !0, 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'fill-opacity': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'fill-color': {'type': 'color', 'default': '#000000', 'transition': !0, 'requires': [{'!': 'fill-pattern'}], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'fill-outline-color': {'type': 'color', 'transition': !0, 'requires': [{'!': 'fill-pattern'}, {'fill-antialias': !0}], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'fill-translate': {'type': 'array', 'value': 'number', 'length': 2, 'default': [0, 0], 'transition': !0, 'units': 'pixels', 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'fill-translate-anchor': {'type': 'enum', 'values': {map: {}, viewport: {}}, 'default': 'map', 'requires': ['fill-translate'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'fill-pattern': {'type': 'resolvedImage', 'transition': !0, 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'cross-faded-data-driven'}}, 'paint_fill-extrusion': {'fill-extrusion-opacity': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'fill-extrusion-color': {'type': 'color', 'default': '#000000', 'transition': !0, 'requires': [{'!': 'fill-extrusion-pattern'}], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'fill-extrusion-translate': {'type': 'array', 'value': 'number', 'length': 2, 'default': [0, 0], 'transition': !0, 'units': 'pixels', 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'fill-extrusion-translate-anchor': {'type': 'enum', 'values': {map: {}, viewport: {}}, 'default': 'map', 'requires': ['fill-extrusion-translate'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'fill-extrusion-pattern': {'type': 'resolvedImage', 'transition': !0, 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'cross-faded-data-driven'}, 'fill-extrusion-height': {'type': 'number', 'default': 0, 'minimum': 0, 'units': 'meters', 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'fill-extrusion-base': {'type': 'number', 'default': 0, 'minimum': 0, 'units': 'meters', 'transition': !0, 'requires': ['fill-extrusion-height'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'fill-extrusion-vertical-gradient': {'type': 'boolean', 'default': !0, 'transition': !1, 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'fill-extrusion-ambient-occlusion-intensity': {'property-type': 'data-constant', 'type': 'number', 'private': !0, 'default': 0, 'minimum': 0, 'maximum': 1, 'expression': {interpolated: !0, parameters: ['zoom']}, 'transition': !0}, 'fill-extrusion-ambient-occlusion-radius': {'property-type': 'data-constant', 'type': 'number', 'private': !0, 'default': 3, 'minimum': 0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'transition': !0}}, 'paint_line': {'line-opacity': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'line-color': {'type': 'color', 'default': '#000000', 'transition': !0, 'requires': [{'!': 'line-pattern'}], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'line-translate': {'type': 'array', 'value': 'number', 'length': 2, 'default': [0, 0], 'transition': !0, 'units': 'pixels', 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'line-translate-anchor': {'type': 'enum', 'values': {map: {}, viewport: {}}, 'default': 'map', 'requires': ['line-translate'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'line-width': {'type': 'number', 'default': 1, 'minimum': 0, 'transition': !0, 'units': 'pixels', 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'line-gap-width': {'type': 'number', 'default': 0, 'minimum': 0, 'transition': !0, 'units': 'pixels', 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'line-offset': {'type': 'number', 'default': 0, 'transition': !0, 'units': 'pixels', 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'line-blur': {'type': 'number', 'default': 0, 'minimum': 0, 'transition': !0, 'units': 'pixels', 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'line-dasharray': {'type': 'array', 'value': 'number', 'minimum': 0, 'transition': !0, 'units': 'line widths', 'requires': [{'!': 'line-pattern'}], 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'cross-faded-data-driven'}, 'line-pattern': {'type': 'resolvedImage', 'transition': !0, 'expression': {interpolated: !1, parameters: ['zoom', 'feature']}, 'property-type': 'cross-faded-data-driven'}, 'line-gradient': {'type': 'color', 'transition': !1, 'requires': [{'!': 'line-pattern'}, {source: 'geojson', has: {lineMetrics: !0}}], 'expression': {interpolated: !0, parameters: ['line-progress']}, 'property-type': 'color-ramp'}, 'line-trim-offset': {'type': 'array', 'value': 'number', 'length': 2, 'default': [0, 0], 'minimum': [0, 0], 'maximum': [1, 1], 'transition': !1, 'requires': [{source: 'geojson', has: {lineMetrics: !0}}], 'property-type': 'constant'}}, 'paint_circle': {'circle-radius': {'type': 'number', 'default': 5, 'minimum': 0, 'transition': !0, 'units': 'pixels', 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'circle-color': {'type': 'color', 'default': '#000000', 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'circle-blur': {'type': 'number', 'default': 0, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'circle-opacity': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'circle-translate': {'type': 'array', 'value': 'number', 'length': 2, 'default': [0, 0], 'transition': !0, 'units': 'pixels', 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'circle-translate-anchor': {'type': 'enum', 'values': {map: {}, viewport: {}}, 'default': 'map', 'requires': ['circle-translate'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'circle-pitch-scale': {'type': 'enum', 'values': {map: {}, viewport: {}}, 'default': 'map', 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'circle-pitch-alignment': {'type': 'enum', 'values': {map: {}, viewport: {}}, 'default': 'viewport', 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'circle-stroke-width': {'type': 'number', 'default': 0, 'minimum': 0, 'transition': !0, 'units': 'pixels', 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'circle-stroke-color': {'type': 'color', 'default': '#000000', 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'circle-stroke-opacity': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}}, 'paint_heatmap': {'heatmap-radius': {'type': 'number', 'default': 30, 'minimum': 1, 'transition': !0, 'units': 'pixels', 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'heatmap-weight': {'type': 'number', 'default': 1, 'minimum': 0, 'transition': !1, 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'heatmap-intensity': {'type': 'number', 'default': 1, 'minimum': 0, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'heatmap-color': {'type': 'color', 'default': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0, 0, 255, 0)', 0.1, 'royalblue', 0.3, 'cyan', 0.5, 'lime', 0.7, 'yellow', 1, 'red'], 'transition': !1, 'expression': {interpolated: !0, parameters: ['heatmap-density']}, 'property-type': 'color-ramp'}, 'heatmap-opacity': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}}, 'paint_symbol': {'icon-opacity': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'requires': ['icon-image'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'icon-color': {'type': 'color', 'default': '#000000', 'transition': !0, 'requires': ['icon-image'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'icon-halo-color': {'type': 'color', 'default': 'rgba(0, 0, 0, 0)', 'transition': !0, 'requires': ['icon-image'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'icon-halo-width': {'type': 'number', 'default': 0, 'minimum': 0, 'transition': !0, 'units': 'pixels', 'requires': ['icon-image'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'icon-halo-blur': {'type': 'number', 'default': 0, 'minimum': 0, 'transition': !0, 'units': 'pixels', 'requires': ['icon-image'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'icon-translate': {'type': 'array', 'value': 'number', 'length': 2, 'default': [0, 0], 'transition': !0, 'units': 'pixels', 'requires': ['icon-image'], 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'icon-translate-anchor': {'type': 'enum', 'values': {map: {}, viewport: {}}, 'default': 'map', 'requires': ['icon-image', 'icon-translate'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-opacity': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'requires': ['text-field'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'text-color': {'type': 'color', 'default': '#000000', 'transition': !0, 'overridable': !0, 'requires': ['text-field'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'text-halo-color': {'type': 'color', 'default': 'rgba(0, 0, 0, 0)', 'transition': !0, 'requires': ['text-field'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'text-halo-width': {'type': 'number', 'default': 0, 'minimum': 0, 'transition': !0, 'units': 'pixels', 'requires': ['text-field'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'text-halo-blur': {'type': 'number', 'default': 0, 'minimum': 0, 'transition': !0, 'units': 'pixels', 'requires': ['text-field'], 'expression': {interpolated: !0, parameters: ['zoom', 'feature', 'feature-state']}, 'property-type': 'data-driven'}, 'text-translate': {'type': 'array', 'value': 'number', 'length': 2, 'default': [0, 0], 'transition': !0, 'units': 'pixels', 'requires': ['text-field'], 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'text-translate-anchor': {'type': 'enum', 'values': {map: {}, viewport: {}}, 'default': 'map', 'requires': ['text-field', 'text-translate'], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}}, 'paint_raster': {'raster-opacity': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'raster-hue-rotate': {'type': 'number', 'default': 0, 'period': 360, 'transition': !0, 'units': 'degrees', 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'raster-brightness-min': {'type': 'number', 'default': 0, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'raster-brightness-max': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'raster-saturation': {'type': 'number', 'default': 0, 'minimum': -1, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'raster-contrast': {'type': 'number', 'default': 0, 'minimum': -1, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'raster-resampling': {'type': 'enum', 'values': {linear: {}, nearest: {}}, 'default': 'linear', 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'raster-fade-duration': {'type': 'number', 'default': 300, 'minimum': 0, 'transition': !1, 'units': 'milliseconds', 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}}, 'paint_hillshade': {'hillshade-illumination-direction': {'type': 'number', 'default': 335, 'minimum': 0, 'maximum': 359, 'transition': !1, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'hillshade-illumination-anchor': {'type': 'enum', 'values': {map: {}, viewport: {}}, 'default': 'viewport', 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'hillshade-exaggeration': {'type': 'number', 'default': 0.5, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'hillshade-shadow-color': {'type': 'color', 'default': '#000000', 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'hillshade-highlight-color': {'type': 'color', 'default': '#FFFFFF', 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'hillshade-accent-color': {'type': 'color', 'default': '#000000', 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}}, 'paint_background': {'background-color': {'type': 'color', 'default': '#000000', 'transition': !0, 'requires': [{'!': 'background-pattern'}], 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'background-pattern': {'type': 'resolvedImage', 'transition': !0, 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'cross-faded'}, 'background-opacity': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}}, 'paint_sky': {'sky-type': {'type': 'enum', 'values': {gradient: {}, atmosphere: {}}, 'default': 'atmosphere', 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'sky-atmosphere-sun': {'type': 'array', 'value': 'number', 'length': 2, 'units': 'degrees', 'minimum': [0, 0], 'maximum': [360, 180], 'transition': !1, 'requires': [{'sky-type': 'atmosphere'}], 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'sky-atmosphere-sun-intensity': {'type': 'number', 'requires': [{'sky-type': 'atmosphere'}], 'default': 10, 'minimum': 0, 'maximum': 100, 'transition': !1, 'property-type': 'data-constant'}, 'sky-gradient-center': {'type': 'array', 'requires': [{'sky-type': 'gradient'}], 'value': 'number', 'default': [0, 0], 'length': 2, 'units': 'degrees', 'minimum': [0, 0], 'maximum': [360, 180], 'transition': !1, 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'sky-gradient-radius': {'type': 'number', 'requires': [{'sky-type': 'gradient'}], 'default': 90, 'minimum': 0, 'maximum': 180, 'transition': !1, 'expression': {interpolated: !1, parameters: ['zoom']}, 'property-type': 'data-constant'}, 'sky-gradient': {'type': 'color', 'default': ['interpolate', ['linear'], ['sky-radial-progress'], 0.8, '#87ceeb', 1, 'white'], 'transition': !1, 'requires': [{'sky-type': 'gradient'}], 'expression': {interpolated: !0, parameters: ['sky-radial-progress']}, 'property-type': 'color-ramp'}, 'sky-atmosphere-halo-color': {'type': 'color', 'default': 'white', 'transition': !1, 'requires': [{'sky-type': 'atmosphere'}], 'property-type': 'data-constant'}, 'sky-atmosphere-color': {'type': 'color', 'default': 'white', 'transition': !1, 'requires': [{'sky-type': 'atmosphere'}], 'property-type': 'data-constant'}, 'sky-opacity': {'type': 'number', 'default': 1, 'minimum': 0, 'maximum': 1, 'transition': !0, 'expression': {interpolated: !0, parameters: ['zoom']}, 'property-type': 'data-constant'}}, 'transition': {duration: {type: 'number', default: 300, minimum: 0, units: 'milliseconds'}, delay: {type: 'number', default: 0, minimum: 0, units: 'milliseconds'}}, 'property-type': {'data-driven': {type: 'property-type'}, 'cross-faded': {type: 'property-type'}, 'cross-faded-data-driven': {type: 'property-type'}, 'color-ramp': {type: 'property-type'}, 'data-constant': {type: 'property-type'}, 'constant': {type: 'property-type'}}, 'promoteId': {'*': {type: 'string'}}}; function mp(t) {
    if (!0 === t || !1 === t) {
      return !0;
    } if (!Array.isArray(t) || t.length === 0) {
      return !1;
    } switch (t[0]) {
      case 'has':return t.length >= 2 && t[1] !== '$id' && t[1] !== '$type'; case 'in':return t.length >= 3 && (typeof t[1] !== 'string' || Array.isArray(t[2])); case '!in':case '!has':case 'none':return !1; case '==':case '!=':case '>':case '>=':case '<':case '<=':return t.length !== 3 || Array.isArray(t[1]) || Array.isArray(t[2]); case 'any':case 'all':for (let e = 0, i = t.slice(1); e < i.length; e += 1) {
        let n = i[e]; if (!mp(n) && typeof n !== 'boolean') {
          return !1;
        }
      } return !0; default:return !0;
    }
  } function yp(t, e) {
    if (void 0 === e && (e = 'fill'), t == null) {
      return {filter() {
        return !0;
      }, needGeometry: !1, needFeature: !1};
    } mp(t) || (t = Sp(t)); let i = t; let n = !0; try {
      n = function (t) {
        if (!xp(t)) {
          return t;
        } let e = gp(t); return vp(e), e = _p(e);
      }(i);
    } catch (t) {
      console.warn('Failed to extract static filter. Filter will continue working, but at higher memory usage and slower framerate.\nThis is most likely a bug, please report this via https://github.com/mapbox/mapbox-gl-js/issues/new?assignees=&labels=&template=Bug_report.md\nand paste the contents of this message in the report.\nThank you!\nFilter Expression:\n' + JSON.stringify(i, null, 2) + '\n        ');
    } let r = fp['filter_' + e]; let s = hp(n, r); let o = null; if (s.result === 'error') {
      throw new Error(s.value.map((function (t) {
        return t.key + ': ' + t.message;
      })).join(', '));
    } o = function (t, e, i) {
      return s.value.evaluate(t, e, {}, i);
    }; let a = null; let l = null; if (n !== i) {
      let h = hp(i, r); if (h.result === 'error') {
        throw new Error(h.value.map((function (t) {
          return t.key + ': ' + t.message;
        })).join(', '));
      } a = function (t, e, i, n, r) {
        return h.value.evaluate(t, e, {}, i, void 0, void 0, n, r);
      }, l = !Vc(h.value.expression);
    } return {filter: o, dynamicFilter: a || void 0, needGeometry: Cp(n), needFeature: !!l};
  } function _p(t) {
    if (!Array.isArray(t)) {
      return t;
    } let e = function (t) {
      if (bp.has(t[0])) {
        for (let e = 1; e < t.length; e++) {
          if (xp(t[e])) {
            return !0;
          }
        }
      } return t;
    }(t); return !0 === e ? e : e.map((function (t) {
      return _p(t);
    }));
  } function vp(t) {
    let e = !1; let i = []; if (t[0] === 'case') {
      for (let n = 1; n < t.length - 1; n += 2) {
        e = e || xp(t[n]), i.push(t[n + 1]);
      }i.push(t[t.length - 1]);
    } else if (t[0] === 'match') {
      e = e || xp(t[1]); for (let r = 2; r < t.length - 1; r += 2) {
        i.push(t[r + 1]);
      }i.push(t[t.length - 1]);
    } else if (t[0] === 'step') {
      e = e || xp(t[1]); for (let s = 1; s < t.length - 1; s += 2) {
        i.push(t[s + 1]);
      }
    }e && (t.length = 0, t.push.apply(t, ['any'].concat(i))); for (let o = 1; o < t.length; o++) {
      vp(t[o]);
    }
  } function xp(t) {
    if (!Array.isArray(t)) {
      return !1;
    } if ((e = t[0]) === 'pitch' || e === 'distance-from-center') {
      return !0;
    } for (var e, i = 1; i < t.length; i++) {
      if (xp(t[i])) {
        return !0;
      }
    } return !1;
  } var bp = new Set(['in', '==', '!=', '>', '>=', '<', '<=', 'to-boolean']); function wp(t, e) {
    return t < e ? -1 : t > e ? 1 : 0;
  } function Cp(t) {
    if (!Array.isArray(t)) {
      return !1;
    } if (t[0] === 'within') {
      return !0;
    } for (let e = 1; e < t.length; e++) {
      if (Cp(t[e])) {
        return !0;
      }
    } return !1;
  } function Sp(t) {
    if (!t) {
      return !0;
    } let e; let i = t[0]; return t.length <= 1 ? i !== 'any' : i === '==' ? Tp(t[1], t[2], '==') : i === '!=' ? Ip(Tp(t[1], t[2], '==')) : i === '<' || i === '>' || i === '<=' || i === '>=' ? Tp(t[1], t[2], i) : i === 'any' ? (e = t.slice(1), ['any'].concat(e.map(Sp))) : i === 'all' ? ['all'].concat(t.slice(1).map(Sp)) : i === 'none' ? ['all'].concat(t.slice(1).map(Sp).map(Ip)) : i === 'in' ? Ep(t[1], t.slice(2)) : i === '!in' ? Ip(Ep(t[1], t.slice(2))) : i === 'has' ? Rp(t[1]) : i === '!has' ? Ip(Rp(t[1])) : i !== 'within' || t;
  } function Tp(t, e, i) {
    switch (t) {
      case '$type':return ['filter-type-' + i, e]; case '$id':return ['filter-id-' + i, e]; default:return ['filter-' + i, t, e];
    }
  } function Ep(t, e) {
    if (e.length === 0) {
      return !1;
    } switch (t) {
      case '$type':return ['filter-type-in', ['literal', e]]; case '$id':return ['filter-id-in', ['literal', e]]; default:return e.length > 200 && !e.some((function (t) {
        return typeof t !== typeof e[0];
      })) ? ['filter-in-large', t, ['literal', e.sort(wp)]] : ['filter-in-small', t, ['literal', e]];
    }
  } function Rp(t) {
    switch (t) {
      case '$type':return !0; case '$id':return ['filter-has-id']; default:return ['filter-has', t];
    }
  } function Ip(t) {
    return ['!', t];
  } let Mp = ['type', 'source', 'source-layer', 'minzoom', 'maxzoom', 'filter', 'layout']; function kp(t, e) {
    let i = {}; for (let n in t) {
      n !== 'ref' && (i[n] = t[n]);
    } return Mp.forEach((function (t) {
      t in e && (i[t] = e[t]);
    })), i;
  } let Fp = {'thin': 100, 'hairline': 100, 'ultra-light': 100, 'extra-light': 100, 'light': 200, 'book': 300, 'regular': 400, 'normal': 400, 'plain': 400, 'roman': 400, 'standard': 400, 'medium': 500, 'semi-bold': 600, 'demi-bold': 600, 'bold': 700, 'heavy': 800, 'black': 800, 'extra-bold': 800, 'ultra-black': 900, 'extra-black': 900, 'ultra-bold': 900, 'heavy-black': 900, 'fat': 900, 'poster': 900}; let Pp = ' '; let Lp = /(italic|oblique)$/i; let Ap = {}; let zp = function (t, e, i) {
    let n = Ap[t]; if (!n) {
      Array.isArray(t) || (t = [t]); for (var r = 400, s = 'normal', o = [], a = 0, l = t.length; a < l; ++a) {
        let h = t[a].split(' '); let u = h[h.length - 1].toLowerCase(); for (let c in u == 'normal' || u == 'italic' || u == 'oblique' ? (s = u, h.pop(), u = h[h.length - 1].toLowerCase()) : Lp.test(u) && (u = u.replace(Lp, ''), s = h[h.length - 1].replace(u, '')), Fp) {
          let d = h.length > 1 ? h[h.length - 2].toLowerCase() : ''; if (u == c || u == c.replace('-', '') || d + '-' + u == c) {
            r = Fp[c], h.pop(), d && c.startsWith(d) && h.pop(); break;
          }
        } typeof u === 'number' && (r = u); let p = h.join(Pp).replace('Klokantech Noto Sans', 'Noto Sans'); p.indexOf(Pp) !== -1 && (p = '"' + p + '"'), o.push(p);
      }n = Ap[t] = [s, r, o];
    } return n[0] + Pp + n[1] + Pp + e + 'px' + (i ? '/' + i : '') + Pp + n[2];
  }; let Op = 'https://api.mapbox.com'; function Dp(t) {
    let e = 'mapbox://'; return t.indexOf(e) !== 0 ? '' : t.slice(e.length);
  } function jp(t, e) {
    let i = Dp(t); if (!i) {
      return decodeURI(new URL(t, location.href).href);
    } let n = 'styles/'; if (i.indexOf(n) !== 0) {
      throw new Error('unexpected style url: ' + t);
    } let r = i.slice(n.length); return Op + '/styles/v1/' + r + '?&access_token=' + e;
  } function Gp(t, e, i, n) {
    let r = new URL(t, n); let s = Dp(t); return s ? s === 'mapbox.satellite' ? 'https://api.mapbox.com/v4/' + s + '/{z}/{x}/{y}' + (window.devicePixelRatio >= 1.5 ? '@2x' : '') + '.webp?access_token=' + e : 'https://{a-d}.tiles.mapbox.com/v4/' + s + '/{z}/{x}/{y}.vector.pbf?access_token=' + e : e ? (r.searchParams.set(i, e), decodeURI(r.href)) : decodeURI(r.href);
  } function Np(t) {
    return t * Math.PI / 180;
  } let Wp = function () {
    for (var t = [], e = 78271.51696402048; t.length <= 24; e /= 2) {
      t.push(e);
    } return t;
  }(); function Xp(t, e) {
    if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope && typeof OffscreenCanvas !== 'undefined') {
      return new OffscreenCanvas(t, e);
    } let i = document.createElement('canvas'); return i.width = t, i.height = e, i;
  } function qp(t, e) {
    for (var i = 0, n = e.length; i < n; ++i) {
      if (e[i] < t && i + 1 < n) {
        let r = e[i] / e[i + 1]; return i + Math.log(e[i] / t) / Math.log(r);
      }
    } return n - 1;
  } let Bp = {}; function Vp(t, e, i, n) {
    if (void 0 === i && (i = {}), e in Bp) {
      return Bp[e];
    } let r = i.transformRequest && i.transformRequest(e, t) || new Request(e); r.headers.get('Accept') || r.headers.set('Accept', 'application/json'), n && (n.request = r); let s = fetch(r).then((function (t) {
      return delete Bp[e], t.ok ? t.json() : Promise.reject(new Error('Error fetching source ' + e));
    })).catch((function (t) {
      return delete Bp[e], Promise.reject(new Error('Error fetching source ' + e));
    })); return Bp[e] = s, s;
  } function Yp(t, e) {
    if (typeof t !== 'string') {
      return Promise.resolve(t);
    } if (!t.trim().startsWith('{')) {
      return Vp('Style', t = jp(t, e.accessToken), e);
    } try {
      let i = JSON.parse(t); return Promise.resolve(i);
    } catch (t) {
      return Promise.reject(t);
    }
  } function Kp(t, e) {
    if (e.transformRequest) {
      let i = e.transformRequest(t, 'Tiles'); if (i instanceof Request) {
        return decodeURI(i.url);
      }
    } return t;
  } let Zp = {}; function Up(t, e, i) {
    void 0 === i && (i = {}); let n = [e, JSON.stringify(t)].toString(); let r = Zp[n]; if (!r || i.transformRequest) {
      let s = t.url; if (s && !t.tiles) {
        let o = Gp(s, i.accessToken, i.accessTokenParam || 'access_token', e || location.href); if (s.startsWith('mapbox://')) {
          r = Promise.resolve(Object.assign({}, t, {url: void 0, tiles: jo(o)}));
        } else {
          let a = {}; r = Vp('Source', o, i, a).then((function (t) {
            return t.tiles = t.tiles.map((function (t) {
              return Kp(Gp(t, i.accessToken, i.accessTokenParam || 'access_token', a.request.url), i);
            })), Promise.resolve(t);
          }));
        }
      } else {
        t = Object.assign({}, t, {tiles: t.tiles.map((function (t) {
          return Kp(Gp(t, i.accessToken, i.accessTokenParam || 'access_token', e || location.href), i);
        }))}), r = Promise.resolve(Object.assign({}, t));
      }Zp[n] = r;
    } return r;
  } let Hp; let Jp = Array(256).join(' '); function Qp(t, e) {
    if (e >= 0.05) {
      for (var i = '', n = t.split('\n'), r = Jp.slice(0, Math.round(e / 0.1)), s = 0, o = n.length; s < o; ++s) {
        s > 0 && (i += '\n'), i += n[s].split('').join(r);
      } return i;
    } return t;
  } function $p() {
    return Hp || (Hp = Xp(1, 1).getContext('2d')), Hp;
  } function tg(t, e) {
    return $p().measureText(t).width + (t.length - 1) * e;
  } let eg = {}; function ig(t, e, i, n) {
    if (t.indexOf('\n') !== -1) {
      for (var r = t.split('\n'), s = [], o = 0, a = r.length; o < a; ++o) {
        s.push(ig(r[o], e, i, n));
      } return s.join('\n');
    } let l = i + ',' + e + ',' + t + ',' + n; let h = eg[l]; if (!h) {
      let u = t.split(' '); if (u.length > 1) {
        let c = $p(); c.font = e; for (var d = c.measureText('M').width * i, p = '', g = [], f = 0, m = u.length; f < m; ++f) {
          let y = u[f]; let _ = p + (p ? ' ' : '') + y; tg(_, n) <= d ? p = _ : (p && g.push(p), p = y);
        }p && g.push(p); for (let v = 0, x = g.length; v < x && x > 1; ++v) {
          let b = g[v]; if (tg(b, n) < 0.35 * d) {
            let w = v > 0 ? tg(g[v - 1], n) : 1 / 0; let C = v < x - 1 ? tg(g[v + 1], n) : 1 / 0; g.splice(v, 1), x -= 1, w < C ? (g[v - 1] += ' ' + b, v -= 1) : g[v] = b + ' ' + g[v];
          }
        } for (let S = 0, T = g.length - 1; S < T; ++S) {
          let E = g[S]; let R = g[S + 1]; if (tg(E, n) > 0.7 * d && tg(R, n) < 0.6 * d) {
            let I = E.split(' '); let M = I.pop(); tg(M, n) < 0.2 * d && (g[S] = I.join(' '), g[S + 1] = M + ' ' + R), T -= 1;
          }
        }h = g.join('\n');
      } else {
        h = t;
      }h = Qp(h, n), eg[l] = h;
    } return h;
  } let ng; let rg = /font-family: ?([^;]*);/; let sg = /("|')/g; function og(t) {
    if (!ng) {
      ng = {}; for (let e = document.styleSheets, i = 0, n = e.length; i < n; ++i) {
        let r = e[i]; try {
          let s = r.rules || r.cssRules; if (s) {
            for (let o = 0, a = s.length; o < a; ++o) {
              let l = s[o]; if (l.type == 5) {
                let h = l.cssText.match(rg); ng[h[1].replace(sg, '')] = !0;
              }
            }
          }
        } catch (t) {}
      }
    } return t in ng;
  } let ag = {}; function lg(t) {
    let e = t.toString(); if (e in ag) {
      return ag[e];
    } for (var i = [], n = 0, r = t.length; n < r; ++n) {
      t[n] = t[n].replace('Arial Unicode MS', 'Arial'); let s = t[n]; let o = zp(s, 1); Ci(o); let a = o.split(' '); i.push([a.slice(3).join(' ').replace(/"/g, ''), a[1], a[0]]);
    } for (let l = 0, h = i.length; l < h; ++l) {
      let u = i[l]; let c = u[0]; if (!og(c) && vi.get(u[2] + '\n' + u[1] + ' \n' + c) !== 100) {
        let d = 'https://fonts.googleapis.com/css?family=' + c.replace(/ /g, '+') + ':' + u[1] + u[2]; if (!document.querySelector('link[href="' + d + '"]')) {
          let p = document.createElement('link'); p.href = d, p.rel = 'stylesheet', document.head.appendChild(p);
        }
      }
    } return ag[e] = t, t;
  } let hg; let ug; let cg = {Point: 1, MultiPoint: 1, LineString: 2, MultiLineString: 2, Polygon: 3, MultiPolygon: 3}; let dg = {'center': [0.5, 0.5], 'left': [0, 0.5], 'right': [1, 0.5], 'top': [0.5, 0], 'bottom': [0.5, 1], 'top-left': [0, 0], 'top-right': [1, 0], 'bottom-left': [0, 1], 'bottom-right': [1, 1]}; let pg = {}; let gg = {zoom: 0}; function fg(t, e, i, n, r, s, o) {
    let a = t.id; s || (s = {}, console.warn('No functionCache provided to getValue()')), s[a] || (s[a] = {}); let l; let h = s[a]; if (!h[i]) {
      let u = (t[e] || pg)[i]; let c = fp[e + '_' + t.type][i]; void 0 === u && (u = c.default); let d = (l = u, Array.isArray(l) && l.length > 0 && typeof l[0] === 'string' && l[0] in rp); if (!d && ap(u) && (u = bu(u, c), d = !0), d) {
        let p = function (t, e) {
          let i = dp(t, e); if (i.result === 'error') {
            throw new Error(i.value.map((function (t) {
              return t.key + ': ' + t.message;
            })).join(', '));
          } return i.value;
        }(u, c); h[i] = p.evaluate.bind(p);
      } else {
        c.type == 'color' && (u = vu.parse(u)), h[i] = function () {
          return u;
        };
      }
    } return gg.zoom = n, h[i](gg, r, o);
  } function mg(t, e, i, n) {
    return fg(t, 'layout', 'icon-allow-overlap', e, i, n) ? fg(t, 'layout', 'icon-ignore-placement', e, i, n) ? 'none' : 'obstacle' : 'declutter';
  } function yg(t, e, i, n, r) {
    return r || console.warn('No filterCache provided to evaluateFilter()'), t in r || (r[t] = yp(e).filter), gg.zoom = n, r[t](gg, i);
  } function _g(t, e) {
    if (t) {
      if (t.a === 0 || e === 0) {
        return;
      } let i = t.a; return e = void 0 === e ? 1 : e, i === 0 ? 'transparent' : 'rgba(' + Math.round(255 * t.r / i) + ',' + Math.round(255 * t.g / i) + ',' + Math.round(255 * t.b / i) + ',' + i * e + ')';
    } return t;
  } let vg = /\{[^{}}]*\}/g; function xg(t, e) {
    return t.replace(vg, (function (t) {
      return e[t.slice(1, -1)] || '';
    }));
  } function bg(t, e, i, n, r, s, o, a) {
    if (void 0 === n && (n = Wp), void 0 === r && (r = void 0), void 0 === s && (s = void 0), void 0 === o && (o = void 0), void 0 === a && (a = void 0), typeof e === 'string' && (e = JSON.parse(e)), e.version != 8) {
      throw new Error('glStyle version 8 required.');
    } let l; let h; if (s) {
      if (typeof Image !== 'undefined') {
        let u = new Image(); u.crossOrigin = 'anonymous', u.onload = function () {
          l = u, h = [u.width, u.height], t.changed(), u.onload = null;
        }, u.src = s;
      } else if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        let c = self; c.postMessage({action: 'loadImage', src: s}), c.addEventListener('message', (function (t) {
          t.data.action === 'imageLoaded' && t.data.src === s && (l = t.data.image, h = [l.width, l.height]);
        }));
      }
    } for (var d, p = function (t) {
        t = t.slice(); for (var e = Object.create(null), i = 0; i < t.length; i++) {
          e[t[i].id] = t[i];
        } for (let n = 0; n < t.length; n++) {
          'ref' in t[n] && (t[n] = kp(t[n], e[t[n].ref]));
        } return t;
      }(e.layers), g = {}, f = [], m = {}, y = {}, _ = {}, v = {}, x = 0, b = p.length; x < b; ++x) {
      let w = p[x]; let C = w.id; if (typeof i === 'string' && w.source == i || i.indexOf(C) !== -1) {
        let S = w['source-layer']; if (d) {
          if (w.source !== d) {
            throw new Error('Layer "' + C + '" does not use source "' + d);
          }
        } else {
          d = w.source; let T = e.sources[d]; if (!T) {
            throw new Error('Source "' + d + '" is not defined');
          } let E = T.type; if (E !== 'vector' && E !== 'geojson') {
            throw new Error('Source "' + d + '" is not of type "vector" or "geojson", but "' + E + '"');
          }
        } let R = g[S]; R || (R = [], g[S] = R), R.push({layer: w, index: x}), f.push(C);
      }
    } let I = new So(); let M = new Us(); let k = []; let F = function (e, i) {
      let s = e.getProperties(); let u = g[s.layer]; if (u) {
        let c = n.indexOf(i); c == -1 && (c = qp(i, n)); for (var d = cg[e.getGeometry().getType()], p = {properties: s, type: d}, f = t.get('mapbox-featurestate')[e.getId()], x = -1, b = 0, w = u.length; b < w; ++b) {
          let C = u[b]; let S = C.layer; let T = S.id; let E = S.layout || pg; let R = S.paint || pg; if (!(E.visibility === 'none' || 'minzoom' in S && c < S.minzoom || 'maxzoom' in S && c >= S.maxzoom)) {
            let F = S.filter; if (!F || yg(T, F, p, c, v)) {
              let P = void 0; let L = void 0; let A = void 0; let z = void 0; let O = void 0; let D = void 0; let j = C.index; if (d == 3 && (S.type == 'fill' || S.type == 'fill-extrusion')) {
                if (L = fg(S, 'paint', S.type + '-opacity', c, p, _, f), S.type + '-pattern' in R) {
                  let G = fg(S, 'paint', S.type + '-pattern', c, p, _, f); if (G) {
                    let N = typeof G === 'string' ? xg(G, s) : G.toString(); if (l && r && r[N]) {
                      ++x, (D = k[x]) && D.getFill() && !D.getStroke() && !D.getText() || (D = new Mo({fill: new Us()}), k[x] = D), A = D.getFill(), D.setZIndex(j); let W = N + '.' + L; let X = y[W]; if (!X) {
                        let q = r[N]; let B = Xp(q.width, q.height); let V = B.getContext('2d'); V.globalAlpha = L, V.drawImage(l, q.x, q.y, q.width, q.height, 0, 0, q.width, q.height), X = V.createPattern(B, 'repeat'), y[W] = X;
                      }A.setColor(X);
                    }
                  }
                } else {
                  P = _g(fg(S, 'paint', S.type + '-color', c, p, _, f), L), S.type + '-outline-color' in R && (O = _g(fg(S, 'paint', S.type + '-outline-color', c, p, _, f), L)), O || (O = P), (P || O) && (++x, (!(D = k[x]) || P && !D.getFill() || !P && D.getFill() || O && !D.getStroke() || !O && D.getStroke() || D.getText()) && (D = new Mo({fill: P ? new Us() : void 0, stroke: O ? new So() : void 0}), k[x] = D), P && (A = D.getFill()).setColor(P), O && ((z = D.getStroke()).setColor(O), z.setWidth(0.5)), D.setZIndex(j));
                }
              } if (d != 1 && S.type == 'line') {
                P = !('line-pattern' in R) && 'line-color' in R ? _g(fg(S, 'paint', 'line-color', c, p, _, f), fg(S, 'paint', 'line-opacity', c, p, _, f)) : void 0; var Y = fg(S, 'paint', 'line-width', c, p, _, f); P && Y > 0 && (++x, (D = k[x]) && D.getStroke() && !D.getFill() && !D.getText() || (D = new Mo({stroke: new So()}), k[x] = D), (z = D.getStroke()).setLineCap(fg(S, 'layout', 'line-cap', c, p, _, f)), z.setLineJoin(fg(S, 'layout', 'line-join', c, p, _, f)), z.setMiterLimit(fg(S, 'layout', 'line-miter-limit', c, p, _, f)), z.setColor(P), z.setWidth(Y), z.setLineDash(R['line-dasharray'] ? fg(S, 'paint', 'line-dasharray', c, p, _, f).map((function (t) {
                  return t * Y;
                })) : null), D.setZIndex(j));
              } let K = !1; let Z = null; let U = 0; let H = void 0; let J = void 0; let Q = void 0; if ((d == 1 || d == 2) && 'icon-image' in E) {
                let $ = fg(S, 'layout', 'icon-image', c, p, _, f); if ($) {
                  H = typeof $ === 'string' ? xg($, s) : $.toString(); let tt = void 0; let et = a ? a(t, H) : void 0; if (l && r && r[H] || et) {
                    let it = fg(S, 'layout', 'icon-rotation-alignment', c, p, _, f); if (d == 2) {
                      let nt = e.getGeometry(); if (nt.getFlatMidpoint || nt.getFlatMidpoints) {
                        let rt = nt.getExtent(); if (Math.sqrt(Math.max(Math.pow((rt[2] - rt[0]) / i, 2), Math.pow((rt[3] - rt[1]) / i, 2))) > 150) {
                          let st = nt.getType() === 'MultiLineString' ? nt.getFlatMidpoints() : nt.getFlatMidpoint(); if (ug || (ug = new wo('Point', hg = [NaN, NaN], [], {}, null)), tt = ug, hg[0] = st[0], hg[1] = st[1], fg(S, 'layout', 'symbol-placement', c, p, _, f) === 'line' && it === 'map') {
                            for (let ot = nt.getStride(), at = nt.getFlatCoordinates(), lt = 0, ht = at.length - ot; lt < ht; lt += ot) {
                              let ut = at[lt]; let ct = at[lt + 1]; let dt = at[lt + ot]; let pt = at[lt + ot + 1]; let gt = Math.min(ut, dt); let ft = Math.min(ct, pt); let mt = Math.max(ut, dt); let yt = Math.max(ct, pt); if (st[0] >= gt && st[0] <= mt && st[1] >= ft && st[1] <= yt) {
                                U = Math.atan2(ct - pt, dt - ut); break;
                              }
                            }
                          }
                        }
                      }
                    } if (d !== 2 || tt) {
                      let _t = fg(S, 'layout', 'icon-size', c, p, _, f); let vt = void 0 !== R['icon-color'] ? fg(S, 'paint', 'icon-color', c, p, _, f) : null; if (!vt || vt.a !== 0) {
                        let xt = H + '.' + _t; if (vt !== null && (xt += '.' + vt), !(J = m[xt])) {
                          let bt = mg(S, c, p, _); let wt = void 0; 'icon-offset' in E && ((wt = fg(S, 'layout', 'icon-offset', c, p, _, f))[1] *= -1); let Ct = vt ? [255 * vt.r, 255 * vt.g, 255 * vt.b, vt.a] : void 0; if (et) {
                            J = new eo(typeof et === 'string' ? {color: Ct, src: et, rotateWithView: it === 'map', displacement: wt, declutterMode: bt} : {color: Ct, img: et, imgSize: [et.width, et.height], rotateWithView: it === 'map', displacement: wt, declutterMode: bt});
                          } else {
                            let St = r[H]; J = new eo({color: Ct, img: l, imgSize: h, size: [St.width, St.height], offset: [St.x, St.y], rotateWithView: it === 'map', scale: _t / St.pixelRatio, displacement: wt, declutterMode: bt});
                          }m[xt] = J;
                        }
                      }J && (++x, (D = k[x]) && D.getImage() && !D.getFill() && !D.getStroke() || (D = new Mo(), k[x] = D), D.setGeometry(tt), J.setRotation(U + Np(fg(S, 'layout', 'icon-rotate', c, p, _, f))), J.setOpacity(fg(S, 'paint', 'icon-opacity', c, p, _, f)), J.setAnchor(dg[fg(S, 'layout', 'icon-anchor', c, p, _, f)]), D.setImage(J), Z = D.getText(), D.setText(void 0), D.setZIndex(j), K = !0, Q = !1);
                    } else {
                      Q = !0;
                    }
                  }
                }
              } if (d == 1 && S.type === 'circle') {
                ++x, (D = k[x]) && D.getImage() && !D.getFill() && !D.getStroke() || (D = new Mo(), k[x] = D); let Tt = 'circle-radius' in R ? fg(S, 'paint', 'circle-radius', c, p, _, f) : 5; let Et = _g(fg(S, 'paint', 'circle-stroke-color', c, p, _, f), fg(S, 'paint', 'circle-stroke-opacity', c, p, _, f)); let Rt = _g(fg(S, 'paint', 'circle-color', c, p, _, f), fg(S, 'paint', 'circle-opacity', c, p, _, f)); let It = fg(S, 'paint', 'circle-stroke-width', c, p, _, f); let Mt = Tt + '.' + Et + '.' + Rt + '.' + It; (J = m[Mt]) || (J = new Ks({radius: Tt, stroke: Et && It > 0 ? new So({width: It, color: Et}) : void 0, fill: Rt ? new Us({color: Rt}) : void 0, declutterMode: 'none'}), m[Mt] = J), D.setImage(J), Z = D.getText(), D.setText(void 0), D.setGeometry(void 0), D.setZIndex(j), K = !0;
              } let kt = void 0; let Ft = void 0; var Pt = void 0; var Lt = void 0; var At = void 0; var zt = void 0; if ('text-field' in E) {
                Lt = Math.round(fg(S, 'layout', 'text-size', c, p, _, f)); var Ot = fg(S, 'layout', 'text-font', c, p, _, f); Pt = fg(S, 'layout', 'text-line-height', c, p, _, f), (Ft = zp(o ? o(Ot) : Ot, Lt, Pt)).includes('sans-serif') || (Ft += ',sans-serif'), At = fg(S, 'layout', 'text-letter-spacing', c, p, _, f), zt = fg(S, 'layout', 'text-max-width', c, p, _, f); let Dt = fg(S, 'layout', 'text-field', c, p, _, f); kt = typeof Dt === 'object' && Dt.sections ? Dt.sections.length === 1 ? Dt.toString() : Dt.sections.reduce((function (t, e, i) {
                  let n = e.fontStack ? e.fontStack.split(',') : Ot; let r = zp(o ? o(n) : n, Lt * (e.scale || 1), Pt); let s = e.text; if (s === '\n') {
                    return t.push('\n', ''), t;
                  } if (d != 2) {
                    for (let a = 0, l = (s = ig(s, r, zt, At).split('\n')).length; a < l; ++a) {
                      a > 0 && t.push('\n', ''), t.push(s[a], r);
                    } return t;
                  }t.push(Qp(s, At), r);
                }), []) : xg(Dt, s).trim(), L = fg(S, 'paint', 'text-opacity', c, p, _, f);
              } if (kt && L && !Q) {
                K || (++x, (D = k[x]) && D.getText() && !D.getFill() && !D.getStroke() || (D = new Mo(), k[x] = D), D.setImage(void 0), D.setGeometry(void 0)), D.getText() || D.setText(Z || new Fo({padding: [2, 2, 2, 2]})), Z = D.getText(); let jt = E['text-transform']; jt == 'uppercase' ? kt = Array.isArray(kt) ? kt.map((function (t, e) {
                  return e % 2 ? t : t.toUpperCase();
                })) : kt.toUpperCase() : jt == 'lowercase' && (kt = Array.isArray(kt) ? kt.map((function (t, e) {
                  return e % 2 ? t : t.toLowerCase();
                })) : kt.toLowerCase()); let Gt = Array.isArray(kt) ? kt : d == 2 ? Qp(kt, At) : ig(kt, Ft, zt, At); Z.setText(Gt), Z.setFont(Ft), Z.setRotation(Np(fg(S, 'layout', 'text-rotate', c, p, _, f))); let Nt = fg(S, 'layout', 'text-anchor', c, p, _, f); let Wt = K || d == 1 ? 'point' : fg(S, 'layout', 'symbol-placement', c, p, _, f); Z.setPlacement(Wt), Z.setOverflow(Wt === 'point'); let Xt = fg(S, 'paint', 'text-halo-width', c, p, _, f); let qt = fg(S, 'layout', 'text-offset', c, p, _, f); let Bt = fg(S, 'paint', 'text-translate', c, p, _, f); let Vt = 0; let Yt = 0; if (Wt == 'point') {
                  let Kt = 'center'; Nt.indexOf('left') !== -1 ? (Kt = 'left', Yt = Xt) : Nt.indexOf('right') !== -1 && (Kt = 'right', Yt = -Xt), Z.setTextAlign(Kt); let Zt = fg(S, 'layout', 'text-rotation-alignment', c, p, _, f); Z.setRotateWithView(Zt == 'map');
                } else {
                  Z.setMaxAngle(Np(fg(S, 'layout', 'text-max-angle', c, p, _, f)) * kt.length / Gt.length), Z.setTextAlign(), Z.setRotateWithView(!1);
                } let Ut = 'middle'; Nt.indexOf('bottom') == 0 ? (Ut = 'bottom', Vt = -Xt - 0.5 * (Pt - 1) * Lt) : Nt.indexOf('top') == 0 && (Ut = 'top', Vt = Xt + 0.5 * (Pt - 1) * Lt), Z.setTextBaseline(Ut); let Ht = fg(S, 'layout', 'text-justify', c, p, _, f); Z.setJustify(Ht === 'auto' ? void 0 : Ht), Z.setOffsetX(qt[0] * Lt + Yt + Bt[0]), Z.setOffsetY(qt[1] * Lt + Vt + Bt[1]), M.setColor(_g(fg(S, 'paint', 'text-color', c, p, _, f), L)), Z.setFill(M); let Jt = _g(fg(S, 'paint', 'text-halo-color', c, p, _, f), L); if (Jt) {
                  I.setColor(Jt), Xt *= 2; let Qt = 0.5 * Lt; I.setWidth(Xt <= Qt ? Xt : Qt), Z.setStroke(I);
                } else {
                  Z.setStroke(void 0);
                } let $t = fg(S, 'layout', 'text-padding', c, p, _, f); let te = Z.getPadding(); $t !== te[0] && (te[0] = $t, te[1] = $t, te[2] = $t, te[3] = $t), D.setZIndex(j);
              }
            }
          }
        } return x > -1 ? (k.length = x + 1, k) : void 0;
      }
    }; return t.setStyle(F), t.set('mapbox-source', d), t.set('mapbox-layers', f), t.set('mapbox-featurestate', {}), F;
  } function wg(t, e) {
    let i; let n; let r; let s; let o; let a; let l; let h; let u; let c; let d; let p; let g = t[0]; let f = g.width; let m = g.height; let y = g.data; let _ = new Uint8ClampedArray(y.length); let v = 2 * e.resolution; let x = f - 1; let b = m - 1; let w = [0, 0, 0, 0]; let C = 2 * Math.PI; let S = Math.PI / 2; let T = Math.PI * e.sunEl / 180; let E = Math.PI * e.sunAz / 180; let R = Math.cos(T); let I = Math.sin(T); function M(t) {
      return 0.1 * (256 * t[0] * 256 + 256 * t[1] + t[2]) - 1e4;
    } for (n = 0; n <= b; ++n) {
      for (s = n === 0 ? 0 : n - 1, o = n === b ? b : n + 1, i = 0; i <= x; ++i) {
        r = i === x ? x : i + 1, a = 4 * (n * f + (i === 0 ? 0 : i - 1)), w[0] = y[a], w[1] = y[a + 1], w[2] = y[a + 2], w[3] = y[a + 3], l = e.vert * M(w), a = 4 * (n * f + r), w[0] = y[a], w[1] = y[a + 1], w[2] = y[a + 2], w[3] = y[a + 3], h = (e.vert * M(w) - l) / v, a = 4 * (s * f + i), w[0] = y[a], w[1] = y[a + 1], w[2] = y[a + 2], w[3] = y[a + 3], l = e.vert * M(w), a = 4 * (o * f + i), w[0] = y[a], w[1] = y[a + 1], w[2] = y[a + 2], w[3] = y[a + 3], u = (e.vert * M(w) - l) / v, c = Math.atan(Math.sqrt(h * h + u * u)), d = (d = Math.atan2(u, -h)) < 0 ? S - d : d > S ? C - d + S : S - d, p = 255 * (I * Math.cos(c) + R * Math.sin(c) * Math.cos(E - d)), _[a = 4 * (n * f + i)] = p, _[a + 1] = p, _[a + 2] = p, _[a + 3] = y[a + 3] * e.opacity;
      }
    } return new ImageData(_, f, m);
  } function Cg(t, e) {
    e.accessToken || (e = Object.assign({}, e), new URL(t).searchParams.forEach((function (t, i) {
      e.accessToken = t, e.accessTokenParam = i;
    }))); return e;
  } function Sg(t, e, i, n, r) {
    let s; let o; let a; let l; return void 0 === i && (i = ''), void 0 === n && (n = {}), void 0 === r && (r = void 0), typeof i === 'string' || Array.isArray(i) ? l = i : (l = (a = i).source || a.layers, n = a), typeof n === 'string' ? (s = n, a = {}) : (s = n.styleUrl, a = n), r || (r = a.resolutions), s || typeof e !== 'string' || e.trim().startsWith('{') || (s = e), s && (s = s.startsWith('data:') ? location.href : jp(s, a.accessToken), a = Cg(s, a)), new Promise((function (i, n) {
      Yp(e, a).then((function (e) {
        if (e.version != 8) {
          return n(new Error('glStyle version 8 required.'));
        } if (!(t instanceof Wh || t instanceof su)) {
          return n(new Error('Can only apply to VectorLayer or VectorTileLayer'));
        } let h; let u; let c; let d = t instanceof su ? 'vector' : 'geojson'; if (l ? o = Array.isArray(l) ? e.layers.find((function (t) {
          return t.id === l[0];
        })).source : l : (o = Object.keys(e.sources).find((function (t) {
          return e.sources[t].type === d;
        })), l = o), !o) {
          return n(new Error('No ' + d + ' source found in the glStyle.'));
        } function p() {
          if (t instanceof su) {
            return Ig(e.sources[o], s, a).then((function (e) {
              let i = t.getSource(); if (i ? e !== i && (i.setTileUrlFunction(e.getTileUrlFunction()), i.format_ || (i.format_ = e.format_), i.getAttributions() || i.setAttributions(e.getAttributions()), i.getTileLoadFunction() === uu && i.setTileLoadFunction(e.getTileLoadFunction()), Fn(i.getProjection(), e.getProjection()) && (i.tileGrid = e.getTileGrid())) : t.setSource(e), !isFinite(t.getMaxResolution()) && !isFinite(t.getMinZoom())) {
                let n = t.getSource().getTileGrid(); t.setMaxResolution(n.getResolution(n.getMinZoom()));
              }
            }));
          } let i = e.sources[o]; let n = t.getSource(); n && n.get('mapbox-source') === i || (n = Fg(i, s, a)); let r = t.getSource(); return r ? n !== r && (r.getAttributions() || r.setAttributions(n.getAttributions()), r.format_ || (r.format_ = n.getFormat()), r.url_ = n.getUrl()) : t.setSource(n), Promise.resolve();
        } function g() {
          c || e.sprite && !h ? c ? (t.setStyle(c), p().then(i).catch(n)) : n(new Error('Something went wrong trying to apply style.')) : (c = bg(t, e, l, r, h, u, lg, a.getImage), t.getStyle() ? p().then(i).catch(n) : n(new Error('Nothing to show for source [' + o + ']')));
        } if (e.sprite) {
          let f = new URL(function (t, e, i) {
            let n = Dp(t); if (!n) {
              return decodeURI(new URL(t, i).href);
            } let r = 'sprites/'; if (n.indexOf(r) !== 0) {
              throw new Error('unexpected sprites url: ' + t);
            } let s = n.slice(r.length); return Op + '/styles/v1/' + s + '/sprite?access_token=' + e;
          }(e.sprite, a.accessToken, s || location.href)); let m = (window.devicePixelRatio >= 1.5 ? 0.5 : 1) == 0.5 ? '@2x' : ''; let y = f.origin + f.pathname + m + '.json' + f.search; new Promise((function (t, e) {
            Vp('Sprite', y, a).then(t).catch((function (i) {
              Vp('Sprite', y = f.origin + f.pathname + '.json' + f.search, a).then(t).catch(e);
            }));
          })).then((function (t) {
            if (void 0 === t && n(new Error('No sprites found.')), h = t, u = f.origin + f.pathname + m + '.png' + f.search, a.transformRequest) {
              let e = a.transformRequest(u, 'SpriteImage'); e instanceof Request && (u = encodeURI(e.url));
            }g();
          })).catch((function (t) {
            n(new Error('Sprites cannot be loaded: ' + y + ': ' + t.message));
          }));
        } else {
          g();
        }
      })).catch(n);
    }));
  } let Tg = {}; function Eg(t, e, i) {
    let n = {id: e.id, type: e.type}; let r = {}; let s = 0; let o = !1; function a(t) {
      if (t.frameState.time !== s && (s = t.frameState.time, o = !1), !o) {
        if (!(t.context instanceof CanvasRenderingContext2D)) {
          throw new Error('Cannot apply background to WebGL context');
        } let a = function (t) {
          let s = e.layout || {}; let o = e.paint || {}; n.paint = o; let a; let l; let h = qp(t, i.resolutions || Wp); return void 0 !== o['background-color'] && (a = fg(n, 'paint', 'background-color', h, Tg, r)), void 0 !== o['background-opacity'] && (l = fg(n, 'paint', 'background-opacity', h, Tg, r)), s.visibility == 'none' ? void 0 : _g(a, l);
        }(t.frameState.viewState.resolution); if (a) {
          let l = t.context; let h = l.globalAlpha; let u = l.globalCompositeOperation; l.globalAlpha = 1, l.globalCompositeOperation = 'destination-over', l.fillStyle = a, l.fillRect(0, 0, t.context.canvas.width, t.context.canvas.height), l.globalAlpha = h, l.globalCompositeOperation = u;
        }o = !0;
      }
    } if (typeof t.getLayers === 'function') {
      let l = t.getLayers(); l.forEach((function (t) {
        t.on('postrender', a);
      })), l.on('add', (function (t) {
        t.element.on('postrender', a);
      })), l.on('remove', (function (t) {
        t.element.un('postrender', a);
      }));
    } else {
      t.on('postrender', a);
    }
  } function Rg(t) {
    let e = t.bounds; if (e) {
      let i = kn([e[0], e[1]]); let n = kn([e[2], e[3]]); return [i[0], i[1], n[0], n[1]];
    }
  } function Ig(t, e, i) {
    return new Promise((function (n, r) {
      Up(t, e, i).then((function (t) {
        let e = new Ml({tileJSON: t}); let i = e.getTileJSON(); let r = e.getTileGrid(); let s = Rg(i); let o = i.minzoom || 0; let a = i.maxzoom || 22; let l = {attributions: e.getAttributions(), format: new Ta(), tileGrid: new il({origin: r.getOrigin(0), extent: s || r.getExtent(), minZoom: o, resolutions: Wp.slice(0, a + 1), tileSize: 512})}; Array.isArray(i.tiles) ? l.urls = i.tiles : l.url = i.tiles, t.olSourceOptions && Object.assign(l, t.olSourceOptions), n(new hu(l));
      })).catch(r);
    }));
  } function Mg(t, e, i) {
    let n = new Qa(); return Up(t, e, i).then((function (e) {
      let r = new Ml({interpolate: void 0 === i.interpolate || i.interpolate, transition: 0, crossOrigin: 'anonymous', tileJSON: e}); let s = Rg(e); let o = r.getTileGrid(); let a = t.tileSize || e.tileSize || 512; let l = e.minzoom || 0; let h = e.maxzoom || 22; r.tileGrid = new il({origin: o.getOrigin(0), extent: s || o.getExtent(), minZoom: l, resolutions: rl({maxZoom: h, tileSize: a}).getResolutions(), tileSize: a}); let u = r.getTileUrlFunction(); r.setTileUrlFunction((function (t, e, i) {
        let n = u(t, e, i); if (n.indexOf('{bbox-epsg-3857}') != -1) {
          let s = r.getTileGrid().getTileCoordExtent(t); n = n.replace('{bbox-epsg-3857}', s.toString());
        } return n;
      })), r.set('mapbox-source', t), n.setSource(r);
    })).catch((function (t) {
      n.setSource(void 0);
    })), n;
  } let kg = new Vo(); function Fg(t, e, i) {
    let n = t.data; let r = {}; if (typeof n === 'string') {
      let s = Gp(n, i.accessToken, i.accessTokenParam || 'access_token', e || location.href); if (i.transformRequest) {
        let o = i.transformRequest(s, 'GeoJSON'); o instanceof Request && (s = encodeURI(o.url));
      } if (s.indexOf('{bbox-epsg-3857}') != -1) {
        let a = new eu({attributions: t.attribution, format: kg, url(t) {
          return s.replace('{bbox-epsg-3857}', t.join(',') + ',EPSG:3857');
        }, strategy: Jh}); return a.set('mapbox-source', t), a;
      } return new eu({attributions: t.attribution, format: kg, url: s});
    }r.features = kg.readFeatures(n, {featureProjection: 'EPSG:3857'}); let l = new eu(Object.assign({attributions: t.attribution, format: kg}, r)); return l.set('mapbox-source', t), l;
  } function Pg(t, e, i) {
    let n = null; return function (r) {
      t.paint && 'raster-opacity' in t.paint && r.frameState.viewState.zoom !== n && (n = r.frameState.viewState.zoom, delete i[t.id], function (t, e, i, n) {
        let r = fg(t, 'paint', 'raster-opacity', i, Tg, n); e.setOpacity(r);
      }(t, e, n, i));
    };
  } function Lg(t, e, i, n) {
    let r = []; let s = null; e instanceof zs && ((s = e.getView()).isDef() || s.getRotation() || s.getResolutions() || (s = new Vr(Object.assign(s.getProperties(), {maxResolution: Wp[0]})), e.setView(s)), 'center' in t && !s.getCenter() && s.setCenter(kn(t.center)), 'zoom' in t && void 0 === s.getZoom() && s.setResolution(Wp[0] / Math.pow(2, t.zoom)), s.getCenter() && void 0 !== s.getZoom() || s.fit(s.getProjection().getExtent(), {nearest: !0, size: e.getSize()})); for (var o, a, l, h, u = t.layers, c = [], d = function (s, d) {
        let p; let g; let f; let m = u[s]; let y = m.type; if (y == 'heatmap') {
          throw new Error(y + ' layers are not supported');
        } if (y == 'background') {
          Eg(e, m, n);
        } else {
          if (h = m.source || (p = u, g = m.ref, p.some((function (t) {
            if (t.id == g) {
              return f = t.source, !0;
            }
          })), f), h != l) {
            c.length && (r.push(Ag(o, c, t, i, e, n)), c = []), a = t.sources[h]; let _ = {}; if (a.type == 'vector') {
              o = function (t, e, i) {
                let n = new su({declutter: !0, visible: !1}); return Ig(t, e, i).then((function (e) {
                  e.set('mapbox-source', t), n.setSource(e);
                })).catch((function (t) {
                  n.setSource(void 0);
                })), n;
              }(a, i, n);
            } else if (a.type == 'raster') {
              (o = Mg(a, i, n)).setVisible(!m.layout || m.layout.visibility !== 'none'), o.on('prerender', Pg(m, o, _));
            } else if (a.type == 'geojson') {
              o = function (t, e, i) {
                return new Wh({declutter: !0, source: Fg(t, e, i), visible: !1});
              }(a, i, n);
            } else if (a.type == 'raster-dem' && m.type == 'hillshade') {
              let v = function (t, e, i) {
                let n = Mg(t, e, i); return new Qo({source: new bl({operationType: 'image', operation: wg, sources: [n]})});
              }(a, i, n); o = v, v.getSource().on('beforeoperations', (function (t) {
                let e = t.data; e.resolution = t.resolution; let i = qp(t.resolution, n.resolutions || Wp); e.vert = 5 * fg(m, 'paint', 'hillshade-exaggeration', i, Tg, _), e.sunAz = fg(m, 'paint', 'hillshade-illumination-direction', i, Tg, _), e.sunEl = 35, e.opacity = 0.15;
              })), o.setVisible(!m.layout || m.layout.visibility !== 'none');
            }l = h, o && o.set('mapbox-source', l);
          }c.push(m.id);
        }
      }, p = 0, g = u.length; p < g; ++p) {
      d(p);
    } return r.push(Ag(o, c, t, i, e, n)), e.set('mapbox-style', t), Promise.all(r);
  } function Ag(t, e, i, n, r, s) {
    void 0 === s && (s = {}); for (var o = 24, a = 0, l = i.layers, h = 0, u = l.length; h < u; ++h) {
      let c = l[h]; e.indexOf(c.id) !== -1 && (o = Math.min('minzoom' in c ? c.minzoom : 0, o), a = Math.max('maxzoom' in c ? c.maxzoom : 24, a));
    } return new Promise((function (l, h) {
      let u = function () {
        let r = t.getSource(); if (r && r.getState() !== 'error') {
          if ('getTileGrid' in r) {
            let u = r.getTileGrid(); if (u) {
              let c = u.getMinZoom(); (o > 0 || c > 0) && t.setMaxResolution(Math.min(Wp[o], u.getResolution(c)) + 1e-9), a < 24 && t.setMinResolution(Wp[a] + 1e-9);
            }
          } else {
            o > 0 && t.setMaxResolution(Wp[o] + 1e-9);
          }r instanceof eu || r instanceof hu ? Sg(t, i, e, Object.assign({styleUrl: n}, s)).then((function () {
            t.setVisible(!0), l();
          })).catch(h) : l();
        } else {
          h(new Error('Error accessing data for source ' + t.get('mapbox-source')));
        }
      }; t.set('mapbox-layers', e); let c = r.getLayers(); c.getArray().indexOf(t) === -1 && c.push(t), t.getSource() ? u() : t.once('change:source', u);
    }));
  } const zg = [{center: [0, 405e4], zoom: 2}, {center: [-10026264.955714773, 3498225.377934253], zoom: 12.3}, {center: [-8120333.846364162, -5972314.327727663], zoom: 10.15}, {center: [12700564.586161729, 2575397.3413926377], zoom: 13.8}, {center: [8976666.32253083, 814262.3154676007], zoom: 15.7}, {center: [1284003.7367688504, 5950927.737276901], zoom: 11.19}, {center: [-8468554.506387988, 5696886.564463913], zoom: 10.11}, {center: [707717.3609533564, 6361291.958635207], zoom: 10.02}, {center: [3345381.3050933336, -216864.19183635892], zoom: 13.9}, {center: [3318257.9642649507, -1786301.1175574847], zoom: 6.1}, {center: [19365301.097574536, -5033096.120372388], zoom: 10.77}, {center: [-13542913.807564376, 5913315.884147839], zoom: 11.59}, {center: [9680854.2477813, 3231923.470902604], zoom: 8.06}, {center: [-10341383.185823392, 1826844.1155603195], zoom: 9.27}, {center: [3232422.751942559, 5017252.706810253], zoom: 12.25}, {center: [-16373943.169136822, 8651360.275919426], zoom: 8.49}, {center: [12475943.19806142, 4172022.2635435928], zoom: 9.91}]; const Og = document.getElementById('map'); const Dg = new zs({target: Og, view: new Vr(zg[Math.random() * zg.length | 0])}); Dg.addControl(new ft()), function (t, e, i) {
    let n; if (void 0 === i && (i = {}), (typeof t === 'string' || t instanceof HTMLElement) && (t = new zs({target: t})), typeof e === 'string') {
      let r = e.startsWith('data:') ? location.href : jp(e, i.accessToken); i = Cg(r, i), n = new Promise((function (n, s) {
        Yp(e, i).then((function (e) {
          Lg(e, t, r, i).then((function () {
            n(t);
          })).catch(s);
        })).catch((function (t) {
          s(new Error('Could not load ' + e + ': ' + t.message));
        }));
      }));
    } else {
      n = new Promise((function (n, r) {
        Lg(e, t, !i.styleUrl || i.styleUrl.startsWith('data:') ? location.href : jp(i.styleUrl, i.accessToken), i).then((function () {
          n(t);
        })).catch(r);
      }));
    }
  }(Dg, 'https://api.maptiler.com/maps/topo/style.json?key=get_your_own_D6rA4zTHduk6KOKTXzGB'), Og.onmouseover = function () {
    Og.className = 'over';
  }, Og.onmouseout = function () {
    Og.className = '';
  };
}();
