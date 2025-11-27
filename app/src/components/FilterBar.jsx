import './FilterBar.css';

const organizations = ["UFC", "Bellator", "PFL", "ONE"];

function FilterBar({ selectedOrganizations, toggleOrganization }) {
    return (
        <div className='organization-filter'>
            {organizations.map(org => (
                <button
                    key={org}
                    data-org={org}
                    className={selectedOrganizations.includes(org) ? 'active' : ''}
                    onClick={() => toggleOrganization(org)}
                >
                    {org}
                </button>
            ))}
        </div>
    );
}

export default FilterBar;