// Игровые данные с аудио на узбекском языке
const gameCards = [
    // Картинки отдельных предметов - SO'Z (слова)
    {
        type: 'word',
        image: 'assets/img/top_ball.png', // Мяч
        correctAnswer: 'word',
        uzbekText: "To'p",
        audioFile: "assets/audio/top_ball.mp3"
    },
    {
        type: 'word',
        image: 'assets/img/olma_apple.png', // Яблоко
        correctAnswer: 'word',
        uzbekText: "Olma",
        audioFile: "assets/audio/olma_apple.mp3"
    },
    {
        type: 'word', 
        image: 'assets/img/quyosh_sun.png', // Солнце
        correctAnswer: 'word',
        uzbekText: "Quyosh",
        audioFile: "assets/audio/quyosh_sun.mp3"
    },
    {
        type: 'word',
        image: 'assets/img/qush_bird.png', // Птичка
        correctAnswer: 'word',
        uzbekText: "Qush",
        audioFile: "assets/audio/qush_bird.mp3"
    },
    {
        type: 'word',
        image: 'assets/img/gul_flower.png', // Цветок
        correctAnswer: 'word',
        uzbekText: "Gul",
        audioFile: "assets/audio/gul_flower.mp3"
    },
    {
        type: 'word',
        image: 'assets/img/mushuk_cat.png', // Котенок у дома
        correctAnswer: 'word',
        uzbekText: "Mushuk",
        audioFile: "assets/audio/mushuk_cat.mp3"
    },
    {
        type: 'word',
        image: 'assets/img/uy_house.png', // Дом
        correctAnswer: 'word',
        uzbekText: "Uy",
        audioFile: "assets/audio/uy_house.mp3"
    },
    
    // Сценки и действия - GAP (предложения)
    {
        type: 'sentence',
        image: 'assets/img/bola_uxlaydi.png', // Ребенок спит с мишкой
        correctAnswer: 'sentence',
        uzbekText: "Bola uxlaydi",
        audioFile: "assets/audio/bola_uxlaydi.mp3"
    },
    {
        type: 'sentence', 
        image: 'assets/img/qiz_kuylaydi.png', // Девочка поет
        correctAnswer: 'sentence',
        uzbekText: "Qiz kuylaydi",
        audioFile: "assets/audio/qiz_kuylaydi.mp3"
    },
    {
        type: 'sentence',
        image: 'assets/img/ayiq_olma_yeydi.png', // Медведь ест яблоко
        correctAnswer: 'sentence',
        uzbekText: "Ayiq olma yeydi",
        audioFile: "assets/audio/ayiq_olma_yeydi.mp3"
    }
];

// Игровые переменные
let currentCardIndex = 0;
let score = 0;
let totalQuestions = 0;
let gameState = 'waiting'; // waiting, answered, correct, incorrect, completed

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
const gameCompleteScreen = document.getElementById('gameCompleteScreen');
const restartBtn = document.getElementById('restartBtn');

// Аудио система
let currentAudio = null;
let isAudioLoading = false;

// Инициализация игры
function initGame() {
    // Перемешиваем карточки для случайного порядка
    shuffleArray(gameCards);
    currentCardIndex = 0;
    score = 0;
    totalQuestions = gameCards.length;
    gameState = 'waiting';
    
    // Скрываем экран завершения если он показан
    gameCompleteScreen.style.display = 'none';
    gameCompleteScreen.classList.remove('active');
    
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
        // Игра завершена, показываем результат
        showGameComplete();
        return;
    }

    const currentCard = gameCards[currentCardIndex];
    console.log('🎴 Карточка:', currentCard.uzbekText, '(тип:', currentCard.type + ')');
    
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
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    isAudioLoading = false;
    audioBtn.classList.remove('playing');
    
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
    console.log('Воспроизведение аудио для:', currentCard.uzbekText);
    
    try {
        isAudioLoading = true;
        audioBtn.classList.add('playing');
        
        // Останавливаем предыдущее аудио если есть
        if (currentAudio && !currentAudio.paused) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        
        // Создаем новый аудио элемент
        currentAudio = new Audio(currentCard.audioFile);
        
        // Настройки для мобильных устройств
        currentAudio.preload = 'auto';
        currentAudio.volume = 1.0;
        
        // Обработчики событий
        currentAudio.onloadstart = () => {
            console.log('🔄 Загрузка аудио начата:', currentCard.audioFile);
        };
        
        currentAudio.oncanplay = () => {
            console.log('✅ Аудио готово к воспроизведению');
        };
        
        currentAudio.onplay = () => {
            console.log('▶️ Аудио начато');
        };
        
        currentAudio.onended = () => {
            console.log('✅ Аудио завершено');
            audioBtn.classList.remove('playing');
            isAudioLoading = false;
        };
        
        currentAudio.onerror = (event) => {
            console.log('❌ Ошибка загрузки аудио:', event);
            console.log('Файл:', currentCard.audioFile);
            audioBtn.classList.remove('playing');
            isAudioLoading = false;
            
            // Показываем уведомление пользователю
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        };
        
        // Запускаем воспроизведение
        const playPromise = currentAudio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('🎵 Воспроизведение успешно запущено');
                })
                .catch(error => {
                    console.log('❌ Ошибка воспроизведения:', error);
                    audioBtn.classList.remove('playing');
                    isAudioLoading = false;
                    
                    // Для мобильных - может потребоваться взаимодействие пользователя
                    if (error.name === 'NotAllowedError') {
                        console.log('⚠️ Требуется взаимодействие пользователя для воспроизведения аудио');
                    }
                });
        }
        
    } catch (error) {
        console.log('❌ Критическая ошибка воспроизведения:', error);
        audioBtn.classList.remove('playing');
        isAudioLoading = false;
    }
}



