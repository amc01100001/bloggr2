import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})
export class NewPostPage{

  constructor(
    public viewCtrl: ModalController
  ) {

  }
  dismiss() {
    this.viewCtrl.dismiss();
    }

}
