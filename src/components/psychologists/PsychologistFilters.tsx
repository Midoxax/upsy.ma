import { FilterState } from "@/types/psychologist";
import { useSpecialties, useLanguages } from "@/hooks/usePsychologists";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
    <div className="bg-surface rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="Search by city..."
          value={filters.city}
          onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
          className="bg-background"
        />
      </div>

      {/* Online/In-Person Filters */}
      <div className="space-y-3">
        <Label>Session Type</Label>
        <div className="flex items-center justify-between">
          <Label htmlFor="online" className="text-sm font-normal">
            Online Sessions
          </Label>
          <Switch
            id="online"
            checked={filters.online}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, online: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="inPerson" className="text-sm font-normal">
            In-Person Sessions
          </Label>
          <Switch
            id="inPerson"
            checked={filters.inPerson}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, inPerson: checked })}
          />
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <Label>Price Range (MAD/hour)</Label>
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
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filters.minPrice} MAD</span>
          <span>{filters.maxPrice} MAD</span>
        </div>
      </div>

      {/* Specialties Filter */}
      <div className="space-y-3">
        <Label>Specialties</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {specialties.map((specialty) => (
            <div key={specialty.id} className="flex items-center space-x-2">
              <Checkbox
                id={`specialty-${specialty.id}`}
                checked={filters.specialties.includes(specialty.id)}
                onCheckedChange={() => handleSpecialtyToggle(specialty.id)}
              />
              <label
                htmlFor={`specialty-${specialty.id}`}
                className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {specialty.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Languages Filter */}
      <div className="space-y-3">
        <Label>Languages</Label>
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
                className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
