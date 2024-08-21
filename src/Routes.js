import BezierCurveGraph from './graphs/bezier/BezierCurveGraph';
import GraphSubdivision from './graphs/bezier/SubdivisionGraph';
import { ErrorPage } from './ErrorPage';
import App from './App';
import { WelcomePage } from './WelcomePage';
import ExtrapolationGraph from './graphs/bezier/ExtrapolationGraph';
import ElevationGraph from './graphs/bezier/ElevationGraph';
import DecasteljauGraph from './graphs/bezier/DecasteljauGraph';
import RationalBezierCurveGraph
  from './graphs/rational/RationalBezierCurveGraph';
import RationalElevationGraph from './graphs/rational/RationalElevationGraph';
import RationalExtrapolationGraph
  from './graphs/rational/RationalExtrapolationGraph';
import RationalSubdivisionGraph
  from './graphs/rational/RationalSubdivisionGraph';
import AffineBezierGraph from './graphs/bezier/AffineTransformsBezierCurveGraph';
import SplineGraph from './graphs/spline/C0SplineGraph';
import C1SplineGraph from './graphs/spline/C1SplineGraph';
import G1SplineGraph from './graphs/spline/G1SplineGraph';
import G1AffineSplineGraph from './graphs/spline/G1AffineSplineGraph';
import C2SplineGraph from './graphs/spline/C2SplineGraph';
import CubicPhBezierCurveGraph from './graphs/ph/CubicPhBezierCurveGraph';
import QuinticPhBezierCurve from './graphs/ph/QuinticPhBezierCurveGraph';
import AlphaParamBezierCurveGraph
  from './graphs/parametrisations/AlphaParamBezierCurveGraph';
import UniformParamBezierCurveGraph
  from './graphs/parametrisations/UniformParamBezierCurveGraph';
import { useState } from 'react';
import RationalBezierCurveCircleGraphN
  from './graphs/rational/RationalBezierCurveCircleGraphN';
import { BernsteinGraph } from './graphs/bernstein/BernsteinGraph';
import FarinPointsCurveGraph from './graphs/rational/FarinPointsCurveGraph';
import { RefreshContext } from './graphs/context/react/RefreshContext';
import C3SplineGraph from './graphs/spline/C3SplineGraph';
import C2SplineGraphParametrization
  from './graphs/parametrisations/SplineAlphaParametrizationGraph';
import RationalDecasteljauGraph
  from './graphs/rational/RationalDecasteljauGraph';
import DecasteljauGraph2 from './graphs/bezier/DecasteljauGraph2';
import DecasteljauGraph3 from './graphs/bezier/DecasteljauGraph3';

const PATH_BEZIER_CURVES = '/bezeg/bezier';
const BEZIER_CURVES_GROUP = {
  title: 'Bezierjeve Krivulje', path: PATH_BEZIER_CURVES,
};

const PATH_RATIONAL_CURVES = '/bezeg/rational';
const RATIONAL_CURVES_GROUP = {
  title: 'Racionalne Bezierjeve Krivulje', path: PATH_RATIONAL_CURVES,
};

const PATH_SPLINE_CURVES = '/bezeg/spline';
const SPLINES_GROUP = {
  title: 'Zlepki', path: PATH_SPLINE_CURVES,
};

const PATH_PH_CURVES = '/bezeg/ph';
const PH_CURVES_GROUP = {
  title: 'PH Krivulje', path: PATH_PH_CURVES,
};

const PATH_PARAM = '/bezeg/param';
const PARAMETRIZATION_GROUP = {
  title: 'Parametrizacije', path: PATH_PARAM,
};

