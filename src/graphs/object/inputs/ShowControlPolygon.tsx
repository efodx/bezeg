import {AbstractJSXPointControlledCurve} from "../AbstractJSXPointControlledCurve";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";

export function ShowControlPolygon(curve: AbstractJSXPointControlledCurve<any, any>) {
    return <OnOffSwitch initialState={curve.isShowingControlPolygon()}
                        onChange={(e) => curve.showControllPolygon(e)}
                        label={"Kontrolni poligon"}></OnOffSwitch>
}