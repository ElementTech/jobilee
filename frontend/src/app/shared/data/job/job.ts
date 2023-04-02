import { FormArray, UntypedFormGroup, Validators } from "@angular/forms";
import { Step } from "../integration/integration";
import { Parameter } from "../parameter/parameter";
export class Job {
    _id?: string;
    name?: string;
    apiID?: string;
    integration?: string;
    steps?: Step[];
    parameters?: Parameter[];
    description?: string;
    markdown?: string;


    toFormGroup() {
        return {
        _id: [this._id],
        name: [this.name, Validators.required],
        apiID: [this.apiID],
        integration: [this.integration, Validators.required],
        steps: [this.integration],
        parameters: new FormArray([]),
        description: [this.description],
        markdown: [this.markdown]
    };
    }
}