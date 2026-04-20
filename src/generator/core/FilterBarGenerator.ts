import CheckBox from "sap/m/CheckBox";
import DynamicDateRange from "sap/m/DynamicDateRange";
import Input from "sap/m/Input";
import SearchField from "sap/m/SearchField";
import Select from "sap/m/Select";
import TimePicker from "sap/m/TimePicker";
import BaseObject from "sap/ui/base/Object";
import FilterBar from "sap/ui/comp/filterbar/FilterBar";
import FilterGroupItem from "sap/ui/comp/filterbar/FilterGroupItem";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataBoolean from "sap/ui/model/odata/type/Boolean";
import ODataString from "sap/ui/model/odata/type/String";
import { FilterBarGeneratorSettings } from "ui5/genatrix/types/generator/core/FilterBarGenerator.types";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.generator.core
 */
export default class FilterBarGenerator extends BaseObject {
    private readonly settings: FilterBarGeneratorSettings;
    private readonly model = new JSONModel();
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
            showClearOnFB: true
        });

        if (this.settings.searchSupported) {
            const searchField = this.getSearchField();
            this.fb.setBasicSearch(searchField);

            searchField.attachSearch(() => {
                this.fb.search();
            });
        }

        this.fb.setModel(this.model, "genatrixFilterBarModel");
        return this.fb;
    }

    private getFilterGroupItems() {
        const items: FilterGroupItem[] = [];

        for (const param of this.settings.parameters) {
            const property = this.settings.properties.find(prop => prop.name === param.getValueListProperty());

            if (!property) {
                continue;
            }

            const control = this.generateControl(property);

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
                path: "genatrixFilterBarModel>/genatrixFilterBarSearch",
                type: new ODataString()
            }
        });

        return searchField;
    }

    private generateControl(property: EntityProperty) {
        switch (property.type) {
            case "Edm.DateTime":
            case "Edm.DateTimeOffset":
                return this.getDynamicDateRange(property);
            case "Edm.Time":
                return this.getTimePicker(property);
            case "Edm.Boolean":
                return this.getSelect(property);
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Int64":
            case "Edm.Single":
            case "Edm.Double":
            case "Edm.Decimal":
                return this.getNumberInput(property);
            default:
                return this.getStringInput(property);
        }
    }

    private getDynamicDateRange(property: EntityProperty) {
        const control = new DynamicDateRange();
        return control;
    }

    private getTimePicker(property: EntityProperty) {
        const control = new TimePicker();
        return control;
    }

    private getSelect(property: EntityProperty) {
        this.model.setProperty(`/${property.name}`, "NONE");
        const control = new Select({
            selectedKey: {
                path: `genatrixFilterBarModel>/${property.name}`
            },
            items: [
                new Item({ key: "NONE", text: "" }),
                new Item({ key: "YES", text: LibraryBundle.getText("genatrix.label.yes") }),
                new Item({ key: "NO", text: LibraryBundle.getText("genatrix.label.no") })
            ]
        });

        return control;
    }

    private getNumberInput(property: EntityProperty) {
        const control = new Input();
        return control;
    }

    private getStringInput(property: EntityProperty) {
        const control = new Input();
        return control;
    }
}