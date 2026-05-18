
const isLoggedIn = localStorage.getItem("finscoutLoggedIn");

if (isLoggedIn !== "true") {
    window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', () => {
    const bestBankCard = document.getElementById('best-bank-card');
    const comparisonList = document.getElementById('comparison-list');
    
    const amtInput = document.getElementById('amount-input');
    const tenureInput = document.getElementById('tenure-input');
    
    // Type Toggles
    const typePills = document.querySelectorAll('.asset-tab');

    const banksData = [
        { name: 'State Bank of India', code: 'SBI', type: 'Public', baseRisk: 1.0, fd: 6.95, rd: 7.25, mf: 12.0,  url: 'sbi.html', color: '#1E3A8A', logo: 'imgsl.jpeg' },
        { name: 'HDFC Bank', code: 'HDFC', type: 'Private', baseRisk: 1.5, fd: 6.60, rd: 7.10, mf: 14.5, url: 'hdfc.html', color: '#991B1B', logo: 'imghdfc.jpeg' },
        { name: 'ICICI Bank', code: 'ICICI', type: 'Private', baseRisk: 1.5, fd: 6.50, rd: 7.00, mf: 13.80,  url: 'icici.html', color: '#7F1D1D', logo: 'imgicici.jpeg' },
        { name: 'Axis Bank', code: 'AXIS', type: 'Private', baseRisk: 2.0, fd: 7.20, rd: 7.15, mf: 13.5,  url: 'axis.html', color: '#831843', logo: 'imgaxl.jpeg' },
        { name: 'Punjab National Bank', code: 'PNB', type: 'Public', baseRisk: 1.2, fd: 6.50, rd: 7.05, mf: 11.5,  url: 'pnb.html', color: '#7A1F2B', logo: 'pnblogo.jpeg' },
        { name: 'Canara Bank', code: 'CANARA', type: 'Public', baseRisk: 1.2, fd: 6.75, rd: 7.10, mf: 12.5,url: 'canara.html', color: '#0369A1', logo: 'imgcl.jpeg' }
    ];

    const assetRisk = {
        'fd': 1.0, 
        'rd': 1.0,
        'mf': 4.0 
    };

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    const amountLabel = document.getElementById('amount-label');

    const calculateMaturity = (principal, tenureYears, rate, type) => {
        if (!principal || !tenureYears) return 0;
        const r = rate / 100;
        
        switch (type) {
            case 'fd': return Math.round(principal * Math.pow(1 + r/4, 4 * tenureYears));
            case 'rd':
                const nLimit = tenureYears * 12;
                const p_month = principal; // Input is treated as monthly deposit for RD
                const r_m = r / 12;
                const maturity_rd = p_month * ((Math.pow(1 + r_m, nLimit) - 1) / r_m) * (1 + r_m);
                return Math.round(maturity_rd);
            case 'mf':
                return Math.round(principal * Math.pow(1 + r, tenureYears));
            default:
                return principal;
        }
    };

    const updateDashboard = () => {
        const amount = parseInt(amtInput.value) || 0;
        const tenure = parseInt(tenureInput.value) || 0;
        
        const typeEl = document.querySelector('input[name="inv-type"]:checked');
        if (!typeEl) return;
        const invType = typeEl.value;

        // Dynamically update the input label based on asset type
        if (amountLabel) {
            if (invType === 'rd') amountLabel.textContent = 'Monthly Deposit (₹)';
            
            else amountLabel.textContent = 'Investment Amount (₹)';
        }

        if(amount <= 0 || tenure <= 0) {
           bestBankCard.innerHTML = `<div style="text-align:center; padding:20px; color:#64748B;">Please type a valid amount and tenure.</div>`;
           comparisonList.innerHTML = '';
           return;
        }

        let results = banksData.map(bank => {
            const rate = bank[invType] || 0; 
            const maturity = calculateMaturity(amount, tenure, rate, invType);
            
            // Total principal invested is tracking periodic contributions
            let totalInvested = amount;
            if (invType === 'rd') totalInvested = amount * (tenure * 12);
            
            
            const wealthGain = Math.max(0, maturity - totalInvested);
            
            const absoluteRisk = bank.baseRisk * assetRisk[invType];
            
            return { ...bank, currentRate: rate, maturity, wealthGain, absoluteRisk };
        });

        const maxMaturity = Math.max(...results.map(r => r.maturity));
        const minMaturity = Math.min(...results.map(r => r.maturity));
        
        const minRisk = Math.min(...results.map(r => r.absoluteRisk));
        const maxRisk = Math.max(...results.map(r => r.absoluteRisk));

        results.forEach(r => {
            const returnScore = maxMaturity === minMaturity ? 100 : ((r.maturity - minMaturity) / (maxMaturity - minMaturity)) * 100;
            const riskScore = maxRisk === minRisk ? 100 : 100 - (((r.absoluteRisk - minRisk) / (maxRisk - minRisk)) * 100);
            r.finScore = (returnScore * 0.6) + (riskScore * 0.4);
        });

        results.sort((a, b) => b.finScore - a.finScore);

        const bestBank = results[0];
        const otherBanks = results.slice(1);

        bestBankCard.innerHTML = `
            <div class="winner-card">
                <div class="winner-top">
            <div class="winner-info">
                <h2>${bestBank.name}</h2>
                <p>Best based on highest returns and lowest risk for ${invType.toUpperCase()}</p>
            </div>
                    <div class="bank-logo">
                        <img src="${bestBank.logo}" alt="${bestBank.code} Logo">
                    </div>
                </div>
                
                <div class="winner-score-row">
                    <div class="risk-label">Risk + Return Score</div>
                    <div class="score-badge">🏆 ${bestBank.finScore.toFixed(1)} / 100</div>
                </div>

                <div class="winner-metrics">
                    <div class="w-metric">
                        <h5>A.P.Y. Rate</h5>
                        <div class="val">${bestBank.currentRate.toFixed(2)}%</div>
                    </div>
                    <div class="w-metric">
                        <h5>Est. Profit</h5>
                        <div class="val success">+${formatCurrency(bestBank.wealthGain)}</div>
                    </div>
                    <div class="w-metric">
                        <h5>Total Value</h5>
                        <div class="val">${formatCurrency(bestBank.maturity)}</div>
                    </div>
                </div>
                <div class="winner-action">
                    <a href="${bestBank.url}" class="btn-invest">Proceed with ${bestBank.code} ➔</a>
                </div>
            </div>
        `;

        comparisonList.innerHTML = otherBanks.map((bank, index) => `
            <a href="${bank.url}" class="comp-card" style="--delay: ${index + 1};">
                <div class="comp-header">
                    <div class="comp-logo">
                        <img src="${bank.logo}" alt="${bank.code} Logo">
                    </div>
                    <div>
                        <h4 class="comp-name">${bank.name}</h4>
                        <div class="score-indicator">Score: ${bank.finScore.toFixed(1)}</div>
                    </div>
                </div>
                
                <div class="comp-stats">
                    <div class="stat-box">
                        <h6>Interest Rate</h6>
                        <div class="val">${bank.currentRate.toFixed(2)}%</div>
                    </div>
                    <div class="stat-box" style="text-align: right;">
                        <h6>Maturity Total</h6>
                        <div class="val" style="color: #10B981;">${formatCurrency(bank.maturity)}</div>
                    </div>
                </div>
            </a>
        `).join('');
    };

    // Binding specifically explicitly to manual typed inputs, slider logic safely removed.
    amtInput.addEventListener('input', updateDashboard);
    tenureInput.addEventListener('input', updateDashboard);

    typePills.forEach(pill => {
        pill.addEventListener('click', () => {
            typePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            setTimeout(() => updateDashboard(), 0);
        });
    });

    updateDashboard();
});
