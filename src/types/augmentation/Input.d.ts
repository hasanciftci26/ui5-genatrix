import { SuggestHandlerData } from "ui5/genatrix/types/metadata/form/ValueList.types";

declare module "sap/m/Input" {
    type SuggestHandler = (event: Input$SuggestEvent, data: SuggestHandlerData) => void;

    export default interface Input {
        attachSuggest(data: SuggestHandlerData, handler: SuggestHandler, listener?: object): this;
    }
}