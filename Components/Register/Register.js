import React, { useState } from "react";
import './Register.css';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

function Register({ onChangeView }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "username":
        return value.trim() === "" ? "El usuario es requerido" : "";
      case "email":
        return /\S+@\S+\.\S+/.test(value) ? "" : "Correo inválido";
      case "password":
        return value.length < 6 ? "Mínimo 6 caracteres" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const formPayload = new FormData();
      formPayload.append("usuario", formData.username);
      formPayload.append("correo", formData.email);
      formPayload.append("contrasena", formData.password);

      const response = await fetch("http://localhost/proyectox/register.php", {
        method: "POST",
        body: formPayload,
      });

      const resultado = await response.text();

      if (resultado.toLowerCase().includes("exitoso")) {
        setIsSuccess(true);
        setFormData({ username: "", email: "", password: "" });
      } else {
        setErrors({ submit: resultado });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: "Hubo un problema al registrar el usuario." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    onChangeView('login');
  };

  return (
    <div className="register-wrapper">
      <div className="register-form-container">
        <h2 className="register-header">Registro</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="register-input-group">
            <User className="input-icon" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "error" : ""}
              style={{ paddingLeft: '2.5rem' }}
            />
            {errors.username && <p className="register-error-message">{errors.username}</p>}
          </div>

          <div className="register-input-group">
            <Mail className="input-icon" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              style={{ paddingLeft: '2.5rem' }}
            />
            {errors.email && <p className="register-error-message">{errors.email}</p>}
          </div>

          <div className="register-input-group" style={{ position: 'relative' }}>
            <Lock className="input-icon" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: '#9CA3AF'
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="register-error-message">{errors.password}</p>}
          </div>

          <button type="submit" className="register-submit-btn" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>

          {errors.submit && <p className="register-error-message">{errors.submit}</p>}

          {isSuccess && (
            <div className="register-success-message">
              <div className="checkmark-container">
                <div className="checkmark">✓</div>
              </div>
              ¡Registro exitoso!
            </div>
          )}
        </form>

        <p className="register-footer">
          ¿Ya tienes cuenta?
          <button type="button" onClick={handleGoToLogin}>
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
