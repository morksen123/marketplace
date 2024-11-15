import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowDown, ArrowUp, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PointsHistoryEntry {
  id: number;
  pointsEarned: number;
  description: string;
  earnedDateTime: string;
  source: string;
}

export const PointsHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  // Use React fetch to get points history
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSource, setSelectedSource] = useState<string>('all');

  useEffect(() => {
    const fetchPointsHistory = async () => {
      try {
        const response = await fetch('/api/buyer/points/history', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch points history');
        }
        const data = await response.json();
        setPointsHistory(data);
      } catch (error) {
        console.error('Error fetching points history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    console.log("Hi2", pointsHistory);

    fetchPointsHistory();
  }, []);

  const getSourceBadge = (source: string) => {
    const sourceColors: Record<string, string> = {
      ORDER_COMPLETION: 'bg-green-100 text-green-800',
      REFERRAL_BONUS: 'bg-blue-100 text-blue-800',
      SUSTAINABILITY_BONUS: 'bg-purple-100 text-purple-800',
    };


    const displayText = source?.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') || 'Others';

    return (
      <Badge className={`${sourceColors[source] || 'bg-gray-100 text-gray-800'}`}>
        {displayText}
      </Badge>
    );
  };

  const filteredHistory = pointsHistory
    ?.filter((entry) =>
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSource === 'all' || entry.source === selectedSource)
    )
    .sort((a, b) => {
      const dateA = new Date(a.earnedDateTime).getTime();
      const dateB = new Date(b.earnedDateTime).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }) || [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getUniqueSources = () => {
    const sources = new Set(pointsHistory?.map(entry => entry.source) || []);
    return Array.from(sources);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading points history...</div>;
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <Star className="mr-2" size={20} />
          Points History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 flex-grow max-w-lg">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search by description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {getUniqueSources().map((source) => (
                  <SelectItem key={source} value={source}>
                    {source.replace('_', ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="flex items-center"
          >
            {sortOrder === 'asc' ? (
              <>
                Oldest First <ArrowUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Latest First <ArrowDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Date</TableHead>
                <TableHead className="text-left">Description</TableHead>
                <TableHead className="text-left">Source</TableHead>
                <TableHead className="text-left">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-left">
                    {new Date(entry.earnedDateTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-left">{entry.description}</TableCell>
                  <TableCell className="text-left">{getSourceBadge(entry.source)}</TableCell>
                  <TableCell className="text-left font-medium">
                    {entry.pointsEarned > 0 ? '+' : ''}{entry.pointsEarned}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No points history found matching your search criteria.
          </div>
        )}

        {filteredHistory.length > itemsPerPage && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                {Array.from(
                  { length: Math.ceil(filteredHistory.length / itemsPerPage) },
                  (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => paginate(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};