// Showing the first 5 letters/numbers and last 4 letters/numbers of the account
export const shortenAddress = (address) => `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;