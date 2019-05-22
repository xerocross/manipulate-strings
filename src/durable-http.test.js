require("angular-mocks");

let backend;
let url = "https://shaky-hacker-news.herokuapp.com/topstories";

describe("durableHttpMod", ()=>{

    beforeEach(()=>{
        angular.mock.module("durableHttpMod");
        angular.mock.inject(function($httpBackend) {
            backend = $httpBackend;
        });
    })

    it("on successful query, responds with 'SUCCESS'", (done) => {
        angular.mock.inject(function(durableHttpService) {
            backend.expect("GET", url)
            .respond([123]);
            durableHttpService.get(url)
            .subscribe((res)=> {
                if (res.status == "SUCCESS") { 
                    expect(res.data[0]).toBe(123);
                    done();
                }
                
            })
        });
        backend.flush();
    });

    it("fails after 3 tries (server error)", (done) => {
        angular.mock.inject(function(durableHttpService) {
            backend.expect("GET", url)
            .respond(500, '');
            backend.expect("GET", url)
            .respond(500, '');
            backend.expect("GET", url)
            .respond(500, '');

            durableHttpService.get(url)
            .subscribe((res)=> {
                if (res.status == "FAIL") {
                    done();
                }
            })
        });
        backend.flush();
    });

    it("succeeds if second get works (server error)", (done) => {
        angular.mock.inject(function(durableHttpService) {
            backend.expect("GET", url)
            .respond(500, '');
            backend.expect("GET", url)
            .respond([123]);

            durableHttpService.get(url)
            .subscribe((res)=> {
                if (res.status == "SUCCESS") {
                    done();
                }
            })
        });
        backend.flush();
    });

    it("succeeds if second get works (non 200 status)", (done) => {
        angular.mock.inject(function(durableHttpService) {
            backend.expect("GET", url)
            .respond(400, '');
            backend.expect("GET", url)
            .respond([123]);

            durableHttpService.get(url)
            .subscribe((res)=> {
                if (res.status == "SUCCESS") {
                    done();
                }
            })
        });
        backend.flush();
    });

})