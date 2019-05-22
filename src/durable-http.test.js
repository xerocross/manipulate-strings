require("angular-mocks");

it("can add numbers", () => {
    expect(1+2).toBe(3);
});


it("can mock app", () => {
    expect(()=> {
        angular.mock.module("hackerNewsSearchApp");
    }).not.toThrow();
});

it("can inject durableHttpService", () => {
    angular.mock.module("hackerNewsSearchApp");

    // angular.mock.module(function($provide) {
    //     $provide.value("$http", {
    //         get : () => {
    //             console.log("getting");
    //         }
    //     });
    // })
    let backend;
    angular.mock.inject(function($httpBackend) {
        backend = $httpBackend;
        $httpBackend.expect("GET", "https://shaky-hacker-news.herokuapp.com/topstories")
        .respond([132,115]);
    });
    
    angular.mock.inject(function(durableHttpService) {
        console.log("sending");
        durableHttpService.get("https://shaky-hacker-news.herokuapp.com/topstories")
        .then((res)=> {
            console.log("result");
            console.log(res);
        })
        .catch(()=> {
            console.log("fail");
        });

    });
    backend.flush();

});