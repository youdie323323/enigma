export default class UniqueIdentifier {
    private nextId = 0;

    public clear() {
        this.nextId = 0;
    }

    public next(): number {
        return ++this.nextId;
    }
}