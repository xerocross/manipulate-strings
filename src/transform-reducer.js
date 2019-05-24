/* eslint-disable no-case-declarations */

let Transform = require("./Transform");


// makes a shallow copy
var cloneTransformList = function(list) {
    let clone = [];
    for (let i = 0; i < list.length; i++) {
        let cloneTransform = list[i].getClone();
        clone.push(cloneTransform);
        if (i > 0) {
            cloneTransform.previous = clone[i-1]
        }
    }
    return clone;
}

var cloneState = function(state) {
    return {
        transformList : cloneTransformList(state.transformList)
    }
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
        case "ADD_TRANSFORM":
            let len = newState.transformList.length;
            let previous;
            if (len == 0) {
                previous = null
            } else {
                previous = newState.transformList[len - 1];
            }
            newState.transformList.push(new Transform(previous, action.description, action.transformFunction))
            break;
        case "SET_INIT":
            let transform = new Transform(null, "reflect", x => x, action.value);
            newState.transformList[0] = transform;
            if (newState.transformList[1]) {
                newState.transformList[1].previous = transform;
            }
            break;
        default:
            break;
    }
    return newState;
}