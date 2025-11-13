"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkData = void 0;
const chunkData = (jobsArr, limit) => {
    const chunks = [];
    let i = 0;
    while (i < jobsArr.length) {
        chunks.push(jobsArr.slice(i, i + limit));
        i += limit;
    }
    return chunks;
};
exports.chunkData = chunkData;
