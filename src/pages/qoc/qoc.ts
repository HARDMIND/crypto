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
  public senderPhrase:any;
  public processPhrase:any;
  public qocList = [];
  public textQOC:any;
  public inputQuestion:any;
  public inputOption:any;
  public inputCriteria:any;

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
    const WavesAPI = require('@waves/waves-api');
    const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

    // /** create process seed from phrase */
    const senderPhrase =Waves.Seed.fromExistingPhrase(this.senderPhrase) ;

    let counter = (this.qocList.length >= 3) ? this.qocList.length / 3 : 0;

    /** QOC format : question + QuestionCounter 
     *  QuestionCounter = 3 digits after question/option/criteria
     *  example : 
     *  question 001  => question001
     *  option 001  => option001
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
      "key":"question" + counterChange + senderPhrase.keyPair.publicKey,
      "type":"string",
      "value":this.inputQuestion
    }
    let oInput = {
      "key":"option" + counterChange + senderPhrase.keyPair.publicKey,
      "type":"string",
      "value":this.inputOption
    }
    let cInput = {
      "key":"criteria" + counterChange + senderPhrase.keyPair.publicKey,
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
    if(this.senderPhrase == null || this.senderPhrase.length < 15 || this.processPhrase == null || this.processPhrase.length < 15){
      /** return result */
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "Need processPhrase / senderPhrase  or phrase is to short (min length 15)",
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

    // /** create process seed from phrase */
    const seedProcess =Waves.Seed.fromExistingPhrase(this.processPhrase) ;
   
   
    /** create sender seed from phrase */
    const seedSender = Waves.Seed.fromExistingPhrase(this.senderPhrase) ;

    /** create qoc data object */
    let dataObj ={
      data: this.qocList,
      senderPublicKey: seedProcess.keyPair.publicKey,
      sender: seedProcess.address,
      fee:1000000
    };

    /** prepare QOC data transaction object*/
    const dataTx = await Waves.tools.createTransaction("data", dataObj);
    
    /** add proof to QOC data transaction  */
    dataTx.addProof(seedSender.keyPair.privateKey);

    /** create json from  dataTx object */
    const txJSON = await dataTx.getJSON();

    /** send data  */
    const transactionresult = await Waves.API.Node.transactions.rawBroadcast(txJSON);

    /** return result */
    const alert = this.alertCtrl.create({
      title: 'Output',
      subTitle: "QOC Data eingefügt \n" ,
      buttons: ['Check']
    });

    alert.present();
  }

}
