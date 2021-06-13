import React, { useState } from 'react';
import { signin, register } from '../data/rest';

import styles from '../style';

export default function Auth({ setIsAuth }) {
  const [authType, setAuthType] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toogle = ({ target }) => {
    setAuthType(target.name);
  };

  const signinIn = e => {
    const handleFailure = error => {
      alert(error.message);
      setPassword('');
      setEmail('');
    };

    const handleSuccess = () => {
      setIsAuth(true);
    };

    e.preventDefault();
    signin(email, password, handleSuccess, handleFailure);
  };

  const registrate = e => {
    e.preventDefault();
    register(
      email,
      password,
      () => {
        setIsAuth(true);
      },
      error => alert(error.message),
    );
  };

  return (
    <div className={styles.auth}>
      <h1>Where is my money?</h1>
      <p>Simple app for keeping track of your income and expenses</p>
      <form className={styles.auth_form} onSubmit={authType === 'signin' ? signinIn : registrate}>
        <div>
          <div className={styles.auth_form_labels}>
            <label>
              <input type="radio" name="signin" checked={authType === 'signin'} onChange={toogle} />
              Sign In
            </label>

            <label>
              <input
                type="radio"
                name="registrate"
                checked={authType === 'registrate'}
                onChange={toogle}
              />
              Sign Up
            </label>
          </div>
        </div>

        <input
          className={styles.auth_form_input}
          type="email"
          name="email"
          value={email}
          onChange={({ target }) => {
            setEmail(target.value);
          }}
          required
        />

        <br />

        <input
          className={styles.auth_form_input}
          type="password"
          name="password"
          value={password}
          onChange={({ target }) => {
            setPassword(target.value);
          }}
          required
        />

        <br />

        <input
          className={styles.auth_form_submit}
          type="submit"
          value={authType === 'signin' ? 'Sign In' : 'Register Me'}
        />

        <br />
      </form>
      <button
        className={styles.demo_bth}
        onClick={() => {
          signin('demo@kottans.ua', '135790');
        }}
      >
        Try demo!
      </button>
    </div>
  );
}
