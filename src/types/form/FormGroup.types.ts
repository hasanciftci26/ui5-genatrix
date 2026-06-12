import { $ManagedObjectSettings, PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { OptionalPropertyGetter, OptionalPropertySetter } from "ui5/genatrix/types/global/CustomClass.types";

export type FormGroupSettings = $ManagedObjectSettings & {
    title?: string | PropertyBindingInfo | `{${string}}`;
    propertyList?: string | PropertyBindingInfo | `{${string}}`;
};

declare module "ui5/genatrix/form/FormGroup" {
    export default interface FormGroup {
        getTitle: OptionalPropertyGetter<string>;
        setTitle: OptionalPropertySetter<string, FormGroup>;

        getPropertyList: OptionalPropertyGetter<string>;
        setPropertyList: OptionalPropertySetter<string, FormGroup>;
    }
}