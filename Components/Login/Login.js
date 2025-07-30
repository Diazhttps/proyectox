import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import './Login.css';

function Login({ onChangeView }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateField = (name, value) => {
    if (name === 'email' && !value.includes('@')) {
      return 'Correo inválido';
    }
    if (name === 'password' && value.length < 4) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  };

  const handleRegisterRedirect = () => {
    onChangeView('register'); // Cambia la vista a register sin recargar
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};
  Object.keys(formData).forEach(key => {
    const error = validateField(key, formData[key]);
    if (error) newErrors[key] = error;
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsLoading(true);

  try {
    const formPayload = new FormData();
    formPayload.append("email", formData.email);      // nombre que PHP espera
    formPayload.append("password", formData.password);

    const response = await fetch("http://localhost/proyectox/login.php", {
      method: "POST",
      body: formPayload,
      credentials: "include",
    });

    const result = await response.json(); // parsear JSON

    if (result.success) {
      setIsSuccess(true);
      setErrors({});
      setFormData({ email: '', password: '' });
    } else {
      setErrors({ submit: result.message });
    }
  } catch (error) {
    setErrors({ submit: 'Error al conectar con el servidor.' });
  } finally {
    setIsLoading(false);
  }
};


  if (isSuccess) {
    return (
      <div className="login-container">
        <div className="success-box">
          <div className="checkmark-container">
            <div className="checkmark">✓</div>
          </div>
          <h2>¡Bienvenido!</h2>
          <p>Has iniciado sesión correctamente.</p>
          <button onClick={() => setIsSuccess(false)}>Continuar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="form-box">
        <div className="form-header">
          <LogIn size={48} className="icon" />
          <h1>Iniciar Sesión</h1>
        </div>
        <form onSubmit={handleSubmit} className="form-body">
          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input error' : 'input'}
                placeholder="Correo electrónico"
              />
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input error' : 'input'}
                placeholder="Tu contraseña"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? <span>Cargando...</span> : 'Iniciar Sesión'}
          </button>

          <div className="register-link">
            <p>¿No tienes cuenta? <button type="button" onClick={handleRegisterRedirect}>Regístrate aquí</button></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
