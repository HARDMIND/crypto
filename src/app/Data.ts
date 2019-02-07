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
