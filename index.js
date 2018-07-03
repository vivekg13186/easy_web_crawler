/**
 * config object
 * {
 *      start_urls: [], list of url to start with
 *      allow_urls: [], list of regular expession ,only the urls matching the pattern are opened and processed
 *      run_spider: false, (default false)if the flag set to yes crawler automatically extarct the links form the page and add it to the queue(only if it matches above rule)
 *      delay :100,(default 0ms) wait before loading new page (in milliseconds)
 *      data_extract: [
        {
            pattern: <<regexp>>, crawler call the below function if the url matched the pattern 
            fun: async function (page) {
                page   - puppeteer page object 
                additional  function
                    page.add_url_to_queue(url) - add url to queue for processing
                    page.download_file(url,filename) - download file like image pdf etc  ...
                    page.write_text_to_file(content, filename) - write text content to file
            }
        }
    ]
 * }
 */
var puppeteer = require('puppeteer');
var fs = require('fs');
var mm = require('micromatch');
const { spawn } = require('child_process');
const delay = require('delay');

function match(pattern, url) {
    return mm.isMatch(url, pattern)
}

var ideal_counter=0;

async function crawler(config) {
    var url_queue = config.start_urls ? config.start_urls : [];
    var finished_url_queue = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    page.add_urls_to_queue = function (urls) {
    
        for (i in urls) {
            
            page.add_url_to_queue(urls[i])
        }
    }

    page.add_url_to_queue = function (url) {
        if (url) {
            if(url.endsWith("#") || url.endsWith("/")){
                url = url.substring(0,url.length-1)
            }
            if (url_queue.indexOf(url) == -1 && finished_url_queue.indexOf(url) == -1) {
                for(i in config.allow_urls){
                    var reg_exp = config.allow_urls[i]
                    if(url.match(reg_exp)){
                        url_queue.push(url)
                        console.log(" url added ",url)
                    }
                }
            }
        }
    }

    page.download_file = function (url, filename) {
        spawn('wget', ['-o', filename, url]);
    }

    page.write_text_to_file = function (content, filename) {
        fs.writeFile(filename, content, function (err) { });
    }

    while (true) {
        if (url_queue.length == 0) {
            ideal_counter++;
            if(ideal_counter>100000000){
               
                break;
            }
        } else {
            var url = url_queue.pop();
            finished_url_queue.push(url)
            await page.goto(url);
            console.log("opening url " + url);

            for (var i =0;i< config.data_extract.length;i++) {
               var item = config.data_extract[i]
                if (url.match(item.pattern)) {
                    console.log("processing url",url)
                    var fun = item.fun;
                    await fun(page);
                    
                }
            }

            if (config.run_spider) {
                const urls = await page.$$eval('a', atags => atags.map((e) => e.href));
                page.add_urls_to_queue(urls)
            }
            if (config.delay) {
                await delay(config.delay);
            }
        }
    }
    console.log('===================completed=====================');
}



module.exports = crawler