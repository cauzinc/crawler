const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')
const { downloadVideoWithRefer, getHtmlBodyByUrl } = require('../utils')

async function download(index, filename) {
    const baseUrl = 'http://xn--cckl0itdpc9763ahlyc.tv/archives'
    const $ = await getHtmlBodyByUrl(baseUrl, index)
    let video = $('#my-video source');
    let src = video.attr('src');
    console.log('src', src)
    if (!src) {
        console.log('error! no src!')
        return 
    }
    downloadVideoWithRefer(
        src,
        './',
        filename,
        `${baseUrl}/${index}`
    )
}

// downloadVideoWithRefer(
//     'https://zozovideo.com/wp-content/uploads/2019/06/%E6%A1%9C%E5%AE%AE%E5%A7%89%E5%A6%B9%E3%81%AE%E3%83%8D%E3%83%88%E3%83%A9%E3%83%AC%E8%A8%98%E9%8C%B2-1.mp4',
//     './',
//     'test.mp4',
//     'http://xn--cckl0itdpc9763ahlyc.tv/archives/2991'
// )

download(380, `蠱惑の刻--腹ボテクール・雪乃～恥蜜に溢れる緩んだ恥穴.mp4`)