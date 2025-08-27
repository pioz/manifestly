#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { Jimp } = require('jimp')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const pngToIco = require('png-to-ico').default
const potrace = require('potrace')
const { exec } = require('child_process')

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 -o FOLDER -i SQUARED_PNG_ICON_PATH -n APP_NAME')
  .config('config', () => {
    const configPath = path.resolve('.manifestly.json')
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    }
    return {}
  })
  .nargs('o', 1)
  .default('o', '.')
  .alias('o', 'output')
  .describe('o', 'Generete files in this folder. Should be the public folder of a webserver.')
  .nargs('i', 1)
  .demandOption('i')
  .alias('i', 'icon')
  .describe(
    'i',
    'Icon used to generate all icons: must be a square PNG icon with minimal size of 512x512 pixels. From this icon will be generated all other resized icons.'
  )
  .nargs('icon-background-color', 1)
  .describe('icon-background-color', 'Background color to apply on icons with transparent background.')
  .nargs('background-color', 1)
  .default('background-color', '#ffffff')
  .describe(
    'background-color',
    'The background_color member defines a placeholder background color for the application page to display before its stylesheet is loaded. This value is used by the user agent to draw the background color of a shortcut when the manifest is available before the stylesheet has loaded.'
  )
  .array('categories')
  .describe(
    'categories',
    'The categories member is an array of strings defining the names of categories that the application supposedly belongs to. There is no standard list of possible values, but the W3C maintains a list of known categories.'
  )
  .nargs('description', 1)
  .describe(
    'description',
    'The description member is a string in which developers can explain what the application does. description is directionality-capable, which means it can be displayed left to right or right to left based on the values of the dir and lang manifest members.'
  )
  .choices('dir', ['auto', 'ltr', 'rtl'])
  .describe(
    'dir',
    'The base direction in which to display direction-capable members of the manifest. Together with the lang member, it helps to correctly display right-to-left languages. The dir member can be set to one of the following values: auto (text direction is determined by the user agent), ltr (left to right), rtl (right to left).'
  )
  .choices('display', ['fullscreen', 'standalone', 'minimal-ui', 'browser'])
  .describe(
    'display',
    'The display member is a string that determines the developers’ preferred display mode for the website. The display mode changes how much of browser UI is shown to the user and can range from browser (when the full browser window is shown) to fullscreen (when the app is full-screened).'
  )
  .nargs('iarc-rating-id', 1)
  .describe(
    'iarc-rating-id',
    'The iarc_rating_id member is a string that represents the International Age Rating Coalition (IARC) certification code of the web application. It is intended to be used to determine which ages the web application is appropriate for.'
  )
  .nargs('lang', 1)
  .describe(
    'lang',
    "The lang member is a string containing a single language tag. It specifies the primary language for the values of the manifest's directionality-capable members, and together with dir determines their directionality."
  )
  .nargs('n', 1)
  .demandOption('n')
  .alias('n', 'name')
  .describe(
    'n',
    'The name member is a string that represents the name of the web application as it is usually displayed to the user (e.g., amongst a list of other applications, or as a label for an icon). name is directionality-capable, which means it can be displayed left-to-right or right-to-left based on the values of the dir and lang manifest members.'
  )
  .choices('orientation', [
    'any',
    'natural',
    'landscape',
    'landscape-primary',
    'landscape-secondary',
    'portrait',
    'portrait-primary',
    'portrait-secondary'
  ])
  .describe(
    'orientation',
    "The orientation member defines the default orientation for all the website's top-level browsing contexts."
  )
  .nargs('scope', 1)
  .describe(
    'scope',
    "The scope member is a string that defines the navigation scope of this web application's application context. It restricts what web pages can be viewed while the manifest is applied. If the user navigates outside the scope, it reverts to a normal web page inside a browser tab or window. If the scope is a relative URL, the base URL will be the URL of the manifest."
  )
  .nargs('short-name', 1)
  .describe(
    'short-name',
    'The short_name member is a string that represents the name of the web application displayed to the user if there is not enough space to display name (e.g., as a label for an icon on the phone home screen). short_name is directionality-capable, which means it can be displayed left-to-right or right-to-left based on the value of the dir and lang manifest members.'
  )
  .nargs('start-url', 1)
  .describe(
    'start-url',
    "The start_url member is a string that represents the start URL of the web application — the prefered URL that should be loaded when the user launches the web application (e.g., when the user taps on the web application's icon from a device's application menu or homescreen)."
  )
  .nargs('theme-color', 1)
  .default('theme-color', '#000000')
  .describe(
    'theme-color',
    "The theme_color member is a string that defines the default theme color for the application. This sometimes affects how the OS displays the site (e.g., on Android's task switcher, the theme color surrounds the site)."
  )
  .boolean('q')
  .alias('q', 'quiet')
  .describe('q', 'Do not print info on standard output.')
  .default('q', false)
  .example('$0 -o FOLDER -i ICON_PATH -n APP_NAME')
  .help()
  .parse()

