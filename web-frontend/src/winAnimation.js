import confetti from "canvas-confetti";

const CONFETTI_DURATION_MS = 3 * 1000;
const MESSAGE_DURATION_MS = 2 * 1000;
const MESSAGE_ANIMATION_DURATION_MS = 1 * 1000;

export const winAnimation = (country) => {
    animteWinText(country);
    blastConfetti();
};

const blastConfetti = () => {
    const end = Date.now() + CONFETTI_DURATION_MS;
    const frame = () => {
        confetti({
            particleCount: 2,
            angle: 30,
            spread: 100,
            origin: { x: 0 },
            colors: ["#007003", "#008FFF"],
        });
        confetti({
            particleCount: 2,
            angle: 150,
            spread: 100,
            origin: { x: 1 },
            colors: ["#007003", "#008FFF"],
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };
    frame();
};

const animteWinText = (country) => {
    const container = document.createElement("div");
    container.style["position"] = "fixed";
    container.style["top"] = "0";
    container.style["left"] = "0";
    container.style["right"] = "0";
    container.style["bottom"] = "0";
    container.style["display"] = "flex";
    container.style["align-items"] = "center";
    container.style["justify-content"] = "center";
    container.style["pointer-events"] = "none";
    container.style["z-index"] = "99999";
    const message = document.createElement("div");
    message.innerHTML = `
        <div style="text-align: center;">Correct! It's ${country.name}!</div>
        <img src="dance.gif" style="width: 150px; max-width: 100%; text-align: center; margin: 10px auto 0; image-rendering: pixelated">
    `;
    message.style["font-size"] = "30px";
    message.style["display"] = "flex";
    message.style["flex-direction"] = "column";
    message.style["align-items"] = "center";
    message.style["font-weight"] = "bold";
    message.style["padding"] = "20px";
    message.style["color"] = "black";
    message.style["background-color"] = "#ffffff99";
    message.style["backdrop-filter"] = "blur(4px)";
    message.style["border-radius"] = "4px";
    message.style["max-width"] = "calc(70dvw - 40px)";
    message.style["width"] = "min-content";
    message.style["transition"] =
        `opacity ${MESSAGE_ANIMATION_DURATION_MS}ms linear`;
    message.style["opacity"] = "0";
    message.style["box-shadow"] =
        "0 0px 50px rgba(0, 0, 0, 0.5), 0 0px 20px rgba(0, 0, 0, 0.25)";
    container.appendChild(message);
    document.body.appendChild(container);
    requestAnimationFrame(() => {
        message.style["opacity"] = 1;
    });
    setTimeout(() => {
        message.style["opacity"] = 0;
    }, MESSAGE_ANIMATION_DURATION_MS + MESSAGE_DURATION_MS);
    setTimeout(
        () => {
            container.remove();
        },
        MESSAGE_ANIMATION_DURATION_MS * 2 + MESSAGE_DURATION_MS,
    );
};
