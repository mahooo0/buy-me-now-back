import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();
const languageState = atom({
    key: 'languageState', // unique ID (with respect to other atoms/selectors)
    default: 'az', // default value (aka initial value)
    effects_UNSTABLE: [persistAtom], // persist the state
});
export default languageState;
