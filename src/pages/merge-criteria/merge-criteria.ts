import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MessagesProvider} from "../../providers/messages/messages";
import {WavesProvider} from "../../providers/waves/waves";
import {EvaluationProvider} from "../../providers/evaluation/evaluation";
import {MergeProvider} from "../../providers/merge/merge";

/**
 * Generated class for the MergeCriteriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-merge-criteria',
  templateUrl: 'merge-criteria.html',
})
export class MergeCriteriaPage {

  public isDisabled = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private messageProvider:MessagesProvider,
              private wavesProvider:WavesProvider,
              public mergeProvider: MergeProvider) {}

  ionViewDidLoad() {
    this.wavesProvider.getData().then((success) => {
      console.log(this.wavesProvider.data);
    });


  }

  /******************** Evaluate data  *******************/
  /** check if 2 or more checkboxes are checked */
  checked(){
    var counter = 0;
    this.mergeProvider.criteriaCheckboxes.forEach(element => {
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

  removeItem(id : number) {
    this.wavesProvider.data.removeCriteria(id);
  }

  save() {
    //@TODO
    this.wavesProvider.sendCriteria(this.wavesProvider.data.criterias, this.messageProvider, true);
  }


}
