
import { Injectable } from '@angular/core';
import { Data } from '../../app/Data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
declare var require: any;

/*
  Generated class for the WavesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WavesProvider {
  wavesApi :any;
  waves: any;
  dataList : Data[] = [];
  calculatedData:Data[] = [];
  getDataList :Observable<any>;

  constructor(public httpClient: HttpClient) {
    console.log('Hello WavesProvider Provider');
    this.wavesApi =  require('@waves/waves-api');
    this.waves = this.wavesApi.create(this.wavesApi.TESTNET_CONFIG);
  }

  /** get all data from adress */
  public async getData(address){
    this.calculatedData = [];
    this.dataList = [];
    this.getDataList = this.httpClient.get('https://pool.testnet.wavesnodes.com/addresses/data/'+address);
    this.getDataList.subscribe(data => {

      var foundfinalData = data.find( dataChild => dataChild.key == "_finalOption");
      /** if final data not in address data , then evaluate given data  */
      if(foundfinalData != null){
        /** Parse final Data   */
        var splitChild = foundfinalData.value.split("&");
        var finalData = new Data(splitChild[0]);
        finalData.weightCalculated = splitChild[1];
        this.calculatedData.push(finalData);
      }else{
        /** Get all questions  */
        for(var i=0;i<data.length;i++){
          var child = data[i];
          var splitChild = child.value.split("&");
          /** 1.option , 2.criteria,3.option weight, 4.criteria weight */
          var option    = splitChild[0];
          var criteria  = splitChild[1];
          var optionWeight = splitChild[2];
          var criteriaWeight = splitChild[3];
          var newData = new Data(option,criteria,optionWeight,criteriaWeight);
          this.dataList.push(newData);

          var foundData = this.calculatedData.find( data => data.option == newData.option);
        
          if(foundData == undefined){
            console.log("Added "+ newData);
            this.calculatedData.push(newData);
          }else{
            console.log("Added calculate "+ foundData);
            foundData.weightCalculated += newData.weightCalculated;
          }
        }
      }


    });
  }

  /** Send data to nodes  */
  public async sendData(data,phraseSender,phraseProcess){
      // /** create process seed from phrase */
      const seedProcess =this.createSeedFromPhrase(phraseProcess) ;
  
      /** create sender seed from phrase */
      const seedSender = this.createSeedFromPhrase(phraseSender) ;

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
    return this.waves.Seed.fromExistingPhrase(phrase) ;
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

  public async sendWaves(){
    const { transfer, signTx } = require('waves-transactions')
    var seedFrom = this.createSeedFromPhrase("aim ankle exclude scene jeans stone awful lawn tornado cake raise cry light finger service");
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
    console.log(st)
    await this.waves.API.Node.transactions.rawBroadcast(st);
    
  }


}
