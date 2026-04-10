import { OptionalPropertyGetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export default interface Validator {
    getPropertyName: OptionalPropertyGetter<string>;
    evaluate: (value: any) => Promise<void>;
}