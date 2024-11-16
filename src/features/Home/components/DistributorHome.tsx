import {
  Distributor,
  foodCategoryMapping,
  foodConditionMapping,
} from '@/features/Home/constants';
import { Product } from '@/features/ProductListing/constants';
import AddIcon from '@mui/icons-material/Add';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { DistributorOrdersPreview } from '@/features/Orders/components/DistributorOrdersPreview';
import { AnimatePresence, motion } from 'framer-motion';
import { ImpactExplanation } from '@/features/Sustainability/Profile/components/ImpactExplanation';
import { ImpactGoalsProgress } from './ImpactGoalsProgress';
import { FoodDonationCard } from '@/features/Sustainability/FoodDonation/components/FoodDonationCard';
import { Card, CardContent } from '@/components/ui/card';
import bannerImage from '@/assets/buyer-homepage-banner.png';
import food from '@/assets/food.png';
import co2 from '@/assets/co2.png';
import electricity from '@/assets/electricity.png';
import water from '@/assets/water.png';
import { TreeDeciduous, Recycle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImpactMetrics {
  weightSaved: number;
  co2Prevented: number;
  treesEquivalent: number;
  electricityDaysSaved: number;
  acNightsSaved: number;
  mealsSaved: number;
  waterLitresSaved: number;
  showersEquivalent: number;
  swimmingPoolsEquivalent: number;
  carKmEquivalent: number;
}

interface ImpactDialogProps {
  impact: {
    category: 'food' | 'water' | 'electricity' | 'carbon';
    type: 'personal' | 'community';
  } | null;
  onClose: () => void;
}

const overlayVariants = {
  initial: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotate: 0
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: [-2, 1, -1, 2][i % 4],
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 100
    }
  })
};

