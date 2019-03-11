import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {WavesProvider} from "../../providers/waves/waves";

/**
 * Generated class for the ResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  public list : Map<string, number>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public wavesProvider: WavesProvider) {

    this.list = new Map<string, number>();

    console.log(this.wavesProvider.results);
    this.wavesProvider.results.forEach(entry => {
      console.info(entry);

      if(!this.list.has(entry.option)) {
        this.list.set(entry.option, entry.rating);
      } else {
        let oldRating = this.list.get(entry.option);
        let newRating = oldRating + entry.rating;
        this.list.set(entry.option, newRating);
      }
    });

    console.log(this.list);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultPage');

    console.log(this.wavesProvider.results);
    //console.log(this.list);
  }

  public getKeys() {
    return Array.from(this.list.keys());
  }

}

