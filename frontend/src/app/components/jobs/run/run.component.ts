import { DBService } from "src/app/shared/services/db.service";
import { Job } from "src/app/shared/data/job/job";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RunService } from "src/app/shared/services/run.service";
import { JsonEditorOptions } from "@maaxgr/ang-jsoneditor";
import Swal from "sweetalert2";
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
} from "@angular/forms";
@Component({
  selector: "app-run-job",
  templateUrl: "./run.component.html",
  styleUrls: ["./run.component.scss"],
})
export class RunJobComponent implements OnInit {
  _id: string;
  toHide = true;
  job: Job = new Job();
  response: any;
  editorOptions: JsonEditorOptions;
  dynamicResultsError: any[] = [];
  dynamicResults: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dbService: DBService,
    private runService: RunService,
    private fb: UntypedFormBuilder
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ["code", "tree"];
    this.editorOptions.mode = "code";
  }

  hiddenCount() {
    if (this.parameters.value != undefined) {
      return this.parameters.value.filter((p) => p.hidden).length;
    } else {
      return 0;
    }
  }
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
  hasDynamic() {
    return this.parameters.value.some((obj) => obj.type === "dynamic");
  }

  list() {
    this.router.navigate(["jobs"]);
  }

  result: any;
  run() {
    const params = this.parameters.value
      .map((p) => {
        return { key: p.name, value: p.default };
      })
      .reduce(
        (obj, item) => Object.assign(obj, { [item.key]: item.value }),
        {}
      );
    this.runService.runJob(this._id, params).subscribe(
      (result) => {
        Swal.fire({
          icon: "success",
          title: "Job Triggered Succesfully",
          // text: result['task_id'],
          timer: 1000,
        }).then((data) => {
          this.router.navigate(["jobs", "result", this._id, result["task_id"]]);
        });
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Job Trigger Failed",
          text: JSON.stringify(error.message),
        });
      }
    );
  }

  // Form Builder

  public jobPayload: UntypedFormGroup;

  get parameters() {
    return this.jobPayload.controls["parameters"] as FormArray;
  }

  ngOnInit(): void {
    this.jobPayload = this.fb.group({
      parameters: this.fb.array([]),
    });

    this._id = this.route.snapshot.params["_id"];
  
    this.dbService.getObject("jobs", this._id).subscribe(
      (data) => {
        this.job = data;
        this.regenerateParams();
      },
      (error) => console.log(error)
    );
  }
  public increment(i) {
    this.parameters
      .at(i)
      .patchValue({ default: this.parameters.at(i).get("default").value + 1 });
  }

  public decrement(i) {
    this.parameters
      .at(i)
      .patchValue({ default: this.parameters.at(i).get("default").value - 1 });
  }
  addParam(param) {
    const paramForm = this.fb.group({
      name: [param.name],
      type: [param.type],
      default: [
        ['multi-choice', 'dynamic'].includes(param.type) ? (!(param.default instanceof Array) ? param.default.split(',') : param.default) : param.default
      ],
      choices: [param?.choices],
      job: [param?.job],
      hidden: [param?.hidden],
      done: [false],
      error: [false]
    });
    this.parameters.push(paramForm);
  }



  regenerateParams() {
    if (this.job.parameters != undefined) {
      for (const param of this.job.parameters) {
        if (this.parameters.controls.filter(p => param.name == p.value.name).length == 0) {
          this.addParam(param);
        }
        if (param.type == "dynamic") {
          this.generateDynamicParams(param);
        }
      }
    }
  }

  async generateDynamicParams(param) {

      try {
        this.parameters.at(this.parameters.controls.findIndex(control => control.value.name == param.name)).
          patchValue({ done: false, error: false });
        let result = await this.runService
          .runJob(param["job"]["id"], param["job"]["parameters"])
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
          for (const item of param["job"]["from"]) {
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

        if (Object.prototype.toString.call(param.default) === "[object Array]") {
          param.default = this.flatten(param.default);
        } else {
          param.default = param.default.split(",");
        }
        if (options.length == 0) {
          this.parameters.at(this.parameters.controls.findIndex(control => control.value.name == param.name)).
            patchValue({ error: "No Results", done: true });
        }

        if (!options.includes(param.default)) {
          options.push(param.default[0]);
        }
        // this.dynamicResults[param.name] = options;
        this.parameters.at(this.parameters.controls.findIndex(control => control.value.name == param.name)).
          patchValue({ choices: options, done: true, error: false });
      } catch (error) {
        console.log(JSON.stringify(error.message));
        this.parameters.at(this.parameters.controls.findIndex(control => control.value.name == param.name)).
          patchValue({ error: error.message, done: true });
      }
  }
  
}
