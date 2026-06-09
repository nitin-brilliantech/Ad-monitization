import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { FiFilter, FiRefreshCw } from "react-icons/fi";
import SearchBar from "../../components/ui/search-bar/SearchBar";
import Loader from "../../components/loader/Loader";
import COLORS from "../../constants/Colors";

const ReusableTable = ({
  columns,
  rows,
  sx = {},
  onRowClick,
  loading = false,
  onRefresh,
  filterOptions = ["all"],
  filterKey = "isApproved",
  isFilter = true,
  defaultOrder = "desc",
  defaultOrderBy = "updatedAt",
  order: controlledOrder,
  orderBy: controlledOrderBy,
  onOrderChange,
  searchableColumns = [], // dynamic search columns
}) => {
  const [internalOrder, setInternalOrder] = useState(defaultOrder);
  const [internalOrderBy, setInternalOrderBy] = useState(defaultOrderBy);
  const order = controlledOrder ?? internalOrder;
  const orderBy = controlledOrderBy ?? internalOrderBy;

  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter + Search + Sort
  const filteredAndSortedRows = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();
    let filtered = [...rows];

    // 🔹 Dynamic search based on searchableColumns
    if (searchQuery && searchableColumns.length > 0) {
      filtered = filtered.filter((row) =>
        searchableColumns.some((colId) => {
          const col = columns.find((c) => c.id === colId);
          if (!col) return false;
          const value = col.render ? col.render(row) : row[colId];
          return value != null && String(value).toLowerCase().includes(lowerSearch);
        })
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (row) =>
          String(row[filterKey] ?? "").toUpperCase() === filterStatus.toUpperCase()
      );
    }

    // Sorting
    const compare = (a, b) => {
      const valA = a[orderBy];
      const valB = b[orderBy];
      if (orderBy === "isActive") return valA === valB ? 0 : valA ? 1 : -1;
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (typeof valA === "number") return valA - valB;
      if (valA instanceof Date) return valA.getTime() - valB.getTime();
      return String(valA).localeCompare(String(valB));
    };

    return filtered.sort(order === "asc" ? compare : (a, b) => compare(b, a));
  }, [rows, columns, orderBy, order, searchQuery, filterStatus, filterKey, searchableColumns]);

  // Pagination
  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredAndSortedRows.slice(start, start + rowsPerPage);
  }, [filteredAndSortedRows, page, rowsPerPage]);

  const handleSort = (_, property) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    if (onOrderChange) onOrderChange(newOrder, property);
    else {
      setInternalOrder(newOrder);
      setInternalOrderBy(property);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(filteredAndSortedRows.map((row) => row.id));
    else setSelected([]);
  };

  const handleCheckboxClick = (e, row) => {
    e.stopPropagation();
    const isSelected = selected.includes(row.id);
    setSelected((prev) =>
      isSelected ? prev.filter((id) => id !== row.id) : [...prev, row.id]
    );
  };

  const handleRowClick = (row) => onRowClick?.(row);

  const formatLabel = (label) => label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* Search + Filter */}
      <div className="flex justify-between bg-white rounded-2xl items-center p-3 mb-4">
        <div className="flex w-1/3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search..."
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-4 text-gray-500 text-xl">
          {isFilter && (
            <div className="relative">
              <FiFilter
                className="cursor-pointer hover:text-black"
                onClick={() => setShowFilterDropdown((prev) => !prev)}
              />
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow z-10 text-sm">
                  {filterOptions.map((status) => (
                    <div
                      key={status}
                      onClick={() => { setFilterStatus(status); setShowFilterDropdown(false); }}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${filterStatus === status ? "bg-gray-200 font-semibold" : ""}`}
                    >
                      {formatLabel(status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <FiRefreshCw className="cursor-pointer hover:text-black" onClick={onRefresh} />
        </div>
      </div>

      {/* Table */}
      <Box sx={{ width: "100%", borderRadius: 2, ...sx.container }}>
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHead sx={{ backgroundColor: COLORS.softBackground }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.length > 0 && selected.length === filteredAndSortedRows.length}
                      indeterminate={selected.length > 0 && selected.length < filteredAndSortedRows.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.numeric ? "center" : "left"} sx={{ fontWeight: 600, color: COLORS.blueGray }}>
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={(e) => handleSort(e, col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow sx={{ backgroundColor: "white" }}>
                    <TableCell colSpan={columns.length + 1} align="center">
                      <Loader size="small" />
                    </TableCell>
                  </TableRow>
                ) : paginatedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center" sx={{ backgroundColor: "white" }}>
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRows.map((row, index) => {
                    const isSelected = selected.includes(row.id);
                    return (
                      <TableRow
                        key={row.id}
                        hover
                        selected={isSelected}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: isSelected ? "#F2F5F9 !important" : "white",
                          "&:hover": { backgroundColor: "#F2F5F9 !important" },
                        }}
                        onClick={() => handleRowClick(row)}
                      >
                        <TableCell padding="checkbox" onClick={(e) => handleCheckboxClick(e, row)}>
                          <Checkbox checked={isSelected} />
                        </TableCell>
                        {columns.map((col) => (
                          <TableCell key={col.id} align={col.numeric ? "center" : "left"}>
                            {col.render ? (col.needsIndex ? col.render(row, index) : col.render(row)) : row[col.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", p: 1, backgroundColor: COLORS.softBackground }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAndSortedRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReusableTable;