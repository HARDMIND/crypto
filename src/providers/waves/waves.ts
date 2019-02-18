
import { Injectable } from '@angular/core';
import { Data } from '../../app/Data';
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
  finalData: Data = new Data("");
  isFinal:boolean = false;

  constructor(
    public httpClient: HttpClient
  ) {
    this.wavesApi =  require('@waves/waves-api');
    this.waves = this.wavesApi.create(this.wavesApi.TESTNET_CONFIG);

    if(localStorage['projectPhrase'] != null) {
      this.projectSeed = this.createSeedFromPhrase(localStorage['projectPhrase']);
    } else {
      console.log("ProjectPhrase fehlt!");
    }
  }

  /** get all data from adress */
  public async getData(){
    this.QOCData = [];
    this.dataList = [];
    var getDataList:Observable<any> = this.httpClient.get('https://pool.testnet.wavesnodes.com/addresses/data/'+this.projectSeed.address);

    getDataList.subscribe(allData => {

      /** Check if final data is available */
      var finalData:any = allData.find(element => element.key.indexOf('final') >= 0);


      if(finalData != undefined ){
        console.log(finalData);
        this.finalData = new Data(finalData.value);
        this.isFinal = true;
      }else{
        console.log("after");
        /** Search for all options */
        var allOptions = allData.filter(element => element.key.indexOf('option') >= 0);

        /** go through all options and search for criteria and criteriaweight */
        allOptions.forEach(element => {
          var stringIndex = element.key.indexOf('option');
          /** Get option counter to get criteria and criteriaweight */
          var elementOptionCounter = element.key.substring(stringIndex+6);

          var qocData : Data = new Data(element.value);

          /** Find all criteria */
          var criterialist = allData.filter(data => data.key.indexOf('criteria'+elementOptionCounter) >= 0);
          criterialist.forEach(element => {
            qocData.criteriaList.push(element.value);
          });

          /** Find all criteriaweight */
          var criteriaWeightlist = allData.filter(data => data.key.indexOf('criteriaWeight'+elementOptionCounter) >= 0);
          criteriaWeightlist.forEach(element => {
            qocData.criteriaWeightList.push(element.value);
            qocData.edgeWeightList.push(0);
          });

          /** Push data to array */
          this.QOCData.push(qocData);
        });
      }

    });
  }

  /** Send data to nodes  */
  public async sendData(data:any,projectPhrase = localStorage['projectPhrase'],userPhrase = localStorage['userPhrase']){
    // /** create process seed from phrase */
    const seedProcess =this.createSeedFromPhrase(projectPhrase) ;

    /** create sender seed from phrase */
    const seedSender = this.createSeedFromPhrase(userPhrase) ;

    /** transfer waves from useracc to project acc

    /** create qoc data object */
    let dataObj ={
      data: data,
      senderPublicKey: seedProcess.keyPair.publicKey,
      sender: seedProcess.address,
      fee:1000000
    };

    /** prepare QOC data transaction object*/
    const dataTx = await this.waves.tools.createTransaction("data", dataObj);

    /** add proof to QOC data transaction  */
    dataTx.addProof(seedSender.keyPair.privateKey);

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

  public async sendWaves(userPhrase : string){
    const { transfer, signTx } = require('waves-transactions');
    var seedFrom = this.createSeedFromPhrase(userPhrase);
    const seedTo = this.createSeed();

    var tr = transfer({
      amount: 5,
      recipient: seedTo.address,
      senderPublicKey:seedFrom.keyPair.publicKey,
      sender: seedFrom.address,
      //attachment?: 'string',
      // feeAssetId: 'WAVES',
      //assetId: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS', //WBTC
      //fee?: 100000,
      //timestamp?: Date.now(),
    })
    var st = signTx(tr,seedFrom.keyPair.privateKey);
    console.log(st);
    return await this.waves.API.Node.transactions.rawBroadcast(st);

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
    const { transfer } = require('waves-transactions');

    console.log(userSeed);

    const signedTranserTx = transfer({
      amount: 1,
      recipient: projectAddress,
      senderPublicKey: userSeed.keyPair.publicKey,
      //Timestamp is optional but it was overrided, in case timestamp is not provided it will fallback to Date.now(). You can set any oftional params yourself. go check full docs
      timestamp: 1536917842558
    }, userSeed);

    console.info(signedTranserTx);

    this.waves.API.Node.transactions.broadcast('transfer', signedTranserTx, userSeed.keyPair).then((responseData) => {
      console.log(responseData);
    });
  }
}
