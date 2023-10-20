import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'page-contactos',
  templateUrl: 'contactos.html'
})
export class ContactosPageComponent {
  readonly iconArrowUp = 'ios-arrow-up-outline';
  readonly iconArrowDown = 'ios-arrow-down-outline';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private emailComposer: EmailComposer,
    private socialSharing: SocialSharing,
    private callNumber: CallNumber
  ) {}

  // Booleans
  public miniSaude;
  public miniJustica;
  public miniAdminInterna;

  // Check
  miniSaudeIcon = this.iconArrowDown;
  miniJusticaIcon = this.iconArrowDown;
  miniAdminInternaIcon = this.iconArrowDown;

  onClickNumber(callNumber: string) {
    this.callNumber
      .callNumber(callNumber, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  sendEmail(emailAdress) {
    let email = {
      to: emailAdress,
      cc: '',
      attachments: [],
      subject: '',
      body: '',
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  // It handles the show and hide sections of the form
  accordionHandler(sectionDescription): void {
    // Ministerio da Saude
    if (sectionDescription === 'miniSaude') {
      this.miniSaude = !this.miniSaude;
      this.miniSaudeIcon = this.miniSaude
        ? this.iconArrowUp
        : this.iconArrowDown;
    }

    // Ministerio da Justiça
    if (sectionDescription === 'miniJustica') {
      this.miniJustica = !this.miniJustica;
      this.miniJusticaIcon = this.miniJustica
        ? this.iconArrowUp
        : this.iconArrowDown;
    }

    // Ministerio da Justiça
    if (sectionDescription === 'miniAdminInterna') {
      this.miniAdminInterna = !this.miniAdminInterna;
      this.miniAdminInternaIcon = this.miniAdminInterna
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
  }
}
