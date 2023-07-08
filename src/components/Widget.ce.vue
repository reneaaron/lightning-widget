<template>
  <div v-cloak id="root" :style="cssProps">
    <canvas id="confetti" ref="confetti"></canvas>
    <div class="logo">
      <a href="https://widgets.twentyuno.net" target="_blank" rel="noreferer noopener">
        <svg width="16" height="16" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg"
          style="vertical-align: top">
          <path class="map-fill-color"
            d="M734.996 365.822C735.163 402.397 729.869 438.926 719.176 474.179C705.521 519.191 683.391 561.042 654.102 597.533C647.681 605.534 640.915 613.277 633.82 620.739L434.558 820H820V434.558L751.95 502.608C753.904 497.05 755.739 491.443 757.453 485.791C776.906 421.662 780.244 353.726 767.17 288C764.214 273.137 760.439 258.491 755.875 244.125L1000 0V1000H0L494.151 505.762C531.551 471.484 555 422.23 555 367.5C555 263.947 471.053 180 367.5 180C263.947 180 180 263.947 180 367.5C180 471.053 263.947 555 367.5 555C374.99 555 382.377 554.561 389.637 553.707L233.528 709.816C96.8161 656.27 0 523.191 0 367.5C0 164.535 164.535 0 367.5 0C569.905 0 734.092 163.629 734.996 365.822Z"
            fill="#FFF" />
        </svg></a>
    </div>
    <div class="back">
      <a href="javascript:void(0)" @click="back()" v-if="step != 'start' && step != 'error' && step != 'thankyou'">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_27_452)">
            <path class="inherit-textcolor"
              d="M13.8994 6.99833e-10L4.70703 9.19239C4.3165 9.58291 4.3165 10.2161 4.70703 10.6066L13.8994 19.799"
              stroke="white" stroke-width="2" stroke-linecap="round" />
          </g>
          <defs>
            <clipPath id="clip0_27_452">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>

      </a>
    </div>
    <div class="card" v-bind:style="backgroundImageStyle">
      <Transition name="fade" mode="out-in">
        <div v-if="step == 'start'">
          <div><img v-if="image" class="image" :src="image" width="150" height="150" :alt="name" /></div>
          <div>
            <h3>{{ name }}</h3>
          </div>
          <div>
            <button type="button" class="button" @click="showAmount()">{{ buttonText }}</button>
          </div>
        </div>
        <div v-else-if="step == 'amount'">
          <div>
            <h3>How many sats?</h3>
          </div>
          <div class="mb-1">
            <div class="pill-container">
              <div class="pill" v-bind:key="item.amount" v-for="item in amountList" @click="currentAmount = item.amount">{{
                item.label }}</div>
            </div>
            <input type="number" class="mb-1" name="amount" placeholder="Enter an amount" required
              v-model.number="currentAmount" />
          </div>
          <div>
            <button type="button" class="button" @click="showNote()">Next</button>
          </div>
        </div>
        <div v-else-if="step == 'note'">
          <h3>Want to add a note?</h3>
          <textarea id="comment" class="mb-1" name="comment" placeholder="Enter your note" rows="4"
            v-model="comment" :maxlength="this.params.commentAllowed"></textarea>
          <button type="button" class="button" @click="step = 'pay'; pay()">Next</button>
        </div>
        <div v-else-if="step == 'pay'">
          <svg width="100" height="100" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                <stop :stop-color="color" stop-opacity="0" offset="0%" />
                <stop :stop-color="color" stop-opacity=".631" offset="63.146%" />
                <stop :stop-color="color" offset="100%" />
              </linearGradient>
            </defs>
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(1 1)">
                <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="2">
                  <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s"
                    repeatCount="indefinite" />
                </path>
                <circle fill="#fff" cx="36" cy="18" r="1">
                  <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s"
                    repeatCount="indefinite" />
                </circle>
              </g>
            </g>
          </svg>
          <h4 class="mb-2">Waiting for payment with your browser wallet...</h4>
          <a href="javascript:void(0)" @click="showQR()" v-if="paymentType == 'Invoice'">
            <svg style="vertical-align: middle" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <rect class="map-stroke-color" x="3.75" y="3.75" width="3" height="3" stroke="white" stroke-width="1.5" />
              <rect class="map-stroke-color" t x="13.2499" y="3.75" width="3" height="3" stroke="white"
                stroke-width="1.5" />
              <rect class="map-stroke-color" x="3.75" y="13.25" width="3" height="3" stroke="white" stroke-width="1.5" />
              <rect class="map-fill-color" x="3" y="9.25" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="6" y="9.25" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="9.16663" y="9.25" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="9.16663" y="12.375" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="9.16663" y="15.5" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="9.16663" y="6.125" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="9.16663" y="3" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="12.3333" y="9.25" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="15.4999" y="9.25" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="12.3333" y="12.375" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="15.4999" y="12.375" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="12.3333" y="15.5" width="1.5" height="1.5" fill="white" />
              <rect class="map-fill-color" x="15.4999" y="15.5" width="1.5" height="1.5" fill="white" />
            </svg>
            Use QR code
          </a>
        </div>
        <div v-else-if="step == 'qr'">
          <div class="mb-1">
            <a :href="'lightning:' + paymentRequest">
              <img class="qr" width="150" height="150" :src="'https://embed.twentyuno.net/qr/' + paymentRequest"
                alt="qr" />
            </a>
          </div>
          <Transition name="fade" mode="out-in">
            <h4 class="qr-heading" v-if="!qrTimeoutElapsed">Scan or Click to pay</h4>
            <button v-else class="button" @click="step = 'thankyou'; celebrate()">Done?</button>
          </Transition>
        </div>
        <div v-else-if="step == 'thankyou'">
          <div><img v-if="image" class="image" :src="image" width="150" height="150" :alt="name" /></div>
          <div>
            <h3>Thank you</h3>
          </div>
          <div>
            <button class="button" @click="reset(); step = 'start'">Start over</button>
          </div>
        </div>
        <div v-else-if="step == 'error'">
          <h3 style="margin-bottom: 0">{{ errorTitle }}</h3>
          <p class="mb-2" v-html="errorMessage">
          </p>
          <button class="button" @click="reset(); step = 'start'">Start over</button>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script>
