import ResourceBundle from "sap/base/i18n/ResourceBundle";
import BaseObject from "sap/ui/base/Object";
import Lib from "sap/ui/core/Lib";

/**
 * @namespace ui5.genatrix.util
 */
export default class LibraryBundle extends BaseObject {
    public static getText(key: string, args?: any[]) {
        const bundle = Lib.getResourceBundleFor("ui5.genatrix") as ResourceBundle;
        return bundle.getText(key, args, false) as string;
    }
}