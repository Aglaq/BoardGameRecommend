import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/react.svg";
import { URL } from "../config";

const Filtered = () => {
  const [list, setList] = useState([]);
  console.log(list);

  useEffect(() => {
    async function findHotList() {
      try {
        const response = await axios.get(`${URL}/games/hot`);
        setList(response.data.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    findHotList();
  }, []);

  return (
    <>
      <section className="filtered">
        {/* need to change every time to TOP, FILTERED etc*/}
        <h2>Hot Games</h2>
        <div className="miniatures-container">
          {list.map((item) => (
            <div className="miniature" key={item.id}>
              <img src={item.miniature}></img>
              <h3>
                {item.title}, {item.year}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Filtered;
