const dishes = [
    {
        "dish": "Toast 🍞",
        "ingredients": ["🍞", "🧈"]
    },
    {
        "dish": "Salad 🥗",
        "ingredients": ["🥬", "🥕", "🥒"]
    },
    {
        "dish": "Hot Dog 🌭",
        "ingredients": ["🌭", "🍞", "🧅"]
    },
    {
        "dish": "Pizza 🍕",
        "ingredients": ["🍞", "🍅", "🧀"]
    },
    {
        "dish": "Pasta 🍝",
        "ingredients": ["🍝", "🍅", "🧀", "🌿"]
    },
    {
        "dish": "Burger 🍔",
        "ingredients": ["🥩", "🍞", "🧀", "🍅", "🥬"]
    },
    {
        "dish": "Taco 🌮",
        "ingredients": ["🌮", "🥩", "🧀", "🥬", "🍅"]
    },
    {
        "dish": "Sushi 🍣",
        "ingredients": ["🍚", "🐟", "🥢", "🥑", "🍋"]
    },
    {
        "dish": "Ramen 🍜",
        "ingredients": ["🍜", "🥩", "🥚", "🌿", "🧄", "🧅"]
    },
    {
        "dish": "Feast 🍽️",
        "ingredients": ["🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇"]
    }
]

const orderName = document.querySelector('#order-name') as HTMLElement;
const orderIngredients = document.querySelector('#order-ingredients') as HTMLElement;
const preparationArea = document.querySelector('#preparation-area') as HTMLElement;
const resultMessage = document.querySelector('#result-message') as HTMLElement;
const score = document.querySelector('.score') as HTMLElement;
const timer = document.querySelector('.timer') as HTMLElement;
const clearButton = document.querySelector('#clear-button') as HTMLElement;
let selectedIngredients: string[] = [];
let currentPoints: number = 0
let currentOrder: { dish: string, ingredients: string[] } = {dish: '', ingredients: []};
let timeLeft: number = 60;
let scorePoints: number = 0;
let timerInterval: any;

function saveGameState() {
    const gameState = {
        currentPoints,
        timeLeft,
        currentOrder,
        selectedIngredients
    };
    console.log("Saving game state");
    localStorage.setItem('savedGame', JSON.stringify(gameState));
}

function loadGameState() {
    const savedGame = localStorage.getItem('savedGame');
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        currentPoints = gameState.currentPoints;
        timeLeft = gameState.timeLeft;
        currentOrder = gameState.currentOrder;
        selectedIngredients = gameState.selectedIngredients;

        // Restore UI elements
        score.innerHTML = `Score: ${currentPoints}`;
        timer.innerHTML = `Time Left: ${timeLeft}s`;
        orderName.innerHTML = `Order: ${currentOrder.dish}`;
        orderIngredients.innerHTML = `Ingredients: ${currentOrder.ingredients.join(' ')}`;
        preparationArea.innerHTML = selectedIngredients.join(' ');
        clearButton.onclick = function () {
            clearIngredients();
        }
        console.log("Game loaded");
        startTimer();
    }
}

function clearIngredients() {
    selectedIngredients = [];
    preparationArea.innerHTML = '';
    resultMessage.innerHTML = "Ingredients cleared! Start fresh!"; // Optional message
}

function startGame() {
    const savedGame = localStorage.getItem('savedGame');
    if (savedGame) {
        if (confirm("Load saved game?")) {
            loadGameState();
            return;
        } else {
            localStorage.removeItem('savedGame');
        }
    }
    scorePoints = 0;
    timeLeft = 60;
    selectedIngredients = [];
    preparationArea.innerHTML = '';
    resultMessage.innerHTML = '';
    timer.innerHTML = `Score: ${score}`;
    clearButton.onclick = function () {
        clearIngredients();
    }

    generateRandomOrder();
    generateTrayArray();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timer.innerHTML = `Time Left: ${timeLeft}s`;
        } else {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    resultMessage.innerHTML = `Game Over! You scored ${currentPoints} points! 🎉`;
    preparationArea.innerHTML = '';

}

//pick order

function generateRandomOrder() {
    let currentOrderIndex = Math.floor(Math.random() * (dishes.length));
    currentOrder = dishes[currentOrderIndex];
    orderName.innerHTML = `Order: ${currentOrder.dish}`;
    orderIngredients.innerHTML = `Ingredients: ${currentOrder.ingredients.join(' ')}`;
    selectedIngredients = [];
    preparationArea.innerHTML = '';
    resultMessage.innerHTML = '';
    console.log(currentOrder)
}

generateRandomOrder();

function generateTrayArray() {
    const ingredientTray = document.querySelector('#ingredient-tray') as HTMLElement;
    const ingredientTrayArray = [...currentOrder.ingredients, "🍅", "🍝", "🧈", "🌭", "🥩", "🥬", "🧄", "🥒", "🍋", "🧀", "🥚", "🥕", "🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇", "🍜", "🌿", "🧅"];
    shuffle(ingredientTrayArray);
    ingredientTray.innerHTML = '';
    ingredientTrayArray.forEach((ingredient) => {
        const ingredientElement = document.createElement('div');
        ingredientElement.classList.add('ingredient');
        ingredientElement.setAttribute('data-ingredient', ingredient);
        ingredientElement.textContent = ingredient;
        ingredientElement.onclick = () => {
            console.log(ingredient)
            selectedIngredients.push(ingredient);
            preparationArea.innerHTML = selectedIngredients.join(' ');
            checkOrder()
        };

        ingredientTray.appendChild(ingredientElement);
    });
}

generateTrayArray()

function shuffle(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkOrder() {
    const isOrderComplete = currentOrder.ingredients.every(ingredient => selectedIngredients.includes(ingredient));
    const isOrderIncorrect = selectedIngredients.length > currentOrder.ingredients.length;

    if (isOrderComplete && selectedIngredients.length === currentOrder.ingredients.length) {
        resultMessage.innerHTML = "Order Complete! 🎉";
        currentPoints += 10
        saveGameState();

        score.innerHTML = `Score: ${currentPoints}`
        setTimeout(function () {
            generateRandomOrder();
            generateTrayArray();
        }, 1000);
    } else if (isOrderIncorrect) {
        currentPoints -= 5
        score.innerHTML = `Score: ${currentPoints}`
        resultMessage.innerHTML = "Incorrect order! 😞";
    } else {
        resultMessage.innerHTML = "Keep adding ingredients...";
    }
}

startGame();


