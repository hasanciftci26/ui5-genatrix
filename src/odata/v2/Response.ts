import BaseObject from "sap/ui/base/Object";
import { BatchResponse, ChangeResponse, ErrorResponse, ErrorResponseBody, RequestError, ResponseSettings } from "ui5/genatrix/types/odata/v2/Response.types";

/**
 * @namespace ui5.genatrix.odata.v2
 */
export default class Response extends BaseObject {
    private readonly rawResponse?: BatchResponse | RequestError;
    private successful: boolean;
    private statusCode: string;
    private errorMessage?: string;
    private errorCode?: string;
    private data?: Record<string, any>;

    constructor(settings: ResponseSettings) {
        super();
        this.rawResponse = settings.rawResponse;

        if (settings.responseType === "Delete") {
            this.successful = settings.successful;
            this.statusCode = this.successful ? "204" : "500";

            if (!settings.successful && settings.rawResponse) {
                this.parseRequestError(settings.rawResponse);
            }
        } else {
            this.parse(settings.rawResponse);
        }
    }

    public getRawResponse() {
        return this.rawResponse;
    }

    public isSuccessful() {
        return this.successful;
    }

    public getStatusCode() {
        return this.statusCode;
    }

    public getErrorMessage() {
        return this.errorMessage;
    }

    public getErrorCode() {
        return this.errorCode;
    }

    public getData<T extends Record<string, any> = Record<string, any>>() {
        return this.data as T | undefined;
    }

    private parse(rawResponse?: BatchResponse | RequestError) {
        if (!rawResponse) {
            this.successful = false;
            this.statusCode = "500";
            return;
        }

        if (this.isBatchResponse(rawResponse)) {
            this.parseStatus(rawResponse);
            this.parseChangeResponse(rawResponse);
        } else {
            this.parseRequestError(rawResponse);
        }
    }

    private parseStatus(batchResponse: BatchResponse) {
        const batchResponses = batchResponse.__batchResponses || [];

        if (!batchResponses.length) {
            this.successful = false;
            this.statusCode = "500";
            return;
        }

        const response = batchResponses[0];

        if (this.isChangeResponse(response)) {
            this.successful = true;
            this.statusCode = "200";
            return;
        }

        if (this.isErrorResponse(response)) {
            this.statusCode = response.response?.statusCode || "500";

            if (this.statusCode.startsWith("4") || this.statusCode.startsWith("5")) {
                const errorBody = response.response?.body;

                if (errorBody) {
                    try {
                        const parsedBody = JSON.parse(errorBody);

                        if (this.isErrorResponseBody(parsedBody)) {
                            this.errorCode = parsedBody.error?.code;
                            this.errorMessage = parsedBody.error?.message?.value;
                        }
                    } catch {
                        this.errorMessage = errorBody;
                    }
                }

                this.successful = false;
            } else {
                this.successful = true;
            }
        } else if (this.hasStatusCode(response)) {
            this.statusCode = response.statusCode || "500";

            if (this.statusCode.startsWith("4") || this.statusCode.startsWith("5")) {
                this.successful = false;
            } else {
                this.successful = true;
            }
        } else {
            this.successful = false;
            this.statusCode = "500";
        }
    }

    private parseChangeResponse(batchResponse: BatchResponse) {
        const batchResponses = batchResponse.__batchResponses || [];

        if (!this.isSuccessful() || !batchResponses.length) {
            return;
        }

        const batch = batchResponses[0];

        if (this.isChangeResponse(batch)) {
            const changeResponses = batch.__changeResponses || [];
            const change = changeResponses[0];

            if (change) {
                this.data = change.data;

                if (this.hasMetadata(this.data)) {
                    delete this.data.__metadata;
                }

                if (change.statusCode) {
                    this.statusCode = change.statusCode;
                }
            }
        }
    }

    private parseRequestError(requestError: RequestError) {
        this.successful = false;
        this.statusCode = requestError.statusCode?.toString() || "500";

        if (requestError.responseText && typeof requestError.responseText === "string") {
            try {
                const parsedBody = JSON.parse(requestError.responseText);

                if (this.isErrorResponseBody(parsedBody)) {
                    this.errorMessage = parsedBody.error?.message?.value;
                    this.errorCode = parsedBody.error?.code;
                }
            } catch {
                this.errorMessage = requestError.responseText;
            }
        }
    }

    private isBatchResponse(response: any): response is BatchResponse {
        return response != null && typeof response === "object" && "__batchResponses" in response && response.__batchResponses != null;
    }

    private isChangeResponse(response: any): response is ChangeResponse {
        return response != null && typeof response === "object" && "__changeResponses" in response && response.__changeResponses != null;
    }

    private isErrorResponse(response: any): response is ErrorResponse {
        return response != null && typeof response === "object" && "message" in response;
    }

    private isErrorResponseBody(body: any): body is ErrorResponseBody {
        return body != null && typeof body === "object" && "error" in body && body.error != null && typeof body.error === "object";
    }

    private hasStatusCode(response: any): response is { statusCode?: string; } {
        return response != null && typeof response === "object" && "statusCode" in response;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private hasMetadata(data: any): data is { __metadata?: object; } {
        return data != null && typeof data === "object" && "__metadata" in data;
    }
}