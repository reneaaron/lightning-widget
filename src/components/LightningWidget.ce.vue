<template>
  <div class="card">
    <div
      class="image"
      v-bind:style="{ backgroundImage: 'url(' + image + ')' }"
    ></div>
    <div class="content">
      <h3>{{ name }}</h3>
      <span class="fiat text-secondary">{{ address }}</span>
    </div>
    <div class="amount">
      <div class="form-group">
        <div class="input-group">
          <input
            type="number"
            class="form-control"
            name="amount"
            v-model.number="currentAmount"
          />
          <div class="input-group-append">
            <span class="input-group-text"> sats </span>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <button type="button" class="button" @click="pay()">{{ !loading ? '⚡ Pay' : 'Loading...' }}</button>
      <div class="text-secondary fiat center">
        <span v-if="fiat && fiatAmount">≈ {{ fiatAmount }} €</span>
      </div>
    </div>
    
    
  </div>
  <div class="powered-by text-secondary center">      
      Powered by 

      
      <svg width="16" height="16" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle">
      <path d="M734.996 365.822C735.163 402.397 729.869 438.926 719.176 474.179C705.521 519.191 683.391 561.042 654.102 597.533C647.681 605.534 640.915 613.277 633.82 620.739L434.558 820H820V434.558L751.95 502.608C753.904 497.05 755.739 491.443 757.453 485.791C776.906 421.662 780.244 353.726 767.17 288C764.214 273.137 760.439 258.491 755.875 244.125L1000 0V1000H0L494.151 505.762C531.551 471.484 555 422.23 555 367.5C555 263.947 471.053 180 367.5 180C263.947 180 180 263.947 180 367.5C180 471.053 263.947 555 367.5 555C374.99 555 382.377 554.561 389.637 553.707L233.528 709.816C96.8161 656.27 0 523.191 0 367.5C0 164.535 164.535 0 367.5 0C569.905 0 734.092 163.629 734.996 365.822Z" fill="black"/>
      </svg> <a href="https://twentyuno.net" target="_blank" rel="noreferer noopener">twentyuno</a>
  </div>

</template>

<script>

const host = "";

async function fetchInvoice(to, amount, comment) {

    const invoice = await fetch(host + '/invoice', {
      method: "POST",
      body: JSON.stringify({
          to: to,
          amount: amount,
          comment: comment,
      }),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      }
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
    fiat: { type: String, default: null }
  },
  data() {
    return {
      currentAmount: this.amount,
      loading: false,
    };
  },
  computed: {
    fiatAmount() {
      return (this.currentAmount * 45000 / 100000000).toFixed(2);
    },
  },
  mounted() {

  },
  methods: {
    pay: async function () {
      let webln;

      try {
        this.loading = true;
        const invoice = await fetchInvoice(this.address, this.amount);

        webln = window.webln;
        if (webln) {
          await webln.enable();
          await webln.sendPayment(invoice.payment_request);

          console.log("successful payment");
        } else {
          console.log("no WebLN");
          // popup = true;
        }
      } catch (e) {
        console.log(e.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap");

.card {
  --accent-color: #ffc800;
}

.powered-by {
  font-family: "Inter", sans-serif;
  line-height: 50px;
  margin: 0 20px;

}

.card {
  position: relative;
  font-family: "Inter", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  background: #fff;
  border: 1px #000 solid;
  border-radius: 4px;
  overflow: hidden;
}

.center {
  text-align: center;
}

.fiat {
  font-size: 0.9rem;
  padding: 0.25rem 0;
}

.image {
  width: 100%;
  max-width: 150px;
  height: 150px;
  background-size: cover;
  background-position: center center;
}

/*
@media screen and (max-width: 992px) {
  .image { width: 100%; max-width: 100%; height: 250px; }
}
*/

.card > div:not(.image) {
  padding: 2rem;
  flex-grow: 1;
}

h3 {
  margin: 0;
}

.button {
  background-color: #000;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  border-radius: 0.25rem;
  border: 1px solid #000;
  line-height: 1.3;
  padding: 14px 16px;
  transition: all 0.14s ease-out;
  width: 100%;
}

.button:hover {
  transform: translate(-4px, -4px);
  box-shadow: 4px 4px 0px #000000;
  color: #000000 !important;
  background-color: var(--accent-color);
}

.text-secondary {
  color: rgb(108, 117, 125);
}

input {
  border: none;
  outline: none;
  flex-grow: 1;
  padding: 0.75rem 1rem;
  overflow: hidden;
  border-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 3px solid #FFF; 
}

input:focus {
  outline: 0;
  border: 3px solid #000;
  border-right: 3px solid #000;
}

.content {
  flex-grow: 1;
}

.input-group-append {
  text-align: right;
  flex-grow: 0;
  padding: 0 0.75rem;
}

.input-group {
  display: flex;
  align-items: center;
  --active-bg: #f4f4f0;
  background-color: #fff;
  border: 0.0625rem solid #000;
  border-radius: 4px;
  color: #000;
  font-size: 1rem;
  line-height: 1.5;
}

.powered-by a {
  color: #000;
}
</style>