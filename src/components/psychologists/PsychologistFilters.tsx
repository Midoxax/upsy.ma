import { FilterState } from "@/types/psychologist";
import { useSpecialties, useLanguages } from "@/hooks/usePsychologists";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { X, SlidersHorizontal } from "lucide-react";

interface PsychologistFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const PsychologistFilters = ({ filters, onFiltersChange }: PsychologistFiltersProps) => {
  const { data: specialties = [] } = useSpecialties();
  const { data: languages = [] } = useLanguages();

  const handleSpecialtyToggle = (specialtyId: string) => {
    const newSpecialties = filters.specialties.includes(specialtyId)
      ? filters.specialties.filter((id) => id !== specialtyId)
      : [...filters.specialties, specialtyId];
    onFiltersChange({ ...filters, specialties: newSpecialties });
  };

  const handleLanguageToggle = (languageId: string) => {
    const newLanguages = filters.languages.includes(languageId)
      ? filters.languages.filter((id) => id !== languageId)
      : [...filters.languages, languageId];
    onFiltersChange({ ...filters, languages: newLanguages });
  };

  const handleReset = () => {
    onFiltersChange({
      specialties: [],
      languages: [],
      city: "",
      online: false,
      inPerson: false,
      minPrice: 0,
      maxPrice: 2000,
    });
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-u-gold" />
          <h3 className="text-lg font-semibold text-u-white">Filters</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-u-gray-400 hover:text-u-white">
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <Label htmlFor="city" className="text-u-gray-200">City</Label>
        <Input
          id="city"
          placeholder="Search by city..."
          value={filters.city}
          onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
          aria-label="Filter psychologists by city"
        />
      </div>

      {/* Online/In-Person */}
      <div className="space-y-3" role="group" aria-label="Session type filters">
        <Label className="text-u-gray-200">Session Type</Label>
        <div className="flex items-center justify-between">
          <Label htmlFor="online" className="text-sm font-normal text-u-gray-300">Online Sessions</Label>
          <Switch
            id="online"
            checked={filters.online}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, online: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="inPerson" className="text-sm font-normal text-u-gray-300">In-Person Sessions</Label>
          <Switch
            id="inPerson"
            checked={filters.inPerson}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, inPerson: checked })}
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3" role="group" aria-label="Price range filter">
        <Label className="text-u-gray-200">Price Range (MAD/hour)</Label>
        <div className="px-2">
          <Slider
            min={0}
            max={2000}
            step={50}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) =>
              onFiltersChange({ ...filters, minPrice: min, maxPrice: max })
            }
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-u-gray-400">
          <span>{filters.minPrice} MAD</span>
          <span>{filters.maxPrice} MAD</span>
        </div>
      </div>

      {/* Specialties */}
      <div className="space-y-3" role="group" aria-label="Specialty filters">
        <Label className="text-u-gray-200">Specialties</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {specialties.map((specialty) => (
            <div key={specialty.id} className="flex items-center space-x-2">
              <Checkbox
                id={`specialty-${specialty.id}`}
                checked={filters.specialties.includes(specialty.id)}
                onCheckedChange={() => handleSpecialtyToggle(specialty.id)}
              />
              <label
                htmlFor={`specialty-${specialty.id}`}
                className="text-sm text-u-gray-300 cursor-pointer leading-none"
              >
                {specialty.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-3" role="group" aria-label="Language filters">
        <Label className="text-u-gray-200">Languages</Label>
        <div className="space-y-2">
          {languages.map((language) => (
            <div key={language.id} className="flex items-center space-x-2">
              <Checkbox
                id={`language-${language.id}`}
                checked={filters.languages.includes(language.id)}
                onCheckedChange={() => handleLanguageToggle(language.id)}
              />
              <label
                htmlFor={`language-${language.id}`}
                className="text-sm text-u-gray-300 cursor-pointer leading-none"
              >
                {language.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
