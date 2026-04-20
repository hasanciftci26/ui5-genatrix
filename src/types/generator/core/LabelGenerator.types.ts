export type UserDefinedLabel = {
    propertyName?: string;
    label?: string;
};

export type LabelGeneratorSettings = {
    userDefinedLabels: UserDefinedLabel[];
};