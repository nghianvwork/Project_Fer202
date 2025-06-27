import React, { useState } from "react";
import { Eye, EyeOff, Film, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response = await fetch("http://localhost:9999/users");
      if (response.ok) {
        let users = await response.json();
        let user = users.find(u => u.username === username && u.password === password);
        if (user) {
          if (rememberMe) {
            localStorage.setItem('user-info', JSON.stringify(user));
          } else {
            sessionStorage.setItem('user-info', JSON.stringify(user));
          }
          alert("Đăng nhập thành công!");
          navigate("/home");
        } else {
          alert("Tên đăng nhập hoặc mật khẩu không đúng!");
        }
      } else {
        alert("Có lỗi xảy ra khi kết nối đến server!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra trong quá trình đăng nhập!");
    } finally {
      setIsLoading(false);
    }
  };

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
    eyeButton: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: 'rgba(255, 255, 255, 0.5)',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      transition: 'color 0.2s ease'
    },
    optionsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '14px',
      cursor: 'pointer'
    },
    checkInput: {
      marginRight: '8px',
      accentColor: '#e74c3c'
    },
    forgotLink: {
      color: '#e74c3c',
      fontSize: '14px',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.2s ease'
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
    divider: {
      position: 'relative',
      margin: '32px 0',
      textAlign: 'center'
    },
    dividerLine: {
      height: '1px',
      background: 'rgba(255, 255, 255, 0.1)',
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0
    },
    dividerText: {
      background: 'rgba(15, 15, 35, 1)',
      padding: '0 16px',
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '14px',
      position: 'relative',
      zIndex: 1
    },
    socialButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '32px'
    },
    socialButton: {
      padding: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
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
            <Film color="#ffffff" size={36} />
          </div>
          <h1 style={styles.title}>CinemaHub</h1>
          <p style={styles.subtitle}>Đăng nhập để đặt vé xem phim</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tên đăng nhập</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <User size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                style={styles.input}
                onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={e => Object.assign(e.target.style, styles.input)}
                required
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={e => e.target.style.color = '#ffffff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.5)'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div style={styles.optionsRow}>
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                style={styles.checkInput}
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Ghi nhớ đăng nhập
            </label>
            <a href="#" style={styles.forgotLink}>Quên mật khẩu?</a>
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
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Chưa có tài khoản?
            <a href="signup" style={styles.registerLink}>Đăng ký ngay</a>
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

export default Login;
