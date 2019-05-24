const template = `
<div>
    <h2>Transform List</h2>
    <table class="result-array-container table">
        <thead>
            <tr>
                <th class="index-col" scope="col">#</th>
                <th scope="col" class="function-col">Transformation</th>
                <th scope="col">Result</th>
                <th scope="col" lass="remove-button">Delete</th>
            </tr>
        </thead>
        <tbody>
            <tr class="" ng-repeat="transform in transformArray track by transform.id">
                <th class="index-col" scope="row">{{ $index }}</th>
                <td class="function-col">{{transform.description}}</td>
                <td class=""><span class="result-string">{{ transform.toString() }}</span></td>
                <td class="remove-button">
                    <span class = "btn-span" ng-if="$index > 0" data-remove-button="{{ $index }}"
                        ng-click="removeTransform($index)"
                        data-toggle="tooltip"
                        data-placement="top" 
                        title="remove just this transform from the sequence"    
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
        scope: {
            transformArray: "<",
            removeTransformFunction: "<"
        },
        controller : function() {
            this.$onChanges = function () {
                console.log("onchange");
            }
            
        }
    }
});