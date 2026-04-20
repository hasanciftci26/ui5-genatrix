export type InnerErrorDetails = {
    ContentID?: string;
    code?: string;
    message?: {
        lang?: string;
        value?: string;
    };
    severity?: string;
    target?: string;
};

export type RequestError = {
    message?: string;
    statusCode?: number;
    statusText?: string;
    headers?: object[];
    responseText?: string;
};

export type ErrorResponseObject = {
    statusCode?: string;
    statusText?: string;
    headers?: Record<string, any>;
    body?: string;
};

export type ErrorResponse = {
    $reported?: boolean;
    message?: string;
    response?: ErrorResponseObject;
};

export type ErrorResponseBody = {
    error?: {
        ContentID?: string;
        code?: string;
        innererror?: {
            errordetails?: InnerErrorDetails[];
        };
        message?: {
            lang?: string;
            value?: string;
        };
        severity?: string;
        target?: string;
    };
};

export type ChangeResponseItem = {
    _imported?: boolean;
    $reported?: boolean;
    statusCode?: string;
    statusText?: string;
    headers?: Record<string, any>;
    body?: string;
    data?: Record<string, any>;
};

export type ChangeResponse = {
    __changeResponses?: ChangeResponseItem[];
};

export type BatchResponse = {
    __batchResponses?: Array<ChangeResponse | ChangeResponseItem | ErrorResponse>;
};

type SubmitSettings = {
    responseType: "Submit";
    rawResponse?: BatchResponse | RequestError;
};

type DeleteSettings = {
    responseType: "Delete";
    successful: boolean;
    rawResponse?: RequestError;
};

export type ResponseSettings = SubmitSettings | DeleteSettings;