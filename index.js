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
var readline = require('readline');
var puppeteer = require('puppeteer');
var fs = require('fs');
var mm = require('micromatch');
const { spawn } = require('child_process');
const delay = require('delay');
const download = require('image-downloader')

const STATE_FILE_PATH = './.state'
const NOTHING = () => { }


function addState(msg) {
    fs.appendFileSync(STATE_FILE_PATH, msg + "\n");
}

function match(pattern, url) {
    return mm.isMatch(url, pattern)
}

var ideal_counter = 0;

async function crawler(config) {
    var url_queue = config.start_urls ? config.start_urls : [];
    config.canResume = config.canResume ? config.canResume : true;
    var finished_url_queue = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //resuming from previous state
    if (config.canResume) {
        try {
            var stateLine = fs.readFileSync(STATE_FILE_PATH).toString();
            stateLine = stateLine.split("\n")
            url_queue = []
            finished_url_queue = []
            for (var i = 0; i < stateLine.length; i++) {
                var line = stateLine[i];
                var url = line.substring(2)
                if (line.startsWith("a ")) {
                    url_queue.push(url)
                    //console.log("adding ", line)
                } else if (line.startsWith("d ")) {
                    url_queue.splice(url_queue.indexOf(url), 1)
                    finished_url_queue.push(url)
                    //console.log("removing ", line)
                }
            }
        } catch (e) {
            //console.log(e)
        }
        //console.log("loaded state", url_queue)
        //console.log("finished state", finished_url_queue)
    }


    if (url_queue.length > 0) {
        url_queue.map((v) => {
            addState("a " + v);
        })
    }

    page.add_urls_to_queue = function (urls) {
        for (i in urls) {
            page.add_url_to_queue(urls[i])
        }
    }

    page.download_image = function (image_download_url, where_to_full_file_path) {
        const options = { url: image_download_url, dest: where_to_full_file_path }
        download.image(options)
            .then(NOTHING)
            .catch((err) => {
                console.error("cannot donwload image", err)
            });
    }

    page.add_url_to_queue = function (url) {
        if (url) {
            if (url.endsWith("#") || url.endsWith("/")) {
                url = url.substring(0, url.length - 1)
            }
            if (url_queue.indexOf(url) == -1 && finished_url_queue.indexOf(url) == -1) {
                for (i in config.allow_urls) {
                    var reg_exp = config.allow_urls[i]
                    if (url.match(reg_exp)) {
                        addState("a " + url);
                        url_queue.push(url);
                    }
                }
            }
        }
    }

    page.write_text_to_file = function (content, filename) {
        fs.writeFile(filename, content, function (err) { });
    }

    while (true) {
        if (url_queue.length == 0) {
            ideal_counter++;
            if (ideal_counter > 100000000) {
                break;
            }
        } else {
            var url = url_queue.pop();
            await page.goto(url);
            console.log("opening url " + url);
            var fun = config.data_extract;
            if (fun) {
                try {
                    await fun(page);
                } catch (e) {
                    console.log("error occured while running parsing function and silently ignored");
                    console.log(e);
                }
            }
            /*for (var i = 0; i < config.data_extract.length; i++) {
                var item = config.data_extract[i]
                if (url.match(item.pattern)) {
                    console.log("processing url", url)
                    var fun = item.fun;
                    try {
                        await fun(page);
                    } catch (e) {
                        console.log("error occured while running parsing function and silently ignored");
                        console.log(e);
                    }
                }
            }*/
            finished_url_queue.push(url)
            addState("d " + url);

            if (config.run_spider) {
                const urls = await page.$$eval('a', atags => atags.map((e) => e.href));
                page.add_urls_to_queue(urls)
            }

            if (config.delay) {
                await delay(config.delay);
            }
        }
    }
    try {
        if (config.oncomplete) {
            try {
                config.oncomplete();
            } catch (e) {
                console.log('error executing on complete function ,ignore');
                console.log(e)
            }

        }
    } catch (e) {
        console.log(e)
    }

}



module.exports = crawler