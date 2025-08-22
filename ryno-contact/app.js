// TerraHash Stack Application JavaScript

// Application data
const appData = {
  companyInfo: {
    partner: "Ryno",
    developer: "HashGrid Networks",
    product: "TerraHash Stack",
    phone: "1-800-RYNO-MINE",
    email: "terrahash@ryno.com",
    website: "ryno.com/terrahash"
  },
  savings: {
    energyCostReduction: 0.5,
    coolingCostReduction: 0.4,
    hashRateIncrease: 0.33,
    hardwareLifeExtension: 0.3
  },
  miningMetrics: {
    btcPrice: 110000,
    networkDifficulty: 129000000000000,
    blockReward: 3.125,
    poolFee: 0.02
  }
};

// DOM Elements
let investmentSlider, electricitySlider, unitsSlider, coolingSelect;
let investmentValue, electricityValue, unitsValue;
let monthlyRevenue, energySavings, coolingSavings, monthlyProfit, roiTimeline, fiveYearProfit;
let contactForm, successModal, modalClose;

// Initialize DOM elements
function initializeDOMElements() {
  investmentSlider = document.getElementById('investment');
  electricitySlider = document.getElementById('electricity');
  unitsSlider = document.getElementById('units');
  coolingSelect = document.getElementById('cooling');

  investmentValue = document.getElementById('investment-value');
  electricityValue = document.getElementById('electricity-value');
  unitsValue = document.getElementById('units-value');

  monthlyRevenue = document.getElementById('monthly-revenue');
  energySavings = document.getElementById('energy-savings');
  coolingSavings = document.getElementById('cooling-savings');
  monthlyProfit = document.getElementById('monthly-profit');
  roiTimeline = document.getElementById('roi-timeline');
  fiveYearProfit = document.getElementById('five-year-profit');

  contactForm = document.getElementById('contact-form');
  successModal = document.getElementById('success-modal');
  modalClose = document.getElementById('modal-close');
}

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

// Mining Calculation Functions
function calculateHashRate(investment, units) {
  // Base hash rate per unit based on investment level
  const baseHashRatePerUnit = Math.max(0.5, investment / (units * 100000)); // PH/s per unit
  const totalHashRate = baseHashRatePerUnit * units;
  
  // Apply TerraHash improvement
  return totalHashRate * (1 + appData.savings.hashRateIncrease);
}

function calculateDailyRevenue(hashRate) {
  // Bitcoin mining revenue calculation
  const { btcPrice, networkDifficulty, blockReward, poolFee } = appData.miningMetrics;
  
  // Convert PH/s to H/s
  const hashRateHs = hashRate * 1e15;
  
  // Daily BTC mined = (hashRate / networkDifficulty) * blocksPerDay * blockReward
  const blocksPerDay = 144; // ~6 blocks per hour * 24 hours
  const dailyBtc = (hashRateHs / networkDifficulty) * blocksPerDay * blockReward;
  
  // Apply pool fee
  const dailyBtcAfterFee = dailyBtc * (1 - poolFee);
  
  // Convert to USD
  return dailyBtcAfterFee * btcPrice;
}

function calculateEnergyCosts(hashRate, electricityCost) {
  // Estimate power consumption: ~100W per TH/s for modern miners
  const powerConsumptionKw = (hashRate * 1000) * 0.1; // kW
  const dailyEnergyKwh = powerConsumptionKw * 24;
  const traditionalDailyCost = dailyEnergyKwh * electricityCost;
  
  // TerraHash reduces energy costs by 50%
  const terraHashDailyCost = traditionalDailyCost * (1 - appData.savings.energyCostReduction);
  
  return {
    traditional: traditionalDailyCost,
    terraHash: terraHashDailyCost,
    savings: traditionalDailyCost - terraHashDailyCost
  };
}

