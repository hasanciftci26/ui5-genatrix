import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import CustomInput from "ui5/genatrix/control/extension/CustomInput";
import { TextArrangementType } from "ui5/genatrix/types/control/global/Form.types";

export type ValidateAndSetSettings = {
    value: string;
    model: ODataModel;
    source: CustomInput;
    entitySet: string;
    keyProperty: string;
    textProperty?: string;
    textArrangement: TextArrangementType;
};

export type ReadPromiseResult = Array<Record<string, any>>;
export type ReadPromise = Promise<ReadPromiseResult>;

export type ReadCache = {
    keyValue?: string;
    textValue?: string;
    promise: ReadPromise;
};