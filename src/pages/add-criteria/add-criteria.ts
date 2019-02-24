import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {WavesProvider} from "../../providers/waves/waves";
import {MessagesProvider} from "../../providers/messages/messages";
import {Criteria, QOCData} from "../../app/Data";

/**
 * Generated class for the AddCriteriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-criteria',
  templateUrl: 'add-criteria.html',
})
export class AddCriteriaPage {

  public data : QOCData;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public wavesProvider : WavesProvider,
    public messageProvider : MessagesProvider
    ) {
    this.data = new QOCData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCriteriaPage');
  }

  /** ADD CRITERIA TO QOC DATA  */
  addCriteriaBtn(){
    let alert = this.messageProvider.alertCtrl.create({
      title: 'Add criteria',
      inputs: [
        {
          name: 'name',
          placeholder: 'Criteria'
        },
        {
          name: 'weight',
          placeholder: 'Weight'
        },
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

            if(data.name.length > 0){
              this.data.criterias.push(new Criteria(data.name, data.weight))
            }
          }
        }
      ]
    });
    alert.present();
  }

  /******************* SEND QOC DATA ******************/
  async sendQOC(){
    this.wavesProvider.sendCriteria(this.data.criterias,this.messageProvider).then((success) => {
      console.log(success);

    }, (error) => {
      console.log(error);
    })
  }

}
