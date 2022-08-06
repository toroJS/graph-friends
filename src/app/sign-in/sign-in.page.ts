import { Component, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FirebaseAuthService } from "../firebase-auth.service";
import { Subscription } from "rxjs";
import { DBUserModel } from "../models/types";
import { Neo4jAuraService } from "../neo4j-aura.service";

@Component({
  selector: "app-sign-in",
  templateUrl: "sign-in.page.html",
  styleUrls: ["sign-in.page.scss"],
})
export class SignInPage {
  signInForm: FormGroup;
  submitError: string;
  authRedirectResult: Subscription;

  validation_messages = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." },
    ],
    password: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 6 characters long.",
      },
    ],
  };

  constructor(
    public angularFire: AngularFireAuth,
    public router: Router,
    private ngZone: NgZone,
    private authService: FirebaseAuthService,
    private neo4jDb: Neo4jAuraService
  ) {
    this.signInForm = new FormGroup({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ),
    });

    // Get firebase authentication redirect result invoken when using signInWithRedirect()
    // signInWithRedirect() is only used when client is in web but not desktop
    this.authRedirectResult = this.authService
      .getRedirectResult()
      .subscribe(async (result) => {
        if (result.user) {
          const userInDb = await this.neo4jDb.getUserById(result.user.uid);
          if (!userInDb) {
            if (result.additionalUserInfo) {
              this.authService.setProviderAdditionalInfo(
                result.additionalUserInfo.profile
              );
            }
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const token = result.credential.accessToken;
            // The signed-in user info is in result.user;
            const user = result.user;
            const newUser: DBUserModel = {
              userId: user.uid,
              email: user.email,
              createdAt: new Date().toDateString(),
              userName: user.displayName || "Anon",
              avatarUrl: user.photoURL,
            };

            this.neo4jDb.createUser(newUser);
          }

          this.redirectLoggedUserToProfilePage();
        } else if (result.error) {
          this.submitError = result.error;
        }
      });
  }

  redirectLoggedUserToProfilePage() {
    this.ngZone.run(() => {
      this.router.navigate(["pages/dashboard"]);
    });
  }

  signInWithEmail() {
    this.authService
      .signInWithEmail(
        this.signInForm.value["email"],
        this.signInForm.value["password"]
      )
      .then((user) => {
        // navigate to user profile
        this.redirectLoggedUserToProfilePage();
      })
      .catch((error) => {
        this.submitError = error.message;
      });
  }

  facebookSignIn() {
    this.authService
      .signInWithFacebook()
      .then((result: any) => {
        if (result.additionalUserInfo) {
          this.authService.setProviderAdditionalInfo(
            result.additionalUserInfo.profile
          );
        }
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // const token = result.credential.accessToken;
        // The signed-in user info is in result.user;
        this.redirectLoggedUserToProfilePage();
      })
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
      });
  }

  googleSignIn() {
    this.authService
      .signInWithGoogle()
      .then((result: any) => {
        if (result.additionalUserInfo) {
          this.authService.setProviderAdditionalInfo(
            result.additionalUserInfo.profile
          );
        }
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const token = result.credential.accessToken;
        // The signed-in user info is in result.user;
        this.redirectLoggedUserToProfilePage();
      })
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
      });
  }

  twitterSignIn() {
    this.authService
      .signInWithTwitter()
      .then((result: any) => {
        if (result.additionalUserInfo) {
          this.authService.setProviderAdditionalInfo(
            result.additionalUserInfo.profile
          );
        }
        // This gives you a Twitter Access Token. You can use it to access the Twitter API.
        // const token = result.credential.accessToken;
        // The signed-in user info is in result.user;
        this.redirectLoggedUserToProfilePage();
      })
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
      });
  }
}
