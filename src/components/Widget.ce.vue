<template>
  <div v-cloak id="root" :style="cssProps">
    <div class="card" v-bind:style="backgroundImageStyle">
      <canvas id="confetti" ref="confetti"></canvas>
      <div class="toolbar">
        <button type="button" class="icon-button" aria-label="Back" @click="back()"
          v-if="step != 'start' && step != 'error' && step != 'thankyou'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="inherit-textcolor" d="M15 5l-7 7 7 7" stroke-width="2.25" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <span v-else></span>
        <a class="logo" href="https://widgets.twentyuno.net" target="_blank" rel="noreferer noopener"
          aria-label="Powered by twentyuno">
          <svg width="14" height="14" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="map-fill-color"
              d="M734.996 365.822C735.163 402.397 729.869 438.926 719.176 474.179C705.521 519.191 683.391 561.042 654.102 597.533C647.681 605.534 640.915 613.277 633.82 620.739L434.558 820H820V434.558L751.95 502.608C753.904 497.05 755.739 491.443 757.453 485.791C776.906 421.662 780.244 353.726 767.17 288C764.214 273.137 760.439 258.491 755.875 244.125L1000 0V1000H0L494.151 505.762C531.551 471.484 555 422.23 555 367.5C555 263.947 471.053 180 367.5 180C263.947 180 180 263.947 180 367.5C180 471.053 263.947 555 367.5 555C374.99 555 382.377 554.561 389.637 553.707L233.528 709.816C96.8161 656.27 0 523.191 0 367.5C0 164.535 164.535 0 367.5 0C569.905 0 734.092 163.629 734.996 365.822Z" />
          </svg>
        </a>
      </div>
      <Transition name="fade" mode="out-in">
        <div v-if="step == 'start'" class="step">
          <img v-if="image" class="image" :src="image" width="120" height="120" :alt="name" />
          <h3>{{ name }}</h3>
          <div v-if="to.includes('@')" class="address">
            <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path class="map-fill-color" d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
            </svg>
            {{ to }}
          </div>
          <button type="button" class="button" @click="showAmount()">{{ buttonText }}</button>
        </div>
        <div v-else-if="step == 'amount'" class="step">
          <h3>How many sats?</h3>
          <div class="pill-container">
            <button type="button" class="pill" :class="{ active: currentAmount === item.amount }"
              v-bind:key="item.amount" v-for="item in amountList" @click="currentAmount = item.amount">{{
              item.label }}</button>
          </div>
          <label class="amount-input">
            <input type="number" :class="{ 'has-suffix': currentAmount }" name="amount" placeholder="Enter an amount" required
              v-model.number="currentAmount" @keyup.enter="showNote()" />
            <span v-if="currentAmount" class="suffix">sats</span>
          </label>
          <button type="button" class="button" @click="showNote()">Next</button>
        </div>
        <div v-else-if="step == 'note'" class="step">
          <h3>Want to add a note?</h3>
          <div class="note">
            <textarea id="comment" name="comment" placeholder="Enter your note" rows="3"
              v-model="comment" :maxlength="params.commentAllowed"></textarea>
            <span v-if="params.commentAllowed" class="counter">{{ comment.length }}/{{ params.commentAllowed }}</span>
          </div>
          <button type="button" class="button" @click="step = 'pay'; pay()">Next</button>
        </div>
        <div v-else-if="step == 'pay'" class="step">
          <div class="spinner">
            <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path class="map-fill-color" d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
            </svg>
          </div>
          <h4>Waiting for payment with your browser wallet…</h4>
          <button type="button" class="ghost-button" @click="showQR()" v-if="paymentType == 'Invoice'">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect class="map-stroke-color" x="3.75" y="3.75" width="3" height="3" stroke-width="1.5" />
              <rect class="map-stroke-color" x="13.25" y="3.75" width="3" height="3" stroke-width="1.5" />
              <rect class="map-stroke-color" x="3.75" y="13.25" width="3" height="3" stroke-width="1.5" />
              <rect class="map-fill-color" x="9.25" y="9.25" width="1.5" height="1.5" />
              <rect class="map-fill-color" x="13.25" y="13.25" width="3" height="3" />
              <rect class="map-fill-color" x="9.25" y="3" width="1.5" height="4" />
              <rect class="map-fill-color" x="3" y="9.25" width="4" height="1.5" />
              <rect class="map-fill-color" x="9.25" y="13" width="1.5" height="4" />
            </svg>
            Use QR code
          </button>
        </div>
        <div v-else-if="step == 'qr'" class="step">
          <a class="qr" :href="'lightning:' + paymentRequest">
            <img width="150" height="150" :src="'https://embed.twentyuno.net/qr/' + paymentRequest" alt="qr" />
          </a>
          <Transition name="fade" mode="out-in">
            <h4 class="qr-heading" v-if="!qrTimeoutElapsed">Scan or click to pay</h4>
            <button v-else type="button" class="button" @click="step = 'thankyou'; celebrate()">Done?</button>
          </Transition>
        </div>
        <div v-else-if="step == 'thankyou'" class="step">
          <div class="avatar">
            <img v-if="image" class="image" :src="image" width="120" height="120" :alt="name" />
            <span class="badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <h3>Thank you</h3>
          <button type="button" class="ghost-button" @click="reset(); step = 'start'">Start over</button>
        </div>
        <div v-else-if="step == 'error'" class="step">
          <div class="error-icon">!</div>
          <h3 class="mb-0">{{ errorTitle }}</h3>
          <p v-html="errorMessage"></p>
          <button type="button" class="button" @click="reset(); step = 'start'">Start over</button>
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
    fontImport.setAttribute("href", "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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

* {
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
}

#root {
  --glass: color-mix(in srgb, var(--color) 12%, transparent);
  --glass-strong: color-mix(in srgb, var(--color) 22%, transparent);
  --muted: color-mix(in srgb, var(--color) 70%, transparent);
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.06), 0 12px 24px rgba(0, 0, 0, 0.08), 0 24px 48px rgba(0, 0, 0, 0.08);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  min-width: 250px;
  width: 100%;
  -webkit-font-smoothing: antialiased;
}

