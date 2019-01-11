export class Data {
    public option: any ;
    public criteria:any;
    public criteriaWeight:any ;
    public optionWeight:any ;
    public weightCalculated : number ;

    constructor(option : any, criteria:any = "", optionWeight:any = 0,criteriaWeight:any = 0){
        this.option = option;
        this.criteria = criteria;
        this.optionWeight = optionWeight ;
        this.criteriaWeight = criteriaWeight;
        this.weightCalculated = this.criteriaWeight * this.optionWeight ;
    }

    public toString(){
        return this.option + " " + this.criteria + " "+this.optionWeight +" "+ this.criteriaWeight + " " + this.weightCalculated;
    }
}