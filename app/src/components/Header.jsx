import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-bg">
                <div className="header-overlay"></div>
                <div className="header-particles">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            
            <div className="header-content">
                <div className="header-badge">LIVE EVENTS</div>
                <h1 className="header-title">
                    <span className="title-mma">MMA</span>
                    <span className="title-track">TRACK</span>
                </h1>
                <p className="header-subtitle">Follow all upcoming MMA events worldwide</p>
                
                <div className="header-stats">
                    <div className="stat">
                        <span className="stat-label">Fights</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat">
                        <span className="stat-label">Worldwide</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat">
                        <span className="stat-label">Real-time</span>
                    </div>
                </div>
            </div>

            <div className="header-edge left"></div>
            <div className="header-edge right"></div>
        </header>
    );
}

export default Header;
