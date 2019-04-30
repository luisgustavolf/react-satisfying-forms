export function flattenObject(rootNode: {[prop: string]: any}) {
    return flattenObjectLoop({...rootNode})
}

function flattenObjectLoop(rootNode: {[prop: string]: any}, parents: string[] = []) {
    let flattenObj: { [name: string]: any } = {}
    for (const key in rootNode) {
        if (rootNode.hasOwnProperty(key)) {
            if (typeof rootNode[key] == "object")
                flattenObj = { ...flattenObj, ...flattenObjectLoop(rootNode[key], [...parents, key])}
            else {
                flattenObj[[...parents,key].join('.')] = rootNode[key] 
            }
        }
    }

    return flattenObj;
}