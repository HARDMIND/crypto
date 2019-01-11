import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';
import { HomePage } from '../home/home';
import { WavesProvider } from '../../providers/waves/waves';
import { CreateProcessPage } from '../create-process/create-process';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public userPhrase : any;
  public projectPhrase : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private messagesProvider:MessagesProvider, private wavesProvider : WavesProvider) {
  }

  ionViewDidLoad() {
    if(localStorage['userPhrase'] != "" && localStorage['projectPhrase'] != ""){
      this.navCtrl.push(HomePage);
    }
  }

  login(){
    if(this.messagesProvider.alert(this.userPhrase == "" || this.projectPhrase == "","Error", "Phrase is missing"))return;
    localStorage['userPhrase'] = this.userPhrase;
    localStorage['projectPhrase'] = this.projectPhrase;
    //this.messagesProvider.alert(true, "Result",localStorage['userSeed'] + " " + localStorage['projectSeed']) ;
    this.navCtrl.push(HomePage);

  }

  createAccount(){
    const seed = this.wavesProvider.createAccount();
    localStorage['projectPhrase'] = seed.phrase;
    this.userPhrase = seed.phrase;
    var message = '<p>Phrase: ' + seed.phrase + "</p>"+
                  "<p>Address: " + seed.address +  "</p>"+
                  '<p>PublicKey: ' + seed.keyPair.publicKey +"</p>"+
                  "<p>PrivateKey: " + seed.keyPair.privateKey;

    this.messagesProvider.alert(true, "Result",message) ;
  }

  createProject(){
    this.navCtrl.push(CreateProcessPage);
  }
}
