<template>
  <div v-cloak id="root" :style="cssProps">
    <canvas id="confetti" ref="confetti"></canvas>
    <div class="logo">
        <a href="https://widgets.twentyuno.net" target="_blank" rel="noreferer noopener">
          <svg
            width="16"
            height="16"
            viewBox="0 0 1000 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style="vertical-align: top"
          >
            <path
              d="M734.996 365.822C735.163 402.397 729.869 438.926 719.176 474.179C705.521 519.191 683.391 561.042 654.102 597.533C647.681 605.534 640.915 613.277 633.82 620.739L434.558 820H820V434.558L751.95 502.608C753.904 497.05 755.739 491.443 757.453 485.791C776.906 421.662 780.244 353.726 767.17 288C764.214 273.137 760.439 258.491 755.875 244.125L1000 0V1000H0L494.151 505.762C531.551 471.484 555 422.23 555 367.5C555 263.947 471.053 180 367.5 180C263.947 180 180 263.947 180 367.5C180 471.053 263.947 555 367.5 555C374.99 555 382.377 554.561 389.637 553.707L233.528 709.816C96.8161 656.27 0 523.191 0 367.5C0 164.535 164.535 0 367.5 0C569.905 0 734.092 163.629 734.996 365.822Z"
              fill="#FFF"
            /></svg
        ></a>
    </div>
    <div class="back">
      <a href="#" @click="back()" v-if="step != 'start'">
        
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_27_452)">
          <path d="M13.8994 6.99833e-10L4.70703 9.19239C4.3165 9.58291 4.3165 10.2161 4.70703 10.6066L13.8994 19.799" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </g>
          <defs>
          <clipPath id="clip0_27_452">
          <rect width="20" height="20" fill="white"/>
          </clipPath>
          </defs>
          </svg>

      </a>
    </div>
    <div class="card">
      <div v-if="step == 'start'">
        <div><img v-if="image" class="image" :src="image" width="150" height="150" :alt="name" /></div>
        <div>
          <h3>{{ name }}</h3>
        </div>
        <div>
          <button type="button" class="button" @click="step = 'amount'">Donate sats</button>
        </div>
      </div>
      <div v-if="step == 'amount'">
        <div>
          <h3>How many sats?</h3>
        </div>
        <div class="mb-1">
            <div style="display: flex; flex-direction: row; justify-content: center">
              <div class="pill" @click="currentAmount=10">10</div>
              <div class="pill" @click="currentAmount=100">100</div>
              <div class="pill" @click="currentAmount=1000">1.000</div>
            </div>
            <input
              type="number"
              class="mb-1"
              name="amount"
              placeholder="Enter an amount"
              required
              v-model.number="currentAmount"
            />
        </div>
        <div>
          <button type="button" class="button" @click="step = 'note'">Next</button>
        </div>
      </div>
      <div v-if="step == 'note'">
          <h3>Want to add a note?</h3>
          <textarea id="comment" class="mb-2" name="comment" placeholder="Enter your note" rows="4" v-model="comment"></textarea>
          <button type="button" class="button" @click="step = 'pay'; pay()">Next</button>
      </div>
      <div v-if="step == 'pay'">
          <svg width="80" height="80" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
              <defs>
                  <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                      <stop stop-color="#fff" stop-opacity="0" offset="0%"/>
                      <stop stop-color="#fff" stop-opacity=".631" offset="63.146%"/>
                      <stop stop-color="#fff" offset="100%"/>
                  </linearGradient>
              </defs>
              <g fill="none" fill-rule="evenodd">
                  <g transform="translate(1 1)">
                      <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="2">
                          <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
                      </path>
                      <circle fill="#fff" cx="36" cy="18" r="1">
                          <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
                      </circle>
                  </g>
              </g>
          </svg>
          <h3 class="mb-2" style="text-align: center;">Waiting for payment with your browser wallet...</h3>
          <a href="#" @click="step = 'qr'">
            <svg style="vertical-align: top" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3.75" y="3.75" width="3" height="3" stroke="white" stroke-width="1.5"/>
              <rect x="13.2499" y="3.75" width="3" height="3" stroke="white" stroke-width="1.5"/>
              <rect x="3.75" y="13.25" width="3" height="3" stroke="white" stroke-width="1.5"/>
              <rect x="3" y="9.25" width="1.5" height="1.5" fill="white"/>
              <rect x="6" y="9.25" width="1.5" height="1.5" fill="white"/>
              <rect x="9.16663" y="9.25" width="1.5" height="1.5" fill="white"/>
              <rect x="9.16663" y="12.375" width="1.5" height="1.5" fill="white"/>
              <rect x="9.16663" y="15.5" width="1.5" height="1.5" fill="white"/>
              <rect x="9.16663" y="6.125" width="1.5" height="1.5" fill="white"/>
              <rect x="9.16663" y="3" width="1.5" height="1.5" fill="white"/>
              <rect x="12.3333" y="9.25" width="1.5" height="1.5" fill="white"/>
              <rect x="15.4999" y="9.25" width="1.5" height="1.5" fill="white"/>
              <rect x="12.3333" y="12.375" width="1.5" height="1.5" fill="white"/>
              <rect x="15.4999" y="12.375" width="1.5" height="1.5" fill="white"/>
              <rect x="12.3333" y="15.5" width="1.5" height="1.5" fill="white"/>
              <rect x="15.4999" y="15.5" width="1.5" height="1.5" fill="white"/>
            </svg>
            Use QR code
          </a>
      </div>
      <div v-if="step == 'qr'">
          <div class="mb-1">
            <a :href="'lightning:' + paymentRequest">
              <img class="qr" width="150" height="150" :src="'https://embed.twentyuno.net/qr/' +  paymentRequest" alt="qr" />
            </a>
          </div>
          <!--<input class="mb-1" type="text" :value="paymentRequest" readonly />-->
          <h2 style="text-align: center; margin: 0;" @click="step = 'thankyou'">Scan to pay</h2>
      </div>
        <div v-if="step == 'thankyou'">
          <div class="mb-1">
            <img v-if="image" class="image" :src="image" alt="" />        
          </div>
          <!--<input class="mb-1" type="text" :value="paymentRequest" readonly />-->
          <h2 style="text-align: center; margin: 0;">Thank you!</h2>
      </div>
    </div>
  </div>
  <!-- <div class="card" v-cloak>
    <img ng-if="image" class="rounded" :src="image" alt="" />
    <div class="content">
      <h3>{{ name }}</h3>
      <span class="fiat text-secondary">{{ address }}</span>
    </div>
    <div class="amount">
      <div class="form-group">
        <div class="input-group">

          <div class="input-group-append">
            <span class="input-group-text"> sats </span>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <button
        type="button"
        class="button"
        @click="pay()"
        v-bind:disabled="loading"
      >
        <img class="loading" v-if="loading" src="https://embed.twentyuno.net/assets/loading.svg" />
        {{ !loading ? "⚡ Pay" : "Loading..." }}
      </button>
      <div class="text-secondary fiat center" v-if="fiat && fiatAmount">
        <span>≈ {{ fiatAmount }} €</span>
      </div>
    </div>
  </div>
  <div class="powered-by text-secondary center">
    Powered by
    <a href="https://widgets.twentyuno.net" target="_blank" rel="noreferer noopener">
    <svg
      width="16"
      height="16"
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style="vertical-align: middle"
    >
      <path
        d="M734.996 365.822C735.163 402.397 729.869 438.926 719.176 474.179C705.521 519.191 683.391 561.042 654.102 597.533C647.681 605.534 640.915 613.277 633.82 620.739L434.558 820H820V434.558L751.95 502.608C753.904 497.05 755.739 491.443 757.453 485.791C776.906 421.662 780.244 353.726 767.17 288C764.214 273.137 760.439 258.491 755.875 244.125L1000 0V1000H0L494.151 505.762C531.551 471.484 555 422.23 555 367.5C555 263.947 471.053 180 367.5 180C263.947 180 180 263.947 180 367.5C180 471.053 263.947 555 367.5 555C374.99 555 382.377 554.561 389.637 553.707L233.528 709.816C96.8161 656.27 0 523.191 0 367.5C0 164.535 164.535 0 367.5 0C569.905 0 734.092 163.629 734.996 365.822Z"
        fill="black"
      /></svg
    ></a>
  </div>
  <div class="popup" v-if="popup" @click="popup = false">
    <div class="popup-content" @click.stop>
      <div class="popup-close"  @click="popup = false">
          <img src="https://embed.twentyuno.net/assets/close.svg" width="32" height="32" />
      </div>
      <h2 class="title">No wallet found</h2>
      <p>
        We couldn't find a native WebLN wallet within your browser. Continue
        using one of the following options below:
      </p>
      <p class="center">
        <a href="https://getalby.com" class="btn">Download Alby</a>
      </p>
      <div class="center">
        or use an external wallet 
        <div v-if="popup && paymentRequest">
          <img :src="'https://embed.twentyuno.net/qr/' +  paymentRequest" alt="qr" />
          <input type="text" :value="paymentRequest" readonly />
        </div>
        <div v-else>
          Loading...
        </div>
      </div>
    </div>
  </div> -->
