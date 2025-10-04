# Environment Setup for YugaFarms

## Frontend Environment Variables

Create a `.env.local` file in the `YugaFarms` directory with the following variables:

```env
# Backend URL
NEXT_PUBLIC_BACKEND=http://localhost:1337

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RPLaE4n5TwcMVj
```

## Backend Environment Variables

Create a `.env` file in the `YugaFarmsBackend` directory with the following variables:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_RPLaE4n5TwcMVj
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

## Getting Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/Login to your account
3. Go to Settings > API Keys
4. Generate API Keys
5. Copy the Key ID and Key Secret
6. Add them to your environment files

**Important:** You need to add the correct Razorpay Key Secret that matches your Key ID (`rzp_live_RPLaE4n5TwcMVj`) to make payments work properly.

## Strapi Permissions Setup

After updating the schemas, you need to set up permissions in Strapi:

1. Go to `http://localhost:1337/admin`
2. Navigate to Settings > Users & Permissions Plugin > Roles
3. Edit the "Authenticated" role
4. Enable the following permissions for "Order":
   - find
   - findOne
   - create
   - update
5. Enable the following permissions for "Transaction":
   - find
   - findOne
   - create
   - update

## Testing the Flow

1. Start both servers:
   - Frontend: `npm run dev` (in YugaFarms directory)
   - Backend: `npm run develop` (in YugaFarmsBackend directory)

2. Create a user account and login
3. Add items to cart
4. Proceed to checkout
5. Test both COD and Razorpay payment methods
