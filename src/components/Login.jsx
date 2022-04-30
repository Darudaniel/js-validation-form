import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import {Buffer} from 'buffer';

// const LOGIN_URL = '/auth';
const API_URL = process.env.REACT_APP_API_URL
const API_COOKIE = process.env.REACT_APP_API_COOKIE
const API_TOKEN = Buffer.from(
  `${process.env.REACT_APP_API_USER}:${process.env.REACT_APP_API_KEY}`,
  'utf8'
).toString('base64')

const ROLES_LIST = [
  5150, 2001, 1984
]


const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [grantType, setGrantType] = useState('password')
  const [accessToken, setAccessToken] = useState('')
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd])

  const handleSubmit = async (e) => {
      e.preventDefault();

      try {

          const response = (user, pwd) => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Basic ${API_TOKEN}`);
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("Cookie", `${API_COOKIE}`);

            var urlencoded = new URLSearchParams();
            urlencoded.append("username", user);
            urlencoded.append("password", pwd);
            urlencoded.append("grant_type", "password");

            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: urlencoded,
              redirect: 'follow'
            };

            fetch(`${API_URL}/autenticacion/oauth/token`, requestOptions)
              .then(calling => calling.text())
              .then(result => {
                const data = result
                const parsedData = JSON.parse(data)
                setAccessToken(parsedData.access_token)
                if (accessToken.length > 10) {
                  const roles = ROLES_LIST
                  setAuth({ user, pwd, roles, accessToken })
                  setUser('');
                  setPwd('');
                  navigate(from, { replace: true });
                } else {
                  console.log('Aun no se ha recibido el token, probablemente estes ingresando mal el usuario o la contraseña')
                }
                
              })
              .catch(error => console.log('error', error));
          }

          response(user, pwd)

			} catch (err) {
          if (!err?.response) {
              setErrMsg('No Server Response');
          } else if (err.response?.status === 400) {
              setErrMsg('Missing Username or Password');
          } else if (err.response?.status === 401) {
              setErrMsg('Unauthorized');
          } else {
              setErrMsg('Login Failed');
          }
          errRef.current.focus();
      }
  }

  return(
    <section>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
            />

            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
            />
            <button>Sign In</button>
        </form>
        {/* <button type='button' onClick={testing}>test</button>
        <br /> */}
        <p>
            Need an Account?<br />
            <span className="line">
                {/*put router link here*/}
                <a href="#">Sign Up</a>
            </span>
        </p>
    </section>    
  )
}


export default Login