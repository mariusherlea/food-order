"use client";

import { useState } from "react";
import NavLink from "./nav-link";
import classes from "./navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarContainer}>
        <div className={classes.menuIcon} onClick={toggleMenu}>
          {isOpen ? (
            <FontAwesomeIcon icon={faTimes} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </div>
        <div className={`${classes.navMenu} ${isOpen ? classes.active : ""}`}>
          <NavLink href={"/meals"}>Meals</NavLink>
          <NavLink href="/community">Community</NavLink>
        </div>
      </div>
    </nav>
  );
}
