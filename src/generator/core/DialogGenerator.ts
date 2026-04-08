import Button from "sap/m/Button";
import Dialog from "sap/m/Dialog";
import EventProvider from "sap/ui/base/EventProvider";
import {
    DialogGenerator$CloseEventHandler,
    DialogGenerator$SubmitEventHandler,
    DialogGeneratorSettings
} from "ui5/genatrix/types/generator/core/DialogGenerator.types";

/**
 * @namespace ui5.genatrix.generator.core
 */
export default class DialogGenerator extends EventProvider {
    private readonly settings: DialogGeneratorSettings;
    private dialog: Dialog;

    constructor(settings: DialogGeneratorSettings) {
        super();
        this.settings = settings;
    }

    public generate() {
        this.dialog = new Dialog({
            title: this.settings.title,
            titleAlignment: this.settings.titleAlignment
        });

        this.addSubmitButton();
        this.addCloseButton();
        this.addEscapeHandler();
        this.dialog.setModel(this.settings.oDataModel);

        return this.dialog;
    }

    public attachSubmit(handler: DialogGenerator$SubmitEventHandler, listener?: object) {
        this.attachEvent("submit", handler, listener);
    }

    public attachClose(handler: DialogGenerator$CloseEventHandler, listener?: object) {
        this.attachEvent("close", handler, listener);
    }

    private fireSubmit() {
        this.fireEvent("submit", {
            dialog: this.dialog
        });
    }

    private fireClose() {
        this.fireEvent("close", {
            dialog: this.dialog
        });
    }

    private onEscape(event: { resolve: () => void; reject: () => void; }) {
        event.reject();
        this.fireClose();
    }

    private addSubmitButton() {
        if (!this.settings.addSubmitButton) {
            return;
        }

        const button = new Button({
            text: this.settings.submitButtonText,
            icon: this.settings.submitButtonIcon,
            type: this.settings.submitButtonType
        });

        button.attachPress(this.fireSubmit, this);
        this.dialog.setBeginButton(button);
    }

    private addCloseButton() {
        const button = new Button({
            text: this.settings.closeButtonText,
            icon: this.settings.closeButtonIcon,
            type: this.settings.closeButtonType
        });

        button.attachPress(this.fireClose, this);
        this.dialog.setEndButton(button);
    }

    private addEscapeHandler() {
        this.dialog.setEscapeHandler(this.onEscape.bind(this));
    }
}