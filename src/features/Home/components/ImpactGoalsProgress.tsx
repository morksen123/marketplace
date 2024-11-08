import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Trophy, TrendingUp } from 'lucide-react';
import { CircularProgress } from '@/components/ui/circular-progress';

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
                setGoals([]);
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

    const savedWeight = weightSaved || 0;

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="border-b border-gray-100">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Target size={24} className="text-green-600" />
                        Monthly Community Goals
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {goals.length === 0 ? (
                    <div className="text-center py-8">
                        <Trophy size={48} className="text-green-600 mx-auto mb-4 opacity-50" />
                        <p className="text-lg text-gray-600 font-medium">No active goals yet, but we're still making an impact!</p>
                        <p className="text-sm text-gray-500">Every small action counts towards a bigger change.</p>
                    </div>
                ) : (
                    <div className={`grid ${goals.length > 1 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                        {goals.map((goal) => (
                            <Card key={goal.id} className="bg-white">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative w-24 h-24">
                                            <CircularProgress 
                                                percentage={Math.min(goal.progressPercentage.toFixed(1), 100)}
                                                strokeWidth={8}
                                                size={96}
                                                color="#22c55e"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-semibold text-gray-800">{goal.description}</h3>
                                            <p className="text-sm text-gray-500">
                                                {savedWeight.toFixed(0)} kg of {goal.targetWeightInKg} kg goal
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
