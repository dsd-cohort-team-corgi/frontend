import { CouponObject, FindMatchingCouponType } from "@/app/types/coupon";

export default function findMatchingCoupon({
  couponCode,
  couponList,
}: FindMatchingCouponType) {
  const trimmedCouponCode = couponCode.trim();

  if (couponList.length === 0) {
    return null;
  }

  return (
    couponList.find(
      (coupon: CouponObject) => coupon.coupon_code.trim() === trimmedCouponCode,
    ) || null
  );
}
