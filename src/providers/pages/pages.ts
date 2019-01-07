import { Injectable } from '@angular/core';
import {DeleteProcessPage} from "../../pages/delete-process/delete-process";
import {CreateProcessPage} from "../../pages/create-process/create-process";
import {HomePage} from "../../pages/home/home";
import {EvaluatePage} from "../../pages/evaluate/evaluate";
import {QocPage} from "../../pages/qoc/qoc";

/*
  Generated class for the PagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PagesProvider {

  pages: Array<{title: string, component: any}>;
  constructor() {
    console.log("PagesProvider loaded.");
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Create Process', component: CreateProcessPage },
      { title: 'Delete Process', component: DeleteProcessPage },
      { title: 'Evaluate', component: EvaluatePage },
      { title: 'Qoc', component: QocPage },
    ];
  }

  public getPages() {
    return this.pages;
  }
}


