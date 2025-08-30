// Игровые данные с аудио на узбекском языке
const gameCards = [
    // Картинки отдельных предметов - SO'Z (слова)
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/cff9786b5c55b3e2279ca47565526131', // Мяч
        correctAnswer: 'word',
        uzbekText: "To'p",
        audioText: "To'p"
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/307839f3489e6d96919b4fae2911da3f', // Яблоко
        correctAnswer: 'word',
        uzbekText: "Olma",
        audioText: "Olma"
    },
    {
        type: 'word', 
        image: 'https://page.gensparksite.com/v1/base64_upload/34e8ed89d550725f30d5c0a7ab3d8e5f', // Солнце
        correctAnswer: 'word',
        uzbekText: "Quyosh",
        audioText: "Quyosh"
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/6b3d748cd990f844fd4f468aecdf9668', // Птичка
        correctAnswer: 'word',
        uzbekText: "Qush",
        audioText: "Qush"
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/219d0f515902aefd611dbc2c75152b05', // Цветок
        correctAnswer: 'word',
        uzbekText: "Gul",
        audioText: "Gul"
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/1b933396c15d8e3aec7936ad9c0107b4', // Котенок у дома
        correctAnswer: 'word',
        uzbekText: "Mushuk",
        audioText: "Mushuk"
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/1fdba870473c00a08374ba0233fdfa42', // Котенок на траве
        correctAnswer: 'word',
        uzbekText: "Mushuk",
        audioText: "Mushuk"
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/9047c0869a33e9cb12ee2583f8cdbe82', // Дом
        correctAnswer: 'word',
        uzbekText: "Uy",
        audioText: "Uy"
    },
    
    // Сценки и действия - GAP (предложения)
    {
        type: 'sentence',
        image: 'https://page.gensparksite.com/v1/base64_upload/150b51571fcec876fe4ad8a152f3ef03', // Ребенок спит с мишкой
        correctAnswer: 'sentence',
        uzbekText: "Bola uxlaydi",
        audioText: "Bola uxlaydi"
    },
    {
        type: 'sentence', 
        image: 'https://page.gensparksite.com/v1/base64_upload/544343a0091c6f8bb1c004009018fbc2', // Девочка поет
        correctAnswer: 'sentence',
        uzbekText: "Qiz kuylaydi",
        audioText: "Qiz kuylaydi"
    },
    {
        type: 'sentence',
        image: 'https://page.gensparksite.com/v1/base64_upload/23bf49411dde75908263605dd6a1c47d', // Медведь ест яблоко
        correctAnswer: 'sentence',
        uzbekText: "Ayiq olma yeydi",
        audioText: "Ayiq olma yeydi"
    }
];

// Игровые переменные
let currentCardIndex = 0;
let score = 0;
let gameState = 'waiting'; // waiting, answered, correct, incorrect

// Элементы DOM
const cardImage = document.getElementById('cardImage');
const scoreElement = document.getElementById('score');
const goldenGlow = document.getElementById('goldenGlow');
const confetti = document.getElementById('confetti');
const celebration = document.getElementById('celebration');
const gameCard = document.getElementById('gameCard');
const wordBtn = document.getElementById('wordBtn');
const sentenceBtn = document.getElementById('sentenceBtn');
const audioBtn = document.getElementById('audioBtn');

// Аудио система
let currentAudio = null;
let isAudioLoading = false;

// Инициализация игры
function initGame() {
    // Перемешиваем карточки для случайного порядка
    shuffleArray(gameCards);
    currentCardIndex = 0;
    score = 0;
    updateScore();
    showCurrentCard();
}

// Перемешивание массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Показать текущую карточку
function showCurrentCard() {
    if (currentCardIndex >= gameCards.length) {
        // Игра завершена, начинаем заново
        currentCardIndex = 0;
        shuffleArray(gameCards);
    }

    const currentCard = gameCards[currentCardIndex];
    
    // Анимация появления новой карточки
    gameCard.classList.add('slide-in');
    
    // Загружаем изображение
    cardImage.src = currentCard.image;
    cardImage.alt = currentCard.uzbekText;
    
    // Сбрасываем состояние
    gameState = 'waiting';
    goldenGlow.classList.remove('active');
    
    // Активируем кнопки
    wordBtn.disabled = false;
    sentenceBtn.disabled = false;
    wordBtn.style.opacity = '1';
    sentenceBtn.style.opacity = '1';
    
    // Останавливаем предыдущее аудио
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    // Убираем анимацию через время
    setTimeout(() => {
        gameCard.classList.remove('slide-in');
        // Автоматически воспроизводим аудио через 1 секунду
        setTimeout(() => {
            playCardAudio();
        }, 1000);
    }, 800);
}

