const TOUR_STEPS = [
    {
        selector: 'parent-tab',
        content: (<div className="tour-text-div">Welcome to this 6-dof Arm simulator GUI!!!</div>),
        position: 'center'
    },
    {
        selector: '.right-Panel',
        content: (<div className="tour-text-div">Behold... <br/>a 3D representation of the arm, ready to show you the result depending on how you drive the arm</div>),
        position: [15, 100]
    },
    {
        selector: '.bottom-Panel',
        content: (<div className="tour-text-div"> Check whether you want to see all the frames from the robot or one by one</div>),
        position: [520, 370]
    },
    {
        selector: '.mode-container',
        content: (<div className="tour-text-div">Select in what way you want to control the arm.</div>),
        position: [360, 10]
    },
    {
        selector: '.data-container',
        content: (<div className="tour-text-div">Watch for the resulting arm end-effector position and orientation</div>),
        position: 'right'
    },
    {
        selector: '.slider-group-container',
        content: (<div className="tour-text-div">Change the individual angles of each joint as needed and see the result</div>),
        position: [380, 320]
    },
    // {
    //     selector: '#sideMenuBar',
    //     content: (<div className="tour-text-div">Navigate throught the aplication and learn (For the moment only the current window is finished sorry)</div>),
    //     position: [800, 60]
    // }
];

const TOUR_STYLE = {
    maskWrapperColor: 'rgba(255, 255, 255, 0.5)',
    popoverBackgroundColor: '#D5D5A3',
    badgeColor: '#DBCF96',
    onStepDotColor: '#C2C6A7',
    dotColor: 'white'
}

function nextButton({ Button, stepsLength, currentStep, setIsOpen }) {
    return currentStep === stepsLength - 1 ? (
      <button className="end-tour-btn" onClick={() => {
        setIsOpen(false);
        window.localStorage.setItem('display-tour', true); }}>Finish</button>
    ) : (
      <Button />
    );
};

export {TOUR_STEPS, TOUR_STYLE, nextButton};