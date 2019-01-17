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
  public qocList = [];
  public textQOC:any;
  public inputOption:any;
  public inputEdgeWeight:any;
  public inputCriteria:any;
  public inputCriteriaWeight:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private messageProvider:MessagesProvider,
    private wavesProvider:WavesProvider) {}

  /******************** Add QOC input to list *******************/
  addQOC(){
    /* Call error if input is wrong  */
    if(this.messageProvider.alert( this.inputOption == "" || this.inputCriteria == "" || this.inputEdgeWeight == "" || this.inputCriteriaWeight == "",
                                  "Error", "Question, Option or Criteria is empty")) return;

    /** Error if phrase is null */
    if(this.messageProvider.alert(localStorage['projectPhrase'] == "", "Error","Phrase cant be null"))return;

    let counter = (this.qocList.length > 0) ? this.qocList.length  : 0;

    var senderPK = this.wavesProvider.createSeedFromPhrase(localStorage['userPhrase']).keyPair.publicKey;

    /** prepare counter  */
    let counterChange = counter.toString();

    if(counter.toString().length == 2){
      counterChange = "0"+counter.toString();
    }

    if(counter.toString().length == 1){
      counterChange = "00"+counter.toString();
    }

    /** get content from input  */
    var value = this.inputOption + "&" + this.inputCriteria + "&"+this.inputEdgeWeight + "&"+this.inputCriteriaWeight;
    var oInput = {
      "key": counterChange   + "&"  + senderPK,
      "type":"string",
      "value":value
    }

    /** push QOC to list */
    this.qocList.push(oInput);
    var text = "";

    /** show users input */
    for (let i=0; i<this.qocList.length; i++) {
      text+= this.qocList[i].value + "\n";
    }

    /** set out html text */
    this.textQOC = text;

    /** reset input */
    this.inputOption = "";
    this.inputCriteria = "";
    this.inputCriteriaWeight = "";
    this.inputEdgeWeight = "";
  }

  /******************** Send QOC Data  *******************/
  async sendQOC(){

    /** validation  */
    if(this.messageProvider.alert(localStorage['projectPhrase'] == null ||localStorage['projectPhrase'].length < 15 || localStorage['userPhrase'] == null || localStorage['userPhrase'].length < 15,
          "Error","Need processPhrase / senderPhrase  or phrase is to short (min length 15)")) return;

    /** Check if qocList is not empty */
    if(this.messageProvider.alert(this.qocList.length == 0, "Error", "Need data"))return;

    /* send data */
    if(this.wavesProvider.sendData(this.qocList,localStorage['userPhrase'],localStorage['projectPhrase'])){
      /** return result */
      this.messageProvider.alert(true,"Output","QOC Data eingefügt \n");
    }else{
      this.messageProvider.alert(true,"Output","QOC Data NICHT eingefügt \n");
    }


  }

}
