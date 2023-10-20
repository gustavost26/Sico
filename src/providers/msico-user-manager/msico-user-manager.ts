import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';

@Injectable()
export class MsicoUserManagerProvider {
  private userRole: any;
  

  constructor(public http: HttpClient) {}

  // set User Role
  public setUserRole(roleValue: any) {
    this.userRole = roleValue;
  }

  // get User Role
  public getUserRole() {
    return this.userRole;
  }

  public showImprimirCO(): any {
    if (this.userRole) {
      if (this.userRole.includes('SICO_MED') || this.userRole.includes('SICO_MLG') || this.userRole.includes('SICO_MP') || this.userRole.includes('SICO_DGS')) {
        return true;
      }
    }
  }

  public showImprimirCOSemCausasMorte(): any {
    if (this.userRole) {
      if (this.userRole.includes('SICO_MED') || this.userRole.includes('SICO_MLG') || this.userRole.includes('SICO_MP') || this.userRole.includes('SICO_DGS')) {
        return true;
      }
    }
  }

  public showImprimirGuiaTransporte(): any {
    if (this.userRole) {
      if (this.userRole.includes('SICO_MED') || this.userRole.includes('SICO_MLG') || this.userRole.includes('SICO_DGS')) {
        return true;
      }
    }
  }
}
