const banks = [
  { name: "State Bank of India", logo: "imgsl.jpeg", link: "sbi.html", cat: "public", loc: "Mumbai, India", tags: ["Trusted", "Govt"], rates: { fd: "6.95%", ppf: "7.10%", rd: "6.80%", mf: "12.50%" } },
  { name: "HDFC Bank", logo: "imghdfc.jpeg", link: "hdfc.html", cat: "private", loc: "Mumbai, India", tags: ["Premium", "Top Rated"], rates: { fd: "6.60%", ppf: "7.10%", rd: "7.00%", mf: "14.20%" } },
  { name: "ICICI Bank", logo: "imgicici.jpeg", link: "icici.html", cat: "private", loc: "Mumbai, India", tags: ["Trusted"], rates: { fd: "6.50%", ppf: "7.10%", rd: "6.90%", mf: "13.80%" } },
  { name: "Punjab National Bank", logo: "pnblogo.jpeg", link: "pnb.html", cat: "public", loc: "New Delhi, India", tags: ["Govt"], rates: { fd: "6.50%", ppf: "7.10%", rd: "6.50%", mf: "11.00%" } },
  { name: "Canara Bank", logo: "imgcl.jpeg", link: "canara.html", cat: "small-finance", loc: "Bengaluru, India", tags: ["Established"], rates: { fd: "6.75%", ppf: "7.10%", rd: "6.70%", mf: "10.50%" } },
  { name: "Axis Bank", logo: "imgaxl.jpeg", link: "axis.html", cat: "small-finance", loc: "Mumbai, India", tags: ["Premium"], rates: { fd: "7.20%", ppf: "7.10%", rd: "6.80%", mf: "13.00%" } }
];

const heroBanks = [banks[0], banks[2], banks[1]];
let slideNum = 0;

document.addEventListener('DOMContentLoaded', function () {
  updateCarousel();
  updateBankList();
  document.querySelectorAll('.category-filter, input[name="invest-type"]').forEach(function (el) {
    el.addEventListener('change', updateBankList);
  });
  setInterval(autoSlide, 4000);
});

function updateCarousel() {
  let b = heroBanks[slideNum];
  document.getElementById('carousel-track').innerHTML = `
    <div class="carousel-slide">
      <div class="hero-logo-box">
        <img src="${b.logo}" alt="${b.name.substring(0, 2)}">
      </div>
      <div class="hero-info">
        <span class="tag" style="background:#dbeafe; color:#2563eb">Featured</span>
        <h1>${b.name}</h1>
        <p style="color:#64748b;">Premium returns. Trusted bank.</p>
        <div class="hero-rate">${b.rates.fd} <small>p.a.</small></div>
      </div>
      <a href="${b.link}" class="btn-get-started" style="padding:15px 30px">View Details</a>
    </div>`;
  document.querySelectorAll('.dot').forEach(function (dot, i) {
    dot.classList.toggle('active', i === slideNum);
  });
}

function autoSlide() {
  slideNum = (slideNum + 1) % 3;
  updateCarousel();
}

function updateBankList() {
  let catBoxes = document.querySelectorAll('.category-filter:checked');
  let cats = Array.from(catBoxes).map(cb => cb.value);
  let rateType = document.querySelector('input[name="invest-type"]:checked').value;

  let shownBanks = banks.filter(function (bank) {
    return cats.includes(bank.cat);
  });

  document.getElementById('bank-count-text').innerText = `Showing ${shownBanks.length} Trusted Banks`;

  let htmlStr = '';
  shownBanks.forEach(function (bank) {
    htmlStr += `
      <div class="bank-card">
        <img src="${bank.logo}" class="bank-logo" alt="${bank.name.substring(0, 2)}">
        <div class="bank-details">
          <h4>${bank.name}</h4>
          <p style="font-size:12px;color:#64748b">${bank.cat.toUpperCase()} • ${bank.loc}</p>
        </div>
        <div class="bank-rate-box">
          <span style="font-size:10px;color:#94a3b8;text-transform:uppercase">${rateType} RATE</span>
          <span class="rate-val">${bank.rates[rateType]}</span>
        </div>
        <div class="bank-tags">
          ${bank.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <a href="${bank.link}" class="btn-details">Details</a>
      </div>`;
  });
  document.getElementById('bank-cards-container').innerHTML = htmlStr;
}