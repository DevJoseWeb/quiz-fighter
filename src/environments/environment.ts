// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAPN7eRNgT1u-oqs0K2a-4wBgwHDnOcP_I",
    authDomain: "quiz-fighter-dev.firebaseapp.com",
    databaseURL: "https://quiz-fighter-dev.firebaseio.com",
    projectId: "quiz-fighter-dev",
    storageBucket: "",
    messagingSenderId: "28741904434"
  }
};
