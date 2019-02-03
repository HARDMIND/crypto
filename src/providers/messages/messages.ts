import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { EvaluationProvider } from '../evaluation/evaluation';

/*
  Generated class for the MessagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessagesProvider {

  constructor(public alertCtrl: AlertController, public evaluationProvider:EvaluationProvider) {
    console.log('Hello MessagesProvider Provider');
  }

  public alert(condition, title, subtitle,cssClass=null) {
    if(condition){
      /** return result */
      const alert = this.alertCtrl.create({
        title: title,
        subTitle: subtitle,
        cssClass: cssClass,
        buttons: ['OK']
      });
      alert.present();
      return true;
    }

    return false;
  }



}
