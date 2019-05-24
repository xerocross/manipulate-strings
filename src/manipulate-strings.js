let createStore = require("redux").createStore;
let transformReducerApp = require("./transform-reducer").transformReducerApp;

let template = require("./manipulate-strings-template").template;
require("./manipulate-strings-service.js");
angular.module("manipulateStringsApp", ["manipulateStringsMod"])
require("./transform-list.js");

let StoreActions = require("./transform-actions.js");

angular.module("manipulateStringsApp")
.directive("manipulateStrings", ["manipulateStringsService", function(manipulateStringsService) {
    return {

        template: template,
        controller : ["$scope", "$element", "$timeout", "$window", function($scope, $element, $timeout, $window) {
            $scope.inputString = "";
            $scope.transformList = [];
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
                $scope.store.dispatch(StoreActions.getSetInitialValueAction(inputString));
            }
            $scope.removeDuplicated = function() {
                let transformFunc =  (x) => manipulateStringsService.removeDuplicated(x)
                let description = "remove duplicated"
                $scope.store.dispatch(StoreActions.getAddTransformAction(description, transformFunc));
            }
            $scope.reverseString = function() {
                let transformFunc =  (x) => manipulateStringsService.reverse(x)
                let description = "reverse"
                $scope.store.dispatch(StoreActions.getAddTransformAction(description, transformFunc));
            }
            $scope.removeSpaces = function() {
                let transformFunc =  (x) => manipulateStringsService.removeSpaces(x)
                let description = "remove spaces"
                $scope.store.dispatch(StoreActions.getAddTransformAction(description, transformFunc));
            }
            $scope.replaceSubstringAll = function(substring, newSubstring) {
                let transformFunc = (x)=>manipulateStringsService.replaceSubstringAll(substring, newSubstring)(x);
                let description = `replace all ${substring} with ${newSubstring}`;
                $scope.store.dispatch(StoreActions.getAddTransformAction(description, transformFunc));

            }
            $scope.alphabatize = function() {
                let transformFunc = (x)=>manipulateStringsService.alphabatize(x);
                $scope.store.dispatch(StoreActions.getAddTransformAction(`alphabatize`, transformFunc));
            }
            $scope.removeTransform = (index) => {
                $scope.store.dispatch(StoreActions.getRemoveTransformAction(index));
            }

            this.$onInit = function() {
                $scope.store = createStore(transformReducerApp);
                $scope.store.subscribe(() => {
                    let state = $scope.store.getState();
                    $scope.transformList = state.transformList;
                });
                $($element).find('[data-toggle="tooltip"]').tooltip()
            }
            
        }]
    }
}])