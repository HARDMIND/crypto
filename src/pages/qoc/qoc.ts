import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { JsonPipe } from '@angular/common';
declare var require: any;

/**
 * Generated class for the QocPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qoc',
  templateUrl: 'qoc.html',
})
export class QocPage {
  public phrase:any;
  public qocList = [];
  public textQOC:any;
  public pNumber:any;
  public inputQuestion:any;
  public inputOption:any;
  public inputCriteria:any;
  public processString : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController) {
  }

  /******************** View loaded *******************/
  ionViewDidLoad() {}

  /******************** Add QOC input to list *******************/
  addQOC(){
    if(this.inputQuestion == "" || this.inputOption == "" || this.inputCriteria == ""){
      /** return result */
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "Question, Option or Criteria is empty",
        buttons: ['OK']
      });

      alert.present();
      return;
    }

    let counter = (this.qocList.length >= 3) ? this.qocList.length / 3 : 0;

    /** QOC format : question + QuestionCounter + ProcessNumber
     *  QuestionCounter = 3 digits after question/option/criteria
     *  ProcessNumber = several digits after QuestionCounter
     *  example : 
     *  question 001 5 => question0015
     *  option 001 5 => option0015
     */
    let counterChange = counter.toString();

    if(counter.toString().length == 2){
      counterChange = "0"+counter.toString();
    }

    if(counter.toString().length == 1){
      counterChange = "00"+counter.toString();
    }

    /** get content from input  */
    let qInput = {
      "key":"question" + counterChange+this.pNumber,
      "type":"string",
      "value":this.inputQuestion
    }
    let oInput = {
      "key":"option" + counterChange+this.pNumber,
      "type":"string",
      "value":this.inputOption
    }
    let cInput = {
      "key":"criteria" + counterChange+this.pNumber,
      "type":"string",
      "value":this.inputCriteria
    }

    /** push QOC to list */
    this.qocList.push(qInput);
    this.qocList.push(oInput);
    this.qocList.push(cInput);
    var text = "";

    /** show the user his input */
    for (let i=0; i<this.qocList.length; i++) {
      text+= this.qocList[i].value + "\n";
    }

    /** set out html text */
    this.textQOC = text;

    /** reset input */
    this.inputQuestion = "";
    this.inputOption = "";
    this.inputCriteria = "";
  }

  /******************** Send QOC Data  *******************/
  async sendQOC(){
    /** validation  */
    if(this.phrase == null || this.phrase.length < 15){
      /** return result */
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "Need phrase or phrase to short (min length 15)",
        buttons: ['OK']
      });

      alert.present();
      return;
    }

    if(this.processString == "" || this.processString == null){
      /** return result */
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "Need json String",
        buttons: ['OK']
      });

      alert.present();
      return;
    }

    /** Check if qocList is not empty */
    if(this.qocList.length == 0 ){
      /** return result */
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "Need data",
        buttons: ['OK']
      });

      alert.present();
      return;
    }

    // /** import waves api */
    const WavesAPI = require('@waves/waves-api');
    const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

    // /** create seed from phrase */
    const seed = (this.phrase != null) ? Waves.Seed.fromExistingPhrase(this.phrase) : "";

    /** create qoc data object */
    let dataObj ={
      data: this.qocList,
      senderPublicKey: seed.keyPair.publicKey,
      sender:seed.address,
      fee:1000000
    };

    /** prepare QOC data transaction object*/
    const dataTx = await Waves.tools.createTransaction("data", dataObj);
    
    /** add proof to QOC data transaction  */
    dataTx.addProof(seed.keyPair.privateKey);

    /** create json from  dataTx object */
    const txJSON = await dataTx.getJSON();

    /** send data  */
    const setScriptResult = await Waves.API.Node.transactions.rawBroadcast(txJSON);

    /** created jsonObj from processString */
    let processObj = JSON.parse(this.processString);

    /** add qoc data to array */
    //processObj.data = processObj.data.concat(this.qocList);

    /** add proof to jsonObj */
    const dataTxJson = await Waves.tools.createTransaction("data", processObj);
   

    dataTxJson.addProof(seed.keyPair.privateKey);
    const transferTxJSON = await dataTxJson.getJSON();

    /** return result */
    const alert = this.alertCtrl.create({
      title: 'Output',
      subTitle: "QOC Data eingefügt \n" + "<p>" +JSON.stringify(transferTxJSON) + "</p>",
      buttons: ['Check']
    });

    alert.present();
  }

}
