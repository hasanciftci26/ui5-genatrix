import { CustomInput$ChangeEvent } from "ui5/genatrix/types/control/extension/CustomInput.types";
import { ChangeHandlerData, SuggestHandlerData } from "ui5/genatrix/types/metadata/form/ValueList.types";

declare module "sap/m/Input" {
    type SuggestHandler = (event: Input$SuggestEvent, data: SuggestHandlerData) => void;
    type ChangeHandler = (event: CustomInput$ChangeEvent, data: ChangeHandlerData) => void;

    export default interface Input {
        attachSuggest(data: SuggestHandlerData, handler: SuggestHandler, listener?: object): this;
        attachChange(data: ChangeHandlerData, handler: ChangeHandler, listener?: object): this;
    }
}