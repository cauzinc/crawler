const request = require('request');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { recursionMkdir, IMAGE_DIR, VIDEO_DIR } = require('../config/paths');
const httpConfig = require('../config/httpConfig');
const streamDownload = require('./StreamDownload');

/**
 * get html body, return promise
 * @param base base url
 * @param index params xin the end of url
*/
function getHtmlBodyByUrl(base, index) {
  const url = typeof index === 'undefined' ? base : `${base}/${index}`;
  return new Promise((resolve) => {
    request(url, (error, res, body) => {
      if (error) {
        console.log('error in request', error);
        resolve(false);
      } else {
        const $ = cheerio.load(body);
        resolve($);
      }
    });
  });
}

/**
 * download image with Referer header info, return promise
 * @param imgUrl
 * @param dir './comic_1'
 * @param filename '1.jpg'
 * @param referer
*/
async function downloadImageWithRefer(imgUrl, dir, filename, referer) {
  const fileDir = path.resolve(IMAGE_DIR, dir);
  const result = await recursionMkdir(fileDir);
  const writeStream = fs.createWriteStream(`${fileDir}/${filename}`);

  return new Promise((resolve) => {
    if (!referer) {
      return resolve('need referer !');
    }
    if (!result) {
      return resolve('make dir error!');
    }
    const req = request({
      url: imgUrl,
      method: 'GET',
      headers: {
        Referer: referer,
        ...httpConfig.httpHeaders,
      },
    });
    req.pipe(writeStream);
    req.on('end', () => {
      console.log('download success', imgUrl);
      resolve(true);
    });
  });
}

async function downloadVideoWithRefer(videoUrl, dir, filename, referer) {
  const fileDir = path.resolve(VIDEO_DIR, dir);
  const result = await recursionMkdir(fileDir);
  return new Promise((resolve) => {
    if (!referer) {
      return resolve('need referer !');
    }
    if (!result) {
      return resolve('make dir error!');
    }
    streamDownload.downloadFile({
      filename,
      fileDir,
    }, {
      fileUrl: videoUrl,
      headers: {
        Referer: referer,
        ...httpConfig.httpHeaders,
      },
    }, (status, percentage) => {
      console.log(`${status}: ${percentage}`);
    });
    resolve(true);
  });
}

/**
 * @param {funcArr} funcArr array of function that returns a promise
 * reduce 的第二个参数为默认值，第一次执行时取Promise.resolve()第一个prev
 * next() 返回一个promise对象，作为下一次执行的prev
 */
async function executeSyncPromises(funcArr) {
  return new Promise((resolve) => {
    funcArr.reduce((prev, next, index) => {
      if (index === funcArr.length - 1) {
        return prev.then(() => {
          next();
          resolve(true);
        });
      }
      return prev.then(() => next());
    }, Promise.resolve());
    // resolve(true);
  });
}

module.exports = {
  getHtmlBodyByUrl,
  downloadImageWithRefer,
  downloadVideoWithRefer,
  executeSyncPromises
};
