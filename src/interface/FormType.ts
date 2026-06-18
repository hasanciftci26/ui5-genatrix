import Type from "sap/ui/model/Type";

export default interface FormType extends Type {
    setRequired: (required: boolean) => void;
}