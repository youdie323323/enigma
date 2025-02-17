var __p_CliD_array, __globalObject, __TextDecoder, __Uint8Array, __Buffer, __String, __Array, utf8ArrayToStr;
const __p_QZvz_dlrArray = [0x0, 0x1, 0x8, 0xff, "length", 0x3f, 0x6, "fromCodePoint", 0x7, 0xc, "push", "undefined", 0x5b, 0x1fff, 0x58, 0xd, 0xe];
function __p_9lgU_MAIN_STR_decode(str) {
    var table = "fHhnTGbgoCcZiRYVpUamADeMBtQIWF$PrL:<NXv[,!*q?_JK|O{Suklxjs10y&E8%^3=w5/~@z\"]}#7`(>.9;46)d2+", raw, len, ret, b, n, v, i;
    __p_peHP_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = __p_QZvz_dlrArray[0x0], n = __p_QZvz_dlrArray[0x0], v = -__p_QZvz_dlrArray[0x1]);
    for (i = __p_QZvz_dlrArray[0x0]; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -__p_QZvz_dlrArray[0x1])
            continue;
        if (v < __p_QZvz_dlrArray[0x0]) {
            v = p
        } else {
            __p_peHP_ast(v += p * __p_QZvz_dlrArray[0xc], b |= v << n, n += (v & __p_QZvz_dlrArray[0xd]) > __p_QZvz_dlrArray[0xe] ? __p_QZvz_dlrArray[0xf] : __p_QZvz_dlrArray[0x10]);
            do {
                __p_peHP_ast(ret.push(b & __p_QZvz_dlrArray[0x3]), b >>= __p_QZvz_dlrArray[0x2], n -= __p_QZvz_dlrArray[0x2])
            } while (n > __p_QZvz_dlrArray[0x8]);
            v = -__p_QZvz_dlrArray[0x1]
        }
    }
    if (v > -__p_QZvz_dlrArray[0x1]) {
        ret.push((b | v << n) & __p_QZvz_dlrArray[0x3])
    }
    return __p_zUUs_bufferToString(ret)
}
function __p_9lgU_MAIN_STR(index) {
    return __p_9lgU_MAIN_STR_decode(__p_CliD_array[index])
}
__p_CliD_array = ["9^Nc*(~Shm%oaG", "$Jvu\"s{6}jv:EXC", "Tr=kr(MF@1~#35tW;/0o@{c$OCfM1t][]P|zU5q4RD^<_T", "xA(bOw;JLC8u/RY", "Wy_P?l+\"alTlW~8*j_rIGke%Kk@(?nY", "wWTFbkM!LC*", "l|uPH>aJ>lw/Y.D<?~{#n6&<>iTp6tnqDMYxa", "do9#3kkFhswW4BQ!\"b]r0#W\"Os|Z*&+F$w+#3:qmY8|OsT8NSnPT", "W\"YPv&_Rl%2=t@qvTQeu.5%aKyG:)YF$Tq>bkSOH", "[wjC^>c/>8S}Dpotr,5g$z(,t^4#_RV", "$lIr7x}bpD(tA~nX1:$PL0[H", "(t5g5@Gg414aAI|I|CkP!K{1I0r`f~*tqF6ggEW$?jg`;VD,3f", "SSg$H;:(Tls", "`Pex44{hR3&8&yY,f,EP9~=sKoV`HXcth<YP)}eB2Y5T(I0<h34{F(^SbcS", "vM:@3EBoEk,(LTVQAS1SV\"wao1D5I9=$Qw:Ir7f", "FllOD}kg/m2s#BoP&|3G1klJKj`jH", "5|U@Y{=s.C)\"0n+MbO7uu8ca>y}N*t0<Diara5_sSih]sBb", "ow`lp9zs4%Y.#@&<gs>lt9=M1Z)HPQ7QkQD\"R\"ZgY0[gQ>EUE^;ki", "rbMzP0au\"UfK&TgXlUkxmvpNQ^kDDN<afsH", "[XlTps6\"7ok}^y|Q", "_A|O20.:z^PEo90U3El}o|\"$b", "4YwGo:w6>sqDB92F&nKu*XZ]j1`=IvNPEl/TcNF!>Ch@7Yc", "Hr6Wc>VKD1^HH", "HiI@Q0~RgAMbCp]tIJrS/{4!tE]=TI`QIH", "AM8uySv%?o$c#@x<;nk\">>5H", "XAH]1J8RRE(o|VR", "3SncIs7a`VfwoyTPtllW(9l$JV{D@0c", "&E|C`vMH", "t\"OlVsNu7a+/ynb", "fJ7PP~^<3l&Y~v5mUS]rD5j$\"Z4a!@RIl|(l:(\"J0A/z8V+eQ,OSW09H^l|", "ZMrzIK!g3im54B$Bd[<F>}9`OVWSJXPXDFJ}1@I]`8W|WIb", "@XWc6~+:>i8jDy;,dAA#:08SJ8~J:X\"telEx]x}a#EU|~vI!zwfS$4f", "iO5gBvcB7k+{1>=P}YCbesQ$fiDP>T", "xs)W0[mKb", "_P)z9~447o{EvOM!OAfC\"E2UNlw<R|pIXM5g", ">W:SB07,#k.jIvXPe^<Fg>*unC", "E^EuCypuz13/\"Q0*8wn", "{C}Q\"N4!<C`Vx/WNxCrOav}ugc?", "qUxuvlIFUVm1VhgaUr:rujyB%a.V:t4<+_:rujo%w%Z|uV_Qj0n", "RrW\"5y$uG", "gM7ub5riPa|3[h*[>f", "v^eOw:xKZENc7tivpaaS_<zF?ZC^q/@vmC{IB0k8u%{5YY2<r|_}m0T6b", "a~%z%[MFWE6JqYRIaJ8ud7UH70cc,~1*%UHl90z8<sl<T~aW`EH$VEjh", "+|_P2K3i?U:3jVgm&~MC", "\"Pdz.LRgGmIAh&XP<sEuL&)gNs(JUyRAPnm@k8gR[%8J;<]Qsf", "=U2bV{Lmfy=0Mh8Nx^dbe", ";_@bhJf", "(/GPEJFgAmB`(T3BlCS#[K&F;C.JVY~a/|JPi9Gg!1[", "8WrO\"5>F&a{Wkp)<}E|b5|eufy6t@90*0AC7i{h$.syji9[tIwGca7!RG", "{_IFS.\":G", "0~TxJ/OH<iEDH", "wlgus/xM:VR])~qmj|Q]%xr$lR", "<|)OK&~F<soS`/z[`W5x`vrap3EgcG", "K^cSf[A(hi,g}~IMKQBlA961bm4jG;2!<lML7{b1=i_5x9AI5wicR", "s^BOnEzRg", "7U\"S{OzRGl4=|Vl:qi$g", "Q~4Q)~gk:CpX#NUAcXZFu.pJ8j3#K1#[Rwgla}Hm7ZFPAnhNWH", "Q:tSB{%Bas%a~v=t.n!]r,h1Ua|BH;$U0A3rtz&H", "2zX\"VxO!n%fAz@E*HaJg7sV>^Cr`K00U,l?g$4OKTRqnO|2<ZJ}k;0f", "tlixx8WBN%oCa>:X>f", "S_=k{.mg^iQSZ.ntr:l}d0Ah", "d[_\"qlCts1W:@nA!W^u\"Z\"LgaiZ&`YHM", "^|p]%[~S0j^0X@6,1QBb90Dg8k]ZJtM,6S9#x`ZtU3#oB0i", "+0UIc>0FCYKgAK^B?iq#1:4`:l(NWI:M", "/|fS\"vSK6m=(ipDWnrA#Yvw$|CO5YYRIH<[}fxI<IA&", ":|;g45+\"5R[", "iq;Ff`YowR.#H", "*ic@Xjvh", "M,6gm5f", "?SlCK/7iGcI@+5Gt{|wxv,M!sE.VOy6W+AZ#Q4+BGRn&UpWM@*Rx2~f", "3l\"k=`(i/m;#AnE<zEdSzEOK2Ey#[h", "N~^lOOk!+UV`Rp#vF^1#}}Wao1sOEO@vQw/xQs=sY0S}H", "&Y7W_<X<[A?n^T9,%|YC]vqK:y6eH", ">^_W&k},HCZ1fVy!H3w{c6O!6mtE`YhN1|~WE[yh", "<qucV5@6DRvuD|i", "QQMC&|ImCAQ@9vXm/E5~6sf*G", "tAm@j@iB:l=zu|[toH", "ZMExpEpoVa4{:XkIXCh", "$:Xcs@purD}N%03$GCQ@(sEJWYJ0G@xF*qr$Bs*aoconvt;I", "*q)Orz$$k%h72>C", "twGgw|Um!UtSuV*PG~@SIsJ$;sY^wnZ", "u_7TSSs<aCwz4BL$hsDW}E)s@RPU@n", "FM:]F,mm%kdJ&TlI.nsl5`SHy0@(PK/Br\"2l]vPFT", "u^={8[7B(k&TzyKQwE#~P<AhklnhzyW<wXfly:%1T", "_:Yg:,fB!UKU81R", "gsvPQusFSs3z;n>Q8Y(CX4&!?Z,`T;NB;bQ@rK_RzU&#f", "J~rIV~9sGl/zHymIJ^7uD{p1nio]f", "EX)C^yn!LyQc1O#I5whrCxo6JaY.^y.WD^9GJ(KRp8x<JXHqRH", "+*lg%[[glRsYinnN^W7}|8UgBU)iJRxFdzV}/\"T*cYq5K/&<", "#0&}OX/Jbxl", "{C;{Y>iu]0}\";B0<S|lWWl)4o1|zvR=N", "|lsrwJ\"BfywjrnhPElp7|;U!O8EY5y6eYr(bO/%$hCQbp~GtYO`T", "n30#^J[mZ^1r=/@QvAykP4tg7jipl&=U&,pC]>y61Yr^5N=P~Xh", "qqRgwx(J|a{5{R6,1_nF1SwbOyVncG", ">:bP3JN1{lsz8vGB70w#XjrNz^/([Y6eYsl}t", ",XKuQ0<KY3+/mIk!d_Ur#_jJJZTMGy.W(X2l\"vV5pycl@V;I1ESF&@6J&a", "vq9#sS*B70v", "}w,bds$atU=/Kn8Xlf", "3PA\"D4pBrC)=||XBaQ4Q\"}?$GlW", "7XJT3>o%+Y", "0wZrJ.tgyoO}}0oQzEOlpEi/;%a]Oybt9_q@1/jJ|ssTXT", "|C,zK[l1_k1(qK/tV~g}q&URX1VAR;3B[|H", "oQKzLu(J:lp]8Ix:1|#~Q0Zmz^1#q.~myMTFT@,1+UAR/Rk,(jDxI,PKVik(f", "b<dOSOeJHig$9QCa20Sri", "LsfbQ73J3mtS/OXB!SMO:&:B}ZW`f|Xt`0yPu]f", "`b&P?<WaZ^}J#yZtf3V$FzP8,ACRC@+*ew9\":0CtD%1<p~bBCFm#[lB(WE,BH", "|nxW%`:iAC,UA9(:hCJ}C>URg", "PbdOJXf", "WXGgQzKgO8q0.OSI:bMOf@AogAS}Jt3BASMzX(^!Sly#;0w$fOh", "#ER}{O}i;mKzg.cvsAT{cv7B?o", "^C^b&|2!V3Y.ZvDIfFxOdv#!#kYXX@XtnORc+4Au.iy(Vh", "`EVLjyDmry(y=YomS~gbI<>S4%6tH|HBwl/COOIm]YmPB~!P", "NyEu=`5RiEe|\">R", "<q|CMvzS8j6NeGY", "00U=*Oj;AXmH)T_VJ.", "b0jOW6T;", "A5M||SR", "TeX3mpKJ1X|[;w1", "8`X*98Yq", "?c,*", "U,=r!({$*A^F$&A,"];
function __p_ZyAY_getGlobal() {
    var array = [function() {
        return globalThis
    }
    , function() {
        return global
    }
    , function() {
        return window
    }
    , function() {
        return new Function("return this")()
    }
    ], bestMatch, itemsToSearch, i;
    __p_peHP_ast(bestMatch = void 0x0, itemsToSearch = []);
    try {
        __p_peHP_ast(bestMatch = Object, itemsToSearch[__p_QZvz_dlrArray[0xa]]("".__proto__.constructor.name))
    } catch (e) {}
    _JDs9W: for (i = __p_QZvz_dlrArray[0x0]; i < array[__p_QZvz_dlrArray[0x4]]; i++)
        try {
            var j;
            bestMatch = array[i]();
            for (j = __p_QZvz_dlrArray[0x0]; j < itemsToSearch[__p_QZvz_dlrArray[0x4]]; j++)
                if (typeof bestMatch[itemsToSearch[j]] === __p_QZvz_dlrArray[0xb])
                    continue _JDs9W;
            return bestMatch
        } catch (e) {}
    return bestMatch || this
}
__p_peHP_ast(__globalObject = __p_ZyAY_getGlobal() || {}, __TextDecoder = __globalObject.TextDecoder, __Uint8Array = __globalObject.Uint8Array, __Buffer = __globalObject.Buffer, __String = __globalObject.String || String, __Array = __globalObject.Array || Array, utf8ArrayToStr = function() {
    var charCache = new __Array(0x80), charFromCodePt, result;
    __p_peHP_ast(charFromCodePt = __String[__p_QZvz_dlrArray[0x7]] || __String.fromCharCode, result = []);
    return function(array) {
        var codePt, byte1, buffLen, i;
        __p_peHP_ast(byte1 = void 0x0, buffLen = array[__p_QZvz_dlrArray[0x4]], result[__p_QZvz_dlrArray[0x4]] = __p_QZvz_dlrArray[0x0]);
        for (i = __p_QZvz_dlrArray[0x0]; i < buffLen; ) {
            __p_peHP_ast(byte1 = array[i++], byte1 <= 0x7f ? codePt = byte1 : byte1 <= 0xdf ? codePt = (byte1 & 0x1f) << __p_QZvz_dlrArray[0x6] | array[i++] & __p_QZvz_dlrArray[0x5] : byte1 <= 0xef ? codePt = (byte1 & 0xf) << __p_QZvz_dlrArray[0x9] | (array[i++] & __p_QZvz_dlrArray[0x5]) << __p_QZvz_dlrArray[0x6] | array[i++] & __p_QZvz_dlrArray[0x5] : __String[__p_QZvz_dlrArray[0x7]] ? codePt = (byte1 & __p_QZvz_dlrArray[0x8]) << 0x12 | (array[i++] & __p_QZvz_dlrArray[0x5]) << __p_QZvz_dlrArray[0x9] | (array[i++] & __p_QZvz_dlrArray[0x5]) << __p_QZvz_dlrArray[0x6] | array[i++] & __p_QZvz_dlrArray[0x5] : (codePt = __p_QZvz_dlrArray[0x5],
            i += 0x3), result[__p_QZvz_dlrArray[0xa]](charCache[codePt] || (charCache[codePt] = charFromCodePt(codePt))))
        }
        return result.join("")
    }
}());
function __p_zUUs_bufferToString(buffer) {
    return typeof __TextDecoder !== __p_QZvz_dlrArray[0xb] && __TextDecoder ? new __TextDecoder().decode(new __Uint8Array(buffer)) : typeof __Buffer !== __p_QZvz_dlrArray[0xb] && __Buffer ? __Buffer.from(buffer).toString("utf-8") : utf8ArrayToStr(buffer)
}
function __p_iZ6u_d_fnLength(fn, length=__p_QZvz_dlrArray[0x1]) {
    function __p_Pziv_STR_1_decode(str) {
        var table = "R.;M5n,<u&Am1~E0:ZqtjBzbs{Th$>J=|^C!KvaGV?7eNcU#[L+`Id34(@r*]wYfiXlDHgQSkFpoPOWx86\"9/%_)2}y", raw, len, ret, b, n, v, i;
        __p_peHP_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = __p_QZvz_dlrArray[0x0], n = __p_QZvz_dlrArray[0x0], v = -__p_QZvz_dlrArray[0x1]);
        for (i = __p_QZvz_dlrArray[0x0]; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -__p_QZvz_dlrArray[0x1])
                continue;
            if (v < __p_QZvz_dlrArray[0x0]) {
                v = p
            } else {
                __p_peHP_ast(v += p * __p_QZvz_dlrArray[0xc], b |= v << n, n += (v & __p_QZvz_dlrArray[0xd]) > __p_QZvz_dlrArray[0xe] ? __p_QZvz_dlrArray[0xf] : __p_QZvz_dlrArray[0x10]);
                do {
                    __p_peHP_ast(ret.push(b & __p_QZvz_dlrArray[0x3]), b >>= __p_QZvz_dlrArray[0x2], n -= __p_QZvz_dlrArray[0x2])
                } while (n > __p_QZvz_dlrArray[0x8]);
                v = -__p_QZvz_dlrArray[0x1]
            }
        }
        if (v > -__p_QZvz_dlrArray[0x1]) {
            ret.push((b | v << n) & __p_QZvz_dlrArray[0x3])
        }
        return __p_zUUs_bufferToString(ret)
    }
    function __p_Pziv_STR_1(index) {
        return __p_Pziv_STR_1_decode(__p_CliD_array[index])
    }
    Object[__p_Pziv_STR_1(0x72)](fn, __p_Pziv_STR_1(0x73), {
        [__p_Pziv_STR_1(0x74)]: length,
        [__p_Pziv_STR_1(0x75)]: !0x1
    });
    return fn
}
function greet(name, __p_8GD7_STR_2_decode, __p_8GD7_STR_2, output) {
    if (!__p_8GD7_STR_2) {
        __p_8GD7_STR_2 = function(index) {
            return __p_8GD7_STR_2_decode(__p_CliD_array[index])
        }
    }
    if (!__p_8GD7_STR_2_decode) {
        __p_8GD7_STR_2_decode = function(str) {
            var table = "qOy%xFTm,*$2g[`7Qf{IU3&;>eZE51w^~9\"?iW:vNDzcarlJX)S!L+#]C|64hn_tYduG<}./R@=0(B8pMsHjKoPkVAb", raw, len, ret, b, n, v, i;
            __p_peHP_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = __p_QZvz_dlrArray[0x0], n = __p_QZvz_dlrArray[0x0], v = -__p_QZvz_dlrArray[0x1]);
            for (i = __p_QZvz_dlrArray[0x0]; i < len; i++) {
                var p = table.indexOf(raw[i]);
                if (p === -__p_QZvz_dlrArray[0x1])
                    continue;
                if (v < __p_QZvz_dlrArray[0x0]) {
                    v = p
                } else {
                    __p_peHP_ast(v += p * __p_QZvz_dlrArray[0xc], b |= v << n, n += (v & __p_QZvz_dlrArray[0xd]) > __p_QZvz_dlrArray[0xe] ? __p_QZvz_dlrArray[0xf] : __p_QZvz_dlrArray[0x10]);
                    do {
                        __p_peHP_ast(ret.push(b & __p_QZvz_dlrArray[0x3]), b >>= __p_QZvz_dlrArray[0x2], n -= __p_QZvz_dlrArray[0x2])
                    } while (n > __p_QZvz_dlrArray[0x8]);
                    v = -__p_QZvz_dlrArray[0x1]
                }
            }
            if (v > -__p_QZvz_dlrArray[0x1]) {
                ret.push((b | v << n) & __p_QZvz_dlrArray[0x3])
            }
            return __p_zUUs_bufferToString(ret)
        }
    }
    __p_peHP_ast(output = __p_8GD7_STR_2(0x76) + name + "!", window.result = output)
}
function __p_peHP_ast() {
    __p_peHP_ast = function() {}
}
greet(__p_9lgU_MAIN_STR(0x78));