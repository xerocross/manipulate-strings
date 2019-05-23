let template = require("./manipulate-strings-template").template;
require("./manipulate-strings-service.js");

let id = 0;
let Transform = function(previous, description, transformFunction, value) {
    this.id = id++;
    this.previous = previous;
    this.description = description;
    this.transform = transformFunction;
    this.toString = ()=> {return this.previous ? this.transform(this.previous.toString()) : value}
}


angular.module("manipulateStringsApp", ["manipulateStringsMod"])
.directive("manipulateStrings", ["manipulateStringsService", function(manipulateStringsService) {
    return {
        template: template,
        //templateUrl : "/manipulate-strings-template.html",
        controller : ["$scope", function($scope) {
            $scope.inputString = "";
            $scope.stringResults = [];
            $scope.replaceSubstring = "";
            $scope.newSubstring = "";
            $scope.inputChange = function(inputString) {
                let transform = new Transform(null, "init", (x)=>x, inputString);

                $scope.stringResults[0] = transform;
                if ($scope.stringResults[1]) {
                    $scope.stringResults[1].previous = transform;
                }

            }
            $scope.removeDuplicated = function() {
                let transform = new Transform($scope.stringResults[$scope.stringResults.length - 1],"remove duplicated", (x) => manipulateStringsService.removeDuplicated(x));
                $scope.stringResults.push(transform);
            }
            $scope.reverseString = function() {
                let transform = new Transform($scope.stringResults[$scope.stringResults.length - 1], "reverse", (x) => manipulateStringsService.reverse(x));
                $scope.stringResults.push(transform);
            }
            $scope.removeSpaces = function() {
                let transform = new Transform($scope.stringResults[$scope.stringResults.length - 1], "remove spaces", (x) => manipulateStringsService.removeSpaces(x));
                $scope.stringResults.push(transform);
            }
            $scope.replaceSubstringAll = function(substring, newSubstring) {
                let transformFunc = (x)=>manipulateStringsService.replaceSubstringAll(substring, newSubstring)(x);
                let transform = new Transform($scope.stringResults[$scope.stringResults.length - 1],`replace all ${substring} with ${newSubstring}`, transformFunc);
                $scope.stringResults.push(transform);
            }
            $scope.removeTransform = function(index) {
                if (index < 1 || index >= $scope.stringResults.length) {
                    throw new Error("index out of bounds");
                }
                if (index + 1 < $scope.stringResults.length) {
                    $scope.stringResults[index + 1].previous = $scope.stringResults[index - 1];
                }
                $scope.stringResults.splice(index, 1);
            }

        }]
    }
} ] )