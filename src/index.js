import React from 'react';
import ReactDOM from 'react-dom/client';
import MainWindow from './pages/mainWindow/mainWindow';
import { TourProvider } from '@reactour/tour';
import { TOUR_STEPS, TOUR_STYLE, nextButton } from './pages/components/tour';
import MenuBar from './pages/components/MenuBar/menuBar';
import Building from './pages/components/building';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HashRouter>
      <TourProvider steps={TOUR_STEPS} styles={{maskWrapper: (base) => ({...base, color: TOUR_STYLE.maskWrapperColor}), popover: (base) => ({...base, boxShadow: '0 0 3em rgba(0, 0, 0, 0.5)', backgroundColor: TOUR_STYLE.popoverBackgroundColor}), badge: (base) => ({ ...base, backgroundColor: TOUR_STYLE.badgeColor, fontWeight: 'bold', fontSize: '15px'}), dot: (base, state) => ({ ...base, backgroundColor: state.current ? TOUR_STYLE.onStepDotColor : TOUR_STYLE.dotColor}) }} showCloseButton={false} nextButton={nextButton}>

        <Routes>

          <Route path="/" element={ <MainWindow /> } />
          <Route path='/building' element = { <Building /> }/>  
          
        </Routes>
        <MenuBar />
        <ToastContainer />
      </TourProvider>  
    </HashRouter>
    {/* <TourProvider steps={TOUR_STEPS} styles={{maskWrapper: (base) => ({...base, color: TOUR_STYLE.maskWrapperColor}), popover: (base) => ({...base, boxShadow: '0 0 3em rgba(0, 0, 0, 0.5)', backgroundColor: TOUR_STYLE.popoverBackgroundColor}), badge: (base) => ({ ...base, backgroundColor: TOUR_STYLE.badgeColor, fontWeight: 'bold', fontSize: '15px'}), dot: (base, state) => ({ ...base, backgroundColor: state.current ? TOUR_STYLE.onStepDotColor : TOUR_STYLE.dotColor}) }} showCloseButton={false} nextButton={nextButton} >
      <MainWindow />
    </TourProvider> */}
  </React.StrictMode>
);
