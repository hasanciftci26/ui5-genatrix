import Control from "sap/ui/core/Control";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import DialogFormRenderer from "ui5/genatrix/control/v2/form/DialogFormRenderer";
import { ClassMetadata } from "ui5/genatrix/types/global/ManagedObjectClass.types";

/**
 * @namespace ui5.genatrix.control.v2.form
 */
export default class DialogForm extends Control {
    public static metadata: ClassMetadata = {
        library: "ui5.genatrix",
        properties: {
            entitySet: { type: "string" },
            initialized: { type: "string", visibility: "hidden" }
        },
        aggregations: {
            form: { type: "sap.ui.layout.form.SimpleForm", multiple: false, visibility: "hidden" }
        }
    };
    public static renderer = DialogFormRenderer;

    constructor() {
        super();
    }

    public override init() {
        const form = new SimpleForm(`${this.getId()}--Form`);
        this.setAggregation("form", form);
    }
}