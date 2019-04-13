const {productionHost} = require('../config/config.js')
const url = require('url')
const description = 'A site for fawning over random pics kitty cats! 📷 😸' // eslint-diable-line max-len

// NOTE: This file is included in client. Don't put secrets in here. They go in keys.js

const siteMeta = {
    name: 'Recat',
    short_name: 'Recat', // eslint-disable-line camelcase
    title: {
        default: 'Recat by Jacob Smith',
    },
    display: 'standalone',
    start_url: '/', // eslint-disable-line camelcase
    description,
    color: '#3ed3cf',
    og: {
        description,
        image: {
            src: url.resolve(productionHost, '/static/meta/og-image.jpg'),
            width: '279',
            height: '279',
        },
        type: 'website',
    },
    twitter: {
        creator: '@limeandcoconut',
        image: {
            src: url.resolve(productionHost, '/static/meta/og-image.jpg'),
            alt: 'Smiling Cat Face With Heart-eyes Emoji',
        },
        card: 'summary_large_image',
    },
    // Must be served with mimetype application/manifest+json
    manifest: '/static/manifest.json',
    favicons: [
        {
            src: '/favicon.ico',
            key: 'default',
        },
        {
            src: '/static/meta/favicon-32x32.png',
            key: 'x32',
        },
        {
            src: '/static/meta/favicon-16x16.png',
            key: 'x16',
        },
        {
            src: '/static/meta/mstile-144x144.png',
            key: 'ms',
        },
        {
            src: '/static/meta/apple-touch-icon.png',
            key: 'apple',
        },
        {
            src: '/static/meta/safari-pinned-tab.svg',
            key: 'safariMask',
        },
    ],
    // These are joined with paths.sharedMeta in webpack so that
    // path, paths, and subsequently fs are not included on client where this is used
    // This is used by webpack to copy assets which aren't required in
    copyMeta: [
        {
            from: '/favicon.ico',
            to: 'served_from_root/',
        },
        {
            from: '/favicon-32x32.png',
            to: 'meta',
        },
        {
            from: '/favicon-16x16.png',
            to: 'meta',
        },
        {
            from: '/mstile-150x150.png',
            to: 'meta',
        },
        {
            from: '/mstile-144x144.png',
            to: 'meta',
        },
        {
            from: '/apple-touch-icon.png',
            to: 'meta',
        },
        {
            from: '/safari-pinned-tab.svg',
            to: 'meta',
        },
        {
            from: '/og-image.jpg',
            to: 'meta',
        },
        {
            from: '/twitter-image.png',
            to: 'meta',
        },
        {
            from: '/browserconfig.xml',
            to: 'served_from_root/',
        },
    ],
    // Used in asset generation
    manifestIcons: [
        {
            src: '/android-chrome-512x512.png',
            sizes: [72, 96, 128, 144, 152, 192, 384, 512],
            destination: '/meta',
        },
    ],
    cacheBust: '?v=0',
}

// Cache cacheBust
// C-C-C-COMBO BREAKER!
siteMeta.favicons = siteMeta.favicons.reduce((favicons, {key, src}) => {
    favicons[key] = src + siteMeta.cacheBust
    return favicons
}, {})
siteMeta.manifest += siteMeta.cacheBust
siteMeta.twitter.image.src += siteMeta.cacheBust
siteMeta.og.image.src += siteMeta.cacheBust

module.exports = siteMeta