// Воспроизведение аудио для текущей карточки
function playCardAudio() {
    if (isAudioLoading || currentCardIndex >= gameCards.length) {
        console.log('Аудио уже проигрывается или нет карточек');
        return;
    }
    
    const currentCard = gameCards[currentCardIndex];
    console.log('Воспроизведение аудио для:', currentCard.audioText);
    
    try {
        isAudioLoading = true;
        audioBtn.classList.add('playing');
        
        // Останавливаем предыдущее аудио
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        
        // Используем Web Speech API напрямую
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(currentCard.audioText);
            
            // Настройки для узбекского языка
            utterance.lang = 'uz-UZ';
            utterance.rate = 0.8; // Медленная речь для детей
            utterance.pitch = 1.1;
            utterance.volume = 1.0;
            
            // Попробуем найти подходящий голос
            const voices = speechSynthesis.getVoices();
            console.log('Доступные голоса:', voices.map(v => `${v.name} (${v.lang})`));
            
            const uzbekVoice = voices.find(voice => 
                voice.lang.includes('uz') || 
                voice.lang.includes('tr') || 
                voice.name.toLowerCase().includes('uzbek') ||
                voice.name.toLowerCase().includes('turkish')
            );
            
            if (uzbekVoice) {
                utterance.voice = uzbekVoice;
                console.log('Используем голос:', uzbekVoice.name);
            } else {
                console.log('Используем голос по умолчанию');
            }
            
            utterance.onstart = () => {
                console.log('Аудио начато');
            };
            
            utterance.onend = () => {
                console.log('Аудио завершено');
                audioBtn.classList.remove('playing');
                isAudioLoading = false;
            };
            
            utterance.onerror = (event) => {
                console.log('Ошибка аудио:', event.error);
                // Если ошибка synthesis-failed, попробуем еще раз с английским голосом
                if (event.error === 'synthesis-failed') {
                    console.log('Пробуем с английским голосом');
                    const englishUtterance = new SpeechSynthesisUtterance(currentCard.audioText);
                    englishUtterance.lang = 'en-US';
                    englishUtterance.rate = 0.8;
                    englishUtterance.pitch = 1.1;
                    
                    englishUtterance.onend = () => {
                        audioBtn.classList.remove('playing');
                        isAudioLoading = false;
                    };
                    
                    englishUtterance.onerror = () => {
                        audioBtn.classList.remove('playing');
                        isAudioLoading = false;
                    };
                    
                    speechSynthesis.speak(englishUtterance);
                } else {
                    audioBtn.classList.remove('playing');
                    isAudioLoading = false;
                }
            };
            
            speechSynthesis.speak(utterance);
        } else {
            console.log('Speech Synthesis не поддерживается');
            audioBtn.classList.remove('playing');
            isAudioLoading = false;
        }
        
    } catch (error) {
        console.log('Ошибка воспроизведения:', error);
        audioBtn.classList.remove('playing');
        isAudioLoading = false;
    }
}



// Обработка выбора ответа
function selectAnswer(userAnswer) {
    if (gameState !== 'waiting') return;
    
    const currentCard = gameCards[currentCardIndex];
    const isCorrect = userAnswer === currentCard.correctAnswer;
    
    gameState = isCorrect ? 'correct' : 'incorrect';
    
    // Отключаем кнопки
    wordBtn.disabled = true;
    sentenceBtn.disabled = true;
    
    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer(userAnswer);
    }
}

// Обработка правильного ответа
function handleCorrectAnswer() {
    // Увеличиваем счет
    score++;
    updateScore();
    
    // Золотое сияние
    goldenGlow.classList.add('active');
    
    // Эффект конфетти
    showConfetti();
    
    // Анимация праздника
    showCelebration();
    
    // Звук успеха "Ajoyib zo'r!"
    playSuccessSound();
    
    // Вибрация (если поддерживается)
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    // Автоматически переходим к следующей карточке через 2.5 секунды
    setTimeout(() => {
        nextCard();
    }, 2500);
}

// Обработка неправильного ответа
function handleIncorrectAnswer(userAnswer) {
    // Показываем правильный ответ визуально
    const correctBtn = gameCards[currentCardIndex].correctAnswer === 'word' ? wordBtn : sentenceBtn;
    const wrongBtn = userAnswer === 'word' ? wordBtn : sentenceBtn;
    
    // Подсвечиваем правильный ответ зеленым
    correctBtn.style.backgroundColor = '#4CAF50';
    correctBtn.style.transform = 'scale(1.1)';
    
    // Подсвечиваем неправильный ответ красным
    wrongBtn.style.backgroundColor = '#f44336';
    wrongBtn.style.transform = 'scale(0.9)';
    
    // Звук ошибки (мягкий для детей)
    playErrorSound();
    
    // Легкая вибрация ошибки
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
    
    // Повторяем аудио правильного ответа через 1 секунду
    setTimeout(() => {
        playCardAudio();
    }, 1000);
    
    // Автоматически переходим к следующей карточке через 4 секунды
    setTimeout(() => {
        resetButtonStyles();
        nextCard();
    }, 4000);
}

