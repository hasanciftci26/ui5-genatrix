import SimpleForm from "sap/ui/layout/form/SimpleForm";
import DialogForm from "ui5/genatrix/control/v2/form/DialogForm";
import ControlRenderer from "ui5/genatrix/interface/global/ControlRenderer";

const DialogFormRenderer: ControlRenderer<DialogForm> = {
    apiVersion: 2,
    render: function (rm, control) {
        const form = control.getAggregation("form") as SimpleForm;
        rm.renderControl(form);
    }
};

export default DialogFormRenderer;