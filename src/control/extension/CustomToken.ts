import Token, { $TokenSettings } from "sap/m/Token";
import { UserInput } from "ui5/genatrix/types/control/extension/CustomToken.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomToken extends Token {
    static readonly renderer = {};
    private readonly userInput: UserInput;

    constructor(userInput: UserInput, settings?: $TokenSettings);
    constructor(userInput: UserInput, id?: string, settings?: $TokenSettings);

    constructor(userInput: UserInput, idOrSettings?: string | $TokenSettings, settings?: $TokenSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }

        this.userInput = userInput;
    }

    public getUserInput() {
        return this.userInput;
    }
}