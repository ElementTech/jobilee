export class Integration {
    _id?: string;
    name?: string;
    url?: string;
    steps: Step[];
    authentication?: string;
    authenticationData?: Array<Object>;    
}

export class Step {
    outputs?: Object;
    retryCount?: Number;
    retryDelay?: Number;
    parsing?: boolean;
    parsingTimeout?: Number;
    parsingDelay?: Number;
    ignoreSSL?: boolean;
    splitMultiChoice?: boolean;
    retryUntil?: Object;
    failWhen?: Object;
    mode?: string;
    authentication?: string;
    overrideAuthentication?: boolean;
    headers?: Array<Object>;
    authenticationData?: Array<Object>;
    type?: string;
    payload?: Object;
    parameter?: Object
    definition?: string;
}