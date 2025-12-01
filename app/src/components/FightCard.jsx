import './FightCard.css';

function FightCard({ fight }) {
    // Destructuration des donnees
    const { isMainEvent, weight, fighterA, fighterB } = fight

    return (
        <div className={`fight-card ${isMainEvent ? 'main-event' : ''}`}>
            {isMainEvent && <span className="main-event-badge">Main Event</span>}
            
            <div className="fighters-container">
                <div className="fighter-info">
                    <div className="fighter-picture">
                        <img src={fighterA.picture} alt={`${fighterA.name} picture`} />
                    </div>
                    <img src={fighterA.country} alt={`${fighterA.name} country flag`} className="fighter-flag" />
                    <a href={fighterA.link} target='blank'><p className="fighter-name">{fighterA.name}</p></a>
                    <p className="fighter-record">{fighterA.record}</p>
                </div>

                <div className="fight-center">
                    <span className="vs">VS</span>
                    <p className="fight-weight">{weight} lbs</p>
                </div>

                <div className="fighter-info">
                    <div className="fighter-picture">
                        <img src={fighterB.picture} alt={`${fighterB.name} picture`} />
                    </div>
                    <img src={fighterB.country} alt={`${fighterB.name} country flag`} className="fighter-flag" />
                    <a href={fighterB.link} target='blank'><p className="fighter-name">{fighterB.name}</p></a>
                    <p className="fighter-record">{fighterB.record}</p>
                </div>
            </div>
        </div>
    );
}

export default FightCard;