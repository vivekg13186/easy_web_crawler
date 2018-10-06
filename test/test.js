var Repo = require("../Repo")

//Test1
async function test1() {
    console.log("creating repo")
    var repo = new Repo();
    console.log("adding urls")
    repo.addURLS(["url1", "url2"])
    console.log("getting urls")
    console.log( repo.getNextURL())
    console.log( repo.getNextURL())
    console.log( repo.getNextURL())
    console.log("adding more urls")

    repo.addURLS(["url1", "url2"])
    repo.addURLS("url3")
    repo.addURLS("url4")
    console.log("finish urls")
    repo.finishURL("url1", "OK")
    console.log("fail urls")
    repo.failURL("url2", "error")
    console.log("get all urls")
    console.log( repo.getAll())
    console.log("end test1")
}

test1()