/* eslint-disable max-len */
const description = 'A site for fawning over random pics kitty cats! 📷 😸 Come check it out, or add it to your home screen, it\'s progressive and reactive!'
/* eslint-disable camelcase */
const siteMeta = {
    name: 'Recat',
    short_name: 'Recat',
    title: {
        default: 'Recat by Jacob Smith',
    },
    display: 'standalone',
    start_url: '/',
    description,
    color: '#3ed3cf',
    og: {
        description,
        image: {
            src: '/og-image.jpg',
            width: '279',
            height: '279',
        },
        type: 'website',
    },
    twitter: {
        creator: '@limeandcoconut',
        image: {
            src: '/meta/og-image.jpg',
            alt: 'Smiling Cat Face With Heart-eyes Emoji',
        },
        card: 'summary_large_image',
    },
    // Must be served with application/manifest+json
    manifest: '/static/manifest.json',
    favicons: [
        {
            src: '/favicon.ico',
            key: 'default',
        },
        {
            src: '/meta/favicon-32x32.png',
            key: 'x32',
        },
        {
            src: '/meta/favicon-16x16.png',
            key: 'x16',
        },
        {
            src: '/meta/mstile-144x144.png',
            key: 'ms',
        },
        {
            src: '/meta/apple-touch-icon.png',
            key: 'apple',
        },
        {
            src: '/meta/safari-pinned-tab.svg',
            key: 'safariMask',
        },
    ],
    // These are joined with paths.sharedMeta in webpack so that
    // path, paths, and subsequently fs are not included on client where this is use
    copyMeta: [
        {
            from: '/favicon.ico',
            to: '../',
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
            from: '/browserconfig.xml',
            to: '../',
        },
    ],
    manifestIcons: [
        {
            src: '/android-chrome-512x512.png',
            sizes: [72, 96, 128, 144, 152, 192, 384, 512],
            destination: '/meta',
        },
    ],
    cacheBust: '?v=0',
}

siteMeta.favicons = siteMeta.favicons.reduce((favicons, {key, src}) => {
    favicons[key] = src + siteMeta.cacheBust
    return favicons
}, {})
siteMeta.manifest += siteMeta.cacheBust
siteMeta.twitter.image.src += siteMeta.cacheBust
siteMeta.og.image.src += siteMeta.cacheBust

module.exports = siteMeta
