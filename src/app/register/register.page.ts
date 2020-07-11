import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

export class User {
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage {
  public user:User = new User();
  
  constructor(
    public navCtrl: NavController,
    public fAuth: AngularFireAuth
  ) { }
  
  async register() {
      try {
        var r = await this.fAuth.auth.createUserWithEmailAndPassword(
          this.user.email,
          this.user.password
        );
        if (r) {
          console.log("Successfully logged in!");
          this.navCtrl.navigateRoot('/dashboard');
        }
  
      } catch (err) {
        console.error(err);
      }
    }

}
