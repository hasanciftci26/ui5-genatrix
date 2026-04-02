import Lib from "sap/ui/core/Lib";

const library = Lib.init({
    name: "ui5.genatrix",
    apiVersion: 2,
    dependencies: [
        "sap.ui.core",
        "sap.m"
    ],
    controls: [
        "ui5.genatrix.control.v2.form.DialogForm",
        "ui5.genatrix.control.v2.form.EmbeddedForm"
    ],
    noLibraryCSS: true,
    version: "1.0.0"
});

export default library;