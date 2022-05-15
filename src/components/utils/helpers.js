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

async function fetchParams(to) {
  const params = await fetch(host + "/params", {
    method: "POST",
    body: JSON.stringify({
      to: to
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return params.json();
}

module.exports = {
  fetchInvoice: fetchInvoice,
  luma: luma,
  contrastingColor: contrastingColor,
  fetchParams: fetchParams,
}