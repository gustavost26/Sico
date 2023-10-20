import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from '@ionic/angular'; //Events
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';


// Pages
import { LoginPageComponent } from '../pages/login/login';
import { RegistosPageComponent } from '../pages/registos/registos';
import { ConsultasPageComponent } from '../pages/consultas/consultas';
import { ComplementaresPageComponent } from '../pages/complementares/complementares';
import { MenuPrincipalPageComponent } from '../pages/menu-principal/menu-principal';
import { ContactosPageComponent } from '../pages/contactos/contactos';
import { SobrePageComponent } from '../pages/sobre/sobre';
import { AjudaPageComponent } from '../pages/ajuda/ajuda';

// Providers
import { MsicoAuthtokenProvider } from '../providers/msico-authtoken/msico-authtoken';
import { MsicoUserManagerProvider } from '../providers/msico-user-manager/msico-user-manager';
import { isRightSide } from 'ionic-angular/util/util';
import { LoginService } from 'src/providers/login.service';

/*@Component({
  templateUrl: 'app.html'
})*/

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {//SICOMobileAppComponent
  // public rootPage: any = MenuPrincipalPageComponent;
  @ViewChild('content') navCtrl: NavController;

  public pages: Array<{ title: string; component: any }>;

  // Pages
  registosPage: any;
  consultasPage: any;
  complementaresPage: any;
  logoutPage: any;
  sucessoPage: any;
  contactosPage: any;
  sobrePage: any;
  ajudaPage: any;

  public medicName: any;
  public medicNumber: any;

  private menuCtrl: MenuController;

  public userRoles: any;

  constructor(
    platform: Platform,
    public msicoAuthtoken: MsicoAuthtokenProvider,
    //public events: Events,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private msicoUserManagerProvider: MsicoUserManagerProvider,
    private loginService: LoginService
  ) {
    /*events.subscribe('user:login', (medicName: any, medicNumber: any, roleUser: any) => {
      this.medicName = medicName;
      this.medicNumber = medicNumber;
      this.userRoles = roleUser;
      this.msicoUserManagerProvider.setUserRole(this.userRoles);
    });*/

    this.loginService.getObservableLogin().subscribe((data) => {
      this.medicName = data.medicName;
      this.medicNumber = data.medicNumber;
      this.userRoles = data.roleUser;
      this.msicoUserManagerProvider.setUserRole(this.userRoles);
    });

    platform.ready().then(() => {
      this.navCtrl.navigateRoot('login', {
        //animate: true,
        //animation: 'md-transition',
        //duration: 1000
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();

      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'registosPage', component: RegistosPageComponent }
      ];

      this.registosPage = RegistosPageComponent;
      this.consultasPage = ConsultasPageComponent;
      this.complementaresPage = ComplementaresPageComponent;
      this.logoutPage = LoginPageComponent;
      this.contactosPage = ContactosPageComponent;
      this.sobrePage = SobrePageComponent;
      this.ajudaPage = AjudaPageComponent;
    });
  }

  // It handles the menu options page
  menuHandler(page: any) {
    if (page === this.logoutPage) {
      this.msicoAuthtoken.destroyToken();
      this.navCtrl.navigateRoot('/login');
      //this.navCtrl.setRoot(LoginPageComponent);
      //this.navCtrl.popToRoot();
    } else {
      this.navCtrl.navigateForward(page);
    }
  }
}
