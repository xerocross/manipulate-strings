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
            expect(mockScope.stringResults[0].toString()).toBe("apple");
        });

        it ("text change updates the stringResults array", () => {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            $(elem.find(".main-string-input")[0]).val("apple").trigger('input');
            $(elem.find(".main-string-input")[0]).val("pear").trigger('input');
            expect(mockScope.stringResults[0].toString()).toBe("pear");
        });

        it ("result strings are shown", () => {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            $(elem.find(".main-string-input")[0]).val("apple").trigger('input');
            expect(mockScope.stringResults[0].toString()).toBe("apple");
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
            expect(mockScope.stringResults[1].toString()).toBe("ale");
        });

        it ("clicking reverse string pushes a new element to resultStrings", () => {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            $(elem.find(".main-string-input")[0]).val("apple").trigger('input');
            $(elem.find(".reverse-string-button")[0]).trigger("click");
            expect(mockScope.stringResults[1].toString()).toBe("elppa");
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
            expect(mockScope.stringResults[1].toString()).toBe("applepie");
        });

        it ("if inputString is pristine, remove-spaces-button disabled", () => {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            mockScope.$digest();
            expect(elem.find(".remove-spaces-button")[0].hasAttribute("disabled")).toBe(true);
        });

        it("replace substrings",function() {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            let testString = "appleappleapple";
            $(elem.find(".main-string-input")[0]).val(testString).trigger('input');

            let substring = "ea";
            let newSubstring = "bat";
            let expectedResult = "applbatpplbatpple";
            let replaceSubstringInput = elem.find(".replace-substring-input")[0];
            let newSubstringInput = elem.find(".new-substring-input")[0];
            let replaceSubstringButton = elem.find(".replace-substring-button");
            $(replaceSubstringInput).val(substring).trigger("input");
            $(newSubstringInput).val(newSubstring).trigger("input");
            $(newSubstringInput).val(newSubstring).trigger("input");
            replaceSubstringButton.trigger("click");
            mockScope.$digest();
            expect(mockScope.stringResults[1].toString()).toBe(expectedResult);
        })
        it("replace substrings button disabled if substring is ''",function() {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            let replaceSubstringButton = elem.find(".replace-substring-button");
            mockScope.$digest();
            expect($(replaceSubstringButton).is(":disabled")).toBe(true);
        })

        it ("removing an element from stringResults causes recompute", () => {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            $(elem.find(".main-string-input")[0]).val("apple pie").trigger('input');
            $(elem.find(".remove-spaces-button")[0]).trigger("click");
            $(elem.find(".reverse-string-button")[0]).trigger("click");
            expect(mockScope.stringResults.length).toBe(3);
            expect(mockScope.stringResults[2].toString()).toBe("eipelppa");
            mockScope.removeTransform(1);
            expect(mockScope.stringResults.length).toBe(2);
            expect(mockScope.stringResults[1].toString()).toBe("eip elppa");
        });

        it ("removing last element from mockScope works if len at least 2", () => {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            $(elem.find(".main-string-input")[0]).val("apple pie").trigger('input');
            $(elem.find(".reverse-string-button")[0]).trigger("click");

            expect(mockScope.stringResults[1].toString()).toBe("eip elppa");
            mockScope.removeTransform(1);
            let len = mockScope.stringResults.length
            expect(mockScope.stringResults[len-1].toString()).toBe("apple pie");
        });

        it ("click remove button removes a transform", () => {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            $(elem.find(".main-string-input")[0]).val("apple pie").trigger('input');
            $(elem.find(".reverse-string-button")[0]).trigger("click");
            expect(mockScope.stringResults.length).toBe(2);
            let removeButton = $(elem.find(".result-array-container")[0]).find("[data-remove-button=1]");
            $(removeButton).trigger("click"); // <- corresponds to mockScope.stringResults[1]
            expect(mockScope.stringResults.length).toBe(1);
        });


        it ("accurately reflects a sequence of transforms", () => {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            $(elem.find(".main-string-input")[0]).val("apple pie brandy").trigger('input');
            $(elem.find(".reverse-string-button")[0]).trigger("click");
            // ydnarb eip elppa
            $(elem.find(".remove-spaces-button")[0]).trigger("click");
            let len = mockScope.stringResults.length;
            expect(mockScope.stringResults[len - 1].toString()).toBe("ydnarbeipelppa");
        });

        it ("accurately reflects a sequence of transforms even after removing one", () => {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            $(elem.find(".main-string-input")[0]).val("apple pie brandy").trigger('input');
            $(elem.find(".reverse-string-button")[0]).trigger("click");
            // ydnarb eip elppa
            $(elem.find(".remove-spaces-button")[0]).trigger("click");
            let removeButton = $(elem.find(".result-array-container")[0]).find("[data-remove-button=1]")[0]
            $(removeButton).trigger("click");
            let len = mockScope.stringResults.length;
            expect(mockScope.stringResults[len - 1].toString()).toBe("applepiebrandy");
        });

        it ("can alphabatize string", () => {
            let compileFn = compileService("<manipulate-strings></manipulate-strings>");
            let elem = compileFn(mockScope);
            $(elem.find(".main-string-input")[0]).val("apple pie brandy").trigger('input');
            $(elem.find(".alphabatize-string-button")[0]).trigger("click");
            let expected = "  aabdeeilnpppry"
            let len = mockScope.stringResults.length;
            expect(mockScope.stringResults[len - 1].toString()).toBe(expected);
        });
    })
