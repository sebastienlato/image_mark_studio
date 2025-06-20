
import { WatermarkSettings } from '@/pages/Index';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface WatermarkControlsProps {
  settings: WatermarkSettings;
  onSettingsChange: (settings: WatermarkSettings) => void;
}

export const WatermarkControls = ({ settings, onSettingsChange }: WatermarkControlsProps) => {
  const updateSetting = (key: keyof WatermarkSettings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <Card className="p-6 bg-gray-800 shadow-xl border border-gray-700">
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Watermark Settings</h2>
      
      <div className="space-y-6">
        {/* Opacity Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-gray-200">Opacity</Label>
            <span className="text-sm text-gray-400 font-mono">
              {Math.round(settings.opacity * 100)}%
            </span>
          </div>
          <Slider
            value={[settings.opacity]}
            onValueChange={([value]) => updateSetting('opacity', value)}
            max={1}
            min={0}
            step={0.01}
            className="w-full"
          />
        </div>

        {/* Scale Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-gray-200">Size</Label>
            <span className="text-sm text-gray-400 font-mono">
              {Math.round(settings.scale * 100)}%
            </span>
          </div>
          <Slider
            value={[settings.scale]}
            onValueChange={([value]) => updateSetting('scale', value)}
            max={1}
            min={0.05}
            step={0.01}
            className="w-full"
          />
        </div>

        {/* Rotation Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-gray-200">Rotation</Label>
            <span className="text-sm text-gray-400 font-mono">
              {Math.round(settings.rotation)}°
            </span>
          </div>
          <Slider
            value={[settings.rotation]}
            onValueChange={([value]) => updateSetting('rotation', value)}
            max={360}
            min={-360}
            step={1}
            className="w-full"
          />
        </div>

        {/* Position Controls */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-200">Position</Label>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-300">Horizontal</span>
              <span className="text-xs text-gray-400 font-mono">
                {Math.round(settings.position.x * 100)}%
              </span>
            </div>
            <Slider
              value={[settings.position.x]}
              onValueChange={([value]) => onSettingsChange({
                ...settings,
                position: { ...settings.position, x: value }
              })}
              max={1}
              min={0}
              step={0.01}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-300">Vertical</span>
              <span className="text-xs text-gray-400 font-mono">
                {Math.round(settings.position.y * 100)}%
              </span>
            </div>
            <Slider
              value={[settings.position.y]}
              onValueChange={([value]) => onSettingsChange({
                ...settings,
                position: { ...settings.position, y: value }
              })}
              max={1}
              min={0}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>

        {/* Quick Position Presets */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-200">Quick Positions</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'TL', pos: { x: 0.05, y: 0.05 } },
              { label: 'TC', pos: { x: 0.5, y: 0.05 } },
              { label: 'TR', pos: { x: 0.95, y: 0.05 } },
              { label: 'ML', pos: { x: 0.05, y: 0.5 } },
              { label: 'MC', pos: { x: 0.5, y: 0.5 } },
              { label: 'MR', pos: { x: 0.95, y: 0.5 } },
              { label: 'BL', pos: { x: 0.05, y: 0.95 } },
              { label: 'BC', pos: { x: 0.5, y: 0.95 } },
              { label: 'BR', pos: { x: 0.95, y: 0.95 } },
            ].map(({ label, pos }) => (
              <button
                key={label}
                onClick={() => onSettingsChange({ ...settings, position: pos })}
                className="p-2 text-xs border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 font-medium text-gray-300"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
