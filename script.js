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
    const spinDuration = 1000; // Spins very fast for 1 second
    const stopDelay = [1300, 1500, 1700]; // Stops each wheel at different times

    wheels.forEach((wheel, index) => {
        const reel = wheel.querySelector(".reel");

        let extendedSymbols = [
            getRandomSymbol(), getRandomSymbol(), getRandomSymbol(),
            getRandomSymbol(), getRandomSymbol(), getRandomSymbol(),
            getRandomSymbol(), getRandomSymbol(), getRandomSymbol()
        ];

        let newHTML = extendedSymbols.map(symbol =>
            `<img src="${symbol}.png" alt="${symbol}">`
        ).join("");

        reel.innerHTML = newHTML;
        reel.style.height = `${80 * extendedSymbols.length}px`;

        let finalPosition = -((Math.floor(Math.random() * 3) + 1) * 80);

        reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.1, 0.8, 0.2, 1)`;
        reel.style.transform = `translateY(-${80 * (extendedSymbols.length - 3)}px)`;

        setTimeout(() => {
            reel.style.transition = "transform 300ms ease-out";
            reel.style.transform = `translateY(${finalPosition}px)`;
        }, stopDelay[index]);
    });

    setTimeout(checkWin, Math.max(...stopDelay) + 300);
}

function checkWin() {
    const middleSymbols = wheels.map(wheel => {
        const reel = wheel.querySelector(".reel");
        const computedStyle = window.getComputedStyle(reel);
        const transformValue = computedStyle.getPropertyValue("transform");

        if (transformValue !== "none") {
            const matrix = transformValue.match(/matrix.*\((.+)\)/)[1].split(', ');
            const translateY = Math.abs(parseFloat(matrix[5]));

            const index = Math.round(translateY / 80) + 1; // Correctly find middle symbol
            return reel.children[index].alt; 
        }
        return null;
    });

    let isWin = middleSymbols[0] === middleSymbols[1] && middleSymbols[1] === middleSymbols[2];

    wheels.forEach(wheel => {
        wheel.classList.remove("gold-border", "red-border");

        if (isWin) {
            wheel.classList.add("gold-border");
        } else {
            wheel.classList.add("red-border");
        }
    });

    if (isWin) {
        const winnings = parseInt(betInput.value) * symbolValues[middleSymbols[0]];
        balance += winnings;
        balanceElement.textContent = balance;
        resultElement.textContent = `You won ₹${winnings}! 🎉`;
    } else {
        resultElement.textContent = "You Lost! Spin again.😭";
    }

    setTimeout(() => {
        wheels.forEach(wheel => {
            wheel.classList.remove("gold-border", "red-border");
        });
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
