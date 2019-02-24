import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Data } from '../../app/Data';
import { MessagesProvider } from '../../providers/messages/messages';
import { WavesProvider } from '../../providers/waves/waves';
import { EvaluationProvider } from '../../providers/evaluation/evaluation';

@IonicPage()
@Component({
  selector: 'page-evaluate',
  templateUrl: 'evaluate.html',
})
export class EvaluatePage {
  
  public isDisabled = true;
  public stepOne: boolean = true;
  public stepTwo: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private messageProvider:MessagesProvider,
              private wavesProvider:WavesProvider,
              public evaluationProvider: EvaluationProvider) {}

  ionViewDidLoad(){
    this.wavesProvider.getData();
    console.log(this.wavesProvider.data);
    console.log("Option Data geladen");
    this.evaluationProvider.dataList = this.wavesProvider.data;
  }

  /******************** Evaluate data  *******************/
  /** check if 2 or more checkboxes are checked */
  checked(){
    var counter = 0;
    this.evaluationProvider.checkBoxes.forEach(element => {
      if(element){
        counter += 1;
      }
    });

    if(counter >1){
      this.isDisabled = false;
    }else{
      this.isDisabled = true;
    }
  }

  save() {
    this.wavesProvider.sendOptions(this.evaluationProvider.dataList.options, this.messageProvider, true);
  }
  /** Go to next step  */
  goToStepTwo(){
    let alert = this.messageProvider.alertCtrl.create({
      title: 'Do you really want to go to the next step?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            this.stepOne = false;
            this.stepTwo = true;
          }
        }
      ]
    });
    alert.present();
  }

  sendFinalData(){
    //this.evaluationProvider.sendFinalOptions(this.evaluationProvider.dataList,this.navCtrl,HomePage);
  }



}
