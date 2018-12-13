import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateProcessPage } from './create-process';

@NgModule({
  declarations: [
    CreateProcessPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateProcessPage),
  ],
})
export class CreateProcessPageModule {}