const routes = [
  {
    title: BEZIER_CURVES_GROUP,
    path: '/bezeg',
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '', index: true, element: <WelcomePage/>, title: '',
      }, {
        path: '/bezeg/bernstein',
        element: <BernsteinGraph/>,
        title: 'Bernsteinovi Polinomi',
      }, {
        group: BEZIER_CURVES_GROUP,
        path: PATH_BEZIER_CURVES + '/curve',
        element: <BezierCurveGraph/>,
        title: 'Bezierjeva Krivulja',
      }, {
        group: BEZIER_CURVES_GROUP,
        path: PATH_BEZIER_CURVES + '/decasteljau',
        element: <DecasteljauGraph/>,
        title: 'De Casteljau',
      }, {
        group: BEZIER_CURVES_GROUP,
        path: PATH_BEZIER_CURVES + '/decasteljau2',
        element: <DecasteljauGraph2/>,
        title: 'De Casteljau Drugače',
      }, {
        group: BEZIER_CURVES_GROUP,
        path: PATH_BEZIER_CURVES + '/affine',
        element: <AffineBezierGraph/>,
        title: 'Afine Transformacije',
      },
      {
        group: BEZIER_CURVES_GROUP,
        path: PATH_BEZIER_CURVES + '/subdivision-2',
        element: <DecasteljauGraph3/>,
        title: 'Subdivizija',
      }, {
        group: BEZIER_CURVES_GROUP,
        path: PATH_BEZIER_CURVES + '/subdivision',
        element: <GraphSubdivision/>,
        title: 'Zaporedna subdivizija',
      }, {
        group: BEZIER_CURVES_GROUP,
        path: PATH_BEZIER_CURVES + '/extrapolation',
        element: <ExtrapolationGraph/>,
        title: 'Ekstrapolacija',
      }, {
        group: BEZIER_CURVES_GROUP,
        path: PATH_BEZIER_CURVES + '/elevation',
        element: <ElevationGraph/>,
        title: 'Višanje stopnje',
      }, {
        group: RATIONAL_CURVES_GROUP,
        path: PATH_RATIONAL_CURVES + '/base',
        element: <RationalBezierCurveGraph/>,
        title: 'Racionalna Bezierjeva Krivulja',
      }, {
        group: RATIONAL_CURVES_GROUP,
        path: PATH_RATIONAL_CURVES + '/rational-decasteljau',
        element: <RationalDecasteljauGraph/>,
        title: 'Racionalni Decasteljau',
      }, {
        group: RATIONAL_CURVES_GROUP,
        path: PATH_RATIONAL_CURVES + '/rational-elevation',
        element: <RationalElevationGraph/>,
        title: 'Višanje stopnje Racionalne',
      }, {
        path: PATH_RATIONAL_CURVES + '/rational-extrapolation',
        element: <RationalExtrapolationGraph/>,
        title: 'Ekstrapolacija Racionalne',
        group: RATIONAL_CURVES_GROUP,
      }, {
        path: PATH_RATIONAL_CURVES + '/rational-subdivision',
        element: <RationalSubdivisionGraph/>,
        title: 'Subdivizija Racionalne',
        group: RATIONAL_CURVES_GROUP,
      }, {
        path: PATH_RATIONAL_CURVES + '/farin-points',
        element: <FarinPointsCurveGraph/>,
        title: 'Farinove Točke',
        group: RATIONAL_CURVES_GROUP,
      },
      // {
      //   path: PATH_RATIONAL_CURVES + '/circle4',
      //   element: <RationalBezierCurveCircleGraph4/>,
      //   title: 'Krožnica iz 4 kosov',
      //   group: RATIONAL_CURVES_GROUP,
      // },
      //
      {
        path: PATH_RATIONAL_CURVES + '/circlen',
        element: <RationalBezierCurveCircleGraphN/>,
        title: 'Krožnica iz n kosov',
        group: RATIONAL_CURVES_GROUP,
      },
      // {
      //   path: PATH_RATIONAL_CURVES + '/circleizpeljava',
      //   element: <IzpeljavaGraf/>,
      //   title: 'Izpeljava',
      //   group: RATIONAL_CURVES_GROUP,
      // },
      {
        path: PATH_SPLINE_CURVES + '/spline',
        element: <SplineGraph/>,
        title: 'C0 Zlepek',
        group: SPLINES_GROUP,
      }, {
        path: PATH_SPLINE_CURVES + '/c1spline',
        element: <C1SplineGraph/>,
        title: 'C1 Zlepek',
        group: SPLINES_GROUP,
      }, {
        path: PATH_SPLINE_CURVES + '/g1spline',
        element: <G1SplineGraph/>,
        title: 'G1 Zlepek',
        group: SPLINES_GROUP,
      }, {
        path: PATH_SPLINE_CURVES + '/c2spline',
        element: <C2SplineGraph/>,
        title: 'C2 Zlepek',
        group: SPLINES_GROUP,
      }, {
        path: PATH_SPLINE_CURVES + '/c3spline',
        element: <C3SplineGraph/>,
        title: 'C3 Zlepek',
        group: SPLINES_GROUP,
      }, {
        path: PATH_SPLINE_CURVES + '/g1affinespline',
        element: <G1AffineSplineGraph/>,
        title: 'G1 Afini Zlepek',
        group: SPLINES_GROUP,
      }, {
        path: PATH_PH_CURVES + '/cubic',
        element: <CubicPhBezierCurveGraph/>,
        title: 'Stopnje 3',
        group: PH_CURVES_GROUP,
      }, {
        path: PATH_PH_CURVES + '/quintic',
        element: <QuinticPhBezierCurve/>,
        title: 'Stopnje 5',
        group: PH_CURVES_GROUP,
      }, {
        path: PATH_PARAM + '/param/alphaparam2',
        element: <C2SplineGraphParametrization/>,
        title: 'Prava Alpha Parametrizacija',
        group: PARAMETRIZATION_GROUP,
      }, {
        path: PATH_PARAM + '/param/alphaparam',
        element: <AlphaParamBezierCurveGraph/>,
        title: 'Alpha Parametrizacija',
        group: PARAMETRIZATION_GROUP,
      }, {
        path: PATH_PARAM + '/param/uniform',
        element: <UniformParamBezierCurveGraph/>,
        title: 'Enakomerna Parametrizacija',
        group: PARAMETRIZATION_GROUP,
      },

    ],
  }];

function Refresher (props) {
  const [key, setKey] = useState(1);

  return <RefreshContext.Provider value={() => setKey(key + 1)}>
    <div key={key}>{props.children}</div>
  </RefreshContext.Provider>;
}

routes[0].children.forEach(
  route => route.element = <Refresher>{route.element}</Refresher>);

export default routes;