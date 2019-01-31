import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';
import { WavesProvider } from '../../providers/waves/waves';
import { Data } from '../../app/Data';
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
  public inputCriteria:any;
  public inputCriteriaWeight:any;
  public qocData : Data[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private messageProvider:MessagesProvider,
    private wavesProvider:WavesProvider) {}
  
  ionViewDidLoad(){
    this.qocData.push(new Data("test","",0,0,['asd','asd','asd','asd','asd','asd']));
    this.qocData.push(new Data("test","",0,0,['asd','asd']));
    
    /** Count data from address */
    if(localStorage['projectPhrase'] != null && localStorage['projectPhrase'] != ""){
      var projectPhrase = this.wavesProvider.createSeedFromPhrase(localStorage['projectPhrase']);
      this.wavesProvider.getData(projectPhrase.address, true);
    }
  }

  /******************** Add QOC input to list *******************/
  addQOC(){
    /* Call error if input is wrong  */
    if(this.messageProvider.alert( this.inputOption == "" || this.inputCriteria == ""  || this.inputCriteriaWeight == "",
                                  "Error", "Question, Option or Criteria is empty")) return;

    /** Error if phrase is null */
    if(this.messageProvider.alert(localStorage['projectPhrase'] == "", "Error","Phrase cant be null"))return;
    
    var counter =  this.wavesProvider.count + (this.qocList.length/3);

    /** get content from input  */
    var oInput = {
      "key": Date.now() + "option" + counter,
      "type":"string",
      "value":this.inputOption
    }
    var cInput = {
      "key": Date.now() + "criteria" + counter,
      "type":"string",
      "value":this.inputCriteria
    }

    var cwInput = {
      "key": Date.now() + "criteriaWeight" + counter,
      "type":"string",
      "value":this.inputCriteriaWeight
    }

    /** push QOC to list */
    this.qocList.push(oInput);
    this.qocList.push(cInput);
    this.qocList.push(cwInput);
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
