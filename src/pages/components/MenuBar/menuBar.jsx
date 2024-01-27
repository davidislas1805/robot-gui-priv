import { Link } from 'react-router-dom';
import './menuBar.css';
import { toast } from 'react-toastify';

export default function MenuBar(){
    const requestSerialPorts = () => {};
    const closeSerialExp = () => {};
    const openSerialExp = () => {
        window.ipcRenderer.invoke('testing toast').then((response) => {
            toast.info(response, {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        });
    };
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
                    {/* {serialDevices ? <SerialPortsTable array={serialDevices}/> : <div/>} */}
                </div>
            </div>
        </div>
    )
}