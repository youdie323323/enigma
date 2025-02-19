import { deepEqual, ok } from "assert";
import Template from "../../ProgramBuilder/Templates/Template";
import { type Bytecode } from "./Bytecode";
import { Category, generateRandomStringFromCategory } from "./BytecodeUnicodeRanges";

export const shuffle = <T>(array: T[]): T[] => {
    return array.toSorted(() => Math.random() - 0.5);
}

export default class BytecodeTranscoderProvider {
    private static readonly REPLACEABLE_CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static readonly UNICODE_CHARACTERS: Record<string, string> = {
        A: 'Α',
        B: 'Β',
        C: 'Ϲ',
        E: 'Е',
        F: 'Ϝ',
        G: 'Ꮐ',
        H: 'Η',
        I: 'Ι',
        J: 'Ј',
        K: 'К',
        L: 'Ⅼ',
        M: 'М',
        N: 'Ν',
        O: 'Ο',
        P: 'Р',
        Q: 'Ⴓ',
        R: 'Ꮢ',
        S: 'Ѕ',
        T: 'Ꭲ',
        V: 'Ⅴ',
        X: 'Χ',
        Y: 'Ү',
        v: 'ν',
        x: 'х',
    };

    private static readonly MIN_RADIX = 38;
    private static readonly MAX_RADIX = 50;

    private static readonly decoderTemplate = new Template(`
        var {decoderName} = function (encoded, table, radix) {
            for (var length = table.length, r = length - radix, t = [], i = 0; i < encoded.length;)
                for (var h = 0, l = 1; ;) {
                    var x = table.indexOf(encoded[i++]);
                    if (h += l * (x % radix), x < radix) {
                        t.push(h | 0);
                        break
                    }
                    h += radix * l, l *= r
                }
            return t
        };
    `);

    /**
     * @privateremarks
     * Some of character in basic latin can cause errors in javascript.
     * This is included basic latin letters from ips.
     */
    private static readonly LATIN_BASIC_TABLE: Array<string> = [
        // Everything work fine when delete dollar symbol, why?
        // This is maybe issue with interpreter code, because decode chechsum working fine
        // Use "-" temporary
        // '$', 
        "-",
        
        '+',
        '0', '1', '2', '3', '4', '5', '6', '7', '8',
        '9',
        '<', '=', '>',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
        'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
        '^',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
        'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
        's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '|', '~'
    ] as const;
    // This is what i got from fetching ips 5000 times
    private static readonly NON_BASIC_TABLE_CATEGORIES_WEIGHTS: Partial<Record<Category, number>> = {
        [Category.Latin1Supplement]: 55,
        [Category.LatinExtendedA]: 20,
        [Category.LatinExtendedB]: 182,
        [Category.IPAExtensions]: 184,
        [Category.SpacingModifierLetters]: 111,
        [Category.GreekAndCoptic]: 485,
        [Category.Cyrillic]: 1360,
        [Category.CyrillicSupplement]: 119,
        [Category.Armenian]: 570,
        [Category.Hebrew]: 211,
        [Category.Arabic]: 1164,
        [Category.Syriac]: 255,
        [Category.ArabicSupplement]: 212,
        [Category.Thaana]: 180,
    };
    private static readonly NON_BASIC_TABLE_CATEGORIES_TOTAL_WEIGHT =
        Object.values(BytecodeTranscoderProvider.NON_BASIC_TABLE_CATEGORIES_WEIGHTS).reduce((sum, w) => sum + w, 0);

    private static replaceCharWithUnicode(str: string): string {
        return BytecodeTranscoderProvider.UNICODE_CHARACTERS[str] || str;
    }

    private static replaceCharAtIndex(str: string, index: number, char: string) {
        if (index > str.length - 1) return str;
        return str.substring(0, index) + char + str.substring(index + 1);
    }

    private static get randomNonBasicCategory(): Category {
        const random = Math.random() * BytecodeTranscoderProvider.NON_BASIC_TABLE_CATEGORIES_TOTAL_WEIGHT;

        let cumulative = 0;
        for (const [category, weight] of Object.entries(BytecodeTranscoderProvider.NON_BASIC_TABLE_CATEGORIES_WEIGHTS)) {
            cumulative += weight;
            if (random <= cumulative) {
                return category as Category;
            }
        }
    }

    private static get randomNonBasicCharLength(): number {
        // 0 ~ 2
        return Math.floor(Math.random() * 3);
    }

    /**
     * @deprecated Use generateDistortedTable.
     */
    private static oldGenerateDistortedTable(): string {
        const index = Math.floor(Math.random() * BytecodeTranscoderProvider.REPLACEABLE_CHARSET.length);

        return BytecodeTranscoderProvider.replaceCharAtIndex(
            BytecodeTranscoderProvider.REPLACEABLE_CHARSET,
            index,
            BytecodeTranscoderProvider.replaceCharWithUnicode(BytecodeTranscoderProvider.REPLACEABLE_CHARSET[index]),
        ) + "0123456789";
    }

    private static generateDistortedTable(): string {
        const duplicationCheckerSet: Set<string> = new Set(BytecodeTranscoderProvider.LATIN_BASIC_TABLE);

        const nonBasicChars = Array.from({ length: BytecodeTranscoderProvider.randomNonBasicCharLength }, function retry() {
            const randomNonBasicStr = generateRandomStringFromCategory(
                BytecodeTranscoderProvider.randomNonBasicCategory,
            );

            if (duplicationCheckerSet.has(randomNonBasicStr)) {
                return retry();
            }

            duplicationCheckerSet.add(randomNonBasicStr);
            return randomNonBasicStr;
        });

        const combinedChars = BytecodeTranscoderProvider.LATIN_BASIC_TABLE.concat(nonBasicChars);

        return shuffle(combinedChars).join('');
    }

    public static get table(): string {
        return BytecodeTranscoderProvider.generateDistortedTable();
    }

    public static get radix(): number {
        return Math.floor(Math.random() * ((BytecodeTranscoderProvider.MAX_RADIX + 1) - BytecodeTranscoderProvider.MIN_RADIX)) + BytecodeTranscoderProvider.MIN_RADIX;
    }

    public static encode(
        bytecode: Bytecode,
        table: string,
        radix: number
    ): string {
        let encodedString = '';
        const r = table.length - radix;

        bytecode.forEach(num => {
            const digits = [];

            let x = num;
            while (x >= radix) {
                const rem = (x - radix) % r;
                digits.push(radix + rem);
                x = Math.floor((x - radix) / r);
            }

            digits.push(x);

            let encodedChars = '';
            digits.forEach(digit => {
                encodedChars += table[digit];
            });
            encodedString += encodedChars;
        });

        deepEqual(
            BytecodeTranscoderProvider.decode(encodedString, table, radix),
            // Do c | 0 as did in decode function
            bytecode.map(c => c | 0),
            "Bytecode encoding checksum failed",
        );

        return encodedString;
    }

    public static decode(
        encoded: string,
        table: string,
        radix: number
    ): Bytecode {
        const bytecode: Bytecode = new Array();
        const r = table.length - radix;

        for (let i = 0; i < encoded.length;) {
            let h = 0,
                l = 1;
            for (; ;) {
                const x = table.indexOf(encoded[i++]);
                h += l * (x % radix);
                if (x < radix) {
                    bytecode.push(h | 0);
                    break;
                }
                h += radix * l;
                l *= r;
            }
        }

        return bytecode;
    }

    public static get decoder(): Template {
        return BytecodeTranscoderProvider.decoderTemplate;
    }
}