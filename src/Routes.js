import BezierCurveGraph from "./graphs/bezier/BezierCurveGraph";
import GraphSubdivision from "./graphs/bezier/SubdivisionGraph";
import {ErrorPage} from "./ErrorPage";
import App from "./App";
import {WelcomePage} from "./WelcomePage";
import ExtrapolationGraph from "./graphs/bezier/ExtrapolationGraph";
import ElevationGraph from "./graphs/bezier/ElevationGraph";
import DecasteljauGraph from "./graphs/bezier/DecasteljauGraph";
import RationalBezierCurveGraph from "./graphs/rational/RationalBezierCurveGraph";
import RationalElevationGraph from "./graphs/rational/RationalElevationGraph";
import RationalExtrapolationGraph from "./graphs/rational/RationalExtrapolationGraph";
import RationalSubdivisionGraph from "./graphs/rational/RationalSubdivisionGraph";
import AffineBezierGraph from "./graphs/bezier/AffineTransformsBezierCurveGraph";
import SplineGraph from "./graphs/spline/C0SplineGraph";
import C1SplineGraph from "./graphs/spline/C1SplineGraph";
import G1SplineGraph from "./graphs/spline/G1SplineGraph";
import G1AffineSplineGraph from "./graphs/spline/G1AffineSplineGraph";
import C2SplineGraph from "./graphs/spline/C2SplineGraph";
import CubicPhBezierCurveGraph from "./graphs/ph/CubicPhBezierCurveGraph";
import QuinticPhBezierCurve from "./graphs/ph/QuinticPhBezierCurveGraph";
import AlphaParamBezierCurveGraph from "./graphs/parametrisations/AlphaParamBezierCurveGraph";
import UniformParamBezierCurveGraph from "./graphs/parametrisations/UniformParamBezierCurveGraph";

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
                element: <BezierCurveGraph areCurvesSelectable={true} allowSelectedCurveShrink={true}/>,
                title: "Bezierjeva Krivulja"
            },
            {
                path: "/bezeg/decasteljau",
                element: <DecasteljauGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={false}/>,
                title: "Decasteljau"
            },
            {
                path: "/bezeg/affine",
                element: <AffineBezierGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}/>,
                title: "Afine Transformacije"
            },
            {
                path: "/bezeg/subdivision",
                element: <GraphSubdivision
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}/>,
                title: "Subdivizija"
            },
            {
                path: "/bezeg/extrapolation",
                element: <ExtrapolationGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={false}/>,
                title: "Ekstrapolacija"
            },
            {
                path: "/bezeg/elevation",
                element: <ElevationGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={false}/>,
                title: "Dvig Stopnje"
            },
            {
                path: "/bezeg/rational",
                element: <RationalBezierCurveGraph/>,
                title: "Racionalna Bezierjeva Krivulja",
                group: "Racionalne Bezierjeve Krivulje"
            },
            {
                path: "/bezeg/rational-elevation",
                element: <RationalElevationGraph/>,
                title: "Dvig Stopnje Racionalne",
                group: "Racionalne Bezierjeve Krivulje"
            },
            {
                path: "/bezeg/rational-extrapolation",
                element: <RationalExtrapolationGraph/>,
                title: "Ekstrapolacija Racionalne",
                group: "Racionalne Bezierjeve Krivulje"
            },
            {
                path: "/bezeg/rational-subdivision",
                element: <RationalSubdivisionGraph/>,
                title: "Subdivizija Racionalne",
                group: "Racionalne Bezierjeve Krivulje"
            },
            {
                path: "/bezeg/spline",
                element: <SplineGraph/>,
                title: "C0 Zlepek",
                group: "Zlepki"
            },
            {
                path: "/bezeg/c1spline",
                element: <C1SplineGraph/>,
                title: "C1 Zlepek",
                group: "Zlepki"
            },
            {
                path: "/bezeg/g1spline",
                element: <G1SplineGraph/>,
                title: "G1 Zlepek",
                group: "Zlepki"
            },
            {
                path: "/bezeg/c2spline",
                element: <C2SplineGraph/>,
                title: "C2 Zlepek",
                group: "Zlepki"
            },
            {
                path: "/bezeg/g1affinespline",
                element: <G1AffineSplineGraph/>,
                title: "G1 Afini Zlepek",
                group: "Zlepki"
            },
            {
                path: "/bezeg/phcurves/cubic",
                element: <CubicPhBezierCurveGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={false}/>,
                title: "Stopnje 3",
                group: "PH Krivulje"
            },
            {
                path: "/bezeg/phcurves/quintic",
                element: <QuinticPhBezierCurve
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={false}/>,
                title: "Stopnje 5",
                group: "PH Krivulje"
            },
            {
                path: "/bezeg/param/alphaparam",
                element: <AlphaParamBezierCurveGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={false}/>,
                title: "Alpha Parametrizacija",
                group: "Parametrizacije"
            },
            {
                path: "/bezeg/param/uniform",
                element: <UniformParamBezierCurveGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={false}/>,
                title: "Enakomerna Parametrizacija",
                group: "Parametrizacije"
            }

        ],
    }
]

export default routes