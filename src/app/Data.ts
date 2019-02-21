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

export class QOCData {
  public options : Option[];
  public criterias : Criteria[];

  constructor() {
    this.options = [];
    this.criterias = [];
  }

  /** Option hinzufügen */
  public addOption(option : string) {
    this.options.push(new Option(option));
  }

  /** Option löschen */
  public removeOption(id : number) {
    this.options.slice(id, 1);
  }

  /** Option ändern */
  public changeOption(id : number, name : string) {
    this.options[id].name = name;
  }

  /** Criteria hinzufügen */
  public addCriteria(criteria : string, weight : number) {
    this.criterias.push(new Criteria(criteria, weight));
  }

  public removeCriteria(id : number) {
    this.criterias.splice(id, 1);
  }

  public changeCriteriaName(id : number, criteria : string) {
    this.criterias[id].name = criteria;
  }

  public changeCriteriaWeight(id : number, weight : number) {
    this.criterias[id].weight = weight;
  }

}

export class Option {

  public name : string;

  constructor(option : string) {
    this.name = option;
  }


}

export class Criteria {
  public name : string;
  public weight : number;

  constructor(criteria : string, w : number) {
    this.name = criteria;
    this.weight = w;
  }
}
