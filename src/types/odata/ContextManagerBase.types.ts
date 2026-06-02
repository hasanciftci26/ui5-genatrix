import Context from "sap/ui/model/Context";
import Model from "sap/ui/model/Model";
import FormMode from "ui5/genatrix/form/enum/FormMode";

export type ContextManagerBaseSettings<T extends Model = Model> = {
    entitySet: string;
    model: T;
    updateGroupId: string;
    formMode: FormMode | keyof typeof FormMode;
    initialData?: Record<string, any>;
    contextProvider?: () => Promise<Context> | Context;
    contextRef?: Record<string, any> | Context;
};