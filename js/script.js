document.addEventListener('DOMContentLoaded', function() {
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        
            this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.textContent = '☰';
                }
            }
        });
    });

const modal = document.getElementById('bookingModal');
const closeBtn = document.querySelector('.close-modal');
const cancelBtn = document.getElementById('cancelBooking');
const bookingForm = document.getElementById('bookingForm');
let selectedService = '';
let selectedPrice = 0;

document.querySelectorAll('.btn-book').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        selectedService = this.getAttribute('data-service');
        selectedPrice = parseInt(this.getAttribute('data-price'));
        
        document.getElementById('modalServiceName').textContent = selectedService;
        document.getElementById('modalServicePrice').textContent = `Price: R${selectedPrice.toLocaleString()}`;
        document.getElementById('summaryServiceName').textContent = selectedService;
        
        updatePriceSummary();

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        bookingForm.reset();
        document.getElementById('bookingNotes').value = '';
        const successMsg = document.querySelector('.booking-success');
        if (successMsg) successMsg.remove();
    });
});

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

window.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', function() {

        document.querySelectorAll('.payment-method').forEach(m => {
            m.classList.remove('active');
        });
        
        this.classList.add('active');
        
        const radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
  
        const methodType = this.getAttribute('data-method');
        
        document.getElementById('cardDetails').style.display = methodType === 'card' ? 'block' : 'none';
        document.getElementById('eftDetails').style.display = methodType === 'eft' ? 'block' : 'none';
        document.getElementById('cashDetails').style.display = methodType === 'cash' ? 'block' : 'none';
    });
});
function updatePriceSummary() {
    const durationSelect = document.getElementById('bookingDuration');
    const duration = parseInt(durationSelect.value);
    const durationText = durationSelect.options[durationSelect.selectedIndex].text;
    
    const basePrice = selectedPrice * duration;
    const vat = basePrice * 0.15;
    const total = basePrice + vat;
    
    document.getElementById('summaryBasePrice').textContent = `R${basePrice.toLocaleString()}`;
    document.getElementById('summaryDuration').textContent = durationText;
    document.getElementById('summaryVat').textContent = `R${vat.toLocaleString()}`;
    document.getElementById('summaryTotal').innerHTML = `<strong>R${total.toLocaleString()}</strong>`;
}

document.getElementById('bookingDuration').addEventListener('change', updatePriceSummary);
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('bookingName').value.trim();
    const email = document.getElementById('bookingEmail').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const address = document.getElementById('bookingAddress').value.trim();
    const notes = document.getElementById('bookingNotes').value.trim();
    const duration = document.getElementById('bookingDuration');
    const durationText = duration.options[duration.selectedIndex].text;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const methodLabel = paymentMethod ? paymentMethod.parentElement.querySelector('span').textContent.trim() : 'Not selected';
    
    let errors = [];
    if (!name || name.length < 2) errors.push('Please enter your full name');
    if (!email || !isValidEmail(email)) errors.push('Please enter a valid email address');
    if (!phone || phone.length < 10) errors.push('Please enter a valid phone number');
    
    if (errors.length > 0) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        return;
    }
    
    const basePrice = selectedPrice * parseInt(duration.value);
    const vat = basePrice * 0.15;
    const total = basePrice + vat;
  
    const successHTML = `
        <div class="booking-success">
            <div class="success-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <p>
                <strong>${name}</strong>, your booking for <strong>${selectedService}</strong> has been received.<br>
                Duration: ${durationText}<br>
                Total Amount: <strong>R${total.toLocaleString()}</strong><br>
                Payment Method: ${methodLabel}<br><br>
                We will contact you within 24 hours at <strong>${email}</strong> or <strong>${phone}</strong>.
            </p>
            <button class="btn-submit-booking" onclick="closeModal()" style="margin-top: 20px;">
                Close
            </button>
        </div>
    `;
    
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = successHTML;

    console.log('Booking Confirmed:', {
        service: selectedService,
        price: selectedPrice,
        duration: durationText,
        total: total,
        name,
        email,
        phone,
        address: address || 'Not provided',
        notes: notes || 'No notes',
        paymentMethod: methodLabel,
        timestamp: new Date().toISOString()
    });
});


document.getElementById('cardNumber')?.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    this.value = value;
});

document.getElementById('cardExpiry')?.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    this.value = value;
});

document.getElementById('cardCvv')?.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    this.value = value;
});


document.getElementById('bookingPhone')?.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9+]/g, '');
});

