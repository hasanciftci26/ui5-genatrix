import { $TokenSettings } from "sap/m/Token";
import { PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";
import { CustomFilterBarFieldOperator } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

export type CustomFBTokenSettings = $TokenSettings & {
    filterValue: any;
    filterOperator: CustomFilterBarFieldOperator;
};

declare module "ui5/genatrix/control/extension/CustomFBToken" {
    export default interface CustomFBToken {
        getFilterValue: PropertyGetter<any>;
        setFilterValue: PropertySetter<any, CustomFBToken>;
        getFilterOperator: PropertyGetter<CustomFilterBarFieldOperator>;
        setFilterOperator: PropertySetter<CustomFilterBarFieldOperator, CustomFBToken>;
    }
}