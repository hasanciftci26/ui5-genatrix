import Lib from "sap/ui/core/Lib";

const library = Lib.init({
    name: "ui5.genatrix",
    apiVersion: 2,
    dependencies: [
        "sap.ui.core",
        "sap.m"
    ],
    controls: [

    ],
    noLibraryCSS: true,
    version: "0.0.1"
});

export default library;