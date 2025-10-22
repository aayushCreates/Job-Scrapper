
export const chunkData = (jobsArr: any[], limit: number) => {
    const chunks: any[] = [];
    let i = 0;

    while (i < jobsArr.length) {
        chunks.push(jobsArr.slice(i, i + limit));
        i += limit;
    }

    return chunks;
};
