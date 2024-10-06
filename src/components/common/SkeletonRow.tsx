import { Skeleton } from '../ui/skeleton';
import { TableCell, TableRow } from '../ui/table';

export const SkeletonRow: React.FC = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-6 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-8 w-28" />
    </TableCell>
  </TableRow>
);
