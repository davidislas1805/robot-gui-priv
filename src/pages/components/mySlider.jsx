import { useState } from "react";
import "./mySlider.css"
import ReactSlider from "react-slider";
import { useEffect } from "react";

export default function MySlider({handler, range, default_value, reset, slider_disabled = false}) {
    const [slider_value, setSliderValue] = useState(default_value);
    
    const internalHandler = (value) => {
        handler(value);
        setSliderValue(value);
    }
    
    useEffect(() => {
        setSliderValue(default_value);
    }, [reset]);

    return (
        <div className='sliderContainer'>
            <div className='sliderWrapper'>
                <div className='sliderSubWrapper'>
                    <ReactSlider className="customSlider" trackClassName="customSlider-track" thumbClassName="customSlider-thumb" min={range[0]} max={range[1]} onChange={(value) => {internalHandler(value)}} value={slider_value} defaultValue={default_value} disabled={slider_disabled}/>
                </div>
            </div>
        </div>
    );
};
