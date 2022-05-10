import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileModel } from './profile.model';
import { FirebaseAuthService } from '../firebase-auth.service';
import { Neo4jAuraService } from '../neo4j-aura.service';
import { v4 as uuidv4 } from 'uuid';


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
        console.log(this.user);

      }, (err) => { })

    const prof = this.authService.getProfileDataSource().subscribe(res => {
      console.log(res);
    });


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
    // const dummyUser: UserModel = {
    // //   userId: uuidv4(),
    // //   createdAt: new Date().toDateString(),
    // //   userName: 'Faquie',
    // //   avatarUrl: 'asd.com',
    // // }

    const dummyEvent: EventModel = {
      eventId: uuidv4(),
      eventDate: new Date().toDateString(),
      eventName: 'event 2',
      eventType: 'sport',
      eventDescription: 'bouildernas'
    }
    // await this.neo4jAuraService.createUser(dummyUser).then(res => {
    //this.neo4jAuraService.addConection('rBM5YviVvBTYlno9U363bDuABpk1', 'rqXDpdQYLhhHuzQDohDw36Vr6qJ2', 10)
    //this.neo4jAuraService.changeInteractionFreq('rBM5YviVvBTYlno9U363bDuABpk1', 'rqXDpdQYLhhHuzQDohDw36Vr6qJ2', 5);
    //this.neo4jAuraService.createEvent('rqXDpdQYLhhHuzQDohDw36Vr6qJ2', dummyEvent)
    //this.neo4jAuraService.addAttendance('or1ju9G2DFUhJHib5rYED81jUnE2', '02020842-0e0a-484f-ab6b-225ee7d58f96')
    //const events = await this.neo4jAuraService.getAttendanceOfConnection('rBM5YviVvBTYlno9U363bDuABpk1', 'or1ju9G2DFUhJHib5rYED81jUnE2');
    const conections = await this.neo4jAuraService.getAllConections('rBM5YviVvBTYlno9U363bDuABpk1');
    console.log(conections);
    
    // })
    // await this.neo4jAuraService.createEvent(dummyEvent);


    // const user = await this.neo4jAuraService.getUserById('rBM5YviVvBTYlno9U363bDuABpk1');
    // console.log(user);

  }
}
