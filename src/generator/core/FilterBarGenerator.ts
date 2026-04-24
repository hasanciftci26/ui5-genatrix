import DynamicDateFormat from "sap/m/DynamicDateFormat";
import DynamicDateRange, { DynamicDateRange$ChangeEvent } from "sap/m/DynamicDateRange";
import SearchField from "sap/m/SearchField";
import Select from "sap/m/Select";
import TimePicker from "sap/m/TimePicker";
import EventProvider from "sap/ui/base/EventProvider";
import FilterBar from "sap/ui/comp/filterbar/FilterBar";
import FilterGroupItem from "sap/ui/comp/filterbar/FilterGroupItem";
import Item from "sap/ui/core/Item";
import { ValueState } from "sap/ui/core/library";
import Messaging from "sap/ui/core/Messaging";
import Filter from "sap/ui/model/Filter";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataBoolean from "sap/ui/model/odata/type/Boolean";
import ODataString from "sap/ui/model/odata/type/String";
import Time from "sap/ui/model/odata/type/Time";
import Context from "sap/ui/model/odata/v2/Context";
import CustomFBInput from "ui5/genatrix/control/extension/CustomFBInput";
import CustomFBMultiInput from "ui5/genatrix/control/extension/CustomFBMultiInput";
import FilterRestriction from "ui5/genatrix/metadata/enum/valuelist/FilterRestriction";
import ParameterType from "ui5/genatrix/metadata/enum/valuelist/ParameterType";
import {
    FilterBarControl,
    FilterBarGenerator$SearchEventHandler,
    FilterBarGeneratorSettings
} from "ui5/genatrix/types/generator/core/FilterBarGenerator.types";
import { FilterRestrictionType } from "ui5/genatrix/types/metadata/form/ValueListPropertyOption.types";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.generator.core
 */
export default class FilterBarGenerator extends EventProvider {
    private readonly settings: FilterBarGeneratorSettings;
    private readonly model = new JSONModel();
    private readonly modelName = "genatrixFilterBarModel";
    private readonly controls: FilterBarControl[] = [];
    private fb: FilterBar;
    private searchField?: SearchField;

    constructor(settings: FilterBarGeneratorSettings) {
        super();
        this.settings = settings;
    }

    public generate() {
        this.fb = new FilterBar({
            advancedMode: true,
            isRunningInValueHelpDialog: true,
            filterGroupItems: this.getFilterGroupItems(),
            showClearOnFB: false,
            filterBarExpanded: this.settings.filterBarExpanded
        });

        if (this.settings.searchSupported) {
            this.searchField = this.getSearchField();
            this.fb.setBasicSearch(this.searchField);

            this.searchField.attachSearch(() => {
                this.fb.search();
            });
        }

        this.model.setDefaultBindingMode("TwoWay");
        this.fb.attachSearch(this.onSearch, this);
        this.fb.setModel(this.model, this.modelName);
        return this.fb;
    }

    public setInitialFilters(context: Context) {
        const parameters = this.settings.parameters.filter(param => param.getType() === ParameterType.In || param.getType() === ParameterType.InOut);
        let triggerSearch = false;

        for (const param of parameters) {
            const property = this.settings.properties.find(prop => prop.name === param.getValueListProperty());

            if (!property) {
                continue;
            }

            const value = context.getProperty(param.getLocalDataProperty() as string);

            if (value == null || value === "") {
                continue;
            }

            const control = this.controls.find(cont => cont.propertyName === property.name)?.control;

            if (!control) {
                continue;
            }

            if (control instanceof CustomFBInput) {
                const success = control.setInitialValue(value);

                if (success) {
                    triggerSearch = true;
                }
            } else if (control instanceof CustomFBMultiInput) {
                const success = control.addInitialToken(value);

                if (success) {
                    triggerSearch = true;
                }
            } else if (control instanceof Select) {
                const success = this.setInitialSelectValue(control, value);

                if (success) {
                    triggerSearch = true;
                }
            } else if (control instanceof TimePicker) {
                const success = this.setInitialTimePickerValue(control, value);

                if (success) {
                    triggerSearch = true;
                }
            } else if (control instanceof DynamicDateRange) {
                const success = this.setInitialDynamicDateRangeValue(control, value);

                if (success) {
                    triggerSearch = true;
                }
            }
        }

        if (triggerSearch) {
            this.fb.search();
        }
    }

    public attachSearch(handler: FilterBarGenerator$SearchEventHandler, listener?: object) {
        this.attachEvent("search", handler, listener);
    }

    private fireSearch(userInputError: boolean, filter?: Filter) {
        this.fireEvent("search", {
            userInputError: userInputError,
            filter: filter
        });
    }

