import BaseObject from "sap/ui/base/Object";
import Model from "sap/ui/model/Model";
import { EntityTypeProperty, MetadataParserBaseSettings } from "ui5/genatrix/types/odata/MetadataParserBase.types";

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

    protected getModel() {
        return this.settings.model;
    }

    protected getEntitySetPath() {
        return "/" + this.settings.entitySet;
    }
}