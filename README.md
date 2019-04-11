## MobilePatrol
This is a project based on [this template](https://github.com/abik11/vue-cordova).

### Permissions
If you will see the `User has denied permissions` error, than edit andoroid manifest here: `./platforms/android/AndroidManifest.xml` and add:
```xml
<uses-permission android:name="android.permission.SEND_SMS" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

### Logo
Remember to add `logo.png` and `hero.jpg` in `src\img` that will be displayed in login box.