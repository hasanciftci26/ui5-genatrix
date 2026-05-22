import MessageBox from "sap/m/MessageBox";
import BaseObject from "sap/ui/base/Object";
import includeStylesheet from "sap/ui/dom/includeStylesheet";

/**
 * @namespace ui5.genatrix.util
 */
export default class CustomMessageBox extends BaseObject {
    private static cssLoaded = false;

    public static error(message: string) {
        this.ensureCssLoaded();

        MessageBox.error(message, {
            contentWidth: "20%",
            styleClass: "customMessageBox"
        });
    }

    public static confirm(message: string, callback: (confirmed: boolean) => void) {
        this.ensureCssLoaded();

        MessageBox.confirm(message, {
            contentWidth: "20%",
            actions: ["OK", "CANCEL"],
            initialFocus: "CANCEL",
            emphasizedAction: "OK",
            styleClass: "customMessageBox",
            onClose: (event: string | null) => {
                callback(event === "OK");
            }
        });
    }

    private static ensureCssLoaded() {
        if (this.cssLoaded) {
            return;
        }

        this.cssLoaded = true;

        void includeStylesheet(
            sap.ui.require.toUrl("ui5/genatrix/css/style.css")
        );
    }
}