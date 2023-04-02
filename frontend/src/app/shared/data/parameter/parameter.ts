import { FormArray, FormControl, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";


interface TypeText {
  type: "text";
  default: string;
}

interface TypeNumber {
  type: "number";
  default: number;
}

interface TypeChoice {
  type: "choice";
  default: string;
  choices: Array<string | number>;
}
interface TypeMultiChoice {
  type: "multi-choice";
  default: Array<string | number>;
  choices: Array<string | number>;
}
interface TypeDynamic {
  type: "dynamic";
  choice: 'single' | 'multi';
  default: Array<string | number>;
  job: {
    from: Array<From>;
    id: string;
    parameters: Object;    
  };
}

class From {
  step: string;
  outputs: Array<String>;

}

// "job" : { "from" : [ { "outputs" : [ "first_name", "last_name" ], "step" : "Query" } ], "id" : "Random Users", "parameters" : { "size" : "Query" } }, "name" : "dynamic-param", "type" : "dynamic" } ]

type ParameterType = TypeText | TypeNumber | TypeChoice | TypeMultiChoice | TypeDynamic;
type ChoiceParameter = TypeChoice | TypeMultiChoice

export class Parameter {
  get(arg0: string) {
    throw new Error("Method not implemented.");
  }

  patchValue(arg0: { default: any[]; }) {
    throw new Error("Method not implemented.");
  }

  getTypes() {
    return ["text", "number", "choice", "multi-choice", "dynamic"]
  }

  name: string;
  type: ParameterType["type"];
  default: ParameterType["default"];
  choice?: TypeDynamic['choice'];
  choices?: ChoiceParameter["choices"];
  hidden?: boolean;
  job?: TypeDynamic['job']
  done?: boolean;
  error?: boolean | string;

  constructor(name: string, type: "text", hidden: boolean, defaultValue: string);
  constructor(name: string, type: "number", hidden: boolean, defaultValue: number);
  constructor(name: string, type: "choice" | "multi-choice", hidden: boolean, defaultValue: string | number, choices: Array<string | number>);
  constructor(name: string, type: "dynamic", hidden: boolean, defaultValue: Array<string | number>, job: TypeDynamic['job']);
  constructor(name: string, type: ParameterType["type"], hidden: boolean, defaultValue: ParameterType["default"],
   choicesOrJob?: ChoiceParameter["choices"] | TypeDynamic['job'], 
   choiceType?: TypeDynamic['choice']) {
    this.name = name;
    this.type = type;
    this.choice = choiceType;
    this.default = defaultValue;
    this.hidden = hidden;
    // this.hidden = hidden;
    if (type === "choice" || type === "multi-choice") {
      if (choicesOrJob && Array.isArray(choicesOrJob)) {
        this.choices = choicesOrJob;
      } else {
        throw new Error(`Invalid constructor parameters for type '${type}'`);
      }
    } else if (type === "dynamic") {
      if (choicesOrJob && typeof choicesOrJob === "object") {
        (this.job as any) = choicesOrJob;
      } else {
        throw new Error(`Invalid constructor parameters for type '${type}'`);
      }
    } else if (choicesOrJob) {
      throw new Error(`Invalid constructor parameters for type '${type}'`);
    }
  }

}