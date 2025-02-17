import RegisterAllocator from "./RegisterAllocator";

const brand = Symbol('brandProperty');

declare const registerBrand: unique symbol;
export type Register = number & { [brand]: typeof registerBrand };

export function createRegister(regLike: number): Register {
    RegisterAllocator.throwIfRegisterOutOfRange(regLike);

    return regLike as Register;
}

export function registerToNumber(reg: Register): number {
    return reg as number;
}