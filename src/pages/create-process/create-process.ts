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

  public projectPhrase:any;
  public projectQuestion:any;
  public list = [];
  public orderForm:any;
  public textPk:any;

  items = [];

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
    if(this.messageProvider.alert(this.projectQuestion == "" || this.projectPhrase == "","Error","Project phrase or project question"))return;

    /** generate new acc */
    //var seedBank = this.wavesProvider.createSeedFromPhrase("aim ankle exclude scene jeans stone awful lawn tornado cake raise cry light finger service");
    //var seedProject = this.wavesProvider.createSeed();
    //var response = this.wavesProvider.sendWaves(seedBank,100000, seedProject.address);

   // if(response){
      console.log("is true")
      var questionJson = {
        "key":"question",
        "type":"string",
        "value":this.projectQuestion
      }
      
      /** send question to blockchain */
      await this.wavesProvider.sendData([questionJson],this.projectPhrase,this.projectPhrase);

      /** create script  */
      this.wavesProvider.createScript(this.list, this.projectPhrase);

      /** result message  */
      this.messageProvider.alert(true,'Prozess erstellt!', "Prozess erstellt",'create-process');
  //  }

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
