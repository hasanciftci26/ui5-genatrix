import BaseObject from "sap/ui/base/Object";
import { ConditionsGeneratorSettings } from "ui5/genatrix/types/generator/core/ConditionsGenerator.types";

/**
 * @namespace ui5.genatrix.generator.core
 */
export default class ConditionsGenerator extends BaseObject {
    private readonly settings: ConditionsGeneratorSettings;

    constructor(settings: ConditionsGeneratorSettings) {
        super();
        this.settings = settings;
    }

    // TODO
    public open() {

    }
}