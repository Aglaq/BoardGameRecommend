import { useState } from "react";

function FilterPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="filter">
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Hide Filters" : "Show Filters"}
      </button>

      {isExpanded && (
        <div className="filter-controls">
          <input type="text" placeholder="Number of players" />
          <input type="text" placeholder="Category" />
          <input type="text" placeholder="Time" />
          <input type="text" placeholder="Complexity" />
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
