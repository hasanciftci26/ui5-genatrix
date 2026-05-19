import SimpleForm from "sap/ui/layout/form/SimpleForm";
import EmbeddedForm from "ui5/genatrix/form/v2/EmbeddedForm";
import ControlRenderer from "ui5/genatrix/interface/ControlRenderer";

const EmbeddedFormRenderer: ControlRenderer<EmbeddedForm> = {
    apiVersion: 2,
    render: function (rm, control) {
        const form = control.getAggregation("form") as SimpleForm;
        rm.renderControl(form);
    }
};

export default EmbeddedFormRenderer;