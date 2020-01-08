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

    app.post('/api/utils/search', (req, res) => {

        var { body } = req;
        var { toSearch } = body;
        toSearch = '' + toSearch;
        console.log(toSearch)
        User.find(
            {
                'username': { "$regex": toSearch, "$options": "i" }
            }, (err, docs) => {
                if (err) return sendError(res, "Server Error", err)

                users = docs.map(doc => doc.username)

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

                        var username = previousUsers[0].username;

                        if (users.indexOf(username) != -1) {
                            users = users.filter(user => user != username)
                            console.log('removing', username)
                        }
                        return res.send({
                            success: true,
                            users: users
                        })

                    })

                })



            });

    })

    app.post('/api/utils/isContact', (req, res) => {

        var { body } = req;
        var { user } = body;

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

                var contacts = previousUsers[0].contacts
                var indexOfUser = contacts.indexOf(user)

                if (indexOfUser == -1) {
                    return res.send({
                        success: true,
                        isContact: false
                    })
                } else {
                    return res.send({
                        success: true,
                        isContact: true
                    })
                }



            })

        })

    })

}