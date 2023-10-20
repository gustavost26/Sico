import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class ConfigProvider {
  constructor(private http: HttpClient) {}

  public getJSON(): Observable<Response> {
    let apiUrl = 'assets/data/config.json';
    return this.http.get(apiUrl).pipe(map((res: any) => res.json()));
  }
}
