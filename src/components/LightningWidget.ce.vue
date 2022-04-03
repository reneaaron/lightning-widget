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
    <!--
    <div class="powered-by text-secondary">      
        <a href="https://twentyuno.net">
        <img width="20" src="https://citadel.twentyuno.net/content/images/2022/01/FINAL-6.png"/>twentyuno</a>
    </div>
    -->
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
  line-height: 20px;
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
  transition: all 0.14s ease-out !important;
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
</style>