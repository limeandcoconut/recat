const Sitemap = require('sitemap')
const fs = require('fs')

const sitemap = Sitemap.createSitemap({
    hostname: 'http://recat.jacobsmith.tech',
    // cacheTime: 600000, // 600 sec (10 min) cache purge period
    urls: [
        {
            url: '/',
            priority: 1,
            lastmodrealtime: true,
        },
        {
            url: '/login',
            // changefreq: 'weekly',
            priority: 0.8,
            lastmodrealtime: true,
        },
        {
            url: '/register',
            // changefreq: 'weekly',
            priority: 0.8,
            lastmodrealtime: true,
        }, /* useful to monitor template content files instead of generated static files */
        {
            url: '/favorite',
            // changefreq: 'weekly',
            priority: 0.8,
            lastmodrealtime: true,
        }, /* useful to monitor template content files instead of generated static files */
    ],
})

fs.writeFileSync('sitemap.xml', sitemap.toString())
