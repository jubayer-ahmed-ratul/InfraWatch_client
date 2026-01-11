import React from 'react';
import useTheme from '../../hooks/useTheme';

const DarkModeDemo = () => {
  const { isDarkMode, theme } = useTheme();

  return (
    <div className="card bg-base-100 shadow-xl p-6 m-4">
      <h2 className="card-title text-2xl mb-4">Dark Mode Demo</h2>
      
      <div className="space-y-4">
        <div className="alert alert-info">
          <span>Current theme: <strong>{theme}</strong></span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-200 p-4">
            <h3 className="font-bold text-lg">Card Example</h3>
            <p className="text-base-content/70">This card adapts to the current theme automatically.</p>
          </div>
          
          <div className="card bg-primary text-primary-content p-4">
            <h3 className="font-bold text-lg">Primary Card</h3>
            <p>Green accent colors remain consistent across themes.</p>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-accent">Accent Button</button>
          <button className="btn btn-ghost">Ghost Button</button>
        </div>
        
        <div className="mockup-code">
          <pre data-prefix="$"><code>Theme status: {isDarkMode ? 'Dark mode active' : 'Light mode active'}</code></pre>
          <pre data-prefix=">" className="text-warning"><code>Toggle using the sun/moon icon in the navbar!</code></pre>
        </div>
      </div>
    </div>
  );
};

export default DarkModeDemo;