let template = require("./manipulate-strings-template").template;
require("./manipulate-strings-service.js");

angular.module("manipulateStringsApp", ["manipulateStringsMod"])
.directive("manipulateStrings", ["manipulateStringsService", function(manipulateStringsService) {
    return {
        template: template,
        controller : ["$scope", function($scope) {
            let id = 1;
            $scope.inputString = "";
            $scope.stringResults = [];
            $scope.inputChange = function(inputString) {
                $scope.stringResults = [{
                    id : id++,
                    function: "init",
                    string : inputString
                }];
            }
            $scope.removeDuplicated = function(str) {
                let result = {
                    id : id++,
                    string: manipulateStringsService.removeDuplicated(str),
                    function : "removeDuplicated"
                };
                $scope.stringResults.push(result);
            }
            $scope.reverseString = function(str) {
                $scope.stringResults.push({
                    id : id++,
                    string: manipulateStringsService.reverse(str),
                    function : "reverseString"
                })
            }
            $scope.removeSpaces = function(str) {
                $scope.stringResults.push({
                    id : id++,
                    string: manipulateStringsService.removeSpaces(str),
                    function : "removeSpaces"
                })
            }
        }]
    }
} ] )