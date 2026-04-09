export default interface Validator {
    evaluate: (value: any) => Promise<void>;
}