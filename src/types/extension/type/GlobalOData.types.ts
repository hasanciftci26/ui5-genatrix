export type ODataStringConstraints = {
    maxLength?: number;
};

export type ODataStringFormatOptions = {
    parseKeepsEmptyString?: boolean;
};

export type ODataNumberConstraints = {
    precision?: number;
    scale?: number;
    nullable?: string | boolean;
    maximum?: string;
    minimum?: string;
};

export type ODataNumberFormatOptions = {
    groupingEnabled?: boolean;
    groupingSeparator?: string;
    groupingSize?: number;
    decimalSeparator?: string;
    parseEmptyValueToZero?: boolean
};

export type ODataDateTimeConstraints = {
    displayFormat: "Date";
    nullable?: boolean;
};

export type ODataDateTimeFormatOptions = {
    pattern: string;
};