    private getFilterGroupItems() {
        const items: FilterGroupItem[] = [];
        const properties = this.settings.properties.filter(prop => prop.filterable);

        for (const property of properties) {
            const propertyOptions = this.settings.propertyOptions.find(opt => opt.getPropertyName() === property.name);
            const filterRestriction = propertyOptions?.getFilterRestriction() || FilterRestriction.MultiValue;
            const control = this.generateControl(property, filterRestriction);

            Messaging.registerObject(control, true);

            this.controls.push({
                propertyName: property.name,
                control: control
            });

            items.push(new FilterGroupItem({
                groupName: "__$INTERNAL$",
                name: property.name,
                label: property.label,
                visibleInFilterBar: true,
                control: control
            }));
        }

        return items;
    }

    private getSearchField() {
        const searchField = new SearchField({
            value: {
                path: `${this.modelName}>/genatrixFilterBarSearch`,
                type: new ODataString()
            }
        });

        return searchField;
    }

    private generateControl(property: EntityProperty, filterRestriction: FilterRestrictionType) {
        switch (property.type) {
            case "Edm.DateTime":
            case "Edm.DateTimeOffset":
                return this.getDynamicDateRange(property);
            case "Edm.Time":
                return this.getTimePicker(property);
            case "Edm.Boolean":
                return this.getSelect(property);
            default:
                if (filterRestriction === FilterRestriction.SingleValue) {
                    return this.getSingleInput(property);
                } else {
                    return this.getMultiInput(property);
                }
        }
    }

    private getDynamicDateRange(property: EntityProperty) {
        const control = new DynamicDateRange({
            name: property.name,
            standardOptions: this.settings.dateRangeOptions?.split(",")
        });

        if (property.type === "Edm.DateTime" && property.displayFormat === "Date" && this.settings.datePattern) {
            const formatter = DynamicDateFormat.getInstance({
                date: {
                    pattern: this.settings.datePattern
                }
            });

            control.setFormatter(formatter);
        } else if (this.settings.datePattern && this.settings.timePattern) {
            const pattern = this.settings.dateFirst ? `${this.settings.datePattern}${this.settings.dateTimeSeparator}${this.settings.timePattern}` :
                `${this.settings.timePattern}${this.settings.dateTimeSeparator}${this.settings.datePattern}`;

            const formatter = DynamicDateFormat.getInstance({
                datetime: {
                    pattern: pattern
                }
            });

            control.setFormatter(formatter);
        }

        control.attachChange(this.onDateRangeChange, this);
        return control;
    }

    private onDateRangeChange(event: DynamicDateRange$ChangeEvent) {
        if (event.getParameter("valid")) {
            event.getSource().setValueState("None");
        } else {
            event.getSource().setValueState("Error");
        }
    }

    private getTimePicker(property: EntityProperty) {
        const control = new TimePicker({
            name: property.name,
            value: {
                path: `${this.modelName}>/${property.name}`,
                type: new Time(this.getTimeFormatOptions())
            }
        });

        return control;
    }

    private getTimeFormatOptions() {
        if (this.settings.timePattern) {
            return {
                pattern: this.settings.timePattern
            };
        }
    }

    private getSelect(property: EntityProperty) {
        const type = new ODataBoolean();

        const control = new Select({
            name: property.name,
            selectedKey: {
                path: `${this.modelName}>/${property.name}`
            },
            items: [
                new Item({ key: "NONE", text: LibraryBundle.getText("genatrix.label.notSelected") }),
                new Item({ key: "YES", text: type.formatValue(true, "string") as string }),
                new Item({ key: "NO", text: type.formatValue(false, "string") as string })
            ]
        });

        this.model.setProperty(`/${property.name}`, "NONE");
        return control;
    }

    private getSingleInput(property: EntityProperty) {
        const input = CustomFBInput.createInstance(property.name, this.modelName, {
            property: property,
            groupingEnabled: this.settings.groupingEnabled,
            groupingSeparator: this.settings.groupingSeparator,
            groupingSize: this.settings.groupingSize,
            decimalSeparator: this.settings.decimalSeparator,
            parseEmptyValueToZero: this.settings.parseEmptyValueToZero
        });

        input.attachSubmit(() => this.fb.search());
        return input;
    }

    private getMultiInput(property: EntityProperty) {
        return CustomFBMultiInput.createInstance(property.name, this.modelName, {
            property: property,
            groupingEnabled: this.settings.groupingEnabled,
            groupingSeparator: this.settings.groupingSeparator,
            groupingSize: this.settings.groupingSize,
            decimalSeparator: this.settings.decimalSeparator,
            parseEmptyValueToZero: this.settings.parseEmptyValueToZero
        });
    }

    private onSearch() {
        try {
            const filter = this.getFilter();
            this.fireSearch(false, filter);
        } catch {
            this.fireSearch(true);
        }
    }

