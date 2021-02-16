import { Md5 } from 'ts-md5/dist/md5';

export interface IWordsList {
    length: any;
    [key: number]: string[];
}
export interface IWordsInfo {
    wordsList: IWordsList;
    wordsLengths: number[];
} 

export interface ISecretSearch {
    anagram: string;
    possibleWordsList(lines: string[]): IWordsInfo;

    calculateMeanOfWordsLengthsSampleData(sampleData: number[]): number;
    calculateStandardDeviationOfWordsLengthsSampleData(sampleData: number[]): number;
    searchWord(words: IWordsList, hash: string): string;   
    searchWordInSubset(words: IWordsList, hash: string, range: ISubRange): string;
}

export interface ISubRange {
    start: number;
    ends: number;
}

export class SecretSearch implements ISecretSearch {
    private _anagram: string = '';
    private _anaLet: string = '';
    //private wordsList: IWordsList = [];
    //private _wordsLengths: number[] = [];

    constructor() { }
    set anagram(an: string) {
        if (an !== undefined || an !== null || an !== "") {
            this._anagram = an;
            this._anaLet = this.uniqueAnaLet();
        }
    }
    get anagram(): string { return this._anagram; }


    public possibleWordsList(lines: string[]): IWordsInfo
    {
        let wInfo = { wordsList: [], wordsLengths: [] } as IWordsInfo;
        for (var lineNo = 0; (lineNo < lines.length); lineNo++)
        {
            let word = lines[lineNo];
            if (this.isPossibleWord(word)) {                
                let len = word.length;
                if (wInfo.wordsList[len] === undefined) {
                    wInfo.wordsList[len] = [];
                    wInfo.wordsLengths.push(len);
                }
                    // if the word does not exist, add it once.
                let wordsArray = wInfo.wordsList[len];
                if (wordsArray.find((value: string) => (value === word)) === undefined)
                    wInfo.wordsList[len].push(word);
            }
        }
        console.log(wInfo.wordsLengths);
        return wInfo;
    }

    public calculateMeanOfWordsLengthsSampleData(sampleData: number[]): number {
        let dataSum = 0;        
        for (let index = 0; index < sampleData.length; index++) {
            dataSum += sampleData[index];
        }
        return (dataSum / sampleData.length);
    }
    public calculateStandardDeviationOfWordsLengthsSampleData(sampleData: number[]): number {
        let mean = this.calculateMeanOfWordsLengthsSampleData(sampleData);
        
        let sum = 0;
        for (let index = 0; index < sampleData.length; index++) {
            sum += ((sampleData[index] - mean) * (sampleData[index] - mean));
        }

        return Math.sqrt(sum / sampleData.length);
    }

    //public canStartEdge(words: IWordsList, i: number, anagram: string): number {
    //    let maxLength = anagram.length - 2;
    //    let maxIndex = words.length-1;
    //    try {
    //        let restLen = maxLength - i;            
    //    }
    //    catch (e) {
    //    }
    //}
    //public checkEdgeCases(words: IWordsList, indexArray: number[]): number[] {
    //    let firstIndex = indexArray[0], secondIndex = indexArray[1], thirdIndex = indexArray[2];
    //    if (parseInt(firstIndex.toString()) === NaN || parseInt(secondIndex.toString()) === NaN || parseInt(thirdIndex.toString()) === NaN)
    //        return [];
    //    return [];
    //}
    
