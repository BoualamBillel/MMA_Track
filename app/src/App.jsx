import { useEvents } from './hooks/useEvents'
import EventCard from './components/EventCard'
import './App.css'

function App() {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Chargement des événements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">Erreur : {error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>MMA Track</h1>
        <p>Suivez tous les prochains événements MMA</p>
      </header>

      <main className="app-main">
        <div className="events-list">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default App