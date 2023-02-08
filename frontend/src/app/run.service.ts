import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RunService {

  private baseUrl:string = window.location.protocol + '//' + window.location.host;

  constructor(private http: HttpClient) { }

  runJob(_id: string,chosen_params: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/run/${_id}`,chosen_params);
  }
  retryJob(task_id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/retry/${task_id}`,{});
  }

  renderChart(data): Observable<any> {
    return this.http.post(`${this.baseUrl}/chart/render`,data);
  }
  renderExistingChart(name): Observable<any> {
    return this.http.post(`${this.baseUrl}/chart/render/${name}`,{});
  }


}