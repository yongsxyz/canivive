
import React from "react";
import { Progress } from "@/components/ui/progress";

interface PerformanceTabProps {
  resetSettings: () => void;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ resetSettings }) => {
  return (
    <div className="space-y-6">
      <h3 className="font-bold border-b border-game-secondary pb-2 mb-4">Performance Optimizations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 border border-game-secondary rounded-md bg-game-dark bg-opacity-50">
            <h4 className="font-bold mb-2">Performance Metrics</h4>
            <p className="text-sm text-game-light mb-2">
              Performance metrics would normally be calculated based on system capabilities
              and current settings. For this demo, we're showing placeholder values.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>34%</span>
              </div>
              <Progress value={34} className="h-2 bg-gray-700" />
              
              <div className="flex justify-between text-sm">
                <span>GPU Usage</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2 bg-gray-700" />
              
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>42%</span>
              </div>
              <Progress value={42} className="h-2 bg-gray-700" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-between space-y-4">
          <div className="p-4 border border-game-secondary rounded-md bg-game-dark bg-opacity-50">
            <h4 className="font-bold mb-2">Optimization Tips</h4>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>Lower particle effects for better performance</li>
              <li>Reduce view distance in crowded areas</li>
              <li>Disable reflections for a significant FPS boost</li>
              <li>Texture quality has the biggest impact on memory usage</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PerformanceTab;
