import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  getDaysUntilExpiry,
  getEarliestBatchDate,
  isDateClose,
} from '@/lib/utils';
import { AlertTriangle, Minus, Plus, Tag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useEffect, useState } from 'react';
import { VoucherDropdown } from './VoucherDropdown';
// Add this new interface
interface AdminPromotion {
  id: number;
  minimumSpend: number;
  discountAmount: number;
}

interface Voucher {
  voucherId: number;
  voucherCode: string;
  voucherValue: number;
  expiresAt: string;
  used: boolean;
}

export const Cart: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartPrice, 
    addVoucher, 
    removeVoucher,
    selectedVoucher,
    setSelectedVoucher 
  } = useCart();
  const [calculatedTotal, setCalculatedTotal] = useState<number | null>(null);
  const [adminPromotionAmount, setAdminPromotionAmount] = useState<number>(0);
  const [adminPromotions, setAdminPromotions] = useState<AdminPromotion[]>([]);
  const [nextBestPromotion, setNextBestPromotion] = useState<AdminPromotion | null>(null);

  useEffect(() => {
    const fetchCalculatedTotal = async () => {
      try {
        const response = await fetch('/api/cart/calculate-total', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCalculatedTotal(data.cartTotal);

        setAdminPromotionAmount(data.adminPromotionAmount);
      } catch (error) {
        console.error('Error fetching calculated total:', error);
      }
    };

    const fetchAdminPromotions = async () => {
      try {
        const response = await fetch('/api/promotions/admin/active', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAdminPromotions(data);
      } catch (error) {
        console.error('Error fetching admin promotions:', error);
      }
    };

    fetchCalculatedTotal();
    fetchAdminPromotions();
  }, [cart]);

  useEffect(() => {
    if (adminPromotions.length > 0 && calculatedTotal !== null) {
      const eligiblePromotions = adminPromotions.filter(promo => promo.minimumSpend > cartPrice);

      const sortedPromotions = eligiblePromotions.sort((a, b) => {
        if (a.minimumSpend === b.minimumSpend) {
          return b.discountAmount - a.discountAmount;
        }
        return a.minimumSpend - b.minimumSpend;
      });

      setNextBestPromotion(sortedPromotions[0] || null);
    }
  }, [adminPromotions, calculatedTotal]);

  const getCartItemSavings = (promoSavings: number, bulkSavings: number) => {
    const savingsPerItem = promoSavings + bulkSavings;
    return savingsPerItem.toFixed(2);
  };

  return (
    <div className="wrapper">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      {cart?.cartLineItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart?.cartLineItems.map((item) => {
            const subtotal = item.price * item.quantity;
            const isCloseToExpiry = isDateClose(
              getEarliestBatchDate(item.product.batches) || '',
            );
            const daysUntilExpiry = getDaysUntilExpiry(
              getEarliestBatchDate(item.product.batches) || '',
            );
            const isDiscounted = item.product.price > item.price;
            return (
              <div
                key={item.cartLineItemId}
                className="flex items-center justify-between border-b border-gray-200 py-4"
              >
                <div className="flex items-start space-x-4 ">
                  <img
                    src={
                      item.product.productPictures[0] ||
                      '/src/assets/food-icon.png'
                    }
                    alt={item.product.listingTitle}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="text-left space-y-1">
                    <div className="flex">
                      <h3 className="font-semibold text-lg">
                        {item.product.listingTitle}
                      </h3>
                      {isCloseToExpiry && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="warning" className="ml-3 justify-center flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                <span>Expiring Soon</span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              {daysUntilExpiry === 0 ? (
                                <p>
                                  Best before date is <b>TODAY</b>.
                                </p>
                              ) : (
                                <p>
                                  Best before date is in{' '}
                                  <b>{daysUntilExpiry} day(s)</b>.
                                </p>
                              )}
                              <p>Please consume soon after purchase.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {isDiscounted && (
                        <p className="text-sm text-gray-500 line-through">
                          ${item.product.price.toFixed(2)}
                        </p>
                      )}
                      <span
                        className={`text-sm font-semibold ${isDiscounted ? 'text-secondary' : 'text-gray-700'
                          }`}
                      >
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">each</span>
                    </div>
                    <p className="text-md text-gray-600">
                      Subtotal:{' '}
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={`flex flex-col text-left min-w-[220px] ${!isCloseToExpiry ? 'ml-[80px]' : ''}`}>
                  {item.bulkPricingDiscount > 0 && (
                    <p className="flex items-center text-secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      Bulk Discount: -${item.bulkPricingDiscount.toFixed(2)}
                    </p>
                  )}

                  {item.promotionDiscount > 0 && (
                    <p className="flex items-center text-secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      Promo Discount: -${item.promotionDiscount.toFixed(2)}
                    </p>
                  )}
                  <p className="font-medium">
                    Total Savings: $
                    {getCartItemSavings(
                      item.bulkPricingDiscount,
                      item.promotionDiscount,
                    )}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded">
                    <Button
                      variant="ghost"
                      className="rounded-none"
                      size="icon"
                      onClick={() =>
                        updateQuantity(
                          item.product.productId,
                          item.quantity - 1,
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      className="rounded-none"
                      size="icon"
                      onClick={() =>
                        updateQuantity(
                          item.product.productId,
                          item.quantity + 1,
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.product.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          <div className="flex justify-between items-center pt-6">
            <div className="text-2xl font-bold flex flex-col">
              <div className="flex items-center">
                Total:
                {calculatedTotal !== null && (calculatedTotal < cartPrice || selectedVoucher) ? (
                  <>
                    <span className="line-through text-gray-500 mr-2">
                      ${cartPrice.toFixed(2)}
                    </span>
                    <div className="flex flex-col">
                      {Number((cartPrice - calculatedTotal).toFixed(2)) > 0 && (
                        <span className="flex items-center text-orange-500 text-sm">
                          <Tag className="h-3 w-3 mr-1" />
                          Sitewide Promotion (-${(cartPrice - calculatedTotal).toFixed(2)})
                        </span>
                      )}
                      {selectedVoucher && (
                        <span className="flex items-center text-blue-500 text-sm">
                          <Tag className="h-3 w-3 mr-1" />
                          Voucher Applied (-${selectedVoucher.voucherValue.toFixed(2)})
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <span>${cartPrice.toFixed(2)}</span>
                )}
              </div>
              {nextBestPromotion && (
                <p className="text-sm text-red-500 mt-2 italic text-left">
                  Add ${(nextBestPromotion.minimumSpend - cartPrice).toFixed(2)} more to your cart to save ${nextBestPromotion.discountAmount.toFixed(2)}!
                </p>
              )}
            </div>
            <VoucherDropdown
              onVoucherSelect={setSelectedVoucher}
              selectedVoucher={selectedVoucher}
              onApply={(voucherCode) => {
                if (voucherCode) {
                  addVoucher(voucherCode);
                } else {
                  if (selectedVoucher?.voucherCode) {
                    removeVoucher(selectedVoucher.voucherCode);
                  }
                }
              }}
            />
            <Link to="/buyer/checkout">
              <Button variant="secondary" className="button-green" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
