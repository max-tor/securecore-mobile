# SecureCore ReactNative App

## Prerequisites

* Node.js, npx
* Yarn package manager
* Java Development Kit (for Android)
* [Android Studio and Android Emulator](https://developer.android.com/studio)
* Ruby >=2.7.5 and CocoaPods (for iOS version)
* XCode (for iOS version)


## Setting up development environment

Please follow [this guide](https://reactnative.dev/docs/environment-setup) to setup
your development environment (React Native CLI section)

## Env

Create a file named `.env` in the root directory and provide all values for variables
listed in `.env.example` file. [Here](https://redmine.gluzdov.com/documents/1823) is the actual env file.

## Installing dependencies
* Install dependencies by running `yarn`
* Install ruby and certificates
  * `rvm use` use ruby version from `.ruby-version` file
  * cd ios
  * gem install bundler:2.1.4
  * bundle install
  * create  `ios/fastlane/.env.default` form `.env.default.example`, ask values
  * bundler exec fastlane install_certs

### iOS

* Go to `./ios` directory and install Pods

```
cd ios && pod install
```

## Running in emulator

### iOSn

Just run `npx react-native run-ios`
The app will be launched in default simulator. See more
You can also run it directly from within Xcode.

### Android

Just run `npx react-native run-android`
The app will be launched in default simulator. See more
You can also run it directly from within Xcode.

#### Running on a device

### iOS

If you want to run the app on an actual physical iOS device,
please follow the instructions [here](https://reactnative.dev/docs/running-on-device).

### Android

To run the app on actual physical Android device, pleas follow
[this guide](https://reactnative.dev/docs/running-on-device).

### Tech Stack
[![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=333)](https://reactjs.org)
[![NativeBase](https://img.shields.io/badge/-NativeBase-0f172a?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAMAAAAsYw3eAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAIdQTFRFAAAANWKQNWKQNWKQNWKQNWKQLWuZH3upNWKQM2SSInelJZO2RbTANWKQNWKQKm+dHIaxO6m9UL/DMWaUHou0TLvCNWKQs+PlW8PHp9/h1O/wccvOktfa3/P0ZsfLvufpsuPlndvdyevsTbzCM2SSQrC/Io+1NWKQNWKQHnyqL2iWNWKQNWKQVmtLogAAAC10Uk5TAEDfzyCv//+A8P///3/Q////////////////////////////8f//cLD//6AQOCzX0gAAAIJJREFUeJxNjuEOgjAMhDuBASsOGENAdKggivr+z2fX+cMvadJLLncHQIhdJCAQJzJNZRL7P8sVFgWqfA+gy6o2RF2VETS2NUxrDyDRfx0detEPx/F0HnoWbrpcXXdzGGzjZBzbGjuHgJkC/qI1lS5Uel/V8uA5T7ltr/fnt05ozUO/F24J5iuM7zUAAAAASUVORK5CYII=&logoColor=fff)](https://nativebase.io/)
[![React Native](https://img.shields.io/badge/-ReactNative-61DAFB?style=flat-square&logo=react&logoColor=333)](https://reactnative.dev/)
[![React Navigation](https://img.shields.io/badge/-ReactNavigation-7b61c1?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAMZQTFRFAAAAOi5cAQEBAgEDXEmQQDJmMidPNipUJBw4WkaMOCxYDAkTPTFhcVmxTj16CAYMNClSLCJFDAgRVkSHDgsWJh48BgUKPC9fOS1ZXkqURTdtUkF/UkGCclqzSjlzVkSHSzt2WkeOBAMHNipVPzFjQzZrRzhvAwIFZU+eLyZLUD9+EA0aKCBAIBkzVEKDQjRoSTpzaFKjVEKELiRIZ1KiEA0aalSnV0WJNytXUkGCDgsWOi5bKiFDVEOFU0GDMSdONClRDwsXyhuhYAAAAEJ0Uk5TAGwBArB6X2NBrGUVdduTDWJSEqUZRwpya7OBkpbfiKCPrwdmdn6GA8Vamh5MOqB+i8ybVskaz6hpmRZpT6SfXGAWyak7+gAAAJZJREFUeJxljtcOgkAURLexdKRKLwrYe+/i//+Uu2Lig/fl5CQzmQvA/1nHVJe3X1GLK5HmBBYut/4o0V5ZtofJusu0XFHFHOJGLCPI1BFyxFNoU/UYNGdmc+1YC4HBf3jqR2+TiuG+zNuFs8DDwcBUKEZP8VT7fGgXB3ZUX8T4wIeAa8DQk0JoTNsSGsupTij6fY1xyze5ywtGMnUmwQAAAABJRU5ErkJggg==&logoColor=333)](https://reactnavigation.org/)
[![Styled Components](https://img.shields.io/badge/-StyledComponents-cecece?style=flat-square&logo=styled-components&logoColor=333)](https://styled-components.com/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=fff)](https://typescriptlang.org)
