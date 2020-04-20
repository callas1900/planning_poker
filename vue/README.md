# planning_poker

> online planning poker tool

## Preparation

making init.js

```shell
cat > src/firebase/init.js
```

then paste below
```javascript
// app's Firebase project configuration
export const firebaseConfig = {
    apiKey: "apiKey",
    authDomain: "authDomain",
    databaseURL: "databaseURL",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId",
    measurementId: "measurementId"
};
```
after that, please modify above with your project info.

## Build Setup

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
firebase emulators:start
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).