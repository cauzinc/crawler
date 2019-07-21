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

download(380, `蠱惑の刻--腹ボテクール・雪乃～恥蜜に溢れる緩んだ恥穴.mp4`)