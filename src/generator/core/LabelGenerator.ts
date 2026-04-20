import BaseObject from "sap/ui/base/Object";
import { LabelGeneratorSettings } from "ui5/genatrix/types/generator/core/LabelGenerator.types";
import { MetaModelProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";

/**
 * @namespace ui5.genatrix.generator.core
 */
export default class LabelGenerator extends BaseObject {
    private readonly settings: LabelGeneratorSettings;

    constructor(settings: LabelGeneratorSettings) {
        super();
        this.settings = settings;
    }

    public generate(property: MetaModelProperty) {
        const userDefinedLabel = this.settings.userDefinedLabels.find(opt => opt.propertyName === property.name)?.label;
        const labelAnnotation = property["com.sap.vocabularies.Common.v1.Label"]?.String;
        const labelExtension = property.extensions?.find(ext => ext.name === "label")?.value;
        const generatedLabel = this.labelize(property.name);

        return userDefinedLabel || labelAnnotation || labelExtension || generatedLabel;
    }

    private labelize(propertyName: string) {
        const casing = this.getPropertyCasing(propertyName);

        switch (casing) {
            case "ConstantCase":
                return this.labelizeConstantCase(propertyName);
            case "SnakeCase":
                return this.labelizeSnakeCase(propertyName);
            case "KebabCase":
                return this.labelizeKebabCase(propertyName);
            case "CamelCase":
                return this.labelizeCamelCase(propertyName);
            case "PascalCase":
                return this.labelizePascalCase(propertyName);
            default:
                return propertyName;
        }
    }

    private getPropertyCasing(propertyName: string) {
        if (this.isConstantCase(propertyName)) {
            return "ConstantCase";
        }

        if (this.isSnakeCase(propertyName)) {
            return "SnakeCase";
        }

        if (this.isKebabCase(propertyName)) {
            return "KebabCase";
        }

        if (this.isCamelCase(propertyName)) {
            return "CamelCase";
        }

        if (this.isPascalCase(propertyName)) {
            return "PascalCase";
        }

        return "None";
    }

    private isConstantCase(propertyName: string) {
        const constantCase = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/;
        return constantCase.test(propertyName);
    }

    private isSnakeCase(propertyName: string) {
        const snakeCase = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
        return snakeCase.test(propertyName);
    }

    private isKebabCase(propertyName: string) {
        const kebabCase = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
        return kebabCase.test(propertyName);
    }

    private isCamelCase(propertyName: string) {
        const camelCase = /^[a-z][a-zA-Z0-9]*$/;
        return camelCase.test(propertyName);
    }

    private isPascalCase(propertyName: string) {
        const pascalCase = /^[A-Z][a-zA-Z0-9]*$/;
        return pascalCase.test(propertyName);
    }

    private labelizeConstantCase(propertyName: string) {
        const parts = propertyName.split("_");
        return parts.map(word => word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word).join(" ");
    }

    private labelizeSnakeCase(propertyName: string) {
        const parts = propertyName.split("_");
        return parts.map(word => word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word).join(" ");
    }

    private labelizeKebabCase(propertyName: string) {
        const parts = propertyName.split("-");
        return parts.map(word => word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word).join(" ");
    }

    private labelizeCamelCase(propertyName: string) {
        const parts = propertyName.match(/([A-Z]{2,}(?=[A-Z][a-z]|[0-9]|$))|([A-Z]?[a-z]+[0-9]*[a-z]*)|([0-9]+)/g);

        if (!parts) {
            return propertyName;
        }

        const finalWords: string[] = [];

        for (const part of parts) {
            const regex = /[a-zA-Z]+|[0-9]+[a-z]+|[0-9]+(?![a-z])/g;
            let match: RegExpExecArray | null;

            while ((match = regex.exec(part)) !== null) {
                finalWords.push(match[0]);
            }
        }

        return finalWords.map(word => this.capitalize(word)).join(" ");
    }

    private labelizePascalCase(propertyName: string) {
        const parts = propertyName.match(/([A-Z]{2,}(?=[A-Z][a-z]|[0-9]|$))|([A-Z]?[a-z]+[0-9]*[a-z]*)|([0-9]+)/g);

        if (!parts) {
            return propertyName;
        }

        const finalWords: string[] = [];

        for (const part of parts) {
            const regex = /[a-zA-Z]+|[0-9]+[a-z]+|[0-9]+(?![a-z])/g;
            let match: RegExpExecArray | null;

            while ((match = regex.exec(part)) !== null) {
                finalWords.push(match[0]);
            }
        }

        return finalWords.map(word => this.capitalize(word)).join(" ");
    }

    private capitalize(word: string) {
        return word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    }
}