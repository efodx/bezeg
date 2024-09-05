import { ErrorPage } from './ErrorPage';
import App from './App';
import { WelcomePage } from './WelcomePage';
import { BernsteinGraph } from './graphs/bernstein/BernsteinGraph';
import BezierCurveGraph from './graphs/curves/bezier/BezierCurveGraph';
import DecasteljauGraph from './graphs/curves/bezier/DecasteljauGraph';
import DecasteljauGraph2 from './graphs/curves/bezier/DecasteljauGraph2';
import AffineTransformBezierCurveGraph
  from './graphs/curves/bezier/AffineTransformsBezierCurveGraph';
import DecasteljauGraph3 from './graphs/curves/bezier/DecasteljauGraph3';
import ExtrapolationGraph from './graphs/curves/bezier/ExtrapolationGraph';
import ElevationGraph from './graphs/curves/bezier/ElevationGraph';
import UniformParamBezierCurveGraph
  from './graphs/curves/parametrisations/UniformParamBezierCurveGraph';
import AlphaParamBezierCurveGraph
  from './graphs/curves/parametrisations/AlphaParamBezierCurveGraph';
import QuinticPhBezierCurve from './graphs/curves/ph/QuinticPhBezierCurveGraph';
import CubicPhBezierCurveGraph from './graphs/curves/ph/CubicPhBezierCurveGraph';
import G1SymmetricSplineGraph
  from './graphs/curves/spline/G1SymmetricSplineGraph';
import G1SplineGraph from './graphs/curves/spline/G1SplineGraph';
import C2SplineGraph from './graphs/curves/spline/C2SplineGraph';
import C1SplineGraph from './graphs/curves/spline/C1SplineGraph';
import RationalBezierCurveCircleGraphN
  from './graphs/curves/rational/RationalBezierCurveCircleGraphN';
import FarinPointsCurveGraph
  from './graphs/curves/rational/FarinPointsCurveGraph';
import RationalBezierCurveGraph
  from './graphs/curves/rational/FarinPointsCurveGraph';
import RationalSubdivisionGraph
  from './graphs/curves/rational/RationalSubdivisionGraph';
import RationalExtrapolationGraph
  from './graphs/curves/rational/RationalExtrapolationGraph';
import RationalElevationGraph
  from './graphs/curves/rational/RationalElevationGraph';
import RationalDecasteljauGraph
  from './graphs/curves/rational/RationalDecasteljauGraph';
import SubdivisionGraph from './graphs/curves/bezier/SubdivisionGraph';
import CnSplineGraph from './graphs/curves/spline/CnSplineGraph';
import SplineAlphaParametrizationGraph
  from './graphs/curves/parametrisations/SplineAlphaParametrizationGraph';
import { RefreshContext } from './graphs/context/react/RefreshContext';
import { useState } from 'react';

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
        element: <AffineTransformBezierCurveGraph/>,
        title: 'Afine Transformacije',
      }, {
        group: BEZIER_CURVES_GROUP,
        path: PATH_BEZIER_CURVES + '/subdivision-2',
        element: <DecasteljauGraph3/>,
        title: 'Subdivizija',
      }, {
        group: BEZIER_CURVES_GROUP,
        path: PATH_BEZIER_CURVES + '/subdivision',
        element: <SubdivisionGraph/>,
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
        title: 'Racionalni De Casteljau',
      }, {
        group: RATIONAL_CURVES_GROUP,
        path: PATH_RATIONAL_CURVES + '/rational-elevation',
        element: <RationalElevationGraph/>,
        title: 'Višanje stopnje',
      }, {
        path: PATH_RATIONAL_CURVES + '/rational-extrapolation',
        element: <RationalExtrapolationGraph/>,
        title: 'Ekstrapolacija',
        group: RATIONAL_CURVES_GROUP,
      }, {
        path: PATH_RATIONAL_CURVES + '/rational-subdivision',
        element: <RationalSubdivisionGraph/>,
        title: 'Subdivizija',
        group: RATIONAL_CURVES_GROUP,
      }, {
        path: PATH_RATIONAL_CURVES + '/farin-points',
        element: <FarinPointsCurveGraph/>,
        title: 'Farinove Točke',
        group: RATIONAL_CURVES_GROUP,
      }, // {
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
      }, // {
      //   path: PATH_RATIONAL_CURVES + '/circleizpeljava',
      //   element: <IzpeljavaGraf/>,
      //   title: 'Izpeljava',
      //   group: RATIONAL_CURVES_GROUP,
      // },
      {
        path: PATH_SPLINE_CURVES + '/spline',
        element: <CnSplineGraph/>,
        title: 'Enostranski Cn Zlepek',
        group: SPLINES_GROUP,
      }, {
        path: PATH_SPLINE_CURVES + '/c1spline',
        element: <C1SplineGraph/>,
        title: 'Simetrični C1 Zlepek',
        group: SPLINES_GROUP,
      }, {
        path: PATH_SPLINE_CURVES + '/c2spline',
        element: <C2SplineGraph/>,
        title: 'Simetrični C2 Zlepek',
        group: SPLINES_GROUP,
      }, {
        path: PATH_SPLINE_CURVES + '/g1spline',
        element: <G1SplineGraph/>,
        title: 'Enostranski G1 Zlepek',
        group: SPLINES_GROUP,
      }, {
        path: PATH_SPLINE_CURVES + '/g1-sym-spline',
        element: <G1SymmetricSplineGraph/>,
        title: 'Simetrični G1 Zlepek',
        group: SPLINES_GROUP,
      }, // {
      //   path: PATH_SPLINE_CURVES + '/g1affinespline',
      //   element: <G1AffineSplineGraph/>,
      //   title: 'G1 Afini Zlepek',
      //   group: SPLINES_GROUP,
      // },
      {
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
        element: <SplineAlphaParametrizationGraph/>,
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