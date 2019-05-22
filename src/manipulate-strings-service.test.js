require("angular-mocks");

let service;

describe("mutateStringService",() => {
    beforeEach(() => {
        angular.mock.module("manipulateStringsMod");
        angular.mock.inject(function(manipulateStringsService) {
            service = manipulateStringsService;
        });
    });

    it("reverses a string (1)",function() {
        let testString = "apple is fun";
        let expectedResult = "nuf si elppa"
        expect(service.reverse(testString)).toBe(expectedResult);
    })
    it("reverses a string (2)",function() {
        let testString = "a";
        let expectedResult = "a"
        expect(service.reverse(testString)).toBe(expectedResult);
    })
    it("reverses a string (3)",function() {
        let testString = "";
        let expectedResult = ""
        expect(service.reverse(testString)).toBe(expectedResult);
    })

    it("remove duplicated",function() {
        let testString = "nan";
        let expectedResult = "a"
        expect(service.removeDuplicated(testString)).toBe(expectedResult);
    })

    it("remove duplicated",function() {
        let testString = "suite erase";
        let expectedResult = "uit ra"
        expect(service.removeDuplicated(testString)).toBe(expectedResult);
    })

    it("remove duplicated",function() {
        let testString = "aaaqppddd";
        let expectedResult = "q"
        expect(service.removeDuplicated(testString)).toBe(expectedResult);
    })

    it("removeSubstringAll (1)",function() {
        let testString = "appleappleapple";
        let substringToRemove = "ea";
        let expectedResult = "applpplpple"
        expect(service.removeSubstringAll(testString, substringToRemove)).toBe(expectedResult);
    })
    it("removeSubstringAll (2)",function() {
        let testString = "ea";
        let substringToRemove = "ea";
        let expectedResult = ""
        expect(service.removeSubstringAll(testString, substringToRemove)).toBe(expectedResult);
    })
    it("removeSubstringAll (3)",function() {
        let testString = "apple";
        let substringToRemove = "q";
        let expectedResult = "apple"
        expect(service.removeSubstringAll(testString, substringToRemove)).toBe(expectedResult);
    })
    it("removeSubstringAll (4)",function() {
        let testString = "";
        let substringToRemove = "q";
        let expectedResult = ""
        expect(service.removeSubstringAll(testString, substringToRemove)).toBe(expectedResult);
    })

    it("removes spaces",function() {
        let testString = "a p p l  e p i e";
        let expectedResult = "applepie"
        expect(service.removeSpaces(testString)).toBe(expectedResult);
    })
})