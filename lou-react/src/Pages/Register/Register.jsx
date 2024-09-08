// src/pages/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginPageImage from '../../img/login-page.jpeg';
import InputText from "../../Components/Inputs/Input-text/Input-text";
import Button from "../../Components/Buttons/Button/Button";
import '../../i18n';
import { useTranslation } from 'react-i18next';
import Dropdown from "../../Components/Dropdown/Dropdown";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:50005/api/auth/register", { username, email, password, lang });
      navigate("/login");
    } catch (error) {
      console.error("Erreur d'inscription", error);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="lou-grid lou-grid-cols-[1fr_1fr] lou-gap-md">
        <section className="lou-w-full
         lou-max-w-[30rem] lou-d-grid lou-p-xl lou-m-auto">
          <div className="lou-grid lou-gap-lg">
            <div>
              <h1 className="lou-text-4xl lou-font-bold">{t('register.title')}</h1>
              <p className="lou-text-lg lou-text-dark-700">{t('register.description')}</p>
            </div>
            <form onSubmit={handleRegister} className="lou-grid lou-gap-md">
              <div className="lou-grid lou-gap-2xs">
                <label className="lou-font-medium">{t('register.username.label')}</label>
                <InputText 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder={t('register.username.input')}
                />
              </div>
              <div className="lou-grid lou-gap-2xs">
                <label className="lou-font-medium">{t('register.email.label')}</label>
                <InputText 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('register.email.input')}
                />
              </div>
              <div className="lou-grid lou-gap-2xs">
                <label className="lou-font-medium">{t('register.password.label')}</label>
                <InputText 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('register.password.input')}
                />
              </div>
              <div className="lou-grid lou-gap-2xs">
                <label className="lou-font-medium">{t('register.language.label')}</label>
                <select 
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="lou-p-xs lou-bg-dark-50 lou-rounded-sm hover:lou-bg-dark-100 lou-transition-all lou-duration-300">
                  <option value="en">{t('register.language.select.en')}</option>
                  <option value="fr">{t('register.language.select.fr')}</option>
                </select>
              </div>
              <Button
                text={t('register.button')}
                type="submit"
                className="lou-w-full"
              />
            </form>
            <div>
              <p className="lou-text-dark-700 lou-text-center">{t('register.haveAccount')}
                  <a onClick={() => navigate('/login')} className="lou-text-dark lou-font-medium lou-cursor-pointer hover:lou-underline lou-transition lou-ease-in-out lou-duration-300">{t('register.login')}</a>
              </p>
            </div>
          </div>
        </section>
        <section className="lou-rounded-lg lou-overflow-hidden">
          <img src={loginPageImage} alt="Login image" className="image-register lou-object-cover lou-w-full lou-h-full" />
        </section>
    </div>
  );
};

export default Register;
