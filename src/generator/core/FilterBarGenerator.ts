import DynamicDateFormat from "sap/m/DynamicDateFormat";
import DynamicDateRange, { DynamicDateRange$ChangeEvent } from "sap/m/DynamicDateRange";
import Input from "sap/m/Input";
import SearchField from "sap/m/SearchField";
import Select from "sap/m/Select";
import TimePicker from "sap/m/TimePicker";
import BaseObject from "sap/ui/base/Object";
import FilterBar from "sap/ui/comp/filterbar/FilterBar";
import FilterGroupItem from "sap/ui/comp/filterbar/FilterGroupItem";
import Item from "sap/ui/core/Item";
import Messaging from "sap/ui/core/Messaging";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataBoolean from "sap/ui/model/odata/type/Boolean";
import ODataString from "sap/ui/model/odata/type/String";
import Time from "sap/ui/model/odata/type/Time";
import CustomFBMultiInput from "ui5/genatrix/control/extension/CustomFBMultiInput";
import FilterRestriction from "ui5/genatrix/metadata/enum/valuelist/FilterRestriction";
import ValueListParameter from "ui5/genatrix/metadata/form/ValueListParameter";
import { FilterBarGeneratorSettings } from "ui5/genatrix/types/generator/core/FilterBarGenerator.types";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.generator.core
 */
export default class FilterBarGenerator extends BaseObject {
    private readonly settings: FilterBarGeneratorSettings;
    private readonly model = new JSONModel();
    private readonly modelName = "genatrixFilterBarModel";
    private fb: FilterBar;

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
            const searchField = this.getSearchField();
            this.fb.setBasicSearch(searchField);

            searchField.attachSearch(() => {
                this.fb.search();
            });
        }

        this.model.setDefaultBindingMode("TwoWay");
        this.fb.setModel(this.model, this.modelName);
        return this.fb;
    }

    private getFilterGroupItems() {
        const items: FilterGroupItem[] = [];

        for (const param of this.settings.parameters) {
            const property = this.settings.properties.find(prop => prop.name === param.getValueListProperty());

            if (!property) {
                continue;
            }

            const control = this.generateControl(property, param);
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

    private generateControl(property: EntityProperty, param: ValueListParameter) {
        switch (property.type) {
            case "Edm.DateTime":
            case "Edm.DateTimeOffset":
                return this.getDynamicDateRange(property);
            case "Edm.Time":
                return this.getTimePicker(property);
            case "Edm.Boolean":
                return this.getSelect(property);
            default:
                if (param.getFilterRestriction() === FilterRestriction.SingleValue) {
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

    // TODO
    private getSingleInput(property: EntityProperty) {
        return new Input({});
    }

    private getMultiInput(property: EntityProperty) {
        return CustomFBMultiInput.createInstance(this.modelName, {
            property: property,
            groupingEnabled: this.settings.groupingEnabled,
            groupingSeparator: this.settings.groupingSeparator,
            groupingSize: this.settings.groupingSize,
            decimalSeparator: this.settings.decimalSeparator,
            parseEmptyValueToZero: this.settings.parseEmptyValueToZero
        });
    }
}