import JSConfetti from 'js-confetti'
import { fetchInvoice, fetchParams, contrastingColor, luma, formatAmount } from './utils/helpers';

export default {
  name: "LightningWidget",
  props: {
    name: { type: String, required: true },
    to: { type: String, required: true, default: "reneaaron@getalby.com" },

    amounts: { type: String, required: false, default: "10,100,1000" },
    labels: { type: String, required: false },

    // Style
    image: { type: String, required: true },
    accent: { type: String, default: '#20C997' },
    buttonText: { type: String, default: 'Donate sats' },
    backgroundImage: { type: String, default: null },

    // Deprecated --> use `to`
    address: { type: String, required: false, default: "reneaaron@getalby.com" },

    // Debugging purposes only 
    debug: { type: Boolean, default: false },
    initialStep: { type: String, default: 'start' },
  },
  data() {
    return {
      currentAmount: this.amount,
      params: {},
      loading: false,
      paymentRequest: null,
      step: this.initialStep,
      comment: '',
      qrTimeoutElapsed: false,
      paymentType: 'Invoice',
      errorTitle: '',
      errorMessage: '',
      amountList: [],
    };
  },
  computed: {
    cssProps() {
      return {
        '--accent': this.accent,
        '--color': this.color,
        '--button-color': luma(this.accent.substring(1)) < 200 ? this.accent : '#000',
      }
    },
    color() {
      return contrastingColor(this.accent.substring(1));
    },
    backgroundImageStyle() {
      return this.backgroundImage ? { 'background-image': `url('${this.backgroundImage}')` } : {};
    }
  },
  async mounted() {
    const labels = this.labels ? this.labels.split(",") : [];
    this.amountList = this.amounts.split(",").slice(0, 3).map((x, i) => {
      return {
        label: labels[i] ?? formatAmount(parseInt(x), 0),
        amount: parseInt(x)
      };
    });

    // Install fonts (do need to be included outside of the shadow dom)
    const fontImport = document.createElement("link");
    fontImport.setAttribute("href", "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap");
    fontImport.setAttribute("rel", "stylesheet");
    fontImport.setAttribute("type", "text/css");

    document.head.appendChild(fontImport);

    // Keysend payments
    if (this.to.match(/^[0-9a-fA-F]{66}$/i)) {
      this.paymentType = "Keysend";
    }
    else if (this.debug) {
      try {
        this.params = await fetchParams(this.to);
        const minAmount = this.amountList.reduce((a, b) => Math.max(a.amount, b.amount));
        const maxAmount = this.amountList.reduce((a, b) => Math.min(a.amount, b.amount));
        if (this.params.min > minAmount || this.params.max < maxAmount) {
          this.error("Configuration error", `Please make sure the LNURL you provided allows payments between ${minAmount} and ${maxAmount} sats. (min: ${this.params.min}, max: ${this.params.max})`);
        }
      }
      catch (e) {
        this.error("Configuration error", "Are you sure this is a valid lightning address or LNURL?");
      }
    }
  },
  methods: {
    error: function (title, message) {
      this.errorTitle = title;
      this.errorMessage = message;
      this.step = 'error';
    },
    pay: async function () {
      await this['pay' + this.paymentType]();
    },
    payKeysend: async function () {
      let error = false;

      try {
        this.loading = true;

        if (window.webln) {
          await window.webln.enable();
          await window.webln.keysend({
            destination: this.to,
            amount: this.currentAmount,
            customRecords: {
              // https://docs.lightning.engineering/lightning-network-tools/lnd/send-messages-with-keysend
              34349334: this.comment
            }
          });

          this.step = 'thankyou';
          this.celebrate();

        } else {
          error = true;
        }
      } catch (e) {
        error = true;
      } finally {
        this.loading = false;
      }

      if (error) {
        this.error("No wallet available", `You first need to install a browser extension.<br><br><a class="text-link" href="https://www.getalby.com" target="_blank" rel="noopener noreferrer">Learn more</a>`);
      }
    },
    payInvoice: async function () {
      let webln;
      let error = false;

      try {
        this.loading = true;
        let invoice;

        // Fetch invoice
        try {
          invoice = await fetchInvoice(this.to || this.address, this.currentAmount, this.comment);
          this.paymentRequest = invoice.payment_request;
        }
        catch (e) {
          this.error('Sorry', 'An error happend during the payment. Try again?');
          this.loading = false;
          return;
        }

        webln = window.webln;
        if (webln) {
          await webln.enable();
          await webln.sendPayment(invoice.payment_request);

          this.step = 'thankyou';
          this.celebrate();

        } else {
          error = true;
        }
      } catch (e) {
        error = true;
      } finally {
        this.loading = false;
      }

      if (error) {
        this.showQR();
      }
    },
    showAmount: async function() {
      this.params = await fetchParams(this.to);
      this.step = 'amount';
    },
    showNote: function() {
      if(this.currentAmount <= 0)
        return;

      if(this.params.commentAllowed > 0) {
        this.step = 'note';
      } else {
        this.step = 'pay';
        this.pay();
      }
    },
    showQR: function () {
      this.qrTimeoutElapsed = false;
      this.step = 'qr';
      setTimeout(() => { this.qrTimeoutElapsed = true; }, 3000);
    },
    back: function () {
      const steps = [
        'start',
        'amount',
        'note',
        'pay',
        'qr',
      ];

      this.step = steps[steps.indexOf(this.step) - 1];
    },
    celebrate: function () {
      const canvas = this.$refs["confetti"];
      const jsConfetti = new JSConfetti({ canvas });
      jsConfetti.addConfetti({
        confettiColors: [
          this.color
        ],
      });
    },
    reset: function () {
      this.comment = '';
      this.currentAmount = null;
      this.paymentRequest = null;
    }
  },
};
</script>

