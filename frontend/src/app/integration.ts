import { QueryBuilderConfig } from "angular2-query-builder";

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
    regex?: Object;
    retryCount?: Number;
    retryDelay?: Number;
    parsing?: boolean;
    parsingConfig: QueryBuilderConfig
    parsingTimeout?: Number;
    strict?: Boolean;
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