const iconsConfig = [
  // Apple
  {
    file: '/icons/apple-icon-57x57.png',
    size: 57,
    type: 'image/png',
    head: 'apple-touch-icon',
    backgroundColor: true
  },
  {
    file: '/icons/apple-icon-72x72.png',
    size: 72,
    type: 'image/png',
    head: 'apple-touch-icon',
    backgroundColor: true
  },
  {
    file: '/icons/apple-icon-76x76.png',
    size: 76,
    type: 'image/png',
    head: 'apple-touch-icon',
    backgroundColor: true
  },
  {
    file: '/icons/apple-icon-114x114.png',
    size: 114,
    type: 'image/png',
    head: 'apple-touch-icon',
    backgroundColor: true
  },
  {
    file: '/icons/apple-icon-120x120.png',
    size: 120,
    type: 'image/png',
    head: 'apple-touch-icon',
    backgroundColor: true
  },
  {
    file: '/icons/apple-icon-144x144.png',
    size: 144,
    type: 'image/png',
    head: 'apple-touch-icon',
    backgroundColor: true
  },
  {
    file: '/icons/apple-icon-152x152.png',
    size: 152,
    type: 'image/png',
    head: 'apple-touch-icon',
    backgroundColor: true
  },
  {
    file: '/icons/apple-icon-180x180.png',
    size: 180,
    type: 'image/png',
    head: 'apple-touch-icon',
    backgroundColor: true
  },
  // Android
  {
    file: '/icons/android-icon-192x192.png',
    size: 192,
    type: 'image/png',
    head: 'icon',
    backgroundColor: true
  },
  // PWA
  {
    file: '/icons/pwa-icon-36x36.png',
    size: 36,
    type: 'image/png',
    manifest: true
  },
  {
    file: '/icons/pwa-icon-48x48.png',
    size: 48,
    type: 'image/png',
    manifest: true
  },
  {
    file: '/icons/pwa-icon-72x72.png',
    size: 72,
    type: 'image/png',
    manifest: true
  },
  {
    file: '/icons/pwa-icon-96x96.png',
    size: 96,
    type: 'image/png',
    manifest: true
  },
  {
    file: '/icons/pwa-icon-144x144.png',
    size: 144,
    type: 'image/png',
    manifest: true
  },
  {
    file: '/icons/pwa-icon-192x192.png',
    size: 192,
    type: 'image/png',
    manifest: true
  },
  {
    file: '/icons/pwa-icon-384x384.png',
    size: 384,
    type: 'image/png',
    manifest: true
  },
  {
    file: '/icons/pwa-icon-512x512.png',
    size: 512,
    type: 'image/png',
    manifest: true
  },
  // Microsoft
  {
    file: '/icons/ms-icon-70x70.png',
    size: 70,
    type: 'image/png',
    backgroundColor: true,
    browserconfig: true
  },
  {
    file: '/icons/ms-icon-150x150.png',
    size: 150,
    type: 'image/png',
    backgroundColor: true,
    browserconfig: true
  },
  {
    file: '/icons/ms-icon-310x310.png',
    size: 310,
    type: 'image/png',
    backgroundColor: true,
    browserconfig: true
  },
  // Favicons
  {
    file: '/icons/favicon-16x16.png',
    size: 16,
    type: 'image/png',
    head: 'icon'
  },
  {
    file: '/icons/favicon-32x32.png',
    size: 32,
    type: 'image/png',
    head: 'icon'
  },
  {
    file: '/icons/favicon-48x48.png',
    size: 48,
    type: 'image/png',
    head: 'icon'
  }
]

const checkPngcrush = () =>
  new Promise((resolve) => {
    exec('pngcrush --version', (error) => resolve(!error))
  })

const generateFavicon = (options) =>
  new Promise((resolve, reject) => {
    const outPath = path.join(options.o, 'favicon.ico')
    pngToIco(options.i)
      .then((buf) => {
        fs.writeFileSync(outPath, buf)
        resolve(buf)
      })
      .catch(reject)
  })

const generateSvg = (options) =>
  new Promise((resolve, reject) => {
    const outPath = path.join(options.o, '/icons/safari-pinned-tab-icon.svg')
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    potrace.trace(options.i, (err, svg) => {
      if (err) reject(err)
      else {
        fs.writeFileSync(outPath, svg)
        resolve(svg)
      }
    })
  })

const generateIcons = async (options) => {
  const pngcrushInstalled = await checkPngcrush()
  if (!pngcrushInstalled) {
    console.log('warn: pngcrush is not installed. Icons will not be optimized.')
  }

  const image = await Jimp.read(options.i)
  if (image.bitmap.width < 512 || image.bitmap.height < 512) {
    throw new Error('Image must be at least 512x512 pixels')
  }
  if (image.bitmap.width !== image.bitmap.height) {
    throw new Error('Image is not square')
  }

  let promises = [generateFavicon(options), generateSvg(options)]
  promises = promises.concat(
    iconsConfig.map((icon) => {
      return new Promise((resolve, reject) => {
        let clonedImage = image.clone()
        const size = icon.size
        const outPath = path.join(options.o, icon.file)
        clonedImage.resize({ w: size, h: size }) // nuova API
        if (icon.backgroundColor && options.iconBackgroundColor) {
          const bgImage = new Jimp({ width: size, height: size, color: options.iconBackgroundColor })
          clonedImage = bgImage.composite(clonedImage, 0, 0)
        }
        writeFile(clonedImage, outPath, pngcrushInstalled).then(resolve).catch(reject)
      })
    })
  )
  return Promise.all(promises)
}

