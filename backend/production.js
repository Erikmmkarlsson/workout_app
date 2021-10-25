const app = require('./server.js')
const express = require('express');
const path = require('path');

HTTP_PORT = 8000

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.static("public"));

app.get('/*', (req, res) => {
    console.log("Get site")
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'),
        function (err) {
            if (err) {
                res.status(500).send(err)
            }
        })
    });


// Start server
app.listen(HTTP_PORT, () => {
    console.log('Server running on port %PORT%'.replace('%PORT%', HTTP_PORT))
})

