import { useState, useEffect, useMemo } from "react";
import { mockEvents, getOrganizationFromTitle } from "../data/mockEvents";

export function useEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrganizations, setSelectedOrganizations] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("https://mma-fights-api-production.up.railway.app/");
                const data = await response.json();
                setEvents(data.data);  // data.data contient le tableau d'événements
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    // Événements filtrés (garde la structure événement > combats)
    const filteredEvents = useMemo(() => {
        let result = [...events];

        // Filtrer par recherche (garde les événements avec au moins un combat correspondant)
        if (searchTerm.trim() !== '') {
            const search = searchTerm.toLowerCase();
            result = result.map(event => ({
                ...event,
                fights: event.fights.filter(fight =>
                    fight.fighterA.name.toLowerCase().includes(search) ||
                    fight.fighterB.name.toLowerCase().includes(search)
                )
            })).filter(event => event.fights.length > 0);
        }

        // Filtrer par organisation
        if (selectedOrganizations.length > 0) {
            result = result.filter(event => {
                const org = getOrganizationFromTitle(event.title);
                return selectedOrganizations.includes(org);
            });
        }

        // Trier par date
        result.sort((a, b) => new Date(a.date) - new Date(b.date));

        return result;
    }, [events, searchTerm, selectedOrganizations]);

    const toggleOrganization = (org) => {
        if (selectedOrganizations.includes(org)) {
            setSelectedOrganizations(selectedOrganizations.filter(o => o !== org));
        } else {
            setSelectedOrganizations([...selectedOrganizations, org]);
        }
    };

    return {
        events: filteredEvents,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        selectedOrganizations,
        toggleOrganization
    };
}