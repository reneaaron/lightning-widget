const express = require("express");
const path = require("path");
const lnurlPay = require('lnurl-pay');
const bodyParser = require("body-parser");
const { parsePaymentRequest } = require('invoices');
var QRCode = require('qrcode')
const { PassThrough } = require('stream');
var cors = require('cors')

const app = express();

app.use(express.static(path.join(__dirname, '../../public')))
app.use(express.static(path.join(__dirname, '../../dist')))
app.use('/assets', express.static(path.join(__dirname, '../../assets')))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

app.post("/invoice", async function (req, res) {
    try {
      const { invoice } = await lnurlPay.requestInvoice({
        lnUrlOrAddress: req.body.to,
        tokens: req.body.amount,
        comment: req.body.comment
      });
  
      const requestDetails = parsePaymentRequest({ request: invoice });
      res.json({ payment_request: invoice, payment_hash: requestDetails.id });
    } catch (ex) {
      res.status(500);
      res.send();
    }
  });

app.get("/qr/:data", async function (req, res) {
  try {
    
    const content = req.params.data;            
    const qrStream = new PassThrough();
    const result = await QRCode.toFileStream(qrStream, content.toUpperCase(),
        {
            type: 'png',
            width: 300,
            margin: 2,
            errorCorrectionLevel: 'L'
        }
    );

    qrStream.pipe(res);
  } catch (ex) {
    res.status(500);
    res.send();
  }
});

const port = process.env.PORT || 3000;
console.log(`Running on ${port}`);
app.listen(port);
