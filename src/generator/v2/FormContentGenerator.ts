import BaseObject from "sap/ui/base/Object";
import Control from "sap/ui/core/Control";
import { FormContentGeneratorSettings } from "ui5/genatrix/types/generator/v2/FormContentGenerator.types";

/**
 * @namespace ui5.genatrix.generator.v2
 */
export default class FormContentGenerator extends BaseObject {
    private readonly settings: FormContentGeneratorSettings;
    private content: Control[];

    constructor(settings: FormContentGeneratorSettings) {
        super();
        this.settings = settings;
    }

    public async generate() {
        const content: Control[] = [];

        this.content = content;
        return content;
    }

    public getGeneratedContent() {
        return this.content;
    }
}