</template>
<script>

const host = "http://localhost:3002";

import JSConfetti from 'js-confetti'

async function fetchInvoice(to, amount, comment) {
  const invoice = await fetch(host + "/invoice", {
    method: "POST",
    body: JSON.stringify({
      to: to,
      amount: amount,
      comment: comment,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return invoice.json();
}

export default {
  name: "LightningWidget",
  props: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
    amount: { type: Number, default: 21 },
    fiat: { type: String, default: null },
    accent: { type: String, default: null },
    initialStep: { type: String, default: 'start' },
  },
  data() {
    return {
      currentAmount: this.amount,
      loading: false,
      popup: false,
      paymentRequest: null,
      step: this.initialStep,
      comment: '',
    };
  },
  computed: {
    fiatAmount() {
      return ((this.currentAmount * 45000) / 100000000).toFixed(2);
    },
    cssProps() {
      return {
        '--accent': this.accent,
      }
    }
  },
  mounted() {
    // Install fonts (do need to be included outside of the shadow dom)
    const fontImport = document.createElement('link')
    this.setAttributes(fontImport, [
      {
        name: 'href',
        value:
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'
      },
      { name: 'rel', value: 'stylesheet' },
      { name: 'type', value: 'text/css' }
    ])
    document.head.appendChild(fontImport);
  },
  methods: {
    setAttributes (elem, attrs) {
        attrs.forEach(attr => {
          elem.setAttribute(attr.name, attr.value)
        })
    },
    pay: async function () {
      let webln;
      try {
        this.loading = true;
        const invoice = await fetchInvoice(this.address, this.currentAmount, this.comment);

        this.paymentRequest = invoice.payment_request;
    
        webln = window.webln;
        if (webln) {
          await webln.enable();
          await webln.sendPayment(invoice.payment_request);

          this.step = 'thankyou';
          const canvas = this.$refs["confetti"];
          const jsConfetti = new JSConfetti({ canvas });
          jsConfetti.addConfetti({
            confettiColors: [
                '#FFF',
              ],
          });

        } else {
          this.step = 'qr';
        }
      } catch (e) {
        console.log(e.message);
        this.step = 'qr';
      } finally {
        this.loading = false;
      }
    },
    back: function() {
      const steps = [
        'start',
        'amount',
        'note',
        'qr',
        'thankyou',
      ];

      this.step = steps[steps.indexOf(this.step)-1];
    }
  },
};
</script>
<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

* {
  font-family: "Inter", sans-serif;
}

#root {
  position: relative;
  min-width: 354px;
  width: 100%;
}

.card {
  box-shadow: 0px 32px 32px rgba(0, 0, 0, 0.07), 0px 16px 16px rgba(0, 0, 0, 0.07), 0px 8px 8px rgba(0, 0, 0, 0.07), 0px 4px 4px rgba(0, 0, 0, 0.07), 0px 2px 2px rgba(0, 0, 0, 0.07);
  border-radius: 25px;
  color: #FFF;
  padding: 2em;
  background-color: var(--accent);
  min-height: 270px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card > div {
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
  color: var(--accent);
  font-weight: bold;
  border: 1px solid transparent;
  transition: all 0.1s ease-in;
}

.button:hover {
  cursor: pointer;
  background: var(--accent);
  color: #FFF;
  border: 1px solid #FFF;
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
  max-width: 100%;
  background: none;
  border: none;
  color: #FFF;
  outline: none;
  resize: none;
  text-align: center;
}

input {
  border: 1px solid #FFF;
  border-radius: 50px;
  padding: 10px 20px;
  text-align: center;
  color: var(--accent);
  font-weight: bold;
  outline: none;
  font-size: 16px;
}

input[type='number'] {
    -moz-appearance:textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

a, a:visited, a:active, a:hover {
  color: #FFF;
  font-weight: 500;
  text-decoration: none;
}

.pill {
  border: 1px solid #FFF;
  padding: 0.5em;
  color: #FFF;
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
  background: #FFF;
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
  width: 100%; 
  height: 100%; 
  border-radius: 25px;
  pointer-events: none;
}
</style>