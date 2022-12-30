const host = "https://embed.twentyuno.net";

function contrastingColor(color)
{
    return (luma(color) >= 200) ? '#000' : '#fff';
}

function luma(color)
{
    var rgb = hexToRGB(color);
    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]);
}

function hexToRGB(color)
{
    var rgb = [];
    for (var i = 0; i <= 2; i++)
        rgb[i] = parseInt(color.substr(i * 2, 2), 16);
    return rgb;
}

async function fetchInvoice(to, amount, comment) {
  const response = await fetch(host + `/invoice?to=${to}&amount=${amount}&comment=${comment}`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  });

  if(!response.ok) {
    throw new Error(response.error);
  }

  return response.json();
}

async function fetchParams(to) {
  const response = await fetch(host + `/params?to=${to}`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  });

  if(!response.ok) {
    throw new Error(response.error);
  }

  return response.json();
}

const formatAmount = (amount, decimals = 1) => {
  let i = 0;
  for (i; amount >= 1000; i++) {
    amount /= 1000;
  }
  return Number.parseFloat(amount).toFixed(i > 0 ? decimals : 0) + ["", "k", "M", "G"][i];
}

module.exports = {
  fetchInvoice,
  luma,
  contrastingColor,
  fetchParams,
  formatAmount
}