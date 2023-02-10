import { Step } from "./integration";

export class Job {
    _id?: string;
    name?: string;
    apiID?: string;
    integration?: string;
    steps?: Step[];
    parameters?: Array<any>;
description?: string;
}