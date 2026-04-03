import Button from "sap/m/Button";
import { ButtonType } from "sap/m/library";
import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import { URI } from "sap/ui/core/library";
import FormMode from "ui5/genatrix/control/enum/form/FormMode";
import DialogFormRenderer from "ui5/genatrix/control/v2/form/DialogFormRenderer";
import { DialogFormSettings } from "ui5/genatrix/types/control/v2/form/DialogForm.types";

/**
 * @namespace ui5.genatrix.control.v2.form
 */
export default class DialogForm extends Control {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        properties: {
            entitySet: { type: "string" },
            formMode: { type: "ui5.genatrix.control.enum.form.Mode", defaultValue: FormMode.Create },
            buttonText: { type: "string" },
            buttonIcon: { type: "sap.ui.core.URI", defaultValue: "sap-icon://add" },
            buttonType: { type: "sap.m.ButtonType", defaultValue: ButtonType.Default },
            initialized: { type: "string", visibility: "hidden" }
        },
        aggregations: {
            button: { type: "sap.m.Button", multiple: false, visibility: "hidden" }
        }
    };
    public static renderer = DialogFormRenderer;

    constructor(settings?: DialogFormSettings);
    constructor(id?: string, settings?: DialogFormSettings);

    constructor(idOrSettings?: string | DialogFormSettings, settings?: DialogFormSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public override init() {
        const button = new Button(`${this.getId()}--Button`, {
            text: this.getButtonText(),
            icon: this.getButtonIcon(),
            type: this.getButtonType()
        });

        button.attachPress(this.onButtonPress, this);
        this.setAggregation("button", button);
    }

    public setButtonText(value?: string) {
        this.setProperty("buttonText", value);
        this.getButton().setText(value);
        return this;
    }

    public setButtonIcon(value?: URI) {
        this.setProperty("buttonIcon", value);
        this.getButton().setIcon(value);
        return this;
    }

    public setButtonType(value?: ButtonType) {
        this.setProperty("buttonType", value);
        this.getButton().setType(value);
        return this;
    }

    private onButtonPress() {

    }

    private getButton() {
        return this.getAggregation("button") as Button;
    }
}