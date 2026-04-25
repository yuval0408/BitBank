// ===== BIT BANK — Main JS =====

// --- LOGIN GATE & AUTH TOGGLE ---
let isLoginMode = false;

function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const submitBtn = document.getElementById('submitAuthBtn');
  const toggleText = document.querySelector('.auth-switch p');
  
  const registerFields = document.getElementById('registerFields');
  const loginOnlyFields = document.getElementById('loginOnlyFields');

  if (isLoginMode) {
    formTitle.textContent = 'Welcome Back';
    formSubtitle.textContent = 'Login to access your secure account.';
    submitBtn.textContent = 'Login';
    toggleText.innerHTML = 'New to BIT BANK? <span id="toggleAuthMode">Create an account</span>';
    
    registerFields.style.display = 'none';
    loginOnlyFields.style.display = 'block';
    
    // Remove required from register fields
    document.querySelectorAll('#registerFields input').forEach(input => input.removeAttribute('required'));
    document.querySelectorAll('#loginOnlyFields input').forEach(input => input.setAttribute('required', 'true'));
  } else {
    formTitle.textContent = 'Create Account';
    formSubtitle.textContent = 'Join BIT BANK to secure your digital legacy.';
    submitBtn.textContent = 'Create Account';
    toggleText.innerHTML = 'Already have an account? <span id="toggleAuthMode">Login here</span>';
    
    registerFields.style.display = 'block';
    loginOnlyFields.style.display = 'none';
    
    // Add required back
    document.querySelectorAll('#registerFields input').forEach(input => input.setAttribute('required', 'true'));
    document.querySelectorAll('#loginOnlyFields input').forEach(input => input.removeAttribute('required'));
  }
  
  // Re-attach listener since we replaced innerHTML of the parent
  document.getElementById('toggleAuthMode')?.addEventListener('click', toggleAuthMode);
}

document.getElementById('toggleAuthMode')?.addEventListener('click', toggleAuthMode);

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  let name = 'User';
  let email = '';
  let contact = '';
  
  if (!isLoginMode) {
    name = document.getElementById('loginName').value;
    email = document.getElementById('loginEmail').value;
    contact = document.getElementById('loginContact').value;
    const aadhar = document.getElementById('loginId').value;
    const pass = document.getElementById('loginPassword').value;
    const confirmPass = document.getElementById('loginConfirmPassword').value;
    
    if (pass !== confirmPass) {
      showToast('Passwords do not match!');
      return;
    }
    
    if(!name || !email || !contact || !aadhar || !pass) {
      showToast('Please fill all fields');
      return;
    }
  } else {
    email = document.getElementById('existingEmail').value;
    const pass = document.getElementById('existingPassword').value;
    
    if(!email || !pass) {
      showToast('Please enter email and password');
      return;
    }
    name = email.split('@')[0]; // Mock name from email
    contact = '+1 000 000 0000'; // Mock contact
  }

  // Success path
  document.getElementById('profileName').textContent = name;
  document.getElementById('profileEmail').textContent = email;
  document.getElementById('profileContact').textContent = contact;
  
  const loginGate = document.getElementById('loginGate');
  
  // Smooth fade out
  loginGate.style.opacity = '0';
  
  // Hide the 3D Bitcoin background
  const coinCanvas = document.getElementById('coinCanvas');
  if (coinCanvas) {
    coinCanvas.style.transition = 'opacity 0.5s ease';
    coinCanvas.style.opacity = '0';
  }

  setTimeout(() => {
    loginGate.style.display = 'none';
    if (coinCanvas) coinCanvas.style.display = 'none';
    document.getElementById('mainAppContainer').style.display = 'block';
    
    // Initialize things that rely on visibility
    setTimeout(() => {
      initReveals();
      const event = new Event('scroll');
      window.dispatchEvent(event);
    }, 100);
    
    showToast(isLoginMode ? 'Login Successful!' : 'Account Created Successfully!');
  }, 500); // Wait for CSS transition
});

