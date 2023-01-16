import { Integration } from 'src/app/integration';
import { Component } from '@angular/core';
@Component({
  selector: 'app-create-integration',
  templateUrl: './create-integration.component.html',
  styleUrls: ['./create-integration.component.css']
})
export class CreateIntegrationComponent {


  integration: Integration = {
    steps: [{
      type: 'post',
      parsing: false,
      mode: 'payload',
      authentication: 'None',
      outputs: { "result": "{result}" },
      retryUntil: { "result": "Success" },
      splitMultiChoice: true,
      authenticationData: [],
      headers: [{ "key": "Content-Type", "value": "application/json" }],
      payload: { "parameter": ['{parameter}'] },
      ignoreSSL: false,
      parameter: { "name": "{key}", "value": "{value}" }
    }]
  };
  
}