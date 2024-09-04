// src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputText from "../../Components/Inputs/Input-text/Input-text";
import Button from "../../Components/Buttons/Button/Button";
import { useAuth } from "../../Context/AuthContext";
import loginPageImage from '../../img/login-page.jpeg';
import '../../i18n';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);  // Ajout d'un état pour gérer les erreurs
  const navigate = useNavigate();
  const { login } = useAuth();  // Utiliser la fonction login du contexte

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:50005/api/auth/login", { email, password });
      if (response.data.token) {
        login(response.data.token);  // Mettre à jour l'état d'authentification et stocker le jeton
        // console.log(response)
        navigate("/visual-testing");  // Rediriger après connexion réussie
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      setError("Erreur de connexion. Veuillez réessayer.");  // Afficher un message d'erreur
    }
  };

  const goToRegister = () => {
    navigate('/register');
  }

  const { t } = useTranslation();

  return (
    <div className="lou-grid lou-grid-cols-[1fr_1fr] lou-gap-md">
      <section className="lou-rounded-lg lou-overflow-hidden">
          <img src={loginPageImage} alt="Login image" className="image-register lou-object-cover lou-w-full lou-h-full" />
        </section>
        <section className="lou-w-full lou-max-w-[30rem] lou-d-grid lou-p-xl lou-m-auto">
          <div className="lou-grid lou-gap-lg">
            <div>
              <h1 className="lou-text-4xl lou-font-bold">{t('login.title')}</h1>
              <p className="lou-text-lg lou-text-dark-700">{t('login.description')}</p>
            </div>
            <form onSubmit={handleLogin} className="lou-grid lou-gap-md">
              <div className="lou-grid lou-gap-2xs">
                <label className="lou-font-medium">{t('login.email.label')}</label>
                {/* {t('visual-design.results-tilte')} */}
                <InputText 
                    type="email"
                    placeholder={t('login.email.input')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="lou-grid lou-gap-2xs">
                <label className="lou-font-medium">Password</label>
                <InputText 
                    type="password"
                    placeholder={t('login.password.input')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
              {error && <p className="lou-text-red-500">{error}</p>}  {/* Afficher le message d'erreur */}
              <Button
                text={t('login.button')}
                type="submit"
                className="lou-w-full"
              />
            </form>
            <div>
              <p className="lou-text-dark-700 lou-text-center">{t('login.noAccount')} 
                <a onClick={() => navigate('/register')} className="lou-text-dark lou-font-medium lou-cursor-pointer hover:lou-underline lou-transition lou-ease-in-out lou-duration-300">{t('login.register')} </a>
              </p>
            </div>
          </div>
        </section>
        
    </div>
  );
};

export default Login;
