import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as request from "request";

/**
 * Generated class for the EvaluatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 /**
  * API Call: check if address is valid:
  * https://pool.testnet.wavesnodes.com/addresses/validate/3N84XFvEF1SdV2HhmHY2PzFfFDSpcRHrUwj
  * 
  * API Call: get balance(waves) by address
  * https://pool.testnet.wavesnodes.com/addresses/balance/details/3MqmYoj33w6rSfKh4QNeMxLYKCCz988kuWt
  * 
  * API Call get last 100 transactions from address:
  * https://pool.testnet.wavesnodes.com/transactions/address/3MqmYoj33w6rSfKh4QNeMxLYKCCz988kuWt/limit/100
  * 
  * API Call get data from address:
  * https://pool.testnet.wavesnodes.com/addresses/data/3MqmYoj33w6rSfKh4QNeMxLYKCCz988kuWt
  */

@IonicPage()
@Component({
  selector: 'page-evaluate',
  templateUrl: 'evaluate.html',
})
export class EvaluatePage {
  public dataTransactionId:any;
  public textDTX:any;
  public list = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController) {
  }

  /******************** View loaded *******************/
  ionViewDidLoad() {
    console.log('ionViewDidLoad EvaluatePage');
    //this.getDataByTxId();
  }

  /******************** Get transaction data by address or tx id *******************/
  async getDataByTxId(){
    const baseUrl = 'https://pool.testnet.wavesnodes.com/';
    const queryString = '/addresses/data/3N3UJo1LAeTPh5AbG3D5AHgoxbJrecfe7Xj';
    var options = {
        uri: baseUrl + queryString,
    };
    
    const result = await request.get(options);

    /** return result */
    const alert = this.alertCtrl.create({
      title: 'Restult',
      subTitle: "Result " + result[0],
      buttons: ['Ok']
    });

    alert.present();
  }

  /******************** add public key to list  *******************/
  addDataTransactionID(){
    /** Check if public key is not empty or is longer then 15 digits */
    if(this.dataTransactionId == ""){
      /** return result */
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "No Data Transaction ID set",
        buttons: ['OK']
      });

      alert.present();
      return;
    }

    this.list.push(this.dataTransactionId);
    var text = "";

    for (let i=0; i<this.list.length; i++) {
      text+= this.list[i] + "\n";
    }

    this.textDTX = text;

    this.dataTransactionId = "";
  }

  /******************** Evaluate data  *******************/
  evaluateData(){
    
  }
}
