import { Job } from 'src/app/job';
import { Component } from '@angular/core';
@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent {

  job: Job = {
    parameters: [
      {
        "name": "string-param",
        "type": "text",
        "default": "mytext"
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
          "id": "63c2bdfa935af1fa39a7279d",
          "parameters": {
            "string-param": "override"
          },          
          "from": [{
            "step": 2,
            "outputs": ["result","status"],
          }]
        }
      }
  ]
  };

}

