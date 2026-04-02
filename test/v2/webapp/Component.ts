import UIComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "ui5/genatrix/test/v2/model/models";

/**
 * @namespace ui5.genatrix.test.v2
 */
export default class Component extends UIComponent {
    public static metadata = {
        manifest: "json"
    };

    public override init() {
        super.init();
        this.getRouter().initialize();
        this.setModel(createDeviceModel(), "device");
    }
}