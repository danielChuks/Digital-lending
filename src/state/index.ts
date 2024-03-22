import { atom } from "recoil";
import { VerificationStatusProps, documentUploadProps } from "../interfaces";

export const verificationAtom = atom<VerificationStatusProps>({
    key: "verificationState",
    default: {
        ninVerified: false,
        bvnVerified: false,
    },
});


export const documentUploadAtom = atom<documentUploadProps> ({
    key: "documentState",
    default: { url: null }
})