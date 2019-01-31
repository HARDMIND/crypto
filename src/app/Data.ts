import { List } from "ionic-angular";

export class Data {
    public option: any ;
    public criteria:any;
    public criteriaWeight:any;
    public optionWeight:any;
    public weightCalculated : number ;
    public criteriaList:any = [];
    public criteriaWeightList:any = [];

    constructor(option : any, criteria:any = "", optionWeight:any = 0,criteriaWeight:any = 0, list:any[]){
        this.option = option;
        this.criteria = criteria;
        this.optionWeight = optionWeight ;
        this.criteriaWeight = criteriaWeight;
        this.weightCalculated = this.criteriaWeight * this.optionWeight ;
        this.criteriaList = list;
    }

    public toString(){
        return this.option + " " + this.criteria + " "+this.optionWeight +" "+ this.criteriaWeight + " " + this.weightCalculated;
    }

    public addCriteria(criteria:string){
        this.criteriaList.push(criteria);
        this.criteriaWeightList.push(0);
    }
    
    public changeCriteriaWeight(criteriaWeight, index:number){
        this.criteriaWeightList[index] = criteriaWeight;
    }
}