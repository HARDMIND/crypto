import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Rating} from "../../model/rating";
import {WavesProvider} from "../../providers/waves/waves";
import {MessagesProvider} from "../../providers/messages/messages";

/**
 * Generated class for the RatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {

  public model : Rating;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public wavesProvider : WavesProvider,
    public messageProvider : MessagesProvider
    ) {
    this.model = new Rating();
    this.model.addData(this.wavesProvider.finalQOCData);

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
  }

  public sendRatingData() {
    console.log(this.model);

    this.model.calcResults();
    this.wavesProvider.sendRatingData(this.model, this.messageProvider);
  }
}
