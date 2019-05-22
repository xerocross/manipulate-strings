(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
angular.module("manipulateStringsMod", [])
.service("manipulateStringsService", function() {
    this.reverse = function(str) {
        let result = "";
        for (let i = str.length - 1; i > -1; i--) {
            result += str[i];
        }
        return result;
    }
    this.removeDuplicated = function(str) {
        let result = "";
        let duplicated = [];
        outer: for (let i = 0; i < str.length; i++) {
            let char = str[i];
            if (duplicated.indexOf(char) > -1) {
                continue;
            }
            for (let j = 0; j < i; j++) {
                if (str[j] == char) {
                    duplicated.push(char);
                    continue outer;
                }
            }
            for (let j = i+1; j < str.length; j++) {
                if (str[j] == char) {

                    duplicated.push(char);
                    continue outer;
                }
            }
            result+= char;
        }
        return result;
    }
    this.removeSubstringAll = function(str, substring) {
        let resultArray = [];
        let substringLen = substring.length;
        for (let i = 0; i < str.length; i++) {
            resultArray.push(str[i]);
        }
        resultArray.toString = function() {
            return resultArray.join("");
        }
        let i;
        while ((i = resultArray.toString().indexOf(substring), i > -1)) {
            resultArray.splice(i, substringLen);
        }
        return resultArray.toString();
    }
    this.removeSpaces = function(str) {
        return this.removeSubstringAll(str, " ");
    }
});
},{}],2:[function(require,module,exports){
module.exports.template = `
    <div>
        <label for = "mainStringInput">
            Enter String
        </label>
        <form name = "stringInputForm">
        <input
            class = "form-control main-string-input"
            name = "mainStringInput"
            type = "text"
            ng-model = "inputString"
            ng-change = "inputChange(inputString)"
        />
        </form>
        <div class="main-btn-group-outer">
        <div class="btn-group">
            <button 
                ng-disabled = "stringInputForm.mainStringInput.$pristine" 
                class="btn btn-primary remove-duplicated-button" 
                ng-click = "removeDuplicated(stringResults[stringResults.length - 1].string)"
            >
                remove duplicated
            </button>
            <button 
                ng-disabled = "stringInputForm.mainStringInput.$pristine" 
                class="btn btn-primary 
                reverse-string-button" 
                ng-click = "reverseString(stringResults[stringResults.length - 1].string)"
            >
                reverse string
            </button>
            <button 
                ng-disabled = "stringInputForm.mainStringInput.$pristine" 
                class="btn btn-primary 
                remove-spaces-button" 
                ng-click = "removeSpaces(stringResults[stringResults.length - 1].string)"
            >
                remove spaces
            </button>
        </div>
        </div>
        <table  class= "result-array-container table">
            <thead>
                <tr>
                    <th class = "index-col" scope="col">#</th>
                    <th scope="col" class= "function-col">Transformation</th>
                    <th scope="col">Result</th>

                </tr>
            </thead>
            <tbody>
            <tr class = "" ng-repeat = "resultObject in stringResults track by resultObject.id">
                <th class = "index-col" scope="row">{{ $index }}</th>
                <td class = "function-col">{{resultObject.function}}</td>

                <td class = "">{{resultObject.string}}</td>
            </tr>
            </tbody>
        </ul>
    </div>
`
},{}],3:[function(require,module,exports){
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
},{"./manipulate-strings-service.js":1,"./manipulate-strings-template":2}]},{},[3]);
