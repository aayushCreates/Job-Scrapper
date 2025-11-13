"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const randomDelay = async (min = 1000, max = 3000) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`⏱️ Waiting ${delay}ms before next request...`);
    return new Promise((resolve) => setTimeout(resolve, delay));
};
exports.default = randomDelay;
