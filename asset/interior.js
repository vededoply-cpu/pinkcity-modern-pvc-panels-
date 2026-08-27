/* ==========================================================================
   BLUETEC PLAST - INTERACTIVE JAVASCRIPT LOGIC
   Handles Video Controls, Product Filtering, Lightbox, & Inquiry System
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Active Page Navigation Link Highlight ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- 1. Sticky Navigation & Scroll Header ---
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Mobile Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-links');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });
  }

  // --- 3. Hero Video End Transition to Image & CTA Reveal ---
  const heroVideo = document.getElementById('heroVideo');
  const heroSlideBg = document.getElementById('heroSlideBg');
  const heroBgImg = document.getElementById('heroBgImg');
  const heroReveal = document.getElementById('heroReveal');

  if (heroVideo) {
    heroVideo.play().catch(err => {
      console.log('Video autoplay prevented by browser policy:', err);
    });

    let transitionTriggered = false;

    const triggerSeamlessTransition = () => {
      if (!transitionTriggered) {
        transitionTriggered = true;
        // Slide in background image smoothly over video
        if (heroSlideBg) heroSlideBg.classList.add('active');
        // Fade in CTA button & scroll indicator
        if (heroReveal) heroReveal.classList.add('visible');

        // Rotate through hero page folder images every 6.5s so hero section stays dynamic & alive
        const heroImages = [
          'hero page/1.jpg',
          'hero page/3.jpg',
          'hero page/2.jpg',
          'hero page/4.webp'
        ];
        let imgIndex = 0;
        setInterval(() => {
          imgIndex = (imgIndex + 1) % heroImages.length;
          if (heroBgImg) {
            heroBgImg.style.transition = 'opacity 0.6s ease';
            heroBgImg.style.opacity = '0.3';
            setTimeout(() => {
              heroBgImg.src = heroImages[imgIndex];
              heroBgImg.style.opacity = '1';
            }, 600);
          }
        }, 6500);
      }
    };

    // 1. On video ended event
    heroVideo.addEventListener('ended', triggerSeamlessTransition);

    // 2. On video timeupdate (trigger before final frame)
    heroVideo.addEventListener('timeupdate', () => {
      const currentTime = heroVideo.currentTime;
      const duration = heroVideo.duration;

      if (currentTime >= 3.4 || (duration && currentTime >= duration - 0.4)) {
        triggerSeamlessTransition();
      }
    });

    // 3. Fallback timer
    setTimeout(triggerSeamlessTransition, 3700);
  }

  // --- 4. Product Catalog Category Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- 5. Lightbox Modal for Gallery & Product Zoom ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.getElementById('closeLightbox');

  document.querySelectorAll('.trigger-lightbox').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const src = item.getAttribute('data-img-src') || item.getAttribute('src');
      const caption = item.getAttribute('data-caption') || 'Bluetec Plast Interior Panel Design';
      
      if (lightboxImg && lightboxModal) {
        lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (closeLightbox && lightboxModal) {
    closeLightbox.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // --- 6. Video Preview Modal (Secondary Showcase Videos) ---
  const videoModal = document.getElementById('videoModal');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');
  const closeVideoModal = document.getElementById('closeVideoModal');

  document.querySelectorAll('.trigger-video-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoSrc = btn.getAttribute('data-video-src');
      if (modalVideoPlayer && videoModal) {
        modalVideoPlayer.src = videoSrc;
        videoModal.classList.add('active');
        modalVideoPlayer.play();
      }
    });
  });

  if (closeVideoModal && videoModal) {
    const stopModalVideo = () => {
      videoModal.classList.remove('active');
      if (modalVideoPlayer) {
        modalVideoPlayer.pause();
        modalVideoPlayer.src = '';
      }
    };
    closeVideoModal.addEventListener('click', stopModalVideo);
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) stopModalVideo();
    });
  }

  // --- 7. Inquiry & Sample Request Modal ---
  const quoteModal = document.getElementById('quoteModal');
  const openQuoteBtns = document.querySelectorAll('.open-quote-modal');
  const closeQuoteModal = document.getElementById('closeQuoteModal');
  const quoteForm = document.getElementById('quoteForm');

  openQuoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productSelect = document.getElementById('quoteProduct');
      const selectedProduct = btn.getAttribute('data-product-name');
      if (productSelect && selectedProduct) {
        productSelect.value = selectedProduct;
      }
      if (quoteModal) quoteModal.classList.add('active');
    });
  });

  if (closeQuoteModal && quoteModal) {
    closeQuoteModal.addEventListener('click', () => {
      quoteModal.classList.remove('active');
    });
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) quoteModal.classList.remove('active');
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('quoteName').value;
      const phone = document.getElementById('quotePhone').value;
      const product = document.getElementById('quoteProduct').value;
      const city = document.getElementById('quoteCity').value;
      const quantity = document.getElementById('quoteQuantity').value;

      // Construct WhatsApp message
      const message = `*Inquiry from Website*%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*City:* ${city}%0A*Product:* ${product}%0A*Quantity:* ${quantity} sq.ft`;
      const whatsappUrl = `https://wa.me/919913273760?text=${message}`;

      window.open(whatsappUrl, '_blank');
      quoteModal.classList.remove('active');
      quoteForm.reset();
    });
  }

  // --- 8. Animated Counter Statistics ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const count = +stat.innerText.replace('+', '').replace('%', '');
      const suffix = stat.getAttribute('data-suffix') || '';
      const increment = Math.ceil(target / 40);

      if (count < target) {
        stat.innerText = Math.min(count + increment, target) + suffix;
        setTimeout(animateCounters, 40);
      } else {
        stat.innerText = target + suffix;
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) observer.observe(statsSection);

  // --- 9. Mobile Floating Contact Menu Toggle ---
  const floatToggle = document.getElementById('mobileFloatToggle');
  const floatContainer = document.getElementById('mobileFloatContainer');
  const floatChatTrigger = document.getElementById('floatChatTrigger');

  if (floatToggle && floatContainer) {
    floatToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      floatContainer.classList.toggle('active');
    });

    // Close menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!floatContainer.contains(e.target)) {
        floatContainer.classList.remove('active');
      }
    });
  }

  // Open Inquiry Quote modal on Chat trigger click
  if (floatChatTrigger) {
    floatChatTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const quoteModal = document.getElementById('quoteModal');
      if (quoteModal) {
        quoteModal.classList.add('active');
      } else {
        window.location.href = 'index.html#contact';
      }
      if (floatContainer) {
        floatContainer.classList.remove('active');
      }
    });
  }

  // --- 10. Top Scroll Progress Bar ---
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  window.addEventListener('scroll', () => {
    if (scrollProgressBar) {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      scrollProgressBar.style.width = scrolled + '%';
    }
  });

  // --- 11. Real-Time Room Wall Visualizer ---
  const visualizerImg = document.getElementById('visualizerImage');
  const visualizerBadge = document.getElementById('visualizerBadge');
  const visualizerTitle = document.getElementById('visualizerTitle');
  const visualizerDesc = document.getElementById('visualizerDesc');
  const visualizerPrice = document.getElementById('visualizerPrice');
  const visualizerCta = document.getElementById('visualizerCta');
  const swatchBtns = document.querySelectorAll('.swatch-btn');

  if (swatchBtns.length && visualizerImg) {
    swatchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        swatchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const img = btn.getAttribute('data-img');
        const badge = btn.getAttribute('data-badge');
        const title = btn.getAttribute('data-title');
        const desc = btn.getAttribute('data-desc');
        const price = btn.getAttribute('data-price');

        visualizerImg.style.opacity = '0.3';
        setTimeout(() => {
          if (img) visualizerImg.src = img;
          if (badge && visualizerBadge) visualizerBadge.innerText = badge;
          if (title && visualizerTitle) visualizerTitle.innerText = title;
          if (desc && visualizerDesc) visualizerDesc.innerText = desc;
          if (price && visualizerPrice) visualizerPrice.innerText = price;
          if (visualizerCta && title) visualizerCta.setAttribute('data-product-name', title);
          visualizerImg.style.opacity = '1';
        }, 200);
      });
    });
  }

  // --- 12. Before / After Transformation Slider ---
  const baContainer = document.getElementById('baSlider');
  const baBeforeWrapper = document.getElementById('baBeforeWrapper');
  const baHandle = document.getElementById('baHandle');

  if (baContainer && baBeforeWrapper && baHandle) {
    let isDraggingBA = false;

    const updateBASlider = (x) => {
      const rect = baContainer.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      const percentage = (offsetX / rect.width) * 100;
      baBeforeWrapper.style.width = percentage + '%';
      baHandle.style.left = percentage + '%';
    };

    baContainer.addEventListener('mousedown', (e) => {
      isDraggingBA = true;
      updateBASlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDraggingBA = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDraggingBA) updateBASlider(e.clientX);
    });

    baContainer.addEventListener('touchstart', (e) => {
      isDraggingBA = true;
      if (e.touches.length > 0) updateBASlider(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDraggingBA = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (isDraggingBA && e.touches.length > 0) updateBASlider(e.touches[0].clientX);
    });
  }

  // --- 13. Instant Wall Renovation Cost Calculator ---
  const calcLength = document.getElementById('calcLength');
  const calcHeight = document.getElementById('calcHeight');
  const calcPanelType = document.getElementById('calcPanelType');

  const valLength = document.getElementById('valLength');
  const valHeight = document.getElementById('valHeight');
  const calcTotalArea = document.getElementById('calcTotalArea');
  const calcPanelsCount = document.getElementById('calcPanelsCount');
  const calcEstimatedCost = document.getElementById('calcEstimatedCost');
  const btnCalcApplyQuote = document.getElementById('btnCalcApplyQuote');

  const updateCalculator = () => {
    if (!calcLength || !calcHeight || !calcPanelType) return;
    const len = parseFloat(calcLength.value) || 12;
    const hgt = parseFloat(calcHeight.value) || 10;
    const pricePerSqFt = parseFloat(calcPanelType.value) || 110;

    if (valLength) valLength.innerText = len + ' ft';
    if (valHeight) valHeight.innerText = hgt + ' ft';

    const totalArea = Math.round(len * hgt);
    const panelsCount = Math.ceil(totalArea / 9.6);
    const totalCost = Math.round(totalArea * pricePerSqFt);

    if (calcTotalArea) calcTotalArea.innerText = totalArea + ' sq.ft';
    if (calcPanelsCount) calcPanelsCount.innerText = '~' + panelsCount + ' Panels';
    if (calcEstimatedCost) calcEstimatedCost.innerText = '₹' + totalCost.toLocaleString('en-IN');
  };

  if (calcLength && calcHeight && calcPanelType) {
    calcLength.addEventListener('input', updateCalculator);
    calcHeight.addEventListener('input', updateCalculator);
    calcPanelType.addEventListener('change', updateCalculator);
    updateCalculator();
  }

  if (btnCalcApplyQuote) {
    btnCalcApplyQuote.addEventListener('click', () => {
      const quoteModal = document.getElementById('quoteModal');
      const quoteProduct = document.getElementById('quoteProduct');
      const quoteQuantity = document.getElementById('quoteQuantity');
      const len = calcLength ? calcLength.value : 12;
      const hgt = calcHeight ? calcHeight.value : 10;
      const selectedOption = calcPanelType ? calcPanelType.options[calcPanelType.selectedIndex].text : '';

      if (quoteQuantity) {
        quoteQuantity.value = `${len}ft x ${hgt}ft (${calcTotalArea ? calcTotalArea.innerText : ''}) - Est ${calcEstimatedCost ? calcEstimatedCost.innerText : ''}`;
      }
      if (quoteModal) {
        quoteModal.classList.add('active');
      }
    });
  }

  // --- 14. Live Social Proof Toast Notifications ---
  const toastWidget = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  const closeToast = document.getElementById('closeToast');

  if (toastWidget && toastTitle && toastMessage) {
    const notifications = [
      { title: "✨ Sample Kit Request", msg: "Architect from Jaipur requested Swatch Box (3 mins ago)" },
      { title: "🔥 Wholesale Order", msg: "Interior Firm from Delhi booked 1,200 sq.ft Fluted Panels" },
      { title: "⭐ Swatch Inquiry", msg: "Designer from Mumbai requested Charcoal Matte samples" },
      { title: "✅ Instant Quote", msg: "Project estimate generated for 850 sq.ft in Ahmedabad" },
      { title: "🏛️ Hotel Project", msg: "Distributor partnership inquiry received from Surat" }
    ];

    let toastIdx = 0;

    const showNextToast = () => {
      toastIdx = (toastIdx + 1) % notifications.length;
      toastTitle.innerText = notifications[toastIdx].title;
      toastMessage.innerText = notifications[toastIdx].msg;

      toastWidget.classList.add('show');
      setTimeout(() => {
        toastWidget.classList.remove('show');
      }, 4500);
    };

    setTimeout(() => {
      showNextToast();
      setInterval(showNextToast, 16000);
    }, 4000);

    if (closeToast) {
      closeToast.addEventListener('click', () => {
        toastWidget.classList.remove('show');
      });
    }
  }

  // --- 15. Ambient LED Ceiling Lighting Swapper ---
  const ledBtns = document.querySelectorAll('.led-btn');
  const visualizerStage = document.getElementById('visualizerStage');

  if (ledBtns.length && visualizerStage) {
    ledBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        ledBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.getAttribute('data-led');
        visualizerStage.className = 'visualizer-stage';
        if (mode && mode !== 'default') {
          visualizerStage.classList.add(`led-${mode}`);
        }
      });
    });
  }
});



