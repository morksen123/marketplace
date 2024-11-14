import usersIcon from '@/assets/customers.png';
import foodDumpImage from '@/assets/food-dump.png';
import foodWasteIcon from '@/assets/food-waste.png';
import greenhouseGasIcon from '@/assets/greenhouse-gas.png';
import bannerImage from '@/assets/landing-v4.png';
import { BannerContent } from './BannerContent';
import { AllBlogs } from '@/features/Sustainability/Blogs/AllBlogs';
import { LandingNavBar } from '@/features/Sustainability/LandingNavBar/LandingNavBar';

export const LandingContent = () => {
  return (
    <>
      <LandingNavBar />
      {/* Banner Section */}
      <section className="relative flex justify-center items-center min-h-screen">
        <div className="w-full h-full">
          <img
            src={bannerImage}
            alt="GudFood Banner"
            className="fixed top-0 left-0 w-full h-full object-cover opacity-20 -z-10"
          />
          <div className="flex justify-center items-center min-h-screen">
            <BannerContent />
          </div>
        </div>
      </section>

  {/* <main className="wrapper">
        <section>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-8">
            At Gudfood, our mission is to combat food waste by creating a
            sustainable marketplace where distributors and businesses can
            connect to redistribute surplus and near-expiry products. By
            empowering stakeholders with tools to sell, buy, and manage surplus
            goods, we aim to reduce environmental impact while making food more
            affordable. Our platform fosters a community-driven approach to
            responsible consumption, aligning with global sustainability goals
            and working together to minimize waste and support a greener future.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <img
                src={greenhouseGasIcon}
                alt="Greenhouse Gas"
                className="mx-auto h-16 mb-4"
              />
              <h3 className="text-xl font-bold">
                5% Greenhouse Gas Emissions Reduced
              </h3>
            </div>

            <div className="p-4 bg-white rounded-lg shadow text-center">
              <img
                src={foodWasteIcon}
                alt="Food Waste"
                className="mx-auto h-16 mb-4"
              />
              <h3 className="text-xl font-bold">5000kg Food Waste Prevented</h3>
            </div>

            <div className="p-4 bg-white rounded-lg shadow text-center">
              <img src={usersIcon} alt="Users" className="mx-auto h-16 mb-4" />
              <h3 className="text-xl font-bold">Over 50,000 Users Onboard</h3>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">The Problem</h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 w-full mb-4 md:mb-0">
              <img
                src={foodDumpImage}
                alt="Food Dump"
                className="w-full h-80 object-cover rounded-3xl shadow-3xl"
              />
            </div>

            <p className="text-gray-700 sm:text-start md:w-1/2 w-full md:pl-10">
              Food waste is a significant and persistent challenge in Singapore,
              especially at the distributor level. Daily, central warehouses of
              major supermarket chains in Singapore face the rejection of 7,500
              to 20,000 kilograms of produce due to stringent quality standards
              (Liu & Tan, 2023). This waste at the distribution stage highlights
              a broader issue that impacts the entire supply chain. For
              instance, in recent years, major retailers like FairPrice have
              generated thousands of tonnes of food waste annually, with figures
              fluctuating but consistently remaining high. This ongoing trend
              underscores the difficulty in curbing food waste, even in a small,
              well-developed nation like Singapore. Reducing food waste at the
              distributor level is essential for alleviating these impacts.
            </p>
          </div>
        </section>
      </main>     */}
    </>
  );
};
