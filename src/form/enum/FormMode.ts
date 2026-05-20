import DataType from "sap/ui/base/DataType";

enum FormMode {
    Create = "Create",
    Update = "Update",
    Delete = "Delete",
    Display = "Display"
};

DataType.registerEnum("ui5.genatrix.form.enum.FormMode", FormMode);

export default FormMode;