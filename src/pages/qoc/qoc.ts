import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';
import { WavesProvider } from '../../providers/waves/waves';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private messageProvider:MessagesProvider,
    private wavesProvider:WavesProvider) {}

  /******************** Add QOC input to list *******************/
  addQOC(){
    /* Call error if input is wrong  */
    if(this.messageProvider.alert(this.inputQuestion == "" || this.inputOption == "" || this.inputCriteria == "",
                                  "Error", "Question, Option or Criteria is empty")) return;

    /** Error if phrase is null */
    if(this.messageProvider.alert(this.processPhrase == "", "Error","Phrase cant be null"))return;

    let counter = (this.qocList.length >= 3) ? this.qocList.length / 3 : 0;

    /** QOC format : question + QuestionCounter 
     *  QuestionCounter = 3 digits after question/option/criteria
     *  example : 
     *  question 001  => question001
     *  option 001  => option001
     */

    var sha256 = require("sha256");
    var senderSeedSha256 = sha256(this.wavesProvider.createAccountFromSeed(this.senderPhrase).keyPair.publicKey);

    let counterChange = counter.toString();

    if(counter.toString().length == 2){
      counterChange = "0"+counter.toString();
    }

    if(counter.toString().length == 1){
      counterChange = "00"+counter.toString();
    }

    /** get content from input  */
    var qInput = {
      "key":"question&" +counterChange + "&" + senderSeedSha256,
      "type":"string",
      "value":this.inputQuestion
    }
    var oInput = {
      "key":"option&" + counterChange   + "&"  + senderSeedSha256,
      "type":"string",
      "value":this.inputOption
    }
    var cInput = {
      "key":"criteria&" + counterChange  + "&" + senderSeedSha256,
      "type":"string",
      "value":this.inputCriteria
    }

    /** push QOC to list */
    this.qocList.push(qInput);
    this.qocList.push(oInput);
    this.qocList.push(cInput);
    var text = "";

    /** show users input */
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
    if(this.messageProvider.alert(this.senderPhrase == null || this.senderPhrase.length < 15 || this.processPhrase == null || this.processPhrase.length < 15,
          "Error","Need processPhrase / senderPhrase  or phrase is to short (min length 15)")) return;

    /** Check if qocList is not empty */
    if(this.messageProvider.alert(this.qocList.length == 0, "Error", "Need data"))return;

    /* send data */
    if(this.wavesProvider.sendData(this.qocList,this.senderPhrase, this.processPhrase)){
      /** return result */
      this.messageProvider.alert(true,"Output","QOC Data eingefügt \n");
    }else{
      this.messageProvider.alert(true,"Output","QOC Data NICHT eingefügt \n");
    }


  }

}
