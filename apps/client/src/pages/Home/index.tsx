import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>HomePage</h1>
      <Link to="/items">Items</Link>
    </div>
  );
};

export default HomePage;
