import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../../components/ui/button/Button";
import ReusableTable from "../../../../components/table/ReusableTable";

import { fetchProducts } from "../../../../redux/slices/admin/productSlice";
import { getProductColumns } from "../Columns";

import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

const ProductConfiguration = () => {
  const dispatch = useDispatch();
  const { products, loading, formLoading, fetched } = useSelector(
    (state) => state.product
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

useEffect(() => {
      if (!fetched && !loading) {
        dispatch(fetchProducts());
      }
    }, [fetched, loading,formLoading, dispatch]);
  // Row click for editing
  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const productColumns = getProductColumns();

  const handleRefresh = () => {
    dispatch(fetchProducts());
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Product Configuration</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage products and their pricing</p>
        </div>
        <Button label="Add Product" onClick={() => setIsAddOpen(true)} />
      </div>

      {/* Add Product Modal */}
      <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedProduct(null);
          }}
          initialData={selectedProduct}
        />
      )}

      <div>
        <ReusableTable
          columns={productColumns}
          rows={products}
          loading={loading}
          onRefresh={handleRefresh}
          onRowClick={handleRowClick}
          isFilterable={false}
          searchableColumns={["srNo","name","price"]}
        />
      </div>
    </div>
  );
};

export default ProductConfiguration;
