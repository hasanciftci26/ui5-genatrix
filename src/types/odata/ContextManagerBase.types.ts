import Context from "sap/ui/model/Context";
import FormMode from "ui5/genatrix/form/enum/FormMode";

export type ContextManagerBaseSettings = {
    entitySet: string;
    updateGroupId: string;
    formMode: FormMode | keyof typeof FormMode;
    initialData?: Record<string, any>;
    contextProvider?: () => Promise<Context> | Context;
    contextRef?: Record<string, any> | Context;
};