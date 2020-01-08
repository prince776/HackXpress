import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount() {

        this.props.axiosInstance.withCredentials = true;
        this.props.axiosInstance.post('/api/account/verify').then(res => {
            if (res.data.success) {
                this.setState({
                    redirect: '/chat'
                })
            }
        })


    }

    render() {

        return (
            <div >
                <div className='text-center text-secondary mt-5'>
                    <h1>WelcomeTo XpressChat</h1>
                </div>
                <hr />
                <h3 className='text-center text-secondary mt-3'>Join us today...</h3>
                <div className='p-4 text-center mt-3'>
                    <Link to='/signup'> <button className='btn btn-dark'><h3>Sign Up</h3></button><br /><br /></Link>
                    <Link to='/signin'><button className='btn btn-dark'><h3>Sign In</h3></button></Link>
                </div>
            </div>
        )

    }

}

export default Home;