const fs = require('fs');
const { exec } = require("child_process");

const save = {
    runCode: function(req, res) {
        let buff = Buffer.from(req.body.code, "base64");
        let decoded = buff.toString('ascii');

        save.saveCode(decoded);

        // create file in docker folder with decoded content
        const data = new Uint8Array(Buffer.from(decoded));
        fs.writeFile('./docker/hello.py', data, (err) => {
            if (err) throw err;

            // execute docker run command
            exec("cd docker && docker build -t pythonrepl . > /dev/null 2>&1 && docker run pythonrepl", (error, stdout, stderr) => {
                let output;

                if (error) {
                    output = error.message;
                } else if (stderr) {
                    output = stderr;
                } else {
                    output = stdout;
                }

                // Encode output to base64
                buff = Buffer.from(output);

                let encodedOutput = buff.toString('base64');

                return res.status(201).json({
                    result: encodedOutput,
                });
            });
        });
    },

    saveCode: function(code) {
        console.log("code to write to file");
        console.log(code);
    },
};

module.exports = save;
