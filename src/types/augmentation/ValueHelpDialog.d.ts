import SimpleType from "sap/ui/model/SimpleType";

declare module "sap/ui/comp/valuehelpdialog/ValueHelpDialog" {
    type RangeKeyField = {
        key: string;
        label: string;
        type: "text" | "string" | "guid" | "date" | "datetime" | "time" | "numeric" | "boolean";
        typeInstance: SimpleType;
    };

    export default interface ValueHelpDialog {
        setRangeKeyFields(rangeKeyFields: RangeKeyField[]): void;
    }
}