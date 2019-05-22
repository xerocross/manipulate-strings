angular.module("hackerNewsSearchApp")
.service("hackerNewsService", ["$http", "$q", "durableHttpService", function($http, $q, durableHttpService) {
    let self = this;
    function getItemUrl (itemNum) {
        return `https://shaky-hacker-news.herokuapp.com/item/${itemNum}`;
    }
    self.getStory = function (itemNum) {
        let url = getItemUrl(itemNum);
        return durableHttpService.get(url);
    }
    self._getStory = function (itemNum) {
        let url = getItemUrl(itemNum);
        return durableHttpService._get(url);
    }
    self.topStoriesUrl = "https://shaky-hacker-news.herokuapp.com/topstories";
    
    self.getTopStoriesIndex = function() {
        return  durableHttpService.get(self.topStoriesUrl);
    }
    self._getTopStoriesIndex = function() {
        return  durableHttpService._get(self.topStoriesUrl);
    }
}]);
