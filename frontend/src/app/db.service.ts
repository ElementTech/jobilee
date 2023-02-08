import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DBService {

  private baseUrl:string = window.location.protocol + '//' + window.location.host;

  constructor(private http: HttpClient) { }

  getObject(col: string, _id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/${col}/${_id}`);
  }

  createObject(col: string, obj: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/api/${col}`, obj);
  }

  updateObject(col: string, _id: string, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/api/${col}/${_id}`, value);
  }

  deleteObject(col: string, _id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/${col}/${_id}`, { responseType: 'text' });
  }
  deleteObjects(col: string,key: string, value: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/${col}/${key}/${value}`, { responseType: 'text' });
  }

  getObjectList(col: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/${col}`);
  }

  getObjectListByKey(col: string,key: string, value: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/${col}/${key}/${value}`);
  }  

  getJobOutputs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/jobs/outputs`);
  }
  calculateJobOutputs(outputs): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/jobs/outputs`,outputs);
  }
  getJobsCatalog(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/history`);
  }
  
}