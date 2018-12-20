import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
declare var require: any;

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

  public pk:any;
  public phrase:any;
  public list = [];
  public orderForm:any;
  public textPk:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController) {
  }

  /******************** View loaded *******************/
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateProcessPage');
  }

  /******************** Add script to waves acc  *******************/
  async addScriptToAcc(){
    if(this.list == [] || this.list.length == 0){
      /** return result */
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "No public key",
        buttons: ['OK']
      });

      alert.present();
      return;
    }

    if(this.phrase == null || this.phrase.length < 15){
      /** return result */
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "Need phrase or phrase to short (min length 15)",
        buttons: ['OK']
      });

      alert.present();
      return;
    }

    const WavesAPI = require('@waves/waves-api');
    const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

    /** create seed from phrase */
    const seed = (this.phrase != null) ? Waves.Seed.fromExistingPhrase(this.phrase) : "";

    /** prepare Script */
    let scriptBodyNew = 
    `match tx {
      case tx:DataTransaction =>{`;

    for(let i=0; i<this.list.length;i++){
        scriptBodyNew+= `let l${i} = if(sigVerify(tx.bodyBytes, tx.proofs[${i}], base58'${this.list[i]}')) then 1 else 0 ;`;
    }

    scriptBodyNew += `(`;

    for(let i=0; i<this.list.length;i++){
        scriptBodyNew += (i == this.list.length-1 && i == this.list.length-1) ? ` l${i}`:` l${i} +` ;
      
    }

    scriptBodyNew += `) == ` + this.list.length + `}case _ =>  throw("State should be a data transaction")}`;

    /** compile script */
    const compiledScript = await Waves.API.Node.utils.script.compile(scriptBodyNew);

    /* Create script obj */
    let scriptObj ={
      script: compiledScript,
      senderPublicKey: seed.keyPair.publicKey,
      sender:seed.address,
      fee:1000000
    };

    /** prepare data transaction  object*/
    const dataTx = await Waves.tools.createTransaction("setScript", scriptObj);

    /** add proof to transaction  */
    dataTx.addProof(seed.keyPair.privateKey);

    /** create json from  dataTx object */
    const txJSON = await dataTx.getJSON();

    /** send transaction with script  */
    const setScriptResult = await Waves.API.Node.transactions.rawBroadcast(txJSON);

    /** Create json data obj to send to other members: prepare jsonObj */
    let dataObj ={
      data: [],
      senderPublicKey: seed.keyPair.publicKey,
      sender:seed.address,
      fee:1000000
    };

    /** Create json data obj to send to other members: create DataTransaction and convert it to JSON obj */
    const dataTxJson = await Waves.tools.createTransaction("data", dataObj);
    dataTxJson.addProof(seed.keyPair.privateKey);
    const transferTxJSONForOtherMembers = await dataTxJson.getJSON();

    /** return result with data transaction JSON as String for other members*/
    const alert = this.alertCtrl.create({
      title: 'Prozess erstellt!',
      cssClass: 'create-process',
      subTitle: "Sende an weitere Mitglieder " + "<p>" + JSON.stringify(transferTxJSONForOtherMembers) + "</p>",
      buttons: ['Ok']
    });

    alert.present();
  }

  /******************** add public key to list  *******************/
  addPublicKey(){
    /** Check if public key is not empty or is longer then 15 digits */
    if(this.pk == ""){
      /** return result */
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "No public key set",
        buttons: ['OK']
      });

      alert.present();
      return;
    }

    this.list.push(this.pk);
    var text = "";

    for (let i=0; i<this.list.length; i++) {
      text+= this.list[i] + "\n";
    }

    this.textPk = text;

    this.pk = "";
  }
}
