import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import ValueHelpDialog, { ValueHelpDialog$OkEvent } from "sap/ui/comp/valuehelpdialog/ValueHelpDialog";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import DialogForm from "ui5/genatrix/control/v2/form/DialogForm";
import FilterBarGenerator from "ui5/genatrix/generator/core/FilterBarGenerator";
import MetadataParser from "ui5/genatrix/odata/v2/MetadataParser";
import { ValueListSettings } from "ui5/genatrix/types/metadata/form/ValueList.types";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class ValueList extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            propertyName: { type: "string" },
            entitySet: { type: "string" },
            searchSupported: { type: "boolean", defaultValue: true },
            caseSensitiveSearch: { type: "boolean", defaultValue: false },
            title: { type: "string" },
            valueListWithFixedValues: { type: "boolean", defaultValue: false },
            dateRangeOptions: { type: "string" }
        },
        defaultAggregation: "parameters",
        aggregations: {
            parameters: { type: "ui5.genatrix.metadata.form.ValueListParameter", multiple: true, singularName: "parameter" }
        }
    };
    private vhd: ValueHelpDialog;
    private filterBarGenerator: FilterBarGenerator;

    constructor(settings?: ValueListSettings);
    constructor(id?: string, settings?: ValueListSettings);

    constructor(idOrSettings?: string | ValueListSettings, settings?: ValueListSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public async open() {
        this.showBusy();
        const parameters = this.getParametersOrThrow();

        const metadataParser = new MetadataParser({
            type: "ValueList",
            classId: this.getId(),
            model: this.getODataModelFromParent(),
            valueListParameters: parameters
        });

        const entitySet = this.getEntitySetOrThrow();
        const properties = await metadataParser.getEntityProperties(entitySet);

        this.filterBarGenerator = new FilterBarGenerator({
            properties: properties,
            parameters: parameters,
            searchSupported: this.getSearchSupported() ?? true,
            caseSensitiveSearch: this.getCaseSensitiveSearch() ?? false,
            oDataModel: this.getODataModelFromParent()
        });

        this.vhd = new ValueHelpDialog({
            title: this.getTitle() || this.getEntitySetOrThrow(),
            supportMultiselect: false,
            supportRanges: false,
            busyIndicatorDelay: 0,
            filterBar: this.filterBarGenerator.generate()
        });

        this.vhd.attachOk(this.onConfirm, this);
        this.vhd.attachCancel(this.onCancel, this);

        await this.bindTable();
        this.vhd.update();

        if (!this.vhd.isOpen()) {
            this.vhd.open();
        }

        this.hideBusy();
    }

    private async bindTable() {

    }

    private onConfirm(event: ValueHelpDialog$OkEvent) {
        event.getParameters();
    }

    private onCancel() {

    }

    private getEntitySetOrThrow() {
        const entitySet = this.getEntitySet();

        if (!entitySet) {
            this.throwRuntimeError("entitySet is a required property");
        }

        return entitySet;
    }

    private getParametersOrThrow() {
        const parameters = this.getParameters().map(param => param.getOrThrow());

        if (!parameters.length) {
            this.throwRuntimeError("At least one ValueListParameter is required");
        }

        const hasOutParameter = parameters.some(param => param.getType() === "InOut" || param.getType() === "Out");

        if (!hasOutParameter) {
            this.throwRuntimeError("At least one ValueListParameter with InOut or Out type must be provided");
        }

        return parameters;
    }

    private showBusy() {
        BusyIndicator.show(0);
    }

    private hideBusy() {
        BusyIndicator.hide();
    }

    private getODataModelFromParent() {
        const parent = this.getParent() as DialogForm;
        return parent.getODataModel();
    }

    private throwRuntimeError(message: string): never {
        throw new Error(`${message} - ${this.getId()}`);
    }
}