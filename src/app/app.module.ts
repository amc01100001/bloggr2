import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from  '@angular/fire/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';

var firebaseConfig = {
  apiKey: "AIzaSyAQKEojYy_FLeP0LHIppJ7ctLfXhqI3f04",
  authDomain: "bloggr2.firebaseapp.com",
  databaseURL: "https://bloggr2.firebaseio.com",
  projectId: "bloggr2",
  storageBucket: "bloggr2.appspot.com",
  messagingSenderId: "585071125261",
  appId: "1:585071125261:web:6421003e74ec0bb4c0c644",
  measurementId: "G-VGX3KK0KVG"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
