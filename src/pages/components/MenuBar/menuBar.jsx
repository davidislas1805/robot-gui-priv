import { Link } from 'react-router-dom';
import SerialPortsTable from './serialTableTemplate'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './menuBar.css';

export default function MenuBar(){
    const [serialDevices, setSerialData] = useState(false);
    let loading_toast_id;

    const enableDisableMenu = (enable) => {
        document.getElementById("device-explorer-tab").style.width =  (enable ? "0" : "250px");
        document.getElementById("sideMenuBar").style.pointerEvents = (enable ? "auto" : "none");
    }

    const requestSerialPorts = () => {
        window.ipcRenderer.invoke('get-serial').then((response) => {
            setSerialData(response);
        });
    };
    
    const closeSerialExp = () => {
        window.ipcRenderer.removeAllListeners('main:test-device');
        window.ipcRenderer.removeAllListeners('main:successful-device-test');
        enableDisableMenu(true);
    };
    
    const openSerialExp = () => {
        window.ipcRenderer.invoke('get-serial').then((response) => {
            enableDisableMenu(false);
            console.log(response)
            setSerialData(response);
        });
    };

    useEffect(() => {
        window.ipcRenderer.on('main:test-device', (e) => {
            loading_toast_id = toast.loading("Connecting with serial device. Please wait...", {
                position: "top-left",
                theme: "dark",
            });
            document.querySelector('.reload-btn').style.pointerEvents = 'none';
            document.querySelector('.close-btn').style.pointerEvents = 'none';
        });
        
        window.ipcRenderer.on('main:successful-device-test', (e, serial_data) => {
            toast.update(loading_toast_id, {
                render: 'Succesful connection, ESP32 says: ' + serial_data,
                type: "success",
                isLoading: false,
                autoClose: 3000
            });
            closeSerialExp();
        });
        return () => {
            window.ipcRenderer.removeAllListeners('main:successful-device-test');
            window.ipcRenderer.removeAllListeners('main:test-device');
        }   
    })
    return(
        <div>
            <div id="sideMenuBar" className="sidenav">
                <div id='home'>
                    <Link to='/'>
                        <svg height="25px" width="100%">
                            <circle cx="12" cy="12" r="5" style={{fill: 'white', stroke: 'white'}}/>
                        </svg>
                    </Link>
                </div>
                <div id='device-connect'>
                    <button className='openButton' onClick={openSerialExp}/>
                </div>
                <div id='about'>
                    <Link to='/building'>
                        <button className='link-btn'>About</button>
                    </Link>
                </div>
                <div id='repository'>
                    <Link to='/building'>
                        <button className='link-btn'>Repository</button>
                    </Link>
                </div>
            </div>
            <div id='device-explorer-tab'>
                <div className='reload-btn-wrapper'><button className='reload-btn' onClick={requestSerialPorts}>Reload</button></div>
                <div className='close-btn-wrapper'><button className='close-btn' onClick={closeSerialExp}>&times;</button></div>
                <div>
                    {serialDevices ? <SerialPortsTable array={serialDevices}/> : ""}
                </div>
            </div>
        </div>
    )
}