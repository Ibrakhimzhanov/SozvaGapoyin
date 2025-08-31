const gameCards = [
    {
        type: 'word',
        image: 'assets/img/top_ball.png',
        correctAnswer: 'word',
        uzbekText: "To'p",
        audioFile: "assets/audio/top_ball.mp3"
    },
    {
        type: 'word',
        image: 'assets/img/olma_apple.png',
        correctAnswer: 'word',
        uzbekText: "Olma",
        audioFile: "assets/audio/olma_apple.mp3"
    },
    {
        type: 'word', 
        image: 'assets/img/quyosh_sun.png',
        correctAnswer: 'word',
        uzbekText: "Quyosh",
        audioFile: "assets/audio/quyosh_sun.mp3"
    },
    {
        type: 'word',
        image: 'assets/img/qush_bird.png',
        correctAnswer: 'word',
        uzbekText: "Qush",
        audioFile: "assets/audio/qush_bird.mp3"
    },
    {
        type: 'word',
        image: 'assets/img/gul_flower.png',
        correctAnswer: 'word',
        uzbekText: "Gul",
        audioFile: "assets/audio/gul_flower.mp3"
    },
    {
        type: 'word',
        image: 'assets/img/mushuk_cat.png',
        correctAnswer: 'word',
        uzbekText: "Mushuk",
        audioFile: "assets/audio/mushuk_cat.mp3"
    },
    {
        type: 'word',
        image: 'assets/img/uy_house.png',
        correctAnswer: 'word',
        uzbekText: "Uy",
        audioFile: "assets/audio/uy_house.mp3"
    },
    {
        type: 'sentence',
        image: 'assets/img/bola_uxlaydi.png',
        correctAnswer: 'sentence',
        uzbekText: "Bola uxlaydi",
        audioFile: "assets/audio/bola_uxlaydi.mp3"
    },
    {
        type: 'sentence', 
        image: 'assets/img/qiz_kuylaydi.png',
        correctAnswer: 'sentence',
        uzbekText: "Qiz kuylaydi",
        audioFile: "assets/audio/qiz_kuylaydi.mp3"
    },
    {
        type: 'sentence',
        image: 'assets/img/ayiq_olma_yeydi.png',
        correctAnswer: 'sentence',
        uzbekText: "Ayiq olma yeydi",
        audioFile: "assets/audio/ayiq_olma_yeydi.mp3"
    }
];

let currentCardIndex = 0;
let score = 0;
let totalQuestions = 0;
let gameState = 'waiting';

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

let currentAudio = null;
let isAudioLoading = false;

function initGame() {
    shuffleArray(gameCards);
    currentCardIndex = 0;
    score = 0;
    totalQuestions = gameCards.length;
    gameState = 'waiting';
    
   
    gameCompleteScreen.style.display = 'none';
    gameCompleteScreen.classList.remove('active');
    
    updateScore();
    showCurrentCard();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showCurrentCard() {
    if (currentCardIndex >= gameCards.length) {
        showGameComplete();
        return;
    }

    const currentCard = gameCards[currentCardIndex];

    gameCard.classList.add('slide-in');
    
    cardImage.src = currentCard.image;
    cardImage.alt = currentCard.uzbekText;
    
    gameState = 'waiting';
    goldenGlow.classList.remove('active');
    
    wordBtn.disabled = false;
    sentenceBtn.disabled = false;
    wordBtn.style.opacity = '1';
    sentenceBtn.style.opacity = '1';
    
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    isAudioLoading = false;
    audioBtn.classList.remove('playing');
    
    gameCard.classList.remove('slide-in');
    setTimeout(() => {
        playCardAudio();
    }, 1000);
}

function playCardAudio() {
    if (isAudioLoading || currentCardIndex >= gameCards.length) {
        return;
    }
    
    const currentCard = gameCards[currentCardIndex];
    
    try {
        isAudioLoading = true;
        audioBtn.classList.add('playing');
        
        if (currentAudio && !currentAudio.paused) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        
        currentAudio = new Audio(currentCard.audioFile);
        
        currentAudio.preload = 'auto';
        currentAudio.volume = 1.0;
        
        currentAudio.onloadstart = () => {};
        
        currentAudio.oncanplay = () => {};
        
        currentAudio.onplay = () => {};
        
        currentAudio.onended = () => {
            audioBtn.classList.remove('playing');
            isAudioLoading = false;
        };
        
        currentAudio.onerror = (event) => {
            console.error('Audio loading error:', event);
            audioBtn.classList.remove('playing');
            isAudioLoading = false;
            
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        };
        
        const playPromise = currentAudio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {})
                .catch(error => {
                    console.error('Audio playback error:', error);
                    audioBtn.classList.remove('playing');
                    isAudioLoading = false;
                });
        }
        
    } catch (error) {
        console.error('Critical audio playback error:', error);
        audioBtn.classList.remove('playing');
        isAudioLoading = false;
    }
}



