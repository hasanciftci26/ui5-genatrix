import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import ValueListParameterType from "ui5/genatrix/metadata/form/enum/ValueListParameterType";
import { ValueListParameterSettings } from "ui5/genatrix/types/metadata/form/ValueListParameter.types";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class ValueListParameter extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            type: { type: "ui5.genatrix.metadata.form.enum.ValueListParameterType", defaultValue: ValueListParameterType.InOut },
            localDataProperty: { type: "string" },
            valueListProperty: { type: "string" },
            valueListPropertyLabel: { type: "string" }
        }
    };

    constructor(settings?: ValueListParameterSettings);
    constructor(id?: string, settings?: ValueListParameterSettings);

    constructor(idOrSettings?: string | ValueListParameterSettings, settings?: ValueListParameterSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public getOrThrow() {
        const paramType = this.getType();

        if (!paramType) {
            this.throwRuntimeError("type is required in a ValueListParameter instance");
        }

        switch (paramType) {
            case ValueListParameterType.In:
            case ValueListParameterType.InOut:
            case ValueListParameterType.Out:
                if (this.getLocalDataProperty() == null || this.getValueListProperty() == null) {
                    this.throwRuntimeError(
                        "Both localDataProperty and valueListProperty are required for the following ValueListParameter types: In, InOut, Out"
                    );
                }

                break;
            default:
                if (this.getValueListProperty() == null) {
                    this.throwRuntimeError("valueListProperty is required for the following ValueListParameter types: FilterOnly, DisplayOnly");
                }

                break;
        }

        return this;
    }

    private throwRuntimeError(message: string): never {
        throw new Error(`${message} - ${this.getId()}`);
    }
}