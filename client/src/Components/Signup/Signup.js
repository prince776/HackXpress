import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
class Signup extends Component {

    constructor(props) {
        super(props)

        this.state = {
            message: '',
            username: '',
            email: '',
            password: '',
            redirect: ''
        }
    }

    componentDidMount() {

    }

    onInputBoxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSignUp = () => {

        const { username, email, password } = this.state;

        var regE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = regE.test(String(email).toLowerCase());
        if (!validEmail) this.setState({ message: 'Email is not valid' });

        if (!email) this.setState({ message: 'Please enter email' })
        if (!username) this.setState({ message: 'Please enter username' })
        if (!password) this.setState({ message: 'Please enter password' })

        if (!username || !email || !password || !validEmail)
            return;

        this.props.axiosInstance.withCredentials = true
        this.props.axiosInstance.post('/api/account/signup', {
            username: username,
            password: password,
            email: email
        }).then(res => {
            this.setState({
                message: res.data.message
            })
            if (res.data.success) {
                this.setState({
                    redirect: '/signin'//LATER CHANGE TO /profile thingy
                })
            }
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
                        <h1>Sign Up Today </h1>
                    </div>

                    <form className='p-4 m-3'>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Username</label>
                            <div className="col-sm-10">
                                <input type="text" name='username' onChange={this.onInputBoxChange} className="form-control" placeholder="Username" />
                            </div>
                        </div>
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

                        <button type="button" onClick={this.onSignUp} className="btn btn-dark"><h4>Sign Up</h4></button>
                        <div className='row p-2'>
                            <div className='col'>
                                <Link to='/signin' className='text-info font-weight-bold font-italic'>Already have an Account? Sign In here</Link>
                            </div>
                        </div>
                        <h6 className='text-center text-info'>{this.state.message}</h6>
                    </form>

                </div>

            </div>
        )

    }

}

export default Signup