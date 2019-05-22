let mockScope;
let compileService;

require("./manipulate-strings.js");

describe("manipulate strings dir",() => {
    beforeEach(() => {
        angular.mock.module("manipulateStringsApp");
        angular.mock.inject(function($rootScope, $compile) {
            mockScope = $rootScope.$new();
            compileService = $compile
        });
    });

    it ("updates the inputElement", () => {
        let compileFn = compileService("<manipulate-strings></manipulate-strings>");
        let elem = compileFn(mockScope);
        expect(elem.find(".main-string-input").length).toBe(1);
        $(elem.find(".main-string-input")[0]).val("apple").trigger('input');
        mockScope.$digest();
        expect(mockScope.inputString).toBe("apple");
    });

    it ("text change updates the stringResults array", () => {
        let compileFn = compileService("<manipulate-strings></manipulate-strings>");
        let elem = compileFn(mockScope);
        expect(elem.find(".main-string-input").length).toBe(1);
        $(elem.find(".main-string-input")[0]).val("apple").trigger('input');
        expect(mockScope.stringResults[0].string).toBe("apple");
    });

    it ("text change updates the stringResults array", () => {
        let compileFn = compileService("<manipulate-strings></manipulate-strings>");
        let elem = compileFn(mockScope);
        $(elem.find(".main-string-input")[0]).val("apple").trigger('input');
        $(elem.find(".main-string-input")[0]).val("pear").trigger('input');
        expect(mockScope.stringResults[0].string).toBe("pear");
    });

    it ("result strings are shown", () => {
        let compileFn = compileService("<manipulate-strings></manipulate-strings>");
        let elem = compileFn(mockScope);
        $(elem.find(".main-string-input")[0]).val("apple").trigger('input');
        expect(mockScope.stringResults[0].string).toBe("apple");
        mockScope.$digest()
        expect($(elem.find(".result-array-container")[0]).find(".result-string").length).toBe(1);
        let resultParagraph = $(elem.find(".result-array-container")[0]).find(".result-string")[0];
        expect(resultParagraph.innerText).toBe("apple");
    });

    it ("clicking remove duplicated pushes a new element to resultStrings", () => {
        let compileFn = compileService("<manipulate-strings></manipulate-strings>");
        let elem = compileFn(mockScope);
        $(elem.find(".main-string-input")[0]).val("apple").trigger('input');
        $(elem.find(".remove-duplicated-button")[0]).trigger("click");
        expect(mockScope.stringResults[1].string).toBe("ale");
    });

    it ("clicking reverse string pushes a new element to resultStrings", () => {
        let compileFn = compileService("<manipulate-strings></manipulate-strings>");
        let elem = compileFn(mockScope);
        $(elem.find(".main-string-input")[0]).val("apple").trigger('input');
        $(elem.find(".reverse-string-button")[0]).trigger("click");
        expect(mockScope.stringResults[1].string).toBe("elppa");
    });

    it ("if inputString is pristine, remove-duplicated-button disabled", () => {
        let compileFn = compileService("<manipulate-strings></manipulate-strings>");
        let elem = compileFn(mockScope);
        mockScope.$digest();
        expect(elem.find(".remove-duplicated-button")[0].hasAttribute("disabled")).toBe(true);
    });

    it ("if inputString is pristine, reverse-string-button disabled", () => {
        let compileFn = compileService("<manipulate-strings></manipulate-strings>");
        let elem = compileFn(mockScope);
        mockScope.$digest();
        expect(elem.find(".reverse-string-button")[0].hasAttribute("disabled")).toBe(true);
    });

    it ("clicking remove spaces pushes a new element to resultStrings", () => {
        let compileFn = compileService("<manipulate-strings></manipulate-strings>");
        let elem = compileFn(mockScope);
        $(elem.find(".main-string-input")[0]).val("a p p l  e p ie").trigger('input');
        $(elem.find(".remove-spaces-button")[0]).trigger("click");
        expect(mockScope.stringResults[1].string).toBe("applepie");
    });

    it ("if inputString is pristine, remove-spaces-button disabled", () => {
        let compileFn = compileService("<manipulate-strings></manipulate-strings>");
        let elem = compileFn(mockScope);
        mockScope.$digest();
        expect(elem.find(".remove-spaces-button")[0].hasAttribute("disabled")).toBe(true);
    });
})