import logo from "../assets/react.svg";
import FilterPanel from "../components/FilterPanel.jsx";
import Filtered from "../components/Filtered";

const Home = () => (
  <>
    <h1>Home Page</h1>
    <div className="img-container">
      <img src={logo} alt="Scorpion Logo" width={200} height={200} />
    </div>
    <form>
      <input type="text" placeholder="Provide name or choose filters"></input>
      <button>Search</button>
    </form>
    <FilterPanel />
    <Filtered />
  </>
);

export default Home;
