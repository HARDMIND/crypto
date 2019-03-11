import {Criteria, Option, QOCData} from "../app/Data";

export class Rating {
  public ratedOptionMap : Map<string, Connection[]>;
  public result : Result[];
  public criteriaCount : number;


  constructor() {
    this.ratedOptionMap = new Map<string, Connection[]>();
    this.result = new Array();
  }

  public addData(data : QOCData) {
    data.options.forEach(option => {
      let cons = Array<Connection>();

      data.criterias.forEach(criteria => {
        let con = new Connection();
        con.criteria = criteria;
        con.option = option;

          cons.push(con);
      });

      this.criteriaCount = data.criterias.length;
      this.ratedOptionMap.set(option.name, cons);
    });

    console.log(this.ratedOptionMap);
  }

  public getOptions(){

    return Array.from( this.ratedOptionMap.keys());

  }

  public getCriteriaToOption(option : string) {
    return this.ratedOptionMap.get(option);
  }

  public getMaxRating() {
    return this.criteriaCount * 100;
  }

  public getResultForOption(option : string) {
    let result : number = 0;

    this.ratedOptionMap.get('option').forEach(element => {
      result = result + element.edgeWeight;
    });
  }

  public calcResults() {
    let value : Connection[];
    let res : number;
    console.log("Calculate Results:");
    for(value of Array.from(this.ratedOptionMap.values())) {
      console.log(value);
      res = 0;
      value.forEach(element => {
        res = res + (element.edgeWeight * element.criteria.weight);
      });

      console.log("Result for " + value[0].option.name + ":" + res);
      //this.result.set(value[0].option.name, result);
      let resultData = new Result();
      resultData.option = value[0].option.name;
      resultData.rating = res;

      this.result.push(resultData);
    }

  }

}

export class Connection {
  public option : Option;
  public criteria : Criteria;
  public weight : number;

  public edgeWeight : number = 50;
}

export class Result {
  public option : string;
  public rating : number;
}
