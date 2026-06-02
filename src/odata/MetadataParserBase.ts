import BaseObject from "sap/ui/base/Object";
import Model from "sap/ui/model/Model";
import { EntityTypeProperty, MetadataParserBaseSettings } from "ui5/genatrix/types/odata/MetadataParserBase.types";
import Labelizer from "ui5/genatrix/util/Labelizer";

/**
 * @namespace ui5.genatrix.odata
 */
export default abstract class MetadataParserBase<T extends Model = Model> extends BaseObject {
    private readonly settings: MetadataParserBaseSettings<T>;

    constructor(settings: MetadataParserBaseSettings<T>) {
        super();
        this.settings = settings;
    }

    public abstract parse(): Promise<EntityTypeProperty[]>;

    protected getEntitySet() {
        return this.settings.entitySet;
    }

    protected getEntitySetPath() {
        return "/" + this.settings.entitySet;
    }

    protected getModel() {
        return this.settings.model;
    }

    protected getFormMode() {
        return this.settings.formMode;
    }

    protected getUserDefinedLabel(propertyName: string) {
        return this.settings.propertyConfigurations.find(config => config.getName() === propertyName)?.getLabel();
    }

    protected getRequiredProperties() {
        return this.settings.requiredProperties;
    }

    protected getReadonlyProperties() {
        return this.settings.readonlyProperties;
    }

    protected getExcludedProperties() {
        return this.settings.excludedProperties;
    }

    protected labelize(propertyName: string) {
        return Labelizer.run(propertyName);
    }
}