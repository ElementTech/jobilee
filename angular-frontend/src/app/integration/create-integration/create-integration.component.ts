import { DBService } from 'src/app/db.service';
import { Integration } from 'src/app/integration';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-integration',
  templateUrl: './create-integration.component.html',
  styleUrls: ['./create-integration.component.css']
})
export class CreateIntegrationComponent implements OnInit {

  integration: Integration = new Integration();
  submitted = false;

  constructor(private dbService: DBService,
    private router: Router) { }

  ngOnInit() {
  }

  newIntegration(): void {
    this.submitted = false;
    this.integration = new Integration();
  }

  save() {
    this.dbService
    .createObject("integrations",this.integration).subscribe(data => {
      console.log(data)
      this.integration = new Integration();
      this.gotoList();
    }, 
    error => console.log(error));
  }

  onSubmit() {
    this.submitted = true;
    this.save();    
  }

  gotoList() {
    this.router.navigate(['/integrations']);
  }
}