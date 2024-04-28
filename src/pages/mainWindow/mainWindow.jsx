import "./mainWindow.css"
import {base_link_length,link1_length, link2_length, link3_length, link4_length, link5_length, WORLD_FRAME, LAYOUT, CONFIG} from "../components/lib/utilities3D/constThreeDParams.js"
import ROBOT_ARM_3D from "../components/lib/utilities3D/mesh_robot/robotArm3D.js";
import Plot from 'react-plotly.js';
import { useState } from 'react';
import TabDK from "../components/Tabs/tabDK.jsx";
import TabIK from "../components/Tabs/tabIK.jsx";
import StyledSwitch from "../components/SliderAndSwitch/styledSwitch.jsx";
import { useTour } from "@reactour/tour";
import { useEffect } from "react";

let joint_base_theta, joint1_theta, joint2_theta, joint3_theta, joint4_theta, joint5_theta;
const SLEDGE_3D = new ROBOT_ARM_3D([base_link_length, link1_length, link2_length, link3_length, link4_length, link5_length]);

const CONST_WORLD_DATA = WORLD_FRAME;
let viewer_data = [];


window.ipcRenderer.on('show-about', () => {
  const package_data = require('../../../package.json');
  
  window.alert(`${package_data.name} \n version: ${package_data.version}`);
});

function MainWindow() {
  const [checkAllJoints, setAllJoints] = useState(false);
  const [checkedJF, setJF] = useState([true, false, false, false, false, false, true]);
  const [plot_data, setPlotData] = useState(viewer_data.concat(CONST_WORLD_DATA));
  const [tab_state, setTabState] = useState("Inverse-Kinematics");
  const [tourViewed, seTourViewed] = useState(false);
  const { isOpen, setIsOpen } = useTour();

  const starTour = () => {
    setIsOpen(true);
  }

  const handleTab = (tab_case) => {setTabState(tab_case)};

  const toggleFrame = (checked_state) => {
    setAllJoints(checked_state);
    setJF([checked_state, checked_state, checked_state, checked_state, checked_state, checked_state, checked_state]);
    SLEDGE_3D.showFrames([checked_state, checked_state, checked_state, checked_state, checked_state, checked_state, checked_state]);
  }

  const toggleArmFrames = (id) => {
    switch (id.target.name) {
      case "base-frame":
        checkedJF[0] = !(checkedJF[0]);
        break;
      case "joint1-frame":
        checkedJF[1] = !(checkedJF[1]);
        break;
      case "joint2-frame":
        checkedJF[2] = !(checkedJF[2]);
        break;
      case "joint3-frame":
        checkedJF[3] = !(checkedJF[3]);
        break;
      case "joint4-frame":
        checkedJF[4] = !(checkedJF[4]);
        break;
      case "joint5-frame":
        checkedJF[5] = !(checkedJF[5]);
        break;
      case "tcp-frame":
        checkedJF[6] = !(checkedJF[6]);
        break;
      default:
        break;
    }
    setJF((checkedJF) => [checkedJF[0], checkedJF[1], checkedJF[2], checkedJF[3], checkedJF[4], checkedJF[5], checkedJF[6]]);
    // SLEDGE.showJointFrames(checkedJF);
    SLEDGE_3D.showFrames(checkedJF);
  }
  
  useEffect(() => {
    const tourStatus = window.localStorage.getItem('display-tour');
    if(tourStatus){
      seTourViewed(true);
      return;
    }
  }, [isOpen]);
  
  return (
    <div style={{width: "100%", height: "100%"}}>
      <div className="left-Panel">
        <div className="mode-tab">
          <ul className="mode-container">
            <li className={tab_state === "Direct-Kinematics" ? "active" : ""} onClick={() => handleTab("Direct-Kinematics")}>Direct-K</li>
            <li className={tab_state === "Inverse-Kinematics" ? "active" : ""} onClick={() => handleTab("Inverse-Kinematics")}>Inverse-K</li>
          </ul>
        </div>
        <div className="tab-content">
          {tab_state === "Direct-Kinematics" ? <TabDK robotHandler={SLEDGE_3D} scene_const={CONST_WORLD_DATA} buffer={[joint_base_theta, joint1_theta, joint2_theta, joint3_theta, joint4_theta, joint5_theta]} updateHook={setPlotData} switchJF={checkedJF}/> : 
            tab_state === "Inverse-Kinematics" ? <TabIK robotHandler={SLEDGE_3D} scene_const={CONST_WORLD_DATA} updateHook={setPlotData} switchJF={checkedJF}/> : ""}
        </div>
        
      </div>
      <div className="right-Panel">
        <Plot
            data = {plot_data}
            layout = {LAYOUT}
            config = {CONFIG}
            style = {{ height: "100%", width: "100%" }}
            useResizeHandler = {true}
            /> 
      </div>
      <div>
        <div className="bottom-Panel">
          <div style={{width: '43%'}}></div>
          <div className="bp-Set-Container">
            <div className="upper-data-element-title bottom-text">Show Frames</div>
            <div>
              <StyledSwitch init_checked={checkAllJoints} switchHandle={toggleFrame} style_mode={2}/>
            </div>
          </div>
          <div className="bp-Set-Container">
            <div className="upper-data-element-title bottom-text">Base</div>
            <input className="styled-checkbox" type="checkbox" name="base-frame" id="base-frame" value="base-frame" checked={checkedJF[0]} onChange={toggleArmFrames}/>
          </div>
          <div className="bp-Set-Container">
            <div className="upper-data-element-title bottom-text">Joint 1</div>
            <input className="styled-checkbox" type="checkbox" name="joint1-frame" id="-frame" value="-frame" checked={checkedJF[1]} onChange={toggleArmFrames}/>
          </div>
          <div className="bp-Set-Container">
            <div className="upper-data-element-title bottom-text">Joint 2</div>
            <input className="styled-checkbox" type="checkbox" name="joint2-frame" id="joint2-frame" value="joint2-frame" checked={checkedJF[2]} onChange={toggleArmFrames}/>
          </div>
          <div className="bp-Set-Container">
            <div className="upper-data-element-title bottom-text">Joint 3</div>
            <input className="styled-checkbox" type="checkbox" name="joint3-frame" id="joint3-frame" value="joint3-frame" checked={checkedJF[3]} onChange={toggleArmFrames}/>
          </div>
          <div className="bp-Set-Container">
            <div className="upper-data-element-title bottom-text">Joint 4</div>
            <input className="styled-checkbox" type="checkbox" name="joint4-frame" id="joint4-frame" value="joint4-frame" checked={checkedJF[4]} onChange={toggleArmFrames}/>
          </div>
          <div className="bp-Set-Container">
            <div className="upper-data-element-title bottom-text">Joint 5</div>
            <input className="styled-checkbox" type="checkbox" name="joint5-frame" id="joint5-frame" value="joint5-frame" checked={checkedJF[5]} onChange={toggleArmFrames}/>
          </div>
          <div className="bp-Set-Container">
            <div className="upper-data-element-title bottom-text">TCP</div>
            <input className="styled-checkbox" type="checkbox" name="tcp-frame" id="tcp-frame" value="tcp-frame" checked={checkedJF[6]} onChange={toggleArmFrames}/>
          </div> 
        </div>
      </div>
      { !tourViewed && !isOpen ? <div className="tour-container"><button className="tour-btn bounce-5" onClick={starTour} title="Click me!!"/></div> : ""}
    </div>
  );
};

export default MainWindow;