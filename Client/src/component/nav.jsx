import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { currentUserAction } from "../Redux/Action/userAction";
import LanguageSelector from "./LanguageSelector";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

function Nav1({ user }) {
  const logout = async () => {
    window.open("http://localhost:4000/api/v1/auth/logout", "_self");
  };
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(currentUserAction());
  }, [dispatch]);
    const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); };

  return (
    <Navbar expand="lg" dir={i18n.dir()}>
    <Container>
      <LanguageSelector onChange={changeLanguage} />
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="m-auto">
          <Link className="nav-link" to="/">
            {t('header.home')}
          </Link>
          <Link className="nav-link" to="/courses">
            {t('header.courses')}
          </Link>
          <Link className="nav-link" to="/books">
            {t('header.books')}
          </Link>
          <Link className="nav-link" to="/language">
            {t('header.programmingLanguages')}
          </Link>
          <Link className="nav-link" to="/question">
            {t('header.questions')}
          </Link>
          {currentUser?.role === "Admin" && (
            <>
              <Link className="nav-link" to="/all-books">
                {t('header.adminBooks')}
              </Link>
              <Link className="nav-link" to="/admincourse">
                {t('header.adminCourses')}
              </Link>
              <Link className="nav-link" to="/add-category">
                {t('header.addCategory')}
              </Link>
            </>
          )}
        </Nav>
        <Nav>
          {user ? (
            <>
              <Nav.Link
                id="button1"
                onClick={logout}
                style={{ cursor: "pointer" }}
              >
                {t('header.logout')}
              </Nav.Link>
            </>
          ) : (
            <>
              <Link id="button1" className="nav-link" to="/login">
                {t('header.login')}
              </Link>
              <Link id="button2" className="nav-link" to="/register">
                {t('header.register')}
              </Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
}

export default Nav1;
