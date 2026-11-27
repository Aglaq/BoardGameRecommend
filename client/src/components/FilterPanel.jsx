import { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function FilterPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [time, setTime] = useState([0, 5]);
  const handleTimeChange = (event, newTime) => {
    setTime(newTime);
  };
  const [complexity, setComplexity] = useState([0, 2]);
  const handleComplexityChange = (event, newComplexity) => {
    setComplexity(newComplexity);
  };
  const [playersNumber, setPlayersNumber] = useState([1]);
  const handlePlayersNumberChange = (event, newPlayersNumber) => {
    setPlayersNumber(newPlayersNumber);
  };
  const timeText = (time) => `${time} mins`;
  const complexityText = (complexity) => `${complexity}`;
  const playersNumberText = (playersNumber) => `${playersNumber} players`;

  return (
    <div className="filter">
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Hide Filters" : "Show Filters"}
      </button>

      {isExpanded && (
        <div className="filter-controls">
          <Box sx={{ width: 300 }}>
            Time:
            <Slider
              getAriaLabel={() => "Time"}
              getAriaValueText={timeText}
              value={time}
              onChange={handleTimeChange}
              valueLabelDisplay="auto"
              min={30}
              max={300}
              step={30}
            />
          </Box>
          <Box sx={{ width: 300 }}>
            Difficulty:
            <Slider
              getAriaLabel={() => "Difficulty"}
              getAriaValueText={complexityText}
              value={complexity}
              onChange={handleComplexityChange}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.5}
            />
          </Box>
          <Box sx={{ width: 300 }}>
            Number of Players:
            <Slider
              getAriaLabel={() => "Number of players"}
              getAriaValueText={playersNumberText}
              value={playersNumber}
              onChange={handlePlayersNumberChange}
              min={1}
              max={10}
              step={1}
              valueLabelDisplay="auto"
            />
          </Box>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
