import { QueryBuilderConfig } from "angular2-query-builder";

export class Integration {
    _id?: string;
    name?: string;
    icon?: string;
    url?: string;
    iconUrl?: string;
    description?: string;
    steps: Step[];
    authentication?: string;
    authenticationData?: Array<Object>;    
}

export class Step {
    outputs?: Object;
    regex?: Object;
    regexMatch?: Object;
    retryCount?: Number;
    retryDelay?: Number;
    parsing?: boolean;
    removeDuplicates: Object;
    parsingConfig: QueryBuilderConfig;
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