import View from "sap/ui/core/mvc/View";
import Context from "sap/ui/model/odata/v2/Context";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import FormMode from "ui5/genatrix/form/enum/FormMode";

export type ContextManagerSettings<T extends Record<string, any>> = {
    oDataModel: ODataModel;
    oDataModelName?: string;
    entitySet: string;
    formMode: FormMode | keyof typeof FormMode;
    view?: View;
    initialData?: T;
    contextProvider?: () => Promise<Context> | Context;
    contextRef?: string | T | Context;
    rowSelectionErrorMessage: string;
};