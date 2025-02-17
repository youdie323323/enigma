(() => {
    var b = window;
    var At = (t, o) => () => (o || t((o = {
        exports: {}
    }).exports, o), o.exports);
    var po = At(P => {
        var vt = typeof Object.defineProperties == "function" ? Object.defineProperty : function(t, o, e) {
                t != Array.prototype && t != Object.prototype && (t[o] = e.value)
            }
        function yo(t, o) {
            if (o) {
                var e = b;
                t = t.split(".");
                for (var r = 0; r < t.length - 1; r++) {
                    var n = t[r];
                    n in e || (e[n] = {}), e = e[n]
                }
                t = t[t.length - 1], r = e[t], o = o(r), o != r && o != null && vt(e, t, {
                    configurable: !0,
                    writable: !0,
                    value: o
                })
            }
        }

        function fo(t) {
            var o = 0;
            return function() {
                return o < t.length ? {
                    done: !1,
                    value: t[o++]
                } : {
                    done: !0
                }
            }
        }

        function Bt() {
            Bt = function() {}, b.Symbol || (b.Symbol = lo)
        }

        function Ot(t, o) {
            this.a = t, vt(this, "description", {
                configurable: !0,
                writable: !0,
                value: o
            })
        }
        Ot.prototype.toString = function() {
            return this.a
        };
        var lo = function() {
            function t(e) {
                if (this instanceof t) throw new TypeError("Symbol is not a constructor");
                return new Ot("jscomp_symbol_" + (e || "") + "_" + o++, e)
            }
            var o = 0;
            return t
        }();

        function wt() {
            Bt();
            var t = b.Symbol.iterator;
            t || (t = b.Symbol.iterator = b.Symbol("Symbol.iterator")), typeof Array.prototype[t] != "function" && vt(Array.prototype, t, {
                configurable: !0,
                writable: !0,
                value: function() {
                    return co(fo(this))
                }
            }), wt = function() {}
        }

        function co(t) {
            return wt(), t = {
                next: t
            }, t[b.Symbol.iterator] = function() {
                return this
            }, t
        }

        function go(t, o) {
            wt(), t instanceof String && (t += "");
            var e = 0,
                r = {
                    next: function() {
                        if (e < t.length) {
                            var n = e++;
                            return {
                                value: o(n, t[n]),
                                done: !1
                            }
                        }
                        return r.next = function() {
                            return {
                                done: !0,
                                value: void 0
                            }
                        }, r.next()
                    }
                };
            return r[Symbol.iterator] = function() {
                return r
            }, r
        }
        yo("Array.prototype.entries", function(t) {
            return t || function() {
                return go(this, function(o, e) {
                    return [o, e]
                })
            }
        });
        var vo = P || self;

        function l(t, o, e) {
            t = t.split("."), e = e || vo, t[0] in e || typeof e.execScript > "u" || e.execScript("var " + t[0]);
            for (var r; t.length && (r = t.shift());) t.length || o === void 0 ? e[r] && e[r] !== Object.prototype[r] ? e = e[r] : e = e[r] = {} : e[r] = o
        }

        function B(t) {
            var o = typeof t;
            if (o == "object")
                if (t) {
                    if (t instanceof Array) return "array";
                    if (t instanceof Object) return o;
                    var e = Object.prototype.toString.call(t);
                    if (e == "[object Window]") return "object";
                    if (e == "[object Array]" || typeof t.length == "number" && typeof t.splice < "u" && typeof t.propertyIsEnumerable < "u" && !t.propertyIsEnumerable("splice")) return "array";
                    if (e == "[object Function]" || typeof t.call < "u" && typeof t.propertyIsEnumerable < "u" && !t.propertyIsEnumerable("call")) return "function"
                } else return "null";
            else if (o == "function" && typeof t.call > "u") return "object";
            return o
        }

        function Pt(t) {
            var o = typeof t;
            return o == "object" && t != null || o == "function"
        }

        function wo(t, o, e) {
            l(t, o, e)
        }

        function So(t, o) {
            function e() {}
            e.prototype = o.prototype, t.prototype = new e, t.prototype.constructor = t
        }
        var Mt = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");

        function jo(t, o) {
            for (var e, r, n = 1; n < arguments.length; n++) {
                r = arguments[n];
                for (e in r) t[e] = r[e];
                for (var s = 0; s < Mt.length; s++) e = Mt[s], Object.prototype.hasOwnProperty.call(r, e) && (t[e] = r[e])
            }
        }
        var Fo = Array.prototype.forEach ? function(t, o) {
                Array.prototype.forEach.call(t, o, void 0)
            } : function(t, o) {
                for (var e = t.length, r = typeof t == "string" ? t.split("") : t, n = 0; n < e; n++) n in r && o.call(void 0, r[n], n, t)
            },
            G = Array.prototype.map ? function(t, o) {
                return Array.prototype.map.call(t, o, void 0)
            } : function(t, o) {
                for (var e = t.length, r = Array(e), n = typeof t == "string" ? t.split("") : t, s = 0; s < e; s++) s in n && (r[s] = o.call(void 0, n[s], s, t));
                return r
            };

        function xo(t, o, e) {
            return 2 >= arguments.length ? Array.prototype.slice.call(t, o) : Array.prototype.slice.call(t, o, e)
        }

        function et(t, o, e, r) {
            var n = "Assertion failed";
            if (e) {
                n += ": " + e;
                var s = r
            } else t && (n += ": " + t, s = o);
            throw Error(n, s || [])
        }

        function h(t, o, e) {
            for (var r = [], n = 2; n < arguments.length; ++n) r[n - 2] = arguments[n];
            return t || et("", null, o, r), t
        }

        function ko(t, o, e) {
            for (var r = [], n = 2; n < arguments.length; ++n) r[n - 2] = arguments[n];
            typeof t != "string" && et("Expected string but got %s: %s.", [B(t), t], o, r)
        }

        function Eo(t, o, e) {
            for (var r = [], n = 2; n < arguments.length; ++n) r[n - 2] = arguments[n];
            Array.isArray(t) || et("Expected array but got %s: %s.", [B(t), t], o, r)
        }

        function E(t, o) {
            for (var e = [], r = 1; r < arguments.length; ++r) e[r - 1] = arguments[r];
            throw Error("Failure" + (t ? ": " + t : ""), e)
        }

        function C(t, o, e, r) {
            for (var n = [], s = 3; s < arguments.length; ++s) n[s - 3] = arguments[s];
            t instanceof o || et("Expected instanceof %s but got %s.", [It(o), It(t)], e, n)
        }

        function It(t) {
            return t instanceof Function ? t.displayName || t.name || "unknown type name" : t instanceof Object ? t.constructor.displayName || t.constructor.name || Object.prototype.toString.call(t) : t === null ? "null" : typeof t
        }

        function v(t, o) {
            if (this.c = t, this.b = o, this.a = {}, this.arrClean = !0, 0 < this.c.length) {
                for (t = 0; t < this.c.length; t++) {
                    o = this.c[t];
                    var e = o[0];
                    this.a[e.toString()] = new Ut(e, o[1])
                }
                this.arrClean = !0
            }
        }
        l("jspb.Map", v, void 0);
        v.prototype.g = function() {
            if (this.arrClean) {
                if (this.b) {
                    var t = this.a,
                        o;
                    for (o in t)
                        if (Object.prototype.hasOwnProperty.call(t, o)) {
                            var e = t[o].a;
                            e && e.g()
                        }
                }
            } else {
                for (this.c.length = 0, t = U(this), t.sort(), o = 0; o < t.length; o++) {
                    var r = this.a[t[o]];
                    (e = r.a) && e.g(), this.c.push([r.key, r.value])
                }
                this.arrClean = !0
            }
            return this.c
        };
        v.prototype.toArray = v.prototype.g;
        v.prototype.Mc = function(t, o) {
            for (var e = this.g(), r = [], n = 0; n < e.length; n++) {
                var s = this.a[e[n][0].toString()];
                D(this, s);
                var a = s.a;
                a ? (h(o), r.push([s.key, o(t, a)])) : r.push([s.key, s.value])
            }
            return r
        };
        v.prototype.toObject = v.prototype.Mc;
        v.fromObject = function(t, o, e) {
            o = new v([], o);
            for (var r = 0; r < t.length; r++) {
                var n = t[r][0],
                    s = e(t[r][1]);
                o.set(n, s)
            }
            return o
        };

        function J(t) {
            this.a = 0, this.b = t
        }
        J.prototype.next = function() {
            return this.a < this.b.length ? {
                done: !1,
                value: this.b[this.a++]
            } : {
                done: !0,
                value: void 0
            }
        };
        typeof Symbol < "u" && (J.prototype[Symbol.iterator] = function() {
            return this
        });
        v.prototype.Jb = function() {
            return U(this).length
        };
        v.prototype.getLength = v.prototype.Jb;
        v.prototype.clear = function() {
            this.a = {}, this.arrClean = !1
        };
        v.prototype.clear = v.prototype.clear;
        v.prototype.Cb = function(t) {
            t = t.toString();
            var o = this.a.hasOwnProperty(t);
            return delete this.a[t], this.arrClean = !1, o
        };
        v.prototype.del = v.prototype.Cb;
        v.prototype.Eb = function() {
            var t = [],
                o = U(this);
            o.sort();
            for (var e = 0; e < o.length; e++) {
                var r = this.a[o[e]];
                t.push([r.key, r.value])
            }
            return t
        };
        v.prototype.getEntryList = v.prototype.Eb;
        v.prototype.entries = function() {
            var t = [],
                o = U(this);
            o.sort();
            for (var e = 0; e < o.length; e++) {
                var r = this.a[o[e]];
                t.push([r.key, D(this, r)])
            }
            return new J(t)
        };
        v.prototype.entries = v.prototype.entries;
        v.prototype.keys = function() {
            var t = [],
                o = U(this);
            o.sort();
            for (var e = 0; e < o.length; e++) t.push(this.a[o[e]].key);
            return new J(t)
        };
        v.prototype.keys = v.prototype.keys;
        v.prototype.values = function() {
            var t = [],
                o = U(this);
            o.sort();
            for (var e = 0; e < o.length; e++) t.push(D(this, this.a[o[e]]));
            return new J(t)
        };
        v.prototype.values = v.prototype.values;
        v.prototype.forEach = function(t, o) {
            var e = U(this);
            e.sort();
            for (var r = 0; r < e.length; r++) {
                var n = this.a[e[r]];
                t.call(o, D(this, n), n.key, this)
            }
        };
        v.prototype.forEach = v.prototype.forEach;
        v.prototype.set = function(t, o) {
            var e = new Ut(t);
            return this.b ? (e.a = o, e.value = o.g()) : e.value = o, this.a[t.toString()] = e, this.arrClean = !1, this
        };
        v.prototype.set = v.prototype.set;

        function D(t, o) {
            return t.b ? (o.a || (o.a = new t.b(o.value)), o.a) : o.value
        }
        v.prototype.get = function(t) {
            if (t = this.a[t.toString()]) return D(this, t)
        };
        v.prototype.get = v.prototype.get;
        v.prototype.has = function(t) {
            return t.toString() in this.a
        };
        v.prototype.has = v.prototype.has;
        v.prototype.Jc = function(t, o, e, r, n) {
            var s = U(this);
            s.sort();
            for (var a = 0; a < s.length; a++) {
                var d = this.a[s[a]];
                o.Va(t), e.call(o, 1, d.key), this.b ? r.call(o, 2, D(this, d), n) : r.call(o, 2, d.value), o.Ya()
            }
        };
        v.prototype.serializeBinary = v.prototype.Jc;
        v.deserializeBinary = function(t, o, e, r, n, s, a) {
            for (; o.oa() && !o.bb();) {
                var d = o.c;
                d == 1 ? s = e.call(o) : d == 2 && (t.b ? (h(n), a || (a = new t.b), r.call(o, a, n)) : a = r.call(o))
            }
            h(s != null), h(a != null), t.set(s, a)
        };

        function U(t) {
            t = t.a;
            var o = [],
                e;
            for (e in t) Object.prototype.hasOwnProperty.call(t, e) && o.push(e);
            return o
        }

        function Ut(t, o) {
            this.key = t, this.value = o, this.a = void 0
        }

        function Tt(t) {
            if (8192 >= t.length) return String.fromCharCode.apply(null, t);
            for (var o = "", e = 0; e < t.length; e += 8192) o += String.fromCharCode.apply(null, xo(t, e, e + 8192));
            return o
        }
        var lt = {
                "\0": "\\0",
                "\b": "\\b",
                "\f": "\\f",
                "\n": "\\n",
                "\r": "\\r",
                "	": "\\t",
                "\v": "\\x0B",
                '"': '\\"',
                "\\": "\\\\",
                "<": "\\u003C"
            },
            ot = {
                "'": "\\'"
            },
            Rt = {},
            H = null;

        function bt(t, o) {
            o === void 0 && (o = 0), Nt(), o = Rt[o];
            for (var e = [], r = 0; r < t.length; r += 3) {
                var n = t[r],
                    s = r + 1 < t.length,
                    a = s ? t[r + 1] : 0,
                    d = r + 2 < t.length,
                    k = d ? t[r + 2] : 0,
                    R = n >> 2;
                n = (n & 3) << 4 | a >> 4, a = (a & 15) << 2 | k >> 6, k &= 63, d || (k = 64, s || (a = 64)), e.push(o[R], o[n], o[a] || "", o[k] || "")
            }
            return e.join("")
        }

        function Vt(t) {
            var o = t.length,
                e = 3 * o / 4;
            e % 3 ? e = Math.floor(e) : "=.".indexOf(t[o - 1]) != -1 && (e = "=.".indexOf(t[o - 2]) != -1 ? e - 2 : e - 1);
            var r = new Uint8Array(e),
                n = 0;
            return Ao(t, function(s) {
                r[n++] = s
            }), r.subarray(0, n)
        }

        function Ao(t, o) {
            function e(k) {
                for (; r < t.length;) {
                    var R = t.charAt(r++),
                        Et = H[R];
                    if (Et != null) return Et;
                    if (!/^[\s\xa0]*$/.test(R)) throw Error("Unknown base64 encoding at char: " + R)
                }
                return k
            }
            Nt();
            for (var r = 0;;) {
                var n = e(-1),
                    s = e(0),
                    a = e(64),
                    d = e(64);
                if (d === 64 && n === -1) break;
                o(n << 2 | s >> 4), a != 64 && (o(s << 4 & 240 | a >> 2), d != 64 && o(a << 6 & 192 | d))
            }
        }

        function Nt() {
            if (!H) {
                H = {};
                for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), o = ["+/=", "+/", "-_=", "-_.", "-_"], e = 0; 5 > e; e++) {
                    var r = t.concat(o[e].split(""));
                    Rt[e] = r;
                    for (var n = 0; n < r.length; n++) {
                        var s = r[n];
                        H[s] === void 0 && (H[s] = n)
                    }
                }
            }
        }
        l("jspb.ConstBinaryMessage", function() {}, void 0);
        l("jspb.BinaryMessage", function() {}, void 0);
        l("jspb.BinaryConstants.FieldType", {
            yb: -1,
            ee: 1,
            FLOAT: 2,
            ke: 3,
            te: 4,
            je: 5,
            xb: 6,
            wb: 7,
            BOOL: 8,
            re: 9,
            ie: 10,
            le: 11,
            ce: 12,
            se: 13,
            ge: 14,
            me: 15,
            ne: 16,
            oe: 17,
            pe: 18,
            he: 30,
            ve: 31
        }, void 0);
        l("jspb.BinaryConstants.WireType", {
            yb: -1,
            ue: 0,
            xb: 1,
            de: 2,
            qe: 3,
            fe: 4,
            wb: 5
        }, void 0);
        l("jspb.BinaryConstants.FieldTypeToWireType", function(t) {
            switch (t) {
                case 5:
                case 3:
                case 13:
                case 4:
                case 17:
                case 18:
                case 8:
                case 14:
                case 31:
                    return 0;
                case 1:
                case 6:
                case 16:
                case 30:
                    return 1;
                case 9:
                case 11:
                case 12:
                    return 2;
                case 2:
                case 7:
                case 15:
                    return 5;
                default:
                    return -1
            }
        }, void 0);
        l("jspb.BinaryConstants.INVALID_FIELD_NUMBER", -1, void 0);
        l("jspb.BinaryConstants.FLOAT32_EPS", 1401298464324817e-60, void 0);
        l("jspb.BinaryConstants.FLOAT32_MIN", 11754943508222875e-54, void 0);
        l("jspb.BinaryConstants.FLOAT32_MAX", 34028234663852886e22, void 0);
        l("jspb.BinaryConstants.FLOAT64_EPS", 5e-324, void 0);
        l("jspb.BinaryConstants.FLOAT64_MIN", 22250738585072014e-324, void 0);
        l("jspb.BinaryConstants.FLOAT64_MAX", 17976931348623157e292, void 0);
        l("jspb.BinaryConstants.TWO_TO_20", 1048576, void 0);
        l("jspb.BinaryConstants.TWO_TO_23", 8388608, void 0);
        l("jspb.BinaryConstants.TWO_TO_31", 2147483648, void 0);
        l("jspb.BinaryConstants.TWO_TO_32", 4294967296, void 0);
        l("jspb.BinaryConstants.TWO_TO_52", 4503599627370496, void 0);
        l("jspb.BinaryConstants.TWO_TO_63", 9223372036854776e3, void 0);
        l("jspb.BinaryConstants.TWO_TO_64", 18446744073709552e3, void 0);
        l("jspb.BinaryConstants.ZERO_HASH", "\0\0\0\0\0\0\0\0", void 0);
        var w = 0,
            S = 0;
        l("jspb.utils.getSplit64Low", function() {
            return w
        }, void 0);
        l("jspb.utils.getSplit64High", function() {
            return S
        }, void 0);

        function St(t) {
            var o = t >>> 0;
            t = Math.floor((t - o) / 4294967296) >>> 0, w = o, S = t
        }
        l("jspb.utils.splitUint64", St, void 0);

        function $(t) {
            var o = 0 > t;
            t = Math.abs(t);
            var e = t >>> 0;
            t = Math.floor((t - e) / 4294967296), t >>>= 0, o && (t = ~t >>> 0, e = (~e >>> 0) + 1, 4294967295 < e && (e = 0, t++, 4294967295 < t && (t = 0))), w = e, S = t
        }
        l("jspb.utils.splitInt64", $, void 0);

        function Dt(t) {
            var o = 0 > t;
            t = 2 * Math.abs(t), St(t), t = w;
            var e = S;
            o && (t == 0 ? e == 0 ? e = t = 4294967295 : (e--, t = 4294967295) : t--), w = t, S = e
        }
        l("jspb.utils.splitZigzag64", Dt, void 0);

        function zt(t) {
            var o = 0 > t ? 1 : 0;
            if (t = o ? -t : t, t === 0) 0 < 1 / t ? w = S = 0 : (S = 0, w = 2147483648);
            else if (isNaN(t)) S = 0, w = 2147483647;
            else if (34028234663852886e22 < t) S = 0, w = (o << 31 | 2139095040) >>> 0;
            else if (11754943508222875e-54 > t) t = Math.round(t / Math.pow(2, -149)), S = 0, w = (o << 31 | t) >>> 0;
            else {
                var e = Math.floor(Math.log(t) / Math.LN2);
                t *= Math.pow(2, -e), t = Math.round(8388608 * t), 16777216 <= t && ++e, S = 0, w = (o << 31 | e + 127 << 23 | t & 8388607) >>> 0
            }
        }
        l("jspb.utils.splitFloat32", zt, void 0);

        function Wt(t) {
            var o = 0 > t ? 1 : 0;
            if (t = o ? -t : t, t === 0) S = 0 < 1 / t ? 0 : 2147483648, w = 0;
            else if (isNaN(t)) S = 2147483647, w = 4294967295;
            else if (17976931348623157e292 < t) S = (o << 31 | 2146435072) >>> 0, w = 0;
            else if (22250738585072014e-324 > t) t /= Math.pow(2, -1074), S = (o << 31 | t / 4294967296) >>> 0, w = t >>> 0;
            else {
                var e = t,
                    r = 0;
                if (2 <= e)
                    for (; 2 <= e && 1023 > r;) r++, e /= 2;
                else
                    for (; 1 > e && -1022 < r;) e *= 2, r--;
                t *= Math.pow(2, -r), S = (o << 31 | r + 1023 << 20 | 1048576 * t & 1048575) >>> 0, w = 4503599627370496 * t >>> 0
            }
        }
        l("jspb.utils.splitFloat64", Wt, void 0);

        function T(t) {
            var o = t.charCodeAt(4),
                e = t.charCodeAt(5),
                r = t.charCodeAt(6),
                n = t.charCodeAt(7);
            w = t.charCodeAt(0) + (t.charCodeAt(1) << 8) + (t.charCodeAt(2) << 16) + (t.charCodeAt(3) << 24) >>> 0, S = o + (e << 8) + (r << 16) + (n << 24) >>> 0
        }
        l("jspb.utils.splitHash64", T, void 0);

        function z(t, o) {
            return 4294967296 * o + (t >>> 0)
        }
        l("jspb.utils.joinUint64", z, void 0);

        function K(t, o) {
            var e = o & 2147483648;
            return e && (t = ~t + 1 >>> 0, o = ~o >>> 0, t == 0 && (o = o + 1 >>> 0)), t = z(t, o), e ? -t : t
        }
        l("jspb.utils.joinInt64", K, void 0);

        function rt(t, o, e) {
            var r = o >> 31;
            return e(t << 1 ^ r, (o << 1 | t >>> 31) ^ r)
        }
        l("jspb.utils.toZigzag64", rt, void 0);

        function Ht(t, o) {
            return it(t, o, K)
        }
        l("jspb.utils.joinZigzag64", Ht, void 0);

        function it(t, o, e) {
            var r = -(t & 1);
            return e((t >>> 1 | o << 31) ^ r, o >>> 1 ^ r)
        }
        l("jspb.utils.fromZigzag64", it, void 0);

        function Lt(t) {
            var o = 2 * (t >> 31) + 1,
                e = t >>> 23 & 255;
            return t &= 8388607, e == 255 ? t ? NaN : 1 / 0 * o : e == 0 ? o * Math.pow(2, -149) * t : o * Math.pow(2, e - 150) * (t + Math.pow(2, 23))
        }
        l("jspb.utils.joinFloat32", Lt, void 0);

        function Zt(t, o) {
            var e = 2 * (o >> 31) + 1,
                r = o >>> 20 & 2047;
            return t = 4294967296 * (o & 1048575) + t, r == 2047 ? t ? NaN : 1 / 0 * e : r == 0 ? e * Math.pow(2, -1074) * t : e * Math.pow(2, r - 1075) * (t + 4503599627370496)
        }
        l("jspb.utils.joinFloat64", Zt, void 0);

        function nt(t, o) {
            return String.fromCharCode(t >>> 0 & 255, t >>> 8 & 255, t >>> 16 & 255, t >>> 24 & 255, o >>> 0 & 255, o >>> 8 & 255, o >>> 16 & 255, o >>> 24 & 255)
        }
        l("jspb.utils.joinHash64", nt, void 0);
        l("jspb.utils.DIGITS", "0123456789abcdef".split(""), void 0);

        function X(t, o) {
            function e(n, s) {
                return n = n ? String(n) : "", s ? "0000000".slice(n.length) + n : n
            }
            if (2097151 >= o) return "" + z(t, o);
            var r = (t >>> 24 | o << 8) >>> 0 & 16777215;
            return o = o >> 16 & 65535, t = (t & 16777215) + 6777216 * r + 6710656 * o, r += 8147497 * o, o *= 2, 1e7 <= t && (r += Math.floor(t / 1e7), t %= 1e7), 1e7 <= r && (o += Math.floor(r / 1e7), r %= 1e7), e(o, 0) + e(r, o) + e(t, 1)
        }
        l("jspb.utils.joinUnsignedDecimalString", X, void 0);

        function q(t, o) {
            var e = o & 2147483648;
            return e && (t = ~t + 1 >>> 0, o = ~o + (t == 0 ? 1 : 0) >>> 0), t = X(t, o), e ? "-" + t : t
        }
        l("jspb.utils.joinSignedDecimalString", q, void 0);

        function _t(t, o) {
            T(t), t = w;
            var e = S;
            return o ? q(t, e) : X(t, e)
        }
        l("jspb.utils.hash64ToDecimalString", _t, void 0);
        l("jspb.utils.hash64ArrayToDecimalStrings", function(t, o) {
            for (var e = Array(t.length), r = 0; r < t.length; r++) e[r] = _t(t[r], o);
            return e
        }, void 0);

        function Y(t) {
            function o(a, d) {
                for (var k = 0; 8 > k && (a !== 1 || 0 < d); k++) d = a * n[k] + d, n[k] = d & 255, d >>>= 8
            }

            function e() {
                for (var a = 0; 8 > a; a++) n[a] = ~n[a] & 255
            }
            h(0 < t.length);
            var r = !1;
            t[0] === "-" && (r = !0, t = t.slice(1));
            for (var n = [0, 0, 0, 0, 0, 0, 0, 0], s = 0; s < t.length; s++) o(10, t.charCodeAt(s) - 48);
            return r && (e(), o(1, 1)), Tt(n)
        }
        l("jspb.utils.decimalStringToHash64", Y, void 0);
        l("jspb.utils.splitDecimalString", function(t) {
            T(Y(t))
        }, void 0);

        function mt(t) {
            return String.fromCharCode(10 > t ? 48 + t : 87 + t)
        }

        function Ct(t) {
            return 97 <= t ? t - 97 + 10 : t - 48
        }
        l("jspb.utils.hash64ToHexString", function(t) {
            var o = Array(18);
            o[0] = "0", o[1] = "x";
            for (var e = 0; 8 > e; e++) {
                var r = t.charCodeAt(7 - e);
                o[2 * e + 2] = mt(r >> 4), o[2 * e + 3] = mt(r & 15)
            }
            return o.join("")
        }, void 0);
        l("jspb.utils.hexStringToHash64", function(t) {
            t = t.toLowerCase(), h(t.length == 18), h(t[0] == "0"), h(t[1] == "x");
            for (var o = "", e = 0; 8 > e; e++) o = String.fromCharCode(16 * Ct(t.charCodeAt(2 * e + 2)) + Ct(t.charCodeAt(2 * e + 3))) + o;
            return o
        }, void 0);
        l("jspb.utils.hash64ToNumber", function(t, o) {
            T(t), t = w;
            var e = S;
            return o ? K(t, e) : z(t, e)
        }, void 0);
        l("jspb.utils.numberToHash64", function(t) {
            return $(t), nt(w, S)
        }, void 0);
        l("jspb.utils.countVarints", function(t, o, e) {
            for (var r = 0, n = o; n < e; n++) r += t[n] >> 7;
            return e - o - r
        }, void 0);
        l("jspb.utils.countVarintFields", function(t, o, e, r) {
            var n = 0;
            if (r *= 8, 128 > r)
                for (; o < e && t[o++] == r;)
                    for (n++;;) {
                        var s = t[o++];
                        if (!(s & 128)) break
                    } else
                        for (; o < e;) {
                            for (s = r; 128 < s;) {
                                if (t[o] != (s & 127 | 128)) return n;
                                o++, s >>= 7
                            }
                            if (t[o++] != s) break;
                            for (n++; s = t[o++], (s & 128) != 0;);
                        }
            return n
        }, void 0);

        function Gt(t, o, e, r, n) {
            var s = 0;
            if (128 > r)
                for (; o < e && t[o++] == r;) s++, o += n;
            else
                for (; o < e;) {
                    for (var a = r; 128 < a;) {
                        if (t[o++] != (a & 127 | 128)) return s;
                        a >>= 7
                    }
                    if (t[o++] != a) break;
                    s++, o += n
                }
            return s
        }
        l("jspb.utils.countFixed32Fields", function(t, o, e, r) {
            return Gt(t, o, e, 8 * r + 5, 4)
        }, void 0);
        l("jspb.utils.countFixed64Fields", function(t, o, e, r) {
            return Gt(t, o, e, 8 * r + 1, 8)
        }, void 0);
        l("jspb.utils.countDelimitedFields", function(t, o, e, r) {
            var n = 0;
            for (r = 8 * r + 2; o < e;) {
                for (var s = r; 128 < s;) {
                    if (t[o++] != (s & 127 | 128)) return n;
                    s >>= 7
                }
                if (t[o++] != s) break;
                n++;
                for (var a = 0, d = 1; s = t[o++], a += (s & 127) * d, d *= 128, (s & 128) != 0;);
                o += a
            }
            return n
        }, void 0);
        l("jspb.utils.debugBytesToTextFormat", function(t) {
            var o = '"';
            if (t) {
                t = pt(t);
                for (var e = 0; e < t.length; e++) o += "\\x", 16 > t[e] && (o += "0"), o += t[e].toString(16)
            }
            return o + '"'
        }, void 0);
        l("jspb.utils.debugScalarToTextFormat", function(t) {
            if (typeof t == "string") {
                t = String(t);
                for (var o = ['"'], e = 0; e < t.length; e++) {
                    var r = t.charAt(e),
                        n = r.charCodeAt(0),
                        s = e + 1,
                        a;
                    (a = lt[r]) || (31 < n && 127 > n || (n = r, n in ot ? r = ot[n] : n in lt ? r = ot[n] = lt[n] : (a = n.charCodeAt(0), 31 < a && 127 > a ? r = n : (256 > a ? (r = "\\x", (16 > a || 256 < a) && (r += "0")) : (r = "\\u", 4096 > a && (r += "0")), r += a.toString(16).toUpperCase()), r = ot[n] = r)), a = r), o[s] = a
                }
                o.push('"'), t = o.join("")
            } else t = t.toString();
            return t
        }, void 0);
        l("jspb.utils.stringToByteArray", function(t) {
            for (var o = new Uint8Array(t.length), e = 0; e < t.length; e++) {
                var r = t.charCodeAt(e);
                if (255 < r) throw Error("Conversion error: string contains codepoint outside of byte range");
                o[e] = r
            }
            return o
        }, void 0);

        function pt(t) {
            return t.constructor === Uint8Array ? t : t.constructor === ArrayBuffer ? new Uint8Array(t) : t.constructor === Array ? new Uint8Array(t) : t.constructor === String ? Vt(t) : t instanceof Uint8Array ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : (E("Type not convertible to Uint8Array."), new Uint8Array(0))
        }
        l("jspb.utils.byteSourceToUint8Array", pt, void 0);

        function u(t, o, e) {
            this.b = null, this.a = this.c = this.h = 0, this.v = !1, t && this.H(t, o, e)
        }
        l("jspb.BinaryDecoder", u, void 0);
        var L = [];
        u.getInstanceCacheLength = function() {
            return L.length
        };

        function st(t, o, e) {
            if (L.length) {
                var r = L.pop();
                return t && r.H(t, o, e), r
            }
            return new u(t, o, e)
        }
        u.alloc = st;
        u.prototype.Ca = function() {
            this.clear(), 100 > L.length && L.push(this)
        };
        u.prototype.free = u.prototype.Ca;
        u.prototype.clone = function() {
            return st(this.b, this.h, this.c - this.h)
        };
        u.prototype.clone = u.prototype.clone;
        u.prototype.clear = function() {
            this.b = null, this.a = this.c = this.h = 0, this.v = !1
        };
        u.prototype.clear = u.prototype.clear;
        u.prototype.Y = function() {
            return this.b
        };
        u.prototype.getBuffer = u.prototype.Y;
        u.prototype.H = function(t, o, e) {
            this.b = pt(t), this.h = o !== void 0 ? o : 0, this.c = e !== void 0 ? this.h + e : this.b.length, this.a = this.h
        };
        u.prototype.setBlock = u.prototype.H;
        u.prototype.Db = function() {
            return this.c
        };
        u.prototype.getEnd = u.prototype.Db;
        u.prototype.setEnd = function(t) {
            this.c = t
        };
        u.prototype.setEnd = u.prototype.setEnd;
        u.prototype.reset = function() {
            this.a = this.h
        };
        u.prototype.reset = u.prototype.reset;
        u.prototype.B = function() {
            return this.a
        };
        u.prototype.getCursor = u.prototype.B;
        u.prototype.Ma = function(t) {
            this.a = t
        };
        u.prototype.setCursor = u.prototype.Ma;
        u.prototype.advance = function(t) {
            this.a += t, h(this.a <= this.c)
        };
        u.prototype.advance = u.prototype.advance;
        u.prototype.ya = function() {
            return this.a == this.c
        };
        u.prototype.atEnd = u.prototype.ya;
        u.prototype.Qb = function() {
            return this.a > this.c
        };
        u.prototype.pastEnd = u.prototype.Qb;
        u.prototype.getError = function() {
            return this.v || 0 > this.a || this.a > this.c
        };
        u.prototype.getError = u.prototype.getError;
        u.prototype.w = function(t) {
            for (var o = 128, e = 0, r = 0, n = 0; 4 > n && 128 <= o; n++) o = this.b[this.a++], e |= (o & 127) << 7 * n;
            if (128 <= o && (o = this.b[this.a++], e |= (o & 127) << 28, r |= (o & 127) >> 4), 128 <= o)
                for (n = 0; 5 > n && 128 <= o; n++) o = this.b[this.a++], r |= (o & 127) << 7 * n + 3;
            if (128 > o) return t(e >>> 0, r >>> 0);
            E("Failed to read varint, encoding is invalid."), this.v = !0
        };
        u.prototype.readSplitVarint64 = u.prototype.w;
        u.prototype.ea = function(t) {
            return this.w(function(o, e) {
                return it(o, e, t)
            })
        };
        u.prototype.readSplitZigzagVarint64 = u.prototype.ea;
        u.prototype.ta = function(t) {
            var o = this.b,
                e = this.a;
            this.a += 8;
            for (var r = 0, n = 0, s = e + 7; s >= e; s--) r = r << 8 | o[s], n = n << 8 | o[s + 4];
            return t(r, n)
        };
        u.prototype.readSplitFixed64 = u.prototype.ta;
        u.prototype.kb = function() {
            for (; this.b[this.a] & 128;) this.a++;
            this.a++
        };
        u.prototype.skipVarint = u.prototype.kb;
        u.prototype.mb = function(t) {
            for (; 128 < t;) this.a--, t >>>= 7;
            this.a--
        };
        u.prototype.unskipVarint = u.prototype.mb;
        u.prototype.o = function() {
            var t = this.b,
                o = t[this.a],
                e = o & 127;
            return 128 > o ? (this.a += 1, h(this.a <= this.c), e) : (o = t[this.a + 1], e |= (o & 127) << 7, 128 > o ? (this.a += 2, h(this.a <= this.c), e) : (o = t[this.a + 2], e |= (o & 127) << 14, 128 > o ? (this.a += 3, h(this.a <= this.c), e) : (o = t[this.a + 3], e |= (o & 127) << 21, 128 > o ? (this.a += 4, h(this.a <= this.c), e) : (o = t[this.a + 4], e |= (o & 15) << 28, 128 > o ? (this.a += 5, h(this.a <= this.c), e >>> 0) : (this.a += 5, 128 <= t[this.a++] && 128 <= t[this.a++] && 128 <= t[this.a++] && 128 <= t[this.a++] && 128 <= t[this.a++] && h(!1), h(this.a <= this.c), e)))))
        };
        u.prototype.readUnsignedVarint32 = u.prototype.o;
        u.prototype.da = function() {
            return ~~this.o()
        };
        u.prototype.readSignedVarint32 = u.prototype.da;
        u.prototype.O = function() {
            return this.o().toString()
        };
        u.prototype.Ea = function() {
            return this.da().toString()
        };
        u.prototype.readSignedVarint32String = u.prototype.Ea;
        u.prototype.Ia = function() {
            var t = this.o();
            return t >>> 1 ^ -(t & 1)
        };
        u.prototype.readZigzagVarint32 = u.prototype.Ia;
        u.prototype.Ga = function() {
            return this.w(z)
        };
        u.prototype.readUnsignedVarint64 = u.prototype.Ga;
        u.prototype.Ha = function() {
            return this.w(X)
        };
        u.prototype.readUnsignedVarint64String = u.prototype.Ha;
        u.prototype.sa = function() {
            return this.w(K)
        };
        u.prototype.readSignedVarint64 = u.prototype.sa;
        u.prototype.Fa = function() {
            return this.w(q)
        };
        u.prototype.readSignedVarint64String = u.prototype.Fa;
        u.prototype.Ja = function() {
            return this.w(Ht)
        };
        u.prototype.readZigzagVarint64 = u.prototype.Ja;
        u.prototype.fb = function() {
            return this.ea(nt)
        };
        u.prototype.readZigzagVarintHash64 = u.prototype.fb;
        u.prototype.Ka = function() {
            return this.ea(q)
        };
        u.prototype.readZigzagVarint64String = u.prototype.Ka;
        u.prototype.Gc = function() {
            var t = this.b[this.a];
            return this.a += 1, h(this.a <= this.c), t
        };
        u.prototype.readUint8 = u.prototype.Gc;
        u.prototype.Ec = function() {
            var t = this.b[this.a],
                o = this.b[this.a + 1];
            return this.a += 2, h(this.a <= this.c), t << 0 | o << 8
        };
        u.prototype.readUint16 = u.prototype.Ec;
        u.prototype.m = function() {
            var t = this.b[this.a],
                o = this.b[this.a + 1],
                e = this.b[this.a + 2],
                r = this.b[this.a + 3];
            return this.a += 4, h(this.a <= this.c), (t << 0 | o << 8 | e << 16 | r << 24) >>> 0
        };
        u.prototype.readUint32 = u.prototype.m;
        u.prototype.ga = function() {
            var t = this.m(),
                o = this.m();
            return z(t, o)
        };
        u.prototype.readUint64 = u.prototype.ga;
        u.prototype.ha = function() {
            var t = this.m(),
                o = this.m();
            return X(t, o)
        };
        u.prototype.readUint64String = u.prototype.ha;
        u.prototype.Xb = function() {
            var t = this.b[this.a];
            return this.a += 1, h(this.a <= this.c), t << 24 >> 24
        };
        u.prototype.readInt8 = u.prototype.Xb;
        u.prototype.Vb = function() {
            var t = this.b[this.a],
                o = this.b[this.a + 1];
            return this.a += 2, h(this.a <= this.c), (t << 0 | o << 8) << 16 >> 16
        };
        u.prototype.readInt16 = u.prototype.Vb;
        u.prototype.P = function() {
            var t = this.b[this.a],
                o = this.b[this.a + 1],
                e = this.b[this.a + 2],
                r = this.b[this.a + 3];
            return this.a += 4, h(this.a <= this.c), t << 0 | o << 8 | e << 16 | r << 24
        };
        u.prototype.readInt32 = u.prototype.P;
        u.prototype.ba = function() {
            var t = this.m(),
                o = this.m();
            return K(t, o)
        };
        u.prototype.readInt64 = u.prototype.ba;
        u.prototype.ca = function() {
            var t = this.m(),
                o = this.m();
            return q(t, o)
        };
        u.prototype.readInt64String = u.prototype.ca;
        u.prototype.aa = function() {
            var t = this.m();
            return Lt(t, 0)
        };
        u.prototype.readFloat = u.prototype.aa;
        u.prototype.Z = function() {
            var t = this.m(),
                o = this.m();
            return Zt(t, o)
        };
        u.prototype.readDouble = u.prototype.Z;
        u.prototype.pa = function() {
            return !!this.b[this.a++]
        };
        u.prototype.readBool = u.prototype.pa;
        u.prototype.ra = function() {
            return this.da()
        };
        u.prototype.readEnum = u.prototype.ra;
        u.prototype.fa = function(t) {
            var o = this.b,
                e = this.a;
            t = e + t;
            for (var r = [], n = ""; e < t;) {
                var s = o[e++];
                if (128 > s) r.push(s);
                else {
                    if (192 > s) continue;
                    if (224 > s) {
                        var a = o[e++];
                        r.push((s & 31) << 6 | a & 63)
                    } else if (240 > s) {
                        a = o[e++];
                        var d = o[e++];
                        r.push((s & 15) << 12 | (a & 63) << 6 | d & 63)
                    } else if (248 > s) {
                        a = o[e++], d = o[e++];
                        var k = o[e++];
                        s = (s & 7) << 18 | (a & 63) << 12 | (d & 63) << 6 | k & 63, s -= 65536, r.push((s >> 10 & 1023) + 55296, (s & 1023) + 56320)
                    }
                }
                8192 <= r.length && (n += String.fromCharCode.apply(null, r), r.length = 0)
            }
            return n += Tt(r), this.a = e, n
        };
        u.prototype.readString = u.prototype.fa;
        u.prototype.Dc = function() {
            var t = this.o();
            return this.fa(t)
        };
        u.prototype.readStringWithLength = u.prototype.Dc;
        u.prototype.qa = function(t) {
            if (0 > t || this.a + t > this.b.length) return this.v = !0, E("Invalid byte length!"), new Uint8Array(0);
            var o = this.b.subarray(this.a, this.a + t);
            return this.a += t, h(this.a <= this.c), o
        };
        u.prototype.readBytes = u.prototype.qa;
        u.prototype.ia = function() {
            return this.w(nt)
        };
        u.prototype.readVarintHash64 = u.prototype.ia;
        u.prototype.$ = function() {
            var t = this.b,
                o = this.a,
                e = t[o],
                r = t[o + 1],
                n = t[o + 2],
                s = t[o + 3],
                a = t[o + 4],
                d = t[o + 5],
                k = t[o + 6];
            return t = t[o + 7], this.a += 8, String.fromCharCode(e, r, n, s, a, d, k, t)
        };
        u.prototype.readFixedHash64 = u.prototype.$;

        function p(t, o, e) {
            this.a = st(t, o, e), this.O = this.a.B(), this.b = this.c = -1, this.h = !1, this.v = null
        }
        l("jspb.BinaryReader", p, void 0);
        var N = [];
        p.clearInstanceCache = function() {
            N = []
        };
        p.getInstanceCacheLength = function() {
            return N.length
        };

        function Jt(t, o, e) {
            if (N.length) {
                var r = N.pop();
                return t && r.a.H(t, o, e), r
            }
            return new p(t, o, e)
        }
        p.alloc = Jt;
        p.prototype.zb = Jt;
        p.prototype.alloc = p.prototype.zb;
        p.prototype.Ca = function() {
            this.a.clear(), this.b = this.c = -1, this.h = !1, this.v = null, 100 > N.length && N.push(this)
        };
        p.prototype.free = p.prototype.Ca;
        p.prototype.Fb = function() {
            return this.O
        };
        p.prototype.getFieldCursor = p.prototype.Fb;
        p.prototype.B = function() {
            return this.a.B()
        };
        p.prototype.getCursor = p.prototype.B;
        p.prototype.Y = function() {
            return this.a.Y()
        };
        p.prototype.getBuffer = p.prototype.Y;
        p.prototype.Hb = function() {
            return this.c
        };
        p.prototype.getFieldNumber = p.prototype.Hb;
        p.prototype.Lb = function() {
            return this.b
        };
        p.prototype.getWireType = p.prototype.Lb;
        p.prototype.Mb = function() {
            return this.b == 2
        };
        p.prototype.isDelimited = p.prototype.Mb;
        p.prototype.bb = function() {
            return this.b == 4
        };
        p.prototype.isEndGroup = p.prototype.bb;
        p.prototype.getError = function() {
            return this.h || this.a.getError()
        };
        p.prototype.getError = p.prototype.getError;
        p.prototype.H = function(t, o, e) {
            this.a.H(t, o, e), this.b = this.c = -1
        };
        p.prototype.setBlock = p.prototype.H;
        p.prototype.reset = function() {
            this.a.reset(), this.b = this.c = -1
        };
        p.prototype.reset = p.prototype.reset;
        p.prototype.advance = function(t) {
            this.a.advance(t)
        };
        p.prototype.advance = p.prototype.advance;
        p.prototype.oa = function() {
            if (this.a.ya()) return !1;
            if (this.getError()) return E("Decoder hit an error"), !1;
            this.O = this.a.B();
            var t = this.a.o(),
                o = t >>> 3;
            return t &= 7, t != 0 && t != 5 && t != 1 && t != 2 && t != 3 && t != 4 ? (E("Invalid wire type: %s (at position %s)", t, this.O), this.h = !0, !1) : (this.c = o, this.b = t, !0)
        };
        p.prototype.nextField = p.prototype.oa;
        p.prototype.Oa = function() {
            this.a.mb(this.c << 3 | this.b)
        };
        p.prototype.unskipHeader = p.prototype.Oa;
        p.prototype.Lc = function() {
            var t = this.c;
            for (this.Oa(); this.oa() && this.c == t;) this.C();
            this.a.ya() || this.Oa()
        };
        p.prototype.skipMatchingFields = p.prototype.Lc;
        p.prototype.lb = function() {
            this.b != 0 ? (E("Invalid wire type for skipVarintField"), this.C()) : this.a.kb()
        };
        p.prototype.skipVarintField = p.prototype.lb;
        p.prototype.gb = function() {
            if (this.b != 2) E("Invalid wire type for skipDelimitedField"), this.C();
            else {
                var t = this.a.o();
                this.a.advance(t)
            }
        };
        p.prototype.skipDelimitedField = p.prototype.gb;
        p.prototype.hb = function() {
            this.b != 5 ? (E("Invalid wire type for skipFixed32Field"), this.C()) : this.a.advance(4)
        };
        p.prototype.skipFixed32Field = p.prototype.hb;
        p.prototype.ib = function() {
            this.b != 1 ? (E("Invalid wire type for skipFixed64Field"), this.C()) : this.a.advance(8)
        };
        p.prototype.skipFixed64Field = p.prototype.ib;
        p.prototype.jb = function() {
            var t = this.c;
            do {
                if (!this.oa()) {
                    E("Unmatched start-group tag: stream EOF"), this.h = !0;
                    break
                }
                if (this.b == 4) {
                    this.c != t && (E("Unmatched end-group tag"), this.h = !0);
                    break
                }
                this.C()
            } while (!0)
        };
        p.prototype.skipGroup = p.prototype.jb;
        p.prototype.C = function() {
            switch (this.b) {
                case 0:
                    this.lb();
                    break;
                case 1:
                    this.ib();
                    break;
                case 2:
                    this.gb();
                    break;
                case 5:
                    this.hb();
                    break;
                case 3:
                    this.jb();
                    break;
                default:
                    E("Invalid wire encoding for field.")
            }
        };
        p.prototype.skipField = p.prototype.C;
        p.prototype.Hc = function(t, o) {
            this.v === null && (this.v = {}), h(!this.v[t]), this.v[t] = o
        };
        p.prototype.registerReadCallback = p.prototype.Hc;
        p.prototype.Ic = function(t) {
            return h(this.v !== null), t = this.v[t], h(t), t(this)
        };
        p.prototype.runReadCallback = p.prototype.Ic;
        p.prototype.Yb = function(t, o) {
            h(this.b == 2);
            var e = this.a.c,
                r = this.a.o();
            r = this.a.B() + r, this.a.setEnd(r), o(t, this), this.a.Ma(r), this.a.setEnd(e)
        };
        p.prototype.readMessage = p.prototype.Yb;
        p.prototype.Ub = function(t, o, e) {
            h(this.b == 3), h(this.c == t), e(o, this), this.h || this.b == 4 || (E("Group submessage did not end with an END_GROUP tag"), this.h = !0)
        };
        p.prototype.readGroup = p.prototype.Ub;
        p.prototype.Gb = function() {
            h(this.b == 2);
            var t = this.a.o(),
                o = this.a.B(),
                e = o + t;
            return t = st(this.a.Y(), o, t), this.a.Ma(e), t
        };
        p.prototype.getFieldDecoder = p.prototype.Gb;
        p.prototype.P = function() {
            return h(this.b == 0), this.a.da()
        };
        p.prototype.readInt32 = p.prototype.P;
        p.prototype.Wb = function() {
            return h(this.b == 0), this.a.Ea()
        };
        p.prototype.readInt32String = p.prototype.Wb;
        p.prototype.ba = function() {
            return h(this.b == 0), this.a.sa()
        };
        p.prototype.readInt64 = p.prototype.ba;
        p.prototype.ca = function() {
            return h(this.b == 0), this.a.Fa()
        };
        p.prototype.readInt64String = p.prototype.ca;
        p.prototype.m = function() {
            return h(this.b == 0), this.a.o()
        };
        p.prototype.readUint32 = p.prototype.m;
        p.prototype.Fc = function() {
            return h(this.b == 0), this.a.O()
        };
        p.prototype.readUint32String = p.prototype.Fc;
        p.prototype.ga = function() {
            return h(this.b == 0), this.a.Ga()
        };
        p.prototype.readUint64 = p.prototype.ga;
        p.prototype.ha = function() {
            return h(this.b == 0), this.a.Ha()
        };
        p.prototype.readUint64String = p.prototype.ha;
        p.prototype.zc = function() {
            return h(this.b == 0), this.a.Ia()
        };
        p.prototype.readSint32 = p.prototype.zc;
        p.prototype.Ac = function() {
            return h(this.b == 0), this.a.Ja()
        };
        p.prototype.readSint64 = p.prototype.Ac;
        p.prototype.Bc = function() {
            return h(this.b == 0), this.a.Ka()
        };
        p.prototype.readSint64String = p.prototype.Bc;
        p.prototype.Rb = function() {
            return h(this.b == 5), this.a.m()
        };
        p.prototype.readFixed32 = p.prototype.Rb;
        p.prototype.Sb = function() {
            return h(this.b == 1), this.a.ga()
        };
        p.prototype.readFixed64 = p.prototype.Sb;
        p.prototype.Tb = function() {
            return h(this.b == 1), this.a.ha()
        };
        p.prototype.readFixed64String = p.prototype.Tb;
        p.prototype.vc = function() {
            return h(this.b == 5), this.a.P()
        };
        p.prototype.readSfixed32 = p.prototype.vc;
        p.prototype.wc = function() {
            return h(this.b == 5), this.a.P().toString()
        };
        p.prototype.readSfixed32String = p.prototype.wc;
        p.prototype.xc = function() {
            return h(this.b == 1), this.a.ba()
        };
        p.prototype.readSfixed64 = p.prototype.xc;
        p.prototype.yc = function() {
            return h(this.b == 1), this.a.ca()
        };
        p.prototype.readSfixed64String = p.prototype.yc;
        p.prototype.aa = function() {
            return h(this.b == 5), this.a.aa()
        };
        p.prototype.readFloat = p.prototype.aa;
        p.prototype.Z = function() {
            return h(this.b == 1), this.a.Z()
        };
        p.prototype.readDouble = p.prototype.Z;
        p.prototype.pa = function() {
            return h(this.b == 0), !!this.a.o()
        };
        p.prototype.readBool = p.prototype.pa;
        p.prototype.ra = function() {
            return h(this.b == 0), this.a.sa()
        };
        p.prototype.readEnum = p.prototype.ra;
        p.prototype.fa = function() {
            h(this.b == 2);
            var t = this.a.o();
            return this.a.fa(t)
        };
        p.prototype.readString = p.prototype.fa;
        p.prototype.qa = function() {
            h(this.b == 2);
            var t = this.a.o();
            return this.a.qa(t)
        };
        p.prototype.readBytes = p.prototype.qa;
        p.prototype.ia = function() {
            return h(this.b == 0), this.a.ia()
        };
        p.prototype.readVarintHash64 = p.prototype.ia;
        p.prototype.Cc = function() {
            return h(this.b == 0), this.a.fb()
        };
        p.prototype.readSintHash64 = p.prototype.Cc;
        p.prototype.w = function(t) {
            return h(this.b == 0), this.a.w(t)
        };
        p.prototype.readSplitVarint64 = p.prototype.w;
        p.prototype.ea = function(t) {
            return h(this.b == 0), this.a.w(function(o, e) {
                return it(o, e, t)
            })
        };
        p.prototype.readSplitZigzagVarint64 = p.prototype.ea;
        p.prototype.$ = function() {
            return h(this.b == 1), this.a.$()
        };
        p.prototype.readFixedHash64 = p.prototype.$;
        p.prototype.ta = function(t) {
            return h(this.b == 1), this.a.ta(t)
        };
        p.prototype.readSplitFixed64 = p.prototype.ta;

        function j(t, o) {
            h(t.b == 2);
            var e = t.a.o();
            e = t.a.B() + e;
            for (var r = []; t.a.B() < e;) r.push(o.call(t.a));
            return r
        }
        p.prototype.gc = function() {
            return j(this, this.a.da)
        };
        p.prototype.readPackedInt32 = p.prototype.gc;
        p.prototype.hc = function() {
            return j(this, this.a.Ea)
        };
        p.prototype.readPackedInt32String = p.prototype.hc;
        p.prototype.ic = function() {
            return j(this, this.a.sa)
        };
        p.prototype.readPackedInt64 = p.prototype.ic;
        p.prototype.jc = function() {
            return j(this, this.a.Fa)
        };
        p.prototype.readPackedInt64String = p.prototype.jc;
        p.prototype.qc = function() {
            return j(this, this.a.o)
        };
        p.prototype.readPackedUint32 = p.prototype.qc;
        p.prototype.rc = function() {
            return j(this, this.a.O)
        };
        p.prototype.readPackedUint32String = p.prototype.rc;
        p.prototype.sc = function() {
            return j(this, this.a.Ga)
        };
        p.prototype.readPackedUint64 = p.prototype.sc;
        p.prototype.tc = function() {
            return j(this, this.a.Ha)
        };
        p.prototype.readPackedUint64String = p.prototype.tc;
        p.prototype.nc = function() {
            return j(this, this.a.Ia)
        };
        p.prototype.readPackedSint32 = p.prototype.nc;
        p.prototype.oc = function() {
            return j(this, this.a.Ja)
        };
        p.prototype.readPackedSint64 = p.prototype.oc;
        p.prototype.pc = function() {
            return j(this, this.a.Ka)
        };
        p.prototype.readPackedSint64String = p.prototype.pc;
        p.prototype.bc = function() {
            return j(this, this.a.m)
        };
        p.prototype.readPackedFixed32 = p.prototype.bc;
        p.prototype.cc = function() {
            return j(this, this.a.ga)
        };
        p.prototype.readPackedFixed64 = p.prototype.cc;
        p.prototype.dc = function() {
            return j(this, this.a.ha)
        };
        p.prototype.readPackedFixed64String = p.prototype.dc;
        p.prototype.kc = function() {
            return j(this, this.a.P)
        };
        p.prototype.readPackedSfixed32 = p.prototype.kc;
        p.prototype.lc = function() {
            return j(this, this.a.ba)
        };
        p.prototype.readPackedSfixed64 = p.prototype.lc;
        p.prototype.mc = function() {
            return j(this, this.a.ca)
        };
        p.prototype.readPackedSfixed64String = p.prototype.mc;
        p.prototype.fc = function() {
            return j(this, this.a.aa)
        };
        p.prototype.readPackedFloat = p.prototype.fc;
        p.prototype.$b = function() {
            return j(this, this.a.Z)
        };
        p.prototype.readPackedDouble = p.prototype.$b;
        p.prototype.Zb = function() {
            return j(this, this.a.pa)
        };
        p.prototype.readPackedBool = p.prototype.Zb;
        p.prototype.ac = function() {
            return j(this, this.a.ra)
        };
        p.prototype.readPackedEnum = p.prototype.ac;
        p.prototype.uc = function() {
            return j(this, this.a.ia)
        };
        p.prototype.readPackedVarintHash64 = p.prototype.uc;
        p.prototype.ec = function() {
            return j(this, this.a.$)
        };
        p.prototype.readPackedFixedHash64 = p.prototype.ec;

        function Z(t, o, e, r, n) {
            this.ma = t, this.Ba = o, this.la = e, this.Na = r, this.na = n
        }
        l("jspb.ExtensionFieldInfo", Z, void 0);

        function $t(t, o, e, r, n, s) {
            this.Za = t, this.za = o, this.Aa = e, this.Wa = r, this.Ab = n, this.Nb = s
        }
        l("jspb.ExtensionFieldBinaryInfo", $t, void 0);
        Z.prototype.F = function() {
            return !!this.la
        };
        Z.prototype.isMessageType = Z.prototype.F;

        function f() {}
        l("jspb.Message", f, void 0);
        f.GENERATE_TO_OBJECT = !0;
        f.GENERATE_FROM_OBJECT = !0;
        var ut = typeof Uint8Array == "function";
        f.prototype.Ib = function() {
            return this.b
        };
        f.prototype.getJsPbMessageId = f.prototype.Ib;
        f.initialize = function(t, o, e, r, n, s) {
            t.f = null, o || (o = e ? [e] : []), t.b = e ? String(e) : void 0, t.D = e === 0 ? -1 : 0, t.u = o;
            t: {
                if (e = t.u.length, o = -1, e && (o = e - 1, e = t.u[o], !(e === null || typeof e != "object" || Array.isArray(e) || ut && e instanceof Uint8Array))) {
                    t.G = o - t.D, t.i = e;
                    break t
                } - 1 < r ? (t.G = Math.max(r, o + 1 - t.D), t.i = null) : t.G = Number.MAX_VALUE
            }
            if (t.a = {}, n)
                for (r = 0; r < n.length; r++) o = n[r], o < t.G ? (o += t.D, t.u[o] = t.u[o] || _) : (ht(t), t.i[o] = t.i[o] || _);
            if (s && s.length)
                for (r = 0; r < s.length; r++) jt(t, s[r])
        };
        var _ = Object.freeze ? Object.freeze([]) : [];

        function ht(t) {
            var o = t.G + t.D;
            t.u[o] || (t.i = t.u[o] = {})
        }

        function Kt(t, o, e) {
            for (var r = [], n = 0; n < t.length; n++) r[n] = o.call(t[n], e, t[n]);
            return r
        }
        f.toObjectList = Kt;
        f.toObjectExtension = function(t, o, e, r, n) {
            for (var s in e) {
                var a = e[s],
                    d = r.call(t, a);
                if (d != null) {
                    for (var k in a.Ba)
                        if (a.Ba.hasOwnProperty(k)) break;
                    o[k] = a.Na ? a.na ? Kt(d, a.Na, n) : a.Na(n, d) : d
                }
            }
        };
        f.serializeBinaryExtensions = function(t, o, e, r) {
            for (var n in e) {
                var s = e[n],
                    a = s.Za;
                if (!s.Aa) throw Error("Message extension present that was generated without binary serialization support");
                var d = r.call(t, a);
                if (d != null)
                    if (a.F())
                        if (s.Wa) s.Aa.call(o, a.ma, d, s.Wa);
                        else throw Error("Message extension present holding submessage without binary support enabled, and message is being serialized to binary format");
                else s.Aa.call(o, a.ma, d)
            }
        };
        f.readBinaryExtension = function(t, o, e, r, n) {
            var s = e[o.c];
            if (s) {
                if (e = s.Za, !s.za) throw Error("Deserializing extension whose generated code does not support binary format");
                if (e.F()) {
                    var a = new e.la;
                    s.za.call(o, a, s.Ab)
                } else a = s.za.call(o);
                e.na && !s.Nb ? (o = r.call(t, e)) ? o.push(a) : n.call(t, e, [a]) : n.call(t, e, a)
            } else o.C()
        };

        function I(t, o) {
            if (o < t.G) {
                o += t.D;
                var e = t.u[o];
                return e === _ ? t.u[o] = [] : e
            }
            if (t.i) return e = t.i[o], e === _ ? t.i[o] = [] : e
        }
        f.getField = I;
        f.getRepeatedField = function(t, o) {
            return I(t, o)
        };

        function Xt(t, o) {
            return t = I(t, o), t == null ? t : +t
        }
        f.getOptionalFloatingPointField = Xt;

        function qt(t, o) {
            return t = I(t, o), t == null ? t : !!t
        }
        f.getBooleanField = qt;
        f.getRepeatedFloatingPointField = function(t, o) {
            var e = I(t, o);
            if (t.a || (t.a = {}), !t.a[o]) {
                for (var r = 0; r < e.length; r++) e[r] = +e[r];
                t.a[o] = !0
            }
            return e
        };
        f.getRepeatedBooleanField = function(t, o) {
            var e = I(t, o);
            if (t.a || (t.a = {}), !t.a[o]) {
                for (var r = 0; r < e.length; r++) e[r] = !!e[r];
                t.a[o] = !0
            }
            return e
        };

        function Yt(t) {
            return t == null || typeof t == "string" ? t : ut && t instanceof Uint8Array ? bt(t) : (E("Cannot coerce to b64 string: " + B(t)), null)
        }
        f.bytesAsB64 = Yt;

        function Qt(t) {
            return t == null || t instanceof Uint8Array ? t : typeof t == "string" ? Vt(t) : (E("Cannot coerce to Uint8Array: " + B(t)), null)
        }
        f.bytesAsU8 = Qt;
        f.bytesListAsB64 = function(t) {
            return to(t), t.length && typeof t[0] != "string" ? G(t, Yt) : t
        };
        f.bytesListAsU8 = function(t) {
            return to(t), !t.length || t[0] instanceof Uint8Array ? t : G(t, Qt)
        };

        function to(t) {
            if (t && 1 < t.length) {
                var o = B(t[0]);
                Fo(t, function(e) {
                    B(e) != o && E("Inconsistent type in JSPB repeated field array. Got " + B(e) + " expected " + o)
                })
            }
        }

        function oo(t, o, e) {
            return t = I(t, o), t ?? e
        }
        f.getFieldWithDefault = oo;
        f.getBooleanFieldWithDefault = function(t, o, e) {
            return t = qt(t, o), t ?? e
        };
        f.getFloatingPointFieldWithDefault = function(t, o, e) {
            return t = Xt(t, o), t ?? e
        };
        f.getFieldProto3 = oo;
        f.getMapField = function(t, o, e, r) {
            if (t.f || (t.f = {}), o in t.f) return t.f[o];
            var n = I(t, o);
            if (!n) {
                if (e) return;
                n = [], O(t, o, n)
            }
            return t.f[o] = new v(n, r)
        };

        function O(t, o, e) {
            return C(t, f), o < t.G ? t.u[o + t.D] = e : (ht(t), t.i[o] = e), t
        }
        f.setField = O;
        f.setProto3IntField = function(t, o, e) {
            return V(t, o, e, 0)
        };
        f.setProto3FloatField = function(t, o, e) {
            return V(t, o, e, 0)
        };
        f.setProto3BooleanField = function(t, o, e) {
            return V(t, o, e, !1)
        };
        f.setProto3StringField = function(t, o, e) {
            return V(t, o, e, "")
        };
        f.setProto3BytesField = function(t, o, e) {
            return V(t, o, e, "")
        };
        f.setProto3EnumField = function(t, o, e) {
            return V(t, o, e, 0)
        };
        f.setProto3StringIntField = function(t, o, e) {
            return V(t, o, e, "0")
        };

        function V(t, o, e, r) {
            return C(t, f), e !== r ? O(t, o, e) : o < t.G ? t.u[o + t.D] = null : (ht(t), delete t.i[o]), t
        }
        f.addToRepeatedField = function(t, o, e, r) {
            return C(t, f), o = I(t, o), r != null ? o.splice(r, 0, e) : o.push(e), t
        };

        function eo(t, o, e, r) {
            return C(t, f), (e = jt(t, e)) && e !== o && r !== void 0 && (t.f && e in t.f && (t.f[e] = void 0), O(t, e, void 0)), O(t, o, r)
        }
        f.setOneofField = eo;

        function jt(t, o) {
            for (var e, r, n = 0; n < o.length; n++) {
                var s = o[n],
                    a = I(t, s);
                a != null && (e = s, r = a, O(t, s, void 0))
            }
            return e ? (O(t, e, r), e) : 0
        }
        f.computeOneofCase = jt;
        f.getWrapperField = function(t, o, e, r) {
            if (t.f || (t.f = {}), !t.f[e]) {
                var n = I(t, e);
                (r || n) && (t.f[e] = new o(n))
            }
            return t.f[e]
        };
        f.getRepeatedWrapperField = function(t, o, e) {
            return ro(t, o, e), o = t.f[e], o == _ && (o = t.f[e] = []), o
        };

        function ro(t, o, e) {
            if (t.f || (t.f = {}), !t.f[e]) {
                for (var r = I(t, e), n = [], s = 0; s < r.length; s++) n[s] = new o(r[s]);
                t.f[e] = n
            }
        }
        f.setWrapperField = function(t, o, e) {
            C(t, f), t.f || (t.f = {});
            var r = e && e.g();
            return t.f[o] = e, O(t, o, r)
        };
        f.setOneofWrapperField = function(t, o, e, r) {
            C(t, f), t.f || (t.f = {});
            var n = r && r.g();
            return t.f[o] = r, eo(t, o, e, n)
        };
        f.setRepeatedWrapperField = function(t, o, e) {
            C(t, f), t.f || (t.f = {}), e = e || [];
            for (var r = [], n = 0; n < e.length; n++) r[n] = e[n].g();
            return t.f[o] = e, O(t, o, r)
        };
        f.addToRepeatedWrapperField = function(t, o, e, r, n) {
            ro(t, r, o);
            var s = t.f[o];
            return s || (s = t.f[o] = []), e = e || new r, t = I(t, o), n != null ? (s.splice(n, 0, e), t.splice(n, 0, e.g())) : (s.push(e), t.push(e.g())), e
        };
        f.toMap = function(t, o, e, r) {
            for (var n = {}, s = 0; s < t.length; s++) n[o.call(t[s])] = e ? e.call(t[s], r, t[s]) : t[s];
            return n
        };

        function io(t) {
            if (t.f)
                for (var o in t.f) {
                    var e = t.f[o];
                    if (Array.isArray(e))
                        for (var r = 0; r < e.length; r++) e[r] && e[r].g();
                    else e && e.g()
                }
        }
        f.prototype.g = function() {
            return io(this), this.u
        };
        f.prototype.toArray = f.prototype.g;
        f.prototype.toString = function() {
            return io(this), this.u.toString()
        };
        f.prototype.getExtension = function(t) {
            if (this.i) {
                this.f || (this.f = {});
                var o = t.ma;
                if (t.na) {
                    if (t.F()) return this.f[o] || (this.f[o] = G(this.i[o] || [], function(e) {
                        return new t.la(e)
                    })), this.f[o]
                } else if (t.F()) return !this.f[o] && this.i[o] && (this.f[o] = new t.la(this.i[o])), this.f[o];
                return this.i[o]
            }
        };
        f.prototype.getExtension = f.prototype.getExtension;
        f.prototype.Kc = function(t, o) {
            this.f || (this.f = {}), ht(this);
            var e = t.ma;
            return t.na ? (o = o || [], t.F() ? (this.f[e] = o, this.i[e] = G(o, function(r) {
                return r.g()
            })) : this.i[e] = o) : t.F() ? (this.f[e] = o, this.i[e] = o && o.g()) : this.i[e] = o, this
        };
        f.prototype.setExtension = f.prototype.Kc;
        f.difference = function(t, o) {
            if (!(t instanceof o.constructor)) throw Error("Messages have different types.");
            var e = t.g();
            o = o.g();
            var r = [],
                n = 0,
                s = e.length > o.length ? e.length : o.length;
            for (t.b && (r[0] = t.b, n = 1); n < s; n++) Q(e[n], o[n]) || (r[n] = o[n]);
            return new t.constructor(r)
        };
        f.equals = function(t, o) {
            return t == o || !(!t || !o) && t instanceof o.constructor && Q(t.g(), o.g())
        };

        function ct(t, o) {
            t = t || {}, o = o || {};
            var e = {},
                r;
            for (r in t) e[r] = 0;
            for (r in o) e[r] = 0;
            for (r in e)
                if (!Q(t[r], o[r])) return !1;
            return !0
        }
        f.compareExtensions = ct;

        function Q(t, o) {
            if (t == o) return !0;
            if (!Pt(t) || !Pt(o)) return typeof t == "number" && isNaN(t) || typeof o == "number" && isNaN(o) ? String(t) == String(o) : !1;
            if (t.constructor != o.constructor) return !1;
            if (ut && t.constructor === Uint8Array) {
                if (t.length != o.length) return !1;
                for (var e = 0; e < t.length; e++)
                    if (t[e] != o[e]) return !1;
                return !0
            }
            if (t.constructor === Array) {
                var r = void 0,
                    n = void 0,
                    s = Math.max(t.length, o.length);
                for (e = 0; e < s; e++) {
                    var a = t[e],
                        d = o[e];
                    if (a && a.constructor == Object && (h(r === void 0), h(e === t.length - 1), r = a, a = void 0), d && d.constructor == Object && (h(n === void 0), h(e === o.length - 1), n = d, d = void 0), !Q(a, d)) return !1
                }
                return r || n ? (r = r || {}, n = n || {}, ct(r, n)) : !0
            }
            if (t.constructor === Object) return ct(t, o);
            throw Error("Invalid type in JSPB array")
        }
        f.compareFields = Q;
        f.prototype.Bb = function() {
            return at(this)
        };
        f.prototype.cloneMessage = f.prototype.Bb;
        f.prototype.clone = function() {
            return at(this)
        };
        f.prototype.clone = f.prototype.clone;
        f.clone = function(t) {
            return at(t)
        };

        function at(t) {
            return new t.constructor(dt(t.g()))
        }
        f.copyInto = function(t, o) {
            C(t, f), C(o, f), h(t.constructor == o.constructor, "Copy source and target message should have the same type."), t = at(t);
            for (var e = o.g(), r = t.g(), n = e.length = 0; n < r.length; n++) e[n] = r[n];
            o.f = t.f, o.i = t.i
        };

        function dt(t) {
            if (Array.isArray(t)) {
                for (var o = Array(t.length), e = 0; e < t.length; e++) {
                    var r = t[e];
                    r != null && (o[e] = typeof r == "object" ? dt(h(r)) : r)
                }
                return o
            }
            if (ut && t instanceof Uint8Array) return new Uint8Array(t);
            o = {};
            for (e in t) r = t[e], r != null && (o[e] = typeof r == "object" ? dt(h(r)) : r);
            return o
        }
        f.registerMessageType = function(t, o) {
            o.we = t
        };
        var m = {
            dump: function(t) {
                return C(t, f, "jspb.Message instance expected"), h(t.getExtension, "Only unobfuscated and unoptimized compilation modes supported."), m.X(t)
            }
        };
        l("jspb.debug.dump", m.dump, void 0);
        m.X = function(t) {
            var o = B(t);
            if (o == "number" || o == "string" || o == "boolean" || o == "null" || o == "undefined" || typeof Uint8Array < "u" && t instanceof Uint8Array) return t;
            if (o == "array") return Eo(t), G(t, m.X);
            if (t instanceof v) {
                var e = {};
                t = t.entries();
                for (var r = t.next(); !r.done; r = t.next()) e[r.value[0]] = m.X(r.value[1]);
                return e
            }
            C(t, f, "Only messages expected: " + t), o = t.constructor;
            var n = {
                $name: o.name || o.displayName
            };
            for (d in o.prototype) {
                var s = /^get([A-Z]\w*)/.exec(d);
                if (s && d != "getExtension" && d != "getJsPbMessageId") {
                    var a = "has" + s[1];
                    (!t[a] || t[a]()) && (a = t[d](), n[m.$a(s[1])] = m.X(a))
                }
            }
            if (t.extensionObject_) return n.$extensions = "Recursive dumping of extensions not supported in compiled code. Switch to uncompiled or dump extension object directly", n;
            for (r in o.extensions)
                if (/^\d+$/.test(r)) {
                    a = o.extensions[r];
                    var d = t.getExtension(a);
                    s = void 0, a = a.Ba;
                    var k = [],
                        R = 0;
                    for (s in a) k[R++] = s;
                    s = k[0], d != null && (e || (e = n.$extensions = {}), e[m.$a(s)] = m.X(d))
                } return n
        };
        m.$a = function(t) {
            return t.replace(/^[A-Z]/, function(o) {
                return o.toLowerCase()
            })
        };

        function y() {
            this.a = []
        }
        l("jspb.BinaryEncoder", y, void 0);
        y.prototype.length = function() {
            return this.a.length
        };
        y.prototype.length = y.prototype.length;
        y.prototype.end = function() {
            var t = this.a;
            return this.a = [], t
        };
        y.prototype.end = y.prototype.end;
        y.prototype.l = function(t, o) {
            for (h(t == Math.floor(t)), h(o == Math.floor(o)), h(0 <= t && 4294967296 > t), h(0 <= o && 4294967296 > o); 0 < o || 127 < t;) this.a.push(t & 127 | 128), t = (t >>> 7 | o << 25) >>> 0, o >>>= 7;
            this.a.push(t)
        };
        y.prototype.writeSplitVarint64 = y.prototype.l;
        y.prototype.A = function(t, o) {
            h(t == Math.floor(t)), h(o == Math.floor(o)), h(0 <= t && 4294967296 > t), h(0 <= o && 4294967296 > o), this.s(t), this.s(o)
        };
        y.prototype.writeSplitFixed64 = y.prototype.A;
        y.prototype.j = function(t) {
            for (h(t == Math.floor(t)), h(0 <= t && 4294967296 > t); 127 < t;) this.a.push(t & 127 | 128), t >>>= 7;
            this.a.push(t)
        };
        y.prototype.writeUnsignedVarint32 = y.prototype.j;
        y.prototype.M = function(t) {
            if (h(t == Math.floor(t)), h(-2147483648 <= t && 2147483648 > t), 0 <= t) this.j(t);
            else {
                for (var o = 0; 9 > o; o++) this.a.push(t & 127 | 128), t >>= 7;
                this.a.push(1)
            }
        };
        y.prototype.writeSignedVarint32 = y.prototype.M;
        y.prototype.va = function(t) {
            h(t == Math.floor(t)), h(0 <= t && 18446744073709552e3 > t), $(t), this.l(w, S)
        };
        y.prototype.writeUnsignedVarint64 = y.prototype.va;
        y.prototype.ua = function(t) {
            h(t == Math.floor(t)), h(-9223372036854776e3 <= t && 9223372036854776e3 > t), $(t), this.l(w, S)
        };
        y.prototype.writeSignedVarint64 = y.prototype.ua;
        y.prototype.wa = function(t) {
            h(t == Math.floor(t)), h(-2147483648 <= t && 2147483648 > t), this.j((t << 1 ^ t >> 31) >>> 0)
        };
        y.prototype.writeZigzagVarint32 = y.prototype.wa;
        y.prototype.xa = function(t) {
            h(t == Math.floor(t)), h(-9223372036854776e3 <= t && 9223372036854776e3 > t), Dt(t), this.l(w, S)
        };
        y.prototype.writeZigzagVarint64 = y.prototype.xa;
        y.prototype.Ta = function(t) {
            this.W(Y(t))
        };
        y.prototype.writeZigzagVarint64String = y.prototype.Ta;
        y.prototype.W = function(t) {
            var o = this;
            T(t), rt(w, S, function(e, r) {
                o.l(e >>> 0, r >>> 0)
            })
        };
        y.prototype.writeZigzagVarintHash64 = y.prototype.W;
        y.prototype.be = function(t) {
            h(t == Math.floor(t)), h(0 <= t && 256 > t), this.a.push(t >>> 0 & 255)
        };
        y.prototype.writeUint8 = y.prototype.be;
        y.prototype.ae = function(t) {
            h(t == Math.floor(t)), h(0 <= t && 65536 > t), this.a.push(t >>> 0 & 255), this.a.push(t >>> 8 & 255)
        };
        y.prototype.writeUint16 = y.prototype.ae;
        y.prototype.s = function(t) {
            h(t == Math.floor(t)), h(0 <= t && 4294967296 > t), this.a.push(t >>> 0 & 255), this.a.push(t >>> 8 & 255), this.a.push(t >>> 16 & 255), this.a.push(t >>> 24 & 255)
        };
        y.prototype.writeUint32 = y.prototype.s;
        y.prototype.V = function(t) {
            h(t == Math.floor(t)), h(0 <= t && 18446744073709552e3 > t), St(t), this.s(w), this.s(S)
        };
        y.prototype.writeUint64 = y.prototype.V;
        y.prototype.Qc = function(t) {
            h(t == Math.floor(t)), h(-128 <= t && 128 > t), this.a.push(t >>> 0 & 255)
        };
        y.prototype.writeInt8 = y.prototype.Qc;
        y.prototype.Pc = function(t) {
            h(t == Math.floor(t)), h(-32768 <= t && 32768 > t), this.a.push(t >>> 0 & 255), this.a.push(t >>> 8 & 255)
        };
        y.prototype.writeInt16 = y.prototype.Pc;
        y.prototype.S = function(t) {
            h(t == Math.floor(t)), h(-2147483648 <= t && 2147483648 > t), this.a.push(t >>> 0 & 255), this.a.push(t >>> 8 & 255), this.a.push(t >>> 16 & 255), this.a.push(t >>> 24 & 255)
        };
        y.prototype.writeInt32 = y.prototype.S;
        y.prototype.T = function(t) {
            h(t == Math.floor(t)), h(-9223372036854776e3 <= t && 9223372036854776e3 > t), $(t), this.A(w, S)
        };
        y.prototype.writeInt64 = y.prototype.T;
        y.prototype.ka = function(t) {
            h(t == Math.floor(t)), h(-9223372036854776e3 <= +t && 9223372036854776e3 > +t), T(Y(t)), this.A(w, S)
        };
        y.prototype.writeInt64String = y.prototype.ka;
        y.prototype.L = function(t) {
            h(t === 1 / 0 || t === -1 / 0 || isNaN(t) || -34028234663852886e22 <= t && 34028234663852886e22 >= t), zt(t), this.s(w)
        };
        y.prototype.writeFloat = y.prototype.L;
        y.prototype.J = function(t) {
            h(t === 1 / 0 || t === -1 / 0 || isNaN(t) || -17976931348623157e292 <= t && 17976931348623157e292 >= t), Wt(t), this.s(w), this.s(S)
        };
        y.prototype.writeDouble = y.prototype.J;
        y.prototype.I = function(t) {
            h(typeof t == "boolean" || typeof t == "number"), this.a.push(t ? 1 : 0)
        };
        y.prototype.writeBool = y.prototype.I;
        y.prototype.R = function(t) {
            h(t == Math.floor(t)), h(-2147483648 <= t && 2147483648 > t), this.M(t)
        };
        y.prototype.writeEnum = y.prototype.R;
        y.prototype.ja = function(t) {
            this.a.push.apply(this.a, t)
        };
        y.prototype.writeBytes = y.prototype.ja;
        y.prototype.N = function(t) {
            T(t), this.l(w, S)
        };
        y.prototype.writeVarintHash64 = y.prototype.N;
        y.prototype.K = function(t) {
            T(t), this.s(w), this.s(S)
        };
        y.prototype.writeFixedHash64 = y.prototype.K;
        y.prototype.U = function(t) {
            var o = this.a.length;
            ko(t);
            for (var e = 0; e < t.length; e++) {
                var r = t.charCodeAt(e);
                if (128 > r) this.a.push(r);
                else if (2048 > r) this.a.push(r >> 6 | 192), this.a.push(r & 63 | 128);
                else if (65536 > r)
                    if (55296 <= r && 56319 >= r && e + 1 < t.length) {
                        var n = t.charCodeAt(e + 1);
                        56320 <= n && 57343 >= n && (r = 1024 * (r - 55296) + n - 56320 + 65536, this.a.push(r >> 18 | 240), this.a.push(r >> 12 & 63 | 128), this.a.push(r >> 6 & 63 | 128), this.a.push(r & 63 | 128), e++)
                    } else this.a.push(r >> 12 | 224), this.a.push(r >> 6 & 63 | 128), this.a.push(r & 63 | 128)
            }
            return this.a.length - o
        };
        y.prototype.writeString = y.prototype.U;

        function c(t, o) {
            this.lo = t, this.hi = o
        }
        l("jspb.arith.UInt64", c, void 0);
        c.prototype.cmp = function(t) {
            return this.hi < t.hi || this.hi == t.hi && this.lo < t.lo ? -1 : this.hi == t.hi && this.lo == t.lo ? 0 : 1
        };
        c.prototype.cmp = c.prototype.cmp;
        c.prototype.La = function() {
            return new c((this.lo >>> 1 | (this.hi & 1) << 31) >>> 0, this.hi >>> 1 >>> 0)
        };
        c.prototype.rightShift = c.prototype.La;
        c.prototype.Da = function() {
            return new c(this.lo << 1 >>> 0, (this.hi << 1 | this.lo >>> 31) >>> 0)
        };
        c.prototype.leftShift = c.prototype.Da;
        c.prototype.cb = function() {
            return !!(this.hi & 2147483648)
        };
        c.prototype.msb = c.prototype.cb;
        c.prototype.Ob = function() {
            return !!(this.lo & 1)
        };
        c.prototype.lsb = c.prototype.Ob;
        c.prototype.Ua = function() {
            return this.lo == 0 && this.hi == 0
        };
        c.prototype.zero = c.prototype.Ua;
        c.prototype.add = function(t) {
            return new c((this.lo + t.lo & 4294967295) >>> 0 >>> 0, ((this.hi + t.hi & 4294967295) >>> 0) + (4294967296 <= this.lo + t.lo ? 1 : 0) >>> 0)
        };
        c.prototype.add = c.prototype.add;
        c.prototype.sub = function(t) {
            return new c((this.lo - t.lo & 4294967295) >>> 0 >>> 0, ((this.hi - t.hi & 4294967295) >>> 0) - (0 > this.lo - t.lo ? 1 : 0) >>> 0)
        };
        c.prototype.sub = c.prototype.sub;

        function gt(t, o) {
            var e = t & 65535;
            t >>>= 16;
            var r = o & 65535,
                n = o >>> 16;
            for (o = e * r + 65536 * (e * n & 65535) + 65536 * (t * r & 65535), e = t * n + (e * n >>> 16) + (t * r >>> 16); 4294967296 <= o;) o -= 4294967296, e += 1;
            return new c(o >>> 0, e >>> 0)
        }
        c.mul32x32 = gt;
        c.prototype.eb = function(t) {
            var o = gt(this.lo, t);
            return t = gt(this.hi, t), t.hi = t.lo, t.lo = 0, o.add(t)
        };
        c.prototype.mul = c.prototype.eb;
        c.prototype.Xa = function(t) {
            if (t == 0) return [];
            var o = new c(0, 0),
                e = new c(this.lo, this.hi);
            t = new c(t, 0);
            for (var r = new c(1, 0); !t.cb();) t = t.Da(), r = r.Da();
            for (; !r.Ua();) 0 >= t.cmp(e) && (o = o.add(r), e = e.sub(t)), t = t.La(), r = r.La();
            return [o, e]
        };
        c.prototype.div = c.prototype.Xa;
        c.prototype.toString = function() {
            for (var t = "", o = this; !o.Ua();) {
                o = o.Xa(10);
                var e = o[0];
                t = o[1].lo + t, o = e
            }
            return t == "" && (t = "0"), t
        };
        c.prototype.toString = c.prototype.toString;

        function W(t) {
            for (var o = new c(0, 0), e = new c(0, 0), r = 0; r < t.length; r++) {
                if ("0" > t[r] || "9" < t[r]) return null;
                e.lo = parseInt(t[r], 10), o = o.eb(10).add(e)
            }
            return o
        }
        c.fromString = W;
        c.prototype.clone = function() {
            return new c(this.lo, this.hi)
        };
        c.prototype.clone = c.prototype.clone;

        function A(t, o) {
            this.lo = t, this.hi = o
        }
        l("jspb.arith.Int64", A, void 0);
        A.prototype.add = function(t) {
            return new A((this.lo + t.lo & 4294967295) >>> 0 >>> 0, ((this.hi + t.hi & 4294967295) >>> 0) + (4294967296 <= this.lo + t.lo ? 1 : 0) >>> 0)
        };
        A.prototype.add = A.prototype.add;
        A.prototype.sub = function(t) {
            return new A((this.lo - t.lo & 4294967295) >>> 0 >>> 0, ((this.hi - t.hi & 4294967295) >>> 0) - (0 > this.lo - t.lo ? 1 : 0) >>> 0)
        };
        A.prototype.sub = A.prototype.sub;
        A.prototype.clone = function() {
            return new A(this.lo, this.hi)
        };
        A.prototype.clone = A.prototype.clone;
        A.prototype.toString = function() {
            var t = (this.hi & 2147483648) != 0,
                o = new c(this.lo, this.hi);
            return t && (o = new c(0, 0).sub(o)), (t ? "-" : "") + o.toString()
        };
        A.prototype.toString = A.prototype.toString;

        function yt(t) {
            var o = 0 < t.length && t[0] == "-";
            return o && (t = t.substring(1)), t = W(t), t === null ? null : (o && (t = new c(0, 0).sub(t)), new A(t.lo, t.hi))
        }
        A.fromString = yt;

        function i() {
            this.c = [], this.b = 0, this.a = new y, this.h = []
        }
        l("jspb.BinaryWriter", i, void 0);

        function no(t, o) {
            var e = t.a.end();
            t.c.push(e), t.c.push(o), t.b += e.length + o.length
        }

        function F(t, o) {
            return g(t, o, 2), o = t.a.end(), t.c.push(o), t.b += o.length, o.push(t.b), o
        }

        function x(t, o) {
            var e = o.pop();
            for (e = t.b + t.a.length() - e, h(0 <= e); 127 < e;) o.push(e & 127 | 128), e >>>= 7, t.b++;
            o.push(e), t.b++
        }
        i.prototype.pb = function(t, o, e) {
            no(this, t.subarray(o, e))
        };
        i.prototype.writeSerializedMessage = i.prototype.pb;
        i.prototype.Pb = function(t, o, e) {
            t != null && o != null && e != null && this.pb(t, o, e)
        };
        i.prototype.maybeWriteSerializedMessage = i.prototype.Pb;
        i.prototype.reset = function() {
            this.c = [], this.a.end(), this.b = 0, this.h = []
        };
        i.prototype.reset = i.prototype.reset;
        i.prototype.ab = function() {
            h(this.h.length == 0);
            for (var t = new Uint8Array(this.b + this.a.length()), o = this.c, e = o.length, r = 0, n = 0; n < e; n++) {
                var s = o[n];
                t.set(s, r), r += s.length
            }
            return o = this.a.end(), t.set(o, r), r += o.length, h(r == t.length), this.c = [t], t
        };
        i.prototype.getResultBuffer = i.prototype.ab;
        i.prototype.Kb = function(t) {
            return bt(this.ab(), t)
        };
        i.prototype.getResultBase64String = i.prototype.Kb;
        i.prototype.Va = function(t) {
            this.h.push(F(this, t))
        };
        i.prototype.beginSubMessage = i.prototype.Va;
        i.prototype.Ya = function() {
            h(0 <= this.h.length), x(this, this.h.pop())
        };
        i.prototype.endSubMessage = i.prototype.Ya;

        function g(t, o, e) {
            h(1 <= o && o == Math.floor(o)), t.a.j(8 * o + e)
        }
        i.prototype.Nc = function(t, o, e) {
            switch (t) {
                case 1:
                    this.J(o, e);
                    break;
                case 2:
                    this.L(o, e);
                    break;
                case 3:
                    this.T(o, e);
                    break;
                case 4:
                    this.V(o, e);
                    break;
                case 5:
                    this.S(o, e);
                    break;
                case 6:
                    this.Qa(o, e);
                    break;
                case 7:
                    this.Pa(o, e);
                    break;
                case 8:
                    this.I(o, e);
                    break;
                case 9:
                    this.U(o, e);
                    break;
                case 10:
                    E("Group field type not supported in writeAny()");
                    break;
                case 11:
                    E("Message field type not supported in writeAny()");
                    break;
                case 12:
                    this.ja(o, e);
                    break;
                case 13:
                    this.s(o, e);
                    break;
                case 14:
                    this.R(o, e);
                    break;
                case 15:
                    this.Ra(o, e);
                    break;
                case 16:
                    this.Sa(o, e);
                    break;
                case 17:
                    this.rb(o, e);
                    break;
                case 18:
                    this.sb(o, e);
                    break;
                case 30:
                    this.K(o, e);
                    break;
                case 31:
                    this.N(o, e);
                    break;
                default:
                    E("Invalid field type in writeAny()")
            }
        };
        i.prototype.writeAny = i.prototype.Nc;

        function Ft(t, o, e) {
            e != null && (g(t, o, 0), t.a.j(e))
        }

        function xt(t, o, e) {
            e != null && (g(t, o, 0), t.a.M(e))
        }
        i.prototype.S = function(t, o) {
            o != null && (h(-2147483648 <= o && 2147483648 > o), xt(this, t, o))
        };
        i.prototype.writeInt32 = i.prototype.S;
        i.prototype.ob = function(t, o) {
            o != null && (o = parseInt(o, 10), h(-2147483648 <= o && 2147483648 > o), xt(this, t, o))
        };
        i.prototype.writeInt32String = i.prototype.ob;
        i.prototype.T = function(t, o) {
            o != null && (h(-9223372036854776e3 <= o && 9223372036854776e3 > o), o != null && (g(this, t, 0), this.a.ua(o)))
        };
        i.prototype.writeInt64 = i.prototype.T;
        i.prototype.ka = function(t, o) {
            o != null && (o = yt(o), g(this, t, 0), this.a.l(o.lo, o.hi))
        };
        i.prototype.writeInt64String = i.prototype.ka;
        i.prototype.s = function(t, o) {
            o != null && (h(0 <= o && 4294967296 > o), Ft(this, t, o))
        };
        i.prototype.writeUint32 = i.prototype.s;
        i.prototype.ub = function(t, o) {
            o != null && (o = parseInt(o, 10), h(0 <= o && 4294967296 > o), Ft(this, t, o))
        };
        i.prototype.writeUint32String = i.prototype.ub;
        i.prototype.V = function(t, o) {
            o != null && (h(0 <= o && 18446744073709552e3 > o), o != null && (g(this, t, 0), this.a.va(o)))
        };
        i.prototype.writeUint64 = i.prototype.V;
        i.prototype.vb = function(t, o) {
            o != null && (o = W(o), g(this, t, 0), this.a.l(o.lo, o.hi))
        };
        i.prototype.writeUint64String = i.prototype.vb;
        i.prototype.rb = function(t, o) {
            o != null && (h(-2147483648 <= o && 2147483648 > o), o != null && (g(this, t, 0), this.a.wa(o)))
        };
        i.prototype.writeSint32 = i.prototype.rb;
        i.prototype.sb = function(t, o) {
            o != null && (h(-9223372036854776e3 <= o && 9223372036854776e3 > o), o != null && (g(this, t, 0), this.a.xa(o)))
        };
        i.prototype.writeSint64 = i.prototype.sb;
        i.prototype.$d = function(t, o) {
            o != null && o != null && (g(this, t, 0), this.a.W(o))
        };
        i.prototype.writeSintHash64 = i.prototype.$d;
        i.prototype.Zd = function(t, o) {
            o != null && o != null && (g(this, t, 0), this.a.Ta(o))
        };
        i.prototype.writeSint64String = i.prototype.Zd;
        i.prototype.Pa = function(t, o) {
            o != null && (h(0 <= o && 4294967296 > o), g(this, t, 5), this.a.s(o))
        };
        i.prototype.writeFixed32 = i.prototype.Pa;
        i.prototype.Qa = function(t, o) {
            o != null && (h(0 <= o && 18446744073709552e3 > o), g(this, t, 1), this.a.V(o))
        };
        i.prototype.writeFixed64 = i.prototype.Qa;
        i.prototype.nb = function(t, o) {
            o != null && (o = W(o), g(this, t, 1), this.a.A(o.lo, o.hi))
        };
        i.prototype.writeFixed64String = i.prototype.nb;
        i.prototype.Ra = function(t, o) {
            o != null && (h(-2147483648 <= o && 2147483648 > o), g(this, t, 5), this.a.S(o))
        };
        i.prototype.writeSfixed32 = i.prototype.Ra;
        i.prototype.Sa = function(t, o) {
            o != null && (h(-9223372036854776e3 <= o && 9223372036854776e3 > o), g(this, t, 1), this.a.T(o))
        };
        i.prototype.writeSfixed64 = i.prototype.Sa;
        i.prototype.qb = function(t, o) {
            o != null && (o = yt(o), g(this, t, 1), this.a.A(o.lo, o.hi))
        };
        i.prototype.writeSfixed64String = i.prototype.qb;
        i.prototype.L = function(t, o) {
            o != null && (g(this, t, 5), this.a.L(o))
        };
        i.prototype.writeFloat = i.prototype.L;
        i.prototype.J = function(t, o) {
            o != null && (g(this, t, 1), this.a.J(o))
        };
        i.prototype.writeDouble = i.prototype.J;
        i.prototype.I = function(t, o) {
            o != null && (h(typeof o == "boolean" || typeof o == "number"), g(this, t, 0), this.a.I(o))
        };
        i.prototype.writeBool = i.prototype.I;
        i.prototype.R = function(t, o) {
            o != null && (h(-2147483648 <= o && 2147483648 > o), g(this, t, 0), this.a.M(o))
        };
        i.prototype.writeEnum = i.prototype.R;
        i.prototype.U = function(t, o) {
            o != null && (t = F(this, t), this.a.U(o), x(this, t))
        };
        i.prototype.writeString = i.prototype.U;
        i.prototype.ja = function(t, o) {
            o != null && (o = pt(o), g(this, t, 2), this.a.j(o.length), no(this, o))
        };
        i.prototype.writeBytes = i.prototype.ja;
        i.prototype.Rc = function(t, o, e) {
            o != null && (t = F(this, t), e(o, this), x(this, t))
        };
        i.prototype.writeMessage = i.prototype.Rc;
        i.prototype.Sc = function(t, o, e) {
            o != null && (g(this, 1, 3), g(this, 2, 0), this.a.M(t), t = F(this, 3), e(o, this), x(this, t), g(this, 1, 4))
        };
        i.prototype.writeMessageSet = i.prototype.Sc;
        i.prototype.Oc = function(t, o, e) {
            o != null && (g(this, t, 3), e(o, this), g(this, t, 4))
        };
        i.prototype.writeGroup = i.prototype.Oc;
        i.prototype.K = function(t, o) {
            o != null && (h(o.length == 8), g(this, t, 1), this.a.K(o))
        };
        i.prototype.writeFixedHash64 = i.prototype.K;
        i.prototype.N = function(t, o) {
            o != null && (h(o.length == 8), g(this, t, 0), this.a.N(o))
        };
        i.prototype.writeVarintHash64 = i.prototype.N;
        i.prototype.A = function(t, o, e) {
            g(this, t, 1), this.a.A(o, e)
        };
        i.prototype.writeSplitFixed64 = i.prototype.A;
        i.prototype.l = function(t, o, e) {
            g(this, t, 0), this.a.l(o, e)
        };
        i.prototype.writeSplitVarint64 = i.prototype.l;
        i.prototype.tb = function(t, o, e) {
            g(this, t, 0);
            var r = this.a;
            rt(o, e, function(n, s) {
                r.l(n >>> 0, s >>> 0)
            })
        };
        i.prototype.writeSplitZigzagVarint64 = i.prototype.tb;
        i.prototype.Ed = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) xt(this, t, o[e])
        };
        i.prototype.writeRepeatedInt32 = i.prototype.Ed;
        i.prototype.Fd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.ob(t, o[e])
        };
        i.prototype.writeRepeatedInt32String = i.prototype.Fd;
        i.prototype.Gd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) {
                    var r = o[e];
                    r != null && (g(this, t, 0), this.a.ua(r))
                }
        };
        i.prototype.writeRepeatedInt64 = i.prototype.Gd;
        i.prototype.Qd = function(t, o, e, r) {
            if (o != null)
                for (var n = 0; n < o.length; n++) this.A(t, e(o[n]), r(o[n]))
        };
        i.prototype.writeRepeatedSplitFixed64 = i.prototype.Qd;
        i.prototype.Rd = function(t, o, e, r) {
            if (o != null)
                for (var n = 0; n < o.length; n++) this.l(t, e(o[n]), r(o[n]))
        };
        i.prototype.writeRepeatedSplitVarint64 = i.prototype.Rd;
        i.prototype.Sd = function(t, o, e, r) {
            if (o != null)
                for (var n = 0; n < o.length; n++) this.tb(t, e(o[n]), r(o[n]))
        };
        i.prototype.writeRepeatedSplitZigzagVarint64 = i.prototype.Sd;
        i.prototype.Hd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.ka(t, o[e])
        };
        i.prototype.writeRepeatedInt64String = i.prototype.Hd;
        i.prototype.Ud = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) Ft(this, t, o[e])
        };
        i.prototype.writeRepeatedUint32 = i.prototype.Ud;
        i.prototype.Vd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.ub(t, o[e])
        };
        i.prototype.writeRepeatedUint32String = i.prototype.Vd;
        i.prototype.Wd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) {
                    var r = o[e];
                    r != null && (g(this, t, 0), this.a.va(r))
                }
        };
        i.prototype.writeRepeatedUint64 = i.prototype.Wd;
        i.prototype.Xd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.vb(t, o[e])
        };
        i.prototype.writeRepeatedUint64String = i.prototype.Xd;
        i.prototype.Md = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) {
                    var r = o[e];
                    r != null && (g(this, t, 0), this.a.wa(r))
                }
        };
        i.prototype.writeRepeatedSint32 = i.prototype.Md;
        i.prototype.Nd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) {
                    var r = o[e];
                    r != null && (g(this, t, 0), this.a.xa(r))
                }
        };
        i.prototype.writeRepeatedSint64 = i.prototype.Nd;
        i.prototype.Od = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) {
                    var r = o[e];
                    r != null && (g(this, t, 0), this.a.Ta(r))
                }
        };
        i.prototype.writeRepeatedSint64String = i.prototype.Od;
        i.prototype.Pd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) {
                    var r = o[e];
                    r != null && (g(this, t, 0), this.a.W(r))
                }
        };
        i.prototype.writeRepeatedSintHash64 = i.prototype.Pd;
        i.prototype.yd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.Pa(t, o[e])
        };
        i.prototype.writeRepeatedFixed32 = i.prototype.yd;
        i.prototype.zd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.Qa(t, o[e])
        };
        i.prototype.writeRepeatedFixed64 = i.prototype.zd;
        i.prototype.Ad = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.nb(t, o[e])
        };
        i.prototype.writeRepeatedFixed64String = i.prototype.Ad;
        i.prototype.Jd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.Ra(t, o[e])
        };
        i.prototype.writeRepeatedSfixed32 = i.prototype.Jd;
        i.prototype.Kd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.Sa(t, o[e])
        };
        i.prototype.writeRepeatedSfixed64 = i.prototype.Kd;
        i.prototype.Ld = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.qb(t, o[e])
        };
        i.prototype.writeRepeatedSfixed64String = i.prototype.Ld;
        i.prototype.Cd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.L(t, o[e])
        };
        i.prototype.writeRepeatedFloat = i.prototype.Cd;
        i.prototype.wd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.J(t, o[e])
        };
        i.prototype.writeRepeatedDouble = i.prototype.wd;
        i.prototype.ud = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.I(t, o[e])
        };
        i.prototype.writeRepeatedBool = i.prototype.ud;
        i.prototype.xd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.R(t, o[e])
        };
        i.prototype.writeRepeatedEnum = i.prototype.xd;
        i.prototype.Td = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.U(t, o[e])
        };
        i.prototype.writeRepeatedString = i.prototype.Td;
        i.prototype.vd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.ja(t, o[e])
        };
        i.prototype.writeRepeatedBytes = i.prototype.vd;
        i.prototype.Id = function(t, o, e) {
            if (o != null)
                for (var r = 0; r < o.length; r++) {
                    var n = F(this, t);
                    e(o[r], this), x(this, n)
                }
        };
        i.prototype.writeRepeatedMessage = i.prototype.Id;
        i.prototype.Dd = function(t, o, e) {
            if (o != null)
                for (var r = 0; r < o.length; r++) g(this, t, 3), e(o[r], this), g(this, t, 4)
        };
        i.prototype.writeRepeatedGroup = i.prototype.Dd;
        i.prototype.Bd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.K(t, o[e])
        };
        i.prototype.writeRepeatedFixedHash64 = i.prototype.Bd;
        i.prototype.Yd = function(t, o) {
            if (o != null)
                for (var e = 0; e < o.length; e++) this.N(t, o[e])
        };
        i.prototype.writeRepeatedVarintHash64 = i.prototype.Yd;
        i.prototype.ad = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.M(o[e]);
                x(this, t)
            }
        };
        i.prototype.writePackedInt32 = i.prototype.ad;
        i.prototype.bd = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.M(parseInt(o[e], 10));
                x(this, t)
            }
        };
        i.prototype.writePackedInt32String = i.prototype.bd;
        i.prototype.cd = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.ua(o[e]);
                x(this, t)
            }
        };
        i.prototype.writePackedInt64 = i.prototype.cd;
        i.prototype.md = function(t, o, e, r) {
            if (o != null) {
                t = F(this, t);
                for (var n = 0; n < o.length; n++) this.a.A(e(o[n]), r(o[n]));
                x(this, t)
            }
        };
        i.prototype.writePackedSplitFixed64 = i.prototype.md;
        i.prototype.nd = function(t, o, e, r) {
            if (o != null) {
                t = F(this, t);
                for (var n = 0; n < o.length; n++) this.a.l(e(o[n]), r(o[n]));
                x(this, t)
            }
        };
        i.prototype.writePackedSplitVarint64 = i.prototype.nd;
        i.prototype.od = function(t, o, e, r) {
            if (o != null) {
                t = F(this, t);
                for (var n = this.a, s = 0; s < o.length; s++) rt(e(o[s]), r(o[s]), function(a, d) {
                    n.l(a >>> 0, d >>> 0)
                });
                x(this, t)
            }
        };
        i.prototype.writePackedSplitZigzagVarint64 = i.prototype.od;
        i.prototype.dd = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) {
                    var r = yt(o[e]);
                    this.a.l(r.lo, r.hi)
                }
                x(this, t)
            }
        };
        i.prototype.writePackedInt64String = i.prototype.dd;
        i.prototype.pd = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.j(o[e]);
                x(this, t)
            }
        };
        i.prototype.writePackedUint32 = i.prototype.pd;
        i.prototype.qd = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.j(parseInt(o[e], 10));
                x(this, t)
            }
        };
        i.prototype.writePackedUint32String = i.prototype.qd;
        i.prototype.rd = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.va(o[e]);
                x(this, t)
            }
        };
        i.prototype.writePackedUint64 = i.prototype.rd;
        i.prototype.sd = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) {
                    var r = W(o[e]);
                    this.a.l(r.lo, r.hi)
                }
                x(this, t)
            }
        };
        i.prototype.writePackedUint64String = i.prototype.sd;
        i.prototype.hd = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.wa(o[e]);
                x(this, t)
            }
        };
        i.prototype.writePackedSint32 = i.prototype.hd;
        i.prototype.jd = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.xa(o[e]);
                x(this, t)
            }
        };
        i.prototype.writePackedSint64 = i.prototype.jd;
        i.prototype.kd = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.W(Y(o[e]));
                x(this, t)
            }
        };
        i.prototype.writePackedSint64String = i.prototype.kd;
        i.prototype.ld = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.W(o[e]);
                x(this, t)
            }
        };
        i.prototype.writePackedSintHash64 = i.prototype.ld;
        i.prototype.Wc = function(t, o) {
            if (o != null && o.length)
                for (g(this, t, 2), this.a.j(4 * o.length), t = 0; t < o.length; t++) this.a.s(o[t])
        };
        i.prototype.writePackedFixed32 = i.prototype.Wc;
        i.prototype.Xc = function(t, o) {
            if (o != null && o.length)
                for (g(this, t, 2), this.a.j(8 * o.length), t = 0; t < o.length; t++) this.a.V(o[t])
        };
        i.prototype.writePackedFixed64 = i.prototype.Xc;
        i.prototype.Yc = function(t, o) {
            if (o != null && o.length)
                for (g(this, t, 2), this.a.j(8 * o.length), t = 0; t < o.length; t++) {
                    var e = W(o[t]);
                    this.a.A(e.lo, e.hi)
                }
        };
        i.prototype.writePackedFixed64String = i.prototype.Yc;
        i.prototype.ed = function(t, o) {
            if (o != null && o.length)
                for (g(this, t, 2), this.a.j(4 * o.length), t = 0; t < o.length; t++) this.a.S(o[t])
        };
        i.prototype.writePackedSfixed32 = i.prototype.ed;
        i.prototype.fd = function(t, o) {
            if (o != null && o.length)
                for (g(this, t, 2), this.a.j(8 * o.length), t = 0; t < o.length; t++) this.a.T(o[t])
        };
        i.prototype.writePackedSfixed64 = i.prototype.fd;
        i.prototype.gd = function(t, o) {
            if (o != null && o.length)
                for (g(this, t, 2), this.a.j(8 * o.length), t = 0; t < o.length; t++) this.a.ka(o[t])
        };
        i.prototype.writePackedSfixed64String = i.prototype.gd;
        i.prototype.$c = function(t, o) {
            if (o != null && o.length)
                for (g(this, t, 2), this.a.j(4 * o.length), t = 0; t < o.length; t++) this.a.L(o[t])
        };
        i.prototype.writePackedFloat = i.prototype.$c;
        i.prototype.Uc = function(t, o) {
            if (o != null && o.length)
                for (g(this, t, 2), this.a.j(8 * o.length), t = 0; t < o.length; t++) this.a.J(o[t])
        };
        i.prototype.writePackedDouble = i.prototype.Uc;
        i.prototype.Tc = function(t, o) {
            if (o != null && o.length)
                for (g(this, t, 2), this.a.j(o.length), t = 0; t < o.length; t++) this.a.I(o[t])
        };
        i.prototype.writePackedBool = i.prototype.Tc;
        i.prototype.Vc = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.R(o[e]);
                x(this, t)
            }
        };
        i.prototype.writePackedEnum = i.prototype.Vc;
        i.prototype.Zc = function(t, o) {
            if (o != null && o.length)
                for (g(this, t, 2), this.a.j(8 * o.length), t = 0; t < o.length; t++) this.a.K(o[t])
        };
        i.prototype.writePackedFixedHash64 = i.prototype.Zc;
        i.prototype.td = function(t, o) {
            if (o != null && o.length) {
                t = F(this, t);
                for (var e = 0; e < o.length; e++) this.a.N(o[e]);
                x(this, t)
            }
        };
        i.prototype.writePackedVarintHash64 = i.prototype.td;
        typeof P == "object" && (P.debug = m, P.Map = v, P.Message = f, P.BinaryReader = p, P.BinaryWriter = i, P.ExtensionFieldInfo = Z, P.ExtensionFieldBinaryInfo = $t, P.exportSymbol = wo, P.inherits = So, P.object = {
            extend: jo
        }, P.typeOf = B)
    });
    var uo = At(so => {
        var M = po(),
            ft = M,
            kt = function() {
                return this ? this : typeof window < "u" ? window : typeof kt < "u" ? kt : typeof self < "u" ? self : Function("return this")()
            }.call(null);
        ft.exportSymbol("proto.person.Person", null, kt);
        proto.person.Person = function(t) {
            M.Message.initialize(this, t, 0, -1, null, null)
        };
        ft.inherits(proto.person.Person, M.Message);
        ft.DEBUG && !COMPILED && (proto.person.Person.displayName = "proto.person.Person");
        M.Message.GENERATE_TO_OBJECT && (proto.person.Person.prototype.toObject = function(t) {
            return proto.person.Person.toObject(t, this)
        }, proto.person.Person.toObject = function(t, o) {
            var e, r = {
                name: M.Message.getFieldWithDefault(o, 1, ""),
                id: M.Message.getFieldWithDefault(o, 2, 0),
                email: M.Message.getFieldWithDefault(o, 3, "")
            };
            return t && (r.$jspbMessageInstance = o), r
        });
        proto.person.Person.deserializeBinary = function(t) {
            var o = new M.BinaryReader(t),
                e = new proto.person.Person;
            return proto.person.Person.deserializeBinaryFromReader(e, o)
        };
        proto.person.Person.deserializeBinaryFromReader = function(t, o) {
            for (; o.nextField() && !o.isEndGroup();) {
                var e = o.getFieldNumber();
                switch (e) {
                    case 1:
                        var r = o.readString();
                        t.setName(r);
                        break;
                    case 2:
                        var r = o.readUint32();
                        t.setId(r);
                        break;
                    case 3:
                        var r = o.readString();
                        t.setEmail(r);
                        break;
                    default:
                        o.skipField();
                        break
                }
            }
            return t
        };
        proto.person.Person.prototype.serializeBinary = function() {
            var t = new M.BinaryWriter;
            return proto.person.Person.serializeBinaryToWriter(this, t), t.getResultBuffer()
        };
        proto.person.Person.serializeBinaryToWriter = function(t, o) {
            var e = void 0;
            e = t.getName(), e.length > 0 && o.writeString(1, e), e = t.getId(), e !== 0 && o.writeUint32(2, e), e = t.getEmail(), e.length > 0 && o.writeString(3, e)
        };
        proto.person.Person.prototype.getName = function() {
            return M.Message.getFieldWithDefault(this, 1, "")
        };
        proto.person.Person.prototype.setName = function(t) {
            return M.Message.setProto3StringField(this, 1, t)
        };
        proto.person.Person.prototype.getId = function() {
            return M.Message.getFieldWithDefault(this, 2, 0)
        };
        proto.person.Person.prototype.setId = function(t) {
            return M.Message.setProto3IntField(this, 2, t)
        };
        proto.person.Person.prototype.getEmail = function() {
            return M.Message.getFieldWithDefault(this, 3, "")
        };
        proto.person.Person.prototype.setEmail = function(t) {
            return M.Message.setProto3StringField(this, 3, t)
        };
        ft.object.extend(so, proto.person)
    });
    var ho = uo(),
        tt = new ho.Person;
    tt.setName("john doe");
    tt.setId(99);
    tt.setEmail("test@example.com");
    var Mo = tt.toObject();
    window.result = Object.keys(Mo).join(",") + Object.values(Mo).join(",")
})();
