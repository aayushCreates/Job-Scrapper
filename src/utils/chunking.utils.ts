

export const chunkData = (jobsArr: any, limit: number)=> {
    const chunks: any = [];
    let i = 0;

    while(i < Math.ceil(jobsArr.length/limit)) {
        chunks.push(jobsArr.slice(i, limit));
        i++;
    }

    return chunks;
}
 