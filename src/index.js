/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json(), cors())
const port = process.env.PORT || 8080

app.post('/', (req, res) => {
    const { main } = require('./ultrastar');
    main(req.body).then((val) => {
        res.download(__dirname + '/' + req.body.username + '/songs.zip');
    }).catch((e) => {
        res.status(500).send('Fail! ' + e);
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


