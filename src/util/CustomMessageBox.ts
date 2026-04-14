import MessageBox from "sap/m/MessageBox";
import BaseObject from "sap/ui/base/Object";

/**
 * @namespace ui5.genatrix.util
 */
export default class CustomMessageBox extends BaseObject {
    public static error(message: string) {
        MessageBox.error(message, {
            contentWidth: "20%",
            styleClass: "customMessageBox"
        });
    }
}