import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

declare let cordova: any;

@Injectable()
export class MsicoGeneratePdfProvider {
  constructor(
    private fileOpener: FileOpener,
    public platform: Platform,
    private emailComposer: EmailComposer,
    private file: File
  ) {}

  // Create the pdf file from the base64 binary code and set name
  CreatePDFFile(base64content: any, name: any) {
    let contentType = 'application/pdf';
    let folderPath: any;

    if (this.platform.is('android')) {
      folderPath = cordova.file.externalRootDirectory;
    } else if (this.platform.is('ios')) {
      folderPath = cordova.file.documentsDirectory;
    }

    let filename = name + '.pdf';

    // Calls the function to convert the base64 string from the server to an pdf file
    this.savebase64AsPDFFile(folderPath, filename, base64content, contentType);
  }

  // Create the pdf file from the base64 binary code and set name
  CreatePDFFileToSend(base64content: any, name: any) {
    let contentType = 'application/pdf';
    let folderPath: any;

    if (this.platform.is('android')) {
      folderPath = cordova.file.externalRootDirectory;
    } else if (this.platform.is('ios')) {
      folderPath = cordova.file.documentsDirectory;
    }

    let filename = name + '.pdf';

    // Calls the function to convert the base64 string from the server to an pdf file
    this.savebase64AsPDFToEmail(
      folderPath,
      filename,
      base64content,
      contentType
    );
  }

  // Convert the base64 string from the server
  private savebase64AsPDFFile(folderpath: any, filename: any, content: any, contentType: any) {
    // Convert the base64 string in a Blob
    let data: Blob = this.b64toBlob(content, contentType, 512);

    let browser;

    //let localfile = new File();

    this.file
      .writeFile(folderpath, filename, data, { replace: true })
      .then((pdf: any) => this.openFile(folderpath, filename))
      .catch((err: any) => {
        alert('file create failed: ' + err);
      });
  }

  private openFile(folderpath: string, filename: string) {
    this.fileOpener.open(folderpath + filename, 'application/pdf');
  }

  // Convert the base64 string from the server
  private savebase64AsPDFToEmail(folderpath: any, filename: any, content: any, contentType: any) {
    // Convert the base64 string in a Blob
    let data: Blob = this.b64toBlob(content, contentType, 512);

    let browser;

    //let localfile = new File();

    // Create PDF file to send to mail
    this.file
      .writeFile(folderpath, filename, data, { replace: true })
      .then((pdf: any) => this.sendEmail(folderpath, filename))
      .catch((err: any) => {
        alert('file create failed: ' + err);
      });
  }

  // Send by mail attachment the pdf file
  private sendEmail(folderpath: any, filename: any) {
    let email = {
      to: '',
      cc: '',
      attachments: [folderpath + filename],
      subject: '',
      body: '',
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  // Convert base64 content to Blob
  private b64toBlob(b64Data: any, contentType: any, sliceSize: any) {
    let byteCharacters = atob(b64Data);

    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
