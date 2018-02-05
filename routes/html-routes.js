var path = require("path");

// Routes
// =============================================================
module.exports = function (app) {

    // Each of the below routes just handles the HTML page that the user gets sent to.

    // root route loads index.html
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "/views/index.html"));
    });

};