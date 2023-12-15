export interface CreditCollateralDocument {
    collateralDescription: string | any;
    collateralMarketValue: number | null | any;
    collateralRefNo: number | null | any;
    collateralTypeDescription: string | any;
    collateralTypeId: number | null | any;
    expiryDateStr: string | any;
    forcedSalesValue: number | null | any;
    collateralCurrencyId: number | null;
    lendingPercent: number | null | any;
    lendingValue: number | null | any;
}
