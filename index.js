"use strict";

const puppeteer = require('puppeteer');
const Repo = require('./Repo')
const download = require('image-downloader')
var fs = require('fs');
const NOTHING = () => { }
var nothingAsyncFunction = async function () { }
var truthFunction = function () { return true; }
function isArray(obj) { return Array.isArray(obj) }
function isString(obj) { return typeof obj == "string" }
function isBoolean(obj) { return typeof obj == "boolean" }
function isNumber(obj) { return typeof obj == "number" }
function isFunction(obj) { return typeof obj == "function" }
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
function correctURL(url) {
    if (url) {
        if (url.endsWith("#") || url.endsWith("/")) {
            url = url.substring(0, url.length - 1)
        }
    }
    return url;
}

class ScaperInterface {

    constructor() { }

    startWithURLs(listOfURLs) { }

    allowIfMatches(nonAsyncFunction) { }

    saveProgressInFile(filePath) { }
    
    enableAutoCrawler(flag) { }

    waitBetweenPageLoad(delayInMilliSeconds) { }

    callbackOnFinish(asyncFunction) { }
 
    callbackOnPageLoad(asyncFunction) { }

    start() { }
}

class Scraper extends ScaperInterface {
    constructor() {
        super();
        this._allowIfMatches = truthFunction;
        this._saveProgress = false;
        this._saveProgressInFile = null;
        this._enableAutoCrawler = false;
        this._delayInMilliSeconds = 0;
        this._callbackOnFinish = nothingAsyncFunction;
        this._callbackOnPageLoad = nothingAsyncFunction;
    }
    startWithURLs(listOfURLs) {
        if (isString(listOfURLs)) listOfURLs = [listOfURLs]
        if (!isArray(listOfURLs)) return;
        this._listOfURLs = listOfURLs
    }
    allowIfMatches(nonAsyncFunction) {
        if (isFunction(nonAsyncFunction)) { this._allowIfMatches = nonAsyncFunction }
    }
    saveProgressInFile(filePath) {
        if (!isString(filePath)) return
        this._saveProgress = true;
        this._saveProgressInFile = filePath
    }
    enableAutoCrawler(flag) {
        if (isBoolean(flag)) { this._enableAutoCrawler = flag }
    }
    waitBetweenPageLoad(delayInMilliSeconds) {
        if (isNumber(delayInMilliSeconds)) { this._delayInMilliSeconds = delayInMilliSeconds }
    }
    callbackOnFinish(asyncFunction) {
        if (isFunction(asyncFunction)) { this._callbackOnFinish = asyncFunction }
    }
    callbackOnPageLoad(asyncFunction) {
        if (isFunction(asyncFunction)) { this._callbackOnPageLoad = asyncFunction }
    }

    async _addURL(repo, urls) {
        if (isString(urls)) urls = [urls]
        if (!isArray(urls)) return;
        urls = urls.map(u => { return correctURL(u) })
        urls = urls.filter(u => { return this._allowIfMatches(u) })
        repo.addURLS(urls)
    }


    async start() {
        if (this._saveProgressInFile) {
            var repo = new Repo(this._saveProgressInFile);
        } else {
            var repo = new Repo();
        }

        this.repo = repo;
        var data = null;


        if (this._listOfURLs) {
            this._addURL(repo, this._listOfURLs)
        }


        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //brew page
        page.download_image = function (image_download_url, where_to_full_file_path) {
            const options = { url: image_download_url, dest: where_to_full_file_path }
            download.image(options)
                .then(NOTHING)
                .catch((err) => {
                    console.error("cannot download image", err)
                });
        }

        page.saveResult = function (data1) {
            data = JSON.stringify(data1)
        }
        page.write_text_to_file = function (content, filename) {
            fs.writeFile(filename, content, function (err) { });
        }
        page.add_url_to_queue = async function (url) {
            if (isString(url)) {
                url = [url]
            }
            url = url.map(i => { return correctURL(i) })
            this._addURL(repo, url)
        }
        //brew page end

        //main loop
        while (true) {

            var url = await repo.getNextURL();


            data = null;
            if (url == null) {
                console.log(await repo.getAll())
                break;
            }

            await page.goto(url);
            try {
                await this._callbackOnPageLoad(page);
                repo.finishURL(url, data);

            } catch (e) {
                repo.failURL(url, data);
                console.log(e)
                console.log("error occured while running parsing function and silently ignored");
            }
            if (this._enableAutoCrawler) {


                const urls = await page.$$eval('a', atags => atags.map((e) => e.href));
                this._addURL(repo, urls)
            }
            if (this._delayInMilliSeconds) {
                sleep(this._delayInMilliSeconds);
            }
        }

        if (this._callbackOnFinish) {
            await this._callbackOnFinish(repo.getAll())
        }
        browser.close();
        //main loop end
    }


}

module.exports = Scraper