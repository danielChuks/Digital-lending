import { useCreditApplicationDataContext } from "../context/creditApplDetailsContext";
import { PostAxios } from "../Network/api";

const usePopulateCreditDraft = () => {
  const { creditApplDataFields_context, setCreditApplDataFields_context } =
    useCreditApplicationDataContext();

  const populateCreditDraft = async (): Promise<any> => {
    const payload = {
      instituteCode: "DBS01",
      transmissionTime: Date.now(),
      dbsCustApplId: sessionStorage.getItem("dbsCustApplId"),
    };
    try {
      setCreditApplDataFields_context((prev) => ({
        ...prev,
        loading: true,
      }));
      const responseCustomerDraft = await PostAxios(
        "/app/dbs/creditapplication/findApplDraft",
        payload
      );
      const obj = responseCustomerDraft.data.applData;
      const keyword = sessionStorage.getItem("dbsCustApplId");
      let index = -1;
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].dbsCustApplId == keyword) {
          index = i;
        }
      }

      if (index !== -1) {
        setCreditApplDataFields_context((prev) => ({
          ...prev,
          basicInfo: {
            ...prev.basicInfo,
            amount: obj[index].creditAppDraftData.amount,
            creditTypeId: obj[index].creditAppDraftData.creditTypeId,
            productId: obj[index].creditAppDraftData.productId,
            currencyId: obj[index].creditAppDraftData.currencyId,
            purposeOfCreditId: obj[index].creditAppDraftData.purposeOfCreditId,
            repaySourceAcctNo: obj[index].creditAppDraftData.repaySourceAcctNo,
            strApplicationDate:
              obj[index].creditAppDraftData.strApplicationDate,
            termCode: obj[index].creditAppDraftData.termCode,
            termValue: obj[index].creditAppDraftData.termValue,
          },
          documentInfodata: obj[index].creditAppDraftData.documentList,
          collateralinfoData: obj[index].creditAppDraftData.collateralData,
        }));
      }
      setCreditApplDataFields_context((prev) => ({
        ...prev,
        loading: false,
      }));
    } catch (err) {
      setCreditApplDataFields_context((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  return { populateCreditDraft };
};
export default usePopulateCreditDraft;