// Обработка выбора ответа
function selectAnswer(userAnswer) {
    console.log('Выбран ответ:', userAnswer, 'Состояние игры:', gameState);
    
    if (gameState !== 'waiting') {
        console.log('Игра не в состоянии ожидания, игнорируем клик');
        return;
    }
    
    const currentCard = gameCards[currentCardIndex];
    const isCorrect = userAnswer === currentCard.correctAnswer;
    console.log('Ответ правильный:', isCorrect);
    
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
    console.log('✅ Правильный ответ! Переход через 2.5 сек');
    
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
    
    // Принудительный переход через 2.5 секунды  
    const transitionTimer = setTimeout(() => {
        console.log('⏰ Таймер сработал - переходим к следующей карточке');
        nextCard();
    }, 2500);
    
    // Сохраняем таймер для возможной очистки
    window.currentTransitionTimer = transitionTimer;
    
    // Дублирующий таймер на случай сбоя
    setTimeout(() => {
        if (false && gameState === 'correct') {
            console.log('🔄 Дублирующий таймер - принудительный переход');
            nextCard();
        }
    }, 3000);
}

// Обработка неправильного ответа
function handleIncorrectAnswer(userAnswer) {
    console.log('❌ Неправильный ответ. Повтор + переход через 4 сек');
    
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
    
    // Принудительный переход через 4 секунды
    const transitionTimer = setTimeout(() => {
        console.log('⏰ Таймер сработал - сбрасываем стили и переходим');
        resetButtonStyles();
        nextCard();
    }, 4000);
    
    // Сохраняем таймер
    window.currentTransitionTimer = transitionTimer;
    
    // Дублирующий таймер на случай сбоя  
    setTimeout(() => {
        if (false && gameState === 'incorrect') {
            console.log('🔄 Дублирующий таймер - принудительный переход');
            resetButtonStyles();
            nextCard();
        }
    }, 4500);
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
    console.log('🔄 Следующая карточка... Текущий индекс:', currentCardIndex);
    
    // Очищаем предыдущие таймеры если есть
    if (window.currentTransitionTimer) {
        clearTimeout(window.currentTransitionTimer);
        window.currentTransitionTimer = null;
    }
    
    // Останавливаем любое аудио
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    isAudioLoading = false;
    audioBtn.classList.remove('playing');
    
    // Сбрасываем золотое сияние
    goldenGlow.classList.remove('active');
    
    // Анимация исчезновения
    gameCard.classList.add('slide-out');
    
    setTimeout(() => {
        console.log('🎴 Переходим от карточки', currentCardIndex, 'к', currentCardIndex + 1);
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

// Предзагрузка аудиофайлов для лучшей производительности
function preloadAudioFiles() {
    console.log('🔄 Предзагрузка аудиофайлов...');
    
    gameCards.forEach((card, index) => {
        if (card.audioFile) {
            const audio = new Audio(card.audioFile);
            audio.preload = 'metadata'; // Загружаем только метаданные для экономии трафика
            
            audio.onloadedmetadata = () => {
                console.log(`✅ Предзагружено аудио ${index + 1}/${gameCards.length}: ${card.uzbekText}`);
            };
            
            audio.onerror = (error) => {
                console.log(`❌ Ошибка предзагрузки аудио для "${card.uzbekText}":`, error);
            };
        }
    });
    
    // Предзагружаем поздравление
    const successAudio = new Audio('assets/audio/ajoyib_zor.mp3');
    successAudio.preload = 'metadata';
    successAudio.onloadedmetadata = () => {
        console.log('✅ Предзагружено поздравление');
    };
    
    // Предзагружаем финальное сообщение
    const finalAudio = new Audio('assets/audio/barakalla_message.mp3');
    finalAudio.preload = 'metadata';
    finalAudio.onloadedmetadata = () => {
        console.log('✅ Предзагружено финальное сообщение');
    };
}

// Добавляем обработчики событий
function addEventListeners() {
    // Обработчик клика на карточку
    gameCard.addEventListener('click', function(event) {
        // Если клик был не по кнопке аудио и не по кнопкам ответов
        if (!event.target.closest('.audio-btn') && !event.target.closest('.answer-btn')) {
            console.log('🎵 Клик на карточку - воспроизведение');
            playCardAudio();
        }
    });
    
    // Обработчик клика на кнопку аудио
    audioBtn.addEventListener('click', function(event) {
        console.log('🔊 Кнопка аудио');
        event.stopPropagation();
        playCardAudio();
    });
    
    // Обработчик клика на кнопку SO'Z
    wordBtn.addEventListener('click', function(event) {
        console.log('📝 Выбор: SO\'Z');
        event.stopPropagation();
        selectAnswer('word');
    });
    
    // Обработчик клика на кнопку GAP
    sentenceBtn.addEventListener('click', function(event) {
        console.log('📝 Выбор: GAP');
        event.stopPropagation();
        selectAnswer('sentence');
    });
    
    // Обработчик для кнопки перезапуска
    restartBtn.addEventListener('click', function(event) {
        console.log('🔄 Перезапуск игры');
        event.stopPropagation();
        restartGame();
    });
}

// Запуск игры
document.addEventListener('DOMContentLoaded', function() {
    preloadAudioFiles();
    preloadImages();
    addEventListeners();
    initGame();
    
    // Инициализация аудиоконтекста для мобильных устройств
    initMobileAudio();
});

// Инициализация аудио для мобильных устройств
function initMobileAudio() {
    // На мобильных устройствах аудио может требовать пользовательского взаимодействия
    const unlockAudio = () => {
        console.log('🔓 Разблокировка аудио для мобильных устройств');
        
        // Создаем тихий звук для разблокировки
        const silence = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSxuzu3WfCsII3THsd+OPwgXZrns5KFQDQ1BnODwxGwkfCF1yO3YgC0JK2671OyWQAlZpeDnpm8MEl+YzPLPfC4MG3PHstqAQAYfaP3f0IfRC5BhYRZ+4KRaGAh5yNr1zkEFNGa93tNOPS0BLPLI9d5/QggS/PBgIMR8GkCGYmfrLKAjrAJYK+naqk4PBhjKy+fQcicHLHDO8WBPL7nbuhQ');
        silence.volume = 0.01;
        
        const playPromise = silence.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('✅ Аудио разблокировано для мобильных устройств');
                    
                    // Удаляем обработчики после успешной разблокировки
                    document.removeEventListener('touchstart', unlockAudio);
                    document.removeEventListener('touchend', unlockAudio);
                    document.removeEventListener('mousedown', unlockAudio);
                    document.removeEventListener('keydown', unlockAudio);
                })
                .catch(error => {
                    console.log('⚠️ Не удалось разблокировать аудио:', error);
                });
        }
    };
    
    // Добавляем обработчики для разблокировки аудио
    document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    document.addEventListener('touchend', unlockAudio, { once: true, passive: true });
    document.addEventListener('mousedown', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
}

// Звуковые эффекты
function playSuccessSound() {
    console.log('🎉 Воспроизведение звука успеха');
    
    try {
        // Останавливаем текущее аудио
        if (currentAudio && !currentAudio.paused) {
            currentAudio.pause();
        }
        
        // Создаем аудио для поздравления
        const successAudio = new Audio('assets/audio/ajoyib_zor.mp3');
        successAudio.volume = 0.9;
        
        successAudio.onplay = () => {
            console.log('🎊 Поздравление воспроизводится');
        };
        
        successAudio.onerror = (error) => {
            console.log('❌ Ошибка воспроизведения поздравления:', error);
        };
        
        const playPromise = successAudio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('✅ Поздравление успешно воспроизведено');
                })
                .catch(error => {
                    console.log('⚠️ Не удалось воспроизвести поздравление:', error);
                });
        }
        
    } catch (error) {
        console.log('❌ Критическая ошибка воспроизведения поздравления:', error);
    }
}

