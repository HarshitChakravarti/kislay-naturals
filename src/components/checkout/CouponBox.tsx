import React from 'react';

interface CouponBoxProps {
  couponCode: string;
  setCouponCode: (c: string) => void;
  couponApplied: boolean;
  couponError: string;
  handleApplyCoupon: () => void;
  handleRemoveCoupon: () => void;
}

export default function CouponBox({
  couponCode,
  setCouponCode,
  couponApplied,
  couponError,
  handleApplyCoupon,
  handleRemoveCoupon
}: CouponBoxProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Coupon Code</h3>
      {!couponApplied ? (
        <div className="flex space-x-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
          <button
            onClick={handleApplyCoupon}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Apply
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-green-600 text-sm font-medium">{couponCode.toUpperCase()}</span>
            <span className="ml-2 text-green-600 text-xs">Applied</span>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      )}
      {couponError && (
        <p className="text-red-500 text-xs mt-1">{couponError}</p>
      )}
    </div>
  );
}
