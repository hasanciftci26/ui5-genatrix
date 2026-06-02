import Model from "sap/ui/model/Model";
import FormMode from "ui5/genatrix/form/enum/FormMode";
import PropertyConfiguration from "ui5/genatrix/form/PropertyConfiguration";

export type FormContentGeneratorBaseSettings<T extends Model = Model> = {
    entitySet: string;
    model: T;
    formMode: FormMode | keyof typeof FormMode;
    requiredProperties: string[];
    readonlyProperties: string[];
    excludedProperties: string[];
    propertyConfigurations: PropertyConfiguration[];
};