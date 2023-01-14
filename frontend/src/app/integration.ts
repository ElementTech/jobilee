export class Integration {
    _id?: string;
    name?: string;
    url?: string;
    ignoreSSL?: boolean;
    splitMultiChoice?: boolean;
    authentication?: string;
    headers?: Array<Object>;
    authenticationData?: Array<Object>;
    type?: string;
    payload?: Object;
    parameter?: Object
    definition?: string;
}