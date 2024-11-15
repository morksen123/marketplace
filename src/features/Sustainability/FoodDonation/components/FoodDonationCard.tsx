import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Leaf, Recycle, Target } from 'lucide-react';
import { FoodDonationType } from '../types';
import { Badge } from '@/components/ui/badge';

interface Batch {
  batchId: number;
  batchNumber: string;
  product: {
    productId: number;
    name: string;
  };
  quantity: number;
  weight: number;
  bestBeforeDate: string;
}

interface DonationStats {
  totalComposted: number;
  totalBiogas: number;
  totalUpcycled: number;
}

interface FoodDonationCardProps {
  weightSaved: number;
}

export const FoodDonationCard = ({ weightSaved }: FoodDonationCardProps) => {
  const [expiringBatches, setExpiringBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [donationType, setDonationType] = useState<FoodDonationType>('COMPOSTE');
  const [donationStats, setDonationStats] = useState<DonationStats>({
    totalComposted: 0,
    totalBiogas: 0,
    totalUpcycled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpiringBatches = async () => {
      try {
        const response = await fetch('/api/batches/expiring', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch expiring batches');
        const data = await response.json();
        
        // Filter and sort batches
        const filteredBatches = data.filter((batch: Batch) => {
          const expiryDate = new Date(batch.bestBeforeDate);
          const now = new Date();
          const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
          // Include batches that are expired or expiring within 14 days
          return daysToExpiry <= 14;
        });

        const sortedBatches = filteredBatches
          .sort((a: Batch, b: Batch) => {
            const aDate = new Date(a.bestBeforeDate);
            const bDate = new Date(b.bestBeforeDate);
            return aDate.getTime() - bDate.getTime();
          })
          // Take only the first 3 batches (closest to expiry)
          .slice(0, 3);

        setExpiringBatches(sortedBatches);
      } catch (error) {
        console.error('Error fetching expiring batches:', error);
      }
    };

    const fetchDonationStats = async () => {
      try {
        const response = await fetch('/api/donations/stats', {
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

    fetchExpiringBatches();
    fetchDonationStats();
  }, []);

  const handleDonation = async () => {
    if (!selectedBatch || !donationType) return;

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          batchId: selectedBatch,
          donationType,
        }),
      });

      if (!response.ok) throw new Error('Failed to process donation');

      // Refresh data after successful donation
      const updatedStats = await fetch('/api/donations/stats', {
        credentials: 'include',
      }).then(res => res.json());
      
      setDonationStats(updatedStats);
      setSelectedBatch('');
      setDonationType('COMPOSTE');
    } catch (error) {
      console.error('Error processing donation:', error);
    }
  };

  const donationCards = [
    {
      type: 'COMPOSTE' as FoodDonationType,
      title: 'Composting',
      icon: <Target className="h-6 w-6 text-green-600" />,
      total: donationStats.totalComposted,
      description: 'Convert food waste into nutrient-rich soil',
    },
    {
      type: 'BIOGAS' as FoodDonationType,
      title: 'Biogas',
      icon: <Leaf className="h-6 w-6 text-blue-600" />,
      total: donationStats.totalBiogas,
      description: 'Transform waste into renewable energy',
    },
    {
      type: 'UPCYCLING' as FoodDonationType,
      title: 'Upcycling',
      icon: <Recycle className="h-6 w-6 text-purple-600" />,
      total: donationStats.totalUpcycled,
      description: 'Give food waste a second life',
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
    return { status: 'ok', badge: '', className: '' };
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-white">
      <CardHeader className="border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Target size={24} className="text-green-600" />
            Food Donation Impact
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {donationCards.map((card) => (
            <Card key={card.type} className="bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-24 h-24 flex items-center justify-center bg-gray-50 rounded-full">
                    {card.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800">{card.title}</h3>
                    <p className="text-2xl font-bold text-green-600 my-2">
                      {card.total.toFixed(1)} kg
                    </p>
                    <p className="text-sm text-gray-500">
                      {card.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Expiring Batches</h3>
            <div className="space-y-4">
              {expiringBatches.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No expiring batches at the moment</p>
                </div>
              ) : (
                expiringBatches.slice(0, 3).map((batch) => {
                  const expiryStatus = getExpiryStatus(batch.bestBeforeDate);
                  return (
                    <Alert key={batch.batchId} className="bg-gray-50 border-none">
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-gray-800">{batch.product.name}</span>
                            <br />
                            <span className="text-sm text-gray-500">
                              Batch #{batch.batchNumber} - {new Date(batch.bestBeforeDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <div>
                              <span className="font-semibold text-gray-800">{batch.quantity} units</span>
                              <br />
                              <span className="text-sm text-gray-500">{batch.weight} kg</span>
                            </div>
                            <Badge className={expiryStatus.className}>
                              {expiryStatus.badge}
                            </Badge>
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

        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Make a Donation</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select batch to donate" />
                  </SelectTrigger>
                  <SelectContent>
                    {expiringBatches.map((batch) => {
                      const expiryStatus = getExpiryStatus(batch.bestBeforeDate);
                      const daysToExpiry = Math.ceil(
                        (new Date(batch.bestBeforeDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                      );
                      
                      return (
                        <SelectItem 
                          key={batch.batchId} 
                          value={batch.batchId.toString()}
                          className="flex justify-between items-center"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span>{batch.product.name} - Batch #{batch.batchNumber}</span>
                              <Badge className={expiryStatus.className}>
                                {expiryStatus.badge}
                              </Badge>
                            </div>
                            <span className="text-sm text-gray-500">
                              {daysToExpiry <= 0 
                                ? 'Expired' 
                                : `Expires in ${daysToExpiry} days`
                              } - {batch.weight} kg
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <Select 
                  value={donationType} 
                  onValueChange={(value) => setDonationType(value as FoodDonationType)}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select donation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPOSTE">Composting</SelectItem>
                    <SelectItem value="BIOGAS">Biogas</SelectItem>
                    <SelectItem value="UPCYCLING">Upcycling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleDonation}
                disabled={!selectedBatch || !donationType}
              >
                Process Donation
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