console.log('✅ Booking modal loaded successfully!');

    const enquiryForm = document.getElementById('enquiryForm');
    
    if (enquiryForm) {
   
        const storedService = localStorage.getItem('selectedService');
        const serviceSelect = document.getElementById('serviceSelect');
        
        if (storedService && serviceSelect) {
        
            serviceSelect.value = storedService;
            
            const highlightMessage = document.getElementById('serviceHighlight');
            if (highlightMessage) {
                highlightMessage.textContent = `Selected: ${storedService}`;
                highlightMessage.style.display = 'block';
            }
            
            localStorage.removeItem('selectedService');
        }
        
        const serviceAdded = localStorage.getItem('serviceAdded');
        if (serviceAdded === 'true') {
            const addedMsg = document.getElementById('serviceAddedMessage');
            if (addedMsg) {
                addedMsg.textContent = '✓ A service has been pre-selected for you!';
                addedMsg.style.display = 'block';
                setTimeout(() => {
                    addedMsg.style.display = 'none';
                }, 3000);
            }
            localStorage.removeItem('serviceAdded');
        }
        
        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            

            const fullName = document.getElementById('fullName')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            const service = document.getElementById('serviceSelect')?.value;
            const message = document.getElementById('message')?.value.trim();
            
            let errors = [];
            
            if (!fullName || fullName.length < 2) {
                errors.push('Please enter your full name (minimum 2 characters)');
                document.getElementById('fullName')?.classList.add('error');
            } else {
                document.getElementById('fullName')?.classList.remove('error');
            }
            
            if (!email) {
                errors.push('Please enter your email address');
                document.getElementById('email')?.classList.add('error');
            } else if (!isValidEmail(email)) {
                errors.push('Please enter a valid email address');
                document.getElementById('email')?.classList.add('error');
            } else {
                document.getElementById('email')?.classList.remove('error');
            }
            
            if (!phone || phone.length < 10) {
                errors.push('Please enter a valid phone number (minimum 10 digits)');
                document.getElementById('phone')?.classList.add('error');
            } else {
                document.getElementById('phone')?.classList.remove('error');
            }
            
            if (!service || service === '') {
                errors.push('Please select a service');
                document.getElementById('serviceSelect')?.classList.add('error');
            } else {
                document.getElementById('serviceSelect')?.classList.remove('error');
            }
            
            if (errors.length > 0) {
                const errorContainer = document.getElementById('formErrors');
                if (errorContainer) {
                    errorContainer.innerHTML = errors.map(err => 
                        `<div class="error-message">⚠️ ${err}</div>`
                    ).join('');
                    errorContainer.style.display = 'block';
                } else {
                    alert('Please fix the following errors:\n\n' + errors.join('\n'));
                }
                return;
            }
            
            const errorContainer = document.getElementById('formErrors');
            if (errorContainer) {
                errorContainer.style.display = 'none';
            }

            const successMessage = document.getElementById('formSuccess');
            if (successMessage) {
                successMessage.innerHTML = `
                    ✅ Thank you ${fullName}!
                    <br><br>
                    Your enquiry for <strong>${service}</strong> has been submitted successfully.
                    <br><br>
                    We will contact you within 24 hours at <strong>${email}</strong> or <strong>${phone}</strong>.
                `;
                successMessage.style.display = 'block';
                successMessage.style.background = '#28a745';
                successMessage.style.color = 'white';
                successMessage.style.padding = '20px';
                successMessage.style.borderRadius = '10px';
                successMessage.style.marginTop = '20px';
            } else {
                alert(`✅ Thank you ${fullName}!\n\nYour enquiry for ${service} has been submitted successfully.\nWe will contact you within 24 hours.`);
            }
        
            console.log('Enquiry Submitted:', {
                fullName,
                email,
                phone,
                service,
                message: message || 'No message provided',
                timestamp: new Date().toISOString()
            });
            
            setTimeout(() => {
                enquiryForm.reset();
                if (successMessage) {
                    successMessage.style.display = 'none';
                }
                
                document.querySelectorAll('.error').forEach(el => {
                    el.classList.remove('error');
                });
            }, 5000);
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-links a, nav a:not(.menu-toggle)');
    
    navLinksAll.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && href === 'index.html') {
            link.classList.add('active');
        }
    });
    
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .service-card, .mv-card, .team-card, .stat-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    const style = document.createElement('style');
    style.textContent = `
        .feature-card, .service-card, .mv-card, .team-card, .stat-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .feature-card.visible, .service-card.visible, .mv-card.visible, 
        .team-card.visible, .stat-item.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .error {
            border-color: #dc3545 !important;
            box-shadow: 0 0 10px rgba(220, 53, 69, 0.3) !important;
        }
        
        .error-message {
            background: #dc3545;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.textContent = '⬆';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #e6a400;
        color: #0a1628;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(230, 164, 0, 0.4);
        display: none;
        transition: all 0.3s ease;
        z-index: 999;
    `;
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 25px rgba(230, 164, 0, 0.6)';
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 15px rgba(230, 164, 0, 0.4)';
    });

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Remove non-numeric characters
            this.value = this.value.replace(/[^0-9+]/g, '');
        });
    }
    
    document.querySelectorAll('button, .btn, a').forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    console.log('%c🔒 Alpha Group Security', 'font-size: 24px; font-weight: bold; color: #e6a400;');
    console.log('%cYour trusted security partner in South Africa', 'font-size: 14px; color: #0a1628;');
    console.log('%c📞 +27 73 915 5695 | 📧 alphagroupsec1@gmail.com', 'font-size: 12px; color: #666;');

    document.querySelectorAll('.contact-card a[href^="mailto:"], .contact-card a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const type = this.href.startsWith('mailto:') ? 'Email' : 'Phone number';
            const value = this.href.split(':')[1];
            
            // Show a tooltip or notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 9999;
                animation: slideDown 0.5s ease;
            `;
            notification.textContent = `✓ ${type} copied to clipboard!`;
            document.body.appendChild(notification);
            
            // Copy to clipboard
            navigator.clipboard.writeText(value).catch(() => {
                // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = value;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            });
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        });
    });
    
    console.log('✅ Alpha Group Security website loaded successfully!');
});