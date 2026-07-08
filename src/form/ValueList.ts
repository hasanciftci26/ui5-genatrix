import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import { ValueListSettings } from "ui5/genatrix/types/form/ValueList.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.form
 */
export default class ValueList extends ManagedObject {
    public static readonly metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            name: { type: "string" },
            entitySet: { type: "string" },
            searchSupported: { type: "boolean", defaultValue: false },
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
            parameters: { type: "ui5.genatrix.form.ValueListParameter", multiple: true, singularName: "parameter" }
        },
        events: {
            itemSelected: {
                allowPreventDefault: false,
                parameters: {
                    context: { type: "sap.ui.model.Context" }
                }
            }
        }
    };

    constructor(settings?: ValueListSettings);
    constructor(id?: string, settings?: ValueListSettings);

    constructor(idOrSettings?: string | ValueListSettings, settings?: ValueListSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }
}