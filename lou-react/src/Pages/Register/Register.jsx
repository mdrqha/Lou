// src/pages/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginPageImage from '../../img/login-page.jpeg';
import InputText from "../../Components/Inputs/Input-text/Input-text";
import Button from "../../Components/Buttons/Button/Button";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:50005/api/auth/register", { username, email, password });
      navigate("/login");
    } catch (error) {
      console.error("Erreur d'inscription", error);
    }
  };

  return (
    <div className="lou-grid lou-grid-cols-[1fr_1fr] lou-gap-md">
        <section className="lou-w-full
         lou-max-w-[30rem] lou-d-grid lou-p-xl lou-m-auto">
          <div className="lou-grid lou-gap-lg">
            <div>
              <h1 className="lou-text-4xl lou-font-bold">Get started</h1>
              <p className="lou-text-lg lou-text-dark-700">Create your account now !</p>
            </div>
            <form onSubmit={handleRegister} className="lou-grid lou-gap-md">
              <div className="lou-grid lou-gap-2xs">
                <label className="lou-font-medium">Full name</label>
                <InputText 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Lou Stick"
                
                />
              </div>
              <div className="lou-grid lou-gap-2xs">
                <label className="lou-font-medium">Email</label>
                <InputText 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="mail@domain.com"
                
                />
              </div>
              <div className="lou-grid lou-gap-2xs">
                <label className="lou-font-medium">Password</label>
                <InputText 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="*****"
                
                />
              </div>
              <Button
                text='Register'
                type="submit"
                className="lou-w-full"
              />
            </form>
            <div>
                  <p className="lou-text-dark-700 lou-text-center">Already have an account ? <span className="lou-underline lou-text-dark lou-font-medium">Login</span></p>
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
