var User = require('../../models/User.js')

var sendError = (res, errFront, errBack) => {
    if (!errBack) errBack = errFront;
    console.log('Error:' + errBack)
    res.send({
        success: false,
        message: errFront
    })
}

module.exports = (app) => {

    app.post('/api/account/signup', (req, res) => {

        var { body } = req;
        var { username, email, password } = body;

        if (!username) return sendError(res, "Empty Username!")
        else if (!email) return sendError(res, "Empty Email!")
        else if (!password) return sendError(res, "Empty Password!")

        username = username.trim()
        email = email.trim()
        email = email.toLowerCase()

        var regexE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = regexE.test(String(email));
        if (!validEmail) return sendError(res, 'Invalid Email!')

        User.find({
            email: email,
            isDeleted: false
        }, (err, previousUsers) => {

            if (err) return res.sendError(res, err)
            else if (previousUsers.length > 0) return sendError(res, "Email Already Exists")

            User.find({
                username: username,
                isDeleted: false
            }, (err, previousUsersU) => {

                if (err) return res.sendError(res, err)
                else if (previousUsersU.length > 0) return sendError(res, "Username Already Exists")

                var newUser = User()
                newUser.username = username;
                newUser.email = email;
                newUser.password = password;

                newUser.save((err, docs) => {
                    if (err) return sendError(res, err)
                    else {
                        return res.send({
                            success: true,
                            message: 'Successfully signed up!'
                        })
                    }
                })

            })

        })

    })

}