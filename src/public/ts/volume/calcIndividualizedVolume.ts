const SQUAT_MEV_HT = 7.5;
const SQUAT_MRV_HT = 14;
const BENCH_MEV_HT = 9;
const BENCH_MRV_HT = 17;
const DEADLIFT_MEV_HT = 5.5;
const DEADLIFT_MRV_HT = 9;

const SQUAT_MEV_ST = SQUAT_MEV_HT - 2;
const SQUAT_MRV_ST = SQUAT_MRV_HT - 5;
const BENCH_MEV_ST = BENCH_MEV_HT - 1;
const BENCH_MRV_ST = BENCH_MRV_HT - 6;
const DEADLIFT_MEV_ST = DEADLIFT_MEV_HT - 1;
const DEADLIFT_MRV_ST = DEADLIFT_MRV_HT - 3;



const squatMEV = document.querySelector(".squat-mev") as HTMLInputElement;
const squatMRV = document.querySelector(".squat-mrv")as HTMLInputElement;
const squatMedian = document.querySelector(".squat-median")!;

const benchMEV = document.querySelector(".bench-mev") as HTMLInputElement;
const benchMRV = document.querySelector(".bench-mrv") as HTMLInputElement;
const benchMedian = document.querySelector(".bench-median")!;

const deadliftMEV = document.querySelector(".deadlift-mev") as HTMLInputElement;
const deadliftMRV = document.querySelector(".deadlift-mrv") as HTMLInputElement;
const deadlitMedian = document.querySelector(".deadlift-median")!;

console.log("Hallo bin eingebunden");

export function calcIndividualizedVolume(adjustment: number, blockType : string) {

    if (blockType === "hypertrophie") {
        squatMEV.value = (SQUAT_MEV_HT + adjustment).toString();
        squatMRV.value = (SQUAT_MRV_HT + adjustment).toString();
        squatMedian.textContent = calcMedian(
            parseFloat(squatMEV.value),
            parseFloat(squatMRV.value)
        );
    
        benchMEV.value = (BENCH_MEV_HT + adjustment).toString();
        benchMRV.value = (BENCH_MRV_HT + adjustment).toString();
        benchMedian.textContent = calcMedian(
            parseFloat(benchMEV.value),
            parseFloat(benchMRV.value)
        );
    
        deadliftMEV.value = (BENCH_MEV_HT + adjustment).toString();
        deadliftMRV.value = (BENCH_MRV_HT + adjustment).toString();
        deadlitMedian.textContent = calcMedian(
            parseFloat(deadliftMEV.value),
            parseFloat(deadliftMRV.value)
        );
    } else if (blockType === "kraft") {
        squatMEV.value = (SQUAT_MEV_ST + adjustment).toString();
        squatMRV.value = (SQUAT_MRV_ST + adjustment).toString();
        squatMedian.textContent = calcMedian(
            parseFloat(squatMEV.value),
            parseFloat(squatMRV.value)
        );
    
        benchMEV.value = (BENCH_MEV_ST + adjustment).toString();
        benchMRV.value = (BENCH_MRV_ST + adjustment).toString();
        benchMedian.textContent = calcMedian(
            parseFloat(benchMEV.value),
            parseFloat(benchMRV.value)
        );
    
        deadliftMEV.value = (DEADLIFT_MEV_ST + adjustment).toString();
        deadliftMRV.value = (DEADLIFT_MRV_ST + adjustment).toString();
        deadlitMedian.textContent = calcMedian(
            parseFloat(deadliftMEV.value),
            parseFloat(deadliftMRV.value)
        );
    }


}

/**
 * Calculates the median of two numbers and rounds to the nearest integer.
 *
 * @param num1 The first number.
 * @param num2 The second number.
 * @return The rounded median of the two numbers as a string.
 */
function calcMedian(num1: number, num2: number): string {
    return Math.round((num1 + num2) / 2).toString();
}
