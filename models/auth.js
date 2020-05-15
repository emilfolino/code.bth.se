const db = require("../db/database.js");
const hat = require("hat");
const validator = require("email-validator");


const auth = {
    authenticateUser: function(req, res) {
        if (!validator.validate(req.body.email)) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/auth",
                    title: "Incorrect email",
                    detail: "Incorrect email address"
                }
            });
        }

        const sql = "SELECT * FROM students WHERE email = ?";

        db.get(
            sql,
            req.body.email,
            function(err, row) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/auth",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

                if (row === undefined) {
                    // Create user
                    const hash = hat();
                    const insertSql = "INSERT INTO students (email, hash) VALUES (?, ?)";

                    db.run(
                        insertSql,
                        req.body.email,
                        hash,
                        function(err) {
                            if (err) {
                                return res.status(500).json({
                                    errors: {
                                        status: 500,
                                        source: "/auth",
                                        title: "Database error",
                                        detail: err.message
                                    }
                                });
                            }

                            return res.redirect("/code/#" + hash);
                        });
                } else {
                    // Fetch hash
                    return res.redirect("/code/#" + row.hash);
                }
            }
        )
    }
};

module.exports = auth;
