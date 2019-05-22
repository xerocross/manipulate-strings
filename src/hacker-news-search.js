let template = require("./hacker-news-search-template").template;

angular.module("hackerNewsSearchApp",[])
.directive("hackerNewsSearch", function() {
    return {
        template: template,
        controller : ["$scope", "hackerNewsService", function($scope, hackerNewsService) {
            $scope.loading = true;
            $scope.topStoriesIndex = [];
            $scope.items = {};
            $scope.searchText = "";
            $scope.serverError = false;
            $scope.getItem = function(id) {
                $scope.items[id] = {};
                $scope.items[id].loading = true;
                $scope.items[id].error = false;
                hackerNewsService.getStory(id)
                    .then((response) => {
                        if (response.status == "SUCCESS") {
                            $scope.items[id].data = response.data;
                            $scope.items[id].loading = false;
                        } else {
                            $scope.items[id].loading = false;
                            $scope.items[id].error = true;
                        }
                    });
            }
            hackerNewsService.getTopStoriesIndex()
            .then((response)=>{
                $scope.loading = false;
                if (response.status == "SUCCESS") {
                    $scope.topStoriesIndex = response.data.slice(0,50);
                    $scope.topStoriesIndex.forEach((id) => {
                        $scope.getItem(id)
                    });
                } else {
                    $scope.serverError = true;
                }
            })

        }]
    }
})
require("./hacker-news-service");