import {testCases as original,runCase} from '../cases.mjs';
import {testCases as localized} from './cases-meta.mjs';
export const testCases=original.map((test,i)=>({...test,name:localized[i].name,expect:localized[i].expect}));
export {runCase};
