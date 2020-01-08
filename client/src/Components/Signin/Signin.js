import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

class Signin extends Component {

    constructor(props) {
        super(props)

        this.state = {
            redirect: '',
        }
    }

    componentDidMount() {


        this.props.axiosInstance.post('/api/account/verify').then(res => {
            if (res.data.success) {
                this.setState({
                    redirect: '/chat'
                })
            }
        })

    }

    onSignIn = () => {

        const { email, password } = this.state;

        var regE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = regE.test(String(email).toLowerCase());
        if (!validEmail) this.setState({ message: 'Email is not valid' });

        if (!email) this.setState({ message: 'Please enter email' })
        if (!password) this.setState({ message: 'Please enter password' })



        if (!email || !password || !validEmail)
            return;

        this.props.axiosInstance.withCredentials = true;
        this.props.axiosInstance.post('/api/account/signin',
            {
                password: password,
                email: email
            }).then(res => {
                this.setState({
                    message: res.data.message
                })
                if (res.data.success) {
                    this.setState({
                        redirect: '/chat'
                    })
                }
            })
    }


    onInputBoxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div>

                <div className=' text-center p-5'>

                    <div className='text-secondary ' >
                        <h1>Sign In </h1>
                    </div>

                    <form className='p-4 m-3'>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Email</label>
                            <div className="col-sm-10">
                                <input type="email" name='email' onChange={this.onInputBoxChange} className="form-control" placeholder="Email" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-10">
                                <input type="password" name='password' onChange={this.onInputBoxChange} className="form-control" placeholder="Password" />
                            </div>
                        </div>

                        <button type="button" onClick={this.onSignIn} className="btn btn-dark"><h4>Sign In</h4></button>
                        <div className='row p-2'>
                            <div className='col'>
                                <Link to='/signup' className='text-info font-weight-bold font-italic'>Don't have an account? Sign Up here</Link>
                            </div>
                        </div>
                        <h6 className='text-center text-info'>{this.state.message}</h6>
                    </form>

                </div>

            </div>
        )

    }

}

export default Signin