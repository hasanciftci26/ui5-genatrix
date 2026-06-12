import Label from "sap/m/Label";
import Text from "sap/m/Text";
import Control from "sap/ui/core/Control";
import Model from "sap/ui/model/Model";
import FormMode from "ui5/genatrix/form/enum/FormMode";
import FormGroup from "ui5/genatrix/form/FormGroup";
import PropertyConfiguration from "ui5/genatrix/form/PropertyConfiguration";
import PropertyValidation from "ui5/genatrix/form/PropertyValidation";
import { EntityTypeProperty } from "ui5/genatrix/types/odata/MetadataParserBase.types";

export type FormContentGeneratorBaseSettings<T extends Model = Model> = {
    entitySet: string;
    model: T;
    formMode: FormMode | keyof typeof FormMode;
    editable: boolean;
    datePattern?: string;
    timePattern?: string;
    dateTimeSeparator: string;
    dateFirst: boolean;
    groupingEnabled: boolean;
    groupingSeparator?: string;
    groupingSize: number;
    decimalSeparator?: string;
    parseEmptyValueToZero: boolean;
    requiredProperties: string[];
    readonlyProperties: string[];
    excludedProperties: string[];
    displayOrder: string[];
    propertyConfigurations: PropertyConfiguration[];
    propertyValidations: PropertyValidation[];
    formGroups: FormGroup[];
};

export type FormContent = {
    property: EntityTypeProperty;
    labelControl: Label;
    readonlyControl: Text;
    editableControl?: Control;
};