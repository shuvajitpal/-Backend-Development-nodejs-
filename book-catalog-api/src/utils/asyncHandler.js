// Wrapper function to handle async errors without repetitive try/catch
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
