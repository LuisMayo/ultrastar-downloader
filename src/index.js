/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const express = require('express')
const app = express()
app.use(cors(), express.json())
const port = 8080

app.get('/', (req, res) => {
    const { main } = require('./ultrastar');
    main().then((val) => {
        res.status(200).send('DONE! ' + val);
    }).catch((e) => {
        res.status(500).send('Fail! ' + e);
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


