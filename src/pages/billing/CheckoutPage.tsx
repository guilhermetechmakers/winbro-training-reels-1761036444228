import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  CreditCard, 
  Building,
  Users,
  Calendar,
  Shield
} from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    period: 'month',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 10 users',
      '100 training clips',
      'Basic analytics',
      'Email support',
      'Standard security'
    ],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    period: 'month',
    description: 'Ideal for growing manufacturing teams',
    features: [
      'Up to 50 users',
      'Unlimited training clips',
      'Advanced analytics',
      'Priority support',
      'SSO integration',
      'Custom branding'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    period: 'month',
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited users',
      'Unlimited training clips',
      'Advanced analytics & reporting',
      '24/7 phone support',
      'Full SSO & SCIM',
      'Custom integrations',
      'Dedicated success manager'
    ],
    popular: false
  }
];

const billingCycles = [
  { id: 'monthly', name: 'Monthly', discount: 0 },
  { id: 'yearly', name: 'Yearly', discount: 20 }
];

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
  const isYearly = billingCycle === 'yearly';
  const discount = isYearly ? 20 : 0;
  const monthlyPrice = selectedPlanData?.price || 0;
  const yearlyPrice = monthlyPrice * 12;
  const discountedYearlyPrice = yearlyPrice * (1 - discount / 100);
  const finalPrice = isYearly ? discountedYearlyPrice : monthlyPrice;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Checkout submitted:', { selectedPlan, billingCycle, formData });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2">
          Select the perfect plan for your manufacturing training needs
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg">
          {billingCycles.map((cycle) => (
            <Button
              key={cycle.id}
              variant={billingCycle === cycle.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle(cycle.id)}
              className="relative"
            >
              {cycle.name}
              {cycle.discount > 0 && (
                <Badge className="absolute -top-2 -right-2 text-xs">
                  {cycle.discount}% off
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Plan Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Plan</h2>
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.id 
                    ? 'ring-2 ring-winbro-teal border-winbro-teal' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        {plan.popular && (
                          <Badge className="bg-winbro-teal">Most Popular</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">${isYearly ? Math.round(plan.price * (1 - discount / 100)) : plan.price}</span>
                        <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
                        {isYearly && (
                          <span className="text-sm text-winbro-success ml-2">
                            Save ${Math.round(plan.price * 12 * discount / 100)}/year
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value={plan.id} checked={selectedPlan === plan.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedPlanData?.name} Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {isYearly ? 'Billed yearly' : 'Billed monthly'}
                  </p>
                </div>
                <p className="font-semibold">${finalPrice.toFixed(2)}</p>
              </div>
              
              {isYearly && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Yearly discount (20%)</span>
                  <span className="text-winbro-success">-${(yearlyPrice - discountedYearlyPrice).toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isYearly ? 'Billed annually' : 'Billed monthly'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedPlanData?.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-winbro-success flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="invoice" id="invoice" />
                  <Label htmlFor="invoice">Invoice (Enterprise only)</Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Billing Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Billing Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Manufacturing Corp"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start space-x-2 p-4 bg-muted rounded-lg">
              <Shield className="h-5 w-5 text-winbro-teal mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Secure Payment</p>
                <p className="text-muted-foreground">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-winbro-teal hover:bg-winbro-teal/90">
              Complete Purchase - ${finalPrice.toFixed(2)}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}