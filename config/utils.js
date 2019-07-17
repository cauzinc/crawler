const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')

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
                reject(error)
            } else {
                const $ = cheerio.load(body)
                resolve($)
            }
        })
    })
}


/** 
 * download image with Referer header info, return promise
*/
function downloadImageWithRefer(imgUrl, dir, filename, referer) {
    return new Promise((resolve, reject) => {
        if (!referer) {
            reject('need referer !')
        }
        request({
            url: imgUrl,
            method: 'GET',
            headers: {
                'Referer': referer,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15'
            }
        }).pipe()
    })
}




export default {
    getHtmlBodyByUrl
}

