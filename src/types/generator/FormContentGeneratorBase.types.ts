import Model from "sap/ui/model/Model";
import PropertyConfiguration from "ui5/genatrix/form/PropertyConfiguration";

export type FormContentGeneratorBaseSettings<T extends Model = Model> = {
    entitySet: string;
    model: T;
    propertyConfigurations: PropertyConfiguration[];
};