import { DBService } from "../../../services/db.service";
import { Component, EventEmitter, forwardRef, Input, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Parameter } from "src/app/shared/data/parameter/parameter";
import { AsyncValidatorFn, ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR, ValidatorFn } from "@angular/forms";
import { RunService } from "src/app/shared/services/run.service";
import { Observable, Subject, Subscription } from "rxjs";
@Component({
  selector: "app-parameter",
  templateUrl: "./parameter.component.html",
  styleUrls: ["./parameter.component.scss"]
})


export class ParameterComponent implements OnInit {

  flatten(items) {
    const flat = [];

    items.forEach((item) => {
      if (Array.isArray(item)) {
        flat.push(...this.flatten(item));
      } else {
        flat.push(item);
      }
    });

    return flat;
  }

  formGroup: FormGroup;

  get value() {
    return this.formGroup.value;
  }

  parseData(data: any, validators?: any): FormGroup | FormArray | [any, ValidatorFn[], AsyncValidatorFn[]] {
    if (Array.isArray(data)) {
      return this.fb.array(data.map((item, index) => this.parseData(item, (validators || {})[index])));
    }
    if (typeof data === 'object' && data !== null) {
      const formGroupContent = {};
      for (const [key, value] of Object.entries(data)) {
        formGroupContent[key] = this.parseData(value, (validators || {})[key]);
      }
      return this.fb.group(formGroupContent);
    }
    const [syncValidators = [], asyncValidators = []] = validators || [];
    return [data, syncValidators, asyncValidators];
  }

  constructor(private formCtrl: FormGroupDirective,private fb: FormBuilder, private dbService: DBService, private runService: RunService) {
    // this.formGroup = fb.group({})
  }
  public increment() {
    this.formGroup.patchValue({ default: this.formGroup.get("default").value + 1 });
  }

  public decrement() {
    this.formGroup.patchValue({ default: this.formGroup.get("default").value - 1 });
  }



  ngOnInit() {
    this.formGroup = this.formCtrl.form;
    if (this.formGroup.get('type').value == "dynamic")
      if (this.formGroup.get('done')?.value == (false || null || undefined))
        this.generateDynamicParams()
  }


  // emitFormValue() {
  //   this.emitter.emit(this.formGroup)
  // }

  async generateDynamicParams() {
    try {
      this.formGroup.
        patchValue({ done: false, error: false });
      let result = await this.runService
        .runJob(this.formGroup.get("job").value["id"],this.formGroup.get("job").value["parameters"])
        .toPromise();
      let response;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      while (response == undefined || !("result" in response)) {
        try {
          response = await this.dbService
            .getObject("tasks", result["task_id"])
            .toPromise();
          if (response == undefined || !("result" in response)) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch {
          response = await this.dbService
            .getObject("tasks", result["task_id"])
            .toPromise();
        }
      }
      let options: any = [];

      if (response["result"]) {
        for (const item of this.formGroup.get("job").value["from"]) {
          for (const stepResult of response["steps"]) {
            if (stepResult["name"] == item["step"]) {
              for (const [stepKey, stepValue] of Object.entries(
                stepResult["outputs"]
              )) {
                if (item["outputs"].includes(stepKey)) {
                  options = options.concat(stepValue);
                }
              }
            }
          }
        }
      }

      if (Object.prototype.toString.call(this.formGroup.get("default").value) === "[object Array]") {
        this.formGroup.patchValue({'default': this.flatten(this.formGroup.get("default").value)})
      } else {
        this.formGroup.patchValue({'default': this.formGroup.get("default").value.split(",")})
      }
      
      if (options.length == 0) {
        this.formGroup.
          patchValue({ error: "No Results", done: true });
      }

      if (!options.includes(this.formGroup.get("default").value)) {
        options.push(this.formGroup.get("default").value[0]);
      }
      // this.dynamicResults[formGroup.name] = options;
      this.formGroup.
        patchValue({ choices: options, done: true, error: false });
    } catch (error) {
      console.log(JSON.stringify(error.message));
      this.formGroup.
        patchValue({ error: error.message, done: true });
    }
}
}