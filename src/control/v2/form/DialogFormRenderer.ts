import Button from "sap/m/Button";
import DialogForm from "ui5/genatrix/control/v2/form/DialogForm";
import ControlRenderer from "ui5/genatrix/interface/global/ControlRenderer";

const DialogFormRenderer: ControlRenderer<DialogForm> = {
    apiVersion: 2,
    render: function (rm, control) {
        const button = control.getAggregation("button") as Button;
        rm.renderControl(button);
    }
};

export default DialogFormRenderer;