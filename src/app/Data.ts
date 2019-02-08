export class Data {
    public option: any ;
    public criteriaList:string[]= [];
    public criteriaWeightList:any[] = [];
    public edgeWeightList:number[]= [];

    constructor(option : any){
        this.option = option;
    }

    public toString(){
        return this.option + " " ;
    }

    public addCriteria(criteria:string){
        this.criteriaList.push(criteria);
        this.criteriaWeightList.push("");
        this.edgeWeightList.push(0);
    }

    public changeCriteriaWeight(criteriaWeight, index:number){
        this.criteriaWeightList[index] = criteriaWeight;
    }

}

export class Question {
  private criteria : Criteria[] = [];
  public option : Option[] = [];

  constructor() {

  }

  public addOption(option : string) {
    this.option.push(new Option(option));
  }

  public getOption(index : number) : Option{
    return this.option[index];
  }

  public getOptionList() : Option[] {
    return this.option;
  }

  public addCriteria(criteria : string, weight : number) {
    this.criteria.push(new Criteria(criteria, weight));
  }

  public getCriteria(index : number) {
    return this.criteria[index];
  }
}

export class Option {

  public name : any;

  constructor(option : any) {
    this.name = option;
  }

  public getName() : any {
    return this.name;
  }

  public setName(option : any) {
    this.name = option;
  }
}

export class Criteria {

  public criteria : string;
  private weight : number;

  constructor (criteria : string, weight : number) {
    this.criteria = criteria;
    this.weight = weight;
  }


}


export class CriteriaData {
  public criteriaList : string[] = [];
  public criteriaWeightList : number[] = [];

  constructor() {}

  public add(criteria : string, weight : number) {
    this.criteriaList.push(criteria);


  }
}


