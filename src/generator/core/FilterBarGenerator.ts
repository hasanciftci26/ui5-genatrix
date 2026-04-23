import DynamicDateFormat from "sap/m/DynamicDateFormat";
import DynamicDateRange, { DynamicDateRange$ChangeEvent } from "sap/m/DynamicDateRange";
import SearchField from "sap/m/SearchField";
import Select from "sap/m/Select";
import TimePicker from "sap/m/TimePicker";
import EventProvider from "sap/ui/base/EventProvider";
import FilterBar from "sap/ui/comp/filterbar/FilterBar";
import FilterGroupItem from "sap/ui/comp/filterbar/FilterGroupItem";
import Item from "sap/ui/core/Item";
import Messaging from "sap/ui/core/Messaging";
import Filter from "sap/ui/model/Filter";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataBoolean from "sap/ui/model/odata/type/Boolean";
import ODataString from "sap/ui/model/odata/type/String";
import Time from "sap/ui/model/odata/type/Time";
import CustomFBInput from "ui5/genatrix/control/extension/CustomFBInput";
import CustomFBMultiInput from "ui5/genatrix/control/extension/CustomFBMultiInput";
import FilterRestriction from "ui5/genatrix/metadata/enum/valuelist/FilterRestriction";
import { FilterBarGenerator$SearchEventHandler, FilterBarGeneratorSettings } from "ui5/genatrix/types/generator/core/FilterBarGenerator.types";
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

    public attachSearch(handler: FilterBarGenerator$SearchEventHandler, listener?: object) {
        this.attachEvent("search", handler, listener);
    }

    private fireSearch(filter?: Filter) {
        this.fireEvent("search", {
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
        return CustomFBInput.createInstance(property.name, this.modelName, {
            property: property,
            groupingEnabled: this.settings.groupingEnabled,
            groupingSeparator: this.settings.groupingSeparator,
            groupingSize: this.settings.groupingSize,
            decimalSeparator: this.settings.decimalSeparator,
            parseEmptyValueToZero: this.settings.parseEmptyValueToZero
        });
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
        const filter = this.getFilter();
        this.fireSearch(filter);
    }

    private getFilter() {
        const filters: Filter[] = [];
        const searchFieldFilter = this.getSearchFieldFilter();

        for (const groupItem of this.fb.getFilterGroupItems()) {
            const control = groupItem.getControl();

            if (control instanceof CustomFBInput) {
                const filter = control.getFilter(this.settings.caseSensitiveSearch);

                if (filter) {
                    filters.push(filter);
                }
            }
        }

        if (searchFieldFilter) {
            filters.push(searchFieldFilter);
        }

        if (filters.length) {
            return new Filter({ filters: filters, and: true });
        }
    }

    private getSearchFieldFilter() {
        if (this.searchField) {
            const value = this.searchField.getValue();

            if (value != null && value !== "") {
                const properties = this.settings.properties.filter(prop => prop.filterable && prop.type === "Edm.String");

                const filters: Filter[] = properties.map((prop) => {
                    return new Filter({
                        path: prop.name,
                        operator: "Contains",
                        value1: value,
                        caseSensitive: this.settings.caseSensitiveSearch
                    });
                });

                if (filters.length) {
                    return new Filter({ filters: filters, and: false });
                }
            }
        }
    }
}