function playErrorSound() {
    console.log('⚠️ Мягкое уведомление об ошибке (без звука)');
    // Для детей используем только визуальную обратную связь
    // Аудиоповтор правильного ответа происходит в handleIncorrectAnswer()
}

// Показать экран завершения игры
function showGameComplete() {
    console.log('🏆 Игра завершена! Счет:', score, 'из', totalQuestions);
    
    gameState = 'completed';
    
    // Вычисляем процент правильных ответов
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Останавливаем любое аудио
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // Отправляем результат в Telegram если доступно
    sendResultToTelegram(score, totalQuestions, percentage);
    
    // Обновляем данные на экране завершения
    document.getElementById('correctAnswers').textContent = score;
    document.getElementById('totalQuestions').textContent = totalQuestions;
    document.getElementById('percentage').textContent = percentage + '%';
    
    // Обновляем звездочки в зависимости от результата
    const finalStars = document.getElementById('finalStars');
    if (percentage >= 90) {
        finalStars.textContent = '⭐⭐⭐⭐⭐';
    } else if (percentage >= 70) {
        finalStars.textContent = '⭐⭐⭐⭐';
    } else if (percentage >= 50) {
        finalStars.textContent = '⭐⭐⭐';
    } else if (percentage >= 30) {
        finalStars.textContent = '⭐⭐';
    } else {
        finalStars.textContent = '⭐';
    }
    
    // Показываем экран завершения
    gameCompleteScreen.style.display = 'flex';
    
    setTimeout(() => {
        gameCompleteScreen.classList.add('active');
        
        // Воспроизводим финальное сообщение
        setTimeout(() => {
            playFinalMessage();
        }, 800);
    }, 100);
}

