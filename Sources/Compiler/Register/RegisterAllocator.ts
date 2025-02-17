import { createRegister, type Register } from "./Register";

export default class RegisterAllocator {
    public static readonly MAX_REGISTER_AMOUNT: number = 2048;

    constructor(private curr: number = 0) { }

    public static throwIfRegisterOutOfRange(n: number): void {
        if (n >= RegisterAllocator.MAX_REGISTER_AMOUNT) {
            throw new RangeError("Register overflow");
        }

        if (n <= 0) {
            throw new RangeError("Register underflow");
        }
    }

    public next(): Register {
        this.curr++;

        return createRegister(this.curr);
    }

    public free(): void {
        this.curr--;

        RegisterAllocator.throwIfRegisterOutOfRange(this.curr);
    }

    public get(): Register {
        return createRegister(this.curr);
    }

    public set(n: Register): void {
        this.curr = n;
    }
}