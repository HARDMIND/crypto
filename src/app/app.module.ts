import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { QocPage } from '../pages/qoc/qoc';
import { CreateProcessPage } from '../pages/create-process/create-process';
import { DeleteProcessPage } from '../pages/delete-process/delete-process';
import { EvaluatePage } from '../pages/evaluate/evaluate';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QocPage,
    CreateProcessPage,
    DeleteProcessPage,
    EvaluatePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QocPage,
    CreateProcessPage,
    DeleteProcessPage,
    EvaluatePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
