// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDbAO0N1NNCVvlgSUDnhpy3gCozJ7wUOqY",
    authDomain: "fir-service-9b637.firebaseapp.com",
    projectId: "fir-service-9b637",
    storageBucket: "fir-service-9b637.appspot.com",
    messagingSenderId: "304854539782",
    appId: "1:304854539782:web:1a7ff03b10712180096d87",
    measurementId: "G-1XSVDF7DL5"
  },
  neo4j: {
    url: 'neo4j+s://b4d62e62.databases.neo4j.io',
    user: 'neo4j',
    password: 'QCiEm5hd9Ai7uukxQkrY222ckOCUTyURJkoOujpvC20',
  },
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
