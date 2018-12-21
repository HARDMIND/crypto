import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as request from "request";
import { JsonPipe } from '@angular/common';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController) {
  }

  /******************** View loaded *******************/
  ionViewDidLoad() {
    console.log('ionViewDidLoad EvaluatePage');
  }

  /******************** Evaluate data  *******************/
  evaluateData(){
    this.processAddress = "3N6wVxpYNiLJFJWkX4wFKfrGiAhvBtVxdBM";
    if(this.processAddress == "" || this.processAddress == null ||this.processAddress.length < 10){
      const alert = this.alertCtrl.create({
        title: 'Need address',
        buttons: ['Check']
      });
  
      alert.present();
      return;
    }
    
    /** Need this to call methods outside a request */
    var self = this;

    request('https://pool.testnet.wavesnodes.com/addresses/data/3N6wVxpYNiLJFJWkX4wFKfrGiAhvBtVxdBM', function (error, response, body) {
      /** cheeck if error */
      if(error){
        /** error output */
        self.output(error);
      }else{
        /** 
         *  1. get all options 
         *  2. get criteria for this option
         */
        var evaluated = "";
        var parsedBody = JSON.parse(body);
        var dataOptions = [];
        var dataCriteria = [];

        for(var i=0;i<parsedBody.length;i++){
          var child = parsedBody[i];

          if(child.key.includes("option") ){
            var searchForCriteria = "criteria" + child.key.substring(6) ;
            var criteria ;
            for(var j=0;j<parsedBody.length;j++){
              if(parsedBody[j].key == searchForCriteria ){
                criteria = parsedBody[j];
              }
            }

            if(criteria != null){
              /** if found criteria then check if option is in data array */
              var dataOptionIndex = dataOptions.indexOf(child.value);

              /** if not in data array then push it else add just the criteria*/
              if(dataOptionIndex == -1){
                console.log(child.value  + " " + criteria.value);
                dataOptions.push(child.value);
                dataCriteria.push(parseInt(criteria.value));
              }else{
                console.log(dataOptions[dataOptionIndex]  + " " + criteria.value);
                dataCriteria[dataOptionIndex] += parseInt(criteria.value);
              }
            }
          }
        }

        /** go through all founded data and get the one with the highest value */
        if(dataCriteria.length > 0){
          var highestValue = 0;
          var highestValueIndex;

          /** get the highset value */
          for(var i =0;i<dataCriteria.length;i++){
            if(parseInt(dataCriteria[i]) > highestValue){
              highestValue = dataCriteria[i];
              highestValueIndex = i;
            }
          }

          /** show the result  */
          if(highestValueIndex != null){
            self.output("Bereich: " + dataOptions[highestValueIndex] + " Value: " + dataCriteria[highestValueIndex]);
          }

        }else{
          self.output("No Data given");
        }
      }
    });
  }

  /** output method to see what is going on */
  output(output){
    /** return result */
    const alert = this.alertCtrl.create({
      title: 'Result',
      subTitle: output ,
      buttons: ['Ok']
    });

    alert.present();
  }
}
