import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private loginSubject = new Subject<any>();

    publishLogin(data: any) {
        this.loginSubject.next(data);
    }

    getObservableLogin(): Subject<any> {
        return this.loginSubject;
    }
}