import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  isOpen,
  onToggle 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
    { value: 'vlsi-design', label: 'VLSI Design' },
    { value: 'renewable-energy', label: 'Renewable Energy' },
    { value: 'embedded-systems', label: 'Embedded Systems' },
    { value: 'digital-signal-processing', label: 'Digital Signal Processing' },
    { value: 'power-electronics', label: 'Power Electronics' }
  ];

  const educatorOptions = [
    { value: 'all', label: 'All Educators' },
    { value: 'dr-rajesh-kumar', label: 'Dr. Rajesh Kumar' },
    { value: 'prof-anita-sharma', label: 'Prof. Anita Sharma' },
    { value: 'dr-vikram-singh', label: 'Dr. Vikram Singh' },
    { value: 'prof-meera-patel', label: 'Prof. Meera Patel' },
    { value: 'dr-suresh-reddy', label: 'Dr. Suresh Reddy' }
  ];

  const fileSizeOptions = [
    { value: 'all', label: 'Any Size' },
    { value: 'small', label: 'Small (< 50MB)' },
    { value: 'medium', label: 'Medium (50-200MB)' },
    { value: 'large', label: 'Large (> 200MB)' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'duration', label: 'Duration' },
    { value: 'size', label: 'File Size' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      search: '',
      subject: 'all',
      educator: 'all',
      fileSize: 'all',
      dateRange: { start: '', end: '' },
      sortBy: 'newest',
      showDownloadedOnly: false,
      showBookmarkedOnly: false
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClearFilters();
  };

  return (
    <div className={`bg-card border border-border rounded-lg transition-all duration-200 ${
      isOpen ? 'block' : 'hidden lg:block'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Icon name="Filter" size={16} />
          Filters
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs"
          >
            Clear All
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="lg:hidden h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>
      {/* Filter Content */}
      <div className="p-4 space-y-4">
        {/* Search */}
        <div>
          <Input
            type="search"
            placeholder="Search content..."
            value={localFilters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Subject Filter */}
        <div>
          <Select
            label="Subject"
            options={subjectOptions}
            value={localFilters?.subject}
            onChange={(value) => handleFilterChange('subject', value)}
          />
        </div>

        {/* Educator Filter */}
        <div>
          <Select
            label="Educator"
            options={educatorOptions}
            value={localFilters?.educator}
            onChange={(value) => handleFilterChange('educator', value)}
          />
        </div>

        {/* File Size Filter */}
        <div>
          <Select
            label="File Size"
            options={fileSizeOptions}
            value={localFilters?.fileSize}
            onChange={(value) => handleFilterChange('fileSize', value)}
          />
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="Start date"
              value={localFilters?.dateRange?.start}
              onChange={(e) => handleFilterChange('dateRange', {
                ...localFilters?.dateRange,
                start: e?.target?.value
              })}
            />
            <Input
              type="date"
              placeholder="End date"
              value={localFilters?.dateRange?.end}
              onChange={(e) => handleFilterChange('dateRange', {
                ...localFilters?.dateRange,
                end: e?.target?.value
              })}
            />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <Select
            label="Sort By"
            options={sortOptions}
            value={localFilters?.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
          />
        </div>

        {/* Quick Filters */}
        <div className="space-y-3 pt-2 border-t border-border">
          <h4 className="text-sm font-medium text-foreground">Quick Filters</h4>
          
          <Checkbox
            label="Downloaded Only"
            checked={localFilters?.showDownloadedOnly}
            onChange={(e) => handleFilterChange('showDownloadedOnly', e?.target?.checked)}
          />
          
          <Checkbox
            label="Bookmarked Only"
            checked={localFilters?.showBookmarkedOnly}
            onChange={(e) => handleFilterChange('showBookmarkedOnly', e?.target?.checked)}
          />
        </div>

        {/* Bandwidth Optimization */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Wifi" size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Bandwidth Tips</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Filter by small file sizes for faster downloads on slow connections. 
            Use audio-only previews to save data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;