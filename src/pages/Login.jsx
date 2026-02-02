import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/postsApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    if (isRegister && !username) {
      setError("Please enter a username");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let res;
      if (isRegister) {
        res = await register({ 
          email, 
          password,
          username,
          displayName: username,
          bio: "",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          theme: "dark"
        });
      } else {
        res = await login({ email, password });
      }
      
      if (res.accessToken) {
        localStorage.setItem("token", res.accessToken);
        alert(isRegister ? "Registered successfully!" : "Logged in successfully!");
        navigate("/feed");
      } else {
        setError(isRegister ? "Registration failed" : "Login failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || (isRegister ? "Registration failed" : "Login failed. Please check your credentials."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}
      
      {isRegister && (
        <input 
          value={username}
          onChange={e => setUsername(e.target.value)} 
          placeholder="Username" 
          disabled={loading}
          style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
        />
      )}
      
      <input 
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)} 
        placeholder="Email" 
        disabled={loading}
        style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
      />
      
      <input 
        type="password" 
        value={password}
        onChange={e => setPassword(e.target.value)} 
        placeholder="Password" 
        disabled={loading}
        style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
      />
      
      <button 
        onClick={handleSubmit} 
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#0f3460',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '10px'
        }}
      >
        {loading ? "Processing..." : (isRegister ? "Register" : "Login")}
      </button>
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <button 
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
          }}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#0f3460', 
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0
          }}
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}
