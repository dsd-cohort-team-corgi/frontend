import getFailureObjectDetails from "@/utils/getFailureObjectDetails";
import { generateButtonAndErrorTextType } from "@/app/types/createProfileTypes";

export default function generateButtonAndErrorText({
  customerMutation,
  addressMutation,
}: generateButtonAndErrorTextType) {
  const isPending = customerMutation.isPending || addressMutation.isPending;
  const isError = customerMutation.isError || addressMutation.isError;
  const isSuccess = customerMutation.isSuccess && addressMutation.isSuccess;

  let buttonLabel;
  let detailedError;
  if (isPending) {
    buttonLabel = "Submitting Profile...";
  } else if (isError) {
    buttonLabel = "Submission Failed. Retry?";
    detailedError = `${getFailureObjectDetails(customerMutation) || getFailureObjectDetails(addressMutation)}`;
  } else if (isSuccess) {
    buttonLabel = "Profile Created!";
  } else {
    buttonLabel = "Sign Up";
  }

  return { isPending, isError, isSuccess, buttonLabel, detailedError };
}
