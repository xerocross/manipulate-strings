

let createStore = require("redux").createStore;
let transformReducerApp = require("./transform-reducer").transformReducerApp;


let template = require("./manipulate-strings-template").template;
require("./manipulate-strings-service.js");
let Transform = require("./Transform");
angular.module("manipulateStringsApp", ["manipulateStringsMod"])
require("./transform-list.js");

let getRemoveTransformAction = require("./transform-actions.js").getRemoveTransformAction;




angular.module("manipulateStringsApp")
.directive("manipulateStrings", ["manipulateStringsService", function(manipulateStringsService) {
    return {

        template: template,
        controller : ["$scope", "$element", "$timeout", "$window", function($scope, $element, $timeout, $window) {
            $scope.inputString = "";
            $scope.stringResults = [];
            $scope.replaceSubstring = "";
            $scope.newSubstring = "";
           
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
            $scope.selectedTransform = $scope.transformOptions[0].id;

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
                this.store.dispatch(getRemoveTransformAction(index));
                // let elts = $($element).find('[data-toggle="tooltip"]');
                // elts.tooltip('dispose');
                // if (index < 1 || index >= $scope.stringResults.length) {
                //     throw new Error("index out of bounds");
                // }
                // if ($window.confirm("Delete this transform?")) {
                //     if (index + 1 < $scope.stringResults.length) {
                //         $scope.stringResults[index + 1].previous = $scope.stringResults[index - 1];
                //     }
                //     $scope.stringResults.splice(index, 1);
                // }
            }
            $scope.$watch("stringResults", function() {
                $timeout(()=>{
                    let elts = $($element).find('[data-toggle="tooltip"]');
                    elts.tooltip();
                }, 0)
                // this is a hack to queue this action
                // after the dom has updated
            }, true);

            

            this.$onInit = function() {
                $scope.store = createStore(transformReducerApp);
                //stringResults

                $scope.store.subscribe(() => {
                    let state = this.store.getState();
                    $scope.stringResults = state.transformList;

                    this.updateStorage(state);
                    this.setState(()=> {return this.updateFromState(state)});
                });



                $($element).find('[data-toggle="tooltip"]').tooltip()
            }
            
        }]
    }
}])