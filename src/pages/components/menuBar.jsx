import { Link } from 'react-router-dom';
import './menuBar.css';

export default function MenuBar(){

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
                    <Link to='/building'>
                        <button className='link-btn'>About</button>
                    </Link>
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
        </div>
    )
}