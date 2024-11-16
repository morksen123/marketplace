import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Recycle, 
  Target, 
  Apple, 
  Package, 
  Flower2, 
  Flame, 
  Loader2 
} from 'lucide-react';
import { FoodDonationType } from '../types';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Batch, FoodDonationStats } from '../types';
import { handleSuccessApi, handleErrorApi } from '@/lib/api-client';
interface FoodDonationCardProps {
  weightSaved: number;
}

export const FoodDonationCard = ({ weightSaved }: FoodDonationCardProps) => {
  const [expiringBatches, setExpiringBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [donationType, setDonationType] = useState<FoodDonationType>('COMPOSTE');
  const [donationStats, setDonationStats] = useState<FoodDonationStats>({
    totalDonationsByType: {
      COMPOSTE: 0,
      BIOGAS: 0,
      UPCYCLING: 0,
    },
    distributorDonationsByType: {
      COMPOSTE: 0,
      BIOGAS: 0,
      UPCYCLING: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch('/api/distributor/batches', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch batches');
        const data = await response.json();
        
        // Store all batches for selection
        setAllBatches(data);
        
        // Filter and sort batches for display
        const filteredBatches = data.filter((batch: Batch) => {
          const expiryDate = new Date(batch.bestBeforeDate);
          const now = new Date();
          const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
          return daysToExpiry <= 14;
        });

        const sortedBatches = filteredBatches
          .sort((a: Batch, b: Batch) => {
            const aDate = new Date(a.bestBeforeDate);
            const bDate = new Date(b.bestBeforeDate);
            return aDate.getTime() - bDate.getTime();
          })
          .slice(0, 3);

        setExpiringBatches(sortedBatches);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    const fetchDonationStats = async () => {
      try {
        const response = await fetch('/api/distributor/food-donations/stats', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch donation stats');
        const data = await response.json();
        setDonationStats(data);
      } catch (error) {
        console.error('Error fetching donation stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
    fetchDonationStats();
  }, []);

  const handleDonation = async () => {
    if (!selectedBatch || !donationType) return;

    try {
      setLoading(true);
      
      const response = await fetch(
        `/api/distributor/food-donations?batchId=${selectedBatch}&foodDonationType=${donationType}`, 
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to process donation');
      }

      // If successful:
      // 1. Refresh the donation stats
      const updatedStats = await fetch('/api/distributor/food-donations/stats', {
        credentials: 'include',
      }).then(res => res.json());
      
      // 2. Refresh the batches
      const updatedBatchesResponse = await fetch('/api/distributor/batches', {
        credentials: 'include',
      }).then(res => res.json());

      // 3. Update all states
      setDonationStats(updatedStats);
      setAllBatches(updatedBatchesResponse);
      
      // Filter and sort the updated batches for expiring batches display
      const filteredBatches = updatedBatchesResponse.filter((batch: Batch) => {
        const expiryDate = new Date(batch.bestBeforeDate);
        const now = new Date();
        const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return daysToExpiry <= 14;
      });

      const sortedBatches = filteredBatches
        .sort((a: Batch, b: Batch) => {
          const aDate = new Date(a.bestBeforeDate);
          const bDate = new Date(b.bestBeforeDate);
          return aDate.getTime() - bDate.getTime();
        })
        .slice(0, 3);

      setExpiringBatches(sortedBatches);
      
      // 4. Reset selection
      setSelectedBatch('');
      setDonationType('COMPOSTE');

      handleSuccessApi('Donation processed successfully', 'Thank you for your contribution!');
    } catch (error) {
      console.error('Error processing donation:', error);
      // Optional: Add error toast/notification
      handleErrorApi('Failed to process donation', 'Please try again later');
    } finally {
      setLoading(false);
    }
  };

  const donationCards = [
    {
      type: 'COMPOSTE' as FoodDonationType,
      title: 'Food Composting',
      icon: <Apple className="h-8 w-8 text-yellow-600" />,
      platformTotal: donationStats.totalDonationsByType.COMPOSTE,
      distributorTotal: donationStats.distributorDonationsByType.COMPOSTE,
      description: 'Convert food waste into nutrient-rich soil',
      gradient: 'from-yellow-50 to-yellow-100',
    },
    {
      type: 'BIOGAS' as FoodDonationType,
      title: 'Biogas Production',
      icon: <Flame className="h-8 w-8 text-blue-600" />,
      platformTotal: donationStats.totalDonationsByType.BIOGAS,
      distributorTotal: donationStats.distributorDonationsByType.BIOGAS,
      description: 'Transform waste into renewable energy',
      gradient: 'from-blue-50 to-blue-100',
    },
    {
      type: 'UPCYCLING' as FoodDonationType,
      title: 'Food Upcycling',
      icon: <Recycle className="h-8 w-8 text-purple-600" />,
      platformTotal: donationStats.totalDonationsByType.UPCYCLING,
      distributorTotal: donationStats.distributorDonationsByType.UPCYCLING,
      description: 'Give food waste a second life',
      gradient: 'from-purple-50 to-purple-100',
    },
  ];

  // Helper function to get expiry status
  const getExpiryStatus = (bestBeforeDate: string) => {
    const now = new Date();
    const expiryDate = new Date(bestBeforeDate);
    const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (daysToExpiry <= 0) return { status: 'expired', badge: 'Not Available for Sale', className: 'bg-gray-500' };
    if (daysToExpiry <= 3) return { status: 'urgent', badge: 'Urgent', className: 'bg-red-500' };
    if (daysToExpiry <= 7) return { status: 'warning', badge: 'Warning', className: 'bg-orange-500' };
    if (daysToExpiry <= 14) return { status: 'near', badge: 'Near Expiry', className: 'bg-yellow-500' };
    return { status: 'ok', badge: 'Not Expiring Soon', className: 'bg-green-500' };
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      <CardHeader className="border-b border-gray-100 pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <Flower2 size={28} className="text-green-600" />
            </div>
            Donate & Make a Difference
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {donationCards.map((card) => (
            <Card 
              key={card.type} 
              className={`group relative overflow-hidden bg-gradient-to-br ${card.gradient} 
                border-none shadow-lg hover:shadow-xl transition-all duration-300 
                hover:-translate-y-1`}
            >
              {/* Decorative background circle */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full 
                transform transition-transform group-hover:scale-150 duration-500" />
              
              <CardContent className="p-8 relative">
                <div className="flex flex-col items-center gap-6">
                  {/* Icon container with animation */}
                  <div className="relative w-24 h-24 flex items-center justify-center 
                    bg-white/90 rounded-2xl shadow-lg transform rotate-3 
                    group-hover:rotate-0 transition-all duration-300">
                    <div className="transform group-hover:scale-110 transition-transform duration-300">
                      {card.icon}
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    {/* Title */}
                    <h3 className="font-bold text-xl text-gray-800">{card.title}</h3>
                    
                    {/* Stats Container */}
                    <div className="space-y-3">
                      {/* Platform Total */}
                      <div className="p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                        <p className="text-sm text-gray-600 mb-1">Total Contributed</p>
                        <p className="text-3xl font-bold text-green-600">
                          {card.platformTotal.toFixed(1) ?? 0}
                          <span className="text-lg text-green-600 ml-1">kg</span>
                        </p>
                      </div>
                      
                      {/* User Total */}
                      <div className="p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                        <p className="text-sm text-gray-600 mb-1">Your Contribution</p>
                        <p className="text-3xl font-bold text-green-400">
                          {card.distributorTotal?.toFixed(1) ?? 0}
                          <span className="text-lg text-green-400 ml-1">kg</span>
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 font-medium px-4">
                      {card.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-600" />
              Expiring Batches [14 days]
            </h3>
            <div className="space-y-4">
              {expiringBatches.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No expiring batches at the moment</p>
                </div>
              ) : (
                expiringBatches.slice(0, 3).map((batch) => {
                  const expiryStatus = getExpiryStatus(batch.bestBeforeDate);
                  return (
                    <Alert 
                      key={batch.batchId} 
                      className="bg-white border border-gray-100 hover:border-gray-200 
                        transition-colors duration-200 shadow-sm hover:shadow"
                    >
                      <AlertDescription className="w-full">
                        <div className="flex justify-between items-center gap-4">
                          {/* Left side - Product Info */}
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-800">{batch.productName}</span>
                              <Badge className={expiryStatus.className}>
                                {expiryStatus.badge}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span>Batch #{batch.batchId}</span>
                              <span>•</span>
                              <span>Expires: {new Date(batch.bestBeforeDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          {/* Right side - Quantity Info */}
                          <div className="text-right flex flex-col items-end gap-1 min-w-[140px]">
                            <div className="font-medium text-gray-700">
                              {batch.quantity} units
                            </div>
                            <div className="text-sm text-gray-500">
                              Total: {(batch.quantity * batch.weight).toFixed(1)} kg
                            </div>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <Target className="h-5 w-5 text-gray-600" />
              Make a Donation
            </h3>
            {allBatches.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No batches available for donation at the moment</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Batch Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Select Batch</label>
                    <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                      <SelectTrigger className="bg-white border-gray-200 h-12 hover:border-gray-300 
                        transition-colors duration-200">
                        <SelectValue placeholder="Choose a batch to donate" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {allBatches.map((batch) => {
                          const expiryStatus = getExpiryStatus(batch.bestBeforeDate);
                          const daysToExpiry = Math.ceil(
                            (new Date(batch.bestBeforeDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                          );
                          
                          return (
                            <SelectItem 
                              key={batch.batchId} 
                              value={batch.batchId.toString()}
                              className="py-3 px-2 hover:bg-gray-50 cursor-pointer"
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{batch.productName}</span>
                                  <Badge variant="outline" className={`${expiryStatus.className} text-xs`}>
                                    {expiryStatus.badge}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>Batch #{batch.batchId}</span>
                                  <span>•</span>
                                  <span>{daysToExpiry <= 0 
                                    ? 'Expired' 
                                    : `${daysToExpiry} days left`}
                                  </span>
                                  <span>•</span>
                                  <span>{(batch.quantity * batch.weight).toFixed(1)} kg</span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Donation Type Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Donation Type</label>
                    <Select 
                      value={donationType} 
                      onValueChange={(value) => setDonationType(value as FoodDonationType)}
                    >
                      <SelectTrigger className="bg-white border-gray-200 h-12 hover:border-gray-300 
                        transition-colors duration-200">
                        <SelectValue placeholder="Choose donation method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMPOSTE" className="py-3 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Apple className="h-4 w-4 text-yellow-600" />
                            <span>Food Composting</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="BIOGAS" className="py-3 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-blue-600" />
                            <span>Biogas Production</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="UPCYCLING" className="py-3 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Recycle className="h-4 w-4 text-purple-600" />
                            <span>Food Upcycling</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Donation Button */}
                <div className="pt-4">
                  <Button 
                    className={`w-full h-12 font-semibold transition-all duration-200 
                      ${!selectedBatch || !donationType
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    onClick={handleDonation}
                    disabled={!selectedBatch || !donationType || loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </div>
                    ) : !selectedBatch || !donationType ? (
                      'Select batch and donation type'
                    ) : (
                      'Confirm Donation'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
