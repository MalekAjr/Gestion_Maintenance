import React, { useState } from 'react';

function Navbar({ searchQuery, handleSearch }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleDropdownItemClick = () => {
    closeDropdown();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#e3f2fd' }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Navbar</a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleDropdown}
          aria-controls="navbarSupportedContent"
          aria-expanded={isDropdownOpen ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isDropdownOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#" onClick={closeDropdown}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={closeDropdown}>
                Link
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded={isDropdownOpen ? "true" : "false"}
                onClick={toggleDropdown}
              >
                Dropdown
              </a>
              <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                <li>
                  <a className="dropdown-item" href="#" onClick={handleDropdownItemClick}>
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={handleDropdownItemClick}>
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider"/>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={handleDropdownItemClick}>
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
           {/* <li className="nav-item">
              <a className="nav-link disabled">Disabled</a>
            </li>  */}
          </ul>
          <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
          <input
              className="form-control me-2"
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by all fields"
              aria-label="Search"
            />
          { /* <button className="btn btn-outline-success" type="submit">Search</button>  */}
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
