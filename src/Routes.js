import Graph from "./graphs/Graph";
import GraphSubdivision from "./graphs/GraphSubdivision";
import {ErrorPage} from "./ErrorPage";
import App from "./App";
import {WelcomePage} from "./WelcomePage";
import GraphExtrapolation from "./graphs/GraphExtrapolation";
import GraphDecasteljau from "./graphs/GraphDecasteljau";

const routes = [
    {
        title: "Bezierjeve Krivulje",
        path: "/bezeg",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "",
                index: true,
                element: <WelcomePage/>,
                title: ""
            },
            {
                path: "/bezeg/curves",
                element: <Graph/>,
                title: "Bezierjeva Krivulja"
            },
            {
                path: "/bezeg/decasteljau",
                element: <GraphDecasteljau/>,
                title: "Decasteljau"
            },
            {
                path: "/bezeg/subdivision",
                element: <GraphSubdivision/>,
                title: "Subdivizija"
            },
            {
                path: "/bezeg/extrapolation",
                element: <GraphExtrapolation/>,
                title: "Ekstrapolacija"
            },
        ],
    }
]

export default routes