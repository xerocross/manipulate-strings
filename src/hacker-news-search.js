let template = require("./hacker-news-search-template").template;
require("./durable-http");

angular.module("hackerNewsSearchApp", ["durableHttpMod"])
.directive("hackerNewsSearch", function() {
    return {
        template: template,
        controller : ["$scope", "hackerNewsService", function($scope, hackerNewsService) {
            $scope.loading = true;
            $scope.topStoriesIndex = [];
            $scope.items = {};
            $scope.searchText = "";
            $scope.mainLoadingErrorMessage = "loading failed multiple attempts; please try again later";
            $scope.serverError = false;
            $scope.loadingMessage = 0;
            $scope.loadingMessages = ["loading", "loading failed; retrying", "loading failed; retrying one more time"];
            $scope.getItem = function(id) {
                $scope.items[id] = {};
                $scope.items[id].loading = true;
                $scope.items[id].error = false;
                $scope.items[id].loadingMessage = $scope.loadingMessages[0];
                hackerNewsService.getStory(id)
                .subscribe((response) => {
                    if (response.status == "ATTEMPTING") {
                        if (response.data.attemptNum < $scope.loadingMessages.length) {
                            $scope.items[id].loadingMessage = $scope.loadingMessages[response.data.attemptNum];
                        } else {
                            $scope.items[id].loadingMessage = $scope.loadingMessages[$scope.loadingMessages.length - 1];
                        }
                    } else if (response.status == "SUCCESS") {
                        $scope.items[id].data = response.data;
                        $scope.items[id].loading = false;
                    } else if (response.status == "FAIL") {
                        $scope.items[id].loading = false;
                        $scope.items[id].error = true;
                    }
                })
            }
            $scope.getTopStories = () => {
                hackerNewsService.getTopStoriesIndex()
                .subscribe((response) => {
                    if (response.status == "ATTEMPTING") {
                        if (response.data.attemptNum < $scope.loadingMessages.length) {
                            $scope.loadingMessage = response.data.attemptNum;
                        } else {
                            $scope.loadingMessage =  $scope.loadingMessages.length - 1;
                        }
                    } else if (response.status == "SUCCESS") {
                        $scope.loading = false;
                        $scope.topStoriesIndex = response.data.slice(0,50);
                        $scope.topStoriesIndex.forEach((id) => {
                            $scope.getItem(id)
                        });
                    } else if (response.status == "FAIL") {
                        $scope.loading = false;
                        $scope.serverError = true;
                    }
                })
            }
            $scope.getTopStories();
        }]
    }
})
require("./hacker-news-service");