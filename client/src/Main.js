import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'

import Home from './Components/Home/Home.js'
import Signup from './Components/Signup/Signup.js'
import Signin from './Components/Signin/Signin.js'
import Chat from './Components/Chat/Chat.js'

class Main extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        return (
            <Switch>
                <Route exact path="/" render={() => <Home axiosInstance={this.props.axiosInstance} />} />
                <Route exact path="/signup" render={() => <Signup axiosInstance={this.props.axiosInstance} />} />
                <Route exact path="/signin" render={() => <Signin axiosInstance={this.props.axiosInstance} />} />
                <Route exact path="/chat" render={() => <Chat axiosInstance={this.props.axiosInstance} />} />
            </Switch>
        );

    }

}

export default withRouter(Main);