<style>
/* Reset CSS */
abbr,
address,
article,
aside,
audio,
b,
blockquote,
body,
canvas,
caption,
cite,
code,
dd,
del,
details,
dfn,
div,
dl,
dt,
em,
fieldset,
figcaption,
figure,
footer,
form,
h1,
h2,
h3,
h4,
h5,
h6,
header,
hgroup,
html,
i,
iframe,
img,
ins,
kbd,
label,
legend,
li,
mark,
menu,
nav,
object,
ol,
p,
pre,
q,
samp,
section,
small,
span,
strong,
sub,
summary,
sup,
table,
tbody,
td,
tfoot,
th,
thead,
time,
tr,
ul,
var,
video {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent
}

body {
  line-height: 1
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block
}

nav ul {
  list-style: none
}

blockquote,
q {
  quotes: none
}

blockquote:after,
blockquote:before,
q:after,
q:before {
  content: "";
  content: none
}

a {
  margin: 0;
  padding: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent
}

ins {
  text-decoration: none
}

ins,
mark {
  background-color: #ff9;
  color: #000
}

mark {
  font-style: italic;
  font-weight: 700
}

del {
  text-decoration: line-through
}

abbr[title],
dfn[title] {
  border-bottom: 1px dotted;
  cursor: help
}

