// Language translations
const translations = {
    en: {
        title: "Flashcards",
        questionPlaceholder: "Enter question",
        answerPlaceholder: "Enter answer",
        add: "Add Flashcard",
        export: "Export Cards",
        import: "Import Cards",
        noCards: "No cards yet. Add your first card!",
        cardCounter: "Card {current} of {total}"
    },
    bn: {
        title: "ফ্ল্যাশকার্ড",
        questionPlaceholder: "প্রশ্ন লিখুন",
        answerPlaceholder: "উত্তর লিখুন",
        add: "কার্ড যোগ করুন",
        export: "কার্ড সংরক্ষণ করুন",
        import: "কার্ড আমদানি করুন",
        noCards: "এখনও কোন কার্ড নেই। আপনার প্রথম কার্ড যোগ করুন!",
        cardCounter: "কার্ড {current}/{total}"
    }
};

// Initial state
let cards = [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is 2 + 2?", answer: "4" }
];
let currentIndex = 0;
let currentLanguage = 'en';

// DOM Elements
const elements = {
    language: document.getElementById('language'),
    title: document.getElementById('title'),
    flashcard: document.getElementById('flashcard'),
    cardFront: document.getElementById('cardFront'),
    cardBack: document.getElementById('cardBack'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    cardCounter: document.getElementById('cardCounter'),
    questionInput: document.getElementById('questionInput'),
    answerInput: document.getElementById('answerInput'),
    addCardBtn: document.getElementById('addCardBtn'),
    exportBtn: document.getElementById('exportBtn'),
    importFile: document.getElementById('importFile')
};

// Update UI text based on selected language
function updateLanguage() {
    const lang = translations[currentLanguage];
    elements.title.textContent = lang.title;
    elements.questionInput.placeholder = lang.questionPlaceholder;
    elements.answerInput.placeholder = lang.answerPlaceholder;
    elements.addCardBtn.textContent = lang.add;
    elements.exportBtn.textContent = lang.export;
    document.querySelector('.import-label').textContent = lang.import;
    updateCardCounter();
}

// Update card counter text
function updateCardCounter() {
    const lang = translations[currentLanguage];
    elements.cardCounter.textContent = lang.cardCounter
        .replace('{current}', currentIndex + 1)
        .replace('{total}', cards.length);
}

// Show current card
function showCard() {
    if (cards.length === 0) {
        elements.cardFront.textContent = translations[currentLanguage].noCards;
        elements.cardBack.textContent = '';
        return;
    }

    const card = cards[currentIndex];
    elements.cardFront.textContent = card.question;
    elements.cardBack.textContent = card.answer;
    elements.flashcard.classList.remove('flipped');
    updateCardCounter();
}

// Event Listeners
elements.language.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    updateLanguage();
});

elements.flashcard.addEventListener('click', () => {
    elements.flashcard.classList.toggle('flipped');
});

elements.prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        showCard();
    }
});

elements.nextBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
        currentIndex++;
        showCard();
    }
});

elements.addCardBtn.addEventListener('click', () => {
    const question = elements.questionInput.value.trim();
    const answer = elements.answerInput.value.trim();

    if (question && answer) {
        cards.push({ question, answer });
        currentIndex = cards.length - 1;
        showCard();
        elements.questionInput.value = '';
        elements.answerInput.value = '';
    }
});

elements.exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(cards)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.json';
    a.click();
    URL.revokeObjectURL(url);
});

elements.importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedCards = JSON.parse(event.target.result);
                if (Array.isArray(importedCards) && importedCards.length > 0) {
                    cards = importedCards;
                    currentIndex = 0;
                    showCard();
                }
            } catch (error) {
                alert('Error importing cards. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
});

// Initialize
updateLanguage();
showCard(); 