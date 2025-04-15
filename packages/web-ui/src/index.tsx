import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import GlobalStyle from './components/GlobalStyle'
import { Auth0Provider } from '@auth0/auth0-react'
import { UploadProgressContextProvider } from './context/uploadProgress'

const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENTID

if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
  throw new Error('One or more AUTH0 env vars undefined')
}

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <UploadProgressContextProvider>
        <GlobalStyle />
        <App />
      </UploadProgressContextProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
