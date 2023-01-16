export class Integration {
    _id?: string;
    name?: string;
    url?: string;
    steps: Step[];
}

export class Step {
    outputs?: Object;
    retryCount?: Number;
    parsing?: boolean;
    ignoreSSL?: boolean;
    splitMultiChoice?: boolean;
    retryUntil?: Object;
    mode?: string;
    authentication?: string;
    headers?: Array<Object>;
    authenticationData?: Array<Object>;
    type?: string;
    payload?: Object;
    parameter?: Object
    definition?: string;
}