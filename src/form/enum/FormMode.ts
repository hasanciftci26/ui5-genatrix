import DataType from "sap/ui/base/DataType";

export enum FormMode {
    Create = "Create",
    Update = "Update",
    Delete = "Delete",
    Display = "Display"
};

DataType.registerEnum("ui5.genatrix.form.enum.FormMode", FormMode);