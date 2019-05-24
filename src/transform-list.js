const template = `
<div>
    <table class="result-array-container table">
        <thead>
            <tr>
                <th class="index-col" scope="col">#</th>
                <th scope="col" class="function-col">Transform</th>
                <th scope="col" class="result-string-box">Result</th>
                <th scope="col" lass="remove-button">Delete</th>
            </tr>
        </thead>
        <tbody>
            <tr class="" ng-repeat="transform in transformArray track by transform.id">
                <th class="index-col" scope="row">{{ $index }}</th>
                <td class="function-col">{{transform.description}}</td>
                <td class="result-string-box"><span class="result-string">{{ transform.toString() }}</span></td>
                <td class="remove-button">
                    <span class = "btn-span" ng-if="$index > 0" data-remove-button="{{ $index }}"
                        ng-click="removeItem($index)"
                        data-toggle="tooltip"
                        data-placement="top" 
                        title="remove this transform; the others will be unaffected"    
                    >
                        delete
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`
angular.module("manipulateStringsApp")
.directive("transformList", function() {
    return {
        template : template,
        restrict : "E",
        bindToController: {
            transformArray: "<"
        },
        scope: {
            transformArray: "<",
            removeTransformFunction: "<"
        },
        controller : ["$scope", "$element", "$timeout", function($scope, $element, $timeout) {
            this.$onChanges = function () {
                $timeout(()=> {
                    $($element).find('[data-toggle="tooltip"]').tooltip();
                }, 0);
            }
            $scope.removeItem = (index) => {
                $($element).find('[data-toggle="tooltip"]').tooltip("dispose");
                $scope.removeTransformFunction(index);
            }
        }]
    }
});