function selectAnswer(userAnswer) {
    if (gameState !== 'waiting') {
        return;
    }
    
    const currentCard = gameCards[currentCardIndex];
    const isCorrect = userAnswer === currentCard.correctAnswer;
    
    gameState = isCorrect ? 'correct' : 'incorrect';
    
    wordBtn.disabled = true;
    sentenceBtn.disabled = true;
    
    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer(userAnswer);
    }
}

function handleCorrectAnswer() {
    score++;
    updateScore();
    goldenGlow.classList.add("active");
    showConfetti();
    showCelebration();
    playSuccessSound();
    if (navigator.vibrate) { navigator.vibrate([100, 50, 100]); }

    if (window.currentTransitionTimer) {
        clearTimeout(window.currentTransitionTimer);
        window.currentTransitionTimer = null;
    }
    window.currentTransitionTimer = setTimeout(() => {
        nextCard();
    }, 2500);
}
function handleIncorrectAnswer(userAnswer) {
    const correctBtn = gameCards[currentCardIndex].correctAnswer === "word" ? wordBtn : sentenceBtn;
    const wrongBtn = userAnswer === "word" ? wordBtn : sentenceBtn;
    correctBtn.style.backgroundColor = "#4CAF50";
    correctBtn.style.transform = "scale(1.1)";
    wrongBtn.style.backgroundColor = "#f44336";
    wrongBtn.style.transform = "scale(0.9)";
    playErrorSound();
    if (navigator.vibrate) { navigator.vibrate(200); }
    setTimeout(() => { playCardAudio(); }, 1000);

    if (window.currentTransitionTimer) {
        clearTimeout(window.currentTransitionTimer);
        window.currentTransitionTimer = null;
    }
    window.currentTransitionTimer = setTimeout(() => {
        resetButtonStyles();
        nextCard();
    }, 4000);
}
function resetButtonStyles() {
    wordBtn.style.backgroundColor = '';
    sentenceBtn.style.backgroundColor = '';
    wordBtn.style.transform = '';
    sentenceBtn.style.transform = '';
}

function nextCard() {
    if (window.currentTransitionTimer) {
        clearTimeout(window.currentTransitionTimer);
        window.currentTransitionTimer = null;
    }
    
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    isAudioLoading = false;
    audioBtn.classList.remove('playing');
    
    goldenGlow.classList.remove('active');
    
    gameCard.classList.add('slide-out');
    
    setTimeout(() => {
        gameCard.classList.remove('slide-out');
        currentCardIndex++;
        resetButtonStyles();
        showCurrentCard();
    }, 500);
}

function updateScore() {
    scoreElement.textContent = score;

    scoreElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
    }, 300);
}

function showConfetti() {
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

function showCelebration() {
    celebration.classList.add('active');
    
    setTimeout(() => {
        celebration.classList.remove('active');
    }, 2000);
}

cardImage.onerror = function() {
    console.error('Image loading error:', cardImage.src);
    cardImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE2Ij7QmtCw0YDRgtC40L3QutCwPC90ZXh0Pgo8L3N2Zz4=';
};

function preloadImages() {
    gameCards.forEach(card => {
        const img = new Image();
        img.src = card.image;
    });
}

document.addEventListener('touchstart', function() {}, { passive: true });
document.addEventListener('touchend', function() {}, { passive: true });

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

function preloadAudioFiles() {
    gameCards.forEach((card, index) => {
        if (card.audioFile) {
            const audio = new Audio(card.audioFile);
            audio.preload = 'metadata';
            
            audio.onloadedmetadata = () => {};
            
            audio.onerror = (error) => {
                console.error(`Audio preload error for "${card.uzbekText}":`, error);
            };
        }
    });
    
    const successAudio = new Audio('assets/audio/ajoyib_zor.mp3');
    successAudio.preload = 'metadata';
    successAudio.onloadedmetadata = () => {};
    
    const finalAudio = new Audio('assets/audio/barakalla_message.mp3');
    finalAudio.preload = 'metadata';
    finalAudio.onloadedmetadata = () => {};
}

function addEventListeners() {
    gameCard.addEventListener('click', function(event) {
        if (!event.target.closest('.audio-btn') && !event.target.closest('.answer-btn')) {
            playCardAudio();
        }
    });
    
    audioBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        playCardAudio();
    });
    
    wordBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        selectAnswer('word');
    });
    
    sentenceBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        selectAnswer('sentence');
    });
    
    restartBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        restartGame();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    preloadAudioFiles();
    preloadImages();
    addEventListeners();
    initGame();
    
    initMobileAudio();
});

