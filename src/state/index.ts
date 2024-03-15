import { atom } from "recoil";
import { VerificationStatusProps } from "../interfaces";

export const verificationAtom = atom<VerificationStatusProps>({
    key: "verificationState",
    default: {
        ninVerified: false,
        bvnVerified: false,
    },
});
