import './SearchBar.css';

function SearchBar({ searchTerm, setSearchTerm }) {
    return (
        <div className='search-bar'>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Recherche un Combattant'/>
        </div>
    );
}

export default SearchBar;