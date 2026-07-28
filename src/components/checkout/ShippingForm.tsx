import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, User } from 'lucide-react';

interface CheckoutFormData {
  name: string;
  email: string;
  mobile: string;
  address: {
    flat: string;
    area: string;
    landmark?: string;
    city: string;
    state: string;
    zip: string;
  };
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry'
];

interface ShippingFormProps {
  formData: CheckoutFormData;
  errors: Record<string, string>;
  emailValidation: { isValid: boolean; message: string; isChecking: boolean };
  deliveryEstimate: { message: string; color: string } | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePincodeBlur: () => void;
}

export default function ShippingForm({
  formData,
  errors,
  emailValidation,
  deliveryEstimate,
  handleInputChange,
  handlePincodeBlur
}: ShippingFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <User className="h-5 w-5 mr-2 text-green-600" />
        Contact Information
      </h2>

      <div className="space-y-6">
        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10 ${
                  errors.email ? 'border-red-500' : 
                  emailValidation.isValid && !emailValidation.isChecking ? 'border-green-500' : 
                  'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {emailValidation.isChecking && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                </div>
              )}
              {!emailValidation.isChecking && emailValidation.message && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {emailValidation.isValid ? (
                    <div className="w-4 h-4 text-green-500">✓</div>
                  ) : (
                    <div className="w-4 h-4 text-red-500">✗</div>
                  )}
                </div>
              )}
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            {!errors.email && emailValidation.message && !emailValidation.isChecking && (
              <p className={`text-sm mt-1 ${
                emailValidation.isValid ? 'text-green-600' : 'text-red-500'
              }`}>
                {emailValidation.message}
              </p>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number *
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.mobile ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your 10-digit mobile number"
          />
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-600" />
            Shipping Address
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flat, House no., Building, Company, Apartment
              </label>
              <input
                type="text"
                name="address.flat"
                value={formData.address.flat}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.flat ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.flat && <p className="text-red-500 text-sm mt-1">{errors.flat}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area, Street, Sector, Village
              </label>
              <input
                type="text"
                name="address.area"
                value={formData.address.area}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.area ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Landmark
              </label>
              <input
                type="text"
                name="address.landmark"
                value={formData.address.landmark || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="E.g. near apollo hospital"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="address.zip"
                  value={formData.address.zip}
                  onChange={handleInputChange}
                  onBlur={handlePincodeBlur}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.zip ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="6-digit Pincode"
                />
                {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                {deliveryEstimate && !errors.zip && (
                  <p className={`text-[13px] mt-1 ${deliveryEstimate.color}`}>
                    {deliveryEstimate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Town/City
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
