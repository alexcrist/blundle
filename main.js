const count = document.querySelector("#count");
const button = document.querySelector("#button-1");
button.addEventListener("click", () => {
    const previousValue = Number(count.innerText);
    const nextValue = previousValue + 1;
    count.innerText = nextValue;
});
