import React, { Component } from 'react'

import Contacts from './Contacts.js'

import './Chat.css'

class Chat extends Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedUser: '',
            isContact: false,
            message: '',
        }
    }

    setSelectedUser = (user) => {
        this.setState({
            selectedUser: user
        }, () => {

            this.props.axiosInstance.post('/api/utils/isContact', {
                user: this.state.selectedUser
            }).then(res => {

                if (res.data.success) {
                    this.setState({
                        isContact: res.data.isContact
                    })
                } else {
                }
            })

        })
    }

    componentDidMount() {

    }

    addToContacts = () => {

        this.props.axiosInstance.post('/api/account/addContact', {
            user: this.state.selectedUser
        }).then(res => {
            if (res.data.success) {
                this.setState({
                    isContact: true
                })
            }
            this.setState({
                message: res.data.message
            })
        })

    }

    render() {

        if (!this.state.selectedUser) {

            return (
                <div className='container-fluid'>
                    <div className='row'>

                        <Contacts axiosInstance={this.props.axiosInstance} setSelectedUser={this.setSelectedUser} />

                        <div className='col-md-9 bg-light text-center border border-dark mt-4 ml-4 p-5'>

                            <h3>Welcome to Xpress Chat.</h3>
                            <h4>Find users, add them to contacts and chat with AI enchanced experience</h4>

                            <h6>{this.state.message}</h6>
                        </div>
                    </div>
                </div>
            )
        }

        if (this.state.selectedUser) {

            if (!this.state.isContact) {
                return (
                    <div className='container-fluid'>
                        <div className='row'>

                            <Contacts axiosInstance={this.props.axiosInstance} setSelectedUser={this.setSelectedUser} />

                            <div className='col-md-9 bg-light text-center border border-dark mt-4 ml-4 p-5'>

                                <h3>This user doesn't belong to your contacts.</h3>
                                <hr />
                                <button onClick={this.addToContacts} className='btn btn-primary'>
                                    <h4>ADD TO CONTACTS</h4>
                                </button>

                                <h6>{this.state.message}</h6>
                            </div>
                        </div>
                    </div>
                )
            }
            return (
                <div className='container-fluid'>
                    <div className='row'>

                        <Contacts axiosInstance={this.props.axiosInstance} setSelectedUser={this.setSelectedUser} />

                        <div className='col-md-9 bg-light border border-dark mt-4 ml-4'>

                            <div className='row pt-3'>
                                <div className="form-group col-md-10 ">
                                    <input type="text" name='username' onChange={this.onInputBoxChange} className="form-control" placeholder="Send Message" />
                                </div>

                                <div className='col-md-2 text-center'>
                                    <button className='btn btn-dark '>Send</button>
                                </div>
                            </div>
                            <hr />

                            <div className='row ' id='chatbox'>



                            </div>


                        </div>


                    </div>
                </div>
            )

        }



    }

}

export default Chat