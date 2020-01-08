import React, { Component } from 'react'

import Header from './Components/Header/Header.js'
import Main from './Main.js'
import Footer from './Components/Footer/Footer.js'

import './App.css'

import axios from 'axios'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      axiosInstance: axios.create({
        baseURL:
          process.env.NODE_ENV === 'production' ?
            'https://www.websitename%_____% .com' :
            'http://localhost:8080',
        withCredentials: true
      }),
    }
  }

  componentDidMount() {

  }

  render() {

    return (
      <div className='container-fluid' id='appDiv' >
        <Header />
        <Main axiosInstance={this.state.axiosInstance} />
        <Footer />
      </div >
    )

  }

}

export default App