import EmbeddedForm from "ui5/genatrix/form/EmbeddedForm";
import ControlRenderer from "ui5/genatrix/interface/ControlRenderer";

const EmbeddedFormRenderer: ControlRenderer<EmbeddedForm> = {
    apiVersion: 2,
    render: function (rm, control) {
        rm.renderControl(control.getInnerForm());
    }
};

export default EmbeddedFormRenderer;