// Сброс стилей кнопок
function resetButtonStyles() {
    wordBtn.style.backgroundColor = '';
    sentenceBtn.style.backgroundColor = '';
    wordBtn.style.transform = '';
    sentenceBtn.style.transform = '';
}

// Переход к следующей карточке
function nextCard() {
    console.log('Переход к следующей карточке');
    
    // Останавливаем любое аудио
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    isAudioLoading = false;
    audioBtn.classList.remove('playing');
    
    // Анимация исчезновения
    gameCard.classList.add('slide-out');
    
    setTimeout(() => {
        gameCard.classList.remove('slide-out');
        currentCardIndex++;
        resetButtonStyles();
        showCurrentCard();
    }, 500);
}

// Обновление счета
function updateScore() {
    scoreElement.textContent = score;
    
    // Анимация увеличения счета
    scoreElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
    }, 300);
}

// Показать конфетти
function showConfetti() {
    // Создаем частицы конфетти
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '-10px';
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        confetti.appendChild(particle);
        
        // Анимация падения
        const duration = Math.random() * 2000 + 1000;
        const rotation = Math.random() * 360;
        const drift = (Math.random() - 0.5) * 200;
        
        particle.animate([
            { 
                transform: `translateY(-10px) rotate(0deg)`, 
                opacity: 1 
            },
            { 
                transform: `translateY(100vh) translateX(${drift}px) rotate(${rotation}deg)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// Показать празднование
function showCelebration() {
    celebration.classList.add('active');
    
    setTimeout(() => {
        celebration.classList.remove('active');
    }, 2000);
}

// Обработка ошибок загрузки изображений
cardImage.onerror = function() {
    console.log('Ошибка загрузки изображения:', cardImage.src);
    // Показываем заглушку
    cardImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE2Ij7QmtCw0YDRgtC40L3QutCwPC90ZXh0Pgo8L3N2Zz4=';
};

// Предзагрузка изображений
function preloadImages() {
    gameCards.forEach(card => {
        const img = new Image();
        img.src = card.image;
    });
}

// Обработка касаний для мобильных устройств
document.addEventListener('touchstart', function() {}, { passive: true });
document.addEventListener('touchend', function() {}, { passive: true });

// Предотвращение зума при двойном тапе
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Инициализация голосов для TTS
function initVoices() {
    if ('speechSynthesis' in window) {
        // Загружаем голоса
        const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            console.log('Доступные голоса:', voices.map(v => `${v.name} (${v.lang})`));
            
            // Если голосов нет, используем резервный подход
            if (voices.length === 0) {
                console.log('Голоса еще не загружены, будем использовать голос по умолчанию');
            }
        };
        
        speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices(); // Загружаем сразу, если уже доступны
        
        // Дополнительная попытка через секунду
        setTimeout(loadVoices, 1000);
    }
}

// Добавляем обработчики событий
function addEventListeners() {
    // Обработчик клика на карточку
    gameCard.addEventListener('click', function(event) {
        console.log('Клик на карточку');
        // Если клик был не по кнопке аудио
        if (!event.target.closest('.audio-btn')) {
            playCardAudio();
        }
    });
    
    // Обработчик клика на кнопку аудио
    audioBtn.addEventListener('click', function(event) {
        console.log('Клик на кнопку аудио');
        event.stopPropagation(); // Останавливаем всплытие события
        playCardAudio();
    });
}

// Запуск игры
document.addEventListener('DOMContentLoaded', function() {
    initVoices();
    preloadImages();
    addEventListeners();
    initGame();
});

// Звуковые эффекты
function playSuccessSound() {
    console.log('Воспроизведение звука успеха');
    if ('speechSynthesis' in window) {
        // Останавливаем предыдущую речь
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance('Ajoyib zor!');
        utterance.lang = 'uz-UZ';
        utterance.rate = 1.0;
        utterance.pitch = 1.3;
        utterance.volume = 0.8;
        
        const voices = speechSynthesis.getVoices();
        const uzbekVoice = voices.find(voice => 
            voice.lang.includes('uz') || 
            voice.lang.includes('tr') ||
            voice.name.toLowerCase().includes('turkish')
        );
        
        if (uzbekVoice) {
            utterance.voice = uzbekVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
}

function playErrorSound() {
    console.log('Воспроизведение звука ошибки');
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Qaytadan urinib koring');
        utterance.lang = 'uz-UZ';
        utterance.rate = 0.8;
        utterance.pitch = 0.9;
        utterance.volume = 0.7;
        
        const voices = speechSynthesis.getVoices();
        const uzbekVoice = voices.find(voice => 
            voice.lang.includes('uz') || 
            voice.lang.includes('tr') ||
            voice.name.toLowerCase().includes('turkish')
        );
        
        if (uzbekVoice) {
            utterance.voice = uzbekVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
}

// Для Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    
    // Отключаем кнопку "Назад" в Telegram
    window.Telegram.WebApp.disableClosingConfirmation();
}