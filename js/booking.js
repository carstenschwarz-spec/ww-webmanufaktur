/* ============================================
   COIFFEUR LAVIE - BOOKING SYSTEM
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initBookingSystem();
});

function initBookingSystem() {
    // Booking State
    const bookingState = {
        gender: null,
        genderName: null,
        services: [], // Array of selected services
        totalPrice: 0,
        totalDuration: 0,
        serviceWishes: null,
        stylist: null,
        stylistName: null,
        date: null,
        time: null,
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        emailReminder: true,
        smsReminder: false,
        whatsappReminder: false,
        notes: null
    };

    let currentStep = 1;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // DOM Elements
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');
    const bookingSteps = document.querySelectorAll('.booking-step');
    const genderOptions = document.querySelectorAll('.gender-option');
    const stylistOptions = document.querySelectorAll('.stylist-option');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');

    // Gender Selection
    genderOptions.forEach(option => {
        option.addEventListener('click', function() {
            const newGender = this.dataset.gender;

            // Warn if services already selected and gender actually changes
            if (bookingState.services.length > 0 && bookingState.gender && bookingState.gender !== newGender) {
                if (!confirm('Durch den Wechsel der Kategorie werden Ihre ausgewählten Services zurückgesetzt. Fortfahren?')) {
                    return;
                }
            }

            genderOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');

            bookingState.gender = newGender;
            bookingState.genderName = this.querySelector('h3').textContent;

            // Reset services when gender changes
            bookingState.services = [];
            updateSelectedServicesSummary();

            updateSummary();
            enableNextButton(1);
        });
    });

    // Service Selection (Multi-Select)
    function initServiceSelection() {
        const serviceOptions = document.querySelectorAll('.service-option');

        serviceOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Toggle selection
                this.classList.toggle('selected');

                const serviceData = {
                    id: this.dataset.service,
                    name: this.querySelector('h3').textContent,
                    price: parseInt(this.dataset.price),
                    duration: parseInt(this.dataset.duration)
                };

                if (this.classList.contains('selected')) {
                    // Add service
                    bookingState.services.push(serviceData);
                } else {
                    // Remove service
                    bookingState.services = bookingState.services.filter(s => s.id !== serviceData.id);
                }

                // Calculate totals
                calculateTotals();
                updateSelectedServicesSummary();
                updateSummary();

                // Enable/disable next button based on selection
                if (bookingState.services.length > 0) {
                    enableNextButton(2);
                } else {
                    disableNextButton(2);
                }
            });
        });
    }

    // Initialize service selection
    initServiceSelection();

    // Calculate totals
    function calculateTotals() {
        bookingState.totalPrice = bookingState.services.reduce((sum, s) => sum + s.price, 0);
        bookingState.totalDuration = bookingState.services.reduce((sum, s) => sum + s.duration, 0);
    }

    // Update selected services summary
    function updateSelectedServicesSummary() {
        const summaryEl = document.getElementById('selectedServicesSummary');
        const listEl = document.getElementById('selectedServicesList');
        const durationEl = document.getElementById('totalDuration');
        const priceEl = document.getElementById('totalPrice');

        if (bookingState.services.length === 0) {
            summaryEl.style.display = 'none';
            return;
        }

        summaryEl.style.display = 'block';

        // Build list of selected services
        listEl.innerHTML = bookingState.services.map(service => `
            <div class="selected-service-tag">
                <span>${service.name}</span>
                <span class="tag-price">${service.price}€</span>
            </div>
        `).join('');

        durationEl.textContent = bookingState.totalDuration + ' Min.';
        priceEl.textContent = 'ab ' + bookingState.totalPrice + '€';
    }

    // Show services based on gender
    function showServicesForGender(gender) {
        // Hide all service sections
        document.getElementById('herrenServices').style.display = 'none';
        document.getElementById('damenServices').style.display = 'none';
        document.getElementById('kinderServices').style.display = 'none';

        // Clear previous selections
        document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
        bookingState.services = [];
        updateSelectedServicesSummary();
        disableNextButton(2);

        // Show appropriate section
        if (gender === 'herren') {
            document.getElementById('herrenServices').style.display = 'block';
        } else if (gender === 'damen') {
            document.getElementById('damenServices').style.display = 'block';
        } else if (gender === 'kinder') {
            document.getElementById('kinderServices').style.display = 'block';
        }
    }

    // Stylist Selection
    stylistOptions.forEach(option => {
        option.addEventListener('click', function() {
            stylistOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');

            bookingState.stylist = this.dataset.stylist;
            bookingState.stylistName = this.querySelector('h3').textContent;

            updateSummary();
            enableNextButton(3);
        });
    });

    // Navigation Buttons
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextStep = parseInt(this.dataset.next);

            if (nextStep === 6) {
                // Submit booking
                if (validateStep5()) {
                    submitBooking();
                }
            } else {
                // When going from step 1 to 2, show appropriate services
                if (currentStep === 1 && nextStep === 2) {
                    showServicesForGender(bookingState.gender);
                }

                // Save service wishes when leaving step 2
                if (currentStep === 2) {
                    bookingState.serviceWishes = document.getElementById('serviceWishes')?.value.trim() || null;
                }

                goToStep(nextStep);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const prevStep = parseInt(this.dataset.prev);
            goToStep(prevStep);
        });
    });

    // Go to Step
    function goToStep(step) {
        // Update progress
        progressSteps.forEach((ps, index) => {
            if (index + 1 < step) {
                ps.classList.add('completed');
                ps.classList.remove('active');
            } else if (index + 1 === step) {
                ps.classList.add('active');
                ps.classList.remove('completed');
            } else {
                ps.classList.remove('active', 'completed');
            }
        });

        // Update progress lines
        progressLines.forEach((line, index) => {
            if (index + 1 < step) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        });

        // Show step content
        bookingSteps.forEach(bs => {
            bs.classList.remove('active');
        });
        document.getElementById(`step${step}`).classList.add('active');

        currentStep = step;

        // Initialize calendar when reaching step 4
        if (step === 4) {
            initCalendar();
        }

        // Scroll to top
        window.scrollTo({
            top: document.querySelector('.booking-progress').offsetTop - 100,
            behavior: 'smooth'
        });
    }

    // Enable/Disable Next Button
    function enableNextButton(step) {
        const btn = document.querySelector(`#step${step} .next-step`);
        if (btn) {
            btn.disabled = false;
        }
    }

    function disableNextButton(step) {
        const btn = document.querySelector(`#step${step} .next-step`);
        if (btn) {
            btn.disabled = true;
        }
    }

    // Calendar
    function initCalendar() {
        renderCalendar();
    }

    function renderCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        const currentMonthEl = document.getElementById('currentMonth');

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Month name
        const monthNames = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Clear calendar
        calendarDays.innerHTML = '';

        // Day of week offset (Monday = 0)
        let startDay = firstDay.getDay() - 1;
        if (startDay < 0) startDay = 6;

        // Empty cells before first day
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day', 'empty');
            calendarDays.appendChild(emptyCell);
        }

        // Days of month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('calendar-day');
            dayEl.textContent = day;

            const currentDate = new Date(currentYear, currentMonth, day);
            const dayOfWeek = currentDate.getDay();

            // Disable past dates
            if (currentDate < today) {
                dayEl.classList.add('disabled');
            }
            // Disable Sundays
            else if (dayOfWeek === 0) {
                dayEl.classList.add('disabled');
            }
            // Mark today
            else if (currentDate.getTime() === today.getTime()) {
                dayEl.classList.add('today');
                dayEl.addEventListener('click', () => selectDate(currentDate));
            }
            // Available day
            else {
                dayEl.addEventListener('click', () => selectDate(currentDate));
            }

            calendarDays.appendChild(dayEl);
        }
    }

    // Month navigation
    document.getElementById('prevMonth')?.addEventListener('click', function() {
        const today = new Date();
        if (currentYear > today.getFullYear() ||
            (currentYear === today.getFullYear() && currentMonth > today.getMonth())) {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        }
    });

    document.getElementById('nextMonth')?.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // Select Date
    function selectDate(date) {
        // Update UI
        document.querySelectorAll('.calendar-day').forEach(d => {
            d.classList.remove('selected');
        });
        event.target.classList.add('selected');

        bookingState.date = date;
        updateSummary();

        // Generate time slots
        generateTimeSlots(date);
    }

    // Generate Time Slots
    function generateTimeSlots(date) {
        const timeSlotsContainer = document.getElementById('timeSlotsContainer');
        const timeHint = document.getElementById('timeHint');
        const selectedTimeDisplay = document.getElementById('selectedTimeDisplay');
        const dayOfWeek = date.getDay();

        // Opening hours
        let startHour = 9;
        let endHour = dayOfWeek === 6 ? 16 : 19; // Saturday closes at 16:00

        // Show container, hide hint
        timeSlotsContainer.style.display = 'block';
        timeHint.style.display = 'none';
        selectedTimeDisplay.style.display = 'none';

        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        // Group slots by time period
        const periods = {
            morning: { label: 'Vormittag', icon: 'fa-sun', slots: [], start: 9, end: 12 },
            midday: { label: 'Mittag', icon: 'fa-cloud-sun', slots: [], start: 12, end: 14 },
            afternoon: { label: 'Nachmittag', icon: 'fa-moon', slots: [], start: 14, end: 19 }
        };

        // Generate all available slots
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minutes = 0; minutes < 60; minutes += 30) {
                // Skip slots in the past for today
                if (isToday) {
                    const slotTime = new Date(date);
                    slotTime.setHours(hour, minutes);
                    if (slotTime <= today) continue;
                }

                const timeString = formatTime(hour, minutes);
                // Deterministic "unavailability" based on date+time so it stays consistent per day
                const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
                const hash = ((seed * 31 + hour) * 17 + minutes) % 100;
                const isUnavailable = hash < 15; // ~15% unavailable, but consistent per day

                const slotData = {
                    time: timeString,
                    hour: hour,
                    unavailable: isUnavailable
                };

                // Add to appropriate period
                if (hour < 12) {
                    periods.morning.slots.push(slotData);
                } else if (hour < 14) {
                    periods.midday.slots.push(slotData);
                } else {
                    periods.afternoon.slots.push(slotData);
                }
            }
        }

        // Build HTML
        let html = '';

        Object.keys(periods).forEach(key => {
            const period = periods[key];
            if (period.slots.length === 0) return;

            html += `
                <div class="time-period">
                    <div class="time-period-header">
                        <i class="fas ${period.icon}"></i>
                        <span>${period.label}</span>
                    </div>
                    <div class="time-slots">
            `;

            period.slots.forEach(slot => {
                const unavailableClass = slot.unavailable ? 'unavailable' : '';
                html += `<button class="time-slot ${unavailableClass}" data-time="${slot.time}">${slot.time}</button>`;
            });

            html += `
                    </div>
                </div>
            `;
        });

        timeSlotsContainer.innerHTML = html;

        // Add click handlers
        timeSlotsContainer.querySelectorAll('.time-slot:not(.unavailable)').forEach(slot => {
            slot.addEventListener('click', function() {
                // Remove selection from all slots
                timeSlotsContainer.querySelectorAll('.time-slot').forEach(ts => {
                    ts.classList.remove('selected');
                });

                // Select this slot
                this.classList.add('selected');

                const selectedTime = this.dataset.time;
                bookingState.time = selectedTime;

                // Update selected time display
                document.getElementById('selectedTimeValue').textContent = selectedTime + ' Uhr';
                selectedTimeDisplay.style.display = 'flex';

                updateSummary();
                enableNextButton(4);
            });
        });
    }

    // Form Validation - Step 5
    function clearFieldErrors() {
        document.querySelectorAll('#step5 .field-error').forEach(el => el.classList.remove('visible'));
        document.querySelectorAll('#step5 .form-group').forEach(el => el.classList.remove('has-error'));
        document.querySelector('#step5 .terms-checkbox')?.classList.remove('has-error');
    }

    function showFieldError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (input) input.closest('.form-group')?.classList.add('has-error');
        if (error) error.classList.add('visible');
    }

    function validateStep5() {
        clearFieldErrors();
        let valid = true;

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const termsAccept = document.getElementById('termsAccept').checked;

        // Check required fields
        if (!firstName) {
            showFieldError('firstName', 'firstNameError');
            valid = false;
        }
        if (!lastName) {
            showFieldError('lastName', 'lastNameError');
            valid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showFieldError('email', 'emailError');
            valid = false;
        }

        // Check phone if SMS/WhatsApp selected
        const smsReminder = document.getElementById('smsReminder').checked;
        const whatsappReminder = document.getElementById('whatsappReminder').checked;
        if ((smsReminder || whatsappReminder) && !phone) {
            showFieldError('phone', 'phoneError');
            valid = false;
        }

        // Check terms
        if (!termsAccept) {
            document.querySelector('.terms-checkbox')?.classList.add('has-error');
            document.getElementById('termsError')?.classList.add('visible');
            valid = false;
        }

        if (!valid) {
            const firstError = document.querySelector('#step5 .field-error.visible');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }

        // Save data
        bookingState.firstName = firstName;
        bookingState.lastName = lastName;
        bookingState.email = email;
        bookingState.phone = phone;
        bookingState.emailReminder = document.getElementById('emailReminder').checked;
        bookingState.smsReminder = smsReminder;
        bookingState.whatsappReminder = whatsappReminder;
        bookingState.notes = document.getElementById('notes').value.trim();

        return true;
    }

    // Form input handlers for step 5
    const step5Inputs = document.querySelectorAll('#step5 input[required]');
    const termsCheckbox = document.getElementById('termsAccept');

    function checkStep5Validity() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const termsAccept = termsCheckbox?.checked;

        const isValid = firstName && lastName && email && termsAccept;
        const nextBtn = document.querySelector('#step5 .next-step');
        if (nextBtn) {
            nextBtn.disabled = !isValid;
        }
    }

    step5Inputs.forEach(input => {
        input.addEventListener('input', function() {
            checkStep5Validity();
            this.closest('.form-group')?.classList.remove('has-error');
            const error = this.closest('.form-group')?.querySelector('.field-error');
            if (error) error.classList.remove('visible');
        });
    });

    termsCheckbox?.addEventListener('change', function() {
        checkStep5Validity();
        document.querySelector('.terms-checkbox')?.classList.remove('has-error');
        document.getElementById('termsError')?.classList.remove('visible');
    });

    // SMS/WhatsApp notification toggle - show phone hint
    const smsToggle = document.getElementById('smsReminder');
    const whatsappToggle = document.getElementById('whatsappReminder');
    const phoneNote = document.getElementById('phoneNote');

    function updatePhoneHint() {
        if (smsToggle?.checked || whatsappToggle?.checked) {
            phoneNote.style.display = 'flex';
        } else {
            phoneNote.style.display = 'none';
        }
    }

    smsToggle?.addEventListener('change', updatePhoneHint);
    whatsappToggle?.addEventListener('change', updatePhoneHint);

    // Submit Booking
    function submitBooking() {
        // Generate booking number
        const bookingNumber = generateBookingNumber();

        // Build services string
        const servicesString = bookingState.services.map(s => s.name).join(', ');

        // In a real app, this would send data to a server
        console.log('Booking submitted:', bookingState);

        // Update confirmation page
        document.getElementById('bookingNumber').textContent = bookingNumber;
        document.getElementById('confirmService').textContent = servicesString;
        document.getElementById('confirmStylist').textContent = bookingState.stylistName;
        document.getElementById('confirmDate').textContent = formatDateLong(bookingState.date);
        document.getElementById('confirmTime').textContent = bookingState.time + ' Uhr';
        document.getElementById('confirmDuration').textContent = bookingState.totalDuration + ' Minuten';
        document.getElementById('confirmPrice').textContent = 'ab ' + bookingState.totalPrice + '€';
        document.getElementById('confirmEmail').textContent = bookingState.email;

        // Go to confirmation step
        goToStep(6);

        // Simulate sending email
        sendConfirmationEmail(bookingState, bookingNumber);
    }

    // Generate Booking Number
    function generateBookingNumber() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 9000) + 1000;
        return `#LV-${year}-${random}`;
    }

    // Simulate sending confirmation email
    function sendConfirmationEmail(booking, bookingNumber) {
        console.log('Sending confirmation email to:', booking.email);
        console.log('Booking details:', {
            number: bookingNumber,
            name: `${booking.firstName} ${booking.lastName}`,
            gender: booking.genderName,
            services: booking.services.map(s => s.name),
            serviceWishes: booking.serviceWishes,
            stylist: booking.stylistName,
            date: formatDateLong(booking.date),
            time: booking.time,
            totalDuration: booking.totalDuration,
            totalPrice: booking.totalPrice,
            reminders: {
                email: booking.emailReminder,
                sms: booking.smsReminder,
                whatsapp: booking.whatsappReminder
            }
        });

        // In a real app, you would call an API here
    }

    // Update Summary
    function updateSummary() {
        const summaryService = document.getElementById('summaryService');
        const summaryStylist = document.getElementById('summaryStylist');
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');
        const summaryDuration = document.getElementById('summaryDuration');
        const summaryPrice = document.getElementById('summaryPrice');

        if (summaryService) {
            if (bookingState.services.length === 0) {
                summaryService.querySelector('.item-value').textContent = 'Bitte wählen';
            } else if (bookingState.services.length === 1) {
                summaryService.querySelector('.item-value').textContent = bookingState.services[0].name;
            } else {
                summaryService.querySelector('.item-value').textContent =
                    bookingState.services.length + ' Services';
            }
        }

        if (summaryStylist) {
            summaryStylist.querySelector('.item-value').textContent =
                bookingState.stylistName || 'Bitte wählen';
        }

        if (summaryDate) {
            summaryDate.querySelector('.item-value').textContent =
                bookingState.date ? formatDateShort(bookingState.date) : 'Bitte wählen';
        }

        if (summaryTime) {
            summaryTime.querySelector('.item-value').textContent =
                bookingState.time ? bookingState.time + ' Uhr' : 'Bitte wählen';
        }

        if (summaryDuration) {
            summaryDuration.querySelector('.item-value').textContent =
                bookingState.totalDuration > 0 ? bookingState.totalDuration + ' Min.' : '-';
        }

        if (summaryPrice) {
            summaryPrice.querySelector('.item-value').textContent =
                bookingState.totalPrice > 0 ? 'ab ' + bookingState.totalPrice + '€' : '-';
        }
    }

    // Add to Calendar
    document.getElementById('addToCalendar')?.addEventListener('click', function() {
        const servicesString = bookingState.services.map(s => s.name).join(', ');

        const event = {
            title: `Coiffeur LaVie - ${servicesString}`,
            description: `Termin bei ${bookingState.stylistName}${bookingState.serviceWishes ? '\n\nWünsche: ' + bookingState.serviceWishes : ''}`,
            location: 'Coiffeur LaVie, Bahnhofstraße 71, 56422 Wirges',
            start: formatCalendarDate(bookingState.date, bookingState.time),
            duration: bookingState.totalDuration
        };

        // Generate ICS file content
        const icsContent = generateICS(event);

        // Download ICS file
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'coiffeur-lavie-termin.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    // Generate ICS file content
    function generateICS(event) {
        const start = new Date(event.start);
        const end = new Date(start.getTime() + event.duration * 60000);

        const formatICSDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Coiffeur LaVie//Booking//DE
BEGIN:VEVENT
UID:${Date.now()}@coiffeur-lavie.de
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
    }

    // Utility Functions
    function formatTime(hours, minutes) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    function formatDateShort(date) {
        return new Intl.DateTimeFormat('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    }

    function formatDateLong(date) {
        return new Intl.DateTimeFormat('de-DE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }

    function formatCalendarDate(date, time) {
        const [hours, minutes] = time.split(':');
        const newDate = new Date(date);
        newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return newDate;
    }

    // Initialize
    updateSummary();
}
