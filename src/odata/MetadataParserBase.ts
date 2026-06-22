import BaseObject from "sap/ui/base/Object";
import Model from "sap/ui/model/Model";
import { PropertyConstraintType } from "ui5/genatrix/form/enum/PropertyConstraintType";
import { EntityTypeProperty, MetadataParserBaseSettings } from "ui5/genatrix/types/odata/MetadataParserBase.types";
import Labelizer from "ui5/genatrix/util/Labelizer";

/**
 * @namespace ui5.genatrix.odata
 */
export default abstract class MetadataParserBase<T extends Model = Model> extends BaseObject {
    private readonly settings: MetadataParserBaseSettings<T>;

    constructor(settings: MetadataParserBaseSettings<T>) {
        super();
        this.settings = settings;
    }

    public abstract parse(): Promise<EntityTypeProperty[]>;

    protected getEntitySet() {
        return this.settings.entitySet;
    }

    protected getEntitySetPath() {
        return "/" + this.settings.entitySet;
    }

    protected getModel() {
        return this.settings.model;
    }

    protected getFormMode() {
        return this.settings.formMode;
    }

    protected getUserDefinedLabel(propertyName: string) {
        return this.settings.propertyConfigurations.find(config => config.getName() === propertyName)?.getLabel();
    }

    protected getRequiredProperties() {
        return this.settings.requiredProperties;
    }

    protected getReadonlyProperties() {
        return this.settings.readonlyProperties;
    }

    protected getExcludedProperties() {
        return this.settings.excludedProperties;
    }

    protected getDisplayOrder() {
        return this.settings.displayOrder;
    }

    protected labelize(propertyName: string) {
        return Labelizer.run(propertyName);
    }

    protected sortProperties(properties: EntityTypeProperty[]) {
        const orderMap = new Map(this.settings.displayOrder.map((property, index) => [property, index]));

        return properties.sort((a, b) => {
            const aIndex = orderMap.has(a.name) ? orderMap.get(a.name) as number : Number.MAX_SAFE_INTEGER;
            const bIndex = orderMap.has(b.name) ? orderMap.get(b.name) as number : Number.MAX_SAFE_INTEGER;
            return aIndex - bIndex;
        });
    }

    protected isPropertyVisible(propertyName: string) {
        const constraint = this.settings.propertyConstraints.find(
            constraint => constraint.getName() === propertyName && constraint.getType() === PropertyConstraintType.Visible
        );

        if (!constraint) {
            return true;
        }

        return constraint.evaluate();
    }

    protected isPropertyRequiredByConstraint(propertyName: string) {
        const constraint = this.settings.propertyConstraints.find(
            constraint => constraint.getName() === propertyName && constraint.getType() === PropertyConstraintType.Required
        );

        if (!constraint) {
            return false;
        }

        return constraint.evaluate();
    }

    protected getTextPropertyFromConfig(propertyName: string) {
        const config = this.settings.propertyConfigurations.find(config => config.getName() === propertyName);

        if (config?.getText) {
            return config.getText();
        }
    }

    protected getTextArrangementFromConfig(propertyName: string) {
        const config = this.settings.propertyConfigurations.find(config => config.getName() === propertyName);

        if (config?.getTextArrangement) {
            return config.getTextArrangement();
        }
    }
}