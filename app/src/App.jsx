// -----------------------------------------------------------
//  [*] Login — the password-gate page
//
//  The whole app is this single page: a white card over an
//  animated particles background where the user types the
//  shared password. "Logging in" only writes a PLAIN-TEXT
//  cookie named app-password (uppercased, 3 h expiry) and
//  hard-navigates to "/" — the reverse proxy in front of the
//  protected system checks that cookie and routes or bounces
//  the request; this app never verifies the password itself
//  (see README.md for the model).
//
//  The card's title comes from GET /app/title — answered by
//  Caddy in the production image (Caddyfile) and by a small
//  vite middleware in dev (vite.config.js), both echoing
//  VITE_SYSTEM_NAME, which may carry literal <br/> separators
//  for a multi-line name.
//
//  Layout lives in Tailwind classes; MUI (Material only, no
//  Joy) carries the widgets — the text field, the button and
//  the title's Typography. The button hovers to the VU accent
//  #E64164, the same hover the faucet app uses.
//
//  After a login the page returns the user to the page they
//  originally wanted: the ?redirect= argument when the proxy
//  put one on the URL, otherwise the URL the form is standing
//  on (the proxy serves this SPA on EVERY unauthenticated
//  path, so that URL is the wanted page itself). Only
//  same-origin paths are accepted — see redirectTarget.
//
//  Split into (root component last):
//
//    redirectTarget                — where to land after login
//    setAppPasswordCookieAndReload — the "login" itself
//    SystemTitle                   — the fetched name, <br/> aware
//    LoginForm                     — the white card
//    Login                         — background + card + footer
//                                    (default export)
// -----------------------------------------------------------

import React, { useState, useEffect } from "react";

// The animated background canvas
import Particles from "./components/Particles/Particles";

import { Button, TextField, Typography } from "@mui/material";








// -----------------------------------------------------------
// redirectTarget
// -----------------------------------------------------------
//
// Where to send the user after a successful login: the
// ?redirect= argument when the reverse proxy put one on the
// URL, otherwise the URL the login form is standing on (the
// proxy serves this SPA on every unauthenticated path, so
// that IS the page the user wanted). Only a same-origin path
// is accepted — one leading slash, so "//evil.example" and
// full URLs fall through to "/" instead of letting a crafted
// login link bounce the user to a foreign site.
//
// Used by:
//   - setAppPasswordCookieAndReload (below)
// -----------------------------------------------------------

function redirectTarget() {
  const requested = new URLSearchParams(window.location.search).get('redirect')
    || window.location.pathname + window.location.search;

  if (requested.startsWith('/') && !requested.startsWith('//')) {
    return requested;
  }
  return '/';
}








// -----------------------------------------------------------
// setAppPasswordCookieAndReload
// -----------------------------------------------------------
//
// The entire "login": write the password into the app-password
// cookie — uppercased (passwords are case-insensitive; the
// proxy compares uppercase), plain text by design, valid for
// 3 hours — then hard-navigate to the page the user wanted
// (redirectTarget above), where the reverse proxy either lets
// the request through or serves this page again. The 100 ms
// delay gives the cookie write time to settle before the
// navigation.
//
// Used by:
//   - LoginForm (below) — the button and the Enter key
// -----------------------------------------------------------

function setAppPasswordCookieAndReload(password) {
  document.cookie = `app-password=${encodeURIComponent(password.toUpperCase())};path=/;expires=${new Date(Date.now() + 3 * 60 * 60 * 1000).toUTCString()};`;

  setTimeout(() => {
    const target = redirectTarget();
    window.history.pushState({}, "", target);
    window.location.assign(target);
  }, 100);
}








// -----------------------------------------------------------
// SystemTitle
// -----------------------------------------------------------
//
// The system name under the logo. VITE_SYSTEM_NAME may carry
// literal <br/> separators ("Failų dalijimosi<br/>sistema") —
// they are split into real line breaks here rather than being
// injected as HTML.
//
// Used by:
//   - LoginForm (below)
// -----------------------------------------------------------

function SystemTitle({ title }) {
  return (
    <div className="mt-2.5 text-center">
      <Typography component="h1" sx={{ fontSize: '1.1em', mb: '0.25em' }}>
        {title?.split('<br/>').map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < title.split('<br/>').length - 1 && <br/>}
          </React.Fragment>
        ))}
      </Typography>
    </div>
  );
}








// -----------------------------------------------------------
// LoginForm
// -----------------------------------------------------------
//
// The white card: logo, the fetched system name, the password
// field and the PRISIJUNGTI button. Enter anywhere on the
// page submits too — the keydown listener sits on document,
// not on the field.
//
// Used by:
//   - Login (below)
// -----------------------------------------------------------

function LoginForm() {

  const [password, setPassword] = useState("");


  // The name shown on the card — empty until the fetch lands
  const [systemName, setSystemName] = useState("");
  useEffect(() => {
    fetch("/app/title")
      .then(response => response.text())
      .then(data => setSystemName(data))
      .catch(error => console.error("Error fetching system name:", error));
  }, []);


  // Enter anywhere submits — re-bound on every keystroke so
  // the handler always sees the latest password
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        setAppPasswordCookieAndReload(password);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [password]);


  return (
    <div className="mx-auto mt-[10%] flex max-w-[350px] flex-col rounded-[15px] bg-white p-5">
      <img alt="VUKnF Logo" src="/img/vuknflogo.png" className="h-48 w-[330px]" />

      <SystemTitle title={systemName} />

      {/* The field is dressed to keep password managers away:
          type text, name hidden-password, autocomplete off and
          a readonly-until-focus trick. NOTE: React does not
          recognise lowercase `readonly`, so it lands on the
          TextField root instead of the <input> (with a console
          warning) — that leg of the trick is inert. Documented,
          not fixed. */}
      <div className="mt-2.5 mb-[60px]">
        <TextField
          fullWidth
          variant="standard"
          label="Slaptažodis"
          type="text"
          name="hidden-password"
          autoComplete="off"
          onFocus={(e) => e.target.removeAttribute('readonly')}
          readonly
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </div>

      {/* Hover needs a pseudo-class, so the colours live in sx:
          brand burgundy at rest, the VU accent on hover */}
      <Button
        onClick={() => setAppPasswordCookieAndReload(password)}
        sx={{
          backgroundColor: 'rgb(123, 0, 63)',
          color: 'white',
          '&:hover': { backgroundColor: '#E64164' },
        }}
      >
        PRISIJUNGTI
      </Button>
    </div>
  );
}








// -----------------------------------------------------------
// Login (default export)
// -----------------------------------------------------------
//
// The page: gradient background, card, footer. The z-0 on the
// background makes it a stacking context, and the fullScreen
// particles canvas inserts itself at zIndex -1 INSIDE that
// context — so it paints over the gradient but under the card
// and the footer.
//
// Used by:
//   - main.jsx — the only thing the app renders
// -----------------------------------------------------------

export default function Login() {
  return (
    <div className="absolute inset-0 z-0 bg-linear-to-br from-[#7b4397] to-[#dc2430]">
      <LoginForm />
      <Particles />

      {/* Footer — pinned to the bottom of the gradient */}
      <div className="absolute bottom-0 h-[100px] w-full">
        <div className="mt-[50px] text-center text-[0.7em] leading-[10px] text-white">
          Copyright © | All Rights Reserved | VUKnF
        </div>
      </div>
    </div>
  );
}
