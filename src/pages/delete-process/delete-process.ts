import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
declare var require: any;

/**
 * Generated class for the DeleteProcessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-delete-process',
  templateUrl: 'delete-process.html',
})
export class DeleteProcessPage {
  public phrase:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeleteProcessPage');
  }
  
  async deleteScriptFromAcc(){
    this.phrase = "amazing hazard method law ribbon bless crucial author voyage filter usual stool wise guess tiger";

    const WavesAPI = require('@waves/waves-api');
    const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

    const seed = (this.phrase != null) ? Waves.Seed.fromExistingPhrase(this.phrase) : "";
    // /** create script object with sender pk */
    let setScriptObj ={
      senderPublicKey: seed.keyPair.publicKey,
      sender:seed.address,
      fee:1000000,
      script:"base64:"
    };

    // /** create script transaction */
     const setScriptTx = await Waves.tools.createTransaction("setScript", setScriptObj);
     setScriptTx.addProof("5K1V7LKrjz9sBxVLinEUpAzEHiPf5p4nPLaDuTgU6hFy");
     const txJSON = await setScriptTx.getJSON();
     const setScriptResult = await Waves.API.Node.transactions.rawBroadcast(txJSON);

    /** return result */
    const alert = this.alertCtrl.create({
      title: 'Output',
      subTitle: "Prozess gelöscht" ,
      buttons: ['Check']
    });

    alert.present();

  }
}
