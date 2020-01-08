import React, { Component } from 'react'

import Contacts from './Contacts.js'

import './Chat.css'

import * as toxicity from '@tensorflow-models/toxicity';


class Chat extends Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedUser: '',
            isContact: false,
            message: '',
            chatMessage: '',
            chatMessages: [],

            predictionConfidenceThreshold: 0.9,
            model: '',
            toxic: false,
            toxicityType: ''
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

                    this.props.axiosInstance.post('/api/account/getChat', {
                        contact: this.state.selectedUser
                    }).then(res => {
                        if (res.data.success) {
                            this.setState({
                                chatMessages: res.data.chats
                            })
                        }
                    })

                } else {
                }
            })

        })
    }

    onChatInputChange = (e) => {
        this.setState({
            chatMessage: e.target.value
        })
    }

    componentDidMount() {

        if (!this.state.selectedUser) {
            this.props.axiosInstance.post('/api/account/getChat', {
                contact: this.state.selectedUser
            }).then(res => {
                if (res.data.success) {
                    this.setState({
                        chatMessages: res.data.chats
                    })
                }
            })
        }

        this.loadModel().then(model => {
            console.log("Model Loaded")
        });

    }
    loadModel = async () => {
        this.setState({
            model: await toxicity.load(this.state.predictionConfidenceThreshold)
        })
    }

    classify = async (inputs) => {
        var { model } = this.state;

        const results = await model.classify(inputs);
        return inputs.map((d, i) => {
            const obj = { 'text': d };
            results.forEach((classification) => {
                obj[classification.label] = classification.results[i].match;
            });
            return obj;
        });
    };

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

    checkToxicity = async () => {
        this.setState({
            message: 'Checking...'
        })
        var toxic = await this.classify([this.state.chatMessage]).then(obj => {
            if (obj[0].toxicity) this.setState({ message: "Message is toxic" })
            else this.setState({ message: "Message is suitable for conversations" })
        })
    }

    sendMessage = () => {

        var { chatMessage } = this.state;
        if (!chatMessage)
            return
        this.props.axiosInstance.post('/api/account/sendChat', {
            to: this.state.selectedUser,
            chatMessage: chatMessage
        }).then(res => {
            if (res.data.success) {
                var newChat = res.data.newChat
                this.setState({
                    chatMessages: this.state.chatMessages.concat([newChat]),
                    chatMessage: '',
                    message: ''
                })
            } else {
                this.setState({
                    message: res.message
                })
            }
        })

    }

    render() {
        var { chatMessages, selectedUser } = this.state;
        console.log(selectedUser)

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
                                <div className="form-group col-md-8 ">
                                    <input type="text" name='chatMessage' value={this.state.chatMessage} onChange={this.onChatInputChange} className="form-control" placeholder="Send Message" />
                                </div>

                                <div className='col-md-3 text-center'>
                                    <button className='btn btn-dark ' onClick={this.sendMessage} >Send</button>
                                    <button className='btn btn-dark m-3' onClick={this.checkToxicity} >Check suitablity</button>

                                </div>
                                <h6 className='m-2'>{this.state.message}</h6>

                            </div>

                            <hr />

                            <div className='row text-white' id='chatbox'>

                                {chatMessages.map(chat => (

                                    chat.sender == selectedUser ?
                                        <div className='container-fluid' key={chatMessages.indexOf(chat)}>
                                            <div className='ml-3 col-5 p-3 bg-secondary m-1'>
                                                {chat.content}
                                            </div>
                                        </div> :
                                        <div className='container-fluid' key={chatMessages.indexOf(chat)}>
                                            <div className='col-5'>
                                            </div>
                                            <div key={chatMessages.indexOf(chat)} className='float-right col-5 bg-info p-3 m-1'>
                                                {chat.content}
                                            </div>
                                        </div>

                                ))}

                            </div>


                        </div>


                    </div>
                </div>
            )

        }



    }

}

export default Chat