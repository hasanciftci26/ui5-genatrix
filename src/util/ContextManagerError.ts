export default class ContextManagerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ContextManagerError";
    }
}