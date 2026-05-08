import BaseObject from "sap/ui/base/Object";
import Filter from "sap/ui/model/Filter";
import TextArrangement from "ui5/genatrix/control/enum/form/TextArrangement";
import CustomInput from "ui5/genatrix/control/extension/CustomInput";
import { TextArrangementType } from "ui5/genatrix/types/control/global/Form.types";
import { ReadCache, ReadPromise, ReadPromiseResult, ValidateAndSetSettings } from "ui5/genatrix/types/metadata/form/ValueListValidator.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class ValueListValidator extends BaseObject {
    private readonly readCache: ReadCache[] = [];

    public async validateAndSet(settings: ValidateAndSetSettings) {
        this.showBusy(settings.source);

        try {
            const promise = this.getReadPromise(settings);
            const results = await Promise.resolve(promise);

            if (results.length) {
                const first = results[0] as Record<string, any>;
                const keyValue = first[settings.keyProperty];

                if (keyValue) {
                    settings.source.setSelectedKey(String(keyValue));
                    this.hideError(settings.source);
                } else {
                    this.showError(settings.source);
                }
            } else {
                this.showError(settings.source);
            }

            this.hideBusy(settings.source);
        } catch {
            this.hideBusy(settings.source);
            this.showError(settings.source);
        }
    }

    private getReadPromise(settings: ValidateAndSetSettings) {
        if (settings.textProperty) {
            const values = this.getValues(settings.value, settings.textArrangement);
            const cache = this.readCache.find(cache => cache.keyValue === values.keyValue && cache.textValue === values.textValue);

            if (cache) {
                return cache.promise;
            }
        } else {
            const cache = this.readCache.find(cache => cache.keyValue === settings.value);

            if (cache) {
                return cache.promise;
            }
        }

        const filters = this.getFilters(settings);

        const promise = new Promise<ReadPromiseResult>((resolve, reject) => {
            settings.model.read(`/${settings.entitySet}`, {
                filters: filters,
                success: (response: { results: Array<Record<string, any>>; }) => {
                    resolve(response.results);
                },
                error: () => {
                    reject();
                }
            });
        });

        this.addReadCache(settings, promise);
        return promise;
    }

    private getFilters(settings: ValidateAndSetSettings) {
        const filters: Filter[] = [];

        if (settings.textProperty) {
            const values = this.getValues(settings.value, settings.textArrangement);

            if (values.keyValue) {
                filters.push(new Filter({
                    path: settings.keyProperty,
                    operator: "EQ",
                    value1: values.keyValue,
                    caseSensitive: true
                }));
            }

            if (values.textValue) {
                filters.push(new Filter({
                    path: settings.textProperty,
                    operator: "EQ",
                    value1: values.textValue,
                    caseSensitive: true
                }));
            }
        } else {
            filters.push(new Filter({
                path: settings.keyProperty,
                operator: "EQ",
                value1: settings.value,
                caseSensitive: true
            }));
        }

        return [new Filter({
            filters: filters,
            and: true
        })];
    }

    private addReadCache(settings: ValidateAndSetSettings, promise: ReadPromise) {
        if (settings.textProperty) {
            const values = this.getValues(settings.value, settings.textArrangement);

            this.readCache.push({
                keyValue: values.keyValue,
                textValue: values.textValue,
                promise: promise
            });
        } else {
            this.readCache.push({
                keyValue: settings.value,
                promise: promise
            });
        }
    }

    private showBusy(source: CustomInput) {
        source.setBusy(true);
    }

    private hideBusy(source: CustomInput) {
        source.setBusy(false);
    }

    private showError(source: CustomInput) {
        source.setValueState("Error");
        source.setValueStateText(LibraryBundle.getText("genatrix.error.invalidValue"));
        source.setSelectedKey("");
    }

    private hideError(source: CustomInput) {
        source.setValueState("None");
        source.setValueStateText("");
    }

    private getValues(value: string, textArrangement: TextArrangementType) {
        if (textArrangement === TextArrangement.TextFirst) {
            const match = value.match(/^(.*?)\s*\((.*)\)$/);

            if (match) {
                const keyValue = match[2];
                const textValue = match[1];

                return {
                    keyValue: keyValue,
                    textValue: textValue
                };
            } else {
                throw new Error("Invalid user input.");
            }
        } else if (textArrangement === TextArrangement.TextLast) {
            const match = value.match(/^(.*?)\s*\((.*)\)$/);

            if (match) {
                const keyValue = match[1];
                const textValue = match[2];

                return {
                    keyValue: keyValue,
                    textValue: textValue
                };
            } else {
                throw new Error("Invalid user input.");
            }
        } else if (textArrangement === TextArrangement.TextOnly) {
            return {
                textValue: value
            };
        } else {
            return {
                keyValue: value
            };
        }
    }
}