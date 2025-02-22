/**
 * Returns a true/false randomly.
 * 
 * @param percentChance - A percentage chance, (0 - 100)%
 */
const chance = (percentChance: number): boolean => {
    return Math.random() < percentChance / 100;
}

let currentLiteralId: number = Math.floor(Math.random() * 6) + 1;
// To prevent register access blocking, atleast we need to ensure that value is not above 64 (FUNCTION_RESULT_REG << 5)
function nextLiteralId(): number {
    if (chance(15)) {
        currentLiteralId += 1;
    } else if (chance(15)) {
        currentLiteralId += 2;
    } else if (chance(15)) {
        currentLiteralId += 3;
    } else {
        // 6 + (3.8 * 5) = 25
        // 25 << 1 = 50
        currentLiteralId += 3.8;
    }

    return currentLiteralId << 1
}

export enum LiteralId {
    Null = currentLiteralId << 1,
    True = nextLiteralId(),
    False = nextLiteralId(),
    Num = nextLiteralId(),
    StoreOrLoadStr = nextLiteralId(),
    FakePlaceholder = nextLiteralId(),
}