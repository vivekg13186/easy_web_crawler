//this file is used to generate documentation only


/** 
 * Main Scraper class
 * @example
 * // npm install easy_web_crawler
 * const Scaper = require('easy_web_crawler')
 * var scraper  =new Scraper();
*/
class Scaper {

    constructor() { }


    /** 
     * This is mandatory.<br>
     * Take the list of urls used as the starting point.
     * @param {(string|string[])} listOfURLs
     * @example
     * // add the urls as the starting point
     * scaper.startWithURLs(['www.googl.com','www.bing.com'])
     * scaper.startWithURLs('www.googl.com')
    */
    startWithURLs(listOfURLs) { }

    /**
    * Takes a non async callback function as argument,url added to processing queue only if the function return true value.<br>
    * This is optional.
    * By default is accept all urls added to processing queue.<br>
    * @param {function} nonAsyncFunction
    * @example
    * // accept url contains www.google.com
    * scraper.allowIfMatches(function(url) {  
    *   return url.indexOf('www.google.com')>-1 
    * })
    */
    allowIfMatches(nonAsyncFunction) { }

    /**
    * This is optional setting.<br>
    * This will save your progress in the file and you can stop and start the scraper from the previous state.<br>
    * The file is a sqlite db file you can modify the content using sqllite clients.<br>
    * If no file specified the stored in memory..
    * @param {string} filePath
    * @example
    * // state stored in state.db file
    * scraper.saveProgressInFile("./state.db")
    */
    saveProgressInFile(filePath) { }

    /**
    * This will allow the scraper to automatically download all the links form the page and add to processing queue.<br>
    * Note the urls will be filtered if  allowIfMatches function return 'false'.
    * @param {boolean} enableAutoCrawler - true to enable 
    * @example
    * scraper.enableAutoCrawler(true)
    */
    enableAutoCrawler(flag) { }

    /**
    * Time delay between each page load in milliseconds
    * @param {number} [delayInMilliSeconds=0]
    * @example
    * //wait for 90 milliseconds between page load
    * scraper.waitBetweenPageLoad(90)
    */
    waitBetweenPageLoad(delayInMilliSeconds) { }


    /**
    * Final callback when scarping is completed
    * @param {number} asyncFunction
    * @example
    * scraper.callbackOnFinish(function(result){
    *   console.log(result)
    * })
    */
    callbackOnFinish(asyncFunction) { }

    /**
    * This is the main function.Your scarping logic to be defined in the function.<br>
    * This called for each page in the processing queue.<br>
    * Called with pupetter page object as input.<br>
    * The page object input got addtional methods to support scraping
    * @see page
    * @param {function} asyncFunction - a sync function with single input argument page.
    * @example
    * scraper.waitBetweenPageLoad(90)
    */
    callbackOnPageLoad(asyncFunction) { }

    /**
    * To start the scraping process.
    * callbackOnFinish function is called once the scraping is completed.
    * @example
    * scraper.start()
    */
    start() { }
}

/** 
 * Pupetter page class.
 * Enhanced with supporting function detailed below.
 * 
*/
class Page {

    /**
   * Download image from url and save to local disk
   * @param {string} image_download_url
   * @param {string} where_to_full_file_path
   * @example
   * scraper.callbackOnPageLoad(async function(page){
   * var img = await page.$('img')
   * var img_src = await page.evaluate(img => img.getAttribute("src"), img);
   *  page.download_image(img_src,"usr/test/profile.png")
   * })
   */
    download_image(image_download_url, where_to_full_file_path) {

    }

    /**
   * Save the text result ,this will returned as input to callbackOnFinish function<br>
   * Each url can store one result
   * @param {string} text
   * @example
   * scraper.callbackOnPageLoad(async function(page){
   *   var article = await page.$eval('article', tag => tag.innerText);
   *   page.saveResult(article)
   * })
   */
    saveResult(text) {

    }

    /**
   * Write text content to local file
   * @param {string} content
   * @param {string} filename
   * @example
   * scraper.callbackOnPageLoad(async function(page){
   *   var article = await page.$eval('article', tag => tag.innerText);
   *   page.download_image(article,"usr/test/article.txt")
   * });
   */
    write_text_to_file(content, filename) {

    }
/**
   * Add the url to processing queue
   * @param {string} url
   * @example
   * scraper.callbackOnPageLoad(async function(page){
   *    var a = await page.$('a')
   *    var url = await page.evaluate(a => a.getAttribute("href"), a);
   *    page.add_url_to_queue(url)
   * });
   */
    add_url_to_queue(url) {

    }
}