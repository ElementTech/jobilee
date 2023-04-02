import { DBService } from '../../../services/db.service';
import { Job } from '../../../data/job/job';
import { Component, Input, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {JsonEditorComponent, JsonEditorOptions} from "@maaxgr/ang-jsoneditor"
import { Integration } from '../../../data/integration/integration';
import { getStringAfterSubstring, getStringBeforeSubstring, toSelectItem } from 'src/main';
import { RunService } from '../../../services/run.service';
import { filter, switchMap, takeWhile } from 'rxjs/operators';
import { defer, from, timer } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { AsyncValidatorFn, FormArray, FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// import { MustMatch } from '../../../../shared/validators/passwordMatch';
import * as data from "src/app/shared/data/todo/todo";
const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
import { MarkdownService } from 'ngx-markdown';
import { Parameter } from 'src/app/shared/data/parameter/parameter';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'ngbd-modal-content',
  template: `




    <div class="modal-header">
      <h4 class="modal-title">Parameter Form</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()">
        
      </button>
    </div>
    <div class="modal-body">
      <form class="new-task-wrapper h-100" >

        <app-parameter-form [param]="item" [selectedType]="(editing !== false) ? item.type : 'text'"></app-parameter-form>
          <!-- <div class="border-bottom border-start border-end pull-right" role="group">
            <button
            class="btn btn-outline-default text-primary rounded-0"
            type="submit"
            ><i class="fa fa-plus" aria-hidden="true"></i> {{editing ? 'Edit' : 'Add'}}</button -->
          
          <!-- <button class="btn btn-outline-default text-danger rounded-0"   type="button"><i class="fa fa-times" aria-hidden="true"></i> Close</button> -->
        <!-- </div> -->
      </form>

    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
      <button
      (click)="activeModal.close(item)"
          class="btn btn-outline-primary"
          type="button"
          ><i class="fa fa-plus" aria-hidden="true"></i> {{(editing !== false) ? 'Edit' : 'Add'}}</button
        >
    </div>
  `
})
export class NgbdModalContent {
  @Input() editing;
  @Input() item;
  constructor(public activeModal: NgbActiveModal) {}

}

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {


  // @ViewChild("addContact") AddContact: AddContactComponent;
  // @ViewChild("addCategory") AddCategory: AddCategoryComponent;
  // @ViewChild("print") Print: PrintContactComponent;
  public history: boolean = false;
  public editContact: boolean = false;
  public d = new Date();
  public myDate = `${this.d.getDate()} ${Months[this.d.getMonth() - 1]?.slice(0, 3)}`;
  public text= new Parameter("","text",false,"");
  public todos = data.task;
  public completed: boolean = false;
  public red_border: boolean = false;
  public objToAdd: object = {
    text: "",
    objToAdd: "",
    Date: this.myDate,
    completed: "",
    badgeClass: "",
  };


  public addTask(text: any) {
    let someData = {
      text: text,
    };
    this.todos.push(text);
  }

  // public clearParam(type)
  // {
  //   param = null
  //   param = new Parameter("name",type,false,"value");
  // }
  editing: any = false;
  public addParam(param,editing) {
    console.log(param,editing)
    const paramForm = this.fb.group({
      name: [param.name],
      type: [param.type],
      default: [
        ['multi-choice', 'dynamic'].includes(param.type) ? (!(param.default instanceof Array) ? (param?.default as string).split(',') : param?.default) : param?.default
      ],
      choices: [param?.choices],
      job: [param?.job],
      hidden: [param?.hidden],
      done: [false],
      error: [false]
    });
    console.log(paramForm)
    if (editing !== false)
      this.parameters.at(editing).setValue(paramForm.value)
    else
      this.parameters.push(paramForm); 
  }

  openModal(visible,editing,param) {
    this.visible = visible;
    this.editing = editing;
    if (editing !== false)
    {
      param.default = ['multi-choice', 'dynamic'].includes(param.type) ? (!(param.default instanceof Array) ? (param?.default as string).split(',') : param?.default) : param?.default
    }
    else
      param = new Parameter('','text',false,'')
    const modalRef = this.modalService.open(NgbdModalContent, { size: 'lg' });
    modalRef.componentInstance.editing = editing;
    modalRef.componentInstance.item = structuredClone(param);
    modalRef.closed.subscribe(p=>{
      this.addParam(p,editing)
    })
  }

  public taskCompleted(task: any) {
    task.completed = !task.completed;
  }

  public deleteParam(index: any) {
    this.parameters.removeAt(index)
  }



  public markAllAction(action: any) {
    this.todos.filter((task) => {
      task.completed = action;
    });
    this.completed = action;
  }

  public finish() {
    this.toaster.success('Successfully Registered')
  }

  showHistory() {
    this.history = !this.history;
  }


  public editorOptions: JsonEditorOptions;
  public initialData: any;
  toSelectItem = toSelectItem;
  integrations: any;
  @Input() _id: string;
  @Input() formType: "Create" | "Edit";
  @Input() job: Job = new Job();
  submitted = false;
  dynamicResults = {}
  dynamicResultsError = {}
  public visible: boolean = true;

  examples =[
    {
      "name": "string-param",
      "type": "text",
      "default": "mytext"
    },
    {
      "name": "number-param",
      "type": "number",
      "default": 0
    },
    {
      "name": "choice-param",
      "type": "choice",
      "default": "b",
      "choices": ["a","b","c","d"]
    },
    {
      "name": "multi-choice-param",
      "type": "multi-choice",
      "default": "f,h",
      "choices": ["e","f","g","h"]
    },
    {
      "name": "dynamic-param",
      "type": "dynamic",
      "default": "a,b",
      "job": {
        "id": "Random Users",
        "parameters": {
          "size": "2"
        },          
        "from": [{
          "step": 0,
          "outputs": ["first_name","last_name"],
        }]
      }
    }
  ]
  steps: any;

  constructor(private dbService: DBService,
    private toaster: ToastrService,
    private modalService: NgbModal, public activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private router: Router, private runService: RunService) {
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'code';
      this.maxDate = new Date();
    }
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    maxDate: Date;

  public jobPayload: UntypedFormGroup;

  get parameters() {
    return this.jobPayload.controls["parameters"] as FormArray;
  }
  ngOnInit() {
    this.visible = (this.formType == 'Create')
    this.jobPayload = this.fb.group((this.job));
    this.jobPayload.setControl('parameters',this.fb.array(this.job.parameters))
    this.dbService.getObjectList("integrations").subscribe(data=>{
      this.integrations = data
      this.regenerateParams()
    })
  }
  updateMarkdown(event)
  {
    this.job.markdown = event
  }

  getSteps()
  {
    return this.integrations?.find(item => item.name === this.job.integration)?.steps.map((item)=>item.name)
  }

  regenerateParams()
  {
    this.dynamicResultsError = []
    if (this.job?.parameters != undefined)
    {
      for (const param of this.job?.parameters)
      {
        if (param.type == "dynamic")
        {
          this.dynamicResults[param.name] = []
          this.generateDynamicParams(param)
  
        }
      }
    }
  }
  makeOptions = () => {
    let editorOptions = new JsonEditorOptions()
    editorOptions.modes = ['code', 'tree'];
    editorOptions.mode = 'code';
    return editorOptions
  }
  flatten(items) {
    const flat = [];
  
    items.forEach(item => {
      if (Array.isArray(item)) {
        flat.push(...this.flatten(item));
      } else {
        flat.push(item);
      }
    });
  
    return flat;
  }

  async generateDynamicParams(param) {
    try {
        let result = await this.runService.runJob(param['job']['id'], param['job']['parameters']).toPromise();
        let response;
        await new Promise(resolve => setTimeout(resolve, 1000));
        while ((response == undefined) || !('result' in response)) {
          try {
            response = await this.dbService.getObject("tasks", result["task_id"]).toPromise();
            if ((response == undefined) || !('result' in response)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch {
            response = await this.dbService.getObject("tasks", result["task_id"]).toPromise();
          }
        }
        let options: any = []

        if (response['result']){
          
            for (const item of param['job']['from']) {
              for (const stepResult of response['steps'])
              {
                if (stepResult['name'] == item['step']) {
                    for (const [stepKey, stepValue] of Object.entries(stepResult['outputs']))
                    {
                      if (item['outputs'].includes(stepKey))
                      {
                        options = options.concat(stepValue)
                      }
                    }
                }
              }
            }
        }

        if(Object.prototype.toString.call(param.default) === '[object Array]') {
          param.default = this.flatten(param.default)
        } else {
          param.default = param.default.split(",")
        }
        if (options.length == 0) {
          this.dynamicResultsError[param.name] = "No Results"
          this.dynamicResults[param.name] = param.default[0]
        }


        if (!options.includes(param.default))
        {
          options.push(param.default[0])
        }
        this.dynamicResults[param.name] = options
    } catch (error) {
        console.log(JSON.stringify(error.message));
        this.dynamicResultsError[param.name] = error.message
        this.dynamicResults[param.name] = param.default
    }
}

  getURL(integrationName) {
      return this.integrations?.find(item => item.name === integrationName)?.url
  }
  getSuffix(integrationName) {
    return getStringAfterSubstring(this.integrations?.find(item => item.name === integrationName)?.steps[0]?.definition,"{job}") 
  }
  getPrefix(integrationName) {
    return getStringBeforeSubstring(this.integrations?.find(item => item.name === integrationName)?.steps[0]?.definition,"{job}") || ""
  }


  save() {
    if (this.formType == "Create")
    {
      this.dbService
      .createObject("jobs",this.jobPayload.value).subscribe(data => {
        this.gotoList();
      }, 
      error => console.log(error));
    } else if (this.formType == "Edit")
    {
      this.dbService.updateObject("jobs",this._id, this.jobPayload.value)
      .subscribe(data => {
        this.gotoList();
      }, error => console.log(error));
    }
  }

  onSubmit() {
    this.save();    
  }

  gotoList() {
    this.router.navigate(['/catalog']);
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

}

