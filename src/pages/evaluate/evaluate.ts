import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, List } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Data } from '../../app/Data';
import { e } from '@angular/core/src/render3';
import { MessagesProvider } from '../../providers/messages/messages';
import { WavesProvider } from '../../providers/waves/waves';

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
  public processAddress:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private messageProvider:MessagesProvider,
              private wavesProvider:WavesProvider) {}

  /******************** Evaluate data  *******************/
  async evaluateData(){
    this.processAddress = "3MsVG9YaqKCFuAGBsMRw6swtEn6ebQX7rYL";
    //this.processAddress = "3N6wVxpYNiLJFJWkX4wFKfrGiAhvBtVxdBM";
    if(this.messageProvider.alert(this.processAddress == "" || this.processAddress == null ||this.processAddress.length < 10, 
                                  "Need address",""))return;

    await this.wavesProvider.getData(this.processAddress);
  } 


}
