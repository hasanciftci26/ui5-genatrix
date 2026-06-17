import ODataMetaModel, { EntitySet, EntityType } from "sap/ui/model/odata/ODataMetaModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { FormMode } from "ui5/genatrix/form/enum/FormMode";
import MetadataParserBase from "ui5/genatrix/odata/MetadataParserBase";
import { EntityTypeProperty, MetadataParserBaseSettings, MetaModelProperty, PropertyDisplayFormat } from "ui5/genatrix/types/odata/MetadataParserBase.types";

/**
 * @namespace ui5.genatrix.odata.v2
 */
export default class MetadataParser extends MetadataParserBase<ODataModel> {
    constructor(settings: MetadataParserBaseSettings<ODataModel>) {
        super(settings);
    }

    public async parse() {
        const entityType = await this.getMetaModelEntityType();
        const properties: EntityTypeProperty[] = [];

        if (!entityType.property) {
            throw new Error(`No property was found for the Entity Set: ${this.getEntitySet()}`);
        }

        for (const property of entityType.property as MetaModelProperty[]) {
            if (this.isPropertyExcluded(property)) {
                continue;
            }

            const required = this.isPropertyRequired(property);

            properties.push({
                name: property.name,
                type: property.type,
                key: this.isKeyProperty(entityType, property),
                label: this.getLabel(property),
                required: required,
                strictRequired: required,
                readonly: this.isPropertyReadonly(entityType, property),
                filterable: true, // TODO
                displayFormat: this.getPropertyDisplayFormat(property),
                precision: this.getPropertyPrecision(property),
                scale: this.getPropertyScale(property),
                maxLength: this.getPropertyMaxLength(property)
            });
        }

        return this.sortProperties(properties);
    }

    private isKeyProperty(entityType: EntityType, property: MetaModelProperty) {
        return entityType.key.propertyRef.some(ref => ref.name === property.name);
    }

    private getLabel(property: MetaModelProperty) {
        const userDefinedLabel = this.getUserDefinedLabel(property.name);
        const labelAnnotation = property["com.sap.vocabularies.Common.v1.Label"]?.String;
        const labelExtension = property.extensions?.find(ext => ext.name === "label")?.value;
        const generatedLabel = this.labelize(property.name);

        return userDefinedLabel || labelAnnotation || labelExtension || generatedLabel;
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

        switch (this.getFormMode()) {
            case FormMode.Delete:
            case FormMode.Display:
                return true;
            case FormMode.Update:
                if (this.isKeyProperty(entityType, property)) {
                    return true;
                } else {
                    return this.getReadonlyProperties().includes(property.name);
                }
            default:
                return this.getReadonlyProperties().includes(property.name);
        }
    }

    private isPropertyExcluded(property: MetaModelProperty) {
        return this.getExcludedProperties().includes(property.name);
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

    private async getMetaModelEntityType() {
        const metaModel = await this.getMetaModel();
        const entitySet = await this.getMetaModelEntitySet();
        const entityType = metaModel.getODataEntityType(entitySet.entityType, false) as EntityType | null | undefined;

        if (!entityType) {
            throw new Error(`Entity Type for the Entity Set: ${this.getEntitySet()} was not found`);
        }

        return entityType;
    }

    private async getMetaModelEntitySet() {
        const metaModel = await this.getMetaModel();
        const entitySet = metaModel.getODataEntitySet(this.getEntitySet(), false) as EntitySet | null | undefined;

        if (!entitySet) {
            throw new Error(`Entity Set: ${this.getEntitySet()} was not found`);
        }

        return entitySet;
    }

    private async getMetaModel(): Promise<ODataMetaModel> {
        const metaModel = this.getModel().getMetaModel();
        await metaModel.loaded();
        return metaModel;
    }
}