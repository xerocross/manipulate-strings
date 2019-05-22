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