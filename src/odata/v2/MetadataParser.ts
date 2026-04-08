import BaseObject from "sap/ui/base/Object";
import ODataMetaModel, { EntitySet, EntityType } from "sap/ui/model/odata/ODataMetaModel";
import LabelGenerator from "ui5/genatrix/generator/core/LabelGenerator";
import { EntityProperty, MetadataParserSettings, MetaModelProperty, PropertyDisplayFormat } from "ui5/genatrix/types/odata/v2/MetadataParser.types";

/**
 * @namespace ui5.genatrix.odata.v2
 */
export default class MetadataParser extends BaseObject {
    private readonly settings: MetadataParserSettings;
    private readonly labelGenerator: LabelGenerator;

    constructor(settings: MetadataParserSettings) {
        super();
        this.settings = settings;

        this.labelGenerator = new LabelGenerator({
            propertyOptions: settings.propertyOptions
        });
    }

    public async getEntityProperties(entitySetName: string) {
        const entityType = await this.getEntityType(entitySetName);
        const properties: EntityProperty[] = [];

        if (!entityType.property) {
            throw new Error(`No property was found for the Entity Set: ${entitySetName} - ` + this.settings.controlId);
        }

        for (const property of entityType.property as MetaModelProperty[]) {
            if (this.isPropertyExcluded(entityType, property)) {
                continue;
            }

            properties.push({
                name: property.name,
                type: property.type,
                key: this.isKeyProperty(entityType, property),
                label: this.labelGenerator.generate(property),
                readonly: this.isPropertyReadonly(entityType, property),
                required: this.isPropertyRequired(property),
                displayFormat: this.getPropertyDisplayFormat(property),
                precision: this.getPropertyPrecision(property),
                scale: this.getPropertyScale(property),
                maxLength: this.getPropertyMaxLength(property)
            });
        }

        return properties;
    }

    private isPropertyExcluded(entityType: EntityType, property: MetaModelProperty) {
        if (this.settings.keysAlwaysIncluded) {
            return this.isKeyProperty(entityType, property) ? false : this.getExcludedProperties().includes(property.name);
        } else {
            return this.getExcludedProperties().includes(property.name);
        }
    }

    private isKeyProperty(entityType: EntityType, property: MetaModelProperty) {
        return entityType.key.propertyRef.some(ref => ref.name === property.name);
    }

    private isPropertyRequired(property: MetaModelProperty) {
        if (property.nullable === "false") {
            return true;
        }

        return this.getRequiredProperties().includes(property.name);
    }

    private isPropertyReadonly(entityType: EntityType, property: MetaModelProperty) {
        if (property.readOnly === "true") {
            return true;
        }

        switch (this.settings.formMode) {
            case "Display":
            case "Delete":
                return true;
            case "Update":
                if (this.isKeyProperty(entityType, property)) {
                    return true;
                } else {
                    return this.getReadonlyProperties().includes(property.name);
                }
            default:
                return this.getReadonlyProperties().includes(property.name);
        }
    }

    private getRequiredProperties() {
        const properties = this.settings.propertyOptions.filter(op => op.getPropertyName() && op.getRequired()).map(op => op.getPropertyName()) as string[];

        if (this.settings.requiredProperties) {
            properties.push(...this.settings.requiredProperties.split(","));
        }

        return Array.from(new Set(properties));
    }

    private getReadonlyProperties() {
        const properties = this.settings.propertyOptions.filter(op => op.getPropertyName() && op.getReadonly()).map(op => op.getPropertyName()) as string[];

        if (this.settings.readonlyProperties) {
            properties.push(...this.settings.readonlyProperties.split(","));
        }

        return Array.from(new Set(properties));
    }

    private getExcludedProperties() {
        const properties = this.settings.propertyOptions.filter(op => op.getPropertyName() && op.getExcluded()).map(op => op.getPropertyName()) as string[];

        if (this.settings.excludedProperties) {
            properties.push(...this.settings.excludedProperties.split(","));
        }

        return Array.from(new Set(properties));
    }

    private getPropertyDisplayFormat(property: MetaModelProperty) {
        const displayFormat = property.extensions?.find(ext => ext.name === "display-format");
        return displayFormat?.value as PropertyDisplayFormat | undefined;
    }

    private getPropertyPrecision(property: MetaModelProperty) {
        if (property.type !== "Edm.Decimal") {
            return;
        }

        if (property.precision) {
            return parseInt(property.precision);
        }
    }

    private getPropertyScale(property: MetaModelProperty) {
        if (property.type !== "Edm.Decimal") {
            return;
        }

        if (property.scale) {
            return parseInt(property.scale);
        }
    }

    private getPropertyMaxLength(property: MetaModelProperty) {
        if (property.type === "Edm.String") {
            if (property.maxLength) {
                return parseInt(property.maxLength);
            }
        }
    }

    private async getEntityType(entitySetName: string) {
        const metaModel = await this.getMetaModel();
        const entitySet = await this.getEntitySet(entitySetName);
        const entityType = metaModel.getODataEntityType(entitySet.entityType, false) as EntityType | null | undefined;

        if (!entityType) {
            throw new Error(`Entity Type for the Entity Set: ${entitySetName} was not found - ` + this.settings.controlId);
        }

        return entityType;
    }

    private async getEntitySet(entitySetName: string) {
        const metaModel = await this.getMetaModel();
        const entitySet = metaModel.getODataEntitySet(entitySetName, false) as EntitySet | null | undefined;

        if (!entitySet) {
            throw new Error(`Entity Set: ${entitySetName} was not found - ` + this.settings.controlId);
        }

        return entitySet;
    }

    private async getMetaModel(): Promise<ODataMetaModel> {
        const metaModel = this.settings.model.getMetaModel();
        await metaModel.loaded();
        return metaModel;
    }
}