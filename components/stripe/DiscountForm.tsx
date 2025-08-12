import { useState } from "react";
import { Input } from "@heroui/react";
import { useApiQuery } from "@/lib/api-client";
import findMatchingCoupon from "@/utils/coupons/findMatchingCoupon";
import { CouponObject } from "@/app/types/coupon";
import StyledAsButton from "../StyledAsButton";

type couponCheckStatus = {
  status: string;
  message: string;
};

export default function DiscountForm() {
  const [couponCode, setCouponCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [couponStatus, setCouponStatus] = useState<couponCheckStatus | null>(
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (couponsLoading) {
      setCouponStatus({ status: "pending", message: "Checking..." });
    }

    if (!coupons || coupons.length === 0) {
      setErrorMessage("No coupons currently available");
      return;
    }
    if (couponsError) {
      setErrorMessage(
        "There was an error while checking your coupon! Try again?",
      );
      return;
    }

    const matchingCoupon = findMatchingCoupon({
      couponCode,
      couponList: coupons,
    });

    if (matchingCoupon) {
      setCouponStatus({ status: "success", message: "Discount applied!" });
    } else {
      setErrorMessage("invalid discount code");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2 items-end justify-center">
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
          errorMessage={errorMessage || "Please enter a valid discount code"}
          isInvalid={!!errorMessage}
          label="Discount Code"
        />
        <StyledAsButton
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded my-auto"
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
