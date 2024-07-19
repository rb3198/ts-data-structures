export const fail = (reason?: string) => {
  // Created since original Jest method is missing https://github.com/jestjs/jest/issues/11698
  reason && console.error("Test failed! Reason:", reason);
  expect(true).toBeFalsy();
};
