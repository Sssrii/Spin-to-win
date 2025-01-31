const balanceElement = document.getElementById("balance");
const betInput = document.getElementById("betAmount");
const spinButton = document.getElementById("spinButton");
const wheels = [
    document.getElementById("wheel1"),
    document.getElementById("wheel2"),
    document.getElementById("wheel3")
];
const resultElement = document.getElementById("result");

let balance = 2000;
const symbols = ["banana", "pine", "strawberry"];
const symbolValues = { banana: 5, pine: 4, strawberry: 3 };

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function rotateWheels() {
    const spinDuration = 1000; 
    const stopDelay = [1300, 1500, 1700]; 

    wheels.forEach((wheel, index) => {
        const reel = wheel.querySelector(".reel");

        let extendedSymbols = [];
        for (let i = 0; i < 9; i++) {
            extendedSymbols.push(getRandomSymbol());
        }

        reel.innerHTML = extendedSymbols.map(symbol =>
            `<img src="${symbol}.png" alt="${symbol}" style="width: 80px; height: 80px;">`
        ).join("");

        reel.style.height = `${80 * extendedSymbols.length}px`;

        // Reset position before spinning (ensures proper animation)
        reel.style.transition = "none";
        reel.style.transform = "translateY(0px)";
        void reel.offsetHeight; // Forces repaint

        let finalIndex = Math.floor(Math.random() * 3) + 3; // Picks from middle section (index 3-5)
        let finalPosition = -(finalIndex * 80);

        // Apply smooth spin transition
        reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.1, 0.8, 0.2, 1)`;
        reel.style.transform = `translateY(-${80 * (extendedSymbols.length - 3)}px)`;

        // Stop at correct position
        setTimeout(() => {
            reel.style.transition = "transform 300ms ease-out";
            reel.style.transform = `translateY(${finalPosition}px)`;
            reel.dataset.finalIndex = finalIndex; // Store index for win check
        }, stopDelay[index]);
    });

    setTimeout(checkWin, Math.max(...stopDelay) + 300);
}

function checkWin() {
    const middleSymbols = wheels.map(wheel => {
        const reel = wheel.querySelector(".reel");
        const finalIndex = parseInt(reel.dataset.finalIndex);
        return reel.children[finalIndex].alt; 
    });

    let isWin = middleSymbols[0] === middleSymbols[1] && middleSymbols[1] === middleSymbols[2];

    wheels.forEach(wheel => {
        wheel.classList.remove("gold-border", "red-border");
        wheel.classList.add(isWin ? "gold-border" : "red-border");
    });

    if (isWin) {
        const winnings = parseInt(betInput.value) * symbolValues[middleSymbols[0]];
        balance += winnings;
        resultElement.textContent = `You won ₹${winnings}! 🎉`;
    } else {
        resultElement.textContent = "You Lost! Spin again.😭";
    }

    balanceElement.textContent = balance;

    setTimeout(() => {
        wheels.forEach(wheel => wheel.classList.remove("gold-border", "red-border"));
    }, 1500);
}

spinButton.addEventListener("click", () => {
    const bet = parseInt(betInput.value);
    if (isNaN(bet) || bet <= 0 || bet > balance) {
        resultElement.textContent = "OOPS!! Insufficient Balance!";
        return;
    }
    balance -= bet;
    balanceElement.textContent = balance;

    rotateWheels();
});
