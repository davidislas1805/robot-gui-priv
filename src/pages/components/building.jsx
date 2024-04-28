import './building.css';

export default function Building(){
    return(
        <div style={{width: '1200px', height: '600px', background: '#111'}}>
            <div style={{width: '100%', height: '100%'}}>
                <div style={{width: '100%', height: '100%', display: "flex", alignItems: "center", justifyContent: "center", textAlign: 'center'}}>
                    <div style={{height: '35%'}}>
                        <h1 style={{color: 'white', marginBottom: '10px'}}>Page under construction</h1>
                        <div style={{width: '100%', height: '100%', display: "flex", alignItems: "center", justifyContent: "center", textAlign: 'center'}}>
                            <div className="alux-loader"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}