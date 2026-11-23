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
          <form
            // onSubmit={handleSubmit}
            // onChange={handleChange}
            className="filter_params"
          >
            <label>
              Number of players:
              <input type="number" placeholder="Number of players" />
            </label>
            <label>
              Category:
              <select id="options" name="options">
                <option value=" "> </option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </label>
            <label>
              Time:
              <input placeholder="Time" />
            </label>
            <label>
              Complexity:
              <input placeholder="Complexity" />
            </label>
          </form>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
