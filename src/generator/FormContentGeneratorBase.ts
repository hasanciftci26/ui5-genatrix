import BaseObject from "sap/ui/base/Object";
import Control from "sap/ui/core/Control";
import Model from "sap/ui/model/Model";
import MetadataParserBase from "ui5/genatrix/odata/MetadataParserBase";
import { FormContentGeneratorBaseSettings } from "ui5/genatrix/types/generator/FormContentGeneratorBase.types";

/**
 * @namespace ui5.genatrix.generator
 */
export default abstract class FormContentGeneratorBase<T extends Model = Model> extends BaseObject {
    private readonly settings: FormContentGeneratorBaseSettings<T>;
    private readonly metadataParser: MetadataParserBase<T>;
    private readonly content: Control[] = [];

    constructor(settings: FormContentGeneratorBaseSettings<T>) {
        super();
        this.settings = settings;
    }

    public abstract generate(): Promise<Control[]>;

    public getContent() {
        return this.content;
    }

    protected getEntitySet() {
        return this.settings.entitySet;
    }

    protected getModel() {
        return this.settings.model;
    }

    protected addContent(control: Control) {
        this.content.push(control);
    }
}