import React, { Component } from 'react'

import './Contacts.css'
import { Redirect } from 'react-router';

class Contacts extends Component {

    constructor(props) {
        super(props)

        this.state = {
            contacts: [],
            message: '',
            toSearch: '',
            usersSearched: [],
            refreshContacts: false,
            highlightUser: '',
            redirect: '',
        }
    }

    componentDidMount() {
        this.refreshContacts();
    }


    refreshContacts = () => {
        this.props.axiosInstance.post('/api/account/contacts').then(res => {
            if (!res.data.success) {
                this.setState({
                    message: 'Oops, some error occured pls retry!'
                })
            } else {
                this.setState({
                    contacts: res.data.contacts
                })
            }
        })
    }

    onSearch = () => {
        const { toSearch } = this.state;
        this.props.axiosInstance.post('/api/utils/search', {
            toSearch: toSearch
        }).then(res => {
            if (res.data.success) {
                this.setState({
                    usersSearched: res.data.users
                })
            } else {
                this.setState({
                    message: res.data.message
                })
            }
        })

    }

    onSearchBoxChange = (e) => {
        this.setState({
            toSearch: e.target.value
        }, () => {
            if (!this.state.toSearch) {
                this.setState({
                    usersSearched: []
                })
            }
        })
    }

    onUserClicked = (user) => {
        this.setState({
            highlightUser: user
        })
        this.props.setSelectedUser(user)
    }

    onSignOut = () => {

        this.props.axiosInstance.post('/api/account/signout').then(res => {
            if (!res.data.success) {
                this.setState({
                    message: res.data.message
                })
            } else {
                this.setState({
                    redirect: '/'
                })
            }
        })

    }

    render() {
        var { contacts, usersSearched, redirect } = this.state;

        if (redirect) {
            return <Redirect to={redirect} />
        }

        return (
            <div className='col-md-2 col-sm-4 mt-4 navbar bg-light navbar-light overflow-auto mh-10 ' id='contactsDiv'>

                <ul className="navbar-nav">

                    <li className="nav-item">
                        <h4 className='text-info'>CONTACTS</h4>
                    </li>
                    <br />
                    <li className="form-group row">
                        <div className="col-sm-12">
                            <input type="text" onChange={this.onSearchBoxChange} className="form-control" placeholder="Search users" />
                        </div>
                    </li>

                    <li className='nav-item'>
                        <button className='btn btn-dark' onClick={this.onSearch}>Search</button>
                        <button className='btn btn-dark ml-3' onClick={this.onSignOut}>Sign Out</button>
                    </li>

                    <hr />

                    {usersSearched.length > 0 ?
                        (usersSearched.map(user => (
                            this.state.highlightUser == user ?
                                <li className="contact bg-secondary  text-white nav-item border-bottom border-secondary p-3 " key={user}>
                                    <a href='#' onClick={this.onUserClicked.bind(this, user)}><h6 className=' text-white '>{user}</h6></a>
                                </li> :
                                <li className="contact nav-item border-bottom border-secondary p-3 " key={user}>
                                    <a href='#' onClick={this.onUserClicked.bind(this, user)}><h6>{user}</h6></a>
                                </li>
                        ))) :

                        contacts.map(contact => (
                            this.state.highlightUser == contact ?
                                <li className="contact bg-secondary text-white nav-item border-bottom border-secondary p-3 " key={contact}>
                                    <a href='#' onClick={this.onUserClicked.bind(this, contact)}><h6 className=' text-white '>{contact}</h6></a>
                                </li> :
                                <li className="contact nav-item border-bottom border-secondary p-3 " key={contact}>
                                    <a href='#' onClick={this.onUserClicked.bind(this, contact)}><h6>{contact}</h6></a>
                                </li>
                        ))
                    }

                    <li className='nav-item text-alert'>
                        {this.state.message}
                    </li>
                </ul>
            </div>
        )

    }

}

export default Contacts