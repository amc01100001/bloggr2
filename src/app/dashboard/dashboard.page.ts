import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular'; 

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { NewPostPage } from '../new-post/new-post.page';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage {
  task: AngularFireUploadTask; // Upload Task
  percentage: Observable<number>; // Progress in percentage
  snapshot: Observable<any>; // Snapshot of uploading file
  UploadFileURL: Observable<string>; //Upload File URL
  images: Observable<MyData[]>; // Upload Image List

  fileName: string; // File details 
  fileSize: number; //

  isUploading: boolean; // Status check
  isUploaded: boolean; //

  private imageCollection: AngularFirestoreCollection<MyData>;
  constructor(
    public navCtrl: NavController,
    public fAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    public modalController: ModalController
  ) {
    this.isUploading = false;
    this.isUploaded = false;

    this.imageCollection = database.collection<MyData>('bloggrImages'); // Set collection where our documents/images will save
    this.images = this.imageCollection.valueChanges(); //
    
  }

  uploadFile(event: FileList) {
    const file = event.item(0) // The File object

    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ')
      return; 
    }

    this.isUploading = true;
    this.isUploaded = false;

    this.fileName = file.name;

    const path = `bloggrStorage/${new Date().getTime()}_${file.name}`; // The storage path
    const customMetadata = { app: `bloggr.`};
    const fileRef = this.storage.ref(path); // File reference
    
    this.task = this.storage.upload(path, file, { customMetadata }); // The main task
    this.percentage = this.task.percentageChanges(); // Get file progress percentage
    this.snapshot = this.task.snapshotChanges().pipe( 
      finalize(() => {
        this.UploadFileURL = fileRef.getDownloadURL(); // Get uploaded file storage path

        this.UploadFileURL.subscribe(resp => {
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        })
      }),
      tap(snap => {
        this.fileSize = snap.totalBytes;
      })
    )
  }

  addImagetoDB(image: MyData) {
    const id = this.database.createId(); //Create an ID for document

    this.imageCollection.doc(id).set(image).then(resp => { // Set document id with value in database
      console.log(resp);
    }).catch(error => {
      console.log("error" + error);
    });
  }

  logout() {
    this.fAuth.auth.signOut();
  }

  async openModal() {
    const modal = await this.modalController.create({
    component: NewPostPage
    });
    return await modal.present();
   }


}
