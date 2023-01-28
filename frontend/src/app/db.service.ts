import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DBService {

  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getObject(col: string, _id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${col}/${_id}`);
  }

  createObject(col: string, obj: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/${col}`, obj);
  }

  updateObject(col: string, _id: string, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${col}/${_id}`, value);
  }

  deleteObject(col: string, _id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${col}/${_id}`, { responseType: 'text' });
  }
  deleteObjects(col: string,key: string, value: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${col}/${key}/${value}`, { responseType: 'text' });
  }

  getObjectList(col: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${col}`);
  }

  getObjectListByKey(col: string,key: string, value: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${col}/${key}/${value}`);
  }  

  
}