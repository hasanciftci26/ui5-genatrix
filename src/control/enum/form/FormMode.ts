import DataType from "sap/ui/base/DataType";

const FormMode = {
    Create: "Create",
    Update: "Update",
    Delete: "Delete",
    Read: "Read"
} as const;

DataType.registerEnum("ui5.genatrix.control.enum.form.FormMode", FormMode);

export default FormMode;