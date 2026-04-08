import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import FormGroup from "ui5/genatrix/metadata/form/FormGroup";
import PropertyOption from "ui5/genatrix/metadata/form/PropertyOption";
import { FormModeType } from "ui5/genatrix/types/control/v2/form/DialogForm.types";

export type FormGeneratorSettings = {
    controlId: string;
    entitySet: string;
    oDataModel: ODataModel;
    formMode: FormModeType;
    datePattern?: string;
    timePattern?: string;
    dateTimeSeparator?: string;
    dateFirst?: boolean;
    groupingSeparator?: string;
    decimalSeparator?: string;
    requiredProperties?: string;
    readonlyProperties?: string;
    excludedProperties?: string;
    keysAlwaysIncluded: boolean;
    propertyOptions: PropertyOption[];
    formGroups?: FormGroup[];
};