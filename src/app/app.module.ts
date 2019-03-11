import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HomePage } from '../pages/home/home';
import { MyApp } from './app.component';
import { QocPage } from '../pages/qoc/qoc';
import { CreateProcessPage } from '../pages/create-process/create-process';
import { DeleteProcessPage } from '../pages/delete-process/delete-process';
import { EvaluatePage } from '../pages/evaluate/evaluate';
import { TestServiceProvider } from '../providers/test-service/test-service';
import { MessagesProvider } from '../providers/messages/messages';
import { WavesProvider } from '../providers/waves/waves';
import { LoginPage } from '../pages/login/login';
import { HttpClientModule } from '@angular/common/http';
import { EvaluationProvider } from '../providers/evaluation/evaluation';
import IonicStepperModule from "ionic-stepper";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AddCriteriaPage} from "../pages/add-criteria/add-criteria";
import {MergeCriteriaPage} from "../pages/merge-criteria/merge-criteria";
import { MergeProvider } from '../providers/merge/merge';
import {RatingPage} from "../pages/rating/rating";
import {ResultPage} from "../pages/result/result";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QocPage,
    CreateProcessPage,
    DeleteProcessPage,
    EvaluatePage,
    LoginPage,
    AddCriteriaPage,
    MergeCriteriaPage,
    RatingPage,
    ResultPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStepperModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    QocPage,
    HomePage,
    CreateProcessPage,
    DeleteProcessPage,
    EvaluatePage,
    LoginPage,
    AddCriteriaPage,
    MergeCriteriaPage,
    RatingPage,
    ResultPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    // TestServiceProvider,
    MessagesProvider,
    WavesProvider,
    EvaluationProvider,
    MergeProvider
  ]
})
export class AppModule {}
