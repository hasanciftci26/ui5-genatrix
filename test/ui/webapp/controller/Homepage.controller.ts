import SmartFilterBar from "sap/ui/comp/smartfilterbar/SmartFilterBar";
import SmartTable from "sap/ui/comp/smarttable/SmartTable";
import BaseController from "ui5/genatrix/test/ui/controller/BaseController";

/**
 * @namespace ui5.genatrix.test.ui.controller
 */
export default class Homepage extends BaseController {
    // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
    // Properties
    // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
    // Lifecycle Methods
    // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

    public override onInit() {
        this.getById<SmartFilterBar>("sfbEmployees").setModel(this.getODataModelV2());
        this.getById<SmartTable>("stEmployees").setModel(this.getODataModelV2());
        this.attachPatternMatched("RouteHomepage", this.onRoutePatternMatched.bind(this));
    }

    // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
    // Event Handlers
    // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

    public onCreateEmployee() {
        this.navTo("RouteNewEmployee");
    }

    // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
    // Internal Methods
    // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

    private onRoutePatternMatched() {

    }
}