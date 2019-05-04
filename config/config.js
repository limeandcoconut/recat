// Update this url in ./meta.js too. It saves 20K from the bundles by doing it manually.
const productionHost = 'https://recat.jacobsmith.tech'
const gaDevID = 'UA-137352311-1'
const gaProductionID = 'UA-137369627-1'

// NOTE: This file is included in client. Don't put secrets in here. They go in keys.js
module.exports = {
    productionHost,
    gaID: process.env.LIVE_GA === 'true' ? gaProductionID : gaDevID,
}
