fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios release_app

```sh
[bundle exec] fastlane ios release_app
```

Deploy a new version to the Appstore

### ios run_actions

```sh
[bundle exec] fastlane ios run_actions
```

Actions to run before deploy

### ios export_app

```sh
[bundle exec] fastlane ios export_app
```

Build the project

### ios upload_app

```sh
[bundle exec] fastlane ios upload_app
```

Deploy the project on TestFlight

----


## Android

### android test_generate_icon

```sh
[bundle exec] fastlane android test_generate_icon
```

Test generate icon android

### android release_app_android

```sh
[bundle exec] fastlane android release_app_android
```

Deploy a new version to the Google Play Store

### android release_app_android_without_upload

```sh
[bundle exec] fastlane android release_app_android_without_upload
```

Deploy a new version to the Google Play Store

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
