import { DBService } from "../../../services/db.service";
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { Parameter } from "src/app/shared/data/parameter/parameter";
import {
  AsyncValidatorFn,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
} from "@angular/forms";
import { RunService } from "src/app/shared/services/run.service";
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
} from "rxjs";
import { finalize, tap, map } from 'rxjs/operators';
@Component({
  selector: "app-parameter-form",
  templateUrl: "./parameter-form.component.html",
  styleUrls: ["./parameter-form.component.scss"],
})
export class ParameterFormComponent implements OnInit {
  @Input() param: Parameter = new Parameter("", "text", false, "");
  @Input() selectedType:
    | "number"
    | "text"
    | "choice"
    | "multi-choice"
    | "dynamic" = "text";

  jobList = [];
  jobs = [];
  bufferSize = 50;
  loading = false;
  input$ = new Subject<string>();
  jobs$: Observable<any>;
  constructor(private dbService: DBService, private runService: RunService) {

  }

  ngOnInit() {
    if (this.param.job)
      if (!this.param.job.id)
        this.param.job = { from: [], id: '',parameters: [] };
    this.param.type = this.selectedType;
    this.jobs$ = this.dbService.getJobExtended().pipe(tap(data => { this.jobs = data }));

  }
  getSteps(jobName) {

    return this.jobs?.find(item => item.name == jobName)?.steps
  }

  getOutputs(jobName, step) {
    let res = this.getSteps(jobName)?.find(t => t.name == step)?.outputs || []
    return res;
  }

  getParams(name) {
    return this.jobs.find(item => item.name == name)?.parameters
  }
  removeJobBock(i)
  {
    this.param.job.from.splice(i,1)
  }

  addDynamicFrom() {
    this.param.job.from.push({
      step: "",
      outputs: [],
    })
  }


}
