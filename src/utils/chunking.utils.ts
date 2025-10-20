

export const chunkData = (jobDetails: any, limit: number)=> {
    const chunks: any = [];
    let i = 0;

    while(i < jobDetails.length) {
        chunks.push(jobDetails.slice(i, limit + 1));
        i++;
    }  
    
    return chunks;
}
 