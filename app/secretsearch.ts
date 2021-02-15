import { Md5 } from 'ts-md5/dist/md5';

export interface IWordInfo {
    length: any;
    [key: number]: string[];
}
export interface ISecretSearch {
    anagram: string;
    possibleWordsList(lines: string[]): IWordInfo;
    getPossibleWordsLengthsSampleData(): number[];
    calculateMeanOfWordsLengthsSampleData(sampleData: number[]): number;
    calculateStandardDeviationOfWordsLengthsSampleData(sampleData: number[]): number;
    searchWord(words: IWordInfo, hash: string): string;
   // searchWordDouble(words: IWordInfo, hash: string): string;
    searchWordInSubset(words: IWordInfo, hash: string, range: ISubRange): string;
}

export interface ISubRange {
    start: number;
    ends: number;
}

export class SecretSearch implements ISecretSearch {
    private _anagram: string = '';
    private _anaLet: string = '';
    private wordsLists: IWordInfo = [];
    private _wordsLengths: number[] = [];

    constructor() { }
    set anagram(an: string) {
        if (an !== undefined || an !== null || an !== "") {
            this._anagram = an;
            this._anaLet = this.uniqueAnaLet();
        }
    }
    get anagram(): string { return this._anagram; }


    public possibleWordsList(lines: string[]): IWordInfo {
        //let reWords = [];
        this.wordsLists = [], this._wordsLengths=[];
        for (var line = 0; (line < lines.length); line++) {
            if (this.isPossibleWord(lines[line])) {
                let word = lines[line];
                let len = word.length;
                if (this.wordsLists[len] === undefined) {
                    this.wordsLists[len] = [];
                    this._wordsLengths.push(len);
                }
                    
                let a = this.wordsLists[len];
                if (a.find((value: string) => (value === word)) === undefined)
                    this.wordsLists[len].push(word);
            }
        }
        console.log(this._wordsLengths);
        return this.wordsLists;
    }
    public getPossibleWordsLengthsSampleData(): number[] {
        return this._wordsLengths;
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
                                                                                                
    public searchWordInSubset(words: IWordInfo, hash: string, range: ISubRange): string
    {
        let result = "";
        let anagramLen = this.anagram.length - 2; // 2 are space character
       
        let aCombination = '';
        try {
            for (let i = range.start; i < range.ends; i++){
                let restLen = anagramLen - i;
                for (let j = 1, k = (restLen - 1); (j < restLen && k > 0); j++, k--) {
                    for (let l = 0; l < words[i].length; l++) {
                        for (let m = 0; m < words[j].length; m++) {
                            for (let n = 0; n < words[k].length; n++)
                            {
                                aCombination = Array.from([words[i][l], words[j][m], words[k][n]]).join(' ');                                
                                
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
    public searchWord(words: IWordInfo, hash: string): string {
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

    //public searchWordDouble(words: IWordInfo, hash: string): string {
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
