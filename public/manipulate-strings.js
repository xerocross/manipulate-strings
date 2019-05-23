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
    this.replaceSubstringAll = function(substring, newSubstring) {
        return (str) => {
            let i = 0;
            let len = substring.length;
            let remaining = str.substring(i);
            let frontpart = "";
            while (i = remaining.indexOf(substring), i > -1) {
                // split into front working part and the new remaining
                let workingPart = remaining.substring(0 , i+ len);
                // append the workingPart and make the substitution
                frontpart += workingPart.replace(substring, newSubstring);
                // cut the remaining to exclude the current working part
                remaining = remaining.substring(i + len);
            }
            frontpart += remaining;
            return frontpart;
        }
    }
    this.removeSpaces = function(str) {
        return this.removeSubstringAll(str, " ");
    }
    this.alphabatize = function (str) {
        return str.split("").sort().join("");
    }
});
},{}],2:[function(require,module,exports){
module.exports.template = `
<div>
    <div class = "row">
        <div class="col-lg-6">
            <p>
                Enter any initial string and then you can use the form below to
                transform it. The results of the last transform get piped into
                the next transform you choose.
            </p>
            <div>
                <label for="mainStringInput">
                    Initial String
                </label>
            </div>
            <form name="stringInputForm">
                <input class="form-control main-string-input" name="mainStringInput" type="text" ng-model="inputString"
                    ng-change="inputChange(inputString)" />
            </form>
            <table class="result-array-container table">
                <thead>
                    <tr>
                        <th class="index-col" scope="col">#</th>
                        <th scope="col" class="function-col">Transformation</th>
                        <th scope="col">Result</th>
                        <th scope="col" lass="remove-button">X</th>

                    </tr>
                </thead>
                <tbody>
                    <tr class="" ng-repeat="resultObject in stringResults track by resultObject.id">
                        <th class="index-col" scope="row">{{ $index }}</th>
                        <td class="function-col">{{resultObject.description}}</td>

                        <td class=""><span class="result-string">{{ resultObject.toString() }}</span></td>
                        <td class="remove-button">
                            <span class = "btn-span" ng-if="$index > 0" data-remove-button="{{ $index }}"
                                ng-click="removeTransform($index)">
                                X
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col-lg-6">

            <p class="alert alert-info">
                Use this interface to apply transformations to the string.  After you have 
                created a sequence of transforms, you can change the input string and 
                the entire table will be live-updated.
            </p>
            <div class="main-btn-group-outer form-group card">
                <div class="card-body">
                    <div>
                        <label>Elementary Transformations</label>
                    </div>
                    <select class="form-control" ng-model = "selectedTransform">
                        <option ng-repeat = "opt in transformOptions" value="{{opt.id}}">{{opt.title}}</option>
                    </select>
                    <div ng-show = "selectedTransform == 'alphabetize'">
                        <button ng-disabled="stringInputForm.mainStringInput.$pristine" 
                        class="btn btn-primary alphabatize-string-button" 
                            ng-click="alphabatize(stringResults[stringResults.length - 1].string)"
                        >
                            alphabatize
                        </button>
                    </div>
                    <div ng-show = "selectedTransform == 'reverse'">
                        <button ng-disabled="stringInputForm.mainStringInput.$pristine" class="btn btn-primary 
                            reverse-string-button" ng-click="reverseString(stringResults[stringResults.length - 1].string)">
                            reverse string
                        </button>
                    </div>
                    <div ng-show = "selectedTransform == 'nodupes'">
                        <button ng-disabled="stringInputForm.mainStringInput.$pristine"
                            class="btn btn-primary remove-duplicated-button"
                            ng-click="removeDuplicated(stringResults[stringResults.length - 1].string)">
                            remove chars that appear more than once
                        </button>
                    </div>
                    <div ng-show = "selectedTransform == 'nospace'">
                        <button ng-disabled="stringInputForm.mainStringInput.$pristine" class="btn btn-primary 
                        remove-spaces-button" ng-click="removeSpaces(stringResults[stringResults.length - 1].string)">
                            remove spaces
                        </button>
                    </div>
                    <div ng-show = "selectedTransform == 'replaceSubstring'">
                        <div class=" form-group">
                            <label for="replaceSubstring">search substring</label>
                            <input type="text" name="replaceSubstring" ng-model="replaceSubstring"
                                class="replace-substring-input form-control" />
                            <label for="newSubstring">new substring</label>
                            <input type="text" name="newSubstring" ng-model="newSubstring"
                                class="new-substring-input form-control" />
                            <button class="replace-substring-button form-control btn btn-primary"
                                ng-click="replaceSubstringAll(replaceSubstring, newSubstring)(inputString)"
                                ng-disabled="!(replaceSubstring.length > 0)">
                                replace
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`
},{}],3:[function(require,module,exports){
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
            $scope.selectedTransform = "alphabetize";
            $scope.transformOptions = [
                {
                    title: "alphabetize",
                    id : "alphabetize"
                },
                {
                    title: "remove all characters that appear more than once",
                    id : "nodupes"
                },
                {
                    title: "reverse",
                    id : "reverse"
                },
                {
                    title: "remove spaces",
                    id : "nospace"
                },
                {
                    title: "replace substrings",
                    id : "replaceSubstring"
                }
            ];
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
            $scope.alphabatize = function() {
                let transformFunc = (x)=>manipulateStringsService.alphabatize(x);
                let transform = new Transform($scope.stringResults[$scope.stringResults.length - 1],`alphabatize`, transformFunc);
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
},{"./manipulate-strings-service.js":1,"./manipulate-strings-template":2}]},{},[3]);
