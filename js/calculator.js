document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const HOURLY_RATE = 750; // ~120k / month
    const MINUTE_RATE = HOURLY_RATE / 60;

    // Weights calculated to give 1h 50min (110 min) for default values:
    // 12 auctions, 40 messages, 100 documents
    const TIME_WEIGHTS = {
        doc: 0.6,      // 0.6 min per document (100 * 0.6 = 60 min)
        msg: 0.65,     // 0.65 min per message (40 * 0.65 = 26 min)
        auction: 2     // 2 mins per auction (12 * 2 = 24 min)
        // Total: 60 + 26 + 24 = 110 minutes (1h 50min)
    };

    const AI_BASE_TIME = 7; // base minutes for AI processing

    // AI time weights (much smaller than manual - about 1% of manual time)
    const AI_TIME_WEIGHTS = {
        doc: 0.01,      // 0.01 min per document
        msg: 0.01,      // 0.01 min per message
        auction: 0.02  // 0.02 mins per auction
    };

    // AI pricing tiers
    const getAICost = (volume) => {
        switch (volume) {
            case 1: return 390;
            case 10: return 1900;
            case 100: return 16000;
            default: return 390;
        }
    };

    // State
    let currentVolume = 1; // 1, 10, or 100

    // Elements
    const inputs = {
        docs: document.getElementById('range-docs'),
        msgs: document.getElementById('range-msgs'),
        auctions: document.getElementById('range-auctions')
    };

    const displays = {
        docs: document.getElementById('val-docs'),
        msgs: document.getElementById('val-msgs'),
        auctions: document.getElementById('val-auctions')
    };

    const results = {
        manualTimeDisplay: document.getElementById('manual-time-display'),
        manualCostDisplay: document.getElementById('manual-cost-display'),
        aiTimeDisplay: document.getElementById('ai-time-display'),
        aiCostDisplay: document.getElementById('ai-cost-display'),
        savingsTotal: document.getElementById('savings-total'),
        timeSavings: document.getElementById('time-savings'),
        timeSavingsDisplay: document.getElementById('time-savings-display'),
        savingsCostDisplay: document.getElementById('savings-cost-display'),
        volumeLabel: document.getElementById('volume-label')
    };

    const volumeBtns = document.querySelectorAll('.volume-btn');

    // Formatters
    const formatCurrency = (num) => {
        return new Intl.NumberFormat('ru-RU').format(Math.round(num)) + ' ₽';
    };

    const formatTime = (minutes) => {
        const workDayMinutes = 8 * 60; // 480 minutes
        const days = minutes / workDayMinutes;

        if (minutes < 60) {
            return `${Math.round(minutes)} мин`;
        }

        // If >= 8 hours (1 working day), show in days
        if (minutes >= workDayMinutes) {
            const daysFormatted = days.toFixed(1).replace('.', ',');
            return `${daysFormatted} дн`;
        }

        // Less than 8 hours, show in hours
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
    };

    const formatTimeSavings = (minutes) => {
        if (currentVolume === 1) {
            return formatTime(minutes);
        }
        const workDayMinutes = 8 * 60;
        const days = minutes / workDayMinutes;
        if (days < 1) {
            return formatTime(minutes);
        }
        return `${days.toFixed(1).replace('.', ',')} дн`;
    };

    const getVolumeLabel = () => {
        switch (currentVolume) {
            case 1: return 'на 1 дело';
            case 10: return 'на 10 дел';
            case 100: return 'на 100 дел';
            default: return 'на 1 дело';
        }
    };

    // Calculation Logic
    const calculate = () => {
        // Get values
        const docs = parseInt(inputs.docs.value) || 0;
        const msgs = parseInt(inputs.msgs.value) || 0;
        const auctions = parseInt(inputs.auctions.value) || 0;

        // Update displays
        displays.docs.textContent = docs;
        displays.msgs.textContent = msgs;
        displays.auctions.textContent = auctions;

        // Calculate Manual Stats (per case)
        const manualMinutesPerCase = (docs * TIME_WEIGHTS.doc) +
            (msgs * TIME_WEIGHTS.msg) +
            (auctions * TIME_WEIGHTS.auction);

        const manualCostPerCase = manualMinutesPerCase * MINUTE_RATE;

        // Calculate AI Stats (per case) - base time + small increment based on data volume
        const aiMinutesPerCase = AI_BASE_TIME +
            (docs * AI_TIME_WEIGHTS.doc) +
            (msgs * AI_TIME_WEIGHTS.msg) +
            (auctions * AI_TIME_WEIGHTS.auction);

        // Calculate for current volume
        const manualMinutes = manualMinutesPerCase * currentVolume;
        const manualCost = manualCostPerCase * currentVolume;
        const aiMinutes = aiMinutesPerCase * currentVolume;
        const aiCost = getAICost(currentVolume);

        // Calculate Savings
        const totalSavings = manualCost - aiCost;
        const totalTimeSaved = (manualMinutesPerCase - aiMinutesPerCase) * currentVolume;

        // Update UI
        results.manualTimeDisplay.textContent = `≈ ${formatTime(manualMinutes)}`;
        results.manualCostDisplay.textContent = `≈ ${formatCurrency(manualCost)}`;
        results.aiTimeDisplay.textContent = formatTime(aiMinutes);
        results.aiCostDisplay.textContent = formatCurrency(aiCost);

        // Update savings column
        if (results.timeSavingsDisplay) {
            results.timeSavingsDisplay.textContent = `+ ${formatTimeSavings(totalTimeSaved)}`;
        }
        if (results.savingsCostDisplay) {
            results.savingsCostDisplay.textContent = formatCurrency(totalSavings);
        }
        if (results.volumeLabel) {
            results.volumeLabel.textContent = getVolumeLabel();
        }

        // Legacy support for old savings boxes (if they exist)
        if (results.savingsTotal) {
            results.savingsTotal.textContent = formatCurrency(totalSavings);
        }
        if (results.timeSavings) {
            results.timeSavings.textContent = `+ ${formatTimeSavings(totalTimeSaved)}`;
        }

        // Visual feedback for manual card
        const manualCard = document.querySelector('.savings-card.manual');
        if (manualCostPerCase > 5000) {
            manualCard.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        } else {
            manualCard.style.borderColor = 'rgba(239, 68, 68, 0.2)';
        }
    };

    // Volume toggle handlers
    volumeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            volumeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update volume
            currentVolume = parseInt(btn.dataset.volume);

            // Recalculate
            calculate();
        });
    });

    // Add listeners
    Object.values(inputs).forEach(input => {
        if (input) {
            input.addEventListener('input', calculate);
        }
    });

    // Initial calculation
    calculate();
});
