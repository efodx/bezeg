import {PointAttributes} from "jsxgraph";

function pi(i: number): PointAttributes {
    return {
        size: 5,
        label: {
            fontSize: 15,
            useMathJax: true,
            autoPosition: false,
            parse: false
        },
        name: "$$p_{" + i + "}$$"
    }
}

export const Labels = {
    pi: pi
}