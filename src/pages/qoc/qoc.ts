import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';
import { WavesProvider } from '../../providers/waves/waves';
import {Data, QOCData} from '../../app/Data';
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
  public data : QOCData;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private messageProvider:MessagesProvider,
    private wavesProvider:WavesProvider) {

    this.data = new QOCData();

  }
  
  ionViewDidLoad(){
    // this.qocData.push(new Data("test","",0,0,['asd','asd','asd','asd','asd','asd']));
    // this.qocData.push(new Data("test","",0,0,['asd','asd']));


    /** Count data from address */
    this.wavesProvider.getData();

    /**
     * @TODO: Wenn noch Zeit über ist können wir die bisherigen DOptionen aus der Blockchain ziehen und bereits anzeigen lassen
     */
  }

  /** CREATE NEW QOC DATA WITH OPTION NAME */
  addOptionBtn() {
    let alert = this.messageProvider.alertCtrl.create({
      title: 'Add option',
      inputs: [
        {
          name: 'option',
          placeholder: 'Option'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            this.qocData.push(new Data(data.option));
            this.data.addOption(data.option);
          }
        }
      ]
    });
    alert.present();
  }

  /** ADD CRITERIA TO QOC DATA  */
  addCriteriaBtn(qocData:Data){
    let alert = this.messageProvider.alertCtrl.create({
      title: 'Add criteria',
      inputs: [
        {
          name: 'criteria',
          placeholder: 'Criteria'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            if(data.criteria.length > 0){
              qocData.addCriteria(data.criteria);
            }
          }
        }
      ]
    });
    alert.present();
  }

  /******************** Add QOC input to list *******************/
  // addQOC(){
  //   /* Call error if input is wrong  */
  //   if(this.messageProvider.alert( this.inputOption == "" || this.inputCriteria == ""  || this.inputCriteriaWeight == "",
  //                                 "Error", "Question, Option or Criteria is empty")) return;

  //   /** Error if phrase is null */
  //   if(this.messageProvider.alert(localStorage['projectPhrase'] == "", "Error","Phrase cant be null"))return;
    
  //   var counter =  this.wavesProvider.count + (this.qocList.length/3);

  //   /** get content from input  */
  //   var oInput = {
  //     "key": Date.now() + "option" + counter,
  //     "type":"string",
  //     "value":this.inputOption
  //   }
  //   var cInput = {
  //     "key": Date.now() + "criteria" + counter,
  //     "type":"string",
  //     "value":this.inputCriteria
  //   }

  //   var cwInput = {
  //     "key": Date.now() + "criteriaWeight" + counter,
  //     "type":"string",
  //     "value":this.inputCriteriaWeight
  //   }

  //   /** push QOC to list */
  //   this.qocList.push(oInput);
  //   this.qocList.push(cInput);
  //   this.qocList.push(cwInput);
  //   var text = "";

  //   /** show users input */
  //   for (let i=0; i<this.qocList.length; i++) {
  //     text+= this.qocList[i].value + "\n";
  //   }

  //   /** set out html text */
  //   this.textQOC = text;

  //   /** reset input */
  //   this.inputOption = "";
  //   this.inputCriteria = "";
  //   this.inputCriteriaWeight = "";
  // }

 /******************* SEND QOC DATA ******************/
  async sendQOC(){
    this.wavesProvider.sendOptions(this.data.options,this.messageProvider).then((success) => {
      console.log(success);

    }, (error) => {
      console.log(error);
    })
  }

}
