import { Heading } from "./components/Heading";
import SearchBar from "./components/SearchBar";
import WeatherDisplay from "./components/WeatherDisplay";
// import { store } from "./store/store";
// import { Appbar } from "./components/Appbar";


export default function Home() {
  return (
    <div className="min-h-screen bg-blue-300">
      <div className="pt-20">
        <div className="flex justify-center">
          <Heading />
        </div>

        <SearchBar />
        <WeatherDisplay />
      </div>
    </div>
  );
}