function initMobileAudio() {
    const unlockAudio = () => {
        const silence = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSxuzu3WfCsII3THsd+OPwgXZrns5KFQDQ1BnODwxGwkfCF1yO3YgC0JK2671OyWQAlZpeDnpm8MEl+YzPLPfC4MG3PHstqAQAYfaP3f0IfRC5BhYRZ+4KRaGAh5yNr1zkEFNGa93tNOPS0BLPLI9d5/QggS/PBgIMR8GkCGYmfrLKAjrAJYK+naqk4PBhjKy+fQcicHLHDO8WBPL7nbuhQ');
        silence.volume = 0.01;
        
        const playPromise = silence.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    document.removeEventListener('touchstart', unlockAudio);
                    document.removeEventListener('touchend', unlockAudio);
                    document.removeEventListener('mousedown', unlockAudio);
                    document.removeEventListener('keydown', unlockAudio);
                })
                .catch(error => {
                    console.warn('Could not unlock audio:', error);
                });
        }
    };
    
    document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    document.addEventListener('touchend', unlockAudio, { once: true, passive: true });
    document.addEventListener('mousedown', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
}

function playSuccessSound() {
    try {
        if (currentAudio && !currentAudio.paused) {
            currentAudio.pause();
        }
        
        const successAudio = new Audio('assets/audio/ajoyib_zor.mp3');
        successAudio.volume = 0.9;
        
        successAudio.onplay = () => {};
        
        successAudio.onerror = (error) => {
            console.error('Error playing success sound:', error);
        };
        
        const playPromise = successAudio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {})
                .catch(error => {
                    console.warn('Could not play success sound:', error);
                });
        }
        
    } catch (error) {
        console.error('Critical error playing success sound:', error);
    }
}

function playErrorSound() {
}

function showGameComplete() {
    gameState = 'completed';
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    sendResultToTelegram(score, totalQuestions, percentage);
    
    document.getElementById('correctAnswers').textContent = score;
    document.getElementById('totalQuestions').textContent = totalQuestions;
    document.getElementById('percentage').textContent = percentage + '%';
    
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
    
    gameCompleteScreen.style.display = 'flex';
    
    setTimeout(() => {
        gameCompleteScreen.classList.add('active');
        
        setTimeout(() => {
            playFinalMessage();
        }, 800);
    }, 100);
}

function playFinalMessage() {
    try {
        const finalAudio = new Audio('assets/audio/barakalla_message.mp3');
        finalAudio.volume = 0.9;
        
        finalAudio.onplay = () => {};
        
        finalAudio.onerror = (error) => {
            console.error('Error playing final message:', error);
        };
        
        const playPromise = finalAudio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {})
                .catch(error => {
                    console.warn('Could not play final message:', error);
                });
        }
        
    } catch (error) {
        console.error('Critical error playing final message:', error);
    }
}

function restartGame() {
    gameCompleteScreen.classList.remove('active');
    
    setTimeout(() => {
        gameCompleteScreen.style.display = 'none';
        
        initGame();
    }, 500);
}

function forceNextCard() {
    gameState = 'waiting';
    nextCard();
}

function sendResultToTelegram(score, totalQuestions, percentage) {
    if (window.Telegram && window.Telegram.WebApp) {
        try {
            const resultMessage = {
                score: score,
                totalQuestions: totalQuestions,
                percentage: percentage,
                timestamp: new Date().toISOString(),
                message: `Barakalla! Siz ${totalQuestions} ta savoldan ${score} tasiga to'g'ri javob berdingiz! (${percentage}%)`
            };
            
            const resultData = JSON.stringify(resultMessage);
            window.Telegram.WebApp.sendData(resultData);
            
        } catch (error) {
            console.error('Error sending result to Telegram:', error);
        }
    } else {
        console.warn('Telegram Web App is not available.');
    }
}

if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    
    window.Telegram.WebApp.disableClosingConfirmation();
}
