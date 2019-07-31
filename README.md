# [![100 on all Google Lighthouse tests](/src/shared/assets/meta/og-image.jpg)](https://recat.jacobsmith.tech)

## Overview
This is a progressive web app that pulls pictures of cats from a public endpoint and serves them randomly to the user. It was created as an example for a job application so there are some rather ham handed caveats where I did things the "less easy" way for fun and to serve as an example of a more complex flow.

Users are required to register and login. They'll be served random cat images and can chosse a favorite.

Postgres handles users and their favorite images. Sessions are encrypted and saved in redis.

Images are pulled from https://aws.random.cat/meow - a super secret endpoint. I'm pretending that the endpoint is private to justify adding auth to this project. Also pretending that the endpoint is using some super secret special sauce to choose which images it returns. This is to justify not pulling its entire db, converting them to webp, brotli compressing them, and serving them myself. So, on request, the app pulls images from a prepared random list for the user and requests a new image from the api. Images will be downloaded, converted to webp, brotli compressed, and saved. If any part of this has already been done the app will pick the appropriate image path from disk and refresh the list with that.

Images are served as data not static urls so that they're not exposed to the client.

Static files are served with Nginx. 

HAProxy is the tls terminator and reverse proxy.

[Live demo](https://recat.jacobsmith.tech)

## Features
-   Chops
    -   💯 100 on all Google Lighthouse tests
        <details>
        <summary>Awwwww yeeeeah!
        </summary>  
        <br>  

        ![100 on all Google Lighthouse tests]
        </details>  
    -   🔥 Lots of sweet sweet Webpack 4 sauce
    -   📱 PWA
    -   🦄 SSR + CSR
    -   😎 Brotli compression
    -   👌 Font preload and preconnecting with local fallbacks
    -   🐦 Sweeet OG and Twitter meta

-   Setup
    -   🔥 Babel 7
    <br>

    -   ⚛ React 16
    -   ✅ Hot Module Reloading (HMR)
    -   ✅ Less modules
    -   ✅ PostCSS
    -   ✅ Redux + Redux Saga
    -   ✅ Immer
    -   ✅ React Router 4
    -   ✅ React Helmet
    -   ✅ Webp converion
    -   ✅ Checkout `doiuse` in [postcss.config.js](/postcss.config.js) 👀

## Getting started
1. Clone the project and npm install. 
1. Then run `config/init.sh`
    > The project pulls images from an api and saves them to disk. It needs to be seeded with 5 or you will get an error. If you don't want the images seeded by `init.sh` for some reason simply restart the app on error until 5 have suceessfully been pulled.
1. Change `config/db.env` and `config/keys.js` to have your own values.
1. `$ docker-compose up -d` to start haproxy, nginx, postgres, and redis.
1. `$ node config/initdb.js` to init postgres.
1. `$ npm run start` for development, `$ npm run build && npm run start:prod-test` for production [[1]](#1)
    > In production I'm using [pm2] 

    <a class="" id="1">[[1]](#1): Issues with cwebp or related modules? See [Troubleshooting](#troubleshooting).</a>

## Configuration
There are several critical configuration files: 

config  <br>
├ ... <br>
├ config.js <br>
├ env.js <br>
├ meta.js <br>
├ paths.js <br>
├ keys.js <br>
└ db.env <br>

`config.js`: Google Analytics tracking id's and similar non-sensitive configuration values. This file is exposed to the client  
`env.js`: `process.env` variables and the like. [There's a section on them.](#env-variables)  
`meta.js`: Site meta information. From here values are injected into the head and pwa manifest, and icons are generated. This file is exposed to the client.  
`paths.js`: Paths useful for the project. This file is not exposed to the client in part to keep `fs` from being required there.  
`keys.js`: Database passwords and other critical info. **This file is not exposed to the client**  
`db.env`: Database passwords. **This file is not exposed to the client**

### env variables

There are a few `process.env' variables in use.

`NODE_ENV`: Set `NODE_ENV=development` for development or `NODE_ENV=production` for production.

`OMIT_SOURCEMAP`: Omits sourcemaps when `true`

`GEN_HTML`: Uses puppeteer to generate static html when set to `true`

`LITE_BUILD`: Prevents webpack compression, file copy, and image conversion plugins for a quick production build test when `true`.

`MUTE_PACK`: Turns off warnings and console highlighting sugar if `true`

`PORT`: Specifies a port other than the default of `:8500`

`HOST`: Almost unnecessary. Specifies a different host for logging and static html.

`LIVE_GA`: Uses live analytics id if and only if `true`

## Scripts

`start`: Start the app in development mode. With HMR for client and webpack watching the server.

`build`: Do a production build of the site.

`build:nomap`: Build without sourcemaps.

`build:with-html`: Build generate static html.

`build:lite`: Build without heavier production plugins for a quick test. 💯Calories only!

`build:stats`: Output build to `bundle-stats.json` for bundle analysis.

`start:prod-test`: Start the production server. (I suggest [pm2] for production)

`start:analyzer`: Start the bundle analyzer.

`analyze`: `"npm run build:stats && npm run start:analyzer"`

`logs:all`: Query winston logs.

`init:db`: Init the db. Do this after creating the postgres docker container.

`init:clean`: Remove seeded images generated by `init.sh`


## Certs
Certs are kept in the `certs` directory. I generate them with (and maintain) [auto-dns-certs].

## Serving
HAProxy is the tls terminator and reverse proxy. Some files are proxied to a different directory so that they can be served from the site root. The config is well documented and covers it pretty nicely.

Nginx serves static files for production.

## Troubleshooting 

### cwebp, imagemin, webp-converter

If you have issues building the project on linux.
(This is tested on Ubuntu 18.4 YMMV 🤷‍♀️)
<details>
<summary>Something like this:</summary>
<code>

       [ { Error: spawn /<project_dir>/node_modules/cwebp-bin/vendor/cwebp ENOENT
          at Process.ChildProcess._handle.onexit (internal/child_process.js:246:19)
          at onErrorNT (internal/child_process.js:427:16)
          at processTicksAndRejections (internal/process/next_tick.js:76:17)
        errno: 'ENOENT',
        code: 'ENOENT',
        syscall: 'spawn /<project_dir>/node_modules/cwebp-bin/vendor/cwebp',
        path: '/<project_dir>/node_modules/cwebp-bin/vendor/cwebp',
        spawnargs:
         [ '-quiet',
           '-mt',
           '-q',
           90,
           '-o',
           '/tmp/ce444de0-1090-44b7-ad1a-dbfb4dea601a',
           '/tmp/8f80d4e2-a1bf-460b-9793-2af2a1a85788' ],
        killed: false,
        stdout: '',
        stderr: '',
        failed: true,
        signal: null,
        cmd:
         '/<project_dir>/node_modules/cwebp-bin/vendor/cwebp -quiet -mt -q 90 -o /tmp/ce444de0-1090-44b7-ad1a-dbfb4dea601a /tmp/8f80d4e2-a1bf-460b-9793-2af2a1a85788',
        timedOut: false },
      Error: ImageminWebpWebpackPlugin: "assets/cat-bg.c7a95638.jpg" wasn't converted!
          at imagemin.buffer.then.catch.err (/<project_dir>/node_modules/imagemin-webp-webpack-plugin/plugin.js:56:45) ]

</code>

**Note the line** `Error: spawn /<project_dir>/node_modules/cwebp-bin/vendor/cwebp ENOENT`

</details>
<br>

Then you'll need to install system sub-dependencies 🎉

1. See the **"Note (for Linux and Mac OS X)"** section of the [Google docs](https://developers.google.com/speed/webp/docs/precompiled#getting_cwebp_dwebp_and_the_webp_libraries). Step 1 will have you install these deps:

    ```sh
    $ sudo apt-get update
    $ sudo apt-get install libjpeg-dev libpng-dev libtiff-dev libgif-dev
    ```

    You don't need to complete Google's Step 2 because node-gyp is making cwebp for you.

1. `$ rm -rf node_modules` and `npm i`
1. `$ npm run build`
1. `$ npm run start:prod-test`

1. On Ubuntu (18.4) you may still run into trouble. Try and flip through some images in the app then check logs with `npm run logs:all`. **If that worked smoothly you are done 🎉**. If `webp-converter` is still not working or if you see an error like below you'll need more deps. Continue to the next step.

    <details>
    <summary>e.g.</summary>
    <code>

        -q 90 -v <input_file>.jpg -o <output_file>.jpg.webp
        101 { Error: Command failed: /<project_dir>/node_modules/webp-converter/lib/libwebp_linux/bin/cwebp -q 90 -v <input_file>.jpg -o <output_file>.jpg.webp
        /<project_dir>/node_modules/webp-converter/lib/libwebp_linux/bin/cwebp: error while loading shared libraries: libXi.so.6: cannot open shared object file: No such file or directory

            at ChildProcess.exithandler (child_process.js:297:12)
            at ChildProcess.emit (events.js:193:13)
            at maybeClose (internal/child_process.js:1001:16)
            at Process.ChildProcess._handle.onexit (internal/child_process.js:266:5)
        killed: false,
        code: 127,
        signal: null,
        cmd:
        '/<project_dir>/node_modules/webp-converter/lib/libwebp_linux/bin/cwebp -q 90 -v <input_file>.jpg -o <output_file>.jpg.webp' }

    </code>

    **Note the line:** `cwebp: error while loading shared libraries: libXi.so.6: cannot open shared object file: No such file or directory`

    </details>
    <br>

1. If you have issues with `libGL.so.1` install this[[2]](https://github.com/conda-forge/pygridgen-feedstock/issues/10):

    ```sh
    $ sudo apt-get install libgl1-mesa-glx
    ```

    Then reinstall your node_modules like above and test again.
1. If you're having issues with `libXi.so.6` install[[3]](https://packages.ubuntu.com/cosmic/libxi6):

    ```sh
    $ sudo apt-get install libxi6
    ```

    Then reinstall your node_modules like above and test again.


**misc:**

https://www.centos.org/forums/viewtopic.php?t=49932

[auto-dns-certs]: https://github.com/briancw/auto-dns-certs
[pm2]: https://www.npmjs.com/package/pm2
[100 on all Google Lighthouse tests]: /resources/lighthouse.gif

## Caveats

As mentioned there are "ham handed caveats where I did things the 'less easy' way for fun and to serve as an example of a more complex flow." 

Along these lines, I started a few weeks ago, as of this writing, with functionally zero react knowledge and tackled this as a "fail-faster" scenario. Thus: no tests yet. They'll come sometime and my next react project will include them from the beginning given that it won't be 100% exploration.

Oh, yeah, and styles are fairly brittle. I'd avoid ipads in portrait mode for a bit. It'll take a few days of tweaking to nail things down to my ace standards and I'm too tired to do it tonight. 🤙

There's some [rubbish](https://github.com/webpack/webpack/issues/4719) with weback output files and `[chunkhash]` not working when prefetching with magic comments. tl;dr:
```js
// Gotta use
chunkFilename: '[id].chunk.js',
// Not
chunkFilename: '[name].[chunkhash:8].chunk.js',
// For now 😤
```

## TODOS:
- [ ] **Ensure that dependabot didn't break anything** <br>
- [ ] Fix the `'unsafe-inline'` in the csp with hashes <br>
- [ ] Write them tests  <br>
- [ ] Continuous integration <br>
- [ ] Add @throws to jodocs <br>
- [ ] Add @module to jsdocs <br>
- [ ] Switch to fastify 🐯 <br>
- [ ] Start a changelog <br>
- [ ] Add aria-attributes <br>
- [ ] Flush out desktop styles <br>
- [ ] Safari test <br>
- [ ] IOS test  <br>
- [ ] Add structured data of some kind <br>
- [ ] Dockerize cwebp??? <br>
- [ ] Figure out why webpack resolvers are broken in less <br>
- [ ] Checkout the occasional error where winston logs without transports (I think it's related to async processes) <br>
- [ ] Password reset <br>
- [ ] 429 auth routes <br>
- [ ] Think about password topologies <br>
- [ ] Consider switch to standard redis container <br>
- [ ] Look at using the writeFilesToDisk flag instead of write-files-plugin <br>
- [ ] Fix sourcemaps in less (are they even broken?) <br>
- [ ] [Exclude dev deps in webpack???](https://til.hashrocket.com/posts/ivze1rk2ey-speed-up-webpacker-by-excluding-dev-dependencies) <br>
- [ ] Consider defining process.env.PRODUCTION_FLAG so we're not doing string testing all the time - DEVELOPMENT_FLAG too. <br>

- [ ] Change ga id in keys <br>
- [ ] Turn on hsts <br>


## Credits

Based off [react-ssr-setup](https://github.com/manuelbieh/react-ssr-setup) by [Manuel Bieh](http://www.manuelbieh.de)

## Feedback ✉️

[Website 🌐](https://jacobsmith.tech)

[js@jacobsmith.tech](mailto:js@jacobsmith.tech)

[https://github.com/limeandcoconut](https://github.com/limeandcoconut)

[@limeandcoconut 🐦](https://twitter.com/limeandcoconut)

Cheers!

## License

ISC, see [LICENSE](/LICENSE) for details.
