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

  // --- 1. Smart Sticky Navigation & Scroll Header with Hide/Show on Scroll Direction ---
  const header = document.querySelector('.main-header');
  let lastScrollY = 0;
  let scrollDirection = 'up';
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Detect scroll direction
    if (currentScrollY > lastScrollY) {
      scrollDirection = 'down';
    } else {
      scrollDirection = 'up';
    }
    lastScrollY = currentScrollY;
    
    // Add scrolled class after 100px
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
      // Hide on scroll down, show on scroll up
      if (scrollDirection === 'down' && currentScrollY > 200) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
    } else {
      header.classList.remove('scrolled');
      header.classList.remove('hidden');
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

    // Disable autoplay on mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      heroVideo.autoplay = false;
      heroVideo.pause();
    }

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

  // --- 6. Project Video Modal/Lightbox with Hover Preview ---
  const cinemaThumbCards = document.querySelectorAll('.cinema-thumb-card');
  
  // Create video modal if it doesn't exist
  let videoModal = document.getElementById('videoModalLightbox');
  if (!videoModal) {
    videoModal = document.createElement('div');
    videoModal.id = 'videoModalLightbox';
    videoModal.className = 'video-modal';
    videoModal.innerHTML = `
      <div class="video-modal-content">
        <video class="video-modal-video" controls playsinline></video>
        <button class="video-modal-close" aria-label="Close">✕</button>
      </div>
    `;
    document.body.appendChild(videoModal);
  }
  
  const modalVideo = videoModal.querySelector('.video-modal-video');
  const modalClose = videoModal.querySelector('.video-modal-close');
  
  // Function to open modal
  const openVideoModal = (videoSrc) => {
    modalVideo.src = videoSrc;
    videoModal.classList.add('active');
    modalVideo.play().catch(err => console.log('Modal video play error:', err));
  };
  
  // Function to close modal
  const closeVideoModal = () => {
    videoModal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
  };
  
  // Click to play modal
  cinemaThumbCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const videoSrc = card.getAttribute('data-video-src');
      if (videoSrc) {
        openVideoModal(videoSrc);
      }
    });
    
    // Hover preview for desktop
    if (window.innerWidth > 768) {
      const imgBox = card.querySelector('.cinema-thumb-img-box');
      if (imgBox) {
        let previewVideo = imgBox.querySelector('video');
        
        card.addEventListener('mouseenter', () => {
          if (!previewVideo) {
            previewVideo = document.createElement('video');
            previewVideo.className = 'preview-video';
            previewVideo.muted = true;
            previewVideo.src = card.getAttribute('data-video-src');
            imgBox.appendChild(previewVideo);
          }
          previewVideo.currentTime = 0;
          previewVideo.play().catch(err => console.log('Preview play error:', err));
          imgBox.classList.add('preview-active');
        });
        
        card.addEventListener('mouseleave', () => {
          if (previewVideo) {
            previewVideo.pause();
          }
          imgBox.classList.remove('preview-active');
        });
      }
    }
  });
  
  // Close modal on click
  modalClose.addEventListener('click', closeVideoModal);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

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

  // --- 8. Enhanced Animated Counter Statistics with easing ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const easeOutQuad = (t) => {
    return 1 - (1 - t) * (1 - t);
  };

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuad(progress);
        const current = Math.round(target * easedProgress);

        stat.innerText = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
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

  // --- 16. VIRTUAL VIDEO CINEMA THEATRE PLAYER CONTROLLER ---
  const cinemaVideo = document.getElementById('cinemaMainVideo');
  const cinemaBigPlay = document.getElementById('cinemaBigPlay');
  const cinemaPlayBtn = document.getElementById('cinemaPlayBtn');
  const cinemaMuteBtn = document.getElementById('cinemaMuteBtn');
  const cinemaFullscreenBtn = document.getElementById('cinemaFullscreenBtn');
  const cinemaProgressBar = document.getElementById('cinemaProgressBar');
  const cinemaTimeText = document.getElementById('cinemaTimeText');
  const cinemaVideoTagText = document.getElementById('cinemaVideoTagText');

  const cinemaTabBtns = document.querySelectorAll('.cinema-tab-btn');
  const cinemaThumbCards = document.querySelectorAll('.cinema-thumb-card');
  const cinemaPlayerCard = document.querySelector('.cinema-player-card');

  if (cinemaVideo) {
    // Play / Pause toggle function
    const toggleCinemaPlay = () => {
      if (cinemaVideo.paused) {
        cinemaVideo.play();
        if (cinemaBigPlay) cinemaBigPlay.style.display = 'none';
        if (cinemaPlayBtn) cinemaPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        if (cinemaPlayerCard) cinemaPlayerCard.classList.remove('paused');
      } else {
        cinemaVideo.pause();
        if (cinemaBigPlay) cinemaBigPlay.style.display = 'flex';
        if (cinemaPlayBtn) cinemaPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        if (cinemaPlayerCard) cinemaPlayerCard.classList.add('paused');
      }
    };

    if (cinemaBigPlay) cinemaBigPlay.addEventListener('click', toggleCinemaPlay);
    if (cinemaPlayBtn) cinemaPlayBtn.addEventListener('click', toggleCinemaPlay);

    // Mute toggle
    if (cinemaMuteBtn) {
      cinemaMuteBtn.addEventListener('click', () => {
        cinemaVideo.muted = !cinemaVideo.muted;
        if (cinemaVideo.muted) {
          cinemaMuteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        } else {
          cinemaMuteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
      });
    }

    // Fullscreen toggle
    if (cinemaFullscreenBtn) {
      cinemaFullscreenBtn.addEventListener('click', () => {
        if (cinemaVideo.requestFullscreen) {
          cinemaVideo.requestFullscreen();
        } else if (cinemaVideo.webkitRequestFullscreen) {
          cinemaVideo.webkitRequestFullscreen();
        }
      });
    }

    // Progress bar update
    cinemaVideo.addEventListener('timeupdate', () => {
      if (cinemaVideo.duration && cinemaProgressBar) {
        const progress = (cinemaVideo.currentTime / cinemaVideo.duration) * 100;
        cinemaProgressBar.value = progress;

        const curMin = Math.floor(cinemaVideo.currentTime / 60);
        const curSec = Math.floor(cinemaVideo.currentTime % 60).toString().padStart(2, '0');
        const durMin = Math.floor(cinemaVideo.duration / 60) || 0;
        const durSec = Math.floor(cinemaVideo.duration % 60).toString().padStart(2, '0');

        if (cinemaTimeText) {
          cinemaTimeText.textContent = `${curMin}:${curSec} / ${durMin}:${durSec}`;
        }
      }
    });

    if (cinemaProgressBar) {
      cinemaProgressBar.addEventListener('input', () => {
        if (cinemaVideo.duration) {
          const seekTime = (cinemaProgressBar.value / 100) * cinemaVideo.duration;
          cinemaVideo.currentTime = seekTime;
        }
      });
    }

    // Video Switcher Function (between video 1.mp4 and 2.mp4)
    const switchCinemaVideo = (videoSrc, videoTitle, videoId) => {
      cinemaVideo.src = videoSrc;
      cinemaVideo.load();
      cinemaVideo.play().catch(e => console.log('Autoplay handled:', e));

      if (cinemaBigPlay) cinemaBigPlay.style.display = 'none';
      if (cinemaPlayBtn) cinemaPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      if (cinemaVideoTagText) cinemaVideoTagText.textContent = videoTitle;

      // Update tabs active state
      cinemaTabBtns.forEach(btn => {
        if (btn.getAttribute('data-video-id') === videoId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update thumb cards active state
      cinemaThumbCards.forEach(card => {
        if (card.getAttribute('data-video-id') === videoId) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    };

    // Tab buttons event listeners
    cinemaTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-video-src');
        const title = btn.getAttribute('data-video-title');
        const id = btn.getAttribute('data-video-id');
        switchCinemaVideo(src, title, id);
      });
    });

    // Thumb card event listeners
    cinemaThumbCards.forEach(card => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-video-src');
        const title = card.getAttribute('data-video-title');
        const id = card.getAttribute('data-video-id');
        switchCinemaVideo(src, title, id);
      });
    });
  }

  // --- 17. DYNAMIC 19-IMAGE SHOWCASE FILTER CONTROLLER ---
  const showcaseFilterChips = document.querySelectorAll('.showcase-filter-chip');
  const showcaseCards19 = document.querySelectorAll('.showcase-card-19');

  showcaseFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      showcaseFilterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-showcase-filter');

      showcaseCards19.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 18. ARCHITECTURAL BENTO GRID 3D PERSPECTIVE TILT ---
  const bentoTiles = document.querySelectorAll('.bento-tile');
  bentoTiles.forEach(tile => {
    tile.addEventListener('mousemove', (e) => {
      const rect = tile.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      tile.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });

    tile.addEventListener('mouseleave', () => {
      tile.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // --- 19. ARCHITECTURAL BENTO CATEGORY FILTERS ---
  const bentoFilterBtns = document.querySelectorAll('.bento-filter-btn');
  bentoFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bentoFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-bento-filter');
      bentoTiles.forEach(tile => {
        const cat = tile.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          tile.style.display = 'flex';
          setTimeout(() => {
            tile.style.opacity = '1';
            tile.style.transform = 'scale(1)';
          }, 50);
        } else {
          tile.style.opacity = '0';
          tile.style.transform = 'scale(0.95)';
          setTimeout(() => {
            tile.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- 20. LIVE SPACE SIMULATOR ROOM PRESET SWITCHER ---
  const simPresetBtns = document.querySelectorAll('.sim-preset-btn');
  const simImg = document.getElementById('simDisplayImg');
  const simTitle = document.getElementById('simTitle');
  const simDesc = document.getElementById('simDesc');

  if (simPresetBtns.length > 0 && simImg) {
    simPresetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        simPresetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const imgSrc = btn.getAttribute('data-sim-img');
        const title = btn.getAttribute('data-sim-title');
        const desc = btn.getAttribute('data-sim-desc');

        simImg.style.opacity = '0';
        simImg.style.transform = 'scale(0.98)';

        setTimeout(() => {
          simImg.src = imgSrc;
          if (simTitle) simTitle.textContent = title;
          if (simDesc) simDesc.textContent = desc;
          simImg.style.opacity = '1';
          simImg.style.transform = 'scale(1)';
        }, 300);
      });
    });
  }

  // --- 21. SMART VIDEO INTERSECTION OBSERVER (AUTO-PAUSE/AUTO-PLAY IN VIEWPORT) ---
  const allVideos = document.querySelectorAll('video');
  if ('IntersectionObserver' in window && allVideos.length > 0) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        // Check if video is a preview or should not autoplay (mobile)
        const isPreview = video.classList.contains('preview-video');
        const isMobileAutoplay = window.innerWidth <= 768 && entry.target.id === 'heroVideo';
        
        if (!entry.isIntersecting) {
          // Pause when scrolled out of view
          if (!video.paused) {
            video.pause();
            video.dataset.autoPaused = "true";
          }
        } else if (entry.isIntersecting && !isPreview && !isMobileAutoplay) {
          // Auto-play when back in view (unless it's a preview video or hero on mobile)
          if (!video.paused || (video.dataset.autoPaused === "true" && video.autoplay !== false)) {
            video.play().catch(err => {
              console.log('Autoplay error:', err);
            });
            video.dataset.autoPaused = "false";
          }
        }
      });
    }, { threshold: 0.25 });

    allVideos.forEach(v => videoObserver.observe(v));
  }

  // --- 22. SCROLL FADE-IN ANIMATIONS FOR SECTIONS ---
  if ('IntersectionObserver' in window) {
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    // Apply to feature cards, product cards, gallery items, section titles
    document.querySelectorAll('.feature-card, .product-card, .gallery-item, .section-title, .stats-bar').forEach(el => {
      fadeInObserver.observe(el);
    });
  }

  // --- 24. PINTEREST MASONRY FILTER CONTROLLER ---
  const pinterestFilterBtns = document.querySelectorAll('.pinterest-filter-btn');
  const pinterestPins = document.querySelectorAll('.pinterest-pin-card');

  if (pinterestFilterBtns.length > 0 && pinterestPins.length > 0) {
    pinterestFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pinterestFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        pinterestPins.forEach(pin => {
          const category = pin.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            pin.style.display = 'block';
            setTimeout(() => {
              pin.style.opacity = '1';
              pin.style.transform = 'translateY(0) scale(1)';
            }, 30);
          } else {
            pin.style.opacity = '0';
            pin.style.transform = 'translateY(15px) scale(0.92)';
            setTimeout(() => {
              pin.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }
});





