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
            <form name="stringInputForm" data-toggle="tooltip" data-placement="top" title="change text to pipe it through the transforms below">
                <input class="form-control main-string-input" name="mainStringInput" type="text" ng-model="inputString"
                    ng-change="inputChange(inputString)" />
            </form>
            
            <transform-list 
                transform-array = "transformList"
                remove-transform-function = "removeTransform"

            ></transform-list>
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
                            ng-click="alphabatize(transformList[transformList.length - 1].string)"
                        >
                            alphabatize
                        </button>
                    </div>
                    <div ng-show = "selectedTransform == 'reverse'">
                        <button ng-disabled="stringInputForm.mainStringInput.$pristine" class="btn btn-primary 
                            reverse-string-button" ng-click="reverseString(transformList[transformList.length - 1].string)">
                            reverse string
                        </button>
                    </div>
                    <div ng-show = "selectedTransform == 'nodupes'">
                        <button ng-disabled="stringInputForm.mainStringInput.$pristine"
                            class="btn btn-primary remove-duplicated-button"
                            ng-click="removeDuplicated(transformList[transformList.length - 1].string)">
                            remove chars that appear more than once
                        </button>
                    </div>
                    <div ng-show = "selectedTransform == 'nospace'">
                        <button ng-disabled="stringInputForm.mainStringInput.$pristine" class="btn btn-primary 
                        remove-spaces-button" ng-click="removeSpaces(transformList[transformList.length - 1].string)">
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