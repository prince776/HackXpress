var User = require('../../models/User.js')
var UserSession = require('../../models/UserSession.js')

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
        console.log("HELLO")
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

            if (err) return sendError(res, "Server Error", err);
            else if (previousUsers.length > 0) return sendError(res, "Email Already Exists")

            User.find({
                username: username,
                isDeleted: false
            }, (err, previousUsersU) => {

                if (err) return sendError(res, "Server Error", err);
                else if (previousUsersU.length > 0) return sendError(res, "Username Already Exists")

                var newUser = User()
                newUser.username = username;
                newUser.email = email;
                newUser.password = newUser.generateHash(password);

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

    app.post('/api/account/signin', (req, res) => {

        var { body } = req;
        var { email, password } = body;

        if (!email) return sendError(res, "Empty Email");
        else if (!password) return sendError(res, "Empty Email");

        email = email.trim();
        email = email.toLowerCase();

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = re.test(String(email).toLowerCase());
        if (!validEmail) return sendError(res, 'Invalid Email')


        User.find({
            email: email,
            isDeleted: false
        }, (err, previousUsers) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousUsers.length < 1) return sendError(res, "User doesn't exists");

            const user = previousUsers[0];
            if (!user.validPassword(password)) return sendError(res, "Password Incorrect");

            //create login session
            var userSession = UserSession();
            userSession.userID = user._id;

            userSession.save((err, docs) => {
                if (err) return sendError(res, "Server error", err);
                //send Cookies
                var farFuture = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365 * 10)); // ~10y
                res.cookie('sessionToken', docs._id, { expires: farFuture });
                //send success message
                return res.send({
                    success: true,
                    message: 'Signed in succesfully'
                })
            })
        })
    })

    app.post('/api/account/verify', (req, res) => {

        const sessionToken = req.cookies.sessionToken;
        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Session Expired");

            return res.send({
                success: true,
                message: "Sesion valid"
            });

        })

    });

    app.post('/api/account/signout', (req, res) => {

        const sessionToken = req.cookies.sessionToken;

        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Session Already Expired");

            var userSession = previousSessions[0];
            userSession.isDeleted = true;

            userSession.save((err, docs) => {
                if (err) return sendError(res, "Server Error", err);
                res.clearCookie('sessionToken');
                return res.send({
                    success: true,
                    message: "Sesion Logged Out"
                });
            })
        })

    });

    app.post('/api/account/contacts', (req, res) => {
        const sessionToken = req.cookies.sessionToken;
        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Session Expired");

            var userID = previousSessions[0].userID;

            User.find({
                _id: userID,
                isDeleted: false
            }, (err, previousUsers) => {
                if (err) return sendError(res, "Server error", err)
                if (previousUsers.length < 1) return sendError(res, 'User doesn\'t exists')

                var user = previousUsers[0]
                var contacts = user.contacts
                console.log(contacts)

                return res.send({
                    success: true,
                    contacts: contacts
                })

            })

        })
    })

    app.post('/api/account/addContact', (req, res) => {

        const sessionToken = req.cookies.sessionToken;

        var { user } = req.body;

        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Session Expired");

            var userID = previousSessions[0].userID;

            User.find({
                _id: userID,
                isDeleted: false
            }, (err, previousUsers) => {
                if (err) return sendError(res, "Server error", err)
                if (previousUsers.length < 1) return sendError(res, 'User doesn\'t exists')

                var currentUser = previousUsers[0]

                currentUser.contacts = currentUser.contacts.concat([user])

                currentUser.save((err, doc) => {
                    if (err) return sendError(res, "Server Error", err);

                    return res.send({
                        success: true,
                        message: 'successfully added to contacts'
                    })
                })

            })

        })

    })

    app.post('/api/account/sendChat', (req, res) => {

        const sessionToken = req.cookies.sessionToken;

        var { to, chatMessage } = req.body;

        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Session Expired");

            var userID = previousSessions[0].userID;

            User.find({
                _id: userID,
                isDeleted: false
            }, (err, previousUsers) => {
                if (err) return sendError(res, "Server error", err)
                if (previousUsers.length < 1) return sendError(res, 'User doesn\'t exists')

                var user = previousUsers[0]

                var newChat = {
                    content: chatMessage,
                    sender: user.username,
                    to: to
                }

                user.chats = user.chats.concat([newChat])

                User.find({
                    username: to,
                    isDeleted: false
                }, (err, previousUsersU) => {
                    if (err) return sendError(res, "Server Error", err)
                    if (previousUsersU.length < 1) return sendError(res, "User not found")

                    var receiever = previousUsersU[0];
                    receiever.chats = receiever.chats.concat([newChat])
                    receiever.save((err, doc) => {
                        if (err) return sendError(res, "Server Error", err);
                    })

                })

                user.save((err, doc) => {
                    if (err) return sendError(res, "Server Error", err);

                    return res.send({
                        success: true,
                        message: 'message sent successfully',
                        newChat: newChat
                    })
                })

            })

        })

    })

    app.post('/api/account/getChat', (req, res) => {
        const sessionToken = req.cookies.sessionToken;
        var { contact } = req.body;

        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Session Expired");

            var userID = previousSessions[0].userID;

            User.find({
                _id: userID,
                isDeleted: false
            }, (err, previousUsers) => {
                if (err) return sendError(res, "Server error", err)
                if (previousUsers.length < 1) return sendError(res, 'User doesn\'t exists')

                var user = previousUsers[0]

                var chats = user.chats;

                var reqChats = chats.filter(chat => chat.sender == contact || chat.to == contact)


                return res.send({
                    success: true,
                    chats: reqChats
                })

            })

        })
    })

}