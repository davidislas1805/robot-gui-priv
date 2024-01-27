import ReactSwitch from "react-switch";

// Style 1
const STYLE_1 = {
    ON_COLOR: "#C2C6A7",
    HANDLE_ON_OFF_COLOR: "#C2C6A7",
    ACTIVE_BOX_SHADOW: "0px 0px 1px 10px rgba(194, 198, 167, 0.2)"
}

// Style 2
const STYLE_2 = {
    ON_COLOR: "#ECCE8E",
    HANDLE_ON_OFF_COLOR: "#ECCE8E",
    ACTIVE_BOX_SHADOW: "0px 0px 1px 10px rgba(236, 206, 142, 0.2)"
};

const HANDLE_DIAMETER = 25;
const BOX_SHADOW = "0px 1px 5px rgba(0, 0, 0, 0.6)";
const HEIGHT_WEIGHT = [20, 48];

export default function StyledSwitch({init_checked = false, switchHandle, style_mode = 1}){
    const styleSwitchHandle = (state) => {
        switchHandle(state);
    };
    return(
        <ReactSwitch onChange={styleSwitchHandle} checked={init_checked}
            className="config-switch"
            onColor = {style_mode === 1 ? STYLE_1.ON_COLOR : STYLE_2.ON_COLOR} 
            onHandleColor = {style_mode === 1 ? STYLE_1.HANDLE_ON_OFF_COLOR : STYLE_2.HANDLE_ON_OFF_COLOR} 
            handleDiameter = {HANDLE_DIAMETER}
            offHandleColor = {style_mode === 1 ? STYLE_1.HANDLE_ON_OFF_COLOR : STYLE_2.HANDLE_ON_OFF_COLOR} 
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow = {BOX_SHADOW}
            activeBoxShadow = {style_mode === 1 ? STYLE_1.ACTIVE_BOX_SHADOW : STYLE_2.ACTIVE_BOX_SHADOW}
            height={HEIGHT_WEIGHT[0]}
            width={HEIGHT_WEIGHT[1]}/>
    )
}