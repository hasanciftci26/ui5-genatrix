import BaseObject from "sap/ui/base/Object";
import ODataModelV2 from "sap/ui/model/odata/v2/ODataModel";
import ODataModelV4 from "sap/ui/model/odata/v4/ODataModel";
import FormContentGeneratorBase from "ui5/genatrix/generator/FormContentGeneratorBase";
import ContextManagerBase from "ui5/genatrix/odata/ContextManagerBase";
import MetadataParserBase from "ui5/genatrix/odata/MetadataParserBase";
import { ServiceContainerSettings } from "ui5/genatrix/types/form/service/ServiceContainer.types";
import FormContentValidatorBase from "ui5/genatrix/validator/FormContentValidatorBase";
import FormContentGeneratorV2 from "ui5/genatrix/generator/v2/FormContentGenerator";
import FormContentGeneratorV4 from "ui5/genatrix/generator/v4/FormContentGenerator";
import ContextManagerV2 from "ui5/genatrix/odata/v2/ContextManager";
import ContextManagerV4 from "ui5/genatrix/odata/v4/ContextManager";
import MetadataParserV2 from "ui5/genatrix/odata/v2/MetadataParser";
import MetadataParserV4 from "ui5/genatrix/odata/v4/MetadataParser";
import FormContentValidatorV2 from "ui5/genatrix/validator/v2/FormContentValidator";
import FormContentValidatorV4 from "ui5/genatrix/validator/v4/FormContentValidator";

/**
 * @namespace ui5.genatrix.form.service
 */
export default class ServiceContainer<T extends Record<string, any>> extends BaseObject {
    private readonly settings: ServiceContainerSettings<T>;
    private readonly contextManager: ContextManagerBase;
    private readonly metadataParser: MetadataParserBase;
    private readonly generator: FormContentGeneratorBase;
    private readonly validator: FormContentValidatorBase;

    constructor(settings: ServiceContainerSettings<T>) {
        super();
        this.settings = settings;

        if (settings.model.isA<ODataModelV2>("sap.ui.model.odata.v2.ODataModel")) {
            const contextManager = this.createContextManagerV2(settings.model);
            const metadataParser = this.createMetadataParserV2(settings.model);
            const generator = this.createGeneratorV2(settings.model, contextManager, metadataParser);
            const validator = this.createValidatorV2(settings.model, generator);

            this.contextManager = contextManager;
            this.metadataParser = metadataParser;
            this.generator = generator;
            this.validator = validator;
        } else {
            const contextManager = this.createContextManagerV4(settings.model);
            const metadataParser = this.createMetadataParserV4(settings.model);
            const generator = this.createGeneratorV4(settings.model, contextManager, metadataParser);
            const validator = this.createValidatorV4(settings.model, generator);

            this.contextManager = contextManager;
            this.metadataParser = metadataParser;
            this.generator = generator;
            this.validator = validator;
        }
    }

    public getModel() {
        return this.settings.model;
    }

    public getContextManager() {
        return this.contextManager;
    }

    public getMetadataParser() {
        return this.metadataParser;
    }

    public getGenerator() {
        return this.generator;
    }

    public getValidator() {
        return this.validator;
    }

    private createContextManagerV2(model: ODataModelV2) {
        const contextManager = new ContextManagerV2({
            entitySet: this.settings.entitySet,
            model: model,
            updateGroupId: this.settings.updateGroupId,
            formMode: this.settings.formMode,
            initialData: this.settings.initialData,
            contextProvider: this.settings.contextProvider,
            contextRef: this.settings.contextRef
        });

        return contextManager;
    }

    private createContextManagerV4(model: ODataModelV4) {
        const contextManager = new ContextManagerV4({
            entitySet: this.settings.entitySet,
            model: model,
            updateGroupId: this.settings.updateGroupId,
            formMode: this.settings.formMode,
            initialData: this.settings.initialData,
            contextProvider: this.settings.contextProvider,
            contextRef: this.settings.contextRef
        });

        return contextManager;
    }

    private createMetadataParserV2(model: ODataModelV2) {
        const metadataParser = new MetadataParserV2({
            entitySet: this.settings.entitySet,
            model: model,
            formMode: this.settings.formMode,
            requiredProperties: this.getRequiredProperties(),
            readonlyProperties: this.getReadonlyProperties(),
            excludedProperties: this.getExcludedProperties(),
            displayOrder: this.getDisplayOrder(),
            propertyConfigurations: this.settings.propertyConfigurations,
            propertyConstraints: this.settings.propertyConstraints
        });

        return metadataParser;
    }

