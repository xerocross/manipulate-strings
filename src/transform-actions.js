module.exports.getRemoveTransformAction = function(index) {
    return {
        type: "REMOVE_TRANSFORM",
        index : index
    }
}
module.exports.getAddTransformAction = function (description, transformFunction) {
    return {
        type: "ADD_TRANSFORM",
        description: description,
        transformFunction: transformFunction,
    }
}
module.exports.getSetInitialValueAction = function (val) {
    return {
        type: "SET_INIT",
        value : val
    }
}