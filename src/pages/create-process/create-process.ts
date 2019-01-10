import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';
import { WavesProvider } from '../../providers/waves/waves';

/**
 * Generated class for the CreateProcessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-process',
  templateUrl: 'create-process.html',
})
export class CreateProcessPage {

  public phrase:any;
  public list = [];
  public orderForm:any;
  public textPk:any;

  items = [
    {
      title: 'Key 1',
    },
    {
      title: 'Key 2',
    },
    {
      title: 'PK 3',
    },
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private messageProvider:MessagesProvider,
    private wavesProvider:WavesProvider,
    private alertCtrl : AlertController) {
  }

  /******************** Add script to waves acc  *******************/
  async addScriptToAcc(){
    if(this.messageProvider.alert(this.list == [] || this.list.length == 0,"Error","No public key"))return;
    if(this.messageProvider.alert(this.phrase == null || this.phrase.length < 15,"Error","Need phrase or phrase to short (min length 15)"))return;

    /** create script  */
    this.wavesProvider.createScript(this.list, this.phrase);

    /** result message  */
    this.messageProvider.alert(true,'Prozess erstellt!', "Prozess erstellt",'create-process');
  }

  addPublicKeyAlert() {
    const prompt = this.alertCtrl.create({
      title: 'Add Participant',
      message: "Please enter a valid publickey of a participant.",
      inputs: [
        {
          name: 'publickey',
          placeholder: 'Publickey'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            console.log('Saved clicked');
            console.log(data);
            this.addPublicKey(data.publickey);
          }
        }
      ]
    });
    prompt.present();
  }

  /******************** add public key to list  *******************/
  addPublicKey(pk : string) {
    /** Check if public key is not empty or is longer then 15 digits */
    if(this.messageProvider.alert(pk == "" || pk.length < 15, 'Error', "No public key set"))return;

    this.list.push(pk);
    var text = "";

    for (let i=0; i<this.list.length; i++) {
      text+= this.list[i] + "\n";
    }

    this.textPk = text;
    this.items.push({ title: pk });
  }

  deletePublicKey(i) {
    this.items.splice(i,1);
  }

}
