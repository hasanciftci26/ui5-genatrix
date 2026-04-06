import BaseObject from "sap/ui/base/Object";
import Control from "sap/ui/core/Control";
import SimpleForm from "sap/ui/layout/form/SimpleForm";

/**
 * @namespace ui5.genatrix.generator.v2
 */
export default class FormGenerator extends BaseObject {
    private form: SimpleForm;
    private formContent: Control[] = [];

    constructor() {
        super();
    }

    public async generateForm() {
        return this.form;
    }

    public async generateFormContent() {
        return this.formContent;
    }
}