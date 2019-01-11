import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  mergedData:Data[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private messageProvider:MessagesProvider,
              private wavesProvider:WavesProvider,
              public evaluationProvider: EvaluationProvider) {}

  ionViewDidLoad(){
    this.evaluationProvider.dataList = this.wavesProvider.dataList;
  }

  /******************** Evaluate data  *******************/

  /** evaluate QOC data from all users  */
  async evaluateData(){
    if(this.messageProvider.alert(localStorage['projectPhrase'] == "" || localStorage['projectPhrase']  == null ||localStorage['projectPhrase'].length < 10, 
    "Need address",""))return;
    const seed = this.wavesProvider.createSeedFromPhrase(localStorage['projectPhrase']);

    await this.wavesProvider.getData(seed.address).then(() => this.evaluationProvider.dataList = this.wavesProvider.calculatedData);
    this.evaluationProvider.initCheckBox();
  } 

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

  /** call final evaluation and reinit entries */
  finalEvaluation(){
    var data = this.evaluationProvider.finalEvaluation();
    this.messageProvider.alert(true,"Rsult","Option: " + data.option + " value: " + data.weightCalculated);
  }

}
