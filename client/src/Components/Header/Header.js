import React, { Component } from 'react'

class Header extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {

        return (
            <div>

                <div className='row bg-warning text-white'>
                    <h1 className='ml-5 p-3'>
                        <strong><span className='text-dark'>X</span>press Chat</strong>
                    </h1>
                </div>

            </div>
        )

    }

}

export default Header