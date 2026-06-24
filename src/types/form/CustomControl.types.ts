import { $ManagedObjectSettings, PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import { AggregationGetterSingle, AggregationSetterOrAdder, OptionalPropertyGetter, OptionalPropertySetter } from "ui5/genatrix/types/global/CustomClass.types";

export type CustomControlSettings = $ManagedObjectSettings & {
    title?: string | PropertyBindingInfo | `{${string}}`;
    propertyList?: string | PropertyBindingInfo | `{${string}}`;
    control?: Control;
};

declare module "ui5/genatrix/form/CustomControl" {
    export default interface CustomControl {
        getName: OptionalPropertyGetter<string>;
        setName: OptionalPropertySetter<string, CustomControl>;

        getValidator: OptionalPropertyGetter<(control: Control) => Promise<boolean> | boolean>;
        setValidator: OptionalPropertySetter<(control: Control) => Promise<boolean> | boolean, CustomControl>;

        getControl: AggregationGetterSingle<Control>;
        setControl: AggregationSetterOrAdder<Control, CustomControl>;
    }
}