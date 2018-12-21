import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QocPage} from '../qoc/qoc';
import { AlertController } from 'ionic-angular';
import { CreateProcessPage } from '../create-process/create-process';
import { DeleteProcessPage } from '../delete-process/delete-process';
import { EvaluatePage } from '../evaluate/evaluate';
import * as request from "request";
declare var require: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,public alertCtrl: AlertController) {

  }
  
  /******************** create new waves acc  *******************/
  createAccount(){
    const WavesAPI = require('@waves/waves-api');
    const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
    const seed = Waves.Seed.create();

    /** generate account and show phrase */
    const alert = this.alertCtrl.create({
      title: 'Testnet Acount created!',
      subTitle: '<p>Phrase: ' + seed.phrase + "</p>"+
                "<p>Address: " + seed.address +  "</p>"+
                '<p>PublicKey: ' + seed.keyPair.publicKey +"</p>"+
                "<p>PrivateKey: " + seed.keyPair.privateKey,
      buttons: ['Check']
    });

    alert.present();
  }

  /******************** open add qoc page *******************/
  openAddQoc(){
    this.navCtrl.push(QocPage);
  }
  
  /******************** open create script page  *******************/
  openCreateProcess(){
    this.navCtrl.push(CreateProcessPage);
  }

  /******************** open delete script page  *******************/
  openDeleteProcess(){
    this.navCtrl.push(DeleteProcessPage);
  }
  
  /******************** open evaluate page  *******************/
  openEvaluateQoc(){
    this.navCtrl.push(EvaluatePage);
  }
  
}
