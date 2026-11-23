import logo from "../assets/react.svg";

const Filtered = () => {
  return (
    <>
      <section className="filtered">
        {/* need to change every time to TOP, FILTERED etc*/}
        <h2>Top Games</h2>

        <div>
          <img className="filtered-picture" src={logo} alt=" " />
          <img className="filtered-picture" src={logo} alt=" " />
          <img className="filtered-picture" src={logo} alt=" " />
          <img className="filtered-picture" src={logo} alt=" " />
          <img className="filtered-picture" src={logo} alt=" " />
          <img className="filtered-picture" src={logo} alt=" " />
          <img className="filtered-picture" src={logo} alt=" " />
          <img className="filtered-picture" src={logo} alt=" " />
          <img className="filtered-picture" src={logo} alt=" " />
        </div>
      </section>
    </>
  );
};

export default Filtered;
