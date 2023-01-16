export class Integration {
    _id?: string;
    name?: string;
    url?: string;
    output?: any;
    steps: Array<any>;
    ignoreSSL?: boolean;
    splitMultiChoice?: boolean;
    mode?: string;
    authentication?: string;
    headers?: Array<Object>;
    authenticationData?: Array<Object>;
    type?: string;
    payload?: Object;
    parameter?: Object
    definition?: string;
}