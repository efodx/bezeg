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
import {useState} from "react";
import {RefreshContext} from "./Contexts";
import RationalBezierCurveCircleGraph4 from "./graphs/rational/RationalBezierCurveCircleGraph4";
import RationalBezierCurveCircleGraphN from "./graphs/rational/RationalBezierCurveCircleGraphN";
import {BernsteinGraph} from "./graphs/bernstein/BernsteinGraph";
import FarinPointsCurveGraph from "./graphs/rational/FarinPointsCurveGraph";

const PATH_BEZIER_CURVES = "/bezeg/bezier"
const BEZIER_CURVES_GROUP = "Bezierjeve Krivulje";

const PATH_RATIONAL_CURVES = "/bezeg/rational"
const RATIONAL_CURVES_GROUP = "Racionalne Bezierjeve Krivulje";

const PATH_SPLINE_CURVES = "/bezeg/spline"
const SPLINES_GROUP = "Zlepki";

const PATH_PH_CURVES = "/bezeg/ph"
const PH_CURVES_GROUP = "PH Krivulje";

const PATH_PARAM = "/bezeg/param"
const PARAMETRIZATION_GROUP = "Parametrizacije";

const routes = [
    {
        title: BEZIER_CURVES_GROUP,
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
                path: "/bezeg/bernstein",
                element: <BernsteinGraph/>,
                title: "Bernsteinovi Polinomi"
            },
            {
                group: BEZIER_CURVES_GROUP,
                path: PATH_BEZIER_CURVES + "/curve",
                element: <BezierCurveGraph areCurvesSelectable={true} allowSelectedCurveShrink={true}/>,
                title: "Bezierjeva Krivulja"
            },
            {
                group: BEZIER_CURVES_GROUP,
                path: PATH_BEZIER_CURVES + "/decasteljau",
                element: <DecasteljauGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={false}/>,
                title: "Decasteljau"
            },
            {
                group: BEZIER_CURVES_GROUP,
                path: PATH_BEZIER_CURVES + "/affine",
                element: <AffineBezierGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}/>,
                title: "Afine Transformacije"
            },
            {
                group: BEZIER_CURVES_GROUP,
                path: PATH_BEZIER_CURVES + "/subdivision",
                element: <GraphSubdivision
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}/>,
                title: "Subdivizija"
            },
            {
                group: BEZIER_CURVES_GROUP,
                path: PATH_BEZIER_CURVES + "/extrapolation",
                element: <ExtrapolationGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={false}/>,
                title: "Ekstrapolacija"
            },
            {
                group: BEZIER_CURVES_GROUP,
                path: PATH_BEZIER_CURVES + "/elevation",
                element: <ElevationGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={true}/>,
                title: "Dvig Stopnje"
            },
            {
                group: RATIONAL_CURVES_GROUP,
                group_path: PATH_RATIONAL_CURVES,
                path: PATH_RATIONAL_CURVES + "/base",
                element: <RationalBezierCurveGraph/>,
                title: "Racionalna Bezierjeva Krivulja"
            },
            {
                group: RATIONAL_CURVES_GROUP,
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
                group: RATIONAL_CURVES_GROUP
            },
            {
                group_path: PATH_RATIONAL_CURVES,
                path: PATH_RATIONAL_CURVES + "/rational-subdivision",
                element: <RationalSubdivisionGraph/>,
                title: "Subdivizija Racionalne",
                group: RATIONAL_CURVES_GROUP
            },
            {
                group_path: PATH_RATIONAL_CURVES,
                path: PATH_RATIONAL_CURVES + "/farin-points",
                element: <FarinPointsCurveGraph/>,
                title: "Farinove Točke",
                group: RATIONAL_CURVES_GROUP
            },
            {
                group_path: PATH_RATIONAL_CURVES,
                path: PATH_RATIONAL_CURVES + "/circle4",
                element: <RationalBezierCurveCircleGraph4/>,
                title: "Krožnica iz 4 kosov",
                group: RATIONAL_CURVES_GROUP
            },
            {
                group_path: PATH_RATIONAL_CURVES,
                path: PATH_RATIONAL_CURVES + "/circlen",
                element: <RationalBezierCurveCircleGraphN/>,
                title: "Krožnica iz n kosov",
                group: RATIONAL_CURVES_GROUP
            },
            {
                group_path: PATH_SPLINE_CURVES,
                path: PATH_SPLINE_CURVES + "/spline",
                element: <SplineGraph/>,
                title: "C0 Zlepek",
                group: SPLINES_GROUP
            },
            {
                group_path: PATH_SPLINE_CURVES,
                path: PATH_SPLINE_CURVES + "/c1spline",
                element: <C1SplineGraph/>,
                title: "C1 Zlepek",
                group: SPLINES_GROUP
            },
            {
                group_path: PATH_SPLINE_CURVES,
                path: PATH_SPLINE_CURVES + "/g1spline",
                element: <G1SplineGraph/>,
                title: "G1 Zlepek",
                group: SPLINES_GROUP
            },
            {
                group_path: PATH_SPLINE_CURVES,
                path: PATH_SPLINE_CURVES + "/c2spline",
                element: <C2SplineGraph/>,
                title: "C2 Zlepek",
                group: SPLINES_GROUP
            },
            {
                group_path: PATH_SPLINE_CURVES,
                path: PATH_SPLINE_CURVES + "/g1affinespline",
                element: <G1AffineSplineGraph/>,
                title: "G1 Afini Zlepek",
                group: SPLINES_GROUP
            },
            {
                group_path: PATH_PH_CURVES,
                path: PATH_PH_CURVES + "/cubic",
                element: <CubicPhBezierCurveGraph
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={true}/>,
                title: "Stopnje 3",
                group: PH_CURVES_GROUP
            },
            {
                group_path: PATH_PH_CURVES,
                path: PATH_PH_CURVES + "/quintic",
                element: <QuinticPhBezierCurve
                    allowSelectedCurveDecasteljau={false}
                    allowSelectedCurveElevation={false}
                    allowSelectedCurveExtrapolation={false}
                    allowSelectedCurveSubdivision={false}
                    allowSelectedCurveControlPolygon={true}/>,
                title: "Stopnje 5",
                group: PH_CURVES_GROUP
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
                group: PARAMETRIZATION_GROUP
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
                group: PARAMETRIZATION_GROUP
            }

        ],
    }
]


function Refresher(props) {
    const [key, setKey] = useState(1)
    return <RefreshContext.Provider value={() => setKey(key + 1)}>
        <div key={key}>{props.children}</div>
    </RefreshContext.Provider>
}

routes[0].children.forEach(route => route.element = <Refresher>{route.element}</Refresher>)

export default routes