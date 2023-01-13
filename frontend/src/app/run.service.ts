import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RunService {

  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  runJob(_id: string,chosen_params: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/run/${_id}`,chosen_params);
  }


}