    private getFilter() {
        const filters: Filter[] = [];

        for (const groupItem of this.fb.getFilterGroupItems()) {
            const control = groupItem.getControl();

            if (control instanceof CustomFBInput) {
                this.addInputFilter(control, filters);
            } else if (control instanceof CustomFBMultiInput) {
                this.addMultiInputFilter(control, filters);
            } else if (control instanceof Select) {
                this.addSelectFilter(control, filters);
            } else if (control instanceof TimePicker) {
                this.addTimePickerFilter(control, filters);
            } else if (control instanceof DynamicDateRange) {
                this.addDynamicDateRangeFilter(control, filters);
            }
        }

        this.addSearchFieldFilter(filters);

        if (filters.length) {
            return new Filter({ filters: filters, and: true });
        }
    }

    private addInputFilter(control: CustomFBInput, filters: Filter[]) {
        if (control.getValueState() === ValueState.Error) {
            this.throwUserInputError();
        }

        const filter = control.getFilter(this.settings.caseSensitiveSearch);

        if (filter) {
            filters.push(filter);
        }
    }

    private addMultiInputFilter(control: CustomFBMultiInput, filters: Filter[]) {
        if (control.getValueState() === ValueState.Error) {
            this.throwUserInputError();
        }

        const filter = control.getFilter(this.settings.caseSensitiveSearch);

        if (filter) {
            filters.push(filter);
        }
    }

    private addSelectFilter(control: Select, filters: Filter[]) {
        if (control.getValueState() === ValueState.Error) {
            this.throwUserInputError();
        }

        const selectedKey = control.getSelectedKey();
        const propertyName = control.getName();

        if (selectedKey === "NONE") {
            return;
        }

        filters.push(new Filter(propertyName, "EQ", selectedKey === "YES"));
    }

    private addTimePickerFilter(control: TimePicker, filters: Filter[]) {
        if (control.getValueState() === ValueState.Error) {
            this.throwUserInputError();
        }

        const dateValue = control.getDateValue();

        if (dateValue != null) {
            const propertyName = control.getName();
            const value = this.convertTimeToODataFormat(dateValue);

            filters.push(new Filter(propertyName, "EQ", value));
        }
    }

    private addDynamicDateRangeFilter(control: DynamicDateRange, filters: Filter[]) {
        if (control.getValueState() === ValueState.Error) {
            this.throwUserInputError();
        }

        const value = control.getValue();

        if (value) {
            const dates = DynamicDateRange.toDates(value, "Default");
            const propertyName = control.getName();

            if (value.operator === "FROM" || value.operator === "FROMDATETIME") {
                filters.push(new Filter(propertyName, "GT", dates[0]));
            } else if (value.operator === "TO" || value.operator === "TODATETIME") {
                filters.push(new Filter(propertyName, "LT", dates[0]));
            } else {
                filters.push(new Filter(propertyName, "BT", dates[0], dates[1]));
            }
        }
    }

    private addSearchFieldFilter(filters: Filter[]) {
        if (this.searchField) {
            const value = this.searchField.getValue();

            if (value != null && value !== "") {
                const properties = this.settings.properties.filter(prop => prop.filterable && prop.type === "Edm.String");

                const subFilters: Filter[] = properties.map((prop) => {
                    return new Filter({
                        path: prop.name,
                        operator: "Contains",
                        value1: value,
                        caseSensitive: this.settings.caseSensitiveSearch
                    });
                });

                if (subFilters.length) {
                    filters.push(new Filter({ filters: subFilters, and: false }));
                }
            }
        }
    }

    private setInitialSelectValue(control: Select, value: any) {
        if (typeof value === "boolean") {
            control.setSelectedKey(value ? "YES" : "NO");
            return true;
        }

        return false;
    }

    private setInitialTimePickerValue(control: TimePicker, value: any) {
        if (value instanceof Date) {
            const date = new Date(1970, 0, 1, value.getHours(), value.getMinutes(), value.getSeconds());
            control.setDateValue(date);
            return true;
        } else if (this.hasMilliseconds(value)) {
            const totalSeconds = Math.floor(value.ms / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const date = new Date(1970, 0, 1, hours, minutes, seconds);

            control.setDateValue(date);
            return true;
        }

        return false;
    }

    private setInitialDynamicDateRangeValue(control: DynamicDateRange, value: any) {
        if (value instanceof Date) {
            control.setValue({
                operator: "DATE",
                values: [value]
            });

            return true;
        }

        return false;
    }

    private convertTimeToODataFormat(date: Date) {
        return `PT${this.padTimeNumber(date.getHours())}H${this.padTimeNumber(date.getMinutes())}M${this.padTimeNumber(date.getSeconds())}S`;
    }

    private padTimeNumber(number: number) {
        return number.toString().padStart(2, "0");
    }

    private hasMilliseconds(value: any): value is { ms: number; } {
        return typeof value === "object" && value != null && "ms" in value && typeof value.ms === "number";
    }

    private throwUserInputError(): never {
        throw new Error("FilterBar user input error.");
    }
}