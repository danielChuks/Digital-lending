import { useCustomerContext } from "../context/customerDetailsContext";
import { PostAxios } from "../Network/api";

const usePopulateCustomerDraft = () => {
  const { CustomerData, setCustomerData } = useCustomerContext();

  const populateCustomerDraft = async (): Promise<any> => {
    const payload = {
      instituteCode: "DBS01",
      transmissionTime: Date.now(),
      dbsCustApplId: sessionStorage.getItem("dbsCustApplId"),
    };
    try {
      setCustomerData((prev) => ({
        ...prev,
        loading: true,
      }));
      const responseCustomerDraft = await PostAxios(
        "/app/dbs/customerapplication/findCustomerApplDraft",
        payload
      );

      setCustomerData((prev) => ({
        ...prev,
        customerCategory: responseCustomerDraft.data.customerCategory,
        basicInfoData: {
          ...prev.basicInfoData,
          email: responseCustomerDraft.data.email,
          mobile: responseCustomerDraft.data.mobile,
          strDateOfBirth: responseCustomerDraft.data.strDateOfBirth,
          nextOfKin: responseCustomerDraft.data.nextOfKin,
          spouseName: responseCustomerDraft.data.spouseName,
          titleCd: responseCustomerDraft.data.titleCd,
          lastName: responseCustomerDraft.data.lastName,
          middleName: responseCustomerDraft.data.middleName,
          firstName: responseCustomerDraft.data.firstName,
          customerType: responseCustomerDraft.data.customerType,
          nationalityCd: responseCustomerDraft.data.nationalityCd,
          industryId: responseCustomerDraft.data.industryId,
          countryOfResidenceId: responseCustomerDraft.data.countryOfResidenceId,
          maritalStatus: responseCustomerDraft.data.maritalStatus,
          countryOfBirthId: responseCustomerDraft.data.countryOfBirthId,
          gender: responseCustomerDraft.data.gender,
          occupationCd: responseCustomerDraft.data.occupationCd,
          employmentFlag: responseCustomerDraft.data.employmentFlag,
          noOfDependents: responseCustomerDraft.data.noOfDependents,
          organisationName: responseCustomerDraft.data.organisationName,
          registrationNumber: responseCustomerDraft.data.registrationNumber,
          strRegistrationDate: responseCustomerDraft.data.strRegistrationDate,
        },
        addressInfoData: {
          ...prev.addressInfoData,
          primaryAddressCity: responseCustomerDraft.data.primaryAddressCity,
          primaryAddressLine1: responseCustomerDraft.data.primaryAddressLine1,
          primaryAddressLine2: responseCustomerDraft.data.primaryAddressLine2,
          primaryAddressLine3: responseCustomerDraft.data.primaryAddressLine3,
          primaryAddressLine4: responseCustomerDraft.data.primaryAddressLine4,
          primaryAddressState: responseCustomerDraft.data.primaryAddressState,
          strFromDate: responseCustomerDraft.data.strFromDate,
          primaryAddressCountryCd:
            responseCustomerDraft.data.primaryAddressCountryCd,
          addressTypeId: responseCustomerDraft.data.addressTypeId?.toString(),
        },
        otherInfoData: {
          ...prev.otherInfoData,
          openingReasonCd: responseCustomerDraft.data.openingReasonCd,
          marketingCampaignCd: responseCustomerDraft.data.marketingCampaignCd,
          sourceOfFundCd: responseCustomerDraft.data.sourceOfFundCd,
          amountUnit: responseCustomerDraft.data.amountUnit,
          monthlyIncomeAmount: responseCustomerDraft.data.monthlyIncomeAmount,
        },
        strphotoGraphImage: responseCustomerDraft.data.strphotoGraphImage,
        strsignatureImage: responseCustomerDraft.data.strsignatureImage,
        identificationInfoData: responseCustomerDraft.data.identificationsList,
        documentInfodata: responseCustomerDraft.data.documentList,
        loading: false,
      }));
    } catch (err) {
      setCustomerData((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  return { populateCustomerDraft };
};

export default usePopulateCustomerDraft;
