import BezierCurveGraph from "./graphs/BezierCurveGraph";
import GraphSubdivision from "./graphs/SubdivisionGraph";
import {ErrorPage} from "./ErrorPage";
import App from "./App";
import {WelcomePage} from "./WelcomePage";
import ExtrapolationGraph from "./graphs/ExtrapolationGraph";
import ElevationGraph from "./graphs/ElevationGraph";
import DecasteljauGraph from "./graphs/DecasteljauGraph";
import RationalBezierCurveGraph from "./graphs/RationalBezierCurveGraph";
import RationalElevationGraph from "./graphs/RationalElevationGraph";
import RationalExtrapolationGraph from "./graphs/RationalExtrapolationGraph";
import RationalSubdivisionGraph from "./graphs/RationalSubdivisionGraph";
import ScaleBezierCurveGraph from "./graphs/AffineTransformsBezierCurveGraph";
import SplineGraph from "./graphs/C0SplineGraph";
import C1SplineGraph from "./graphs/C1SplineGraph";
import G1SplineGraph from "./graphs/G1SplineGraph";

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
                path: "/bezeg/affine",
                element: <ScaleBezierCurveGraph/>,
                title: "Afine Transformacije"
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
                element: <ElevationGraph/>,
                title: "Dvig Stopnje"
            },
            {
                path: "/bezeg/rational",
                element: <RationalBezierCurveGraph/>,
                title: "Racionalna Bezierjeva Krivulja"
            },
            {
                path: "/bezeg/rational-elevation",
                element: <RationalElevationGraph/>,
                title: "Dvig Stopnje Racionalne"
            },
            {
                path: "/bezeg/rational-extrapolation",
                element: <RationalExtrapolationGraph/>,
                title: "Ekstrapolacija Racionalne"
            },
            {
                path: "/bezeg/rational-subdivision",
                element: <RationalSubdivisionGraph/>,
                title: "Subdivizija Racionalne"
            },
            {
                path: "/bezeg/spline",
                element: <SplineGraph/>,
                title: "C0 Zlepek"
            },
            {
                path: "/bezeg/c1spline",
                element: <C1SplineGraph/>,
                title: "C1 Zlepek"
            },
            {
                path: "/bezeg/g1spline",
                element: <G1SplineGraph/>,
                title: "G1 Zlepek"
            },
        ],
    }
]

export default routes