function calculateCoolingCosts(hashRate, coolingMethod) {
  // Base cooling cost estimation
  let baseCoolingCostPerTh = 0;
  
  switch(coolingMethod) {
    case 'air':
      baseCoolingCostPerTh = 0.02; // $0.02 per TH/s per day
      break;
    case 'basic-liquid':
      baseCoolingCostPerTh = 0.015; // $0.015 per TH/s per day
      break;
    default:
      baseCoolingCostPerTh = 0.025; // $0.025 per TH/s per day (no cooling = overheating)
  }
  
  const traditionalDailyCost = (hashRate * 1000) * baseCoolingCostPerTh;
  const terraHashDailyCost = traditionalDailyCost * (1 - appData.savings.coolingCostReduction);
  
  return {
    traditional: traditionalDailyCost,
    terraHash: terraHashDailyCost,
    savings: traditionalDailyCost - terraHashDailyCost
  };
}

function updateCalculations() {
  if (!investmentSlider || !electricitySlider || !unitsSlider || !coolingSelect) {
    return; // Elements not ready yet
  }

  const investment = parseFloat(investmentSlider.value);
  const electricityCost = parseFloat(electricitySlider.value);
  const units = parseInt(unitsSlider.value);
  const coolingMethod = coolingSelect.value;

  // Update slider displays
  if (investmentValue) investmentValue.textContent = formatCurrency(investment);
  if (electricityValue) electricityValue.textContent = `$${electricityCost.toFixed(3)}`;
  if (unitsValue) unitsValue.textContent = formatNumber(units);

  // Calculate mining metrics
  const hashRate = calculateHashRate(investment, units);
  const dailyRevenue = calculateDailyRevenue(hashRate);
  const energyCosts = calculateEnergyCosts(hashRate, electricityCost);
  const coolingCosts = calculateCoolingCosts(hashRate, coolingMethod);

  // Monthly calculations
  const monthlyRev = dailyRevenue * 30;
  const monthlyEnergySavings = energyCosts.savings * 30;
  const monthlyCoolingSavings = coolingCosts.savings * 30;
  const monthlyOperatingCosts = (energyCosts.terraHash + coolingCosts.terraHash) * 30;
  const monthlyNetProfit = monthlyRev - monthlyOperatingCosts;

  // ROI calculation
  const roiMonths = monthlyNetProfit > 0 ? Math.ceil(investment / monthlyNetProfit) : 0;
  const fiveYearTotal = monthlyNetProfit * 60 - investment; // 5 years minus initial investment

  // Update display
  if (monthlyRevenue) monthlyRevenue.textContent = formatCurrency(monthlyRev);
  if (energySavings) energySavings.textContent = formatCurrency(monthlyEnergySavings);
  if (coolingSavings) coolingSavings.textContent = formatCurrency(monthlyCoolingSavings);
  if (monthlyProfit) monthlyProfit.textContent = formatCurrency(monthlyNetProfit);
  if (roiTimeline) roiTimeline.textContent = roiMonths > 0 ? `${roiMonths} months` : 'N/A';
  if (fiveYearProfit) fiveYearProfit.textContent = formatCurrency(Math.max(0, fiveYearTotal));
}

// Performance optimization: Debounce slider updates
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to slider updates for better performance
const debouncedUpdate = debounce(updateCalculations, 100);

// Slider initialization
function initializeSliders() {
  if (!investmentSlider || !electricitySlider || !unitsSlider || !coolingSelect) {
    return;
  }

  // Add event listeners for sliders
  investmentSlider.addEventListener('input', debouncedUpdate);
  electricitySlider.addEventListener('input', debouncedUpdate);
  unitsSlider.addEventListener('input', debouncedUpdate);
  
  // Add event listener for cooling select
  coolingSelect.addEventListener('change', updateCalculations);
  
  console.log('Sliders initialized successfully');
}

// Tab Functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  if (tabButtons.length === 0 || tabPanes.length === 0) {
    return;
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      // Add active class to clicked button and corresponding pane
      button.classList.add('active');
      const targetPane = document.getElementById(targetTab);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
  
  console.log('Tabs initialized successfully');
}

