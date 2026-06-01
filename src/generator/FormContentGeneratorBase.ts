import BaseObject from "sap/ui/base/Object";
import Control from "sap/ui/core/Control";
import { FormContentGeneratorBaseSettings } from "ui5/genatrix/types/generator/FormContentGeneratorBase.types";

/**
 * @namespace ui5.genatrix.generator
 */
export default abstract class FormContentGeneratorBase extends BaseObject {
    private readonly settings: FormContentGeneratorBaseSettings;
    private readonly content: Control[] = [];

    constructor(settings: FormContentGeneratorBaseSettings) {
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

    protected addContent(control: Control) {
        this.content.push(control);
    }
}