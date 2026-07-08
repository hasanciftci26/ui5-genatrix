import ODataMetaModel, { EntitySet, EntityType } from "sap/ui/model/odata/ODataMetaModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { TextArrangement } from "ui5/genatrix/core/enum/TextArrangement";
import { FormMode } from "ui5/genatrix/form/enum/FormMode";
import { ParameterType } from "ui5/genatrix/form/enum/ParameterType";
import ValueList from "ui5/genatrix/form/ValueList";
import ValueListParameter from "ui5/genatrix/form/ValueListParameter";
import MetadataParserBase from "ui5/genatrix/odata/MetadataParserBase";
import { EntityTypeProperty, MetadataParserBaseSettings, MetaModelProperty, PropertyDisplayFormat, ValueListParameterRecordType } from "ui5/genatrix/types/odata/MetadataParserBase.types";

/**
 * @namespace ui5.genatrix.odata.v2
 */
export default class MetadataParser extends MetadataParserBase<ODataModel> {
    constructor(settings: MetadataParserBaseSettings<ODataModel>) {
        super(settings);
    }

    public async parse() {
        const entityType = await this.getMetaModelEntityType(this.getEntitySet());
        const properties: EntityTypeProperty[] = [];

        if (!entityType.property) {
            throw new Error(`No property was found for the Entity Set: ${this.getEntitySet()}`);
        }

        for (const property of entityType.property as MetaModelProperty[]) {
            if (this.isPropertyExcluded(property)) {
                continue;
            }

            properties.push({
                name: property.name,
                type: property.type,
                key: this.isKeyProperty(entityType, property),
                label: this.getLabel(property),
                required: this.isPropertyRequired(property),
                strictRequired: this.isPropertyStrictlyRequired(property),
                readonly: this.isPropertyReadonly(entityType, property),
                filterable: true, // TODO
                visible: this.isPropertyVisible(property.name),
                displayFormat: this.getPropertyDisplayFormat(property),
                precision: this.getPropertyPrecision(property),
                scale: this.getPropertyScale(property),
                maxLength: this.getPropertyMaxLength(property),
                text: await this.getTextProperty(property),
                textArrangement: this.getTextArrangement(property),
                valueList: this.getValueList(property)
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

    /**
     * Determines whether a property is currently required.
     *
     * A property is considered required if:
     * - it is defined as non-nullable in the OData metadata,
     * - its technical name is included in the EmbeddedForm's comma-separated `requiredProperties` property,
     * - it is marked as required by a matching `PropertyConfiguration` aggregation item, or
     * - it is marked as required by a matching `PropertyConstraint` for the current binding context.
     *
     * Constraint-based requiredness is evaluated dynamically and may change at runtime when the values in the binding context change.
     */
    private isPropertyRequired(property: MetaModelProperty) {
        if (property.nullable === "false" || this.getRequiredProperties().includes(property.name)) {
            return true;
        }

        return this.isPropertyRequiredByConstraint(property.name);
    }

    /**
     * Determines whether a property is strictly required.
     *
     * A property is strictly required if:
     * - it is defined as non-nullable in the OData metadata,
     * - its technical name is included in the EmbeddedForm's comma-separated `requiredProperties` property, or
     * - it is marked as required by a matching `PropertyConfiguration` aggregation item.
     *
     * Strictly required properties always remain required and are not relaxed by `PropertyConstraint` rules.
     */
    private isPropertyStrictlyRequired(property: MetaModelProperty) {
        return property.nullable === "false" || this.getRequiredProperties().includes(property.name);
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

    private async getTextProperty(property: MetaModelProperty) {
        const text = this.getTextPropertyFromConfig(property.name) || property["com.sap.vocabularies.Common.v1.Text"]?.Path;

        if (!text) {
            return;
        }

        if (text.includes("/")) {
            const navProperty = text.split("/")[0] as string;
            const metaModel = await this.getMetaModel();
            const entityType = await this.getMetaModelEntityType(this.getEntitySet());
            const association = metaModel.getODataAssociationEnd(entityType, navProperty);

            if (!association || association.multiplicity === "*") {
                return;
            }

            const navigationEntityType = await this.getMetaModelEntityType(association.role);
            const textProperty = navigationEntityType.property?.find(prop => prop.name === text.split("/")[1]);

            if (textProperty?.type !== "Edm.String") {
                return;
            }

            return text;
        } else {
            const entityType = await this.getMetaModelEntityType(this.getEntitySet());
            const textProperty = entityType.property?.find(prop => prop.name === text);

            if (textProperty?.type !== "Edm.String") {
                return;
            }

            return textProperty.name;
        }
    }

    private getTextArrangement(property: MetaModelProperty) {
        const textArrangement = this.getTextArrangementFromConfig(property.name);

        if (textArrangement) {
            return textArrangement;
        }

        switch (property["com.sap.vocabularies.Common.v1.Text"]?.["com.sap.vocabularies.UI.v1.TextArrangement"]?.EnumMember) {
            case "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst":
                return TextArrangement.TextFirst;
            case "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast":
                return TextArrangement.TextLast;
            case "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly":
                return TextArrangement.TextOnly;
            case "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate":
                return TextArrangement.TextSeparate;
            default:
                return TextArrangement.TextFirst;
        }
    }

    private getValueList(property: MetaModelProperty) {
        const valueList = property["com.sap.vocabularies.Common.v1.ValueList"];

        if (!valueList) {
            return;
        }

        const collectionPath = valueList.CollectionPath?.String;
        const parameters = valueList.Parameters;

        if (!collectionPath || !parameters?.length) {
            return;
        }

        const valueListParameters: ValueListParameter[] = [];

        for (const parameter of parameters) {
            const parameterType = this.getValueListParameterType(parameter.RecordType);
            const localDataProperty = parameter.LocalDataProperty?.PropertyPath;
            const valueListProperty = parameter.ValueListProperty?.String || parameter.ValueListProperty?.Path;

            switch (parameterType) {
                case ParameterType.In:
                case ParameterType.Out:
                case ParameterType.InOut:
                    if (localDataProperty && valueListProperty) {
                        valueListParameters.push(new ValueListParameter({
                            type: parameterType,
                            localDataProperty: localDataProperty,
                            valueListProperty: valueListProperty
                        }));
                    }

                    break;
                case ParameterType.DisplayOnly:
                case ParameterType.FilterOnly:
                    if (valueListProperty) {
                        valueListParameters.push(new ValueListParameter({
                            type: parameterType,
                            valueListProperty: valueListProperty
                        }));
                    }

                    break;
            }
        }

        if (valueListParameters.length) {
            return new ValueList({
                name: property.name,
                entitySet: collectionPath,
                searchSupported: property["com.sap.vocabularies.Common.v1.ValueList"]?.SearchSupported?.Bool === "true",
                title: property["com.sap.vocabularies.Common.v1.ValueList"]?.Label?.String,
                valueListWithFixedValues: property["com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]?.Bool === "true",
                nonFilterableProperties: "", //TODO
                parameters: valueListParameters
            });
        }
    }

    private getValueListParameterType(recordType?: ValueListParameterRecordType) {
        switch (recordType) {
            case "com.sap.vocabularies.Common.v1.ValueListParameterIn":
                return ParameterType.In;
            case "com.sap.vocabularies.Common.v1.ValueListParameterOut":
                return ParameterType.Out;
            case "com.sap.vocabularies.Common.v1.ValueListParameterInOut":
                return ParameterType.InOut;
            case "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly":
                return ParameterType.DisplayOnly;
            case "com.sap.vocabularies.Common.v1.ValueListParameterFilterOnly":
                return ParameterType.FilterOnly;
        }
    }

    private async getMetaModelEntityType(entitySetName: string) {
        const metaModel = await this.getMetaModel();
        const entitySet = await this.getMetaModelEntitySet(entitySetName);
        const entityType = metaModel.getODataEntityType(entitySet.entityType, false) as EntityType | null | undefined;

        if (!entityType) {
            throw new Error(`Entity Type for the Entity Set: ${entitySetName} was not found`);
        }

        return entityType;
    }

    private async getMetaModelEntitySet(entitySetName: string) {
        const metaModel = await this.getMetaModel();
        const entitySet = metaModel.getODataEntitySet(entitySetName, false) as EntitySet | null | undefined;

        if (!entitySet) {
            throw new Error(`Entity Set: ${entitySetName} was not found`);
        }

        return entitySet;
    }

    private async getMetaModel(): Promise<ODataMetaModel> {
        const metaModel = this.getModel().getMetaModel();
        await metaModel.loaded();
        return metaModel;
    }
}