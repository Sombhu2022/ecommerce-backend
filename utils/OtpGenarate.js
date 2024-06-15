export function genarate6DigitOtp() {
    // Generate a random number between 100000 and 999999
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}