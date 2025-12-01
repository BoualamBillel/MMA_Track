import FightCard from "./FightCard";
import EventTimer from "./EventTimer";
import { getOrganizationFromTitle } from "../data/mockEvents";
import './EventCard.css';

function EventCard({ event }) {
    // Destructuration des donnees
    const { title, date, link, fights } = event;
    const organization = getOrganizationFromTitle(title);

    return (
        <div className="event-card">
            <div className="event-header">
                <span className={`organization-badge org-${organization.toLowerCase()}`}>
                    {organization}
                </span>
                <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="event-link"
                >
                    View on Tapology ↗
                </a>
            </div>

            <div className="event-info">
                <h2 className="event-title">{title}</h2>
                <p className="event-date">{date}</p>
                <EventTimer eventDate={date} />
            </div>

            <div className="fights-list">
                {fights.map((fight, index) => (
                    <FightCard key={index} fight={{
                        ...fight,
                        isMainEvent: index === 0
                    }} />
                ))}
            </div>
        </div>
    );
}

export default EventCard;