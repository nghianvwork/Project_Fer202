import React, { useState } from "react";
import { User, Lock, Mail, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let user = { username, password, email };

    let response = await fetch("http://localhost:9999/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(user)
    });

    setIsLoading(false);

    if (response.ok) {
      let result = await response.json();
      localStorage.setItem('user-info', JSON.stringify(result));
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } else {
      alert("Đăng ký thất bại!");
    }
  };

  // Copy styles từ Login
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 75% 75%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 50% 50%, rgba(69, 183, 209, 0.1) 0%, transparent 50%)`,
      animation: 'float 6s ease-in-out infinite alternate'
    },
    loginCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
      width: '100%',
      maxWidth: '420px',
      padding: '40px',
      position: 'relative',
      zIndex: 10
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    logo: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #e74c3c, #8e44ad)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      boxShadow: '0 10px 30px rgba(231, 76, 60, 0.3)'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#ffffff',
      margin: '0 0 8px',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      fontSize: '16px',
      color: 'rgba(255, 255, 255, 0.7)',
      margin: 0
    },
    formGroup: {
      marginBottom: '24px',
      position: 'relative'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '8px'
    },
    inputWrapper: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '16px 16px 16px 50px',
      background: 'rgba(255, 255, 255, 0.08)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      fontSize: '16px',
      color: '#ffffff',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#e74c3c',
      background: 'rgba(255, 255, 255, 0.12)',
      boxShadow: '0 0 0 3px rgba(231, 76, 60, 0.1)'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 255, 255, 0.5)',
      pointerEvents: 'none',
      zIndex: 2
    },
    loginButton: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #e74c3c, #8e44ad)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    loginButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 25px rgba(231, 76, 60, 0.3)'
    },
    loginButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none'
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '8px',
      animation: 'spin 1s linear infinite'
    },
    footer: {
      textAlign: 'center',
      paddingTop: '24px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    },
    footerText: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '14px'
    },
    registerLink: {
      color: '#e74c3c',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '4px',
      transition: 'color 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <Film color="#fff" size={36} />
          </div>
          <h1 style={styles.title}>CinemaHub</h1>
          <p style={styles.subtitle}>Tạo tài khoản để đặt vé xem phim</p>
        </div>
        <form onSubmit={handleRegister}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tên đăng nhập</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <User size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                style={styles.input}
                onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={e => Object.assign(e.target.style, styles.input)}
                required
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Mật khẩu</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                style={styles.input}
                onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={e => Object.assign(e.target.style, styles.input)}
                required
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Nhập email"
                style={styles.input}
                onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={e => Object.assign(e.target.style, styles.input)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.loginButton,
              ...(isLoading ? styles.loginButtonDisabled : {})
            }}
            onMouseEnter={e => !isLoading && Object.assign(e.target.style, styles.loginButtonHover)}
            onMouseLeave={e => !isLoading && Object.assign(e.target.style, styles.loginButton)}
          >
            {isLoading ? (
              <>
                <span style={styles.loadingSpinner}></span>
                Đang đăng ký...
              </>
            ) : (
              'Đăng ký'
            )}
          </button>
        </form>
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Đã có tài khoản?
            <a href="/login" style={styles.registerLink}>Đăng nhập</a>
          </p>
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            100% { transform: translateY(-10px); }
          }
          input::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }
          input:focus::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
        `}
      </style>
    </div>
  );
}

export default Register;
