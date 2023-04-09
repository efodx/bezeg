import BezierCurveGraph from "./graphs/BezierCurveGraph";
import GraphSubdivision from "./graphs/SubdivisionGraph";
import {ErrorPage} from "./ErrorPage";
import App from "./App";
import {WelcomePage} from "./WelcomePage";
import ExtrapolationGraph from "./graphs/ExtrapolationGraph";
import GraphElevation from "./graphs/ExtrapolationGraph";
import DecasteljauGraph from "./graphs/DecasteljauGraph";
import RationalBezierCurveGraph from "./graphs/RationalBezierCurveGraph";

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
                element: <BezierCurveGraph/>,
                title: "Bezierjeva Krivulja"
            },
            {
                path: "/bezeg/decasteljau",
                element: <DecasteljauGraph/>,
                title: "Decasteljau"
            },
            {
                path: "/bezeg/subdivision",
                element: <GraphSubdivision/>,
                title: "Subdivizija"
            },
            {
                path: "/bezeg/extrapolation",
                element: <ExtrapolationGraph/>,
                title: "Ekstrapolacija"
            },
            {
                path: "/bezeg/elevation",
                element: <GraphElevation/>,
                title: "Dviganje Stopnje"
            },
            {
                path: "/bezeg/rational",
                element: <RationalBezierCurveGraph/>,
                title: "Racionalna Bezierjeva Krivulja"
            },
        ],
    }
]

export default routes