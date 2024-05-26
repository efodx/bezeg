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

const PATH_RATIONAL_CURVES = "/bezeg/rational"
const PATH_SPLINE_CURVES = "/bezeg/spline"
const PATH_PH_CURVES = "/bezeg/ph"
const PATH_PARAM = "/bezeg/param"
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
                group: "Racionalne Bezierjeve Krivulje",
                group_path: PATH_RATIONAL_CURVES,
                path: PATH_RATIONAL_CURVES + "/base",
                element: <RationalBezierCurveGraph/>,
                title: "Racionalna Bezierjeva Krivulja"
            },
            {
                group: "Racionalne Bezierjeve Krivulje",
                group_path: PATH_RATIONAL_CURVES,
                path: PATH_RATIONAL_CURVES + "/rational-elevation",
                element: <RationalElevationGraph/>,
                title: "Dvig Stopnje Racionalne"
            },
            {
                group_path: PATH_RATIONAL_CURVES,
                path: PATH_RATIONAL_CURVES + "/rational-extrapolation",
                element: <RationalExtrapolationGraph/>,
                title: "Ekstrapolacija Racionalne",
                group: "Racionalne Bezierjeve Krivulje"
            },
            {
                group_path: PATH_RATIONAL_CURVES,
                path: PATH_RATIONAL_CURVES + "/rational-subdivision",
                element: <RationalSubdivisionGraph/>,
                title: "Subdivizija Racionalne",
                group: "Racionalne Bezierjeve Krivulje"
            },
            {
                group_path: PATH_SPLINE_CURVES,
                path: PATH_SPLINE_CURVES + "/spline",
                element: <SplineGraph/>,
                title: "C0 Zlepek",
                group: "Zlepki"
            },
            {
                group_path: PATH_SPLINE_CURVES,
                path: PATH_SPLINE_CURVES + "/c1spline",
                element: <C1SplineGraph/>,
                title: "C1 Zlepek",
                group: "Zlepki"
            },
            {
                group_path: PATH_SPLINE_CURVES,
                path: PATH_SPLINE_CURVES + "/g1spline",
                element: <G1SplineGraph/>,
                title: "G1 Zlepek",
                group: "Zlepki"
            },
            {
                group_path: PATH_SPLINE_CURVES,
                path: PATH_SPLINE_CURVES + "/c2spline",
                element: <C2SplineGraph/>,
                title: "C2 Zlepek",
                group: "Zlepki"
            },
            {
                group_path: PATH_SPLINE_CURVES,
                path: PATH_SPLINE_CURVES + "/g1affinespline",
                element: <G1AffineSplineGraph/>,
                title: "G1 Afini Zlepek",
                group: "Zlepki"
            },
            {
                group_path: PATH_PH_CURVES,
                path: PATH_PH_CURVES + "/cubic",
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
                group_path: PATH_PH_CURVES,
                path: PATH_PH_CURVES + "/phcurves/quintic",
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
                group_path: PATH_PARAM,
                path: PATH_PARAM + "/param/alphaparam",
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
                group_path: PATH_PARAM,
                path: PATH_PARAM + "/param/uniform",
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