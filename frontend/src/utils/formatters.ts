export const formatBookingPurpose = (purpose: string): string => {
  const purposeMap: { [key: string]: string } = {
    educational: 'Educational Tour',
    business: 'Business Visit',
    leisure: 'Leisure Visit',
    workshop: 'Workshop Participation',
    other: 'Other'
  };

  return purposeMap[purpose] || purpose;
}; 