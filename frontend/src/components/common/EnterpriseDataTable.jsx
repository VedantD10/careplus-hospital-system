import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  CheckSquare,
  Square,
  MoreVertical,
  Maximize2
} from 'lucide-react';

export const EnterpriseDataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  title = 'Data Table',
  subtitle = '',
  bulkActions = [],
  onRowClick,
  renderExpandedRow,
  exportFileName = 'careplus_export.csv'
}) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase();
    return data.filter(row => {
      return Object.values(row).some(val =>
        val && String(val).toLowerCase().includes(query)
      );
    });
  }, [data, search]);

  // Sort Logic
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortAsc]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Handle Selection
  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selectedIds.includes(row[keyField]));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = paginatedData.map(r => r[keyField]);
      setSelectedIds(selectedIds.filter(id => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedData.map(r => r[keyField]);
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleExpandRow = (id) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(i => i !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (sortedData.length === 0) return;
    const headers = columns.map(c => c.label).join(',');
    const rows = sortedData.map(row =>
      columns.map(c => {
        let val = row[c.key];
        if (typeof val === 'string') val = `"${val.replace(/"/g, '""')}"`;
        return val ?? '';
      }).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-0">
      {/* Top Header & Search Bar */}
      <div className="p-4 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search table records..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="saas-input pl-9 py-1.5 text-xs"
            />
          </div>

          {/* Export CSV Button */}
          <button onClick={handleExportCSV} className="saas-btn-secondary py-1.5 text-xs">
            <Download className="w-3.5 h-3.5 text-slate-600" /> Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-teal-50 px-4 py-2 border-b border-teal-200 text-xs flex items-center justify-between">
          <span className="font-bold text-teal-800">
            {selectedIds.length} row(s) selected
          </span>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.onClick(selectedIds)}
                className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-3 py-1 rounded text-xs transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full saas-table">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="rounded text-teal-700 focus:ring-teal-600 cursor-pointer"
                />
              </th>
              {renderExpandedRow && <th className="w-8"></th>}
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`cursor-pointer select-none hover:bg-slate-100/80 transition-colors ${col.className || ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {sortField === col.key && (
                      sortAsc ? <ChevronUp className="w-3.5 h-3.5 text-teal-700" /> : <ChevronDown className="w-3.5 h-3.5 text-teal-700" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderExpandedRow ? 2 : 1)} className="text-center text-slate-400 py-8 text-xs font-medium">
                  No records match your criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map(row => {
                const id = row[keyField];
                const isSelected = selectedIds.includes(id);
                const isExpanded = expandedIds.includes(id);

                return (
                  <React.Fragment key={id}>
                    <tr
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-teal-50/40' : ''}`}
                      onClick={() => onRowClick?.(row)}
                    >
                      <td className="w-10 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(id)}
                          className="rounded text-teal-700 focus:ring-teal-600 cursor-pointer"
                        />
                      </td>
                      {renderExpandedRow && (
                        <td className="w-8 text-center cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleExpandRow(id); }}>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-teal-700" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </td>
                      )}
                      {columns.map(col => (
                        <td key={col.key} className={col.className || ''}>
                          {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                        </td>
                      ))}
                    </tr>
                    {renderExpandedRow && isExpanded && (
                      <tr className="bg-slate-50/90 border-b border-slate-200">
                        <td colSpan={columns.length + 2} className="p-4">
                          {renderExpandedRow(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-50/90 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="saas-input py-1 px-2 text-xs w-20"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-slate-400 font-mono">
            Showing {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 font-semibold text-slate-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
