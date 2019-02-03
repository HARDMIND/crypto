import { Injectable } from '@angular/core';
import { WavesProvider } from '../waves/waves';
import { Data } from '../../app/Data';
import { AlertController, NavController } from 'ionic-angular';

/*
  Generated class for the EvaluationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EvaluationProvider {
  public dataList : Data[] = [];
  public checkBoxes: boolean[] = [];

  constructor(  private alertCtrl:AlertController, private wavesProvider:WavesProvider) {
  }

  /** reinit all checkboxes  */
  initCheckBox(){
    this.checkBoxes = [];
    for(var i = 0;i<this.dataList.length+1; i++){
      this.checkBoxes.push(false);
    }
  }

  /** merge selected entries to one entry  */
  public mergeEntries(){
    let alert = this.alertCtrl.create({
      title: 'New data name',
      inputs: [
        {
          name: 'name',
          placeholder: 'name'
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
          text: 'Save',
          handler: data => {
            var newMergeData : Data = new Data(data.name);
            var newDataList : Data[] = [];

            for(var i=0;i<this.checkBoxes.length;i++){
              if(this.checkBoxes[i]){
                this.dataList[i].criteriaList.forEach(element => {
                  newMergeData.criteriaList.push(element);
                });
                this.dataList[i].criteriaWeightList.forEach(element => {
                  newMergeData.criteriaWeightList.push(element);
                });
                console.log(this.dataList[i]);
              }else{
                newDataList.push(this.dataList[i]);
              }
            }
            console.log(newMergeData);
            newDataList.push(newMergeData);

            this.dataList = newDataList;
            this.initCheckBox();
          }
        }
      ]
    });
    alert.present();
  }

  public sendFinalOptions(qocData:Data[],navCtrl: NavController,page){
    /** calculate all  */
    var highestScore = 0;
    var highestScoreData : Data ;
    qocData.forEach(element=>{
      var localScore = 0;
      for(var i=0;i<element.criteriaList.length;i++){
        localScore += element.criteriaWeightList[i] * element.edgeWeightList[i];
      }

      if(localScore > highestScore){
        highestScore = localScore;
        highestScoreData = element;
      }
    });

    let alertEvaluation = this.alertCtrl.create({
      title: 'Data with highest value: '+highestScoreData.option + " value: " + highestScore,
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            //navCtrl.push(page);
            
          }
        }
      ]
    });

    let alert = this.alertCtrl.create({
      title: 'Do you really want to evaluate your data?',
      buttons: [
        {
          text: 'No',
          handler: data => {
          }
        },
        {
          text: 'Yes',
          handler: data => {
            if(highestScoreData != undefined){
              var finalOption = {
                "key": Date.now() + "final",
                "type":"string",
                "value":highestScoreData.option
              }
              this.wavesProvider.sendData([finalOption])
            }
            alertEvaluation.present();
          }
        }
      ]
    });
    alert.present();
  }

  /** create final data from all options and calculated weights */
  public finalEvaluation(){
    var maxValue = 0;
    var maxValueData : Data;

    /** get the data with max weight value  */
    for(var i=0;i<this.dataList.length;i++){
      // if(this.dataList[i].weightCalculated > maxValue){
      //   //maxValue = this.dataList[i].weightCalculated;
      //   maxValueData = this.dataList[i];
      // }
    }

    /** send the option with maxvalue to blockchain*/
    if(maxValueData != null){
      var data = [{
        "key": "_finalOption",
        "type":"string",
        "value":maxValueData.option +"&"//+maxValueData.weightCalculated
      }]
      
      /** send data to blockchain */
      this.wavesProvider.sendData(data);
      console.log(data); 

      /** refresh list  */
      this.dataList= [];
      
      this.dataList.push(maxValueData);
      this.wavesProvider.dataList = this.dataList;
      return maxValueData;
    }

    return null;
  }
}
