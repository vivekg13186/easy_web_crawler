# simple_web_crawler

This a basic web crawler.Check out example folder for how to use

# Objective!

  - Support crawling of javascript/ajax pages
  - url filter
  - avoid duplicate urls
  - delay before page load
  - custom data extraction
  - build in spider
  - custom pattern based data extarction

### USAGE

```
var crawler = require("simple_web_crawler")

var config =
{
     start_urls: [], //list of url to start with
     allow_urls: [], //list of regular expession ,only the urls matching the pattern are opened and processed
     run_spider: false,// (default false)if the flag set to yes crawler automatically extarct the links form the page and add it to the queue(only if it matches above rule)
     delay :100,//(default 0ms) wait before loading new page (in milliseconds)
     data_extract: [
        {
            pattern: /regexp/, //crawler call the below function if the url matched the pattern 
            fun: async function (page) {
                /*page   - puppeteer page object 
                additional  function
                    page.add_url_to_queue(url) - add url to queue for processing
                    page.download_file(url,filename) - download file like image pdf etc  ...
                    page.write_text_to_file(content, filename) - write text content to file
                    */
            }
        }
    ]
}

crawler(config);

```
License
----

MIT
