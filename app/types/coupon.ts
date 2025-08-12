export type CouponObject = {
  coupon_code: string;
  coupon_name: string;
  discount_value: number;
};

export type FindMatchingCouponType = {
  couponCode: string;
  couponList: CouponObject[];
};
