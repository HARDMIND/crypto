export class Data {
    public question:any;
    public option: any;
    public criteria:any;
    public pk:any;

    constructor(question : any, option:any, criteria:any, pk:any){
        this.question = question;
        this.option = option;
        this.criteria = criteria;
        this.pk = pk;
    }

    public toString(){
        return this.question + " " + this.option + " " + this.criteria + " "+ this.pk;
    }
}