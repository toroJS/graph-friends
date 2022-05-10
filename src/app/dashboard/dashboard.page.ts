import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileModel } from './profile.model';
import { FirebaseAuthService } from '../firebase-auth.service';
import { Neo4jAuraService } from '../neo4j-aura.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  user: ProfileModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: FirebaseAuthService,
    private neo4jAuraService: Neo4jAuraService
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe((result) => {
        this.user = result['data'];
      }, (err) => { })
  }

  // signOut() {
  //   this.authService.signOut().subscribe(() => {
  //     // Sign-out successful.
  //     this.router.navigate(['sign-in']);
  //   }, (error) => {
  //     console.log('signout error', error);
  //   });
  // }

  async signOut() {
    await this.neo4jAuraService.backend();
  }
}
