/* ==========================================================================
   BANTEK INTERIOR - COST ESTIMATOR JAVASCRIPT
   Dynamic Interior Budget Calculator with WhatsApp Handoff
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCostEstimator();
});

function initCostEstimator() {
  const estimatorForm = document.getElementById('interiorEstimatorForm');
  if (!estimatorForm) return;

  const areaSlider = document.getElementById('areaSlider');
  const areaValueDisplay = document.getElementById('areaValue');
  const priceDisplay = document.getElementById('estimatedPriceDisplay');
  const bWoodwork = document.getElementById('breakdownWoodwork');
  const bCeiling = document.getElementById('breakdownCeiling');
  const bFittings = document.getElementById('breakdownFittings');
  const bFinishing = document.getElementById('breakdownFinishing');
  const waEstimateBtn = document.getElementById('waEstimateBtn');

  const bhkInputs = document.querySelectorAll('input[name="bhkType"]');
  const scopeInputs = document.querySelectorAll('input[name="scopeType"]');
  const tierInputs = document.querySelectorAll('input[name="finishTier"]');
  const quickAreaBtns = document.querySelectorAll('.quick-area-btn');

  // Suggested default area by BHK
  const defaultAreaMap = {
    '1bhk': 650,
    '2bhk': 1050,
    '3bhk': 1550,
    '4bhk': 2400,
    'commercial': 1200
  };

  function updateEstimate() {
    // Selected values
    const selectedBhk = document.querySelector('input[name="bhkType"]:checked')?.value || '2bhk';
    const area = parseInt(areaSlider ? areaSlider.value : 1050, 10);
    const selectedScope = document.querySelector('input[name="scopeType"]:checked')?.value || 'full';
    const selectedTier = document.querySelector('input[name="finishTier"]:checked')?.value || 'premium';

    // Base rate per sq ft based on scope
    let baseRatePerSqFt = 1200; // full turnkey default
    if (selectedScope === 'kitchen') baseRatePerSqFt = 450;
    if (selectedScope === 'living') baseRatePerSqFt = 550;
    if (selectedScope === 'wardrobe') baseRatePerSqFt = 600;

    // Tier Multiplier
    let tierMultiplier = 1.0;
    let tierName = 'Essential Elegance';
    if (selectedTier === 'premium') {
      tierMultiplier = 1.45;
      tierName = 'Premium Luxury';
    } else if (selectedTier === 'bespoke') {
      tierMultiplier = 1.95;
      tierName = 'Ultra Bespoke';
    }

    // Calculation
    const totalCost = Math.round(area * baseRatePerSqFt * tierMultiplier);
    const minRange = Math.round(totalCost * 0.95);
    const maxRange = Math.round(totalCost * 1.15);

    // Format in Lakhs
    const formatLakhs = (amt) => {
      const inLakhs = (amt / 100000).toFixed(1);
      return `₹${inLakhs} Lakhs`;
    };

    const priceString = `${formatLakhs(minRange)} - ${formatLakhs(maxRange)}`;
    if (priceDisplay) priceDisplay.innerText = priceString;

    // Update breakdown portions
    if (bWoodwork) bWoodwork.innerText = formatLakhs(totalCost * 0.50);
    if (bCeiling) bCeiling.innerText = formatLakhs(totalCost * 0.18);
    if (bFittings) bFittings.innerText = formatLakhs(totalCost * 0.17);
    if (bFinishing) bFinishing.innerText = formatLakhs(totalCost * 0.15);

    // Update WhatsApp link
    if (waEstimateBtn) {
      const bhkLabel = selectedBhk.toUpperCase();
      let scopeLabel = 'Full Home Turnkey';
      if (selectedScope === 'kitchen') scopeLabel = 'Modular Kitchen';
      if (selectedScope === 'living') scopeLabel = 'Living & Dining';
      if (selectedScope === 'wardrobe') scopeLabel = 'Wardrobes & Woodwork';

      const message = `Hello Bantek Interior team, I calculated an estimate on your website for my ${bhkLabel} (${area} sq.ft, ${scopeLabel}, ${tierName} tier: approx ${priceString}). I would like to schedule a free site consultation in Ranchi.`;
      waEstimateBtn.href = `https://wa.me/919570510050?text=${encodeURIComponent(message)}`;
    }
  }

  // Slider Event Listener
  if (areaSlider) {
    areaSlider.addEventListener('input', (e) => {
      if (areaValueDisplay) areaValueDisplay.innerText = `${e.target.value} sq.ft`;
      updateEstimate();
    });
  }

  // Quick Area Buttons
  quickAreaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = parseInt(btn.getAttribute('data-area'), 10);
      if (val && areaSlider) {
        areaSlider.value = val;
        if (areaValueDisplay) areaValueDisplay.innerText = `${val} sq.ft`;
        updateEstimate();
      }
    });
  });

  // BHK Option Listeners
  bhkInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const autoArea = defaultAreaMap[e.target.value];
      if (autoArea && areaSlider) {
        areaSlider.value = autoArea;
        if (areaValueDisplay) areaValueDisplay.innerText = `${autoArea} sq.ft`;
      }
      updateEstimate();
    });
  });

  scopeInputs.forEach(input => input.addEventListener('change', updateEstimate));
  tierInputs.forEach(input => input.addEventListener('change', updateEstimate));

  // Initialize calculation on load
  updateEstimate();
}
