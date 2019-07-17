const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')


function requestUrl(index) {
    return new Promise((resolve, reject) => {
        request(`http://xn--cckl0itdpc9763ahlyc.tv/archives/${index}`, (error, res, body) => {
            if (error) {
                console.log(error)
                reject(false)
            } else {

            }
        })


    })
}