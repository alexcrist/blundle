import confetti from "canvas-confetti";

const PARTICLE_SIZE = 0.8;
const PARTICLE_GRAVITY = 0.5;

const randomInRange = (min, max) => Math.random() * (max - min) + min;

export class ConfettiBlaster {
    #isActive = true;
    #skew = 1;

    constructor(canvas) {
        const canvasConfetti = confetti.create(canvas, { resize: true });
        const frame = () => {
            this.#skew = Math.max(0.8, this.#skew - 0.001);
            canvasConfetti({
                particleCount: 2,
                startVelocity: 0,
                ticks: 400,
                origin: {
                    x: Math.random(),
                    y: Math.random() * this.#skew - 0.2,
                },
                colors: ["#008FFF", "#007002"],
                gravity: randomInRange(0.4, 0.6) * PARTICLE_GRAVITY,
                scalar: randomInRange(0.4, 1) * PARTICLE_SIZE,
                drift: randomInRange(-0.4, 0.4),
            });
            if (this.#isActive) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }

    stop() {
        this.#isActive = false;
    }
}
