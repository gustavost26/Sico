import { Injectable } from '@angular/core';

@Injectable()
export class MsicoAuthtokenProvider {
  private tokenValue: any;

  constructor() {
    this.tokenValue = '';
  }

  getToken() {
    return this.tokenValue;
  }

  setToken(token: any) {
    this.tokenValue = token;
  }

  destroyToken() {
    if (this.tokenValue) {
      this.tokenValue = '';
    }
  }
}
