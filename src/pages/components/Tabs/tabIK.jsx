import ARM_IK from "../lib/kinematics/inverseKinematics.js"
import {base_link_length,link1_length, link2_length, link3_length, link4_length, link5_length} from "../lib/utilities3D/constThreeDParams.js"
import MySlider from "../SliderAndSwitch/mySlider.jsx";
import { rotMatrixFRPY, degree2rad, getCase } from "../lib/utilities3D/general_methods.js";
import './tab.css';
import { useState, useEffect, useRef } from "react";
import StyledSwitch from "../SliderAndSwitch/styledSwitch.jsx";

const ARM_IK_SOLVER = new ARM_IK([base_link_length, link1_length, link2_length, link3_length, link4_length, link5_length]);

let computed_forward_angles, computed_backward_angles, selected_solution, local_viewer_data = [];

let tcp_rot = [
    [1, 0, 0],    
    [0, 1, 0], 
    [0, 0, 1]
];

let tcp_target_pos = [9, 8, 8];//[13, 0, 5];  [17, 0, 5]

[computed_forward_angles, computed_backward_angles] = ARM_IK_SOLVER.runIK(tcp_target_pos, tcp_rot); //12, 0, 18

export default function TabIK({robotHandler, scene_const, updateHook, switchJF}){
    const [RPY, setRPY] = useState([0, 0, 0]);
    const [XYZ, setXYZ] = useState(tcp_target_pos);
    const [backAndforth, setBackAndforth] = useState(false);
    const [elbowUp, setElbow] = useState(false);
    const [flipWrist, setWrist] = useState(false);
    const [resetRPY, setResetSlider] = useState(false);
    const [resetXYZ, setResetXYZ] = useState(false);
    const ikAngles = useRef([0, 0, 0, 0, 0, 0]);
    
    let tcp_position = useRef([0, 0, 0]);
    let rpy = [0, 0, 0];

    const switchBack = (back_state) => {
        setBackAndforth(back_state);
    }

    const switchElbow = (state) => {
        setElbow(state);
    }

    const switchWrist = (state) => {
        setWrist(state);
    }

    const handleReset = (resetID) => {
        switch (resetID) {
            case "RPY":
                tcp_rot = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
                setRPY([0, 0, 0]);
                setResetSlider((reset_rpy) => !reset_rpy);
                break;
            case "XYZ":
                tcp_target_pos = [9, 8, 8];
                setXYZ([9, 8, 8]);
                setResetXYZ((reset_xyz) => !reset_xyz);
                break;
            default:
                break;
        }
    }

    const rotateArm = (value, sliderID) => {
        switch (sliderID) {
            case "Roll":
                RPY[0] = value;
                break;
            case "Pitch":
                RPY[1] = value;
                break;
            case "Yaw":
                RPY[2] = value;
                break;
            default:
                break;
        }
        rpy = RPY;
        tcp_rot = rotMatrixFRPY(degree2rad(rpy[0]), degree2rad(rpy[1]), degree2rad(rpy[2]));
        setRPY((RPY) => [RPY[0], RPY[1], RPY[2]]);
    }

    const moveArm = (value, sliderID) => {
        switch (sliderID) {
            case "X":
                XYZ[0] = value;
                break;
            case "Y":
                XYZ[1] = value;
                break;
            case "Z":
                XYZ[2] = value;
                break;
            default:
                break;
        }
        tcp_target_pos = XYZ;
        setXYZ((XYZ) => [XYZ[0], XYZ[1], XYZ[2]]);
    }

    const sendMatrix = () => {
        window.ipcRenderer.send('send-HT', [tcp_rot, tcp_target_pos]);
    };
    
    useEffect(() => {
        sendMatrix();
        [computed_forward_angles, computed_backward_angles] = ARM_IK_SOLVER.runIK(tcp_target_pos, tcp_rot);
        selected_solution = getCase(((backAndforth << 2) + (elbowUp << 1) + flipWrist), computed_forward_angles, computed_backward_angles);
        tcp_position.current = robotHandler.updateRobotArm(selected_solution);
        ikAngles.current = selected_solution;
        updateHook(local_viewer_data.concat(scene_const, robotHandler.renderArm()));
    }, [switchJF, RPY, backAndforth, elbowUp, flipWrist, XYZ, robotHandler, scene_const, updateHook]);
    
    return(
        <div className="parent-tab">
            <div className="upper-data-tab">
                    <div className="data-container">
                        <div>
                            <div className="upper-data-element-tab margin-element">
                                <div>
                                    <span className="upper-data-element-title">IK angles    </span>
                                    <span className="upper-data-element small-text">{ikAngles.current[0].toFixed(2)}  </span>
                                    <span className="upper-data-element small-text">{ikAngles.current[1].toFixed(2)}  </span>
                                    <span className="upper-data-element small-text">{ikAngles.current[2].toFixed(2)}  </span>
                                    <span className="upper-data-element small-text">{ikAngles.current[3].toFixed(2)}  </span>
                                    <span className="upper-data-element small-text">{ikAngles.current[4].toFixed(2)}  </span>
                                    <span className="upper-data-element small-text">{ikAngles.current[5].toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="upper-data-element-tab margin-element">
                                <div><span className="upper-data-element-title">Configurations   </span></div>
                                <div>
                                    <span className="upper-data-element-title tab-right">Backward</span>
                                    <span className="upper-data-element-title tab-right">Elbow-up</span>
                                    <span className="upper-data-element-title tab-right">Flip Wrist</span>
                                </div>
                            </div>
                            <div className="upper-data-element-tab margin-element">
                                <div>
                                    <span style={{marginRight: "20px"}}><StyledSwitch init_checked = {backAndforth} switchHandle={switchBack}/></span>
                                    <span style={{marginRight: "20px"}}><StyledSwitch init_checked={elbowUp} switchHandle={switchElbow}/></span>
                                    <span><StyledSwitch init_checked={flipWrist} switchHandle={switchWrist}/></span>
                                </div>
                            </div>
                            <div className="upper-data-element-tab">
                                <span className="upper-data-element-title">TCP position:     </span>
                                <span className="upper-data-element">{tcp_position.current[0].toFixed(1)}  </span>
                                <span className="upper-data-element">{tcp_position.current[1].toFixed(1)}  </span>
                                <span className="upper-data-element">{tcp_position.current[2].toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
            </div>
            <div>
                <div className="slider-group-container">
                    <div className="slider-row-container">
                        <span className="upper-data-element-title">TCP RPY:    </span>
                        <span className="upper-data-element">{RPY[0]}  </span>
                        <span className="upper-data-element">{RPY[1]}  </span>
                        <span className="upper-data-element">{RPY[2]}</span>
                    </div>
                    <div className="slider-row-container">
                        <span className="upper-data-element-title">TCP XYZ: </span>
                        <span className="upper-data-element">{tcp_target_pos[0]}  </span>
                        <span className="upper-data-element">{tcp_target_pos[1]}  </span>
                        <span className="upper-data-element">{tcp_target_pos[2]}</span>
                    </div>
                </div>
                <div className="button-container">
                    <div className="button-wrapper">
                        <span className="button-span button-tab">
                            <button className="reset-button" onClick={() => handleReset("RPY")}>Reset RPY</button>
                         </span>
                        <span className="button-span">
                            <button className="reset-button" onClick={() => handleReset("XYZ")}>Reset XYZ</button>
                        </span>
                    </div>
                </div>
                <div className="slider-group-container">
                    <div className="slider-row-container">
                        <div>
                            <div>
                                <span className="upper-data-element-title">Roll: </span> 
                                <span className="upper-data-element">{RPY[0]}</span>
                            </div>
                            <div>
                                <MySlider range={[-180, 180]} handler={(value) => {rotateArm(value, "Roll")}} default_value={0} reset={resetRPY}/>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span className="upper-data-element-title">Pitch: </span> 
                                <span className="upper-data-element">{RPY[1]}</span>
                            </div>
                            <div>
                                <MySlider range={[-180, 180]} handler={(value) => {rotateArm(value, "Pitch")}} default_value={0} reset={resetRPY}/>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span className="upper-data-element-title">Yaw: </span> 
                                <span className="upper-data-element">{RPY[2]}</span>
                            </div>
                            <div>
                                <MySlider range={[-180, 180]} handler={(value) => {rotateArm(value, "Yaw")}} default_value={0} reset={resetRPY}/>
                            </div>
                        </div>
                    </div>
                    <div className="slider-row-container">
                        <div>
                            <div>
                                <span className="upper-data-element-title">X: </span>
                                <span className="upper-data-element">{tcp_target_pos[0]}</span>
                            </div>
                            <div>
                                <MySlider range={[-10, 14]} handler={(value) => {moveArm(value, "X")}} default_value={9} reset={resetXYZ}/>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span className="upper-data-element-title">Y: </span>
                                <span className="upper-data-element">{tcp_target_pos[1]}</span>
                            </div>
                            <div>
                                <MySlider range={[-12, 12]} handler={(value) => {moveArm(value, "Y")}} default_value={8} reset={resetXYZ}/>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span className="upper-data-element-title">Z: </span>
                                <span className="upper-data-element">{tcp_target_pos[2]}</span>
                            </div>
                            <div>
                                <MySlider range={[-8, 15]} handler={(value) => {moveArm(value, "Z")}} default_value={8} reset={resetXYZ}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="upper-data-element-title">Gripper: </div>
                    <div>
                        <MySlider range={[-50, 50]} handler={(value) => console.log(value)} default_value={0} slider_disabled={true}/>
                    </div>
                </div>
            </div>
        </div>
    );
};