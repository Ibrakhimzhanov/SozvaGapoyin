// Игровые данные с использованием предоставленных изображений
const gameCards = [
    // Картинки отдельных предметов - SO'Z (слова)
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/cff9786b5c55b3e2279ca47565526131', // Мяч
        correctAnswer: 'word'
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/307839f3489e6d96919b4fae2911da3f', // Яблоко
        correctAnswer: 'word'
    },
    {
        type: 'word', 
        image: 'https://page.gensparksite.com/v1/base64_upload/34e8ed89d550725f30d5c0a7ab3d8e5f', // Солнце
        correctAnswer: 'word'
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/6b3d748cd990f844fd4f468aecdf9668', // Птичка
        correctAnswer: 'word'
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/219d0f515902aefd611dbc2c75152b05', // Цветок
        correctAnswer: 'word'
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/1b933396c15d8e3aec7936ad9c0107b4', // Котенок у дома
        correctAnswer: 'word'
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/1fdba870473c00a08374ba0233fdfa42', // Котенок на траве
        correctAnswer: 'word'
    },
    {
        type: 'word',
        image: 'https://page.gensparksite.com/v1/base64_upload/9047c0869a33e9cb12ee2583f8cdbe82', // Дом
        correctAnswer: 'word'
    },
    
    // Сценки и действия - GAP (предложения)
    {
        type: 'sentence',
        image: 'https://page.gensparksite.com/v1/base64_upload/150b51571fcec876fe4ad8a152f3ef03', // Ребенок спит с мишкой
        correctAnswer: 'sentence'
    },
    {
        type: 'sentence', 
        image: 'https://page.gensparksite.com/v1/base64_upload/544343a0091c6f8bb1c004009018fbc2', // Девочка поет
        correctAnswer: 'sentence'
    },
    {
        type: 'sentence',
        image: 'https://page.gensparksite.com/v1/base64_upload/23bf49411dde75908263605dd6a1c47d', // Медведь ест яблоко
        correctAnswer: 'sentence'
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
const nextCardBtn = document.getElementById('nextCardBtn');
const gameCard = document.getElementById('gameCard');
const wordBtn = document.getElementById('wordBtn');
const sentenceBtn = document.getElementById('sentenceBtn');

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
        // Игра завершена, отправляем результат и закрываем приложение
        sendResultToTelegram();
        return;
    }

    const currentCard = gameCards[currentCardIndex];
    
    // Анимация появления новой карточки
    gameCard.classList.add('slide-in');
    
    // Загружаем изображение
    cardImage.src = currentCard.image;
    cardImage.alt = `Карточка ${currentCardIndex + 1}`;
    
    // Сбрасываем состояние
    gameState = 'waiting';
    goldenGlow.classList.remove('active');
    nextCardBtn.style.display = 'none';
    
    // Активируем кнопки
    wordBtn.disabled = false;
    sentenceBtn.disabled = false;
    wordBtn.style.opacity = '1';
    sentenceBtn.style.opacity = '1';
    
    // Убираем анимацию через время
    setTimeout(() => {
        gameCard.classList.remove('slide-in');
    }, 800);
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
    
    // Вибрация (если поддерживается)
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    // Показываем кнопку следующей карточки через 2 секунды
    setTimeout(() => {
        nextCardBtn.style.display = 'block';
    }, 2000);
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
    
    // Легкая вибрация ошибки
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
    
    // Через 2 секунды возвращаем обычный вид и показываем следующую карточку
    setTimeout(() => {
        resetButtonStyles();
        nextCardBtn.style.display = 'block';
    }, 2000);
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
    nextCardBtn.style.display = 'none';
    
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

// Отправка результата в чат Telegram
function sendResultToTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const resultData = JSON.stringify({ score });
        window.Telegram.WebApp.sendData(resultData);
        window.Telegram.WebApp.showAlert(`Ваш результат: ${score}`, () => {
            window.Telegram.WebApp.close();
        });
    } else {
        alert(`Ваш результат: ${score}`);
    }
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

// Запуск игры
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
    initGame();
});

// Для Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    
    // Отключаем кнопку "Назад" в Telegram
    window.Telegram.WebApp.disableClosingConfirmation();
}