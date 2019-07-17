const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')


request('https://play.google.com/store/apps/details?id=com.nianticlabs.pokemongo&hl=zh_CN', function(error, res, body) {
    console.log('error:', error);
    console.log('statusCode:', res && res.statusCode);
    const $ = cheerio.load(body)
    console.log('body:', $)
})