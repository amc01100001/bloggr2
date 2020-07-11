import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface MyData {
  title: string;
  date: number;
  blogg: string;
  filepath: string;
}

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})

export class NewPostPage{
  
  constructor(
    public viewCtrl: ModalController
  ) { }

  dismiss() { // Dismisses modal
    this.viewCtrl.dismiss(); 
  }

}
