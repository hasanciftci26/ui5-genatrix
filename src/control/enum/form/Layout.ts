import DataType from "sap/ui/base/DataType";

const Layout = {
    ColumnLayout: "ColumnLayout",
    ResponsiveGridLayout: "ResponsiveGridLayout"
} as const;

DataType.registerEnum("ui5.genatrix.control.enum.form.Layout", Layout);

export default Layout;