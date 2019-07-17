const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')


function requestUrl(index, mangaNo) {
    return new Promise((reslove, reject) => {
        request(`https://18h.animezilla.com/manga/${mangaNo}/${index}`, function(error, res, body) {
            if(error) {
                console.log(error)
                reslove(false)
            } else {
                const $ = cheerio.load(body)
                var img = $('#comic');
                var src = '';
                if(img) {
                    src = img.attr('src');
                    console.log(src);
                    request({
                        url: src,
                        method: 'GET',
                        headers: {
                            'Referer': `https://18h.animezilla.com/manga/${mangaNo}/${index}`,
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15'
                        }
                    }).pipe(fs.createWriteStream(`../assets/img/${index}.jpg`))
                    // request(src).pipe(fs.createWriteStream(`./img/${index}.jpg`))
                } else {
                    console.log('no src', img);
                }
                reslove({ src, img })
            }
        })
    })
}

async function run(pageCount, mangaNo) {
    let go = true;
    let count = 1;
    while(go) {
        let result = await requestUrl(count, mangaNo)
        if(count >= pageCount) {
            go = false
        } else {
            console.log(`-----------count ${count}------------`)
            count++;
        }
    }
}
let pageCount = 202
let no = 827

run(pageCount, no);
// requestUrl(12)