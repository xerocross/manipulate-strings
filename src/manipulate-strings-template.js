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