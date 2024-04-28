import MySlider from "../SliderAndSwitch/mySlider";
import { degree2rad } from "../lib/utilities3D/general_methods";
import { useEffect, useRef, useState } from "react";
import './tab.css';

const default_values = [48.8141, -11.1427, 91.7191, 130.8005, 83.8105, -172.8803];
let local_joint5_theta = default_values[5], local_joint4_theta = default_values[4], local_joint3_theta = default_values[3], local_joint2_theta = default_values[2], local_joint1_theta = default_values[1], local_joint_base_theta = default_values[0];
let local_viewer_data = [];


export default function TabDK({robotHandler, scene_const, buffer, updateHook, switchJF, switchTCP}){
    const [JOINT_5_THETA, setJoint5Theta] = useState(default_values[5]);
    const [JOINT_4_THETA, setJoint4Theta] = useState(default_values[4]);
    const [JOINT_3_THETA, setJoint3Theta] = useState(default_values[3]);
    const [JOINT_2_THETA, setJoint2Theta] = useState(default_values[2]);
    const [JOINT_1_THETA, setJoint1Theta] = useState(default_values[1]);
    const [JOINT_BASE_THETA, setJointBase] = useState(default_values[0]);
    const [resetJ123, setResetJ123] = useState(false);
    const [resetWrist, setResetWrist] = useState(false);

    const tcp_position = useRef([0, 0, 0]);
    const tcp_rot_matrix = useRef([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);

    const handleReset = (resetID) => {
        switch (resetID) {
            case 'J123':
                setResetJ123((resetJ123) => !resetJ123);
                local_joint_base_theta = default_values[0];
                local_joint1_theta = default_values[1];
                local_joint2_theta = default_values[2];
                break;
            case 'Wrist':
                local_joint3_theta = default_values[3];
                local_joint4_theta = default_values[4];
                local_joint5_theta = default_values[5];
                setResetWrist((resetWrist) => !resetWrist);
                break;
            default:
                break;
        }

        setJointBase(local_joint_base_theta);
        setJoint1Theta(local_joint1_theta);
        setJoint2Theta(local_joint2_theta);
        setJoint3Theta(local_joint3_theta);
        setJoint4Theta(local_joint4_theta);
        setJoint5Theta(local_joint5_theta);
    }

    const moveArm = (value, theta_case) => {
        switch (theta_case) {
            case 'baseTheta':
                local_joint_base_theta = value;
                buffer[0] = value;
                setJointBase(value);
                break;
            case 'joint_1':
                local_joint1_theta = value;
                buffer[1] = value;
                setJoint1Theta(value);
                break;
            case 'joint_2':
                local_joint2_theta = value;
                buffer[2] = value;
                setJoint2Theta(value);
                break;
            case 'joint_3':
                local_joint3_theta = value;
                buffer[3] = value;
                setJoint3Theta(value);
                break;
            case 'joint_4':
                local_joint4_theta = value;
                buffer[4] = value;
                setJoint4Theta(value);
                break;
            case 'joint_5':
                local_joint5_theta = value;
                buffer[5] = value;
                setJoint5Theta(value);
                break;
            default:
                break;
        }
        tcp_position.current = robotHandler.updateRobotArm([degree2rad(local_joint_base_theta), degree2rad(local_joint1_theta), degree2rad(local_joint2_theta), degree2rad(local_joint3_theta), degree2rad(local_joint4_theta), degree2rad(local_joint5_theta)]);
        tcp_rot_matrix.current = robotHandler.getTCPMatrix();
        updateHook(local_viewer_data.concat(scene_const, robotHandler.renderArm()));
    };
    
    useEffect(() => {
        tcp_position.current = robotHandler.updateRobotArm([degree2rad(local_joint_base_theta), degree2rad(local_joint1_theta), degree2rad(local_joint2_theta), degree2rad(local_joint3_theta), degree2rad(local_joint4_theta), degree2rad(local_joint5_theta)]);
        tcp_rot_matrix.current = robotHandler.getTCPMatrix();
        updateHook(local_viewer_data.concat(scene_const, robotHandler.renderArm()));
    }, [switchJF, switchTCP, robotHandler, scene_const, updateHook, resetJ123, resetWrist]);

    return(
        <div className="parent-tab">
            <div className="upper-data-tab">
                <div className="data-container">
                    <div>
                        <div>
                            <div style={{marginBottom: '20px'}}>
                                <span className="upper-data-element-title tab-right">TCP XYZ:</span>
                                <span className="upper-data-element tab-right">{tcp_position.current[0].toFixed(2)} </span>
                                <span className="upper-data-element tab-right">{(tcp_position.current[1] > 0 ? ' ': '')}{tcp_position.current[1].toFixed(2)} </span>
                                <span className="upper-data-element">{(tcp_position.current[2] > 0 ? ' ': '')}{tcp_position.current[2].toFixed(2)}</span>
                            </div>
                            <div>
                                <div className="upper-data-element-title">TCP Rotation:</div>
                                <span>
                                    <span className="upper-data-element tab-right">{tcp_rot_matrix.current[0][0].toFixed(2)}</span>
                                    <span className="upper-data-element tab-right">{tcp_rot_matrix.current[0][1] > 0 ? ' ':''}{tcp_rot_matrix.current[0][1].toFixed(2)}</span>
                                    <span className="upper-data-element">{tcp_rot_matrix.current[0][2] > 0 ? ' ':''}{tcp_rot_matrix.current[0][2].toFixed(2)}</span>
                                </span>
                                <div>
                                    <span className="upper-data-element tab-right">{tcp_rot_matrix.current[1][0].toFixed(2)}</span>
                                    <span className="upper-data-element tab-right">{tcp_rot_matrix.current[1][1] > 0 ? ' ':''}{tcp_rot_matrix.current[1][1].toFixed(2)}</span>
                                    <span className="upper-data-element">{tcp_rot_matrix.current[1][2] > 0 ? ' ':''}{tcp_rot_matrix.current[1][2].toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="upper-data-element tab-right">{tcp_rot_matrix.current[2][0].toFixed(2)}</span>
                                    <span className="upper-data-element tab-right">{tcp_rot_matrix.current[2][1] > 0 ? ' ':''}{tcp_rot_matrix.current[2][1].toFixed(2)}</span>
                                    <span className="upper-data-element">{tcp_rot_matrix.current[2][2] > 0 ? ' ':''}{tcp_rot_matrix.current[2][2].toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="button-container" style={{height: '27%'}}>
                    <div className="button-wrapper">
                        <span className="button-span button-tab">
                            <button className="reset-button" onClick={() => handleReset('J123')}>Reset J123</button>
                        </span>
                        <span className="button-span">
                            <button className="reset-button" onClick={() => handleReset('Wrist')}>Reset Wrist</button>
                        </span>
                    </div>
                </div>
                <div className="slider-group-container">
                    <div className="slider-row-container">
                        <div>
                            <div>
                                <span className="upper-data-element-title">Base Theta: </span>
                                <span className="upper-data-element">{JOINT_BASE_THETA.toFixed(0)}º</span>
                            </div>
                            <div>
                                <MySlider range={[-180, 180]} handler={(value) => {moveArm(value, "baseTheta")}} default_value={default_values[0]} reset={resetJ123}/>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span className="upper-data-element-title">Joint 1:</span>
                                <span className="upper-data-element">{JOINT_1_THETA.toFixed(0)}º</span>
                            </div>
                            <div>
                                <MySlider range={[-180, 180]} handler={(value) => {moveArm(value, "joint_1")}} default_value={default_values[1]} reset={resetJ123}/>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span className="upper-data-element-title">Joint 2:</span>
                                <span className="upper-data-element">{JOINT_2_THETA.toFixed(0)}º</span>
                            </div>
                            <div>
                                <MySlider range={[-180, 180]} handler={(value) => {moveArm(value, "joint_2")}} default_value={default_values[2]} reset={resetJ123}/>
                            </div>
                        </div>
                    </div>
                    <div className="slider-row-container">
                        <div>
                            <div>
                                <span className="upper-data-element-title">Joint 3:</span>
                                <span className="upper-data-element">{JOINT_3_THETA.toFixed(0)}º</span>
                            </div>
                            <div>
                                <MySlider range={[-180, 180]} handler={(value) => {moveArm(value, "joint_3")}} default_value={default_values[3]} reset={resetWrist}/>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span className="upper-data-element-title">Joint 4:</span>
                                <span className="upper-data-element">{JOINT_4_THETA.toFixed(0)}º</span>
                            </div>
                            <div>
                                <MySlider range={[-180, 180]} handler={(value) => {moveArm(value, "joint_4")}} default_value={default_values[4]} reset={resetWrist}/>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span className="upper-data-element-title">Joint 5:</span>
                                <span className="upper-data-element">{JOINT_5_THETA.toFixed(0)}º</span>
                            </div>
                            <div>
                                <MySlider range={[-180, 180]} handler={(value) => {moveArm(value, "joint_5")}} default_value={default_values[5]} reset={resetWrist}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="gripper-container">
                        <div className="gripper-wrapper">
                            <div className="upper-data-element-title">Gripper:</div>
                        <div>
                            <MySlider range={[-50, 50]} handler={(value) => console.log(value)} default_value={0} slider_disabled={true}/>
                        </div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};