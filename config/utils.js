const request = require('request')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const { recursionMkdir, IMAGE_DIR } = require('./paths')

/**
 * get html body, return promise 
 * @param base base url
 * @param index params xin the end of url
*/
function getHtmlBodyByUrl(base, index) {
    const url = typeof index === 'undefined' ? base : `${base}/${index}`
    return new Promise((resolve, reject) => {
        request(url, (error, res, body) => {
            if (error) {
                console.log('error in request', error)
                resolve(false)
            } else {
                const $ = cheerio.load(body)
                resolve($)
            }
        })
    })
}

/** 
 * download image with Referer header info, return promise
 * @param imgUrl 
 * @param dir './comic_1'
 * @param filename '1.jpg'
 * @param referer
*/
async function downloadImageWithRefer(imgUrl, dir, filename, referer) {
    let fileDir = path.resolve(IMAGE_DIR, dir)
    let result = await recursionMkdir(fileDir)
    return new Promise((resolve, reject) => {
        if (!referer) {
            return resolve('need referer !')
        }
        if (!result) {
            return resolve('make dir error!')
        }
        request({
            url: imgUrl,
            method: 'GET',
            headers: {
                'Referer': referer,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15'
            }
        }).pipe(fs.createWriteStream(`${fileDir}/${filename}`))
        resolve(true)
    })
}

module.exports =  {
    getHtmlBodyByUrl,
    downloadImageWithRefer
}

