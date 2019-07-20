const request = require('request')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const { recursionMkdir, IMAGE_DIR, VIDEO_DIR } = require('../config/paths')
const httpConfig = require('../config/httpConfig')
const streamDownload = require('./StreamDownload')

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
    let writeStream = fs.createWriteStream(`${fileDir}/${filename}`)

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
                ...httpConfig.httpHeaders
            }
        }).pipe(writeStream)
        resolve(true)
    })
}

async function downloadVideoWithRefer(videoUrl, dir, filename, referer) {
    let fileDir = path.resolve(VIDEO_DIR, dir)
    let result = await recursionMkdir(fileDir)
    return new Promise((resolve, reject) => {
        if (!referer) {
            return resolve('need referer !')
        }
        if (!result) {
            return resolve('make dir error!')
        }
        streamDownload.downloadFile({
           filename,
           fileDir
        }, {
            fileUrl: videoUrl,
            headers: {
                'Referer': referer,
                ...httpConfig.httpHeaders
            }
        }, (status, percentage) => {
            console.log(`${status}: ${percentage}`)
        })
        resolve(true)
    })
}

module.exports =  {
    getHtmlBodyByUrl,
    downloadImageWithRefer,
    downloadVideoWithRefer
}

