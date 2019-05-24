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