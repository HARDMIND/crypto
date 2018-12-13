import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeleteProcessPage } from './delete-process';

@NgModule({
  declarations: [
    DeleteProcessPage,
  ],
  imports: [
    IonicPageModule.forChild(DeleteProcessPage),
  ],
})
export class DeleteProcessPageModule {}
