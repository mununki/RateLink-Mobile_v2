const checkMutationValidity = rate => {
  if (
    rate.selectedCt.length > 0 &&
    rate.selectedLn.length > 0 &&
    rate.selectedPl.length > 0 &&
    rate.selectedPd.length > 0 &&
    rate.selectedTy.length > 0 &&
    (rate.buying20 === 0 || rate.buying20) &&
    (rate.buying40 === 0 || rate.buying40) &&
    (rate.buying4H === 0 || rate.buying4H) &&
    (rate.selling20 === 0 || rate.selling20) &&
    (rate.selling40 === 0 || rate.selling40) &&
    (rate.selling4H === 0 || rate.selling4H) &&
    (rate.loadingFT === 0 || rate.loadingFT) &&
    (rate.dischargingFT === 0 || rate.dischargingFT) &&
    (rate.offeredDate.isBefore(rate.effectiveDate) ||
      rate.offeredDate.isSame(rate.effectiveDate))
  ) {
    return true;
  } else {
    return false;
  }
};

export default checkMutationValidity;
