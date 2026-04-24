import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import ValueHelpDialog, { ValueHelpDialog$OkEvent } from "sap/ui/comp/valuehelpdialog/ValueHelpDialog";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import DialogForm from "ui5/genatrix/control/v2/form/DialogForm";
import ResponsiveTable from "sap/m/Table";
import ResponsiveTableColumn from "sap/m/Column";
import GridTable from "sap/ui/table/Table";
import GridTableColumn from "sap/ui/table/Column";
import FilterBarGenerator from "ui5/genatrix/generator/core/FilterBarGenerator";
import MetadataParser from "ui5/genatrix/odata/v2/MetadataParser";
import { FilterBarGenerator$SearchEvent } from "ui5/genatrix/types/generator/core/FilterBarGenerator.types";
import { ValueListSettings } from "ui5/genatrix/types/metadata/form/ValueList.types";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";
import ValueListParameter from "ui5/genatrix/metadata/form/ValueListParameter";
import ColumnListItem from "sap/m/ColumnListItem";
import Label from "sap/m/Label";
import Control from "sap/ui/core/Control";
import Text from "sap/m/Text";
import ODataBoolean from "sap/ui/model/odata/type/Boolean";
import ODataString from "sap/ui/model/odata/type/String";
import { DateTimeConstraints, NumberConstraints, NumberFormatOptions } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";
import Byte from "sap/ui/model/odata/type/Byte";
import SByte from "sap/ui/model/odata/type/SByte";
import Int16 from "sap/ui/model/odata/type/Int16";
import Int32 from "sap/ui/model/odata/type/Int32";
import Int64 from "sap/ui/model/odata/type/Int64";
import Single from "sap/ui/model/odata/type/Single";
import Double from "sap/ui/model/odata/type/Double";
import Decimal from "sap/ui/model/odata/type/Decimal";
import Guid from "sap/ui/model/odata/type/Guid";
import ODataDate from "sap/ui/model/odata/type/Date";
import DateTime from "sap/ui/model/odata/type/DateTime";
import Time from "sap/ui/model/odata/type/Time";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";
import CustomMessageBox from "ui5/genatrix/util/CustomMessageBox";

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
            dateRangeOptions: { type: "string" },
            datePattern: { type: "string" },
            timePattern: { type: "string" },
            dateTimeSeparator: { type: "string", defaultValue: " " },
            dateFirst: { type: "boolean", defaultValue: true },
            groupingEnabled: { type: "boolean", defaultValue: true },
            groupingSeparator: { type: "string" },
            groupingSize: { type: "int", defaultValue: 3 },
            decimalSeparator: { type: "string" },
            parseEmptyValueToZero: { type: "boolean", defaultValue: false },
            filterBarExpanded: { type: "boolean", defaultValue: false },
            filterBarWithParametersOnly: { type: "boolean", defaultValue: false },
            nonFilterableProperties: { type: "string" },
            showUserInputError: { type: "boolean", defaultValue: true },
            userInputErrorMessage: { type: "string", defaultValue: LibraryBundle.getText("genatrix.error.valueListUserInput") }
        },
        defaultAggregation: "parameters",
        aggregations: {
            parameters: { type: "ui5.genatrix.metadata.form.ValueListParameter", multiple: true, singularName: "parameter" },
            propertyOptions: { type: "ui5.genatrix.metadata.form.ValueListPropertyOption", multiple: true, singularName: "propertyOption" }
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
            filterBarWithParametersOnly: this.getFilterBarWithParametersOnly() ?? false,
            nonFilterableProperties: this.getNonFilterableProperties()?.split(",") || [],
            parameters: parameters,
            propertyOptions: this.getPropertyOptions()
        });

        const entitySet = this.getEntitySetOrThrow();
        const properties = await metadataParser.getEntityProperties(entitySet);

        this.filterBarGenerator = new FilterBarGenerator({
            properties: properties,
            propertyOptions: this.getPropertyOptions(),
            searchSupported: this.getSearchSupported() ?? true,
            caseSensitiveSearch: this.getCaseSensitiveSearch() ?? false,
            dateRangeOptions: this.getDateRangeOptions(),
            datePattern: this.getDatePattern(),
            timePattern: this.getTimePattern(),
            dateTimeSeparator: this.getDateTimeSeparator() ?? " ",
            dateFirst: this.getDateFirst() ?? true,
            groupingEnabled: this.getGroupingEnabled() ?? true,
            groupingSeparator: this.getGroupingSeparator(),
            groupingSize: this.getGroupingSize() ?? 3,
            decimalSeparator: this.getDecimalSeparator(),
            parseEmptyValueToZero: this.getParseEmptyValueToZero() ?? false,
            filterBarExpanded: this.getFilterBarExpanded() ?? false,
            oDataModel: this.getODataModelFromParent()
        });

        this.vhd = new ValueHelpDialog({
            title: this.getTitle() || this.getEntitySetOrThrow(),
            supportMultiselect: false,
            supportRanges: false,
            busyIndicatorDelay: 0,
            filterBar: this.filterBarGenerator.generate()
        });

        this.filterBarGenerator.attachSearch(this.onSearch, this);
        this.vhd.attachOk(this.onConfirm, this);
        this.vhd.attachCancel(this.onCancel, this);
        this.vhd.attachAfterClose(this.onAfterClose, this);

        await this.bindTable(properties, parameters);
        this.vhd.update();

        if (!this.vhd.isOpen()) {
            this.vhd.open();
        }

        this.hideBusy();
    }

    private async bindTable(properties: EntityProperty[], parameters: ValueListParameter[]) {
        const table = await this.vhd.getTableAsync();

        if (table instanceof GridTable) {
            table.setBusyIndicatorDelay(0);
            this.bindGridTable(table, properties, parameters);
        }

        if (table instanceof ResponsiveTable) {
            table.setBusyIndicatorDelay(0);
            this.bindResponsiveTable(table, properties, parameters);
        }
    }

    private bindGridTable(table: GridTable, properties: EntityProperty[], parameters: ValueListParameter[]) {
        table.setBusy(true);
        table.setModel(this.getODataModelFromParent());
        table.bindRows({
            path: "/" + this.getEntitySetOrThrow(),
            events: {
                dataReceived: () => {
                    table.setBusy(false);
                    this.vhd.update();
                }
            }
        });

        this.addGridTableColumns(table, properties, parameters);
    }

    private addGridTableColumns(table: GridTable, properties: EntityProperty[], parameters: ValueListParameter[]) {
        for (const parameter of parameters) {
            const property = properties.find(property => property.name === parameter.getValueListProperty());

            if (parameter.getType() === "In" || parameter.getType() === "FilterOnly" || !property) {
                continue;
            }

            table.addColumn(new GridTableColumn({
                label: new Label({ text: property.label }),
                template: this.getTextControl(property)
            }));
        }
    }

    private bindResponsiveTable(table: ResponsiveTable, properties: EntityProperty[], parameters: ValueListParameter[]) {
        table.setBusy(true);
        table.setModel(this.getODataModelFromParent());
        table.bindItems({
            path: "/" + this.getEntitySet(),
            template: new ColumnListItem({
                cells: this.addResponsiveTableColumns(table, properties, parameters)
            }),
            events: {
                dataReceived: () => {
                    table.setBusy(false);
                    this.vhd.update();
                }
            }
        });
    }

    private addResponsiveTableColumns(table: ResponsiveTable, properties: EntityProperty[], parameters: ValueListParameter[]) {
        const cells: Control[] = [];

        for (const parameter of parameters) {
            const property = properties.find(property => property.name === parameter.getValueListProperty());

            if (parameter.getType() === "In" || parameter.getType() === "FilterOnly" || !property) {
                continue;
            }

            table.addColumn(new ResponsiveTableColumn({
                header: new Label({ text: property.label })
            }));

            cells.push(this.getTextControl(property));
        }

        return cells;
    }

    private async onSearch(event: FilterBarGenerator$SearchEvent) {
        const filter = event.getParameter("filter");
        const userInputError = event.getParameter("userInputError");

        if (userInputError) {
            if (this.getShowUserInputError()) {
                const errorMessage = this.getUserInputErrorMessage() || LibraryBundle.getText("genatrix.error.valueListUserInput");
                CustomMessageBox.error(errorMessage);
            }
        } else {
            const binding = await this.getListBinding();

            if (!binding) {
                return;
            }

            binding.filter(filter);
        }
    }

    private onConfirm(event: ValueHelpDialog$OkEvent) {
        event.getParameters();
    }

    private onCancel() {
        this.vhd.close();
    }

    private onAfterClose() {
        this.vhd.destroy();
    }

    private getTextControl(property: EntityProperty) {
        return new Text({
            text: {
                path: property.name,
                type: this.getODataType(property)
            }
        });
    }

    private getODataType(property: EntityProperty) {
        switch (property.type) {
            case "Edm.Boolean":
                return new ODataBoolean();
            case "Edm.Byte":
                return new Byte(this.getNumberFormatOptions(), this.getNumberConstraints(property));
            case "Edm.SByte":
                return new SByte(this.getNumberFormatOptions(), this.getNumberConstraints(property));
            case "Edm.Int16":
                return new Int16(this.getNumberFormatOptions(), this.getNumberConstraints(property));
            case "Edm.Int32":
                return new Int32(this.getNumberFormatOptions(), this.getNumberConstraints(property));
            case "Edm.Int64":
                return new Int64(this.getNumberFormatOptions() || { parseEmptyValueToZero: false }, this.getNumberConstraints(property) || { nullable: true });
            case "Edm.Single":
                return new Single(this.getNumberFormatOptions(), this.getNumberConstraints(property));
            case "Edm.Double":
                return new Double(this.getNumberFormatOptions(), this.getNumberConstraints(property));
            case "Edm.Decimal":
                return new Decimal(this.getNumberFormatOptions(), this.getNumberConstraints(property));
            case "Edm.Guid":
                return new Guid();
            case "Edm.DateTime":
                if (property.displayFormat === "Date") {
                    return new ODataDate(this.getDateTimeFormatOptions(property), this.getDateConstraints());
                } else {
                    return new DateTime(this.getDateTimeFormatOptions(property));
                }
            case "Edm.DateTimeOffset":
                return new DateTime(this.getDateTimeFormatOptions(property));
            case "Edm.Time":
                return new Time(this.getDateTimeFormatOptions(property));
            default:
                return new ODataString();
        }
    }

    private getNumberFormatOptions() {
        const groupingSeparator = this.getGroupingSeparator();
        const decimalSeparator = this.getDecimalSeparator();
        const formatOptions: NumberFormatOptions = {
            groupingEnabled: this.getGroupingEnabled() ?? true,
            groupingSize: this.getGroupingSize() ?? 3,
            parseEmptyValueToZero: this.getParseEmptyValueToZero() ?? false
        };

        if (groupingSeparator && decimalSeparator) {
            if (groupingSeparator === decimalSeparator) {
                throw new Error("Grouping Separator and Decimal Separator cannot be identical");
            }

            formatOptions.groupingSeparator = groupingSeparator;
            formatOptions.decimalSeparator = decimalSeparator;
        } else if (groupingSeparator) {
            formatOptions.groupingSeparator = groupingSeparator;
            formatOptions.decimalSeparator = this.getCounterNumberSeparator(groupingSeparator);
        } else if (decimalSeparator) {
            formatOptions.decimalSeparator = decimalSeparator;
            formatOptions.groupingSeparator = this.getCounterNumberSeparator(decimalSeparator);
        }

        return formatOptions;
    }

    private getNumberConstraints(property: EntityProperty) {
        const constraints: NumberConstraints = {
            precision: property.precision,
            scale: property.scale
        };
        const isEmpty = Object.values(constraints).every(value => value == null);

        if (isEmpty) {
            return;
        }

        return constraints;
    }

    private getCounterNumberSeparator(separator: string) {
        switch (separator) {
            case ".":
                return ",";
            case ",":
                return ".";
            default:
                return ",";
        }
    }

    private getDateConstraints() {
        const constraints: DateTimeConstraints = {
            displayFormat: "Date"
        };

        return constraints;
    }

    private getDateTimeFormatOptions(property: EntityProperty) {
        const datePattern = this.getDatePattern();
        const timePattern = this.getTimePattern();
        const dateTimeSeparator = this.getDateTimeSeparator() ?? " ";
        const dateFirst = this.getDateFirst() ?? true;

        switch (property.type) {
            case "Edm.DateTime":
                if (property.displayFormat === "Date") {
                    if (datePattern) {
                        return {
                            pattern: datePattern
                        };
                    }
                } else {
                    if (datePattern && timePattern) {
                        return {
                            pattern: dateFirst ? `${datePattern}${dateTimeSeparator}${timePattern}` : `${timePattern}${dateTimeSeparator}${datePattern}`
                        };
                    }
                }

                break;
            case "Edm.DateTimeOffset":
                if (datePattern && timePattern) {
                    return {
                        pattern: dateFirst ? `${datePattern}${dateTimeSeparator}${timePattern}` : `${timePattern}${dateTimeSeparator}${datePattern}`
                    };
                }

                break;
            case "Edm.Time":
                if (timePattern) {
                    return {
                        pattern: timePattern
                    };
                }

                break;
        }
    }

    private async getListBinding() {
        const table = await this.vhd.getTableAsync();

        if (table instanceof GridTable) {
            table.setBusy(true);
            return table.getBinding("rows") as ODataListBinding;
        }

        if (table instanceof ResponsiveTable) {
            table.setBusy(true);
            return table.getBinding("items") as ODataListBinding;
        }
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