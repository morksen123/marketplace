import React from 'react';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../../../assets/landing.png'; // Your banner image
import greenhouseGasIcon from '../../../assets/greenhouse-gas.png';
import foodWasteIcon from '../../../assets/food-waste.png';
import usersIcon from '../../../assets/customers.png';
import foodDumpImage from '../../../assets/food-dump.png';

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Banner Section */}
            <section className="relative">
                <img
                    src={bannerImage}
                    alt="GudFood Banner"
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: '600px' }}
                />

                <div className="absolute top-0 left-10 w-full h-full flex flex-col justify-center text-white">
                    <h1 className="text-4xl mb-4 ml-20 text-left">I am a:</h1>
                    <div className="ml-20">
                        <div className="flex space-x-4">
                            <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-green-700 flex items-center"
                                onClick={() => navigate('/buyer-home')} // Redirect to Buyer page
                            >
                                <PersonOutlineOutlinedIcon className="mr-2" />Buyer
                            </button>
                            <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-green-700 flex items-center"
                                onClick={() => navigate('/distributor-home')} // Redirect to Distributor page
                            >
                                <PersonOutlineOutlinedIcon className="mr-2" />Distributor
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="p-8">
                {/* Our Mission */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-700">
                        At Gudfood, our mission is to combat food waste by creating a sustainable marketplace where distributors and businesses can connect to redistribute surplus and near-expiry products. By empowering stakeholders with tools to sell, buy, and manage surplus goods, we aim to reduce environmental impact while making food more affordable. Our platform fosters a community-driven approach to responsible consumption, aligning with global sustainability goals and working together to minimize waste and support a greener future.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Greenhouse Gas Emissions */}
                    <div className="p-4 bg-white rounded-lg shadow text-center">
                        <img src={greenhouseGasIcon} alt="Greenhouse Gas" className="mx-auto h-16 mb-4" />
                        <h3 className="text-xl font-bold">5% Greenhouse Gas Emissions Reduced</h3>
                    </div>

                    {/* Food Waste Prevented */}
                    <div className="p-4 bg-white rounded-lg shadow text-center">
                        <img src={foodWasteIcon} alt="Food Waste" className="mx-auto h-16 mb-4" />
                        <h3 className="text-xl font-bold">5000kg Food Waste Prevented</h3>
                    </div>

                    {/* Users Onboard */}
                    <div className="p-4 bg-white rounded-lg shadow text-center">
                        <img src={usersIcon} alt="Users" className="mx-auto h-16 mb-4" />
                        <h3 className="text-xl font-bold">Over 50,000 Users Onboard</h3>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-10">The Problem</h2>

                <div className="mb-8 flex flex-col md:flex-row items-center">
                    {/* Left Side - Image */}
                    <div className="md:w-1/2 w-full mb-4 md:mb-0">
                        <img
                            src={foodDumpImage}
                            alt="Food Dump"
                            className="w-full h-80 object-cover rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Right Side - Text */}
                    <div className="md:w-1/2 w-full md:pl-8">
                        <p className="text-gray-700">
                            Food waste is a significant and persistent challenge in Singapore, especially at the distributor level. Daily, central warehouses of major supermarket chains in Singapore face the rejection of 7,500 to 20,000 kilograms of produce due to stringent quality standards (Liu & Tan, 2023). This waste at the distribution stage highlights a broader issue that impacts the entire supply chain. For instance, in recent years, major retailers like FairPrice have generated thousands of tonnes of food waste annually, with figures fluctuating but consistently remaining high. This ongoing trend underscores the difficulty in curbing food waste, even in a small, well-developed nation like Singapore. Reducing food waste at the distributor level is essential for alleviating these impacts.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
