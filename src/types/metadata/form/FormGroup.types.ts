import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { OptionalPropertyGetter, OptionalPropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type FormGroupSettings = $ManagedObjectSettings & {
    title?: string;
    propertyList?: string;
    index?: number;
};

declare module "ui5/genatrix/metadata/form/FormGroup" {
    export default interface FormGroup {
        getTitle: OptionalPropertyGetter<string>;
        setTitle: OptionalPropertySetter<string, FormGroup>;
        getPropertyList: OptionalPropertyGetter<string>;
        setPropertyList: OptionalPropertySetter<string, FormGroup>;
        getIndex: OptionalPropertyGetter<number>;
        setIndex: OptionalPropertySetter<number, FormGroup>;
    }
}