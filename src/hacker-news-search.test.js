require("angular-mocks");

let backend;
let hackerNewsSearchDir;
let mockScope;
let compileService;
let storiesUrl = "https://shaky-hacker-news.herokuapp.com/topstories";

let getItemUrl = (num)=> `https://shaky-hacker-news.herokuapp.com/item/${num}`;

describe("hackerNewsSearchApp",() => {
    beforeEach(() => {
        angular.mock.module("hackerNewsSearchApp");
        angular.mock.inject(function($httpBackend) {
            backend = $httpBackend;
        });
        angular.mock.inject(function($rootScope, $compile) {
            mockScope = $rootScope.$new();
            compileService = $compile
        });
    });


    it("getTopStories populates topStoriesIndex", () => {
        backend.expect("GET", storiesUrl)
        .respond(500, "");
        backend.expect("GET", storiesUrl)
        .respond([123,453]);
        backend.expect("GET", getItemUrl(123))
        .respond(200, "");
        backend.expect("GET", getItemUrl(453))
        .respond(200, "");
        
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush();
        
        expect(mockScope.topStoriesIndex[0]).toBe(123);
        expect(mockScope.topStoriesIndex[1]).toBe(453);
    })

    it("one failed attempt updates loading message to 1", () => {
        backend.expect("GET", storiesUrl)
        .respond(500, "");
        backend.expect("GET", storiesUrl)
        .respond([123,453]);
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush(1);
        expect(elem.find(".loading-message")[0].innerText).toBe(mockScope.loadingMessages[mockScope.loadingMessage]);
        expect(mockScope.loadingMessage).toBe(1);
    })

    it("two failed attempts updates loading message to 2", () => {
        backend.expect("GET", storiesUrl)
        .respond(500, "");
        backend.expect("GET", storiesUrl)
        .respond(500, "");
        backend.expect("GET", storiesUrl)
        .respond([123,453]);
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush(2);
        expect(elem.find(".loading-message")[0].innerText).toBe(mockScope.loadingMessages[mockScope.loadingMessage]);
        expect(mockScope.loadingMessage).toBe(2);
    })

    it("three failed attempts updates loading message to 3", () => {
        backend.expect("GET", storiesUrl)
        .respond(500, "");
        backend.expect("GET", storiesUrl)
        .respond(500, "");
        backend.expect("GET", storiesUrl)
        .respond(500, "");
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush(3);
        expect(mockScope.serverError).toBe(true);
        expect(elem.find(".loading-error")[0].innerText).toBe(mockScope.mainLoadingErrorMessage);
    })

    it("item one failed attempt shows loadingmessage[1]", () => {
        backend.expect("GET", storiesUrl)
        .respond([321]);
        backend.expect("GET", getItemUrl(321))
        .respond(500,"");
        backend.expect("GET", getItemUrl(321))
        .respond({title : "bear", url : "https://www.google.com"});

        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush(2);
        expect($(elem.find("[data-item-num=321]")[0]).find("[data-story=loading]")[0].innerText).toBe(mockScope.loadingMessages[1]);
    })

    
    it("item two failed attempts shows loadingmessage[2]", () => {
        backend.expect("GET", storiesUrl)
        .respond([321]);
        backend.expect("GET", getItemUrl(321))
        .respond(500,"");
        backend.expect("GET", getItemUrl(321))
        .respond(500,"");
        backend.expect("GET", getItemUrl(321))
        .respond({title : "bear", url : "https://www.google.com"});

        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush(3);
        expect($(elem.find("[data-item-num=321]")[0]).find("[data-story=loading]")[0].innerText).toBe(mockScope.loadingMessages[2]);
    })

    it("item three failed attempts shows error message", () => {
        backend.expect("GET", storiesUrl)
        .respond([321]);
        backend.expect("GET", getItemUrl(321))
        .respond(500,"");
        backend.expect("GET", getItemUrl(321))
        .respond(500,"");
        backend.expect("GET", getItemUrl(321))
        .respond(500, "");

        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush(4);
        expect($(elem.find("[data-item-num=321]")[0]).find("[data-story=error]").length).toBe(1);
    })

    it("getTopStories causes getItem to be called for each story id", () => {
        backend.expect("GET", storiesUrl)
        .respond([]);
        
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let calledItems = [];
        let elem = compileFn(mockScope);
        mockScope.getItem = function(num) {
            calledItems.push(num);
        }
        
        backend.flush();

        backend.expect("GET", storiesUrl)
        .respond([123,453]);
        mockScope.getTopStories();
        backend.flush();
        expect(calledItems.indexOf(123)).toBeGreaterThan(-1);
        expect(calledItems.indexOf(453)).toBeGreaterThan(-1);
    });

    it("getTopStories populates item to list with correct title", () => {
        backend.expect("GET", storiesUrl)
        .respond([321]);
        backend.expect("GET", getItemUrl(321))
        .respond({title : "bear", url : "https://www.google.com"});

        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush();
        expect(mockScope.loading).toBe(false);
        expect(mockScope.topStoriesIndex.length).toBe(1);

        mockScope.$digest();
        let listItems = elem.find(".story-list-item");
        expect($(listItems[0]).find("[data-story=success]").length).toBe(1);
        let storyEl =  $(listItems[0]).find("[data-story=success]")[0];
        expect($(storyEl).find("a")[0].innerText).toBe("bear");
        expect($(storyEl).find("a")[0].href).toMatch("https://www.google.com");
    });


    it("getTopStories shows not loading after top stories responds", () => {
        backend.expect("GET", storiesUrl)
        .respond([321]);
        backend.expect("GET", getItemUrl(321))
        .respond({title : "bear", url : "https://www.google.com"});
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush(1);
        expect(mockScope.loading).toBe(false);
    });

    it("story item shows loading while waiting for response", () => {
        backend.expect("GET", storiesUrl)
        .respond([321]);
        backend.expect("GET", getItemUrl(321))
        .respond({title : "bear", url : "https://www.google.com"});
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush(1);
        let storyItem = $(elem.find(".story-list-item")[0]);
        expect(mockScope.items[321].loading).toBe(true);
        expect(mockScope.items[321].error).toBe(false);
        let storyNotifications = $(storyItem).find("[data-story]");
        expect(storyNotifications.length).toBe(1);
        expect($(storyItem).find("[data-story=success]").length).toBe(0);
        expect($(storyItem).find("[data-story=loading]").length).toBe(1);
    });

    it("fetching story item error shows error message", () => {
        backend.expect("GET", storiesUrl)
        .respond([321]);
        backend.expect("GET", getItemUrl(321))
        .respond(500,"");
        backend.expect("GET", getItemUrl(321))
        .respond(500,"");
        backend.expect("GET", getItemUrl(321))
        .respond(500,"");
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush();
        let storyItem = $(elem.find(".story-list-item")[0]);
        expect(mockScope.items[321].error).toBe(true);
        let storyNotifications = $(storyItem).find("[data-story]");
        expect(storyNotifications.length).toBe(1);
        expect($(storyItem).find("[data-story=success]").length).toBe(0);
        expect($(storyItem).find("[data-story=error]").length).toBe(1);
    });

    it("fetching story no url shows no-url message", () => {
        backend.expect("GET", storiesUrl)
        .respond([321]);
        backend.expect("GET", getItemUrl(321))
        .respond({title : "apple"});
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush();
        let storyItem = $(elem.find(".story-list-item")[0]);
        let storyNotifications = $(storyItem).find("[data-story]");
        expect(storyNotifications.length).toBe(1);
        expect($(storyItem).find("[data-story=success]").length).toBe(0);
        expect($(storyItem).find("[data-story=no-url]").length).toBe(1);
    });

    it("search filter works (0)", () => {
        backend.expect("GET", storiesUrl)
        .respond([321, 771]);
        backend.expect("GET", getItemUrl(321))
        .respond({title : "apple", url : "apple"});
        backend.expect("GET", getItemUrl(771))
        .respond({title : "pear", url : "pear"});
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush();
        expect(mockScope.loading).toBe(false);
        mockScope.searchText = "";
        mockScope.$digest();
        expect($(elem.find("[data-item-num=771]")).hasClass('ng-hide')).toBe(false);
        expect($(elem.find("[data-item-num=321]")).hasClass('ng-hide')).toBe(false);
    });

    it("search filter works (1)", () => {
        backend.expect("GET", storiesUrl)
        .respond([321, 771]);
        backend.expect("GET", getItemUrl(321))
        .respond({title : "apple", url : "apple"});
        backend.expect("GET", getItemUrl(771))
        .respond({title : "pear", url : "pear"});
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush();
        expect(mockScope.loading).toBe(false);
        mockScope.searchText = "ap";
        mockScope.$digest();
        expect($(elem.find("[data-item-num=771]")).hasClass('ng-hide')).toBe(true);
        expect($(elem.find("[data-item-num=321]")).hasClass('ng-hide')).toBe(false);
    });

    it("search filter works (2)", () => {
        backend.expect("GET", storiesUrl)
        .respond([321, 771]);
        backend.expect("GET", getItemUrl(321))
        .respond({title : "apple", url : "apple"});
        backend.expect("GET", getItemUrl(771))
        .respond({title : "pear", url : "pear"});
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush();
        expect(mockScope.loading).toBe(false);
        mockScope.searchText = "pe";
        mockScope.$digest();
        expect($(elem.find("[data-item-num=771]")).hasClass('ng-hide')).toBe(false);
        expect($(elem.find("[data-item-num=321]")).hasClass('ng-hide')).toBe(true);
    });
    
    it("search filter works (3)", () => {
        backend.expect("GET", storiesUrl)
        .respond([321, 771]);
        backend.expect("GET", getItemUrl(321))
        .respond({title : "apple", url : "apple"});
        backend.expect("GET", getItemUrl(771))
        .respond({title : "pear", url : "pear"});
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush();
        expect(mockScope.loading).toBe(false);
        mockScope.searchText = "bat";
        mockScope.$digest();
        expect($(elem.find("[data-item-num=771]")).hasClass('ng-hide')).toBe(true);
        expect($(elem.find("[data-item-num=321]")).hasClass('ng-hide')).toBe(true);
    });

    it("search filter works (4)", () => {
        backend.expect("GET", storiesUrl)
        .respond([321, 771]);
        backend.expect("GET", getItemUrl(321))
        .respond({title : "apple", url : "apple"});
        backend.expect("GET", getItemUrl(771))
        .respond({title : "pear", url : "pear"});
        let compileFn = compileService("<hacker-news-search></hacker-news-search>");
        let elem = compileFn(mockScope);
        backend.flush();
        expect(mockScope.loading).toBe(false);
        mockScope.searchText = "e";
        mockScope.$digest();
        expect($(elem.find("[data-item-num=771]")).hasClass('ng-hide')).toBe(false);
        expect($(elem.find("[data-item-num=321]")).hasClass('ng-hide')).toBe(false);
    });

})