// Воспроизвести финальное сообщение
function playFinalMessage() {
    console.log('🎉 Воспроизведение финального сообщения');
    
    try {
        const finalAudio = new Audio('assets/audio/barakalla_message.mp3');
        finalAudio.volume = 0.9;
        
        finalAudio.onplay = () => {
            console.log('🎊 Финальное сообщение воспроизводится');
        };
        
        finalAudio.onerror = (error) => {
            console.log('❌ Ошибка воспроизведения финального сообщения:', error);
        };
        
        const playPromise = finalAudio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('✅ Финальное сообщение успешно воспроизведено');
                })
                .catch(error => {
                    console.log('⚠️ Не удалось воспроизвести финальное сообщение:', error);
                });
        }
        
    } catch (error) {
        console.log('❌ Критическая ошибка воспроизведения финального сообщения:', error);
    }
}

// Перезапуск игры
function restartGame() {
    console.log('🚀 Перезапуск игры');
    
    // Скрываем экран завершения
    gameCompleteScreen.classList.remove('active');
    
    setTimeout(() => {
        gameCompleteScreen.style.display = 'none';
        
        // Перезапускаем игру
        initGame();
    }, 500);
}

// Принудительный переход к следующей карточке
function forceNextCard() {
    console.log('🚀 Принудительный переход к следующей карточке!');
    gameState = 'waiting'; // Сбрасываем состояние
    nextCard();
}

// Отправка результата в чат Telegram
function sendResultToTelegram(score, totalQuestions, percentage) {
    console.log('📱 Отправка результатов в Telegram:', { score, totalQuestions, percentage });
    
    if (window.Telegram && window.Telegram.WebApp) {
        try {
            // Создаем красивое сообщение результата
            const resultMessage = {
                score: score,
                totalQuestions: totalQuestions,
                percentage: percentage,
                timestamp: new Date().toISOString(),
                message: `Barakalla! Siz ${totalQuestions} ta savoldan ${score} tasiga to'g'ri javob berdingiz! (${percentage}%)`
            };
            
            const resultData = JSON.stringify(resultMessage);
            window.Telegram.WebApp.sendData(resultData);
            
            console.log('✅ Результат отправлен в Telegram чат');
        } catch (error) {
            console.log('❌ Ошибка отправки результата в Telegram:', error);
        }
    } else {
        console.log('⚠️ Telegram Web App не доступен');
    }
}

// Для Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    
    // Отключаем кнопку "Назад" в Telegram
    window.Telegram.WebApp.disableClosingConfirmation();
}
