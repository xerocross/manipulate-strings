angular.module("hackerNewsSearchApp")
.service("hackerNewsService", ["$http", "$q", function($http, $q) {
    this.itemNumbers = [];
    this.items = {};
    let self = this;
    function getItemUrl (itemNum) {
        return `https://hacker-news.firebaseio.com/v0/item/${itemNum}.json?print=pretty`;
    }
    self.getStory = function (itemNum) {
        let url = getItemUrl(itemNum);
        let deferred = $q.defer();
        $http.get(url)
        .then(response => {
            if (response.status == 200) {
                deferred.resolve({
                    status : "SUCCESS",
                    data : response.data
                })
            } else {
                deferred.resolve({
                    status : "FAIL",
                })
            }
        }).catch(()=>{
            deferred.resolve({
                status : "FAIL",
            })
        })
        return deferred.promise;
    }
    self.topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
    
    self.getTopStoriesIndex = function() {
        let deferred = $q.defer();
        $http.get(self.topStoriesUrl)
        .then(function (response) {
            if (response.status == 200) {
                deferred.resolve({
                    status : "SUCCESS",
                    topStoriesIndex : response.data.slice(0, 100)
                })
            } else {
                deferred.resolve({
                    status : "FAIL",
                    topStoriesIndex : []
                })
            }
        })
        .catch(function() {
            deferred.resolve({
                status : "FAIL",
                topStoriesIndex : []
            })
        })
        return deferred.promise;
    }

}]);