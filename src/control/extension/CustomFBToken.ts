import Token from "sap/m/Token";
import { MetadataOptions } from "sap/ui/core/Element";
import { CustomFBTokenSettings } from "ui5/genatrix/types/control/extension/CustomFBToken.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomFBToken extends Token {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        properties: {
            filterValue: { type: "any" },
            filterOperator: { type: "string" }
        }
    };
    static readonly renderer = {};

    constructor(settings?: CustomFBTokenSettings);
    constructor(id?: string, settings?: CustomFBTokenSettings);

    constructor(idOrSettings?: string | CustomFBTokenSettings, settings?: CustomFBTokenSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }
}