const writeFile = async (image, outPath, optimize) => {
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  await image.write(outPath)

  if (optimize) {
    const command = `pngcrush -res 72 -reduce -brute -ow ${outPath} pngout-$$.png`
    return new Promise((resolve, reject) => {
      exec(command, (err) => {
        if (err) reject(err)
        else resolve(image)
      })
    })
  }

  return image
}

const writeErrorCallback = (err) => {
  if (err) throw err
}

const generateManifest = (options, iconsConfig) => {
  const manifest = { name: options.n }
  if (options.backgroundColor) manifest.background_color = options.backgroundColor
  if (options.categories) manifest.categories = options.categories
  if (options.description) manifest.description = options.description
  if (options.dir) manifest.dir = options.dir
  if (options.display) manifest.display = options.display
  if (options.iarcRatingId) manifest.iarc_rating_id = options.iarcRatingId
  if (options.lang) manifest.lang = options.lang
  if (options.orientation) manifest.orientation = options.orientation
  if (options.scope) manifest.scope = options.scope
  if (options.shortName) manifest.short_name = options.shortName
  if (options.startUrl) manifest.start_url = options.startUrl
  if (options.themeColor) manifest.theme_color = options.themeColor

  manifest.icons = iconsConfig.map((icon) => ({
    src: icon.file,
    sizes: `${icon.size}x${icon.size}`,
    type: icon.type
  }))

  const json = JSON.stringify(manifest, null, 2)
  const jsonPath = path.join(options.o, 'manifest.json')
  fs.writeFile(jsonPath, json, writeErrorCallback)
}

const generateBrowserconfig = (options, icons) => {
  const iconsTags = icons.map((icon) => `<square${icon.size}x${icon.size}logo src="${icon.file}"/>`)

  // https://msdn.microsoft.com/en-us/library/ie/dn455106.aspx
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      ${iconsTags.join('\n      ')}
      <TileColor>${options.themeColor}</TileColor>
    </tile>
  </msapplication>
</browserconfig>`
  const xmlPath = path.join(options.o, 'browserconfig.xml')
  fs.writeFile(xmlPath, xml, writeErrorCallback)
}

const generateHeaderTags = (options, iconsConfig) => {
  let header = [
    '<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover" />',
    `<meta name="application-name" content="${options.n}" />`,
    `<meta name="theme-color" content="${options.themeColor}" />`,
    '<meta name="mobile-web-app-capable" content="yes" />',
    '<meta name="apple-mobile-web-app-capable" content="yes" />',
    '<meta name="apple-mobile-web-app-status-bar-style" content="default" />',
    `<meta name="apple-mobile-web-app-title" content="${options.n}" />`,
    '<meta name="format-detection" content="telephone=no" />',
    `<meta name="msapplication-TileColor" content="${options.themeColor}" />`,
    '<meta name="msapplication-TileImage" content="/icons/ms-icon-150x150.png" />',
    '<meta name="msapplication-config" content="/browserconfig.xml" />',
    '<meta name="msapplication-tap-highlight" content="no" />'
  ]
  const iconBackgroundColor = options.iconBackgroundColor || '#ffffff'
  header = header.concat([
    `<link rel="mask-icon" href="/icons/safari-pinned-tab-icon.svg" color="${iconBackgroundColor}" />`
  ])
  header = header.concat(
    iconsConfig
      .filter((icon) => icon.head)
      .map(
        (icon) =>
          `<link rel="${icon.head}" href="${icon.file}" type="${icon.type}" sizes="${icon.size}x${icon.size}" />`
      )
  )
  header = header.concat(['<link rel="manifest" href="/manifest.json" />'])
  return header.join('\n')
}

// START HERE

const main = async () => {
  if (!argv.q) console.log('🖼 Generating icons ...')
  try {
    await generateIcons(argv)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  if (!argv.q) console.log('📋 Generating manifest.json ...')
  generateManifest(
    argv,
    iconsConfig.filter((icon) => icon.manifest)
  )

  if (!argv.q) console.log('📋 Generating browserconfig.xml ...')
  generateBrowserconfig(
    argv,
    iconsConfig.filter((icon) => icon.browserconfig)
  )

  if (!argv.q) {
    console.log('🎉 All done!')
    console.log('\nNow copy this tags inside the <head> tag of your application:')
    console.log('<!-- -------------------- Manifestly head tags begin -------------------- -->')
    console.log(
      generateHeaderTags(
        argv,
        iconsConfig.filter((icon) => icon.head)
      )
    )
    console.log('<!-- --------------------- Manifestly head tags end --------------------- -->')
  }
}

main()
