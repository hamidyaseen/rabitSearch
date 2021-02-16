
import { ISubRange, IWordsInfo, SecretSearch } from './secretsearch';
import type { ISecretSearch } from './secretsearch';

//: - Read Input words data from file;
//: - Split input data to lines and finally to word;
//: - Analyse the anagram to make a unique character set;
//: - Reduce the whole words set to smaller sets of all possible words-length set; 
//: - As all possible words-lengths (sample data) is actually normally distributed,  
//: - Calculate the mean and Standard Deviation from words-length normally distributed set.
//: - As the probabity of existing hidden word is quite high (68%) in the range
//: - [mean-standard_devistaion  mean+standard_deviation]  
//: - starting with searching hidden secret from the mean 
// start from left of mean of sample data.
const ranges = [
    { start: 7, ends: 8 }, { start: 8, ends: 9 }, { start: 6, ends: 7 }, { start: 9, ends: 10 },
    { start: 5, ends: 6 }, { start: 10, ends: 11 }, { start: 4, ends: 5 }, { start: 11, ends: 12 },
    { start: 3, ends: 4 }, { start: 12, ends: 13 }, { start: 2, ends: 3 }, { start: 13, ends: 14 },
    { start: 1, ends: 2 }, { start: 14, ends: 15 }];

let select = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();

    let files = (event.target as HTMLInputElement).files!;
    let index = 0;

    let selectedFile = files[index];

    let readPromise = new Promise((aResolve, aReject) => {
        const reader = new FileReader();
        reader.onload = (e: Event): void => {
            aResolve(reader.result);
        };
        reader.onerror = () => { aReject('Failed'); };
        reader.readAsText(selectedFile);
    });

    let search: ISecretSearch = new SecretSearch();

    readPromise.then((linesData: unknown): string[] => {
        const lines = (linesData as string).split('\n');        
        return lines;
    }).then(
        (lines: string[]): IWordsInfo => {
            search.anagram = document.getElementById('anagramId')?.getAttribute('value')!;
            let wordsInfo = search.possibleWordsList(lines);           
            return wordsInfo;
        }).then((wordsInfo: IWordsInfo): void => {
            let hash = document.getElementById('hashId')?.getAttribute('value')!;

            let mean = search.calculateMeanOfWordsLengthsSampleData(wordsInfo.wordsLengths);
            let sDeviation = search.calculateStandardDeviationOfWordsLengthsSampleData(wordsInfo.wordsLengths);

            console.log(`Samples data mean ${mean} and standard deviation ${sDeviation}`);

            let secret = ""; let beforeTime = 0, afterTime = 0;
            // first top to buttom approach ...
            beforeTime = Date.now();
            secret = search.searchWord(wordsInfo.wordsList, hash);
            //secret = search.searchWordInSubset(wordsInfo.wordsList, hash, { start: 1, ends: 1 })
            afterTime = Date.now();            

            document.getElementById('messageId')!.innerText = secret;
            console.log(`secret search is "${secret}" done in ${(afterTime - beforeTime) / 1000} sec`);        

    }).catch(() => { });
};

//document.addEventListener('DOMContentLoaded', (event: Event) => {
document.getElementById('file-button-id')!.addEventListener('change', select ,false);
//});
