import { useEffect, useState } from "react";
import "./EventTimer.css";

function EventTimer({ eventDate }) {
    const [timer, setTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Fonction pour parser le format "Friday, December 5, 10:30 AM ET"
    const parseEventDate = (dateString) => {
        // Extraire les parties de la date
        // Format: "Day, Month DayNumber, Time AM/PM Timezone"
        const regex = /(\w+),\s+(\w+)\s+(\d+),\s+(\d+):(\d+)\s+(AM|PM)\s+(\w+)/i;
        const match = dateString.match(regex);

        if (!match) return null;

        const [, , month, day, hours, minutes, period] = match;

        // Convertir le mois en nombre
        const months = {
            January: 0, February: 1, March: 2, April: 3,
            May: 4, June: 5, July: 6, August: 7,
            September: 8, October: 9, November: 10, December: 11
        };

        const monthIndex = months[month];
        if (monthIndex === undefined) return null;

        // Convertir les heures en format 24h
        let hour24 = parseInt(hours, 10);
        if (period.toUpperCase() === 'PM' && hour24 !== 12) {
            hour24 += 12;
        } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
            hour24 = 0;
        }

        // Utiliser l'année actuelle ou la suivante
        const now = new Date();
        let year = now.getFullYear();

        const eventDateObj = new Date(year, monthIndex, parseInt(day, 10), hour24, parseInt(minutes, 10));

        // Si la date est passée, utiliser l'année prochaine
        if (eventDateObj < now) {
            eventDateObj.setFullYear(year + 1);
        }

        return eventDateObj;
    };

    useEffect(() => {
        const calculateTimeLeft = () => {
            const actualDate = new Date();
            const eventDateObj = parseEventDate(eventDate);

            // Si le parsing a échoué
            if (!eventDateObj) {
                setTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const diff = eventDateObj - actualDate;

            if (diff <= 0) {
                setTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimer({ days, hours, minutes, seconds });
        };

        calculateTimeLeft();

        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [eventDate]);

    // Déterminer l'état du timer
    const isFinished = timer.days === 0 && timer.hours === 0 && timer.minutes === 0 && timer.seconds === 0;
    const isUrgent = timer.days === 0 && !isFinished;

    // Formater les nombres avec un zéro devant si nécessaire
    const formatNumber = (num) => num.toString().padStart(2, '0');

    return (
        <div className={`event-timer ${isUrgent ? 'urgent' : ''} ${isFinished ? 'finished' : ''}`}>
            <div className="timer-unit">
                <div className="timer-value">
                    <span className="timer-number">{formatNumber(timer.days)}</span>
                </div>
                <span className="timer-label">Days</span>
            </div>

            <span className="timer-separator">:</span>

            <div className="timer-unit">
                <div className="timer-value">
                    <span className="timer-number">{formatNumber(timer.hours)}</span>
                </div>
                <span className="timer-label">Hours</span>
            </div>

            <span className="timer-separator">:</span>

            <div className="timer-unit">
                <div className="timer-value">
                    <span className="timer-number">{formatNumber(timer.minutes)}</span>
                </div>
                <span className="timer-label">Mins</span>
            </div>

            <span className="timer-separator">:</span>

            <div className="timer-unit">
                <div className="timer-value">
                    <span className="timer-number">{formatNumber(timer.seconds)}</span>
                </div>
                <span className="timer-label">Secs</span>
            </div>
        </div>
    );
}

export default EventTimer;