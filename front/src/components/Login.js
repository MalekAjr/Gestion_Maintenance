import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const message = '';
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

      axios.post("http://localhost:8000/api/login",{email:email, password:password}).then((res)=>{
        console.log(res.data.token)
        localStorage.setItem('token', res.data.token)
        navigate("/show")
      }).catch((err)=>{
        alert("wrong")
      })

    /**try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setMessage('Login successful!');
    } catch (error) {
      setMessage(error.message);
    }**/
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div>{message}</div>
    </div>
  );
}

export default Login;
