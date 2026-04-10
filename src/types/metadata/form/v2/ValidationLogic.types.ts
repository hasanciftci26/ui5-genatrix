import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { OptionalPropertyGetter, OptionalPropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type ValidationLogicSettings = $ManagedObjectSettings & {
    propertyName?: string;
};

declare module "ui5/genatrix/metadata/form/v2/ValidationLogic" {
    export default interface ValidationLogic {
        getPropertyName: OptionalPropertyGetter<string>;
        setPropertyName: OptionalPropertySetter<string, ValidationLogic>;
    }
}