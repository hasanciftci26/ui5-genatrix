import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import Layout from "ui5/genatrix/control/enum/form/Layout";
import { FormLayoutSettings } from "ui5/genatrix/types/metadata/form/FormLayout.types";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class FormLayout extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            layout: { type: "ui5.genatrix.control.enum.form.Layout", defaultValue: Layout.ResponsiveGridLayout },
            columnsXL: { type: "int", defaultValue: 1 },
            columnsL: { type: "int", defaultValue: 1 },
            columnsM: { type: "int", defaultValue: 1 },
            labelSpanXL: { type: "int", defaultValue: 12 },
            labelSpanL: { type: "int", defaultValue: 12 },
            labelSpanM: { type: "int", defaultValue: 12 },
            labelSpanS: { type: "int", defaultValue: 12 },
            emptySpanXL: { type: "int", defaultValue: 0 },
            emptySpanL: { type: "int", defaultValue: 0 },
            emptySpanM: { type: "int", defaultValue: 0 },
            emptySpanS: { type: "int", defaultValue: 0 },
            layoutData: { type: "sap.ui.core.LayoutData" }
        }
    };

    constructor(settings?: FormLayoutSettings);
    constructor(id?: string, settings?: FormLayoutSettings);

    constructor(idOrSettings?: string | FormLayoutSettings, settings?: FormLayoutSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }
}