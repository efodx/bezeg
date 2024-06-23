import {PointAttributes} from "jsxgraph";

function pi(i: number): PointAttributes {
    return {
        size: 3.5,
        label: {
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