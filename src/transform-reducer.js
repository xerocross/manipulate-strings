/* eslint-disable no-case-declarations */
let Transform = require("./Transform");
// clone in a specific way
// for the business logic 
function cloneTransformList (list) {
    if (list.length == 0) {
        return [];
    }
    let clonedList = [];
    clonedList.push(list[0].getClone());
    for (let i = 1; i < list.length; i++) {
        let cloneTransform = list[i].getClone();
        cloneTransform.previous = clonedList[i-1]
        clonedList.push(cloneTransform);
    }
    return clonedList;
}

function cloneState (state) {
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
            let deadTransform = newState.transformList[action.index];
            if (action.index + 1 < newState.transformList.length) {
                newState.transformList[action.index + 1].previous = deadTransform.previous;
            }
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