# MREX

This project was generated with [ngX-Rocket](https://github.com/ngx-rocket/generator-ngx-rocket/)
version 6.2.0

# Getting started

1. Go to project folder and install dependencies:
 ```sh
 npm install
 ```

2. Launch development server, and open `localhost:4200` in your browser:
 ```sh
 npm start
 ```

# Project structure

```
dist/                        web app production build
docs/                        project docs and coding guides
e2e/                         end-to-end tests
src/                         project source code
|- app/                      app components
|  |- core/                  core module (singleton services and single-use components)
|  |- shared/                shared module  (common components, directives and pipes)
|  |- app.component.*        app root component (shell)
|  |- app.module.ts          app root module definition
|  |- app-routing.module.ts  app routes
|  +- ...                    additional modules and components
|- assets/                   app assets (images, fonts, sounds...)
|- environments/             values for various build environments
|- theme/                    app global scss variables and theme
|- translations/             translations files
|- index.html                html entry point
|- main.scss                 global style entry point
|- main.ts                   app entry point
|- polyfills.ts              polyfills needed by Angular
+- test.ts                   unit tests entry point
reports/                     test and coverage reports
proxy.conf.js                backend proxy configuration
```

# Main tasks

Task automation is based on [NPM scripts](https://docs.npmjs.com/misc/scripts).

Task                            | Description
--------------------------------|--------------------------------------------------------------------------------------
`npm start`                     | Run development server on `http://localhost:4200/`
`npm run serve:sw`              | Run test server on `http://localhost:4200/` with service worker enabled
`npm run build [-- --configuration=production]` | Lint code and build web app for production (with [AOT](https://angular.io/guide/aot-compiler)) in `dist/` folder
`npm test`                      | Run unit tests via [Karma](https://karma-runner.github.io) in watch mode
`npm run test:ci`               | Lint code and run unit tests once for continuous integration
`npm run e2e`                   | Run e2e tests using [Protractor](http://www.protractortest.org)
`npm run lint`                  | Lint code
`npm run translations:extract`  | Extract strings from code and templates to `src/app/translations/template.json`
`npm run build:run:android`     | Bild and run on a connected Android device

When building the application, you can specify the target configuration using the additional flag
`--configuration <name>` (do not forget to prepend `--` to pass arguments to npm scripts).

The default build configuration is `prod`.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.
You should not use `ng serve` directly, as it does not use the backend proxy configuration by default.

## Code scaffolding

Run `npm run generate -- component <name>` to generate a new component. You can also use
`npm run generate -- directive|pipe|service|class|module`.

If you have installed [angular-cli](https://github.com/angular/angular-cli) globally with `npm install -g @angular/cli`,
you can also use the command `ng generate` directly.

## Additional tools

Tasks are mostly based on the `angular-cli` tool. Use `ng help` to get more help or go check out the
[Angular-CLI README](https://github.com/angular/angular-cli).

# Build and sign the app

First we need to release the app:

    cd cordova
    cordova build --release android

This will create an unsigned version of your APK at platforms/android/app/build/outputs/apk/release. To self-sign our APK we need to generate a keystore:

    keytool -genkey -v -keystore mrex.keystore -alias mrex -keyalg RSA -keysize 2048 -validity 10000

The keytool command will prompt you with a password and other certificate fields. After you filled out the fields a keystore file will be generated. Store your keystore very carefully!
Then we need to sign the java archive package:

    cd cordova/platforms/android/app/build/outputs/apk/release
    jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/mrex.keystore app-release-unsigned.apk mrex

One last mandatory step if you want to upload the APK to the Play Store (Zipalign is a tool provided by the Android SDK. If you have configured your $ANDROID_HOME var incorrect, you can find zipalign with this command: find ~/Library/Android/sdk/build-tools -name “zipalign”.):

    zipalign -v 4 app-release-unsigned.apk app-release-signed.apk

That’s it. Now you have your release-ready and signed APK that you can install on your Android smartphone.

Check here for more details: https://medium.com/@christof.thalmann/convert-angular-project-to-android-apk-in-10-steps-c49e2fddd29

The last thing to do is to get the hash for Facebook:

    keytool -exportcert -alias <aliasName> -keystore <keystoreFilePath> | openssl sha1 -binary | openssl base64

For example: 

    keytool -exportcert -alias mrex -keystore ~/mrex.keystore | openssl sha1 -binary | openssl base64

Reference: https://stackoverflow.com/questions/7506392/how-to-create-android-facebook-key-hash

# Sentry

Make sure to set the environment variable: 

    export SENTRY_AUTH_TOKEN=<TOKEN>

# What's in the box

The app template is based on [HTML5](http://whatwg.org/html), [TypeScript](http://www.typescriptlang.org) and
[Sass](http://sass-lang.com). The translation files use the common [JSON](http://www.json.org) format.

#### Tools

Development, build and quality processes are based on [angular-cli](https://github.com/angular/angular-cli) and
[NPM scripts](https://docs.npmjs.com/misc/scripts), which includes:

- Optimized build and bundling process with [Webpack](https://webpack.github.io)
- [Development server](https://webpack.github.io/docs/webpack-dev-server.html) with backend proxy and live reload
- Cross-browser CSS with [autoprefixer](https://github.com/postcss/autoprefixer) and
  [browserslist](https://github.com/ai/browserslist)
- Asset revisioning for [better cache management](https://webpack.github.io/docs/long-term-caching.html)
- Unit tests using [Jasmine](http://jasmine.github.io) and [Karma](https://karma-runner.github.io)
- End-to-end tests using [Protractor](https://github.com/angular/protractor)
- Static code analysis: [TSLint](https://github.com/palantir/tslint), [Codelyzer](https://github.com/mgechev/codelyzer),
  [Stylelint](http://stylelint.io) and [HTMLHint](http://htmlhint.com/)

#### Libraries

- [Angular](https://angular.io)
- [Bootstrap 4](https://getbootstrap.com)
- [ng-bootsrap](https://ng-bootstrap.github.io/)
- [Font Awesome](http://fontawesome.io)
- [RxJS](http://reactivex.io/rxjs)
- [ngx-translate](https://github.com/ngx-translate/core)

#### Coding guides

- [Angular](docs/coding-guides/angular.md)
- [TypeScript](docs/coding-guides/typescript.md)
- [Sass](docs/coding-guides/sass.md)
- [HTML](docs/coding-guides/html.md)
- [Unit tests](docs/coding-guides/unit-tests.md)
- [End-to-end tests](docs/coding-guides/e2e-tests.md)

#### Other documentation

- [I18n guide](docs/i18n.md)
- [Working behind a corporate proxy](docs/corporate-proxy.md)
- [Updating dependencies and tools](docs/updating.md)
- [Using a backend proxy for development](docs/backend-proxy.md)
- [Browser routing](docs/routing.md)