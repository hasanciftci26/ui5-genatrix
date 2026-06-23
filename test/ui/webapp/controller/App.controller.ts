import BaseController from "ui5/genatrix/test/ui/controller/BaseController";

/**
 * @namespace ui5.genatrix.test.ui.controller
 */
export default class App extends BaseController {
    public onNavToHomepage() {
        this.navTo("RouteHomepage");
    }
}