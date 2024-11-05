# Manifestify

Generates `manifest.json` file with all the necessary icons resized.

Simple cli tool to generate icons for your webapp for every device with PWA support.
Manifestify do boring things for you:

- 🖼 Cut and resize webapp icons
- ⚙️ Optimize icons with [Pngcrush](https://pmt.sourceforge.io/pngcrush/)
- 📋 Generete `manifest.json` file
- 📋 Generete `browserconfig.xml` file
- ✂️ Print tags to paste in the head tag of your web app

### Favicon support

- ✅ IE <= 10 with `/favicon.ico` file
- ✅ IE 11
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### Touch icons

Some mobile browsers allow users to bookmark the web page to their home screen. Manifestify support:

- Apple / Safari
- Opera Coast
- Android / Chrome
- Windows

### PWA

Manifestify generate a standard [manifest.json](https://developer.mozilla.org/en-US/docs/Web/Manifest) file for Progressive Web Apps.

## Install and Usage

```
npm install manifestify
manifestify --help
```

## Questions or problems?

If you have any issues please add an [issue on
GitHub](https://github.com/pioz/manifestify/issues) or fork the project and send a
pull request.

## Copyright

Copyright (c) 2020 [Enrico Pilotto (@pioz)](https://github.com/pioz). See
[LICENSE](https://github.com/pioz/manifestify/blob/master/LICENSE) for details.
