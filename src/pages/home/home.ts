import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QocPage} from '../qoc/qoc';
import { CreateProcessPage } from '../create-process/create-process';
import { DeleteProcessPage } from '../delete-process/delete-process';
import { EvaluatePage } from '../evaluate/evaluate';
import { MessagesProvider } from '../../providers/messages/messages';
import { WavesProvider } from '../../providers/waves/waves';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private messageProvider:MessagesProvider,
    private wavesProvider:WavesProvider) {}
  
  /******************** create new waves acc  *******************/
  createAccount(){
    const seed = this.wavesProvider.createAccount();

    /** generate account and show phrase */
    var message = '<p>Phrase: ' + seed.phrase + "</p>"+
                  "<p>Address: " + seed.address +  "</p>"+
                  '<p>PublicKey: ' + seed.keyPair.publicKey +"</p>"+
                  "<p>PrivateKey: " + seed.keyPair.privateKey;
    this.messageProvider.alert(true,"Testnet Account created",message);
  }

  /******************** open add qoc page *******************/
  openAddQoc(){
    this.navCtrl.push(QocPage);
  }
  
  /******************** open create script page  *******************/
  openCreateProcess(){
    this.navCtrl.push(CreateProcessPage);
  }

  /******************** open delete script page  *******************/
  openDeleteProcess(){
    this.navCtrl.push(DeleteProcessPage);
  }
  
  /******************** open evaluate page  *******************/
  openEvaluateQoc(){
    this.navCtrl.push(EvaluatePage);
  }
  
}
