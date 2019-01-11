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
import { TestServiceProvider } from '../providers/test-service/test-service';
import { PagesProvider } from '../providers/pages/pages';
import { MessagesProvider } from '../providers/messages/messages';
import { WavesProvider } from '../providers/waves/waves';
import { LoginPage } from '../pages/login/login';
import { HttpClientModule } from '@angular/common/http';
import { EvaluationProvider } from '../providers/evaluation/evaluation';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QocPage,
    CreateProcessPage,
    DeleteProcessPage,
    EvaluatePage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QocPage,
    CreateProcessPage,
    DeleteProcessPage,
    EvaluatePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    // TestServiceProvider,
    PagesProvider,
    MessagesProvider,
    WavesProvider,
    EvaluationProvider
  ]
})
export class AppModule {}
