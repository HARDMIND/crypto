
import { Injectable } from '@angular/core';
import {Criteria, Data, Option, QOCData} from '../../app/Data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MessagesProvider } from '../messages/messages';
import {NavController} from "ionic-angular";
import {LoginPage} from "../../pages/login/login";
declare var require: any;


/*
  Generated class for the WavesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WavesProvider {
  projectSeed : any;
  wavesApi :any;
  waves: any;
  dataList : Data[] = [];
  QOCData : Data[] = [];
  data : QOCData;
  finalData: Data = new Data("");
  isFinal:boolean = false;

  constructor(
    public httpClient: HttpClient
  ) {
    this.wavesApi =  require('@waves/waves-api');
    this.waves = this.wavesApi.create(this.wavesApi.TESTNET_CONFIG);



    if(localStorage.getItem('projectPhrase').length > 15) {
      this.projectSeed = this.createSeedFromPhrase(localStorage['projectPhrase']);
      console.log("Projekseed:");
      console.log(this.projectSeed);
      this.getData().then((success) => {
        console.log("getData");
      }, (error) => {
        console.log("Fehler");
        console.error(error);
      });
    } else {
      console.log("ProjectPhrase fehlt!");
    }
  }

  /** get all data from adress */
  public async getData(){
    this.QOCData = [];
    this.dataList = [];
    this.data = new QOCData();

    var getDataList:Observable<any> = this.httpClient.get('https://pool.testnet.wavesnodes.com/addresses/data/'+this.projectSeed.address);

    getDataList.subscribe(allData => {

      /** Check if final data is available */
      var finalData:any = allData.find(element => element.key == "5");


      if(finalData != undefined ){
        console.log(finalData);
        console.log("FinalData Received!");
        this.finalData = new Data(finalData.value);
        this.isFinal = true;

        //@TODO FinalData auslesen;
      } else {
        console.log("not final");
        this.isFinal = false;
        /** Search for all options */
        var allOptions = allData.filter(element => element.key.indexOf('option') >= 0);


        if (allOptions.length > 0) {
          console.info(allOptions);

          /** go through all options and search for criteria and criteriaweight */
          allOptions.forEach(element => {
            var stringIndex = element.key.indexOf('option');
            /** Get option counter to get criteria and criteriaweight */
            var elementOptionCounter = element.key.substring(stringIndex + 6);

            this.data.addOption(element.value);

          });
        }
      }



      var allCriteria = allData.filter(element => element.key.indexOf('criteria') >= 0);

      //console.log(allCriteria);

      if(allCriteria.length > 0) {
        /** go through all options and search for criteria and criteriaweight */
        allCriteria.forEach(element => {

          try {
            let array = JSON.parse(element.value);
            array.forEach(entry => {
              this.data.addCriteria(entry.name, entry.weight);
            })
          } catch (e) {
            console.error(e);
          }

        });
      }
    });

console.info(this.data);
  }



  /** Send data to nodes  */
  public async sendData(qdata:any,projectPhrase = localStorage['projectPhrase'],userPhrase = localStorage['userPhrase']){
    /** Import Data Transaction from API */
    const { data, signTx } = require('@waves/waves-transactions');

    // /** create process seed from phrase */
    const seedProcess =this.createSeedFromPhrase(projectPhrase) ;

    /** create sender seed from phrase */
    const seedSender = this.createSeedFromPhrase(userPhrase) ;

    /** transfer waves from useracc to project acc */
    console.log(qdata);

    var fee = 500000;

    const params = {
      data: qdata,
      senderPublicKey: seedProcess.keyPair.publicKey,
      sender: seedProcess.address,
      //timestamp: Date.now(),
      fee: fee
    };

    /** prepare QOC data transaction object*/
    const dataTx = await this.waves.tools.createTransaction("data", params);
    console.error(params);

    /** add proof to QOC data transaction  */
    dataTx.addProof(seedSender.keyPair.privateKey);
    const signedDataTx = data(params, seedProcess.phrase);
    console.log(signedDataTx);

    /** create json from  dataTx object */
    const txJSON = await dataTx.getJSON();

    /** send data  */
    return await this.waves.API.Node.transactions.rawBroadcast(txJSON);
  }

  /** Create account from phrase */
  public createSeedFromPhrase(phrase){
    return this.waves.Seed.fromExistingPhrase(phrase);
  }

  public checkBalanceFromAdress(address) : Promise<any> {
    var _this = this;
    let promise = new Promise(function(resolve, reject) {

      _this.waves.API.Node.addresses.balance(address).then((res) => {
        resolve(res);
      }, (err) => {
        reject (err);
      })
    });

    return promise;
  }

  /** create new account */
  public createSeed(){
    return this.waves.Seed.create();
  }

  /** create script */
  public async createScript(list,phrase){

    // json to string sample: JSON.stringify(txJSON)
    /** create seed from phrase */
    const seed = this.createSeedFromPhrase(phrase) ;

    /** prepare Script */
    let scriptBodyNew =
      `match tx {
      case tx:DataTransaction =>{`;

    for(let i=0; i<list.length;i++){
      scriptBodyNew+= `let l${i} = if(sigVerify(tx.bodyBytes, tx.proofs[0], base58'${list[i]}')) then 1 else 0 ;`;
    }

    scriptBodyNew += `(`;

    for(let i=0; i<list.length;i++){
      scriptBodyNew += (i == list.length-1 && i == list.length-1) ? ` l${i}`:` l${i} +` ;

    }

    scriptBodyNew += `) == 1 }case _ =>  throw("State should be a data transaction")}`;

    /** compile script */
    const compiledScript = await this.waves.API.Node.utils.script.compile(scriptBodyNew);

    /* Create script obj */
    let scriptObj ={
      script: compiledScript,
      senderPublicKey: seed.keyPair.publicKey,
      sender:seed.address,
      fee:1000000
    };

    /** prepare data transaction  object*/
    const dataTx = await this.waves.tools.createTransaction("setScript", scriptObj);

    /** add proof to transaction  */
    dataTx.addProof(seed.keyPair.privateKey);

    /** create json from  dataTx object */
    const txJSON = await dataTx.getJSON();

    /** send transaction with script  */
    return await this.waves.API.Node.transactions.rawBroadcast(txJSON);
  }

  public async sendWaves(userPhrase : string, projectAddress : string){
    const { transfer, signTx } = require('@waves/waves-transactions');

    const seed = userPhrase;

    //Transfering 1 WAVES
    const params = {
      amount: 100000000,
      recipient: projectAddress,
      //feeAssetId: undefined
      //assetId: undefined
      //attachment: undefined
      //senderPublicKey: 'by default derived from seed',
      //timestamp: Date.now(),
      //fee: 100000,
    }

    const signedTransferTx = transfer(params, userPhrase);
    //console.log(signedTransferTx);

    return await this.waves.API.Node.transactions.rawBroadcast(signedTransferTx);
  }



  /******************** Send QOC Data  *******************/
  public async sendQOC(qocDataToSend:Data[], messageProvider:MessagesProvider, isFinal:boolean = false){

    /** Check if qocList is not empty */
    if(messageProvider.alert(qocDataToSend.length == 0, "Error", "Need data"))return;

    var newList = [];
    var counterAllData = this.QOCData.length;
    var counterOption = 0;
    var counterCriteria = 0;
    var counterCriteriaWeight = 0;

    qocDataToSend.forEach(element => {

      /** Add option to list  */
      var option = {
        "key": Date.now() + "option" + (counterOption +counterAllData),
        "type":"string",
        "value":element.option
      }
      newList.push(option);

      /* Add criteria to list  */
      element.criteriaList.forEach(criteriaElement => {
        var criteria = {
          "key": Date.now() + "criteria" + (counterOption +counterAllData) + "&"+counterCriteria,
          "type":"string",
          "value":criteriaElement
        }
        newList.push(criteria);
        counterCriteria+=1;
      });

      /** Add criteriaweight to list */
      element.criteriaWeightList.forEach(criteriaWeightElement => {
        var criteriaWeight = {
          "key": Date.now() + "criteriaWeight" + (counterOption +counterAllData)+ "&"+counterCriteriaWeight,
          "type":"string",
          "value":criteriaWeightElement
        }
        newList.push(criteriaWeight);
        counterCriteriaWeight+=1;
      });

      counterOption+=1;
    });

    /* send data */
    if(this.sendData(newList)){
      /** return result */
      messageProvider.alert(true,"Output","QOC Data eingefügt \n");
    }else{
      messageProvider.alert(true,"Output","QOC Data NICHT eingefügt \n");
    }

  }


  public transaction(userSeed, projectAddress) {
    const { transfer, signTx } = require("waves-transactions")

    console.log(userSeed);

    const seed = this.waves.Seed.fromExistingPhrase(userSeed.phrase);

    const transferData = {

      // An arbitrary address; mine, in this example
      recipient: projectAddress,

      // ID of a token, or WAVES
      assetId: 'WAVES',

      // The real amount is the given number divided by 10^(precision of the token)
      amount: 10000000,

      // The same rules for these two fields
      feeAssetId: 'WAVES',
      fee: 100000,

      // 140 bytes of data (it's allowed to use Uint8Array here)
      attachment: '',

      timestamp: Date.now()

    };

    this.waves.API.Node.transactions.broadcast('transfer', transferData, seed.keyPair).then((responseData) => {
      console.log(responseData);
    });

  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public async waitForConfirmation(id : string) : Promise<any> {
    let _this = this;

    let promise = new Promise(function (resolve, reject) {
      let tx = null;

      do {
        _this.waves.API.Node.transactions.utxGet(id).then((utx) => {
          console.log(utx);
          tx = utx;
          setTimeout(function() {}, 5000);
        }, (error) => {
          console.error(error);
          tx = null;
        });
      } while (tx != null);
      console.info("Schleife beendet!");
      resolve();
    });

    return promise;

  }

  public async waitForEnoughWaves(address)  : Promise<boolean> {
    var isEnough = false;
    var timeout = 30;
    while(!isEnough &&timeout >0 ){
      await this.checkBalanceFromAdress(address).then( async result => {
        console.log(result);
        if(result.balance > 0){
          isEnough = true;
        }else{
          console.log("wait .......... timeout in: " + timeout);
          await this.delay(1000);
          timeout -= 1;
        }
      });
    }

    return isEnough;
  }

  /******************** Send QOC Data  *******************/
  public async sendOptions(qocDataToSend:Option[], messageProvider:MessagesProvider, isFinal:boolean = false){

    /** Check if qocList is not empty */
    if(messageProvider.alert(qocDataToSend.length == 0, "Error", "Need data"))return;

    console.log(qocDataToSend);

    var newList = [];
    var counterAllData = this.QOCData.length;
    var counterOption = 0;

    let type = {
      "key" : "type",
      "type" : "string",
      "value": (isFinal) ? "3" : "2"
    };

    newList.push(type);

    if(!isFinal) {
      qocDataToSend.forEach(element => {

        console.log(element.name);
        /** Add option to list  */
        var option = {
          "key": Date.now() + "option" + (counterOption + counterAllData),
          "type": "string",
          "value": element.name
        }
        newList.push(option);
        counterOption += 1;
      });

    } else {
      console.log(JSON.stringify(qocDataToSend));
      let option = {
        "key" : "_finalOption",
        "type": "string",
        "value" : JSON.stringify(qocDataToSend)
      };

      newList.push(option);
    }
    /* send data */
    if(this.sendData(newList)){
      /** return result */
      messageProvider.alert(true,"Output","QOC Data eingefügt \n");
    }else{
      messageProvider.alert(true,"Output","QOC Data NICHT eingefügt \n");
    }

  }

  /******************** Send QOC Data  *******************/
  public async sendCriteria(qocDataToSend:Criteria[], messageProvider:MessagesProvider, isFinal:boolean = false){

    /** Check if qocList is not empty */
    if(messageProvider.alert(qocDataToSend.length == 0, "Error", "Need data"))return;

    console.log(qocDataToSend);

    var newList = [];

      /* Add criteria to list  */

      var criteria = {
        "key": "type",
        "type": "string",
        "value": "3"
      };

      newList.push(criteria);

      let array = {
        "key" : Date.now()+"criteria",
        "type" : "string",
        "value" : JSON.stringify(qocDataToSend)
      };
      newList.push(array);

    /* send data */
    if(this.sendData(newList)){
      /** return result */
      messageProvider.alert(true,"Output","QOC Data eingefügt \n");
    }else{
      messageProvider.alert(true,"Output","QOC Data NICHT eingefügt \n");
    }

  }
}
