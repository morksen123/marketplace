import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Product, Batch } from '@/features/ProductListing/constants';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Tabs, Tab, TablePagination, TableSortLabel } from '@mui/material';
import { foodCategoryMapping, foodConditionMapping } from '@/features/Home/constants';
import { Link } from 'react-router-dom';
import { EditBatchModal } from '../components/EditBatchModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@/components/ui/button';
import { handleSuccessApi, handleErrorApi } from '@/lib/api-client';
interface BatchWithProduct extends Batch {
  product: Product;
}

type SortColumn = keyof BatchWithProduct | `product.${keyof Product}`;

export const InventoryManagementPage: React.FC = () => {
  const [batches, setBatches] = useState<BatchWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<SortColumn>('product.listingTitle');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchWithProduct | null>(null);

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/products/distributor', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }),
          fetch('/api/products/food-category', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        ]);

        if (productsResponse.ok && categoriesResponse.ok) {
          const products: Product[] = await productsResponse.json();
          const allCategories: string[] = await categoriesResponse.json();

          const allBatches: BatchWithProduct[] = products.flatMap(product => 
            product.batches?.map(batch => ({
              ...batch,
              product: product
            })) ?? []
          );
          setBatches(allBatches);
          setCategories(['All', ...allCategories]);
        } else {
          console.error('Failed to fetch products or categories');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column: SortColumn) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };

  const sortedBatches = React.useMemo(() => {
    const comparator = (a: BatchWithProduct, b: BatchWithProduct) => {
      let aValue: any, bValue: any;

      if (sortColumn.startsWith('product.')) {
        const productKey = sortColumn.split('.')[1] as keyof Product;
        aValue = a.product[productKey];
        bValue = b.product[productKey];
      } else {
        aValue = a[sortColumn as keyof BatchWithProduct];
        bValue = b[sortColumn as keyof BatchWithProduct];
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    };

    return [...batches].sort(comparator);
  }, [batches, sortColumn, sortDirection]);

  const filteredBatches = selectedTab === 'All' 
    ? sortedBatches 
    : sortedBatches.filter(batch => batch.product.foodCategory === selectedTab);

  const paginatedBatches = filteredBatches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleEditClick = (batch: BatchWithProduct) => {
    setSelectedBatch(batch);
    setEditModalOpen(true);
  };
  
  const handleEditSave = async (updatedBatch: Batch) => {
    try {
      const response = await fetch(`/api/products/product/${selectedBatch?.product.productId}/batch`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedBatch),
      });
  
      if (response.ok) {
        const updatedBatches = batches.map(batch =>
          batch.batchId === updatedBatch.batchId ? { ...batch, ...updatedBatch } : batch
        );
        setBatches(updatedBatches);
        handleSuccessApi('Success!', 'Batch has been updated.');
      } else {
        console.error('Failed to update batch');
        handleErrorApi('Error!', 'Failed to update batch.');
      }
    } catch (error) {
      console.error('Error updating batch:', error);
      handleErrorApi('Error!', 'Failed to update batch.');
    }
  };

  const handleDeleteBatch = async (batch: BatchWithProduct) => {
    try {
      const response = await fetch(`/api/products/product/${batch.product.productId}/batch?batchId=${batch.batchId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setBatches(prevBatches => prevBatches.filter(b => b.batchId !== batch.batchId));
        handleSuccessApi('Success!', 'Batch has been deleted.');
      } else {
        handleErrorApi('Error!', 'Failed to delete batch.');
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
      handleErrorApi('Error!', 'Failed to delete batch.');
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      batches.map(batch => ({
        'Product ID': batch.product.productId,
        'Product Name': batch.product.listingTitle,
        'Category': foodCategoryMapping[batch.product.foodCategory] || batch.product.foodCategory,
        'Condition': foodConditionMapping[batch.product.foodCondition] || batch.product.foodCondition,
        'Unit Price': batch.product.price,
        'Min Purchase Qty': batch.product.minPurchaseQty,
        'Batch ID': batch.batchId,
        'Best Before Date': new Date(batch.bestBeforeDate).toLocaleDateString(),
        'Batch Quantity': batch.quantity,
        'Delivery Method': batch.product.deliveryMethod,
        'Stock Value': batch.product.price * batch.quantity,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, 'inventory.xlsx');
    handleSuccessApi('Success!', 'Inventory has been exported to Excel.');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button onClick={exportToExcel} variant="secondary">Export to Excel</Button>
      </div>
      
      <Tabs value={selectedTab} onChange={handleTabChange} className="mb-4">
        {categories.map((category) => (
          <Tab key={category} label={foodCategoryMapping[category] || category} value={category} />
        ))}
      </Tabs>

      <Paper className="overflow-x-auto"> {/* Add overflow-x-auto */}
        <Table>
          <TableHead>
            <TableRow>
              {[
                { label: 'Product Name', key: 'product.listingTitle' },
                { label: 'Category', key: 'product.foodCategory' },
                { label: 'Condition', key: 'product.foodCondition' },
                { label: 'Unit Price', key: 'product.price' },
                { label: 'Min Purchase Qty', key: 'product.minPurchaseQty' },
                { label: 'Batch ID', key: 'batchId' },
                { label: 'Best Before Date', key: 'bestBeforeDate' },
                { label: 'Batch Quantity', key: 'quantity' },
                { label: 'Delivery Method', key: 'product.deliveryMethod' },
                { label: 'Stock Value', key: 'stockValue' },
                { label: 'Edit Batch', key: 'actions' },
                { label: 'Delete Batch', key: 'deleteBatch' },
              ].map(({ label, key }) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={sortColumn === key}
                    direction={sortColumn === key ? sortDirection : 'asc'}
                    onClick={() => handleSort(key as SortColumn)}
                  >
                    {label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBatches.map((batch) => {
              const stockValue = batch.product.price * batch.quantity;
              return (
                <TableRow key={batch.batchId}>
                  <TableCell>
                    <Link 
                      to={`/view-product-listing/${batch.product.productId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {batch.product.listingTitle}
                    </Link>
                  </TableCell>
                  <TableCell>{foodCategoryMapping[batch.product.foodCategory] || batch.product.foodCategory}</TableCell>
                  <TableCell>{foodConditionMapping[batch.product.foodCondition] || batch.product.foodCondition}</TableCell>
                  <TableCell>${batch.product.price.toFixed(2)}</TableCell>
                  <TableCell>{batch.product.minPurchaseQty}</TableCell>
                  <TableCell>{batch.batchId}</TableCell>
                  <TableCell>{new Date(batch.bestBeforeDate).toLocaleDateString()}</TableCell>
                  <TableCell>{batch.quantity}</TableCell>
                  <TableCell>{batch.product.deliveryMethod}</TableCell>
                  <TableCell>${stockValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditClick(batch)}>
                      <EditIcon />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDeleteBatch(batch)}>
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredBatches.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          labelRowsPerPage="Records per page:"
        />
      </Paper>
      <EditBatchModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        batch={selectedBatch}
        onSave={handleEditSave}
      />
    </div>
  );
};