// --- NAVIGATION ---
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// --- PAGE ROUTING ---
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    link.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navLinks.classList.remove('open');
    setTimeout(initReveals, 100);
    if (page === 'transaction') renderTransactions('all');
  });
});

// --- SCROLL REVEAL ---
function initReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}
initReveals();

// --- STAT COUNTERS ---
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const isMoney = target === 2.5;
      const isPercent = target === 99.9;
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        if (isMoney) el.textContent = '$' + current.toFixed(1) + 'B+';
        else if (isPercent) el.textContent = current.toFixed(1) + '%';
        else el.textContent = Math.floor(current).toLocaleString() + '+';
      }, 25);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// --- TRANSACTION DATA ---
const transactions = [
  { type: 'sent', icon: '↑', name: 'Rahul Sharma', desc: 'Payment for dinner', amount: -0.0015, currency: 'BTC', status: 'success', time: 'Today, 7:42 PM' },
  { type: 'received', icon: '↓', name: 'Priya Mehta', desc: 'Freelance payment', amount: 1.2, currency: 'ETH', status: 'success', time: 'Today, 3:15 PM' },
  { type: 'sent', icon: '↑', name: 'Server Hosting', desc: 'Online purchase', amount: -0.5, currency: 'SOL', status: 'success', time: 'Today, 11:30 AM' },
  { type: 'failed', icon: '✕', name: 'Vikram Singh', desc: 'Insufficient balance — Retry available', amount: -0.05, currency: 'BTC', status: 'failed', time: 'Yesterday, 9:22 PM' },
  { type: 'swap', icon: '⇄', name: 'BTC → SOL', desc: 'Converted 0.005 BTC', amount: 0, currency: '', status: 'success', time: 'Yesterday, 6:10 PM', swapVal: '0.005 BTC → 15 SOL' },
  { type: 'received', icon: '↓', name: 'Ankit Patel', desc: 'Rent share', amount: 3.5, currency: 'ETH', status: 'success', time: 'Apr 20, 10:00 AM' },
  { type: 'sent', icon: '↑', name: 'Software License', desc: 'Monthly subscription', amount: -0.1, currency: 'SOL', status: 'success', time: 'Apr 19, 12:00 AM' },
  { type: 'received', icon: '↓', name: 'Salary Credit', desc: 'April 2026 salary', amount: 0.15, currency: 'BTC', status: 'success', time: 'Apr 18, 9:00 AM' },
  { type: 'sent', icon: '↑', name: 'Meena Kapoor', desc: 'Birthday gift', amount: -2.0, currency: 'SOL', status: 'pending', time: 'Apr 17, 5:30 PM' },
  { type: 'failed', icon: '✕', name: 'Hardware Wallet Store', desc: 'Compliance check failed — Contact support', amount: -0.8, currency: 'ETH', status: 'failed', time: 'Apr 16, 2:15 PM' },
];

function renderTransactions(filter) {
  const list = document.getElementById('txnList');
  if (!list) return;
  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
  list.innerHTML = filtered.map(t => `
    <div class="txn-item">
      <div class="txn-icon ${t.type}">${t.icon}</div>
      <div class="txn-info">
        <strong>${t.name}</strong>
        <small>${t.desc}</small>
      </div>
      <span class="txn-status ${t.status}">${t.status}</span>
      <div class="txn-amount ${t.amount < 0 ? 'negative' : t.amount > 0 ? 'positive' : ''}">
        <strong>${t.type === 'swap' ? t.swapVal : (t.amount > 0 ? '+' : '') + Math.abs(t.amount) + ' ' + t.currency}</strong>
        <small>${t.time}</small>
      </div>
    </div>
  `).join('');
}
renderTransactions('all');

document.getElementById('txnFilter')?.addEventListener('change', (e) => {
  renderTransactions(e.target.value);
});

// --- SEND BITCOINS ---
document.getElementById('sendBtn')?.addEventListener('click', () => {
  const rec = document.getElementById('recipientInput').value;
  const amt = parseFloat(document.getElementById('amountInput').value);
  const note = document.getElementById('noteInput').value;
  if (!rec || isNaN(amt) || amt <= 0) { showToast('Please fill in a valid recipient and amount'); return; }
  if (amt > btcBalance) { showToast('Insufficient balance!'); return; }
  
  btcBalance -= amt;
  updateBalanceDisplay();
  
  transactions.unshift({
    type: 'sent',
    icon: '↑',
    name: rec,
    desc: note || 'Sent via Bit Bank',
    amount: -amt,
    currency: 'BTC',
    status: 'success',
    time: 'Just now'
  });
  renderTransactions('all');
  
  showToast(`${amt} BTC sent to ${rec} ✓`);
  document.getElementById('recipientInput').value = '';
  document.getElementById('amountInput').value = '';
  document.getElementById('noteInput').value = '';
});

// --- DEPOSIT CRYPTO ---
document.getElementById('depositBtn')?.addEventListener('click', () => {
  const currency = document.getElementById('depositCurrency').value;
  const amt = parseFloat(document.getElementById('depositAmount').value);
  const address = document.getElementById('depositAddress').value;
  if (!address || isNaN(amt) || amt <= 0) { showToast('Please fill in a valid address and amount'); return; }
  
  if (currency === 'BTC') {
    btcBalance += amt;
    updateBalanceDisplay();
  }
  
  transactions.unshift({
    type: 'received',
    icon: '↓',
    name: 'Deposit',
    desc: `Deposited from ${address.substring(0, 8)}...`,
    amount: amt,
    currency: currency,
    status: 'success',
    time: 'Just now'
  });
  renderTransactions('all');
  
  showToast(`${amt} ${currency} deposit initiated ✓`);
  document.getElementById('depositAmount').value = '';
  document.getElementById('depositAddress').value = '';
});

// --- WITHDRAW CRYPTO ---
document.getElementById('withdrawBtn')?.addEventListener('click', () => {
  const currency = document.getElementById('withdrawCurrency').value;
  const address = document.getElementById('withdrawAddress').value;
  const amt = parseFloat(document.getElementById('withdrawAmount').value);
  if (!address || isNaN(amt) || amt <= 0) { showToast('Please fill in a valid address and amount'); return; }
  
  if (currency === 'BTC') {
    if (amt > btcBalance) { showToast('Insufficient BTC balance!'); return; }
    btcBalance -= amt;
    updateBalanceDisplay();
  }
  
  transactions.unshift({
    type: 'sent',
    icon: '↑',
    name: 'Withdrawal',
    desc: `Withdrawn to ${address.substring(0, 8)}...`,
    amount: -amt,
    currency: currency,
    status: 'success',
    time: 'Just now'
  });
  renderTransactions('all');
  
  showToast(`${amt} ${currency} withdrawal to ${address} initiated ✓`);
  document.getElementById('withdrawAddress').value = '';
  document.getElementById('withdrawAmount').value = '';
});

// --- GLOBAL BALANCE STATE ---
let btcBalance = 2.5;

function updateBalanceDisplay() {
  const balanceEl = document.getElementById('balanceAmount');
  const btcEl = document.getElementById('btcBalance');
  if (balanceEl) balanceEl.textContent = btcBalance.toFixed(2) + ' BTC';
  if (btcEl) btcEl.textContent = btcBalance.toFixed(2) + ' BTC';
}

