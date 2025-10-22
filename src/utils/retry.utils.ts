export async function retry<T>(
    fn: () => Promise<T>,
    attempts = 3,
    backoff = 500
  ): Promise<T> {
    let lastError;
  
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
  
        // Handle 429 - Too Many Requests
        if (err.response?.status === 429) {
          const retryAfter = Number(err.response?.headers["retry-after"]);

          const waitTime = retryAfter
            ? retryAfter * 1000
            : backoff * Math.pow(2, i);
            
          console.warn(`⚠️ Rate limited (429). Retrying after ${waitTime}ms...`);

          await wait(waitTime);
        } else {
          const waitTime = backoff * Math.pow(2, i);

          console.warn(`⚠️ Attempt ${i + 1} failed. Retrying in ${waitTime}ms...`);

          await wait(waitTime);
        }
      }
    }
  
    throw lastError;
  }
  
  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  