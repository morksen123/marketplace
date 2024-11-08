import { motion } from 'framer-motion';
import food from '@/assets/food.png';
import co2 from '@/assets/co2.png';
import electricity from '@/assets/electricity.png';
import water from '@/assets/water.png';

interface ImpactExplanationProps {
    category: 'food' | 'water' | 'electricity' | 'carbon';
    type: 'personal' | 'community';
}

interface Explanation {
    title: string;
    subtitle: string;
    content: string;
}

const explanations = {
    personal: {
        food: {
            title: 'Personal Food Impact',
            subtitle: 'Making every meal count',
            content: `The average person consumes approximately 1.36 to 2.27 kg of food daily. Using the upper range, preventing 1 kg of food waste equates to saving 2 meals.
            These saved meals could nourish someone facing hunger or food insecurity.
            Every kilogram you save contributes to a more equitable and resilient food system.`,
        },
        water: {
            title: 'Personal Water Conservation',
            subtitle: 'Every drop makes a difference',
            content: `The 1.3 billion tonnes of food wasted annually result in about 45 trillion gallons of wasted water.
            Each kg of food waste prevented conserves approximately 130,000 liters of water.
            This is due to the large water footprint required to grow, process, and transport food.
            Water is used extensively in agriculture to irrigate crops and support livestock, as well as in processing and transportation. 
            By preserving this precious resource, you help protect ecosystems and ensure water availability for future generations.`,
        },
        electricity: {
            title: 'Personal Energy Efficiency',
            subtitle: 'Powering positive change',
            content: `Every kilogram of food saved is equivalent to 0.17 days of household electricity and 0.117 nights of air conditioning – that's real energy saved!
            The electricity footprint of food includes all energy needed to power farm equipment, run processing facilities, and store and transport food items. 
            By reducing food waste, you lower the energy demands associated with these processes, helping to lessen the strain on our planet's resources and reducing carbon emissions.`,
        },
        carbon: {
            title: 'Personal Carbon Reduction',
            subtitle: 'Your climate action journey',
            content: `Preventing 1 kg of food waste stops 1.9 kg of CO₂ from entering the atmosphere.
            An average vehicle emits about 400 grams of CO₂ per 1.6 km. Thus, 1.9 kg of CO₂ is equivalent to the emissions of approximately 7.6 km of car travel.
            This carbon footprint includes emissions from various stages: food cultivation, processing, packaging, and transportation, each adding to CO₂ levels.
            By reducing waste, you reduce these emissions, helping to combat climate change and bringing us closer to a sustainable future.`,
        },
    },
    community: {
        food: {
            title: 'Community Food Security Impact',
            subtitle: 'Nourishing our community together',
            content: `The average person consumes approximately 1.36 to 2.27 kg of food daily. Using the upper range, preventing 1 kg of food waste equates to saving 2 meals.
            Our collective food-saving efforts rescue vast amounts of food, providing thousands of meals for those in need.
            This community-wide action alleviates hunger and supports local food banks and charities.
            By working together, we're building a more sustainable, inclusive food system that minimizes waste.`,
        },
        water: {
            title: 'Community Water Conservation',
            subtitle: 'Protecting our water resources',
            content: `The 1.3 billion tonnes of food wasted annually result in about 45 trillion gallons of wasted water.
            Together, we aim to save millions of liters of water – the equivalent of several Olympic-sized pools.
            This water footprint reduction results from conserving the water required to grow, process, and transport food. 
            Large-scale water preservation helps protect local water supplies and ecosystems. By uniting in our efforts, we ensure a healthier water future for our communities and the environment.`,
        },
        electricity: {
            title: 'Community Energy Conservation',
            subtitle: 'Our shared commitment to energy efficiency',
            content: `Every kilogram of food saved is equivalent to 0.17 days of household electricity and 0.117 nights of air conditioning – that's real energy saved!
            The energy saved by our community could power multiple households, easing demand on local power grids.
            Food production is energy-intensive, involving machinery, storage facilities, and transportation systems. 
            Reducing food waste lowers the energy needed across these processes, contributing to a more resilient and sustainable energy system.`,
        },
        carbon: {
            title: 'Community Carbon Footprint Reduction',
            subtitle: 'Making strides towards a greener future',
            content: ` A single tree absorbs around 22 kg of CO₂ per year. Saving 1.9 kg of CO₂ is equal to about 1/11.5 of a tree's annual CO₂ absorption, or approximately 0.087 trees.
            Our efforts collectively reduce emissions equivalent to planting a small forest – an impactful step toward a healthier planet.
            Food waste generates CO₂ at every stage, from cultivation to distribution. By preventing food waste, we reduce these emissions significantly, making a meaningful difference in combating climate change. 
            Together, we are creating a lasting environmental impact, moving closer to a carbon-neutral future.`,
        },
    },
};



const icons = {
    food,
    carbon: co2,
    electricity,
    water
};

export const ImpactExplanation = ({ category, type }: ImpactExplanationProps) => {
    const explanation = explanations[type][category];

    return (
        <motion.div
            className="flex flex-col items-center text-center p-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Circular Icon */}
            <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-6 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
                <img
                    src={icons[category]}
                    alt={category}
                    className="w-14 h-14"
                />
            </motion.div>

            {/* Title */}
            <motion.h2
                className="text-2xl font-bold mb-4 text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {explanation.title}
            </motion.h2>

            {/* Impact Stats */}
            <motion.div
                className="grid grid-cols-2 gap-4 mb-6 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {category === 'food' && (
                    <>
                        <p className="text-sm text-gray-500 text-left italic mb-2">How we calculate:</p>
                        <div className="bg-emerald-50 rounded-lg p-4 col-span-3">
                            <div className="flex items-center justify-center gap-4">
                                <div>
                                    <p className="text-2xl font-bold text-emerald-600">2 meals saved</p>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-sm text-gray-600">per</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-emerald-600">1 kg food rescued</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {category === 'carbon' && (
                    <>
                        <p className="text-sm text-gray-500 text-left italic mb-2">How we calculate:</p>
                        <div className="bg-emerald-50 rounded-lg p-4 col-span-3">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-center gap-4">
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-600">1.9 kg CO₂ emissions reduced </p>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-sm text-gray-600">per</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-600">1 kg food rescued</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {category === 'electricity' && (
                    <>
                        <p className="text-sm text-gray-500 text-left italic mb-2">How we calculate:</p>
                        <div className="bg-emerald-50 rounded-lg p-4 col-span-3">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-center gap-4">
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-600">0.17 days</p>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-sm text-gray-600">of electricity saved per</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-600">1 kg food rescued</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {category === 'water' && (
                    <>
                        <p className="text-sm text-gray-500 text-left italic mb-2">How we calculate:</p>
                        <div className="bg-emerald-50 rounded-lg p-4 col-span-3">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-center gap-4">
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-600">130,000 L</p>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-sm text-gray-600">of water saved per</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-600">1 kg food rescued</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Detailed Explanation */}
            <motion.div
                className="text-left w-full bg-gray-50 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <p className="font-bold mb-3 text-gray-800">{explanation.subtitle}</p>
                {explanation.content.split('\n').map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="flex items-start space-x-2 mb-3"
                    >
                        <span className="text-emerald-500 mt-1">•</span>
                        <p className="text-gray-600 leading-relaxed">{line.trim()}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Additional Context */}
            <motion.p
                className="text-sm text-gray-500 mt-6 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                {type === 'personal'
                    ? "Your individual contribution matters in our collective journey towards sustainability."
                    : "Together, we're making a significant impact on our environment and community."}
            </motion.p>
        </motion.div>
    );
};
