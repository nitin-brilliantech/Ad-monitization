import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../../components/ui/button/Button";
import ReusableTable from "../../../../components/table/ReusableTable";

import {
  fetchTier,
  createTier,
  updateTier,
} from "../../../../redux/slices/admin/tierSlice";
import { getTierColumns } from "../Columns";

import AddTierModal from "./AddTierModal";
import EditTierModal from "./EditTierModal";

const LocationConfiguration = () => {
  const dispatch = useDispatch();
  const { tiers, loading, formLoading, fetched } = useSelector(
    (state) => state.tier
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!fetched && !loading) {
      dispatch(fetchTier());
    }
  }, [fetched, loading, formLoading, dispatch]);

  // Add Tier submit
  const onAddSubmit = (formData) => {
    const payload = {
      name: formData.name,
      price: Number(formData.price),
    };

    dispatch(createTier(payload)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        reset();
        setIsAddOpen(false);
      }
    });
  };

  // Edit Tier submit
  const onEditSubmit = (formData) => {
    if (!selectedTier) return;

    const payload = {
      name: formData.name,
      price: Number(formData.price),
    };

    dispatch(updateTier({ id: selectedTier.id, data: payload })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        reset();
        setSelectedTier(null);
        setIsEditOpen(false);
      }
    });
  };

  const handleRefresh = () => {
    dispatch(fetchTier());
  };

  // Row click opens edit modal
  const handleRowClick = (tier) => {
    setSelectedTier(tier);
    setIsEditOpen(true);
  };

  const tierColumns = getTierColumns();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Location Configuration</h2>
        <Button label="Add Tier" onClick={() => setIsAddOpen(true)} />
      </div>

      {/* Add Tier Modal */}
      <AddTierModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleSubmit(onAddSubmit)}
        register={register}
        loading={formLoading}
      />

      {/* Edit Tier Modal */}
      {selectedTier && (
        <EditTierModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedTier(null);
          }}
          onSubmit={handleSubmit(onEditSubmit)}
          loading={formLoading}
          initialData={selectedTier}
        />
      )}

      <div className="mt-4">
        <ReusableTable
          columns={tierColumns}
          rows={tiers}
          loading={loading}
          onRefresh={handleRefresh}
          isFilter={false}
          onRowClick={handleRowClick}
          searchableColumns={["srNo","name","price"]}
        />
      </div>
    </div>
  );
};

export default LocationConfiguration;
