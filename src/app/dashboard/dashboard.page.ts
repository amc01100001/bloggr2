import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface MyData {
  name: string;
  title: string;
  date: string;
  content: string;
  filepath: string;
  lat: number;
  long: number;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  
})

export class DashboardPage {
  showDetails: boolean = false;
  hideDetails: boolean = true;

  task: AngularFireUploadTask; // Upload task
  percentage: Observable<number>; // Progress in percentage
  snapshot: Observable<any>; // Snapshot of uploading file
  UploadedFileURL: Observable<string>; //Uploaded File URL
  
  // Blog details:
  fileName: string;
  fileTitle: string;
  fileDate: string;
  fileContent: string;
  fileLat: number;
  fileLong: number;

  // Status Check:
  isUploading: boolean;
  isUploaded: boolean;

  private bloggrCollection: AngularFirestoreCollection<MyData>;
  
  constructor(
    public navCtrl: NavController,
    public fAuth: AngularFireAuth,
    public modalController: ModalController,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    private geolocation: Geolocation
  ) {
    this.isUploading = false;
    this.isUploaded = false;

    // Set collection where the blog info will be saved
    this.bloggrCollection = database.collection<MyData>('bloggrPosts');
  }

  uploadFile(event: FileList) {

    this.geolocation.getCurrentPosition().then((resp) => {
      this.fileLat = resp.coords.latitude;
      this.fileLong = resp.coords.longitude;
    }).catch((error) => {
      alert('Error getting location.' + JSON.stringify(error));
    })

    const file = event.item(0) // The File object

    this.isUploading = true;
    this.isUploaded = false;

    this.fileName = file.name;

    const path = `bloggsPosts/${new Date().getTime()}_${file.name}`; // The storage path
    const fileRef = this.storage.ref(path); // File reference
    this.task = this.storage.upload(path, file); // The main task
    this.percentage = this.task.percentageChanges(); // Get file upload progress percentage
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(() => {
        this.UploadedFileURL = fileRef.getDownloadURL(); // Get file progress percentage

        this.UploadedFileURL.subscribe(resp => {
          this.addPostToDB({
            title: this.fileTitle,
            name: file.name,
            date: this.fileDate,
            content: this.fileContent,
            filepath: resp,
            lat: this.fileLat,
            long: this.fileLong
          });
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        })
      })
    )

  }

  addPostToDB(blog: MyData) {
    const id = this.database.createId(); // Create an ID for the post
    
    // Set the document ID with value in database
    this.bloggrCollection.doc(id).set(blog).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error" + error);
    });
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
    this.hideDetails = !this.hideDetails
  }

  logout() {
    this.fAuth.auth.signOut();
  }


}
