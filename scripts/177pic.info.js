const cheerio = require('cheerio')
const { getHtmlBodyByUrl, downloadImageWithRefer } = require('../utils')

let imgIndex = 1

async function getTargetUrl(baseUrl, dir) {
    const $ = await getHtmlBodyByUrl(baseUrl)
    const picList = $('.single-content p').find('noscript')
    let picLength = picList.length

    console.log('picLength', picLength)
    for (let i = 0; i < picLength ; i++) {
        let noscriptHtml = picList[i].children[0].data
        let body = cheerio.load(noscriptHtml)
        let img = body('img') 
        let src = img.attr('src')
        if (src) {
            console.timeLog('src', imgIndex, src)
            let filename = `${imgIndex}.jpg`
            await downloadImageWithRefer(src, dir, filename, baseUrl)  
            imgIndex++
        }
    }
    return new Promise((resolve, reject) => {
        resolve(true)
    })
}


async function run(url, page, dir) {
    let pageCount = 1;
    for (; pageCount < page; pageCount++) {
        console.log(`----------pageCount${pageCount}----------`)
        let baseUrl = pageCount === 1 ?  url : `${url}/${pageCount}/`
        await getTargetUrl(baseUrl, dir)
    }
}
const url = 'http://www.177pic.info/html/2019/04/2844004.html'
const dir = './[サイクロン (和泉、冷泉)] 彼とわたしと店長の深夜勤務 1+2[118P]'
const page = 12

run(url, page, dir)

