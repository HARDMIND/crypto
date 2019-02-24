import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {QOCData} from "../../app/Data";
import {AlertController} from "ionic-angular";
import {WavesProvider} from "../waves/waves";

/*
  Generated class for the MergeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MergeProvider {

  public optioncheckBoxes: boolean[] = [];
  public criteriaCheckboxes : boolean[] = [];


  constructor(
    private alertCtrl:AlertController,
    private wavesProvider:WavesProvider) {

  }

  /** reinit all checkboxes  */
  initCheckBox(){

    this.optioncheckBoxes = [];
    for(var i = 0;i<this.wavesProvider.data.options.length+1; i++){
      this.optioncheckBoxes.push(false);
    }

    this.criteriaCheckboxes = [];
    for(var i = 0;i<this.wavesProvider.data.criterias.length+1; i++){
      this.criteriaCheckboxes.push(false);
    }
  }

  /** merge selected entries to one entry  */
  public mergeCriteriaEntries(){
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

            for(let i=this.criteriaCheckboxes.length-1;i>=0;i--) {
              if(this.criteriaCheckboxes[i]) {
                console.log("Checkbox checked: " + i);
                this.wavesProvider.data.removeOption(i);
              }
            }

            this.wavesProvider.data.addOption(data.name);
            console.log(this.wavesProvider.data);
            //this.dataList = newDataList;
            this.initCheckBox();
          }
        }
      ]
    });
    alert.present();
  }
}