// Form Handling - Fixed version
function initializeForm() {
  // Wait for elements to be available
  setTimeout(() => {
    const form = document.getElementById('contact-form');
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const operationSizeField = document.getElementById('operation-size');
    const interestLevelField = document.getElementById('interest-level');
    const messageField = document.getElementById('message');

    if (!form) {
      console.error('Contact form not found');
      return;
    }

    // Ensure dropdowns are properly initialized
    if (operationSizeField) {
      operationSizeField.style.pointerEvents = 'auto';
      operationSizeField.style.cursor = 'pointer';
    }
    
    if (interestLevelField) {
      interestLevelField.style.pointerEvents = 'auto';
      interestLevelField.style.cursor = 'pointer';
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Form submission started');
      
      // Get form data with null checks
      const name = nameField ? nameField.value.trim() : '';
      const email = emailField ? emailField.value.trim() : '';
      const phone = phoneField ? phoneField.value.trim() : '';
      const operationSize = operationSizeField ? operationSizeField.value : '';
      const interestLevel = interestLevelField ? interestLevelField.value : '';
      const message = messageField ? messageField.value.trim() : '';
      
      // Basic validation
      if (!name || !email) {
        alert('Please fill in all required fields (Name and Email).');
        return false;
      }
      
      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
      }
      
      // Log form data (simulate form submission)
      console.log('Form submitted with data:', {
        name: name,
        email: email,
        phone: phone,
        operationSize: operationSize,
        interestLevel: interestLevel,
        message: message,
        timestamp: new Date().toISOString()
      });
      
      // Show success modal
      showModal();
      
      // Reset form
      form.reset();
      
      return false;
    });
    
    console.log('Form initialized successfully');
  }, 500);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Modal Functions - Enhanced version
function showModal() {
  const modal = document.getElementById('success-modal');
  
  if (!modal) {
    console.error('Success modal not found');
    return;
  }
  
  console.log('Showing success modal');
  
  // Remove hidden class and add show class
  modal.classList.remove('hidden');
  modal.classList.add('show');
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Focus management
  modal.setAttribute('aria-hidden', 'false');
}

function hideModal() {
  const modal = document.getElementById('success-modal');
  
  if (!modal) {
    return;
  }
  
  console.log('Hiding modal');
  
  // Add hidden class and remove show class
  modal.classList.add('hidden');
  modal.classList.remove('show');
  
  // Restore body scrolling
  document.body.style.overflow = 'auto';
  
  // Focus management
  modal.setAttribute('aria-hidden', 'true');
}

function initializeModal() {
  // Wait for modal to be available
  setTimeout(() => {
    const modal = document.getElementById('success-modal');
    const closeButton = document.getElementById('modal-close');

    if (!modal) {
      console.error('Modal elements not found');
      return;
    }

    // Set initial state
    modal.setAttribute('aria-hidden', 'true');

    // Close button click
    if (closeButton) {
      closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        hideModal();
      });
    }
    
    // Click outside modal to close
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        hideModal();
      }
    });
    
    // Escape key to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        hideModal();
      }
    });
    
    console.log('Modal initialized successfully');
  }, 500);
}

// Smooth Scrolling for Navigation
function initializeSmoothScrolling() {
  const navLinks = document.querySelectorAll('.header__nav-link, .btn[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerElement = document.querySelector('.header');
          const headerHeight = headerElement ? headerElement.offsetHeight : 0;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  console.log('Smooth scrolling initialized successfully');
}

// Scroll Animation (Simple fade-in on scroll)
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Add animation styles to sections
  const sections = document.querySelectorAll('section:not(.hero)');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
  
  console.log('Scroll animations initialized successfully');
}

// Initialize Application
function initializeApp() {
  console.log('Initializing TerraHash Stack application...');
  
  // Initialize DOM elements first
  initializeDOMElements();
  
  // Initialize all components with proper timing
  initializeSliders();
  initializeTabs();
  initializeForm();
  initializeModal();
  initializeSmoothScrolling();
  initializeScrollAnimations();
  
  // Initial calculations
  setTimeout(updateCalculations, 200);
  
  // Add loading animation completion
  document.body.style.opacity = '1';
  
  console.log('Application initialized successfully');
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting initialization...');
  
  // Add loading transition
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  
  // Initialize app after a short delay to ensure all elements are ready
  setTimeout(initializeApp, 100);
});

// Additional error handling
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
});

// Export functions for debugging (if needed)
window.TerraHashApp = {
  updateCalculations,
  showModal,
  hideModal,
  formatCurrency,
  appData
};