// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
// Modal functionality
const modal = document.getElementById('reportModal');
const reportFrame = document.getElementById('reportFrame');
const closeModal = document.getElementById('closeModal');
const reportCards = document.querySelectorAll('.report-card');

// Open modal when clicking on report card
reportCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Prevent opening if clicking on the button (it has its own handler)
        if (e.target.closest('.btn')) {
            return;
        }
        const reportPath = card.getAttribute('data-report');
        reportFrame.src = reportPath;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Track card click
        ym(105512416, 'reachGoal', 'view_report_card');
    });

    const button = card.querySelector('.btn');
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click from firing
        const reportPath = card.getAttribute('data-report');
        reportFrame.src = reportPath;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    reportFrame.src = '';
    document.body.style.overflow = '';
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        reportFrame.src = '';
        document.body.style.overflow = '';
    }
});

// Thank You Modal functionality
const thankYouModal = document.getElementById('thankYouModal');
const closeThankYouModal = document.getElementById('closeThankYouModal');
const closeThankYouBtn = document.getElementById('closeThankYouBtn');

// Close thank you modal
if (closeThankYouModal) {
    closeThankYouModal.addEventListener('click', () => {
        if (thankYouModal) {
            thankYouModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

if (closeThankYouBtn) {
    closeThankYouBtn.addEventListener('click', () => {
        if (thankYouModal) {
            thankYouModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Close thank you modal when clicking outside
if (thankYouModal) {
    thankYouModal.addEventListener('click', (e) => {
        if (e.target === thankYouModal) {
            thankYouModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            reportFrame.src = '';
            document.body.style.overflow = '';
        }
        if (analysisModal && analysisModal.classList.contains('active')) {
            analysisModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (thankYouModal && thankYouModal.classList.contains('active')) {
            thankYouModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Analysis Modal functionality
const analysisModal = document.getElementById('analysisModal');
const closeAnalysisModal = document.getElementById('closeAnalysisModal');
const analysisBtns = document.querySelectorAll('.js-open-analysis-modal');
const analysisForm = document.getElementById('analysisForm');

// Open analysis modal
if (analysisBtns.length > 0) {
    analysisBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (analysisModal) {
                analysisModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

// Close analysis modal
if (closeAnalysisModal && analysisModal) {
    closeAnalysisModal.addEventListener('click', () => {
        analysisModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close analysis modal when clicking outside
if (analysisModal) {
    analysisModal.addEventListener('click', (e) => {
        if (e.target === analysisModal) {
            analysisModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Contact Method Switching
const methodBtns = document.querySelectorAll('.contact-method-btn');
const contactInputs = {
    'email': document.getElementById('contactEmail'),
    'telegram': document.getElementById('contactTelegram'),
    'whatsapp': document.getElementById('contactWhatsapp')
};
const selectedMethodInput = document.getElementById('selectedMethod');

if (methodBtns.length > 0 && selectedMethodInput) {
    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update buttons
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update inputs
            const method = btn.getAttribute('data-method');
            selectedMethodInput.value = method;

            Object.values(contactInputs).forEach(input => {
                if (input) {
                    input.classList.remove('active');
                    input.required = false;
                }
            });

            const activeInput = contactInputs[method];
            if (activeInput) {
                activeInput.classList.add('active');
                activeInput.required = true;
                activeInput.focus();
            }
        });
    });
}

// Phone Mask Logic
const phoneInput = document.getElementById('contactWhatsapp');

if (phoneInput) {
    const formatPhone = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/\D/g, '');

        // We always start with +7
        if (phoneNumber.length < 1) return '+7';

        let numbers = phoneNumber;
        if (phoneNumber.startsWith('7')) {
            numbers = phoneNumber.substring(1);
        }

        // Limit max length
        numbers = numbers.substring(0, 10);

        let formatted = '+7';
        if (numbers.length > 0) {
            formatted += ' ' + numbers.substring(0, 3);
        }
        if (numbers.length >= 4) {
            formatted += '-' + numbers.substring(3, 6);
        }
        if (numbers.length >= 7) {
            formatted += '-' + numbers.substring(6, 8);
        }
        if (numbers.length >= 9) {
            formatted += '-' + numbers.substring(8, 10);
        }

        return formatted;
    };

    phoneInput.addEventListener('input', (e) => {
        const formatted = formatPhone(e.target.value);
        e.target.value = formatted;
    });

    // Focus handler to ensure +7 is there
    phoneInput.addEventListener('focus', (e) => {
        if (!e.target.value) {
            e.target.value = '+7 ';
        }
    });
}

// CTA Form functionality
const ctaContactSelector = document.querySelector('.cta-contact-selector');
const ctaWhatsappInput = document.getElementById('ctaWhatsapp');
const ctaPhoneInput = document.getElementById('ctaPhone');
const ctaTelegramInput = document.getElementById('ctaTelegram');
const ctaMethodBtns = document.querySelectorAll('.cta-contact-selector .contact-method-btn');
const ctaSubmitBtn = document.querySelector('.cta-submit-btn');

// Инициализация: показываем поле WhatsApp по умолчанию, скрываем остальные
if (ctaWhatsappInput) {
    ctaWhatsappInput.style.display = 'block';
}
if (ctaPhoneInput) {
    ctaPhoneInput.style.display = 'none';
}
if (ctaTelegramInput) {
    ctaTelegramInput.style.display = 'none';
}

// Format phone for CTA input
const formatCtaPhone = (value) => {
    if (!value) return '';
    const phoneNumber = value.replace(/\D/g, '');

    // Если нет цифр, возвращаем пустую строку (чтобы плейсхолдер оставался видимым)
    if (phoneNumber.length < 1) return '';

    let numbers = phoneNumber;
    if (phoneNumber.startsWith('7')) {
        numbers = phoneNumber.substring(1);
    }

    // Limit max length
    numbers = numbers.substring(0, 10);

    // Если после обработки нет цифр, возвращаем пустую строку
    if (numbers.length < 1) return '';

    let formatted = '+7';
    if (numbers.length > 0) {
        formatted += ' (' + numbers.substring(0, 3);
    }
    if (numbers.length >= 3) {
        formatted += ')';
    }
    if (numbers.length >= 4) {
        formatted += ' ' + numbers.substring(3, 6);
    }
    if (numbers.length >= 7) {
        formatted += '-' + numbers.substring(6, 8);
    }
    if (numbers.length >= 9) {
        formatted += '-' + numbers.substring(8, 10);
    }

    return formatted;
};

// Phone input formatting for CTA (WhatsApp и Телефон)
const setupPhoneFormatting = (input) => {
    if (!input) return;
    
    input.addEventListener('input', (e) => {
        const inputEl = e.target;
        const value = inputEl.value;
        
        // Форматируем значение
        const formatted = formatCtaPhone(value);
        
        // Устанавливаем отформатированное значение только если оно не пустое
        // Если пустое - поле остается пустым и плейсхолдер виден
        if (formatted) {
            inputEl.value = formatted;
        } else {
            inputEl.value = '';
        }
    });

    // При фокусе не устанавливаем значение, чтобы плейсхолдер оставался видимым
    // Значение будет установлено только при начале ввода через обработчик input
};

// Применяем форматирование к обоим полям телефона
setupPhoneFormatting(ctaWhatsappInput);
setupPhoneFormatting(ctaPhoneInput);

// CTA contact method switching - глобальная функция для доступа из любого места
window.switchContactMethod = function(method) {
    // Получаем элементы динамически для надежности
    const buttons = document.querySelectorAll('.cta-contact-selector .contact-method-btn');
    const whatsappInput = document.getElementById('ctaWhatsapp');
    const phoneInput = document.getElementById('ctaPhone');
    const telegramInput = document.getElementById('ctaTelegram');
    
    // Убираем активный класс со всех кнопок
    buttons.forEach(b => {
        if (b) b.classList.remove('active');
    });
    
    // Добавляем активный класс выбранной кнопке
    buttons.forEach(b => {
        if (b && b.getAttribute('data-method') === method) {
            b.classList.add('active');
        }
    });
    
    // Скрываем все поля сначала
    if (whatsappInput) {
        whatsappInput.style.display = 'none';
        whatsappInput.required = false;
    }
    if (phoneInput) {
        phoneInput.style.display = 'none';
        phoneInput.required = false;
    }
    if (telegramInput) {
        telegramInput.style.display = 'none';
        telegramInput.required = false;
    }
    
    // Показываем нужное поле в зависимости от метода
    if (method === 'telegram' && telegramInput) {
        telegramInput.style.display = 'block';
        telegramInput.required = true;
    } else if (method === 'whatsapp' && whatsappInput) {
        whatsappInput.style.display = 'block';
        whatsappInput.required = true;
    } else if (method === 'phone' && phoneInput) {
        phoneInput.style.display = 'block';
        phoneInput.required = true;
    }
};

// CTA contact method switching - простой и надежный подход
function initCTAMethodSwitching() {
    const buttons = document.querySelectorAll('.cta-contact-selector .contact-method-btn');
    
    if (buttons.length === 0) {
        return;
    }
    
    buttons.forEach(btn => {
        const method = btn.getAttribute('data-method');
        if (!method) return;
        
        // Удаляем все старые обработчики через клонирование
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Добавляем обработчик клика
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (window.switchContactMethod) {
                window.switchContactMethod(method);
            }
        });
        
        // Добавляем обработчик touch
        newBtn.addEventListener('touchend', function(e) {
            e.stopPropagation();
            if (window.switchContactMethod) {
                window.switchContactMethod(method);
            }
        });
    });
}

// Инициализируем несколько раз для надежности
initCTAMethodSwitching();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initCTAMethodSwitching, 100);
    });
} else {
    setTimeout(initCTAMethodSwitching, 100);
}

// Дополнительная инициализация
setTimeout(initCTAMethodSwitching, 500);
setTimeout(initCTAMethodSwitching, 1000);

// CTA submit button - send request directly
if (ctaSubmitBtn) {
    ctaSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const selectedMethod = document.querySelector('.cta-contact-selector .contact-method-btn.active')?.getAttribute('data-method') || 'whatsapp';
        
        let contactValue = '';
        if (selectedMethod === 'telegram' && ctaTelegramInput) {
            contactValue = ctaTelegramInput.value.trim();
            // Проверка на заполненность
            if (!contactValue) {
                alert('Пожалуйста, введите Telegram username');
                return;
            }
            // Автоматически добавляем @ если его нет
            if (!contactValue.startsWith('@')) {
                contactValue = '@' + contactValue;
            }
        } else if (selectedMethod === 'whatsapp' && ctaWhatsappInput) {
            contactValue = ctaWhatsappInput.value.trim();
            // Проверка валидности телефона
            if (!contactValue || contactValue === '+7' || contactValue === '+7 (') {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
        } else if (selectedMethod === 'phone' && ctaPhoneInput) {
            contactValue = ctaPhoneInput.value.trim();
            // Проверка валидности телефона
            if (!contactValue || contactValue === '+7' || contactValue === '+7 (') {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
        }
        
        if (!contactValue) {
            alert('Пожалуйста, заполните поле для связи');
            return;
        }
        
        // Сохраняем оригинальный текст кнопки
        const originalBtnText = ctaSubmitBtn.querySelector('.btn-text')?.textContent || ctaSubmitBtn.textContent;
        
        // Показываем состояние загрузки
        ctaSubmitBtn.disabled = true;
        if (ctaSubmitBtn.querySelector('.btn-text')) {
            ctaSubmitBtn.querySelector('.btn-text').textContent = 'Отправка...';
        } else {
            ctaSubmitBtn.textContent = 'Отправка...';
        }
        
        // Подготовка данных для отправки
        const methodMap = {
            'whatsapp': 'whatsapp',
            'phone': 'phone',
            'telegram': 'telegram'
        };
        
        const formData = {
            contactMethod: methodMap[selectedMethod] || 'whatsapp',
            contactValue: contactValue,
            source: 'CTA Form',
            _subject: `Новая заявка с главной страницы`
        };
        
        try {
            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/manzzbpp';
            
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Открываем модальное окно "спасибо"
                const thankYouModal = document.getElementById('thankYouModal');
                if (thankYouModal) {
                    thankYouModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Отправляем цель в Яндекс.Метрику при открытии модального окна
                    if (typeof ym !== 'undefined') {
                        ym(105512416, 'reachGoal', 'submit_application');
                    }
                }
                
                // Очищаем поля формы
                if (ctaWhatsappInput) ctaWhatsappInput.value = '';
                if (ctaPhoneInput) ctaPhoneInput.value = '';
                if (ctaTelegramInput) ctaTelegramInput.value = '';
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
        } finally {
            // Восстанавливаем кнопку
            ctaSubmitBtn.disabled = false;
            if (ctaSubmitBtn.querySelector('.btn-text')) {
                ctaSubmitBtn.querySelector('.btn-text').textContent = originalBtnText;
            } else {
                ctaSubmitBtn.textContent = originalBtnText;
            }
        }
    });
}

// Handle form submission
if (analysisForm) {
    analysisForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = analysisForm.querySelector('.form-submit-btn');
        const originalBtnText = submitBtn.textContent;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        const caseNumber = document.getElementById('caseNumber')?.value;
        const method = selectedMethodInput?.value;
        const contactValue = contactInputs[method]?.value;

        // Data to send
        const formData = {
            caseNumber: caseNumber,
            contactMethod: method,
            contactValue: contactValue,
            _subject: `Новая заявка на анализ: ${caseNumber}`
        };

        // Если выбран способ связи Email, добавляем поле email специально для Formspree
        // Это повышает доверие антиспам-фильтров и позволяет отвечать на письмо кнопкой "Ответить"
        if (method === 'email') {
            formData.email = contactValue;
        }

        try {
            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/manzzbpp';

            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Show success state
                const methodNames = {
                    'email': 'Email',
                    'telegram': 'Telegram',
                    'whatsapp': 'WhatsApp'
                };
                const methodName = methodNames[method] || method;

                analysisForm.innerHTML = `
                    <div style="text-align: center; padding: 40px 0;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">✅</div>
                        <h3 style="margin-bottom: 10px;">Заявка принята!</h3>
                        <p style="color: var(--text-muted);">Мы уже начали анализ дела ${caseNumber || 'без указания номера'}.<br>Отчет придет на ${methodName}.</p>
                        <button type="button" class="btn btn-primary" style="margin-top: 20px;" onclick="location.reload()">Закрыть</button>
                    </div>
                `;

                // Send goal to Yandex Metrica when success screen is shown
                if (typeof ym !== 'undefined') {
                    ym(105512416, 'reachGoal', 'submit_application');
                }
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

}); // Конец DOMContentLoaded

