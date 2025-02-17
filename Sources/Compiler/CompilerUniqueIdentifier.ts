export default class UniqueIdentifier {
    private nextId = 0;

    public clear() {
        this.nextId = 0;
    }

    public get(): number {
        return ++this.nextId;
    }
}