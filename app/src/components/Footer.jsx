import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <span className="footer-logo">MMA TRACK</span>
                    <span className="footer-tagline">Your fight companion</span>
                </div>
                
                <div className="footer-divider"></div>
                
                <div className="footer-info">
                    <p className="footer-copyright">
                        © {currentYear} MMA Track. All rights reserved.
                    </p>
                    <p className="footer-credit">
                        Data provided by <a href="https://www.tapology.com" target="_blank" rel="noopener noreferrer">Tapology</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