export const DistributorHome = () => {
  const [foodCategories, setFoodCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [distributor, setDistributor] = useState<Distributor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExpiry, setSelectedExpiry] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState<'title' | 'category' | 'condition' | 'price' | 'expiry'>('expiry');
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetrics>({
    weightSaved: 0,
    co2Prevented: 0,
    treesEquivalent: 0,
    electricityDaysSaved: 0,
    acNightsSaved: 0,
    mealsSaved: 0,
    waterLitresSaved: 0,
    showersEquivalent: 0,
    swimmingPoolsEquivalent: 0,
    carKmEquivalent: 0
  });
  const [personalImpactMetrics, setPersonalImpactMetrics] = useState<ImpactMetrics>({
    weightSaved: 0,
    co2Prevented: 0,
    treesEquivalent: 0,
    electricityDaysSaved: 0,
    acNightsSaved: 0,
    mealsSaved: 0,
    waterLitresSaved: 0,
    showersEquivalent: 0,
    swimmingPoolsEquivalent: 0,
    carKmEquivalent: 0
  });
  const [selectedImpact, setSelectedImpact] = useState<{
    category: 'food' | 'water' | 'electricity' | 'carbon';
    type: 'personal' | 'community';
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, productsResponse, distributorResponse] =
          await Promise.all([
            fetch('/api/products/food-category'),
            fetch('http://localhost:8080/api/products/distributor/active', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }),
            fetch(`http://localhost:8080/api/distributor/profile`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }),
          ]);

        const categoryData = await categoryResponse.json();
        const productsData = await productsResponse.json();
        const distributorData = await distributorResponse.json();

        console.log(categoryData);
        console.log(distributorData);

        setFoodCategories([...categoryData]); // Adding "All" to the categories
        setProducts(productsData);
        setDistributor(distributorData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchImpactMetrics = async () => {
      try {
        const response = await fetch('/api/impact/community', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setImpactMetrics(data);
        } else {
          console.error('Failed to fetch impact metrics');
        }
      } catch (error) {
        console.error('Error fetching impact metrics:', error);
      }
    };

    const fetchPersonalImpactMetrics = async () => {
      try {
        const response = await fetch('/api/impact/distributor/personal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setPersonalImpactMetrics(data);
        } else {
          console.error('Failed to fetch impact metrics');
        }
      } catch (error) {
        console.error('Error fetching impact metrics:', error);
      }
    };

    fetchData();
    fetchImpactMetrics();
    fetchPersonalImpactMetrics();
  }, []);

  // Function to handle navigation to the product detail page
  const handleProductClick = (productId: number) => {
    navigate(`/view-product-listing/${productId}`);
  };

  const handleImpactCardClick = (
    category: 'food' | 'water' | 'electricity' | 'carbon',
    type: 'personal' | 'community'
  ) => {
    setSelectedImpact({ category, type });
  };

  // Function to get the days to earliest expiry and its urgency
  const getEarliestExpiryInfo = (batches: any[]) => {
    if (!batches || batches.length === 0) return { daysToExpiry: null };

    const now = new Date();
    const earliestBatch = batches.reduce((earliest, current) => {
      const earliestDate = new Date(earliest.bestBeforeDate);
      const currentDate = new Date(current.bestBeforeDate);
      return currentDate < earliestDate ? current : earliest;
    });

    const expiryDate = new Date(earliestBatch.bestBeforeDate);
    const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

    return daysToExpiry;
  };

  const handleSort = (column: 'title' | 'category' | 'condition' | 'price' | 'expiry') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch = product.listingTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.foodCategory === selectedCategory;
      const matchesCondition = selectedCondition === 'All' || product.foodCondition === selectedCondition;

      const daysToExpiry = getEarliestExpiryInfo(product.batches);
      let matchesExpiry = true;
      if (selectedExpiry === 'Urgent') {
        matchesExpiry = typeof daysToExpiry === 'number' && daysToExpiry <= 3;
      } else if (selectedExpiry === 'Warning') {
        matchesExpiry = typeof daysToExpiry === 'number' && daysToExpiry > 3 && daysToExpiry <= 7;
      } else if (selectedExpiry === 'Near Expiry') {
        matchesExpiry = typeof daysToExpiry === 'number' && daysToExpiry > 7 && daysToExpiry <= 14;
      }

      return matchesSearch && matchesCategory && matchesCondition && matchesExpiry;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'title':
          return multiplier * a.listingTitle.localeCompare(b.listingTitle);
        case 'category':
          return multiplier * a.foodCategory.localeCompare(b.foodCategory);
        case 'condition':
          return multiplier * a.foodCondition.localeCompare(b.foodCondition);
        case 'price':
          return multiplier * (a.price - b.price);
        case 'expiry':
          const aExpiry = getEarliestExpiryInfo(a.batches);
          const bExpiry = getEarliestExpiryInfo(b.batches);
          if (typeof aExpiry === 'number' && typeof bExpiry === 'number') {
            return multiplier * (aExpiry - bExpiry);
          }
          return 0;
        default:
          return 0;
      }
    });

  // Add this helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="w-[80%] lg:mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:mx-auto p-8 md:px-10 xl:px-0">
        {/* Quote Card - Dark Theme */}
        <motion.div
          className="md:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[#14171F] text-white h-full relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={bannerImage}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <CardContent className="p-8 relative z-10">
              <div>
                <h2 className="text-3xl font-bold mb-6 leading-tight">
                  "Cutting food waste is a delicious way of saving money, helping to feed the world and protect the planet."
                </h2>
                <p className="text-lg text-gray-300 italic">
                  – Tristram Stuart
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>


        {/* Monthly Community Goals - Moved up */}
        <motion.div
          className="md:col-span-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ImpactGoalsProgress weightSaved={impactMetrics.weightSaved} />
        </motion.div>

        {/* Impact Statistics Cards - Split into Personal and Community */}
        <motion.div
          className="md:col-span-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Personal Impact */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 md:col-span-6">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TreeDeciduous className="h-6 w-6 text-emerald-600" />
                  Your Environmental Hero Journey
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {/* Food Rescued Card */}
                  <div
                    className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleImpactCardClick('food', 'personal')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={food} alt="Food" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Food Rescued</h3>
                        <p className="text-3xl font-bold text-emerald-600">{personalImpactMetrics.weightSaved.toFixed(1)} kg</p>
                        <p className="text-base text-black-600">
                          🍽️ {personalImpactMetrics.mealsSaved.toFixed(0)} meals saved
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Carbon Impact Card */}
                  <div
                    className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleImpactCardClick('carbon', 'personal')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={co2} alt="CO2" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Carbon Impact</h3>
                        <p className="text-3xl font-bold text-emerald-600">{personalImpactMetrics.co2Prevented.toFixed(1)} kg</p>
                        <p className="text-base text-black-600">
                          🚗 {personalImpactMetrics.carKmEquivalent.toFixed(1)} km not driven
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Energy Impact Card */}
                  <div
                    className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleImpactCardClick('electricity', 'personal')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={electricity} alt="Electricity" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Energy Impact</h3>
                        <p className="text-3xl font-bold text-emerald-600">{personalImpactMetrics.electricityDaysSaved.toFixed(1)} days</p>
                        <p className="text-base text-black-600">
                          ❄️ {personalImpactMetrics.acNightsSaved.toFixed(1)} nights of AC
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Water Impact Card */}
                  <div
                    className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleImpactCardClick('water', 'personal')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={water} alt="Water" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Water Saved</h3>
                        <p className="text-3xl font-bold text-emerald-600">
                          <b>
                            {personalImpactMetrics.waterLitresSaved >= 1000000000000
                              ? `${(personalImpactMetrics.waterLitresSaved / 1000000000000).toFixed(1)} tril`
                              : personalImpactMetrics.waterLitresSaved >= 1000000000
                                ? `${(personalImpactMetrics.waterLitresSaved / 1000000000).toFixed(1)} bil`
                                : personalImpactMetrics.waterLitresSaved >= 1000000
                                  ? `${(personalImpactMetrics.waterLitresSaved / 1000000).toFixed(1)}mil`
                                  : personalImpactMetrics.waterLitresSaved.toFixed(0)
                            }
                          </b> ℓ
                        </p>
                        <p className="text-base text-black-600">
                          🚿 {personalImpactMetrics.showersEquivalent.toFixed(0)} showers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Impact */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 md:col-span-6">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Recycle className="h-6 w-6 text-blue-600" />
                  Our Collective Impact
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    onClick={() => handleImpactCardClick('food', 'community')}>
                    <div className="flex flex-col items-center text-center">
                      <img src={food} alt="Food" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Food Rescue</h3>
                        <p className="text-3xl font-bold text-blue-600"><b>{impactMetrics.weightSaved.toFixed(1)}</b> kg</p>
                        <p className="text-base text-black-600">
                          🍽️ Feeds <b>{impactMetrics.weightSaved.toFixed(0)}</b> people
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    onClick={() => handleImpactCardClick('carbon', 'community')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={co2} alt="CO2" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Carbon Prevention</h3>
                        <p className="text-3xl font-bold text-blue-600"><b>{impactMetrics.co2Prevented.toFixed(1)}</b> kg</p>
                        <p className="text-base text-black-600">
                          🌳 <b>{impactMetrics.treesEquivalent.toFixed(0)}</b> trees planted
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    onClick={() => handleImpactCardClick('electricity', 'community')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={electricity} alt="Electricity" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Energy Savings</h3>
                        <p className="text-3xl font-bold text-blue-600"><b>{impactMetrics.electricityDaysSaved.toFixed(1)}</b> days</p>
                        <p className="text-base text-black-600">
                          🏠 Powers <b>{(impactMetrics.electricityDaysSaved * 0.1).toFixed(0)}</b> homes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    onClick={() => handleImpactCardClick('water', 'community')}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img src={water} alt="Water" className="w-12 h-12 mb-2" />
                      <div>
                        <h3 className="text-gray-600 mb-2 font-medium">Water Saved</h3>
                        <p className="text-3xl font-bold text-blue-600">
                          <b>
                            {personalImpactMetrics.waterLitresSaved >= 1000000000000
                              ? `${(personalImpactMetrics.waterLitresSaved / 1000000000000).toFixed(1)} tril`
                              : personalImpactMetrics.waterLitresSaved >= 1000000000
                                ? `${(personalImpactMetrics.waterLitresSaved / 1000000000).toFixed(1)} bil`
                                : personalImpactMetrics.waterLitresSaved >= 1000000
                                  ? `${(personalImpactMetrics.waterLitresSaved / 1000000).toFixed(1)}mil`
                                  : personalImpactMetrics.waterLitresSaved.toFixed(0)
                            }
                          </b> ℓ
                        </p>
                        <p className="text-base text-black-600">
                          🏊‍♂️ <b>{personalImpactMetrics.swimmingPoolsEquivalent.toFixed(0)}</b> Olympic swimming pools
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Food Donation Portion */}
          <div className="mt-8">
            <FoodDonationCard weightSaved={impactMetrics.weightSaved} />
          </div>
          
        </motion.div>
      </div>

      {/* Orders Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-left">Orders</h2>
        <DistributorOrdersPreview />
      </div>
      {/* Product Listings Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-left">Product Listings</h2>
          
          {/* New Product Listing Button */}
          <div className="relative inline-block">
            <button
              className={`px-4 py-2 rounded-md text-white font-semibold flex items-center ${
                distributor?.isApproved
                  ? 'button button-green'
                  : 'button button-green opacity-70 filter blur-[0.5px]'
              }`}
              onClick={() =>
                distributor?.isApproved && navigate('/create-product-listing')
              }
              disabled={!distributor?.isApproved}
              style={{
                cursor: distributor?.isApproved ? 'pointer' : 'not-allowed',
                transition: 'opacity 0.3s, background-color 0.3s, filter 0.3s',
              }}
            >
              <AddIcon className="mr-2" />
              New Product Listing
            </button>
            {!distributor?.isApproved && (
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs font-medium rounded-md shadow-lg opacity-0 transition-opacity duration-300"
                style={{
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                Awaiting admin account approval
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          {/* Search and Filter Controls */}
          <div className="flex items-center space-x-4 mb-6">
            <TextField
              label="Search by title"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <FormControl variant="outlined" size="small" className="w-48 text-left">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="All">All</MenuItem>
                {foodCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {foodCategoryMapping[category] || category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" className="w-40 text-left">
              <InputLabel>Expiry</InputLabel>
              <Select
                value={selectedExpiry}
                onChange={(e) => setSelectedExpiry(e.target.value)}
                label="Expiry"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
                <MenuItem value="Warning">Warning</MenuItem>
                <MenuItem value="Near Expiry">Near Expiry</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" className="w-40 text-left">
              <InputLabel>Condition</InputLabel>
              <Select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                label="Condition"
              >
                <MenuItem value="All">All</MenuItem>
                {Object.entries(foodConditionMapping).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'title'}
                    direction={sortBy === 'title' ? sortOrder : 'asc'}
                    onClick={() => handleSort('title')}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'category'}
                    direction={sortBy === 'category' ? sortOrder : 'asc'}
                    onClick={() => handleSort('category')}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'condition'}
                    direction={sortBy === 'condition' ? sortOrder : 'asc'}
                    onClick={() => handleSort('condition')}
                  >
                    Condition
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'price'}
                    direction={sortBy === 'price' ? sortOrder : 'asc'}
                    onClick={() => handleSort('price')}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'expiry'}
                    direction={sortBy === 'expiry' ? sortOrder : 'asc'}
                    onClick={() => handleSort('expiry')}
                  >
                    Earliest Batch Expiry
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map((product: any) => {
                  let alertClass = ''
                  let alertBadge = null;
                  const daysToExpiry = getEarliestExpiryInfo(product.batches);

                  if (typeof daysToExpiry === 'number') {
                    if (daysToExpiry <= 0) {
                      alertClass = 'text-gray-500';
                      alertBadge = <Badge className="bg-gray-500 text-white">Not Available for Sale</Badge>;
                    } else if (daysToExpiry <= 3) {
                      alertClass = 'text-red-600 font-bold';
                      alertBadge = <Badge className="bg-red-500 text-white">Urgent</Badge>;
                    } else if (daysToExpiry <= 7) {
                      alertClass = 'text-orange-600 font-bold';
                      alertBadge = <Badge className="bg-orange-500 text-white">Warning</Badge>;
                    } else if (daysToExpiry <= 14) {
                      alertClass = 'text-yellow-600 font-bold';
                      alertBadge = <Badge className="bg-yellow-500 text-white">Near Expiry</Badge>;
                    }
                  }

                  return (
                    <TableRow
                      key={product.productId}
                      onClick={() => handleProductClick(product.productId)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <TableCell>
                        <img
                          src={
                            product.productPictures.length > 0
                              ? product.productPictures[0]
                              : 'placeholder-image-url'
                          }
                          alt={product.listingTitle}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={product.listingTitle} arrow>
                          <div>{truncateText(product.listingTitle, 100)}</div>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={foodCategoryMapping[product.foodCategory] || product.foodCategory} arrow>
                          <div>{truncateText(foodCategoryMapping[product.foodCategory] || product.foodCategory, 30)}</div>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={foodConditionMapping[product.foodCondition] || product.foodCondition} arrow>
                          <div>{truncateText(foodConditionMapping[product.foodCondition] || product.foodCondition, 30)}</div>
                        </Tooltip>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {typeof daysToExpiry === 'number' ? (
                          <div className={`flex flex-col items-start ${alertClass}`}>
                            <span>{daysToExpiry <= 0 ? 'Expired' : `${daysToExpiry} days`}</span>
                            {alertBadge}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <p className="text-gray-500">No Products</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog 
        open={selectedImpact !== null} 
        onOpenChange={() => setSelectedImpact(null)}
      >
        <DialogContent className="max-w-4xl">
          {selectedImpact && (
            <ImpactExplanation 
              category={selectedImpact.category} 
              type={selectedImpact.type}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};