
import { Injectable } from '@angular/core';
import * as request from "request";
import { Data } from '../../app/Data';
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
  constructor() {
    console.log('Hello WavesProvider Provider');
    this.wavesApi =  require('@waves/waves-api');
    this.waves = this.wavesApi.create(this.wavesApi.TESTNET_CONFIG);
  }

  /** get all data from adress */
  public async getData(adress){
    await request('https://pool.testnet.wavesnodes.com/addresses/data/'+adress,
      function (error, response, body){
        /** parse data */
        var dataList : Data[] = [];
        var parsedBody = JSON.parse(body);
        /** Get all questions  */
        for(var i=0;i<parsedBody.length;i++){
          var child = parsedBody[i];
          var splitChild = child.key.split("&");
          
          if(splitChild[0] == "question"){
            var searchForOption = "option&" + splitChild[1]+ "&" + splitChild[2];
            var searchForCriteria = "criteria&" + splitChild[1]+ "&" + splitChild[2];
            var foundOption = parsedBody.find(e => e.key === searchForOption);
            var foundCriteria = parsedBody.find(e => e.key === searchForCriteria);
            dataList.push(new Data(child.value,foundOption.value,foundCriteria.value, splitChild[2] ));
          }
        }
        
        dataList.forEach(element => {
          console.log(element.toString());
        });
      }
    );
  }

  /** Send data to nodes  */
  public async sendData(data,phraseSender,phraseProcess){
      // /** create process seed from phrase */
      const seedProcess =this.createAccountFromSeed(phraseProcess) ;
  
      /** create sender seed from phrase */
      const seedSender = this.createAccountFromSeed(phraseSender) ;

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
  public createAccountFromSeed(phrase){
    return this.waves.Seed.fromExistingPhrase(phrase) ;
  }
  
  /** create new account */
  public createAccount(){
    return this.waves.Seed.create();
  }

  /** create script */
  public async createScript(list,phrase){
    // json to string sample: JSON.stringify(txJSON)
    /** create seed from phrase */
    const seed = this.createAccountFromSeed(phrase) ;
    
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
}
