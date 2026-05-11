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
import { SuggestHandlerData, ValueListSettings } from "ui5/genatrix/types/metadata/form/ValueList.types";
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
import Context from "sap/ui/model/odata/v2/Context";
import ParameterType from "ui5/genatrix/metadata/enum/valuelist/ParameterType";
import CustomInput from "ui5/genatrix/control/extension/CustomInput";
import { Input$SuggestEvent } from "sap/m/Input";
import Filter from "sap/ui/model/Filter";
import TextArrangement from "ui5/genatrix/control/enum/form/TextArrangement";
import { TextArrangementType } from "ui5/genatrix/types/control/global/Form.types";
import Item from "sap/ui/core/Item";
import ValueListValidator from "ui5/genatrix/metadata/form/ValueListValidator";
import { InputBase$ChangeEvent } from "sap/m/InputBase";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class ValueList extends ManagedObject {
    public static readonly metadata: MetadataOptions = {
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
        },
        events: {
            itemSelected: {
                allowPreventDefault: false,
                parameters: {
                    context: { type: "object" }
                }
            }
        }
    };
    private readonly validator = new ValueListValidator();
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
        const entitySet = this.getEntitySetOrThrow();
        const properties = await this.getValueListProperties(entitySet, parameters);

        this.filterBarGenerator = new FilterBarGenerator({
            properties: properties,
            parameters: parameters,
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

        this.filterBarGenerator.setInitialFilters(this.getContextFromParent());
        this.hideBusy();
    }

    public async bindSuggestionRows(input: CustomInput) {
        const parameters = this.getParametersOrThrow();
        const entitySet = this.getEntitySetOrThrow();
        const properties = await this.getValueListProperties(entitySet, parameters);
        const columns = this.addSuggestionColumns(input, properties, parameters);
        const ownerPropertyParam = this.getOwnerPropertyParameter();
        const valueListPropertyOptions = this.getPropertyOptions().find(opt => opt.getPropertyName() === ownerPropertyParam.getValueListProperty());
        const valueListTextProperty = properties.find(prop => prop.name === valueListPropertyOptions?.getTextProperty());
        const textArrangement = valueListPropertyOptions?.getTextArrangement() || TextArrangement.TextFirst;

        input.setFilterSuggests(false);
        input.attachSuggest({ properties: columns.filter }, this.onSuggest, this);
        input.setTextFormatMode("Key");

        input.attachChange((event: InputBase$ChangeEvent) => {
            const value = event.getParameter("value");

            if (input.getSelectedKey() || !value) {
                return;
            }

            void this.validateValueList(input, value);
        });

        if (valueListTextProperty) {
            switch (textArrangement) {
                case TextArrangement.TextFirst:
                    input.setTextFormatMode("ValueKey");
                    break;
                case TextArrangement.TextLast:
                    input.setTextFormatMode("KeyValue");
                    break;
                case TextArrangement.TextOnly:
                    input.setTextFormatMode("Value");
                    break;
            }
        }

        input.setSuggestionRowValidator((columnListItem: ColumnListItem) => {
            const context = columnListItem.getBindingContext() as Context;
            const keyValue = context.getProperty(ownerPropertyParam.getValueListProperty() as string);
            let textValue = keyValue;

            if (valueListTextProperty) {
                textValue = context.getProperty(valueListTextProperty.name);
            }

            return new Item({
                key: keyValue,
                text: textValue
            });
        });

        input.bindSuggestionRows({
            path: "/" + this.getEntitySet(),
            template: new ColumnListItem({
                cells: columns.cells
            })
        });
    }

    public async validateValueList(input: CustomInput, value: string) {
        const parameters = this.getParametersOrThrow();
        const entitySet = this.getEntitySetOrThrow();
        const properties = await this.getValueListProperties(entitySet, parameters);
        const ownerPropertyParam = this.getOwnerPropertyParameter();
        const valueListPropertyOptions = this.getPropertyOptions().find(opt => opt.getPropertyName() === ownerPropertyParam.getValueListProperty());
        const valueListTextProperty = properties.find(prop => prop.name === valueListPropertyOptions?.getTextProperty());
        const textArrangement = valueListPropertyOptions?.getTextArrangement() || TextArrangement.TextFirst;

        return this.validator.validateAndSet({
            value: value,
            model: this.getODataModelFromParent(),
            source: input,
            entitySet: this.getEntitySetOrThrow(),
            keyProperty: ownerPropertyParam.getValueListProperty() as string,
            textProperty: valueListTextProperty?.name,
            textArrangement: textArrangement
        });
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
            const propertyOptions = this.getPropertyOptions().find(opt => opt.getPropertyName() === parameter.getValueListProperty());
            const textProperty = properties.find(property => property.name === propertyOptions?.getTextProperty());

            if (parameter.getType() === ParameterType.FilterOnly || !property) {
                continue;
            }

            table.addColumn(new GridTableColumn({
                label: new Label({ text: property.label }),
                template: this.getTextControl(property, textProperty, propertyOptions?.getTextArrangement())
            }));

            // Add as a separate column
            if (textProperty && propertyOptions?.getTextArrangement() === TextArrangement.TextSeparate) {
                table.addColumn(new GridTableColumn({
                    label: new Label({ text: textProperty.label }),
                    template: this.getTextControl(textProperty)
                }));
            }
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
            const propertyOptions = this.getPropertyOptions().find(opt => opt.getPropertyName() === parameter.getValueListProperty());
            const textProperty = properties.find(property => property.name === propertyOptions?.getTextProperty());

            if (parameter.getType() === ParameterType.FilterOnly || !property) {
                continue;
            }

            table.addColumn(new ResponsiveTableColumn({
                header: new Label({ text: property.label })
            }));

            cells.push(this.getTextControl(property, textProperty, propertyOptions?.getTextArrangement()));

            // Add as a separate column
            if (textProperty && propertyOptions?.getTextArrangement() === TextArrangement.TextSeparate) {
                table.addColumn(new ResponsiveTableColumn({
                    header: new Label({ text: textProperty.label })
                }));

                cells.push(this.getTextControl(textProperty));
            }
        }

        return cells;
    }

    private addSuggestionColumns(input: CustomInput, properties: EntityProperty[], parameters: ValueListParameter[]) {
        const cells: Control[] = [];
        const filter: string[] = [];

        for (const parameter of parameters) {
            const property = properties.find(property => property.name === parameter.getValueListProperty());
            const propertyOptions = this.getPropertyOptions().find(opt => opt.getPropertyName() === parameter.getValueListProperty());
            const textProperty = properties.find(property => property.name === propertyOptions?.getTextProperty());

            if (parameter.getType() === ParameterType.FilterOnly || !property) {
                continue;
            }

            input.addSuggestionColumn(new ResponsiveTableColumn({
                header: new Label({ text: property.label })
            }));

            cells.push(this.getTextControl(property, textProperty, propertyOptions?.getTextArrangement()));

            if (property.type === "Edm.String") {
                filter.push(property.name);
            }

            // Add as a separate column
            if (textProperty && propertyOptions?.getTextArrangement() === TextArrangement.TextSeparate) {
                input.addSuggestionColumn(new ResponsiveTableColumn({
                    header: new Label({ text: textProperty.label })
                }));

                cells.push(this.getTextControl(textProperty));
            }

            if (textProperty?.type === "Edm.String") {
                filter.push(textProperty.name);
            }
        }

        return {
            cells: cells,
            filter: filter
        };
    }

    private onSuggest(event: Input$SuggestEvent, filter: SuggestHandlerData) {
        const value = event.getParameter("suggestValue");
        const binding = event.getSource().getBinding("suggestionRows") as ODataListBinding;

        if (value && filter.properties.length) {
            const filters: Filter[] = [];

            for (const property of filter.properties) {
                filters.push(new Filter({
                    path: property,
                    operator: "Contains",
                    value1: value,
                    caseSensitive: this.getCaseSensitiveSearch() ?? false
                }));
            }

            binding.filter(new Filter({
                filters: filters,
                and: false
            }));
        } else {
            binding.filter();
        }
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

    private async onConfirm(event: ValueHelpDialog$OkEvent) {
        const table = await event.getSource().getTableAsync();

        if (table instanceof GridTable) {
            const [selectedIndex] = table.getSelectedIndices();
            const context = table.getContextByIndex(selectedIndex as number) as Context;

            this.setOutValues(context);

            this.fireItemSelected({
                context: context
            });
        }

        if (table instanceof ResponsiveTable) {
            const context = table.getSelectedItem().getBindingContext() as Context;
            this.setOutValues(context);

            this.fireItemSelected({
                context: context
            });
        }

        this.vhd.close();
    }

    private setOutValues(context: Context) {
        for (const param of this.getParameters()) {
            if (param.getType() !== ParameterType.Out && param.getType() !== ParameterType.InOut) {
                continue;
            }

            const value = context.getProperty(param.getValueListProperty() as string);
            const path = this.getParameterPath(param.getLocalDataProperty() as string);
            this.getODataModelFromParent().setProperty(path, value);
        }
    }

    private onCancel() {
        this.vhd.close();
    }

    private onAfterClose() {
        this.vhd.destroy();
    }

    private getTextControl(property: EntityProperty, textProperty?: EntityProperty, textArrangement?: TextArrangementType) {
        if (textProperty && textArrangement !== TextArrangement.TextSeparate) {
            const arrangement = textArrangement || TextArrangement.TextFirst;
            let bindingPath = `{${property.name}}`;

            switch (arrangement) {
                case TextArrangement.TextFirst:
                    bindingPath = `{${textProperty.name}} ({${property.name}})`;
                    break;
                case TextArrangement.TextLast:
                    bindingPath = `{${property.name}} ({${textProperty.name}})`;
                    break;
                case TextArrangement.TextOnly:
                    bindingPath = `{${textProperty.name}}`;
                    break;
            }

            return new Text({
                text: bindingPath
            });
        } else {
            return new Text({
                text: {
                    path: property.name,
                    type: this.getODataType(property)
                }
            });
        }
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
        const ownerProperty = this.getPropertyName() as string;

        if (!parameters.length) {
            this.throwRuntimeError("At least one ValueListParameter is required");
        }

        const hasOutParameter = parameters.some(param => param.getType() === ParameterType.InOut || param.getType() === ParameterType.Out);

        if (!hasOutParameter) {
            this.throwRuntimeError("At least one ValueListParameter with InOut or Out type must be provided");
        }

        const propertyHasParam = parameters.some((param) => {
            return (param.getLocalDataProperty() === ownerProperty) && (param.getType() === ParameterType.InOut || param.getType() === ParameterType.Out);
        });

        if (!propertyHasParam) {
            this.throwRuntimeError("Property: " + ownerProperty + " must have a ValueListParameter with InOut or Out type");
        }

        const outParams = new Set();
        let duplicateKey: string | null = null;

        const duplicateOutParam = parameters.some((param) => {
            const type = param.getType();

            if (type === ParameterType.InOut || type === ParameterType.Out) {
                const key = param.getLocalDataProperty() as string;

                if (outParams.has(key)) {
                    duplicateKey = key;
                    return true;
                }

                outParams.add(key);
            }

            return false;
        });

        if (duplicateOutParam) {
            this.throwRuntimeError(
                `The Local Data Property "${duplicateKey}" is assigned more than once for InOut/Out parameters. Each property can only be used once.`
            );
        }

        return parameters;
    }

    private getOwnerPropertyParameter() {
        const ownerProperty = this.getPropertyName() as string;
        const parameter = this.getParameters().find(param => param.getLocalDataProperty() === ownerProperty);

        if (!parameter || (parameter.getType() !== ParameterType.InOut && parameter.getType() !== ParameterType.Out)) {
            this.throwRuntimeError("Property: " + ownerProperty + " must have a ValueListParameter with InOut or Out type");
        }

        return parameter;
    }

    private async getValueListProperties(entitySet: string, parameters: ValueListParameter[]) {
        const metadataParser = new MetadataParser({
            type: "ValueList",
            classId: this.getId(),
            model: this.getODataModelFromParent(),
            filterBarWithParametersOnly: this.getFilterBarWithParametersOnly() ?? false,
            nonFilterableProperties: this.getNonFilterableProperties()?.split(",") || [],
            parameters: parameters,
            propertyOptions: this.getPropertyOptions()
        });

        return metadataParser.getEntityProperties(entitySet);
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

    private getContextFromParent() {
        const parent = this.getParent() as DialogForm;
        return parent.getContext();
    }

    private getParameterPath(propertyName: string) {
        return `${this.getContextFromParent().getPath()}/${propertyName}`;
    }

    private throwRuntimeError(message: string): never {
        throw new Error(`${message} - ${this.getId()}`);
    }
}