
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

// Graphics quality presets
export const graphicsPresets = [
  { id: "low", name: "Low" },
  { id: "medium", name: "Medium" },
  { id: "high", name: "High" },
  { id: "ultra", name: "Ultra" },
  { id: "custom", name: "Custom" },
];

interface GraphicsTabProps {
  settings: any;
  updateSettings: (path: string, value: any) => void;
}

const GraphicsTab: React.FC<GraphicsTabProps> = ({ settings, updateSettings }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold border-b border-game-secondary pb-2 mb-4">Graphics Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Quality Preset</label>
            <Select 
              value={settings.graphics.preset} 
              onValueChange={(value) => updateSettings('graphics.preset', value)}
            >
              <SelectTrigger className="game-select w-full">
                <SelectValue placeholder="Select quality preset" />
              </SelectTrigger>
              <SelectContent>
                {graphicsPresets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="shadows" className="cursor-pointer">Shadows</Label>
                <Switch 
                  id="shadows" 
                  checked={settings.graphics.shadows}
                  onCheckedChange={(checked) => updateSettings('graphics.shadows', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="antialiasing" className="cursor-pointer">Anti-aliasing</Label>
                <Switch 
                  id="antialiasing" 
                  checked={settings.graphics.antialiasing}
                  onCheckedChange={(checked) => updateSettings('graphics.antialiasing', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="reflections" className="cursor-pointer">Reflections</Label>
                <Switch 
                  id="reflections" 
                  checked={settings.graphics.reflections}
                  onCheckedChange={(checked) => updateSettings('graphics.reflections', checked)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Texture Quality</label>
                <Select 
                  value={settings.graphics.textureQuality} 
                  onValueChange={(value) => updateSettings('graphics.textureQuality', value)}
                >
                  <SelectTrigger className="game-select w-full">
                    <SelectValue placeholder="Select texture quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block mb-2">Effects Quality</label>
                <Select 
                  value={settings.graphics.effectsQuality} 
                  onValueChange={(value) => updateSettings('graphics.effectsQuality', value)}
                >
                  <SelectTrigger className="game-select w-full">
                    <SelectValue placeholder="Select effects quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label>Particles: {settings.graphics.particles}%</label>
            </div>
            <Slider 
              value={[settings.graphics.particles]} 
              min={0} 
              max={100} 
              step={5} 
              onValueChange={(values) => updateSettings('graphics.particles', values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label>View Distance: {settings.graphics.viewDistance}%</label>
            </div>
            <Slider 
              value={[settings.graphics.viewDistance]} 
              min={20} 
              max={100} 
              step={5} 
              onValueChange={(values) => updateSettings('graphics.viewDistance', values[0])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphicsTab;
