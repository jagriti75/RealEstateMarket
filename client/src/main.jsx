import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from '../src/redux/store.js'
import { ParallaxProvider } from "react-scroll-parallax";


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ParallaxProvider>
        <App />
        </ParallaxProvider>
    </PersistGate>
  </Provider>,
)
