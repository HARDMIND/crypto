import { Injectable } from '@angular/core';
import { WavesProvider } from '../waves/waves';
import { Data } from '../../app/Data';
import { AlertController } from 'ionic-angular';

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
    for(var i = 0;i<this.dataList.length; i++){
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
            var newMergeData : Data = new Data(data.name,"",0,0,[]);
            var newDataList : Data[] = [];
            for(var i=0;i<this.checkBoxes.length;i++){
              if(this.checkBoxes[i]){
                newMergeData.weightCalculated += this.dataList[i].weightCalculated;
              }else{
                newDataList.push(this.dataList[i]);
              }
            }
            newDataList.push(newMergeData);
            this.dataList = newDataList;
            this.initCheckBox();
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
      if(this.dataList[i].weightCalculated > maxValue){
        maxValue = this.dataList[i].weightCalculated;
        maxValueData = this.dataList[i];
      }
    }

    /** send the option with maxvalue to blockchain*/
    if(maxValueData != null){
      var data = [{
        "key": "_finalOption",
        "type":"string",
        "value":maxValueData.option +"&"+maxValueData.weightCalculated
      }]
      
      /** send data to blockchain */
      this.wavesProvider.sendData(data, localStorage['userPhrase'], localStorage['projectPhrase']);
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
