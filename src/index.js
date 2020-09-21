/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.download = (req, res) => {
  const {main} = require('./ultrastar');
  main().then((val) => {
      res.status(200).send('DONE! ' + val);
  }).catch((e) => {
      res.status(500).send('Fail! ' + e);
  });
};
