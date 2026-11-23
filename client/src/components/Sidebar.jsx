const Sidebar = ({ isLoggedIn }) => {
  return (
    <div className="sidebar">
      <h3>Tools:</h3>
      <ul>
        <li>Feeling lucky - random game</li>
        <li>Map of nearby board game places</li>
        <li>{isLoggedIn === true && <>Map of nearby board game places</>}</li>
      </ul>
    </div>
  );
};

export default Sidebar;