// --- INHERITE STEPS ---
window.nextStep = function(n) {
  document.querySelectorAll('.step-card').forEach(c => c.classList.remove('active'));
  const step = document.getElementById('step' + n);
  if (step) {
    step.classList.add('active');
    step.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (n === 3) {
    document.getElementById('revName').textContent = document.getElementById('claimantName')?.value || '—';
    document.getElementById('revAadhaar').textContent = document.getElementById('claimantAadhaar')?.value || '—';
    document.getElementById('revDeceased').textContent = document.getElementById('deceasedName')?.value || '—';
    document.getElementById('revRelation').textContent = document.getElementById('relationship')?.value || '—';

  }
};

window.submitClaim = function() {
  const consent = document.getElementById('consent');
  if (!consent.checked) { showToast('Please agree to the declaration'); return; }
  
  const amount = 500;
  const statusAmount = document.getElementById('statusAmount');
  if (statusAmount) statusAmount.textContent = amount + ' BTC';
  
  showToast('Inheritance claim submitted! Verifying... 🔐');
  setTimeout(() => window.nextStep(4), 600);
  
  // Simulate verification process (3 seconds) then credit the BTC
  const statusCard = document.getElementById('statusCard');
  
  // After 3s: mark Identity Verification as done
  setTimeout(() => {
    const tlItems = statusCard?.querySelectorAll('.tl-item');
    if (tlItems && tlItems[1]) {
      tlItems[1].classList.remove('active');
      tlItems[1].classList.add('done');
      tlItems[1].querySelector('small').textContent = 'Verified ✓';
      tlItems[2].classList.add('active');
      tlItems[2].querySelector('small').textContent = 'In progress...';
    }
    showToast('Identity & Relationship verified ✓');
  }, 3000);
  
  // After 5s: mark Document Review as done
  setTimeout(() => {
    const tlItems = statusCard?.querySelectorAll('.tl-item');
    if (tlItems && tlItems[2]) {
      tlItems[2].classList.remove('active');
      tlItems[2].classList.add('done');
      tlItems[2].querySelector('small').textContent = 'Approved ✓';
      tlItems[3].classList.add('active');
      tlItems[3].querySelector('small').textContent = 'Transferring...';
    }
    showToast('Documents approved ✓');
  }, 5000);
  
  // After 7s: Complete the transfer — credit BTC to balance
  setTimeout(() => {
    const tlItems = statusCard?.querySelectorAll('.tl-item');
    if (tlItems && tlItems[3]) {
      tlItems[3].classList.remove('active');
      tlItems[3].classList.add('done');
      tlItems[3].querySelector('small').textContent = 'Completed ✓';
    }
    
    // Update the status card to show success
    const statusIcon = statusCard?.querySelector('.status-icon');
    if (statusIcon) {
      statusIcon.textContent = '✅';
      statusIcon.classList.remove('pending');
      statusIcon.classList.add('done');
    }
    const statusTitle = statusCard?.querySelector('h3');
    if (statusTitle) statusTitle.textContent = 'Inheritance Complete!';
    const statusDesc = statusCard?.querySelector('p');
    if (statusDesc) statusDesc.innerHTML = '<strong>' + amount + ' BTC</strong> has been successfully transferred to your vault. Your balance has been updated.';
    
    // Credit the BTC to the user's balance
    btcBalance += amount;
    updateBalanceDisplay();
    
    // Update balance change text
    const balanceChange = document.getElementById('balanceChange');
    if (balanceChange) balanceChange.textContent = '+' + amount + ' BTC from inheritance';
    
    // Add inheritance transaction to the list
    const deceasedName = document.getElementById('deceasedName')?.value || 'Unknown';
    const relationship = document.getElementById('relationship')?.value || 'Relation';
    transactions.unshift({
      type: 'received',
      icon: '↓',
      name: 'Inheritance from ' + deceasedName,
      desc: 'Inherite claim (' + relationship + ') — Verified & Approved',
      amount: amount,
      currency: 'BTC',
      status: 'success',
      time: 'Just now'
    });
    renderTransactions('all');
    
    showToast('🎉 ' + amount + ' BTC deposited to your vault!');
  }, 7000);
};

// File upload visual feedback
document.querySelectorAll('.upload-area').forEach(area => {
  const input = area.querySelector('.file-input');
  if (input) {
    input.addEventListener('change', () => {
      if (input.files.length > 0) {
        area.classList.add('uploaded');
        area.querySelector('p').innerHTML = `<strong>${input.files[0].name}</strong>`;
      }
    });
  }
});

// --- TOAST ---
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- Remove default Vite content ---
document.getElementById('app')?.remove();
