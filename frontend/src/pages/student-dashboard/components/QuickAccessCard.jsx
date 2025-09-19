import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickAccessCard = ({ title, description, icon, route, badge, color = 'primary' }) => {
  const navigate = useNavigate();

  const getColorClasses = (colorName) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary/10',
        text: 'text-primary',
        hover: 'hover:bg-primary/20'
      },
      secondary: {
        bg: 'bg-secondary/10',
        text: 'text-secondary',
        hover: 'hover:bg-secondary/20'
      },
      success: {
        bg: 'bg-success/10',
        text: 'text-success',
        hover: 'hover:bg-success/20'
      },
      warning: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        hover: 'hover:bg-warning/20'
      },
      error: {
        bg: 'bg-error/10',
        text: 'text-error',
        hover: 'hover:bg-error/20'
      }
    };
    return colorMap?.[colorName] || colorMap?.primary;
  };

  const colorClasses = getColorClasses(color);

  const handleClick = () => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`bg-card border border-border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${colorClasses?.hover} group`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 ${colorClasses?.bg} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <Icon name={icon} size={24} className={colorClasses?.text} />
        </div>
        
        {badge && (
          <div className="bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded-full">
            {badge}
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-foreground text-base mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-4 flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
        <span>Access now</span>
        <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default QuickAccessCard;