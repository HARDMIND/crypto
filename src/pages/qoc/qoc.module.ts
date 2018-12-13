import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QocPage } from './qoc';

@NgModule({
  declarations: [
    QocPage,
  ],
  imports: [
    IonicPageModule.forChild(QocPage),
  ],
})
export class QocPageModule {}