table {
  border-collapse: collapse;
  border-spacing: 0
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 1em 0;
  padding: 0
}

input,
select {
  vertical-align: middle
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

* {
  font-family: "Inter", sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#root {
  position: relative;
  min-width: 250px;
  width: 100%;
}

.card {
  box-shadow: 0px 32px 32px rgba(0, 0, 0, 0.07), 0px 16px 16px rgba(0, 0, 0, 0.07), 0px 8px 8px rgba(0, 0, 0, 0.07), 0px 4px 4px rgba(0, 0, 0, 0.07), 0px 2px 2px rgba(0, 0, 0, 0.07);
  border-radius: 25px;
  color: var(--color);
  padding: 25px;
  background-color: var(--accent);
  min-height: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-size: cover;
  background-position: center center;
}

.card>div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.qr {
  background: #FFFFFF;
  box-shadow: 0px 32px 32px rgba(0, 0, 0, 0.07), 0px 16px 16px rgba(0, 0, 0, 0.07), 0px 8px 8px rgba(0, 0, 0, 0.07), 0px 4px 4px rgba(0, 0, 0, 0.07), 0px 2px 2px rgba(0, 0, 0, 0.07);
  border-radius: 5px;
  padding: 8px;
}

.mb-1 {
  margin-bottom: 1em;
}

.mb-2 {
  margin-bottom: 2em;
}

.button {
  font-size: 17px;
  background: #FFFFFF;
  box-shadow: 0px 32px 32px rgba(0, 0, 0, 0.07), 0px 16px 16px rgba(0, 0, 0, 0.07), 0px 8px 8px rgba(0, 0, 0, 0.07), 0px 4px 4px rgba(0, 0, 0, 0.07), 0px 2px 2px rgba(0, 0, 0, 0.07);
  border-radius: 50px;
  padding: 10px 30px;
  border: none;
  flex: none;
  color: var(--button-color);
  font-weight: bold;
  border: 1px solid transparent;
  transition: all 0.1s ease-in;
}

.button:hover {
  cursor: pointer;
  background: var(--accent);
  border: 1px solid #FFF;
  color: var(--color);
}

.card .image {
  background: #FFFFFF;
  box-shadow: 0px 32px 32px rgba(0, 0, 0, 0.07), 0px 16px 16px rgba(0, 0, 0, 0.07), 0px 8px 8px rgba(0, 0, 0, 0.07), 0px 4px 4px rgba(0, 0, 0, 0.07), 0px 2px 2px rgba(0, 0, 0, 0.07);
  border-radius: 100px;
  max-width: 150px;
}

.logo {
  position: absolute;
  top: 16px;
  right: 16px;
}

textarea {
  max-width: 90%;
  background: none;
  border: none;
  outline: none;
  resize: none;
  text-align: center;
  color: var(--color);
  font-size: 17px;

}

textarea::placeholder {
  color: var(--color);
  opacity: 0.5;
}

input {
  font-size: 17px;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  text-align: center;
  color: var(--button-color);
  font-weight: bold;
  outline: none;
  font-size: 16px;
  max-width: 200px;
}

input::placeholder {
  color: var(--button-color);
  opacity: 0.5;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

a,
a:visited,
a:active,
a:hover {
  color: var(--color);
  font-weight: 500;
  text-decoration: none;
}

.pill {
  font-size: 17px;
  border: 1px solid var(--color);
  color: var(--color);
  padding: 0.5em 1em;
  border-radius: 50px;
  flex-grow: 1;
  text-align: center;
  margin-bottom: 1em;
  margin-left: 0.25em;
  margin-right: 0.25em;
  cursor: pointer;
}

.pill:hover {
  color: var(--accent);
  background: var(--color);
}

.pill-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.back {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 10;
}

#confetti {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  pointer-events: none;
}

h3 {
  font-size: 24px;
  margin: 1em;
  line-height: 29px;
}

h4 {
  font-size: 17px;
  margin: 1em;
  line-height: 21px;
}

p {
  margin: 1em 0;
  line-height: 1.5em;
}

a.text-link,
a.text-link:hover,
a.text-link:visited,
a.text-link:active {
  color: var(--color);
  text-decoration: underline;
}

/* Conditional SVG fill / stroke colors */
.inherit-textcolor,
.map-stroke-color {
  stroke: var(--color);
}

.map-fill-color {
  fill: var(--color);
}

.qr-heading {
  text-align: center;
  margin: 0;
}</style>