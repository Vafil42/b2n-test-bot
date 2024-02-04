export const log = (message: string) => {
  console.log(`[INFO] ${new Date().toISOString()} \n ${message}`);
};

export const errorLog = (message: string) => {
  console.error(`[ERROR] ${new Date().toISOString()} \n ${message}`);
};