    public searchWordInSubset(words: IWordsList, hash: string, range: ISubRange): string
    {
        let result = "";
        let anagramLen = this.anagram.length - 2; // 2 are space character
       
        let aCombination = '';
        try {
            for (let i = range.start; i <= range.ends; i++){
                let restLen = anagramLen - i;
                let combinationStart = 1;
                if (restLen > 16) { // it would cross the index limit,

                }
                for (let j = 1, k = (restLen - 1); (j < restLen && k > 0); j++, k--) {
                    for (let l = 0; l < words[i].length; l++) {
                        for (let m = 0; m < words[j].length; m++) {
                            for (let n = 0; n < words[k].length; n++)
                            {
                                aCombination = Array.from([words[i][l], words[j][m], words[k][n]]).join(' ');
                                console.log(`[${words[i][l]}, ${words[j][m]}, ${words[k][n]}`);
                                if (Md5.hashStr(aCombination) === hash) {
                                    result = aCombination;
                                    //    //i = j = k = len; // break the loops to save processing time
                                    return result;
                                }
                            }
                        }
                    }
                }
                console.log('Next Step Length ' + i);
            }
        }
        catch (e) {
            console.log(e);
        }        
        return result;
    }
    public searchWord(words: IWordsList, hash: string): string {
        let result = "";
        let len = words.length - 1;
        let anagramLen = this.anagram.length - 2; // 2 are space character

        let aCombination = '';
        try {
            for (let i = len; i > 0; i--) {
                let restLen = anagramLen - i;             
                for (let j = 1, k = (restLen - 1); (j < restLen && k > 0); j++, k--) {
                    for (let l = 0; l < words[i].length; l++) {
                        for (let m = 0; m < words[j].length; m++) {
                            for (let n = 0; n < words[k].length; n++) {
                                aCombination = [words[i][l], words[j][m], words[k][n]].join(' ');
                                if (Md5.hashStr(aCombination) === hash) {
                                    result = aCombination;
                                    return result;
                                }
                            }
                        }
                    }
                }
                console.log('Next Step Length ' + i);
            }
        }
        catch (e) {
            console.log(e);
        }

        console.log('test finished');
        return result;
    }

    //public searchWordDouble(words: IWordsList, hash: string): string {
    //    let result = "";
    //    let len = words.length - 1;
    //    let anagramLen = this.anagram.length - 2; // 2 are space character
    //    //console.log(len + ' ' + anagramLen);
    //    let testCombine = [];

    //    let aCombination = '', bCombination;
    //    try {
    //        for (let i = len; i > 0; i--) {
    //            let restLen = anagramLen - i;
    //            testCombine = []; 
    //            for (let j = 1, k = (restLen - 1); (j < restLen && k > 0); j++, k--) {
    //                let aCombine = parseInt([j, k].join(""));
    //                if (testCombine.find((value: number) => value == aCombine) === undefined) {
    //                    testCombine.push(aCombine);
    //                    aCombine = parseInt([k, j].join(""));
    //                    if (testCombine.find((value: number) => value == aCombine) === undefined)
    //                        testCombine.push();

    //                    for (let l = 0; l < words[i].length; l++) {
    //                        for (let m = 0; m < words[j].length; m++) {
    //                            for (let n = 0; n < words[k].length; n++)
    //                            {
    //                                aCombination = [words[i][l], words[j][m], words[k][n]].join(' ');
    //                                if (Md5.hashStr(aCombination) === hash) {
    //                                    result = aCombination;                                        
    //                                    return result;
    //                                }
    //                                aCombination = [words[i][l], words[k][n], words[j][m]].join(' ');
    //                                if (Md5.hashStr(aCombination) === hash) {
    //                                    result = aCombination;
    //                                    return result;
    //                                }
    //                            }
    //                        }
    //                    }
    //                } 
                        
    //            }
    //            console.log('Next Step Length ' + i);
    //        }
    //    }
    //    catch (e) {
    //        console.log(e);
    //    }
        
    //    console.log('test finished');
    //    return result;
    //}

    private uniqueAnaLet(): string {
        let a = this.anagram.split(' ').join('');
        return Array.from(new Set(a)).join('');
    }
    private isPossibleWord(word: string): boolean {
        let bCorrect = false;
        if (word || word.length > 0) {
            bCorrect = true;
            for (let index = 0; index < word.length; index++) {
                if (this._anaLet.indexOf(word.charAt(index)) === -1) {
                    bCorrect = false; index = word.length;
                }
            }
        }
        return bCorrect;
    }
}