.card {
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  border-radius: 28px;
  color: var(--color);
  padding: 52px 24px 24px;
  background-color: var(--accent);
  /* 290px content + padding, same outer size as before */
  min-height: 340px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-size: cover;
  background-position: center center;
}

/* Soft top-light sheen over the accent color */
.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 80% at 50% 0%, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0) 60%),
    linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.06));
  pointer-events: none;
}

.step {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.toolbar {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--glass);
  cursor: pointer;
  transition: background 0.15s ease;
}

.icon-button:hover {
  background: var(--glass-strong);
}

.logo {
  display: inline-flex;
  padding: 9px;
  opacity: 0.55;
  transition: opacity 0.15s ease;
}

.logo:hover {
  opacity: 1;
}

.card .image {
  display: block;
  width: 120px;
  height: 120px;
  object-fit: cover;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 0 0 4px var(--glass-strong), var(--shadow);
}

.avatar {
  position: relative;
}

.badge {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color);
  box-shadow: 0 0 0 3px var(--accent), var(--shadow-sm);
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both 0.15s;
}

.badge path {
  stroke: var(--accent);
}

.address {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  margin-top: -10px;
  padding: 4px 10px;
  border-radius: 50px;
  background: var(--glass);
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  background: #FFFFFF;
  box-shadow: var(--shadow-sm);
  border-radius: 50px;
  padding: 12px 28px;
  border: none;
  color: var(--button-color);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.button:active,
.ghost-button:active,
.pill:active {
  transform: scale(0.97);
}

.ghost-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color);
  background: var(--glass);
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
}

.ghost-button:hover {
  background: var(--glass-strong);
}

.qr {
  display: block;
  background: #FFFFFF;
  box-shadow: var(--shadow);
  border-radius: 20px;
  padding: 10px;
  line-height: 0;
  transition: transform 0.15s ease;
}

.qr:hover {
  transform: scale(1.02);
}

.qr img {
  border-radius: 8px;
}

.mb-0 {
  margin-bottom: 0;
}

.pill-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 280px;
}

.pill {
  flex: 1 1 0;
  min-width: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color);
  background: var(--glass);
  border: 1px solid transparent;
  padding: 10px 8px;
  border-radius: 14px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
}

.pill:hover {
  background: var(--glass-strong);
}

.pill.active {
  background: var(--color);
  color: var(--accent);
}

.amount-input {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 280px;
}

input {
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 14px;
  padding: 12px 16px;
  text-align: center;
  color: var(--button-color);
  background: #FFFFFF;
  box-shadow: var(--shadow-sm);
  outline: none;
}

input.has-suffix {
  padding: 12px 52px;
}

input::placeholder {
  color: var(--button-color);
  font-weight: 500;
  opacity: 0.5;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.suffix {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 500;
  color: var(--button-color);
  opacity: 0.5;
  pointer-events: none;
}

.note {
  position: relative;
  width: 100%;
  max-width: 280px;
}

textarea {
  display: block;
  width: 100%;
  background: var(--glass);
  border: 1px solid transparent;
  border-radius: 16px;
  outline: none;
  resize: none;
  padding: 12px 14px 24px;
  text-align: left;
  color: var(--color);
  font-size: 15px;
  line-height: 1.45;
  transition: background 0.15s ease, border-color 0.15s ease;
}

textarea:focus {
  background: var(--glass-strong);
  border-color: var(--glass-strong);
}

textarea::placeholder {
  color: var(--color);
  opacity: 0.55;
}

.counter {
  position: absolute;
  right: 12px;
  bottom: 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted);
}

.spinner {
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--glass);
}

.spinner::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: var(--color);
  animation: spin 0.9s linear infinite;
}

.spinner svg {
  animation: pulse 1.6s ease-in-out infinite;
}

.error-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass);
  font-size: 26px;
  font-weight: 700;
}

a,
a:visited,
a:active,
a:hover {
  color: var(--color);
  font-weight: 500;
  text-decoration: none;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid var(--color);
  outline-offset: 3px;
}

#confetti {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

h3 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  margin: 0 8px;
}

h4 {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0 8px;
  max-width: 220px;
  color: var(--muted);
}

p {
  margin: 0 8px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--muted);
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
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  50% {
    transform: scale(0.85);
    opacity: 0.6;
  }
}

@keyframes pop {
  from {
    transform: scale(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
