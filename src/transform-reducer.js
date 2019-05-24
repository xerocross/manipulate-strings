

// makes a shallow copy
var cloneTransformList = function(list) {
    let clone = [];
    for (let i = 0; i < list.length; i++) {
        clone.push(list[i]);
    }
    return clone;
}

var cloneState = function(state) {
    cloneTransformList(state.transformList);
}

const init = {
    transformList : []
}
module.exports.transformReducerApp = function(state, action) {

    if (typeof state == "undefined") {
        return init;
    }
    let newState = cloneState(state);

    switch (action.type) {
        case "REMOVE_TRANSFORM":
            newState.transformList.splice(action.index, 1);
            break;
    }
    return newState;
}