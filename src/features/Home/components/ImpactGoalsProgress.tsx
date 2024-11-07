import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Trophy, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImpactGoal {
    id?: number;
    targetWeightInKg: number;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    progressPercentage: number;
}

export const ImpactGoalsProgress = ({ weightSaved }: { weightSaved: number }) => {
    const [goals, setGoals] = useState<ImpactGoal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveGoals = async () => {
            try {
                const response = await fetch('/api/impact-goals/active', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch goals');
                }

                const data = await response.json();
                setGoals(data);
            } catch (error) {
                console.error('Error fetching goals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveGoals();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
            </div>
        );
    }

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="border-b border-gray-100">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Target size={24} className="text-green-600" />
                        Community Impact Goals
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    className="space-y-6"
                >
                    {goals.length > 0 ? (
                        goals.map((goal) => (
                            <motion.div
                                key={goal.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                            <TrendingUp size={18} className="text-green-500" />
                                            {goal.description}
                                        </h3>
                                        <span className="text-sm font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                            {parseFloat(goal.progressPercentage).toFixed(1)}%
                                        </span>
                                    </div>

                                    <Progress
                                        value={parseFloat(goal.progressPercentage)}
                                        className="h-2.5 bg-gray-100"
                                        indicatorClassName="bg-gradient-to-r from-green-500 to-green-600"
                                    />

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Target: {goal.targetWeightInKg}kg</span>
                                        <span className="text-gray-500 text-xs">
                                            Ends {new Date(goal.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Target className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <p>No active impact goals at the moment</p>
                        </div>
                    )}
                </motion.div>
            </CardContent>
        </Card>
    );
};