    private createMetadataParserV4(model: ODataModelV4) {
        const metadataParser = new MetadataParserV4({
            entitySet: this.settings.entitySet,
            model: model,
            formMode: this.settings.formMode,
            requiredProperties: this.getRequiredProperties(),
            readonlyProperties: this.getReadonlyProperties(),
            excludedProperties: this.getExcludedProperties(),
            displayOrder: this.getDisplayOrder(),
            propertyConfigurations: this.settings.propertyConfigurations,
            propertyConstraints: this.settings.propertyConstraints
        });

        return metadataParser;
    }

    private createGeneratorV2(model: ODataModelV2, contextManager: ContextManagerV2, metadataParser: MetadataParserV2) {
        const generator = new FormContentGeneratorV2({
            entitySet: this.settings.entitySet,
            model: model,
            busyModel: this.settings.busyModel,
            formMode: this.settings.formMode,
            editable: this.settings.editable,
            datePattern: this.settings.datePattern,
            timePattern: this.settings.timePattern,
            dateTimeSeparator: this.settings.dateTimeSeparator,
            dateFirst: this.settings.dateFirst,
            groupingEnabled: this.settings.groupingEnabled,
            groupingSeparator: this.settings.groupingSeparator,
            groupingSize: this.settings.groupingSize,
            decimalSeparator: this.settings.decimalSeparator,
            parseEmptyValueToZero: this.settings.parseEmptyValueToZero,
            propertyConfigurations: this.settings.propertyConfigurations,
            propertyValidations: this.settings.propertyValidations,
            propertyConstraints: this.settings.propertyConstraints,
            formGroups: this.settings.formGroups,
            customControls: this.settings.customControls,
            contextManager: contextManager,
            metadataParser: metadataParser
        });

        return generator;
    }

    private createGeneratorV4(model: ODataModelV4, contextManager: ContextManagerV4, metadataParser: MetadataParserV4) {
        const generator = new FormContentGeneratorV4({
            entitySet: this.settings.entitySet,
            model: model,
            busyModel: this.settings.busyModel,
            formMode: this.settings.formMode,
            editable: this.settings.editable,
            datePattern: this.settings.datePattern,
            timePattern: this.settings.timePattern,
            dateTimeSeparator: this.settings.dateTimeSeparator,
            dateFirst: this.settings.dateFirst,
            groupingEnabled: this.settings.groupingEnabled,
            groupingSeparator: this.settings.groupingSeparator,
            groupingSize: this.settings.groupingSize,
            decimalSeparator: this.settings.decimalSeparator,
            parseEmptyValueToZero: this.settings.parseEmptyValueToZero,
            propertyConfigurations: this.settings.propertyConfigurations,
            propertyValidations: this.settings.propertyValidations,
            propertyConstraints: this.settings.propertyConstraints,
            formGroups: this.settings.formGroups,
            customControls: this.settings.customControls,
            contextManager: contextManager,
            metadataParser: metadataParser
        });

        return generator;
    }

    private createValidatorV2(model: ODataModelV2, generator: FormContentGeneratorV2) {
        const validator = new FormContentValidatorV2({
            generator: generator,
            model: model,
            validateOnlyVisible: this.settings.validateOnlyVisible
        });

        return validator;
    }

    private createValidatorV4(model: ODataModelV4, generator: FormContentGeneratorV4) {
        const validator = new FormContentValidatorV4({
            generator: generator,
            model: model,
            validateOnlyVisible: this.settings.validateOnlyVisible
        });

        return validator;
    }

    private getRequiredProperties() {
        const formLevelProperties = this.settings.requiredProperties?.split(",") || [];
        const configLevelProperties = this.settings.propertyConfigurations.filter(config => config.getName() && config.getRequired())
            .map(config => config.getName() as string);

        return Array.from(new Set([...formLevelProperties, ...configLevelProperties]));
    }

    private getReadonlyProperties() {
        const formLevelProperties = this.settings.readonlyProperties?.split(",") || [];
        const configLevelProperties = this.settings.propertyConfigurations.filter(config => config.getName() && config.getReadonly())
            .map(config => config.getName() as string);

        return Array.from(new Set([...formLevelProperties, ...configLevelProperties]));
    }

    private getExcludedProperties() {
        const formLevelProperties = this.settings.excludedProperties?.split(",") || [];
        const configLevelProperties = this.settings.propertyConfigurations.filter(config => config.getName() && config.getExcluded())
            .map(config => config.getName() as string);

        return Array.from(new Set([...formLevelProperties, ...configLevelProperties]));
    }

    private getDisplayOrder() {
        const displayOrder = this.settings.displayOrder?.split(",") || [];
        return Array.from(new Set(displayOrder));
    }
}