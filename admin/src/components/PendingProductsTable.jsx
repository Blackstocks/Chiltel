import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PendingProductsTable = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Organic Coffee Beans",
      price: 24.99,
      sellerName: "Global Coffee Co.",
      sellerEmail: "contact@globalcoffee.com",
      category: "Beverages",
      status: "pending"
    },
    {
      id: 2,
      name: "Handmade Ceramic Mug",
      price: 19.99,
      sellerName: "Artisan Crafts",
      sellerEmail: "sales@artisancrafts.com",
      category: "Home & Kitchen",
      status: "pending"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [action, setAction] = useState(null);

  const handleAction = (product, actionType) => {
    setSelectedProduct(product);
    setAction(actionType);
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    setProducts(products.map(p => {
      if (p.id === selectedProduct.id) {
        return { ...p, status: action };
      }
      return p;
    }));
    setIsDialogOpen(false);
  };

  return (
    <div className="overflow-y-auto w-full max-h-[calc(100vh-4rem)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Seller Name</TableHead>
            <TableHead>Seller Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => (
            product.status === "pending" && (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.sellerName}</TableCell>
                <TableCell>{product.sellerEmail}</TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleAction(product, 'rejected')}
                    className="bg-red-50 hover:bg-red-100 text-red-600"
                  >
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleAction(product, 'approved')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            )
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === 'approved' ? 'Approve Product' : 'Reject Product'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              `Are you sure you want to {action} {selectedProduct?.name}?
              This action cannot be undone.`
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAction}
              className={action === 'approved' ? 'bg-green-600' : 'bg-red-600'}
            >
              Confirm {action === 'approved' ? 'Approval' : 'Rejection'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PendingProductsTable;