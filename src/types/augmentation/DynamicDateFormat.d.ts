declare module "sap/m/DynamicDateFormat" {
    export default class DynamicDateFormat {
        static getInstance(
            formatOptions: {
                date?: {
                    pattern: string;
                };
                datetime?: {
                    pattern: string;
                };
            }
        ): DynamicDateFormat;
    }
}