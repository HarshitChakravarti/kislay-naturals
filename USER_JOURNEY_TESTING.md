# User Journey Testing Guide for Kislay Naturals

## Prerequisites
1. Development server running: `npm run dev`
2. Browser developer tools open (F12)
3. Network tab open to monitor API calls

## Test Scenarios

### Scenario 1: Basic Product Selection
**URL**: `http://localhost:3000/products/1`

**Steps**:
1. ✅ Page loads successfully
2. ✅ Product details display correctly
3. ✅ Quantity selector works (+ and - buttons)
4. ✅ "Buy Now" button is visible and clickable

**Expected Result**: Modal opens with checkout form

### Scenario 2: Form Validation Testing
**When**: Checkout modal is open

**Test Cases**:

#### 2.1 Empty Form Submission
- Click "Proceed to Payment" without filling any fields
- **Expected**: Validation errors for all required fields

#### 2.2 Invalid Email Format
- Fill: Name="John", Email="invalid-email", Mobile="9876543210", Address="123 Main St, Mumbai, MH, 400001"
- Click "Proceed to Payment"
- **Expected**: "Invalid email address" error

#### 2.3 Invalid Mobile Number
- Fill: Name="John", Email="john@example.com", Mobile="123", Address="123 Main St, Mumbai, MH, 400001"
- Click "Proceed to Payment"
- **Expected**: "Invalid mobile number (must be 10 digits)" error

#### 2.4 Incomplete Address
- Fill: Name="John", Email="john@example.com", Mobile="9876543210", Street="123 Main St", City="", State="MH", ZIP="400001"
- Click "Proceed to Payment"
- **Expected**: "City is required" error

#### 2.5 Valid Form Data
- Fill all fields correctly:
  - Name: "John Doe"
  - Email: "john@example.com"
  - Mobile: "9876543210"
  - Street: "123 Main Street"
  - City: "Mumbai"
  - State: "Maharashtra"
  - ZIP: "400001"
- Click "Proceed to Payment"
- **Expected**: Proceeds to payment step

### Scenario 3: Payment Integration Testing

#### 3.1 Without Razorpay Configuration
**Current State**: No environment variables set
- Fill valid form and click "Proceed to Payment"
- **Expected**: Error message "Razorpay is not configured" or similar
- **Check Network Tab**: Should see 500 error from `/api/create-razorpay-order`

#### 3.2 With Mock Razorpay Configuration
**Setup**: Add test Razorpay keys to `.env.local`
- Fill valid form and click "Proceed to Payment"
- **Expected**: Razorpay test modal opens
- **Test Payment**: Use Razorpay test card numbers
- **Expected**: Payment success, order saved to database

### Scenario 4: Order Creation Testing

#### 4.1 Successful Order Creation
**When**: Payment is successful
- **Check Network Tab**: Should see successful POST to `/api/save-order`
- **Expected Response**: `{ success: true, message: 'Order saved successfully.', order: {...} }`
- **Check Database**: Order should be created in `orders` table

#### 4.2 Order Creation Failure
**When**: Payment succeeds but order saving fails
- **Expected**: Alert message "Payment was successful, but we failed to save your order. Please contact support."
- **Check Console**: Should see error logs

### Scenario 5: Error Handling Testing

#### 5.1 Network Errors
- Disconnect internet before clicking "Proceed to Payment"
- **Expected**: Appropriate error message

#### 5.2 Server Errors
- Mock server error (500 response)
- **Expected**: User-friendly error message

#### 5.3 Invalid Product Data
- Test with invalid product ID
- **Expected**: Proper error handling

## Testing Checklist

### UI/UX Testing
- [ ] Modal opens smoothly with animation
- [ ] Form fields are properly labeled
- [ ] Validation errors appear in real-time
- [ ] Order summary shows correct product and quantity
- [ ] Modal can be closed with X button
- [ ] Modal closes when clicking outside
- [ ] Form resets after successful submission

### Functional Testing
- [ ] Quantity selector updates order total
- [ ] Form validation works for all fields
- [ ] Payment integration calls correct API
- [ ] Order creation saves to database
- [ ] Error handling shows appropriate messages
- [ ] Success flow completes end-to-end

### Performance Testing
- [ ] Modal opens quickly (< 500ms)
- [ ] Form submission is responsive
- [ ] API calls complete within reasonable time
- [ ] No memory leaks in modal state

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## Debugging Tips

### Check Browser Console
Look for:
- JavaScript errors
- Network request failures
- API response errors

### Check Network Tab
Monitor these API calls:
- `POST /api/create-razorpay-order`
- `POST /api/save-order`

### Check Database
Verify order creation in your database:
- Orders table has new entry
- Order items are properly linked
- Payment details are stored

## Common Issues and Solutions

### Issue: Modal doesn't open
**Solution**: Check if `isModalOpen` state is properly managed

### Issue: Form validation not working
**Solution**: Check `validateForm()` function in CheckoutModal.tsx

### Issue: Payment gateway error
**Solution**: Verify Razorpay environment variables are set

### Issue: Order not saved
**Solution**: Check database connection and order creation API

## Next Steps After Testing

1. **Fix any bugs found during testing**
2. **Set up real Razorpay account for production**
3. **Test with real payment methods**
4. **Implement order confirmation emails**
5. **Add order tracking functionality**
