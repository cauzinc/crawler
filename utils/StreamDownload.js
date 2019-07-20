const path = require('path')
const fs = require('fs')
const request = require('request')

function StreamDownload() {
    // 获取下载进度的回调
    this.downloadCallback = null
}

// download progress
StreamDownload.prototype.showProgress = function(receivedData, totalData) {
    const percentage = (receivedData * 100 / totalData)
    typeof this.downloadCallback === 'function' && this.downloadCallback('progress', percentage)
}

StreamDownload.prototype.downloadFile = function(fileInfo, httpInfo, callback) {
    const { filename, fileDir } = fileInfo
    const { fileUrl, headers = {} } = httpInfo
    this.downloadCallback = callback
    let receivedBytes = 0
    let totalBytes = 0
    const req = request({
        method: 'GET',
        url: fileUrl,
        headers
    })
    const out = fs.createWriteStream(`${fileDir}/${filename}`)
    req.pipe(out)
    
    // 收到请求时，获取文件总大小
    req.on('response', (response) => {
        totalBytes = parseInt(response.headers['content-length'])
        console.log(`File size: ${totalBytes / 1024 / 1024}MB`)
    })
    // 更新进度
    req.on('data', (chunk) => {
        receivedBytes += chunk.length
        this.showProgress(receivedBytes, totalBytes)
    })

    req.on('end', () => {
        this.downloadCallback('finished', 100)
    })
}

const streamDownload = new StreamDownload()

module.exports = streamDownload

