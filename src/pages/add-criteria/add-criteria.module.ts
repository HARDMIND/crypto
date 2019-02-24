import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCriteriaPage } from './add-criteria';

@NgModule({
  declarations: [
    AddCriteriaPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCriteriaPage),
  ],
})
export class AddCriteriaPageModule {}
