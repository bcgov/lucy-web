# Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.2.

## Development server
### To run the application locally: 
1) Navigate to the App's root directory `/lucy-web/app/ and execute:
```bash
ng serve
```
2) Navigate to `http://localhost:4200/`
The app will automatically reload if you change any of the source files.

### To run the application locally with a `Production` build, execute:
```bash
ng serve --prod
```

## Code scaffolding
### To generate a new component:
1) Navigate to `lucy-web/app/lucy/src/app/components`
2) execute `ng g c component-name`

### To add a new service:
1) Navigate to `lucy-web/app/lucy/src/app/services`
2) execute `ng g s service-name`

## Build
###  Execute the following command to build the project:
```bash
ng build
```
The build artifacts will be stored in the `dist/` directory.

### For a `Production` build, execute the following command:
```bash
ng build --prod
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Unit Tests

## Execution

To exectute a [test](https://angular.io/cli/test) execute the following command from the App's root directory `/lucy-web/app/lucy`:
```bash
ng test --watch=false
```

## Possible Errors
If you get an error, you may need to execute the following command:
```bash
npm i -D puppeteer karma-chrome-launcher
```

You may run into an issue with this command in docker and receiving this error:
```bash
....../puppeteer/.local-chromium/linux-555668/chrome-linux/chrome: error while loading shared libraries: libX11-xcb.so.1: cannot open shared object file: No such file or directory
```

The [Fix](https://techoverflow.net/2018/06/05/how-to-fix-puppetteer-error-while-loading-shared-libraries-libx11-xcb-so-1-cannot-open-shared-object-file-no-such-file-or-directory/): is 
1) Update
```bash
sudo apt-get update
```
2) Install Dependencies
```bash
sudo apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```
3) Then try executing the test again:
```bash
ng test --watch=false
```

## How our tests are created

- The Angular CLI takes care of [Jasmine](https://jasmine.github.io) and [Karma](https://karma-runner.github.io/latest/index.html) configuration.
- Each Angular component or service created through the [Angular CLI](https://angular.io/cli), Includes a `.spec.ts` file used for writing a test for that component or service.
- We have setup karma to be tested with a [headless chrome browser through Puppeteer](https://github.com/karma-runner/karma-chrome-launcher#headless-chrome-with-puppeteer). 
