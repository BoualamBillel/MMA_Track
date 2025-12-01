import { useEvents } from './hooks/useEvents'
import Header from './components/Header'
import Footer from './components/Footer'
import EventCard from './components/EventCard'
import SearchBar from './components/SearchBar'
import FilterBar from './components/FilterBar'
import './App.css'

function App() {
  const { events, loading, error, searchTerm, setSearchTerm, selectedOrganizations, toggleOrganization } = useEvents();

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading">Chargement des événements...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="error">Erreur : {error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FilterBar selectedOrganizations={selectedOrganizations} toggleOrganization={toggleOrganization} />

      <main className="app-main">
        <div className="events-list">
          {events.length === 0 ? (
            <p className="no-results">Aucun combat trouvé</p>
          ) : (
            events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App