import { useState } from "react";
import { Input } from "@heroui/react";
import { TicketPercent } from "lucide-react";
import { useApiQuery } from "@/lib/api-client";
import findMatchingCoupon from "@/utils/coupons/findMatchingCoupon";
import { CouponObject } from "@/app/types/coupon";
import StyledAsButton from "../StyledAsButton";

type DiscountFormType = {
  setCouponObject: React.Dispatch<React.SetStateAction<CouponObject | null>>;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
  couponCode: string;
};

export default function DiscountForm({
  setCouponObject,
  setCouponCode,
  couponCode,
}: DiscountFormType) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [couponStatus, setCouponStatus] = useState<StatusAndMessage | null>(
    null,
  );

  const {
    data: coupons,
    error: couponsError,
    isLoading: couponsLoading,
  } = useApiQuery<CouponObject[]>(["coupons", "all"], "/coupons", {
    refetchInterval: 0,
    refetchIntervalInBackGround: false,
    skip: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (couponsLoading) {
      setCouponObject(null);
      setCouponStatus({ status: "pending", message: "Checking..." });
    }

    if (!coupons || coupons.length === 0) {
      setErrorMessage("No coupons currently available");
      setCouponObject(null);
      return;
    }
    if (couponsError) {
      setErrorMessage(
        "There was an error while checking your coupon! Try again?",
      );
      setCouponObject(null);
      return;
    }

    const matchingCoupon = findMatchingCoupon({
      couponCode,
      couponList: coupons,
    });

    if (matchingCoupon) {
      setCouponObject(matchingCoupon);
      setCouponStatus({
        status: "success",
        message: `${matchingCoupon?.coupon_name} ${matchingCoupon?.discount_value}% discount applied!`,
      });
    } else {
      setErrorMessage("invalid discount code");
      setCouponObject(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2 items-end justify-center ">
        <Input
          onChange={(e) => {
            if (couponStatus) {
              setCouponStatus(null);
            }
            if (errorMessage) {
              setErrorMessage(null);
            }

            setCouponCode(e.target.value);
          }}
          value={couponCode}
          placeholder="Enter discount code"
          isRequired
          name="discount_code"
          type="text"
          className="text-light-font-color"
          errorMessage={errorMessage || "Please enter a valid discount code"}
          isInvalid={!!errorMessage}
          label="Discount Code"
        />

        <StyledAsButton
          startContent={<TicketPercent size={20} className="flex-shrink-0" />}
          // flex-shrink-0 was needed, because flex was making the icon tiny
          type="submit"
          className="px-5 py-2 bg-blue-500 text-white rounded my-auto"
          label="Apply"
        />
      </div>

      {couponStatus && (
        <p
          className={`w-full ml-2  ${couponStatus.status === "success" && "text-emerald-700"}`}
        >
          {couponStatus.message}
        </p>
      )}
    </form>
  );
}
