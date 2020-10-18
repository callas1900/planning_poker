# planning_poker

> online planning poker tool

## Preparation

the firebase tools is used for deploying the project and booting a local server.

```bash
# Install firebase tools
npm install -g firebase-tools

# Login to firebase
firebase login
```

## Build Project

### for production

```shell
# install dependencies
npm install

# build for production with minification
npm run build

# serve with hot reload at localhost:5000
firebase deploy
```

### for local development

```shell
# install dependencies
npm install

# build for development with minification
npm run dbuild

# serve with hot reload at localhost:5000
npm run local
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## refs

- [firebase. database. Database](https://firebase.google.com/docs/reference/js/firebase.database.Database#ref)
- [firebase Deploying](https://www.tutorialspoint.com/firebase/firebase_deploying.htm)
