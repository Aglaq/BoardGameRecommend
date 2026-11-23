import logo from "../assets/react.svg";
import FilterPanel from "../components/FilterPanel.jsx";

const Home = () => (
  <>
    <h1>Home Page</h1>
    <div className="img-container">
      <img src={logo} alt="Scorpion Logo" width={200} height={200} />
    </div>
    <form>
      <input type="text"></input>
    </form>
    <FilterPanel />
  </>
);

export default Home;
