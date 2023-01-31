import crypto from 'crypto';


export default (): string => {
  return crypto.randomUUID();
};
